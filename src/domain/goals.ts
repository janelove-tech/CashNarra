import { D, money, sum } from "./money";
import type { Goal } from "./types";
import { calendarDate } from "./dates";
export function forecast(goal: Goal, asOf: string, scenario?: string) {
  if (!calendarDate(asOf))
    throw new Error("Choose a valid goal calculation date.");
  const assigned = sum(
    goal.allocations.filter((a) => a.date <= asOf).map((a) => a.amount),
  );
  const remaining = D(goal.target).minus(assigned);
  if (remaining.lte(0))
    return {
      count: 0,
      period: null,
      pace: "0.00",
      reason: "Your recorded allocations meet this target.",
      assigned,
    };
  const anchor = new Date(asOf + "T12:00:00Z");
  const months = Array.from({ length: 3 }, (_, i) =>
    new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - i - 1, 1))
      .toISOString()
      .slice(0, 7),
  );
  if (
    scenario === undefined &&
    (!goal.commitmentsKnown ||
      months.some((m) => !goal.reviewedMonths.includes(m)))
  )
    return {
      count: null,
      period: null,
      pace: null,
      reason:
        "Check the last three full months and your planned payments first. A missing month does not mean you assigned no money.",
      assigned,
    };
  const pace =
    scenario === undefined
      ? months
          .map((m) =>
            D(
              sum(
                goal.allocations
                  .filter((a) => a.date.startsWith(m))
                  .map((a) => a.amount),
              ),
            ),
          )
          .sort((a, b) => a.comparedTo(b))[1]
      : D(money(scenario));
  if (pace.lte(0))
    return {
      count: null,
      period: null,
      pace: pace.toFixed(2),
      reason:
        scenario === undefined
          ? "There is no completion date at this monthly amount. Try a positive amount to see a what-if estimate."
          : "What-if only: there is no completion date at this monthly amount. Saved records stay unchanged. This is not a guarantee.",
      assigned,
    };
  const count = remaining.div(pace).ceil().toNumber();
  if (count > 1200)
    return {
      count,
      period: null,
      pace: pace.toFixed(2),
      reason:
        "More than 100 years at this assumption; no useful completion period.",
      assigned,
    };
  const period = new Date(
    Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + count - 1, 1),
  )
    .toISOString()
    .slice(0, 7);
  return {
    count,
    period,
    pace: pace.toFixed(2),
    assigned,
    reason:
      scenario === undefined
        ? "Based on the middle monthly amount from the last three full months you checked. Assumes you add money at each month’s end, starting this month. Check that you can afford it."
        : "What-if only: your saved records and assigned money stay unchanged. Assumes you add this amount at each month’s end, starting this month. This is not a guarantee.",
  };
}
