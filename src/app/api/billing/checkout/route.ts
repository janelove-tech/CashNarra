import { refuseCheckout } from "@/domain/customer-plans";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let planId = "";
  try {
    const body = await req.json();
    if (body && typeof body.planId === "string") planId = body.planId.slice(0, 40);
  } catch {
    planId = "";
  }
  const decision = refuseCheckout(planId);
  return Response.json(
    {
      ok: false,
      code: decision.code,
      message: decision.message,
    },
    { status: 403, headers: { "cache-control": "private, no-store" } },
  );
}
