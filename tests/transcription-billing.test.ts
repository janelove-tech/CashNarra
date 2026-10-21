import { it, expect } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { EvaluationBudget } from "../scripts/lib/evaluation-budget";
import { writeOperation } from "../scripts/lib/interpretation-store";
import { readProviderPause } from "../scripts/lib/provider-pause";
import { GroqCapacity } from "../scripts/lib/groq-capacity";
import {
  admitGroqPlan,
  readPlanRecord,
  runGroqAttempt,
} from "../scripts/lib/groq-admission";
import { GROQ_TURBO_MODEL } from "../scripts/lib/provider-rates";
import { transcriptKey } from "../scripts/lib/transcript-attempt";
import { normalizeGroqTranscript } from "../src/server/transcription";

const limits = {
  requestsPerMinute: 20,
  requestsPerDay: 2000,
  audioSecondsPerHour: 50,
  audioSecondsPerDay: 28800,
};
const freePlan = {
  type: "groq_plan",
  version: 1,
  organizationId: "org_test",
  projectId: null,
  plan: "free",
  verifiedAt: "2026-10-21T11:00:00.000Z",
};

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
async function savePlan(directory: string, plan: "free" | "developer") {
  await writeFile(
    join(directory, "groq-plan.json"),
    JSON.stringify({ ...freePlan, plan }) + "\n",
  );
}
function key(hash: string) {
  return transcriptKey({
    model: GROQ_TURBO_MODEL,
    seconds: 45,
    recordingHash: hash,
    glossary: "cedis, pesewas",
  });
}
function attempt(
  directory: string,
  hash: string,
  submit: () => Promise<unknown>,
  extra: Record<string, unknown> = {},
) {
  return runGroqAttempt({
    directory,
    operationKey: key(hash),
    ownerId: "owner-a",
    model: GROQ_TURBO_MODEL,
    seconds: 45,
    voiceEnabled: true,
    limits,
    now: () => 1_700_000_000_000,
    submit,
    normalize: (raw) => normalizeGroqTranscript(raw, 45, GROQ_TURBO_MODEL),
    ...extra,
  });
}

it("fails closed unless the organization is confirmed free", () => {
  expect(readPlanRecord({ ...freePlan, plan: "complimentary" })).toBeNull();
  expect(
    admitGroqPlan({
      policy: "free_only",
      plan: null,
      paidAllowed: false,
      paidBudgetMicros: null,
    }).ok,
  ).toBe(false);
  expect(
    admitGroqPlan({
      policy: "free_only",
      plan: { ...freePlan, plan: "developer", projectId: null },
      paidAllowed: true,
      paidBudgetMicros: 1_000_000,
    }).ok,
  ).toBe(false);
  expect(
    admitGroqPlan({
      policy: "paid_capped",
      plan: { ...freePlan, plan: "developer", projectId: null },
      paidAllowed: false,
      paidBudgetMicros: 1_000_000,
    }).ok,
  ).toBe(false);
  for (const policy of ["free_only", "paid_capped"] as const)
    expect(
      admitGroqPlan({
        policy,
        plan: { ...freePlan, plan: "free", projectId: null },
        paidAllowed: true,
        paidBudgetMicros: null,
      }).ok,
    ).toBe(policy === "free_only");
});

it("records a free transcript as capacity and reference cost, not payable spend", async () =>
  withDirectory(async (dir) => {
    const budget = await EvaluationBudget.acquire(dir, true);
    await budget.close();
    const before = await readFile(join(dir, "budget.jsonl"), "utf8");
    await savePlan(dir, "free");
    let submits = 0;
    const value = await attempt(dir, "ab".repeat(32), async () => {
      submits += 1;
      return { text: "Sold fifteen cedis." };
    });
    expect(value.text).toBe("Sold fifteen cedis.");
    expect(submits).toBe(1);
    expect(await readFile(join(dir, "budget.jsonl"), "utf8")).toBe(before);
    const capacity = await GroqCapacity.acquire(dir, limits);
    const state = await capacity.state();
    expect(state.payableMicros).toBe(0);
    expect(state.referenceMicros).toBe(500);
    expect(state.audioSeconds).toBe(45);
    await capacity.close();
    await attempt(dir, "ab".repeat(32), async () => {
      submits += 1;
      return { text: "different" };
    });
    expect(submits).toBe(1);
  }));

