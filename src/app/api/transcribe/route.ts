import OpenAI from "openai";
import { context, sameOrigin } from "@/server/auth";
import { get } from "@/server/store";
import { boundedFormData } from "@/server/upload";
import { validateRecording } from "@/server/recording";
import { transcriptText } from "@/lib/voice";
import { RECORDING_BYTES, RECORDING_SECONDS } from "@/lib/recording-limits";
import { localVoiceTesting, voiceAvailable } from "@/server/voice-access";
import { EvaluationBudget } from "../../../../scripts/lib/evaluation-budget";
import { resolve } from "node:path";
import { randomBytes } from "node:crypto";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const ctx = await context();
    if (ctx.demo || !voiceAvailable())
      throw new Error("Voice transcription is not enabled. Use text instead.");
    const data = await boundedFormData(req, RECORDING_BYTES + 10000);
    await get(ctx, String(data.get("workspaceId")));
    const clip = data.get("clip"),
      seconds = Number(data.get("seconds"));
    if (
      !(clip instanceof File) ||
      clip.size === 0 ||
      clip.size > RECORDING_BYTES ||
      clip.type !== "audio/webm" ||
      !Number.isFinite(seconds) ||
      seconds < 0 ||
      seconds > RECORDING_SECONDS
    )
      throw new Error("Use a WebM recording up to three minutes and 8 MB.");
    const duration = validateRecording(
      new Uint8Array(await clip.arrayBuffer()),
      clip.type,
    );
    req.signal.throwIfAborted();
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
        ? await budget.reserve("local-voice", randomBytes(32).toString("hex"))
        : null;
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
