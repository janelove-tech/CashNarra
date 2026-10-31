import Decimal from "decimal.js";
import { formatMoney } from "@/domain/money";
import launchPlans from "./launch-plans.json";

/** Prepared plan specification. Dates stay unset and nothing here can be bought. */
export const PLAN_SPEC_VERSION = launchPlans.version;
export const CURRENT_PLUS_OFFER_USD = "2.99";
const CURRENT_PLUS_OFFER_ID = "plus-enrolment-2026-10-31";
export const COMPANY_DAILY_READER_CALLS = 10;
export const ACCOUNT_TIMEZONE = "Africa/Accra";

export type PlanId = "free" | "plus" | "unlimited";
export type Visibility = "public" | "preview" | "private";
export type CampaignStatus =
  "draft" | "scheduled" | "active" | "ended" | "paused";

export type PriceVersion = {
  id: string;
  planId: PlanId;
  kind: "regular" | "enrolment" | "free";
  usd: string;
  label: string;
  createdAt: string;
};

export type Campaign = {
  id: string;
  planId: PlanId;
  status: CampaignStatus;
  enrolmentPriceVersionId: string;
  startsAt: string | null;
  endsAt: string | null;
  timezone: typeof ACCOUNT_TIMEZONE;
};

export type PlanAllowances = {
  owners: 1;
  activeWorkspaces: number;
  financialRecords: "unlimited";
  aiStoriesPerMonth: number;
  voiceNotesPerDay: number;
  voiceNoteSeconds: number;
  reportPacksPerMonth: number;
  csvExport: "unmetered";
  overageCharges: false;
  quotasApproved: boolean;
};

export type PlanDefinition = {
  id: PlanId;
  name: string;
  visibility: Visibility;
  purchasable: boolean;
  launchStatus: "draft" | "ready";
  regularPriceVersionId: string;
  campaignId: string | null;
  allowances: PlanAllowances;
};

export type Catalogue = {
  specVersion: string;
  plans: PlanDefinition[];
  prices: PriceVersion[];
  campaigns: Campaign[];
};

export type PriceAgreement = {
  id: string;
  accountId: string;
  planId: PlanId;
  usdBenchmark: string;
  priceVersionId: string;
  campaignId: string | null;
  agreedAt: string;
  status: "active" | "superseded";
};

export type Quote = {
  id: string;
  accountId: string;
  planId: PlanId;
  priceVersionId: string;
  campaignId: string | null;
  usdBenchmark: string;
  ghsAmount: string;
  fxSourceId: string;
  fxDate: string;
  terms: string;
  issuedAt: string;
  validUntil: string;
  status: "open" | "accepted" | "expired";
};

export type ServicePayment = {
  id: string;
  status: "approved" | "failed";
  quoteId: string | null;
};

export type ServiceAccess = {
  accountId: string;
  status: "active" | "paused";
  mode: "pass_30";
  currentPeriodId: string;
  periodStartsAt: string;
  accessEndsAt: string;
  queuedPeriod: { id: string; startsAt: string; endsAt: string } | null;
  payments: ServicePayment[];
  agreementId: string;
};

export type AccessGrant = {
  id: string;
  accountId: string;
  kind: "complimentary";
  reason: string;
  paymentId: null;
};

export type AuditEntry = {
  id: string;
  at: string;
  actorId: string;
  field: string;
  previous: string;
  next: string;
};

export type TicketStatus = "open" | "waiting" | "resolved";
export type SupportTicket = {
  id: string;
  status: TicketStatus;
  customerReply: string;
  privateNote: string;
};

export const REFERENCE_FX = {
  id: "bog-interbank-2026-10-20",
  source: "Bank of Ghana interbank reference",
  asOf: "2026-10-20",
  ghsPerUsd: "11.6058",
  statement:
    "Rate published for 20 October 2026. Opening this page does not turn it into a live market quote.",
} as const;

const preparedAt = "2026-10-21T00:00:00.000Z";

