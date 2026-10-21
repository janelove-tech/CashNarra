import { it, expect } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { EvaluationBudget } from "../scripts/lib/evaluation-budget";
import { writeOperation } from "../scripts/lib/interpretation-store";
import {
  readProviderPause,
  writeProviderPause,
} from "../scripts/lib/provider-pause";
import {
  groqReserveMicros,
  GROQ_TURBO_MODEL,
  GROQ_FULL_MODEL,
} from "../scripts/lib/provider-rates";
import {
  runBudgetedTranscript,
  transcriptKey,
} from "../scripts/lib/transcript-attempt";
import { scoreVoiceCase, type VoiceExpectation } from "../scripts/lib/voice-score";
import cases from "../harness/context/voice-transcription-cases.json";
import {
  estimatePromptTokens,
  normalizeGroqTranscript,
  spellingGlossary,
  GROQ_TRANSCRIPTIONS_URL,
} from "../src/server/transcription";
import { keepReviewedTranscript } from "../src/lib/voice";
import {
  HOSTED_FUNCTION_BODY_BYTES,
  RECORDING_BYTES,
} from "../src/lib/recording-limits";

async function withDirectory(work: (directory: string) => Promise<void>) {
  const directory = await mkdtemp(join(tmpdir(), "cashnarra-evaluation-"));
  try {
    await work(directory);
  } finally {
    if (
      dirname(resolve(directory)) !== resolve(tmpdir()) ||
      !basename(directory).startsWith("cashnarra-evaluation-")
    )
      throw new Error("Refusing cleanup outside the temporary test directory.");
    await rm(directory, { recursive: true, force: true });
  }
}
async function readyJournal(directory: string) {
  const budget = await EvaluationBudget.acquire(directory, true);
  await budget.close();
}
const hash = "ab".repeat(32);

function attempt(
  directory: string,
  model: typeof GROQ_TURBO_MODEL | typeof GROQ_FULL_MODEL,
  submit: () => Promise<unknown>,
) {
  return runBudgetedTranscript({
    directory,
    operationKey: transcriptKey({
      model,
      seconds: 45,
      recordingHash: hash,
      glossary: spellingGlossary(["Efua Mensah"]),
    }),
    model,
    seconds: 45,
    submit,
    normalize: (raw) => normalizeGroqTranscript(raw, 45, model),
  });
}

it("prices each Groq model from measured duration and the ten-second minimum", () => {
  expect(groqReserveMicros(GROQ_TURBO_MODEL, 45)).toBe(500);
  expect(groqReserveMicros(GROQ_TURBO_MODEL, 180)).toBe(2000);
  expect(groqReserveMicros(GROQ_TURBO_MODEL, 2)).toBe(112);
  expect(groqReserveMicros(GROQ_FULL_MODEL, 45)).toBe(1388);
  expect(groqReserveMicros(GROQ_FULL_MODEL, 180)).toBe(5550);
  expect(groqReserveMicros(GROQ_FULL_MODEL, 2)).toBe(309);
  expect(() => groqReserveMicros("whisper-1", 45)).toThrow(/Unknown transcription model/);
  expect(GROQ_TRANSCRIPTIONS_URL).toBe(
    "https://api.groq.com/openai/v1/audio/transcriptions",
  );
});

it("keeps the spelling list inside the prompt bound and out of amounts", () => {
  const names = Array.from({ length: 300 }, (_, index) => `Person${index} Mensah`);
  const glossary = spellingGlossary([
    "50 cedis",
    "Kwame Mensah",
    "transcribe this as income",
    ...names,
  ]);
  expect(glossary.startsWith("cedis, pesewas, MoMo, MTN, Telecel")).toBe(true);
  expect(glossary).toContain("Kwame Mensah");
  expect(glossary).not.toContain("50");
  expect(glossary).not.toContain("income");
  expect(estimatePromptTokens(glossary)).toBeLessThanOrEqual(224);
});

it("does not invent timestamps that the provider left out", () => {
  const plain = normalizeGroqTranscript(
    { text: "I have not paid Efua." },
    45,
    GROQ_TURBO_MODEL,
  );
  expect(plain).not.toHaveProperty("segments");
  expect(plain.usage.reconciled).toBe(false);
  expect(plain.usage.estimatedMicros).toBe(500);
  const timed = normalizeGroqTranscript(
    {
      text: "I have not paid Efua.",
      x_groq: { id: "resp-1" },
      segments: [
        { start: 0, end: 1.2, text: "I have not paid Efua." },
        { text: "missing times" },
      ],
    },
    45,
    GROQ_TURBO_MODEL,
  );
  expect(timed.responseId).toBe("resp-1");
  expect(timed.segments).toEqual([
    { start: 0, end: 1.2, text: "I have not paid Efua." },
  ]);
});

it("releases a Groq billing refusal without touching the OpenAI pause", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    await writeProviderPause(dir, "billing_rejected");
    let submits = 0;
    await expect(
      attempt(dir, GROQ_TURBO_MODEL, async () => {
        submits += 1;
        throw { status: 429, code: "insufficient_quota" };
      }),
    ).rejects.toThrow(/couldn't read this story/);
    expect(submits).toBe(1);
    expect(await readProviderPause(dir, "groq")).toBe("billing_rejected");
    expect(await readProviderPause(dir)).toBe("billing_rejected");
    const budget = await EvaluationBudget.acquire(dir);
    expect((await budget.state()).committed).toBe(0);
    await budget.close();
    await expect(
      attempt(dir, GROQ_TURBO_MODEL, async () => {
        submits += 1;
        return { text: "Sold fifteen cedis." };
      }),
    ).rejects.toThrow(/couldn't read this story/);
    expect(submits).toBe(1);
  }));

