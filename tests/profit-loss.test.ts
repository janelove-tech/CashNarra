import { expect, it } from "vitest";
import { emptyWorkspace, event, fixture } from "../src/domain/fixture";
import { emptyProfitReview, profitLoss } from "../src/domain/profit-loss";

const today = "2026-10-19";

it("keeps profit unknown until the missing costs are supplied", () => {
  const report = profitLoss(
    fixture(),
    "2026-10-13",
    "2026-10-13",
    emptyProfitReview,
    today,
  );
  expect(report.sales).toBe("2400.00");
  expect(report.expenses).toBe("80.00");
  expect(report.stockPurchased).toBe("700.00");
  expect(report.otherIncome).toBe("0.00");
  expect(report.profit).toBeNull();
  expect(report.missing.join(" ")).toMatch(/cost of goods sold/i);
  expect(report.records.some((record) => record.kind === "transfer" && record.included)).toBe(
    false,
  );
  expect(report.records.some((record) => record.kind === "owner_out" && record.included)).toBe(
    false,
  );
  expect(
    report.records.some((record) => record.kind === "receivable_payment" && record.included),
  ).toBe(false);
});

it("calculates profit only from reviewed sales, costs and recorded expenses", () => {
  const workspace = fixture();
  for (const record of [
    event("income", "40.00", "Delivery fee", "cash"),
    event("loan_received", "1000.00", "Loan in", "cash", { party: "Lender" }),
    event("credit_expense", "15.00", "Unpaid packaging", null, { party: "Rider" }),
  ])
    workspace.records.push({
      ...record,
      sourceId: "test",
      version: 1,
      removed: false,
      replaces: null,
    });
  const report = profitLoss(
    workspace,
    "2026-10-13",
    "2026-10-13",
    {
      costOfSales: "400.00",
      depreciation: "0.00",
      otherCosts: "10.00",
      salesComplete: true,
      costsComplete: true,
      note: "Counted the goods sold from the shelf list.",
    },
    today,
  );
  expect(report.sales).toBe("2400.00");
  expect(report.otherIncome).toBe("40.00");
  expect(report.expenses).toBe("95.00");
  expect(report.stockPurchased).toBe("700.00");
  expect(report.grossProfit).toBe("2000.00");
  expect(report.profit).toBe("1935.00");
  expect(report.missing).toEqual([]);
});

it("refuses a profit when an entered cost has no explanation", () => {
  const report = profitLoss(fixture(), "2026-10-13", "2026-10-13", {
    costOfSales: "400.00",
    depreciation: "0.00",
    otherCosts: "0.00",
    salesComplete: true,
    costsComplete: true,
    note: "   ",
  }, today);
  expect(report.profit).toBeNull();
  expect(report.missing.join(" ")).toMatch(/where your extra cost figures came from/i);
});

it("rejects a personal workspace, a future period and a negative cost", () => {
  const personal = emptyWorkspace("owner", "Home", "Personal");
  expect(() =>
    profitLoss(personal, "2026-10-13", "2026-10-13", emptyProfitReview, today),
  ).toThrow(/business workspace/);
  expect(() =>
    profitLoss(fixture(), "2026-10-20", "2026-10-20", emptyProfitReview, today),
  ).toThrow(/ending today or earlier/);
  expect(() =>
    profitLoss(
      fixture(),
      "2026-10-13",
      "2026-10-13",
      { ...emptyProfitReview, costOfSales: "-1.00" },
      today,
    ),
  ).toThrow(/cannot be negative/);
});
