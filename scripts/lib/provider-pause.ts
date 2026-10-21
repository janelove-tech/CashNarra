import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const reasons = [
  "billing_rejected",
  "auth_rejected",
  "unpriced",
  "model_mismatch",
  "spend_cap",
] as const;
export type PauseReason = (typeof reasons)[number];

const pauseFile = { openai: "provider-pause.json", groq: "groq-pause.json" } as const;
export type PauseScope = keyof typeof pauseFile;

export async function readProviderPause(
  directory: string,
  scope: PauseScope = "openai",
) {
  try {
    const parsed = JSON.parse(
      await readFile(join(directory, pauseFile[scope]), "utf8"),
    ) as { reason?: string; resolvedAt?: string };
    if (typeof parsed.resolvedAt === "string" && parsed.resolvedAt)
      return null;
    if (!reasons.includes(parsed.reason as PauseReason)) return "unpriced";
    return parsed.reason as PauseReason;
  } catch (error) {
    const missing =
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "ENOENT";
    if (missing) return null;
    return "unpriced";
  }
}

export async function writeProviderPause(
  directory: string,
  reason: PauseReason,
  scope: PauseScope = "openai",
) {
  await writeFile(
    join(directory, pauseFile[scope]),
    JSON.stringify({ reason, at: new Date().toISOString() }) + "\n",
    { mode: 0o600 },
  );
}

export async function resolveProviderPause(
  directory: string,
  reason: PauseReason,
  recoveryId: string,
  scope: PauseScope = "openai",
) {
  const path = join(directory, pauseFile[scope]);
  let parsed: { reason?: string; resolvedAt?: string; at?: string };
  try {
    parsed = JSON.parse(await readFile(path, "utf8"));
  } catch {
    return;
  }
  if (parsed.resolvedAt || parsed.reason !== reason) return;
  await writeFile(
    join(directory, `${scope}-pause-history.jsonl`),
    JSON.stringify({
      ...parsed,
      archivedAt: new Date().toISOString(),
      recoveryId,
    }) + "\n",
    { flag: "a", mode: 0o600 },
  );
  await writeFile(
    path,
    JSON.stringify({
      ...parsed,
      resolvedAt: new Date().toISOString(),
      recoveryId,
    }) + "\n",
    { mode: 0o600 },
  );
}