const SHIPPED: Catalogue = {
  specVersion: PLAN_SPEC_VERSION,
  prices: [
    {
      id: "free-2026-10-21",
      planId: "free",
      kind: "free",
      usd: "0.00",
      label: "Free",
      createdAt: preparedAt,
    },
    {
      id: "plus-regular-2026-10-21",
      planId: "plus",
      kind: "regular",
      usd: "2.00",
      label: "Standard price",
      createdAt: preparedAt,
    },
    {
      id: "plus-enrolment-2026-10-21",
      planId: "plus",
      kind: "enrolment",
      usd: "0.99",
      label: "Launch price",
      createdAt: preparedAt,
    },
    {
      id: "plus-regular-2026-10-31",
      planId: "plus",
      kind: "regular",
      usd: launchPlans.regularPlusUsd,
      label: "Standard price",
      createdAt: "2026-10-31T00:00:00.000Z",
    },
    {
      id: CURRENT_PLUS_OFFER_ID,
      planId: "plus",
      kind: "enrolment",
      usd: CURRENT_PLUS_OFFER_USD,
      label: "Launch price",
      createdAt: "2026-10-31T00:00:00.000Z",
    },
    {
      id: "unlimited-regular-2026-10-21",
      planId: "unlimited",
      kind: "regular",
      usd: "10.00",
      label: "Standard price",
      createdAt: preparedAt,
    },
    {
      id: "unlimited-enrolment-2026-10-21",
      planId: "unlimited",
      kind: "enrolment",
      usd: "5.99",
      label: "Launch price",
      createdAt: preparedAt,
    },
  ],
  campaigns: [
    {
      id: "plus-launch-2026-10-21",
      planId: "plus",
      status: "draft",
      enrolmentPriceVersionId: CURRENT_PLUS_OFFER_ID,
      startsAt: null,
      endsAt: null,
      timezone: ACCOUNT_TIMEZONE,
    },
    {
      id: "unlimited-launch-2026-10-21",
      planId: "unlimited",
      status: "draft",
      enrolmentPriceVersionId: "unlimited-enrolment-2026-10-21",
      startsAt: null,
      endsAt: null,
      timezone: ACCOUNT_TIMEZONE,
    },
  ],
  plans: [
    {
      id: "free",
      name: "Free",
      visibility: "public",
      purchasable: false,
      launchStatus: "draft",
      regularPriceVersionId: "free-2026-10-21",
      campaignId: null,
      allowances: {
        owners: 1,
        activeWorkspaces: launchPlans.plans.free.activeWorkspaces,
        financialRecords: "unlimited",
        aiStoriesPerMonth: launchPlans.plans.free.aiStoriesPerMonth,
        voiceNotesPerDay: launchPlans.plans.free.voiceNotesPerDay,
        voiceNoteSeconds: launchPlans.plans.free.voiceNoteSeconds,
        reportPacksPerMonth: launchPlans.plans.free.reportPacksPerMonth,
        csvExport: "unmetered",
        overageCharges: false,
        quotasApproved: true,
      },
    },
    {
      id: "plus",
      name: "Plus",
      visibility: "preview",
      purchasable: false,
      launchStatus: "draft",
      regularPriceVersionId: "plus-regular-2026-10-31",
      campaignId: "plus-launch-2026-10-21",
      allowances: {
        owners: 1,
        activeWorkspaces: launchPlans.plans.plus.activeWorkspaces,
        financialRecords: "unlimited",
        aiStoriesPerMonth: launchPlans.plans.plus.aiStoriesPerMonth,
        voiceNotesPerDay: launchPlans.plans.plus.voiceNotesPerDay,
        voiceNoteSeconds: launchPlans.plans.plus.voiceNoteSeconds,
        reportPacksPerMonth: launchPlans.plans.plus.reportPacksPerMonth,
        csvExport: "unmetered",
        overageCharges: false,
        quotasApproved: false,
      },
    },
    {
      id: "unlimited",
      name: "Unlimited",
      visibility: "private",
      purchasable: false,
      launchStatus: "draft",
      regularPriceVersionId: "unlimited-regular-2026-10-21",
      campaignId: "unlimited-launch-2026-10-21",
      allowances: {
        owners: 1,
        activeWorkspaces: 10,
        financialRecords: "unlimited",
        aiStoriesPerMonth: 500,
        voiceNotesPerDay: 3,
        voiceNoteSeconds: 120,
        reportPacksPerMonth: 100,
        csvExport: "unmetered",
        overageCharges: false,
        quotasApproved: false,
      },
    },
  ],
};

export function shippedCatalogue(): Catalogue {
  return structuredClone(SHIPPED);
}

export function planById(catalogue: Catalogue, id: PlanId) {
  const plan = catalogue.plans.find((item) => item.id === id);
  if (!plan) throw new Error("Unknown plan.");
  return plan;
}

export function priceById(catalogue: Catalogue, id: string) {
  const price = catalogue.prices.find((item) => item.id === id);
  if (!price) throw new Error("Unknown price.");
  return price;
}

export function cedisFromUsd(usd: string, ghsPerUsd: string) {
  if (!/^(0|[1-9]\d*)\.\d{2}$/.test(usd))
    throw new Error("Use a USD amount with two decimal places.");
  if (!/^\d+\.\d{1,6}$/.test(ghsPerUsd))
    throw new Error("Use a numeric exchange rate.");
  return new Decimal(usd)
    .mul(ghsPerUsd)
    .mul(10)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .div(10)
    .toFixed(2);
}

