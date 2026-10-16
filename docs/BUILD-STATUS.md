# Latest checkpoint — 16 October 2026

Added reusable people, optional payment dates, editable goal names/targets with history, retained check-in choices, rhythm visibility, optional in-app reminders, complete private draft-file backup/restoration, and first-use account guidance. Amount masking now covers planning dialogs and hides target-edit forms until amounts are shown.

Migration 008 protects planning history and was applied only to isolated local Supabase, preserving existing records. Latest verification: 56 unit tests, isolated PostgreSQL integration, actual local Supabase integration, 22-test full browser suite plus a passing new portable-backup browser test (23 distinct tests), lint, TypeScript, and production build. The backup browser check restores downloaded words without posting records; unit checks also cover edited amounts and pending receipt identity.

The first sandboxed unit invocation could not create a Vitest token file; its approved rerun passed. No paid provider calls, production migrations, or public deployment occurred. See PRODUCT-CROSSCHECK.md for remaining limits. Historical checkpoints follow.

# Development checkpoint — 16 October 2026

**Product completeness:** this is not the full finished product. See [PRODUCT-CROSSCHECK.md](PRODUCT-CROSSCHECK.md) for the source-to-feature audit, incomplete first-release experiences, unverified AI/voice integrations and longer-term features. Test counts below describe tested behavior only.

Implemented: real Supabase sign-in/recovery and personal/business workspaces; manual accounts and opening balances/obligations; typed narration adapters, clarification and editable batch review; exact balanced posting and authoritative receipts; corrections, splits, removal and atomic eligible workspace moves; debt settlement; searchable records and provenance; period reports, trace views, Money Stories and private CSV/PDF/XLSX downloads; goals, allocations and deterministic scenarios; scoped offline drafts; appearance, amount masking, privacy and controlled data requests. Branded landing and app use supplied Narra assets.

The synthetic demo is an additional local testing mode. Real authenticated workflows call the official Supabase SDK and ownership-checked database functions. No paid resources or public deployment were created.

## Observed verification

- 56 unit tests passed, including actual streamed upload-size enforcement, bounded JSON requests, malformed upload recovery, report period validation, cache privacy, linked-payment preservation during opening-debt corrections, stale/aborted/blocked device writes, complete export totals, unavailable PDF fonts, goal allocation integrity, unknown balances and the six financial lifecycle cases below.
- Isolated PostgreSQL integration passed: balanced journals/openings, Ama Works baseline, rollback, idempotency/conflicts, stale/concurrent settlements, corrections, atomic two-workspace moves, minimisation and cross-user table/RPC isolation.
- Real local Supabase SDK integration passed, including authentication, baseline and ownership checks.
- 22 browser regression tests passed together, followed by a passing two-test planning/draft-backup run (23 distinct browser tests): real sign-in/workspace/opening/settlement/logout; review/save/correction/export; mock clarification; lost-response recovery; offline recovery; cross-user isolation; 320/390/768/1440 layouts in light and dark; recording-container validation; account-evidence drill-down; private invalid-link recovery; duplicate privacy requests; masked-amount keyboard access; password update followed by a fresh sign-in.
- Production build passed on Next 16.4.0 / Node 24.
- Lint and TypeScript checks passed. Updated SQL validation was rerun against isolated PostgreSQL and applied without deleting existing local Supabase records; actual Supabase integration passed again.
- Source references are now constrained at application and database boundaries, including removed records; duplicate and missing source references are rejected. The additional migration preserves existing local records. Unconfirmed correction reasons are locked, one-pesewa splits are disabled, and cross-tab logout clears pending recovery state.
- Production dependency audit previously reported zero vulnerabilities. Development dependency audit has outstanding transitive findings requiring review before tooling upgrades.

Evidence is generated under ignored `test-results`; scripts contain executable assertions. Browser layout tests do not certify accessibility or cover every possible device. Real OpenAI extraction, explanations, transcription and provider email delivery have not been tested with paid/live providers.

Latest multi-area pass: draft transactions reject aborted writes/clearing and prevent older revisions replacing newer stored drafts. CSV/XLSX now include total recorded balances, both obligation totals and an explicit unavailable-profit statement. Downloaded CSV and XLSX were inspected for matching corrected totals, UTF-8 CSV BOM and absence of spreadsheet formula cells. The synthetic fixture now includes all five supplied review days and the separate rest day; real empty workspaces remain empty.

## Remaining external and quality gates

