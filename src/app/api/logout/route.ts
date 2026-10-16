import { cookies } from "next/headers";
import { sameOrigin } from "@/server/auth";
export async function POST(req: Request) {
  sameOrigin(req);
  (await cookies()).delete("cn-demo");
  return Response.json({ ok: true });
}