it("does not call Groq when voice is off, the plan is unknown, or the clip was already transcribed", async () =>
  withDirectory(async (dir) => {
    await savePlan(dir, "free");
    let submits = 0;
    const submit = async () => {
      submits += 1;
      return { text: "Sold fifteen cedis." };
    };
    await expect(
      attempt(dir, "ab".repeat(32), submit, { voiceEnabled: false, policy: "free_only" }),
    ).rejects.toThrow(/not enabled/);
    await expect(
      attempt(dir, "ab".repeat(32), submit, { voiceEnabled: false, policy: "paid_capped" }),
    ).rejects.toThrow(/not enabled/);
    expect(submits).toBe(0);
    await writeOperation(
      dir,
      key("cd".repeat(32)),
      { status: "ready", result: { text: "I have not paid Efua." } },
      "transcripts",
    );
    const saved = await attempt(dir, "cd".repeat(32), submit, { voiceEnabled: true });
    expect(saved).toEqual({ text: "I have not paid Efua." });
    expect(submits).toBe(0);
  }));

it("stops a free-only account that is unverified or already paid before dispatch", async () =>
  withDirectory(async (dir) => {
    let submits = 0;
    const submit = async () => {
      submits += 1;
      return { text: "Sold fifteen cedis." };
    };
    await expect(attempt(dir, "ab".repeat(32), submit)).rejects.toThrow(
      /has not been confirmed/,
    );
    await savePlan(dir, "developer");
    await expect(attempt(dir, "ef".repeat(32), submit)).rejects.toThrow(/paid plan/);
    expect(submits).toBe(0);
    expect(await readProviderPause(dir)).toBeNull();
  }));

it("treats HTTP 429 as a temporary stop and does not start a paid attempt", async () =>
  withDirectory(async (dir) => {
    await savePlan(dir, "free");
    let clock = 1_700_000_000_000;
    let submits = 0;
    const run = () =>
      attempt(
        dir,
        "ab".repeat(32),
        async () => {
          submits += 1;
          throw { status: 429, code: "rate_limit_exceeded", retryAfterSeconds: 30 };
        },
        { now: () => clock },
      );
    await expect(run()).rejects.toThrow(/busy right now/);
    await expect(run()).rejects.toThrow(/busy right now/);
    expect(submits).toBe(1);
    const capacity = await GroqCapacity.acquire(dir, limits);
    expect((await capacity.state()).requests).toBe(0);
    expect((await capacity.state()).payableMicros).toBe(0);
    await capacity.close();
    expect(await readProviderPause(dir)).toBeNull();
    expect(await readProviderPause(dir, "groq")).toBeNull();
    clock += 31_000;
    await expect(run()).rejects.toThrow(/busy right now/);
    expect(submits).toBe(2);
  }));

it("keeps an uncertain timeout and blocks the other request for the last unit of capacity", async () =>
  withDirectory(async (dir) => {
    await savePlan(dir, "free");
    let submits = 0;
    const submit = async () => {
      submits += 1;
      throw { name: "APIConnectionTimeoutError", message: "Request timed out." };
    };
    await expect(attempt(dir, "ab".repeat(32), submit)).rejects.toThrow(/unresolved/);
    await expect(attempt(dir, "ab".repeat(32), submit)).rejects.toThrow(/unresolved/);
    expect(submits).toBe(1);
    await expect(attempt(dir, "cd".repeat(32), async () => ({ text: "Another clip." }))).rejects.toThrow(
      /busy right now/,
    );
    expect(submits).toBe(1);
    const held = await GroqCapacity.acquire(dir, limits);
    await expect(
      attempt(dir, "ef".repeat(32), async () => {
        submits += 1;
        return { text: "Sold fifteen cedis." };
      }),
    ).rejects.toThrow();
    expect(submits).toBe(1);
    await held.close();
  }));