export function storiesReachableUnderDailyGuard(
  stories: number,
  dailyCalls = COMPANY_DAILY_READER_CALLS,
) {
  return stories <= dailyCalls * 28;
}

export function enrolmentOpen(campaign: Campaign, at: string) {
  if (campaign.status !== "active" || !campaign.startsAt || !campaign.endsAt)
    return false;
  return at >= campaign.startsAt && at < campaign.endsAt;
}

export type OfferedPrice = {
  available: boolean;
  usd: string | null;
  priceVersionId: string | null;
  campaignId: string | null;
  reason: string;
};

/** Shared by the pricing decision and checkout. A draft campaign is not a sale. */
export function offeredPrice(
  catalogue: Catalogue,
  planId: PlanId,
  at: string,
): OfferedPrice {
  const plan = planById(catalogue, planId);
  if (
    plan.visibility === "private" ||
    !plan.purchasable ||
    plan.launchStatus !== "ready"
  )
    return {
      available: false,
      usd: null,
      priceVersionId: null,
      campaignId: null,
      reason: "This plan cannot be bought.",
    };
  const campaign = plan.campaignId
    ? catalogue.campaigns.find((item) => item.id === plan.campaignId)
    : undefined;
  if (campaign && enrolmentOpen(campaign, at)) {
    const price = priceById(catalogue, campaign.enrolmentPriceVersionId);
    return {
      available: true,
      usd: price.usd,
      priceVersionId: price.id,
      campaignId: campaign.id,
      reason: "Launch enrolment price.",
    };
  }
  const regular = priceById(catalogue, plan.regularPriceVersionId);
  return {
    available: true,
    usd: regular.usd,
    priceVersionId: regular.id,
    campaignId: null,
    reason: "Standard price for a new subscriber.",
  };
}

export function purchaseAllowed(
  catalogue: Catalogue,
  planId: string,
  at: string,
) {
  if (planId !== "free" && planId !== "plus" && planId !== "unlimited")
    return false;
  return offeredPrice(catalogue, planId, at).available;
}

export function refuseCheckout(planId: string) {
  const at = new Date(0).toISOString();
  if (planId !== "free" && planId !== "plus")
    return {
      code: "plan_unavailable" as const,
      message: "That plan is not available.",
      offered: {
        available: false,
        usd: null,
        priceVersionId: null,
        campaignId: null,
        reason: "This plan cannot be bought.",
      },
    };
  return {
    code: "checkout_disabled" as const,
    message: "Checkout is not available.",
    offered: offeredPrice(SHIPPED, planId, at),
  };
}

export function catalogueAfterPriceEdit(
  catalogue: Catalogue,
  input: { planId: PlanId; usd: string; at: string; versionId: string },
) {
  const usd = input.usd;
  if (!/^(0|[1-9]\d*)\.\d{2}$/.test(usd))
    throw new Error("Use a USD amount with two decimal places.");
  const next: Catalogue = structuredClone(catalogue);
  next.prices.push({
    id: input.versionId,
    planId: input.planId,
    kind: input.planId === "free" ? "free" : "regular",
    usd,
    label: input.planId === "free" ? "Free" : "Standard price",
    createdAt: input.at,
  });
  const plan = planById(next, input.planId);
  plan.regularPriceVersionId = input.versionId;
  return { catalogue: next, providerPlanUpdates: [] as const };
}

export function setPlanVisibility(
  catalogue: Catalogue,
  planId: PlanId,
  visibility: Visibility,
) {
  const next = structuredClone(catalogue);
  planById(next, planId).visibility = visibility;
  return next;
}

export function closePlanToNewPurchases(catalogue: Catalogue, planId: PlanId) {
  const next = structuredClone(catalogue);
  planById(next, planId).purchasable = false;
  return next;
}

export function endCampaign(catalogue: Catalogue, campaignId: string) {
  const next = structuredClone(catalogue);
  const campaign = next.campaigns.find((item) => item.id === campaignId);
  if (!campaign) throw new Error("Unknown campaign.");
  campaign.status = "ended";
  return next;
}

export function scheduleCampaign(
  catalogue: Catalogue,
  campaignId: string,
  startsAt: string,
  endsAt: string,
) {
  if (!(startsAt < endsAt))
    throw new Error("The enrolment end must be after the start.");
  const next = structuredClone(catalogue);
  const campaign = next.campaigns.find((item) => item.id === campaignId);
  if (!campaign) throw new Error("Unknown campaign.");
  campaign.status = "active";
  campaign.startsAt = startsAt;
  campaign.endsAt = endsAt;
  return next;
}

export function grantAgreement(input: {
  id: string;
  accountId: string;
  planId: PlanId;
  usdBenchmark: string;
  priceVersionId: string;
  campaignId: string | null;
  agreedAt: string;
}): PriceAgreement {
  return { ...input, status: "active" };
}

