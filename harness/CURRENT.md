# CashNarra current development handoff

Updated: 2026-10-21 — Claude Code, fresh UI and UX pass (after Cursor, publish the working branch)
Branch: work/cashnarra-v1
Baseline: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Reconciled starting HEAD: 70d99415a84c779e453c2b475067654ef4cbf9f6
Current HEAD: the commit containing this handoff; resolve with git rev-parse HEAD.
Current phase: 08 — release verification; Phase 09 remains EXTERNAL
Status: INCOMPLETE — review findings 1–23 and 25 are implemented in product code; 24 and 26 stay unmeasured
Verdict: NOT V1 COMPLETE

## Fresh UI and UX pass — 2026-10-21 (Claude Code)

The owner's master prompt authorised an independent UI/UX review and implementation on top of the reported Cursor screens. It is implemented and inspected in the running app; the decisions are in `docs/ux/UI_DESIGN_RECORD_2026-10-21.md` and the checks in the build log entry of the same name. Every screen names itself in the header, story progress shows only on the story screens, Today keeps the main action inside the first phone screen, Records groups people into People owe you and You owe, the review folds the create forms away and pins only Save N records, Explore what-if compares the recorded pace with the tried amount, Settings has an Account section, and Subscription uses rows. The two typecheck failures are repaired narrowly; `npm run typecheck`, `npm run lint`, `npm test` (208), the Edge browser suite except the two Supabase-backed specs (57 passed) and `npm run build` pass; the Supabase-backed auth and recovery specs are NOT RUN because that local stack was not running. Four browser tests were aligned with copy that earlier uncommitted work had already changed. No journal, hold, pause, price, provider or database change. Phase 08 stays incomplete; the screen-reader session, live recording, real phone keyboard and timing checks stay NOT RUN.

## Reader price, plans, and what-if — 2026-10-21

The one synthetic story check already succeeded and was not repeated. A later story reached the reader and was held because CashNarra refused to price ordinary Luna usage. Published standard rates now cover short context through 272,000 input tokens, including cached input, and the long-context rates above that. The 8,000-token figure is only the local hold for an ordinary story. That uncertain attempt was not sent again. Its exposure stays in the journal. The unpriced pause is closed, so a different story can be read. Fresh journal read after that close, with no new provider call: 164 calls, 14 unsettled, US$6.057663 committed, ceiling US$20. The new unsettled line is the US$0.425431 exposure. The earlier 13 holds were not released.

Free and Plus both show US dollars first. Free is $0 / month (GH₵0.00). Plus is $0.99 / month (≈ GH₵11.50), with $2.00 crossed out. Choose Plus opens a review and does not charge. Explore what-if is on each goal. Money Stories amounts stay on one line and wrap onto another row when they do not fit. The subscription screen shows real workspace counts and says story, voice, and report use is not counted yet. Paid renewal, cancellation, and a three-workspace downgrade are rules with tests. They do not charge or change this Free account. Settings, the story editor, and zero-value bars were tightened. A stored usage counter and a live payment provider are still absent.

## Public landing — 2026-10-21

The public page follows the chosen landing pass in `docs/ux/CASHNARRA_FINAL_HANDOFF.md`. Try an example is the main action and moves to See the records. The three records and the money summary stay hidden until that control is used. A missing delivery account asks Cash or MoMo before the summary. Reset returns the story to that hidden state. The fictional goal is separate: GH₵1,500.00 remains, about 5 months at GH₵300 and about 3 months at GH₵500. The invitation reuses the public catalogue. Start free opens account creation. Choose Plus opens the existing review and does not start Plus. These examples do not sign anyone in, save a record, write browser storage, or call a provider. The later recovery, counter, payment, and owner-console work was not started.

## App screens — 2026-10-21

