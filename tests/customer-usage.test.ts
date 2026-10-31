import { expect, it } from "vitest";
import type { ServiceAccess } from "../src/domain/customer-plans";
import {
  canActivateWorkspace,
  downloadPack,
  downgradePolicy,
  emptyUsage,
  markTimeout,
  manualEntryEffect,
  noteProviderCost,
  periodKey,
  quotaPeriodKey,
  releaseCustomer,
  reserve,
  settle,
  usedUnits,
} from "../src/domain/customer-usage";

const october = new Date("2026-10-21T12:00:00.000Z");
const month = "2026-10";

function story(
  account = emptyUsage("acct"),
  key = "story-1",
  fingerprint = "same",
) {
  return reserve(account, {
    operationKey: key,
    kind: "ai_story",
    at: october,
    workspaceId: "shop",
    fingerprint,
  });
}

it("shares one allowance across workspaces and devices", () => {
  let account = emptyUsage("acct");
  for (const [workspaceId, deviceId] of [
    ["personal", "laptop"],
    ["shop", "laptop"],
    ["side", "phone"],
  ] as const) {
    const step = reserve(account, {
      operationKey: workspaceId,
      kind: "ai_story",
      at: october,
      workspaceId,
      deviceId,
      fingerprint: workspaceId,
    });
    expect(step.created).toBe(true);
    account = settle(step.account, step.attempt!.id, { recordCount: 1 });
  }
  expect(usedUnits(account, "ai_story", month)).toBe(3);
  expect(
    new Set(account.attempts.map((attempt) => attempt.workspaceId)).size,
  ).toBe(3);
});

it("settles one AI story when that story creates twelve records", () => {
  const reserved = story();
  const settled = settle(reserved.account, reserved.attempt!.id, {
    recordCount: 12,
    fingerprint: "same",
  });
  expect(usedUnits(settled, "ai_story", month)).toBe(1);
  expect(settled.attempts[0]?.recordCount).toBe(12);
  expect(manualEntryEffect()).toEqual({
    aiStories: 0,
    voiceNotes: 0,
    reportPacks: 0,
  });
});

it("reopens a stored interpretation for free and asks before a changed story", () => {
  const reserved = story();
  const settled = settle(reserved.account, reserved.attempt!.id, {
    fingerprint: "same",
  });
  const again = reserve(settled, {
    operationKey: "reopen",
    kind: "ai_story",
    at: october,
    workspaceId: "shop",
    fingerprint: "same",
  });
  expect(again.code).toBe("reused");
  expect(usedUnits(again.account, "ai_story", month)).toBe(1);
  const changed = reserve(settled, {
    operationKey: "changed",
    kind: "ai_story",
    at: october,
    workspaceId: "shop",
    fingerprint: "edited",
    changed: true,
  });
  expect(changed.code).toBe("needs_confirmation");
  expect(changed.providerSubmission).toBe("none");
  const confirmed = reserve(settled, {
    operationKey: "changed",
    kind: "ai_story",
    at: october,
    workspaceId: "shop",
    fingerprint: "edited",
    changed: true,
    explicitReinterpret: true,
  });
  expect(confirmed.code).toBe("reserved");
  expect(
    usedUnits(
      settle(confirmed.account, confirmed.attempt!.id),
      "ai_story",
      month,
    ),
  ).toBe(2);
});

it("keeps the voice note when understanding fails, and does not transcribe again", () => {
  let account = emptyUsage("acct", "free", true);
  const voice = reserve(account, {
    operationKey: "clip-1",
    kind: "voice_note",
    at: october,
    workspaceId: "shop",
  });
  account = settle(voice.account, voice.attempt!.id);
  const reading = reserve(account, {
    operationKey: "read-1",
    kind: "ai_story",
    at: october,
    workspaceId: "shop",
    fingerprint: "words",
  });
  account = releaseCustomer(
    noteProviderCost(reading.account, reading.attempt!.id, {
      status: "payable",
      usd: "0.004",
    }),
    reading.attempt!.id,
  );
  expect(usedUnits(account, "voice_note", "2026-10-21")).toBe(1);
  expect(usedUnits(account, "ai_story", month)).toBe(0);
  expect(account.costs.find((cost) => cost.usd === "0.004")?.status).toBe(
    "payable",
  );
  const replay = reserve(account, {
    operationKey: "clip-1",
    kind: "voice_note",
    at: october,
    workspaceId: "shop",
  });
  expect(replay.providerSubmission).toBe("none");
  expect(
    account.attempts.filter((attempt) => attempt.kind === "voice_note"),
  ).toHaveLength(1);
});

