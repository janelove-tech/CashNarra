# CashNarra current development handoff

Updated: 2026-10-16
Updated by agent: Cursor
Branch: work/cashnarra-v1
Baseline SHA: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Current HEAD: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Current phase: 00 — Baseline, multi-agent harness and CI
Current subtask: Commit Phase 00, then backfill the completion SHA
Status: COMPLETE pending the Phase 00 commit and SHA backfill

## Immediate objective

Commit the harness, CI, and preserved audit file. Do not change product code in that commit. After the SHA is known, record it and start Phase 01.

## Completed in current phase

- Confirmed live `main` matches the audit SHA. No later commits. No `codex/cashnarra-v1-remediation` branch.
- Created `work/cashnarra-v1`.
- Added shared agent rules, goals, plans, phase files, context, and GitHub Actions CI.
- Ran the baseline checks below. No financial behaviour was changed.

## Files changed

- `AGENTS.md`
- `GOALS.md`
- `PLANS.md`
- `.github/workflows/ci.yml`
- `harness/**`
- `docs/Repository Audit Plan 1248pm 16th October.txt` (previously untracked; content not edited)

## Validation already executed

| Command | Result | Notes |
|---|---|---|
| npm ci | PASS | First attempt FAIL: EPERM unlinking `next-swc.win32-x64-msvc.node` while Next dev on port 3100 and `next start` on port 3103 held it. Those CashNarra processes were stopped and `npm ci` then passed. 5 high-severity audit findings were reported and not changed. |
| npm run doctor | PASS | Node 24.21.0. Local Supabase configured. AI and voice disabled. No secrets printed. |
| npm run lint | PASS | Exit 0. Two existing warnings in `src/components/voice-capture.tsx` (ref cleanup, unused `e`). |
| npm run typecheck | PASS | |
| npm test | PASS | 13 files, 64 tests. |
| npm run build | PASS | Next.js 16.4.0. |
| npm run test:db | PASS | Isolated localhost `cashnarra_test` only. |
| npm run test:supabase | PASS | Local API `127.0.0.1:58321` only. Synthetic user written to ignored `.local/auth-test-user.json`. |
| npm run test:e2e | FAIL | 24 passed, 1 failed. `auth.spec.ts` timed out at 5s on “Let’s make sense of your money.” The page still showed “Opening your records…”. Cold dev-server start. |
| npx playwright test tests/e2e/auth.spec.ts | PASS | Immediate rerun, 1 passed in 10.8s. The full-suite failure was the loading race, not a wrong heading. |

## Current worktree state

Harness and CI are uncommitted on `work/cashnarra-v1`. Product source is unchanged from `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92`.

The pre-existing Next dev server on port 3100 and production server on port 3103 were stopped so `npm ci` could replace the locked SWC binary. Playwright started a temporary dev server for browser tests and exited.

## Known incomplete or broken work

`credit_expense` is not implemented. That is Phase 01.

The auth browser test can fail on a cold server because the loading heading stays up longer than the 5 second expect. The rerun passed. Do not treat that as a product regression from Phase 00.

`npm audit` reported 5 high-severity issues after `npm ci`. They were not patched in this phase.

## Material decisions made

- Branch is `work/cashnarra-v1`.
- Voice is required in V1, quality-gated, and uses the typed narration pipeline. It must not post automatically.
- Default CI includes doctor, lint, typecheck, unit tests, disposable Postgres `test:db`, and build. Playwright stays out because it requires Microsoft Edge. Live Supabase CLI and provider evals stay out.
- The forensic audit text file is preserved unchanged.

## Blockers requiring user input

None.

## Exact next action

1. Commit Phase 00.
2. Put that commit SHA in `PLANS.md`, this file, and `harness/build-log.md`.
3. Set the current phase to 01 and implement `credit_expense` plus posting parity, starting from `harness/build/01-financial-semantics.md`.

## Resume commands

```bash
git branch --show-current
git rev-parse HEAD
git status
git diff
npm test
```
