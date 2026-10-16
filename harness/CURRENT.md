# CashNarra current development handoff

Updated: 2026-10-16
Updated by agent: Cursor
Branch: work/cashnarra-v1
Baseline SHA: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Current HEAD: cff81ec46544a10ec2805f44faf2a29560c28bbc
Current phase: 01 — Financial semantics and posting parity
Current subtask: Commit Phase 01, then backfill its SHA
Status: COMPLETE pending the Phase 01 commit and SHA backfill

## Immediate objective

Commit the credit-expense work. Do not include `next-env.d.ts` if the dev server flipped it to `.next/dev/types`. After the commit SHA is known, record it and start Phase 02.

## Completed in current phase

- Added `credit_expense`: debit expense, credit payable, no cash account, person required.
- Later payment stays `payable_payment` and does not create a second expense.
- `credit_purchase` still debits stock.
- Added a TypeScript template test for every event kind.
- Database tests compare the fixture journal with `ledger()` and commit an electrician bill plus settlement.
- Applied migration SQL to local Supabase with `psql`. 18 workspaces remained. Did not reset the database.

## Files changed

- `src/domain/types.ts`
- `src/domain/ledger.ts`
- `src/domain/planning.ts`
- `src/components/record-form.tsx`
- `src/components/ui.tsx`
- `src/components/cashnarra.tsx`
- `src/components/report-trace.tsx`
- `src/server/ai.ts`
- `supabase/migrations/202610160009_credit_expense.sql`
- `tests/posting-parity.test.ts`
- `tests/domain.test.ts`
- `scripts/test-db.ts`
- `PLANS.md`
- `harness/context/01-financial-semantics.md`
- `harness/build/01-financial-semantics.md`

## Validation already executed

| Command | Result | Notes |
|---|---|---|
| npm test | PASS | 14 files, 85 tests. Includes posting templates and the GH₵800 electrician case. |
| npm run test:db | PASS | Disposable `cashnarra_test` only. Fixture journal matched TypeScript. Credit expense and settlement committed. |
| npm run lint | PASS | Exit 0. Same two existing warnings in `src/components/voice-capture.tsx`. |
| npm run typecheck | PASS | |
| npm run build | NOT RUN | Not rerun after Phase 01. Phase 00 build passed before these edits. |
| npm run test:supabase | NOT RUN | Not rerun after the SQL change. |
| npm run test:e2e | NOT RUN | Not rerun. Manual browser check below. |
| Browser manual record | PASS | Synthetic demo. Selected Unpaid operating expense, account cleared, review showed GH₵800, save confirmed. Balances stayed GH₵5,970.00. Money out stayed GH₵930.00. |

## Current worktree state

Phase 01 source is uncommitted on `work/cashnarra-v1`. Phase 00 commit is `cff81ec46544a10ec2805f44faf2a29560c28bbc`.

## Known incomplete or broken work

Local `schema_migrations` only lists migrations `202610130001` through `202610130003`, even though later functions already exist. `supabase migration up` and `supabase db reset` are unsafe on that database.

The synthetic Ama Works workspace used in the browser now contains the electrician record. It is local demo data.

The auth browser test can still time out on a cold server. See the Phase 00 log.

`npm audit` still reports 5 high-severity findings. They were not changed.

## Material decisions made

- Event name: `credit_expense`. Label: “Unpaid operating expense”.
- Payment reuses `payable_payment`. No new settlement kind.
- Reports count the expense when it is incurred. The later cash payment is money out, not a second expense.
- Historical migration `202610130001` was left unchanged. The new migration replaces the function.

## Blockers requiring user input

None.

## Exact next action

1. Commit Phase 01, excluding a dev-server rewrite of `next-env.d.ts`.
2. Record that commit SHA in `PLANS.md`, this file, and `harness/build-log.md`.
3. Start Phase 02 from `harness/build/02-ai-and-narration.md`. Recheck current OpenAI model documentation before changing `OPENAI_MODEL`'s default. Then add the synthetic narration corpus. Do not call the live API without an existing opt-in key.

## Resume commands

```bash
git branch --show-current
git rev-parse HEAD
git status
git diff
npm test
npm run test:db
```
