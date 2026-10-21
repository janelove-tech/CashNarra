# CashNarra build log

Evidence only. A command is PASS only when the agent who wrote the entry ran it.

## Phase 00 started

Date: 2026-10-16
Agent: Cursor
Commit: not yet committed
Branch: `work/cashnarra-v1`
Baseline: `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92` (`main`, matched the forensic audit)

Implemented:

- Confirmed no later commits and no `codex/cashnarra-v1-remediation` branch.
- Added the shared handoff and GitHub Actions CI.
- Preserved `docs/Repository Audit Plan 1248pm 16th October.txt` unchanged.

Executed:

- `git status`, `git branch --show-current`, `git rev-parse HEAD`, `git log --oneline --decorate -15`, `git remote -v` — recorded in `harness/context/00-baseline.md`.

## Phase 00 checkpoint

Date: 2026-10-16
Agent: Cursor
Commit: pending the Phase 00 commit
Branch: `work/cashnarra-v1`

Implemented:

- Shared handoff, phase files, and `.github/workflows/ci.yml`.
- No product or financial behaviour changes.

Executed:

- `npm ci` — PASS — after stopping Next processes that locked the SWC binary. First attempt FAIL with EPERM.
- `npm run doctor` — PASS — Node 24.21.0, AI and voice disabled.
- `npm run lint` — PASS — 2 existing warnings in `src/components/voice-capture.tsx`.
- `npm run typecheck` — PASS.
- `npm test` — PASS — 64 tests.
- `npm run build` — PASS — Next.js 16.4.0.
- `npm run test:db` — PASS — disposable `cashnarra_test` only.
- `npm run test:supabase` — PASS — local API port 58321 only.
- `npm run test:e2e` — FAIL — 24 passed, 1 failed. Auth test saw “Opening your records…” until the 5s expect elapsed.
- `npx playwright test tests/e2e/auth.spec.ts` — PASS — rerun after compile, 1 passed.

Not run:

- GitHub Actions itself — workflow added, not executed from this machine.
- Live OpenAI or transcription evaluation — EXTERNAL. AI and voice are disabled locally.
- `npm audit fix` — 5 high-severity findings reported by `npm ci` and left unchanged.

Historical evidence in `docs/BUILD-STATUS.md` is not relabelled as PASS for this session.

## Phase 00 complete

Date: 2026-10-16
Agent: Cursor
Commit: `cff81ec46544a10ec2805f44faf2a29560c28bbc`
Branch: `work/cashnarra-v1`

## Phase 01 checkpoint

Date: 2026-10-16
Agent: Cursor
Commit: pending the Phase 01 commit
Start: `cff81ec46544a10ec2805f44faf2a29560c28bbc`

Implemented:

- `credit_expense` posts debit `expense` / credit `payable:<id>` with no cash movement.
- Settlement uses `payable_payment` and does not add another expense.
- `credit_purchase` still posts stock.
- Template parity test covers every event kind. Database journal for the fixture matches `ledger()`.

Executed:

- `npm test` — PASS — 85 tests.
- `npm run test:db` — PASS — isolated `cashnarra_test`.
- `npm run lint` — PASS — 2 existing voice-capture warnings.
- `npm run typecheck` — PASS.
- Browser — PASS — synthetic demo review and save. Balances stayed GH₵5,970.00. Money out stayed GH₵930.00.

Not run:

- `npm run build`, `npm run test:supabase`, and `npm run test:e2e` after the Phase 01 edits.
- `supabase migration up` — not used. Local migration history is incomplete. The new function was applied with `psql` and the 18 local workspaces were kept.

## Phase 01 complete

Date: 2026-10-16
Agent: Cursor
Commit: `6cb30d92075ce5eead15c6ee4e337b41f01c1886`
Branch: `work/cashnarra-v1`

Phase 02 is open and incomplete. No narration code has been changed yet. See `harness/context/02-narration-gaps.md`.

## Phase 02 deterministic contract checkpoint — 2026-10-16 — Codex

Reconciled clean work/cashnarra-v1 HEAD 29aeadab85d4e07faf3880e55ed863ac7415b53e against the older HEAD noted in CURRENT. Extra commits were handoff-only; Phase 01 preserved.

Implemented: workspace type in model input; application-owned proposal IDs with question relinking; explicit missing account/destination/person/amount/date/debt clarification; settlement direction/loan/party consistency checks; separate model_uncertainty versus validation metadata; no input mutation. Added 28 reviewable synthetic cases and an offline captured-output scorer (npm run eval:narration -- <results.json>). No provider call, financial posting change or database migration.

Official model check: snapshot still available, deprecated October 14 with January 14 2027 shutdown. Retained configurable default pending comparative evaluation. Sources and decision: harness/context/02-model-check.md.

PASS: npm test (87 tests); npm run typecheck; npm run lint (two pre-existing voice warnings); npm run build. Initial new test failed due to regenerated random fixture IDs; fixed and all tests rerun PASS. Offline scorer inventory: 28 cases, evaluation NOT RUN, provider EXTERNAL. Live semantic quality, silent-guess and invalid-ID rates are EXTERNAL, not zero or PASS. The corpus is not a general mock interpreter.

