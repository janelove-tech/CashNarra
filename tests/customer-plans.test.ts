import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { POST as checkout } from "../src/app/api/billing/checkout/route";
import { GET as plans } from "../src/app/api/billing/plans/route";
import { POST as webhook } from "../src/app/api/billing/webhook/route";
import {
  acceptQuote,
  auditChange,
  catalogueAfterPriceEdit,
  cedisFromUsd,
  closePlanToNewPurchases,
  createQuote,
  customerVisibleTicket,
  endCampaign,
  grantAgreement,
  grantComplimentary,
  keepPlus,
  lockedCediAmount,
  messageFor,
  offeredPrice,
  ownerConsoleModel,
  planById,
  planUsageModel,
  priceById,
  publicPlansResponse,
  publicPricingModel,
  purchaseAllowed,
  recordFailedPayment,
  REFERENCE_FX,
  refuseCheckout,
  renewPass,
  scheduleCampaign,
  scheduleEndOfPlus,
  subscriptionView,
  setPlanVisibility,
  shippedCatalogue,
  startPass,
  storiesReachableUnderDailyGuard,
  subscriberCediPreview,
  supersedeAgreement,
  workspacesAfterFreeLimit,
} from "../src/domain/customer-plans";
import { platformOwnerAllowed } from "../src/server/platform-owner";

const rate = REFERENCE_FX.ghsPerUsd;
const owner = "11111111-1111-4111-8111-111111111111";
const member = "22222222-2222-4222-8222-222222222222";

function sellablePlus() {
  const catalogue = scheduleCampaign(
    shippedCatalogue(),
    "plus-launch-2026-10-21",
    "2026-11-01T00:00:00.000Z",
    "2026-12-01T00:00:00.000Z",
  );
  const plus = planById(catalogue, "plus");
  plus.purchasable = true;
  plus.launchStatus = "ready";
  return catalogue;
}

it("rounds the verified 20 October examples to ten pesewas", () => {
  expect(cedisFromUsd("2.00", rate)).toBe("23.20");
  expect(cedisFromUsd("0.99", rate)).toBe("11.50");
  expect(cedisFromUsd("10.00", rate)).toBe("116.10");
  expect(cedisFromUsd("5.99", rate)).toBe("69.50");
  expect(cedisFromUsd("1.25", "1.00")).toBe("1.30");
});

it("keeps a protected price after the campaign ends and the catalogue changes", () => {
  const early = grantAgreement({
    id: "agree-099",
    accountId: "acct",
    planId: "plus",
    usdBenchmark: "0.99",
    priceVersionId: "plus-enrolment-2026-10-21",
    campaignId: "plus-launch-2026-10-21",
    agreedAt: "2026-11-02T00:00:00.000Z",
  });
  const later = grantAgreement({
    id: "agree-200",
    accountId: "other",
    planId: "plus",
    usdBenchmark: "2.00",
    priceVersionId: "plus-regular-2026-10-21",
    campaignId: null,
    agreedAt: "2026-11-03T00:00:00.000Z",
  });
  const ended = endCampaign(shippedCatalogue(), "plus-launch-2026-10-21");
  const edited = catalogueAfterPriceEdit(ended, {
    planId: "plus",
    usd: "4.00",
    at: "2027-01-01T00:00:00.000Z",
    versionId: "plus-regular-2027",
  });
  expect(early.usdBenchmark).toBe("0.99");
  expect(later.usdBenchmark).toBe("2.00");
  expect(priceById(edited.catalogue, "plus-regular-2026-10-21").usd).toBe(
    "2.00",
  );
  expect(priceById(edited.catalogue, "plus-enrolment-2026-10-21").usd).toBe(
    "0.99",
  );
  expect(priceById(edited.catalogue, "plus-regular-2027").usd).toBe("4.00");
  expect(edited.providerPlanUpdates).toEqual([]);
  expect(subscriberCediPreview(early.usdBenchmark, rate).ghs).toBe("11.50");
  expect(subscriberCediPreview(later.usdBenchmark, rate).ghs).toBe("23.20");
  expect(
    auditChange({
      id: "audit-1",
      at: "2027-01-01T00:00:00.000Z",
      actorId: "owner",
      field: "plus.regularUsd",
      previous: "2.00",
      next: "4.00",
    }),
  ).toMatchObject({ previous: "2.00", next: "4.00" });
});

