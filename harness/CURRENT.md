# CashNarra current development handoff

Updated: 2026-10-19 — Codex, live UI/UX review and concurrent-work reconciliation
Branch: work/cashnarra-v1
Baseline: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Reconciled starting HEAD: 76482506f90012dceebd4a368b53dcf6b4323f3c
Current HEAD: the commit containing this handoff; resolve with git rev-parse HEAD.
Current phase: 08 — release verification; Phase 09 remains EXTERNAL
Status: INCOMPLETE — UI/UX findings recorded; representative voice and manual accessibility evidence EXTERNAL
Verdict: NOT V1 COMPLETE

## Git reconciliation

Latest reconciliation: HEAD efd6f25, clean product tree before adding this review. Cursor committed the interrupted wording/calculation/voice work and subsequent improvements while this session was active. Preserve e25f49c, 2900d2b, 21246a5, 7648250 and efd6f25. The new user request is a live UI/UX assessment, not another release-prerequisite audit. Review artifact: `harness/context/08-ui-ux-review-2026-10-19.md`.

Resumed at clean `7648250`, eighteen commits ahead of the local origin reference. No uncommitted product work. No fetch or push. Do not redo Phases 00–07, the historical release checks, or the 19 October wording, calculation, review and goal-mark commits.

## Product change in this commit

- Goal, account, report, and privacy wording now uses everyday language. Detailed estimate assumptions stay under “How we worked this out.” Decorative icons are hidden from assistive technology so they are not announced as “svg”.
- A percentage of sales or money received is calculated by the application from saved records. Sales and money received stay separate. The user must confirm the included records before the amount can be saved. The model must not invent the total.
- Recording limit is three minutes and 8 MB. Transcription stays off. `LOCAL_VOICE_TESTING` remains false in `.env.example`. An earlier local attempt returned HTTP 401 `missing_scope`; do not repeat that call until the ignored local key has audio permission. Voice still requires editable transcript, review, and deterministic save. Text remains the fallback.

## Latest evidence

- PASS this turn: 111 unit tests, typecheck, lint, and 42 Edge browser tests, including the new percentage confirmation journey.
- HISTORICAL PASS: fresh install, text contrast, 200% zoom, database and Supabase integration, and the gpt-6-luna synthetic narration comparison. Do not rerun them only to report progress.
- EXTERNAL: representative consented voice recordings. Rechecked 2026-10-19: `.local/voice-evaluation/manifest.json` is absent. The only audio under `.local` is `.local/voice-smoke/synthetic.wav` and `synthetic.webm`; those are not consent or a speaker corpus. `npm run eval:voice-intake` returned NOT READY and made no provider call. The intake file cap now matches the product limit of three minutes and 8 MB.
- NOT RUN: a person using a screen reader. Scoped contrast measurements are not certification.
- FAIL (historical): development braces advisory. Do not force Next lint to v14.

## Provider and budget boundary

Budget correction from this session's journal inspection: committed/reserved US$0.947507; remaining US$4.052493 at that inspection. Includes the unsuccessful audio smoke reservation, retained conservatively, plus a successful synthetic percentage narration check. Do not use the older US$0.513872 figure below as the current allowance. Both pre-provider audio validation attempts stopped before reservation; the subsequent provider request returned 401 missing_scope. The synthetic percentage check returned the expected deterministic amount with no save. No real user's story was used for those smoke calls. No further transcription retry without an audio-capable key.

The existing cumulative US$5 approval still covers narration and voice. Last recorded committed/reserved amount before this turn: US$0.513872; remaining US$4.486128, including the uncertain initial reservation. This turn made no provider call and did not change `.local/evaluation/budget.jsonl`. Do not reinitialise the journal. `AI_ENABLED`, `OPENAI_MODEL=gpt-6-luna`, and `LOCAL_AI_BUDGET` may remain in ignored `.env.local` for typed local testing only. Production providers, launch, and voice-quality approval stay off.

## Percentage date correction

A calculated bill is recorded on the activity date inside the named sales period. A later day named only as the payment day is kept as the planned payment, not the expense date. Money Stories labels “You owe” with the period end date and lists balances recorded after that date. Fully paid balances are left out of “Money still owed.” An already saved record is not rewritten. The review screen shows the calculated amount, ordinary dates and the included records directly; a second heading, dropdown and “Needs review” placeholder are no longer the confirmation. A save that would leave goal marks above the account balance names the account, both amounts and the goal.

## Exact next action

Latest user request: reanalyse UI/UX, principles, satisfaction, vision and language. Assessment is recorded in `harness/context/08-ui-ux-review-2026-10-19.md`. Next buildable implementation unit is its four trust findings: separate Today/report period state, avoid future-endpoint claims in current-period reports, scope save feedback to the completed action, and make calculation basis labels accurately include other income. Confirm against current code before editing, preserve all Cursor work, and use synthetic tests. These findings are not implemented by this documentation checkpoint. Representative recordings are not a blocker to those local fixes. The longer ordered interaction backlog and acceptance criteria are in the review.

This session's verification: 111 unit checks and Node 24 build/lint/type checks passed before later Cursor commits. Full browser run had 40/42 passes; the two test-harness issues were fixed and a focused three-test rerun passed (real local auth, calculation confirmation, demo wording). Treat those as revision-scoped evidence, not a fresh full PASS for efd6f25. Cursor's later evidence remains separately recorded above. No database migrations/reset, push or deployment.

External release work still requires one of these from the user:

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A voice runner must share the existing budget with verified audio cost bounds.
2. An audio-capable local API key before any transcription retry. Do not set `VOICE_QUALITY_APPROVED`.
3. A person-led screen-reader pass, or one specific Phase 09 decision in `harness/build/09-external-launch-gates.md`.

Do not invent consent, spend beyond the remaining allowance, enable production providers, push, deploy, or reset a database.

INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE.
