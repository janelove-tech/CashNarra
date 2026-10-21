import { afterEach, expect, it, vi } from "vitest";
import { localVoiceTesting, voiceAvailable } from "../src/server/voice-access";
afterEach(() => vi.unstubAllEnvs());
it("permits explicit local testing without claiming production quality approval", () => {
  vi.stubEnv("VOICE_ENABLED", "true");
  vi.stubEnv("OPENAI_API_KEY", "test-only");
  vi.stubEnv("VOICE_QUALITY_APPROVED", "false");
  vi.stubEnv("LOCAL_AI_BUDGET", "true");
  vi.stubEnv("LOCAL_VOICE_TESTING", "true");
  vi.stubEnv("SITE_URL", "http://127.0.0.1:3100");
  expect(voiceAvailable()).toBe(true);
  vi.stubEnv("SITE_URL", "https://example.com");
  expect(localVoiceTesting()).toBe(false);
  expect(voiceAvailable()).toBe(false);
  vi.stubEnv("SITE_URL", "http://localhost:3100");
  vi.stubEnv("LOCAL_AI_BUDGET", "false");
  expect(voiceAvailable()).toBe(false);
});
it("does not treat a Groq key as permission to transcribe outside local testing", () => {
  vi.stubEnv("VOICE_ENABLED", "true");
  vi.stubEnv("VOICE_QUALITY_APPROVED", "true");
  vi.stubEnv("TRANSCRIPTION_PROVIDER", "groq");
  vi.stubEnv("GROQ_API_KEY", "test-only");
  expect(voiceAvailable()).toBe(false);
  vi.stubEnv("LOCAL_AI_BUDGET", "true");
  vi.stubEnv("LOCAL_VOICE_TESTING", "true");
  vi.stubEnv("SITE_URL", "http://127.0.0.1:3100");
  expect(voiceAvailable()).toBe(true);
});
