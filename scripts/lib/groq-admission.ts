import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { readOperation, writeOperation } from "./interpretation-store";
import { readProviderPause, writeProviderPause } from "./provider-pause";
import {
  groqBillableSeconds,
  groqReserveMicros,
  type GroqModel,
} from "./provider-rates";
import {
  FREE_LIMITS,
  GroqCapacity,
  type CapacityLimits,
} from "./groq-capacity";

const folder = "transcripts";
const PLAN_MISSING =
  "Groq's plan has not been confirmed. A local note cannot keep an upgraded Groq account free. Your recording is still here. You can type your story.";
const PLAN_PAID =
  "This Groq organization is on a paid plan. CashNarra will not send the recording while free-only is set. You can type your story.";
const PAID_OFF =
  "Paid transcription is not authorized. You can type your story.";
const BUSY =
  "Transcription is busy right now. Your recording is still here. You can type your story.";
const SPEND_CAP =
  "Transcription stopped because the Groq spending cap was reached. Your recording is still here. You can type your story.";
const AUTH =
  "The transcription connection needs attention. Your recording is still here; you can play it back or type your story.";
const UNRESOLVED =
  "This recording is still unresolved. Your recording is still here. You can type your story.";

export type GroqPlan = {
  organizationId: string;
  projectId: string | null;
  plan: "free" | "developer";
  verifiedAt: string;
};

export function transcriptionPolicy(env: NodeJS.ProcessEnv = process.env) {
  return env.TRANSCRIPTION_BILLING_POLICY === "paid_capped"
    ? "paid_capped"
    : "free_only";
}

export function paidTranscriptionAllowed(env: NodeJS.ProcessEnv = process.env) {
  return env.TRANSCRIPTION_PAID_ALLOWED === "true";
}

const verifiedAt = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

export function readPlanRecord(value: unknown): GroqPlan | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (
    record.type !== "groq_plan" ||
    record.version !== 1 ||
    typeof record.organizationId !== "string" ||
    record.organizationId.length < 1 ||
    record.organizationId.length > 80 ||
    (record.projectId !== null &&
      (typeof record.projectId !== "string" ||
        record.projectId.length < 1 ||
        record.projectId.length > 80)) ||
    (record.plan !== "free" && record.plan !== "developer") ||
    typeof record.verifiedAt !== "string" ||
    !verifiedAt.test(record.verifiedAt) ||
    !Number.isFinite(Date.parse(record.verifiedAt))
  )
    return null;
  return {
    organizationId: record.organizationId,
    projectId: record.projectId,
    plan: record.plan,
    verifiedAt: record.verifiedAt,
  };
}

export async function readGroqPlan(directory: string) {
  try {
    return readPlanRecord(
      JSON.parse(await readFile(join(directory, "groq-plan.json"), "utf8")),
    );
  } catch (error) {
    const missing =
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "ENOENT";
    if (missing) return null;
    return null;
  }
}

export function admitGroqPlan(input: {
  policy: "free_only" | "paid_capped";
  plan: GroqPlan | null;
  paidAllowed: boolean;
  paidBudgetMicros: number | null;
}) {
  if (input.policy === "paid_capped") {
    if (!input.paidAllowed) return { ok: false as const, message: PAID_OFF };
    if (
      !Number.isSafeInteger(input.paidBudgetMicros) ||
      (input.paidBudgetMicros ?? 0) <= 0
    )
      return {
        ok: false as const,
        message: "Paid transcription needs an authorized budget. You can type your story.",
      };
    return { ok: true as const, basis: "paid" as const };
  }
  if (!input.plan) return { ok: false as const, message: PLAN_MISSING };
  if (input.plan.plan !== "free") return { ok: false as const, message: PLAN_PAID };
  return { ok: true as const, basis: "free" as const };
}

export function classifyGroqFailure(error: unknown) {
  const detail = error as {
    status?: number;
    code?: string;
    name?: string;
    message?: string;
    retryAfterSeconds?: number;
    headers?: { get?: (name: string) => string | null };
  };
  const code = detail.code ?? "";
  if (detail.status === 400 && code === "blocked_api_access")
    return { kind: "spend_cap" as const, message: SPEND_CAP };
  if (detail.status === 401 || detail.status === 403)
    return { kind: "auth" as const, message: AUTH };
  if (detail.status === 429)
    return {
      kind: "capacity" as const,
      message: BUSY,
      retryAfterMs: retryAfterMs(detail),
    };
  if (
    detail.name === "APIConnectionTimeoutError" ||
    detail.message === "Request timed out."
  )
    return { kind: "uncertain" as const, message: UNRESOLVED };
  return { kind: "uncertain" as const, message: UNRESOLVED };
}

function retryAfterMs(detail: {
  retryAfterSeconds?: number;
  headers?: { get?: (name: string) => string | null };
}) {
  const header = detail.headers?.get?.("retry-after");
  const seconds =
    typeof detail.retryAfterSeconds === "number"
      ? detail.retryAfterSeconds
      : header && /^\d+$/.test(header)
        ? Number(header)
        : null;
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return null;
  return Math.min(seconds, 86_400) * 1000;
}

async function readCooldown(directory: string, now: number) {
  try {
    const parsed = JSON.parse(
      await readFile(join(directory, "groq-cooldown.json"), "utf8"),
    ) as { until?: number };
    return typeof parsed.until === "number" && parsed.until > now;
  } catch {
    return false;
  }
}

