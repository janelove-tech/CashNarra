import launchPlans from "@/domain/launch-plans.json";

export const FREE_VOICE_SECONDS = launchPlans.plans.free.voiceNoteSeconds;
export const PLUS_VOICE_SECONDS = launchPlans.plans.plus.voiceNoteSeconds;
export const RECORDING_SECONDS = FREE_VOICE_SECONDS;
export const EVALUATION_RECORDING_SECONDS = 180;
export const RECORDING_BYTES = 8 * 1024 * 1024;
// Vercel function bodies stop at 4.5 MB. Local recording still allows 8 MB.
// Hosted voice must not send that larger cap through a function body.
export const HOSTED_FUNCTION_BODY_BYTES = 4_500_000;

/** Customer recordings use the Free length. A browser cannot ask for Plus. */
export function voiceNoteLimitSeconds(env?: {
  LOCAL_VOICE_TESTING?: string;
  LOCAL_AI_BUDGET?: string;
  SITE_URL?: string;
  CASHNARRA_VOICE_PLUS_DURATION?: string;
}) {
  const source = env ?? {
    LOCAL_VOICE_TESTING: process.env.LOCAL_VOICE_TESTING,
    LOCAL_AI_BUDGET: process.env.LOCAL_AI_BUDGET,
    SITE_URL: process.env.SITE_URL,
    CASHNARRA_VOICE_PLUS_DURATION: process.env.CASHNARRA_VOICE_PLUS_DURATION,
  };
  const local =
    source.LOCAL_VOICE_TESTING === "true" &&
    source.LOCAL_AI_BUDGET === "true" &&
    /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(source.SITE_URL || "");
  if (local && source.CASHNARRA_VOICE_PLUS_DURATION === "true")
    return PLUS_VOICE_SECONDS;
  return FREE_VOICE_SECONDS;
}