Today keeps the workspace and date, and the story box is headed “What happened with your money?” The date sits with that story. Understand my story is the main action and stays off until there are words or a draft to finish. Tell your story still opens the fuller page, including Draft backup, without sending the words to be read again. Voice stays in the same entry. A day with no records says so, and does not present GH₵0.00 as money movement. Review says “Check these N records”, keeps the original words open, and puts Change beside a proposed row. Save uses the real count. Money Stories says Money in, Money out, then Net movement, and says that is not profit. Each goal shows Target, Set aside, and Remaining. Explore what-if shows the recorded pace beside Try a different amount and does not change the records. Delete original stories is in its own Data and privacy section. Pricing, Plan and usage, and the landing page were left as they were. No provider call, payment, journal change, or database migration.

## Exact next action

The landing page and the app screens stay as reported, now with the 21 October Claude UI pass on top; do not restart either pass. Do not start recovery, live usage counters, payments, the owner console, or Phase 09. The Groq key and the Free-plan confirmation are already saved. Do not ask for them again.

The prepared packet is `harness/context/08-remaining-checks.md`. The canonical handoff is `docs/ux/CASHNARRA_FINAL_HANDOFF.md`, including section 0.5.

The owner consented on 21 October 2026 to one clip of the prepared sentence, a Free Groq transcription, editable words, no saved record, no paid story reading, and no automatic resend. The local recording had to be deleted immediately, and no later than 22 October 2026 at 23:59 GMT. The clip was spoken by the computer, not by a person. `whisper-large-v3-turbo` returned: “I sold 500 cedis for cash. Ama has not paid the 100 cedis she owes. I moved 200 cedis from cash to Momo.” The 500, 100, 200, the name Ama, “has not paid”, and Cash to MoMo all survived. Nothing was saved, and the story reader was not called. The audio files were deleted in the same run. The OpenAI journal stayed at 42,217 bytes. Groq capacity recorded a Free settle with payable US$0 and a reference of 125 micros, which was not taken from the US$20 journal. This one computer-spoken clip is not accent evidence. The five-speaker intake is still NOT READY. Do not record or send this sentence again.

A person using a screen reader has a written task and has not done it. Finding 24 has a blank measurement sheet. The phase file has no pass or fail time, so none was invented. No 100, 1,000, or 5,000 record timing was taken.

The empty day was checked without deleting the sample. On 12 October 2026 the fictional Today screen said there were no records and did not show GH₵0.00 as that day’s movement. 13 October still showed a cedi amount.

UI-01 through UI-11 and UI-14 through UI-18 stay the reported Edge passes for the scenarios already named. Edited-screen lint stayed PASS. UI-12 and UI-13 stay HISTORICAL PASS and were not rerun. LP-01 through LP-15 stay as previously recorded. A real phone keyboard and field loading speed stay NOT RUN. Live stop and transcription stay NOT RUN.

Full typecheck now PASSES. The two failures named earlier (`scripts/lib/evaluation-budget.ts` reading `id` from a union that includes the approval line, and `scripts/lib/story-attempt.ts` passing `string | null` as the reservation id) were repaired narrowly on 21 October by the Claude UI pass, without touching the journal or its semantics.

The next action is a person completing the screen-reader task in `harness/context/08-remaining-checks.md`. The large-workspace timing stays optional. Do not send this voice clip again. Phase 08 stays incomplete. Phase 09 stays external.

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

Historical journal readings, kept only as dated observations: US$0.513872 was already superseded on 2026-10-20; a later inspection that day showed US$0.947507 committed or reserved against the old US$5 ceiling; the ceiling was then raised to US$10 with every reserve and usage line kept, and the journal held US$1.803120 at that edit. On 2026-10-21, before this repair, a one-line synthetic story reached the provider and returned HTTP 429 `credit_balance_exhausted`. Failed clicks had kept full-context holds of US$0.425431 each. A read of the same journal during this repair, after the new event types were added and before any release, still parsed: 162 calls, 13 unsettled, US$5.631999 committed or held. Those 13 holds were not released. The journal does not record which of them were certificate failures, billing refusals, or uncertain timeouts, so none was given a zero-cost release. Do not reinitialise the journal and do not quote any of these figures as a live balance. The live total is `.local/evaluation/budget.jsonl`.

