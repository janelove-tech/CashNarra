import { expect, it } from "vitest";
import { event, fixture } from "../src/domain/fixture";
import { applyBatch, report } from "../src/domain/ledger";
import { reviewImpacts } from "../src/domain/review-impact";
import type { Batch, Workspace } from "../src/domain/types";

function batch(
  w: Workspace,
  events: Batch["events"],
  replaceIds: string[] = [],
): Batch {
  return {
    requestId: "preview-only",
    revision: 0,
    expectedVersion: w.version,
    source: "Fictional review",
    events,
    replaceIds,
    reason: "Correct an entered amount",
    allowDuplicates: false,
  };
}

it("previews the remaining debt without posting or changing recorded totals", () => {
  const w = fixture("synthetic", false);
  const original = structuredClone(w);
  const payment = event(
    "receivable_payment",
    "200.00",
    "Abena payment",
    "momo",
    {
      obligationId: "opening-abena",
      party: "Abena",
    },
  );
  expect(reviewImpacts(w, batch(w, [payment]))).toEqual([
    {
      id: "opening-abena",
      party: "Abena",
      direction: "receivable",
      before: "600.00",
      after: "400.00",
    },
  ]);
  expect(w).toEqual(original);
  expect(report(w, "2026-10-13", "2026-10-13").sales).toBe("0.00");
});

it("previews a payment correction against the actual existing balance", () => {
  const w = fixture();
  const payment = w.records.find(
    (record) => record.kind === "receivable_payment",
  )!;
  const corrected = { ...payment, id: crypto.randomUUID(), amount: "150.00" };
  expect(
    reviewImpacts(w, batch(w, [corrected], [payment.id]))[0],
  ).toMatchObject({
    before: "400.00",
    after: "450.00",
  });
  expect(payment.amount).toBe("200.00");
});

it("includes preserved settlements when previewing an original debt correction", () => {
  const w = fixture();
  const original = w.records.find((record) => record.id === "opening-abena")!;
  const corrected = { ...original, id: crypto.randomUUID(), amount: "500.00" };
  expect(
    reviewImpacts(w, batch(w, [corrected], [original.id]))[0],
  ).toMatchObject({
    id: corrected.id,
    before: "400.00",
    after: "300.00",
  });
});

it("refuses to preview an invalid batch and keeps all original records", () => {
  const w = fixture();
  const before = structuredClone(w);
  const tooMuch = event("receivable_payment", "401.00", "Overpayment", "momo", {
    obligationId: "opening-abena",
    party: "Abena",
  });
  expect(() => reviewImpacts(w, batch(w, [tooMuch]))).toThrow();
  expect(w).toEqual(before);
});

it("previews a payable settlement without treating it as another expense", () => {
  const w = fixture();
  const payment = event(
    "payable_payment",
    "125.00",
    "Supplier payment",
    "cash",
    {
      obligationId: "opening-supplier",
      party: "Adjei Packaging",
    },
  );
  expect(reviewImpacts(w, batch(w, [payment]))).toEqual([
    {
      id: "opening-supplier",
      party: "Adjei Packaging",
      direction: "payable",
      before: "500.00",
      after: "375.00",
    },
  ]);
  expect(report(w, "2026-10-13", "2026-10-13").paid).toBe("930.00");
});

it("keeps a specific balance distinct from another debt to the same person", () => {
  const initial = fixture();
  const w = applyBatch(
    initial,
    batch(initial, [
      event("opening_receivable", "300.00", "Another Abena balance", null, {
        party: "Abena",
        date: "2026-10-12",
      }),
    ]),
  );
  const impacts = reviewImpacts(
    w,
    batch(w, [
      event(
        "receivable_payment",
        "200.00",
        "Payment on the first balance",
        "cash",
        { party: "Abena", obligationId: "opening-abena", date: "2026-10-14" },
      ),
    ]),
  );
  expect(impacts).toHaveLength(1);
  expect(impacts[0]).toMatchObject({
    id: "opening-abena",
    before: "400.00",
    after: "200.00",
  });
});
