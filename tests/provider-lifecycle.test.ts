import { it, expect } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import {
  EvaluationBudget,
  budgetState,
  RESERVATION,
  CEILING,
} from "../scripts/lib/evaluation-budget";
import { operationKey } from "../scripts/lib/interpretation-store";
import {
  classifyProviderFailure,
  STORY_UNUSABLE,
} from "../scripts/lib/provider-outcome";
import { readProviderPause } from "../scripts/lib/provider-pause";
import {
  envelopeReserveMicros,
  lunaUsageMicros,
  whisperReserveMicros,
} from "../scripts/lib/provider-rates";
import { keepReviewedTranscript } from "../src/lib/voice";
import { runBudgetedStory, StoryAttemptError } from "../scripts/lib/story-attempt";

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
const key = "a".repeat(64);
const otherKey = "b".repeat(64);
const usage = {
  input_tokens: 1200,
  output_tokens: 370,
  input_tokens_details: { cached_tokens: 0, cache_write_tokens: 0 },
  output_tokens_details: { reasoning_tokens: 180 },
};

function response(overrides: Record<string, unknown> = {}) {
  return {
    model: "gpt-6-luna",
    status: "completed",
    output: [
      {
        type: "message",
        content: [{ type: "output_text", text: "{\"ok\":true}" }],
      },
    ],
    usage,
    ...overrides,
  };
}

it("prices Luna once, including reasoning inside output and cache writes inside input", () => {
  expect(envelopeReserveMicros()).toBe(4000);
  expect(
    lunaUsageMicros({
      input: 1200,
      output: 370,
      cached: 0,
      cacheWrite: 0,
      reasoning: 180,
    }),
  ).toBe(305);
  expect(
    lunaUsageMicros({
      input: 1200,
      output: 370,
      cached: 0,
      cacheWrite: 0,
      reasoning: 0,
    }),
  ).toBe(305);
  expect(
    lunaUsageMicros({
      input: 1200,
      output: 370,
      cached: 0,
      cacheWrite: 200,
      reasoning: 0,
    }),
  ).toBe(310);
  expect(
    lunaUsageMicros({
      input: 1200,
      output: 370,
      cached: 50,
      cacheWrite: 0,
      reasoning: 0,
    }),
  ).toBe(301);
  expect(
    lunaUsageMicros({
      input: 9000,
      output: 100,
      cached: 0,
      cacheWrite: 0,
      reasoning: 0,
    }),
  ).toBe(950);
  expect(
    lunaUsageMicros({
      input: 272_001,
      output: 1,
      cached: 0,
      cacheWrite: 0,
      reasoning: 0,
    }),
  ).toBe(54401);
  expect(whisperReserveMicros(45)).toBe(6000);
  expect(whisperReserveMicros(61)).toBe(12000);
});

it("releases the hold when the daily allowance stops the call before submission", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    let submits = 0;
    await expect(
      runBudgetedStory({
        directory: dir,
        operationKey: key,
        beforeSubmit: async () => {
          throw new Error(
            "Daily AI allowance reached. Manual recording is available.",
          );
        },
        submit: async () => {
          submits += 1;
          return response();
        },
        accept: async () => ({ usable: true }),
        recover: (result: unknown) => result,
      }),
    ).rejects.toThrow(/Daily AI allowance/);
    expect(submits).toBe(0);
    const budget = await EvaluationBudget.acquire(dir);
    expect((await budget.state()).committed).toBe(0);
    await budget.close();
    expect(await readProviderPause(dir)).toBeNull();
  }));

it("keeps a reviewed transcript instead of sending the clip again", () => {
  expect(keepReviewedTranscript("Sold twenty cedis of cables.")).toBe(true);
  expect(keepReviewedTranscript("  ")).toBe(false);
});

it("changes the operation when the draft or the balances change", () => {
  const base = {
    workspaceId: "workspace",
    text: "I sold cables for cash.",
    date: "2026-10-21",
    mode: "extract",
    replaceIds: [],
    accounts: [{ id: "cash", name: "Cash", type: "cash" }],
    obligations: [] as { id: string; party: string; remaining: string }[],
    model: "gpt-6-luna",
  };
  expect(operationKey(base)).toBe(operationKey(base));
  expect(operationKey({ ...base, text: "I sold chargers for cash." })).not.toBe(
    operationKey(base),
  );
  expect(
    operationKey({
      ...base,
      obligations: [{ id: "debt", party: "Efua", remaining: "20.00" }],
    }),
  ).not.toBe(operationKey(base));
});