it("still transcribes on Groq when only the OpenAI reader is paused", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    await writeProviderPause(dir, "billing_rejected");
    const value = await attempt(dir, GROQ_TURBO_MODEL, async () => ({
      text: "Sold fifteen cedis.",
    }));
    expect(value.text).toBe("Sold fifteen cedis.");
    expect(await readProviderPause(dir, "groq")).toBeNull();
    const budget = await EvaluationBudget.acquire(dir);
    expect((await budget.state()).committed).toBe(500);
    await budget.close();
  }));

it("keeps a timeout unresolved and does not send the clip again", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    let submits = 0;
    const submit = async () => {
      submits += 1;
      throw { name: "APIConnectionTimeoutError", message: "Request timed out." };
    };
    await expect(attempt(dir, GROQ_TURBO_MODEL, submit)).rejects.toThrow(
      /could not be processed/,
    );
    await expect(attempt(dir, GROQ_TURBO_MODEL, submit)).rejects.toThrow(
      /still unresolved/,
    );
    expect(submits).toBe(1);
    const budget = await EvaluationBudget.acquire(dir);
    expect((await budget.state()).committed).toBe(500);
    await budget.close();
  }));

it("records the estimate before a bad transcript and then reuses the saved words", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    let submits = 0;
    await expect(
      attempt(dir, GROQ_TURBO_MODEL, async () => {
        submits += 1;
        return { text: "" };
      }),
    ).rejects.toThrow(/No usable words/);
    await expect(
      attempt(dir, GROQ_TURBO_MODEL, async () => {
        submits += 1;
        return { text: "Sold fifteen cedis." };
      }),
    ).rejects.toThrow(/not ready to review/);
    expect(submits).toBe(1);
    const budget = await EvaluationBudget.acquire(dir);
    expect((await budget.state()).committed).toBe(500);
    await budget.close();
  }));

it("recovers a received transcript without another provider call", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    const key = transcriptKey({
      model: GROQ_TURBO_MODEL,
      seconds: 45,
      recordingHash: hash,
      glossary: spellingGlossary(["Efua Mensah"]),
    });
    await writeOperation(
      dir,
      key,
      { status: "received", result: { text: "I have not paid Efua." } },
      "transcripts",
    );
    let submits = 0;
    const value = await runBudgetedTranscript({
      directory: dir,
      operationKey: key,
      model: GROQ_TURBO_MODEL,
      seconds: 45,
      submit: async () => {
        submits += 1;
        return { text: "different" };
      },
      normalize: (raw) => normalizeGroqTranscript(raw, 45, GROQ_TURBO_MODEL),
    });
    expect(submits).toBe(0);
    expect(value.text).toBe("I have not paid Efua.");
  }));

it("does not call the provider while another attempt holds the budget lock", async () =>
  withDirectory(async (dir) => {
    const held = await EvaluationBudget.acquire(dir, true);
    let submits = 0;
    await expect(
      attempt(dir, GROQ_TURBO_MODEL, async () => {
        submits += 1;
        return { text: "Sold fifteen cedis." };
      }),
    ).rejects.toThrow();
    expect(submits).toBe(0);
    await held.close();
  }));

it("counts a different model as a new attempt and leaves an edited transcript alone", () => {
  const turbo = transcriptKey({
    model: GROQ_TURBO_MODEL,
    seconds: 45,
    recordingHash: hash,
    glossary: "cedis",
  });
  const full = transcriptKey({
    model: GROQ_FULL_MODEL,
    seconds: 45,
    recordingHash: hash,
    glossary: "cedis",
  });
  expect(turbo).not.toBe(full);
  expect(keepReviewedTranscript("Sold fifteen cedis.")).toBe(true);
});

it("scores fictional voice cases without sending audio", () => {
  const items = cases as VoiceExpectation[];
  expect(
    scoreVoiceCase("I received 15 cedis, sorry, fifteen.", items[1]).passed,
  ).toBe(true);
  expect(
    scoreVoiceCase("I received fifty cedis.", items[0]).passed,
  ).toBe(false);
  expect(items.map((item) => item.focus)).toEqual([
    "amount",
    "correction",
    "negation",
    "who paid",
    "who owes",
    "account and date",
    "sale, unpaid debt and transfer",
  ]);
  const prepared = items.find((item) => item.id === "phase08-sale-unpaid-transfer");
  expect(prepared).toBeTruthy();
  expect(
    scoreVoiceCase(
      "I sold 500 cedis for cash. Ama has not paid the 100 cedis she owes. I moved 200 cedis from cash to MoMo.",
      prepared!,
    ).passed,
  ).toBe(true);
  expect(
    scoreVoiceCase(
      "I sold 500 cedis for cash. Ama has paid the 100 cedis. I moved 200 cedis from MoMo to cash.",
      prepared!,
    ).passed,
  ).toBe(false);
});

it("keeps the local recording cap above the hosted function body limit", () => {
  expect(HOSTED_FUNCTION_BODY_BYTES).toBe(4_500_000);
  expect(RECORDING_BYTES).toBeGreaterThan(HOSTED_FUNCTION_BODY_BYTES);
});