export function supersedeAgreement(
  agreements: PriceAgreement[],
  next: PriceAgreement,
) {
  return agreements
    .map((agreement) =>
      agreement.accountId === next.accountId && agreement.status === "active"
        ? { ...agreement, status: "superseded" as const }
        : agreement,
    )
    .concat(next);
}

export function createQuote(input: {
  id: string;
  accountId: string;
  catalogue: Catalogue;
  planId: PlanId;
  at: string;
  validUntil: string;
  fx?: typeof REFERENCE_FX;
}): Quote {
  const offer = offeredPrice(input.catalogue, input.planId, input.at);
  if (!offer.available || !offer.usd || !offer.priceVersionId)
    throw new Error("This plan cannot be bought.");
  const fx = input.fx ?? REFERENCE_FX;
  return {
    id: input.id,
    accountId: input.accountId,
    planId: input.planId,
    priceVersionId: offer.priceVersionId,
    campaignId: offer.campaignId,
    usdBenchmark: offer.usd,
    ghsAmount: cedisFromUsd(offer.usd, fx.ghsPerUsd),
    fxSourceId: fx.id,
    fxDate: fx.asOf,
    terms:
      "The US dollar benchmark stays as agreed. The cedi amount on this quote is the amount approved for this payment.",
    issuedAt: input.at,
    validUntil: input.validUntil,
    status: "open",
  };
}

export function quoteAt(quote: Quote, at: string): Quote {
  if (quote.status === "accepted") return quote;
  if (at >= quote.validUntil) return { ...quote, status: "expired" };
  return { ...quote, status: "open" };
}

export function acceptQuote(quote: Quote, at: string): Quote {
  const current = quoteAt(quote, at);
  if (current.status !== "open")
    throw new Error(
      "This price has expired. Review the current price before paying.",
    );
  return { ...current, status: "accepted" };
}

export function lockedCediAmount(quote: Quote, laterRate: string) {
  if (quote.status !== "accepted")
    throw new Error("Approve the quoted amount before payment.");
  if (!laterRate) throw new Error("Use a numeric exchange rate.");
  return quote.ghsAmount;
}

export function addDays(iso: string, days: number) {
  return new Date(Date.parse(iso) + days * 24 * 60 * 60 * 1000).toISOString();
}

export function startPass(
  existing: ServiceAccess | null,
  input: { paymentId: string; quote: Quote; agreementId: string; at: string },
): ServiceAccess {
  if (existing?.payments.some((payment) => payment.id === input.paymentId))
    return existing;
  if (input.quote.status !== "accepted")
    throw new Error("Approve the quoted amount before payment.");
  return {
    accountId: input.quote.accountId,
    status: "active",
    mode: "pass_30",
    currentPeriodId: `period-${input.paymentId}`,
    periodStartsAt: input.at,
    accessEndsAt: addDays(input.at, 30),
    queuedPeriod: null,
    payments: [
      { id: input.paymentId, status: "approved", quoteId: input.quote.id },
    ],
    agreementId: input.agreementId,
  };
}

export function renewPass(
  access: ServiceAccess,
  input: { paymentId: string; quote: Quote; at: string },
): ServiceAccess {
  if (access.payments.some((payment) => payment.id === input.paymentId))
    return access;
  if (input.quote.status !== "accepted")
    throw new Error("Approve the quoted amount before payment.");
  if (input.quote.usdBenchmark === "")
    throw new Error("Approve the quoted amount before payment.");
  const startsAt = access.accessEndsAt;
  const endsAt = addDays(startsAt, 30);
  return {
    ...access,
    status: "active",
    accessEndsAt: endsAt,
    queuedPeriod: {
      id: `period-${input.paymentId}`,
      startsAt,
      endsAt,
    },
    payments: access.payments.concat({
      id: input.paymentId,
      status: "approved",
      quoteId: input.quote.id,
    }),
  };
}

export function recordFailedPayment(
  access: ServiceAccess,
  paymentId: string,
): ServiceAccess {
  if (access.payments.some((payment) => payment.id === paymentId))
    return access;
  return {
    ...access,
    status: "paused",
    payments: access.payments.concat({
      id: paymentId,
      status: "failed",
      quoteId: null,
    }),
  };
}

export function grantComplimentary(input: {
  id: string;
  accountId: string;
  reason: string;
}): AccessGrant {
  const reason = input.reason.trim();
  if (reason.length < 8)
    throw new Error("Record a reason for complimentary access.");
  return {
    id: input.id,
    accountId: input.accountId,
    kind: "complimentary",
    reason,
    paymentId: null,
  };
}

export function auditChange(input: {
  id: string;
  at: string;
  actorId: string;
  field: string;
  previous: string;
  next: string;
}): AuditEntry {
  return input;
}

