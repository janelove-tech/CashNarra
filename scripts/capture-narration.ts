// Opt-in synthetic evaluation only. Never imported by the application.
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";
import OpenAI from "openai";
import { z } from "zod";
import { evaluationError } from "./lib/evaluation-error";
import { fixture } from "../src/domain/fixture";
import {
  extractionRequest,
  extractionSchema,
  assignProposalIds,
  validateExtraction,
} from "../src/server/ai";
import {
  EvaluationBudget,
  MODEL,
  MAX_OUTPUT,
  CEILING,
  RESERVATION,
} from "./lib/evaluation-budget";

async function main() {
  const args = process.argv.slice(2);
  if (
    args.length > 1 ||
    (args[0] && !["--live", "--compare-luna", "--initialise-budget"].includes(args[0]))
  )
    throw new Error("Invalid evaluation option.");
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
  const directory = resolve(".local/evaluation");
  const corpus = z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]{1,80}$/),
        text: z.string().max(12000),
        mode: z.literal("correction").optional(),
      }),
    )
    .min(1)
    .max(100)
    .parse(
      JSON.parse(
        await readFile("harness/context/02-narration-corpus.json", "utf8"),
      ),
    );
  if (new Set(corpus.map((c) => c.id)).size !== corpus.length)
    throw new Error("Duplicate corpus IDs.");
  if (!args.length) {
    console.log(
      JSON.stringify({
        evaluation: "NOT RUN",
        cases: corpus.length,
        keyPresent: !!process.env.OPENAI_API_KEY,
        ceilingUSD: "5.00",
        reservationMicros: RESERVATION,
        instruction:
          "Initialise the approved cumulative budget once, then use --live. No calls in this mode.",
      }),
    );
    return;
  }
  if (args[0] === "--initialise-budget") {
    const budget = await EvaluationBudget.acquire(directory, true);
    await budget.close();
    console.log(
      "Created cumulative US$10 evaluation budget. No provider calls.",
    );
    return;
  }
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing local API key.");
  if (process.env.OPENAI_MODEL && process.env.OPENAI_MODEL !== MODEL)
    throw new Error(
      "Model pricing must be reviewed before changing evaluation model.",
    );
  const budget = await EvaluationBudget.acquire(directory);
  try {
    const run = join(directory, "runs", crypto.randomUUID());
    await mkdir(run, { recursive: true });
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.openai.com/v1",
      timeout: 30000,
      maxRetries: 0,
    });
    const workspace = fixture();
    const originals = workspace.records
      .filter((r) => r.kind === "expense" && !r.removed)
      .slice(0, 1)
      .map((r) => r.id);
    const results: { id: string; output: unknown }[] = [];
    for (const c of corpus) {
      const request = extractionRequest(
        c.text,
        workspace,
        "2026-10-13",
        c.mode ?? "extract",
        c.mode ? originals : [],
      );
      // Evaluation only; production configuration remains unchanged. Existing
      // journal rates conservatively exceed Luna standard long-context rates.
      if (args[0] === "--compare-luna") request.model = "gpt-6-luna";
      if (
        request.model !== (args[0] === "--compare-luna" ? "gpt-6-luna" : MODEL) ||
        request.service_tier !== "default" ||
        request.max_output_tokens !== MAX_OUTPUT ||
        request.store !== false ||
        Buffer.byteLength(JSON.stringify(request)) > 100_000
      )
        throw new Error("Request exceeds evaluated bounds.");
      const hash = createHash("sha256")
        .update(JSON.stringify(request))
        .digest("hex");
      const id = await budget.reserve(c.id, hash);
      const started = Date.now();
      // Any timeout, parse, provider or persistence failure stops the run.
      // Unknown usage remains reserved; there is no automatic retry/refund.
      const response = await client.responses.parse(request);
      const raw = extractionSchema.parse(response.output_parsed);
      let validated = null;
      try {
        if (raw.events.length > 100) throw new Error("Too many proposals.");
        validated = validateExtraction(assignProposalIds(raw), workspace);
      } catch {
        /* Preserve invalid output as evidence, not a successful proposal. */
      }
      await writeFile(
        join(run, `${c.id}.json`),
        JSON.stringify(
          {
            id: c.id,
            requestHash: hash,
            request,
            model: response.model,
            responseId: response.id,
            capturedAt: new Date().toISOString(),
            latencyMs: Date.now() - started,
            usage: response.usage,
            output: raw,
            validated,
            validationRejected: validated === null,
          },
          null,
          2,
        ),
        { flag: "wx", mode: 0o600 },
      );
      results.push({ id: c.id, output: raw });
      await writeFile(
        join(run, "outputs.json"),
        JSON.stringify(results, null, 2),
        { mode: 0o600 },
      );
      if (!response.usage)
        throw new Error("Missing usage; reservation retained.");
      await budget.settle(
        id,
        response.usage.input_tokens,
        response.usage.output_tokens,
      );
      console.log(
        JSON.stringify({
          caseId: c.id,
          captured: true,
          committedMicros: (await budget.state()).committed,
          ceilingMicros: CEILING,
        }),
      );
    }
    console.log(
      `Captured synthetic outputs privately: ${join(run, "outputs.json")}. Run eval:narration separately; capture is not a quality PASS.`,
    );
  } finally {
    await budget.close();
  }
}
main().catch((error: unknown) => {
  console.error(JSON.stringify(evaluationError(error)));
  // Provider errors may contain request text/credentials. Keep console generic.
  console.error(
    "Evaluation stopped. Check local key, budget journal/lock, approved model and private capture files. No automatic retry; uncertain calls remain reserved.",
  );
  process.exitCode = 1;
});
