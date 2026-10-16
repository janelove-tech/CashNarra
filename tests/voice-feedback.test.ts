import { it, expect } from "vitest";
import { microphoneError, transcriptText } from "../src/lib/voice";
it("explains permission, missing and busy microphones without exposing device details", () => {
  for (const [name, phrase] of [
    ["NotAllowedError", "not allowed"],
    ["NotFoundError", "No microphone"],
    ["NotReadableError", "another app"],
  ]) {
    const error = new Error("private device name");
    error.name = name;
    expect(microphoneError(error)).toContain(phrase);
    expect(microphoneError(error)).not.toContain("private device");
  }
});
it("requires nonempty bounded transcript words rather than trusting arbitrary responses", () => {
  expect(transcriptText({ text: "I received GH₵20." })).toBe(
    "I received GH₵20.",
  );
  for (const value of [
    null,
    {},
    { text: " " },
    { text: 42 },
    { text: "a".repeat(12001) },
  ])
    expect(() => transcriptText(value)).toThrow("No usable words");
});
