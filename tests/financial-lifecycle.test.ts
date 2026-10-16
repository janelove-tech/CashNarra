import { expect, it } from "vitest";
import { fixture, event, emptyWorkspace } from "../src/domain/fixture";
import {
  applyBatch,
  report,
  accountBalance,
  validateWorkspace,
} from "../src/domain/ledger";
import { prepareMove } from "../src/domain/move";
import { forecast } from "../src/domain/goals";
import type { Workspace, EventInput } from "../src/domain/types";
const change = (
  w: Workspace,
  events: EventInput[],
  replaceIds: string[] = [],
) =>
  applyBatch(w, {
    requestId: crypto.randomUUID(),
    revision: 0,
    expectedVersion: w.version,
    source: "Synthetic correction",
    events,
    replaceIds,
    reason: "Correct recorded date or effect",
    allowDuplicates: true,
  });

it("moving a corrected record date updates both affected reporting periods", () => {
  const w = fixture(),
    old = w.records.find((r) => r.kind === "expense")!;
  const n = change(
    w,
    [{ ...old, id: crypto.randomUUID(), date: "2026-10-14" }],
    [old.id],
  );
  expect(report(n, "2026-10-13", "2026-10-13").paid).toBe("850.00");
  expect(report(n, "2026-10-14", "2026-10-14").paid).toBe("80.00");
  expect(accountBalance(n, "momo")).toBe("3020.00");
  expect(n.history.at(-1)?.before.date).toBe("2026-10-13");
});
it("full settlement and removal of an incorrect payment restore debt without a second sale", () => {
  const w = fixture();
  const payment = event(
    "receivable_payment",
    "400.00",
    "Abena final payment",
    "momo",
    { obligationId: "opening-abena", party: "Abena" },
  );
  const settled = change(w, [payment]);
  expect(report(settled, "2026-10-13", "2026-10-13").peopleOwe).toBe("300.00");
  expect(report(settled, "2026-10-13", "2026-10-13").sales).toBe("2400.00");
  const removed = change(settled, [], [payment.id]);
  expect(report(removed, "2026-10-13", "2026-10-13").peopleOwe).toBe("700.00");
  expect(accountBalance(removed, "momo")).toBe("3020.00");
});
it("rejects a workspace move that would leave source goals overallocated", () => {
  const w = fixture(),
    dest = emptyWorkspace(w.ownerId);
  dest.accounts = [{ ...w.accounts[0], id: "destination", opening: "0.00" }];
  w.goals.push({
    id: "cash-goal",
    name: "Cash goal",
    target: "500.00",
    accountId: "cash",
    allocations: [{ id: "assigned", date: "2026-10-13", amount: "400.00" }],
    reviewedMonths: [],
    commitmentsKnown: false,
  });
  const sale = w.records.find(
    (r) => r.kind === "sale" && r.accountId === "cash",
  )!;
  const before = JSON.stringify(w);
  expect(() =>
    prepareMove(w, dest, sale.id, "destination", "Misfiled sale", "key"),
  ).toThrow(/assignments/);
  expect(JSON.stringify(w)).toBe(before);
});
it("zero and negative scenarios give no completion date and never change actual allocations", () => {
  const goal = fixture().goals[0],
    before = JSON.stringify(goal);
  for (const pace of ["0.00", "-1.00"])
    expect(forecast(goal, "2026-10-13", pace).period).toBeNull();
  expect(() => forecast(goal, "2026-02-30")).toThrow("valid");
  expect(JSON.stringify(goal)).toBe(before);
});
it("validates unused account openings and preserves the distinction between zero and unknown", () => {
  const w = emptyWorkspace("owner");
  w.accounts = [
    {
      id: "cash",
      name: "Cash",
      type: "Cash",
      currency: "GHS",
      opening: null,
      openingDate: "2026-10-13",
    },
  ];
  expect(accountBalance(w, "cash")).toBeNull();
  w.accounts[0].opening = "0.00";
  validateWorkspace(w);
  expect(accountBalance(w, "cash")).toBe("0.00");
  w.accounts[0].opening = "1.001";
  expect(() => validateWorkspace(w)).toThrow("exact amount");
});
it("workspace moves do not copy unrelated raw narration or restart its retention", () => {
  const w = fixture(),
    dest = emptyWorkspace(w.ownerId);
  dest.accounts = [{ ...w.accounts[0], id: "destination", opening: "100.00" }];
  const expense = w.records.find((r) => r.kind === "expense")!;
  w.sources.find((s) => s.id === expense.sourceId)!.text =
    "UNRELATED PRIVATE NARRATION";
  const moved = prepareMove(
    w,
    dest,
    expense.id,
    "destination",
    "Wrong workspace",
    "key",
  );
  expect(moved.to.sources[0].text).not.toContain("UNRELATED PRIVATE");
  expect(moved.to.sources[0].text).toContain(expense.sourceId);
  expect(moved.from.sources.find((s) => s.id === expense.sourceId)?.text).toBe(
    "UNRELATED PRIVATE NARRATION",
  );
});
