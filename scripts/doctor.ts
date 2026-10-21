import { existsSync } from "node:fs";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const errors: string[] = [];
if (Number(process.versions.node.split(".")[0]) !== 24)
  errors.push("Use Node.js 24.");
const env = process.env;
if (!!env.NEXT_PUBLIC_SUPABASE_URL !== !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  errors.push("Configure both public Supabase URL and anon key.");
if (env.AI_ENABLED === "true" && !env.OPENAI_API_KEY)
  errors.push("AI is enabled but its server key is missing.");
const localGroqPilot =
  env.TRANSCRIPTION_PROVIDER === "groq" &&
  env.LOCAL_VOICE_TESTING === "true" &&
  env.LOCAL_AI_BUDGET === "true" &&
  /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(env.SITE_URL || "") &&
  !!env.GROQ_API_KEY;
if (
  env.VOICE_ENABLED === "true" &&
  !localGroqPilot &&
  (env.VOICE_QUALITY_APPROVED !== "true" || !env.OPENAI_API_KEY)
)
  errors.push("Voice needs a provider key and completed quality approval.");
if (env.VOICE_ENABLED === "true" && env.TRANSCRIPTION_PROVIDER === "groq" && !localGroqPilot)
  errors.push("Groq voice stays on this computer until the local pilot settings are complete.");
if (
  env.AI_DAILY_CALL_LIMIT &&
  (!/^\d+$/.test(env.AI_DAILY_CALL_LIMIT) ||
    Number(env.AI_DAILY_CALL_LIMIT) > 10)
)
  errors.push("Set the daily AI limit to an integer from 0 to 10.");
try {
  const url = new URL(env.SITE_URL || "");
  if (!["http:", "https:"].includes(url.protocol)) throw new Error();
} catch {
  errors.push("Set SITE_URL to the exact application origin.");
}
console.log(`Runtime: Node ${process.versions.node}`);
console.log(
  `Supabase: ${env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "configured (connection not tested)" : "not configured; synthetic mode available"}`,
);
console.log(
  `AI: ${env.AI_ENABLED === "true" ? "opted in" : "disabled"}; voice: ${env.VOICE_ENABLED === "true" ? "opted in" : "disabled"}`,
);
for (const error of errors) console.error(error);
if (errors.length) process.exitCode = 1;
else
  console.log(
    "Local configuration checks passed. No provider calls or credentials printed; this is not launch approval.",
  );
