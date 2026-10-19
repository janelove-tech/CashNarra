# CashNarra plans

Branch: `work/cashnarra-v1`

Baseline: `main` @ `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92`

| Phase | Status | Build file | Start SHA | Completion SHA |
|---|---|---|---|---|
| 00 — Baseline, multi-agent harness and CI | COMPLETE | harness/build/00-baseline-and-harness.md | 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92 | cff81ec46544a10ec2805f44faf2a29560c28bbc |
| 01 — Financial semantics and posting parity | COMPLETE | harness/build/01-financial-semantics.md | cff81ec46544a10ec2805f44faf2a29560c28bbc | 6cb30d92075ce5eead15c6ee4e337b41f01c1886 |
| 02 — AI and general narration quality | COMPLETE (live evaluation EXTERNAL) | harness/build/02-ai-and-narration.md | 6cb30d92075ce5eead15c6ee4e337b41f01c1886 | 3395aa3 |
| 03 — Voice input V1 | COMPLETE (quality EXTERNAL) | harness/build/03-voice-input.md | | |
| 04 — Core narration/review UI refactor | COMPLETE | harness/build/04-core-ui-refactor.md | | |
| 05 — Data loading and offline hardening | COMPLETE | harness/build/05-data-and-offline.md | | |
| 06 — Supabase/RPC/RLS security hardening | COMPLETE | harness/build/06-security.md | e950df3 | 4897fc0ac8b1171bfe3783ebd3f7a1732b139774 |
| 07 — Reports, goals, exports and accessibility | COMPLETE | harness/build/07-reports-goals-accessibility.md | 4897fc0ac8b1171bfe3783ebd3f7a1732b139774 | 01108da07fe946b328fc705aa560832d0afadc4d |
| 08 — Independent V1 release verification | BLOCKED | harness/build/08-release-verification.md | 01108da07fe946b328fc705aa560832d0afadc4d | 3020dafaefdad2f3f0e3100452add83a773ff576 |
| 09 — External launch gates | EXTERNAL | harness/build/09-external-launch-gates.md | 152debde8d8e21bb22671905c126bacaf718250f | |

The 2026-10-19 product change adds record-backed percentage confirmation, a three-minute recording limit, and plainer goal language. It does not close Phase 08. Phase 08 remains incomplete, not discarded. Historical verification is `3020daf`; the 2026-10-16 Codex continuation adds fresh-install and measured text-contrast evidence in `harness/context/08-local-release-evidence.md`. Live synthetic narration comparison passed 28/28 on gpt-6-luna; representative voice recordings remain external. Cumulative approved budget is US$5; read CURRENT for committed/reserved usage and exact prerequisites. Eight scoped non-text contrast browser journeys now pass; full state coverage remains incomplete. Screen-reader evidence remains external. Read CURRENT for the latest zoom and validation status. Phase 09 can stay listed while Phase 08 is parked. Phase 09 cannot be marked resolved from repository checks.

Only one coding phase should be IN PROGRESS. Phase 09 stays EXTERNAL until the user or business decisions in that phase file exist.

Voice is in V1. Phase 03 is required before a V1 code-complete verdict. It is not a later release.





