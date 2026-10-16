import type { EventInput, Workspace } from "./types";
import { applyBatch } from "./ledger";
export const sample =
  "Today I sold GH₵2,400: GH₵900 cash, GH₵1,200 MoMo, and Kojo still owes GH₵300. I bought GH₵700 of stock with cash, paid GH₵80 delivery from MoMo, moved GH₵500 from bank to MoMo, Abena paid GH₵200 of what she owed into MoMo, and I took GH₵150 cash home.";
export const unclearSample = sample.replace("delivery from MoMo", "delivery");
export function event(
  kind: EventInput["kind"],
  amount: string,
  description: string,
  accountId: string | null = null,
  extra: Partial<EventInput> = {},
): EventInput {
  return {
    id: crypto.randomUUID(),
    kind,
    amount,
    description,
    accountId,
    date: "2026-10-13",
    toAccountId: null,
    party: null,
    obligationId: null,
    groupId: null,
    ...extra,
  };
}
export function emptyWorkspace(
  ownerId: string,
  name = "My workspace",
  type: Workspace["type"] = "Business",
): Workspace {
  return {
    id: crypto.randomUUID(),
    ownerId,
    name,
    type,
    currency: "GHS",
    version: 0,
    accounts: [],
    records: [],
    sources: [],
    history: [],
    goals: [],
    checkins: [],
    retentionDays: 30,
    requests: [],
  };
}
export function fixtureEvents(): EventInput[] {
  return [
    event("sale", "900.00", "Cash sales", "cash", { groupId: "CN-S1" }),
    event("sale", "1200.00", "MoMo sales", "momo", { groupId: "CN-S1" }),
    event("credit_sale", "300.00", "Kojo’s credit sale", null, {
      party: "Kojo",
      groupId: "CN-S1",
    }),
    event("stock", "700.00", "Stock for the shop", "cash"),
    event("expense", "80.00", "Customer delivery", "momo"),
    event("transfer", "500.00", "Bank → MoMo", "bank", { toAccountId: "momo" }),
    event("receivable_payment", "200.00", "Abena’s part payment", "momo", {
      party: "Abena",
      obligationId: "opening-abena",
    }),
    event("owner_out", "150.00", "Money taken home", "cash"),
  ];
}
export function fixture(ownerId = "synthetic", posted = true): Workspace {
  let w = emptyWorkspace(ownerId, "Ama Works");
  w.accounts = [
    {
      id: "cash",
      name: "Cash",
      type: "Cash",
      currency: "GHS",
      opening: "400.00",
      openingDate: "2026-10-13",
    },
    {
      id: "momo",
      name: "MoMo",
      type: "MoMo",
      currency: "GHS",
      opening: "1200.00",
      openingDate: "2026-10-13",
    },
    {
      id: "bank",
      name: "Bank",
      type: "Bank",
      currency: "GHS",
      opening: "3000.00",
      openingDate: "2026-10-13",
    },
  ];
  w = applyBatch(
    w,
    {
      requestId: "openings",
      revision: 0,
      expectedVersion: 0,
      source:
        "Synthetic openings. Abena balance from 8 October. Adjei Packaging 500 due 31 October; interest-free loan 1,000 with 100 monthly repayment, next due 31 October.",
      replaceIds: [],
      reason: "",
      allowDuplicates: true,
      events: [
        event("opening_receivable", "600.00", "Abena opening balance", null, {
          id: "opening-abena",
          party: "Abena",
          date: "2026-10-08",
        }),
        event(
          "opening_payable",
          "500.00",
          "Adjei Packaging opening balance",
          null,
          {
            id: "opening-supplier",
            party: "Adjei Packaging",
            date: "2026-10-08",
          },
        ),
        event("opening_loan", "1000.00", "Interest-free business loan", null, {
          id: "opening-loan",
          party: "Business lender",
          date: "2026-10-08",
        }),
      ],
    },
    "2026-10-13T09:00:00Z",
  );
  w.goals = [
    {
      id: "equipment",
      name: "New equipment",
      target: "6000.00",
      accountId: "bank",
      allocations: [
        { id: "jul", date: "2026-07-31", amount: "300.00" },
        { id: "aug", date: "2026-08-31", amount: "400.00" },
        { id: "sep", date: "2026-09-30", amount: "500.00" },
      ],
      reviewedMonths: ["2026-07", "2026-08", "2026-09"],
      commitmentsKnown: true,
    },
  ];
  w.checkins = [7, 8, 9, 12, 13].map((day) => ({
    date: `2026-10-${String(day).padStart(2, "0")}`,
    at: `2026-10-${String(day).padStart(2, "0")}T18:00:00Z`,
    kind: "review" as const,
  }));
  w.checkins.push({
    date: "2026-10-11",
    at: "2026-10-11T18:00:00Z",
    kind: "rest",
  });
  return posted
    ? applyBatch(
        w,
        {
          requestId: "fixture",
          revision: 0,
          expectedVersion: w.version,
          source: sample,
          events: fixtureEvents(),
          replaceIds: [],
          reason: "",
          allowDuplicates: true,
        },
        "2026-10-13T18:00:00Z",
      )
    : w;
}
