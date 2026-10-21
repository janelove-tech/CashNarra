import { readFile } from "node:fs/promises";
import { budgetState } from "./lib/evaluation-budget";
import {
  readProviderPause,
  resolveProviderPause,
} from "./lib/provider-pause";

const directory = ".local/evaluation";
const before = await readProviderPause(directory);
if (before === "unpriced") {
  await resolveProviderPause(
    directory,
    "unpriced",
    "priced-standard-luna-2026-10-21",
  );
}
const state = budgetState(await readFile(`${directory}/budget.jsonl`, "utf8"));
const unsettled = [...state.calls.values()].filter((call) => !call.settled).length;
console.log(
  JSON.stringify({
    pauseBefore: before,
    pauseAfter: await readProviderPause(directory),
    calls: state.calls.size,
    unsettled,
    committedMicros: state.committed,
    ceilingMicros: state.ceiling,
    providerCall: false,
  }),
);