The local story path now reserves the gpt-6-luna short-context envelope, US$0.004, instead of the old model's full context. A proved certificate failure, a billing or authentication refusal, or a daily-allowance stop releases that hold. A timeout or a generic connection error keeps it. Billing, authentication, an unexpected model, and usage that still cannot be priced open `.local/evaluation/provider-pause.json`. The old credit pause was resolved, and the later unpriced pause is also closed. See the 21 October reader-price section. While a pause is open, another story click does not call the reader. The same draft reuses a stored interpretation. A changed draft or a changed account or balance does not. The dev server still uses `scripts/dev.mjs`. Production providers, launch, and voice-quality approval stay off. No provider invoice was reconciled.

Transcription is a separate adapter and stays off. Groq `whisper-large-v3-turbo` is the priced candidate at US$0.04 per audio hour, and `whisper-large-v3` is the accuracy alternative at US$0.111 per audio hour, both with a 10-second minimum. The pilot policy is free-only. Dispatch needs an operator plan record for that Groq organization; a missing, inconsistent, or Developer record does not send audio. A local label cannot keep an upgraded organization free. A confirmed Free success records capacity and a reference cost in `.local/evaluation/groq-capacity.jsonl`, with payable audio spend at US$0. It does not append to `budget.jsonl` and it does not rewrite the thirteen historical holds. That capacity file is a local lock, not a hosted quota manager and not Groq's own balance. HTTP 429 is a temporary stop and is not a paid fallback. A timeout stays uncertain and is not sent again. HTTP 400 `blocked_api_access` pauses only Groq. A Groq pause is `.local/evaluation/groq-pause.json`. It is not present. Do not create `.local/evaluation/groq-plan.json` until an operator has verified the organization. Do not delete the OpenAI pause to try transcription. A Groq transcript would not restore Luna interpretation while that pause remains. The local recorder still allows 8 MB; a hosted function body stops at 4.5 MB, so hosted voice is not enabled. The voice scorer and fictional cases make no provider call. Consented recordings and the live Groq comparison are NOT RUN. Offline tests are not evidence of a Free entitlement or of transcription accuracy.

## Percentage date correction

A calculated bill is recorded on the activity date inside the named sales period. A later day named only as the payment day is kept as the planned payment, not the expense date. Fully paid balances are left out of “Money still owed.” An already saved record is not rewritten. The review screen shows the calculated amount, ordinary dates and the included records directly. A save that would leave goal marks above the account balance names the account, both amounts and the goal. Open Money Stories periods no longer label that balance as owed on a future month-end; see the product change above.

## Device cleanup — 2026-10-20

Removed leftover caches and duplicate copies. Kept the running app, `.local/demo`, `.local/evaluation/budget.jsonl`, voice-smoke audio, zoom evidence, both in-repo design kits, and the local Supabase database volumes. The merged audit is `CashNarra_Elite_UX_Audit_COMPLETE_with_Exports_2026-10-19.md` plus `CashNarra_Redesign_Decision_Brief.md`. The earlier timestamped brag snapshot and video render scratch are gone from the working tree and are still recoverable from git until that deletion is committed. `.next` stayed because the dev server on port 3100 is using it.

## Customer plans — finished comparison, voice not activated — 2026-10-21

`/pricing` shows the finished Free and Plus comparison. Free is GH₵0 a month. Plus is $0.99 a month, with the standard $2.00 crossed out and the 20 October 2026 cedi estimate beside it. Both cards list their records, workspaces, AI stories, voice notes, and report packs, including 500 AI stories a month on Plus. Checkout, webhooks, and payments stay off. Choose Plus does not start a payment. Unlimited stays off the public page and `/api/billing/plans`. A direct purchase returns 403. Campaign dates stay unconfigured. The 10-call daily guard stays in the owner console only.

