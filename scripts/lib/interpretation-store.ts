import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

export const PROMPT_VERSION = "story-2026-10-21-suggestion";

const record = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("submitted"),
      reservationId: z.string().uuid(),
    })
    .strict(),
  z
    .object({
      status: z.literal("uncertain"),
      reservationId: z.string().uuid(),
    })
    .strict(),
  z
    .object({
      status: z.literal("released"),
      reason: z.string().min(1).max(80),
    })
    .strict(),
  z
    .object({
      status: z.literal("received"),
      result: z.unknown(),
    })
    .strict(),
  z
    .object({
      status: z.literal("ready"),
      result: z.unknown(),
    })
    .strict(),
  z
    .object({
      status: z.literal("unusable"),
    })
    .strict(),
]);
export type OperationRecord = z.infer<typeof record>;

export function operationKey(parts: {
  workspaceId: string;
  text: string;
  date: string;
  mode: string;
  replaceIds: string[];
  accounts: { id: string; name: string; type: string }[];
  obligations: { id: string; party: string; remaining: string }[];
  model: string;
}) {
  const body = JSON.stringify({
    prompt: PROMPT_VERSION,
    workspaceId: parts.workspaceId,
    text: parts.text,
    date: parts.date,
    mode: parts.mode,
    replaceIds: [...parts.replaceIds].sort(),
    accounts: [...parts.accounts].sort((a, b) => a.id.localeCompare(b.id)),
    obligations: [...parts.obligations].sort((a, b) => a.id.localeCompare(b.id)),
    model: parts.model,
  });
  return createHash("sha256").update(body).digest("hex");
}

function pathFor(directory: string, key: string, folder = "operations") {
  if (!/^[a-f0-9]{64}$/.test(key)) throw new Error("Invalid operation.");
  if (folder !== "operations" && folder !== "transcripts")
    throw new Error("Invalid operation.");
  return join(directory, folder, `${key}.json`);
}

export async function readOperation(
  directory: string,
  key: string,
  folder = "operations",
) {
  try {
    return record.parse(
      JSON.parse(await readFile(pathFor(directory, key, folder), "utf8")),
    );
  } catch (error) {
    const missing =
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "ENOENT";
    if (missing) return null;
    throw new Error("Stored interpretation cannot be read.");
  }
}

export async function writeOperation(
  directory: string,
  key: string,
  value: OperationRecord,
  folder = "operations",
) {
  const target = pathFor(directory, key, folder);
  await mkdir(join(directory, folder), { recursive: true });
  const temporary = `${target}.tmp`;
  await writeFile(temporary, JSON.stringify(record.parse(value)) + "\n", {
    mode: 0o600,
  });
  await rename(temporary, target);
}
