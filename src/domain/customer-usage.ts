import {
  accraParts,
  messageFor,
  planById,
  shippedCatalogue,
  type PlanId,
  type ServiceAccess,
} from "@/domain/customer-plans";

export const INTERNAL_FAILED_ATTEMPTS_PER_STORY = 3;

export type UsageKind = "ai_story" | "voice_note" | "report_pack";
export type AttemptStatus = "pending" | "settled" | "released";

export type UsageAttempt = {
  id: string;
  operationKey: string;
  kind: UsageKind;
  status: AttemptStatus;
  periodKey: string;
  workspaceId: string;
  deviceId: string;
  fingerprint: string | null;
  packKey: string | null;
  recordCount: number;
  heldUnits: 0 | 1;
  at: string;
};

export type ProviderCost = {
  attemptId: string;
  status: "none" | "reserved" | "payable" | "reference" | "uncertain";
  usd: string | null;
};

export type UsageAccount = {
  accountId: string;
  planId: Extract<PlanId, "free" | "plus">;
  voiceEnabled: boolean;
  attempts: UsageAttempt[];
  costs: ProviderCost[];
  interpretations: { fingerprint: string; attemptId: string }[];
  packs: { key: string; attemptId: string }[];
  failedByFingerprint: Record<string, number>;
};

export type ReserveCode =
  | "reserved"
  | "reused"
  | "pending"
  | "exhausted"
  | "voice_off"
  | "needs_confirmation"
  | "company_attempt_limit"
  | "already_released"
  | "pack_exists";

export type ReserveResult = {
  account: UsageAccount;
  attempt: UsageAttempt | null;
  created: boolean;
  providerSubmission: "new" | "none";
  code: ReserveCode;
  message: string;
};

const catalogue = shippedCatalogue();

export function emptyUsage(
  accountId: string,
  planId: UsageAccount["planId"] = "free",
  voiceEnabled = false,
): UsageAccount {
  return {
    accountId,
    planId,
    voiceEnabled,
    attempts: [],
    costs: [],
    interpretations: [],
    packs: [],
    failedByFingerprint: {},
  };
}

export function periodKey(kind: UsageKind, at: Date) {
  const parts = accraParts(at);
  if (kind === "voice_note") return `${parts.year}-${parts.month}-${parts.day}`;
  return `${parts.year}-${parts.month}`;
}

export function quotaPeriodKey(
  kind: UsageKind,
  at: Date,
  access: ServiceAccess | null,
) {
  if (kind === "voice_note" || !access) return periodKey(kind, at);
  const instant = at.toISOString();
  const queued = access.queuedPeriod;
  if (queued && instant >= queued.startsAt && instant < queued.endsAt)
    return queued.id;
  if (instant >= access.periodStartsAt && instant < access.accessEndsAt)
    return access.currentPeriodId;
  return "outside";
}

export function allowanceFor(planId: UsageAccount["planId"], kind: UsageKind) {
  const plan = planById(catalogue, planId);
  if (kind === "ai_story") return plan.allowances.aiStoriesPerMonth;
  if (kind === "voice_note") return plan.allowances.voiceNotesPerDay;
  return plan.allowances.reportPacksPerMonth;
}

export function usedUnits(account: UsageAccount, kind: UsageKind, key: string) {
  return account.attempts.filter(
    (attempt) =>
      attempt.kind === kind &&
      attempt.periodKey === key &&
      (attempt.status === "pending" || attempt.status === "settled"),
  ).length;
}

export function manualEntryEffect() {
  return { aiStories: 0, voiceNotes: 0, reportPacks: 0 };
}

export function reserve(
  account: UsageAccount,
  input: {
    operationKey: string;
    kind: UsageKind;
    at: Date;
    workspaceId: string;
    deviceId?: string;
    fingerprint?: string | null;
    changed?: boolean;
    explicitReinterpret?: boolean;
    packKey?: string | null;
    periodKey?: string;
  },
): ReserveResult {
  const existing = account.attempts.find(
    (attempt) => attempt.operationKey === input.operationKey,
  );
  if (existing?.status === "pending")
    return {
      account,
      attempt: existing,
      created: false,
      providerSubmission: "none",
      code: "pending",
      message: messageFor("pending"),
    };
  if (existing?.status === "settled")
    return {
      account,
      attempt: existing,
      created: false,
      providerSubmission: "none",
      code: "reused",
      message: "This attempt is already settled.",
    };
  if (existing?.status === "released")
    return {
      account,
      attempt: existing,
      created: false,
      providerSubmission: "none",
      code: "already_released",
      message: messageFor("pending"),
    };
  if (input.kind === "voice_note" && !account.voiceEnabled)
    return {
      account,
      attempt: null,
      created: false,
      providerSubmission: "none",
      code: "voice_off",
      message: messageFor("voice_off"),
    };
  const fingerprint = input.fingerprint ?? null;
  if (
    input.kind === "ai_story" &&
    fingerprint &&
    account.interpretations.some((item) => item.fingerprint === fingerprint) &&
    !input.changed
  )
    return {
      account,
      attempt: null,
      created: false,
      providerSubmission: "none",
      code: "reused",
      message:
        "This story is already understood. No additional AI story was used.",
    };
  if (input.kind === "ai_story" && input.changed && !input.explicitReinterpret)
    return {
      account,
      attempt: null,
      created: false,
      providerSubmission: "none",
      code: "needs_confirmation",
      message: messageFor("needs_confirmation"),
    };
  if (
    input.kind === "report_pack" &&
    input.packKey &&
    account.packs.some((pack) => pack.key === input.packKey)
  )
    return {
      account,
      attempt: null,
      created: false,
      providerSubmission: "none",
      code: "pack_exists",
      message:
        "This report pack is already available. Downloading it uses no extra pack.",
    };
  if (
    fingerprint &&
    (account.failedByFingerprint[fingerprint] ?? 0) >=
      INTERNAL_FAILED_ATTEMPTS_PER_STORY
  )
    return {
      account,
      attempt: null,
      created: false,
      providerSubmission: "none",
      code: "company_attempt_limit",
      message: messageFor("company_daily_guard"),
    };
  const key = input.periodKey ?? periodKey(input.kind, input.at);
  if (
    usedUnits(account, input.kind, key) >=
    allowanceFor(account.planId, input.kind)
  )
    return {
      account,
      attempt: null,
      created: false,
      providerSubmission: "none",
      code: "exhausted",
      message:
        input.kind === "voice_note"
          ? messageFor("voice_exhausted", {
              reset: "00:00 Accra time",
              limit: allowanceFor(account.planId, "voice_note"),
            })
          : input.kind === "ai_story"
            ? messageFor("ai_exhausted")
            : messageFor("reports_exhausted"),
    };
  const attempt: UsageAttempt = {
    id: `attempt-${account.attempts.length + 1}-${input.operationKey}`,
    operationKey: input.operationKey,
    kind: input.kind,
    status: "pending",
    periodKey: key,
    workspaceId: input.workspaceId,
    deviceId: input.deviceId ?? "device",
    fingerprint,
    packKey: input.packKey ?? null,
    recordCount: 0,
    heldUnits: 1,
    at: input.at.toISOString(),
  };
  return {
    account: {
      ...account,
      attempts: account.attempts.concat(attempt),
      costs: account.costs.concat({
        attemptId: attempt.id,
        status: "none",
        usd: null,
      }),
    },
    attempt,
    created: true,
    providerSubmission: "new",
    code: "reserved",
    message: messageFor("before_understand"),
  };
}

