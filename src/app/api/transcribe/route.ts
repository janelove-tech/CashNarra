import OpenAI from "openai";
import { context, sameOrigin } from "@/server/auth";
import { get } from "@/server/store";
import { boundedFormData } from "@/server/upload";
import { validateRecording } from "@/server/recording";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const ctx = await context();
    if (
      ctx.demo ||
      process.env.VOICE_ENABLED !== "true" ||
      process.env.VOICE_QUALITY_APPROVED !== "true" ||
      !process.env.OPENAI_API_KEY
    )
      throw new Error("Voice transcription is not enabled. Use text instead.");
    const data = await boundedFormData(req, 3 * 1024 * 1024 + 10000);
    await get(ctx, String(data.get("workspaceId")));
    const clip = data.get("clip"),
      seconds = Number(data.get("seconds"));
    if (
      !(clip instanceof File) ||
      clip.size === 0 ||
      clip.size > 3 * 1024 * 1024 ||
      !["audio/webm", "audio/mp4"].includes(clip.type) ||
      !Number.isFinite(seconds) ||
      seconds < 0 ||
      seconds > 60
    )
      throw new Error("Use a supported recording up to 60 seconds and 3 MB.");
    validateRecording(new Uint8Array(await clip.arrayBuffer()), clip.type);
    const { error } = await ctx.db!.rpc("reserve_ai_call", {
      p_limit: Number(process.env.AI_DAILY_CALL_LIMIT || 10),
    });
    if (error) throw new Error("Daily processing allowance reached.");
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 45000,
      maxRetries: 0,
    });
    const result = await client.audio.transcriptions.create({
      file: clip,
      model: process.env.TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe",
      response_format: "json",
    });
    if (!result.text?.trim() || result.text.length > 12000)
      throw new Error("No usable transcript returned.");
    return Response.json({ text: result.text });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 422 });
  }
}
