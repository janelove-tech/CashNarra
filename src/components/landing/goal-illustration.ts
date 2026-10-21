import { forecast } from "@/domain/goals";
import { D } from "@/domain/money";
import type { Goal } from "@/domain/types";

/** Fixed public illustration. It is not a saved goal and has no reviewed history. */
const illustration: Goal = {
  id: "landing-equipment",
  name: "New equipment",
  target: "2000.00",
  accountId: "illustration",
  allocations: [{ id: "set-aside", date: "2026-10-01", amount: "500.00" }],
  reviewedMonths: [],
  commitmentsKnown: false,
};

export const LANDING_GOAL = {
  name: "New equipment",
  target: "2000.00",
  setAside: "500.00",
  asOf: "2026-10-21",
} as const;

export function landingGoalEstimate(monthly: "300.00" | "500.00") {
  const before = JSON.stringify(illustration);
  const result = forecast(illustration, LANDING_GOAL.asOf, monthly);
  if (JSON.stringify(illustration) !== before)
    throw new Error("The public goal illustration changed a goal.");
  const remaining = D(LANDING_GOAL.target)
    .minus(LANDING_GOAL.setAside)
    .toFixed(2);
  return { remaining, months: result.count, pace: result.pace };
}
