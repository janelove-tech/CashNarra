import "fake-indexeddb/auto";
import { it, expect, vi } from "vitest";
import { draftStorage, clearDrafts, type Draft } from "../src/lib/drafts";
it("separates owners and workspaces and clears drafts on shared-device logout", async () => {
  const d: Draft = {
    ownerId: "a",
    workspaceId: "one",
    text: "Synthetic",
    date: "2026-10-13",
    revision: 2,
    events: [],
    replaceIds: [],
    reason: "",
  };
  await draftStorage("put", "a", "one", d);
  expect(await draftStorage("get", "b", "one")).toBeUndefined();
  expect(await draftStorage("get", "a", "two")).toBeUndefined();
  expect((await draftStorage("get", "a", "one"))?.revision).toBe(2);
  await expect(draftStorage("put", "b", "one", d)).rejects.toThrow();
  await clearDrafts();
  expect(await draftStorage("get", "a", "one")).toBeUndefined();
});
it("rejects delayed older writes without losing the newer draft", async () => {
  const draft: Draft = {
    ownerId: "revision-owner",
    workspaceId: "one",
    text: "Newer reviewed words",
    date: "2026-10-13",
    revision: 5,
    events: [],
    replaceIds: [],
    reason: "",
  };
  await draftStorage("put", draft.ownerId, draft.workspaceId, draft);
  await expect(
    draftStorage("put", draft.ownerId, draft.workspaceId, {
      ...draft,
      revision: 4,
      text: "Old response",
    }),
  ).rejects.toThrow("newer draft");
  expect(
    (await draftStorage("get", draft.ownerId, draft.workspaceId))?.text,
  ).toBe(draft.text);
});
it("rejects aborted device writes and clearing rather than hanging", async () => {
  const original = IDBDatabase.prototype.transaction;
  const spy = vi
    .spyOn(IDBDatabase.prototype, "transaction")
    .mockImplementation(function (
      this: IDBDatabase,
      ...args: Parameters<IDBDatabase["transaction"]>
    ) {
      const tx = original.apply(this, args);
      queueMicrotask(() => tx.abort());
      return tx;
    });
  try {
    await expect(draftStorage("delete", "abort-owner", "one")).rejects.toThrow(
      "Device storage failed",
    );
    await expect(clearDrafts()).rejects.toThrow("Could not clear");
  } finally {
    spy.mockRestore();
  }
});
it("reports blocked storage and closes a connection that opens after rejection", async () => {
  const close = vi.fn();
  const request = {
    result: { close },
    onblocked: null,
    onsuccess: null,
  } as unknown as IDBOpenDBRequest;
  const spy = vi.spyOn(indexedDB, "open").mockImplementation(() => {
    queueMicrotask(() =>
      request.onblocked?.call(
        request,
        new Event("blocked") as IDBVersionChangeEvent,
      ),
    );
    return request;
  });
  try {
    await expect(draftStorage("get", "blocked", "one")).rejects.toThrow(
      "Another tab",
    );
    request.onsuccess?.call(request, new Event("success"));
    expect(close).toHaveBeenCalledOnce();
  } finally {
    spy.mockRestore();
  }
});
