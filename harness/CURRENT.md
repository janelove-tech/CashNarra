# CashNarra current development handoff

Updated: 2026-10-19 — Codex, review findings 6–26
Branch: work/cashnarra-v1
Baseline: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Reconciled starting HEAD: 70d99415a84c779e453c2b475067654ef4cbf9f6
Current HEAD: the commit containing this handoff; resolve with git rev-parse HEAD.
Current phase: 08 — release verification; Phase 09 remains EXTERNAL
Status: INCOMPLETE — review findings 1–23 and 25 are implemented in product code; 24 and 26 stay unmeasured
Verdict: NOT V1 COMPLETE

## Git reconciliation

Resumed at clean `70d9941`. Trust findings 1–4 are in `a3deaae`. Preserve e25f49c, 2900d2b, 21246a5, 7648250, efd6f25, 70d9941 and a3deaae. No fetch or push. Do not redo Phases 00–07 or the 19 October wording, calculation, review and goal-mark commits. Review artifact: `harness/context/08-ui-ux-review-2026-10-19.md`.

## Product change in this commit

Review findings 6–23 and 25 from the 19 October UI review and the additional journeys file are in the product. Clarifications can be answered on the review. Draft backups keep those questions. Closing a voice recording asks before discarding it. Sign-out checks both results before clearing drafts. Auth, first workspace, personal labels, pasted amounts, narration context, goal marks, stories, records, settings and check-in follow the review. A 401 keeps the draft and says sign-in is needed.

Finding 24, measured performance of large workspaces, is NOT RUN. Finding 26, a person using a screen reader, stays EXTERNAL. No certification is claimed.

The previous commit made Today’s story invitation a text field and stated whether transcription is available before recording.

Earlier product facts still in force: percentages come from saved records and need confirmation; recording limit is three minutes and 8 MB; transcription stays off after HTTP 401 `missing_scope`. Do not retry transcription without an audio-capable key. Text remains the fallback.

## Latest evidence

- PASS this turn: 121 unit tests, typecheck, lint, and 27 Edge tests covering journeys, planning, calculation, trust findings, recovery, six-area privacy and keyboard dialog. Not a fresh full `npm run test:e2e`. Injected sign-out failure, a 100-event review, large-workspace timing and a fresh signup email are NOT RUN.
- HISTORICAL PASS: fresh install, text contrast, 200% zoom, database and Supabase integration, and the gpt-6-luna synthetic narration comparison. Do not rerun them only to report progress.
- EXTERNAL: representative consented voice recordings. Rechecked 2026-10-19: `.local/voice-evaluation/manifest.json` is absent. The only audio under `.local` is `.local/voice-smoke/synthetic.wav` and `synthetic.webm`; those are not consent or a speaker corpus. `npm run eval:voice-intake` returned NOT READY and made no provider call. The intake file cap now matches the product limit of three minutes and 8 MB.
- NOT RUN: a person using a screen reader. Scoped contrast measurements are not certification.
- FAIL (historical): development braces advisory. Do not force Next lint to v14.

## Provider and budget boundary

Budget correction from this session's journal inspection: committed/reserved US$0.947507; remaining US$4.052493 at that inspection. Includes the unsuccessful audio smoke reservation, retained conservatively, plus a successful synthetic percentage narration check. Do not use the older US$0.513872 figure below as the current allowance. Both pre-provider audio validation attempts stopped before reservation; the subsequent provider request returned 401 missing_scope. The synthetic percentage check returned the expected deterministic amount with no save. No real user's story was used for those smoke calls. No further transcription retry without an audio-capable key.

The existing cumulative US$5 approval still covers narration and voice. This turn made no provider call and did not change `.local/evaluation/budget.jsonl`. Do not reinitialise the journal. `AI_ENABLED`, `OPENAI_MODEL=gpt-6-luna`, and `LOCAL_AI_BUDGET` may remain in ignored `.env.local` for typed local testing only. Production providers, launch, and voice-quality approval stay off.

## Percentage date correction

A calculated bill is recorded on the activity date inside the named sales period. A later day named only as the payment day is kept as the planned payment, not the expense date. Fully paid balances are left out of “Money still owed.” An already saved record is not rewritten. The review screen shows the calculated amount, ordinary dates and the included records directly. A save that would leave goal marks above the account balance names the account, both amounts and the goal. Open Money Stories periods no longer label that balance as owed on a future month-end; see the product change above.

## Exact next action

Findings 1–23 and 25 are implemented. Do not reopen them unless a test fails. The remaining Phase 08 work is external evidence, not another UI pass:

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A voice runner must share the existing budget with verified audio cost bounds.
2. An audio-capable local API key before any transcription retry. Do not set `VOICE_QUALITY_APPROVED`.
3. A person-led screen-reader pass (finding 26). Keyboard tests are not that pass.
4. Optional measurement of synthetic 100, 1,000 and 5,000 record workspaces (finding 24) before any rendering change. Do not rewrite the ledger for it.

Phase 09 stays in `harness/build/09-external-launch-gates.md` until the user decides.

No database migrations/reset, push or deployment in this turn.

External release work still requires one of these from the user:

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A voice runner must share the existing budget with verified audio cost bounds.
2. An audio-capable local API key before any transcription retry. Do not set `VOICE_QUALITY_APPROVED`.
3. A person-led screen-reader pass, or one specific Phase 09 decision in `harness/build/09-external-launch-gates.md`.

Do not invent consent, spend beyond the remaining allowance, enable production providers, push, deploy, or reset a database.

INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE.
