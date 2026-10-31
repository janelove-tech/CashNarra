import { expect, it } from "vitest";
import { fixture } from "../src/domain/fixture";
import {
  RecordsTabContext,
  RECORDS_CONTEXT_KEY,
  emptyRecordsContext,
} from "../src/lib/records-context";

function storage() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}
const view = () => ({
  ...emptyRecordsContext(),
  search: "Abena",
  filter: "in",
  accountId: "momo",
  range: { from: "2026-10-08", to: "2026-10-14" },
  top: 623,
  recordId: "opening-abena",
});

it("restores the authenticated workspace and its complete Records investigation after a reload", () => {
  const disk = storage(),
    w = fixture("owner");
  const first = new RecordsTabContext(() => disk);
  first.activate("owner", w, [w.id]);
  expect(first.save("owner", w.id, view())).toBe(true);
  const reloaded = new RecordsTabContext(() => disk);
  expect(reloaded.preferredWorkspace("owner", [w.id])).toBe(w.id);
  expect(reloaded.activate("owner", w, [w.id])).toEqual(view());
});

it("keeps workspace searches separate and an old callback cannot switch the active workspace back", () => {
  const disk = storage(),
    a = fixture("owner"),
    b = fixture("owner");
  const tab = new RecordsTabContext(() => disk);
  tab.activate("owner", a, [a.id, b.id]);
  tab.save("owner", a.id, view());
  expect(tab.activate("owner", b, [a.id, b.id])).toEqual(emptyRecordsContext());
  tab.save("owner", b.id, { ...view(), search: "Suppliers" });
  tab.save("owner", a.id, view());
  expect(tab.preferredWorkspace("owner", [a.id, b.id])).toBe(b.id);
  expect(tab.activate("owner", a, [a.id, b.id]).search).toBe("Abena");
  expect(tab.activate("owner", b, [a.id, b.id]).search).toBe("Suppliers");
});

it("does not restore another person's search even if a workspace identifier is reused", () => {
  const disk = storage(),
    w = fixture("first");
  const tab = new RecordsTabContext(() => disk);
  tab.activate("first", w, [w.id]);
  tab.save("first", w.id, view());
  const next = new RecordsTabContext(() => disk);
  expect(next.preferredWorkspace("second", [w.id])).toBe("");
  expect(next.activate("second", { ...w, ownerId: "second" }, [w.id])).toEqual(
    emptyRecordsContext(),
  );
});

it("clears private context on sign-out and rejects stale pagehide writes", () => {
  const disk = storage(),
    w = fixture("owner"),
    tab = new RecordsTabContext(() => disk);
  tab.activate("owner", w, [w.id]);
  tab.save("owner", w.id, view());
  tab.clear();
  expect(tab.save("owner", w.id, view())).toBe(false);
  expect(disk.getItem(RECORDS_CONTEXT_KEY)).toBeNull();
});

it("drops removed accounts, unavailable workspaces and stale record focus", () => {
  const disk = storage(),
    w = fixture("owner"),
    tab = new RecordsTabContext(() => disk);
  tab.activate("owner", w, [w.id]);
  tab.save("owner", w.id, { ...view(), recordId: "removed" });
  const next = new RecordsTabContext(() => disk);
  expect(next.preferredWorkspace("owner", ["another"])).toBe("");
  const restored = next.activate(
    "owner",
    { ...w, accounts: w.accounts.filter((account) => account.id !== "momo") },
    [w.id],
  );
  expect(restored.accountId).toBe("");
  expect(restored.recordId).toBeUndefined();
});

it("validates stored filters, date ranges and reading positions without trusting stored values", () => {
  const disk = storage(),
    w = fixture("owner");
  disk.setItem(
    RECORDS_CONTEXT_KEY,
    JSON.stringify({
      version: 1,
      owner: "owner",
      activeWorkspaceId: w.id,
      entries: [
        {
          workspaceId: w.id,
          context: {
            search: "x".repeat(500),
            filter: "invented",
            range: { from: "2026-02-30", to: "2026-10-14" },
            top: -25,
          },
        },
      ],
    }),
  );
  const restored = new RecordsTabContext(() => disk).activate("owner", w, [
    w.id,
  ]);
  expect(restored.search).toHaveLength(300);
  expect(restored.filter).toBe("all");
  expect(restored.range).toBeNull();
  expect(restored.top).toBe(0);
});

it("falls back to current-tab memory when the browser refuses storage", () => {
  const w = fixture("owner"),
    other = fixture("owner");
  const tab = new RecordsTabContext(() => {
    throw new Error("Storage blocked");
  });
  tab.activate("owner", w, [w.id, other.id]);
  expect(tab.save("owner", w.id, view())).toBe(false);
  tab.activate("owner", other, [w.id, other.id]);
  expect(tab.activate("owner", w, [w.id, other.id]).search).toBe("Abena");
  expect(() => tab.clear()).not.toThrow();
});

it("keeps a bounded set of recent workspace views and discards oversized or malformed data", () => {
  const disk = storage(),
    tab = new RecordsTabContext(() => disk),
    w = fixture("owner");
  const ids = Array.from({ length: 20 }, (_, i) => `workspace-${i}`);
  for (const id of ids) {
    tab.activate("owner", { ...w, id }, ids);
    tab.save("owner", id, view());
  }
  expect(JSON.parse(disk.getItem(RECORDS_CONTEXT_KEY)!).entries).toHaveLength(
    12,
  );
  for (const raw of ["{broken", "x".repeat(40000)]) {
    disk.setItem(RECORDS_CONTEXT_KEY, raw);
    expect(
      new RecordsTabContext(() => disk).activate("owner", w, [w.id]),
    ).toEqual(emptyRecordsContext());
  }
});
