import { z } from "zod";
import { calendarDate } from "./dates";
import { ledger } from "./ledger";
import { D, money, sum } from "./money";
import type { Workspace } from "./types";

export const profitReviewSchema = z
  .object({
    costOfSales: z.string().nullable(),
    depreciation: z.string().nullable(),
    otherCosts: z.string().nullable(),
    salesComplete: z.boolean(),
    costsComplete: z.boolean(),
    note: z.string().max(2000),
  })
  .strict();
export type ProfitReview = z.infer<typeof profitReviewSchema>;
export const emptyProfitReview: ProfitReview = {
  costOfSales: null,
  depreciation: null,
  otherCosts: null,
  salesComplete: false,
  costsComplete: false,
  note: "",
};

/** A reviewed estimate. It does not post a journal or claim an audited profit. */
export function profitLoss(
  w: Workspace,
  from: string,
  to: string,
  input: ProfitReview,
  today: string,
) {
  if (w.type !== "Business")
    throw new Error(
      "Profit and loss is for a business workspace. Choose your business to continue.",
    );
  if (
    !calendarDate(from) ||
    !calendarDate(to) ||
    !calendarDate(today) ||
    from > to ||
    to > today
  )
    throw new Error("Choose a valid period ending today or earlier.");
  const review = profitReviewSchema.parse(input);
  const values = [review.costOfSales, review.depreciation, review.otherCosts].map(
    (value) => {
      if (value === null) return null;
      const exact = money(value);
      if (D(exact).lt(0))
        throw new Error(
          "Costs cannot be negative. Use zero only when you have checked that none applies.",
        );
      return exact;
    },
  );
  const [costOfSales, depreciation, otherCosts] = values;
  const records = w.records.filter(
    (record) => !record.removed && record.date >= from && record.date <= to,
  );
  const lines = ledger({ ...w, records });
  const total = (account: string, credit = false) => {
    const value = D(
      sum(lines.filter((line) => line.account === account).map((line) => line.amount)),
    );
    return (credit ? value.neg() : value).toFixed(2);
  };
  const sales = total("sales", true);
  const otherIncome = total("income", true);
  const expenses = total("expense");
  const interest = total("interest");
  const missing: string[] = [];
  if (!review.salesComplete)
    missing.push(
      "Check that sales and other income for these dates are complete, including unpaid sales.",
    );
  if (!review.costsComplete)
    missing.push(
      "Check the recorded expenses, unpaid bills and any costs that still need to be included.",
    );
  if (costOfSales === null)
    missing.push("Enter the cost of goods sold, or confirm zero if no goods were sold.");
  if (depreciation === null)
    missing.push(
      "Enter the equipment cost used up in this period, or confirm that none applies.",
    );
  if (otherCosts === null)
    missing.push(
      "Enter any other costs missing from the records, or confirm that none remain.",
    );
  if (values.some((value) => value !== null && D(value).gt(0)) && !review.note.trim())
    missing.push("Explain where your extra cost figures came from.");
  const grossProfit =
    costOfSales === null || !review.salesComplete
      ? null
      : D(sales).minus(costOfSales).toFixed(2);
  const profit = missing.length
    ? null
    : D(sales)
        .plus(otherIncome)
        .minus(costOfSales!)
        .minus(expenses)
        .minus(interest)
        .minus(depreciation!)
        .minus(otherCosts!)
        .toFixed(2);
  const includedKinds = new Set([
    "sale",
    "credit_sale",
    "income",
    "expense",
    "credit_expense",
    "interest",
  ]);
  return {
    workspaceId: w.id,
    workspaceName: w.name,
    version: w.version,
    from,
    to,
    sales,
    otherIncome,
    expenses,
    interest,
    costOfSales,
    depreciation,
    otherCosts,
    grossProfit,
    profit,
    missing,
    review,
    stockPurchased: total("stock"),
    equipmentPurchased: total("asset"),
    records: records.map((record) => ({
      id: record.id,
      sourceId: record.sourceId,
      date: record.date,
      description: record.description,
      kind: record.kind,
      amount: record.amount,
      included: includedKinds.has(record.kind),
    })),
    basis:
      "Reviewed profit or loss estimate before income tax. Extra costs are supplied for this report only; they are not saved ledger entries.",
    exclusions:
      "Transfers, loans and principal repayments, owner money, opening balances and payments of old debts do not count as new income or expense. Stock and equipment purchases are shown separately; they are not automatically costs for this period.",
  };
}
export type ProfitLossReport = ReturnType<typeof profitLoss>;
