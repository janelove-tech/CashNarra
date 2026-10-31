import { describe, expect, it } from "vitest";
import { landingGoalEstimate } from "../src/components/landing/goal-illustration";
import { landingOffer } from "../src/components/landing/landing-prices";
import {
  initialStoryDemo,
  nextStoryDemo,
  sampleTotals,
  storySummaryReady,
  trickierEvents,
} from "../src/components/landing/sample-fixture";

describe("public landing examples", () => {
  it("keeps the story hidden until it is revealed, then restores it", () => {
    expect(storySummaryReady(initialStoryDemo)).toBe(false);
    const revealed = nextStoryDemo(initialStoryDemo, "reveal");
    expect(storySummaryReady(revealed)).toBe(true);
    const waiting = nextStoryDemo(revealed, "missing");
    expect(waiting.mode).toBe("trickier");
    expect(trickierEvents(waiting.account)[1].account).toBeNull();
    expect(storySummaryReady(waiting)).toBe(false);
    const answered = nextStoryDemo(waiting, "momo");
    expect(trickierEvents(answered.account)[1].account).toBe("MoMo");
    expect(sampleTotals(trickierEvents(answered.account)).net).toBe("1020.00");
    expect(nextStoryDemo(answered, "reset")).toEqual(initialStoryDemo);
  });

  it("estimates the fictional equipment goal from the remaining amount", () => {
    const slower = landingGoalEstimate("300.00");
    const faster = landingGoalEstimate("500.00");
    expect(slower.remaining).toBe("1500.00");
    expect(slower.months).toBe(5);
    expect(faster.remaining).toBe("1500.00");
    expect(faster.months).toBe(3);
    expect(faster.pace).toBe("500.00");
  });

  it("uses the public catalogue and an honest missing cedi rate", () => {
    const offer = landingOffer();
    expect(offer.plans.map((plan) => plan.name)).toEqual(["Free", "Plus"]);
    expect(offer.plans[0].dollars).toBe("$0");
    expect(offer.plans[0].cedi).toBe("(GH₵0.00)");
    expect(offer.plans[0].perks).toContain("Unlimited financial records");
    expect(offer.plans[1].dollars).toBe("$4.00");
    expect(offer.plans[1].standard).toBeNull();
    expect(offer.plans[1].cedi).toMatch(/≈ GH₵/);
    expect(offer.rateLabel).toMatch(/20 October 2026/);
    expect(offer.plans[1].href).toBe("/pricing/plus");
    expect(landingOffer(null).plans[1].cedi).toBe(
      "Cedi estimate unavailable right now",
    );
  });
});
