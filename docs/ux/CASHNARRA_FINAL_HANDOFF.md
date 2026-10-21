# CashNarra: final UI, UX, landing page, and Cursor handoff

**Combined on 21 October 2026; updated after the owner's app UI completion report. One reference for both research reports, reported implemented UI, remaining checks and known failures.**

This file brings together the complete competitor/UI improvement brief and the landing-page research/specification. It retains the research, screen requirements, chosen copy, fictional examples, commercial decisions, financial safeguards, implementation rules, acceptance cases, and evidence limits. Repeated material is consolidated; the coverage map at the end shows where both reports went.

**The landing and main app UI changes are now reported implemented. Preserve them. The next work is the remaining Phase 08 verification in section 0.5.** Do not restart the UI pass, recovery, live usage counters or payments. Screen-reader use, a consented live voice check and other unverified states remain explicitly open; the project typecheck failures named below were repaired on 21 October 2026 (see 0.6); Phase 09 stays external.

**Use this file instead of giving Cursor two competing instruction files.** Keep the original reports as historical references. No CashNarra application code was changed to create this combined document. No new application, payment, provider, transcription, accessibility, or performance test was run for this consolidation.

## 0. Latest implementation checkpoint — read first

**Current evidence and next action are in section 0.5.** Sections 0.1–0.4 retain the earlier landing checkpoint and the handoff's evolution. Where progress differs, the newer section 0.5 controls. Evidence comes from the owner's supplied Cursor reports; this document update does not independently rerun the app or turn a reported check into a new PASS. The original research, design, commercial decisions and acceptance cases remain the requirements to preserve.

### 0.1 Earlier landing implementation report

| Area | Latest reported result | What to preserve |
| --- | --- | --- |
| Page purpose and entry | The public page walks through Record, Understand and Plan. Try an example is the main action; Start free remains available. | Keep both entry paths and the chosen product promise. Do not restart the landing redesign. |
| Standard story result | See the records reveals the sale, delivery and Abena payment. Money in GH₵1,100.00; money out GH₵80.00; net movement GH₵1,020.00. Sales stay GH₵900.00. Abena's GH₵200 is an old-debt payment, not a new sale. | Preserve exact values, classification and a single summary. Check the initial story visibility as described in 0.3. |
| Missing detail and reset | The missing delivery account blocks the summary until Cash or MoMo is chosen. Reset returns the example to its starting state. | Keep the local clarification and reset paths; do not guess an account. |
| Separate goal | GH₵1,500.00 remaining; about five months at GH₵300/month and three months at GH₵500/month. | Keep the separate fictional assumption; do not alter real goals or imply an affordability guarantee. |
| Example side effects | The report says the examples sign nobody in, save no record and send no story anywhere. | Keep fixed examples local. Where not already evidenced, verify the specific network, microphone and persistent-storage boundaries rather than assuming the summary proves every prohibition. |
| Public pricing | Real public catalogue; Free $0/month (GH₵0.00); Plus $0.99/month, $2.00 crossed out, approximately GH₵11.50 using the 20 October 2026 reference. | Preserve shared pricing and USD-first display. The dated amount is a reported snapshot, not a permanent conversion or proof of refresh/failure handling. |
| Plus action | Choose Plus opens the existing review and says Plus is not started. | Preserve truthful review status. Do not remove it as an availability note: the rejected notes are on the finished public offer, while the review must accurately describe whether a payment/access change occurred. |
| Scope and phase at that landing checkpoint | Phase 08 was incomplete; the app UI, counter and payment work had not started then. The app UI has since been reported implemented in section 0.5. | Use the newer checkpoint for current progress. Phase 08 remains incomplete and Phase 09 external; counters and payments were not started. |

### 0.2 Earlier landing evidence and its limits

Status applies to the named check below, not automatically to every clause of an LP case. **HISTORICAL PASS** means the supplied report says the check passed; it is not a new test by this document's author.

| Check | Status from the supplied report | Coverage and remaining evidence |
| --- | --- | --- |
| Story and goal calculations | HISTORICAL PASS | Reported values agree with LP-04/LP-07. Preserve them; a later change affecting them may justify a focused rerun. |
| Clarification and reset behaviour | HISTORICAL PASS — described as working | Report describes waiting for the account and resetting; inspect existing evidence for no duplicate rows or saved-state claims. |
| Keyboard focus and reduced motion | HISTORICAL PASS | Reported checks cover these parts of LP-03/LP-13. They do not establish screen-reader announcements, all accessible names, zoom or contrast. |
| Responsive layout | HISTORICAL PASS | Report says 320 through 1440 pixels, including a short phone screen. Retain recorded evidence; reconcile exact widths/heights with LP-12 instead of claiming unreported device testing. |
| Signup and Plus routes | HISTORICAL PASS | Reported route checks support LP-08/LP-10. Sign-in mode, browser-back behaviour and every remaining route clause need evidence if not already recorded. |
| Screen-reader use | NOT RUN | Explicitly untested. Test when an appropriate environment is available; do not infer support from keyboard focus alone. |
| A real phone keyboard | NOT RUN | Explicitly untested. Desktop resizing does not establish mobile keyboard behaviour. The fixed public examples have no text entry; check any relevant route/task under the existing scope. |
| Field loading speed | EXTERNAL — NOT RUN | Explicitly untested. Requires real field evidence; local lab checks may help but do not prove field Web Vitals. Do not deploy or add analytics solely to obtain this. |
| Per-visit FX/cache freshness and rate failure | NOT RUN — not established by this report | A displayed 20 October rate is honest dating, but does not establish refresh, fallback behaviour, or reserved layout space. Inspect existing evidence and close LP-14 gaps with controlled conditions. |
| Remaining content/security clauses | NOT RUN — not established by this report | Inspect evidence for initial story visibility, anonymous Unlimited exclusion, full amount readability, FAQ/link truth, and the complete LP-03/KEEP-04 side-effect boundaries. Do not presume these failed. |
| Relevant type/lint/build, final diff and protected consumers | NOT RUN — not established by this report | Read existing results before rerunning. The owner's summary does not name these LP-15 outcomes, branch/HEAD, or full diff evidence. |

### 0.3 Remaining landing acceptance checks — preserve this record

The following retains the unfinished landing evidence from the earlier task. The newer app completion report and exact next action are in section 0.5. Carry these LP states forward without promoting them to new PASS, repeating the landing implementation or expanding the current work into service integration.

1. Read the current repository checkpoint, recorded build/test evidence, active rules and actual relevant files. Confirm which checkout/build the report describes; preserve later local changes. Do not rebuild the already implemented landing page.
2. Reconcile all LP-01–LP-15 requirements with existing evidence. Reuse adequate current evidence. Run only missing, failed or change-affected checks; do not repeat successful suites without a reason.
3. Confirm the visitor can read the **fictional story before selecting See the records**. The proposed record rows and result summary start hidden. The report's phrase “sample story stays hidden” is ambiguous; it is not proof that the quote is missing. Fix only if inspection shows the story itself is hidden.
4. Close locally checkable gaps: FX refresh/failure/space reservation, applicable network/storage/microphone boundaries, public catalogue/Unlimited exposure, content/links/auth modes, and relevant existing type/lint/build and diff results. Use controlled conditions and fictional data. Do not claim all these checks failed simply because they were absent from the summary.
5. Perform screen-reader, zoom and other accessibility checks when available. Record the real phone keyboard and field-data limits honestly. These external/manual gaps do not authorise buying services, deploying production, running a paid call, or repeatedly asking for keys.
6. Fix demonstrated in-scope defects. Preserve commercial policy, live goals, current voice setup, financial invariants, historical holds, budgets and provider state. Do not add availability notes to the offer or fabricate successful payment.
7. Update the existing checkpoint/build log with the build identity, actual evidence, remaining limitations and exact next action. **Phase 08 remains INCOMPLETE unless its actual full exit criteria are met**; completing the landing subset alone does not establish that. Keep Phase 09 external.

Unresolved-story recovery remains a separate backend reliability priority (sections 6.1, 7 and REC checks), but the owner's latest exact next action explicitly says **do not start recovery, live counters or payments**. Preserve the implemented UI and finish only the stated verification work. An old priority table is not permission to override this checkpoint.

### 0.4 App UI direction — now reported implemented

The earlier request made the wider screen/interaction pass explicit in section 15. The owner now reports it implemented and tested in the stated local context. Preserve that work rather than starting the same pass again. Section 15 remains the contract for the screens; section 0.5 is the current evidence and next-action record. This document update does not independently verify or alter the app.


### 0.5 Latest app UI completion report and exact next action

**Received 21 October 2026. Evidence: the owner's supplied Cursor report, using the local fictional workspace in Edge.** The checks below are reported results, not an independent rerun by this document's author. The current build/commit identity must come from the repository checkpoint; do not invent one.

**Reported implemented:**

- Today opens with one story box headed **What happened with your money?**, its date and **Understand my story**, disabled until words exist. **Tell your story** opens the full editor, retains the words and Draft backup, and does not automatically reread them. Voice stays in the same entry; before recording its display is **Ready · 0 / [plan limit]**, using the real applicable limit.
- A day without records has an honest empty-state sentence, rather than GH₵0.00 implying no movement. The report says the sentence exists, but that state was **not shown on screen in this test** because the sample day already had records.
- Review uses **Check this record / Check these N records**, leaves the original words open, offers **Change** beside a proposal and saves with the real count. Preserve these count-sensitive labels; do not replace a correct current label merely because an earlier example used different wording.
- Money Stories leads with Money in, Money out and Net movement and explains that net movement is not profit. Goals show Target, Set aside and Remaining. What-if places recorded pace beside **Try a different amount** and does not change records.
- **Delete original stories** is separate in **Data and privacy**. Pricing, Plan and usage, and the landing page were left unchanged.

| Evidence item | Current checkpoint status | Exact limits |
| --- | --- | --- |
| UI-01–UI-11 and UI-14–UI-18 | Reported PASS in the supplied local Edge run; HISTORICAL PASS when cited by this document | Covers the scenarios actually exercised. It does not establish every clause, a live recording or the unobserved empty-day state. |
| Width/theme checks | Reported PASS | 320, 360, 390, 768, 1024 and 1440 CSS widths in light/dark had no sideways overflow. This is not a real phone keyboard test. |
| Focus, zoom and motion | Reported PASS | Workspace dialog closed by keyboard and returned focus; 360×640 at CSS 200% zoom still reached Understand my story; reduced-motion mode reported no animation. This does not prove screen-reader operation or accessibility conformance. |
| Task and recovery-state regressions | Reported PASS | One clarification, Change, source words, Save this record, a lost save and an offline draft behaved as before. This is not completion of the separate backend unresolved-story repair. |
| Edited-screen lint | Reported PASS | Lint on the edited screens passed. It is not a successful full-project typecheck or an unreported build result. |
| UI-12 pricing and UI-13 subscription states | HISTORICAL PASS — not rerun | Preserve earlier evidence and their existing scope. Do not label these new tests or real payment verification. |
| LP-01–LP-15 | Unchanged from the existing record | Carry forward the individual statuses; the app UI pass neither reran nor resolved them automatically. |
| Screen reader and real phone keyboard | NOT RUN | Explicitly untested. A person using a screen reader is still part of the stated Phase 08 work. |
| Live recording through stop and transcription | NOT RUN | Existing UI/mock checks do not establish the live path or transcription accuracy. Use the consented check below. |
| Empty day rendered on screen | NOT RUN | Do not count the implemented sentence or a populated sample day as visual verification of the empty state. |
| Full project typecheck | PASS as of 21 October 2026 (`npm run typecheck`, exit 0), after a FAIL recorded earlier that day | The earlier errors in `scripts/lib/evaluation-budget.ts` (reading `id` from a journal union that includes the approval line) and `scripts/lib/story-attempt.ts` (`string \| null` passed as the reservation id) were repaired narrowly in section 0.6 without changing budget accounting or attempt handling. |
| Large-workspace measurement | Optional; NOT RUN unless separate evidence exists | Use fictional/disposable data if undertaken. No automatic production import or new performance claim. |
| Scope and phase | Phase 08 INCOMPLETE; Phase 09 EXTERNAL | No provider call, payment, journal change or database migration was made in the reported UI pass. |

**Exact next action:** preserve the completed UI and continue the remaining Phase 08 checks: a consented live voice check, a person using a screen reader, and the optional large-workspace measurement. **Do not start recovery, live usage counters or payments.** Carry the unrun real-phone/landing/field checks honestly; do not erase them to reconcile a headline PASS. The typecheck now passes (0.6) and the empty day was shown on screen on 21 October (see `harness/context/08-remaining-checks.md`).

#### Voice check: prepare unpaid work, then use only an authorised recording

Use existing credentials, configured Groq Free-plan safeguards, current account-wide/length limits and any already documented test authorisation. Do not request keys again, add paid fallback or change the testing journal. Recording consent must cover sending that clip to the configured service. Reuse valid documented consent; request only genuinely missing consent/required authorisation, with the exact clip and scope ready to review. No live recording or provider request is made merely by updating this file.

For a short fictional script, use: **“I sold 500 cedis for cash. Ama has not paid the 100 cedis she owes. I moved 200 cedis from cash to MoMo.”** Confirm that amount, name, negation and account direction survive transcription. “Has not paid” must not become “has paid.” This describes a sale and a transfer, with an unpaid debt; it does not describe receiving a debt payment. Do not present one successful clip as broad Ghanaian-accent accuracy evidence.

Check start, elapsed time/plan limit, stop, transcription, editable words and retention when leaving/returning through the existing supported path. Use the saved transcript for the same recording; editing words is not permission to transcribe again. Keep words if a later stage fails. Never mark financial records saved merely because words returned. Downstream story interpretation is a separate provider step: use existing mock/approved test arrangements and label what was actually tested; do not silently add a paid reader call or save to real customer records. Keep any unresolved remote outcome under existing safeguards, with no automatic replay.

#### Screen-reader check: a person completes the task

Use a participant's familiar browser/screen reader and fictional data. Ask them to find the current workspace/date, enter a story, identify the main action and why it is disabled when empty, navigate the workspace dialog, read a clarification, inspect source words and proposals, change one detail and reach the correctly named save action. Include relevant status/error feedback using a mock or disposable local state. Confirm focus returns sensibly and currency/amounts and control names are understandable. Retain participant consent and findings without unnecessary financial content. Automated accessibility tools, focus checks or reading HTML are not a substitute for the requested person using a screen reader.

#### Optional measurement and known gaps

If the optional large-workspace check is undertaken, use a disposable fictional dataset, record its size, browser/hardware and relevant list/filter/report timings, and compare against existing project targets if they exist. Do not change the owner's workspace, invent a threshold, equate a local measurement with field speed or introduce a new architecture before evidence requires it.

The unobserved empty-day state may be checked with an existing disposable fixture if available, without clearing the populated workspace; otherwise keep NOT RUN. The two typecheck failures were repaired narrowly on 21 October 2026 and `npm run typecheck` passes; the repair did not touch the journal, holds or attempt semantics, and it does not complete Phase 08.

Update the repository's current checkpoint/build log with actual results and remaining limitations. Routine unpaid preparation and checks can proceed; a missing participant, consent, device or service evidence must be stated specifically. Keep Phase 08 incomplete and Phase 09 external until the actual criteria and owner scope change.

### 0.6 Fresh UI/UX pass — 21 October 2026 (Claude Code)

The owner's `CashNarra_Claude_Code_UI_UX_Master_Prompt.md` authorised a fresh, independent UI/UX review and implementation on top of the reported pass above. The decisions and the screen-by-screen changes are recorded in `docs/ux/UI_DESIGN_RECORD_2026-10-21.md`; the checks and their labels are in `harness/build-log.md`. Section 15 stays the screen contract and was not reopened; section 0.5's open items (a person using a screen reader, the live voice check, the real phone keyboard, field speed, large-workspace timing) stay open. The two typecheck failures named in 0.5 were repaired narrowly in the same pass, so a full `npm run typecheck` now passes.

## Contents