it("uses one price decision for the page boundary and checkout", () => {
  const catalogue = sellablePlus();
  const start = "2026-11-01T00:00:00.000Z";
  const beforeEnd = "2026-11-30T23:59:59.000Z";
  const end = "2026-12-01T00:00:00.000Z";
  expect(offeredPrice(catalogue, "plus", start)).toMatchObject({
    available: true,
    usd: "0.99",
    campaignId: "plus-launch-2026-10-21",
  });
  expect(offeredPrice(catalogue, "plus", beforeEnd).usd).toBe("0.99");
  expect(offeredPrice(catalogue, "plus", end)).toMatchObject({
    available: true,
    usd: "2.00",
    campaignId: null,
  });
  const drafted = shippedCatalogue();
  expect(offeredPrice(drafted, "plus", start).available).toBe(false);
  expect(purchaseAllowed(drafted, "plus", start)).toBe(false);
});

it("locks an accepted quote when the rate or the campaign changes later", () => {
  const catalogue = sellablePlus();
  const at = "2026-11-15T00:00:00.000Z";
  const open = createQuote({
    id: "quote-1",
    accountId: "acct",
    catalogue,
    planId: "plus",
    at,
    validUntil: "2026-11-16T00:00:00.000Z",
  });
  const accepted = acceptQuote(open, at);
  const ended = endCampaign(catalogue, "plus-launch-2026-10-21");
  expect(planById(ended, "plus").purchasable).toBe(true);
  expect(accepted.usdBenchmark).toBe("0.99");
  expect(accepted.ghsAmount).toBe("11.50");
  expect(lockedCediAmount(accepted, "99.9999")).toBe("11.50");
  expect(() => acceptQuote(open, "2026-11-16T00:00:00.000Z")).toThrow(
    /expired/,
  );
});

it("does not sell the shipped plans", () => {
  expect(refuseCheckout("unlimited").code).toBe("plan_unavailable");
  expect(refuseCheckout("plus")).toMatchObject({
    code: "checkout_disabled",
    offered: { available: false },
  });
  expect(() =>
    createQuote({
      id: "nope",
      accountId: "acct",
      catalogue: shippedCatalogue(),
      planId: "unlimited",
      at: "2026-11-01T00:00:00.000Z",
      validUntil: "2026-11-02T00:00:00.000Z",
    }),
  ).toThrow(/cannot be bought/);
});

it("refuses checkout and webhooks without granting access", async () => {
  const unlimited = await checkout(
    new Request("http://127.0.0.1/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ planId: "unlimited" }),
    }),
  );
  expect(unlimited.status).toBe(403);
  expect(await unlimited.json()).toEqual({
    ok: false,
    code: "plan_unavailable",
    message: "That plan is not available.",
  });
  const plus = await checkout(
    new Request("http://127.0.0.1/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ planId: "plus" }),
    }),
  );
  expect(await plus.json()).toMatchObject({ code: "checkout_disabled" });
  const notice = await webhook();
  expect(notice.status).toBe(403);
  expect(await notice.json()).toMatchObject({ code: "payments_disabled" });
  const listed = await (await plans()).json();
  expect(listed.checkoutEnabled).toBe(false);
  expect(listed.plans.map((plan: { id: string }) => plan.id)).toEqual([
    "free",
    "plus",
  ]);
  expect(JSON.stringify(listed)).not.toContain("5.99");
  expect(JSON.stringify(listed)).not.toContain('"unlimited"');
});

