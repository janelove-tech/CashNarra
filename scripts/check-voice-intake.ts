// Offline only. This command never loads keys, contacts a provider or grants quality approval.
import { readFile, realpath, stat } from "node:fs/promises";
import { resolve, relative, isAbsolute, join } from "node:path";
import { validateVoiceManifest } from "./lib/voice-intake";
import { validateRecording } from "../src/server/recording";

async function main() {
  if (process.argv.length !== 2)
    throw new Error("Use the fixed private intake directory");
  const root = await realpath(resolve(".local/voice-evaluation"));
  async function privateFile(name: string, maxBytes: number) {
    const path = await realpath(join(root, name));
    const rel = relative(root, path);
    if (rel.startsWith("..") || isAbsolute(rel))
      throw new Error("File outside intake directory");
    const info = await stat(path);
    if (!info.isFile() || info.size < 1 || info.size > maxBytes)
      throw new Error("File size invalid");
    const bytes = await readFile(path);
    if (bytes.length > maxBytes) throw new Error("File size changed");
    return bytes;
  }
  const corpus = JSON.parse(
    await readFile("harness/context/02-narration-corpus.json", "utf8"),
  ) as { id: string }[];
  const intake = validateVoiceManifest(
    JSON.parse((await privateFile("manifest.json", 1_000_000)).toString()),
    corpus.map((c) => c.id),
    new Date().toISOString().slice(0, 10),
  );
  for (const clip of intake.manifest.clips) {
    await privateFile(clip.consentFile, 100_000);
    validateRecording(
      await privateFile(clip.file, 3 * 1024 * 1024),
      "audio/webm",
    );
  }
  console.log(
    JSON.stringify(
      {
        intake: intake.gaps.length
          ? "INCOMPLETE"
          : "METADATA AND FILE CHECKS PASS",
        clips: intake.manifest.clips.length,
        speakers: intake.speakers,
        devices: intake.devices,
        gaps: intake.gaps,
        quality: "NOT RUN",
        consent: "Human review of private consent evidence still required",
        providerCalls: 0,
      },
      null,
      2,
    ),
  );
  if (intake.gaps.length) process.exitCode = 1;
}
main().catch(() => {
  console.error(
    "Voice intake NOT READY. Check the private manifest, consent dates/evidence, file paths and supported WebM recordings. No provider calls made; no private contents printed.",
  );
  process.exitCode = 1;
});
