import { applyBatch, obligations } from "./ledger";
import { D } from "./money";
import type { Batch, Obligation, Workspace } from "./types";

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