export function customerVisibleTicket(ticket: SupportTicket) {
  return { id: ticket.id, status: ticket.status, reply: ticket.customerReply };
}

export type PublicPerk = { headline: string; support: string };
export type PublicPlanCard = {
  id: "free" | "plus";
  name: string;
  priceLine: string;
  cediAmount: string | null;
  standardUsd: string | null;
  offerUsd: string | null;
  perks: PublicPerk[];
  actionLabel: "Start free" | "Choose Plus";
};

export type PublicPricing = {
  specVersion: string;
  title: string;
  introduction: string;
  sharedAllowance: string;
  checkoutEnabled: false;
  protectionStatement: string;
  enrolmentDeadline: null;
  rateLabel: string;
  rate: {
    id: string;
    source: string;
    asOf: string;
    ghsPerUsd: string;
  } | null;
  notes: string[];
  plans: PublicPlanCard[];
};

const customerBanned = [
  "daily processing guard",
  "provider calls",
  "unreachable",
  "usd benchmark",
  "mock entitlement",
  "server-only",
  "feature gate",
  "not a live meter",
  "not for sale",
  "not offered",
  "not available yet",
  "coming soon",
  "preview",
  "payments are off",
];

export function rateUpdatedLabel(asOf: string) {
  const [year, month, day] = asOf.split("-").map(Number);
  if (!year || !month || !day) return "Cedi estimate unavailable right now";
  const monthName = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
  return `Approximate cedi price · rate updated ${day} ${monthName} ${year}`;
}

