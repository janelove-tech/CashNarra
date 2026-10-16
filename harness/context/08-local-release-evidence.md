# Local release evidence — 2026-10-16 — Codex

Continued from Cursor's clean `4465381f4c4765f7e89b988272b1bd333e7156ea` on `work/cashnarra-v1`. Its product changes and Phase 08 historical results were preserved. The user's renewed instruction to proceed through unblocked work authorises completing local verification; it does not approve production launch gates.

## Measured contrast

Added development-only `@axe-core/playwright` and `tests/e2e/contrast.spec.ts`. PASS: four Edge scenarios at 390px and 1440px, with light and dark application appearance. Each scans landing, Today, Records, Stories, Plan, narration, and manual record dialog. Landing uses its existing light appearance in both scenarios. All 28 scans returned zero color-contrast violations and zero incomplete results. Measured text nodes per scan:

| View | 390px | 1440px |
|---|---:|---:|
| Landing | 23 | 23 |
| Today | 59 | 71 |
| Records | 68 | 74 |
| Stories | 38 | 44 |
| Plan | 29 | 35 |
| Narration | 23 | 29 |
| Manual record dialog | 15 | 15 |

Counts were identical in both application appearances. Full axe results are attached to the local Playwright report. This is measured text contrast on these states, not a complete non-text contrast audit, screen-reader test, or accessibility certification. The initial test timed out because it attempted to open narration while still on Plan; navigation was corrected and all four scenarios passed.

## Separate 200% browser zoom

PASS: `tests/e2e/zoom.spec.ts`, two Edge light/dark journeys. Disposable profiles set Chromium's default partition zoom, independently verified with devicePixelRatio=2 and innerWidth=707 for outerWidth=1440 at OS scale 1. The test checks horizontal reflow, opens narration and a manual record, enters an amount, tabs 15 times inside the dialog, and reaches enabled review/save controls without posting. Screenshots from the browser's physical surface were visually inspected in both appearances: controls and focus remain usable with vertical dialog scrolling. Images remain private local artifacts in `.local/zoom-results/` (or the normal test output when running the full suite).

Initial attempts failed because a parallel suite stopped the shared server, then because the preference used a scalar instead of a partition dictionary, then because a width assertion omitted browser chrome. These harness issues were fixed and the two journeys passed. Playwright's CSS-pixel screenshot clip was inaccurate at actual browser zoom; direct CDP surface captures resolved it. This does not constitute screen-reader or physical-device verification.

## Fresh-install command results

PASS: doctor (Node 24.21.0, providers disabled), lint (zero warnings), typecheck, 95 unit tests, real isolated PostgreSQL integration, existing local Supabase Auth/RLS/RPC integration, production build. PASS: complete 31-test browser suite including four new contrast scenarios, plus the two subsequently added zoom tests in a separate run. Not a single 33-test invocation. No product code or financial data model changed. No production migration or reset.

## Dependency advisory detail

PASS: fresh `npm ci` from the lockfile, Node 24.21.0. It installed 520 packages. npm reported install-script approval warnings for core-js, esbuild and unrs-resolver; subsequent executable checks determine whether the installed tooling works.

`npm audit --json` reported five high-severity dependency entries tracing to one development-tool advisory, [braces stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces. Its suggested force fix downgrades eslint-config-next to 14.2.35, incompatible with the settled Next 16 stack. Not applied. Avoid untrusted glob patterns in development tooling; revisit when an upstream compatible fix exists. PASS: `npm audit --omit=dev --json` returned zero production advisories. Neither result proves absence of vulnerabilities.

## Live evaluation authorisation

User explicitly approved **up to US$5 total for narration and voice evaluation**, with consented recordings to follow, on 2026-10-16. Do not ask for the same budget again. This is not permission to enable production AI, set voice quality approved, deploy, or collect real customer data.

Credential-presence-only check found no `OPENAI_API_KEY` in the process plus `.env.local`; AI and voice flags remain false. **No paid calls made; spend in this continuation: US$0.** Put the key only in ignored `.env.local`, never chat or committed files. Record usage across subsequent runs against this single cumulative ceiling. Recordings are still pending.

Official [GPT-4.1 Mini documentation](https://developers.openai.com/api/docs/models/gpt-4.1-mini) opened on 2026-10-16 lists standard text rates of $0.40/million input tokens and $1.60/million output tokens. Retain the configured model pending comparative evaluation. Before calls, implement a bounded capture runner using the same production request and schema, with no retries, bounded input/output, a durable pre-call cost reservation and captured token usage. Do not enable application-wide providers to run the corpus. Feed captured synthetic results to `npm run eval:narration -- <private-results.json>`. Review model and validation-added clarification separately; never present fixtures or mocked outputs as a live evaluation.
