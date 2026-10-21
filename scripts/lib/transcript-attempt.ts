import { createHash, randomBytes } from "node:crypto";
import { EvaluationBudget } from "./evaluation-budget";
import { readOperation, writeOperation } from "./interpretation-store";
import {
  classifyProviderFailure,
  pauseMessage,
  STORY_UNRESOLVED,
  STORY_UNUSABLE,
} from "./provider-outcome";
import { readProviderPause, writeProviderPause } from "./provider-pause";
import { GROQ_MODELS, groqModel, groqReserveMicros, type GroqModel } from "./provider-rates";

const folder = "transcripts";

export function transcriptKey(parts: {
  model: string;
  seconds: number;
  recordingHash: string;
  glossary: string;
}) {
  groqModel(parts.model);
  return createHash("sha256")
    .update(
      JSON.stringify({
        provider: "groq",
        model: parts.model,
        seconds: parts.seconds,
        recordingHash: parts.recordingHash,
        glossary: parts.glossary,
      }),
    )
    .digest("hex");
}

export async function runBudgetedTranscript<T>(options: {
  directory: string;
  operationKey: string;
  model: GroqModel;
  seconds: number;
  beforeSubmit?: () => Promise<void>;
  submit: () => Promise<unknown>;
  normalize: (raw: unknown) => T;
}): Promise<T> {
  const budget = await EvaluationBudget.acquire(options.directory);
  try {
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
    if (existing?.status === "unusable") throw new Error(STORY_UNUSABLE);
    if (existing?.status === "submitted" || existing?.status === "uncertain")
      throw new Error(STORY_UNRESOLVED);
    const pause = await readProviderPause(options.directory, "groq");
    if (pause) throw new Error(pauseMessage(pause));
    const reservation = await budget.reserveBounded(
      "local-voice",
      randomBytes(32).toString("hex"),
      groqReserveMicros(options.model, options.seconds),
      GROQ_MODELS[options.model].rate,
    );
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
        await budget.release(reservation, "pre_submission");
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
      const failure = classifyProviderFailure(error);
      if (failure.kind === "release") {
        await budget.release(reservation, failure.reason);
        await writeOperation(
          options.directory,
          options.operationKey,
          { status: "released", reason: failure.reason },
          folder,
        );
        if (failure.pause)
          await writeProviderPause(
            options.directory,
            failure.reason === "auth_rejected" ? "auth_rejected" : "billing_rejected",
            "groq",
          );
      } else {
        await writeOperation(
          options.directory,
          options.operationKey,
          { status: "uncertain", reservationId: reservation },
          folder,
        );
      }
      throw new Error(failure.message);
    }
    await writeOperation(
      options.directory,
      options.operationKey,
      { status: "received", result: raw },
      folder,
    );
    await budget.settleGroq(reservation, options.model, options.seconds);
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
      throw new Error(STORY_UNUSABLE);
    }
  } finally {
    await budget.close();
  }
}
