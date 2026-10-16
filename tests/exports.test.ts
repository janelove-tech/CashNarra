import { expect, it } from "vitest";
import { fixture } from "../src/domain/fixture";
import { exportRows, csv } from "../src/lib/exports";
import { event } from "../src/domain/fixture";
import { applyBatch, report } from "../src/domain/ledger";
it("exports credit expenses when incurred and excludes their settlement from later expenses", () => {
  const w = fixture();
  const bill = event(
    "credit_expense",
    "300.00",
    "Kwame wiring · GH₵300",
    null,
    { party: "Kwame", date: "2026-10-13" },
  );
  const payment = event("payable_payment", "300.00", "Wiring paid", "cash", {
    party: "Kwame",
    date: "2026-10-14",
    obligationId: bill.id,
  });
  const next = applyBatch(w, {
    requestId: "export-expense",
    revision: 1,
    expectedVersion: w.version,
    source: "Synthetic wiring",
    events: [bill, payment],
    replaceIds: [],
    reason: "",
    allowDuplicates: true,
  });
  expect(
    exportRows(next, "2026-10-14", "2026-10-14").find(
      (row) => row[0] === "Recorded expenses",
    )?.[4],
  ).toBe("0.00");
  expect(report(next, "2026-10-14", "2026-10-14").paid).toBe("300.00");
  for (const [from, to] of [
    ["2026-10-12", "2026-10-18"],
    ["2026-10-01", "2026-10-31"],
  ]) {
    const r = report(next, from, to);
    expect(
      exportRows(next, from, to).find(
        (row) => row[0] === "Recorded expenses",
      )?.[4],
    ).toBe(r.expenses);
    expect(r.profit).toBeNull();
  }
  expect(csv(next, "2026-10-13", "2026-10-14")).toContain(
    "Kwame wiring · GH₵300",
  );
});

it("exports every baseline total, exclusions, openings and source references", () => {
  const w = fixture(),
    rows = exportRows(w, "2026-10-13", "2026-10-13");
  for (const [name, value] of Object.entries({
    "Money received": "2300.00",
    "Money paid out": "930.00",
    "Net movement": "1370.00",
    "Sales value": "2400.00",
    "Total recorded balances": "5970.00",
    "People owe": "700.00",
    "You owe": "1500.00",
  }))
    expect(rows.find((row) => row[0] === name)?.[4]).toBe(value);
  expect(rows.find((row) => row[0] === "Profit")?.[1]).toContain("Unavailable");
  expect(rows.find((row) => row[0] === "Cash")).toEqual([
    "Cash",
    "400.00",
    "2026-10-13",
    "450.00",
  ]);
  expect(
    rows.some((row) => row[0] === "opening-abena" && row[3] === "400.00"),
  ).toBe(true);
  const sale = w.records.find((r) => r.kind === "sale")!;
  expect(rows.find((row) => row[0] === sale.id)?.[5]).toBe(sale.sourceId);
});

it("keeps negative exact values numeric while protecting untrusted labels", () => {
  const w = fixture();
  w.name = "\t=CMD()";
  w.accounts[0].name = "@unsafe";
  w.accounts[0].opening = "-400.01";
  const output = csv(w, "2026-10-13", "2026-10-13");
  expect(output).toContain('"-400.01"');
  expect(output).not.toContain("'-400.01");
  expect(output).toContain("'@unsafe");
  expect(output).toContain("'\t=CMD()");
});

it("keeps unknown balances unknown in exports", () => {
  const w = fixture();
  w.accounts[0].opening = null;
  const rows = exportRows(w, "2026-10-13", "2026-10-13");
  expect(rows.find((row) => row[0] === "Total recorded balances")?.[4]).toBe(
    "Unknown",
  );
});

it("includes the supplied review and rest days without inventing a missed-day review", () => {
  const days = fixture().checkins;
  expect(days.filter((d) => d.kind === "review").map((d) => d.date)).toEqual([
    "2026-10-07",
    "2026-10-08",
    "2026-10-09",
    "2026-10-12",
    "2026-10-13",
  ]);
  expect(days.find((d) => d.date === "2026-10-11")?.kind).toBe("rest");
  expect(days.some((d) => d.date === "2026-10-10")).toBe(false);
});
