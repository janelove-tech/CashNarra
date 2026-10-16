import { fixture } from "../src/domain/fixture";
const spaces = Array.from({ length: 10 }, (_, i) => {
  const w = fixture();
  w.id = `synthetic-${i}`;
  w.records = Array.from({ length: 1000 }, (_, j) => ({
    ...w.records[j % w.records.length],
    id: `synthetic-${i}-${j}`,
  }));
  return w;
});
const summaries = spaces.map(({ id, name, type, version }) => ({
  id,
  name,
  type,
  version,
}));
const measure = (value: unknown) => {
  const json = JSON.stringify(value),
    start = performance.now();
  for (let i = 0; i < 100; i++) JSON.parse(json);
  return {
    bytes: Buffer.byteLength(json),
    meanParseMs: (performance.now() - start) / 100,
  };
};
console.log(
  JSON.stringify(
    {
      dataset:
        "Synthetic payload only: 10 workspaces, 1000 records each; not a valid posting fixture",
      all: measure(spaces),
      summaries: measure(summaries),
      selected: measure(spaces[0]),
      refresh: "summary plus one state instead of all states",
      serverTime:
        "NOT RUN: database/API latency not inferred from JSON parsing",
      renderTime:
        "NOT RUN: browser render latency not inferred from JSON parsing",
    },
    null,
    2,
  ),
);
