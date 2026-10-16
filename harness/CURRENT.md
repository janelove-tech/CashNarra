# CashNarra current development handoff

Updated: 2026-10-16
Updated by agent: Cursor
Branch: work/cashnarra-v1
Baseline SHA: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Current HEAD: 01d4f4f opens Phase 02. Phase 01 code is 6cb30d92075ce5eead15c6ee4e337b41f01c1886.
If the latest commit only changes `PLANS.md` and `harness/`, do not redo Phase 01.
Current phase: 02 — AI and general narration quality
Current subtask: Recheck the OpenAI model, then add the synthetic evaluation corpus
Status: IN PROGRESS

INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE

## Immediate objective

Start Phase 02 without a live provider call unless an opt-in key is already configured. Do not change financial posting again unless a narration test proves a posting bug.

## Completed in current phase

- Recorded the gaps already visible in `src/server/ai.ts`. No interpretation code has been changed in this phase.

## Files changed

- `PLANS.md`
- `harness/CURRENT.md`
- `harness/build-log.md`
- `harness/context/02-narration-gaps.md`

## Validation already executed

| Command | Result | Notes |
|---|---|---|
| npm test | HISTORICAL PASS | 85 tests at Phase 01 commit `6cb30d9`. Not rerun for this handoff-only update. |
| npm run test:db | HISTORICAL PASS | Passed at Phase 01. Not rerun for this handoff-only update. |
| npm run lint | HISTORICAL PASS | Passed at Phase 01. |
| npm run typecheck | HISTORICAL PASS | Passed at Phase 01. |
| npm run build | NOT RUN | Last PASS was Phase 00, before credit_expense. |
| Live narration evaluation | EXTERNAL | AI is disabled. No provider call in this programme. |

## Current worktree state

Phase 01 is committed. This handoff update is the only uncommitted work when the next session starts, until it is committed.

## Known incomplete or broken work

Phase 02 has not changed interpretation behaviour.

Local `schema_migrations` still lists only `202610130001` through `202610130003`. Do not run `supabase migration up` or `supabase db reset` on `cashnarra-development`. The credit-expense function is already installed there. 18 workspaces were preserved.

The local synthetic Ama Works workspace contains the browser-test electrician record.

Cold-start `auth.spec.ts` can exceed the 5 second expect while the heading is “Opening your records…”. A rerun passed in Phase 00.

## Material decisions made

- Phase 01 event name is `credit_expense`.
- Phase 02 must recheck official OpenAI docs before replacing `gpt-4.1-mini-2025-04-14`.
- Keep `OPENAI_MODEL` configurable.

## Blockers requiring user input

None. A live model evaluation needs an existing opt-in key and remains EXTERNAL if that key is absent.

## Exact next action

1. Read `harness/build/02-ai-and-narration.md` and `harness/context/02-narration-gaps.md`.
2. Check current official OpenAI model and deprecation docs for `gpt-4.1-mini-2025-04-14`. Keep the default only if it is still supported. Do not call the API while checking docs.
3. Add a synthetic, reviewable narration corpus covering the cases in the phase file, including `credit_expense` and missing person/account/amount. No real customer data.
4. Fix the deterministic contract gaps: pass workspace type into interpretation, and decide application-owned proposal IDs. Distinguish model uncertainty from validation failure.
5. Run `npm test`, `npm run lint`, and `npm run typecheck`. Run `npm run build` because it was not rerun after Phase 01.

## Resume commands

```bash
git branch --show-current
git rev-parse HEAD
git status
git diff
npm test
```