Phase 02 code acceptance complete with live-provider quality explicitly EXTERNAL. Next: Phase 03 required V1 voice, retaining quality gates.

## Phase 03 code checkpoint — 2026-10-16 — Codex

Phase 02 commit: 3395aa3. Preserved existing recorder/validated WebM path and common text interpretation/review/save pipeline. Fixed both voice lint warnings. Transcription route rejects unsupported MP4 at entry, validates text type/emptiness/length through shared helper, checks request cancellation before provider work and after response, forwards AbortSignal to SDK. Added isolated route tests with explicitly mocked provider/container boundaries; existing container tests remain separate.

PASS: npm test (94 tests); npm run lint (zero warnings); npm run typecheck; 16 Playwright voice/core journeys including 320/390/768/1440 light/dark, correction/export/recovery/isolation; npm run build. No live provider or physical microphone used. Physical microphone and representative Ghanaian speech quality: EXTERNAL/NOT RUN, protocol in context/03-voice-quality.md. No claim of production voice readiness. No auto-post path added.

Phase 03 code acceptance complete with device/provider evidence outstanding as allowed by phase file. Next phase 04: extract narration review boundary preserving markup, callbacks, focus and recovery.

## Phase 04 complete — 2026-10-16 — Codex

Extracted BatchReview as the narration clarification/review boundary: questions, correction reason, proposed rows, retained source, duplicate evidence, atomic-save explanation and recovery controls. Parent retains authorised mutation/state ownership; component receives explicit callbacks and presentational rows. No token/layout redesign or domain changes.

PASS: 94 unit tests; lint zero warnings; typecheck; 14 core Playwright journeys (review/save/correction/export, clarification, lost response, offline drafts, isolation, four widths in both appearances); production build. Voice phase commit 8d685c8. Next phase 05 scoped workspace loading and measured costs.

## Phase 05 complete — 2026-10-16 — Codex

Added metadata-only summary listing and ownership-filtered single-state reads. App startup/workspace selection fetch summaries plus one workspace; mutation refresh loads only affected state and summaries; move destination loads lazily with cancellation. Session/load revision prevents stale refresh restoring state after sign-out. Legacy full GET retained for existing integration/export callers, not used for app navigation.

PASS: 94 unit tests; typecheck and lint zero warnings after correcting initial optional-target callback error; full 26-browser suite including actual local Supabase auth, scoped-read ownership, offline recovery/logout and lost-response behavior; production build.

Measured with scripts/measure-workspaces.ts: 10 synthetic payload workspaces with 1000 records each. All states 3,050,431 bytes / 14.09 ms mean JSON parse; summaries 701 bytes / 0.0037 ms; one state 305,042 bytes / 1.31 ms. 100 parse iterations. Payload fixture only, not posting-valid data. Server/render timings NOT RUN and not inferred. No schema normalisation, migrations or production operations.

Phase 04 commit 9807f90. Next Phase 06 SQL grants/search_path review using official PostgreSQL/Supabase docs.

## Phase 06 complete — 2026-10-16 — Codex

Official PostgreSQL/Supabase function guidance fetched; evidence in context/06-security-evidence.md. Added migration 010: empty definer search paths, narrow explicit function grants, maintenance/trigger execute restrictions, revoke client public-schema creation. Ownership/RLS, financial journals and atomic operations unchanged.

PASS: disposable test:db including new ACL/path checks plus concurrency/idempotency/rollback/isolation; real local test:supabase before and after additive 010. Applied only 010 on localhost:58322, 20 existing workspaces preserved. No reset or migration-history rewrite. Source scan: provider keys only server/API modules; no service-role references in src. Existing public-only SW/private API cache boundaries preserved. Not an independent security certification.

Phase 05 commit e950df3. Next phase 07 reports/goals/export and accessibility evidence.

## Phase 07 checkpoint — 2026-10-16 — Cursor

Preserved Codex phases 02–06. HEAD before this work was `4897fc0`. Uncommitted export and record-form edits were kept and finished.

Implemented: recorded-expense totals in CSV/XLSX rows and the PDF summary; explicit unavailable-profit line; what-if copy states it is not a guarantee and does not change allocations; invalid amounts are associated with the alert and focused; dialog Tab is contained and Escape restores the opener.

Executed:

- `npm test` — PASS — 95 tests.
- `npm run lint` — PASS — zero warnings.
- `npm run typecheck` — PASS.
- `npm run test:db` — PASS — disposable `cashnarra_test`.
- `npm run build` — PASS — Next.js 16.4.0.
- `npx playwright test tests/e2e/accessibility.spec.ts` — PASS — 1 test, after adding an explicit dialog Tab cycle. First run FAIL because Tab left the dialog.

Not run:

