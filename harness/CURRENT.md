# CashNarra current development handoff

Updated: 2026-10-19 — Codex, trust findings and Today composer
Branch: work/cashnarra-v1
Baseline: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Reconciled starting HEAD: 70d99415a84c779e453c2b475067654ef4cbf9f6
Current HEAD: the commit containing this handoff; resolve with git rev-parse HEAD.
Current phase: 08 — release verification; Phase 09 remains EXTERNAL
Status: INCOMPLETE — trust findings 1–5 implemented; findings 6–14 and representative voice remain open
Verdict: NOT V1 COMPLETE

## Git reconciliation

Resumed at clean `70d9941`. Trust findings 1–4 are in `a3deaae`. Preserve e25f49c, 2900d2b, 21246a5, 7648250, efd6f25, 70d9941 and a3deaae. No fetch or push. Do not redo Phases 00–07 or the 19 October wording, calculation, review and goal-mark commits. Review artifact: `harness/context/08-ui-ux-review-2026-10-19.md`.

## Product change in this commit

- Today’s story invitation is a text field. The words carry into the story editor. Voice stays beside that field. The screen says whether transcription is available before recording starts. Transcription is not invented when it is off.

The previous commit separated Today’s day from Money Stories, labelled an open period through today, kept the save receipt on the completed action, and made percentage labels include other income.

Earlier product facts still in force: percentages come from saved records and need confirmation; recording limit is three minutes and 8 MB; transcription stays off after HTTP 401 `missing_scope`. Do not retry transcription without an audio-capable key. Text remains the fallback.

## Latest evidence

- PASS this turn: the Today composer browser test, the four trust browser tests, a 320px layout check, and the manual-review and clarification journeys. Unit tests were not rerun after the composer-only change. The prior commit’s 118 unit tests, typecheck and 22 Edge tests still cover findings 1–4. Not a fresh full `npm run test:e2e`.
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

Findings 1–5 from `harness/context/08-ui-ux-review-2026-10-19.md` are implemented. Next buildable unit is finding 6: answer a missing account, and an uncertain unpaid amount, in place. Offer the account choices without opening the full record form. Keep direct editing available. Preserve reviewed edits when a save fails. Then finding 7: “Put towards this goal” and “Take off this goal”, both with positive amounts, showing how much is available to mark. Do not imply a bank transfer. Confirm against current code before editing. Use synthetic tests. Representative recordings are not a blocker.

No database migrations/reset, push or deployment in this turn.

External release work still requires one of these from the user:

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A voice runner must share the existing budget with verified audio cost bounds.
2. An audio-capable local API key before any transcription retry. Do not set `VOICE_QUALITY_APPROVED`.
3. A person-led screen-reader pass, or one specific Phase 09 decision in `harness/build/09-external-launch-gates.md`.

Do not invent consent, spend beyond the remaining allowance, enable production providers, push, deploy, or reset a database.

INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE.
