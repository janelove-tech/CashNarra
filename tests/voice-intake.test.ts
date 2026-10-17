import { expect, it } from "vitest";
import { validateVoiceManifest } from "../scripts/lib/voice-intake";

const clip = {
  id: "clip-1",
  speakerId: "speaker-1",
  deviceId: "device-1",
  browser: "Edge",
  corpusId: "cash-sale",
  file: "clip-1.webm",
  consentFile: "consent-1.json",
  consent: {
    syntheticStoriesOnly: true,
    localEvaluation: true,
    providerTranscription: true,
    recordedOn: "2026-10-16",
    deleteOn: "2026-11-16",
  },
  accent: "Ghanaian English",
  speed: "normal",
  noise: "quiet",
};
const check = (clips: unknown[]) =>
  validateVoiceManifest({ version: 1, clips }, ["cash-sale"], "2026-10-17");
it("does not treat a valid single clip as representative coverage", () => {
  expect(check([clip]).gaps).toHaveLength(3);
});
it("rejects traversal, repeated files, unknown stories and expired or unapproved consent", () => {
  for (const bad of [
    { ...clip, file: "../secret.webm" },
    { ...clip, corpusId: "other" },
    { ...clip, consent: { ...clip.consent, providerTranscription: false } },
    { ...clip, consent: { ...clip.consent, deleteOn: "2026-10-17" } },
    { ...clip, consent: { ...clip.consent, recordedOn: "2026-10-18" } },
  ])
    expect(() => check([bad])).toThrow();
  expect(() => check([clip, { ...clip, id: "clip-2" }])).toThrow();
});
it("reports complete metadata coverage without claiming transcription quality", () => {
  const clips = Array.from({ length: 10 }, (_, i) => ({
    ...clip,
    id: `clip-${i}`,
    file: `clip-${i}.webm`,
    speakerId: `speaker-${Math.floor(i / 2)}`,
    deviceId: `device-${i % 2}`,
    speed: i % 2 ? "fast" : "normal",
    noise: i % 2 ? "background" : "quiet",
  }));
  expect(check(clips).gaps).toEqual([]);
  expect(check(clips).speakers).toBe(5);
});
