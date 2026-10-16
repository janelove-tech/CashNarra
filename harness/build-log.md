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
- Full Playwright suite in this phase — not rerun. See Phase 08.
