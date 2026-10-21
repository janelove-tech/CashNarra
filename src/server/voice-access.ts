export function localVoiceTesting() {
  return (
    process.env.LOCAL_VOICE_TESTING === "true" &&
    process.env.LOCAL_AI_BUDGET === "true" &&
    /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(
      process.env.SITE_URL || "",
    )
  );
}
export function voiceAvailable() {
  const enabled = process.env.VOICE_ENABLED === "true";
  const approved =
    process.env.VOICE_QUALITY_APPROVED === "true" || localVoiceTesting();
  if (!enabled || !approved) return false;
  // Groq stays unavailable outside the local budget until hosted admission
  // exists. Quality approval alone does not send recordings there.
  if (process.env.TRANSCRIPTION_PROVIDER === "groq")
    return localVoiceTesting() && !!process.env.GROQ_API_KEY;
  return !!process.env.OPENAI_API_KEY;
}
