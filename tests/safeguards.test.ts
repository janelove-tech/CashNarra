import { it, expect } from "vitest";
import { fixture, event, emptyWorkspace } from "../src/domain/fixture";
import {
  applyBatch,
  accountBalance,
  report,
  duplicates,
} from "../src/domain/ledger";
import { prepareMove } from "../src/domain/move";
import { validateExtraction } from "../src/server/ai";
it("corrects an opening debt while preserving its payment and rejecting overpayment", () => {
  const w = fixture();
  const original = w.records.find((r) => r.id === "opening-abena")!;
  const payment = w.records.find((r) => r.obligationId === original.id)!;
  const replacement = event(
    "opening_receivable",
    "650.00",
    "Corrected opening",
    null,
    { party: original.party, date: original.date },
  );
  const batch = {
    requestId: "correct-debt",
    revision: 0,
    expectedVersion: w.version,
    source: "Opening balance correction",
    replaceIds: [original.id],
    reason: "Original amount misstated",
    allowDuplicates: true,
    events: [replacement],
  };
  const n = applyBatch(w, batch);
  const linked = n.records.filter(
    (r) => !r.removed && r.obligationId === replacement.id,
  );
  expect(linked).toHaveLength(1);
  expect(linked[0].amount).toBe(payment.amount);
  expect(linked[0].sourceId).toBe(payment.sourceId);
  expect(accountBalance(n, "momo")).toBe(accountBalance(w, "momo"));
  expect(report(n, "2026-10-13", "2026-10-13").peopleOwe).toBe("750.00");
  expect(n.history.some((h) => h.before.id === payment.id)).toBe(true);
  expect(() =>
    applyBatch(w, { ...batch, events: [{ ...replacement, amount: "100.00" }] }),
  ).toThrow("exceeds");
  expect(w.records.find((r) => r.id === original.id)?.removed).toBe(false);
});
it("moves a misfiled independent expense atomically prepared with two histories", () => {
  const w = fixture("owner"),
    dest = emptyWorkspace("owner");
  dest.accounts = [
    {
      id: "personal-cash",
      name: "Cash",
      type: "Cash",
      currency: "GHS",
      opening: "100.00",
      openingDate: "2026-10-01",
    },
  ];
  const r = w.records.find((r) => r.kind === "expense")!;
  const m = prepareMove(
    w,
    dest,
    r.id,
    "personal-cash",
    "Filed incorrectly",
    "move",
  );
  expect(accountBalance(m.from, "momo")).toBe("3100.00");
  expect(accountBalance(m.to, "personal-cash")).toBe("20.00");
  expect(m.from.history[0].reason).toContain(m.to.id);
  expect(m.to.sources[0].text).toContain(r.id);
  expect(() =>
    prepareMove(
      w,
      { ...dest, ownerId: "other" },
      r.id,
      "personal-cash",
      "Wrong",
      "key",
    ),
  ).toThrow();
  expect(() =>
    prepareMove(w, dest, "opening-abena", "personal-cash", "Wrong", "key"),
  ).toThrow();
});
it("does not duplicate-warn from equal amounts and accounts alone", () => {
  const w = fixture();
  expect(
    duplicates(w, [
      event("expense", "80.00", "Different vendor and purpose", "momo"),
    ]),
  ).toEqual([]);
});
it("distinguishes loan principal from supplier settlement", () => {
  const w = fixture();
  const base = {
    requestId: "loan",
    revision: 0,
    expectedVersion: w.version,
    source: "Payment",
    replaceIds: [],
    reason: "",
    allowDuplicates: true,
  };
  expect(() =>
    applyBatch(w, {
      ...base,
      events: [
        event("loan_principal", "100.00", "Repayment", "cash", {
          obligationId: "opening-supplier",
        }),
      ],
    }),
  ).toThrow("loan");
  const n = applyBatch(w, {
    ...base,
    events: [
      event("loan_principal", "100.00", "Repayment", "cash", {
        obligationId: "opening-loan",
      }),
    ],
  });
  expect(report(n, "2026-10-13", "2026-10-13").userOwes).toBe("1400.00");
  expect(report(n, "2026-10-13", "2026-10-13").sales).toBe("2400.00");
});
it("requires split totals and keeps zero-retention narration out of saved sources", () => {
  const w = fixture(),
    r = w.records.find((r) => r.kind === "expense")!;
  const base = {
    requestId: "split",
    revision: 0,
    expectedVersion: w.version,
    source: "Private narration",
    replaceIds: [r.id],
    reason: "Split record",
    allowDuplicates: true,
  };
  expect(() =>
    applyBatch(w, {
      ...base,
      events: [event("expense", "70.00", "Part", "momo")],
    }),
  ).toThrow("total");
  w.retentionDays = 0;
  const n = applyBatch(w, {
    ...base,
    events: [event("expense", "80.00", "Part", "momo")],
  });
  expect(n.sources.at(-1)?.text).toBeNull();
});
it("treats model references as untrusted and forces consequential clarification", () => {
  const w = fixture();
  expect(() =>
    validateExtraction(
      {
        events: [event("expense", "10.00", "Foreign", "not-owned")],
        questions: [],
        explanation: "",
      },
      w,
    ),
  ).toThrow("unavailable");
  const result = validateExtraction(
    {
      events: [event("expense", "", "Missing amount", null)],
      questions: [],
      explanation: "",
    },
    w,
  );
  expect(result.questions[0].field).toBe("amount");
  expect(duplicates(w, result.events)).toEqual([]);
});