it("releases a known refusal, pauses, and does not call the provider again", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    let submits = 0;
    let allowances = 0;
    const options = {
      directory: dir,
      operationKey: key,
      beforeSubmit: async () => {
        allowances += 1;
      },
      submit: async () => {
        submits += 1;
        throw { status: 429, code: "credit_balance_exhausted" };
      },
      accept: async () => ({ usable: true }),
      recover: (result: unknown) => result as { usable: boolean },
    };
    await expect(runBudgetedStory(options)).rejects.toThrow(/couldn't read this story/);
    expect(submits).toBe(1);
    expect(allowances).toBe(1);
    expect(await readProviderPause(dir)).toBe("billing_rejected");
    const budget = await EvaluationBudget.acquire(dir);
    expect((await budget.state()).committed).toBe(0);
    await budget.close();
    await expect(runBudgetedStory({ ...options, operationKey: otherKey })).rejects.toThrow(
      /couldn't read this story/,
    );
    expect(submits).toBe(1);
    expect(allowances).toBe(1);
  }));

it("releases a certificate failure without pausing or keeping the hold", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    await expect(
      runBudgetedStory({
        directory: dir,
        operationKey: key,
        submit: async () => {
          throw { message: "Connection error.", cause: { code: "UNABLE_TO_VERIFY_LEAF_SIGNATURE" } };
        },
        accept: async () => ({ usable: true }),
        recover: (result: unknown) => result,
      }),
    ).rejects.toThrow(/could not reach/);
    expect(await readProviderPause(dir)).toBeNull();
    const budget = await EvaluationBudget.acquire(dir);
    expect((await budget.state()).committed).toBe(0);
    await budget.close();
  }));

it("keeps an uncertain timeout and does not regenerate that operation", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    let submits = 0;
    const submit = async () => {
      submits += 1;
      throw { name: "APIConnectionTimeoutError", message: "Request timed out." };
    };
    await expect(
      runBudgetedStory({
        directory: dir,
        operationKey: key,
        submit,
        accept: async () => ({ usable: true }),
        recover: (result: unknown) => result,
      }),
    ).rejects.toThrow(/could not be processed/);
    await expect(
      runBudgetedStory({
        directory: dir,
        operationKey: key,
        submit,
        accept: async () => ({ usable: true }),
        recover: (result: unknown) => result,
      }),
    ).rejects.toThrow(/still unresolved/);
    expect(submits).toBe(1);
    const budget = await EvaluationBudget.acquire(dir);
    const state = await budget.state();
    expect(state.committed).toBe(envelopeReserveMicros());
    expect([...state.calls.values()][0]?.settled).toBe(false);
    await budget.close();
    expect(classifyProviderFailure({ message: "Connection error." }).kind).toBe(
      "uncertain",
    );
  }));

it("settles usage before a rejected interpretation and does not post it as usable", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    let submits = 0;
    await expect(
      runBudgetedStory({
        directory: dir,
        operationKey: key,
        submit: async () => {
          submits += 1;
          return response({ status: "incomplete" });
        },
        accept: async (raw) => {
          if (raw.status !== "completed") throw new StoryAttemptError(STORY_UNUSABLE);
          return { usable: true };
        },
        recover: (result: unknown) => result as { usable: boolean },
      }),
    ).rejects.toThrow(/not ready to review/);
    await expect(
      runBudgetedStory({
        directory: dir,
        operationKey: key,
        submit: async () => {
          submits += 1;
          return response();
        },
        accept: async () => ({ usable: true }),
        recover: (result: unknown) => result as { usable: boolean },
      }),
    ).rejects.toThrow(/not ready to review/);
    expect(submits).toBe(1);
    const budget = await EvaluationBudget.acquire(dir);
    expect((await budget.state()).committed).toBe(305);
    await budget.close();
  }));

