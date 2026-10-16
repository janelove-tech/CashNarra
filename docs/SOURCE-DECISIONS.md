# Sources and decisions

Original source inventory: Research CashNarra Concept.txt (165,951 bytes), Recommend Technology Stack.txt (89,277 bytes), Storyline handoff package.txt (32,464 bytes), CashNarra_Design_Kit_v2.zip (20,931,465 bytes). ZIP safely extracted with resolved-path containment checks to references/narra-v2 without overwriting a directory. Source files preserved. No application, lockfile, Git repository or applicable ancestor AGENTS.md was present. Node 24.21.0 / npm 11.19.0 available; npm selected.

Authority: current instruction > final stack decisions > Narra v2 > final concept. Automatic inbox, confidence scores, full accounting, Storyline v1 and paid development proposals are superseded. Next 16, React, TS, CSS Modules, Supabase, exact decimal ledger, bounded OpenAI, local/free development remain fixed.

References include README, guide and brief, semantic tokens, licensed fonts, outlined marks, Ama Works dataset, desktop/mobile/dark screenshots, interactive preview, app.css/app.js, application and campaign examples. Campaigns remain organised in references; no publication or customer claims.

Opening obligations offset opening equity, not current sales. Stock is an asset; owner withdrawals equity; settlements reduce linked debt. No profit calculation. Unknown opening means unknown balance. Goal pace uses reviewed allocations in three completed months, not cash surplus. Fixture contributions begin October 2026; live dates remain inputs.

Stages: domain/migrations/fixtures; real adapters and reusable Narra UI; reports/goals/exports/offline/privacy; build and browser/database verification. Actual evidence belongs in BUILD-STATUS.md.

Implementation decisions: a workspace JSON aggregate is validated and versioned by a narrowly scoped PostgreSQL function; its journal projection uses NUMERIC(20,2). The function locks the workspace, validates the entire candidate state, preserves histories and commits its receipt atomically. Two-workspace moves lock both workspaces in a deterministic order. This keeps one application and avoids an ORM or service architecture. Application arithmetic uses decimal.js and API amounts remain strings.

Excel financial cells are exact decimal strings because native spreadsheet numbers cannot preserve the complete NUMERIC(20,2) range. CSV numeric fields remain decimal text; untrusted descriptive fields receive formula-injection protection. PDF embeds Inter for the cedi glyph. Exports state periods, exclusions and source record references.

Local Supabase CLI 2.108.0 is pinned after 2.120.0 incorrectly reported a missing local database as running. Local API/database ports 58321/58322 deliberately avoid unrelated projects. Supabase authentication, official SDK calls and PostgreSQL RLS have been exercised locally; hosted providers remain unconfigured.

Source minimisation removes retained narration while preserving financial records and correction evidence. The maintenance function is not exposed to app users. Legal retention and backup expiry require operator policy. Campaign imagery is held outside public assets in handoff/campaign; original references remain intact.

Voice is implemented as an optional gated follow-on, disabled pending quality and upload validation review. No microphone access or transcription success has been simulated. General AI remains opt-in; fixture-only mock support is explicitly declared. No model establishes access rights or authoritative totals.

The upload endpoint bounds actual streamed multipart bytes before parsing; Content-Length cannot bypass the limit. The separate clip-size and format checks still apply. Server verification now counts WebM/Opus packet duration and checks timeline bounds; client-supplied duration is not authoritative. The initial format is narrowed to single-track, non-laced WebM/Opus; MP4 requires separate verified handling and is not enabled. A metadata-only library was evaluated and removed because it did not provide the required guarantee.

Migration 202610140005 adds source-reference integrity independently of retention: every financial record, including superseded records, retains a source identifier even after narration is minimised. Tests cover invalid source references alongside immutable source history.

Recording parser references: [Opus RFC 6716](https://www.rfc-editor.org/rfc/rfc6716) for packet frame duration/count and [Matroska specification notes](https://www.matroska.org/technical/notes.html) for block timestamps and lacing. The parser deliberately rejects unsupported structures instead of acting as a general media decoder.

Workspace moves retain references to the original record and source without copying the full raw narration. A narration can describe several unrelated records; copying it would unnecessarily expose those details in the destination workspace and restart raw-text retention. The original workspace retains its existing source/history and retention policy. Moving a record does not bypass allocation sufficiency checks.
