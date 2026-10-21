import {
  mkdir,
  open,
  readFile,
  unlink,
  type FileHandle,
} from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

// Published Free-plan speech limits checked 2026-10-21. They belong to the
// Groq organization, not to each CashNarra user. This file is a local
// admission guard for one process. It is not the provider's balance and it
// does not coordinate several hosted servers.
export const FREE_LIMITS = {
  requestsPerMinute: 20,
  requestsPerDay: 2000,
  audioSecondsPerHour: 7200,
  audioSecondsPerDay: 28800,
} as const;
export type CapacityLimits = {
  requestsPerMinute: number;
  requestsPerDay: number;
  audioSecondsPerHour: number;
  audioSecondsPerDay: number;
};

const limitsSchema = z
  .object({
    requestsPerMinute: z.number().int().positive(),
    requestsPerDay: z.number().int().positive(),
    audioSecondsPerHour: z.number().int().positive(),
    audioSecondsPerDay: z.number().int().positive(),
  })
  .strict();
const headerSchema = z
  .object({
    type: z.literal("groq_capacity"),
    version: z.literal(1),
    scope: z.literal("local-file"),
    limits: limitsSchema,
  })
  .strict();
const entrySchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("reserve"),
      id: z.string().uuid(),
      at: z.number().int().nonnegative(),
      ownerId: z.string().min(1).max(80),
      audioSeconds: z.number().positive().max(180),
      referenceMicros: z.number().int().nonnegative(),
      payableMicros: z.number().int().nonnegative(),
      basis: z.enum(["free", "paid"]),
    })
    .strict(),
  z
    .object({
      type: z.literal("release"),
      id: z.string().uuid(),
      at: z.number().int().nonnegative(),
    })
    .strict(),
  z
    .object({
      type: z.literal("settle"),
      id: z.string().uuid(),
      at: z.number().int().nonnegative(),
    })
    .strict(),
]);
type Entry = z.infer<typeof entrySchema>;
type Call = {
  at: number;
  ownerId: string;
  audioSeconds: number;
  referenceMicros: number;
  payableMicros: number;
  basis: "free" | "paid";
  settled: boolean;
  released: boolean;
};

export function capacityState(contents: string) {
  if (!contents.endsWith("\n"))
    throw new Error("Incomplete Groq capacity journal; reconcile manually.");
  const lines = contents
    .trimEnd()
    .split("\n")
    .map((line) => JSON.parse(line));
  const header = headerSchema.parse(lines.shift());
  const calls = new Map<string, Call>();
  for (const raw of lines) {
    const entry = entrySchema.parse(raw);
    if (entry.type === "reserve") {
      if (calls.has(entry.id)) throw new Error("Repeated Groq capacity reservation.");
      calls.set(entry.id, {
        at: entry.at,
        ownerId: entry.ownerId,
        audioSeconds: entry.audioSeconds,
        referenceMicros: entry.referenceMicros,
        payableMicros: entry.payableMicros,
        basis: entry.basis,
        settled: false,
        released: false,
      });
    } else {
      const call = calls.get(entry.id);
      if (!call || call.settled || call.released)
        throw new Error("Unknown or repeated Groq capacity result.");
      if (entry.type === "release") call.released = true;
      else call.settled = true;
    }
  }
  const active = [...calls.values()].filter((call) => !call.released);
  return {
    limits: header.limits,
    calls,
    payableMicros: active.reduce((sum, call) => sum + call.payableMicros, 0),
    referenceMicros: active.reduce((sum, call) => sum + call.referenceMicros, 0),
    audioSeconds: active.reduce((sum, call) => sum + call.audioSeconds, 0),
    requests: active.length,
  };
}

function within(at: number, now: number, windowMs: number) {
  return now >= at && now - at < windowMs;
}

