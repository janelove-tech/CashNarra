/**
 * Read-only synthetic payload characterization.
 *
 * These repeated fixture records are intentionally NOT a valid posting fixture.
 * This does not benchmark PostgreSQL, API latency, ledger validation, the
 * journal-lines rebuild or rendered browser interactions.
 */
import { fixture } from "../src/domain/fixture";

const sizes = [100, 1_000, 10_000] as const;
const sample = fixture();
if (!sample.records.length) throw new Error("Synthetic fixture has no records.");

function makeWorkspace(recordCount: number, index = 0) {
  return {
    ...sample,
    id: `synthetic-workspace-${index}-${recordCount}`,
    records: Array.from({ length: recordCount }, (_, recordIndex) => ({
      ...sample.records[recordIndex % sample.records.length],
      id: `synthetic-record-${index}-${recordIndex}`,
    })),
  };
}

function measure(value: unknown, iterations: number) {
  // Warm the same operations before recording small timing samples.
  JSON.parse(JSON.stringify(value));
  const encodeSamples: number[] = [];
  const decodeSamples: number[] = [];
  let bytes = 0;
  for (let i = 0; i < iterations; i++) {
    let start = performance.now();
    const json = JSON.stringify(value);
    encodeSamples.push(performance.now() - start);
    bytes = Buffer.byteLength(json);
    start = performance.now();
    JSON.parse(json);
    decodeSamples.push(performance.now() - start);
  }
  const mean = (samples: number[]) =>
    Math.round((samples.reduce((total, time) => total + time, 0) / samples.length) * 1_000) / 1_000;
  return {
    bytes,
    meanStringifyMs: mean(encodeSamples),
    meanParseMs: mean(decodeSamples),
    iterations,
  };
}

const recordSizes = sizes.map((records) => ({
  records,
  ...measure(makeWorkspace(records), records === 10_000 ? 5 : 20),
}));
const tenWorkspaces = Array.from({ length: 10 }, (_, i) =>
  makeWorkspace(1_000, i),
);
const summaries = tenWorkspaces.map(({ id, name, type, version }) => ({
  id,
  name,
  type,
  version,
}));

console.log(
  JSON.stringify(
    {
      dataset: "Fictional repeated records; intentionally not valid for posting",
      recordSizes,
      comparison: {
        tenWorkspacesWithOneThousandRecordsEach: measure(tenWorkspaces, 5),
        tenWorkspaceSummariesOnly: measure(summaries, 20),
      },
      interpretation:
        "These are local JSON bytes and parse/stringify times only; use disposable database and browser tests before architecture decisions.",
      postingLatency: "NOT RUN",
      databaseQueryLatency: "NOT RUN",
      browserRenderLatency: "NOT RUN",
      deviceMemory: "NOT RUN",
    },
    null,
    2,
  ),
);
