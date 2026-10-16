import { applyBatch } from "./ledger";
import type { Workspace } from "./types";
export function prepareMove(
  source: Workspace,
  destination: Workspace,
  recordId: string,
  accountId: string,
  reason: string,
  key: string,
) {
  if (source.id === destination.id || source.ownerId !== destination.ownerId)
    throw new Error("Choose another workspace you own.");
  const record = source.records.find((r) => r.id === recordId && !r.removed);
  if (
    !record ||
    ![
      "sale",
      "income",
      "expense",
      "stock",
      "asset",
      "interest",
      "owner_in",
      "owner_out",
    ].includes(record.kind)
  )
    throw new Error(
      "Linked balances and transfers require a coordinated correction. Move an independent record only.",
    );
  if (!reason.trim())
    throw new Error(
      "Explain why this record was filed in the wrong workspace.",
    );
  const batch = {
    requestId: key,
    revision: 0,
    source: `Moved from ${source.name}, record ${record.id}, source ${record.sourceId}. ${record.description}. Original narration remains subject to the source workspace's retention policy.`,
    reason: `Workspace move: ${reason}`,
    allowDuplicates: true,
  };
  const replacement = {
    ...record,
    id: crypto.randomUUID(),
    accountId,
    toAccountId: null,
    obligationId: null,
    groupId: null,
  };
  const from = applyBatch(source, {
    ...batch,
    expectedVersion: source.version,
    events: [],
    replaceIds: [recordId],
  });
  const to = applyBatch(destination, {
    ...batch,
    expectedVersion: destination.version,
    events: [replacement],
    replaceIds: [],
  });
  from.history[from.history.length - 1].reason +=
    ` Destination ${destination.id}, record ${replacement.id}.`;
  return { from, to, recordId: replacement.id };
}
