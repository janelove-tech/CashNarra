import { it, expect } from "vitest";
import { calendarDate, calendarMonth } from "../src/domain/dates";
import { fixture } from "../src/domain/fixture";
import { validateWorkspace } from "../src/domain/ledger";
it("validates real calendar dates including leap years", () => {
  expect(calendarDate("2024-02-29")).toBe(true);
  for (const value of [
    "2026-02-29",
    "2026-04-31",
    "2026-13-01",
    "0000-01-01",
    null,
    42,
  ])
    expect(calendarDate(value)).toBe(false);
  expect(calendarMonth("2026-12")).toBe(true);
  expect(calendarMonth("2026-13")).toBe(false);
});
it("rejects impossible dates in account, goal and check-in changes", () => {
  for (const mutate of [
    (w: ReturnType<typeof fixture>) => {
      w.accounts[0].openingDate = "2026-02-30";
    },
    (w: ReturnType<typeof fixture>) => {
      w.goals[0].allocations[0].date = "2026-02-30";
    },
    (w: ReturnType<typeof fixture>) => {
      w.goals[0].reviewedMonths.push("2026-13");
    },
    (w: ReturnType<typeof fixture>) => {
      w.checkins[0].date = "2026-02-30";
    },
  ]) {
    const w = fixture();
    mutate(w);
    expect(() => validateWorkspace(w)).toThrow(/valid/);
  }
});
