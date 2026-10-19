# CashNarra current development handoff

Updated: 2026-10-19 — Cursor, after the percentage-date correction
Branch: work/cashnarra-v1
Baseline: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Reconciled starting HEAD: 694e2ff7e26850e81cb7fd6164bab164dc037df0
Current HEAD: the commit containing this handoff; resolve with git rev-parse HEAD.
Current phase: 08 — release verification; Phase 09 remains EXTERNAL
Status: EXTERNAL — representative recordings and manual accessibility evidence
Verdict: NOT V1 COMPLETE

## Git reconciliation

Resumed at clean `694e2ff`, fourteen commits ahead of the local origin reference. The worktree held an interrupted product change: everyday goal and report wording, record-backed percentage calculations, and a three-minute recording limit. That work was preserved, finished, tested, and committed here. No fetch or push. Do not redo Phases 00–07 or the historical release checks.

## Product change in this commit

- Goal, account, report, and privacy wording now uses everyday language. Detailed estimate assumptions stay under “How we worked this out.” Decorative icons are hidden from assistive technology so they are not announced as “svg”.
- A percentage of sales or money received is calculated by the application from saved records. Sales and money received stay separate. The user must confirm the included records before the amount can be saved. The model must not invent the total.
- Recording limit is three minutes and 8 MB. Transcription stays off. `LOCAL_VOICE_TESTING` remains false in `.env.example`. An earlier local attempt returned HTTP 401 `missing_scope`; do not repeat that call until the ignored local key has audio permission. Voice still requires editable transcript, review, and deterministic save. Text remains the fallback.

## Latest evidence

- PASS this turn: 111 unit tests, typecheck, lint, and 42 Edge browser tests, including the new percentage confirmation journey.
- HISTORICAL PASS: fresh install, text contrast, 200% zoom, database and Supabase integration, and the gpt-6-luna synthetic narration comparison. Do not rerun them only to report progress.
- EXTERNAL: representative consented voice recordings. `.local/voice-evaluation/manifest.json` is still required before `npm run eval:voice-intake`.
- NOT RUN: a person using a screen reader. Scoped contrast measurements are not certification.
- FAIL (historical): development braces advisory. Do not force Next lint to v14.

## Provider and budget boundary

The existing cumulative US$5 approval still covers narration and voice. Last recorded committed/reserved amount before this turn: US$0.513872; remaining US$4.486128, including the uncertain initial reservation. This turn made no provider call and did not change `.local/evaluation/budget.jsonl`. Do not reinitialise the journal. `AI_ENABLED`, `OPENAI_MODEL=gpt-6-luna`, and `LOCAL_AI_BUDGET` may remain in ignored `.env.local` for typed local testing only. Production providers, launch, and voice-quality approval stay off.

## Percentage date correction

A calculated bill is recorded on the activity date inside the named sales period. A later day named only as the payment day is kept as the planned payment, not the expense date. Money Stories labels “You owe” with the period end date and lists balances recorded after that date. Fully paid balances are left out of “Money still owed.” An already saved record is not rewritten. The review screen shows the calculated amount, ordinary dates and the included records directly; a second heading, dropdown and “Needs review” placeholder are no longer the confirmation.

## Exact next action

Stop for one of these from the user:

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A voice runner must share the existing budget with verified audio cost bounds.
2. An audio-capable local API key before any transcription retry. Do not set `VOICE_QUALITY_APPROVED`.
3. A person-led screen-reader pass, or one specific Phase 09 decision in `harness/build/09-external-launch-gates.md`.

Do not invent consent, spend beyond the remaining allowance, enable production providers, push, deploy, or reset a database.

INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE.
