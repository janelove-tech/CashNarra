import OpenAI from "openai";
import { messageFor } from "@/domain/customer-plans";
import { context, sameOrigin } from "@/server/auth";
import { get } from "@/server/store";
import { boundedFormData } from "@/server/upload";
import { validateRecording } from "@/server/recording";
import { transcriptText } from "@/lib/voice";
import {
  HOSTED_FUNCTION_BODY_BYTES,
  RECORDING_BYTES,
  voiceNoteLimitSeconds,
} from "@/lib/recording-limits";
import { localVoiceTesting, voiceAvailable } from "@/server/voice-access";
import {
  normalizeGroqTranscript,
  postGroqTranscription,
  recordingHash,
  spellingGlossary,
} from "@/server/transcription";
import { EvaluationBudget } from "../../../../scripts/lib/evaluation-budget";
import { classifyProviderFailure } from "../../../../scripts/lib/provider-outcome";
import {
  readProviderPause,
  writeProviderPause,
} from "../../../../scripts/lib/provider-pause";
import {
  WHISPER_RATE,
  groqModel,
  whisperReserveMicros,
} from "../../../../scripts/lib/provider-rates";
import {
  runGroqAttempt,
} from "../../../../scripts/lib/groq-admission";
import {
  transcriptKey,
} from "../../../../scripts/lib/transcript-attempt";
import { resolve } from "node:path";
import { randomBytes } from "node:crypto";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const ctx = await context();
    if (ctx.demo || !voiceAvailable())
      throw new Error("Voice transcription is not enabled. Use text instead.");
    const data = await boundedFormData(req, RECORDING_BYTES + 10000);
    const workspace = await get(ctx, String(data.get("workspaceId")));
    const clip = data.get("clip"),
      seconds = Number(data.get("seconds"));
    const limit = voiceNoteLimitSeconds();
    if (
      !(clip instanceof File) ||
      clip.size === 0 ||
      clip.size > RECORDING_BYTES ||
      (process.env.VERCEL && clip.size > HOSTED_FUNCTION_BODY_BYTES) ||
      clip.type !== "audio/webm" ||
      !Number.isFinite(seconds) ||
      seconds < 0 ||
      seconds > limit
    )
      throw new Error(
        process.env.VERCEL &&
          clip instanceof File &&
          clip.size > HOSTED_FUNCTION_BODY_BYTES
          ? "This recording is too large to send. Try a shorter story."
          : limit > 60
            ? "Use a WebM recording of up to two minutes."
            : "Use a WebM recording of up to one minute.",
      );
    const bytes = new Uint8Array(await clip.arrayBuffer());
    const duration = validateRecording(bytes, clip.type, limit);
    req.signal.throwIfAborted();
    if (process.env.TRANSCRIPTION_PROVIDER === "groq") {
      if (!localVoiceTesting() || !process.env.GROQ_API_KEY)
        throw new Error("Voice transcription is not enabled. Use text instead.");
      const directory = resolve(".local/evaluation");
      const model = groqModel(
        process.env.GROQ_TRANSCRIPTION_MODEL || "whisper-large-v3-turbo",
      );
      const glossary = spellingGlossary([
        ...workspace.accounts.map((account) => account.name),
        ...workspace.records.flatMap((record) =>
          record.party ? [record.party] : [],
        ),
      ]);
      const result = await runGroqAttempt({
        directory,
        operationKey: transcriptKey({
          model,
          seconds: duration,
          recordingHash: recordingHash(bytes),
          glossary,
        }),
        ownerId: ctx.userId,
        model,
        seconds: duration,
        voiceEnabled: true,
        beforeSubmit: async () => {
          const { error } = await ctx.db!.rpc("reserve_ai_call", {
            p_limit: Number(process.env.AI_DAILY_CALL_LIMIT || 10),
          });
          if (error)
            throw new Error(messageFor("voice_upstream"));
        },
        submit: () =>
          postGroqTranscription({
            apiKey: process.env.GROQ_API_KEY || "",
            file: new File([bytes], "story.webm", { type: "audio/webm" }),
            model,
            prompt: glossary,
            signal: req.signal,
          }),
        normalize: (raw) => normalizeGroqTranscript(raw, duration, model),
      });
      return Response.json({ text: result.text });
    }
    if (localVoiceTesting() && (await readProviderPause(resolve(".local/evaluation"))))
      throw new Error(
        "The story reader has no remaining credit. Your recording is still here; you can play it back or type your story.",
      );
    const { error } = await ctx.db!.rpc("reserve_ai_call", {
      p_limit: Number(process.env.AI_DAILY_CALL_LIMIT || 10),
    });
    if (error) throw new Error("Daily processing allowance reached.");
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 45000,
      maxRetries: 0,
    });
    const budget = localVoiceTesting()
      ? await EvaluationBudget.acquire(resolve(".local/evaluation"))
      : null;
    try {
      const reservation = budget
        ? await budget.reserveBounded(
            "local-voice",
            randomBytes(32).toString("hex"),
            whisperReserveMicros(duration),
            WHISPER_RATE,
          )
        : null;
      try {
        const result = await client.audio.transcriptions.create(
          {
            file: clip,
            model: budget
              ? "whisper-1"
              : process.env.TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe",
            response_format: "json",
          },
          { signal: req.signal },
        );
        if (budget && reservation)
          await budget.settleAudio(reservation, duration);
        req.signal.throwIfAborted();
        return Response.json({ text: transcriptText(result) });
      } catch (error) {
        if (budget && reservation) {
          const failure = classifyProviderFailure(error);
          if (failure.kind === "release") {
            await budget.release(reservation, failure.reason);
            if (failure.pause)
              await writeProviderPause(
                resolve(".local/evaluation"),
                failure.reason === "auth_rejected"
                  ? "auth_rejected"
                  : "billing_rejected",
              );
          }
        }
        throw error;
      }
    } finally {
      await budget?.close();
    }
  } catch (e) {
    if (e instanceof OpenAI.APIError) {
      return Response.json(
        {
          error:
            e.status === 401 || e.status === 403
              ? "The transcription connection needs attention. Your recording is still here; you can play it back or type your story."
              : "We could not turn this recording into words. Keep your clip and try again, or type your story.",
        },
        { status: 422 },
      );
    }
    return Response.json({ error: (e as Error).message }, { status: 422 });
  }
}
