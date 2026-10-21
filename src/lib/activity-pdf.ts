import type { jsPDF } from "jspdf";
import { kindLabel, obligations, posting, report } from "@/domain/ledger";
import { D, formatMoney, sum } from "@/domain/money";
import { rangeLabel, readingDate } from "@/domain/periods";
import type { Workspace } from "@/domain/types";

function cashMovement(record: Workspace["records"][number], accounts: Workspace["accounts"]) {
  if (record.kind === "transfer")
    return { amount: "0.00", type: "internal_transfer" as const };
  const amount = sum(
    posting(record, accounts)
      .filter((entry) => entry.account.startsWith("cash:"))
      .map((entry) => entry.amount),
  );
  if (D(amount).isZero()) return { amount: "0.00", type: "none" as const };
  return { amount, type: D(amount).gt(0) ? ("in" as const) : ("out" as const) };
}

const pageHeight = 841.89;
const ink: [number, number, number] = [41, 38, 61];
const violet: [number, number, number] = [91, 73, 199];
const muted: [number, number, number] = [98, 95, 115];
const line: [number, number, number] = [225, 222, 235];
const cardLabel: [number, number, number] = [217, 212, 233];
const apricot: [number, number, number] = [255, 196, 160];
const zebra: [number, number, number] = [250, 250, 252];
const band: [number, number, number] = [240, 236, 252];
const moneyIn: [number, number, number] = [68, 91, 161];
const moneyOut: [number, number, number] = [149, 96, 62];
const symbolPath =
  "M6 10a7 7 0 0 1 7-7h10a7 7 0 0 1 7 7v15a7 7 0 0 1-7 7h-5L6 43V10Zm52 44a7 7 0 0 1-7 7H41a7 7 0 0 1-7-7V39a7 7 0 0 1 7-7h5l12-11v33Z";

function arcCurves(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  rotation: number,
  large: number,
  sweep: number,
  x2: number,
  y2: number,
) {
  const phi = (rotation * Math.PI) / 180;
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cosPhi * dx + sinPhi * dy;
  const y1p = -sinPhi * dx + cosPhi * dy;
  let radiusX = Math.abs(rx);
  let radiusY = Math.abs(ry);
  const lambda = (x1p * x1p) / (radiusX * radiusX) + (y1p * y1p) / (radiusY * radiusY);
  if (lambda > 1) {
    const scale = Math.sqrt(lambda);
    radiusX *= scale;
    radiusY *= scale;
  }
  const sign = large === sweep ? -1 : 1;
  const numerator =
    radiusX * radiusX * radiusY * radiusY -
    radiusX * radiusX * y1p * y1p -
    radiusY * radiusY * x1p * x1p;
  const denominator = radiusX * radiusX * y1p * y1p + radiusY * radiusY * x1p * x1p;
  const coef = sign * Math.sqrt(Math.max(0, numerator) / Math.max(denominator, 1e-12));
  const cxp = coef * ((radiusX * y1p) / radiusY);
  const cyp = coef * (-(radiusY * x1p) / radiusX);
  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;
  const angle = (ux: number, uy: number, vx: number, vy: number) => {
    const dot = ux * vx + uy * vy;
    const length = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    const amount = Math.acos(Math.min(1, Math.max(-1, dot / length)));
    return ux * vy - uy * vx < 0 ? -amount : amount;
  };
  const theta = angle(1, 0, (x1p - cxp) / radiusX, (y1p - cyp) / radiusY);
  let delta = angle(
    (x1p - cxp) / radiusX,
    (y1p - cyp) / radiusY,
    (-x1p - cxp) / radiusX,
    (-y1p - cyp) / radiusY,
  );
  if (sweep === 0 && delta > 0) delta -= Math.PI * 2;
  if (sweep === 1 && delta < 0) delta += Math.PI * 2;
  const segments = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2)));
  const step = delta / segments;
  const curves: [number, number, number, number, number, number][] = [];
  for (let index = 0; index < segments; index += 1) {
    const start = theta + index * step;
    const end = start + step;
    const alpha = (4 / 3) * Math.tan(step / 4);
    const cosStart = Math.cos(start);
    const sinStart = Math.sin(start);
    const cosEnd = Math.cos(end);
    const sinEnd = Math.sin(end);
    const map = (cos: number, sin: number) => ({
      x: cx + radiusX * cosPhi * cos - radiusY * sinPhi * sin,
      y: cy + radiusX * sinPhi * cos + radiusY * cosPhi * sin,
    });
    const p1 = map(cosStart, sinStart);
    const p2 = map(cosEnd, sinEnd);
    const d1 = map(-sinStart, cosStart);
    const d2 = map(-sinEnd, cosEnd);
    curves.push([
      p1.x + alpha * (d1.x - cx),
      p1.y + alpha * (d1.y - cy),
      p2.x - alpha * (d2.x - cx),
      p2.y - alpha * (d2.y - cy),
      p2.x,
      p2.y,
    ]);
  }
  return curves;
}