function minutesLabel(seconds: number) {
  const minutes = seconds / 60;
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export function publicPlansResponse() {
  const model = publicPricingModel();
  const serialized = JSON.stringify(model).toLowerCase();
  if (
    serialized.includes('"unlimited"') ||
    serialized.includes("5.99") ||
    serialized.includes("10.00") ||
    customerBanned.some((phrase) => serialized.includes(phrase))
  )
    throw new Error("Public plans include a private plan or a setup note.");
  return model;
}

export function publicPricingModel(
  input: { fx?: typeof REFERENCE_FX | null } = {},
): PublicPricing {
  const fx = input.fx === undefined ? REFERENCE_FX : input.fx;
  const free = planById(SHIPPED, "free");
  const plus = planById(SHIPPED, "plus");
  const plusRegular = priceById(SHIPPED, plus.regularPriceVersionId);
  const plusOffer = priceById(SHIPPED, CURRENT_PLUS_OFFER_ID);
  const cedi = (usd: string) => (fx ? cedisFromUsd(usd, fx.ghsPerUsd) : null);
  const storySupport =
    "Tell CashNarra what you earned, spent, or still owe. Review the suggested records before saving. One story can contain several records.";
  const voiceSupport =
    "Speak instead of typing. Check and edit the words before continuing.";
  const reportSupport =
    "A neatly arranged financial report in PDF and Excel. Both formats count as one pack; downloading that same pack again uses no extra pack. CSV downloads are unlimited.";
  const perksFor = (plan: PlanDefinition): PublicPerk[] => [
    {
      headline: `${plan.allowances.aiStoriesPerMonth} AI stories a month`,
      support: storySupport,
    },
    {
      headline: `${plan.allowances.activeWorkspaces} workspaces`,
      support: "Keep your personal money and each business separate.",
    },
    {
      headline: `${plan.allowances.voiceNotesPerDay} voice notes a day, up to ${minutesLabel(plan.allowances.voiceNoteSeconds)} each`,
      support: voiceSupport,
    },
    {
      headline: `${plan.allowances.reportPacksPerMonth} PDF/Excel report packs a month`,
      support: reportSupport,
    },
    {
      headline: "Unlimited financial records",
      support:
        "Add as many money records as you need. Manual entries use no AI stories.",
    },
    {
      headline: "Unlimited CSV downloads",
      support: "Download your underlying records without using a report pack.",
    },
  ];
  const plans: PublicPlanCard[] = [
    {
      id: "free",
      name: "Free",
      priceLine: "$0 a month",
      cediAmount: null,
      standardUsd: null,
      offerUsd: null,
      actionLabel: "Start free",
      perks: perksFor(free),
    },
    {
      id: "plus",
      name: "Plus",
      priceLine: `$${plusOffer.usd} a month`,
      cediAmount: cedi(plusOffer.usd),
      standardUsd: plusRegular.usd,
      offerUsd: plusOffer.usd,
      actionLabel: "Choose Plus",
      perks: perksFor(plus),
    },
  ];
  return {
    specVersion: PLAN_SPEC_VERSION,
    title: "Choose your plan",
    introduction:
      "Keep your money records in one place. Choose how much help you need.",
    sharedAllowance: "One plan covers all your workspaces.",
    checkoutEnabled: false,
    protectionStatement:
      "Join during the launch offer and keep your monthly dollar price unless you choose to upgrade.",
    enrolmentDeadline: null,
    rateLabel: fx
      ? rateUpdatedLabel(fx.asOf)
      : "Cedi estimate unavailable right now",
    rate: fx
      ? {
          id: fx.id,
          source: fx.source,
          asOf: fx.asOf,
          ghsPerUsd: fx.ghsPerUsd,
        }
      : null,
    notes: [
      "Your allowances are shared across your workspaces.",
      "A voice story uses one voice note and one AI story when both steps finish successfully.",
      "Unlimited CSV downloads are included in both plans.",
      "No automatic charges for extra usage.",
      "Your dollar price stays fixed. The cedi equivalent may change with the exchange rate.",
    ],
    plans,
  };
}

export function subscriberCediPreview(usdBenchmark: string, ghsPerUsd: string) {
  return {
    usdBenchmark,
    ghs: cedisFromUsd(usdBenchmark, ghsPerUsd),
    rateDate: REFERENCE_FX.asOf,
  };
}

export type UsageMessageCode =
  | "before_understand"
  | "ai_low"
  | "ai_exhausted"
  | "voice_exhausted"
  | "voice_upstream"
  | "voice_off"
  | "transcript_saved"
  | "reports_exhausted"
  | "pending"
  | "provider_credit"
  | "company_daily_guard"
  | "needs_confirmation";

export function messageFor(
  code: UsageMessageCode,
  detail: { remaining?: number; reset?: string } = {},
) {
  const reset = detail.reset ?? "the next reset";
  switch (code) {
    case "before_understand":
      return "This uses 1 AI story. A story can include several payments and expenses.";
    case "ai_low":
      return `You have ${detail.remaining ?? 0} AI stories left in this period. Your allowance resets on ${reset}.`;
    case "ai_exhausted":
      return "You've used this month's AI stories. You can still add records yourself.";
    case "voice_exhausted":
      return `You've used today's 3 voice notes. You can still type your story. Voice resets at ${reset}.`;
    case "voice_upstream":
      return "Voice is busy right now. Keep your recording and try later, or type your story.";
    case "voice_off":
      return "Voice is not available yet.";
    case "transcript_saved":
      return "Your words are ready. Turning them into records is temporarily unavailable. You can edit or copy them.";
    case "reports_exhausted":
      return `Your formatted report allowance resets on ${reset}. You can still download your records as CSV.`;
    case "pending":
      return "We couldn't confirm whether this finished. Keep your recording while we check.";
    case "provider_credit":
      return "Story understanding is temporarily unavailable. Your allowance has not been used.";
    case "company_daily_guard":
      return "Processing is temporarily unavailable. Your plan allowance has not been used.";
    case "needs_confirmation":
      return "This story changed. Ask CashNarra to understand it again if you want to use another AI story.";
  }
}

const accraFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: ACCOUNT_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function accraParts(instant: Date) {
  const parts = Object.fromEntries(
    accraFormat.formatToParts(instant).map((part) => [part.type, part.value]),
  );
  return {
    year: parts.year ?? "",
    month: parts.month ?? "",
    day: parts.day ?? "",
    hour: parts.hour === "24" ? "00" : (parts.hour ?? ""),
    minute: parts.minute ?? "",
  };
}

export function nextMonthlyReset(instant: Date) {
  const { year, month } = accraParts(instant);
  const currentMonth = Number(month);
  const next =
    currentMonth === 12
      ? { year: Number(year) + 1, month: 1 }
      : { year: Number(year), month: currentMonth + 1 };
  const monthName = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(next.year, next.month - 1, 1)));
  return `1 ${monthName} ${next.year}, 00:00 Accra time`;
}

export type SubscriptionPhase =
  | "free"
  | "plus_recurring"
  | "plus_manual"
  | "cancel_scheduled"
  | "plus_expired"
  | "payment_pending"
  | "payment_failed";

export type SubscriptionFacts = {
  phase: SubscriptionPhase;
  mode?: "recurring" | "manual";
  agreedUsd: string | null;
  paidThrough: string | null;
  renewalOn: string | null;
  paymentReference: string | null;
  workspaceCount: number;
  usage: {
    storiesUsed: number | null;
    voiceUsedToday: number | null;
    reportsUsed: number | null;
  };
  voiceEnabled: boolean;
};

export type PaidSubscription = {
  mode: "recurring" | "manual";
  phase: "active" | "cancel_scheduled" | "expired";
  paidThrough: string;
  agreementId: string;
};

