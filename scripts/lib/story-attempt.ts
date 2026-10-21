import { randomBytes } from "node:crypto";
import { EvaluationBudget } from "./evaluation-budget";
import {
  readOperation,
  writeOperation,
  type OperationRecord,
} from "./interpretation-store";
import { classifyProviderFailure, pauseMessage, STORY_UNPRICED, STORY_UNRESOLVED, STORY_UNUSABLE } from "./provider-outcome";
import { readProviderPause, resolveProviderPause, writeProviderPause } from "./provider-pause";
import {
  LUNA_RATE,
  envelopeReserveMicros,
  type TokenUsage,
} from "./provider-rates";

export class StoryAttemptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoryAttemptError";
  }
}

type RawResponse = {
  model?: string;
  status?: string | null;
  output?: Array<{
    type: string;
    content?: Array<{ type: string; text?: string }>;
  }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    input_tokens_details?: {
      cached_tokens?: number;
      cache_write_tokens?: number;
    } | null;
    output_tokens_details?: { reasoning_tokens?: number } | null;
  } | null;
};

function usageOf(response: RawResponse): TokenUsage {
  const usage = response.usage;
  if (
    !usage ||
    !Number.isSafeInteger(usage.input_tokens) ||
    !Number.isSafeInteger(usage.output_tokens)
  )
    throw new Error("Incomplete usage breakdown; retain reservation and stop.");
  const inputDetails = usage.input_tokens_details ?? {};
  const outputDetails = usage.output_tokens_details ?? {};
  return {
    input: usage.input_tokens!,
    output: usage.output_tokens!,
    cached: inputDetails.cached_tokens ?? 0,
    cacheWrite: inputDetails.cache_write_tokens ?? 0,
    reasoning: outputDetails.reasoning_tokens ?? 0,
  };
}

async function mark(
  directory: string,
  key: string,
  value: OperationRecord,
) {
  await writeOperation(directory, key, value);
}

export async function runBudgetedStory<T>(options: {
  directory: string;
  operationKey: string;
  beforeSubmit?: () => Promise<void>;
  submit: () => Promise<RawResponse>;
  accept: (response: RawResponse) => Promise<T> | T;
  recover: (result: unknown) => Promise<T> | T;
  permitPause?: "billing_rejected";
}): Promise<T> {
  const budget = await EvaluationBudget.acquire(options.directory);
  try {
    const existing = await readOperation(options.directory, options.operationKey);
    if (existing?.status === "ready") {
      try {
        return await options.recover(existing.result);
      } catch {
        throw new StoryAttemptError(STORY_UNUSABLE);
      }
    }
    if (existing?.status === "unusable") throw new StoryAttemptError(STORY_UNUSABLE);
    if (existing?.status === "submitted" || existing?.status === "uncertain")
      throw new StoryAttemptError(STORY_UNRESOLVED);
    const pause = await readProviderPause(options.directory);
    if (pause && pause !== options.permitPause)
      throw new StoryAttemptError(pauseMessage(pause));
    const reservation = await budget.reserveBounded(
      "local-story",
      randomBytes(32).toString("hex"),
      envelopeReserveMicros(),
      LUNA_RATE,
    );
    await mark(options.directory, options.operationKey, {
      status: "submitted",
      reservationId: reservation,
    });
    if (options.beforeSubmit) {
      try {
        await options.beforeSubmit();
      } catch (error) {
        await budget.release(reservation, "pre_submission");
        await mark(options.directory, options.operationKey, {
          status: "released",
          reason: "pre_submission",
        });
        throw error;
      }
    }
    let response: RawResponse;
    try {
      response = await options.submit();
    } catch (error) {
      const failure = classifyProviderFailure(error);
      if (failure.kind === "release") {
        await budget.release(reservation, failure.reason);
        await mark(options.directory, options.operationKey, {
          status: "released",
          reason: failure.reason,
        });
        if (failure.pause)
          await writeProviderPause(
            options.directory,
            failure.reason === "auth_rejected" ? "auth_rejected" : "billing_rejected",
          );
      } else {
        await mark(options.directory, options.operationKey, {
          status: "uncertain",
          reservationId: reservation,
        });
      }
      const status = (error as { status?: number }).status ?? null;
      const code =
        (error as { code?: string }).code ??
        (error as { cause?: { code?: string } }).cause?.code ??
        null;
      console.error(JSON.stringify({ understand: "failed", status, code }));
      throw new StoryAttemptError(failure.message);
    }
    if (response.model !== "gpt-6-luna") {
      await holdUnpriced(budget, options.directory, options.operationKey, reservation, "model_mismatch");
      throw new StoryAttemptError(STORY_UNPRICED);
    }
    try {
      await budget.settleLuna(reservation, usageOf(response));
    } catch (error) {
      console.error(
        JSON.stringify({
          understand: "unpriced",
          reason: error instanceof Error ? error.message : "unknown",
        }),
      );
      await holdUnpriced(budget, options.directory, options.operationKey, reservation, "unpriced");
      throw new StoryAttemptError(STORY_UNPRICED);
    }
    try {
      const value = await options.accept(response);
      await mark(options.directory, options.operationKey, {
        status: "ready",
        result: value,
      });
      if (options.permitPause)
        await resolveProviderPause(
          options.directory,
          options.permitPause,
          options.operationKey,
        );
      return value;
    } catch (error) {
      await mark(options.directory, options.operationKey, { status: "unusable" });
      if (error instanceof Error) throw error;
      throw new StoryAttemptError(STORY_UNUSABLE);
    }
  } finally {
    await budget.close();
  }
}

async function holdUnpriced(
  budget: EvaluationBudget,
  directory: string,
  key: string,
  reservation: string,
  reason: "unpriced" | "model_mismatch",
) {
  try {
    await budget.raiseUnpriced(reservation);
  } catch {
    /* The smaller hold remains. Further calls still pause. */
  }
  await mark(directory, key, { status: "uncertain", reservationId: reservation });
  await writeProviderPause(directory, reason);
}