- Screen reader, physical assistive technology, automated contrast, and a separate 200% zoom pass — NOT RUN. 320px reflow was checked.
- Live narration and representative voice quality — EXTERNAL.

## Phase 07 complete

Date: 2026-10-16
Agent: Cursor
Commit: `01108da07fe946b328fc705aa560832d0afadc4d`

## Phase 08 verification — 2026-10-16 — Cursor

Reviewed the branch after `01108da` without assuming earlier phases were correct.

Verdict: `NOT V1 COMPLETE`

Executed on this tree:

- `npm run doctor` — PASS — Node 24.21.0, AI and voice disabled.
- `npm run lint` — PASS — zero warnings. Ran on the Phase 07 tree immediately before its commit.
- `npm run typecheck` — PASS — same tree.
- `npm test` — PASS — 95 tests, rerun after the Phase 07 commit.
- `npm run test:db` — PASS — disposable `cashnarra_test`. Ran on the Phase 07 tree immediately before its commit.
- `npm run test:supabase` — PASS — local API `127.0.0.1:58321` only.
- `npm run test:e2e` — PASS — 27 tests, including auth, accessibility, voice controls, recovery, and 320px layouts.
- `npm run build` — PASS — Next.js 16.4.0. Ran on the Phase 07 tree immediately before its commit.

Not run:

- `npm ci` — NOT RUN. The existing install was used. A clean install was not repeated.
- Representative voice transcription quality — EXTERNAL.
- Live narration evaluation — EXTERNAL.
- Screen reader and contrast audit — NOT RUN.
- Phase 09 provider, regulatory, and launch decisions — EXTERNAL.

No production deploy, paid provider call, or database reset.

## Handoff reconciled — 2026-10-16 — Cursor

Git HEAD was already `3020dafaefdad2f3f0e3100452add83a773ff576`, the Phase 08 verification commit. The worktree was clean. `origin/work/cashnarra-v1` remained at `4897fc0`. No product code changed. Phase 09 stays EXTERNAL. Verdict remains `NOT V1 COMPLETE`.

## Phase 09 register — 2026-10-16 — Cursor

The user asked whether Phase 09 can continue while Phase 08 is parked. It can be documented. It cannot be resolved, and it does not replace the parked evidence.

No product code, provider call, purchase, or deployment. Every launch gate remains unresolved. Phase 08 return items stay in `harness/build/08-release-verification.md`.

## Phase 08 local verification return — 2026-10-16 — Codex

Reconciled clean Cursor HEAD `4465381` against stale CURRENT (`152debd`, register ready to commit). Preserved all Cursor product work. Latest instruction to execute unblocked phases resumed local release evidence rather than restarting the audit.

Added development-only axe Playwright text-contrast checks: four light/dark mobile/desktop scenarios, all 28 scans with zero violations or incomplete results. Added actual 200% Edge zoom checks using disposable profiles, verified pixel ratio/reduced layout viewport, keyboard-contained record dialog and review. Two zoom journeys PASS; physical-surface screenshots visually inspected. Harness navigation, server-lifecycle and zoom preference/measurement issues corrected; details in `harness/context/08-local-release-evidence.md`.

PASS after fresh npm ci: doctor, lint zero warnings, typecheck, 95 unit tests, isolated PostgreSQL, local Supabase integration, full 31-test browser suite and production build. Two zoom tests added afterwards passed separately. No production reset/migration, deployment or paid calls. Production npm audit: zero advisories. Development audit: five entries trace to braces stack exhaustion in Next ESLint chain; suggested downgrade to v14 not applied, unresolved upstream.

User explicitly approved US$5 cumulative narration/voice evaluation spend; recordings to follow. Local API key absent, spend US$0. Approval persists; do not ask again. Missing key/representative recordings/screen-reader evidence remain external; non-text contrast not tested. Verdict remains NOT V1 COMPLETE; Phase 09 unresolved. Updated CURRENT/PLANS/phase files for continuation without chat context.

## Evaluation runner parked — 2026-10-16 — Cursor

Preserved the uncommitted runner on top of clean `df2ae47`. Production extraction and the opt-in CLI now share one request builder. Scoring no longer treats validation-added questions as a definite model match. The payable corpus case names Adjei Packaging, the fixture counterparty. Added a fail-closed cumulative budget journal and `npm run eval:capture`.

PASS: 102 unit tests, typecheck, lint, and the default capture command. That command reported 28 cases, key absent, and made no provider call. `next-env.d.ts` was restored. The existing US$5 ceiling stays; local spend remains US$0. Live narration and voice stay EXTERNAL. Phase 09 remains an unresolved register and does not wait on this runner to be listed. Verdict remains NOT V1 COMPLETE.

## Parked handoff reconciliation — 2026-10-17 — Codex

