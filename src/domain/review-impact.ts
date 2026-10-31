import { applyBatch, obligations } from "./ledger";
import { D } from "./money";
import type { Batch, EventInput, Obligation, Workspace } from "./types";

export type DraftChanges = Pick<
  Batch,
  "events" | "replaceIds" | "reason" | "allowDuplicates"
>;

/** Amount that can settle this balance after the other valid draft changes. */
export function settlementRemainder(
  w: Workspace,
  draft: DraftChanges,
  editing: Pick<EventInput, "id" | "kind" | "obligationId">,
): string | null {
  if (
    !editing.obligationId ||
    !["receivable_payment", "payable_payment", "loan_principal"].includes(
      editing.kind,
    )
  )
    return null;
  try {
    const others = draft.events.filter((record) => record.id !== editing.id);
    const proposed =
      others.length || draft.replaceIds.length
        ? applyBatch(w, {
            ...draft,
            events: others,
            requestId: "payment-amount-preview",
            revision: 0,
            expectedVersion: w.version,
            source: "Preview of the other proposed changes",
          })
        : w;
    const balance = obligations(proposed).find(
      (item) => item.id === editing.obligationId,
    );
    const direction =
      editing.kind === "receivable_payment" ? "receivable" : "payable";
    const loan = ["loan_received", "opening_loan"].includes(
      proposed.records.find((record) => record.id === editing.obligationId)
        ?.kind ?? "",
    );
    if (direction === "payable" && (editing.kind === "loan_principal") !== loan)
      return null;
    return balance?.direction === direction && D(balance.remaining).gt(0)
      ? balance.remaining
      : null;
  } catch {
    return null;
  }
}

export type ReviewImpact = Pick<Obligation, "id" | "party" | "direction"> & {
  before: string;
  after: string;
};

/** A proposed consequence, using the same validation as Save on a detached copy. */
export function reviewImpacts(w: Workspace, batch: Batch): ReviewImpact[] {
  const before = obligations(w);
  const touched = new Set([
    ...batch.events.flatMap((record) =>
      record.obligationId ? [record.id, record.obligationId] : [record.id],
    ),
    ...batch.replaceIds,
  ]);
  if (!before.some((balance) => touched.has(balance.id))) return [];

  const proposed = applyBatch(w, batch);
  return obligations(proposed).flatMap((balance) => {
    if (!touched.has(balance.id)) return [];
    const original = before.find(
      (item) =>
        item.id === balance.id ||
        proposed.history.some(
          (change) =>
            change.before.id === item.id &&
            change.replacementIds.includes(balance.id),
        ),
    );
    if (!original || D(original.remaining).eq(balance.remaining)) return [];
    return [
      {
        id: balance.id,
        party: balance.party,
        direction: balance.direction,
        before: original.remaining,
        after: balance.remaining,
      },
    ];
  });
}
