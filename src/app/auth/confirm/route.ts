import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = process.env.SITE_URL || url.origin;
  try {
    const jar = await cookies();
    const db = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => jar.getAll(),
          setAll: (values) =>
            values.forEach(({ name, value, options }) =>
              jar.set(name, value, options),
            ),
        },
      },
    );
    const code = url.searchParams.get("code"),
      token_hash = url.searchParams.get("token_hash"),
      type = url.searchParams.get("type");
    const recovery =
      type === "recovery" || url.searchParams.get("recovery") === "1";
    const result = code
      ? await db.auth.exchangeCodeForSession(code)
      : token_hash && (type === "email" || type === "recovery")
        ? await db.auth.verifyOtp({ token_hash, type })
        : null;
    if (!result || result.error) throw new Error("Invalid or expired link");
    jar.delete("cn-demo");
    return NextResponse.redirect(
      new URL(recovery ? "/auth?recovery=1" : "/app", origin),
    );
  } catch {
    return NextResponse.redirect(new URL("/auth?link_error=1", origin));
  }
}