it("shows the finished Free and Plus comparison and keeps Unlimited private", () => {
  const preview = publicPricingModel();
  const withoutRate = publicPricingModel({ fx: null });
  expect(preview.checkoutEnabled).toBe(false);
  expect(preview.enrolmentDeadline).toBeNull();
  expect(preview.title).toBe("Choose your plan");
  expect(preview.plans.map((plan) => plan.name)).toEqual(["Free", "Plus"]);
  const plus = preview.plans[1];
  expect(plus?.standardUsd).toBe("2.00");
  expect(plus?.offerUsd).toBe("0.99");
  expect(preview.plans[0]?.priceLine).toBe("$0 a month");
  expect(plus?.cediAmount).toBe("11.50");
  expect(plus?.perks[0]?.headline).toBe("Unlimited financial records");
  expect(plus?.perks.map((perk) => perk.headline)).toContain(
    "500 AI stories a month",
  );
  expect(plus?.perks.map((perk) => perk.headline)).toContain(
    "3 voice notes a day, up to 2 minutes each",
  );
  expect(preview.plans[0]?.perks.map((perk) => perk.headline)).toContain(
    "3 voice notes a day, up to 1 minute each",
  );
  expect(preview.rateLabel).toBe(
    "Approximate cedi price · rate updated 20 October 2026",
  );
  expect(withoutRate.plans[1]?.cediAmount).toBeNull();
  expect(withoutRate.rateLabel).toBe("Cedi estimate unavailable right now");
  expect(withoutRate.plans[1]?.offerUsd).toBe("0.99");
  const serialized = JSON.stringify(preview).toLowerCase();
  expect(serialized).not.toContain("5.99");
  expect(serialized).not.toContain("not for sale");
  expect(serialized).not.toContain("not offered");
  expect(serialized).not.toContain("daily processing guard");
  expect(publicPlansResponse().plans).toHaveLength(2);
  const owner = ownerConsoleModel();
  const hidden = owner.plans.find((plan) => plan.id === "unlimited");
  expect(hidden).toMatchObject({
    visibility: "private",
    purchasable: false,
    launchStatus: "draft",
    campaignStatus: "draft",
    enrolmentStart: null,
    enrolmentEnd: null,
    regularUsd: "10.00",
    offerUsd: "5.99",
    quotasApproved: false,
  });
  expect(storiesReachableUnderDailyGuard(100)).toBe(true);
  expect(storiesReachableUnderDailyGuard(500)).toBe(false);
  const page = readFileSync("src/app/owner/page.tsx", "utf8");
  expect(page).not.toContain("5.99");
  expect(page).not.toContain("Unlimited");
});

it("does not make a private plan purchasable by revealing it", () => {
  const revealed = setPlanVisibility(
    shippedCatalogue(),
    "unlimited",
    "public",
  );
  expect(planById(revealed, "unlimited").purchasable).toBe(false);
  expect(purchaseAllowed(revealed, "unlimited", "2026-11-01T00:00:00.000Z")).toBe(
    false,
  );
  const closed = closePlanToNewPurchases(sellablePlus(), "plus");
  expect(purchaseAllowed(closed, "plus", "2026-11-02T00:00:00.000Z")).toBe(
    false,
  );
});

it("extends a 30-day pass once, and a failed payment keeps the price agreement", () => {
  const catalogue = sellablePlus();
  const at = "2026-11-02T00:00:00.000Z";
  const accepted = acceptQuote(
    createQuote({
      id: "quote-pass",
      accountId: "acct",
      catalogue,
      planId: "plus",
      at,
      validUntil: "2026-11-03T00:00:00.000Z",
    }),
    at,
  );
  const agreements = [
    grantAgreement({
      id: "agree-pass",
      accountId: "acct",
      planId: "plus",
      usdBenchmark: accepted.usdBenchmark,
      priceVersionId: accepted.priceVersionId,
      campaignId: accepted.campaignId,
      agreedAt: at,
    }),
  ];
  const first = startPass(null, {
    paymentId: "pay-1",
    quote: accepted,
    agreementId: agreements[0].id,
    at,
  });
  const replay = startPass(first, {
    paymentId: "pay-1",
    quote: accepted,
    agreementId: agreements[0].id,
    at: "2026-11-03T00:00:00.000Z",
  });
  expect(replay).toBe(first);
  const renewed = renewPass(first, {
    paymentId: "pay-2",
    quote: accepted,
    at: "2026-11-10T00:00:00.000Z",
  });
  expect(first.accessEndsAt).toBe("2026-12-02T00:00:00.000Z");
  expect(renewed.currentPeriodId).toBe(first.currentPeriodId);
  expect(renewed.accessEndsAt).toBe("2027-01-01T00:00:00.000Z");
  expect(renewed.queuedPeriod?.startsAt).toBe(first.accessEndsAt);
  expect(renewPass(renewed, { paymentId: "pay-2", quote: accepted, at }).accessEndsAt).toBe(
    renewed.accessEndsAt,
  );
  const paused = recordFailedPayment(renewed, "pay-3");
  expect(paused.status).toBe("paused");
  expect(paused.agreementId).toBe("agree-pass");
  expect(agreements[0].usdBenchmark).toBe("0.99");
  expect(recordFailedPayment(paused, "pay-3").payments).toHaveLength(
    paused.payments.length,
  );
});

