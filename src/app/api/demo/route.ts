import { cookies } from "next/headers";
import { sameOrigin } from "@/server/auth";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    if (process.env.DEMO_ENABLED === "false" || process.env.VERCEL)
      return Response.json({ error: "Demo unavailable." }, { status: 403 });
    (await cookies()).set("cn-demo", crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 403 });
  }
}
