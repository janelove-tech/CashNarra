export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json(
    {
      ok: false,
      code: "payments_disabled",
      message: "Payments are not enabled.",
    },
    { status: 403, headers: { "cache-control": "private, no-store" } },
  );
}