it("keeps an old agreement when the customer upgrades, and a grant is not a payment", () => {
  const original = grantAgreement({
    id: "old",
    accountId: "acct",
    planId: "plus",
    usdBenchmark: "2.00",
    priceVersionId: "plus-regular-2026-10-21",
    campaignId: null,
    agreedAt: "2026-11-01T00:00:00.000Z",
  });
  const upgrade = grantAgreement({
    id: "new",
    accountId: "acct",
    planId: "plus",
    usdBenchmark: "0.99",
    priceVersionId: "plus-enrolment-2026-10-21",
    campaignId: "plus-launch-2026-10-21",
    agreedAt: "2026-12-01T00:00:00.000Z",
  });
  const history = supersedeAgreement([original], upgrade);
  expect(history).toHaveLength(2);
  expect(history[0]).toMatchObject({
    usdBenchmark: "2.00",
    status: "superseded",
  });
  expect(history[1]).toMatchObject({ usdBenchmark: "0.99", status: "active" });
  const payments: { id: string }[] = [];
  const grant = grantComplimentary({
    id: "grant-1",
    accountId: "acct",
    reason: "Support access while checkout is off.",
  });
  expect(grant.paymentId).toBeNull();
  expect(payments).toEqual([]);
  const visible = customerVisibleTicket({
    id: "ticket-1",
    status: "waiting",
    customerReply: "We are looking at the plan preview.",
    privateNote: "Do not mention the provider balance.",
  });
  expect(visible).not.toHaveProperty("privateNote");
  expect(JSON.stringify(visible)).not.toContain("provider balance");
});

it("separates plan exhaustion from a provider incident and a disabled feature", () => {
  expect(messageFor("ai_exhausted", { reset: "1 November 2026" })).toContain(
    "this month's AI stories",
  );
  expect(messageFor("voice_exhausted", { reset: "00:00 Accra time" })).toContain(
    "today's 3 voice notes",
  );
  expect(messageFor("reports_exhausted")).toContain("CSV");
  expect(messageFor("voice_off")).toBe("Voice is not available yet.");
  expect(messageFor("voice_upstream")).toContain("busy right now");
  expect(messageFor("provider_credit")).not.toMatch(/upgrade/i);
  expect(messageFor("company_daily_guard")).not.toMatch(/upgrade/i);
  expect(messageFor("provider_credit")).not.toContain("used your AI stories");
  expect(messageFor("pending")).toContain("couldn't confirm");
  const usage = planUsageModel({
    now: new Date("2026-10-21T12:00:00.000Z"),
    workspaceCount: 2,
    voiceEnabled: false,
  });
  expect(usage.title).toBe("Free · $0 a month");
  expect(usage.voiceLine).toBe("Voice is not available yet.");
  expect(usage.checkoutEnabled).toBe(false);
  expect(usage.resetLine).toContain("1 November 2026, 00:00 Accra time");
  expect(usage.sampleLabel).toBe("Example usage");
  expect(usage.sampleLines.join(" ")).toContain("2 of 3 voice notes");
  expect(usage.view.lines.join(" ")).toContain("not counted yet");
  expect(usage.view.lines.join(" ")).not.toContain("63 of 100");
  expect(usage.view.actions.map((action) => action.label)).toEqual([
    "Upgrade to Plus",
    "View plan details",
  ]);
});

