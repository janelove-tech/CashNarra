import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Context } from "./store";
export async function context(): Promise<Context> {
  const jar = await cookies();
  const demo = jar.get("cn-demo")?.value;
  if (
    demo &&
    /^[a-f0-9-]{36}$/.test(demo) &&
    process.env.DEMO_ENABLED !== "false" &&
    !process.env.VERCEL
  )
    return { userId: "demo-" + demo, demo: true, db: null };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error(
      "Sign in is not configured. You can use the synthetic demo.",
    );
  const db = createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) =>
        values.forEach(({ name, value, options }) =>
          jar.set(name, value, options),
        ),
    },
  });
  const { data, error } = await db.auth.getUser();
  if (error || !data.user)
    throw new Error("Please sign in again. Your draft is still here.");
  return { userId: data.user.id, demo: false, db };
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) throw new Error("Request origin is required.");
  const parsed = new URL(origin);
  const configured = process.env.SITE_URL;
  if (configured) {
    if (parsed.origin !== new URL(configured).origin)
      throw new Error("Request origin is not allowed.");
  } else if (
    parsed.host !== req.headers.get("host") ||
    !["http:", "https:"].includes(parsed.protocol)
  )
    throw new Error("Request origin is not allowed.");
}