it("returns the customer slot after a definite failure without clearing provider cost", () => {
  const reserved = story();
  const priced = noteProviderCost(reserved.account, reserved.attempt!.id, {
    status: "reserved",
    usd: "0.004",
  });
  const released = releaseCustomer(priced, reserved.attempt!.id);
  expect(usedUnits(released, "ai_story", month)).toBe(0);
  expect(released.costs[0]).toMatchObject({ status: "reserved", usd: "0.004" });
});

it("keeps a timeout pending and does not send it again", () => {
  const reserved = story();
  const waiting = markTimeout(reserved.account, reserved.attempt!.id);
  const again = reserve(waiting, {
    operationKey: "story-1",
    kind: "ai_story",
    at: october,
    workspaceId: "shop",
    fingerprint: "same",
  });
  expect(again.code).toBe("pending");
  expect(again.created).toBe(false);
  expect(again.providerSubmission).toBe("none");
  expect(waiting.attempts).toHaveLength(1);
  expect(waiting.attempts[0]?.status).toBe("pending");
  expect(waiting.costs[0]?.status).toBe("uncertain");
});

it("counts one report pack for both formats and not for a repeat download", () => {
  const pack = "shop|2026-10-01|2026-10-21|all|activity|snap-1";
  const reserved = reserve(emptyUsage("acct"), {
    operationKey: "report-1",
    kind: "report_pack",
    at: october,
    workspaceId: "shop",
    packKey: pack,
  });
  const settled = settle(reserved.account, reserved.attempt!.id, {
    packKey: pack,
  });
  expect(downloadPack(settled, pack, "pdf").additionalUnits).toBe(0);
  expect(downloadPack(settled, pack, "xlsx").additionalUnits).toBe(0);
  expect(
    reserve(settled, {
      operationKey: "report-again",
      kind: "report_pack",
      at: october,
      workspaceId: "shop",
      packKey: pack,
    }).code,
  ).toBe("pack_exists");
  const changed = reserve(settled, {
    operationKey: "report-2",
    kind: "report_pack",
    at: october,
    workspaceId: "shop",
    packKey: "shop|2026-10-01|2026-10-21|all|activity|snap-2",
  });
  expect(
    usedUnits(
      settle(changed.account, changed.attempt!.id),
      "report_pack",
      month,
    ),
  ).toBe(2);
});

it("lets only one request take the last slot", () => {
  let account = emptyUsage("acct", "free", true);
  for (let index = 0; index < 2; index += 1) {
    const step = reserve(account, {
      operationKey: `voice-${index}`,
      kind: "voice_note",
      at: october,
      workspaceId: "shop",
      deviceId: index === 0 ? "laptop" : "phone",
    });
    account = settle(step.account, step.attempt!.id);
  }
  const first = reserve(account, {
    operationKey: "voice-a",
    kind: "voice_note",
    at: october,
    workspaceId: "personal",
  });
  const second = reserve(first.account, {
    operationKey: "voice-b",
    kind: "voice_note",
    at: october,
    workspaceId: "side",
  });
  expect(first.code).toBe("reserved");
  expect(second.code).toBe("exhausted");
  expect(usedUnits(first.account, "voice_note", "2026-10-21")).toBe(3);
});

it("stops repeated failed provider submissions without another customer debit", () => {
  let account = emptyUsage("acct");
  for (let index = 0; index < 3; index += 1) {
    const step = reserve(account, {
      operationKey: `fail-${index}`,
      kind: "ai_story",
      at: october,
      workspaceId: "shop",
      fingerprint: "broken",
    });
    account = releaseCustomer(step.account, step.attempt!.id);
  }
  const blocked = reserve(account, {
    operationKey: "fail-3",
    kind: "ai_story",
    at: october,
    workspaceId: "shop",
    fingerprint: "broken",
  });
  expect(blocked.code).toBe("company_attempt_limit");
  expect(blocked.providerSubmission).toBe("none");
  expect(usedUnits(account, "ai_story", month)).toBe(0);
});

it("keeps October usage out of November and ignores a device timezone", () => {
  const reserved = story();
  const settled = settle(reserved.account, reserved.attempt!.id);
  const november = new Date("2026-11-01T00:00:00.000Z");
  expect(periodKey("ai_story", new Date("2026-10-31T23:30:00.000Z"))).toBe(
    "2026-10",
  );
  expect(periodKey("ai_story", november)).toBe("2026-11");
  expect(periodKey("voice_note", new Date("2026-10-31T23:30:00.000Z"))).toBe(
    "2026-10-31",
  );
  expect(periodKey("voice_note", november)).toBe("2026-11-01");
  expect(usedUnits(settled, "ai_story", "2026-11")).toBe(0);
  expect(settled.attempts).toHaveLength(1);
  expect(periodKey("ai_story", new Date("2026-10-31T12:00:00.000Z"))).toBe(
    "2026-10",
  );
});

