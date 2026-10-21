import { context, sameOrigin } from "@/server/auth";
import { get } from "@/server/store";
import { mockExtract, realExtract } from "@/server/ai";
import { boundedJson } from "@/server/request";
import { calendarDate } from "@/domain/dates";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const ctx = await context();
    const b = await boundedJson(req);
    if (!calendarDate(b.date)) throw new Error("Choose a valid story date.");
    if (typeof b.text !== "string" || b.text.length > 12000 || !b.text.trim())
      throw new Error("Enter a story of up to 12,000 characters.");
    const w = await get(ctx, b.workspaceId);
    const replaceIds = Array.isArray(b.replaceIds) ? b.replaceIds : [];
    if (
      replaceIds.length > 10 ||
      replaceIds.some(
        (id: string) => !w.records.some((r) => r.id === id && !r.removed),
      )
    )
      throw new Error("Correction record unavailable.");
    if (ctx.demo || process.env.AI_ENABLED !== "true")
      return Response.json(mockExtract(b.text, w, b.date));
    if (!process.env.OPENAI_API_KEY)
      throw new Error("AI is not configured. Use manual recording.");
    return Response.json(
      await realExtract(
        b.text,
        w,
        b.date,
        b.mode === "correction" ? "correction" : "extract",
        replaceIds,
        async () => {
          const { error } = await ctx.db!.rpc("reserve_ai_call", {
            p_limit: Number(process.env.AI_DAILY_CALL_LIMIT || 10),
          });
          if (error)
            throw new Error(
              "Daily AI allowance reached. Manual recording is available.",
            );
        },
      ),
    );
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 422 });
  }
}
