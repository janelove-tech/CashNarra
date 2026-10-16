import { Client } from "pg";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import {
  emptyWorkspace,
  event,
  fixture,
  fixtureEvents,
} from "../src/domain/fixture";
import { applyBatch, ledger } from "../src/domain/ledger";
import { prepareMove } from "../src/domain/move";
import { updatePlanning } from "../src/domain/planning";
import type { Workspace } from "../src/domain/types";
const url =
  process.env.TEST_DATABASE_URL ||
  "postgres://postgres:synthetic-test-only@127.0.0.1:55432/cashnarra_test";
const parsed = new URL(url);
if (
  !["127.0.0.1", "localhost"].includes(parsed.hostname) ||
  parsed.pathname !== "/cashnarra_test"
)
  throw new Error(
    "Refusing database reset: use isolated localhost cashnarra_test only.",
  );
const a = "11111111-1111-4111-8111-111111111111",
  b = "22222222-2222-4222-8222-222222222222";
const db = new Client({ connectionString: url });
await db.connect();
try {
  await db.query(
    `drop schema public cascade; create schema public; create schema if not exists auth; create table if not exists auth.users(id uuid primary key); insert into auth.users values('${a}'),('${b}') on conflict do nothing; do $$ begin if not exists(select from pg_roles where rolname='authenticated') then create role authenticated nologin;end if;if not exists(select from pg_roles where rolname='anon') then create role anon nologin;end if;end $$; create or replace function auth.uid() returns uuid language sql stable as 'select nullif(current_setting(''request.jwt.claim.sub'',true),'''')::uuid'; grant usage on schema public,auth to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;`,
  );
  for (const file of (await readdir("supabase/migrations")).sort())
    await db.query(await readFile("supabase/migrations/" + file, "utf8"));
  const user = async (c: Client, id: string) => {
    await c.query("set role authenticated");
    await c.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  };
  await user(db, a);
  const security = await db.query("select proname, proconfig from pg_proc where pronamespace='public'::regnamespace and prosecdef");
  assert.equal(security.rows.length, 5);
  for (const fn of security.rows) assert.ok(fn.proconfig.includes('search_path=""'), fn.proname);
  assert.equal((await db.query("select has_schema_privilege('authenticated','public','CREATE') as allowed")).rows[0].allowed, false);
  assert.equal((await db.query("select has_function_privilege('anon','public.commit_workspace(jsonb,integer,text,text,jsonb)','EXECUTE') as allowed")).rows[0].allowed, false);
  assert.equal((await db.query("select has_function_privilege('authenticated','public.minimize_expired_sources()','EXECUTE') as allowed")).rows[0].allowed, false);
  await assert.rejects(() => db.query("create table public.untrusted_shadow(id integer)"), /permission denied/);
  const commit = async (
    c: Client,
    w: Workspace,
    expected: number,
    key: string,
  ) => {
    const hash = createHash("sha256").update(JSON.stringify(w)).digest("hex");
    return (
      await c.query("select public.commit_workspace($1,$2,$3,$4,$5) r", [
        w,
        expected,
        key,
        hash,
        "[]",
      ])
    ).rows[0].r;
  };
  let w = emptyWorkspace(a);
  await commit(db, w, -1, "create");
  const f = fixture(a, false);
  w = { ...f, id: w.id, version: 1 };
  await commit(db, w, 0, "openings");
  w = applyBatch(w, {
    requestId: "fixture",
    revision: 0,
    expectedVersion: w.version,
    source: "Synthetic batch",
    events: fixtureEvents(),
    replaceIds: [],
    reason: "",
    allowDuplicates: true,
  });
  await commit(db, w, 1, "batch");
  const receipt = await commit(db, w, 1, "batch");
  assert.equal(receipt.version, 2);
  assert.equal(
    (await db.query("select sum(amount)::text n from public.journal_lines"))
      .rows[0].n,
    "0.00",
  );
  const posted = (
    await db.query(
      "select record_id, account_key, amount::text as amount from public.journal_lines",
    )
  ).rows
    .map((row) => ({
      recordId: row.record_id,
      account: row.account_key,
      amount: row.amount,
    }))
    .sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));
  const expected = ledger(w)
    .map((line) => ({ ...line }))
    .sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));
  assert.deepEqual(posted, expected);
  assert.equal(
    (
      await db.query(
        "select sum(amount)::text n from public.journal_lines where account_key='sales'",
      )
    ).rows[0].n,
    "-2400.00",
  );
  await assert.rejects(
    () => commit(db, { ...w, name: "conflict" }, 1, "batch"),
    /different contents/,
  );
  await assert.rejects(
    () => commit(db, { ...w, version: 3 }, 0, "stale"),
    /Stale/,
  );
  const bad = structuredClone(w);
  bad.version++;
  bad.records.push({
    ...event("expense", "10.00", "Foreign", "missing"),
    sourceId: w.sources[0].id,
    version: 1,
    removed: false,
    replaces: null,
  });
  await assert.rejects(
    () => commit(db, bad, 2, "bad"),
    /Invalid workspace account/,
  );
  assert.equal(
    (await db.query("select version from public.workspaces")).rows[0].version,
    2,
  );
  await user(db, b);
  assert.equal((await db.query("select * from public.workspaces")).rowCount, 0);
  assert.equal(
    (await db.query("select * from public.journal_lines")).rowCount,
    0,
  );
  assert.equal(
    (await db.query("select * from public.save_receipts")).rowCount,
    0,
  );
  await assert.rejects(
    () => commit(db, { ...w, ownerId: b, version: 3 }, 2, "intrude"),
    /unavailable/,
  );
  await assert.rejects(
    () => db.query("delete from public.workspaces"),
    /permission denied/,
  );
  await user(db, a);
  const c2 = new Client({ connectionString: url });
  await c2.connect();
  await user(c2, a);
  const settle = (amount: string) =>
    applyBatch(w, {
      requestId: "settle",
      revision: 0,
      expectedVersion: w.version,
      events: [
        event("receivable_payment", amount, "Abena payment", "momo", {
          obligationId: "opening-abena",
        }),
      ],
      replaceIds: [],
      source: "Synthetic settlement",
      reason: "",
      allowDuplicates: true,
    });
  const results = await Promise.allSettled([
    commit(db, settle("300.00"), 2, "concurrent-a"),
    commit(c2, settle("300.00"), 2, "concurrent-b"),
  ]);
  assert.equal(results.filter((x) => x.status === "fulfilled").length, 1);
  await c2.end();
  const current = (await db.query("select state from public.workspaces"))
    .rows[0].state as Workspace;
  const badSettle = structuredClone(current);
  badSettle.version++;
  badSettle.records.push({
    ...event("receivable_payment", "200.00", "Too much", "momo", {
      obligationId: "opening-abena",
    }),
    sourceId: w.sources[0].id,
    version: 1,
    removed: false,
    replaces: null,
  });
  await assert.rejects(
    () => commit(db, badSettle, current.version, "overpayment"),
    /exceeds remaining/,
  );
  const old = current.records.find((r) => r.kind === "expense")!;
  const corrected = applyBatch(current, {
    requestId: "fix",
    revision: 0,
    expectedVersion: current.version,
    events: [{ ...old, id: crypto.randomUUID(), amount: "100.00" }],
    replaceIds: [old.id],
    source: "Correction",
    reason: "Entered incorrectly",
    allowDuplicates: true,
  });
  await commit(db, corrected, current.version, "correction");
  let latest = (
    await db.query("select state from public.workspaces where id=$1", [w.id])
  ).rows[0].state as Workspace;
  let destination = emptyWorkspace(a, "Personal", "Personal");
  await commit(db, destination, -1, "destination");
  destination.accounts = [
    {
      id: "personal-cash",
      name: "Cash",
      type: "Cash",
      currency: "GHS",
      opening: "500.00",
      openingDate: "2026-10-01",
    },
  ];
  destination.version = 1;
  await commit(db, destination, 0, "destination-account");
  const moving = latest.records.find(
    (r) => r.kind === "expense" && !r.removed,
  )!;
  const move = prepareMove(
    latest,
    destination,
    moving.id,
    "personal-cash",
    "Incorrect workspace",
    "move",
  );
  const moveRpc = (from: Workspace, to: Workspace, key: string) =>
    db.query("select public.move_workspace_record($1,$2,$3,$4,$5)", [
      from,
      to,
      key,
      "a".repeat(64),
      move.recordId,
    ]);
  const invalidDestination = structuredClone(move.to);
  invalidDestination.records.at(-1)!.accountId = "foreign";
  await assert.rejects(
    () => moveRpc(move.from, invalidDestination, "move-bad"),
    /Invalid workspace account/,
  );
  assert.equal(
    (
      await db.query("select version from public.workspaces where id=$1", [
        w.id,
      ])
    ).rows[0].version,
    latest.version,
  );
  await moveRpc(move.from, move.to, "move-valid");
  await moveRpc(move.from, move.to, "move-valid");
  latest = (
    await db.query("select state from public.workspaces where id=$1", [w.id])
  ).rows[0].state;
  const forged = structuredClone(latest);
  forged.version++;
  forged.sources[0].text = "Rewritten evidence";
  await assert.rejects(
    () => commit(db, forged, latest.version, "forged-source"),
    /Source history/,
  );
  const malformed = structuredClone(latest);
  const invalidCalendar = structuredClone(latest);
  const duplicateAllocation = structuredClone(latest);
  duplicateAllocation.version++;
  duplicateAllocation.goals[0].allocations.push({
    ...duplicateAllocation.goals[0].allocations[0],
  });
  await assert.rejects(
    () =>
      commit(db, duplicateAllocation, latest.version, "duplicate-allocation"),
    /valid_goal_allocations/,
  );
  invalidCalendar.version++;
  invalidCalendar.checkins.push({
    date: "2026-02-30",
    at: new Date().toISOString(),
    kind: "review",
  });
  await assert.rejects(
    () => commit(db, invalidCalendar, latest.version, "invalid-calendar"),
    /valid_workspace_calendar/,
  );
  const missingSource = structuredClone(latest);
  missingSource.version++;
  missingSource.records.push({
    ...missingSource.records.find((r) => !r.removed)!,
    id: crypto.randomUUID(),
    sourceId: "missing-source",
  });
  await assert.rejects(
    () => commit(db, missingSource, latest.version, "missing-source"),
    /valid_source_references/,
  );
  const duplicateSource = structuredClone(latest);
  duplicateSource.version++;
  duplicateSource.sources.push({ ...duplicateSource.sources[0] });
  await assert.rejects(
    () => commit(db, duplicateSource, latest.version, "duplicate-source"),
    /valid_source_references/,
  );
  malformed.version++;
  (malformed.records[0] as unknown as Record<string, unknown>).removed = null;
  await assert.rejects(
    () => commit(db, malformed, latest.version, "null-removal"),
    /Invalid record structure|Financial history/,
  );
  const opening = structuredClone(latest);
  opening.version++;
  const before = { ...opening.accounts[0] };
  opening.accounts[0].opening = "410.00";
  await assert.rejects(
    () => commit(db, opening, latest.version, "untraced-opening"),
    /Opening correction history/,
  );
  opening.openingHistory = [
    {
      at: new Date().toISOString(),
      reason: "Correct declared amount",
      before,
      after: { ...opening.accounts[0] },
    },
  ];
  await commit(db, opening, latest.version, "traced-opening");
  const minimized = structuredClone(opening);
  minimized.version++;
  minimized.sources = minimized.sources.map((s) => ({ ...s, text: null }));
  await commit(db, minimized, opening.version, "minimize");
  const restored = structuredClone(minimized);
  restored.version++;
  restored.sources[0].text = "Restored personal narration";
  await assert.rejects(
    () => commit(db, restored, minimized.version, "restore"),
    /Source history/,
  );
  const planned = structuredClone(minimized);
  updatePlanning(planned,{action:"checkin",date:"2026-10-12",kind:"rest"},"2026-10-15T12:00:00Z");
  updatePlanning(planned,{action:"goal_edit",goalId:"equipment",name:"Updated equipment",target:"6500.00"});
  updatePlanning(planned,{action:"contact",name:"Kofi",role:"Other"});
  updatePlanning(planned,{action:"debt_date",recordId:"opening-abena",date:"2026-10-30"});
  planned.version++;
  await commit(db,planned,minimized.version,"planning");
  const lostHistory=structuredClone(planned);lostHistory.version++;lostHistory.checkinHistory=[];
  await assert.rejects(()=>commit(db,lostHistory,planned.version,"erase-checkin-history"),/history must be retained/);
  const silentGoalChange=structuredClone(planned);silentGoalChange.version++;silentGoalChange.goals[0].target="7000.00";
  await assert.rejects(()=>commit(db,silentGoalChange,planned.version,"untraced-goal"),/Goal change history/);
  const datedOriginal = planned.records.find(r => r.id === "opening-abena")!;
  const datedCorrection = applyBatch(planned, {
    requestId: "dated-correction", expectedVersion: planned.version,
    revision: 1, source: "Correct opening description", reason: "Clarify description",
    replaceIds: [datedOriginal.id], allowDuplicates: true,
    events: [{ ...datedOriginal, id: "dated-abena-replacement", description: "Abena opening balance clarified" }],
  });
  await commit(db, datedCorrection, planned.version, "dated-correction");
  const persistedDate = await db.query("select state->'debtDates' as dates from public.workspaces where id=$1", [planned.id]);
  assert.equal(persistedDate.rows[0].dates.at(-1).recordId, "dated-abena-replacement");
  assert.equal(persistedDate.rows[0].dates.at(-1).date, "2026-10-30");
  const recheck = structuredClone(datedCorrection);
  updatePlanning(recheck, { action: "goal_unreview", goalId: recheck.goals[0].id, month: "2026-09" });
  recheck.version++;
  await commit(db, recheck, datedCorrection.version, "goal-month-recheck");
  const persistedGoal = await db.query("select state->'goals' as goals from public.workspaces where id=$1", [recheck.id]);
  assert.equal(persistedGoal.rows[0].goals[0].reviewedMonths.includes("2026-09"), false);
  assert.deepEqual(persistedGoal.rows[0].goals[0].allocations, datedCorrection.goals[0].allocations);
  const editedPeople = structuredClone(recheck);
  const personId = editedPeople.contacts![0].id;
  updatePlanning(editedPeople, { action: "contact_edit", contactId: personId, name: "Kofi shop", role: "Other" });
  editedPeople.version++;
  await commit(db, editedPeople, recheck.version, "person-edit");
  const removedPerson = structuredClone(editedPeople);
  updatePlanning(removedPerson, { action: "contact_remove", contactId: personId });
  removedPerson.version++;
  await commit(db, removedPerson, editedPeople.version, "person-remove");
  const savedPeople = await db.query("select state from public.workspaces where id=$1", [removedPerson.id]);
  assert.deepEqual(savedPeople.rows[0].state.contacts, []);
  assert.deepEqual(savedPeople.rows[0].state.records, recheck.records);
  const bill = event(
    "credit_expense",
    "800.00",
    "Electrician repaired the shop",
    null,
    { party: "Kofi Electrician", date: "2026-10-16" },
  );
  const incurred = applyBatch(removedPerson, {
    requestId: "credit-expense",
    revision: 0,
    expectedVersion: removedPerson.version,
    events: [bill],
    replaceIds: [],
    source: "Unpaid operating expense",
    reason: "",
    allowDuplicates: true,
  });
  updatePlanning(incurred, {
    action: "debt_date",
    recordId: bill.id,
    date: "2026-10-23",
  });
  await commit(db, incurred, removedPerson.version, "credit-expense");
  const expenseLines = await db.query(
    "select account_key, amount::text as amount from public.journal_lines where record_id=$1 order by position",
    [bill.id],
  );
  assert.deepEqual(expenseLines.rows, [
    { account_key: "expense", amount: "800.00" },
    { account_key: "payable:" + bill.id, amount: "-800.00" },
  ]);
  const withAccount = structuredClone(incurred);
  withAccount.version++;
  withAccount.records.push({
    ...incurred.records.find((r) => r.id === bill.id)!,
    id: "cash-credit-expense",
    accountId: "bank",
  });
  await assert.rejects(
    () => commit(db, withAccount, incurred.version, "credit-expense-cash"),
    /do not move account money/,
  );
  const settled = applyBatch(incurred, {
    requestId: "pay-electrician",
    revision: 0,
    expectedVersion: incurred.version,
    events: [
      event("payable_payment", "800.00", "Paid the electrician", "bank", {
        obligationId: bill.id,
        party: "Kofi Electrician",
        date: "2026-10-23",
      }),
    ],
    replaceIds: [],
    source: "Payable settlement",
    reason: "",
    allowDuplicates: true,
  });
  await commit(db, settled, incurred.version, "pay-electrician");
  assert.equal(
    (
      await db.query(
        "select coalesce(sum(amount),0)::text n from public.journal_lines where account_key='expense' and record_id=$1",
        [bill.id],
      )
    ).rows[0].n,
    "800.00",
  );
  assert.equal(
    (
      await db.query(
        "select coalesce(sum(amount),0)::text n from public.journal_lines where account_key=$1",
        ["payable:" + bill.id],
      )
    ).rows[0].n,
    "0.00",
  );
  await user(db, b);
  await assert.rejects(
    () => moveRpc(move.from, move.to, "cross-user-move"),
    /unavailable/,
  );
  await assert.rejects(
    () => db.query("select public.minimize_expired_sources()"),
    /permission denied/,
  );
  console.log(
    "PASS: real PostgreSQL balanced opening/transaction journals, baseline, atomic rollback, idempotency/conflicts, stale and concurrent settlements, corrections, two-workspace move rollback/retry, source/opening history, minimisation and cross-user table/RPC isolation.",
  );
} finally {
  await db.end();
}
