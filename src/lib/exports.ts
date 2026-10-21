import type { Workspace } from "@/domain/types";
import { report, labels, obligations, posting, kindLabel } from "@/domain/ledger";
import { D, formatMoney, sum } from "@/domain/money";
import { rangeLabel } from "@/domain/periods";
import type { Cell, SheetData } from "write-excel-file";
import { drawActivityReport } from "./activity-pdf";
import { exportFileMark } from "./export-targets";

export const transactionHeader = [
  "record_id",
  "activity_date",
  "description",
  "event_type",
  "recorded_amount_ghs",
  "cash_effect_ghs",
  "cash_effect_type",
  "account",
  "related_account",
  "counterparty",
  "source_id",
] as const;

export function cashEffect(record: Workspace["records"][number], accounts: Workspace["accounts"]) {
  if (record.kind === "transfer")
    return { amount: "0.00", type: "internal_transfer" as const };
  const amount = sum(
    posting(record, accounts)
      .filter((line) => line.account.startsWith("cash:"))
      .map((line) => line.amount),
  );
  if (D(amount).isZero()) return { amount: "0.00", type: "none" as const };
  return {
    amount,
    type: D(amount).gt(0) ? ("in" as const) : ("out" as const),
  };
}

export function transactionRows(w: Workspace, from: string, to: string) {
  return report(w, from, to)
    .records.filter((record) => !record.kind.startsWith("opening_"))
    .map((record) => {
      const effect = cashEffect(record, w.accounts);
      const account = w.accounts.find((item) => item.id === record.accountId);
      const related = w.accounts.find((item) => item.id === record.toAccountId);
      return [
        record.id,
        record.date,
        safeText(record.description),
        record.kind,
        record.amount,
        effect.amount,
        effect.type,
        account ? safeText(account.name) : "",
        related ? safeText(related.name) : "",
        record.party ? safeText(record.party) : "",
        record.sourceId,
      ];
    });
}
export function safeText(value: string) {
  return /^[\s\u0000-\u001f]*[=+@-]/.test(value) ? "'" + value : value;
}
export function exportRows(w: Workspace, from: string, to: string) {
  const r = report(w, from, to);
  return [
    ["ID", "Date", "Description", "Meaning", "Amount GHS (exact)", "Source ID"],
    ...r.records.map((e) => [
      safeText(e.id),
      e.date,
      safeText(e.description),
      labels[e.kind],
      e.amount,
      safeText(e.sourceId),
    ]),
    [],
    ["Money received", "", "", "", r.received, ""],
    ["Money paid out", "", "", "", r.paid, ""],
    ["Net movement", "", "", "", r.net, ""],
    ["Sales value", "", "", "", r.sales, ""],
    ["Recorded expenses", "", "", "", r.expenses, ""],
    ["Total recorded balances", "", "", "", r.total ?? "Unknown", ""],
    ["People owe", "", "", "", r.peopleOwe, ""],
    ["You owe", "", "", "", r.userOwes, ""],
    [
      "Profit",
      "Unavailable: cost-of-sales and other information are incomplete",
    ],
    ["Period", from, to],
    ["Workspace", safeText(w.name), "GHS"],
    ["Version", String(w.version)],
    ["Exclusions", r.exclusions],
    [],
    [
      "Account",
      "Declared opening",
      "Opening date",
      "Period-end recorded balance",
    ],
    ...r.balances.map((a) => {
      const account = w.accounts.find((x) => x.id === a.id)!;
      return [
        safeText(a.name),
        account.opening ?? "Unknown",
        account.openingDate,
        a.balance ?? "Unknown",
      ];
    }),
    [],
    [
      "Obligation record",
      "Counterparty",
      "Original balance",
      "Outstanding at period end",
    ],
    ...obligations({
      ...w,
      records: w.records.filter((r) => r.date <= to),
    }).map((o) => [safeText(o.id), safeText(o.party), o.original, o.remaining]),
  ];
}
export function csv(w: Workspace, from: string, to: string) {
  return (
    "\ufeff" +
    [transactionHeader, ...transactionRows(w, from, to)]
      .map((row) =>
        row.map((x) => '"' + x.replaceAll('"', '""') + '"').join(","),
      )
      .join("\r\n")
  );
}
const ink = "#29263D";
const violet = "#5B49C7";
const paper = "#F0ECFC";
const muted = "#625F73";
const white = "#FFFFFF";
const moneyFormat = '"GH₵"#,##0.00;("GH₵"#,##0.00)';

