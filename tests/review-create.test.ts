import { it, expect } from "vitest";
import { fixture, event } from "../src/domain/fixture";
import { applyBatch } from "../src/domain/ledger";
import {
  accountCreatePrompt,
  accountDraft,
  accountTypeForName,
  balanceCreatePrompt,
  openingForSettlement,
  reviewObligations,
} from "../src/domain/review-create";

it("names a missing account and keeps an existing one available", () => {
  expect(accountTypeForName("Business MTN MoMo")).toBe("MoMo");
  expect(accountTypeForName("Business bank")).toBe("Bank");
  expect(accountTypeForName("Shop cash")).toBe("Cash");
  expect(accountCreatePrompt("Shop cash", false)).toBe(
    "Shop cash is not in this workspace. Create it and use it for this record?",
  );
  expect(accountCreatePrompt("Cash", true)).toContain("already in this workspace");
  expect(
    accountDraft({
      name: " Shop cash ",
      type: "Cash",
      opening: null,
      openingDate: "2026-10-01",
      recordDate: "2026-10-02",
      existingNames: ["Cash"],
    }),
  ).toMatchObject({ name: "Shop cash", type: "Cash", opening: null });
  expect(() =>
    accountDraft({
      name: "Cash",
      type: "Cash",
      opening: null,
      openingDate: "2026-10-03",
      recordDate: "2026-10-02",
      existingNames: [],
    }),
  ).toThrow(/on or before/);
});

it("creates a draft balance that the payment can settle in the same review", () => {
  const payment = event(
    "receivable_payment",
    "400.00",
    "Mabel paid",
    "cash",
    { date: "2026-10-16", party: "Mabel" },
  );
  const opening = openingForSettlement(payment, {
    name: "Mabel",
    amount: "600.00",
    date: "2026-10-03",
  });
  expect(opening.kind).toBe("opening_receivable");
  expect(opening.party).toBe("Mabel");
  expect(balanceCreatePrompt("receivable_payment", "Mabel", false)).toContain(
    "There is no saved balance for Mabel",
  );
  expect(() =>
    openingForSettlement(payment, {
      name: "Mabel",
      amount: "100.00",
      date: "2026-10-03",
    }),
  ).toThrow(/cover this payment/);
  const w = fixture();
  const linked = { ...payment, obligationId: opening.id, party: "Mabel" };
  expect(
    reviewObligations(w, [opening, linked]).find((item) => item.id === opening.id)
      ?.remaining,
  ).toBe("200.00");
  const saved = applyBatch(
    { ...w, version: w.version },
    {
      requestId: "review",
      revision: 1,
      expectedVersion: w.version,
      source: "Mabel paid part of a new balance",
      events: [opening, linked],
      replaceIds: [],
      reason: "",
      allowDuplicates: false,
    },
  );
  expect(
    saved.records.find((record) => record.id === linked.id)?.obligationId,
  ).toBe(opening.id);
});
