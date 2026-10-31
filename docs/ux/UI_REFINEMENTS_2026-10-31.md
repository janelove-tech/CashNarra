# CashNarra app interface refinements — 31 October 2026

Scope: the owner approved implementing the visual review direction after the experience research. This pass builds on `codex/experience-recovery-20261030` at `ff7285c5400ddd7a58343779672654e646abac59`, on the isolated branch `codex/app-ui-polish-20261031`. It refines the actual Next.js app. The earlier public demo and research prototype are separate deliverables.

Delivery authorization: after the verified implementation checkpoint at local commit `d0acd63`, the owner explicitly approved GitHub publication and merge on 31 October 2026. This resolves the earlier automatic approval rejection. Integrate the UI into `codex/experience-recovery-20261030`, then merge the combined changes into the existing `work/cashnarra-v1` target through pull requests with passing CI. GitHub's pull-request and merge records are the delivery receipts. This authorization covers repository publication and integration; the release verdict below is unchanged.

## Result

| Area | Implemented behavior |
| --- | --- |
| Review | Workspace, business/personal scope, currency and activity date lead the screen. Single-date rows avoid repeating that date. Multi-date rows retain their dates. |
| Original words | A closed, native **Your words** disclosure keeps the source and **Change the words** available. Privacy masking also applies inside the disclosure. |
| Proposed records | Descriptions wrap fully. Amounts use tabular figures and can move below long descriptions instead of squeezing them into a thin column. **Change** remains a quiet, comfortably sized action. |
| Proposed consequence | **After saving** shows a changed existing debt balance in conditional language. It explicitly says **on this balance**, since the same person can have several debts. It runs the existing `applyBatch` validation on a detached copy; it does not post, reinterpret the story, or claim a confirmed save. Invalid or unresolved proposals do not display an invented result. |
| Save and recovery | One primary save/original-request recovery action, with one compact draft hint. The earlier receipt-first recovery behavior remains. Keyboard scroll margins keep review controls above the sticky action area. |
| Confirmed result | A quieter saved panel emphasizes the financial consequence, once per affected balance. Its heading and destination use actual confirmed record dates. Several dates open the filtered activity range and keep dates on the result rows. |
| Home and Records | Readable body text and shared record rows. Records puts the shown/saved count beside its filters. Existing retained filter, reading-position and correction behavior stays in place. |
| Navigation | The existing five phone destinations retain their labels and gain a clearer active background. Tell keeps focus in the composer after navigation; initial heading focus respects a field the person already selected. At exceptionally narrow content widths under enlargement, controls wrap and return to document flow. |
| Money Stories and Plan | Net movement has more visual emphasis while remaining explicitly distinct from profit. Goals lead with their name and aligned amounts; the forecast is separated from the goal's saved facts. |
| Settings | Consistent label/help/control rows for preferences, exports and data requests; stacked controls on phones; destructive original-story deletion is distinct. **Clear stored drafts** describes the existing device action accurately. Request help no longer claims a request was recorded before submission. |

The approved logo assets, typefaces and color tokens are retained. No new production dependency, financial posting rule, migration, retention behavior, provider activation, pricing change, or payment behavior is introduced.

## Verification

| Check | Result |
| --- | --- |
| Clean installation, lint and TypeScript | PASS |
| Unit tests | PASS — 35 files, 214 tests, including six focused balance-preview cases |
| Production build | PASS — six existing dynamic-filesystem tracing warnings also occurred on the unchanged baseline |
| Production browser regression | PASS — 54 tests across 11 suites using local Chromium 153; providers disabled, fictional data and mocked interpretation |
| Review and shared screens | PASS — 320×640 light, 390×640 dark, 768×640 light, 1440×640 dark; no page overflow; review and Settings text-contrast checks |
| Home, dialogs and navigation | PASS — existing width/theme matrix from 320 to 1440; keyboard containment, return focus and reduced motion; 360×380 short phone and offline fallback |
| Additional review checks | PASS — 390×380 keyboard focus above the save bar; 390×640 at CSS enlargement 2; long accepted amounts; actual and multiple dates; one consequence for several payments on a balance |
| Visual inspection | PASS — final 390px and 1440px dark review and 320px light Settings screenshots inspected, alongside the earlier Home/phone checks |

The browser run used the production server. A fresh generated `.next` cache was needed because reusing Turbopack persistence in this managed environment could fail with `invalid digit found in string`; no product configuration was changed for that workaround. Runtime browser files, fonts, logs and screenshots are ignored local verification material, not new production dependencies.

The added tests use fictional Ama Works data and mocked interpretation responses. They check review/edit/save with one request, source editing and privacy, actual dates, multi-date drilldown, long amounts, enlarged content, and keyboard focus around the save bar. Existing domain, recovery, export and accessibility checks remain relevant.

CSS enlargement and viewport resizing are explicitly emulation. They do not establish physical phone keyboard behavior, a native Edge zoom result, assistive-technology usability, live narration accuracy, or Supabase authentication/RLS readiness. Phase 08 remains INCOMPLETE / NOT V1 COMPLETE; Phase 09 remains EXTERNAL.
