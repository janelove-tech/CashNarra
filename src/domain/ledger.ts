import { D, money, sum } from "./money";
import { calendarDate, calendarMonth } from "./dates";
import {
  eventSchema,
  type Account,
  type Batch,
  type EventInput,
  type Line,
  type Obligation,
  type Workspace,
} from "./types";
export const labels: Record<EventInput["kind"], string> = {
  sale: "Sale received",
  income: "Other earnings",
  expense: "Operating expense",
  stock: "Stock purchase",
  asset: "Equipment purchase",
  transfer: "Between your accounts",
  credit_sale: "Credit sale",
  credit_purchase: "Unpaid stock purchase",
  credit_expense: "Unpaid operating expense",
  receivable_payment: "Old balance received",
  payable_payment: "Old balance paid",
  loan_received: "Loan received",
  loan_principal: "Loan principal repaid",
  interest: "Interest cost",
  owner_in: "Your money added",
  owner_out: "Money taken home",
  opening_receivable: "Opening money owed to you",
  opening_payable: "Opening supplier balance",
  opening_loan: "Opening loan principal",
};
const needsAccount = new Set([
  "sale",
  "income",
  "expense",
  "stock",
  "asset",
  "transfer",
  "receivable_payment",
  "payable_payment",
  "loan_received",
  "loan_principal",
  "interest",
  "owner_in",
  "owner_out",
]);
export function posting(e: EventInput, accounts: Account[]): Line[] {
  eventSchema.parse(e);
  const amount = money(e.amount, true);
  if (new Date(e.date + "T12:00:00Z").toISOString().slice(0, 10) !== e.date)
    throw new Error("Choose a valid date.");
  const a = accounts.find((a) => a.id === e.accountId);
  if (!needsAccount.has(e.kind) && e.accountId !== null)
    throw new Error(
      "No account money moved for this record. Choose no money account.",
    );
  if (e.kind !== "transfer" && e.toAccountId !== null)
    throw new Error("Only transfers have a destination account.");
  if (
    !["receivable_payment", "payable_payment", "loan_principal"].includes(
      e.kind,
    ) &&
    e.obligationId !== null
  )
    throw new Error("Only settlements link to an earlier balance.");
  if (needsAccount.has(e.kind) && (!a || a.currency !== "GHS"))
    throw new Error("Choose an account in this workspace.");
  if (a && e.date < a.openingDate)
    throw new Error("Record date is before this account’s opening date.");
  const cash = "cash:" + e.accountId;
  let debit = "",
    credit = "";
  switch (e.kind) {
    case "sale":
      debit = cash;
      credit = "sales";
      break;
    case "income":
      debit = cash;
      credit = "income";
      break;
    case "expense":
    case "interest":
      debit = e.kind;
      credit = cash;
      break;
    case "stock":
    case "asset":
      debit = e.kind;
      credit = cash;
      break;
    case "owner_in":
      debit = cash;
      credit = "equity";
      break;
    case "owner_out":
      debit = "equity";
      credit = cash;
      break;
    case "transfer": {
      const to = accounts.find((a) => a.id === e.toAccountId);
      if (
        !to ||
        to.currency !== a?.currency ||
        to.id === a.id ||
        e.date < to.openingDate
      )
        throw new Error(
          "Choose two different accounts in the same workspace and currency.",
        );
      debit = "cash:" + to.id;
      credit = cash;
      break;
    }
    case "credit_sale":
    case "opening_receivable":
      debit = "receivable:" + e.id;
      credit = e.kind === "credit_sale" ? "sales" : "equity";
      break;
    case "credit_purchase":
      debit = "stock";
      credit = "payable:" + e.id;
      break;
    case "credit_expense":
      debit = "expense";
      credit = "payable:" + e.id;
      break;
    case "opening_payable":
    case "opening_loan":
      debit = "equity";
      credit = "payable:" + e.id;
      break;
    case "loan_received":
      debit = cash;
      credit = "payable:" + e.id;
      break;
    case "receivable_payment":
      debit = cash;
      credit = "receivable:" + e.obligationId;
      break;
    case "payable_payment":
    case "loan_principal":
      debit = "payable:" + e.obligationId;
      credit = cash;
      break;
  }
  if (
    [
      "credit_sale",
      "credit_purchase",
      "credit_expense",
      "loan_received",
      "opening_receivable",
      "opening_payable",
      "opening_loan",
    ].includes(e.kind) &&
    !e.party?.trim()
  )
    throw new Error("Add the person or business for this balance.");
  if (
    ["receivable_payment", "payable_payment", "loan_principal"].includes(
      e.kind,
    ) &&
    !e.obligationId
  )
    throw new Error("Choose the existing balance being paid.");
  return [
    { recordId: e.id, account: debit, amount },
    { recordId: e.id, account: credit, amount: D(amount).negated().toFixed(2) },
  ];
}
export function ledger(w: Workspace): Line[] {
  return [
    ...w.accounts
      .filter((a) => a.opening !== null)
      .flatMap((a) => [
        {
          recordId: "opening:" + a.id,
          account: "cash:" + a.id,
          amount: money(a.opening),
        },
        {
          recordId: "opening:" + a.id,
          account: "equity",
          amount: D(a.opening!).neg().toFixed(2),
        },
      ]),
    ...w.records
      .filter((r) => !r.removed)
      .flatMap((e) => posting(e, w.accounts)),
  ];
}
export function obligations(w: Workspace): Obligation[] {
  const rows = w.records.filter((r) => !r.removed),
    lines = ledger(w);
  return rows
    .filter((r) =>
      [
        "credit_sale",
        "credit_purchase",
        "credit_expense",
        "loan_received",
        "opening_receivable",
        "opening_payable",
        "opening_loan",
      ].includes(r.kind),
    )
    .map((r) => {
      const direction =
        r.kind === "credit_sale" || r.kind === "opening_receivable"
          ? "receivable"
          : "payable";
      const balance = sum(
        lines
          .filter((l) => l.account === direction + ":" + r.id)
          .map((l) => l.amount),
      );
      return {
        id: r.id,
        party: r.party!,
        date: r.date,
        direction,
        original: r.amount,
        remaining: D(balance)
          .mul(direction === "payable" ? -1 : 1)
          .toFixed(2),
      };
    });
}
export function accountBalance(
  w: Workspace,
  id: string,
  through = "9999-12-31",
): string | null {
  const a = w.accounts.find((a) => a.id === id);
  if (!a || a.opening === null || through < a.openingDate) return null;
  return sum(
    ledger({ ...w, records: w.records.filter((r) => r.date <= through) })
      .filter((l) => l.account === "cash:" + id)
      .map((l) => l.amount),
  );
}
export function validateWorkspace(w: Workspace) {
  for (const account of w.accounts) {
    if (
      !account.id ||
      !account.name.trim() ||
      account.currency !== "GHS" ||
      !["Cash", "Bank", "MoMo"].includes(account.type)
    )
      throw new Error("Check the account name, type and currency.");
    if (account.opening !== null) money(account.opening);
  }
  if (
    w.accounts.some((a) => !calendarDate(a.openingDate)) ||
    w.checkins.some((c) => !calendarDate(c.date))
  )
    throw new Error("Choose a valid calendar date.");
  if (
    new Set(w.accounts.map((a) => a.id)).size !== w.accounts.length ||
    new Set(w.records.map((r) => r.id)).size !== w.records.length ||
    new Set(w.goals.map((g) => g.id)).size !== w.goals.length ||
    new Set(w.sources.map((s) => s.id)).size !== w.sources.length
  )
    throw new Error("Identifiers must be unique.");
  if (
    w.sources.some((s) => !s.id) ||
    w.records.some((r) => !w.sources.some((s) => s.id === r.sourceId))
  )
    throw new Error("Every record must retain its source reference.");
  for (const goal of w.goals) {
    if (
      new Set(goal.allocations.map((a) => a.id)).size !==
      goal.allocations.length
    )
      throw new Error("Allocation identifiers must be unique.");
    if (goal.allocations.some((a) => D(a.amount).isZero()))
      throw new Error("Enter a non-zero amount to assign or release.");
    if (
      goal.allocations.some((a) => !calendarDate(a.date)) ||
      goal.reviewedMonths.some((m) => !calendarMonth(m))
    )
      throw new Error("Choose a valid allocation date or review month.");
    money(goal.target, true);
    if (!w.accounts.some((a) => a.id === goal.accountId))
      throw new Error("Goal account unavailable.");
    const assigned = sum(goal.allocations.map((a) => money(a.amount)));
    if (D(assigned).lt(0))
      throw new Error("A goal cannot have negative assignments.");
  }
  const lines = ledger(w);
  if (!D(sum(lines.map((l) => l.amount))).isZero())
    throw new Error("Records must balance.");
  const obs = obligations(w);
  for (const r of w.records.filter((r) => !r.removed && r.obligationId)) {
    const o = obs.find((o) => o.id === r.obligationId);
    const debt = w.records.find((x) => x.id === r.obligationId);
    if (
      r.kind === "loan_principal" &&
      !["loan_received", "opening_loan"].includes(debt?.kind ?? "")
    )
      throw new Error("Choose a loan balance for principal repayment.");
    if (
      r.kind === "payable_payment" &&
      ["loan_received", "opening_loan"].includes(debt?.kind ?? "")
    )
      throw new Error(
        "Record loan principal separately from supplier payments.",
      );
    if (
      !o ||
      o.date > r.date ||
      o.direction !==
        (r.kind === "receivable_payment" ? "receivable" : "payable")
    )
      throw new Error(
        "The linked balance is unavailable or has a different meaning.",
      );
  }
  if (obs.some((o) => D(o.remaining).lt(0)))
    throw new Error(
      "This payment exceeds the remaining balance. Refresh and review it.",
    );
  for (const a of w.accounts) {
    const assigned = sum(
      w.goals
        .filter((g) => g.accountId === a.id)
        .flatMap((g) => g.allocations.map((x) => x.amount)),
    );
    const bal = accountBalance(w, a.id);
    if (
      D(assigned).lt(0) ||
      (D(assigned).gt(0) && (bal === null || D(assigned).gt(bal)))
    )
      throw new Error(
        "Goal assignments exceed known recorded funds. Reduce assignments first.",
      );
  }
}
export function duplicates(w: Workspace, events: EventInput[]) {
  return events
    .filter((e) => {
      try {
        money(e.amount, true);
        return true;
      } catch {
        return false;
      }
    })
    .flatMap((e) =>
      w.records
        .filter(
          (r) =>
            !r.removed &&
            r.date === e.date &&
            r.kind === e.kind &&
            r.accountId === e.accountId &&
            D(r.amount).eq(e.amount) &&
            ((!!r.party && r.party === e.party) ||
              r.description.toLowerCase() === e.description.toLowerCase()),
        )
        .map((r) => ({ proposed: e, existing: r })),
    );
}
export function applyBatch(
  w: Workspace,
  b: Batch,
  now = new Date().toISOString(),
): Workspace {
  if (w.version !== b.expectedVersion)
    throw new Error(
      "These records changed. Refresh and review your changes again.",
    );
  if (!b.events.length && !b.replaceIds.length)
    throw new Error("Add at least one record.");
  if (b.events.length > 100 || b.source.length > 12000)
    throw new Error("Use a smaller batch.");
  const n = structuredClone(w),
    sourceId = crypto.randomUUID();
  const old = n.records.filter(
    (r) => b.replaceIds.includes(r.id) && !r.removed,
  );
  if (old.length !== new Set(b.replaceIds).size)
    throw new Error("A record was changed or is not in this workspace.");
  if (old.length && !b.reason.trim())
    throw new Error("Add a reason for the correction.");
  if (
    b.reason === "Split record" &&
    !D(sum(old.map((r) => r.amount))).eq(sum(b.events.map((r) => r.amount)))
  )
    throw new Error("Split parts must total the original amount.");
  for (const r of old) {
    r.removed = true;
    n.history.push({
      at: now,
      reason: b.reason,
      before: { ...r, removed: false },
      replacementIds: b.events.map((e) => e.id),
    });
  }
  if (!b.allowDuplicates && duplicates(n, b.events).length)
    throw new Error(
      "Possible duplicate. Compare the existing record before keeping both.",
    );
  for (const e of b.events) {
    if (n.records.some((r) => r.id === e.id))
      throw new Error("Record identifiers must be new.");
    posting(e, n.accounts);
    n.records.push({
      ...e,
      amount: money(e.amount, true),
      sourceId,
      version: 1,
      removed: false,
      replaces: old[0]?.id ?? null,
    });
  }
  // Preserve settlements when a single obligation is corrected with the same meaning and party.
  // Only its reference changes; each relink gets a replacement and an explicit history entry.
  for (const original of old) {
    const linked = n.records.filter(
      (r) => !r.removed && r.obligationId === original.id,
    );
    if (!linked.length) continue;
    const replacements = b.events.filter(
      (e) => e.kind === original.kind && e.party === original.party,
    );
    if (replacements.length !== 1)
      throw new Error(
        "A settled balance needs one replacement with the same person and meaning. Correct linked payments before removing or splitting it.",
      );
    for (const payment of linked) {
      const replacement = {
        ...payment,
        id: crypto.randomUUID(),
        obligationId: replacements[0].id,
        replaces: payment.id,
        version: payment.version + 1,
      };
      payment.removed = true;
      n.records.push(replacement);
      n.history.push({
        at: now,
        reason: "Balance correction: linked payment preserved",
        before: { ...payment, removed: false },
        replacementIds: [replacement.id],
      });
    }
  }
  // Carry a date only when the correction unambiguously represents the same debt.
  // Keep the original entry so earlier records still explain their payment dates.
  if (old.length === 1 && b.events.length === 1) {
    const original = old[0],
      replacement = b.events[0];
    const dated = n.debtDates?.filter((d) => d.recordId === original.id).at(-1);
    if (
      dated &&
      original.kind === replacement.kind &&
      original.party === replacement.party
    ) {
      if (dated.date && dated.date < replacement.date)
        throw new Error(
          "The payment date is before this corrected balance date. Change or clear the payment date first.",
        );
      n.debtDates!.push({
        recordId: replacement.id,
        date: dated.date,
        at: now,
      });
    }
  }
  n.sources.push({
    id: sourceId,
    text: n.retentionDays === 0 ? null : b.source,
    createdAt: now,
    expiresAt: new Date(
      new Date(now).getTime() + n.retentionDays * 86400000,
    ).toISOString(),
    revision: b.revision,
  });
  n.version++;
  validateWorkspace(n);
  return n;
}
export function report(w: Workspace, from: string, to: string) {
  if (!calendarDate(from) || !calendarDate(to) || from > to)
    throw new Error(
      "Choose a valid report period with the start before the end.",
    );
  const records = w.records.filter(
    (r) => !r.removed && r.date >= from && r.date <= to,
  );
  const lines = records.flatMap((r) => posting(r, w.accounts));
  const movements = records
    .filter((r) => r.kind !== "transfer" && !r.kind.startsWith("opening_"))
    .map((r) => ({
      id: r.id,
      amount: sum(
        lines
          .filter((l) => l.recordId === r.id && l.account.startsWith("cash:"))
          .map((l) => l.amount),
      ),
    }));
  const received = sum(
      movements.filter((x) => D(x.amount).gt(0)).map((x) => x.amount),
    ),
    paid = D(
      sum(movements.filter((x) => D(x.amount).lt(0)).map((x) => x.amount)),
    )
      .neg()
      .toFixed(2);
  const balances = w.accounts.map((a) => ({
    id: a.id,
    name: a.name,
    balance: accountBalance(w, a.id, to),
  }));
  const obs = obligations({
    ...w,
    records: w.records.filter((r) => r.date <= to),
  });
  return {
    from,
    to,
    version: w.version,
    records,
    received,
    paid,
    net: D(received).minus(paid).toFixed(2),
    sales: D(
      sum(lines.filter((l) => l.account === "sales").map((l) => l.amount)),
    )
      .neg()
      .toFixed(2),
    expenses: sum(
      lines
        .filter((l) => ["expense", "interest"].includes(l.account))
        .map((l) => l.amount),
    ),
    balances,
    total: balances.some((a) => a.balance === null)
      ? null
      : sum(balances.map((a) => a.balance!)),
    peopleOwe: sum(
      obs.filter((o) => o.direction === "receivable").map((o) => o.remaining),
    ),
    userOwes: sum(
      obs.filter((o) => o.direction === "payable").map((o) => o.remaining),
    ),
    profit: null,
    receivedIds: movements.filter((x) => D(x.amount).gt(0)).map((x) => x.id),
    paidIds: movements.filter((x) => D(x.amount).lt(0)).map((x) => x.id),
    exclusions:
      "Transfers and openings excluded from movement. Allocations do not move money. Profit unavailable: cost of sales and other information are missing.",
  };
}
