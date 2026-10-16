import { z } from "zod";
export const kinds = [
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
] as const;
export const eventSchema = z.object({
  id: z.string().min(1).max(100),
  kind: z.enum(kinds),
  amount: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().min(1).max(300),
  accountId: z.string().nullable(),
  toAccountId: z.string().nullable(),
  party: z.string().max(100).nullable(),
  obligationId: z.string().nullable(),
  groupId: z.string().nullable(),
});
export type EventInput = z.infer<typeof eventSchema>;
export type RecordEvent = EventInput & {
  sourceId: string;
  version: number;
  removed: boolean;
  replaces: string | null;
};
export type Account = {
  id: string;
  name: string;
  type: "Cash" | "Bank" | "MoMo";
  currency: "GHS";
  opening: string | null;
  openingDate: string;
};
export type Line = { recordId: string; account: string; amount: string };
export type Source = {
  id: string;
  text: string | null;
  createdAt: string;
  expiresAt: string;
  revision: number;
};
export type Goal = {
  id: string;
  name: string;
  target: string;
  accountId: string;
  allocations: { id: string; date: string; amount: string }[];
  reviewedMonths: string[];
  commitmentsKnown: boolean;
};
export type History = {
  at: string;
  reason: string;
  before: RecordEvent;
  replacementIds: string[];
};
export type Workspace = {
  contacts?: {
    id: string;
    name: string;
    role: "Customer" | "Supplier" | "Other";
  }[];
  preferences?: { showRhythm: boolean; reminder: boolean };
  checkinHistory?: {
    date: string;
    at: string;
    kind: "review" | "rest" | "no_activity";
  }[];
  debtDates?: { recordId: string; date: string | null; at: string }[];
  goalChanges?: {
    goalId: string;
    at: string;
    before: { name: string; target: string };
    after: { name: string; target: string };
  }[];
  id: string;
  ownerId: string;
  name: string;
  type: "Personal" | "Business";
  currency: "GHS";
  version: number;
  accounts: Account[];
  openingHistory?: {
    at: string;
    reason: string;
    before: Account;
    after: Account;
  }[];
  records: RecordEvent[];
  sources: Source[];
  history: History[];
  goals: Goal[];
  checkins: {
    date: string;
    at: string;
    kind: "review" | "rest" | "no_activity";
  }[];
  retentionDays: number;
  requests: {
    id: string;
    kind: "access" | "deletion";
    at: string;
    status: "pending review";
  }[];
};
export type Batch = {
  requestId: string;
  revision: number;
  expectedVersion: number;
  source: string;
  events: EventInput[];
  replaceIds: string[];
  reason: string;
  allowDuplicates: boolean;
};
export type Receipt = {
  requestId: string;
  revision: number;
  version: number;
  recordIds: string[];
  savedAt: string;
};
export type Obligation = {
  id: string;
  party: string;
  direction: "receivable" | "payable";
  original: string;
  remaining: string;
  date: string;
};

export type WorkspaceSummary = Pick<
  Workspace,
  "id" | "name" | "type" | "version"
>;
