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