Read the shared instructions, goals, plan, current handoff, latest log and phase register. Git confirmed Cursor commit `68c792a1d6794f617814a722966d16df77bbf397`, clean worktree, six commits ahead of the local origin tracking ref. Preserved the committed runner. Presence-only configuration check: API key absent, AI/voice disabled. No matching test recordings or consent files under `.local`. No provider calls, spend, production actions, fetch or push. Existing tests remain HISTORICAL PASS; no product changes warranted rerunning them. Updated CURRENT with the exact external prerequisites. Phase 08 parked; Phase 09 EXTERNAL; verdict NOT V1 COMPLETE.

## Live narration evaluation — 2026-10-17 — Codex

Resumed from clean cc713c7 (seven ahead), preserved Cursor work. Key now present. Diagnosed Node certificate trust with a non-generative invalid request, used NODE_USE_SYSTEM_CA=1 without bypassing TLS. Four synthetic runs completed but all failed quality. Retained explicit field-rule prompt (22/28, zero silent guesses in that run); removed illustrative example addition which regressed to three silent guesses. Added safe error diagnostics plus two privacy-focused tests. PASS: 104 unit tests, typecheck, lint, production build. Tests/build required Windows sandbox escalation; no approval rejection. Raw captures stay ignored. US$0.493565 committed/reserved of approved US$5; invoice not reconciled. No AI/voice enablement, deployment, push, database reset or production action. See 08-evaluation-runner.md for run IDs and exact results. NOT V1 COMPLETE. Next: supported-model comparison with verified pricing and existing budget; representative voice still needs consented recordings.

## Replacement comparison — 2026-10-17 — Codex

Official replacement-model rates checked; added evaluation-only --compare-luna using the same cumulative budget and conservatively higher old rates. Production configuration unchanged. PASS: 28/28 unchanged synthetic cases, no silent guesses or invalid outputs; inspected account, party and obligation references. Private run 388f7100-40b5-4814-8376-d65affb4b5da. Typecheck PASS. Total conservative committed/reserved US$0.513235; remaining US$4.486765. Representative voice still EXTERNAL pending consented recordings; no quality enablement, production deployment or push. Updated CURRENT for zero-context continuation. NOT V1 COMPLETE.

## Scoped non-text contrast — 2026-10-17 — Codex

Reconciled clean 49a02f6, nine ahead of local origin. No audit restart. Representative recordings still absent under .local. Completed an unblocked Phase 08 verification item: eight browser contrast journeys, four widths/light-dark, field boundaries/icons/keyboard focus. Initial transition-timing failures fixed in test harness; all eight PASS. Typecheck/lint PASS. Product unchanged, prior build/unit/database evidence HISTORICAL PASS. No provider calls/spend, push or deployment. Updated CURRENT and stale PLANS evaluation status. NOT V1 COMPLETE; representative voice and manual accessibility evidence remain outstanding.

## Resume pending commit and expand contrast coverage — 2026-10-17 — Codex

Read shared sources in order; Git showed the previous contrast/evidence changes uncommitted at 49a02f6. The earlier approval-service quota failure had prevented the commit. Retried through normal approval successfully, preserving the unit as 495ee1a. Expanded its eight browser journeys to Records, Money Stories and Plan (48 measured states). Fixed a mobile navigation timeout caused by Next.js developer overlay using keyboard navigation; all eight journeys PASS. Typecheck/lint PASS; product/build/database results stay HISTORICAL PASS because runtime code is unchanged. Restored generated next-env.d.ts drift. Updated CURRENT. No provider spend, push, deployment or production action. Voice recordings and real screen-reader evidence remain external; NOT V1 COMPLETE.

## Offline voice intake preparation — 2026-10-17 — Codex

Read the prescribed handoff, phase and referenced voice protocol, then reconciled clean ba750a9 (eleven ahead). Added npm run eval:voice-intake with strict private metadata schema, consent/deletion dates, unique clip/file and corpus checks, speaker/device/condition coverage, bounded contained file reads, and the application's WebM duration/structure validator. Added an intentionally unapproved template and collection instructions to the voice protocol. It cannot contact a provider or grant quality approval. PASS: three focused tests, typecheck, lint. Default command correctly returned NOT READY for absent intake; no real audio evaluated. Existing product build/browser/database results remain HISTORICAL PASS. No paid calls or configuration changes. CURRENT updated. NOT V1 COMPLETE; actual consented recordings and manual accessibility evidence remain external.

## Voice-input prerequisite checkpoint — 2026-10-17 — Codex

Read the required handoff sequence and referenced voice protocol; Git clean at fc25cfb, twelve ahead of local origin. Checked the exact next action: .local/voice-evaluation/manifest.json is absent. No authentic speaker recordings/consent can be manufactured by coding. Preserved all work and updated CURRENT; no product changes or repeated validation, provider calls/spend, push or deployment. Existing passes remain historical. Await actual private intake and consent review for representative voice; manual accessibility and Phase 09 gates remain outstanding. NOT V1 COMPLETE.

## Authorised local typed narration — 2026-10-17 — Codex

