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

## Verdict

Use exactly one:

- `V1 CODE COMPLETE`
- `V1 CODE COMPLETE — EXTERNAL LAUNCH GATES REMAIN`
- `NOT V1 COMPLETE`

Voice without representative quality evidence cannot support a complete verdict. External launch gates may still remain after the code verdict.
