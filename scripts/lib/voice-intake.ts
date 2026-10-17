import { z } from "zod";

const opaque = z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/);
export const voiceManifest = z
  .object({
    version: z.literal(1),
    clips: z
      .array(
        z
          .object({
            id: opaque,
            speakerId: opaque,
            deviceId: opaque,
            browser: z.string().min(1).max(80),
            corpusId: opaque,
            file: z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}\.webm$/),
            consentFile: z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}\.json$/),
            consent: z
              .object({
                syntheticStoriesOnly: z.literal(true),
                localEvaluation: z.literal(true),
                providerTranscription: z.literal(true),
                recordedOn: z.iso.date(),
                deleteOn: z.iso.date(),
              })
              .strict(),
            accent: z.literal("Ghanaian English"),
            speed: z.enum(["normal", "fast"]),
            noise: z.enum(["quiet", "background"]),
          })
          .strict(),
      )
      .min(1)
      .max(500),
  })
  .strict();

export function validateVoiceManifest(
  input: unknown,
  corpusIds: string[],
  today: string,
) {
  z.iso.date().parse(today);
  const manifest = voiceManifest.parse(input);
  const ids = new Set<string>(),
    files = new Set<string>();
  for (const clip of manifest.clips) {
    if (ids.has(clip.id) || files.has(clip.file))
      throw new Error("Repeated clip or file");
    ids.add(clip.id);
    files.add(clip.file);
    if (!corpusIds.includes(clip.corpusId))
      throw new Error("Unknown synthetic story");
    if (
      clip.consent.recordedOn > today ||
      clip.consent.deleteOn <= today ||
      clip.consent.deleteOn <= clip.consent.recordedOn
    )
      throw new Error("Consent dates need review");
  }
  const speakers = new Set(manifest.clips.map((c) => c.speakerId));
  const devices = new Set(manifest.clips.map((c) => c.deviceId));
  const gaps: string[] = [];
  if (speakers.size < 5)
    gaps.push("At least five consenting speakers required");
  if (devices.size < 2) gaps.push("Multiple recording devices required");
  for (const id of corpusIds)
    if (!manifest.clips.some((c) => c.corpusId === id))
      gaps.push(`Missing story: ${id}`);
  // Each speaker needs both delivery speeds and both noise conditions.
  for (const speaker of speakers) {
    const clips = manifest.clips.filter((c) => c.speakerId === speaker);
    if (
      new Set(clips.map((c) => c.speed)).size < 2 ||
      new Set(clips.map((c) => c.noise)).size < 2
    )
      gaps.push(`Incomplete conditions: ${speaker}`);
  }
  return { manifest, gaps, speakers: speakers.size, devices: devices.size };
}
