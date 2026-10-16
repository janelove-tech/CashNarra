import {
  mkdir,
  open,
  readFile,
  unlink,
  type FileHandle,
} from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

export const MODEL = "gpt-4.1-mini-2025-04-14";
export const CEILING = 5_000_000; // USD millionths; one cumulative approval.
export const MAX_INPUT = 1_047_576;
export const MAX_OUTPUT = 4000;
export function usageCost(input: number, output: number) {
  if (
    !Number.isSafeInteger(input) ||
    input < 0 ||
    input > MAX_INPUT ||
    !Number.isSafeInteger(output) ||
    output < 0 ||
    output > MAX_OUTPUT
  )
    throw new Error("Unrecognised usage; retain reservation and stop.");
  // $0.40/$1.60 per million tokens; round upwards, ignore cache discounts.
  return Math.ceil((2 * input + 8 * output) / 5);
}
export const RESERVATION = usageCost(MAX_INPUT, MAX_OUTPUT);
const header = {
  type: "budget",
  version: 1,
  ceilingMicros: CEILING,
  approval: "2026-10-16",
} as const;
const entry = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("reserve"),
      id: z.string().uuid(),
      caseId: z.string().min(1),
      hash: z.string().regex(/^[a-f0-9]{64}$/),
      micros: z.literal(RESERVATION),
    })
    .strict(),
  z
    .object({
      type: z.literal("usage"),
      id: z.string().uuid(),
      input: z.number().int().nonnegative(),
      output: z.number().int().nonnegative(),
    })
    .strict(),
]);
type Entry = z.infer<typeof entry>;

export function budgetState(contents: string) {
  if (!contents.endsWith("\n"))
    throw new Error("Incomplete budget journal; reconcile manually.");
  const lines = contents
    .trimEnd()
    .split("\n")
    .map((line) => JSON.parse(line));
  if (JSON.stringify(lines.shift()) !== JSON.stringify(header))
    throw new Error("Invalid budget header.");
  const calls = new Map<string, { micros: number; settled: boolean }>();
  for (const raw of lines) {
    const e = entry.parse(raw);
    if (e.type === "reserve") {
      if (calls.has(e.id)) throw new Error("Repeated reservation.");
      calls.set(e.id, { micros: e.micros, settled: false });
    } else {
      const call = calls.get(e.id);
      if (!call || call.settled) throw new Error("Unknown or repeated usage.");
      call.micros = usageCost(e.input, e.output);
      call.settled = true;
    }
    if ([...calls.values()].reduce((sum, c) => sum + c.micros, 0) > CEILING)
      throw new Error("Budget journal exceeds approval.");
  }
  return {
    calls,
    committed: [...calls.values()].reduce((sum, c) => sum + c.micros, 0),
  };
}

// Exclusive lock spans the run, including network calls. A crash leaves the
// lock and reservations intact; never automatically reclaim uncertain spend.
export class EvaluationBudget {
  private constructor(
    private directory: string,
    private lock: FileHandle,
  ) {}
  static async acquire(directory: string, initialise = false) {
    await mkdir(directory, { recursive: true });
    const lock = await open(join(directory, "budget.lock"), "wx", 0o600);
    const budget = new EvaluationBudget(directory, lock);
    try {
      if (initialise) {
        const file = await open(join(directory, "budget.jsonl"), "wx", 0o600);
        try {
          await file.writeFile(JSON.stringify(header) + "\n");
          await file.sync();
        } finally {
          await file.close();
        }
      }
      await budget.state();
      return budget;
    } catch (error) {
      await budget.close();
      throw error;
    }
  }
  async state() {
    return budgetState(
      await readFile(join(this.directory, "budget.jsonl"), "utf8"),
    );
  }
  private async append(e: Entry) {
    const file = await open(join(this.directory, "budget.jsonl"), "a");
    try {
      await file.writeFile(JSON.stringify(e) + "\n");
      await file.sync();
    } finally {
      await file.close();
    }
  }
  async reserve(caseId: string, hash: string) {
    const e = entry.parse({
      type: "reserve",
      id: crypto.randomUUID(),
      caseId,
      hash,
      micros: RESERVATION,
    });
    if ((await this.state()).committed + RESERVATION > CEILING)
      throw new Error("Evaluation budget exhausted.");
    await this.append(e); // durable before any network request
    return e.id;
  }
  async settle(id: string, input: number, output: number) {
    usageCost(input, output);
    const call = (await this.state()).calls.get(id);
    if (!call || call.settled) throw new Error("Unknown or repeated usage.");
    await this.append({ type: "usage", id, input, output });
  }
  async close() {
    await this.lock.close();
    await unlink(join(this.directory, "budget.lock"));
  }
}
