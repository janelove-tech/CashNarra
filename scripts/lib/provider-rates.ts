// Published gpt-6-luna Standard prices, checked 2026-10-21.
// Short context is a prompt of at most 272,000 input tokens: ordinary input
// US$0.10 / million, cached input US$0.01 / million, 30-minute cache writes
// US$0.125 / million, and output US$0.50 / million. Output already includes
// reasoning tokens. A longer prompt uses the long-context rates for the whole
// request: input US$0.20, cached input US$0.02, cache writes US$0.25, and
// output US$0.75, each per million tokens. The 8,000/4,000 envelope is only
// the local hold for one ordinary story.

export const LUNA_RATE = "gpt-6-luna-standard-2026-10-21";
export const WHISPER_RATE = "whisper-1-minute-2026-10-21";
export const LUNA_SHORT_INPUT_LIMIT = 272_000;
export const LUNA_INPUT_PER_MILLION = 100_000;
export const LUNA_CACHED_INPUT_PER_MILLION = 10_000;
export const LUNA_OUTPUT_PER_MILLION = 500_000;
export const LUNA_CACHE_WRITE_30_PER_MILLION = 125_000;
export const LUNA_LONG_INPUT_PER_MILLION = 200_000;
export const LUNA_LONG_CACHED_INPUT_PER_MILLION = 20_000;
export const LUNA_LONG_OUTPUT_PER_MILLION = 750_000;
export const LUNA_LONG_CACHE_WRITE_30_PER_MILLION = 250_000;
export const ENVELOPE_INPUT_TOKENS = 8_000;
export const ENVELOPE_OUTPUT_TOKENS = 4_000;
export const WHISPER_MINUTE_MICROS = 6_000;
// Groq speech-to-text prices checked 2026-10-21. Turbo is US$0.04 per audio
// hour. whisper-large-v3 is US$0.111 per audio hour. Billing has a 10-second
// minimum. These are admission estimates, not reconciled invoices.
export const GROQ_TURBO_MODEL = "whisper-large-v3-turbo";
export const GROQ_FULL_MODEL = "whisper-large-v3";
export const GROQ_TURBO_RATE = "groq-whisper-large-v3-turbo-2026-10-21";
export const GROQ_FULL_RATE = "groq-whisper-large-v3-2026-10-21";
export const GROQ_TURBO_HOUR_MICROS = 40_000;
export const GROQ_FULL_HOUR_MICROS = 111_000;
export const GROQ_MIN_BILLED_SECONDS = 10;
export const GROQ_PROMPT_TOKENS = 224;
export const GROQ_MODELS = {
  [GROQ_TURBO_MODEL]: {
    rate: GROQ_TURBO_RATE,
    hourMicros: GROQ_TURBO_HOUR_MICROS,
  },
  [GROQ_FULL_MODEL]: {
    rate: GROQ_FULL_RATE,
    hourMicros: GROQ_FULL_HOUR_MICROS,
  },
} as const;
export type GroqModel = keyof typeof GROQ_MODELS;
export type ReserveRate =
  | typeof LUNA_RATE
  | typeof WHISPER_RATE
  | typeof GROQ_TURBO_RATE
  | typeof GROQ_FULL_RATE;

export type TokenUsage = {
  input: number;
  output: number;
  cached: number;
  cacheWrite: number;
  reasoning: number;
};

function assertCount(value: number) {
  if (!Number.isSafeInteger(value) || value < 0)
    throw new Error("Unrecognised usage; retain reservation and stop.");
}

export function combinedMicros(parts: Array<[number, number]>) {
  let product = 0;
  for (const [tokens, perMillion] of parts) {
    assertCount(tokens);
    assertCount(perMillion);
    product += tokens * perMillion;
  }
  return Math.ceil(product / 1_000_000);
}

export function lunaUsageMicros(usage: TokenUsage) {
  assertCount(usage.input);
  assertCount(usage.output);
  assertCount(usage.cached);
  assertCount(usage.cacheWrite);
  assertCount(usage.reasoning);
  if (usage.cacheWrite + usage.cached > usage.input)
    throw new Error("Cache tokens are not a subset of input usage.");
  if (usage.reasoning > usage.output)
    throw new Error("Reasoning tokens are not a subset of output usage.");
  const long = usage.input > LUNA_SHORT_INPUT_LIMIT;
  const ordinary = usage.input - usage.cacheWrite - usage.cached;
  return combinedMicros([
    [ordinary, long ? LUNA_LONG_INPUT_PER_MILLION : LUNA_INPUT_PER_MILLION],
    [
      usage.cached,
      long ? LUNA_LONG_CACHED_INPUT_PER_MILLION : LUNA_CACHED_INPUT_PER_MILLION,
    ],
    [
      usage.cacheWrite,
      long
        ? LUNA_LONG_CACHE_WRITE_30_PER_MILLION
        : LUNA_CACHE_WRITE_30_PER_MILLION,
    ],
    [usage.output, long ? LUNA_LONG_OUTPUT_PER_MILLION : LUNA_OUTPUT_PER_MILLION],
  ]);
}

// Candidate envelope from the 2026-10-21 cost audit: 8,000 input tokens priced
// as 30-minute cache writes, 4,000 output tokens, then 20% headroom rounded
// up to the next thousand microdollars. This is the local hold for one
// bounded Luna request, not a universal price.
export function envelopeReserveMicros() {
  const raw = combinedMicros([
    [ENVELOPE_INPUT_TOKENS, LUNA_CACHE_WRITE_30_PER_MILLION],
    [ENVELOPE_OUTPUT_TOKENS, LUNA_OUTPUT_PER_MILLION],
  ]);
  return Math.ceil((Math.ceil(raw * 1.2)) / 1000) * 1000;
}

export function whisperReserveMicros(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 180)
    throw new Error("Unrecognised audio duration; retain reservation and stop.");
  return Math.ceil(seconds / 60) * WHISPER_MINUTE_MICROS;
}

export function groqModel(model: string): GroqModel {
  if (model !== GROQ_TURBO_MODEL && model !== GROQ_FULL_MODEL)
    throw new Error("Unknown transcription model; stop before spending.");
  return model;
}

export function groqBillableSeconds(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 180)
    throw new Error("Unrecognised audio duration; retain reservation and stop.");
  return Math.max(GROQ_MIN_BILLED_SECONDS, seconds);
}

// Ceil to the next microdollar. A 45-second Turbo clip is exactly US$0.0005.
// A fractional full-model clip rounds upward rather than under-reserving.
export function groqReserveMicros(model: string, seconds: number) {
  const selected = GROQ_MODELS[groqModel(model)];
  return Math.ceil(
    (groqBillableSeconds(seconds) * selected.hourMicros) / 3600,
  );
}