export class GroqCapacity {
  private constructor(
    private directory: string,
    private lock: FileHandle,
    private limits: CapacityLimits,
  ) {}
  static async acquire(directory: string, limits: CapacityLimits = FREE_LIMITS) {
    await mkdir(directory, { recursive: true });
    const lock = await open(join(directory, "groq-capacity.lock"), "wx", 0o600);
    const capacity = new GroqCapacity(directory, lock, limitsSchema.parse(limits));
    try {
      const path = join(directory, "groq-capacity.jsonl");
      let contents: string | null = null;
      try {
        contents = await readFile(path, "utf8");
      } catch (error) {
        const missing =
          error instanceof Error &&
          "code" in error &&
          (error as { code?: string }).code === "ENOENT";
        if (!missing) throw error;
      }
      if (contents === null) {
        const file = await open(path, "wx", 0o600);
        try {
          await file.writeFile(
            JSON.stringify({
              type: "groq_capacity",
              version: 1,
              scope: "local-file",
              limits: capacity.limits,
            }) + "\n",
          );
          await file.sync();
        } finally {
          await file.close();
        }
      } else {
        const state = capacityState(contents);
        if (JSON.stringify(state.limits) !== JSON.stringify(capacity.limits))
          throw new Error("Groq capacity limits cannot be raised in place.");
      }
      return capacity;
    } catch (error) {
      await capacity.close();
      throw error;
    }
  }
  async state() {
    return capacityState(
      await readFile(join(this.directory, "groq-capacity.jsonl"), "utf8"),
    );
  }
  private async append(entry: Entry) {
    const file = await open(join(this.directory, "groq-capacity.jsonl"), "a");
    try {
      await file.writeFile(JSON.stringify(entry) + "\n");
      await file.sync();
    } finally {
      await file.close();
    }
  }
  async reserve(input: {
    ownerId: string;
    at: number;
    audioSeconds: number;
    referenceMicros: number;
    basis: "free" | "paid";
    payableMicros: number;
    paidBudgetMicros?: number;
  }) {
    const state = await this.state();
    const active = [...state.calls.values()].filter((call) => !call.released);
    const minute = active.filter((call) => within(call.at, input.at, 60_000));
    const hour = active.filter((call) => within(call.at, input.at, 3_600_000));
    const day = active.filter((call) => within(call.at, input.at, 86_400_000));
    if (
      minute.length + 1 > this.limits.requestsPerMinute ||
      day.length + 1 > this.limits.requestsPerDay ||
      hour.reduce((sum, call) => sum + call.audioSeconds, 0) + input.audioSeconds >
        this.limits.audioSecondsPerHour ||
      day.reduce((sum, call) => sum + call.audioSeconds, 0) + input.audioSeconds >
        this.limits.audioSecondsPerDay
    )
      throw new Error(
        "Transcription is busy right now. Your recording is still here. You can type your story.",
      );
    if (input.basis === "paid") {
      if (!Number.isSafeInteger(input.paidBudgetMicros) || (input.paidBudgetMicros ?? 0) <= 0)
        throw new Error("Paid transcription needs an authorized budget.");
      const payable =
        active.reduce((sum, call) => sum + call.payableMicros, 0) + input.payableMicros;
      if (payable > (input.paidBudgetMicros ?? 0))
        throw new Error(
          "Paid transcription is stopped because its budget cannot cover this recording. You can type your story.",
        );
    }
    const entry = entrySchema.parse({
      type: "reserve",
      id: crypto.randomUUID(),
      at: input.at,
      ownerId: input.ownerId,
      audioSeconds: input.audioSeconds,
      referenceMicros: input.referenceMicros,
      payableMicros: input.basis === "free" ? 0 : input.payableMicros,
      basis: input.basis,
    });
    await this.append(entry);
    return entry.id;
  }
  async release(id: string, at: number) {
    const call = (await this.state()).calls.get(id);
    if (!call || call.settled || call.released)
      throw new Error("Unknown or repeated Groq capacity result.");
    await this.append({ type: "release", id, at });
  }
  async settle(id: string, at: number) {
    const call = (await this.state()).calls.get(id);
    if (!call || call.settled || call.released)
      throw new Error("Unknown or repeated Groq capacity result.");
    await this.append({ type: "settle", id, at });
  }
  async close() {
    await this.lock.close();
    await unlink(join(this.directory, "groq-capacity.lock"));
  }
}
