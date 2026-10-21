import { expect, it } from "vitest";
import { jsPDF } from "jspdf";
import { drawActivityReport } from "../src/lib/activity-pdf";
import { fixture } from "../src/domain/fixture";
import { exportRows, csv, transactionHeader, transactionRows, workbook, figureNotes } from "../src/lib/exports";
import { D, sum } from "../src/domain/money";
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
  expect(output).toContain('"-80.00"');
  expect(output).not.toContain("'-80.00");
  expect(output).toContain("'@unsafe");
  expect(output).not.toContain("=CMD()");
  expect(
    exportRows(w, "2026-10-13", "2026-10-13").find((row) => row[0] === "'@unsafe")?.[1],
  ).toBe("-400.01");
});

it("exports one rectangular transaction row with a separate cash effect", () => {
  const w = fixture();
  const rows = transactionRows(w, "2026-10-13", "2026-10-13");
  expect(rows.every((row) => row.length === transactionHeader.length)).toBe(true);
  expect(rows.some((row) => row[0].startsWith("opening"))).toBe(false);
  const credit = rows.find((row) => row[3] === "credit_sale")!;
  expect(credit[4]).toBe("300.00");
  expect(credit[5]).toBe("0.00");
  expect(credit[6]).toBe("none");
  expect(credit[9]).toBe("Kojo");
  const moved = rows.find((row) => row[3] === "transfer")!;
  expect(moved[5]).toBe("0.00");
  expect(moved[6]).toBe("internal_transfer");
  expect(moved[7]).toBe("Bank");
  expect(moved[8]).toBe("MoMo");
  const sale = rows.find((row) => row[2] === "Cash sales")!;
  expect(sale[5]).toBe("900.00");
  expect(sale[6]).toBe("in");
  expect(sale[7]).toBe("Cash");
  const parsed = csv(w, "2026-10-13", "2026-10-13")
    .replace(/^\ufeff/, "")
    .trim()
    .split("\r\n")
    .map((line) => line.split(","));
  expect(parsed[0]).toEqual(transactionHeader.map((name) => `"${name}"`));
  expect(parsed.slice(1).every((row) => row.length === 11)).toBe(true);
  expect(
    sum(rows.map((row) => row[5])).replace(/^-0\.00$/, "0.00"),
  ).toBe(D("2300.00").minus("930.00").toFixed(2));
});

it("keeps unknown balances unknown in exports", () => {
  const w = fixture();
  w.accounts[0].opening = null;
  const rows = exportRows(w, "2026-10-13", "2026-10-13");
  expect(rows.find((row) => row[0] === "Total recorded balances")?.[4]).toBe(
    "Unknown",
  );
});

it("builds the specimen workbook from the same recorded figures", () => {
  const workspace = fixture();
  const [overview, transactions, accounts] = workbook(
    workspace,
    "2026-10-13",
    "2026-10-13",
  );
  expect(overview[4]?.[0]).toMatchObject({ value: "MONEY RECEIVED" });
  expect(overview[5]?.[0]).toMatchObject({ type: Number, value: 2300 });
  expect(overview[5]?.[3]).toMatchObject({ value: 930 });
  expect(overview[5]?.[6]).toMatchObject({ value: 1370 });
  expect(overview[8]?.[0]).toMatchObject({ value: 2400 });
  expect(overview[8]?.[3]).toMatchObject({ value: 80 });
  expect(overview[8]?.[6]).toMatchObject({ value: 5970 });
  expect(figureNotes(fixture(), "2026-10-13", "2026-10-13").notes[0]).toContain(
    "GH₵300.00",
  );
  const credit = transactions.find(
    (row) => row?.[1] && "value" in row[1] && row[1].value === "Kojo’s credit sale",
  );
  expect(credit?.[4]).toMatchObject({ type: Number, value: 0 });
  expect(JSON.stringify(transactions)).not.toContain("Record ID");
  expect(JSON.stringify(transactions)).not.toContain(workspace.records[0].id);
  const check = transactions.find(
    (row) => row?.[2] && "value" in row[2] && row[2].value === "Cash movement check",
  );
  const expected = transactions.find(
    (row) => row?.[2] && "value" in row[2] && row[2].value === "Net movement",
  );
  expect(check?.[4]).toMatchObject({ value: 1370 });
  expect(expected?.[4]).toMatchObject({ value: 1370 });
  const cash = accounts.find(
    (row) => row?.[0] && "value" in row[0] && row[0].value === "Cash",
  );
  expect(cash?.[2]).toMatchObject({ value: 400 });
  expect(cash?.[4]).toMatchObject({ value: 450 });
  const unknown = fixture();
  unknown.accounts[0].opening = null;
  const [hiddenOverview, , hiddenAccounts] = workbook(
    unknown,
    "2026-10-13",
    "2026-10-13",
  );
  expect(hiddenOverview[8]?.[6]).toMatchObject({ value: "Unknown" });
  expect(
    hiddenAccounts.find(
      (row) => row?.[0] && "value" in row[0] && row[0].value === "Cash",
    )?.[4],
  ).toMatchObject({ value: "Unknown" });
});

it("draws the activity report in the revised two-page layout", () => {
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: false });
  drawActivityReport(doc, fixture(), "2026-10-13", "2026-10-13", "helvetica");
  const raw = new TextDecoder("latin1").decode(doc.output("arraybuffer"));
  expect(doc.getNumberOfPages()).toBe(2);
  expect(raw).toContain("Your money, clearly recorded.");
  expect(raw).toContain("NET CASH MOVEMENT");
  expect(raw).toContain("No cash");
  expect(raw).toContain("HOW THE CASH MOVED");
  expect(raw).toContain("Not bank-verified");
  expect(raw).not.toContain("DESIGN SPECIMEN");
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
