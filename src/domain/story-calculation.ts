import { z } from "zod";
import { D, money, sum } from "./money";
import { calendarDate } from "./dates";
import type { Workspace } from "./types";

export function placeCalculation(
  activityDate: string,
  proposedDate: string,
  from: string,
  to: string,
) {
  if (!calendarDate(from) || !calendarDate(to) || from > to)
    throw new Error("Choose the first and last day for this calculation.");
  const inside = (value: string) =>
    calendarDate(value) && value >= from && value <= to;
  const recordedOn = inside(proposedDate)
    ? proposedDate
    : inside(activityDate)
      ? activityDate
      : to;
  return {
    recordedOn,
    payOn:
      calendarDate(proposedDate) && proposedDate > recordedOn
        ? proposedDate
        : null,
  };
}

export const calculationRequestSchema = z.object({
  recordId: z.string(),
  percent: z.string(),
  from: z.string().nullable(),
  to: z.string().nullable(),
  basis: z.enum(["revenue", "receipts", "unclear"]),
});
export type CalculationRequest = z.infer<typeof calculationRequestSchema>;
export function storyCalculation(w: Workspace, request: CalculationRequest) {
  const { from, to, basis } = request;
  if (!from || !to || !calendarDate(from) || !calendarDate(to) || from > to)
    throw new Error("Choose the first and last day for this calculation.");
  const percent = money(request.percent);
  if (D(percent).lte(0) || D(percent).gt(100))
    throw new Error("Choose a percentage between 0 and 100.");
  const options = (basis === "unclear" ? ["revenue", "receipts"] : [basis]).map(
    (kind) => {
      const kinds =
        kind === "revenue"
          ? ["sale", "credit_sale", "income"]
          : ["sale", "income", "receivable_payment"];
      const records = w.records.filter(
        (r) =>
          !r.removed &&
          r.date >= from &&
          r.date <= to &&
          kinds.includes(r.kind),
      );
      const total = sum(records.map((r) => r.amount));
      return {
        basis: kind,
        label:
          kind === "revenue"
            ? "Sales and other income, including unpaid sales"
            : "Customer payments and other income received",
        total,
        amount: money(D(total).times(percent).div(100).toFixed(2)),
        records: records.map((r) => ({
          id: r.id,
          date: r.date,
          description: r.description,
          amount: r.amount,
        })),
      };
    },
  );
  return {
    recordId: request.recordId,
    percent,
    from,
    to,
    version: w.version,
    recordedOn: to,
    payOn: null as string | null,
    options,
  };
}
export type StoryCalculation = ReturnType<typeof storyCalculation>;
