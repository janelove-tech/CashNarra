import {
  mkdir,
  open,
  readFile,
  unlink,
  type FileHandle,
} from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import {
  LUNA_RATE,
  WHISPER_RATE,
  GROQ_TURBO_RATE,
  GROQ_FULL_RATE,
  groqReserveMicros,
  lunaUsageMicros,
  type ReserveRate,
  type TokenUsage,
} from "./provider-rates";
import type { ReleaseReason } from "./provider-outcome";

export const MODEL = "gpt-4.1-mini-2025-04-14";
export const CEILING = 20_000_000; // USD millionths. Raised from US$10 to US$20 on 2026-10-21.
export const APPROVAL = "2026-10-21";
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
  approval: APPROVAL,
} as const;
const knownHeader = z
  .object({
    type: z.literal("budget"),
    version: z.literal(1),
    ceilingMicros: z.union([
      z.literal(5_000_000),
      z.literal(10_000_000),
      z.literal(20_000_000),
    ]),
    approval: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .strict();
const entry = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("audio_usage"),
      id: z.string().uuid(),
      seconds: z.number().positive().max(180),
    })
    .strict(),
  z
    .object({
      type: z.literal("reserve"),
      id: z.string().uuid(),
      caseId: z.string().min(1),
      hash: z.string().regex(/^[a-f0-9]{64}$/),
      micros: z.number().int().positive().max(RESERVATION),
      rate: z
        .enum([LUNA_RATE, WHISPER_RATE, GROQ_TURBO_RATE, GROQ_FULL_RATE])
        .optional(),
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
  z
    .object({
      type: z.literal("usage_v2"),
      id: z.string().uuid(),
      rate: z.literal(LUNA_RATE),
      input: z.number().int().nonnegative(),
      output: z.number().int().nonnegative(),
      cached: z.number().int().nonnegative(),
      cacheWrite: z.number().int().nonnegative(),
      reasoning: z.number().int().nonnegative(),
    })
    .strict(),
  z
    .object({
      type: z.literal("audio_usage_v2"),
      id: z.string().uuid(),
      rate: z.enum([GROQ_TURBO_RATE, GROQ_FULL_RATE]),
      seconds: z.number().positive().max(180),
    })
    .strict(),
  z
    .object({
      type: z.literal("release"),
      id: z.string().uuid(),
      reason: z.enum([
        "pre_submission",
        "billing_rejected",
        "auth_rejected",
        "rate_limited",
      ]),
    })
    .strict(),
  z
    .object({
      type: z.literal("approval"),
      ceilingMicros: z.literal(20_000_000),
      approval: z.literal("2026-10-21"),
      supersedes: z.union([z.literal(5_000_000), z.literal(10_000_000)]),
    })
    .strict(),
  z
    .object({
      type: z.literal("exposure"),
      id: z.string().uuid(),
      micros: z.literal(RESERVATION),
      reason: z.literal("unpriced"),
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
  const parsedHeader = knownHeader.parse(lines.shift());
  if (parsedHeader.ceilingMicros > CEILING)
    throw new Error("Budget header exceeds approval.");
  let ceiling = parsedHeader.ceilingMicros;
  const calls = new Map<string, { micros: number; settled: boolean }>();
  for (const raw of lines) {
    const e = entry.parse(raw);
    if (e.type === "approval") {
      if (e.supersedes !== ceiling)
        throw new Error("Budget approval does not match the current ceiling.");
      ceiling = e.ceilingMicros;
    } else if (e.type === "reserve") {
      if (calls.has(e.id)) throw new Error("Repeated reservation.");
      calls.set(e.id, { micros: e.micros, settled: false });
    } else if (e.type === "release") {
      const call = calls.get(e.id);
      if (!call || call.settled) throw new Error("Unknown or repeated usage.");
      call.micros = 0;
      call.settled = true;
    } else if (e.type === "exposure") {
      const call = calls.get(e.id);
      if (!call || call.settled) throw new Error("Unknown or repeated usage.");
      call.micros = e.micros;
    } else {
      const call = calls.get(e.id);
      if (!call || call.settled) throw new Error("Unknown or repeated usage.");
      call.micros =
        e.type === "audio_usage"
          ? Math.ceil(e.seconds / 60) * 6000
          : e.type === "audio_usage_v2"
            ? groqReserveMicros(
                e.rate === GROQ_TURBO_RATE
                  ? "whisper-large-v3-turbo"
                  : "whisper-large-v3",
                e.seconds,
              )
          : e.type === "usage_v2"
            ? lunaUsageMicros({
                input: e.input,
                output: e.output,
                cached: e.cached,
                cacheWrite: e.cacheWrite,
                reasoning: e.reasoning,
              })
            : usageCost(e.input, e.output);
      call.settled = true;
    }
    if ([...calls.values()].reduce((sum, c) => sum + c.micros, 0) > ceiling)
      throw new Error("Budget journal exceeds approval.");
  }
  return {
    calls,
    ceiling,
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
    return this.reserveBounded(caseId, hash, RESERVATION);
  }
  async reserveBounded(
    caseId: string,
    hash: string,
    micros: number,
    rate?: ReserveRate,
  ) {
    const e = entry.parse({
      type: "reserve",
      id: crypto.randomUUID(),
      caseId,
      hash,
      micros,
      ...(rate ? { rate } : {}),
    });
    // The journal union also carries approval lines, which have no call id.
    // Only a reserve entry can start a call, so refuse anything else here.
    if (e.type !== "reserve")
      throw new Error("A reservation entry was expected.");
    const state = await this.state();
    if (state.committed + micros > state.ceiling)
      throw new Error("Evaluation budget exhausted.");
    await this.append(e); // durable before any network request
    return e.id;
  }
  async release(id: string, reason: ReleaseReason) {
    const call = (await this.state()).calls.get(id);
    if (!call || call.settled) throw new Error("Unknown or repeated usage.");
    await this.append({ type: "release", id, reason });
  }
  async raiseUnpriced(id: string) {
    const state = await this.state();
    const call = state.calls.get(id);
    if (!call || call.settled) throw new Error("Unknown or repeated usage.");
    if (state.committed - call.micros + RESERVATION > state.ceiling)
      throw new Error("Evaluation budget exhausted.");
    await this.append({
      type: "exposure",
      id,
      micros: RESERVATION,
      reason: "unpriced",
    });
  }
  async settleLuna(id: string, usage: TokenUsage) {
    const cost = lunaUsageMicros(usage);
    const call = (await this.state()).calls.get(id);
    if (!call || call.settled) throw new Error("Unknown or repeated usage.");
    await this.append({
      type: "usage_v2",
      id,
      rate: LUNA_RATE,
      input: usage.input,
      output: usage.output,
      cached: usage.cached,
      cacheWrite: usage.cacheWrite,
      reasoning: usage.reasoning,
    });
    return cost;
  }
  async settle(id: string, input: number, output: number) {
    usageCost(input, output);
    const call = (await this.state()).calls.get(id);
    if (!call || call.settled) throw new Error("Unknown or repeated usage.");
    await this.append({ type: "usage", id, input, output });
  }
  async approveCeiling() {
    const state = await this.state();
    if (state.ceiling >= CEILING) return state;
    if (state.ceiling !== 5_000_000 && state.ceiling !== 10_000_000)
      throw new Error("Unrecognised budget ceiling.");
    await this.append({
      type: "approval",
      ceilingMicros: CEILING,
      approval: APPROVAL,
      supersedes: state.ceiling,
    });
    return this.state();
  }
  async close() {
    await this.lock.close();
    await unlink(join(this.directory, "budget.lock"));
  }
  async settleGroq(id: string, model: string, seconds: number) {
    const selected =
      model === "whisper-large-v3-turbo"
        ? GROQ_TURBO_RATE
        : model === "whisper-large-v3"
          ? GROQ_FULL_RATE
          : null;
    if (!selected) throw new Error("Unknown transcription model; stop before spending.");
    groqReserveMicros(model, seconds);
    const call = (await this.state()).calls.get(id);
    if (!call || call.settled) throw new Error("Unknown or repeated usage.");
    await this.append({
      type: "audio_usage_v2",
      id,
      rate: selected,
      seconds,
    });
  }
  async settleAudio(id: string, seconds: number) {
    const usage = entry.parse({ type: "audio_usage", id, seconds });
    const call = (await this.state()).calls.get(id);
    if (!call || call.settled) throw new Error("Unknown or repeated usage.");
    await this.append(usage);
  }
}