function counted(used: number | null, allowance: number, label: string) {
  if (used === null || !Number.isSafeInteger(used) || used < 0)
    return `${label.charAt(0).toUpperCase()}${label.slice(1)}: not counted yet`;
  return `${Math.max(0, allowance - used)} of ${allowance} ${label} left`;
}

function planPhase(phase: SubscriptionPhase) {
  return phase === "free" || phase === "plus_expired" ? "free" : "plus";
}

export function subscriptionView(facts: SubscriptionFacts) {
  const plan = planById(SHIPPED, planPhase(facts.phase));
  const price =
    facts.agreedUsd ?? (plan.id === "free" ? "0" : CURRENT_PLUS_OFFER_USD);
  const voice = facts.voiceEnabled
    ? `${counted(facts.usage.voiceUsedToday, plan.allowances.voiceNotesPerDay, "voice notes today")} · up to ${minutesLabel(plan.allowances.voiceNoteSeconds)} each`
    : "Voice is not available yet.";
  const lines = [
    `${facts.workspaceCount} of ${plan.allowances.activeWorkspaces} workspaces`,
    counted(
      facts.usage.storiesUsed,
      plan.allowances.aiStoriesPerMonth,
      "AI stories",
    ),
    voice,
    counted(
      facts.usage.reportsUsed,
      plan.allowances.reportPacksPerMonth,
      "report packs",
    ),
    "Basic CSV downloads remain available.",
  ];
  const actions: Array<{
    id: string;
    label: string;
    href: string | null;
    primary: boolean;
  }> = [];
  let title = "Free · $0 a month";
  let summary = "One subscription covers every workspace on this account.";
  let cancelCopy: string | null = null;
  if (facts.phase === "free") {
    actions.push(
      {
        id: "upgrade",
        label: "Upgrade to Plus",
        href: "/pricing/plus",
        primary: true,
      },
      {
        id: "details",
        label: "View plan details",
        href: "/pricing",
        primary: false,
      },
    );
  } else if (facts.phase === "plus_recurring") {
    title = `Plus · $${price} a month`;
    summary = `Agreed price $${price} a month. Plus is paid through ${facts.paidThrough}. The next renewal is ${facts.renewalOn}.`;
    cancelCopy = cancelPlusConfirmation(
      facts.paidThrough ?? "the paid-through date",
    );
    actions.push(
      {
        id: "cancel",
        label: "Cancel subscription",
        href: null,
        primary: false,
      },
      { id: "history", label: "Payment history", href: null, primary: false },
    );
  } else if (facts.phase === "plus_manual") {
    title = `Plus · $${price} a month`;
    summary = `Agreed price $${price} a month. Plus lasts until ${facts.paidThrough}. It does not renew by itself.`;
    actions.push(
      {
        id: "renew",
        label: "Renew Plus",
        href: "/pricing/plus",
        primary: true,
      },
      {
        id: "switch_free",
        label: "Switch to Free",
        href: null,
        primary: false,
      },
      { id: "history", label: "Payment history", href: null, primary: false },
    );
  } else if (facts.phase === "cancel_scheduled") {
    title = `Plus until ${facts.paidThrough}, then Free`;
    summary =
      "Plus stays until the day you have already paid for. After that, the account returns to Free. Your records stay available.";
    if (facts.mode !== "manual")
      actions.push({
        id: "keep",
        label: "Keep Plus",
        href: null,
        primary: true,
      });
  } else if (facts.phase === "plus_expired") {
    title = "Plus has ended";
    summary = `The agreed price was $${price} a month. That agreement is still on record. The account is using Free.`;
    actions.push(
      {
        id: "renew",
        label: "Renew Plus",
        href: "/pricing/plus",
        primary: true,
      },
      { id: "use_free", label: "Use Free", href: "/pricing", primary: false },
    );
  } else {
    title =
      facts.phase === "payment_failed"
        ? "Payment did not go through"
        : "Payment is not confirmed yet";
    summary = facts.paymentReference
      ? `Reference ${facts.paymentReference}. Your current access stays while this is checked.`
      : "Your current access stays while this is checked.";
    actions.push({
      id: "check_payment",
      label: "Check payment",
      href: null,
      primary: true,
    });
  }
  if (facts.paymentReference && facts.phase.startsWith("plus"))
    lines.push(`Payment reference ${facts.paymentReference}.`);
  else if (facts.phase === "plus_recurring" || facts.phase === "plus_manual")
    lines.push("No payments are recorded on this account.");
  return { title, summary, lines, actions, cancelCopy };
}

export function cancelPlusConfirmation(paidThrough: string) {
  return `Cancel Plus? You'll keep Plus until ${paidThrough}. After that, your account returns to Free. Your records will stay available.`;
}

export function scheduleEndOfPlus(
  subscription: PaidSubscription,
): PaidSubscription {
  if (subscription.phase !== "active")
    throw new Error("Plus is not active, so there is nothing to stop.");
  return { ...subscription, phase: "cancel_scheduled" };
}