function drawSymbol(doc: jsPDF, x: number, y: number, size: number) {
  const scale = size / 64;
  const point = (valueX: number, valueY: number) => [x + valueX * scale, y + valueY * scale] as const;
  const parts = symbolPath.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  let cursor = 0;
  let command = "";
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  const number = () => Number(parts[cursor++]);
  const finish = () => {
    doc.close();
    doc.fill();
  };
  while (cursor < parts.length) {
    if (/[a-zA-Z]/.test(parts[cursor])) command = parts[cursor++];
    if (command === "M" || command === "m") {
      const nextX = number();
      const nextY = number();
      currentX = command === "m" ? currentX + nextX : nextX;
      currentY = command === "m" ? currentY + nextY : nextY;
      startX = currentX;
      startY = currentY;
      const [absoluteX, absoluteY] = point(currentX, currentY);
      doc.moveTo(absoluteX, absoluteY);
      command = command === "m" ? "l" : "L";
      continue;
    }
    if (command === "Z" || command === "z") {
      finish();
      currentX = startX;
      currentY = startY;
      continue;
    }
    if (command === "L" || command === "l") {
      const nextX = number();
      const nextY = number();
      currentX = command === "l" ? currentX + nextX : nextX;
      currentY = command === "l" ? currentY + nextY : nextY;
    } else if (command === "H" || command === "h") {
      const nextX = number();
      currentX = command === "h" ? currentX + nextX : nextX;
    } else if (command === "V" || command === "v") {
      const nextY = number();
      currentY = command === "v" ? currentY + nextY : nextY;
    } else if (command === "A" || command === "a") {
      const radiusX = number();
      const radiusY = number();
      const rotation = number();
      const large = number();
      const sweep = number();
      const nextX = number();
      const nextY = number();
      const endX = command === "a" ? currentX + nextX : nextX;
      const endY = command === "a" ? currentY + nextY : nextY;
      for (const [c1x, c1y, c2x, c2y, ex, ey] of arcCurves(
        currentX,
        currentY,
        radiusX,
        radiusY,
        rotation,
        large,
        sweep,
        endX,
        endY,
      )) {
        const [x1, y1] = point(c1x, c1y);
        const [x2, y2] = point(c2x, c2y);
        const [x3, y3] = point(ex, ey);
        doc.curveTo(x1, y1, x2, y2, x3, y3);
      }
      currentX = endX;
      currentY = endY;
      continue;
    }
    const [absoluteX, absoluteY] = point(currentX, currentY);
    doc.lineTo(absoluteX, absoluteY);
  }
}