User explicitly requested enabling their own stories after encountering mock-only processing. Enabled AI_ENABLED=true, OPENAI_MODEL=gpt-6-luna and LOCAL_AI_BUDGET=true in ignored local configuration only. Added cumulative pre-call reservation/usage settlement to realExtract using the existing US$5 evaluation journal, 100KB request bound and tested model; no source text or source fingerprints written to that journal. Uncertain calls keep reservations; no retries. Explanations are disabled in this local-budget mode; voice remains disabled. Existing per-user daily quota, ownership, interpretation validation and reviewed deterministic save remain in force. Restarted verified local server on 3100 with system certificate trust.

PASS: nine budget/narration tests, typecheck, lint, production build and one real synthetic adapter smoke check (no records saved). Cumulative committed/reserved now US$0.513872, including uncertain prior reservation; remaining US$4.486128. Local interactive story calls share this ceiling. This is not production launch or general voice-quality approval. Updated CURRENT; no push/deploy.

## Everyday wording, percentage confirmation, longer clips — 2026-10-19 — Cursor

Resumed from clean `694e2ff` with the interrupted product work uncommitted. Preserved it. Finished the wording pass, kept percentage totals in deterministic code, and left transcription disabled after the earlier 401 missing_scope result. No new provider call and no budget-journal change.

PASS: 111 unit tests, typecheck, lint, and 42 Edge browser tests. Sample Plan page shows the shorter goal explanation and the included-money list, with no visible “svg” label. Recording remains three minutes; voice quality is not approved. Phase 08 representative recordings and screen-reader evidence stay external. Phase 09 stays unresolved. NOT V1 COMPLETE.

## Percentage date and owe presentation — 2026-10-19 — Cursor

The user showed a 16% accounts-firm bill of GH₵5,920 dated 20 October while Money Stories for 19 October said nothing was owed. The later day was the planned payment, so the period total excluded it. New calculations record the bill on the activity date inside the sales period and keep the later day as the planned payment. Money Stories names the period-end date and lists later balances. Zero balances are not shown as money still owed. Confirmed calculation notes stay on their own lines. PASS: 112 unit tests, typecheck, lint, calculation browser test and one save journey. No provider call and no rewrite of the already saved record. NOT V1 COMPLETE.

## Review presentation — 2026-10-19 — Cursor

The calculation screen still stacked two headings, a dropdown, hidden records and “Needs review” in place of the figure. It now shows the period in ordinary dates, the result in large type, and the included records in a list. One clear basis needs no selector; two bases are buttons. The proposed row shows the amount as “To confirm” and keeps long descriptions to two lines. PASS: typecheck, lint, 112 unit tests, and 16 browser tests covering calculation, journeys and the record dialog. NOT V1 COMPLETE.

## Goal-mark save message — 2026-10-19 — Cursor

Saving the school-fees withdrawal was rejected because goal marks would then exceed the account balance. The old sentence did not name the account, the amounts, or Plan. The rejection now states the balance after the change, the marked amount, and the goal name. PASS: domain tests, 15 in that file. NOT V1 COMPLETE.

## Release prerequisites rechecked — 2026-10-19 — Cursor

Read the handoff, plan, phase and voice protocol, then reconciled clean `7648250`. Manifest absent. Two synthetic smoke clips are not consented recordings. Voice remains disabled and quality unapproved. Intake checker now uses the product 8 MB cap; the protocol and README no longer say 60 seconds and 3 MB. PASS: three intake unit tests. `npm run eval:voice-intake` correctly returned NOT READY. No provider call, push, deploy or database reset. Phase 08 and Phase 09 remain blocked on user evidence. NOT V1 COMPLETE.

## Live UI/UX assessment and concurrent-work reconciliation — 2026-10-19 — Codex

User requested a fresh UI/UX assessment focused on vision, language and customer satisfaction. Inspected live signed-in Today, Money Stories, Plan and its amount dialog, narration, Records and Settings without saving or changing user records; compared the supplied Narra v2 specimen/brief. Recorded 14 prioritized findings and acceptance criteria in harness/context/08-ui-ux-review-2026-10-19.md. Four trust issues lead: shared report/day scope, future endpoint wording, persistent Saved banner, and calculation labels that omit included other income. No satisfaction ratings invented.

Reconciled concurrent Cursor commits through efd6f25 and preserved them. Earlier this session: PASS 111 unit checks, Node 24 build/lint/types; 40/42 browser run followed by fixes to test selector/service-worker interception and PASS focused 3-test rerun. Later Cursor changes have their own evidence above. One budgeted synthetic transcription request failed 401 missing_scope; retained reservation. A synthetic live percentage request passed, no financial records saved. Observed cumulative journal committed/reserved US$0.947507, leaving US$4.052493; older budget numbers are historical. Updated CURRENT with the buildable UI priorities and external voice prerequisites. No push, deployment, migration or reset. INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE.

## Trust findings for dates, receipts and calculation labels — 2026-10-19 — Codex

