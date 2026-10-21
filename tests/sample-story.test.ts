import { describe, expect, it } from "vitest";
import {
  clearEvents,
  sampleTotals,
  trickierEvents,
} from "../src/components/landing/sample-fixture";

describe("public fictional sample", () => {
  it("keeps a cash sale, a delivery payment and an old-debt settlement apart", () => {
    const totals = sampleTotals(clearEvents);
    expect(totals.sales).toBe("900.00");
    expect(totals.debtSettlement).toBe("200.00");
    expect(totals.received).toBe("1100.00");
    expect(totals.paid).toBe("80.00");
    expect(totals.net).toBe("1020.00");
    expect(totals.sales).not.toBe(totals.received);
    expect(clearEvents.find((event) => event.id === "debt")?.meaning).toContain(
      "not a new sale",
    );
  });

  it("withholds the delivery account until the example chooses one", () => {
    expect(trickierEvents(null)[1].account).toBeNull();
    expect(trickierEvents("MoMo")[1].account).toBe("MoMo");
    expect(sampleTotals(trickierEvents("MoMo")).net).toBe("1020.00");
  });
});