it("returns one stored interpretation for the same draft and a new one after it changes", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    let submits = 0;
    const run = (operationKey: string) =>
      runBudgetedStory({
        directory: dir,
        operationKey,
        submit: async () => {
          submits += 1;
          return response();
        },
        accept: async () => ({ usable: true, token: submits }),
        recover: (result: unknown) => result as { usable: boolean; token: number },
      });
    const first = await run(key);
    const second = await run(key);
    expect(second).toEqual(first);
    expect(submits).toBe(1);
    await run(otherKey);
    expect(submits).toBe(2);
  }));

it("prices a longer story and cached input instead of pausing", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    await runBudgetedStory({
      directory: dir,
      operationKey: key,
      submit: async () =>
        response({
          usage: {
            input_tokens: 9000,
            output_tokens: 100,
            input_tokens_details: { cached_tokens: 50 },
            output_tokens_details: null,
          },
        }),
      accept: async () => ({ usable: true }),
      recover: (result: unknown) => result,
    });
    expect(await readProviderPause(dir)).toBeNull();
    const budget = await EvaluationBudget.acquire(dir);
    expect((await budget.state()).committed).toBe(
      lunaUsageMicros({
        input: 9000,
        output: 100,
        cached: 50,
        cacheWrite: 0,
        reasoning: 0,
      }),
    );
    await budget.close();
  }));

it("stops on an unexpected model and blocks the next paid call", async () =>
  withDirectory(async (dir) => {
    await readyJournal(dir);
    let submits = 0;
    await expect(
      runBudgetedStory({
        directory: dir,
        operationKey: key,
        submit: async () => {
          submits += 1;
          return response({ model: "gpt-4.1-mini-2025-04-14" });
        },
        accept: async () => ({ usable: true }),
        recover: (result: unknown) => result,
      }),
    ).rejects.toThrow(/couldn't finish reading/);
    await expect(
      runBudgetedStory({
        directory: dir,
        operationKey: otherKey,
        submit: async () => {
          submits += 1;
          return response();
        },
        accept: async () => ({ usable: true }),
        recover: (result: unknown) => result,
      }),
    ).rejects.toThrow(/couldn't finish reading/);
    expect(submits).toBe(1);
    const budget = await EvaluationBudget.acquire(dir);
    const state = await budget.state();
    expect(state.committed).toBe(RESERVATION);
    expect([...state.calls.values()][0]?.settled).toBe(false);
    await budget.close();
  }));

it("preserves the approved journal when a new release is appended", async () =>
  withDirectory(async (dir) => {
    const budget = await EvaluationBudget.acquire(dir, true);
    const id = await budget.reserve("historical", "c".repeat(64));
    await budget.close();
    const before = await readFile(join(dir, "budget.jsonl"), "utf8");
    expect(before.startsWith(
      '{"type":"budget","version":1,"ceilingMicros":20000000,"approval":"2026-10-21"}\n',
    )).toBe(true);
    expect(before).toContain(`"micros":${RESERVATION}`);
    expect(CEILING).toBe(20_000_000);
    const reopened = await EvaluationBudget.acquire(dir);
    await reopened.release(id, "pre_submission");
    expect((await reopened.state()).committed).toBe(0);
    await reopened.close();
    const after = await readFile(join(dir, "budget.jsonl"), "utf8");
    expect(after.startsWith(before)).toBe(true);
    expect(budgetState(after).committed).toBe(0);
  }));

it("cannot pass the ceiling by splitting a check from the following write", async () =>
  withDirectory(async (dir) => {
    const budget = await EvaluationBudget.acquire(dir, true);
    const room = CEILING - RESERVATION * Math.floor(CEILING / RESERVATION);
    for (let i = 0; i < Math.floor(CEILING / RESERVATION); i++)
      await budget.reserve(`case-${i}`, "d".repeat(64));
    await expect(
      budget.reserveBounded("over", "e".repeat(64), room + 1),
    ).rejects.toThrow(/exhausted/);
    await budget.reserveBounded("exact", "f".repeat(64), room);
    await expect(budget.reserveBounded("more", "a".repeat(64), 1)).rejects.toThrow(
      /exhausted/,
    );
    expect((await budget.state()).committed).toBe(CEILING);
    await budget.close();
    const again = await EvaluationBudget.acquire(dir);
    await again.close();
  }));
