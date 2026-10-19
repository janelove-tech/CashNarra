import { expect, it } from "vitest";
import { emptyWorkspace, event } from "../src/domain/fixture";
import { applyBatch, report } from "../src/domain/ledger";
import {
  periodBounds,
  readingDate,
  storyWindow,
} from "../src/domain/periods";

it("formats reading dates and keeps a day distinct from its month", () => {
  expect(readingDate("2026-10-19")).toBe("19 Oct 2026");
  expect(periodBounds("2026-10-19", "day")).toEqual({
    from: "2026-10-19",
    to: "2026-10-19",
  });
  expect(periodBounds("2026-10-19", "month")).toEqual({
    from: "2026-10-01",
    to: "2026-10-31",
  });
  expect(periodBounds("2026-10-13", "week")).toEqual({
    from: "2026-10-12",
    to: "2026-10-18",
  });
});

it("describes an open month through today and leaves the month-end date unused", () => {
  const view = storyWindow("2026-10-19", "month", "2026-10-19");
  expect(view).toMatchObject({
    status: "so-far",
    from: "2026-10-01",
    to: "2026-10-19",
    nominalTo: "2026-10-31",
    futureFrom: "2026-10-20",
    futureTo: "2026-10-31",
    heading: "October so far · through 19 Oct 2026",
    oweLabel: "You owe · through 19 Oct 2026",
  });
  expect(view.oweLabel).not.toContain("31 Oct");
  expect(storyWindow("2026-10-19", "week", "2026-10-19").heading).toBe(
    "This week so far · through 19 Oct 2026",
  );
});

it("keeps a finished month on its real end date and marks a future period as not arrived", () => {
  expect(storyWindow("2026-09-15", "month", "2026-10-19")).toMatchObject({
    status: "closed",
    from: "2026-09-01",
    to: "2026-09-30",
    oweLabel: "You owe on 30 Sep 2026",
    futureFrom: null,
  });
  expect(storyWindow("2026-11-02", "month", "2026-10-19")).toMatchObject({
    status: "ahead",
    from: null,
    to: null,
    oweLabel: null,
    heading: "1 Nov 2026 – 30 Nov 2026 · these dates have not arrived",
  });
});

it("keeps a future-dated bill out of the October-so-far figures", () => {
  let w = emptyWorkspace("owner", "Shop", "Business");
  w.accounts.push({
    id: "cash",
    name: "Cash",
    type: "Cash",
    currency: "GHS",
    opening: "1000.00",
    openingDate: "2026-10-01",
  });
  w = applyBatch(w, {
    requestId: "future",
    revision: 0,
    expectedVersion: 0,
    source: "Synthetic",
    replaceIds: [],
    reason: "",
    allowDuplicates: true,
    events: [
      event("expense", "10.00", "Fuel", "cash", { date: "2026-10-19" }),
      event("credit_expense", "40.00", "Later repair", null, {
        party: "Kofi",
        date: "2026-10-25",
      }),
    ],
  });
  const view = storyWindow("2026-10-19", "month", "2026-10-19");
  const included = report(w, view.from!, view.to!);
  const nominal = report(w, view.nominalFrom, view.nominalTo);
  expect(included.paid).toBe("10.00");
  expect(included.userOwes).toBe("0.00");
  expect(included.records.map((record) => record.date)).toEqual(["2026-10-19"]);
  expect(nominal.userOwes).toBe("40.00");
  expect(
    w.records.some(
      (record) =>
        !record.removed &&
        record.date >= view.futureFrom! &&
        record.date <= view.futureTo!,
    ),
  ).toBe(true);
});