export function drawActivityReport(
  doc: jsPDF,
  w: Workspace,
  from: string,
  to: string,
  font = "Inter",
) {
  const stated = report(w, from, to);
  const activity = stated.records.filter(
    (record) => !record.kind.startsWith("opening_"),
  );
  const amountOf = (kind: Workspace["records"][number]["kind"]) =>
    sum(
      activity
        .filter((record) => record.kind === kind)
        .map((record) => record.amount),
    );
  const takenHome = amountOf("owner_out");
  const creditSales = amountOf("credit_sale");
  const oldReceipts = amountOf("receivable_payment");
  const fill = (color: [number, number, number]) => doc.setFillColor(...color);
  const draw = (color: [number, number, number]) => doc.setDrawColor(...color);
  const paint = (color: [number, number, number]) => doc.setTextColor(...color);
  const write = (
    value: string,
    x: number,
    fromTop: number,
    size: number,
    color: [number, number, number] = ink,
  ) => {
    doc.setFont(font, "normal");
    doc.setFontSize(size);
    paint(color);
    doc.text(value, x, fromTop);
  };
  const writeRight = (
    value: string,
    right: number,
    fromTop: number,
    size: number,
    color: [number, number, number] = ink,
  ) => {
    doc.setFont(font, "normal");
    doc.setFontSize(size);
    paint(color);
    doc.text(value, right - doc.getTextWidth(value), fromTop);
  };
  const rule = (fromTop: number) => {
    draw(line);
    doc.setLineWidth(0.8);
    doc.line(40, fromTop, 555.28, fromTop);
  };
  const masthead = (headline: string) => {
    fill(violet);
    drawSymbol(doc, 40, 36, 25);
    write("CashNarra", 73, 52, 17);
    writeRight("RECORDED ACTIVITY  /  GHS", 555, 49, 7.5, violet);
    rule(70);
    write(headline, 40, 102, 21);
    write(
      `${w.name}   ·   ${rangeLabel(from, to)}   ·   User-entered records`,
      40,
      122,
      9,
      muted,
    );
  };
  const footer = (page: number, pages: number) => {
    rule(pageHeight - 53);
    write(
      "CASHNARRA   ·   PRIVATE FINANCIAL RECORD",
      40,
      pageHeight - 38,
      7.1,
      muted,
    );
    writeRight(`${page} / ${pages}`, 555, pageHeight - 38, 8);
  };

  doc.setPage(1);
  masthead("Your money, clearly recorded.");
  fill(ink);
  doc.roundedRect(40, 142, 515.28, 119, 12, 12, "F");
  write("MONEY RECEIVED", 57, 164, 8.2, cardLabel);
  write(formatMoney(stated.received), 57, 194, 20, [255, 255, 255]);
  write("MONEY PAID OUT", 276, 164, 8.2, cardLabel);
  write(formatMoney(stated.paid), 276, 194, 20, [255, 255, 255]);
  draw([74, 70, 93]);
  doc.setLineWidth(0.8);
  doc.line(57, 214, 538, 214);
  write("NET CASH MOVEMENT   ·   NOT PROFIT", 57, 236, 8.2, apricot);
  writeRight(formatMoney(stated.net), 538, 238, 16, [255, 255, 255]);

  const secondary = [
    ["Sales value", formatMoney(stated.sales)],
    ["Recorded expenses", formatMoney(stated.expenses)],
    ["Money taken home", formatMoney(takenHome)],
  ] as const;
  secondary.forEach(([caption, value], index) => {
    const x = [40, 207, 406][index];
    write(caption, x, 283, 8.4, muted);
    write(value, x, 305, 12);
  });
  rule(328);
  write("YOUR RECORDED ACTIVITY", 40, 350, 10);
  writeRight(`${activity.length} records`, 555, 350, 8.5, muted);

  let cursor = 372;
  const rowHeight = 34;
  const drawTableHead = () => {
    fill(band);
    doc.roundedRect(40, cursor, 515.28, 22, 4, 4, "F");
    write("ACTIVITY", 49, cursor + 15, 7.1, violet);
    write("MEANING", 276, cursor + 15, 7.1, violet);
    writeRight("EVENT VALUE", 470, cursor + 15, 7.1, violet);
    writeRight("CASH EFFECT", 548, cursor + 15, 7.1, violet);
    cursor += 28;
  };
  drawTableHead();
  activity.forEach((record, index) => {
    if (cursor + rowHeight > pageHeight - 88) {
      doc.addPage();
      cursor = 48;
      write("Recorded activity, continued", 40, cursor, 14);
      cursor += 28;
      drawTableHead();
    }
    if (index % 2 === 0) {
      fill(zebra);
      doc.rect(40, cursor, 515.28, rowHeight, "F");
    }
    const effect = cashMovement(record, w.accounts);
    const cash =
      record.kind === "credit_sale" || effect.type === "none"
        ? "No cash"
        : effect.type === "internal_transfer"
          ? "Moved"
          : formatMoney(effect.amount);
    const cashColor =
      effect.type === "in"
        ? moneyIn
        : effect.type === "out"
          ? moneyOut
          : muted;
    const description = doc.splitTextToSize(record.description, 190)[0];
    write(description, 49, cursor + 14, 8.4);
    write(kindLabel(record.kind, w.type), 276, cursor + 14, 7.4, muted);
    writeRight(formatMoney(record.amount), 470, cursor + 14, 8.4);
    writeRight(cash, 548, cursor + 14, 8.4, cashColor);
    draw(line);
    doc.setLineWidth(0.6);
    doc.line(40, cursor + rowHeight, 555.28, cursor + rowHeight);
    cursor += rowHeight;
  });
  cursor += 16;
  const notes = [
    "Sales are not always cash received. Old-balance payments are not new sales.",
    "A credit sale adds to sales value but not to cash received that day.",
    "Full wording is kept in the transactions file and the Excel workbook.",
  ];
  for (const note of notes) {
    if (cursor > pageHeight - 80) break;
    write(note, 40, cursor, 8.4, muted);
    cursor += 16;
  }

  doc.addPage();
  masthead("Accounts & cash-flow details");
  write("ACCOUNT POSITION   ·   MANUALLY RECORDED", 40, 156, 10, violet);
  writeRight(
    `Recorded total  ${formatMoney(stated.total)}`,
    555,
    156,
    10,
  );
  cursor = 178;
  fill(band);
  doc.roundedRect(40, cursor, 515.28, 22, 4, 4, "F");
  write("ACCOUNT", 50, cursor + 14, 7.6, violet);
  write("DECLARED OPENING", 250, cursor + 14, 7.6, violet);
  writeRight("RECORDED BALANCE", 548, cursor + 14, 7.6, violet);
  cursor += 28;
  for (const balance of stated.balances) {
    const account = w.accounts.find((item) => item.id === balance.id)!;
    write(account.name, 50, cursor + 12, 9);
    write(readingDate(account.openingDate), 50, cursor + 26, 7.6, muted);
    write(formatMoney(account.opening), 250, cursor + 16, 9);
    writeRight(formatMoney(balance.balance), 548, cursor + 16, 9);
    rule(cursor + 34);
    cursor += 42;
  }
  cursor += 12;
  write("OUTSTANDING BALANCES AT PERIOD END", 40, cursor, 10, violet);
  cursor += 20;
  const owed = obligations({
    ...w,
    records: w.records.filter((record) => record.date <= to),
  });
  if (!owed.length) {
    write("Nothing is outstanding at the end of this period.", 47, cursor, 9, muted);
    cursor += 22;
  }
  for (const item of owed) {
    write(item.party, 47, cursor, 9);
    writeRight(
      `${formatMoney(item.remaining)} remaining    ·    ${formatMoney(item.original)} original`,
      548,
      cursor,
      8.5,
    );
    cursor += 20;
  }
  cursor += 10;
  write("HOW THE CASH MOVED", 40, cursor, 10, violet);
  cursor += 16;
  write(
    "These figures explain cash received and cash paid in this period.",
    40,
    cursor,
    8.4,
    muted,
  );
  cursor += 18;
  const cardTop = cursor;
  const present = (rows: [string, string][]) =>
    rows.filter((entry) => D(entry[1]).gt(0));
  const cards: [
    string,
    string,
    [number, number, number],
    [string, string][],
  ][] = [
    [
      "CASH RECEIVED",
      formatMoney(stated.received),
      moneyIn,
      present([
        ["Cash sales", amountOf("sale")],
        ["Old balance payments", oldReceipts],
        ["Other money in", amountOf("income")],
        ["Your money added", amountOf("owner_in")],
        ["Loan received", amountOf("loan_received")],
      ]),
    ],
    [
      "CASH PAID OUT",
      formatMoney(stated.paid),
      moneyOut,
      present([
        ["Recorded expenses", stated.expenses],
        ["Money taken home", takenHome],
        ["Stock purchased", amountOf("stock")],
        ["Equipment purchased", amountOf("asset")],
        ["Old balances paid", amountOf("payable_payment")],
      ]),
    ],
  ];
  const cardRows = Math.max(
    1,
    ...cards.map((card) => Math.min(4, card[3].length)),
  );
  const cardHeight = 46 + cardRows * 24;
  cards.forEach(([title, total, color, rows], index) => {
    const x = 40 + index * 268;
    fill(zebra);
    doc.roundedRect(x, cardTop, 247, cardHeight, 10, 10, "F");
    write(title, x + 16, cardTop + 22, 9.2);
    writeRight(total, x + 231, cardTop + 22, 11, color);
    draw(line);
    doc.setLineWidth(0.7);
    doc.line(x + 16, cardTop + 34, x + 231, cardTop + 34);
    const base = D(index === 0 ? stated.received : stated.paid);
    rows.slice(0, 4).forEach(([caption, amount], row) => {
      const y = cardTop + 50 + row * 24;
      write(caption, x + 16, y, 8.4, muted);
      writeRight(formatMoney(amount), x + 231, y, 8.4);
      const width = base.isZero()
        ? 0
        : Math.max(8, D(amount).div(base).mul(200).toNumber());
      fill(line);
      doc.roundedRect(x + 16, y + 4, 200, 4, 2, 2, "F");
      fill(color);
      doc.roundedRect(x + 16, y + 4, Math.min(200, width), 4, 2, 2, "F");
    });
  });
  cursor = cardTop + cardHeight + 20;
  const reasons = [
    D(oldReceipts).gt(0)
      ? `Cash received includes ${formatMoney(oldReceipts)} collected against earlier balances.`
      : "",
    D(creditSales).gt(0)
      ? `${formatMoney(creditSales)} in credit sales is counted as sales, not as cash received.`
      : "",
    D(takenHome).gt(0)
      ? "Money taken home is a withdrawal, not an operating expense."
      : "",
  ].filter(Boolean);
  if (cursor + 18 + reasons.length * 16 + 52 > pageHeight - 64) {
    doc.addPage();
    cursor = 56;
  }
  write("WHY THESE TOTALS ARE DIFFERENT", 40, cursor, 10, violet);
  cursor += 18;
  for (const reason of reasons) {
    write(reason, 40, cursor, 8.7);
    cursor += 16;
  }
  cursor += 8;
  fill(band);
  doc.roundedRect(40, cursor, 515.28, 42, 8, 8, "F");
  write("IMPORTANT LIMITS", 51, cursor + 16, 7.8, violet);
  write(
    "Not bank-verified, audited, or a tax filing. Net movement is not profit.",
    51,
    cursor + 30,
    7.5,
  );

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    footer(page, pages);
  }
}
