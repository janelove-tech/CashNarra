import type { EventInput, Workspace } from "./types";
import { calendarDate } from "./dates";
import { D, money } from "./money";
import { obligations, posting } from "./ledger";

export function accountTypeForName(name: string): "Cash" | "Bank" | "MoMo" {
  const value = name.toLowerCase();
  if (/\bmomo\b|mobile money/.test(value)) return "MoMo";
  if (/\bbank\b/.test(value)) return "Bank";
  return "Cash";
}

export function accountCreatePrompt(name: string | null, exists: boolean) {
  if (name && !exists)
    return `${name} is not in this workspace. Create it and use it for this record?`;
  if (name && exists)
    return `${name} is already in this workspace. Use that account, or create a different one.`;
  return "Create an account and use it for this record.";
}

export function balanceCreatePrompt(
  kind: EventInput["kind"],
  name: string | null,
  exists: boolean,
) {
  if (exists)
    return name
      ? `${name} already has a balance here. Use that balance, or create a different one.`
      : "Use a balance above, or create a different one.";
  if (kind === "loan_principal")
    return name
      ? `There is no saved loan from ${name}. Create it and apply this repayment to that loan?`
      : "There is no saved loan for this repayment. Create it and apply this repayment to that loan?";
  if (kind === "payable_payment")
    return name
      ? `There is no saved balance owed to ${name}. Create it and apply this payment to that balance?`
      : "There is no saved balance for this payment. Create it and apply this payment to that balance?";
  return name
    ? `There is no saved balance for ${name}. Create what they owe and apply this payment to it?`
    : "There is no saved balance for this payment. Create it and apply this payment to it.";
}

export function accountDraft(input: {
  name: string;
  type: string;
  opening: string | null;
  openingDate: string;
  recordDate: string;
  existingNames: string[];
}) {
  const name = input.name.trim().slice(0, 80);
  if (!name) throw new Error("Enter an account nickname.");
  if (!["Cash", "Bank", "MoMo"].includes(input.type))
    throw new Error("Choose Cash, Bank or MoMo.");
  if (!calendarDate(input.openingDate))
    throw new Error("Choose a valid starting date.");
  if (!calendarDate(input.recordDate) || input.openingDate > input.recordDate)
    throw new Error("Choose a starting date on or before this record.");
  if (
    input.existingNames.some(
      (existing) => existing.trim().toLowerCase() === name.toLowerCase(),
    )
  )
    throw new Error(
      `${name} is already in this workspace. Use that account, or choose a different nickname.`,
    );
  return {
    name,
    type: input.type as "Cash" | "Bank" | "MoMo",
    opening: input.opening === null ? null : money(input.opening),
    openingDate: input.openingDate,
  };
}

const openingKind = {
  receivable_payment: "opening_receivable",
  payable_payment: "opening_payable",
  loan_principal: "opening_loan",
} as const;

export function openingForSettlement(
  payment: EventInput,
  input: { name: string; amount: string; date: string },
): EventInput {
  const kind = openingKind[payment.kind as keyof typeof openingKind];
  if (!kind) throw new Error("This record does not settle a balance.");
  const name = input.name.trim().slice(0, 80);
  if (!name) throw new Error("Enter the name for this balance.");
  const amount = money(input.amount, true);
  if (!calendarDate(input.date))
    throw new Error("Choose a valid date for this balance.");
  if (!calendarDate(payment.date) || input.date > payment.date)
    throw new Error("The balance date has to be on or before this payment.");
  let paid: string;
  try {
    paid = money(payment.amount, true);
  } catch {
    throw new Error("Enter the payment amount before creating the balance.");
  }
  if (D(amount).lt(paid))
    throw new Error(
      "The balance has to cover this payment. Enter the amount owed before the payment.",
    );
  return {
    id: crypto.randomUUID(),
    kind,
    amount,
    date: input.date,
    description:
      kind === "opening_loan"
        ? `Opening loan from ${name}`
        : kind === "opening_payable"
          ? `Opening balance owed to ${name}`
          : `Opening balance owed by ${name}`,
    accountId: null,
    toAccountId: null,
    party: name,
    obligationId: null,
    groupId: null,
  };
}

export function reviewObligations(w: Workspace, events: EventInput[]) {
  const drafted = events.flatMap((event) => {
    try {
      const amount = money(event.amount, true);
      if (!calendarDate(event.date)) return [];
      const record = {
        ...event,
        amount,
        sourceId: "draft",
        version: 1,
        removed: false,
        replaces: null,
      };
      posting(record, w.accounts);
      return [record];
    } catch {
      return [];
    }
  });
  return obligations({ ...w, records: [...w.records, ...drafted] }).filter(
    (item) => D(item.remaining).gt(0),
  );
}

export function withSuggestions<
  T extends { suggestion?: string | null },
>(questions: T[]) {
  return questions.map((question) => ({
    ...question,
    suggestion: question.suggestion ?? null,
  }));
}