Configure hosted development/production Supabase, SMTP and authorised callback URLs; review provider contracts and retention; decide operator and retention obligations; complete security/accessibility review; complete broader browser recording compatibility and representative transcription quality checks before enabling voice; configure provider budgets and opt-in smoke tests; choose an appropriate commercial hosting plan. See LAUNCH-READINESS.md.

This is a runnable development build, not a declaration of public launch readiness. The source references and campaign handoff remain private local materials.

Voice follow-on: server-side WebM/Opus packet and timeline validation now enforces the 60-second limit without trusting declared duration. Oversized, truncated, laced, video and unsupported containers fail closed. A browser-generated synthetic tone passed validation without microphone access or a provider call. MP4 is not enabled; browsers without WebM/Opus use text. This is not a transcription quality test.

Calendar/report/auth pass: impossible account-opening, allocation, reviewed-month and check-in dates are rejected in domain validation and PostgreSQL migration 202610140006. Account report evidence now opens included movements and transfers, including earlier periods. Sign-in avoids setup jargon and only presents password updating after a recovery-link flow. Local migration applied without deleting records; PostgreSQL tests, lint and production compilation passed.

## Six-area completion pass

1. Recovery: authentication routes use no-store/no-referrer headers. Invalid-link recovery and an actual local Supabase password reset followed by fresh sign-in passed. The local test generates a recovery token without sending external mail; live email delivery remains unverified.
2. Privacy requests: repeated pending requests of the same kind are rejected and the existing status remains visible. Browser verification passed; this is not an automatic deletion or staffed support service.
3. Goals: reused allocation identifiers and zero-value contributions are rejected. Migration 202610140007 enforces the same invariants in PostgreSQL; tested in isolation and applied locally without deleting records.
4. Offline recovery: blocked database opens report a recoverable message and close a late-opening connection. Tests cover that cleanup, stale writes and aborted transactions.
5. Exports: a failed or substituted PDF font produces an explicit retry/CSV/XLSX fallback rather than an invalid report. Both failure cases passed unit tests.
6. Keyboard accessibility: masked amount controls have meaningful accessible names; Enter opens evidence and Escape returns focus. Browser verification passed; this does not constitute accessibility certification.

The first attempt to run final lint/build/browser checks was stopped by an automatic approval-review usage limit. After the user resumed, all those checks executed and passed. No paid resources, real AI calls or public deployments were used.

## 15 October six-area pass

- Request boundaries: workspace, narration and explanation JSON bodies are bounded by actual bytes before parsing. Non-object bodies and blank submission keys are rejected.
- Narration validation: invalid story dates are rejected before mock/provider processing; explanation periods require real calendar dates.
- Financial reporting: invalid or reversed periods cannot produce apparently valid empty reports or exports. Date controls preserve the last valid date.
- Offline cache privacy: service-worker upgrades only remove CashNarra's old public caches. Query-bearing asset URLs, private/no-store responses and redirects are not cached.
- Session handling: cross-tab logout invalidates pending narration results and clears selected records, dialogs and clarification state.
- Release configuration: `npm run doctor` validates local prerequisites and opt-in gates without revealing secrets or invoking providers. It passed on the current local setup; this is not a hosted connection or regulatory check.

The 15 October lint and production build passed. Twenty browser checks passed in the full run; the new session-race check initially exposed missing sign-out feedback, which was fixed, and its targeted rerun passed. PostgreSQL checks and the configuration doctor passed. The final rebuild includes the feedback fix.

## Financial lifecycle follow-up — six areas

1. Corrections: a record moved to another date changes both affected report periods while preserving its prior version and all-time balance.
2. Settlements: full collection closes the remaining receivable without creating another sale; removing an incorrect payment restores the debt and account balance.
3. Workspace moves: a move that would leave source goals overallocated fails without mutating either input workspace.
4. Scenarios: zero/negative contributions produce no completion date and never change actual allocations; impossible calculation dates are rejected.
5. Account openings: unused accounts now receive the same exact-money/type/currency/name validation. Zero remains a known balance and null remains unknown.
6. Retention: moves no longer copy unrelated raw narration into a new workspace. Record/source references remain traceable and the original source keeps its existing retention policy.

All six lifecycle regression tests passed. The isolated PostgreSQL suite also passed after these changes. The full 21-test browser suite, lint and production build passed after these changes.

## Combined product completion pass — 16 October 2026

