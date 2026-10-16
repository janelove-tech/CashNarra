import { createBrowserClient } from "@supabase/ssr";
export function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error(
      "Authentication needs Supabase configuration. Use the synthetic demo for now.",
    );
  return createBrowserClient(url, key);
}
