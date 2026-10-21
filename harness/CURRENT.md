# CashNarra current development handoff

Updated: 2026-10-21 — Cursor, publish the working branch
Branch: work/cashnarra-v1
Baseline: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Reconciled starting HEAD: 70d99415a84c779e453c2b475067654ef4cbf9f6
Current HEAD: the commit containing this handoff; resolve with git rev-parse HEAD.
Current phase: 08 — release verification; Phase 09 remains EXTERNAL
Status: INCOMPLETE — review findings 1–23 and 25 are implemented in product code; 24 and 26 stay unmeasured
Verdict: NOT V1 COMPLETE

## Git reconciliation

Resumed at clean `70d9941`. Trust findings 1–4 are in `a3deaae`. Preserve e25f49c, 2900d2b, 21246a5, 7648250, efd6f25, 70d9941 and a3deaae. On 2026-10-21 the user asked for GitHub to match this branch. Do not redo Phases 00–07 or the 19 October wording, calculation, review and goal-mark commits. Review artifact: `harness/context/08-ui-ux-review-2026-10-19.md`.

## Visual work

Money Stories cover amounts use the direction colors again: received blue, paid apricot, and net follows that sign. Today’s story field sits above the balance figures. Sign-in and account creation stop waiting if the local account service does not answer. Goals, settings, the public sample, Records, and Accounts edits remain. The logo mark stays violet and the CashNarra name stays ink. The activity PDF stays the two-page designed report. Both are locked in `AGENTS.md`. Review asks whether to create a missing account or balance and then attaches the draft record to it. Export asks whether the file is for this workspace, another of the user’s workspaces, or all of them. All means one file each. The ledgers are not combined, and the open workspace does not change. The same dialog asks which dates: today, this week, this month, this year, or a specified day or range. It opens on the dates already on screen. Open periods run through today.

## Product change in the last commit

A business workspace can review profit or loss for the Money Stories period. The review first shows the costs already in the records and asks whether those are complete. Yes calculates profit from those records. No asks only for a cost that is not already recorded. Stock and equipment purchases stay out of the result unless the user adds the part that was used. A positive extra figure needs a note. The estimate is not saved and does not post a journal. Personal workspaces do not offer it. The ordinary cash report still returns profit as null.

The previous commit implemented review findings 6–23 and 25.

Finding 24, measured performance of large workspaces, is NOT RUN. Finding 26, a person using a screen reader, stays EXTERNAL. No certification is claimed.

The previous commit made Today’s story invitation a text field and stated whether transcription is available before recording.

Earlier product facts still in force: percentages come from saved records and need confirmation; recording limit is three minutes and 8 MB; transcription stays off after HTTP 401 `missing_scope`. Do not retry transcription without an audio-capable key. Text remains the fallback.

## Latest evidence

- PASS this turn: local auth health returned 200. A wrong sign-in left “Please wait…” and showed “Invalid login credentials” with the button back on “Sign in”. A new local account opened the first-workspace screen. “Show password” and “Forgot password?” have a 20px gap. Not a fresh full `npm run test:e2e`.
- HISTORICAL PASS this redesign: profit-or-loss unit tests, typecheck, lint, and the sample business story Edge test. The reviewed result was GH₵1,920.00 after a GH₵400.00 cost of goods sold, with stock of GH₵700.00 kept out of that cost.
- HISTORICAL PASS: fresh install, text contrast, 200% zoom, database and Supabase integration, and the gpt-6-luna synthetic narration comparison. Do not rerun them only to report progress.
- EXTERNAL: representative consented voice recordings. Rechecked 2026-10-19: `.local/voice-evaluation/manifest.json` is absent. The only audio under `.local` is `.local/voice-smoke/synthetic.wav` and `synthetic.webm`; those are not consent or a speaker corpus. `npm run eval:voice-intake` returned NOT READY and made no provider call. The intake file cap now matches the product limit of three minutes and 8 MB.
- NOT RUN: a person using a screen reader. Scoped contrast measurements are not certification.
- FAIL (historical): development braces advisory. Do not force Next lint to v14.

## Provider and budget boundary