Implemented review findings 1–4. Today keeps its own day and evidence range. Money Stories keeps its own date and period. An open month or week is reported through today, with later-dated records listed apart from the figures; a future period does not present an owed total. The save receipt stays on the completed action and is cleared when a new story starts. Percentage labels retain other income and state the exclusions; included kinds are unchanged. A stale workspace-move test now expects the existing goal-mark rejection. PASS: 118 unit tests, typecheck, edited-file lint, and 22 Edge tests covering the new journeys, calculation confirmation, save/recovery, layout and planning. No provider call, push, deploy or database reset. Findings 5–14 remain. NOT V1 COMPLETE.

## Today story composer — 2026-10-19 — Codex

Replaced the sample-shaped button on Today with the story field itself. Typed words stay in that field and open in the story editor. Voice remains next to it, and the screen says transcription is unavailable before recording starts. PASS: composer browser test, trust browser tests, 320px layout, and the manual-review and clarification journeys. No provider call. Findings 6–14 remain. NOT V1 COMPLETE.

## Review findings 6–26 — 2026-10-19 — Codex

Implemented the remaining UI review and the additional journey findings that can be done in code. In-place answers cover a missing account, an open balance, paid or still owed, and an uncertain unpaid part of a total. Draft format 2 keeps questions; an older backup must be checked before saving. Voice close confirms before discarding a clip or words. Sign-out checks the Auth result and the logout response before clearing drafts. Auth headings, first-workspace guidance, personal labels, pasted amounts, named-account context, goal marks, period facts, record grouping, settings and check-in copy are in place. A 401 keeps the draft. Finding 24 scale measurement is NOT RUN. Finding 26 screen-reader use stays EXTERNAL.

PASS: 121 unit tests, typecheck, lint, and 27 Edge tests (journeys, planning, calculation, trust, recovery, privacy and keyboard). No provider call, push, deploy or database reset. NOT V1 COMPLETE.

## Reviewed business profit or loss — 2026-10-19 — Codex

The original concept included profit or loss. The reporting decision kept it unavailable while cost of goods sold and similar facts are missing. Money Stories for a business workspace now opens a review. Saved records supply sales, other income, expenses and interest. The user supplies the missing costs, or explicitly says none. Profit is calculated only when every check is present, and the estimate is not written to the ledger. Personal workspaces stay out of it. PASS: 4 unit tests, typecheck, lint, and one Edge test on the sample story. No provider call. NOT V1 COMPLETE.

## Profit uses recorded costs first — 2026-10-19 — Codex

The first review asked for cost of goods sold, equipment used up and other costs before using the expenses already saved. It now shows those recorded amounts and asks whether they are complete. Yes works out the profit from the records. No asks only for a cost that is not already there. On the sample story, yes gives GH₵2,320.00 from sales of GH₵2,400.00 and the GH₵80.00 delivery expense; the GH₵700.00 stock purchase stays out. Adding a GH₵400.00 cost of goods sold then gives GH₵1,920.00. PASS: 5 unit tests, typecheck, and the Edge review. NOT V1 COMPLETE.

## Public fictional sample — 2026-10-19 — Cursor

Replaced the long public landing with the approved Living Ledger hero. The sample is client-only: cash sale GH₵900.00, delivery GH₵80.00, and Abena’s GH₵200.00 old-debt payment. Sales stay GH₵900.00; money received is GH₵1,100.00; net movement is GH₵1,020.00. A second example withholds the delivery account until Cash or MoMo is chosen. Nothing is saved, and the page does not call `/api/demo`. `/api/demo` stays unavailable on Vercel. Local tests open the sample workspace with `openSampleWorkspace`. Create-account links go to `/auth?mode=signup`.

PASS: typecheck, lint, 2 sample-fixture unit tests, and 1 Edge test of the public sample at 390px including the account question and signup route. Browser check: no horizontal overflow at 320, 390, 1280 or the wide window; amounts stay inside the sample card. Full `npm run test:e2e` was NOT RUN. No provider call, push, deploy or database reset. Uncommitted, because the tree still holds earlier auth, settings and profit-review edits. NOT V1 COMPLETE.

## First-use account screen — 2026-10-19 — Cursor

Sign-up is titled “Start your money records.” Sign-in stays “Sign in.” with the password reset beside the password. Create account is the only solid action on that form. The side note is narrower than the form. A signed-in person with no workspace chooses Business money or Personal money, names the space, and continues to the first record. The later workspace dialog still uses Name, Use and Create workspace. Unknown openings are unchanged.

PASS: typecheck, and 2 Edge tests for the public sample plus the sign-in and recovery-email controls. Browser check at 1280: form 480px, side note 420px, no horizontal overflow. At 390 the form is first and fits. The invalid recovery-link request to `/auth/confirm` hung with no response within 15 seconds, before the form loaded. NOT RUN as a pass for that route. No provider call. NOT V1 COMPLETE.

## Records, accounts and Money Stories — 2026-10-19 — Cursor

