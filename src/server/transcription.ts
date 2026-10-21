import { createHash } from "node:crypto";
import {
  GROQ_PROMPT_TOKENS,
  groqBillableSeconds,
  groqModel,
  groqReserveMicros,
  type GroqModel,
} from "../../scripts/lib/provider-rates";

export const GROQ_TRANSCRIPTIONS_URL =
  "https://api.groq.com/openai/v1/audio/transcriptions";

const fixedSpelling = ["cedis", "pesewas", "MoMo", "MTN", "Telecel"];

// Over-counts ordinary English so a glossary cannot silently exceed Groq's
// 224-token prompt. This is a local bound, not a claim about the tokenizer.
export function estimatePromptTokens(text: string) {
  const parts = text.split(/[\s,]+/).filter(Boolean);
  return parts.reduce(
    (sum, part) => sum + Math.max(1, Math.ceil(part.length / 3)),
    0,
  );
}

export function spellingGlossary(names: string[]) {
  const terms = [...fixedSpelling];
  const seen = new Set(terms.map((term) => term.toLowerCase()));
  for (const name of names) {
    const trimmed = name.trim().replace(/\s+/g, " ");
    if (!/^[A-Za-z][A-Za-z .'-]{0,39}$/.test(trimmed)) continue;
    if (trimmed.split(" ").length > 3) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    terms.push(trimmed);
  }
  const kept: string[] = [];
  for (const term of terms) {
    const next = [...kept, term].join(", ");
    if (estimatePromptTokens(next) > GROQ_PROMPT_TOKENS) break;
    kept.push(term);
  }
  return kept.join(", ");
}

export type TranscriptResult = {
  text: string;
  durationSeconds: number;
  provider: "groq";
  model: GroqModel;
  responseId: string | null;
  usage: {
    billedSeconds: number;
    estimatedMicros: number;
    reconciled: false;
  };
  segments?: { start: number; end: number; text: string }[];
};

export function normalizeGroqTranscript(
  raw: unknown,
  durationSeconds: number,
  model: string,
): TranscriptResult {
  const selected = groqModel(model);
  if (!raw || typeof raw !== "object")
    throw new Error("No usable words came back. Try again or type the words yourself.");
  const body = raw as {
    text?: unknown;
    id?: unknown;
    x_groq?: { id?: unknown };
    segments?: unknown;
  };
  if (typeof body.text !== "string" || !body.text.trim() || body.text.length > 12000)
    throw new Error("No usable words came back. Try again or type the words yourself.");
  const responseId =
    typeof body.x_groq?.id === "string"
      ? body.x_groq.id
      : typeof body.id === "string"
        ? body.id
        : null;
  const segments = Array.isArray(body.segments)
    ? body.segments.flatMap((segment) => {
        if (!segment || typeof segment !== "object") return [];
        const item = segment as { start?: unknown; end?: unknown; text?: unknown };
        if (
          typeof item.start !== "number" ||
          typeof item.end !== "number" ||
          typeof item.text !== "string"
        )
          return [];
        return [{ start: item.start, end: item.end, text: item.text }];
      })
    : undefined;
  return {
    text: body.text,
    durationSeconds,
    provider: "groq",
    model: selected,
    responseId,
    usage: {
      billedSeconds: groqBillableSeconds(durationSeconds),
      estimatedMicros: groqReserveMicros(selected, durationSeconds),
      reconciled: false,
    },
    ...(segments && segments.length ? { segments } : {}),
  };
}

export function recordingHash(bytes: Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex");
}

export async function postGroqTranscription(options: {
  apiKey: string;
  file: Blob;
  model: GroqModel;
  prompt: string;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
}) {
  if (options.apiKey.trim().length < 8)
    throw new Error("Transcription is not configured. Use text instead.");
  const body = new FormData();
  body.set("file", options.file);
  body.set("model", options.model);
  body.set("temperature", "0");
  body.set("response_format", "verbose_json");
  if (options.prompt) body.set("prompt", options.prompt);
  const response = await (options.fetchImpl ?? fetch)(GROQ_TRANSCRIPTIONS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${options.apiKey}` },
    body,
    signal: options.signal,
  });
  if (!response.ok) {
    let code = "";
    try {
      const payload = (await response.json()) as { error?: { code?: string } };
      code = payload.error?.code ?? "";
    } catch {
      code = "";
    }
    throw { status: response.status, code };
  }
  return response.json();
}