function text(value: string, style: Partial<Cell> = {}): Cell {
  return { type: String, value, color: ink, fontFamily: "Calibri", ...style };
}
function banner(value: string, span: number): Cell {
  return text(value, {
    fontWeight: "bold",
    fontSize: 18,
    color: white,
    backgroundColor: ink,
    alignVertical: "center",
    span,
    rowSpan: 2,
    height: 24,
  });
}
function label(value: string): Cell {
  return text(value, { fontWeight: "bold", fontSize: 11, color: violet });
}
function metricLabel(value: string): Cell {
  return text(value, {
    fontWeight: "bold",
    fontSize: 10,
    color: violet,
    backgroundColor: paper,
    span: 2,
  });
}
function tableHead(value: string): Cell {
  return text(value, {
    fontWeight: "bold",
    color: white,
    backgroundColor: violet,
  });
}
function moneyCell(value: string | null, style: Partial<Cell> = {}): Cell {
  if (value === null) return text("Unknown", style);
  return {
    type: Number,
    value: Number(value),
    format: moneyFormat,
    color: ink,
    fontFamily: "Calibri",
    ...style,
  };
}
function metricValue(value: string | null): Cell {
  return moneyCell(value, {
    fontWeight: "bold",
    fontSize: 19,
    backgroundColor: paper,
    span: 2,
    rowSpan: 2,
  });
}
function dateCell(iso: string): Cell {
  const [year, month, day] = iso.split("-").map(Number);
  return {
    type: Date,
    value: new Date(Date.UTC(year, month - 1, day)),
    format: "yyyy-mm-dd",
    color: ink,
    fontFamily: "Calibri",
  };
}
export function figureNotes(w: Workspace, from: string, to: string) {
  const stated = report(w, from, to);
  const activity = stated.records.filter(
    (record) => !record.kind.startsWith("opening_"),
  );
  const portion = (kind: Workspace["records"][number]["kind"]) =>
    sum(activity.filter((record) => record.kind === kind).map((record) => record.amount));
  const notes = [
    `Sales value includes ${formatMoney(portion("credit_sale"))} sold on credit.`,
    `${formatMoney(portion("receivable_payment"))} of receipts came from earlier balances.`,
    `Money taken home (${formatMoney(portion("owner_out"))}) is not part of recorded operating expenses.`,
  ];
  return { stated, activity, notes };
}
export function workbook(w: Workspace, from: string, to: string): SheetData[] {
  const { stated, activity, notes } = figureNotes(w, from, to);
  const overview: SheetData = [
    [banner("CashNarra  |  Recorded activity", 8)],
    [],
    [
      text(
        `${w.name}  ·  ${rangeLabel(from, to)}  ·  GHS  ·  User-recorded figures`,
        { color: muted, span: 8 },
      ),
    ],
    [],
    [metricLabel("MONEY RECEIVED"), null, null, metricLabel("MONEY PAID OUT"), null, null, metricLabel("NET MOVEMENT")],
    [metricValue(stated.received), null, null, metricValue(stated.paid), null, null, metricValue(stated.net)],
    [],
    [metricLabel("SALES VALUE"), null, null, metricLabel("RECORDED EXPENSES"), null, null, metricLabel("RECORDED BALANCES")],
    [metricValue(stated.sales), null, null, metricValue(stated.expenses), null, null, metricValue(stated.total)],
    [],
    [text("WHAT THESE FIGURES DO AND DON'T MEAN", { fontWeight: "bold", color: violet, span: 8 })],
    [text(notes.join(" "), { wrap: true, span: 8, backgroundColor: paper, fontSize: 10 })],
    [],
    [
      text(
        "Profit is unavailable. Net cash movement is not profit. Figures are based on records entered into CashNarra; no bank verification or audit is implied.",
        { wrap: true, span: 8, fontSize: 9, color: muted },
      ),
    ],
  ];
  const transactions: SheetData = [
    [banner("CashNarra  |  Transactions", 5)],
    [],
    [
      text(
        "Amounts are numeric. Negative cash effects are money out. A credit sale has no cash effect on the recorded day.",
        { wrap: true, span: 5, color: muted },
      ),
    ],
    [],
    ["Activity date", "What happened", "Meaning", "Event value", "Cash effect"].map(tableHead),
    ...activity.map((record) => {
      const effect = cashEffect(record, w.accounts);
      return [
        dateCell(record.date),
        text(record.description, { wrap: true }),
        text(kindLabel(record.kind, w.type)),
        moneyCell(record.amount),
        moneyCell(effect.amount),
      ];
    }),
    [],
    [
      null,
      null,
      label("Cash movement check"),
      null,
      moneyCell(sum(activity.map((record) => cashEffect(record, w.accounts).amount))),
    ],
    [null, null, text("Net movement"), null, moneyCell(stated.net)],
  ];
  const accounts: SheetData = [
    [banner("CashNarra  |  Accounts", 5)],
    [],
    [],
    ["Account", "Type", "Declared opening", "Opening date", "Recorded balance"].map(tableHead),
    ...stated.balances.map((balance) => {
      const account = w.accounts.find((item) => item.id === balance.id)!;
      return [
        text(account.name),
        text(account.type),
        moneyCell(account.opening),
        dateCell(account.openingDate),
        moneyCell(balance.balance),
      ];
    }),
    [],
    [label("Recorded total"), null, null, null, moneyCell(stated.total)],
    [],
    [
      text(
        "Balances come from manually entered openings and saved records. They are not verified by a bank or MoMo provider.",
        { wrap: true, span: 5 },
      ),
    ],
  ];
  const owed = obligations({
    ...w,
    records: w.records.filter((record) => record.date <= to),
  });
  const obligationsSheet: SheetData = [
    [banner("CashNarra  |  Outstanding balances", 3)],
    [],
    [],
    ["Who", "Original amount", "Remaining"].map(tableHead),
    ...owed.map((item) => [
      text(item.party),
      moneyCell(item.original),
      moneyCell(item.remaining),
    ]),
    [],
    [
      text(
        "Outstanding amounts are what remains at the end of this period. They do not certify earlier or later activity.",
        { wrap: true, span: 3 },
      ),
    ],
  ];
  return [overview, transactions, accounts, obligationsSheet];
}
function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function downloadReport(
  w: Workspace,
  from: string,
  to: string,
  type: "csv" | "pdf" | "xlsx",
  mark?: string,
) {
  const tag = mark ? `_${exportFileMark(mark)}` : "";
  if (type === "csv") {
    download(
      new Blob([csv(w, from, to)], { type: "text/csv;charset=utf-8" }),
      `CashNarra_Transactions_${from}_${to}${tag}.csv`,
    );
    return;
  }
  if (type === "xlsx") {
    const { default: writeXlsxFile } = await import("write-excel-file");
    await writeXlsxFile(workbook(w, from, to), {
      fileName: `CashNarra_Workbook_${from}_${to}${tag}.xlsx`,
      sheets: ["Overview", "Transactions", "Accounts", "Obligations"],
      fontFamily: "Calibri",
      stickyRowsCount: 5,
      columns: [
        [{ width: 16 }, { width: 16 }, { width: 14 }, { width: 16 }, { width: 16 }, { width: 14 }, { width: 18 }, { width: 16 }],
        [{ width: 16 }, { width: 46 }, { width: 26 }, { width: 18 }, { width: 18 }],
        [{ width: 24 }, { width: 14 }, { width: 22 }, { width: 16 }, { width: 22 }],
        [{ width: 28 }, { width: 22 }, { width: 22 }],
      ],
    });
    return;
  }
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const font = await fetch("/brand/fonts/Inter-Latin.ttf");
  if (!font.ok)
    throw new Error(
      "The report font could not be loaded. Reconnect and retry, or export CSV/XLSX. Your records are unchanged.",
    );
  const bytes = new Uint8Array(await font.arrayBuffer());
  if (
    bytes.length < 12 ||
    !(
      (bytes[0] === 0 && bytes[1] === 1 && bytes[2] === 0 && bytes[3] === 0) ||
      String.fromCharCode(...bytes.slice(0, 4)) === "OTTO"
    )
  )
    throw new Error(
      "The report font is unavailable. Retry or export CSV/XLSX.",
    );
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  doc.addFileToVFS("Inter.ttf", btoa(binary));
  doc.addFont("Inter.ttf", "Inter", "normal");
  doc.setFont("Inter");
  drawActivityReport(doc, w, from, to);
  doc.save(`CashNarra_Activity_${from}_${to}${tag}.pdf`);
}