Money Stories opens with three figures from the existing report: money received, money paid out, and net movement. The cover says net movement is not profit. Records is titled “Your records”. Dates that are today include the calendar date. People & balances stays under the list. A credit sale row says no cash was received. Accounts name Cash, Bank, and MoMo beside the balance. An unknown opening is labelled unknown, and the starting-balance check stays on the card only while the opening is unknown. View activity opens that account’s records. The report calculation is unchanged.

Local tests enter the sample workspace with a browser fetch, because a bare request was missing the required origin. PASS: typecheck, the new hierarchy Edge test at 390px with no horizontal overflow, and the existing profit-review Edge test. No provider call. NOT V1 COMPLETE.

## Goals and grouped settings — 2026-10-19 — Cursor

The goals page is titled “Your goals”. The sample equipment goal shows GH₵1,200.00 set aside of GH₵6,000.00, 20.0%, and GH₵4,800.00 remaining. The forecast function is unchanged. A mark is described as staying in the account. Try a monthly amount stays a separate what-if. The month review opens with the month field, and the longer explanation is behind “How this affects the estimate”. Settings are grouped: Appearance, Recording and drafts, Review rhythm, People, due dates and goals, and Your data. Hide amounts is described as screen masking. Shared-device mode asks before clearing stored drafts. Request statuses are unchanged.

PASS: typecheck, and one Edge test at 390px covering the goal figures, the what-if dialog, the settings groups, cancelling the draft-clearing prompt, and no horizontal overflow. No provider call. NOT V1 COMPLETE.

## Workbook and activity PDF — 2026-10-19 — Cursor

The Excel download now has four sheets matching the specimen: Overview, Transactions, Accounts and Obligations. Money cells are numbers. An unknown opening stays Unknown. The cash-movement check equals the report’s net movement. A credit sale keeps its recorded amount and a cash effect of zero. The PDF uses the same received, paid, net, sales, expenses and balances, says net movement is not profit, and says a credit sale received no cash. Record and source identifiers are listed after the activity.

PASS: 25 export, domain and font-failure tests, typecheck, and an in-memory workbook that begins with a valid spreadsheet file. No provider call. NOT V1 COMPLETE.

## Rectangular transactions export — 2026-10-19 — Cursor

The downloaded transactions file now has one header and eleven fields on every row: record, date, description, event type, recorded amount, signed cash effect, cash-effect type, account, related account, counterparty, and source. A credit sale stays a positive recorded amount with cash effect 0.00 and type none. A transfer is an internal transfer with cash effect 0.00. Opening balances stay out of this file. Summary, account, and obligation tables remain available for the workbook and are no longer mixed into the CSV. Signed amounts are not prefixed as formulas. Text that could be read as a formula still is.

PASS: 21 export and domain tests. No provider call. NOT V1 COMPLETE.

## Story colors and Today field — 2026-10-19 — Cursor

The Money Stories cover had painted every figure in the cover’s white ink, so the existing received and paid colors never appeared. Received is blue, money paid out is apricot, and net movement uses the same color as its sign. The words stay with the figures. On Today, the story field is above the recorded balances. Saving and drafts are unchanged.

PASS: the hierarchy Edge test, including the field order and the two cover colors. Contrast of those colors on the dark cover is about 9:1 and 8.5:1. No provider call. NOT V1 COMPLETE.

## Sign-in and account creation respond — 2026-10-19 — Cursor

The sign-in button stayed on “Please wait…” because the local account service accepted connections and never answered. “Show password” and “Forgot password?” sat against each other. The two controls now sit in a wrapping row with a 20px gap. Sign-in, account creation, recovery, password update and the confirmation resend stop after 12 seconds and say the account service did not respond. Clearing the sample-data cookie no longer holds the button if that request is slow.

The local Docker engine was restarted without formatting or resetting the data disk. CashNarra database, auth and API containers came back healthy. Auth health returned 200. A wrong password returned “Invalid login credentials” and the button returned to “Sign in”. A throwaway local account reached the first-workspace screen; that account was then removed. No provider call, push, deploy or database reset. NOT V1 COMPLETE.

## Export asks which dates — 2026-10-20 — Cursor

The export dialog now asks which dates, in the same radio list as the workspace choice. It opens on the dates already on screen. The choices are today, this week, this month, this year, or specify. Specify is one day or a from-and-to range, using the ordinary date fields. This week and this month use the Money Stories periods. This year runs from 1 January through today. A period that includes today runs through today. A period that has not started stays unavailable, and the download buttons stay off. The same dates are used for every file.

PASS: period tests, including the shortcuts, a specified day, a clipped range, and a future range. Typecheck. In the local demo, Records → Export opened on 13 Oct 2026. This week read “This week so far · through 20 Oct 2026”. This month read “October so far · through 20 Oct 2026”. A range ending in November ran through 20 Oct 2026. A November-only range said those dates have not arrived and disabled CSV, PDF and XLSX. A month CSV closed the dialog with “Download started. Check your Downloads folder.” The records stayed on 13 Oct 2026. NOT V1 COMPLETE.

## Export asks which workspace — 2026-10-20 — Cursor

