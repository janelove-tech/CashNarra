import { describe, it, expect } from "vitest";
import {
  fixture,
  fixtureEvents,
  event,
  emptyWorkspace,
} from "../src/domain/fixture";
import {
  applyBatch,
  ledger,
  posting,
  report,
  obligations,
  accountBalance,
  duplicates,
  validateWorkspace,
} from "../src/domain/ledger";
import { money, sum } from "../src/domain/money";
import { forecast } from "../src/domain/goals";
import { csv, safeText } from "../src/lib/exports";
import type { Workspace, EventInput } from "../src/domain/types";
const batch = (
  w: Workspace,
  events: EventInput[],
  replaceIds: string[] = [],
) => ({
  requestId: "test",
  revision: 0,
  expectedVersion: w.version,
  events,
  replaceIds,
  source: "Synthetic test",
  reason: "Test correction",
  allowDuplicates: true,
});
describe("Ama Works and exact financial meaning", () => {
  it("derives the complete baseline from postings", () => {
    const w = fixture(),
      r = report(w, "2026-10-13", "2026-10-13");
    expect(r).toMatchObject({
      received: "2300.00",
      paid: "930.00",
      net: "1370.00",
      sales: "2400.00",
      total: "5970.00",
      peopleOwe: "700.00",
      userOwes: "1500.00",
      profit: null,
    });
    expect(r.balances.map((x) => x.balance)).toEqual([
      "450.00",
      "3020.00",
      "2500.00",
    ]);
    expect(sum(ledger(w).map((l) => l.amount))).toBe("0.00");
  });
  it("keeps exact cents and rejects float boundaries, excess precision and overflow", () => {
    expect(sum(["0.10", "0.20"])).toBe("0.30");
    expect(money("999999999999999999.99")).toBe("999999999999999999.99");
    for (const a of [1, "1.001", "1e3", "1000000000000000000", "NaN"])
      expect(() => money(a)).toThrow();
  });
  it("excludes transfers and opening debts from movement and sales", () => {
    let w = fixture("a", false);
    w = applyBatch(
      w,
      batch(w, [
        event("transfer", "12.34", "Move", "cash", { toAccountId: "bank" }),
      ]),
    );
    const r = report(w, "2026-10-01", "2026-10-31");
    expect(r.received).toBe("0.00");
    expect(r.paid).toBe("0.00");
    expect(r.sales).toBe("0.00");
    expect(r.total).toBe("4600.00");
  });
  it("settles debt without another sale and rejects overpayments atomically", () => {
    const w = fixture();
    const n = applyBatch(
      w,
      batch(w, [
        event("receivable_payment", "400.00", "Final payment", "momo", {
          obligationId: "opening-abena",
        }),
      ]),
    );
    expect(
      obligations(n).find((o) => o.id === "opening-abena")?.remaining,
    ).toBe("0.00");
    expect(report(n, "2026-10-13", "2026-10-13").sales).toBe("2400.00");
    expect(() =>
      applyBatch(
        w,
        batch(w, [
          event("expense", "5.00", "Valid", "cash"),
          event("receivable_payment", "400.01", "Overpay", "momo", {
            obligationId: "opening-abena",
          }),
        ]),
      ),
    ).toThrow();
    expect(accountBalance(w, "cash")).toBe("450.00");
  });
  it("corrects earlier periods, removes effects and preserves sources", () => {
    const w = fixture(),
      old = w.records.find((r) => r.kind === "expense")!;
    const n = applyBatch(
      w,
      batch(
        w,
        [{ ...old, id: crypto.randomUUID(), amount: "100.00" }],
        [old.id],
      ),
    );
    expect(report(n, "2026-10-13", "2026-10-13").paid).toBe("950.00");
    expect(n.history[0].before.amount).toBe("80.00");
    expect(n.sources[1].text).toBe(w.sources[1].text);
    const removed = applyBatch(n, batch(n, [], [n.records.at(-1)!.id]));
    expect(report(removed, "2026-10-13", "2026-10-13").paid).toBe("850.00");
  });
  it("splits stock without changing outflow and rejects removing settled debt", () => {
    const w = fixture(),
      stock = w.records.find((r) => r.kind === "stock")!;
    const n = applyBatch(
      w,
      batch(
        w,
        [
          event("stock", "600.00", "Stock", "cash"),
          event("expense", "100.00", "Packaging", "cash"),
        ],
        [stock.id],
      ),
    );
    expect(report(n, "2026-10-13", "2026-10-13").paid).toBe("930.00");
    expect(() => applyBatch(w, batch(w, [], ["opening-abena"]))).toThrow();
  });
  it("rejects stale changes, foreign accounts and foreign obligations", () => {
    const w = fixture();
    expect(() =>
      applyBatch(w, { ...batch(w, fixtureEvents()), expectedVersion: 0 }),
    ).toThrow();
    expect(() =>
      applyBatch(w, batch(w, [event("expense", "1.00", "Foreign", "other")])),
    ).toThrow();
    expect(() =>
      applyBatch(
        w,
        batch(w, [
          event("receivable_payment", "1.00", "Foreign", "cash", {
            obligationId: "other",
          }),
        ]),
      ),
    ).toThrow();
  });
  it("handles altered figures, another workspace and unknown openings", () => {
    const w = fixture("different", false),
      es = fixtureEvents();
    es[0].amount = "901.23";
    const n = applyBatch(w, batch(w, es));
    expect(report(n, "2026-10-13", "2026-10-13").total).toBe("5971.23");
    const empty = emptyWorkspace("b");
    expect(report(empty, "2026-10-13", "2026-10-13").records).toEqual([]);
    n.accounts[0].opening = null;
    expect(accountBalance(n, "cash")).toBeNull();
    expect(report(n, "2026-10-13", "2026-10-13").total).toBeNull();
  });
  it("warns on supporting evidence, not amount alone", () => {
    const w = fixture(),
      e = event("expense", "80.00", "Other purpose", "cash");
    expect(duplicates(w, [e])).toHaveLength(0);
    const old = w.records.find((r) => r.kind === "expense")!;
    expect(duplicates(w, [{ ...old, id: "new" }])).toHaveLength(1);
  });
});
describe("goals and private exports", () => {
  it("uses fixture contribution calendar, median and isolated scenarios", () => {
    const g = fixture().goals[0],
      original = JSON.stringify(g);
    expect(forecast(g, "2026-10-13")).toMatchObject({
      count: 12,
      period: "2027-09",
      pace: "400.00",
    });
    expect(forecast(g, "2026-10-13", "600.00")).toMatchObject({
      count: 8,
      period: "2027-05",
    });
    expect(JSON.stringify(g)).toBe(original);
  });
  it("withholds estimates for missing months, unknown commitments and zero pace", () => {
    const g = fixture().goals[0];
    g.reviewedMonths.pop();
    expect(forecast(g, "2026-10-13").count).toBeNull();
    g.commitmentsKnown = false;
    expect(forecast(g, "2026-10-13").period).toBeNull();
    expect(forecast(g, "2026-10-13", "0.00").count).toBeNull();
    const before = JSON.stringify(g);
    const negative = forecast(g, "2026-10-13", "-25.00");
    expect(negative.count).toBeNull();
    expect(negative.reason).toContain("not a guarantee");
    expect(JSON.stringify(g)).toBe(before);
  });
  it("prevents competing allocations and checks goal withdrawals", () => {
    const w = fixture();
    w.goals.push({ ...structuredClone(w.goals[0]), id: "second" });
    w.goals[1].allocations.push({
      id: "extra",
      date: "2026-10-13",
      amount: "200.00",
    });
    expect(() => validateWorkspace(w)).toThrow();
  });
  it("records an operating expense on credit and does not expense the later payment", () => {
    const w = emptyWorkspace("owner", "Shop", "Business");
    w.accounts.push({
      id: "cash",
      name: "Cash",
      type: "Cash",
      currency: "GHS",
      opening: "1000.00",
      openingDate: "2026-10-01",
    });
    const bill = event(
      "credit_expense",
      "800.00",
      "Electrician repaired the shop",
      null,
      { party: "Kofi", date: "2026-10-16" },
    );
    const stock = event(
      "credit_purchase",
      "100.00",
      "Stock to pay later",
      null,
      { party: "Adjei", date: "2026-10-16" },
    );
    const incurred = applyBatch(w, batch(w, [bill, stock]));
    expect(report(incurred, "2026-10-01", "2026-10-31")).toMatchObject({
      expenses: "800.00",
      paid: "0.00",
      received: "0.00",
      userOwes: "900.00",
      profit: null,
    });
    expect(accountBalance(incurred, "cash", "2026-10-31")).toBe("1000.00");
    expect(
      obligations(incurred).find((o) => o.party === "Kofi")?.remaining,
    ).toBe("800.00");
    const paid = applyBatch(incurred, {
      ...batch(incurred, [
        event("payable_payment", "800.00", "Paid the electrician", "cash", {
          obligationId: bill.id,
          party: "Kofi",
          date: "2026-10-20",
        }),
      ]),
      expectedVersion: incurred.version,
    });
    expect(report(paid, "2026-10-01", "2026-10-31")).toMatchObject({
      expenses: "800.00",
      paid: "800.00",
      userOwes: "100.00",
    });
    expect(accountBalance(paid, "cash", "2026-10-31")).toBe("200.00");
    expect(obligations(paid).find((o) => o.party === "Kofi")?.remaining).toBe(
      "0.00",
    );
    expect(() =>
      posting(
        event("credit_expense", "800.00", "Missing person", "cash"),
        w.accounts,
      ),
    ).toThrow(/account|person/i);
  });
  it("neutralises formula text without altering exact numeric columns", () => {
    const w = fixture();
    w.records.find((r) => r.kind === "sale")!.description = '=HYPERLINK("bad")';
    const out = csv(w, "2026-10-13", "2026-10-13");
    expect(out).toContain("'=HYPERLINK");
    expect(out).toContain('"2300.00"');
    expect(safeText(" -cmd")).toBe("' -cmd");
    expect(safeText("ordinary")).toBe("ordinary");
  });
});