it("allows only an allowlisted platform owner, never a demo session", () => {
  expect(
    platformOwnerAllowed({ userId: owner, demo: false, allowlist: [owner] }),
  ).toBe(true);
  expect(
    platformOwnerAllowed({
      userId: member,
      demo: false,
      allowlist: [owner],
    }),
  ).toBe(false);
  expect(
    platformOwnerAllowed({
      userId: owner,
      demo: true,
      allowlist: [owner],
    }),
  ).toBe(false);
  expect(
    platformOwnerAllowed({ userId: owner, demo: false, allowlist: [] }),
  ).toBe(false);
});

const blankUsage = {
  storiesUsed: null,
  voiceUsedToday: null,
  reportsUsed: null,
};

it("describes each subscription state without granting Plus", () => {
  const recurring = subscriptionView({
    phase: "plus_recurring",
    mode: "recurring",
    agreedUsd: "0.99",
    paidThrough: "21 November 2026",
    renewalOn: "21 November 2026",
    paymentReference: null,
    workspaceCount: 2,
    usage: blankUsage,
    voiceEnabled: true,
  });
  expect(recurring.summary).toContain("paid through 21 November 2026");
  expect(recurring.actions.map((action) => action.label)).toContain(
    "Cancel subscription",
  );
  expect(recurring.cancelCopy).toContain("Your records will stay available");
  const manual = subscriptionView({
    phase: "plus_manual",
    mode: "manual",
    agreedUsd: "0.99",
    paidThrough: "21 November 2026",
    renewalOn: null,
    paymentReference: null,
    workspaceCount: 1,
    usage: blankUsage,
    voiceEnabled: false,
  });
  expect(manual.summary).toContain("does not renew by itself");
  expect(manual.actions.map((action) => action.label)).toContain(
    "Switch to Free",
  );
  expect(manual.actions.map((action) => action.label)).not.toContain(
    "Cancel subscription",
  );
  const ending = scheduleEndOfPlus({
    mode: "recurring",
    phase: "active",
    paidThrough: "21 November 2026",
    agreementId: "agree-1",
  });
  expect(ending.phase).toBe("cancel_scheduled");
  expect(ending.agreementId).toBe("agree-1");
  expect(keepPlus(ending).phase).toBe("active");
  const scheduled = subscriptionView({
    phase: "cancel_scheduled",
    mode: "recurring",
    agreedUsd: "0.99",
    paidThrough: "21 November 2026",
    renewalOn: null,
    paymentReference: null,
    workspaceCount: 2,
    usage: { storiesUsed: 4, voiceUsedToday: 1, reportsUsed: 0 },
    voiceEnabled: true,
  });
  expect(scheduled.title).toBe("Plus until 21 November 2026, then Free");
  expect(scheduled.lines.join(" ")).toContain("496 of 500 AI stories left");
  const failed = subscriptionView({
    phase: "payment_failed",
    agreedUsd: "0.99",
    paidThrough: "21 November 2026",
    renewalOn: null,
    paymentReference: "ref-9",
    workspaceCount: 1,
    usage: blankUsage,
    voiceEnabled: false,
  });
  expect(failed.title).toBe("Payment did not go through");
  expect(failed.summary).toContain("current access stays");
  expect(failed.summary).not.toMatch(/paid|success/i);
});

it("keeps extra workspaces readable when Free allows three", () => {
  expect(workspacesAfterFreeLimit(["a", "b"], [])).toEqual({
    active: ["a", "b"],
    readable: [],
  });
  expect(
    workspacesAfterFreeLimit(["a", "b", "c", "d", "e"], ["a", "c", "e"]),
  ).toEqual({ active: ["a", "c", "e"], readable: ["b", "d"] });
  expect(() => workspacesAfterFreeLimit(["a", "b", "c", "d"], ["a"])).toThrow(
    /Choose 3 workspaces/,
  );
});
