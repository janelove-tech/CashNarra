import type { Workspace } from "@/domain/types";
import { report, labels, obligations } from "@/domain/ledger";
import { formatMoney } from "@/domain/money";
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
    exportRows(w, from, to)
      .map((row) =>
        row.map((x) => '"' + x.replaceAll('"', '""') + '"').join(","),
      )
      .join("\r\n")
  );
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
) {
  const name = `CashNarra_${from}_${to}`;
  if (type === "csv") {
    download(
      new Blob([csv(w, from, to)], { type: "text/csv;charset=utf-8" }),
      name + ".csv",
    );
    return;
  }
  if (type === "xlsx") {
    const { default: writeXlsxFile } = await import("write-excel-file");
    await writeXlsxFile(
      exportRows(w, from, to).map((row) =>
        row.map((value) => ({ type: String, value })),
      ),
      {
        fileName: name + ".xlsx",
        columns: [
          { width: 40 },
          { width: 14 },
          { width: 36 },
          { width: 26 },
          { width: 24 },
          { width: 40 },
        ],
      },
    );
    return;
  }
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
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
  let y = 20;
  const line = (text: string, size = 10) => {
    doc.setFontSize(size);
    for (const part of doc.splitTextToSize(text, 174)) {
      if (y > 276) {
        doc.addPage();
        y = 20;
      }
      doc.text(part, 18, y);
      y += size * 0.48 + 2;
    }
  };
  line("CashNarra · Recorded activity report", 19);
  line(`${w.name} · GHS · ${from} to ${to}`, 11);
  line(`Exported ${new Date().toISOString()} · Ledger version ${w.version}`);
  const r = report(w, from, to);
  line(`Received ${formatMoney(r.received)} · Paid out ${formatMoney(r.paid)}`);
  line(`Net movement ${formatMoney(r.net)} · Sales ${formatMoney(r.sales)}`);
  line(
    `Recorded balances ${formatMoney(r.total)} · People owe ${formatMoney(r.peopleOwe)} · You owe ${formatMoney(r.userOwes)}`,
  );
  line(r.exclusions);
  y += 5;
  for (const e of r.records) {
    doc.setFontSize(11);
    const required =
      doc.splitTextToSize(`${e.date} · ${e.description}`, 174).length * 7.3 +
      24;
    if (y + required > 276) {
      doc.addPage();
      y = 20;
    }
    line(`${e.date} · ${e.description}`, 11);
    line(`${labels[e.kind]} · ${formatMoney(e.amount)}`);
    line(`Record ${e.id} · Source ${e.sourceId}`, 8);
    y += 4;
  }
  line("Balances and earlier opening references", 13);
  for (const a of r.balances) {
    const account = w.accounts.find((x) => x.id === a.id)!;
    line(
      `${a.name}: ${formatMoney(a.balance)}. Declared opening ${formatMoney(account.opening)} on ${account.openingDate}.`,
    );
  }
  for (const o of obligations({
    ...w,
    records: w.records.filter((r) => r.date <= to),
  })) {
    line(
      `${o.party}: ${formatMoney(o.remaining)} outstanding. Original ${formatMoney(o.original)}; record ${o.id}.`,
    );
  }
  line(
    "Manually entered records. Not bank verification, a tax filing or an audited statement.",
  );
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Private · ${i} / ${pages}`, 18, 289);
  }
  doc.save(name + ".pdf");
}