Budget correction from this session's journal inspection: committed/reserved US$0.947507; remaining US$4.052493 at that inspection. Includes the unsuccessful audio smoke reservation, retained conservatively, plus a successful synthetic percentage narration check. Do not use the older US$0.513872 figure below as the current allowance. Both pre-provider audio validation attempts stopped before reservation; the subsequent provider request returned 401 missing_scope. The synthetic percentage check returned the expected deterministic amount with no save. No real user's story was used for those smoke calls. No further transcription retry without an audio-capable key.

The cumulative testing approval is now US$10, raised on 2026-10-20. The journal header records that ceiling. Every earlier reserve and usage line was kept. At that update the journal held US$1.803120. Later failed story calls kept further reservations. Do not reinitialise the journal. `AI_ENABLED`, `OPENAI_MODEL=gpt-6-luna`, and `LOCAL_AI_BUDGET` may remain in ignored `.env.local` for typed local testing only. The dev server must use the system certificate store (`scripts/dev.mjs`). On 2026-10-21 a short synthetic story reached the provider and returned HTTP 429 `credit_balance_exhausted`. The local journal is not the provider account balance. Do not retry story processing until that account has credit. Production providers, launch, and voice-quality approval stay off.

## Percentage date correction

A calculated bill is recorded on the activity date inside the named sales period. A later day named only as the payment day is kept as the planned payment, not the expense date. Fully paid balances are left out of “Money still owed.” An already saved record is not rewritten. The review screen shows the calculated amount, ordinary dates and the included records directly. A save that would leave goal marks above the account balance names the account, both amounts and the goal. Open Money Stories periods no longer label that balance as owed on a future month-end; see the product change above.

## Device cleanup — 2026-10-20

Removed leftover caches and duplicate copies. Kept the running app, `.local/demo`, `.local/evaluation/budget.jsonl`, voice-smoke audio, zoom evidence, both in-repo design kits, and the local Supabase database volumes. The merged audit is `CashNarra_Elite_UX_Audit_COMPLETE_with_Exports_2026-10-19.md` plus `CashNarra_Redesign_Decision_Brief.md`. The earlier timestamped brag snapshot and video render scratch are gone from the working tree and are still recoverable from git until that deletion is committed. `.next` stayed because the dev server on port 3100 is using it.

## Exact next action

The approved 19 October redesign now includes the public sample, account screen, Records, Accounts, Money Stories, goals, and grouped settings. Do not reopen findings 1–23 or 25 unless a test fails. Do not restart Phase 08. This work is uncommitted.

Sign-in responds again. Do not reset the local database. The story field is above the balances, and the Money Stories figures are colored again. The transactions CSV is one 11-column activity list. The Excel workbook has Overview, Transactions, Accounts and Obligations, styled like the specimen, without record or source IDs. The transactions CSV still carries those IDs because it is the import file. The activity PDF now follows the revised two-page report: dark summary card, colored activity table, account position, cash-movement cards, and the limits box. It uses the workspace’s recorded figures. Export now asks which records and which dates. The date choices are today, this week, this month, this year, or a specified day or range. A person with one workspace is told that, and the other workspace choices stay unavailable. The user asked on 2026-10-21 for GitHub to carry this work.

The remaining Phase 08 release work is still external evidence:

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A voice runner must share the existing budget with verified audio cost bounds.
2. An audio-capable local API key before any transcription retry. Do not set `VOICE_QUALITY_APPROVED`.
3. A person-led screen-reader pass (finding 26). Keyboard tests are not that pass.
4. Optional measurement of synthetic 100, 1,000 and 5,000 record workspaces (finding 24) before any rendering change. Do not rewrite the ledger for it.

Phase 09 stays in `harness/build/09-external-launch-gates.md` until the user decides.

No database migrations, reset, or production deployment. The 2026-10-21 request was only to publish this branch.

External release work still requires one of these from the user:

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A voice runner must share the existing budget with verified audio cost bounds.
2. An audio-capable local API key before any transcription retry. Do not set `VOICE_QUALITY_APPROVED`.
3. A person-led screen-reader pass, or one specific Phase 09 decision in `harness/build/09-external-launch-gates.md`.

Do not invent consent, spend beyond the remaining allowance, enable production providers, push, deploy, or reset a database.

INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE.
