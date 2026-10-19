import { z } from "zod";
import { context, sameOrigin } from "@/server/auth";
import { boundedJson } from "@/server/request";
import { get } from "@/server/store";
import { profitLoss, profitReviewSchema } from "@/domain/profit-loss";

const requestSchema = z.object({ workspaceId: z.string().min(1).max(100), expectedVersion: z.number().int().nonnegative(), from: z.string(), to: z.string(), review: profitReviewSchema }).strict();
const headers = { "Cache-Control": "private, no-store" };
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const ctx = await context();
    const body = requestSchema.parse(await boundedJson(req, 12000));
    const w = await get(ctx, body.workspaceId);
    if (w.version !== body.expectedVersion) return Response.json({ error: "Your records changed. Reload the workspace list and check your report again." }, { status: 409, headers });
    return Response.json({ report: profitLoss(w, body.from, body.to, body.review, new Date().toISOString().slice(0, 10)), demo: ctx.demo }, { headers });
  } catch (error) {
    return Response.json({ error: error instanceof z.ZodError ? "Check the report details and try again." : (error as Error).message }, { status: 422, headers });
  }
}
