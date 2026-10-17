# Phase 08 — Independent V1 release verification

## Purpose

A fresh session should try to disprove V1 completeness. Assume earlier agents made mistakes.

## Check

Typed narration, voice narration, financial semantics, AI authority boundary, database isolation, offline/recovery, reports, goals, exports, Narra v2, accessibility, and scope boundaries.

## Commands

From a clean environment when possible:

```bash
npm ci
npm run doctor
npm run lint
npm run typecheck
npm test
npm run test:db
npm run test:supabase
npm run test:e2e
npm run build
```

Unavailable checks stay NOT RUN or EXTERNAL. Do not convert them into PASS.

## Result — 2026-10-16 — Cursor

Verdict: `NOT V1 COMPLETE`

Status: PARKED. The automated pass at `3020daf` stays valid as historical evidence. Return here before any complete verdict. Do not redo the passing commands unless the tree has changed. The open return items are a fresh `npm ci`, representative voice quality, live narration evaluation, screen-reader testing, a contrast audit, and a separate 200% zoom pass.

Phase 09 may document launch decisions without this return. It must not treat those decisions as a substitute for this evidence.

## Return — 2026-10-16 — Codex

The renewed user instruction to execute unblocked work resumed local release verification from Cursor commit `4465381`. Preserve the historical record above; fresh install and measured text contrast now have new evidence in `harness/context/08-local-release-evidence.md`. V1 remains incomplete. User approved up to US$5 total evaluation spend; recordings will follow. No API key is configured and no paid calls have been made. Provider enablement and launch gates remain separate.

The automated code checks below passed. The verdict stays incomplete because representative voice-quality evidence does not exist, screen-reader testing was not run, and Phase 09 launch decisions are still external. Do not treat this as a product rewrite request.

## Verdict

Latest evaluation preparation: read `harness/context/08-evaluation-runner.md`. The bounded capture CLI is implemented and tested offline; the local budget is initialised with zero spend. Live narration and representative voice remain EXTERNAL pending credentials/recordings. Preserve the existing US$5 cumulative approval.

Use exactly one:

- `V1 CODE COMPLETE`
- `V1 CODE COMPLETE — EXTERNAL LAUNCH GATES REMAIN`
- `NOT V1 COMPLETE`

Voice without representative quality evidence cannot support a complete verdict. External launch gates may still remain after the code verdict.

## Live return — 2026-10-17

Phase 08 resumed when the local key became available. Four live synthetic runs failed the release-quality threshold. Read harness/context/08-evaluation-runner.md and CURRENT for exact evidence, retained prompt, budget and next action. Automated checks pass, but narration quality remains FAIL; representative voice remains EXTERNAL. Verdict: NOT V1 COMPLETE.

Replacement comparison now PASS for the one 28-case synthetic corpus using gpt-6-luna. This supersedes the live-narration FAIL only for that tested replacement/corpus; the deprecated configured model still failed. No representative voice evidence or enablement. Read latest CURRENT and evaluation evidence.

2026-10-17 non-text verification: eight scoped browser journeys PASS for field boundaries, button icons and dialog keyboard focus at 320/390/768/1440px light/dark. Details/limitations in harness/context/08-local-release-evidence.md. Full state coverage and real screen-reader testing remain NOT RUN; voice recordings remain EXTERNAL. Verdict unchanged.

Expanded non-text checks now include Records, Money Stories and Plan: 48 measured states in eight passing journeys. No claim of full interaction-state, chart or screen-reader coverage. See latest local release evidence and CURRENT.

2026-10-17 voice preparation: offline intake checker implemented and tested. Read harness/context/03-voice-quality.md for the private manifest template and exact command. Missing intake is NOT READY, not a quality result. Live transcription and representative voice still EXTERNAL; no paid call or quality approval.