Export used to download only the workspace already open. It now asks: this workspace, another of the user’s workspaces, or all of them. All downloads one file per workspace and does not mix the ledgers or switch the open workspace. A person with only one workspace sees that, and the other choices stay unavailable. Extra files get a short safe name so they do not overwrite each other. While amounts are hidden, those names stay out of the filename, and the dialog says the file still contains the amounts.

PASS: 28 export and domain tests, typecheck. In the local demo, Records → Export showed “This workspace — Ama Works”, with the other choices unavailable, and CSV closed the dialog with “Download started. Check your Downloads folder.” The records stayed on Ama Works. NOT V1 COMPLETE.

## Excel workbook reads like the specimen — 2026-10-20 — Cursor

The workbook was a plain grid led by record and source IDs. It now uses the dark title band, lavender figures, violet table headers, and GH₵ amounts. Transactions list the date, what happened, the meaning, the event value, and the cash effect. Outstanding balances name the person, not an ID. The transactions CSV still keeps record and source IDs because that file is for importing. PASS: 23 export and domain tests, typecheck. NOT V1 COMPLETE.

## Logo and activity PDF are locked — 2026-10-19 — Cursor

The violet mark with the dark CashNarra name, and the two-page activity PDF, are now standing rules in `AGENTS.md` and `.cursor/rules/`. Later edits must not paint the name violet, replace the mark with squares, or turn the PDF back into a plain list. NOT V1 COMPLETE.

## Logo mark is violet and the name stays dark — 2026-10-19 — Cursor

The all-violet lockup turned the CashNarra name purple. Light screens now use a lockup whose quotation mark is violet and whose wordmark stays ink. Dark mode still uses the white lockup. NOT V1 COMPLETE.

## Activity PDF uses the CashNarra mark — 2026-10-19 — Cursor

The report masthead had two plain squares. It now draws the quotation-mark symbol from the brand file, in violet, beside the CashNarra name. PASS: export tests still pass, and a rendered page shows the mark. NOT V1 COMPLETE.

## Activity PDF matches the revised report — 2026-10-19 — Cursor

The downloaded activity PDF was a plain list. It now follows the revised two-page report: masthead, dark money-received and money-paid card, net movement marked as not profit, sales, expenses and money taken home, then a zebra activity table. Cash in is blue, cash out is brown, and a credit sale says “No cash”. Page two has account position, outstanding balances, two cash-movement cards with proportional bars, why the totals differ, and the limits box. The footer says private financial record. Figures come from the existing report. Wording stays the product’s record labels.

PASS: 26 export, domain and font-failure tests, typecheck, and a rendered fixture PDF checked in the browser on both pages. The limits box sits above the footer. No provider call. NOT V1 COMPLETE.

## Landing page sells the real product — 2026-10-19 — Cursor

Kept the hero. Replaced the matching pale cards with separate bands: ink for the mix-ups, a review excerpt beside the steps, a violet Record band, a Money Stories sales card, an apricot Plan band, and a violet close. Sample figures are the fictional Ama Works day. On a narrow screen the header links sit under the logo so Sign in stays one line. Uncommitted, with the earlier spacing and dialog work. Superseded later the same day by “Public fictional sample”. Do not restore this long Ama landing. NOT V1 COMPLETE.

## Leftover copies and caches removed — 2026-10-20 — Cursor

Cleared the unused project npm cache, test-report output, the empty `doc` viewer, the 13 October brag snapshot, and video render scratch. Merged the split 19 October audits into `CashNarra_Elite_UX_Audit_COMPLETE_with_Exports_2026-10-19.md` and removed the duplicate Downloads design kit and handoff zips. Local demo data, the evaluation budget, and the Supabase database were left in place. Not committed. NOT V1 COMPLETE.

## Review can create a missing account or balance — 2026-10-20 — Cursor

A review question for an account or a balance now asks whether to create the missing one and attach the draft record to it. A new account is saved immediately, with an unknown starting balance unless the person enters one. A new balance stays in the same unsaved review, and the payment links to it. The local testing ceiling is US$10. The evaluation journal header was updated in place; its reserve and usage lines were kept. Committed and reserved at the change: US$1.803120. Remaining: US$8.196880.

PASS: review-create, evaluation-budget, narration-contract and planning unit tests. PASS: browser review of a fictional story created Shop cash and Mabel’s opening balance, attached both draft records, and left Save enabled. The story was not saved. NOT V1 COMPLETE.

## Story reader could not be reached — 2026-10-21 — Cursor

Story processing failed before a reading. Node rejected the provider certificate (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`). `npm run dev` now starts through `scripts/dev.mjs` with the system certificate store, and the dev server on port 3100 was restarted that way. A one-line synthetic story then reached the provider and returned HTTP 429 `credit_balance_exhausted`. Failed calls still keep their local testing reservations. The page now says when the reader cannot be reached, and when the reader has no remaining credit. No further provider call. NOT V1 COMPLETE.
