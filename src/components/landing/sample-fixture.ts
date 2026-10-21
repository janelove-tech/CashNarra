import { D, sum } from "@/domain/money";

/** Immutable fictional reading. Not a ledger posting and not a saved record. */
export const CLEAR_QUOTE =
  "I sold 900 cedis in cash. I paid 80 cedis cash for delivery. Abena paid 200 cedis cash towards her old debt.";

export const TRICKIER_QUOTE =
  "I sold 900 cedis in cash. I paid 80 cedis for delivery. Abena paid 200 cedis cash towards her old debt.";

export type SampleEvent = {
  id: string;
  title: string;
  account: string | null;
  amount: string;
  meaning: string;
};

export const clearEvents: SampleEvent[] = [
  {
    id: "sale",
    title: "Cash sale",
    account: "Cash",
    amount: "900.00",
    meaning: "Sale and money received",
  },
  {
    id: "delivery",
    title: "Delivery",
    account: "Cash",
    amount: "-80.00",
    meaning: "Payment for delivery",
  },
  {
    id: "debt",
    title: "Payment from Abena",
    account: "Cash",
    amount: "200.00",
    meaning: "Payment of an old balance",
  },
];

export function trickierEvents(account: "Cash" | "MoMo" | null): SampleEvent[] {
  return [
    clearEvents[0],
    {
      ...clearEvents[1],
      account,
      meaning: "Payment for delivery",
    },
    clearEvents[2],
  ];
}

export function sampleTotals(events: SampleEvent[]) {
  const received = events
    .map((event) => event.amount)
    .filter((amount) => D(amount).gt(0));
  const paid = events
    .map((event) => event.amount)
    .filter((amount) => D(amount).lt(0))
    .map((amount) => D(amount).abs().toFixed(2));
  const receivedTotal = sum(received);
  const paidTotal = sum(paid);
  return {
    sales: "900.00",
    debtSettlement: "200.00",
    received: receivedTotal,
    paid: paidTotal,
    net: D(receivedTotal).minus(paidTotal).toFixed(2),
  };
}

export type StoryDemo = {
  revealed: boolean;
  mode: "clear" | "trickier";
  account: "Cash" | "MoMo" | null;
};

export const initialStoryDemo: StoryDemo = {
  revealed: false,
  mode: "clear",
  account: null,
};

export function nextStoryDemo(
  state: StoryDemo,
  action: "reveal" | "missing" | "cash" | "momo" | "reset",
): StoryDemo {
  if (action === "reset") return initialStoryDemo;
  if (action === "reveal") return { revealed: true, mode: "clear", account: null };
  if (action === "missing")
    return { revealed: true, mode: "trickier", account: null };
  return {
    revealed: true,
    mode: "trickier",
    account: action === "cash" ? "Cash" : "MoMo",
  };
}

export function storySummaryReady(state: StoryDemo) {
  return state.revealed && (state.mode === "clear" || state.account !== null);
}
