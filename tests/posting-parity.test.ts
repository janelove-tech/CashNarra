import { describe, expect, it } from "vitest";
import { posting } from "../src/domain/ledger";
import { event } from "../src/domain/fixture";
import type { Account, EventInput } from "../src/domain/types";

const accounts: Account[] = [
  {
    id: "cash",
    name: "Cash",
    type: "Cash",
    currency: "GHS",
    opening: "0.00",
    openingDate: "2026-01-01",
  },
  {
    id: "bank",
    name: "Bank",
    type: "Bank",
    currency: "GHS",
    opening: "0.00",
    openingDate: "2026-01-01",
  },
];

const templates: {
  kind: EventInput["kind"];
  accountId: string | null;
  toAccountId?: string | null;
  party?: string | null;
  obligationId?: string | null;
  debit: string;
  credit: string;
}[] = [
  { kind: "sale", accountId: "cash", debit: "cash:cash", credit: "sales" },
  { kind: "income", accountId: "cash", debit: "cash:cash", credit: "income" },
  { kind: "expense", accountId: "cash", debit: "expense", credit: "cash:cash" },
  { kind: "stock", accountId: "cash", debit: "stock", credit: "cash:cash" },
  { kind: "asset", accountId: "cash", debit: "asset", credit: "cash:cash" },
  {
    kind: "transfer",
    accountId: "cash",
    toAccountId: "bank",
    debit: "cash:bank",
    credit: "cash:cash",
  },
  {
    kind: "credit_sale",
    accountId: null,
    party: "Ama",
    debit: "receivable:id",
    credit: "sales",
  },
  {
    kind: "credit_purchase",
    accountId: null,
    party: "Adjei",
    debit: "stock",
    credit: "payable:id",
  },
  {
    kind: "credit_expense",
    accountId: null,
    party: "Kofi",
    debit: "expense",
    credit: "payable:id",
  },
  {
    kind: "receivable_payment",
    accountId: "cash",
    obligationId: "debt-r",
    debit: "cash:cash",
    credit: "receivable:debt-r",
  },
  {
    kind: "payable_payment",
    accountId: "cash",
    obligationId: "debt-p",
    debit: "payable:debt-p",
    credit: "cash:cash",
  },
  {
    kind: "loan_received",
    accountId: "cash",
    party: "Lender",
    debit: "cash:cash",
    credit: "payable:id",
  },
  {
    kind: "loan_principal",
    accountId: "cash",
    obligationId: "debt-l",
    debit: "payable:debt-l",
    credit: "cash:cash",
  },
  {
    kind: "interest",
    accountId: "cash",
    debit: "interest",
    credit: "cash:cash",
  },
  { kind: "owner_in", accountId: "cash", debit: "cash:cash", credit: "equity" },
  { kind: "owner_out", accountId: "cash", debit: "equity", credit: "cash:cash" },
  {
    kind: "opening_receivable",
    accountId: null,
    party: "Ama",
    debit: "receivable:id",
    credit: "equity",
  },
  {
    kind: "opening_payable",
    accountId: null,
    party: "Adjei",
    debit: "equity",
    credit: "payable:id",
  },
  {
    kind: "opening_loan",
    accountId: null,
    party: "Lender",
    debit: "equity",
    credit: "payable:id",
  },
];

describe("posting templates", () => {
  it("covers every event kind once", () => {
    expect(templates.map((t) => t.kind).sort()).toEqual(
      [
        "sale",
        "income",
        "expense",
        "stock",
        "asset",
        "transfer",
        "credit_sale",
        "credit_purchase",
        "credit_expense",
        "receivable_payment",
        "payable_payment",
        "loan_received",
        "loan_principal",
        "interest",
        "owner_in",
        "owner_out",
        "opening_receivable",
        "opening_payable",
        "opening_loan",
      ].sort(),
    );
  });

  it.each(templates)("$kind posts $debit / $credit", (template) => {
    const row = event(template.kind, "10.00", template.kind, template.accountId, {
      id: "id",
      toAccountId: template.toAccountId ?? null,
      party: template.party ?? null,
      obligationId: template.obligationId ?? null,
    });
    expect(posting(row, accounts)).toEqual([
      { recordId: "id", account: template.debit, amount: "10.00" },
      { recordId: "id", account: template.credit, amount: "-10.00" },
    ]);
  });
});
