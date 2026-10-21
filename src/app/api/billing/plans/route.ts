import { publicPlansResponse } from "@/domain/customer-plans";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(publicPlansResponse(), {
    headers: { "cache-control": "private, no-store" },
  });
}
