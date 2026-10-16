# Phase 00 — Baseline, multi-agent harness and CI

## Purpose

Make Cursor and Codex interruption-safe before product changes. The repository, not chat history, is the handoff.

## Scope

- Confirm the live Git baseline.
- Create `work/cashnarra-v1` because `codex/cashnarra-v1-remediation` did not exist.
- Add shared `AGENTS.md` rules, `GOALS.md`, `PLANS.md`, `harness/CURRENT.md`, `harness/build-log.md`, phase files, and `harness/context/`.
- Add GitHub Actions CI for `npm ci`, doctor, lint, typecheck, unit tests, isolated PostgreSQL tests, and production build.
- Record baseline validation. Do not change financial behaviour.

## Out of scope

Product semantics, narration prompts, voice behaviour, UI refactors, security changes, and production services.

## CI boundaries

Included: lint, typecheck, Vitest, `test:db` against disposable `cashnarra_test` on localhost port 55432, and `next build`.

Not in default CI:

- `npm run test:e2e` — Playwright is pinned to the `msedge` channel in `playwright.config.ts`. Ubuntu runners do not provide that channel, and installing Edge would make CI heavier than this phase allows.
- `npm run test:supabase` — needs Docker and the local Supabase CLI status file. No production credentials.
- Live OpenAI and transcription evaluation — opt-in and external.

## Acceptance

- Branch established from the live baseline.
- Baseline SHA recorded.
- Shared harness present and usable by either agent.
- CI workflow present.
- Baseline validation evidence recorded with PASS, FAIL, or NOT RUN.
- No product semantics changed.
- A coherent Phase 00 commit exists.

## Context

`harness/context/00-baseline.md`