Voice is on for this computer only. The owner saved a Groq key and confirmed on 21 October 2026 that the Personal organization, Default Project, is on the Free plan. That confirmation is `.local/evaluation/groq-plan.json`. The limits shown for whisper-large-v3-turbo match the local free guard: 20 requests a minute, 2,000 a day, 7,200 audio seconds an hour, and 28,800 a day. `VOICE_ENABLED` and `LOCAL_VOICE_TESTING` are on. `VOICE_QUALITY_APPROVED` stays false. Checkout stays off. Customer recordings remain one minute. The OpenAI pause, the US$10 journal, and the thirteen historical holds were not changed. No recording has been sent.

Plan & usage remains an account screen. Its sample is labelled Example usage. The usage screen can still say voice is not available while the switch is off.


The approved 19 October redesign now includes the public sample, account screen, Records, Accounts, Money Stories, goals, and grouped settings. The pricing page shows Free and Plus in US dollars first. Checkout stays off. Local voice can turn a recording into words. One bounded story check succeeded. A later story is still an unresolved exposure, and the unpriced pause that followed it is closed. Do not set `VOICE_QUALITY_APPROVED`. Do not reopen findings 1–23 or 25 unless a test fails. Do not restart Phase 08. Cursor's work and the Claude UI pass were committed together on 21 October 2026; see the build log entry "Verification, reconciliation and commit". Nothing was pushed.

Sign-in responds again. Do not reset the local database. The story field is above the balances, and the Money Stories figures are colored again. The transactions CSV is one 11-column activity list. The Excel workbook has Overview, Transactions, Accounts and Obligations, styled like the specimen, without record or source IDs. The transactions CSV still carries those IDs because it is the import file. The activity PDF now follows the revised two-page report: dark summary card, colored activity table, account position, cash-movement cards, and the limits box. It uses the workspace’s recorded figures. Export now asks which records and which dates. The date choices are today, this week, this month, this year, or a specified day or range. A person with one workspace is told that, and the other workspace choices stay unavailable. The user asked on 2026-10-21 for GitHub to carry this work.

The remaining Phase 08 release work is still external evidence. The cost repair in the provider section is local accounting. It does not finish Phase 08. The exact next action at the top of this file replaces the request to ask for the Groq key again. The key and the Free-plan confirmation are already saved. The clip in the prepared packet still needs its own consent before any send.

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A Free pilot needs a verified organization record and must not deduct its reference cost from the US$10 journal. A paid runner needs a separate authorized Groq budget.
2. The local Groq key and Free-plan confirmation are saved. Do not set `VOICE_QUALITY_APPROVED`. A real clip is still a separate, deliberate test.
3. A person-led screen-reader pass (finding 26). Keyboard tests are not that pass.
4. Optional measurement of synthetic 100, 1,000 and 5,000 record workspaces (finding 24) before any rendering change. Do not rewrite the ledger for it.

One bounded check on 21 October 2026 read a synthetic sentence, settled US$0.000233, and saved no financial record. The OpenAI billing pause from 10:54 UTC that day is marked resolved. A later real story was held as unpriced at 16:52 UTC. That pause is now closed because standard Luna usage can be priced. The story itself was not sent again, and its US$0.425431 exposure remains. The journal header is still the 20 October US$10 approval. A later approval line raises the active ceiling to US$20. The latest read is 164 calls, 14 unsettled, US$6.057663 committed. Checkout stays off. Voice quality approval stays off.

Phase 09 stays in `harness/build/09-external-launch-gates.md` until the user decides.

No database migrations, reset, or production deployment. The 2026-10-21 request was only to publish this branch. The later cost-and-processing repair is uncommitted. It does not authorise another provider call.

External release work still requires one of these from the user:

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A Free pilot needs a verified organization record and must not deduct its reference cost from the US$10 journal. A paid runner needs a separate authorized Groq budget.
2. The local Groq key and Free-plan confirmation are saved. Do not set `VOICE_QUALITY_APPROVED`. A real clip is still a separate, deliberate test.
3. A person-led screen-reader pass, or one specific Phase 09 decision in `harness/build/09-external-launch-gates.md`.

Do not invent consent, spend beyond the remaining allowance, enable production providers, push, deploy, or reset a database.

INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE.
