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
  return (
    process.env.VOICE_ENABLED === "true" &&
    !!process.env.OPENAI_API_KEY &&
    (process.env.VOICE_QUALITY_APPROVED === "true" || localVoiceTesting())
  );
}