it("does not dispatch a paid clip without an authorized budget that covers it", async () =>
  withDirectory(async (dir) => {
    let submits = 0;
    const submit = async () => {
      submits += 1;
      return { text: "Sold fifteen cedis." };
    };
    await expect(
      attempt(dir, "ab".repeat(32), submit, {
        policy: "paid_capped",
        paidAllowed: false,
        paidBudgetMicros: 1_000_000,
      }),
    ).rejects.toThrow(/not authorized/);
    await expect(
      attempt(dir, "cd".repeat(32), submit, {
        policy: "paid_capped",
        paidAllowed: true,
        paidBudgetMicros: null,
      }),
    ).rejects.toThrow(/authorized budget/);
    await expect(
      attempt(dir, "ef".repeat(32), submit, {
        policy: "paid_capped",
        paidAllowed: true,
        paidBudgetMicros: 100,
      }),
    ).rejects.toThrow(/cannot cover/);
    expect(submits).toBe(0);
    expect(await readProviderPause(dir)).toBeNull();
  }));

it("stops Groq authentication without touching the OpenAI pause", async () =>
  withDirectory(async (dir) => {
    await savePlan(dir, "free");
    let submits = 0;
    await expect(
      attempt(dir, "ab".repeat(32), async () => {
        submits += 1;
        throw { status: 401, code: "invalid_api_key" };
      }),
    ).rejects.toThrow(/connection needs attention/);
    await expect(
      attempt(
        dir,
        "cd".repeat(32),
        async () => {
          submits += 1;
          return { text: "Sold fifteen cedis." };
        },
        {
          beforeSubmit: async () => {
            throw new Error("Daily processing allowance reached.");
          },
        },
      ),
    ).rejects.toThrow(/connection needs attention/);
    expect(submits).toBe(1);
    expect(await readProviderPause(dir, "groq")).toBe("auth_rejected");
    expect(await readProviderPause(dir)).toBeNull();
    const capacity = await GroqCapacity.acquire(dir, limits);
    expect((await capacity.state()).requests).toBe(0);
    expect((await capacity.state()).payableMicros).toBe(0);
    await capacity.close();
  }));

it("releases capacity when the daily allowance stops the call before dispatch", async () =>
  withDirectory(async (dir) => {
    await savePlan(dir, "free");
    let submits = 0;
    await expect(
      attempt(dir, "ab".repeat(32), async () => {
        submits += 1;
        return { text: "Sold fifteen cedis." };
      }, {
        beforeSubmit: async () => {
          throw new Error("Daily processing allowance reached.");
        },
      }),
    ).rejects.toThrow(/Daily processing allowance/);
    expect(submits).toBe(0);
    const capacity = await GroqCapacity.acquire(dir, limits);
    expect((await capacity.state()).requests).toBe(0);
    expect((await capacity.state()).payableMicros).toBe(0);
    await capacity.close();
  }));

it("stops on a spending cap without using another provider or the OpenAI pause", async () =>
  withDirectory(async (dir) => {
    await savePlan(dir, "free");
    let submits = 0;
    await expect(
      attempt(dir, "ab".repeat(32), async () => {
        submits += 1;
        throw { status: 400, code: "blocked_api_access" };
      }),
    ).rejects.toThrow(/spending cap/);
    await expect(
      attempt(dir, "cd".repeat(32), async () => {
        submits += 1;
        return { text: "Sold fifteen cedis." };
      }),
    ).rejects.toThrow(/spending cap/);
    expect(submits).toBe(1);
    expect(await readProviderPause(dir, "groq")).toBe("spend_cap");
    expect(await readProviderPause(dir)).toBeNull();
  }));
