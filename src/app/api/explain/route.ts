import { context, sameOrigin } from "@/server/auth";
import { get } from "@/server/store";
import { explainPeriod } from "@/server/ai";
import { boundedJson } from "@/server/request";
import { calendarDate } from "@/domain/dates";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const ctx = await context();
    if (
      ctx.demo ||
      process.env.LOCAL_AI_BUDGET === "true" ||
      process.env.AI_ENABLED !== "true" ||
      !process.env.OPENAI_API_KEY
    )
      throw new Error(
        "AI explanations are not enabled. Your calculated report is available.",
      );
    const b = await boundedJson(req, 10000);
    if (!calendarDate(b.from) || !calendarDate(b.to) || b.from > b.to)
      throw new Error("Choose a valid period.");
    const w = await get(ctx, b.workspaceId);
    const { error } = await ctx.db!.rpc("reserve_ai_call", {
      p_limit: Number(process.env.AI_DAILY_CALL_LIMIT || 10),
    });
    if (error) throw new Error("Daily AI allowance reached.");
    return Response.json(await explainPeriod(w, b.from, b.to));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 422 });
  }
}