0. [Latest implementation checkpoint](#0-latest-implementation-checkpoint--read-first)

1. [Start here: scope and instruction priority](#1-start-here-scope-and-instruction-priority)
2. [One instruction to give Cursor](#2-one-instruction-to-give-cursor)
3. [Current baseline: preserve completed work](#3-current-baseline-preserve-completed-work)
4. [Product, financial, commercial, and privacy rules](#4-product-financial-commercial-and-privacy-rules)
5. [Research: competitors and what to learn](#5-research-competitors-and-what-to-learn)
6. [App experience: UI and backend requirements](#6-app-experience-requirements-for-the-ui-pass-and-later-backend-work)
7. [Separate product workstreams and their order](#7-separate-product-workstreams-and-their-order)
8. [Chosen landing page: exact content and behaviour](#8-chosen-landing-page-exact-content-and-behaviour)
9. [Visual, interaction, performance, and accessibility requirements](#9-visual-interaction-performance-and-accessibility-requirements)
10. [Persistent Cursor rules and language rules](#10-persistent-cursor-rules-and-language-rules)
11. [Acceptance checks and evidence](#11-acceptance-checks-and-evidence)
12. [Customer research and measurement](#12-customer-research-and-measurement)
13. [Sources and research limits](#13-sources-and-research-limits)
14. [Coverage map and final delivery checklist](#14-coverage-map-and-final-delivery-checklist)
15. [App UI/UX implementation contract](#15-app-uiux-implementation-contract--reported-implemented)

## 1. Start here: scope and instruction priority

### 1.1 What each instruction means

| Label | Meaning | What Cursor should do |
| --- | --- | --- |
| **MUST / preserve** | A product, data, money, privacy, or agreed commercial constraint | Apply throughout any relevant change. Do not treat it as optional design advice. |
| **CHOSEN NEXT PASS** | Remaining Phase 08 verification in section 0.5 | Preserve the reported implemented UI. Prepare/complete authorised voice and human screen-reader checks; optional large-workspace measurement; retain known failures and unrun cases. Do not restart recovery, counters or payments. |
| **LATER BACKEND / SERVICE WORK** | Recovery persistence, durable counters, payment connections, owner/support infrastructure or other deferred mechanisms | Keep current safeguards and truthful UI states. Section 15 permits presentation changes, not new paid services or backend financial behaviour. |
| **RESEARCH REFERENCE** | A competitor observation or general UX principle | Borrow a useful interaction lesson selectively. Do not copy every feature, claim, visual asset, or policy. |
| **EVIDENCE / REPORTED** | A source observation, historical snapshot, or owner-supplied test report | State its date and limits. Do not present it as a new test of the current checkout. |

### 1.2 Scope boundary for remaining verification

The table retains the allowed UI repair boundary. The main changes are now reported implemented; do not treat these rows as a new work list. Current checks and authorisation limits are in section 0.5. Make only evidence-driven in-scope fixes, preserving completed work.

| UI area: preserve and repair a demonstrated defect only | Preserve | Separate backend/service work |
| --- | --- | --- |
| Shared shell, headers, navigation presentation, spacing, typography, rows, buttons, dialogs and feedback | Existing routes, destination names, auth/tenant boundaries, Narra identity | New framework, new product scope or permissions model |
| Today composer, voice-stage presentation, clarification, batch review and retained-word/error states | Existing recording/transcription/interpretation orchestration, confirmation, deterministic save and receipts | New provider calls, retry engine, result persistence or historical hold settlement |
| Records, account/debt presentation, Money Stories and existing goal/what-if layout | Exact calculations, data meaning, period/workspace filters, source history, saved records and real goal state | Financial model/schema changes, bank integrations or new forecast engine |
| Settings, public pricing consistency and Plan and usage presentation/actions | Actual catalogue/agreements, existing subscription state rules, unknown meter states and private Unlimited | Payment integration, real charges, quota changes, durable counter integration or owner-console backend |
| Focused relevant checks, fictional/mock UI states and existing checkpoint/build-log updates | Current branch/local changes, existing budget/journal/provider state | Production deployment, paid inference/transcription or new credential requests |

The completed landing page stays intact. Normal assets, existing authenticated reads and supported app actions continue through existing code. The **public examples** retain their stricter fixed/local/no-auth/no-storage boundaries. Use disposable local fixtures/mocks for verification instead of changing the owner's real records or invoking paid providers.

Cursor may choose routine component extraction, responsive breakpoints, alignment and semantic/focus details within the existing system. Implement the specified visible outcome and behaviour without repeatedly requesting approval for ordinary UI edits. If a screen needs a missing backend capability, complete its truthful existing-state presentation and record that dependency; do not fake the capability or expand scope silently.

### 1.3 Resolve older instructions without losing safeguards

1. Follow the owner's latest explicit decisions and the applicable repository instructions. A later owner decision supersedes an older status note on the same subject.
2. Inspect the actual current local checkout before editing. Read `AGENTS.md`, the required startup files, current phase/checkpoint, active Cursor rules, and the relevant implementation. Inspect `work/cashnarra-v1` as needed. Preserve later local changes and unrelated uncommitted work.
3. Use section 0.5 for the current verification task, section 15 as the reported implemented app contract and section 8 as the implemented landing baseline. The original competitor findings inform future choices; financial and commercial constraints continue to apply.
4. Treat competitor examples as references. They cannot authorise a feature, a new data flow, a banking claim, a price change, or automatic financial saving.
5. Treat old voice-off, provider-pause, US$10 ceiling, missing what-if, duplicate-mark, and already-fixed layout claims as historical. Do not restore them because they appear in an older checkout or handoff.
6. If a concrete unresolved product decision prevents a required change, identify the specific conflict and continue independent work. Do not invent a money policy or declare a test passed. Do not use a generic approval request to stop routine work.

The original backend priority table is retained as research context. The latest owner report says the main app UI is implemented and explicitly limits the next work to remaining Phase 08 checks. Follow section 0.5; do not start recovery, counters or payments based on an older priority.

## 2. One instruction to give Cursor

Attach this file, then use the following instruction. This is the only master implementation prompt in the combined handoff.

```text
Read the latest section 0.5 of the attached CashNarra handoff. The main landing and app UI changes are reported implemented. Preserve them and the current local work. Do not restart the UI pass, recovery, live usage counters, payments, owner-console work or Phase 09.

Keep the canonical reference at docs/ux/CASHNARRA_FINAL_HANDOFF.md. Read AGENTS.md, required startup files, the actual current checkpoint/build-log evidence and active rules. Identify the relevant build/branch/HEAD/dirty state; preserve newer changes and consolidate stale scope instructions. Sections 8 and 15 remain implemented requirements, not a fresh implementation queue.

Current exact next action: the remaining Phase 08 verification — a consented live voice check, a person using a screen reader, and the optional large-workspace measurement. Prepare unpaid fixtures, task script and evidence capture first. Use section 0.5's bounded protocols. Reuse existing keys, documented consent and authorisation; do not request them again. Only resolve genuinely missing recording consent or required authorisation for the specific prepared check. No automatic paid fallback, paid reader call, real-record save, repeated remote attempt, journal/budget change, production migration or deployment is authorised by this file.

Keep the owner-reported Edge results explicit: UI-01–UI-11 and UI-14–UI-18 passed the named local fictional scenarios; edited-screen lint passed. UI-12/UI-13 are historical and were not rerun. LP-01–LP-15 stay as previously recorded. Live stop/transcription, screen-reader use, real phone keyboard and an empty day rendered on screen were not run. Do not promote these unrun clauses to PASS from a broad case ID.

Full typecheck failed in scripts/lib/evaluation-budget.ts and scripts/lib/story-attempt.ts when this section was written; both were repaired narrowly on 21 October 2026 and `npm run typecheck` now passes (section 0.6). Lint is still not full-project typecheck. Do not reset evidence or start a backend rewrite to make a completion headline true.

Use fictional/disposable data for checks. Confirm amount/name/negation/transfer direction in the authorised voice clip, editable words and no automatic financial save. The human screen-reader check must exercise the real task; automation/focus inspection is not a substitute. Optional measurement needs recorded dataset/device/timing evidence, not an invented performance promise. Preserve known real-phone, empty-day, landing and field-data gaps unless they are actually checked.

Proceed with routine unpaid work inside this scope and fix only demonstrated relevant defects. Do not repeat successful checks unless a change, failure or missing evidence justifies it. If a participant/device/consent is unavailable, record the exact remaining need and continue independent preparation.

Update the existing current checkpoint and build log with actual results using PASS, FAIL, HISTORICAL PASS, NOT RUN and EXTERNAL accurately. Phase 08 remains incomplete until its full actual exit criteria, including known failing required checks, are satisfied. Phase 09 stays external. Finish in ordinary English with what was checked, what remains unverified or failing, and the exact next action.
```

## 3. Current baseline: preserve completed work

**Evidence status: owner-reported completion, not independently rerun for these reports or this consolidation.** Inspect and verify in place. If the code differs, describe the difference; do not claim the newer work never existed.

This update supersedes the earlier to-do list. The following completion status comes from the owner's supplied Cursor report, not a fresh independent run of the local application. Preserve these changes and verify them in place; do not start those repairs again.

| Area | Latest reported state | Remaining work or evidence |
| --- | --- | --- |
| Story pricing | Ordinary Luna usage can now be priced; another story can be read | An earlier story remains unresolved because its result was not kept. Recovery still needs a proper user journey. |
| Internal testing journal | 164 calls; 14 unsettled; US$6.057663 committed under the US$20 ceiling | Preserve the journal and the US$0.425431 historical hold. This local committed total is not an independently verified provider bill. |
| Pricing | Free and Plus both lead with USD; cedi equivalents are in brackets; Plus has the US$2 standard price crossed out; Choose Plus opens a review | Live payments are not connected. Verify that exchange estimates refresh as intended; corrected formatting alone does not establish freshness. |
| Goals | Each goal has Explore what-if; a sample GH₵600 scenario showed about eight months without changing records | Preserve it. Improve explanation and comparison only where a fresh usability check shows a need. |
| Money Stories | Amounts remain together and stack when needed; singular record wording is fixed; zero amounts use a thin line | Preserve these fixes. Check interpretation, period consistency, source drilldowns, and accessibility rather than reopening the same defects. |
| Plan and usage | Free, actual workspace count, and Upgrade to Plus are shown; story/voice/report counts are explicitly unavailable | Connect durable, correct usage counts before enforcing or selling those allowances. Do not invent remaining quantities. |
| Subscription behaviour | Recurring cancellation, non-renewing plans, failed payments, and excess-workspace downgrade rules are implemented; 14 plan tests reportedly passed | Keep these rules. Connect the selected payment service and verify the full lifecycle separately. Code tests do not establish that live payments work. |
| Settings and story editor | Controls stack under explanations; destructive story deletion is separate; date and Understand action are together; backup is under Draft backup | Preserve the organisation. Evaluate consistency and density after inspecting the current screens. |
| Landing page | The new Record/Understand/Plan pass and local story/goal interactions are now reported implemented; see section 0 | Preserve the changes. Close acceptance-evidence gaps; do not start the redesign again. |

The reported browser checks covered the public page, Today, story editor, Settings, and Plan and usage. This report does not convert those reported checks into independently verified results.

### 3.1 Additional current facts that prevent regression

- The US$20 testing ceiling is **cumulative**, not a new US$20 allocation. The reported journal snapshot is **164 calls, 14 unsettled, US$6.057663 committed**. It includes the **US$0.425431** unresolved hold and the earlier 13 holds. These are dated local accounting facts, not the provider's invoice or a present balance query. Do not reset or release them to make a meter look tidy.
- Ordinary Luna usage can now be priced. One earlier result was not retained; that same story remains unresolved. A new story being readable does not prove recovery of the older story. Do not recommend changed wording as the repair or automatically replay the request.
- The owner supplied a Groq key and confirmed the Free plan. **Local voice is now on.** Preserve the current configured path and the free-only/no-paid-fallback behaviour. No live audio quality comparison was established by the two reports. An old branch's voice-off wording must not override the newer setup.
- Free shows **$0/month (GH₵0.00)**. Plus shows **$0.99/month** with **$2.00** struck through and an approximate cedi equivalent. **Choose Plus opens a review**; it does not yet complete a payment or grant Plus. This is working behaviour to retain, not a reason to add development notes to the pricing cards.
- The reported account screen showed Free and **1 of 3 workspaces**. That is the reported account snapshot, not a hard-coded value for every account. Story, voice and report counters still need durable integration; unknown usage is not zero usage.
- Each goal has **Explore what-if**. The reported real example used GH₵600 and showed about eight months, around May 2027, without changing records. Preserve the feature and existing forecast rules; the different fixed public example below is independent.
- Amounts stay together and stack when needed. “1 saved record” is singular. Zero bars use a thin line. Five check-in days use plural wording. Preserve these fixes.
- Settings controls stack below their explanations. **Reminders** is the current label. **Delete original stories** has its own confirmation and does not delete saved financial records.
- On the story page, the date sits by the story and **Understand my story** comes next. Backup is under **Draft backup**. Preserve this organisation.
- Recurring cancellation, non-renewing plans, failed/pending payment, and excess-workspace downgrade rules are implemented and were reportedly covered by **14 passing plan tests**. Those are historical test results, not proof of a live payment connection. More detail is in section 4.3.
- The owner reports browser checks of the public page, Today, story editor, Settings, and Plan and usage. Do not relabel these as tests performed by this research or as checks of a new implementation.

### 3.2 Snapshot provenance

The landing research inspected local branch `work/cashnarra-v1`, HEAD `b8012f0`, dated **21 October 2026 at 10:12 UTC**, and the GitHub branch's `src/app/page.tsx`, returned blob `37b86fb2fdb849eb762b8f65121a8e1501ede2b8`. These identify the inspected snapshot. They are **not** an instruction to check out that commit or discard later work.

The inspected landing already had an ordinary-language explanation, a fictional three-event example, a missing-detail example, signup links, and review-before-saving messaging. Its examples used fixed data and local calculations. Keep these foundations. The owner subsequently reported removal of repeated totals and extra marks; do not treat them as still missing without inspecting the current page.

The snapshot contained older voice-off and development-status wording, and its handoff contained stale budget/pause information. Current local work and later owner decisions take precedence. Correct FX formatting does not by itself establish current rate freshness. No latest-build pixel audit was performed by either source report.

## 4. Product, financial, commercial, and privacy rules

### 4.1 Product purpose and non-negotiable money rules

CashNarra helps people keep, understand, and plan from their financial records. Its core is **Record → Understand → Plan**, expressed with **“Serious money. Light interaction.”** A person speaks or types in their own words, checks the suggested records, confirms a save, understands the result, and can explore a goal.

The broader research proposed the positioning “Tell us what happened. Check the records. See what it means for your money.” The chosen public hero in section 8 is more specific and takes precedence for this page. Voice supports the experience; voice alone is not a unique market position.

**MUST preserve:**

- The existing exact-decimal financial calculations, account/debt classifications, deterministic totals, atomic batch saving, idempotent receipts, reviewed corrections, and source history.
- AI may propose records and explain results. It may not authorise access, write authoritative ledger entries on its own, calculate authoritative balances/report totals/goal forecasts in prose, or declare a save successful without the system's receipt.
- Review before saving. **A transcript is not an interpretation; a proposed record is not a saved record.** Ask about a material ambiguity; do not confirm every obvious detail.
- Unknown, zero, no records, pending, failed, and saved are different states. Missing opening balances are not zero balances. A valid event can be recorded before an opening balance is known.
- Sales are not all cash received. A payment on an old debt is not a new sale. A transfer between the person's accounts is not spending and does not create money across the workspace. Net movement is not profit.
- Source context and dates stay visible where they affect meaning. Record drilldowns preserve the reporting period and workspace. Keep full currency and amount values readable; never truncate real money to preserve a grid.
- Tenant isolation, row-level access controls, server-only keys, and existing privacy/retention rules. Owner-console authority is not ordinary workspace ownership.
- Current architecture, Narra v2 design system, existing activity/report PDF design, and relevant export functionality. Do not add another framework or a generic dashboard builder to copy a rival.

CashNarra records money; it does not hold or move it. Do not widen this task into a bank, wallet, transfer service, lending, inventory, tax filing, payroll, payment collection, or ERP product.

### 4.2 Agreed public offer — one source, clear units

This table makes the previously agreed quantities explicit. It does not activate paid access or authorise changing the current catalogue in this landing pass. Reuse the actual public plan source and flag a concrete discrepancy rather than creating a second catalogue.

| Benefit | Free | Plus |
| --- | --- | --- |
| Monthly USD price | **$0** | **$0.99 offer**, with **$2.00 standard** visibly struck through |
| Financial records | **Unlimited financial records** | **Unlimited financial records** |
| Workspaces | 3 | 10 |
| AI stories per month | 100 | 500 |
| Voice notes per day | 3 across the account | 3 across the account |
| Maximum length per voice note | 1 minute | **2 minutes** |
| Formatted report packs per month | 10 | 100 |

Unlimited records does not mean unlimited AI interpretations, voice notes, exports, or requests. A story may produce several records. These units must not be conflated. Changing workspaces does not create a second account allowance.

For unclear benefits, use smaller **readable** explanatory text:

- **AI stories:** “Turn what you type or say into records you can check.”
- **Voice notes:** “Speak your story, then check the words.”
- **Report packs:** “Download your records and summaries in a tidy file.” Match any named formats to the actual included exports.

**Price presentation and conversion:**

- Both plans lead with USD. Free is **$0 / month (GH₵0.00)**. Plus leads with **$0.99 / month**, then its approximate cedi equivalent in brackets, with the **$2.00** standard price visibly struck through. Label it **Standard**, without inventing evidence of a past “Was” price.
- When the page opens, use a suitable valid cached rate through the existing source. Show the **actual reference date**. Round the converted amount to the nearest **GH₵0.10** and display two decimal places. GH₵11.50 is an earlier example, not a permanent or newly verified conversion.
- A valid cache may avoid a fresh upstream lookup on every visit. It must not relabel stale information as today's rate. Inspect the existing source's freshness policy; do not invent one silently. A failed refresh needs an honest dated fallback or an honest unavailable conversion state.
- Reserve space while FX loads. The approximate GHS display is not a fixed cedi renewal amount or a change to the customer's USD agreement.
- Show the finished offer without preview, coming-soon, not-for-sale, development, or availability notes. The owner rejected those notes. Resolve readiness gaps privately; do not activate services just to make copy true.
- The discount is time-limited for **new enrolments**, but no dates have been set in this handoff. Do not invent an end date, countdown, scarcity message, or unsupported sale history.
- The future **Unlimited** plan's **$10 standard / $5.99 offer** is owner-only, deactivated, and absent from public markup, anonymous page data, menus, and APIs. CSS hiding alone is not sufficient. Do not treat unlimited records on Free/Plus as public access to this future plan.

### 4.3 Price protection and subscription behaviour

**The price agreed by an existing subscriber remains their price unless they voluntarily upgrade.** New catalogue prices and the end of a campaign affect new users, not existing agreements. Do not add an “uninterrupted renewal” condition or silently rewrite agreements after an expiry, cancellation, or failed renewal. Preserve the existing agreement and applicable access rules; paid access still depends on actual payment status.

Public sentence: **“Keep your monthly dollar price unless you choose to upgrade.”** For a protected $0.99 agreement, the account may say **“Keep your $0.99 monthly price unless you choose to upgrade.”** Do not show that specific protected amount on an agreement with a different price.

| Actual state | Required account behaviour | Preservation rule |
| --- | --- | --- |
| Free | Current plan, actual usage, **Upgrade to Plus** | Unknown counters remain unknown; no invented remaining quantity. |
| Paid recurring Plus | Agreed price, next renewal date, actual usage, **Manage subscription**, **Cancel subscription** | Use the agreement and verified payment state, not today's public card. |
| Cancellation scheduled | Paid-through date, renewal stopped; **Keep subscription** only if reversal is supported | Access lasts through the paid period. Records and agreed price remain. |
| Non-renewing Plus | **Renew Plus** and **Switch to Free** | Do not claim a card or MoMo recurring agreement was cancelled when no recurring payment exists. |
| Renewal failed or payment unfinished | Accurate payment status, actual remaining access, supported next payment action | Do not invent successful payment or strip access that the current rules retain. |
| Return to Free with more than 3 workspaces | Three active workspaces; excess workspaces remain readable | Delete none. Preserve the existing selection/access rules. |

Choose Plus currently opens a review. Continuing must not claim a charge or activated Plus while payment is unconnected. A designed state, a unit test, and a real completed payment are different evidence. When separately assigned, integrate the chosen service with verified outcomes rather than rebuilding the already implemented plan rules.

An owner console may manage future catalogue versions, offer amounts and campaign dates, subscriptions, support, and operational evidence in a later workstream. It must not silently rewrite protected agreements, expose unrestricted story contents by default, or mistake workspace administrators for platform owners. Keep owner access server-authorised. This file does not build or activate that console during the landing pass.

### 4.4 Company cost, user allowance, and billing are separate

| Concept | What it means | What it does not prove |
| --- | --- | --- |
| Provider usage / invoice | Cost evidence for a completed or otherwise billed remote attempt | Whether the customer's task completed or a record was saved |
| Internal hold / evaluation journal | A company spending safeguard and accounting record | A provider invoice or a user charge |
| Customer plan usage | A defined account entitlement, counted by durable product events | The provider's cost or number of financial records |
| Subscription payment | Verified customer payment under an agreement | That an internal review screen completed checkout |

A failed customer task can still have provider cost. A timeout can remain billable and unresolved. A failure before a provider request may be provably unbilled. Settle based on evidence; do not declare all failures free or all holds charged.

For the future usage integration, define the actual counting event, successful AI story, completed-but-rejected interpretation, reused result, explicit new attempt, recording unit, report pack, and reset boundaries before enforcing the meter. Preserve any existing approved definition. If policy is absent, identify the specific gap rather than guessing. Reusing a stored interpretation must not appear as a newly successful reading. A record count is not a story count. Ensure Plus's promised 500 monthly stories is reachable under legitimate product guards; do not silently reduce the offer or raise a company budget to conceal a mismatch.

Counters must be durable, account-wide across workspaces, and safe under refresh, concurrency, retries, and multiple servers. Do not claim a local process lock is a hosted quota manager. Display actual use and the actual reset date/time when supported. Connecting these counters is later work; this page must not manufacture them.

### 4.5 Voice, privacy, and support boundaries

- Transcription turns an audio clip into editable words. Interpretation turns those reviewed words into proposed financial records. They are separate steps with separate failure/cost states; neither alone saves the ledger.
- Preserve the configured Free-plan Groq path, operator confirmation, saved transcript reuse, provider-specific refusal/pause handling, rate-limit handling, and absence of automatic paid fallback. A Free-plan label cannot prevent an organisation being upgraded outside the app. Do not rotate keys or claim free allowance turns into a billing credit.
- Do not transcribe the same recording again merely because the words were edited or interpretation failed. Follow the existing safe reuse and unresolved-attempt rules. Real model comparison requires a separately agreed, consented live test; it is not needed for UI work.
- Keep original stories, transcripts, audio, and diagnostic evidence under existing retention and access rules. Deleting original stories must preserve saved records as already implemented.
- Product errors should retain work, explain the next supported action, and avoid API keys, internal file paths, certificate traces, token prices, or company budget details. Put operational evidence in the private owner/support view.
- A future support request can carry a relevant attempt reference. Sharing financial story contents must be explicit and limited to what support needs. This handoff does not authorise sending messages to customers or others.

## 5. Research: competitors and what to learn

**RESEARCH REFERENCE.** CashNarra sits across simple business records, natural-language entry, and personal financial planning. Studying only accounting software misses its closest input competitors; studying only AI apps misses the everyday needs of Ghanaian businesses. The following is a practical shortlist, not an exhaustive market census or proof of market leadership.

### 5.1 Method and evidence limits

The comparison uses official product pages, published product images, developer store listings, and help guides. Published screenshots were visually inspected for MonAi, TalkieMoney, Oze, LedgerGH, Khatabook, Copilot, Monarch, Wave, Dime, and Lunch Money. Cleo was reviewed for its published positioning and language. These demonstrate the published design; they do not establish how every current screen behaves on every device.

No competitor account was created, no paid product was purchased, and no private customer data was submitted. Accuracy, accessibility, retention, customer satisfaction, current market share, and Ghanaian speech recognition were not tested. Vendor ratings and claims of faster collections or superior accuracy were not used as proven results.

CashNarra recommendations draw on its supplied concept, the redesign brief, and the screen problems already discussed in this conversation. This is not a new live audit of the latest local Cursor build. Cursor must reconcile the current checkout and GitHub branch before making changes.

For the landing follow-up, official pages and primary UX guidance were read. Copilot Money and Lunch Money public pages were captured at **1440 × 1000**; MonAi's published product images were also inspected. These observations do not establish conversion rates, accessibility conformance, private analytics, or financial accuracy. No fresh browsing or competitor-account test was added by this consolidation.

### 5.2 Competitor shortlist

| Product | Relationship to CashNarra | Most useful thing to study | Recommended adaptation |
| --- | --- | --- | --- |
| **Oze** | Important Ghana and African small-business recordkeeping competitor | Searchable records, unpaid money, clearly visible entry actions | Make “People owe you” and “You owe” easy to open, with the records behind each total. |
| **LedgerGH** | Close Ghana-specific conversational bookkeeping positioning | Chat examples connected to a business dashboard | Demonstrate one recognisable local money story and its structured result. |
| **MonAi** | Close competitor for typed and spoken expense entry | A visible microphone and compact transaction history | Put the story composer on Today and make recording easy to start. |
| **TalkieMoney** | Close competitor for conversational income and expense tracking | Switching between speech and typing near the input | Let people change input method without losing their draft. |
| **Khatabook** | Functional competitor for small-business credit records; India-focused | Person-first balances and name search | Let someone answer “What does Ama still owe?” without reading a report. |
| **Wave** | Broader small-business bookkeeping alternative and reporting benchmark | Cash flow hierarchy, date filters, subscription management | Keep Money Stories readable and make plan actions explicit. |
| **YNAB** | Adjacent competitor for household planning and goals | Visible goals and interactive payment scenarios | Refine the existing Explore what-if comparison and explain its assumptions. |
| **Copilot Money** | Adjacent personal-finance product; strong review reference | A dedicated review area with readable rows | Present proposed CashNarra records as something people can inspect and edit. |
| **Monarch Money** | Adjacent household financial overview and planning product | Stable navigation and separate summary, transaction, and goal areas | Keep everyday recording separate from detailed reporting and planning. |
| **Dime** | Adjacent personal expense tracker and visual reference | Compact dated rows, restrained surfaces, clear primary entry control | Use alignment, spacing, and type hierarchy to make records feel orderly. |
| **Lunch Money** | Adjacent personal-finance product with useful record-management tools | Grouping, splitting, review filters, and visible price protection | Keep story-linked records understandable and make the protected subscription price explicit. |
| **Cleo** | Adjacent conversational money assistant and tone reference | A recognisable voice and explanation of spending | Give CashNarra a consistent, calm voice suited to serious financial records. |

Sources: [Oze](https://getoze.com/business-app/bookkeeping/), [LedgerGH](https://www.ledgergh.com/), [MonAi](https://get-monai.app/), [TalkieMoney](https://talkiemoney.com/en/), [Khatabook](https://khatabook.com/), [Wave](https://www.waveapps.com/accounting), [YNAB](https://www.ynab.com/features), [Copilot](https://help.copilot.money/en/articles/6045480-dashboard-tab-overview), [Monarch](https://help.monarch.com/hc/en-us/articles/360048393272-Getting-Started-with-Monarch), [Dime](https://apps.apple.com/us/app/dime-budget-expense-tracker/id1635280255), [Lunch Money](https://lunchmoney.app/features/transactions), [Cleo](https://web.meetcleo.com/).

This is a practical shortlist, not an exhaustive market census. A notebook, a spreadsheet, or an ordinary WhatsApp note is also a plausible substitute for the initial recording job. That is a product hypothesis to test with customers, not a measured statement about adoption.

### 5.3 Detailed observations: published screens, adaptation, and limits

#### Oze: show the money people are waiting for

Oze’s bookkeeping page covers sales, expenses, searchable transactions, unpaid sales, and data downloads. The published transaction screen separates money customers owe from money the business owes; it also shows status, date filters, and prominent sale and expense actions. Its relevance to Ghana is supported by Oze’s Ghana office and an earlier UNCDF Ghana case study, rather than inferred from its currency alone. [Product](https://getoze.com/business-app/bookkeeping/) · [Published screen](https://getoze.com/app/webp-express/webp-images/doc-root/app/uploads/2024/10/Hometrx-1.png.webp) · [Company](https://getoze.com/about-us/) · [Historical Ghana case study, 2021](https://www.uncdf.org/article/7271/a-digital-bookkeeping-app-to-improve-access-to-finance-a-case-study-from-ghana)

**Apply:** Give CashNarra short, everyday labels such as “People owe you” and “You owe.” Opening a figure should reveal who, how much remains, and the supporting records. Keep these within the relevant existing Records or Accounts area instead of adding a large new navigation system. A useful balance should be easier to reach than an explanatory paragraph about balances.

**Be selective:** The inspected Oze image also has a combined “sales and expenses” headline. CashNarra should keep money coming in, money going out, and net movement distinct. It should also preserve its story input rather than making every event begin with a separate sale or expense form. Do not import Oze’s inventory, shop, lending, or coaching scope into this UI task.

#### LedgerGH: make the local example do the explaining

LedgerGH publicly presents WhatsApp bookkeeping for Ghana, with a web dashboard. Its page demonstrates short messages about a sale and rent, and its dashboard image pairs summary figures with recent activity. These are close positioning signals. This research establishes its published offer and screens, not its active customer count or the operational quality of every advertised integration. [Product and example](https://www.ledgergh.com/) · [Published dashboard](https://www.ledgergh.com/shots/_dash.png)

**Apply:** On CashNarra’s landing page, use a fictional Ghanaian story and let visitors see the resulting proposed records. Cedis, MoMo, part-payments, transfers, and familiar names will explain the value more directly than several repeated “AI-powered” cards. Show the review step in that example.

**Be selective:** A dense business dashboard is not automatically the right home screen. Keep taxes, payroll, filing, and payment collection outside CashNarra’s current scope. Do not copy wording that implies a message is already saved when CashNarra still needs the person’s approval.

#### MonAi: make capture visible

MonAi advertises natural speech, natural typing, and recognition of several expenses in one input. Its published overview image places a microphone beside a transaction list; another image isolates the recording interaction. [Product](https://get-monai.app/) · [Overview image](https://get-monai.app/images/mockups/hero-en.webp) · [Voice image](https://get-monai.app/images/mockups/voice-en.webp)

**Apply:** Put a compact composer directly on Today. Begin with “What happened with your money?” Provide typing, recording, and a smaller manual-record option in one place. Use one main action for the current step. After processing, show proposed records instead of leaving the person in a large empty editor or an oversized dialog.

**Be selective:** Do not make speech the only obvious way in. CashNarra needs a strong typed route for privacy, noisy places, and people who prefer writing. This research does not establish MonAi’s quality for Ghanaian speech or CashNarra’s more complex financial meanings.

#### TalkieMoney: make input switching easy, keep confirmation short

TalkieMoney promotes spoken and typed income/expense entry, including multiple entries. The inspected voice image has a visible keyboard switch, a large speech control, and a record list above the conversation. The same image also shows a lengthy prose confirmation. [Product](https://talkiemoney.com/en/) · [Published screen](https://talkiemoney.com/static/img/voice_recog.6fbd348a6a65.png)

**Apply:** Keep the input switch near the composer. Preserve the transcript when someone changes to typing. In CashNarra, replace a paragraph saying that entries were understood with short editable rows, followed by “Save 3 records.” A transcript is input to review, not proof that financial records were saved.

**Be selective:** Avoid copying the long chat acknowledgement. The public page also has inconsistent Android availability wording, so platform availability was not treated as settled. Its recognition-accuracy marketing was not independently verified.

#### Khatabook: organise debt around people

Khatabook’s published home image places customers and suppliers, name search, and individual balances together. The official site describes a digital credit/debit ledger and payment reminders. Its main market context is India, so it is a functional reference rather than evidence about Ghanaian adoption. [Product](https://khatabook.com/) · [Published screen](https://khatabook-assets.s3.ap-south-1.amazonaws.com/common/images/hand_holding_phone_1.png)

**Apply:** A person’s page should answer: what was owed, what was paid, what remains, and which records explain it. A payment must remain linked to the earlier debt when that is what happened. Use names and plain-language balance direction, not only red or green numbers. CashNarra should continue using its existing debt calculations.

**Be selective:** Do not turn this recommendation into an automated debt-reminder service or a lending feature. Neither is necessary to make existing balances understandable.

#### Copilot Money: give review a visible destination

Copilot’s official dashboard guide describes a “To Review” area, editable transaction rows, and a way to open the full transaction list. Its published image separates payee, category, and amount. The guide also compares month-to-date income/spend with the equivalent prior period. [Guide and screenshots](https://help.copilot.money/en/articles/6045480-dashboard-tab-overview)

**Apply:** Give CashNarra’s proposals a clear heading such as “Check these 3 records.” Keep the event, amount, date, account, and relevant person readable. Put “Change” beside each row. Ask one focused question where meaning remains unclear. Keep the final save action visible while the record list scrolls.

**Critical difference:** Copilot’s review marks already imported transactions as reviewed. CashNarra’s review authorises new records to be saved. Copy the visual clarity, not that persistence behaviour. Do not let a bulk review action silently bypass CashNarra’s financial confirmation.

#### YNAB: turn a changed amount into a visible outcome

YNAB’s current feature page exposes targets and a loan calculator. Its loan-planner explanation, originally published in 2022 and updated in 2025, describes changing payment amounts to see effects on payoff timing and interest. [Current features](https://www.ynab.com/features) · [Planner explanation](https://www.ynab.com/blog/ynab-loan-planner)

**Apply:** Preserve the restored **“Explore what-if.”** On the existing goal screen, show the monthly amount, estimated finish, and a change control together. Compare the current assumption with the trial amount. Let the person explore without committing a new contribution. Updating a scenario should use the existing calculation, not another paid AI request. Whether all of this is already clear should be checked in the current screen before changing it.

**Be selective:** CashNarra does not need to adopt YNAB’s full budgeting method or build a new loan engine. A manually entered scenario can work without enough history for a reliable history-based estimate. Label the assumption honestly rather than hiding the whole feature behind a history gate.

#### Monarch: keep destinations predictable

Monarch’s getting-started guide separates dashboard, accounts, transactions, reports, budgeting, and goals. Its published screen demonstrates a persistent sidebar and summary widgets. The guide also describes dashboard customisation. [Guide and image](https://help.monarch.com/hc/en-us/articles/360048393272-Getting-Started-with-Monarch)

**Apply:** Keep CashNarra’s recording, understanding, and planning tasks easy to find from a stable app shell. Preserve workspace context and selected dates. Show recent activity near the summary so a person can connect numbers to events.

**Be selective:** Do not reproduce every destination or build a customisable dashboard now. The inspected Monarch screen is information-heavy and truncates some descriptions. CashNarra should remain lighter, particularly on phones. A persistent sidebar alone does not establish usability.

#### Wave: distinguish the figures and complete the subscription journey

Wave’s published cash flow image separates inflow, outflow, and net cash change under a date range. Its product page gives an upgrade route. Its cancellation guide documents managing a subscription and retaining paid features through the current subscription period after cancellation. [Accounting page and images](https://www.waveapps.com/accounting) · [Cancellation guide](https://support.waveapps.com/hc/en-us/articles/21234118811412-Cancel-a-Pro-or-Receipts-Plan-subscription)

**Apply:** Preserve the reported amount fixes, upgrade review, and subscription rules. Check the remaining connection between a financial summary and its underlying records. When payments are connected, make renewal and cancellation outcomes explicit. Use the subscriber's actual agreement and payment status rather than today's public offer.

**Be selective:** CashNarra should use fewer steps than Wave’s documented cancellation path. A cropped marketing image cannot establish a responsive layout, so the final CashNarra layout still needs device checks. This research is not a recommendation to depend on Wave’s bank connections or regional payment services.

#### Dime: visual order comes from hierarchy

Dime's published store images show dated transaction rows with amounts aligned on the right, a persistent add control, and settings grouped into concise rows. Its listing also describes period-based breakdowns and quick entry actions. These are useful visual and interaction references, without establishing accessibility or reliability in live use. [Developer listing and screenshots](https://apps.apple.com/us/app/dime-budget-expense-tracker/id1635280255)

**Apply:** Reuse CashNarra's existing RecordRow and amount styles. Make date headings quieter than record descriptions, and make amounts easy to scan. Use a divider when a divider is enough; reserve a surface for a distinct task. Now that settings are stacked, inspect whether explanations can be concise and consistently placed rather than putting every setting inside a large card.

**Be selective:** Some text in the published Dime images is faint. Borrow its hierarchy while preserving CashNarra's readable contrast. Its compact budget views are not a reason to introduce a separate budgeting system or remove meaningful account context.

#### Lunch Money: make changing records understandable

Lunch Money documents transaction grouping/splitting, review filters, and search. Its published screen separates the transaction list from a focused editor. Its pricing page prominently states that an existing customer's price is protected while prices for new users may change. [Transaction tools](https://lunchmoney.app/features/transactions) · [Pricing promise](https://lunchmoney.app/pricing)

**Apply:** Let a person open the records from one CashNarra story together, then change one relevant detail without rereading or resending the entire story. Preserve source history and the existing correction rules. On the Plus review and subscription page, explain the agreed protection in one direct sentence: **“Keep your $0.99 monthly price unless you choose to upgrade.”** Use that wording only for an agreement that actually has this protection. A changing cedi estimate does not change the agreed USD subscription price.

**Be selective:** Do not introduce its full table of power-user tools at first use. CashNarra should offer simple record-level changes before advanced multi-record operations. Grouping several records from a story is different from splitting a bank transaction; reuse the presentation lesson without changing the financial model.

#### Cleo: a consistent voice can be part of the product

Cleo markets conversation, spending understanding, goals, and a strong personality, including a blunt style. Its product scope also includes financial services beyond CashNarra's current remit. [Official site](https://web.meetcleo.com/)

**Apply:** Give CashNarra a calm, recognisable voice across entry, clarification, summaries, errors, billing, and support. Say what happened and what the person can do next. A short explanation tied to saved records is more appropriate than a generic claim that AI knows the person's finances.

**Be selective:** CashNarra's existing guide calls for ordinary international English with Ghanaian terms where helpful. Retain that direction. Spending roasts, guilt, manufactured intimacy, and forced slang would conflict with its tone. Do not import lending, banking, or automated movement of money.

### 5.4 What the landing pages add to those lessons

| Reference | Observed pattern | CashNarra adaptation | Boundary |
| --- | --- | --- | --- |
| [Copilot Money](https://www.copilot.money/) | A prominent outcome-led headline, a short explanation, a clear entry action, and detailed product visuals farther down the page | Use confident type hierarchy and readable product evidence | Its large decorative hero and automatic account-tracking claims are not a template for CashNarra's capabilities |
| [MonAi](https://get-monai.app/) | Natural input methods are explained directly and illustrated with product images | Make speaking and typing understandable immediately | Do not borrow its Apple Pay automation, broad AI claims, ratings, or testimonials |
| [Lunch Money](https://lunchmoney.app/) | The product category, entry action, trial conditions, price protection, and dashboard image are easy to locate | State what the product is and reduce uncertainty around starting | CashNarra Free is not a 30-day trial; do not copy another product's trial or pricing terms |
| [Lunch Money pricing](https://lunchmoney.app/pricing) | Its existing-customer price-lock promise is prominently explained | Place CashNarra's agreed price protection near its Plus offer | Preserve CashNarra's own agreement history and upgrade rule |
| [YNAB](https://www.ynab.com/) | The page connects its method to everyday concerns and future outcomes | Show the practical value of a goal and a what-if comparison | Do not copy savings statistics, promises that worry disappears, or language judging someone's financial ability |
| [LedgerGH](https://www.ledgergh.com/) | Ghanaian terminology and short example messages make the proposed task recognisable | Use cedis, cash, MoMo, and a believable payment story | Do not add tax, payroll, bank integration, or other services to match its scope |

These are selective lessons. A successful-looking brand's page is not proof that every one of its patterns will improve CashNarra.

[Nielsen Norman Group's homepage guidance](https://www.nngroup.com/articles/homepage-design-principles/) supports clearly explaining the offering, using representative examples, making navigation/action labels meaningful, and avoiding unnecessary complexity. The CashNarra-specific design below applies those principles; it is not a reproduction of that article or a measured result.

### 5.5 Watchlist, substitutes, and questions to validate

**AbegNo** advertises a closely related Nigerian WhatsApp/voice bookkeeping idea. It belongs on a watchlist, not alongside established products as a proven operating competitor: the inspected site contained placeholder verification metadata and an apparent example phone number. Those are reasons to verify the business further, not proof that the project is illegitimate. [Published features](https://abegno.com/features/)

The research did not establish current paid customer numbers or market leadership for any shortlisted product. Store downloads, historical pilots, and promotional testimonials do not answer that question. It also did not establish that any competitor handles every CashNarra example correctly or that CashNarra currently does so in its latest local build.

Follow-up research with customers should establish which substitute they actually use, why they abandon it, and whether debt clarity, story capture, or goal planning is the strongest reason to switch. A larger rival feature list is not itself a reason to widen CashNarra’s scope.

## 6. App experience: requirements for the UI pass and later backend work

**APP UI REQUIREMENTS ARE NOW REPORTED IMPLEMENTED under section 15.** Preserve the original contracts below; use section 0.5 for current verification. Do not replay this brief as new work or start backend recovery/counters/payments. Competitor feature lists are not extra product scope.

### 6.1 The next layer beyond completed repairs

#### First use: reach one useful result quickly

A first-time customer needs a different Today state from someone with months of records. Give them one editable example and one clear way to enter their own story. Ask for account details only when an event requires them. A missing opening balance should not prevent recording a valid event. Keep the choice to add it later understandable.

After a successful save, show the records saved, one useful factual consequence, and a direct link to the relevant view. For example, a payment on a known debt can lead to “See Ama's remaining balance.” Avoid displaying that balance when it cannot be established. This closing step makes the result useful instead of leaving the person at a generic success alert.

#### Correction: make the original words easy to check

For each proposed event, make the relevant source phrase available. If the amount or person is wrong, let the user edit that proposal. An edit to a proposal should use the existing local review rules and should not automatically send the entire story for another paid reading. A new narration or a changed financial context may need another interpretation; make that a separate, deliberate action.

Preserve the distinction between editing an unsaved proposal and correcting an already saved financial record. Saved records must continue to use the existing reviewed correction and source-history process. Do not add a casual delete or undo that bypasses those rules.

#### Returning use: help the person resume the right task

An unfinished draft, a completed day, and an empty workspace should not all receive the same large blank editor. Show “Finish your draft” when work remains. After saving, make the recap and relevant records easy to reach. Offer catch-up without accusing people of failing to keep a streak.

Preserve the existing check-in work and its corrected plural wording. If a person has not recorded a day, treat the information as missing rather than assuming no money moved. Encourage the useful act of reviewing records; do not attach a moral score to spending or wealth. A reminder should be controllable and return to the relevant task.

Quick links such as “This week's money out” or “People who owe me” can use existing computed views. They should not trigger paid AI merely because they look like conversational prompts. Keep the workspace and period visible when opening the result.

#### Visual craft: apply the existing design system consistently

The supplied Narra v2 design kit already defines Manrope for headings, Inter for amounts and body text, a four-pixel spacing scale, and restrained depth. Its supplied Manrope font lacks the cedi glyph, so amounts belong in Inter. Apply the established rules before inventing a new visual direction.

Use a small set of reusable components: composer, source quote, clarification choice, record row, amount, summary, usage row, and dialog. Give them consistent spacing and focus states. Keep the primary action visually distinct, and keep supporting text readable. Reserve the largest type for a true headline rather than making every number compete.

Retain the reported amount wrapping and settings layout fixes. The next review should compare real populated, empty, loading, and error states across screens, including phones and intermediate desktop widths. A page can be free of overlap and still feel visually inconsistent; that judgment requires seeing the current screens.

#### Narrative proof: make the promise tangible

Keep the simplified landing page. Test whether a visitor can explain what CashNarra does after trying the existing fictional example. Show how the story becomes reviewable events and then an understandable financial result. If that transformation is unclear, improve the example itself before adding more promotional sections.

Keep business and personal examples within the agreed product scope. CashNarra does not need to announce a new feature simply because an existing capability was hard to discover.

#### Graceful limits: make a boundary understandable

Complete the real usage counts and explain each allowance at the point where it matters. Before recording, show the plan's maximum recording length. Near a limit, show actual remaining use and the reset date/time. A daily voice limit is across workspaces; changing workspaces must not create a second allowance.

Define the customer counting policy before connecting it: what counts as a successful AI story, whether a completed but rejected interpretation counts, how reused results behave, and what a new attempt means. This product entitlement is separate from provider charges. Company costs can exist even when the customer's task fails. Do not hide or reset provider accounting to make a customer meter look tidy.

#### Recovery: finish the unresolved-story experience

The latest report says the same words stay blocked because an earlier result was not kept. Asking the user to rephrase the story is an unsatisfactory workaround: it can create another paid attempt without resolving the original one. Keeping the old hold may still be correct when billing is uncertain.

For future calls, a returned interpretation must not disappear simply because a later pricing step fails. Retain the minimum review result and usage evidence needed for recovery under the existing privacy and retention rules. Track an unpriced or unsettled attempt separately, retain the spending protection, and preserve validation before financial saving. This does not imply that the already-lost result can be reconstructed from the journal.

Recommended recovery behaviour:

1. Identify the existing story and show its real status without requiring changed wording.
2. Check whether a previously obtained result or request receipt can be recovered using the system's existing retention/recovery mechanism. Do not claim recovery when no result exists.
3. If recovery is impossible, explain the outcome plainly and retain the original story. Offer manual entry. Provide a separate, explicit new-attempt path only after applying the provider status and budget rules.
4. Link any new attempt to the same story, keep its usage separate from the old attempt, and preserve the old hold until evidence can settle it.
5. Preserve exactly-once saving: an eventually recovered old response and a later response must not produce duplicate authoritative records.

Example customer copy: **“We couldn't recover the result of this story. Your words are still here.”** Follow with only the actions that actually work. If a supported new-attempt action is offered, make clear that the earlier request may still have used processing capacity. The owner view can carry detailed attempt and cost information.

Support should be reachable from the failed story with a reference to that attempt. The private owner console can show the processing status and accounting evidence. Do not expose API keys or full financial stories in ordinary diagnostic messages; keep any sharing of story contents explicit and limited to what support needs. This is a proposed support flow, not an instruction to send any message during this research.

Cursor should also verify which path created the US$0.425431 hold and that future normal requests use the intended bounded reservation. The amount alone is not evidence of the provider's charge or proof that a new bug exists. This research does not release it, retry the story, increase the budget, or restore an old provider pause.

**Scope clarification:** backend recovery requirements preserve accounting evidence and future result retention. They do not release the US$0.425431 hold, reconstruct a lost response, grant a new budget or authorise a retry. In the active UI pass, present the actual supported unresolved state and actions; do not invent recovery functionality. Section 8 still governs the completed public page's copy, order and examples.

### 6.2 Enduring screen contracts

#### 1. Today: a clear place to begin and resume

Show the current workspace, a short composer, one recording control, and recent stories or records. Keep any unfinished story visible. Avoid presenting recording, file upload, transcription, interpretation, backup, restore, and saving as equally prominent choices at the same moment.

Proposed sequence:

1. Type a story, or record and inspect the words.
2. Choose **“Understand my story.”**
3. Answer a meaningful clarification if needed.
4. Inspect the proposed records.
5. Choose **“Save 3 records.”**

Show the user's original words alongside or within reach of the review. Successful transcription alone should never look like a successful save. Preserve the now-separated date, Understand action, and Draft backup layout.

For recording, display elapsed time and the applicable plan limit before and during capture. Use focused controls appropriate to each stage: start, stop, then edit/use the transcript. Keep the primary action visible when the keyboard opens or the transcript grows.

#### 2. Review: demonstrate the financial meaning

Use this fictional example to design and test the review:

> “Sold GH₵500 for cash. Ama paid GH₵100 she already owed. Moved GH₵200 from cash to MoMo.”

| Proposed record | Short explanation shown to the person |
| --- | --- |
| Sale · GH₵500 · Cash | Money from today’s sale. |
| Payment from Ama · GH₵100 · Cash | Reduces what Ama already owed. |
| Transfer · GH₵200 · Cash → MoMo | Moves money between your accounts. |

The sale amount is GH₵500. Debt collection is not another sale. The transfer is not another sale or an expense. Across the workspace, the transfer does not create new money. Without known opening balances, show changes rather than inventing complete balances.

This example should be used to prove CashNarra’s intended behaviour, not to claim that other products fail it. The calculation and record classifications must continue to come from the existing financial system.

If the story says “My brother gave the business GH₵5,000,” the useful question is:

> “Was this a loan, money invested in the business, or a gift?”

Do not replace a meaningful clarification with several questions about details that are already clear.

#### 3. Money Stories: make the answer readable before adding more charts

Use one visible reporting period and a predictable order: **Money in, Money out, Net movement.** Explain net movement once in a smaller line. Do not call it profit. Each figure should open the relevant records with the same period and workspace applied.

Preserve the reported readable amount lines and stacking behaviour, including when a desktop sidebar is open. Never abbreviate or ellipsise the actual money value merely to preserve a three-column layout. Use small labels and secondary explanations to create hierarchy instead of making every amount oversized.

Preserve the new thin-line treatment for zero bars and the singular record wording. Continue distinguishing zero, unknown, and no records. Missing opening balances must not be presented as zero balances. A partial month should not be compared with a whole prior month without explanation. Avoid repeating the same caveat under every metric.

#### 4. Goals: preserve and refine “Explore what-if”

Keep the reported working **“Explore what-if.”** Check whether the goal amount, amount already set aside, remaining amount, monthly assumption, and estimated finish are understandable together. Improve their relationship if needed; do not rebuild the action simply because an earlier brief described it as missing.

Inside the scenario view, show “Current amount” and “Try a different amount,” with a clear result. If history is insufficient, invite a monthly assumption. Keep history-based estimates distinct from a scenario the person supplied. Changing a scenario must not change saved records or silently change the goal. Any separate “Use this amount” action must say what it updates.

#### 5. Pricing and Plan & usage: make both directions work

Preserve the now-consistent USD-first hierarchy and Plus standard-price strike-through. Free is **$0/month (GH₵0.00)**. Plus shows **$0.99/month** with **$2.00** struck through. Verify that the bracketed cedi estimate refreshes when the page opens using a suitable cached server source, shows its reference date, and rounds to GH₵0.10. Formatting has been fixed; refresh behaviour has not been established by the latest report. Do not stamp an old value as current or imply an exchange estimate is a fixed cedi charge.

Put **Unlimited records** clearly on both cards. Keep benefit rows aligned. Explain only the unclear benefits in a smaller, readable sentence:

- **AI stories:** “Turn what you type or say into records you can check.”
- **Voice notes:** “Speak your story, then check the words.”
- **Report packs:** “Download your records and summaries in a tidy file.” Adapt this to the formats actually included.

Keep the previously agreed Free and Plus allowances. The Plus recording limit is **2 minutes per note**. Keep the future Unlimited card private and deactivated. Avoid development or availability notes on the finished public offer, as the owner requested.

Preserve the reported subscription-state implementation and 14 passing plan tests. Keep the account page consistent with the person's actual subscription state when a real payment service is connected:

| State | What the page should make clear | Action |
| --- | --- | --- |
| Free | Current plan, actual usage, and the Plus offer | Upgrade to Plus |
| Paid | The subscriber’s agreed price, next renewal date, actual usage | Manage subscription; Cancel subscription |
| Cancellation scheduled | Date paid access ends; renewal stopped | Keep subscription, if reversal is supported |
| Renewal failed | What failed and what access remains | Update payment method or resolve payment |

An existing $0.99 subscriber must continue seeing their agreed $0.99 price when a public campaign or catalogue price changes. Do not derive their renewal price from today’s card. The owner console may manage future offers and campaign dates; it must not silently rewrite existing agreements.

Choose Plus now opens a review. Continuing correctly avoids claiming a charge or activated Plus while payments are unconnected. The remaining operational work is the selected payment integration, verified payment status, renewal and cancellation handling, and live usage counts. Preserve the implemented distinction between recurring cancellation and a non-renewing plan's Renew Plus/Switch to Free actions. Preserve the downgrade rule that excess workspaces remain readable and are not deleted. This research authorises no charges.

Keep customer allowances separate from the company’s provider budget. Define exactly what counts as an AI story and when usage changes. Reusing a stored interpretation must not look like a new successful reading. A provider invoice, an internal spending hold, and a customer’s plan usage are different concepts; ordinary customer screens should not display the internal testing journal.

#### 6. Errors and support: explain the next useful action

Use one message for one failure. Keep the draft and let the person understand what remains saved. The message should follow the actual state, rather than exposing certificate errors, provider credit limits, token prices, or internal pause files.

| Situation | Example customer wording |
| --- | --- |
| Reading failed and the draft is retained | “We couldn’t finish reading this story. Your words are still here.” Follow with the recovery action the app can actually support. |
| A required detail is unclear | “Which account did this money come from?” |
| No records in the selected period | “No records for this month yet.” |
| No opening balance | “Add a starting balance to see how much is in this account.” |
| Cancellation is scheduled | “Your Plus plan ends on [date]. You won’t be charged again.” Use only after the billing system confirms this state. |

For an unresolved remote request, do not invite repeated paid attempts. Show any supported recovery/resume state accurately. Detailed diagnostics belong in the private owner/support view, where they can help someone resolve the issue.

### 6.3 State and action vocabulary

Keep these states distinct in product code, copy, and testing. Use the existing state machine rather than adding an unrelated parallel model.

| Stage | What the person should understand | Supported next action |
| --- | --- | --- |
| Draft | Their words are retained; no new money record is implied | Edit, record/type, or Understand my story |
| Recording | Audio capture is happening, with elapsed time and their plan limit | Stop recording |
| Transcript | These are editable words from the recording | Check/edit the words, then request interpretation |
| Interpretation in progress | Reading is underway; repeated clicks must not create duplicate work | Wait or use an existing supported recovery state |
| Material detail missing | One fact affects financial meaning | Answer a focused question |
| Proposed records | These records are not saved yet | Change a row or Save N records |
| Saved | The deterministic save has a receipt | Inspect the saved result and relevant records |
| Unresolved remote attempt | The outcome may be uncertain, with possible company cost | Recover if supported, keep the draft, or add a record manually; explicit new attempt only under current rules |
| Correcting a saved record | A reviewed change affects an existing authoritative record | Follow the existing correction/source-history process |

Do not make transcription completion look like financial saving. Do not add multiple banners for the same failure. Keep the next action specific; use a generic Continue only where its meaning is already clear.

## 7. Separate product workstreams and their order

**Current work is the remaining Phase 08 verification in section 0.5.** App UI changes are reported implemented. The table below retains original broader priorities; it does not override the owner's explicit instruction not to start recovery, live counters or payments. Preserve completed work and fix only demonstrated relevant defects.

| Order | Work | Evidence that it is finished |
| --- | --- | --- |
| **1** | Recover unresolved stories without rewording | The same story has a clear status, recover/manual/new-attempt choices as supported, separate attempt accounting, and no duplicate saving. Historical holds remain evidence-based. |
| **2** | Verify one complete first-use and returning-use journey | A person starts naturally, fixes one proposal, saves once, understands the result, and can return to the correct draft or recap. Fix only demonstrated gaps. |
| **3** | Connect correct usage counts | Story, voice, and report counters come from durable account-wide events, survive refresh, and cannot be multiplied by switching workspaces or racing requests. Counting and reset rules are explicit. |
| **4** | Connect the payment lifecycle when its service is chosen/configured | The existing plan rules receive verified payment outcomes. Review does not imply payment; failed payments preserve the correct access; cancellation and downgrade behave as already specified. |
| **5** | Apply visual and language consistency | Existing components, fonts, spacing, row hierarchy, progress, errors, and focus states agree across screens. Reported layout fixes remain intact. |
| **6** | Check understanding and refine existing reports/goals | Customers can explain the example, trace a figure, understand a debt payment, and compare a goal scenario. Existing what-if and zero-value fixes are preserved. |

Keep payment/usage integration distinct from visual research: both matter, but a polished screenshot does not establish operational completeness. Routine UI work can proceed with fictional data and mocked services without paid inference or payment activation.

### 7.1 Practical sequencing without mixing scopes

| Workstream | What can be prepared with no paid call | What establishes completion | Scope boundary |
| --- | --- | --- | --- |
| Public landing — **reported implemented; preserve open evidence** | Carry forward LP results and repair a demonstrated regression or locally checkable missing case | Preserved working demonstrations; honestly labelled remaining evidence | No new landing redesign, payment/service integration or production deployment |
| App UI/UX — **reported implemented; remaining checks only** | Preserve section 15 contracts and follow section 0.5 verification | Reported local passes, historical pricing/subscription evidence and explicit remaining failures/unrun checks | No new UI pass, recovery/counters/payments, budget change or production deployment |
| Story recovery — first separate reliability work | Existing attempt/result audit, mocked responses, retained-word states, idempotency checks | Same logical story can show real status; supported recovery/manual/new-attempt paths; no duplicate saving; old holds preserved by evidence | A real retry is not needed to design/test the flow and is not authorised by this file |
| First use / return | Fictional draft, clarification, review, save receipt and resumed state | A complete journey works under existing save rules | Do not rewrite the financial engine or delete real data |
| Durable usage | Event definitions, mocked counters, concurrency/refresh tests | Real authorised account-wide counters and reset policy, once separately connected | No invented counts or changes to catalogue allowances |
| Payments | Mock paid/pending/failed/cancelled states and provider integration design | Verified lifecycle with selected service, once separately assigned/configured | No customer charge, plan activation, or fake payment success from this handoff |
| Owner and support console | Access model, future-offer/version design, minimal support evidence | Platform-owner authorisation and protected-agreement/privacy checks | Do not activate a console or broaden story access as a landing edit |
| App visual consistency / comprehension | Existing tokens/components and fictional populated/empty/error states | Relevant screen and task checks with actual evidence | No new product scope just to match a competitor |

Payments and real counters are still unconnected in the reported baseline. A polished pricing page does not establish operational readiness. Keep this distinction in the private delivery report while presenting the finished public offer without rejected availability notes.

## 8. Chosen landing page: exact content and behaviour

**IMPLEMENTED BASELINE TO PRESERVE.** The owner now reports the main changes implemented; see section 0. Keep this order, copy and behaviour as the chosen acceptance reference. Do not restart these steps as a fresh feature list. Fix only a demonstrated gap.

### 8.1 What the page must help someone understand

After a brief visit, someone should be able to answer:

1. What does CashNarra help me do?
2. Can I use it for my own money, a business, or both?
3. What happens after I speak or type?
4. Do I check the records before they are saved?
5. How does it help me understand my money and explore a goal?
6. How do I start, and where can I see the plans?

The page should support one natural progression: understand the promise, try the fictional proof, recognise a useful outcome, and start a Free account. Visitors already ready to start should also have a direct signup route.

### 8.2 Exact section order and copy

Use **A → B → C → D → E → F → G → H** below. Repeated actions are intentional navigation; repeated full sample totals or duplicate brand marks are not. If a claim conflicts with actual launch functionality, identify the specific mismatch privately against the latest owner decisions. Do not turn on a service or insert rejected development notes to solve a marketing mismatch.

#### A. Header

Use the existing light-surface logo: violet mark, ink name. One mark on the page is sufficient; preserve the owner's recent cleanup.

Navigation: **How it works**, **Pricing**, **Sign in**. A compact **Start free** action may remain in the header if the mobile layout stays clear. Pricing goes to the existing `/pricing`; signup uses the existing working signup route, expected to be `/auth?mode=signup`. Verify actual route behaviour.

On phones, retain a visible starting action and an accessible way to reach Pricing and Sign in. Use the existing menu component if available. Avoid building an elaborate navigation system for a few links.

#### B. Hero and product example

| Element | Exact wording or requirement |
| --- | --- |
| Small audience line | For you and your business |
| Main heading | Tell your money story. See the numbers. |
| Supporting paragraph | Speak or type what happened with your money. Check the records, understand the numbers, and plan what comes next. |
| Main action | Try an example |
| Secondary action | Start free |
| Example context | Fictional example. No account needed. |

The main action takes the visitor to the example and places keyboard focus on its next control. It does not open a signup wall, call an AI provider, or request microphone access. Start free opens real account creation.

On desktop, pair the text with a readable example surface. On mobile, show the heading, explanation, and actions first, followed immediately by the example. Do not shrink the demonstration into an unreadable phone screenshot or force the whole example above the fold.

#### C. The worked example

Reuse the existing sample component and financial fixture. Improve its progression only where needed.

**Story:**

> I sold 900 cedis in cash. I paid 80 cedis cash for delivery. Abena paid 200 cedis cash towards her old debt.

**Initial control:** See the records

**Result heading:** One story. Three records to check.

| Record | Account | Amount | Short meaning |
| --- | --- | --- | --- |
| Cash sale | Cash | GH₵900.00 | Sale and money received |
| Delivery | Cash | −GH₵80.00 | Payment for delivery |
| Payment from Abena | Cash | GH₵200.00 | Payment of an old balance |

Show the result summary once:

- Money in: **GH₵1,100.00**
- Money out: **GH₵80.00**
- Net movement: **GH₵1,020.00**

One explanation beneath it:

> The GH₵200 from Abena pays an old debt. It is not a new sale.

Keep the sales value **GH₵900.00** available in that explanation or the sale row. Do not call GH₵1,100 sales or GH₵1,020 profit. Do not invent Abena's remaining debt or an account balance, because this fixture does not establish the opening amounts.

Label the result **“Example only. Nothing is saved.”** Offer **Start free** after the result. Keep reset secondary and use **Reset example**.

The current branch already renders records and totals immediately. If the latest local version still does that, make a deliberate choice for this specified flow: the initial control reveals the record result, rather than implying a transformation that is already completely visible. Reduced-motion mode reveals the same content immediately.

The existing trickier example may remain as **Try a missing detail**, secondary after the first result. Its story omits the account used for delivery. Ask **“Which account paid for delivery?”** with **Cash** and **MoMo** choices. Preserve the existing rule that the result summary waits for the required account answer. Do not invent an account, perform a real reading, or create a financial record.

Keep the public demonstration limited to its fixed examples. Do not add a field that invites visitors to paste a private financial story into an imitation live service. The authenticated app remains the place to enter their own story.

#### D. Show Record, Understand, Plan

**Section heading:** From what happened to what comes next.

| Label | Supporting sentence |
| --- | --- |
| Record | Speak or type in your own words. |
| Understand | See money in, money out, what you owe, and what people owe you. |
| Plan | Set a goal and explore what a different monthly amount could change. |

Use three concise rows or compact columns with a distinct reading order. Avoid adding a second full demonstration of the same sales and payment totals. The goal section below supplies the next piece of product evidence.

#### E. Make the goal feature tangible

**Heading:** Give your next goal a clearer path.

**Supporting sentence:** Choose a goal. Try a monthly amount and see how the estimate changes.

Use a small fictional goal surface with a visible **Explore what-if** control. Keep it visually related to the app's existing goal screen.

| Field | Fictional value |
| --- | --- |
| Goal | New equipment |
| Target | GH₵2,000.00 |
| Already set aside | GH₵500.00 |
| Remaining | GH₵1,500.00 |
| Initial monthly assumption | GH₵300.00 |
| Initial result | About 5 months |
| Alternative monthly assumption | GH₵500.00 |
| Alternative result | About 3 months |

The illustrative result assumes the same amount is added each month, with no growth or withdrawals. State that assumption briefly. Label the surface **Fictional goal**. It is independent from the three-event story and does not imply those events establish a sustainable savings pace.

Initially show the goal, the GH₵300 monthly assumption, and the five-month estimate. **Explore what-if** reveals two labelled choices: **GH₵300 a month** and **GH₵500 a month**. Selecting the latter updates the illustration to about three months. A secondary **Reset example** returns it to GH₵300. Use a native, keyboard-operable choice group; a slider or arbitrary numeric input is outside this small demonstration. Reuse an appropriate existing pure calculation/formatter and keep amounts exact. No paid AI, authenticated goal access, saved allocation, or money movement is needed.

The owner's real GH₵600 goal example and existing forecast rules remain unchanged. This public illustration does not authorise rewriting them. The illustration is a launch marketing proof, not evidence that the visitor can afford either contribution or will reach the goal on a guaranteed date.

#### F. Explain control and practical value

**Heading:** You stay in control.

- **Check before saving.** Review the records and change a detail when needed.
- **Keep things separate.** Use different workspaces for personal and business records.
- **Keep a copy.** Download your records and summaries.

Use concise text beside relevant product detail, not a wall of shields or an invented security certification. Verify the download claim against existing export functionality. Keep distinctions such as CashNarra recording money rather than moving it clear in the FAQ.

If genuine customer evidence becomes available later, add it with permission, clear attribution, and a verified source. For this pass, working fictional product proof is sufficient. No fabricated testimonials, user counts, awards, bank logos, star ratings, savings claims, or borrowed competitor endorsements.

#### G. A short pricing invitation

**Heading:** Start free. Choose Plus when you need more.

Reuse the actual public catalogue and price formatting rather than maintaining separate landing-page prices. Show Free and Plus only.

- Free: **$0 / month (GH₵0.00)**.
- Plus: **$0.99 / month**, with the **$2.00** standard price visibly struck through and the current approximate cedi equivalent in brackets.
- Put **Unlimited financial records** first on both cards.
- If allowances are shown, use the agreed quantities: Free 3 workspaces / 100 monthly AI stories / 3 daily voice notes up to 1 minute each; Plus 10 workspaces / 500 monthly AI stories / 3 daily voice notes up to 2 minutes each. These are account-wide limits.
- Link **See all plan limits** to `/pricing`, where the full comparison, including report packs, already belongs. Do not duplicate a long comparison on the home page.
- The Plus price-protection sentence is **“Keep your monthly dollar price unless you choose to upgrade.”** Existing subscribers' agreements remain separate from the public offer.

The cedi estimate follows the existing conversion rules: refresh using a suitable valid cached rate when the page opens, show the actual rate date, round to GH₵0.10, and keep two decimal places. Do not freeze GH₵11.50 as though it will always be current. Keep reserved layout space so rate loading does not shift the page. A real data lookup for FX is distinct from the fictional example's no-backend rule.

Use **Start free** and the existing **Choose Plus** review flow. Preserve truthful payment outcomes. This landing-page pass does not connect payments or assign Plus to the current account.

Keep the owner-only Unlimited card absent from public markup, page data, menus, and APIs. Do not insert preview, coming-soon, not-for-sale, availability, or development notes on the finished public offer. Do not invent enrolment dates, countdowns, or past sale history; the crossed-out amount is the standard price.

#### H. FAQ and closing action

Use ordinary questions with short answers:

| Question | Answer |
| --- | --- |
| Do I need to know accounting? | No. Describe what happened in your own words. CashNarra suggests records for you to check. |
| Can I type instead of speaking? | Yes. Type your story in ordinary words. You can also add a record yourself. |
| What if a detail is wrong? | Change it before saving. Saved records can also be corrected, with a history of the change. |
| Can I separate my business and personal money? | Yes. Keep them in different workspaces. |
| Does CashNarra hold or move my money? | No. It keeps records. Cash, bank and MoMo figures come from what you record. |

Remove superseded voice-off answers from the inspected branch rather than copying them into the current build. The final public voice claim must match the launch product. Resolve deployment/service readiness privately instead of introducing the availability notes the owner rejected.

**Closing heading:** Start with one money story.

**Closing sentence:** Bring the words. Check the records. See what comes next.

**Action:** Start free

Footer: the actual Privacy link and other existing, working public links. Use the label **Privacy**, rather than exposing a development-status heading in the navigation. Do not add empty Terms or Support pages, fabricate contact details, or remove necessary information from the actual privacy policy as part of this layout task.

### 8.3 Example-state contract

This makes the intended interactions explicit without introducing a new architecture. Reuse existing local state and components where appropriate.

| Current state | Action | Result | Side effects |
| --- | --- | --- | --- |
| Visitor is above the example | Try an example | Scroll to the worked example and move focus to its next control | No sign-in, microphone permission, provider request, or persistent write |
| Standard story, unrevealed | See the records | Reveal the three rows and the one summary from C | Local fixed-fixture transition only |
| Standard result visible | Try a missing detail | Show the existing trickier fixture without its delivery account | No arbitrary private input field; do not invent a new fixture or account |
| Required delivery account unanswered | Cash or MoMo | Apply the choice locally; show the summary only when the required detail is resolved | No API or financial saving |
| Story demonstration in any supported state | Reset example | Restore the original standard story and initial unrevealed state | No duplicate rows, persisted changes, or “saved” message |
| Fictional goal initial | Explore what-if | Reveal labelled GH₵300 / GH₵500 monthly choices | No real goal access, change, or provider usage |
| Goal choices visible | Choose GH₵500 a month | Update the estimate from about 5 to about 3 months | Same exact GH₵1,500 remaining; no allocation or movement |
| Goal comparison changed | Reset example | Restore GH₵300 and about 5 months | Local illustration only |
| Ready to start | Start free or Sign in | Use the existing correct auth route/mode | Normal navigation, separate from the fixed demo |
| Pricing invitation visible | Choose Plus | Open existing review with truthful payment state | No live payment connection or Plus grant from this work |

The two Reset example controls are scoped to their own demonstrations and must have distinguishable accessible context. Focus must remain sensible after reveals and resets; do not move it into hidden or removed content. Do not announce that records were saved when only the fictional proposal was revealed.

The missing-detail example remains an ordinary part of the chosen demo flow and LP-05, unless the latest owner explicitly removes it. The original report's “may remain” does not permit replacing it with guessed financial data; reuse the existing fixture.

## 9. Visual, interaction, performance, and accessibility requirements

### 9.1 Existing Narra system and page craft

Use the supplied Narra v2 design system. The signature composition is a human story becoming orderly record rows, followed by a readable result. That gives CashNarra its own recognisable visual language.

| Element | Implementation requirement |
| --- | --- |
| Brand | Existing violet mark `#5B49C7`, ink name `#29263D`; correct reversed asset on dark surfaces; no logo redesign |
| Fonts | Existing Manrope headings; Inter body, dates, controls, and every cedi amount. The supplied Manrope asset lacks the cedi glyph. |
| Numbers | Complete readable currency/amount pairs, tabular numerals, right-aligned rows; retain existing overflow fixes |
| Hero | One principal statement, one paragraph, two ranked actions, and product proof; no introductory screen delaying content |
| Page rhythm | Alternate a clear demonstration, concise explanation, goal proof, trust, and pricing; avoid several identical card grids |
| Layout | Start with the existing roughly 1180px content maximum and approved spacing tokens; two-column hero where it fits, naturally stacked mobile layout |
| Type scale | Use the established display styles as a starting point: about 56/60px desktop, 40/44px mobile, adjusted for reflow; supporting body around 16/24px |
| Surfaces | Quiet light background; one purposeful ink/violet feature surface where useful; dividers and alignment instead of boxing every sentence |
| Illustrations | Product evidence carries the meaning. Any human imagery is optional, recognisably fictional where applicable, and subordinate to the interface. |
| Motion | Short, purposeful result reveals using existing motion tokens, up to about 220ms; reduced-motion equivalent; headline and CTA visible immediately |
| Controls | Clear labels, visible keyboard focus, comfortable existing 44–48px targets, and correct button/link semantics |

Do not copy Copilot's giant decorative hero, Lunch Money's mascot, or competitor colour systems. Avoid scroll interception, auto-rotating headlines, autoplay audio, heavy video as the only explanation, decorative percentage charts, and new animation dependencies. A future optional product video must have controls and must not replace readable product proof.

At 390 × 844, the hero's explanation and primary action should be visible without scrolling at ordinary text size. The beginning of the example should follow naturally. At small or enlarged-text viewports, allow ordinary scrolling instead of squeezing text to satisfy a fixed-height composition.

Additional existing-system details: use the established four-pixel spacing family (4, 8, 12, 16, 20, 24, 32, 40, 48, 64) where appropriate. Reuse the current logo assets, including `public/brand/cashnarra-logo.svg`, the actual reversed asset on dark surfaces, and `cashnarra-symbol.svg` where an icon is genuinely needed. Check actual paths before use. These details do not authorise extra repeated marks.

The preferred 44–48px control size is the design direction, not a claim that WCAG universally specifies that exact minimum. Preserve readable contrast rather than borrowing faint competitor text. Amounts use Inter, tabular numerals, and complete currency/number pairs. Reflow the layout before reducing text or truncating money.

### 9.2 Performance, accessibility, and truthful evidence

[Google's Core Web Vitals guidance](https://web.dev/articles/vitals) defines good thresholds of LCP up to 2.5 seconds, INP up to 200ms, and CLS up to 0.1, assessed at the 75th percentile in field data. These are useful targets, not results established by this research. A local Lighthouse result is not proof of field performance.

Keep the main explanation available immediately. Optimise assets, reserve image/FX dimensions, and avoid making initial content wait for animation or an AI response. Reuse local fonts and avoid an unnecessary marketing framework or tracking stack.

Check semantic headings, meaningful links, visible focus, a skip link where appropriate, reading order, status announcements, text enlargement, contrast, and reduced motion. Numbers in the demonstration must remain readable as text, not only as pixels inside a screenshot. Automated checks alone do not certify accessibility.

## 10. Persistent Cursor rules and language rules

### 10.1 Put the critical rules where Cursor receives them

The source research used [NN/G's design-spec guidance](https://www.nngroup.com/articles/creating-design-specs-for-development/) to make content, layout, behaviour, accessibility, and boundaries explicit. A research report alone leaves too many choices. A useful handoff also needs implementation checks and evidence.

The source research checked [Cursor's rules documentation](https://cursor.com/docs/rules): project rules use `.mdc`, and `alwaysApply: true` makes the rule consistently included. Referenced files are read when needed; naming a long document is not equivalent to inlining all of it. These are source-reported documentation findings, not a guarantee of error-free AI behaviour.

Merge the following compact body into the existing appropriate `.cursor/rules/*.mdc` rule. Avoid a second conflicting rule. Keep this file at `docs/ux/CASHNARRA_FINAL_HANDOFF.md`; update any old reference to `CASHNARRA_LANDING.md` or separate conflicting implementation prompts to point to the canonical file. Do not erase research or unrelated project instructions. Do not overwrite `AGENTS.md` or paste the whole report into an always-applied rule.

```mdc
---
description: CashNarra UI language, financial safeguards, and current landing scope
alwaysApply: true
---

- Read the current repository checkpoint and docs/ux/CASHNARRA_FINAL_HANDOFF.md before relevant UI work. Preserve the latest owner-completed work over superseded snapshot status. Inspect branch/HEAD/dirty state; never reset newer local changes to an older branch.
- Current task is remaining Phase 08 verification under section 0.5. Landing and main app UI are reported implemented. Preserve section 15 contracts, actual test scope, historical UI-12/UI-13, existing LP states and unrun checks; the full typecheck passes since 21 October 2026 (0.6). Do not restart UI, recovery, live counters, payments or owner-console work.
- Preserve the current logo/Narra tokens, voice setup and free-only safeguards, Explore what-if, USD-first offer, protected subscription agreements, existing plan/cancellation/downgrade rules, exact financial calculations, saved data, journal, budgets, and provider state.
- Use the specified copy and action labels. Keep customer language ordinary and terms consistent. Explain unclear benefits beside them in readable secondary text. No engineering/provider-budget diagnostics, development/availability notes, fake ratings, invented deadlines, or unsupported financial promises in public flows.
- Public story and goal examples use fixed fictional data and local calculations. Their actions make no AI/transcription/authentication/ledger/storage request, persistent browser write, or microphone permission request. Ordinary assets, existing public catalogue/FX lookups, and explicit signup navigation are separate.
- Reuse the real public catalogue/formatter and existing safe signup/Plus-review routes. Show unlimited records clearly. Keep future Unlimited absent from public markup/data/APIs. Do not claim payment success or grant a paid plan from a review.
- Preserve unknown versus zero, cash received versus sales, debt settlement versus new sale, transfers versus spending, and net movement versus profit. AI cannot override deterministic calculations or review-before-save. Keep source history and exactly-once saving. Do not change live goals or duplicate demo totals.
- Design the whole state and task: draft/input, clarification, review, save/result/return, empty, loading, error, unresolved, and relevant billing states. Preserve words and show a supported next action; never invite automatic paid retries.
- Fit real content using existing components, Inter for money/body, complete amount pairs, reflow, visible focus, and reduced-motion equivalents. Check the specified viewport/state matrix and meaningful state transitions.
- Report PASS, FAIL, NOT RUN, HISTORICAL PASS, or EXTERNAL accurately. Do not infer speech accuracy, field performance, conversion, or accessibility conformance from screenshots/offline tests. Update the checkpoint with evidence, limits, and one exact next action; finish in plain English.
```

No rule file can guarantee Cursor will make no mistakes. The rules reduce ambiguity; the current-build checks and review of the diff catch violations. A file reference does not substitute for actually reading the file.

### 10.2 All twelve general UI/language rules retained

Apply these twelve rules to relevant verification fixes and future UI work, merging them with equivalent existing rules. Preserve reported implemented landing/app UI and follow the latest section 0.5 scope; do not turn this rule list into a repeated redesign.

1. **Start with the user’s task.** Every screen has a clear purpose, a visible next action, and a way to return. Keep everyday recording lighter than reporting or administration.
2. **Use the same words for the same thing.** Story, transcript, proposed record, saved record, account, workspace, and plan are different things. Explain them in ordinary language. Keep “Explore what-if” findable.
3. **Name the action.** Prefer “Save 3 records,” “Upgrade to Plus,” and “Cancel subscription” over a vague “Continue” where the specific effect is known.
4. **Protect money meaning.** Preserve financial classifications, exact amounts, unknown balances, source links, and confirmation before saving. AI prose cannot override the existing calculations.
5. **Reveal detail when it is needed.** Put a short explanation beside an unclear perk or figure. Keep engineering details and company provider budgets out of customer flows.
6. **Design the whole state.** Empty, loading, failed, pending, success, cancellation, and expired states are part of the screen. A dead button or duplicate alert is unfinished work.
7. **Fit real content.** Check long names, large and negative amounts, zero, missing data, long transcripts, and narrow desktop content. Screens must reflow before content collides.
8. **Keep the brand consistent.** Use the existing CashNarra mark, violet/ink palette, and Narra direction. Competitor research informs interactions; it does not authorise copying brand assets or replacing the design system.
9. **Verify the actual branch.** Read repository instructions and inspect the current local checkout and `work/cashnarra-v1` before editing. Preserve local changes; do not assume older main-branch files represent the latest screens.
10. **Finish with evidence.** Run appropriate existing checks, inspect real UI states, and describe exactly what was verified. Do not claim usability, accessibility, or transcription accuracy from a screenshot or an offline test alone.
11. **Honour the current checkpoint.** The baseline at the top supersedes stale missing-feature claims. Do not restore old pauses, replay unresolved paid requests, reset journals, rebuild completed subscription rules, or remove working what-if actions based on older text.
12. **Review a whole task.** Do not judge completion only by isolated screenshots. Verify the transition from input to clarification, review, save, result, and return, including failure and recovery. Keep the existing financial and privacy protections throughout.

### 10.3 Customer language and writing examples

Use ordinary international English with Ghanaian terms where they help: cedis, pesewas, cash, MoMo, and familiar names. Keep the voice calm, respectful, direct, and consistent. No guilt, roasts, forced slang, manufactured intimacy, vague “AI-powered” promises, or repeated caveats.

Technical terms are allowed in private implementation notes where they help Cursor do the work. Do not carry them into product flows merely because the code uses them. Product copy should say what happened, what remains, and the next supported action.

| Need | Customer wording | Rule |
| --- | --- | --- |
| Understand the draft | Understand my story | Interpretation is separate from saving. |
| Approve proposed records | Save 3 records | Use the real count and singular/plural form. |
| Edit one proposal | Change | Keep the source phrase within reach; do not reread the whole story automatically. |
| Unclear account | Which account did this money come from? | Ask one relevant question, not a technical validation message. |
| Standard reading failure | We couldn’t finish reading this story. Your words are still here. | Follow with the recovery/manual action the app actually supports. |
| Lost result | We couldn't recover the result of this story. Your words are still here. | Do not imply a result exists or a retry is free. |
| Empty period | No records for this month yet. | Missing records do not establish zero money movement. |
| Missing starting balance | Add a starting balance to see how much is in this account. | Do not block a valid record or invent a zero balance. |
| Upgrade | Upgrade to Plus | Make the upgrade route findable from Plan and usage. |
| Confirmed recurring cancellation | Your Plus plan ends on [date]. You won’t be charged again. | Only after verified renewal cancellation; use different wording for non-renewing plans. |
| What-if | Explore what-if | Preserve this action and explain the monthly assumption. |
| Backup | Draft backup | Keep it secondary to the story/date/Understand flow. |

Never show a raw placeholder such as `[date]` to a customer. Use real state values. Do not use past-tense success text before the operation has succeeded. Keep normal prices and quantities consistent across the landing page, pricing, review, and account screens through shared data.

## 11. Acceptance checks and evidence

### 11.1 Status vocabulary

| Status | Use it when |
| --- | --- |
| PASS | This check was actually run on the current relevant build and met the expected result; provide concise evidence. |
| FAIL | The check ran and the result violates the requirement; describe the issue and next fix. |
| NOT RUN | It has not been performed, including inaccessible mobile/assistive-technology checks. |
| HISTORICAL PASS | A previous run or owner report says it passed; identify that source and date. |
| EXTERNAL | Confirmation depends on a separate live service, deployment, field dataset, or customer study; state what evidence is still needed. |

Source-reported 14 plan tests and browser checks start as HISTORICAL PASS, not new PASS. A required check that cannot be run remains a declared limitation; do not quietly omit it. Do not mark an applicable failure complete. Use the existing phase/checkpoint conventions, including a blocked state where appropriate; do not invent “all done” when the release evidence is incomplete.

### 11.2 Landing acceptance cases — all fifteen retained

These are required outcomes retained from the specification. Section 0 records newer owner-reported checks and their limits. This document author has **not** independently rerun the new build; do not treat the original list as fifteen unimplemented features or assume the summary proves every clause.

| ID | Action or state | Expected result |
| --- | --- | --- |
| LP-01 | Inspect the real checkout before editing | Branch/HEAD/dirty state and the current landing files are identified; later local fixes are preserved; no reset or replacement from an older branch |
| LP-02 | Open `/` signed out | Clear product purpose, the proposed hero, visible example action, and a working signup route; no signup wall around the example |
| LP-03 | Click Try an example using mouse and keyboard | Reach and focus the example; no AI or financial request, microphone permission, local storage write, or authenticated access |
| LP-04 | Reveal the standard story | Three readable proposals; money in 1,100, money out 80, net movement 1,020; sales remain 900; no profit or invented balances |
| LP-05 | Choose the missing-detail example | Account question appears; summary waits for the answer; Cash/MoMo choice updates the fixed illustration locally |
| LP-06 | Reset the story example | Original fixed story/initial state returns; no duplicate rows, saved-state claim, or side effect |
| LP-07 | Explore the fictional goal | 1,500 remaining; 300/month gives about 5 months; 500/month gives about 3; no changes to actual goals, allocations, balances, or provider usage |
| LP-08 | Use Start free and Sign in | Correct existing routes and auth modes; browser back returns safely; no request for payment to create Free |
| LP-09 | Inspect pricing invitation | Same real Free/Plus catalogue; clear unlimited records; .99 offer/2.00 strike-through; actual dated cedi estimate; no public Unlimited data |
| LP-10 | Use Choose Plus | Existing review opens and retains truthful payment status; this work neither activates Plus nor connects live payments |
| LP-11 | Inspect content and links | No stale voice-off statement, development notes, duplicate sample totals, fake proof, broken navigation, or invented legal/support routes |
| LP-12 | Check 320/360/390/768/1024/1440 CSS widths, including 390×640 and 390×844 | No page-wide overflow, clipped amounts, hidden primary controls, or unreadable product proof; natural text reflow |
| LP-13 | Use keyboard, enlarged text/zoom, and reduced motion | Focus remains visible and sensible; controls have names; revealed content is announced appropriately; no motion-dependent meaning |
| LP-14 | Open with slow resources or failed rate refresh | Core explanation remains available; reserved space prevents avoidable shifts; FX uses honest dated fallback or an honest unavailable conversion state |
| LP-15 | Run relevant existing checks and inspect the diff | Appropriate type/lint/build and focused fixture/interaction checks pass; protected app behaviour is untouched; unrelated failures are identified accurately |

The no-backend restriction applies to example interactions; normal site assets, signup navigation, and an existing public FX/catalogue lookup are separate. Inspect the network for the specific example actions rather than claiming that the whole website makes zero requests.

Test the meaningful state transitions and financial results. Do not add low-value tests that simply duplicate static copy. Real phone keyboard behaviour, assistive technology, and field performance must be labelled NOT RUN/EXTERNAL if unavailable, rather than inferred from desktop resizing.

### 11.3 Additional regression boundaries for the landing pass

These checks retain the protected baseline. Apply relevant shared-component regression checks during the app UI pass too. They do not authorise backend integration or paid/live tests.

| ID | Check | Expected evidence |
| --- | --- | --- |
| KEEP-01 | Inspect the final diff and relevant shared-component consumers | No change to journal/history/budget/provider configuration, ledger persistence/calculation, quotas, subscriber agreements, payment connections, or real goals. |
| KEEP-02 | Existing routes and app actions that the landing depends on | Signup/sign-in, `/pricing`, Choose Plus review, and existing Explore what-if remain reachable and truthful; no duplicate catalogue. |
| KEEP-03 | Public response and rendered/page data | Future Unlimited remains absent; no keys, private journal data, financial stories, or owner-console information are exposed. |
| KEEP-04 | Story and goal example network/storage observation | No inference/transcription/auth/financial/storage request or persistent browser write from those example actions; no microphone permission. Distinguish normal asset/catalogue/FX requests and explicit auth navigation. |
| KEEP-05 | Existing relevant plan rules/checks when shared files are touched | No regression of protected prices, recurring/non-renewing distinction, failed-payment handling, paid-through access, or readable excess workspaces. Do not expand testing indefinitely when no relevant change justifies it. |

### 11.4 Broader acceptance — retain implemented UI; backend mechanisms separate

| ID | Workstream | Required outcome before calling that work complete |
| --- | --- | --- |
| REC-01 | Unresolved result | Same words show the real attempt state; no rewording required to find status, no invented recovery. |
| REC-02 | Future result retention | A mocked returned result and minimum usage evidence survive a later pricing failure under retention rules; unpriced cost remains separate and spending protection remains. |
| REC-03 | New attempt / eventual recovery | Explicit supported new attempt links to the same story with separate attempt accounting; recovered old and newer results cannot create duplicate authoritative records. Old holds are not silently released. |
| REC-04 | Diagnostics / support | Customer wording retains work and supported actions; owner evidence is private; content sharing is explicit; no message is sent merely for testing. |
| APP-01 | Complete journey | Draft → material clarification → editable proposals → one confirmed save/receipt → useful result → correct return state, including failure. |
| APP-02 | Financial meaning | Sale/debt/transfer fixture remains correctly classified, exact, source-linked, and does not invent balances or profit. |
| APP-03 | Reports / goals | Period/workspace drilldowns agree; zero/unknown/no-records differ; what-if changes only an assumption until a supported explicit update. |
| USE-01 | Counting policy | Each unit and reset boundary is explicit; story/record/provider-cost units remain separate; reuse and rejection handling are defined by approved policy. |
| USE-02 | Durable limits | Account-wide counters survive refresh, concurrency and workspace switching without duplication or multiplied allowances. |
| BILL-01 | Payment truth | Only verified payment events drive access under the existing rules; review, pending, failure, renewal and cancellation remain distinct. |
| BILL-02 | Price protection | A campaign ending or a new catalogue version does not rewrite an existing agreement; only the owner's supported upgrade policy changes it. |
| BILL-03 | End / downgrade | Recurring ends at paid-through date; non-renewing offers Renew Plus/Switch to Free; excess workspaces remain readable and none are deleted. |

Use fictional data and mocks for preparation and meaningful tests. A mock demonstrates a rule, not a live provider entitlement, payment success, transcription accuracy, or production readiness.

### 11.5 Implementation and delivery evidence

Before editing, record the current branch/HEAD/dirty state, relevant files, preserved local changes, and current rule/checkpoint references. Inspect only the relevant source and existing commands; do not reset or overwrite unrelated work.

After implementation, report changed files and why, focused existing check results, LP outcomes, the relevant viewport/state observations, and any external limitation. Use screenshots for internal inspection where useful, but do not substitute them for task transitions or expose private account/payment material. Check actual links and auth modes, not merely their text.

Update the existing checkpoint/build log using the repository's normal workflow. Do not restart a completed phase or enter production/external-launch work to make this task look finished. Commit or push only under the existing project authorisation; this handoff itself does not request a new deployment or external communication.

Suggested owner-facing completion format:

```text
Changed: [the concrete outcome in ordinary English].
Checked: [actual checks and relevant results].
Still open: [only real limitations, with honest status].
Next action: [one exact action or “none for this scoped implementation”].
```

## 12. Customer research and measurement

### 12.1 App comprehension: seven retained tasks

Use a small first round of Ghanaian customers from the intended audience, for example five to eight people including a trader, a service business owner, and a personal-record user. This is a proposed formative round, not a statistically representative sample.

Ask them to complete the following without coaching:

1. Add a story containing a sale, a debt payment, and an account transfer; find and correct one proposed detail before saving.
2. Record a note with Ghanaian names, a cedi amount, and a negation such as “Ama has not paid”; edit the words and finish reviewing.
3. Find what a named person still owes and identify the source record.
4. Explain the selected month’s net movement and show the records behind it.
5. Find “Explore what-if,” change the monthly amount, and explain whether that saved any new money record.
6. Explain the discounted Plus price and what an existing subscriber would pay after a public price change.
7. In a mock paid account, find cancellation, complete it, and say when paid access ends.

Record completion, wrong saves, missed debts/transfers, backtracking, requests for explanation, and whether people can explain the result in their own words. Compare the same tasks before and after the changes. Do not infer improvement from preference alone, or claim a percentage uplift without measurement.

For implementation review, check the existing target widths—320, 360, 390, 768, 1024, and 1440 pixels—plus intermediate content widths with the sidebar. Inspect keyboard operation, visible focus, text enlargement, contrast, reduced motion, and the mobile keyboard. These are acceptance checks to perform, not checks already passed by this research.

Routine design work should use fictional stories, mocked provider responses, and mock billing states. Real transcription evaluation needs consented audio and a separately agreed live test. No new paid inference test is required to implement these screen improvements.

### 12.2 Landing comprehension and later measurement

Start with a small formative review, such as five to eight people from the intended personal and small-business audience. Give them the page without explaining it first. Ask what CashNarra does, what happens before saving, whether it moves money, and how the goal example works. Watch them try the sample, locate pricing, and start signup.

Record misunderstandings, wrong expectations, hesitation, and successful completion. This is qualitative feedback, not a representative conversion study. First repair comprehension and task failures; do not claim a percentage improvement from a small preference test.

Later, where an appropriate measurement setup exists, observe the sequence from landing visit to example result, signup, and first reviewed saved story. Use minimal event metadata. Do not log private story text, financial amounts, names, or recordings as marketing analytics. A click on Start free is not a completed signup, and signup is not a successful first record.

Do not add analytics or perform an A/B test merely to implement this visual pass. A proposed future experiment could compare demo-first versus signup-first action hierarchy; it is not part of the chosen default design and needs enough relevant traffic to be informative.

Keep customer studies and consented real audio evaluation separate from implementing this specification. Do not contact participants, upload their audio, or add analytics merely because these research methods are listed. The current task needs local fictional examples and appropriate existing checks, not a new paid experiment.

## 13. Sources and research limits

### 13.1 Input documents and consolidation provenance

The combined file is based on these two supplied Markdown documents:

1. **CashNarra_Competitors_and_UI_Improvement_Brief_2026-10-21.md** — research checked 21 October 2026, updated against the owner's latest implementation report.
2. **CashNarra_Landing_Page_Research_and_Cursor_Spec_2026-10-21.md** — focused landing-page follow-up, checked 21 October 2026.

The supplied attachments have `(1)` in their local filenames; that suffix does not indicate a different product decision. Their source hashes are recorded in section 14 for traceability. This document does not require Cursor to locate either attachment to understand its active task.

Underlying CashNarra material included the supplied final concept, technology/architecture and storyline handoffs, repository/audit instructions, the Narra v2 kit, the 19 October elite UX audit/handoff, and the redesign decision brief. Use the actual repository's required startup sources, not guessed filenames. Later explicit owner decisions supersede stale operational status in older materials. Keep existing brand and financial rules where they remain applicable.

### 13.2 Competitor and screen source register

The original competitor report states that its links were checked on 21 October 2026; they were not newly rechecked for this consolidation. Image dates within assets may be older than the current page. Sources describe their own products unless explicitly noted.

| Source | Evidence used | Limit |
| --- | --- | --- |
| [Oze bookkeeping](https://getoze.com/business-app/bookkeeping/) | Product scope and published transaction images | Promotional images, not a signed-in test |
| [Oze developer listing](https://play.google.com/store/apps/details?id=com.daretoinnovate.oze&hl=en_US) | Current developer description and published app listing | Not evidence of active use or retention |
| [Oze company page](https://getoze.com/about-us/) | Ghana office and business context | Company-reported information |
| [UNCDF Ghana case study](https://www.uncdf.org/article/7271/a-digital-bookkeeping-app-to-improve-access-to-finance-a-case-study-from-ghana) | Independent institutional evidence of earlier Ghana activity | Published 2021; not current market share |
| [LedgerGH](https://www.ledgergh.com/) | Conversational positioning, fictional examples, dashboard | No independently verified traction or integration test |
| [MonAi](https://get-monai.app/) | Input methods, published overview and voice images | No live transcription or automation test |
| [TalkieMoney](https://talkiemoney.com/en/) | Conversation and input-switching images, product description | Platform wording inconsistent; accuracy claims unverified |
| [Khatabook](https://khatabook.com/) and [developer store listing](https://play.google.com/store/apps/details?id=com.vaibhavkalpe.android.khatabook) | Customer/supplier balance image and ledger description | India-focused; no Ghana adoption inference |
| [Copilot dashboard guide](https://help.copilot.money/en/articles/6045480-dashboard-tab-overview) | Review flow, row structure, period comparison | Published guide dated 14 April 2026; imported-record review differs from CashNarra save approval |
| [YNAB features](https://www.ynab.com/features) | Current goal and loan-planning feature references | Broader budgeting model |
| [YNAB planner explanation](https://www.ynab.com/blog/ynab-loan-planner) | Scenario interaction and visible outcomes | Published 2022, updated 2025 |
| [Monarch getting started](https://help.monarch.com/hc/en-us/articles/360048393272-Getting-Started-with-Monarch) | Navigation, summary separation, published dashboard | Broader product and account-import model |
| [Wave accounting](https://www.waveapps.com/accounting) | Cash flow image and upgrade description | Broader suite; not a recommendation about Ghana availability |
| [Wave cancellation guide](https://support.waveapps.com/hc/en-us/articles/21234118811412-Cancel-a-Pro-or-Receipts-Plan-subscription) | Explicit management/cancellation flow and access period | Billing behaviour cannot be assumed for CashNarra until implemented |
| [AbegNo features](https://abegno.com/features/) | Watchlist positioning only | Operating status and traction unverified |
| [Dime developer listing](https://apps.apple.com/us/app/dime-budget-expense-tracker/id1635280255) | Published dated rows, settings grouping, and primary entry control | Published screen reference; no live accessibility or performance test |
| [Lunch Money transaction tools](https://lunchmoney.app/features/transactions) | Grouping, splitting, review filtering, and a focused editor image | Imported transaction tools differ from story interpretation |
| [Lunch Money pricing](https://lunchmoney.app/pricing) | Prominent price-lock promise and explanation for existing customers | Its policies do not automatically define CashNarra's agreement |
| [Cleo](https://web.meetcleo.com/) | Conversational positioning and a distinctive tone | Tone reference only; broader financial services are outside CashNarra's scope |

Neither source research nor this consolidation changed application code, subscription agreements, provider keys, budget journals, or financial records.

### 13.3 Landing, design, implementation, and performance source register

| Source | Used for | Evidence limit |
| --- | --- | --- |
| [CashNarra branch](https://github.com/janelove-tech/CashNarra/tree/work/cashnarra-v1) and [landing source](https://github.com/janelove-tech/CashNarra/blob/work/cashnarra-v1/src/app/page.tsx) | Existing page and fixed sample foundation | Available branch snapshot; later local work is reported separately |
| Supplied CashNarra concept, v2 kit, audit, and decision brief | Product direction, brand and financial constraints | Earlier status and copy yield to current explicit owner instructions |
| Owner's latest implementation report in this conversation | Completed-work baseline | Reported evidence, not independently rerun here |
| [NN/G homepage principles](https://www.nngroup.com/articles/homepage-design-principles/) | Clarity, examples, navigation, simplicity | General guidance; no CashNarra conversion estimate |
| [Copilot Money](https://www.copilot.money/) | Public hero hierarchy and product presentation | Published page and desktop capture; no private analytics |
| [MonAi](https://get-monai.app/) | Explanation of input methods and published product imagery | Marketing claims are not accuracy or adoption evidence |
| [Lunch Money](https://lunchmoney.app/) and [pricing](https://lunchmoney.app/pricing) | Explicit category, start conditions, product proof, price protection | Its trial and commercial terms do not govern CashNarra |
| [YNAB](https://www.ynab.com/) | Connecting a method to human outcomes and planning | Savings/stress claims were not adopted or independently verified |
| [LedgerGH](https://www.ledgergh.com/) | Local terminology and conversational examples | Published positioning; operating quality not tested |
| [NN/G design specifications](https://www.nngroup.com/articles/creating-design-specs-for-development/) | Explicit content, behaviour, layout and scope | Helps handoff quality; does not guarantee error-free implementation |
| [Cursor rules](https://cursor.com/docs/rules) | Persistent rule format and reference behaviour | Agent guidance still requires implementation checks |
| [Web Vitals](https://web.dev/articles/vitals) | Current performance measures and field-data distinction | No new CashNarra performance measurement was made |

The landing report created research and a specification; this combined document consolidates that work. It did not modify the CashNarra application, call its AI providers, change a budget, charge a customer, or deploy the page.

### 13.4 What the evidence does not establish

- Current competitor market leadership, active paid customer counts, retention, satisfaction, Ghanaian adoption, or superiority on financial interpretation.
- Accuracy for Ghanaian names, cedi amounts, negations, or real audio; free-tier entitlement or sustained capacity from an offline adapter test.
- That the owner's latest local build has been run by this research or this consolidation.
- That local journal commitments equal a provider invoice, that unresolved holds are free, or that a failed user task incurred no company cost.
- Live subscription payments, real durable usage counts, or production readiness from mocked states and plan tests.
- Conversion uplift, accessibility certification, field Web Vitals, or task success merely from a polished screenshot, a small preference study, or local Lighthouse output.

The CashNarra adaptations are design recommendations/inferences from the observed sources and agreed product direction. They are not claims that competitors fail the examples or that the proposed page is proven to convert better.

## 14. Coverage map and final delivery checklist

### 14.1 Everything from the two reports has a home

Repeated wording is consolidated. Old scope prompts are replaced by the one master prompt in section 2 and the compact rule in section 10; their implementation constraints and checks are retained. Older general positioning is preserved as research context, while section 8 fixes the chosen public copy. Nothing in the background sections silently expands the active pass.

| Original competitor/UI brief section | Final location |
| --- | --- |
| Current baseline | Section 3, with additional explicit preservation facts |
| The decision | Sections 4.1 and 5; chosen public hero in section 8 |
| How to read the research | Section 5.1 and section 13 evidence limits |
| Shortlist and practical substitutes | Sections 5.2 and 5.5 |
| All twelve detailed competitor profiles, images, adaptation and caution | Section 5.3 and source register 13.2 |
| First use, correction, return, visual craft, narrative proof, graceful limits | Section 6.1; applicable public proof specified in section 8 |
| Recovery, historical hold, retained results, explicit attempts and support | Sections 6.1, 4.4–4.5, 7, and REC checks in 11.4 |
| All six enduring screen contracts | Section 6.2, supported by sections 4 and 10 |
| Six original next-phase priorities and completion evidence | Section 7 as retained context; latest owner scope in section 0.5 takes precedence |
| All twelve Cursor UI/language rules | Section 10.2; compact persistent rule in 10.1 |
| Seven customer tasks, measures, viewport/accessibility checks, mock/live distinction | Section 12.1 and acceptance/evidence section 11 |
| Watchlist and research limits | Section 5.5 and 13.4 |
| Complete source register and direct product-image links | Sections 5.3 and 13.2 |

| Original landing report section | Final location |
| --- | --- |
| Decision, proposed hero, Record → Understand → Plan and no conversion claim | Sections 1, 4.1, 8 and 13.4 |
| Supplied sources, branch/HEAD/blob, later local work, useful existing sample | Section 3 and source register 13.1/13.3 |
| Method and public capture sizes | Section 5.1 |
| Competitor landing patterns and homepage principles | Section 5.4 |
| Six visitor questions and natural progression | Section 8.1 |
| Exact A–H structure/copy, examples, control, pricing, FAQ, closing and footer | Section 8.2 in full, clarified by 8.3 |
| Visual tokens, hierarchy, type/layout, motion, imagery and exclusions | Sections 9.1 and 4.1 |
| Field performance distinction and accessibility requirements | Section 9.2 and 11 |
| Specificity, rules format/reference behaviour, scope and duplicate-rule warning | Sections 1, 2 and 10 |
| All fifteen LP acceptance cases and no-backend distinction | Section 11.2 in full |
| Customer comprehension, minimal analytics and later experiment | Section 12.2 |
| Paste-into-Cursor prompt | Section 2, merged into one canonical prompt |
| Source register and evidence limits | Sections 13.3–13.4 |

### 14.2 Scope and review checklist for Cursor

Use the reported progress in section 0. An unticked reference item here is not evidence that Cursor failed to implement it. Reconcile current evidence and retain completed work.

- [ ] Read this file and the actual current repository instructions/checkpoint; preserve later local work.
- [ ] Identify current files and equivalent rules before adding anything.
- [ ] Preserve the reported landing A–H implementation and chosen copy; repair only demonstrated acceptance gaps.
- [ ] Preserve both working fictional examples; confirm any missing evidence for financial meaning, initial state and accessible transitions.
- [ ] Keep public prices/allowances in the shared source; protect existing agreements and private Unlimited.
- [ ] Preserve voice, what-if, ledger/privacy safeguards, provider state, budgets, historical holds, and completed app fixes.
- [ ] Reconcile applicable LP evidence, run missing/failed/change-affected checks only, and inspect the real diff and relevant shared consumers.
- [ ] Label unrun, historical, external, and failed checks honestly; fix in-scope failures.
- [ ] Update the existing checkpoint/build log and give a plain-English outcome and exact next action.
- [ ] Preserve section 15 and recorded UI results. Follow section 0.5; do not restart UI, backend recovery, live usage/payment integration or deployment. Complete a live voice check only under existing valid consent/authorisation.

### 14.3 Source fingerprints

These fingerprints identify the two supplied inputs used for the completeness comparison. They are not application build identifiers.

- **Competitor/UI brief:** SHA-256 `3e6d1a42d6215944c653c9c97c07a5db79628dc3b52f67a0a2dcb5bf8eca4649`.

- **Landing specification:** SHA-256 `72cd5a735ead41994e8ecd2bfcef77796d2614192fbe161c99caee877a5188c9`.

**Owner use:** give Cursor this updated file and section 2. Section 0.5 records reported completed app UI, exact remaining checks, historical results and known failures. Section 15 remains the implemented screen contract. Both original research reports are retained. This update changes the handoff only; it does not run live checks or alter app/provider/data state.


## 15. App UI/UX implementation contract — reported implemented

**REPORTED IMPLEMENTED; PRESERVE.** This was the explicit wider UI task, and the owner now reports it implemented with the evidence and limits in section 0.5. Retain these screen contracts without restarting the pass. Current next work is the stated Phase 08 verification, not another redesign or backend integration.

No new live audit of the owner's latest build is claimed here. Cursor must inspect that build, retain completed improvements, and implement the remaining presentation/interaction gaps. If a requirement is already met, preserve it and record evidence rather than changing it merely to produce a diff.

### 15.1 Intended visible result

The app should feel like one deliberately designed product: a clear place to enter a story, a compact place to check its records, an orderly history, understandable numbers, a useful goal scenario, and settings/plan actions that are easy to find. The recurring visual signature is **a person's words becoming aligned records and a clear result**. This is an application of the existing Narra system, not a new identity.

| Area | The visible change to implement where still needed | Existing work that must remain |
| --- | --- | --- |
| Shell | Consistent workspace context, page header, navigation state and content width; clear screen purpose and primary action | Existing routes, destination names and permissions; no hiding Goals, Explore what-if, Pricing or Plan and usage |
| Today | A focused story composer and compact recent activity/unfinished draft, with secondary tools kept quiet | Date beside the story, Understand my story next, Draft backup secondary; typed and voice routes both usable |
| Review | Short editable record rows, source phrases in reach, one material question at a time, one clear Save N records action | Human confirmation, current validation, exact atomic save and receipts |
| Records and Accounts | Scan-friendly rows, readable dates/amounts, visible account context, debt direction and traceable balances | Existing filters, source/correction rules, unknown-balance state, transfers and debt classification |
| Money Stories | One period, three clear primary figures, readable explanations and source drilldowns | Money in/out/net movement, whole amount pairs, responsive stacking, thin zero bars and singular wording |
| Goals | Clear target/set-aside/remaining relationship, visible Explore what-if and a readable assumption/result comparison | Existing forecast rules, restored action, no record mutation from a scenario |
| Settings | Consistent grouped controls and short explanations; destructive actions visually separate | Current stacked layout, Reminders, separate Delete original stories confirmation and retained records |
| Plans and account | Consistent cards/benefit rows and findable upgrade/manage/cancel actions appropriate to the real state | Shared catalogue, USD-first offer, price protection, unknown counts, subscription rules and truthful Plus review |

### 15.2 Shared visual and interaction grammar

- Reuse existing Narra variables and CSS Modules. Keep the violet mark `#5B49C7`, ink name `#29263D` and actual reversed asset on dark surfaces. No logo redraw, palette replacement, imported competitor mascot or new UI framework.
- Manrope is for headings. Use Inter for body, controls, dates, all cedi amounts and tables. Use the approved spacing scale. Typical body is about 16/24px and secondary help about 14/20px, subject to readable reflow; do not create tiny text to squeeze a card.
- Give each screen one primary heading and one main action for its current state. Use a consistent header for workspace, purpose, optional period and relevant action. Keep supporting explanations short and close to the item they explain.
- Use rows, alignment and dividers for related records and settings. Reserve cards/surfaces for a distinct task or summary. Avoid equal-sized cards for every paragraph, oversized amounts on every screen, excessive shadows, decorative gradients, repeated icons and giant empty editors.
- A financial row has a description, relevant secondary context and a readable amount aligned consistently. Keep each currency/number pair intact; move context or the whole amount to the next line when needed. Do not ellipsise real money. Long names and source text must remain available through wrapping or an accessible detail view.
- Keep controls comfortably operable using the existing 44–48px design preference, visible focus, clear names and sufficient contrast. Use text plus shape/icon for status; colour alone is insufficient. Do not use a fixed row height that clips enlarged text.
- Keep navigation labels stable, current location visible and workspace switching distinct from account switching. Improve grouping and spacing without creating extra top-level destinations. Use the existing responsive navigation pattern; do not make essential actions icon-only without an accessible label.
- Keep motion brief and purposeful, within the existing tokens, with reduced-motion equivalence. A field edit or loading state should not cause layout jumps or move focus unexpectedly. Important content appears immediately.

### 15.3 Today, voice and review: one complete task

**Today layout:** show the current workspace and relevant date, a compact composer headed **What happened with your money?**, then the main **Understand my story** action. Keep typing and the recording control within the same entry area, with manual entry secondary. Preserve the existing selected date, draft persistence and backup behaviour; do not discard text when switching input method or workspace under the existing rules.

For a first visit, provide one clear example/entry invitation, not a questionnaire. Request an account or a balance only where financial meaning requires it. Missing opening balance must not prevent a valid record. For a returning person, distinguish an unfinished draft, an empty workspace and a completed day. **Finish your draft** should lead to the actual retained draft. Keep recent activity compact and reachable after saving. No guilt, points for financial activity or claim that an unrecorded day had no money movement.

**Voice presentation:** preserve the configured voice path. Before/during recording show the applicable plan length limit and elapsed time. Progress through start → stop → editable words → interpretation using existing orchestration. Show one relevant action at each stage. Keep typed entry available. A completed transcript never shows a saved-record success state. Keep the action reachable when a transcript grows or a keyboard opens. No new recording/transcription is needed to implement this UI.

**Clarification:** ask one focused question whose answer changes financial meaning. Show the relevant source phrase and compact labelled choices where appropriate. Preserve previous answers and text. The fictional “My brother gave the business GH₵5,000” example can ask whether it was a loan, money invested in the business or a gift. Do not add blanket confirmation of already explicit details.

**Batch review:** use a heading such as **Check these 3 records**. Keep event, amount, date, account and relevant person readable. Provide **Change** beside a row and a source phrase within reach, expanding secondary details when needed. Reuse the existing review/edit validation and payload. Editing one proposal does not automatically send the narration for another paid reading. Distinguish it from correcting an already saved record.

Keep **Save N records** visible and usable while the list scrolls, without covering content on a small screen or zoomed view. Use the real count and singular/plural. A submission disables duplicate activation under existing rules, retains context and shows success only after the authoritative receipt. No global oversized dialog or long prose acknowledgement should replace the row review.

After saving, show the actual saved result and a useful existing consequence/source link, such as a known debt's remaining balance. Do not invent a balance. Offer the next supported action, such as another story or viewing the saved records. On failure or an unresolved attempt, keep the words and one accurate message with supported actions. Presentation changes may expose existing recovery/manual actions but must not create a retry/persistence engine or claim a missing result was recovered.

### 15.4 Records, Accounts and Money Stories

**Records:** use a scanning layout with quiet date group headings, readable descriptions and consistent amount alignment. Keep search and relevant existing date/account/type filters near the list and make active filters clear. Preserve workspace/period when opening a detail and returning. Show related records from a story together where the existing model supports it; retain the original words and correction history. Do not introduce new advanced table features just to mimic Lunch Money.

**Accounts and debt:** label recorded balances honestly and provide the existing starting-balance action when unknown. Show changes when a total cannot be established. Within supported person/debt views, use **People owe you** and **You owe**, with the name, remaining amount and supporting records. A settlement remains linked to the earlier debt. Use direction words, not only red/green. Reuse existing data/selectors; do not add a new debt model or fabricate unavailable balances.

Use the review fixture from section 6.2: sale GH₵500, settlement GH₵100 and Cash → MoMo transfer GH₵200. The transfer is not an expense or new workspace money; settlement is not another sale. UI labels, grouping and totals must preserve that distinction.

**Money Stories:** put the selected period and workspace in the header, then **Money in**, **Money out**, **Net movement**, in that order. Explain net movement once in a small readable line; never rename it profit. Reuse deterministic totals and drill down to the same included records/period/workspace. Use matched periods for comparisons or make the difference explicit.

Keep complete amounts at narrow desktop content widths as well as phone widths. Preserve existing amount stacking, thin zero lines and singular record wording. Unknown, zero and no records have different presentations. A decorative filled bar must not imply a nonzero amount. Keep report chapters/explanations subordinate to the main answer; avoid repeated caveats or duplicate totals. Preserve the designed activity PDF and actual export formats.

### 15.5 Goals and Explore what-if

Each goal clearly presents its name, target, amount already set aside, remaining amount and the existing estimate/assumption where available. Use one restrained progress treatment that does not claim more than recorded allocations establish. Show **Explore what-if** as a labelled action on every applicable goal; do not bury it in a menu or hide it behind insufficient history when a manual assumption is supported.

Inside what-if, place the current amount/assumption beside **Try a different amount**, then show the changed estimate. Explain whether it is based on recorded history or a monthly amount the person entered. Show assumptions briefly. Exploring uses existing pure logic and changes no saved record, goal allocation or actual account balance. A separate **Use this amount** control, if already supported, must say what it updates and follow existing confirmation rules.

Preserve the restored real GH₵600 example and forecast logic. The public fictional GH₵300/500 illustration is separate; do not hard-code its three/five-month answers into real goals or replace recorded-allocation logic with an AI estimate.

### 15.6 Settings, pricing and Plan and usage

**Settings:** group the existing controls by purpose using concise headings, such as workspace/account, preferences/reminders and data/privacy, only where those controls actually exist. Preserve controls stacked under their explanation. Keep the relevant workspace/account context clear. Do not invent new preferences, integrations or support pages. Keep **Delete original stories** separate from routine settings, with its existing confirmation and explicit statement that saved records remain. Do not combine it with account deletion or a generic delete button.

**Pricing consistency:** retain the existing working page and catalogue. Improve alignment, benefit hierarchy, spacing and explanatory text if needed; do not rebuild already fixed currency formatting or offers. Both cards clearly lead with **Unlimited financial records**. Explain unclear AI story, voice note and report pack benefits in smaller readable text. Keep the exact Free/Plus limits in section 4.2, including Plus's **2-minute** note limit. Reuse USD-first pricing, the $2.00 standard strike-through, dated approximate GHS conversion and rounding to GH₵0.10. Future Unlimited stays private/deactivated and absent from public data/markup. No availability/development notes on the offer.

**Plan and usage:** make this account screen easy to reach from the existing workspace/account navigation. Show the actual plan and agreed price, a workspace count where real, and any actual usage/reset evidence. Unknown counts remain unknown; do not turn them into zero, a fabricated allowance remaining, a fake progress bar or a permanent loading spinner. Use the current honest unknown-state wording without exposing provider journals or engineering details.

Keep **Upgrade to Plus** visible for Free and the existing safe review route. In actual paid recurring states expose **Manage subscription** and **Cancel subscription**; show the paid-through date when cancellation is scheduled, and reversal only if supported. Non-renewing states use **Renew Plus / Switch to Free**. Failed/pending payments retain correct current access and truthful status. Cancellation and downgrade use the already implemented rules; do not require a new payment connection merely to render/test those states with mocks. Do not show a cancellation button for a Free account or claim a recurring payment was stopped without evidence.

### 15.7 Required screen states

Check each affected screen's applicable empty, populated, loading, invalid, error, unresolved and success states. Billing-specific states use the actual subscription model. One message describes one issue and one useful next action; related validation stays by the field/row. Keep retained work and financial context visible. An unknown value is not a skeleton forever. Buttons need real handlers and visible outcomes; an unsupported capability must not be faked by a decorative control.

Use the plain-English copy in sections 6 and 10. Do not expose provider model names, reserve amounts, pause paths, certificate traces or token budgets in ordinary customer flows. Keep those in private operational evidence. This is a UI implementation pass, not permission to invent or clear backend state.

### 15.8 Implementation units and acceptance

Read the current branch/checkpoint, then implement coherent units within the existing phase: shared shell/components; Today/voice/clarification/review; Records/Accounts/Money Stories/Goals; Settings/pricing/Plan and usage; verification. Update the checkpoint after each unit so another session resumes the exact work. Extract presentation incrementally from existing components; do not rewrite the large app component or ledger merely to improve layout. Inspect actual paths first; names such as `cashnarra.tsx`, `batch-review.tsx`, `record-form.tsx` and `workspace-tools.tsx` identify foundations seen in the older snapshot, not a guarantee that the latest app is organised identically.

This document update did not independently run these requirements. The newer owner report records UI-01–UI-11/UI-14–UI-18 passes in the stated local scope, historical UI-12/UI-13, and specific unrun/failing checks in section 0.5. Retain those distinctions. Do not infer complete live voice, empty-day or screen-reader coverage from a case ID.

| ID | Required check | Expected result |
| --- | --- | --- |
| UI-01 | Current baseline and final diff | Preserve local work, reported completed fixes, landing page, configured services and protected domain code; identify actual changed screens/components. |
| UI-02 | Shared shell and visual system | Same logo, fonts, spacing, headers, nav state, action hierarchy and focus grammar across affected screens; no competing component/design system. |
| UI-03 | Today first/returning/unfinished states | Clear entry, existing date, manual/typed/voice paths, retained draft and useful recent/result state; backup stays secondary and no guilt/false zero-day claim. |
| UI-04 | Mock voice stages and input switching | Correct elapsed/limit display and start/stop/edit/understand progression; words retained; transcript never appears saved; no live transcription or paid call. |
| UI-05 | Clarification and review editing | One material question, source context, readable row details, local proposal editing, retained answers and no automatic paid reread. |
| UI-06 | Save/result/failure transition | Correct Save N label, no duplicate activation/save, success only after receipt, failure retains words and truthful supported actions; no backend retry rewrite. |
| UI-07 | Records/history | Existing filters and workspace/period survive detail/return; long content remains readable; source and correction history are reachable. |
| UI-08 | Accounts/debt meaning | Recorded/unknown balance states remain distinct; supported debt direction and source records visible; settlement and transfer labels remain correct. |
| UI-09 | Money Stories | One period; exact in/out/net; matching drilldowns; correct zero/unknown/no-record state and no profit label or duplicate totals. |
| UI-10 | Goals/what-if | Existing action easy to find; target/set-aside/remaining/assumption/result readable; scenario uses existing calculation and changes no actual financial record. |
| UI-11 | Settings and privacy controls | Existing controls grouped and readable; Reminders and Draft backup remain correctly placed; destructive story deletion retains its confirmation and saved-record boundary. |
| UI-12 | Public pricing and account plan | Shared real catalogue, unlimited records clearly stated, exact agreed limits/prices, protected agreement and dated GHS display; private Unlimited absent; unknown counts not fabricated. |
| UI-13 | Mock subscription states | Free upgrade; recurring manage/cancel; scheduled end; non-renewing renew/switch; failure/pending correct access; excess workspaces readable. No real charge or false success. |
| UI-14 | Responsive and content stress | 320/360/390/768/1024/1440 widths, short/tall phone and intermediate sidebar content; long names/transcripts, large/negative amounts, unknown/zero and enlarged text reflow without clipping or blocked actions. |
| UI-15 | Accessibility and focus | Keyboard sequence, labels, focus after edit/dialog/reveal, status feedback, contrast, zoom and reduced motion work in available test environments; screen-reader/real-phone checks labelled honestly if unavailable. |
| UI-16 | Empty/loading/error/unresolved states | One accurate message, retained work and supported next action; no perpetual loader for unknown data, duplicate alert, dead control or fake recovery. |
| UI-17 | Relevant existing checks | Appropriate type/lint/build and focused component/task regressions pass for the change; inherited failures are accurately separated. No copy-only tests or repeated suites without justification. |
| UI-18 | Scope, evidence and handoff | No data/budget/hold/provider/price-policy/permissions change; preserve open LP/manual/field limits, update checkpoint/build log, report actual outcomes and next action in plain English; Phase 08/09 status remains truthful. |

Finish with a screen-by-screen list of visible changes and why they help, relevant evidence and unresolved dependencies. Do not label the whole UI complete from a few static screenshots, or the entire phase complete because this presentation pass is done. The delivered result must be implemented screens and working supported transitions; if blocked, record the exact remaining unit and continue independent in-scope work.
