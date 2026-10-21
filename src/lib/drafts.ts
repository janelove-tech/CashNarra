import type { StoryCalculation } from "@/domain/story-calculation";
import type { EventInput } from "@/domain/types";
export type DraftQuestion = {
  recordId: string;
  field:
    | "accountId"
    | "toAccountId"
    | "party"
    | "kind"
    | "amount"
    | "obligationId"
    | "date";
  question: string;
  suggestion?: string | null;
};
export type Draft = {
  ownerId: string;
  workspaceId: string;
  text: string;
  date: string;
  revision: number;
  events: EventInput[];
  replaceIds: string[];
  reason: string;
  pendingRequest?: unknown;
  questions?: DraftQuestion[];
  calculations?: StoryCalculation[];
  /** False for backups saved before questions were kept. */
  questionsPreserved?: boolean;
};
const dbName = "cashnarra-drafts-v1";
async function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let blocked = false;
    const r = indexedDB.open(dbName, 1);
    r.onupgradeneeded = () => r.result.createObjectStore("drafts");
    r.onerror = () =>
      reject(
        new Error(
          "Could not keep this draft on this device. Copy your text before leaving.",
        ),
      );
    r.onblocked = () => {
      blocked = true;
      reject(
        new Error(
          "Another tab is blocking device storage. Close other CashNarra tabs, then retry. Keep your text here meanwhile.",
        ),
      );
    };
    r.onsuccess = () => {
      if (blocked) {
        r.result.close();
        return;
      }
      r.result.onversionchange = () => r.result.close();
      resolve(r.result);
    };
  });
}
export async function draftStorage(
  action: "get" | "put" | "delete",
  owner: string,
  workspace: string,
  value?: Draft,
): Promise<Draft | undefined> {
  if (value && (value.ownerId !== owner || value.workspaceId !== workspace))
    throw new Error("Draft ownership mismatch.");
  if (
    action === "put" &&
    (!value || !Number.isSafeInteger(value.revision) || value.revision < 0)
  )
    throw new Error("A valid draft revision is required.");
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
        "drafts",
        action === "get" ? "readonly" : "readwrite",
      ),
      s = tx.objectStore("drafts"),
      key = JSON.stringify([owner, workspace]);
    // Read and write in one transaction so a delayed write cannot replace a newer draft.
    const r = action === "delete" ? s.delete(key) : s.get(key);
    let result: Draft | undefined;
    let failure: Error | undefined;
    r.onsuccess = () => {
      result = action === "get" ? r.result : undefined;
      if (action === "put") {
        if (r.result && r.result.revision > value!.revision) {
          failure = new Error(
            "A newer draft is already on this device. Keep this tab open and recover the newer draft before replacing it.",
          );
          tx.abort();
        } else s.put(value, key);
      }
      if (
        result &&
        (result.ownerId !== owner || result.workspaceId !== workspace)
      ) {
        failure = new Error(
          "Stored draft ownership does not match this workspace.",
        );
        tx.abort();
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onerror = tx.onabort = () => {
      db.close();
      reject(
        failure ??
          new Error(
            "Device storage failed. Your draft remains in this tab. Copy it before leaving.",
          ),
      );
    };
  });
}
export async function clearDrafts() {
  const db = await database();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("drafts", "readwrite");
    tx.objectStore("drafts").clear();
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = tx.onabort = () => {
      db.close();
      reject(
        new Error(
          "Could not clear device drafts. Clear site data before sharing this device.",
        ),
      );
    };
  });
}
