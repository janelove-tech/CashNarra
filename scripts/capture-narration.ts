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
  completedOutputText,
} from "../src/server/ai";
import {
  EvaluationBudget,
  MODEL,
  MAX_OUTPUT,
  CEILING,
} from "./lib/evaluation-budget";
import { classifyProviderFailure } from "./lib/provider-outcome";
import { writeProviderPause } from "./lib/provider-pause";
import { LUNA_RATE, envelopeReserveMicros } from "./lib/provider-rates";

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
        ceilingUSD: "10.00",
        reservationMicros: envelopeReserveMicros(),
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
  const comparing = args[0] === "--compare-luna";
  const allowed = comparing ? ["gpt-6-luna", MODEL] : [MODEL];
  if (process.env.OPENAI_MODEL && !allowed.includes(process.env.OPENAI_MODEL))
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
      // Luna comparisons reserve the short-context envelope. The older model
      // still reserves its historical full-context hold.
      if (comparing) request.model = "gpt-6-luna";
      if (
        request.model !== (comparing ? "gpt-6-luna" : MODEL) ||
        request.service_tier !== "default" ||
        request.max_output_tokens !== MAX_OUTPUT ||
        request.store !== false ||
        Buffer.byteLength(JSON.stringify(request)) > 100_000
      )
        throw new Error("Request exceeds evaluated bounds.");
      const hash = createHash("sha256")
        .update(JSON.stringify(request))
        .digest("hex");
      const id = comparing
        ? await budget.reserveBounded(
            c.id,
            hash,
            envelopeReserveMicros(),
            LUNA_RATE,
          )
        : await budget.reserve(c.id, hash);
      const started = Date.now();
      let response;
      try {
        response = await client.responses.create(request);
      } catch (error) {
        const failure = classifyProviderFailure(error);
        if (failure.kind === "release") {
          await budget.release(id, failure.reason);
          if (failure.pause)
            await writeProviderPause(
              directory,
              failure.reason === "auth_rejected"
                ? "auth_rejected"
                : "billing_rejected",
            );
        }
        throw error;
      }
      if (!response.usage)
        throw new Error("Missing usage; reservation retained.");
      if (comparing) {
        if (response.model !== "gpt-6-luna") {
          await budget.raiseUnpriced(id);
          await writeProviderPause(directory, "model_mismatch");
          throw new Error("Unexpected evaluation model; reservation retained.");
        }
        try {
          await budget.settleLuna(id, {
            input: response.usage.input_tokens,
            output: response.usage.output_tokens,
            cached: response.usage.input_tokens_details.cached_tokens,
            cacheWrite: response.usage.input_tokens_details.cache_write_tokens,
            reasoning: response.usage.output_tokens_details.reasoning_tokens,
          });
        } catch {
          await budget.raiseUnpriced(id);
          await writeProviderPause(directory, "unpriced");
          throw new Error("Unpriced evaluation usage; reservation retained.");
        }
      } else {
        await budget.settle(
          id,
          response.usage.input_tokens,
          response.usage.output_tokens,
        );
      }
      let raw = null;
      let validated = null;
      try {
        raw = extractionSchema.parse(JSON.parse(completedOutputText(response)));
        if (raw.events.length > 100) throw new Error("Too many proposals.");
        validated = validateExtraction(assignProposalIds(raw), workspace);
      } catch {
        validated = null;
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
