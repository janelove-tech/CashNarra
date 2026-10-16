// Offline scoring only. Supply reviewed captured outputs; this script never calls a provider.
import { readFile } from "node:fs/promises";
import { fixture } from "../src/domain/fixture";
import { extractionSchema, validateExtraction } from "../src/server/ai";
const corpus = JSON.parse(
  await readFile("harness/context/02-narration-corpus.json", "utf8"),
) as {
  id: string;
  kinds?: string[];
  amounts?: string[];
  questions?: string[];
}[];
const path = process.argv[2];
if (!path) {
  console.log(
    JSON.stringify(
      {
        cases: corpus.length,
        evaluation: "NOT RUN",
        provider: "EXTERNAL",
        instruction:
          "Supply a JSON array of {id, output} captured results. No provider calls are made by this script.",
      },
      null,
      2,
    ),
  );
} else {
  const results = JSON.parse(await readFile(path, "utf8")) as {
    id: string;
    output: unknown;
  }[];
  if (
    !Array.isArray(results) ||
    new Set(results.map((r) => r.id)).size !== results.length ||
    results.some((r) => !corpus.some((c) => c.id === r.id))
  )
    throw new Error("Unknown or repeated case IDs.");
  let kindMatches = 0,
    clarificationMatches = 0,
    silentGuesses = 0,
    invalidOutputs = 0,
    missing = 0;
  for (const c of corpus) {
    const entry = results.find((r) => r.id === c.id);
    if (!entry) {
      missing++;
      continue;
    }
    try {
      const output = extractionSchema.parse(entry.output);
      validateExtraction(output, fixture()); // reject foreign IDs; score model output before validation adds questions
      if (c.questions) {
        const matched = c.questions.every((field) =>
          output.questions.some((q) => q.field === field),
        );
        if (matched) clarificationMatches++;
        else if (!output.questions.length && output.events.length)
          silentGuesses++;
      } else if (
        JSON.stringify(output.events.map((e) => e.kind)) ===
          JSON.stringify(c.kinds) &&
        JSON.stringify(output.events.map((e) => e.amount)) ===
          JSON.stringify(c.amounts) &&
        !output.questions.length
      )
        kindMatches++;
    } catch {
      invalidOutputs++;
    }
  }
  console.log(
    JSON.stringify(
      {
        evaluation:
          "CAPTURED OUTPUTS ONLY — provenance must be recorded separately",
        cases: corpus.length,
        kindMatches,
        clarificationMatches,
        silentGuesses,
        invalidOutputs,
        missing,
      },
      null,
      2,
    ),
  );
  if (
    missing ||
    invalidOutputs ||
    silentGuesses ||
    kindMatches + clarificationMatches !== corpus.length
  )
    process.exitCode = 1;
}