async function writeCooldown(directory: string, until: number) {
  await writeFile(
    join(directory, "groq-cooldown.json"),
    JSON.stringify({ until, reason: "rate_limited" }) + "\n",
    { mode: 0o600 },
  );
}

export async function runGroqAttempt<T>(options: {
  directory: string;
  operationKey: string;
  ownerId: string;
  model: GroqModel;
  seconds: number;
  voiceEnabled: boolean;
  policy?: "free_only" | "paid_capped";
  paidAllowed?: boolean;
  paidBudgetMicros?: number | null;
  limits?: CapacityLimits;
  now?: () => number;
  beforeSubmit?: () => Promise<void>;
  submit: () => Promise<unknown>;
  normalize: (raw: unknown) => T;
}): Promise<T> {
  if (!options.voiceEnabled)
    throw new Error("Voice transcription is not enabled. Use text instead.");
  const now = options.now ?? Date.now;
  const existing = await readOperation(
    options.directory,
    options.operationKey,
    folder,
  );
  if (existing?.status === "ready") return existing.result as T;
  if (existing?.status === "received") {
    const value = options.normalize(existing.result);
    await writeOperation(
      options.directory,
      options.operationKey,
      { status: "ready", result: value },
      folder,
    );
    return value;
  }
  const capacity = await GroqCapacity.acquire(
    options.directory,
    options.limits ?? FREE_LIMITS,
  );
  let reservation: string | null = null;
  try {
    const current = await readOperation(
      options.directory,
      options.operationKey,
      folder,
    );
    if (current?.status === "ready") return current.result as T;
    if (current?.status === "received") {
      const value = options.normalize(current.result);
      await writeOperation(
        options.directory,
        options.operationKey,
        { status: "ready", result: value },
        folder,
      );
      return value;
    }
    if (current?.status === "unusable")
      throw new Error(
        "This recording was transcribed, but the words are not usable. You can type your story.",
      );
    if (current?.status === "submitted" || current?.status === "uncertain")
      throw new Error(UNRESOLVED);
    const pause = await readProviderPause(options.directory, "groq");
    if (pause === "spend_cap") throw new Error(SPEND_CAP);
    if (pause === "auth_rejected") throw new Error(AUTH);
    if (pause) throw new Error("Transcription is paused. Your recording is still here. You can type your story.");
    if (await readCooldown(options.directory, now())) throw new Error(BUSY);
    const plan = await readGroqPlan(options.directory);
    const decision = admitGroqPlan({
      policy: options.policy ?? transcriptionPolicy(),
      plan,
      paidAllowed: options.paidAllowed ?? paidTranscriptionAllowed(),
      paidBudgetMicros: options.paidBudgetMicros ?? null,
    });
    if (!decision.ok) throw new Error(decision.message);
    const at = now();
    const audioSeconds = groqBillableSeconds(options.seconds);
    const referenceMicros = groqReserveMicros(options.model, options.seconds);
    reservation = await capacity.reserve({
      ownerId: options.ownerId,
      at,
      audioSeconds,
      referenceMicros,
      basis: decision.basis,
      payableMicros: decision.basis === "paid" ? referenceMicros : 0,
      paidBudgetMicros: options.paidBudgetMicros ?? undefined,
    });
    await writeOperation(
      options.directory,
      options.operationKey,
      { status: "submitted", reservationId: reservation },
      folder,
    );
    if (options.beforeSubmit) {
      try {
        await options.beforeSubmit();
      } catch (error) {
        await capacity.release(reservation, now());
        await writeOperation(
          options.directory,
          options.operationKey,
          { status: "released", reason: "pre_submission" },
          folder,
        );
        throw error;
      }
    }
    let raw: unknown;
    try {
      raw = await options.submit();
    } catch (error) {
      const failure = classifyGroqFailure(error);
      if (failure.kind === "uncertain") {
        await writeOperation(
          options.directory,
          options.operationKey,
          { status: "uncertain", reservationId: reservation },
          folder,
        );
      } else {
        await capacity.release(reservation, now());
        await writeOperation(
          options.directory,
          options.operationKey,
          {
            status: "released",
            reason: failure.kind === "auth" ? "auth_rejected" : "rate_limited",
          },
          folder,
        );
        if (failure.kind === "capacity" && failure.retryAfterMs)
          await writeCooldown(options.directory, now() + failure.retryAfterMs);
        if (failure.kind === "auth")
          await writeProviderPause(options.directory, "auth_rejected", "groq");
        if (failure.kind === "spend_cap")
          await writeProviderPause(options.directory, "spend_cap", "groq");
      }
      throw new Error(failure.message);
    }
    await writeOperation(
      options.directory,
      options.operationKey,
      { status: "received", result: raw },
      folder,
    );
    await capacity.settle(reservation, now());
    try {
      const value = options.normalize(raw);
      await writeOperation(
        options.directory,
        options.operationKey,
        { status: "ready", result: value },
        folder,
      );
      return value;
    } catch (error) {
      await writeOperation(
        options.directory,
        options.operationKey,
        { status: "unusable" },
        folder,
      );
      if (error instanceof Error) throw error;
      throw new Error("No usable words came back. You can type your story.");
    }
  } finally {
    await capacity.close();
  }
}
