# CashNarra current development handoff

Updated: 2026-10-17 — Codex
Branch: work/cashnarra-v1
Baseline: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Reconciled starting HEAD: fc25cfb1db54bf2bcf27b1b50e093271a19813c4
Current HEAD: the commit containing this handoff; resolve with git rev-parse HEAD.
Current phase: 08 — release verification; Phase 09 remains EXTERNAL
Status: EXTERNAL — representative recordings and manual accessibility evidence
Verdict: NOT V1 COMPLETE

## Git reconciliation

Resumed clean at fc25cfb, twelve commits ahead of the local origin reference. Read the prescribed handoff and voice protocol, then reconciled Git. The expected .local/voice-evaluation/manifest.json is still absent. Preserved all Cursor/Codex work. No code changes, repeated tests, paid calls, fetch/push, deployment or migration. Existing passing results remain historical evidence; the exact next action needs actual consented recordings, not another synthetic rerun.

## Latest evidence

- HISTORICAL PASS: eight non-text contrast browser journeys at 320, 390, 768 and 1440px, light/dark. Measured field boundaries inside/outside, button SVG strokes, and keyboard-focus outline at a minimum 3:1. Today, Records, Money Stories, Plan, narration and manual-record dialog covered (48 measured states across eight journeys). See tests/e2e/non-text-contrast.spec.ts and harness/context/08-local-release-evidence.md.
- HISTORICAL PASS: three offline voice-intake tests, typecheck and lint. The default intake command correctly exits NOT READY because private recordings/manifest are absent. This is a verified guard, not a voice-quality PASS.
- HISTORICAL PASS: 104 unit tests and production build; database/Supabase integration and prior text contrast/zoom/browser checks. Not rerun for this test-only change.
- HISTORICAL PASS: one unchanged 28-case synthetic narration corpus using gpt-6-luna; inspected account/party/debt references. Deprecated model failed its four runs. See harness/context/08-evaluation-runner.md. No general-quality or voice approval.
- EXTERNAL: representative voice recordings; no WAV/WebM/MP3 or consent-named files found under .local this continuation.
- NOT RUN: real screen-reader evaluation, full non-text/state/device audit. New contrast checks are scoped measurements, not accessibility certification.
- FAIL (historical): development braces advisory; do not force a downgrade of Next lint to v14.

## Provider and budget boundary

User explicitly authorised local typed narration testing. Ignored .env.local now has AI_ENABLED=true, OPENAI_MODEL=gpt-6-luna and LOCAL_AI_BUDGET=true. The local server is running on 3100 with NODE_USE_SYSTEM_CA=1. Production remains unapproved. Explanation calls are disabled in local-budget mode and voice stays off. Preserve the cumulative US$5 approval, all five private captures and .local/evaluation/budget.jsonl. Last recorded committed/reserved US$0.513872; remaining US$4.486128. Includes US$0.425431 uncertain initial reservation; successful usage is conservatively costed. One synthetic realExtract smoke check passed without saving records; subsequent user story calls consume the same cumulative budget. Nine focused tests, typecheck, lint and production build passed. Do not reinitialise the journal or assume uncertain charges were zero. Voice quality approval stays false.

## Exact next action

Local signed-in users can now retry their own typed stories. Preserve reviewed-save and budget boundaries. Synthetic demo remains mock-only. Local disk budget is for this one machine only, not multi-instance hosting. No paid calls are allowed beyond the remaining cumulative allowance. Do not reset budget locks/reservations after an uncertain failure without reconciliation.

Prepare the private manifest and recordings using the concrete template in harness/context/03-voice-quality.md, then run npm run eval:voice-intake. It requires human review of actual consent; metadata assertions cannot establish consent. Representative consented recordings are required for voice quality evaluation through editable transcript → shared interpretation → material clarification → review → deterministic save. Follow harness/context/03-voice-quality.md: at least five Ghanaian-English speakers, varied devices/noise/speed, synthetic stories, private consent and deletion schedule. A voice runner must share the existing budget with verified audio cost bounds; never create a second allowance. Do not substitute synthetic voices or mocked browser audio for representative speaker evidence.

Manual screen-reader evidence and remaining control/state contrast coverage are still open. Preserve the new eight passing browser checks; do not rerun completed synthetic AI evaluation merely to report progress. Phase 09 business/provider/regulatory decisions remain external and cannot be resolved by code inspection. Do not enable production providers, push, deploy or reset a database.

INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE.
