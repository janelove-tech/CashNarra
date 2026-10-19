import { expect, it } from "vitest";
import { emptyWorkspace, event } from "../src/domain/fixture";
import { storyCalculation } from "../src/domain/story-calculation";
import type { RecordEvent } from "../src/domain/types";

it("calculates exact percentages from the chosen period without counting transfers or old debt twice", () => {
  const w = emptyWorkspace("owner");
  const record = (
    kind: RecordEvent["kind"],
    amount: string,
    date = "2026-10-17",
    removed = false,
  ): RecordEvent => ({
    ...event(kind, amount, "Synthetic record", null, { date }),
    sourceId: "source",
    version: 1,
    removed,
    replaces: null,
  });
  w.records = [
    record("sale", "26000.00"),
    record("credit_sale", "3000.00"),
    record("sale", "5000.00", "2026-10-19"),
    record("transfer", "500.00"),
    record("owner_in", "700.00"),
    record("loan_received", "900.00"),
    record("receivable_payment", "200.00"),
    record("sale", "999.00", "2026-10-16"),
    record("sale", "999.00", "2026-10-20"),
    record("sale", "999.00", "2026-10-17", true),
  ];
  const before = structuredClone(w);
  const result = storyCalculation(w, {
    recordId: "proposal",
    percent: "20",
    from: "2026-10-17",
    to: "2026-10-19",
    basis: "unclear",
  });
  expect(result.options.map((o) => [o.total, o.amount])).toEqual([
    ["34000.00", "6800.00"],
    ["31200.00", "6240.00"],
  ]);
  expect(result.options[0].records).toHaveLength(3);
  expect(w).toEqual(before);
  expect(
    storyCalculation(emptyWorkspace("other"), {
      recordId: "p",
      percent: "20",
      from: "2026-10-17",
      to: "2026-10-19",
      basis: "revenue",
    }).options[0].total,
  ).toBe("0.00");
});

it("rounds once to pesewas and rejects missing or invalid dates and percentages", () => {
  const w = emptyWorkspace("owner");
  w.records = [
    {
      ...event("sale", "0.03", "Small sale"),
      sourceId: "s",
      version: 1,
      removed: false,
      replaces: null,
    },
  ];
  const request = {
    recordId: "p",
    percent: "50",
    from: "2026-10-13",
    to: "2026-10-13",
    basis: "revenue" as const,
  };
  expect(storyCalculation(w, request).options[0].amount).toBe("0.02");
  for (const change of [
    { from: null },
    { to: "2026-02-30" },
    { to: "2026-10-12" },
    { percent: "101" },
    { percent: "0" },
  ])
    expect(() => storyCalculation(w, { ...request, ...change })).toThrow();
});