export function keepPlus(subscription: PaidSubscription): PaidSubscription {
  if (subscription.phase !== "cancel_scheduled")
    throw new Error("Plus is not scheduled to end.");
  return {
    ...subscription,
    phase: "active",
    agreementId: subscription.agreementId,
  };
}

export function workspacesAfterFreeLimit(
  workspaceIds: string[],
  keepActive: string[],
) {
  const ids = [...new Set(workspaceIds)];
  const limit = planById(SHIPPED, "free").allowances.activeWorkspaces;
  if (ids.length <= limit) return { active: ids, readable: [] as string[] };
  const keep = [...new Set(keepActive)];
  if (keep.length !== limit || keep.some((id) => !ids.includes(id)))
    throw new Error(
      `Choose ${limit} workspaces to keep active. The others stay readable.`,
    );
  return {
    active: keep,
    readable: ids.filter((id) => !keep.includes(id)),
  };
}

export function planUsageModel(input: {
  now: Date;
  workspaceCount: number;
  voiceEnabled: boolean;
}) {
  const reset = nextMonthlyReset(input.now);
  const view = subscriptionView({
    phase: "free",
    agreedUsd: null,
    paidThrough: null,
    renewalOn: null,
    paymentReference: null,
    workspaceCount: input.workspaceCount,
    usage: {
      storiesUsed: null,
      voiceUsedToday: null,
      reportsUsed: null,
    },
    voiceEnabled: input.voiceEnabled,
  });
  return {
    title: view.title,
    shared: view.summary,
    checkoutEnabled: false as const,
    voiceLine: input.voiceEnabled
      ? "Up to 3 voice notes a day, up to 1 minute each."
      : messageFor("voice_off"),
    workspaceLine: `${input.workspaceCount} ${input.workspaceCount === 1 ? "workspace" : "workspaces"} on this account.`,
    csvLine: "Basic CSV downloads remain available.",
    chargesLine: "No automatic extra charges.",
    resetLine: `Monthly allowances reset ${reset}.`,
    voiceResetLine:
      "Your daily voice allowance resets at midnight, Accra time.",
    sampleLabel: "Example usage",
    sampleLines: [
      "1 of 2 workspaces active",
      "23 of 30 AI stories remaining",
      "2 of 3 voice notes remaining today · up to 1 minute each",
      "1 of 2 formatted report packs remaining",
      `Monthly allowances reset ${reset}.`,
      "No automatic extra charges.",
    ],
    view,
  };
}

export function formatPlanCedis(amount: string) {
  return formatMoney(amount);
}

export type OwnerPlanPreview = {
  id: PlanId;
  name: string;
  visibility: Visibility;
  purchasable: boolean;
  launchStatus: "draft" | "ready";
  campaignStatus: CampaignStatus | "none";
  enrolmentStart: string | null;
  enrolmentEnd: string | null;
  regularUsd: string;
  offerUsd: string | null;
  regularGhs: string;
  offerGhs: string | null;
  quotasApproved: boolean;
  note: string;
};

export function ownerConsoleModel(fx = REFERENCE_FX) {
  const plans: OwnerPlanPreview[] = SHIPPED.plans.map((plan) => {
    const regular = priceById(SHIPPED, plan.regularPriceVersionId);
    const campaign = plan.campaignId
      ? SHIPPED.campaigns.find((item) => item.id === plan.campaignId)
      : undefined;
    const offer = campaign
      ? priceById(SHIPPED, campaign.enrolmentPriceVersionId)
      : undefined;
    return {
      id: plan.id,
      name: plan.name,
      visibility: plan.visibility,
      purchasable: plan.purchasable,
      launchStatus: plan.launchStatus,
      campaignStatus: campaign?.status ?? "none",
      enrolmentStart: campaign?.startsAt ?? null,
      enrolmentEnd: campaign?.endsAt ?? null,
      regularUsd: regular.usd,
      offerUsd: offer?.usd ?? null,
      regularGhs: cedisFromUsd(regular.usd, fx.ghsPerUsd),
      offerGhs: offer ? cedisFromUsd(offer.usd, fx.ghsPerUsd) : null,
      quotasApproved: plan.allowances.quotasApproved,
      note:
        plan.id === "unlimited"
          ? "Private preview. Not for sale. Quota details are not approved and do not grant provider access."
          : plan.id === "plus"
            ? "Preview only. Payments are off, and the drafted AI allowance is not offered."
            : "Public plan design. Payments are off.",
    };
  });
  return {
    specVersion: PLAN_SPEC_VERSION,
    payments: "off" as const,
    plans,
    supportStates: ["open", "waiting", "resolved"] as const,
    rate: fx,
  };
}