Added reusable people, structured optional payment dates, editable goal names/targets with history, retained check-in choices, rhythm visibility and optional in-app reminders, full private draft-file backup/restoration, and first-use account guidance. Amount masking also covers planning dialogs; masked goal targets cannot be edited until amounts are shown. Migration 008 protects planning history and was applied only to isolated local Supabase, preserving records.

Latest checks: 56 unit tests, isolated PostgreSQL integration, actual local Supabase integration, 22-test full browser suite plus the new portable-backup browser test, lint, TypeScript and production build passed. Draft backup unit checks include reviewed edits and pending request identity; the browser check downloads/restores words and confirms that no records were posted. No live AI or transcription calls were made. The initial sandboxed unit invocation failed on Vitest token-directory permissions; the approved local rerun passed.

Remaining limits include representative live AI/voice evaluation, provider email delivery, richer completeness guidance, goal archival, payment-date carryover after replacing an obligation, and external privacy/legal/operational launch requirements. See PRODUCT-CROSSCHECK.md.

## Payment-date corrections and month-review guidance — 16 October 2026

A single debt correction with the same meaning and person now carries its latest payment date to the replacement and retains the original history. A corrected balance date after the payment date is rejected with instructions to change or clear the date first. Ambiguous splits and changes of person do not automatically inherit dates. Verified by a focused unit test and an actual isolated PostgreSQL commit/read-back. The month-review dialog now explains missing activity, zero versus unknown assignments, and planned-payment checks in ordinary language.

57 unit tests, isolated database integration, lint and TypeScript passed for the correction. Production build passed before the final explanatory-copy addition; the final build is checked separately below.

Final production build, lint and TypeScript also passed after the month-review copy update.

## Rechecking uncertain goal months — 16 October 2026

Added a working Check [month] again control under People, plans and check-ins. It removes the selected month from that goal's reviewed months without changing allocations or financial records. Estimates remain unavailable while a required completed month is unreviewed. The action uses the existing authorised, version-checked, idempotent save route and is supported by private pending-draft backup recovery. It can be reversed by completing the normal month review again.

Verified: 58 unit tests; two focused browser journeys including persisted recheck and unchanged assignments; isolated PostgreSQL commit/read-back; lint; TypeScript; production build. No live AI, voice, email or production services were invoked. Goal archival and other limits in PRODUCT-CROSSCHECK.md remain outstanding.

## Forgiving private draft restoration — 16 October 2026

Selecting a backup now stages it for review instead of immediately replacing the current draft. Users can keep their current story or explicitly replace it, with an explanation of draft date, record count and unconfirmed save. If the current draft changes before confirmation, restoration is disabled until the file is selected again. Multiple file reads cannot let an older read replace a newer selection. Malformed saved-action details use a plain-language error.

58 unit tests, two focused browser journeys, lint, TypeScript and production build passed. The browser recovery journey now verifies cancellation, preserving current text, blocking replacement after further edits, and explicit restoration without posting financial records. Final wording describes backed-up entries as records to review, not already approved records. Other product and launch gaps remain as recorded in PRODUCT-CROSSCHECK.md.

## Pending-save backup consistency — 16 October 2026

Private batch backups now require a complete pending batch and compare its proposed records, replacements, correction reason and workspace version with the restored review state. A changed or incomplete backup is rejected in plain language without replacing the user's current draft. The original request object/key is preserved for receipt recovery and idempotent retries; this validation never posts records or establishes authorisation.

Expanded recovery assertions passed within the 58-test unit suite. Focused browser and build results are recorded after completion. No database changes or external provider calls were needed.

Pending-save consistency verification complete: both focused browser journeys, lint, TypeScript and production build passed.

## Combined recovery, planning and language pass — 16 October 2026

- Payment-date history is now visible in People, plans and check-ins, including cleared dates and dates belonging to previous corrected balances. This exposes the existing retained history without changing financial totals.
- Invalid saved-person names, roles, months and planning fields now return concise instructions rather than raw schema-validation details. Failed parsing changes no workspace data.
- Pending batch backups must also match their original narration, preventing a restored review from showing different source words than the save being recovered. Manual records retain the application's existing source fallback.

59 unit tests, both affected browser journeys, lint, TypeScript and production build passed. Full browser regression is being rerun across the combined recent changes. Real AI/voice evaluation, provider email, goal archival and the other launch prerequisites remain outstanding; these changes do not establish launch readiness.

Combined full browser regression completed: all 23 tests passed, including local authentication, lost-response recovery, exports, workspace isolation, and 320/390/768/1440 light/dark layouts.