function replaceAttempt(
  account: UsageAccount,
  attemptId: string,
  next: UsageAttempt,
): UsageAccount {
  return {
    ...account,
    attempts: account.attempts.map((attempt) =>
      attempt.id === attemptId ? next : attempt,
    ),
  };
}

export function settle(
  account: UsageAccount,
  attemptId: string,
  extra: { recordCount?: number; fingerprint?: string; packKey?: string } = {},
) {
  const attempt = account.attempts.find((item) => item.id === attemptId);
  if (!attempt || attempt.status !== "pending")
    throw new Error("Only a pending attempt can be settled.");
  const settled: UsageAttempt = {
    ...attempt,
    status: "settled",
    recordCount: extra.recordCount ?? attempt.recordCount,
    fingerprint: extra.fingerprint ?? attempt.fingerprint,
    packKey: extra.packKey ?? attempt.packKey,
  };
  let next = replaceAttempt(account, attemptId, settled);
  if (settled.kind === "ai_story" && settled.fingerprint)
    next = {
      ...next,
      interpretations: next.interpretations.concat({
        fingerprint: settled.fingerprint,
        attemptId,
      }),
    };
  if (settled.kind === "report_pack" && settled.packKey)
    next = {
      ...next,
      packs: next.packs.concat({ key: settled.packKey, attemptId }),
    };
  return next;
}

export function noteProviderCost(
  account: UsageAccount,
  attemptId: string,
  cost: { status: ProviderCost["status"]; usd: string | null },
) {
  return {
    ...account,
    costs: account.costs.map((item) =>
      item.attemptId === attemptId ? { ...item, ...cost } : item,
    ),
  };
}

export function releaseCustomer(account: UsageAccount, attemptId: string) {
  const attempt = account.attempts.find((item) => item.id === attemptId);
  if (!attempt || attempt.status !== "pending")
    throw new Error("Only a pending attempt can be released.");
  const released: UsageAttempt = {
    ...attempt,
    status: "released",
    heldUnits: 0,
  };
  const next = replaceAttempt(account, attemptId, released);
  if (!attempt.fingerprint) return next;
  return {
    ...next,
    failedByFingerprint: {
      ...next.failedByFingerprint,
      [attempt.fingerprint]:
        (next.failedByFingerprint[attempt.fingerprint] ?? 0) + 1,
    },
  };
}

export function markTimeout(account: UsageAccount, attemptId: string) {
  const attempt = account.attempts.find((item) => item.id === attemptId);
  if (!attempt || attempt.status !== "pending")
    throw new Error("Only a pending attempt can stay unresolved.");
  return noteProviderCost(account, attemptId, {
    status: "uncertain",
    usd:
      account.costs.find((cost) => cost.attemptId === attemptId)?.usd ?? null,
  });
}

export function downloadPack(
  account: UsageAccount,
  packKey: string,
  format: "pdf" | "xlsx",
) {
  const pack = account.packs.find((item) => item.key === packKey);
  if (!pack) throw new Error("Generate the report before downloading it.");
  return { account, format, packKey, additionalUnits: 0 as const };
}

export function canActivateWorkspace(
  planId: UsageAccount["planId"],
  activeWorkspaceIds: readonly string[],
  workspaceId: string,
) {
  const limit = planById(catalogue, planId).allowances.activeWorkspaces;
  const already = activeWorkspaceIds.includes(workspaceId);
  return {
    ok: already || activeWorkspaceIds.length < limit,
    limit,
    deleteWorkspaces: false as const,
    sharedAcrossWorkspaces: true as const,
  };
}

export function downgradePolicy(activeWorkspaceCount: number) {
  const limit = planById(catalogue, "free").allowances.activeWorkspaces;
  return {
    deleteWorkspaces: false as const,
    chooseActiveWorkspaces: activeWorkspaceCount > limit,
    preserveReadAndExport: true as const,
  };
}