it("starts the next pass quota only when that period starts", () => {
  const access: ServiceAccess = {
    accountId: "acct",
    status: "active",
    mode: "pass_30",
    currentPeriodId: "period-1",
    periodStartsAt: "2026-11-01T00:00:00.000Z",
    accessEndsAt: "2026-12-31T00:00:00.000Z",
    queuedPeriod: {
      id: "period-2",
      startsAt: "2026-12-01T00:00:00.000Z",
      endsAt: "2026-12-31T00:00:00.000Z",
    },
    payments: [],
    agreementId: "agree",
  };
  const during = new Date("2026-11-15T00:00:00.000Z");
  const reserved = reserve(emptyUsage("acct", "plus"), {
    operationKey: "during",
    kind: "ai_story",
    at: during,
    workspaceId: "shop",
    fingerprint: "during",
    periodKey: quotaPeriodKey("ai_story", during, access),
  });
  const settled = settle(reserved.account, reserved.attempt!.id);
  const nextKey = quotaPeriodKey(
    "ai_story",
    new Date("2026-12-01T00:00:00.000Z"),
    access,
  );
  expect(reserved.attempt?.periodKey).toBe("period-1");
  expect(nextKey).toBe("period-2");
  expect(usedUnits(settled, "ai_story", "period-2")).toBe(0);
  expect(settled.attempts).toHaveLength(1);
});

it("checks the workspace limit without deleting a workspace", () => {
  expect(canActivateWorkspace("free", ["a", "b", "c"], "d")).toMatchObject({
    ok: false,
    deleteWorkspaces: false,
  });
  expect(canActivateWorkspace("free", ["a", "b", "c"], "a").ok).toBe(true);
  expect(canActivateWorkspace("free", ["a"], "b").ok).toBe(true);
  expect(
    canActivateWorkspace(
      "plus",
      Array.from({ length: 10 }, (_, index) => String(index)),
      "extra",
    ).ok,
  ).toBe(false);
  expect(downgradePolicy(4)).toEqual({
    deleteWorkspaces: false,
    chooseActiveWorkspaces: true,
    preserveReadAndExport: true,
  });
  expect(
    reserve(emptyUsage("acct"), {
      operationKey: "voice",
      kind: "voice_note",
      at: october,
      workspaceId: "shop",
    }).code,
  ).toBe("voice_off");
});

it("enforces the revised shared story and report allowances while reusing generated packs", () => {
  for (const [planId, stories, reports] of [
    ["free", 30, 2],
    ["plus", 300, 30],
  ] as const) {
    let account = emptyUsage("acct", planId);
    for (let index = 0; index < stories; index++) {
      const step = reserve(account, {
        operationKey: `story-${index}`,
        kind: "ai_story",
        at: october,
        workspaceId: index % 2 ? "shop" : "personal",
        fingerprint: `story-${index}`,
      });
      expect(step.created).toBe(true);
      account = settle(step.account, step.attempt!.id);
    }
    const full = reserve(account, {
      operationKey: "one-too-many",
      kind: "ai_story",
      at: october,
      workspaceId: "another",
      fingerprint: "new",
    });
    expect(full.code).toBe("exhausted");
    expect(full.providerSubmission).toBe("none");
    expect(full.account).toBe(account);
    for (let index = 0; index < reports; index++) {
      const step = reserve(account, {
        operationKey: `report-${index}`,
        kind: "report_pack",
        at: october,
        workspaceId: "shop",
        packKey: `pack-${index}`,
      });
      expect(step.created).toBe(true);
      account = settle(step.account, step.attempt!.id);
    }
    const fullReport = reserve(account, {
      operationKey: "report-extra",
      kind: "report_pack",
      at: october,
      workspaceId: "personal",
      packKey: "new-pack",
    });
    expect(fullReport.code).toBe("exhausted");
    const again = reserve(account, {
      operationKey: "report-again",
      kind: "report_pack",
      at: october,
      workspaceId: "shop",
      packKey: "pack-0",
    });
    expect(again.code).toBe("pack_exists");
    expect(downloadPack(account, "pack-0", "pdf").additionalUnits).toBe(0);
    expect(downloadPack(account, "pack-0", "xlsx").additionalUnits).toBe(0);
    expect(usedUnits(account, "report_pack", month)).toBe(reports);
  }
});