## Saved people, privacy and recovery — 16 October 2026

Saved-person entries can now be renamed, have their usual role changed, or be removed from future suggestions. The UI explains that these operations do not rewrite previous names, debts, payments or financial history. Missing/foreign contact IDs are rejected by the workspace-scoped domain operation. Renames reject duplicate names. Both operations use the authorised versioned/idempotent route and are permitted in pending-action draft backup recovery.

Verified: 60 unit tests, two focused browser journeys covering edit/removal and unchanged records, isolated PostgreSQL commits/read-back for both operations, lint, TypeScript and production build. No production resources, live AI or external emails were used. This is suggestion-list management, not deletion of financial records or completion of an account-data deletion request.

## Ten-item usability and correctness pass — 16 October 2026

1. Search saved people by name, without changing the saved list.
2. Helpful empty states for saved people, unmatched searches, unpaid balances and goals.
3. Duplicate-person comparison normalises Unicode width, repeated whitespace and case.
4. Unpaid balances sort by payment date, with past/today/upcoming/no-date labels.
5. Explicit clear-payment-date action, retained history, and date input constrained to the original balance date.
6. Domain rejection of new payment dates on fully settled balances; existing date clearing remains possible.
7. Unchanged goal names/targets and unchanged payment dates no longer append misleading history entries.
8. Goal-month evidence displays exact assigned amounts and checked/unknown status for the three completed months, respecting amount masking.
9. Payment-date, goal-change and check-in history display newest changes first without rewriting storage.
10. Settings-dialog save feedback is announced politely inside the dialog, alongside visible errors.

Verification: 62 unit tests; isolated PostgreSQL integration; three focused browser journeys (including planning at 320/390/768/1440 in light/dark, overflow and Escape dismissal); lint; TypeScript; production build. The 320px light screenshot was visually inspected. Broader live-provider, operator, legal and remaining product gaps remain in PRODUCT-CROSSCHECK.md. No production migrations or paid services were used.

## Local voice recording enabled — 16 October 2026

Separated local recording from provider transcription availability. Voice opens the real MediaRecorder controls in synthetic and authenticated workspaces. Explicit Start requests microphone permission; supported WebM/Opus browsers can stop/cancel, play back, download or discard their clip. A manually typed transcript can enter the normal text-review workflow. Clips are not uploaded automatically. The dialog explains that closing it discards its in-memory clip and offers private download first.

Concurrent permission requests are blocked; closing the dialog before permission resolves stops any subsequently returned tracks. Denied permission has a plain-language fallback. Transcription UI is enabled only with an authenticated non-demo session, VOICE_ENABLED, VOICE_QUALITY_APPROVED and an OpenAI key. Those gates were not bypassed and no live transcription was performed.

Verification: 62 unit tests; browser checks for available recording controls, microphone-off state, absent transcription action, text fallback and no transcription requests; existing actual WebAudio/MediaRecorder Opus encoding/validation test. These checks do not claim successful recording from the user's physical microphone or transcription quality. User microphone permission and a supported secure-context browser are still required for actual capture.

## Voice recovery and usability pass — 16 October 2026

Implemented together:
1. Cancel a pending microphone permission request and stop tracks from a late grant.
2. Guard permission-request races so older attempts cannot reset a newer request.
3. Confirm replacement of an existing clip, with a private-download reminder.
4. Preserve typed/transcribed words when cancelling, discarding or replacing audio.
5. Cancel waiting for transcription, with an explicit warning that provider receipt cannot be undone.
6. Abort stalled transcription after 55 seconds and abort in-flight work when closing.
7. Block transcription while offline with recoverable-work guidance.
8. Validate returned transcript type, nonempty content and 12,000-character limit.
9. Explain denied, missing or busy microphones without exposing raw device errors.
10. Show clip duration, size, format and accessible playback label with narrow-screen sizing.
11. Download typed/reviewed words separately; show character count and prevent a new transcript silently overwriting them.
12. Warn on browser unload while a clip, text or recording is present; always release tracks/timers when recording stops.

64 unit tests and both voice browser checks passed, including actual browser-generated WebM/Opus validation. No microphone access was simulated as a successful user recording, and no real provider transcription was invoked. Cancellation/timeout paths are implemented but have not been evaluated against a live provider. The automatic transcription configuration/quality gates remain intact. Physical microphone and representative speech-quality checks remain necessary.
