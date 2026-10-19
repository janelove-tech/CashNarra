import { it, expect } from "vitest";
import { fixture } from "../src/domain/fixture";
import { updatePlanning, debtDate } from "../src/domain/planning";
import { draftBackup, restoreBackup } from "../src/lib/draft-backup";
import type { Draft } from "../src/lib/drafts";
import { applyBatch } from "../src/domain/ledger";
import { forecast } from "../src/domain/goals";
it("normalises duplicate names and avoids unchanged planning history", () => {
  const w = fixture();
  updatePlanning(w, { action: "contact", name: "Kofi Shop", role: "Other" });
  expect(() =>
    updatePlanning(w, {
      action: "contact",
      name: "Ｋｏｆｉ   Shop",
      role: "Other",
    }),
  ).toThrow("already");
  updatePlanning(w, {
    action: "goal_edit",
    goalId: "equipment",
    name: w.goals[0].name,
    target: "6000",
  });
  expect(w.goalChanges ?? []).toHaveLength(0);
  updatePlanning(w, {
    action: "debt_date",
    recordId: "opening-abena",
    date: "2026-10-30",
  });
  updatePlanning(w, {
    action: "debt_date",
    recordId: "opening-abena",
    date: "2026-10-30",
  });
  expect(w.debtDates).toHaveLength(1);
  updatePlanning(w, {
    action: "debt_date",
    recordId: "opening-abena",
    date: null,
  });
  expect(debtDate(w, "opening-abena")).toBeNull();
  expect(w.debtDates).toHaveLength(2);
});
it("does not assign a new payment date to a fully settled balance", () => {
  const w = fixture();
  w.records.find((r) => r.id === "opening-abena")!.amount = "200.00";
  expect(() =>
    updatePlanning(w, {
      action: "debt_date",
      recordId: "opening-abena",
      date: "2026-10-30",
    }),
  ).toThrow("fully paid");
  expect(w.debtDates ?? []).toHaveLength(0);
});
it("edits and removes saved people without rewriting debts or financial history", () => {
  const w = fixture();
  const records = structuredClone(w.records);
  updatePlanning(w, { action: "contact", name: "Abena", role: "Customer" });
  const id = w.contacts![0].id;
  updatePlanning(w, {
    action: "contact_edit",
    contactId: id,
    name: "Abena shop",
    role: "Other",
  });
  expect(w.contacts![0].name).toBe("Abena shop");
  expect(() =>
    updatePlanning(w, { action: "contact_remove", contactId: "foreign" }),
  ).toThrow("no longer");
  updatePlanning(w, { action: "contact_remove", contactId: id });
  expect(w.contacts).toEqual([]);
  expect(w.records).toEqual(records);
});
it("explains invalid planning fields without exposing validation internals", () => {
  const w = fixture();
  expect(() =>
    updatePlanning(w, { action: "contact", name: " ", role: "Other" }),
  ).toThrow("Enter a name");
  expect(() =>
    updatePlanning(w, {
      action: "goal_unreview",
      goalId: "equipment",
      month: "2026-13",
    }),
  ).toThrow("Choose a valid month");
  expect(w.contacts ?? []).toHaveLength(0);
});
it("withdraws an uncertain month from estimates without changing assigned money", () => {
  const w = fixture();
  const goal = w.goals[0];
  const allocations = structuredClone(goal.allocations);
  expect(forecast(goal, "2026-10-13").count).toBe(12);
  updatePlanning(w, {
    action: "goal_unreview",
    goalId: goal.id,
    month: "2026-09",
  });
  expect(forecast(goal, "2026-10-13").count).toBeNull();
  expect(goal.allocations).toEqual(allocations);
  expect(() =>
    updatePlanning(w, {
      action: "goal_unreview",
      goalId: "foreign",
      month: "2026-09",
    }),
  ).toThrow("unavailable");
});
it("carries payment dates across an unambiguous debt correction without rewriting history", () => {
  const w = fixture();
  updatePlanning(w, {
    action: "debt_date",
    recordId: "opening-abena",
    date: "2026-10-30",
  });
  const original = w.records.find((r) => r.id === "opening-abena")!;
  const batch = {
    requestId: "date-correction",
    expectedVersion: w.version,
    revision: 1,
    source: "Correct old balance",
    reason: "Correct amount",
    replaceIds: [original.id],
    events: [{ ...original, id: "corrected-abena", amount: "600.00" }],
    allowDuplicates: true,
  };
  const corrected = applyBatch(w, batch);
  expect(debtDate(corrected, "corrected-abena")).toBe("2026-10-30");
  expect(debtDate(corrected, original.id)).toBe("2026-10-30");
  expect(w.debtDates).toHaveLength(1);
  expect(corrected.debtDates).toHaveLength(2);
  expect(() =>
    applyBatch(w, {
      ...batch,
      events: [{ ...batch.events[0], date: "2026-11-01" }],
    }),
  ).toThrow("payment date is before");
  expect(w.records.find((r) => r.id === original.id)?.removed).toBe(false);
});
it("keeps previous check-in choices and rejects a false no-activity claim", () => {
  const w = fixture();
  updatePlanning(
    w,
    { action: "checkin", date: "2026-10-12", kind: "rest" },
    "2026-10-15T12:00:00Z",
  );
  expect(w.checkins.find((c) => c.date === "2026-10-12")?.kind).toBe("rest");
  expect(
    w.checkinHistory?.filter((c) => c.date === "2026-10-12").map((c) => c.kind),
  ).toEqual(["review", "rest"]);
  expect(() =>
    updatePlanning(w, {
      action: "checkin",
      date: "2026-10-13",
      kind: "no_activity",
    }),
  ).toThrow("saved records");
});
it("saves reusable people, explicit preferences and dated obligations", () => {
  const w = fixture();
  updatePlanning(w, { action: "contact", name: " Kofi ", role: "Other" });
  expect(w.contacts?.[0].name).toBe("Kofi");
  expect(() =>
    updatePlanning(w, { action: "contact", name: "kofi", role: "Other" }),
  ).toThrow("already");
  updatePlanning(w, {
    action: "preferences",
    showRhythm: false,
    reminder: true,
  });
  expect(w.preferences?.reminder).toBe(true);
  updatePlanning(w, {
    action: "debt_date",
    recordId: "opening-abena",
    date: "2026-10-30",
  });
  expect(debtDate(w, "opening-abena")).toBe("2026-10-30");
  expect(() =>
    updatePlanning(w, {
      action: "debt_date",
      recordId: "foreign",
      date: "2026-10-30",
    }),
  ).toThrow();
});
it("goal editing retains assignments and records the old target", () => {
  const w = fixture(),
    before = JSON.stringify(w.goals[0].allocations);
  updatePlanning(w, {
    action: "goal_edit",
    goalId: "equipment",
    name: "Shop equipment",
    target: "6500.00",
  });
  expect(w.goalChanges?.[0].before.target).toBe("6000.00");
  expect(w.goals[0].target).toBe("6500.00");
  expect(JSON.stringify(w.goals[0].allocations)).toBe(before);
});
it("backs up reviewed edits and original pending receipt identity with strict ownership", () => {
  const w = fixture();
  const draft: Draft = {
    ownerId: w.ownerId,
    workspaceId: w.id,
    text: "Words",
    date: "2026-10-13",
    revision: 7,
    events: [{ ...w.records[3], id: "new", amount: "901.23" }],
    replaceIds: [w.records[3].id],
    reason: "Correct amount",
    pendingRequest: {
      action: "batch",
      workspaceId: w.id,
      key: "original-request:7",
      expectedVersion: w.version,
      batch: {
        requestId: "review",
        revision: 7,
        expectedVersion: w.version,
        source: "Words",
        events: [{ ...w.records[3], id: "new", amount: "901.23" }],
        replaceIds: [w.records[3].id],
        reason: "Correct amount",
        allowDuplicates: false,
      },
    },
  };
  const text = draftBackup(draft),
    restored = restoreBackup(text, w.ownerId, w.id);
  expect(restored.events[0].amount).toBe("901.23");
  expect(restored.pendingRequest).toEqual(draft.pendingRequest);
  expect(restored.replaceIds).toEqual(draft.replaceIds);
  expect(() => restoreBackup(text, "other", w.id)).toThrow("same account");
  expect(() => restoreBackup(text, w.ownerId, "other")).toThrow("same account");
  const changed = structuredClone(draft);
  changed.text = "Different source words";
  expect(() => restoreBackup(draftBackup(changed), w.ownerId, w.id)).toThrow(
    "do not match",
  );
  changed.text = draft.text;
  changed.events[0].amount = "1.00";
  expect(() => restoreBackup(draftBackup(changed), w.ownerId, w.id)).toThrow(
    "do not match",
  );
  changed.pendingRequest = {
    action: "batch",
    workspaceId: w.id,
    key: "original-request:7",
    expectedVersion: w.version,
  };
  expect(() => restoreBackup(draftBackup(changed), w.ownerId, w.id)).toThrow(
    "missing part",
  );
});
it("keeps unanswered questions in a new draft and marks an old backup for review", () => {
  const w = fixture();
  const draft: Draft = {
    ownerId: w.ownerId,
    workspaceId: w.id,
    text: "Was this paid or still owed?",
    date: "2026-10-13",
    revision: 2,
    events: [{ ...w.records[0], id: "proposal" }],
    replaceIds: [],
    reason: "",
    questions: [
      {
        recordId: "proposal",
        field: "kind",
        question: "Was this paid or still owed?",
      },
    ],
  };
  const restored = restoreBackup(draftBackup(draft), w.ownerId, w.id);
  expect(restored.questions?.[0]?.question).toBe(
    "Was this paid or still owed?",
  );
  expect(restored.questionsPreserved).toBe(true);
  const older = JSON.parse(draftBackup(draft));
  older.format = "cashnarra-draft-1";
  delete older.draft.questions;
  delete older.draft.calculations;
  const legacy = restoreBackup(JSON.stringify(older), w.ownerId, w.id);
  expect(legacy.questions).toEqual([]);
  expect(legacy.questionsPreserved).toBe(false);
});
