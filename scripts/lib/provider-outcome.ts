export type ReleaseReason =
  | "pre_submission"
  | "billing_rejected"
  | "auth_rejected"
  | "rate_limited";

export type ProviderFailure =
  | {
      kind: "release";
      reason: ReleaseReason;
      pause: boolean;
      message: string;
    }
  | { kind: "uncertain"; message: string };

export const STORY_PAUSED =
  "We couldn't read this story. Your words are still here. You can add a record yourself.";
export const STORY_UNRESOLVED =
  "This story is still unresolved. Your draft is still here. You can add a manual record.";
export const STORY_UNUSABLE =
  "This story was read, but it is not ready to review. Your draft is still here.";
export const STORY_UNPRICED =
  "We couldn't finish reading this story. Your words are still here. You can add a record yourself.";
export const STORY_UNCERTAIN =
  "Your story could not be processed. Your words are still here. You can add a manual record.";
export function pauseMessage(reason: string) {
  if (reason === "billing_rejected") return STORY_PAUSED;
  if (reason === "auth_rejected")
    return "The story reader needs attention. Your draft is still here. You can add a manual record.";
  return STORY_UNPRICED;
}

const TLS_CODES = new Set([
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "CERT_HAS_EXPIRED",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
]);

function detail(error: unknown) {
  const value = error as {
    status?: number;
    code?: string;
    name?: string;
    message?: string;
    cause?: { code?: string };
  };
  return {
    status: typeof value?.status === "number" ? value.status : null,
    code: value?.code ?? value?.cause?.code ?? "",
    causeCode: value?.cause?.code ?? "",
    name: value?.name ?? (error instanceof Error ? error.name : ""),
    message: value?.message ?? (error instanceof Error ? error.message : ""),
  };
}

// A generic connection error is not evidence that the provider did no work.
export function classifyProviderFailure(error: unknown): ProviderFailure {
  const item = detail(error);
  if (TLS_CODES.has(item.causeCode))
    return {
      kind: "release",
      reason: "pre_submission",
      pause: false,
      message:
        "CashNarra could not reach the story reader. Your draft is still here. You can add a manual record.",
    };
  if (item.status === 401 || item.status === 403)
    return {
      kind: "release",
      reason: "auth_rejected",
      pause: true,
      message:
        "The story reader needs attention. Your draft is still here. You can add a manual record.",
    };
  if (
    item.status === 429 &&
    (item.code === "credit_balance_exhausted" ||
      item.code === "insufficient_quota" ||
      item.code === "billing_hard_limit_reached")
  )
    return {
      kind: "release",
      reason: "billing_rejected",
      pause: true,
      message: STORY_PAUSED,
    };
  if (item.status === 402)
    return {
      kind: "release",
      reason: "billing_rejected",
      pause: true,
      message: STORY_PAUSED,
    };
  if (item.status === 400)
    return {
      kind: "release",
      reason: "pre_submission",
      pause: false,
      message: STORY_UNCERTAIN,
    };
  if (item.status === 429)
    return {
      kind: "release",
      reason: "rate_limited",
      pause: false,
      message:
        "The story reader is busy. Your draft is still here. Wait a moment, then try again, or add a manual record.",
    };
  if (
    item.name === "APIConnectionTimeoutError" ||
    item.message === "Request timed out."
  )
    return { kind: "uncertain", message: STORY_UNCERTAIN };
  return { kind: "uncertain", message: STORY_UNCERTAIN };
}
