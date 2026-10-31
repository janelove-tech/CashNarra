# CashNarra current development handoff

Updated: 2026-10-31 — verified app interface refinements; prior update: 2026-10-30 — bounded experience/recovery pass. The earlier physical-phone and marketing handoffs remain below.
Prior update: 2026-10-21 — Claude Code, fresh UI and UX pass (after Cursor, publish the working branch)
Branch: codex/app-ui-polish-20261031, based on codex/experience-recovery-20261030 at ff7285c5400ddd7a58343779672654e646abac59
Baseline: 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92
Reconciled starting HEAD: 70d99415a84c779e453c2b475067654ef4cbf9f6
Current HEAD: the commit containing this handoff; resolve with git rev-parse HEAD.
Current phase: 08 — release verification; Phase 09 remains EXTERNAL
Status: INCOMPLETE — review findings 1–23 and 25 are implemented in product code; 24 and 26 stay unmeasured
Verdict: NOT V1 COMPLETE

## App interface refinements — 2026-10-31 (Codex)

The owner approved implementing the app UI direction after the research and review prototype. This bounded pass refines the actual Next.js app on `codex/app-ui-polish-20261031`, stacked on the recovery branch. On 31 October 2026 the owner subsequently explicitly approved GitHub publication and merge. Integrate the UI into the recovery branch, then the combined changes into `work/cashnarra-v1` through the existing pull-request workflow. The separate public demo and the release verdict remain as recorded.

Implemented: review context (workspace/type/currency/date), optional original words, fully wrapping shared record rows and quiet Change actions, one save/recovery action, and an explicitly proposed balance result using the existing ledger on a detached copy. Balance wording is scoped to one recorded balance. Confirmed results use actual record dates, show one consequence per balance, and open the correct day or multi-date range. Settings uses consistent rows and accurate device-draft/request copy. Phone navigation, net-movement emphasis and goal hierarchy are clearer. Tell/page-focus sequencing and short-screen scroll margins preserve the person's input focus. Extreme enlargement returns controls to document flow.

PASS: full `npm ci`, lint, typecheck, 35 unit files / 214 tests, production build, and 54 browser regressions across 11 suites against that production build. This supersedes the prior section's NOT RUN main-app compilation/browser status for these exercised paths. The build retains six baseline dynamic-filesystem tracing warnings. Local Turbopack persistence required a fresh generated cache; no product configuration was changed.

PASS: single interpretation while editing one of three proposals; no write before Save; corrected debt preview and authoritative result; original-request recovery after a committed save loses its response; retained Records filters/row focus/draft; actual dates and multi-date drilldown; privacy masking; long amounts; reduced motion, keyboard containment, phone navigation/Back, short viewport and offline fallback. Review/shared-screen layout checks cover 320×640 light, 390×640 dark, 768×640 light and 1440×640 dark, with review/Settings text contrast. Existing Home/dialog/contrast checks cover 320–1440 in both themes. Final review and Settings screenshots were inspected. See `docs/ux/UI_REFINEMENTS_2026-10-31.md` for the exact scope and evidence.

NOT RUN / EXTERNAL: physical phone software keyboard, human screen-reader use, native Edge 200% browser zoom, Supabase authentication/recovery/RLS service checks, live narration/transcription and representative speech quality. CSS enlargement 2 and resized viewports are emulation, not substitutes for those checks. No provider, email, production data write, migration/reset, pricing change, production deployment or merge. Phase 08 remains INCOMPLETE / NOT V1 COMPLETE; Phase 09 EXTERNAL.

Publication block RESOLVED: the owner explicitly authorized uploading the implementation and internal handoff notes and also authorized merge. The earlier rejected action did not upload anything. Publish the verified UI branch, require passing GitHub CI, merge its pull request into the recovery branch and then the combined recovery pull request into `work/cashnarra-v1`. GitHub's PR states and merge commits are the publication/integration receipts. After that authorized integration, resume the physical-phone port-forward handoff below. The automated UI checkpoint is complete; it is not a V1 release verdict.

## Experience and recovery pass — 2026-10-30 (Codex)

The owner approved the first experience batch after the discussion research. This is a bounded product change on `codex/experience-recovery-20261030`, based on `397256dd00ba7fbb35b86a79fd380b855fc1965f`. Both published working branches matched that baseline at the start. The earlier phase verdict and phone sign-in port handoff below remain in force.

Implemented: distinct initial-load failure with a retry and separate sign-in handling; clearer unconfirmed-save recovery using the original request; saving/checking button feedback; focus on the confirmed saved result; same-page Tell/composer focus; retained Records reading position and original-row focus across a correction; an explicit Back to records action that retains the correction draft; saved result counts, no-match versus no-record copy, and scoped unpaid-balance wording.

The separate public demo includes these shared components plus a guided prepared payment, a clearly named Voice preview, and protection against replacing/concatenating an unfinished story with another sample. The real app's recording path is unchanged. Purple brand assets, decimal ledger, journal rules, request identity, revisions and existing server behavior are unchanged.

Evidence: the exact shared components build in the separate deterministic demo. Its 58 tests pass, including receipt recovery after a lost response and reload. Managed-browser desktop and 390×640 checks exercised prepared save/clarification, GH₵600 → GH₵400 after save, retained correction work, no-match/reset and return to the original visible Records row. No provider was called and no email was sent. Four focused main-app regression tests were added in `tests/e2e/experience-recovery.spec.ts` and syntax-checked. Full main-app typecheck/build/e2e are NOT RUN here because only the selected files were materialized, not a full runnable Next/Supabase checkout. Do not treat demo evidence as a full app release check.

Next for this branch: run the repository's typecheck, build and focused e2e in the full checkout with the normal local demo services; inspect keyboard restoration, load failure, authorization failure and a lost save response. Keep the PR in draft until that evidence is recorded. This does not authorize a main-app production deployment or merge. Phase 08 remains INCOMPLETE; Phase 09 EXTERNAL; NOT V1 COMPLETE. The earlier phone port-forward check remains a separate outstanding item.

## Marketing: "7:15. Two evenings." v04 performance repair — 2026-10-29 (Claude Code)

- **Status: BLOCKED at the art gate. No v04 export exists. The v01 pair is unchanged and still awaits review.**
- **Why.** The single Kofi master cannot be rigged into a believable grip, lift and set-down with a change of expression. Evidence: `marketing/video/two-evenings-film/revisions/v04/dev-check/rig_check_v04.jpg`.
- **Owner action needed.** Supply the poses listed in `revisions/v04/PERFORMANCE_BLOCKER.md`, or authorise a free illustration path.
- **Ready.** Candidate narration v04 (Kokoro af_heart). It is NOT auditioned and not accepted.
- **Integrity.** 40/40 protected exports are hash-identical.

## Marketing: campaign v03 character films — 2026-10-29 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged.

- **Delivered first cuts**, each a voiceover and voiceless pair awaiting the owner's single review. Index: `marketing/video/VIDEO_INDEX.md`. Checkpoint: `marketing/video/campaign-runs/20261029-151456-v03-e12d9a/PRODUCTION_STATUS.json`.
  - `two-evenings-film` v01
  - `clearer-picture-film` v02
  - `one-question-film` v01
  - `already-recorded-film` v01
  - `different-days-film` v02
- **BLOCKED: Esi's "Say it while it's fresh."**
  - The only transcription path is Groq, a metered provider, and `/api/transcribe` refuses demo workspaces.
  - It needs the owner's decision on an authorised free-only path.
- **Evidence:** `marketing/video/campaign-v03-kit/capture/JOURNEY_V03.md`. Capture worktree `../CashNarra-video-v03`, kept for re-capture.
- **Checks:** NOT RUN: listening. All 19 protected exports are hash-identical after the run.
- **Next video step:** the owner's review of the five films. Open points are in each REVIEW.md: limited cut-out acting, the synthesised foley/score balance, and the one-word MoMo pronunciation.

## Marketing: two character-led films and the symbol ident — 2026-10-29 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. This section supersedes the "Next video step" lines below for these three films.

- **Delivered (first cuts, awaiting the owner's review).** The index is `marketing/video/VIDEO_INDEX.md`.
  - `mascot-ident/renders/mascot_ident_v01.mp4` and `_silent_v01.mp4`: 9.0 s, 270 frames.
  - `day-in-life-film/renders/day_in_life_voiceover_v01.mp4` and `_voiceless_v01.mp4`: 77.5 s, 2,325 frames.
  - `report-film/renders/report_voiceover_v01.mp4` and `_voiceless_v01.mp4`: 56.5 s, 1,695 frames.
  - Each folder has a REVIEW.md.
- **Character.** Ama is cut from the supplied boards: local background removal, a head/body rig with neck and feet pivots, pose swaps on motion, and model-sheet expression heads. The shared pack is `marketing/video/ama-assets/`.
  - Stated limits: the art is enlarged about 2.7× and so is softer than native. Arms are not jointed. The shop and supporting cast are flatter SVG.
  - Why: no image-generation tool was available, and paid services were not allowed.
- **Product truth.**
  - PASS: one isolated fictional day (13 Oct 2026) in the new worktree `../CashNarra-video-day`, using the video-only `capture/video-day-fixture.patch`:
    - openings: Cash 1,000, MoMo 200, Bank 1,000, Abena owes 600;
    - a mocked reader that proposes one correct event for each of the 8 exact stories;
    - nothing saved before confirmation, 8 genuine receipts, 9 records after reload;
    - summary: in 2,300, out 930, net 1,370 "not profit", sales 2,400, people owe 700.
  - PASS: PDF exported through the real UI (Records → Export → Specify → One day → PDF), 2 pages, every highlighted figure reconciled. The flagged expense ambiguity does not arise: there is no unpaid expense.
  - EXTERNAL: live reader behaviour; the extraction was mocked.
  - The main checkout's app code is unchanged.
- **Checks.**
  - PASS: FFprobe, identical picture within each pair (framemd5), HyperFrames check with 0 errors.
  - PASS: both story films at −16.0 LUFS and ≤ −1.2 dBTP. The ident is deliberately at −20.4 LUFS.
  - PASS: frame inspection of the decoded contact sheets.
  - PASS: the ident's settled logo matches the approved SVG to anti-aliasing.
  - NOT RUN: real-time playback and listening by a person.
- **Accepted exports.** PASS: all four SHA256s are identical before and after (`0efb6c28…`, `d2c8dff1…`, `44bb7faf…`, `93a71196…`). The five shorts and the male-voice experiment were not touched.
- **Next video step:** the owner's consolidated review of the three first cuts. Open points are in each REVIEW.md: ident scale, Ama's softness and the style match of the shop and cast, the missing glance-back beat, and the illustrated keep/share beat.
- No provider call, payment, journal, database, deployment, commit or upload. The `../CashNarra-video-day` worktree (detached `0c80f64`, patch applied) is retained for re-capture. Its dev server on :3210 was stopped.

## Marketing films: final cleanup and three new first cuts — 2026-10-28/29 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. This section supersedes the earlier "Next video step" lines.

- **Accepted by the owner (28 Oct):** both voiceover_v02 films. Each film is kept in a voiceless and a voiceover version:
  - `repayment-film/renders/pilot_v02_sound.mp4` and `repayment_voiceover_v02.mp4`;
  - `several-records-film/renders/several_records_v01.mp4` and `several_records_voiceover_v02.mp4`.
  - PASS: all four SHA256s are identical before and after (`0efb6c28…`, `d2c8dff1…`, `44bb7faf…`, `93a71196…`). Nothing was renamed, moved, re-encoded or re-rendered.
- **Cleanup**, inside `repayment-film/` and `several-records-film/` only.
  - Removed:
    - both voiceover_v01 MP4s, with their takes, mixes, dipped stems, outputs and checksum lists;
    - `index_voiceover_v01.html`, `voiceover_v01.json`, and the v01 `make_voice.py` and `mix_voiceover.py`;
    - caches and check artefacts.
  - Kept:
    - the editable sources;
    - the v02 scripts, takes, narration, dipped stems and tools;
    - the voiceless stems, fonts, logo and GSAP;
    - the capture evidence;
    - `repayment-pilot/`, which holds the capture evidence and the mock-reader patch;
    - `repayment-proof/`, whose prep script is still used;
    - `voice-tests/`, because two repayment v02 takes are cut from it;
    - `renders/review_v02/`;
    - all review notes, with the v01 notes marked superseded.
  - Rebuild guards:
    - `npm run render` now runs `tools/safe_render.mjs`, which refuses the four accepted names and any existing file.
    - `mix_voiceover_v02.py --mux` refuses the accepted names even with `--force`.
  - A new `FINAL.md` in each folder marks the voiceover_v02 version as owner-accepted.
- **New first cuts, awaiting the owner's single review.** Each has a voiceless and a voiceover version, a contact sheet, `capture/JOURNEY.md` and `REVIEW.md`. The index is `marketing/video/VIDEO_INDEX.md`.
  - **#5 Three things to record before you close:** `closing-habit-film/`, 26.0 s. Stock demo. It shows the Home "Today so far" panel after the save: Money in GH₵2,300, Money out GH₵930, Owe you GH₵800.
  - **#1 Shop closed. Mind still open.:** `closing-time-film/`, 23.4 s. It uses a documented video-only mock-reader branch for one sentence (`capture/video-fixture.patch`, three correct records). Review, save, receipt, retry and reload are real app behaviour.
  - **#2 Your head is not a ledger.:** `head-ledger-film/`, 24.6 s. Stock demo. It uses the "unclear version" story, the genuine "Which account paid for delivery?" question, and the day's Money Story.
  - **#1 male alternative (29 Oct):** `closing-time-film/renders/closing_time_male_v01.mp4`, waiting for the owner to compare it with the female version.
    - Voice: Kokoro `am_michael`, American English, one voice, made with the v02 method and the scripts unchanged. The wording is unchanged.
    - The picture is copied from the voiceless v01. It measures −16.0 LUFS and −1.0 dBTP.
    - Peak control was larger than for the female version: 5.0 dB at the onset of "Check".
    - See `MALE_VOICE_REVIEW.md`. Listening NOT RUN.
    - The female versions in repayment and several-records, and every existing export, are unchanged (393 checksums).
- **Checks:**
  - PASS:
    - `hyperframes check` gives 0 errors and 0 warnings for each new film;
    - 1080×1920 at 30 fps, at 780, 702 and 738 frames;
    - each film's voiceless and voiceover versions have identical video;
    - voiceless −16.1 to −16.3 LUFS; voiceover −16.0 LUFS and −1.0 dBTP;
    - speech recognition finds no speech in the voiceless versions;
    - all timing rules pass, including saved narration only after the first genuine saved frame;
    - contact sheets inspected.
  - NOT RUN: listening, and full-speed phone playback.
- **Capture worktree:** after each capture it was restored to the repayment mock-reader patch, and the diff was checked identical. No app code changed in the main tree. No provider call, payment, publication or commit.
- **Next video step:** the owner reviews the three first cuts in one sitting. Listen first to the narration trims flagged in each `REVIEW.md`. The largest is 4.45 dB on "asks" in #2.

## Marketing voiceover v02, both films — 2026-10-28 (Claude Code)

The owner listened to `voice-tests/conversational_v02.wav` and said it sounds okay. Its method was applied to both films:

- **New files:**
  - `marketing/video/repayment-film/renders/repayment_voiceover_v02.mp4`
  - `marketing/video/several-records-film/renders/several_records_voiceover_v02.mp4`
  - Notes: `VOICEOVER_REVIEW_V02.md` in each film folder.
- **Method:**
  - One connected Kokoro `af_heart` take per section, at speed 1.0.
  - In-context phonemes with the approved CashNarra and cedis swaps; no inserted pauses.
  - One static narration gain per film; no per-take levelling, EQ or compression.
  - Two repayment takes (the question and the GH₵400 answer) are cut from the approved test at quiet gaps between sentences.
- **Scripts:** the brief's wording, unshortened, including the full several-records checking paragraph (7.5 s of speech in 8.3 s).
- **Peak handling:** a narration-only transient trim was needed to meet −1 dBTP at −16 LUFS.
  - Repayment: 0.76 dB for 6.5 ms.
  - Several records: three spots, 22 ms in total; the largest is 3.9 dB on the onset spike of "All".
- PASS (automated): original MP4 checksums unchanged; all decoded frames and bitstreams identical (660 and 858 frames); 1080×1920 at 30 fps; −16.0 LUFS and −1.1 dBTP for both; stereo, non-silent; timing rules 5/5 each, including "All eight, saved" after frame 603; offline speech recognition matches every word apart from the CashNarra and cedis spellings.
- NOT RUN: listening to either complete mix.
- **Next video step:** the owner's single listening review of both v02 films. Listen first at the brief bed lift before each composer line and at the "All" onset.

## Marketing conversational voice test v02 — 2026-10-28 (Claude Code)

The owner heard both v01 voiceovers as robotic and approved the CashNarra and cedis pronunciation. Before any film rebuild there is one dry test, `marketing/video/voice-tests/conversational_v02.wav` (10.29 s), with notes in `TEST_NOTES.md`.

- Same Kokoro `af_heart` voice and approved phonemes.
- One connected take, with no inserted pauses and no per-phrase levelling or dynamics processing.
- Kokoro has no style or emotion control.
- NOT RUN: listening.
- **Next video step:** the owner listens to `conversational_v02.wav`. If it is natural enough, rebuild both voiceovers from connected takes. If not, the limit is likely the engine, and the next step is an owner-approved voice source.

## Marketing voiceover first cuts, both films — 2026-10-28 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. This section supersedes the "Next video step" lines below.

- **Delivered:**
  - `marketing/video/repayment-film/renders/repayment_voiceover_v01.mp4`
  - `marketing/video/several-records-film/renders/several_records_voiceover_v01.mp4`
  - Notes: `VOICEOVER_REVIEW.md` in each film folder.
- **How they were made:** the accepted video streams were copied with `-c:v copy` and only the audio was replaced. No render was run.
- **Originals unchanged.** Both SHA256s were recorded before and after the work, and both are identical (`0efb6c28…`, `44bb7faf…`).
- **Voice:**
  - Kokoro-82M `af_heart`, run locally (Apache-2.0). It is an **American English female voice, not Ghanaian.** No local Ghanaian voice exists, and the Windows voices are robotic.
  - The model was already cached by the HyperFrames plugin. `kokoro-onnx` and `faster-whisper` were installed into `%LOCALAPPDATA%\CashNarraVideoTools\tts-venv`, outside the repo.
  - No provider call, credential or payment.
- **Pronunciation:** set by phoneme overrides: cedis = SEE-deez, CashNarra stressed on CASH, Abena = ah-BEH-nah.
- **Repayment script change:** the spoken Abena sentence is omitted. It needs about 3.6 s, and the composer holds 3.3 s. The sentence stays readable on screen.
- PASS (automated):
  - 660 and 858 decoded frames, every one MD5-identical to its original, and identical copied bitstreams;
  - −16.0 LUFS, with true peak −3.6 and −2.9 dBTP;
  - stereo, non-silent;
  - no narration self-overlap or cut-off;
  - timing rules 8/8 and 10/10, including that "All eight, saved." starts at 20.77, after the first saved frame (20.10).
- PASS (frame inspection): the sync frames.
- PASS: `hyperframes check` on both `index_voiceover_v01.html` files, with 0 errors.
- PASS (offline speech recognition): all words recognised, except that the coined brand word was spelled "Cashnara".
- NOT RUN: listening by any person or agent.
- **Next video step:** the owner's consolidated review of both voiceover cuts. Listen on a phone and on headphones. Decide whether the American voice is acceptable or whether a Ghanaian English voice source should be approved.
- No app code, provider call, payment, journal, database or deployment change. Nothing uploaded or committed.

## Marketing film #4 "One story. Several records." first cut — 2026-10-28 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. This section supersedes the "Next video step" line of the repayment section below.

- **First cut:** `marketing/video/several-records-film/renders/several_records_v01.mp4`. 1080×1920, 30 fps, 28.600 s, 858 frames, AAC. −16.3 LUFS, −3.8 dBTP. The notes are in `several-records-film/REVIEW.md`; the journey is in `several-records-film/capture/JOURNEY.md`.
- PASS (stock demo, capture worktree with the repayment patch reversed for the run, then reapplied and verified): the stock 252-character sample proposes 8 records; nothing is saved before confirmation; "Save 8 records" produces a genuine receipt (+8 records); a replayed save request adds 0; the records persist after reload; a repeated submission gets "Possible duplicate" and adds 0. The demo's default date (13 Oct) already holds this sample, so the capture set Date of activity to 28 Oct in the composer. EXTERNAL: what the live reader would propose (mock reader; no provider call).
- PASS: HyperFrames check (0 errors, 0 warnings). PASS: FFprobe and loudness. PASS (frame inspection): the contact sheet and close crops. NOT RUN: real-time playback and listening by a person.
- The accepted repayment MP4 SHA256 `0efb6c28…2cde0` was unchanged before and after. `repayment-film/` was not modified.
- **Next video step:** the owner's consolidated review of v01, covering picture, sound and the 28.6 s length (open points in REVIEW.md).
- No app code, provider call, payment, journal, database or deployment change. Nothing uploaded or committed.

## Marketing repayment film final — 2026-10-28 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. This section supersedes the v03 and v02 "next video step" lines below.

- **Accepted:** `marketing/video/repayment-film/renders/pilot_v02_sound.mp4` with the original v02 soundtrack. SHA256 `0efb6c28…2cde0` is unchanged. The v03 score was rejected and its files removed.
- **Editable source:** `repayment-film/` root, restored to v02. It matches the v02 freeze record (36 files). Start at `repayment-film/FINAL.md`. Render with `npm run render` (`--no-browser-gpu -w 1`).
- PASS: HyperFrames check (0 errors; the known `line_unread` warning). PASS: all asset references resolve. PASS: FFprobe (660 frames, 22.000s, AAC). NOT RUN: re-render (not needed).
- **Removed:** v01 and v03 renders, frozen source copies, v03 audio and tools, diagnostics, keyframes, superseded review sheets, still and proof outputs. **Kept:** capture evidence in `repayment-pilot/capture/`, both asset-cutting tools, the v02 review frames, the style pack and references, and the capture worktree. `marketing/repayment-film.zip` was kept because its ownership is uncertain.
- Mock-reader limitation stands: the film's proposal came from a patched demo reader (see `FINAL.md`).
- **Next video step:** see `marketing/video/NEXT_VIDEOS.md`. Recommended: #4 "One story. Several records.", the only remaining concept the stock demo reader supports. Step 1 is to verify and log its fictional journey. The owner decides how many records to show.
- No app code, provider call, payment, journal, database or deployment change. Nothing uploaded or committed.

## Marketing video pilot v03 cinematic score — 2026-10-28 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. The owner found v02's sound bland. `marketing/video/repayment-film/renders/pilot_v03_cinematic.mp4` replaces the music with an original, locally synthesised scored cue: piano motif, pizzicato pulse, string ensemble and light percussion. The picture is bit-identical to v02 (all 660 frames, framemd5). v02 is frozen in `source/pilot_v02/` (checksums). Details: `AUDIO_NOTES_V03.md` and `PILOT_REVIEW.md`.

- PASS: HyperFrames check (0 errors; the known `line_unread` warning only).
- PASS: FFprobe (1080×1920, 30/1, 660 decoded frames, 22.000s, AAC stereo present).
- PASS (measured): −16.1 LUFS, −1.6 dBTP, 0 clipped samples, LRA 9.5 LU.
- PASS (automated): cue alignment; confirmation not before saved frame 306; clean ending, silent from 21.87s.
- NOT RUN: listening by a person. The instruments are synthetic models and may sound electronic.
- Next video step: the owner listens to `pilot_v03_cinematic.mp4` on a phone and on headphones.
- numpy and scipy were installed into a venv outside the repo (`%LOCALAPPDATA%\CashNarraVideoTools\audio-venv`).
- No app code, provider call, payment, journal, database or deployment change. Nothing uploaded or committed.

## Marketing video pilot v02 sound pass — 2026-10-28 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. `marketing/video/repayment-film/renders/pilot_v02_sound.mp4` adds a restrained, original, locally synthesised sound pass to the accepted v01:

- a quiet bed that resolves at the answer and is silent from 21.80s;
- key ticks only while letters appear;
- taps on Understand (7.033) and Save (10.033);
- a soft confirmation one frame after the first saved frame (10.233).

It also moves the People card inward: its margins are at least 57px at the full push-in. The editable v02 source is the root `index.html` plus `compositions/`. v01 is frozen in `source/pilot_v01/`. Details: `AUDIO_NOTES.md` and `PILOT_REVIEW.md`.

- PASS: HyperFrames check (0 errors, contrast 45/45).
- PASS: FFprobe (1080×1920, 30/1, 660 decoded frames, 22.000s, AAC present).
- PASS (measured): −16.0 LUFS, −3.9 dBTP, no clipping.
- PASS (automated): cue alignment.
- PASS (frame inspection).
- **Render with `--no-browser-gpu -w 1`.** With 5 workers, images dropped again.
- NOT RUN: real-time listening by a person, and phone playback.
- Next video step: the owner listens to `pilot_v02_sound.mp4`.
- No app code, provider call, payment, journal, database or deployment change. Nothing uploaded or committed.

## Marketing video silent pilot v01 — 2026-10-28 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. The full 22-second silent pilot is `marketing/video/repayment-film/renders/pilot_v01.mp4`, with notes in `marketing/video/repayment-film/PILOT_REVIEW.md`.

- Built on an earlier unlogged five-scene draft that was already in that folder (question, tell, check, answer, ending). The answer → relief handoff is now a cut at 17.6s.
- Holds: the row and Save are settled together 8.02–10.00s (1.98s). The genuine saved confirmation shows 10.20–12.22s. The answer is still 13.70–17.60s. The line and logo are settled 19.15–22.00s (2.85s).
- Rendering: the first render used GPU capture and dropped UI images in many frames. The delivered render uses `decoding="sync"` and `render --no-browser-gpu`. Re-render that way.
- PASS: HyperFrames check (0 errors; contrast 45/45; `film_silent` and `line_unread` reviewed).
- PASS: FFprobe (1080×1920, 30/1, 660 decoded frames, 22.000s, no audio).
- PASS (frame inspection, not playback): all 660 frames extracted; contact sheet, close handoff frames and 390px sheets inspected.
- NOT RUN: real-time human playback and sound.
- Captures were reused, so the journey was not repeated. The mock-reader limitation stands.
- Next video step: owner review of `pilot_v01.mp4`.
- The proof and still projects are unchanged. No app code, provider call, payment, journal, database or deployment change.

## Marketing video transition proof v02 — 2026-10-28 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. The owner reviewed `proof_v01.mp4` and asked for one staging revision. `marketing/video/repayment-proof/renders/proof_v02.mp4` now does three things. The advert card leaves with the question before the close-cropped genuine composer appears. GH₵200 is marked in place on the card, the typed "200" and the proposed row, with no travelling highlight. The composer is fully gone before Review shows, so only one sentence layer is ever visible. Typing runs at 22 characters a second with 0.43s settled before the tap, and the row and Save are settled for 1.55s. v01 source is kept as `compositions/proof_v01.html`; v02 is `compositions/proof_v02.html`. PASS: HyperFrames check (0 errors, contrast 40/40; the two `line_unread` warnings as in v01). PASS: FFprobe (1080×1920, 30/1, 180 frames, 6.000s, no audio). PASS (frame inspection): MP4 frames, including every frame of both handoffs and a 390px sheet. NOT RUN: real-time human playback and sound. Captures were reused, so the journey verification was not repeated. Next video step: owner review of `proof_v02.mp4`. The 22-second pilot has not been started. No app code, provider call, payment, journal, database or deployment change.

## Marketing video stage 3 transition proof — 2026-10-28 (Claude Code)

This is marketing work, outside Phase 08. The product **Exact next action** below is unchanged. The stills were accepted as the visual foundation. The highlight outlines on the GH₵200 row and GH₵400.00 were removed (restrained `#F0ECFC` highlight, app borders untouched), and stills 2 and 3 were re-exported. The beat sheet now holds the row and Save button settled together for 1.2s (10.2–11.4s) and plans the ending as answer, then relief line alone, then logo (settled 19.4–22.0s). A standalone six-second silent proof is in `marketing/video/repayment-proof/` (`PROOF.md`, `renders/proof_v01.mp4`). It carries one soft violet GH₵200 highlight from the opening card to the typed "200" and then onto the proposed row, with the row and Save settled for 1.5s. PASS: HyperFrames check (0 errors; contrast 40/40), the MP4 probe (6.000s, 180 frames, 30fps, 1080×1920, no audio), and close frames inspected from both the preview and the MP4. Two `line_unread` craft warnings are explained in `PROOF.md`. NOT RUN: a human viewing at full speed on a phone, and sound. Next video step: owner review of `proof_v01.mp4`, then the 22-second pilot. No app code, provider call, payment, journal, database or deployment change.

## Marketing video stage 2 stills — 2026-10-28 (Claude Code)

This is marketing work. It is outside Phase 08, and the product **Exact next action** below is unchanged. The owner authorised a video-only fixture variant. It lives only in the detached worktree `../CashNarra-video-capture` (at `0c80f64`, port 3200, demo mode, no env file). There Abena starts at GH₵600, and the mock reader accepts "Abena paid me 200 cedis today." This checkout's `src`, ledger and financial logic were not changed. PASS (inspected now): GH₵600.00 before; exactly one proposed GH₵200.00 "Payment from Abena · Old balance received"; Save this record; a genuine receipt (revision 3); "Saved · records confirmed"; GH₵400.00 after the save and after a reload. EXTERNAL: what the live reader would propose for that sentence (no provider call made). Three stills, an overview board and the editable HyperFrames composition are in `marketing/video/repayment-pilot/` (see `STILLS.md`). The reference notes, beat sheet, viewer copy and scene notes were updated. Next video step: owner visual review of the stills, then motion. The capture worktree can be removed with `git worktree remove ../CashNarra-video-capture` after review. No provider call, payment, journal, database or deployment change.

## Fresh UI and UX pass — 2026-10-21 (Claude Code)

The owner's master prompt authorised an independent UI/UX review and implementation on top of the reported Cursor screens. It is implemented and inspected in the running app; the decisions are in `docs/ux/UI_DESIGN_RECORD_2026-10-21.md` and the checks in the build log entry of the same name. Every screen names itself in the header, story progress shows only on the story screens, Today keeps the main action inside the first phone screen, Records groups people into People owe you and You owe, the review folds the create forms away and pins only Save N records, Explore what-if compares the recorded pace with the tried amount, Settings has an Account section, and Subscription uses rows. The two typecheck failures are repaired narrowly; `npm run typecheck`, `npm run lint`, `npm test` (208), the Edge browser suite except the two Supabase-backed specs (57 passed) and `npm run build` pass; the Supabase-backed auth and recovery specs are NOT RUN because that local stack was not running. Four browser tests were aligned with copy that earlier uncommitted work had already changed. No journal, hold, pause, price, provider or database change. Phase 08 stays incomplete; the screen-reader session, live recording, real phone keyboard and timing checks stay NOT RUN.

## Reader price, plans, and what-if — 2026-10-21

The one synthetic story check already succeeded and was not repeated. A later story reached the reader and was held because CashNarra refused to price ordinary Luna usage. Published standard rates now cover short context through 272,000 input tokens, including cached input, and the long-context rates above that. The 8,000-token figure is only the local hold for an ordinary story. That uncertain attempt was not sent again. Its exposure stays in the journal. The unpriced pause is closed, so a different story can be read. Fresh journal read after that close, with no new provider call: 164 calls, 14 unsettled, US$6.057663 committed, ceiling US$20. The new unsettled line is the US$0.425431 exposure. The earlier 13 holds were not released.

Free and Plus both show US dollars first. Free is $0 / month (GH₵0.00). Plus is $0.99 / month (≈ GH₵11.50), with $2.00 crossed out. Choose Plus opens a review and does not charge. Explore what-if is on each goal. Money Stories amounts stay on one line and wrap onto another row when they do not fit. The subscription screen shows real workspace counts and says story, voice, and report use is not counted yet. Paid renewal, cancellation, and a three-workspace downgrade are rules with tests. They do not charge or change this Free account. Settings, the story editor, and zero-value bars were tightened. A stored usage counter and a live payment provider are still absent.

## Public landing — 2026-10-21

The public page follows the chosen landing pass in `docs/ux/CASHNARRA_FINAL_HANDOFF.md`. Try an example is the main action and moves to See the records. The three records and the money summary stay hidden until that control is used. A missing delivery account asks Cash or MoMo before the summary. Reset returns the story to that hidden state. The fictional goal is separate: GH₵1,500.00 remains, about 5 months at GH₵300 and about 3 months at GH₵500. The invitation reuses the public catalogue. Start free opens account creation. Choose Plus opens the existing review and does not start Plus. These examples do not sign anyone in, save a record, write browser storage, or call a provider. The later recovery, counter, payment, and owner-console work was not started.

## App screens — 2026-10-21

Today keeps the workspace and date, and the story box is headed “What happened with your money?” The date sits with that story. Understand my story is the main action and stays off until there are words or a draft to finish. Tell your story still opens the fuller page, including Draft backup, without sending the words to be read again. Voice stays in the same entry. A day with no records says so, and does not present GH₵0.00 as money movement. Review says “Check these N records”, keeps the original words open, and puts Change beside a proposed row. Save uses the real count. Money Stories says Money in, Money out, then Net movement, and says that is not profit. Each goal shows Target, Set aside, and Remaining. Explore what-if shows the recorded pace beside Try a different amount and does not change the records. Delete original stories is in its own Data and privacy section. Pricing, Plan and usage, and the landing page were left as they were. No provider call, payment, journal change, or database migration.

## Published — 2026-10-29

The user asked to update GitHub with the current changes and to leave `marketing/video` on this machine. `redesign/words-to-records` and `work/cashnarra-v1` carry the same commits. `main` stays at the earlier published snapshot.

## Device cleanup — 2026-10-24

`redesign/words-to-records` and local `work/cashnarra-v1` are still the same commit. The Next 16.4.1 checkout at `CashNarra-next-16.4.1` matched this branch and was removed, along with the idle `.next` cache. Local books, the evaluation budget, voice-evaluation notes, and the Supabase database were left in place.

## Exact next action

Complete the owner-authorized GitHub integration of `codex/app-ui-polish-20261031` through the recovery branch into `work/cashnarra-v1`, checking the PR merge receipts. Once integrated, resume the physical-phone port-forward action below. The following restrictions belong to that separate physical-phone release stage; it has not been repeated or completed by this UI pass.

**Add the 58321 port forward, then repeat phone sign-in. Do not change application code for the "Failed to fetch" result.** The first physical recording (23 October 2026, Chrome on the phone, `http://127.0.0.1:3100`) loaded the public page and then Sign in. The account service was already running: GoTrue health returned 200, and a desktop password sign-in at 10:29 UTC reached Kong and returned 200. The phone's Sign in did not. The served client calls `http://127.0.0.1:58321/auth/v1/token?grant_type=password` directly. Kong has no password grant at the time of the recording. Port 3100 is forwarded; port 58321 is not, so the phone calls itself and the form shows "Failed to fetch". The address is already `127.0.0.1`, the same host as the page. Sign-in inputs already use `email` and `current-password`. Forward `58321` to `127.0.0.1:58321` in the same Chrome port-forwarding list. Do not forward `58322`. Follow `docs/ux/ANDROID_DEVICE_CHECKLIST_2026-10-23.md`. Do not push, deploy, package a Trusted Web Activity, or publish. Do not downgrade ESLint to clear the separate braces advisory. When a commit is requested, keep the Story Log and this phone pass as coherent commits and do not discard the other uncommitted work. Auth and recovery browser specs stay NOT RUN until the local Supabase stack is already running; do not start or reset that database just to run them. Real-device APP rows stay NOT RUN. Do not set `VOICE_QUALITY_APPROVED`, call a provider, or start checkout. The reported Next.js security upgrade was not run.

## Phase 1 phone pass — 2026-10-23

The seven approved fixes are in the working tree. Type your story returns to Today and focuses the existing composer, and an in-progress recording still asks before it is discarded. Choosing a destination clears the on-screen save banner only; saved rows, the request key, and an unconfirmed retry stay. `devIndicators: false` and `experimental.agentUpgrade: false` follow this install's Next.js 16.4 docs and hide the dev badge that covered the phone bar; they do not upgrade Next.js. The dark contrast hang was a test wait on animations that Playwright tracing never finishes; the test now finishes finite animations and still requires a contrast ratio of at least 3. Product motion was not changed. The offline page carries its own styles, and the public cache is `cashnarra-public-v4`. Create a workspace is closed behind a disclosure; the create action is unchanged.

PASS, emulated headless Edge on port 3100: phone, recording, trust, contrast, non-text contrast, and the rest of `tests/e2e` except auth and recovery. The export journey now opens Records after a save, because a confirmed save returns to Today, and then checks the same CSV, PDF, and XLSX downloads. PASS: `npm test` (34 files, 208 tests), `npm run typecheck`, `npm run lint`, `npm run build` (exit 0). NOT RUN: `tests/e2e/auth.spec.ts`, `tests/e2e/recovery.spec.ts`, `npm run test:db`, `npm run test:supabase`. NOT RUN (R): every real-phone row. No provider call, payment, journal change, database reset, migration, push, or deployment. Phase 08 stays incomplete. Phase 09 stays external. NOT V1 COMPLETE.


The landing page and the app screens stay as reported, now with the 21 October Claude UI pass on top; do not restart either pass. Do not start recovery, live usage counters, payments, the owner console, or Phase 09. The Groq key and the Free-plan confirmation are already saved. Do not ask for them again.

The prepared packet is `harness/context/08-remaining-checks.md`. The canonical handoff is `docs/ux/CASHNARRA_FINAL_HANDOFF.md`, including section 0.5.

The owner consented on 21 October 2026 to one clip of the prepared sentence, a Free Groq transcription, editable words, no saved record, no paid story reading, and no automatic resend. The local recording had to be deleted immediately, and no later than 22 October 2026 at 23:59 GMT. The clip was spoken by the computer, not by a person. `whisper-large-v3-turbo` returned: “I sold 500 cedis for cash. Ama has not paid the 100 cedis she owes. I moved 200 cedis from cash to Momo.” The 500, 100, 200, the name Ama, “has not paid”, and Cash to MoMo all survived. Nothing was saved, and the story reader was not called. The audio files were deleted in the same run. The OpenAI journal stayed at 42,217 bytes. Groq capacity recorded a Free settle with payable US$0 and a reference of 125 micros, which was not taken from the US$20 journal. This one computer-spoken clip is not accent evidence. The five-speaker intake is still NOT READY. Do not record or send this sentence again.

A person using a screen reader has a written task and has not done it. Finding 24 has a blank measurement sheet. The phase file has no pass or fail time, so none was invented. No 100, 1,000, or 5,000 record timing was taken.

The empty day was checked without deleting the sample. On 12 October 2026 the fictional Today screen said there were no records and did not show GH₵0.00 as that day’s movement. 13 October still showed a cedi amount.

UI-01 through UI-11 and UI-14 through UI-18 stay the reported Edge passes for the scenarios already named. Edited-screen lint stayed PASS. UI-12 and UI-13 stay HISTORICAL PASS and were not rerun. LP-01 through LP-15 stay as previously recorded. A real phone keyboard and field loading speed stay NOT RUN. Live stop and transcription stay NOT RUN.

Full typecheck now PASSES. The two failures named earlier (`scripts/lib/evaluation-budget.ts` reading `id` from a union that includes the approval line, and `scripts/lib/story-attempt.ts` passing `string | null` as the reservation id) were repaired narrowly on 21 October by the Claude UI pass, without touching the journal or its semantics.

The next action is a person completing the screen-reader task in `harness/context/08-remaining-checks.md`. The large-workspace timing stays optional. Do not send this voice clip again. Phase 08 stays incomplete. Phase 09 stays external.

## Git reconciliation

Resumed at clean `70d9941`. Trust findings 1–4 are in `a3deaae`. Preserve e25f49c, 2900d2b, 21246a5, 7648250, efd6f25, 70d9941 and a3deaae. On 2026-10-21 the user asked for GitHub to match this branch. Do not redo Phases 00–07 or the 19 October wording, calculation, review and goal-mark commits. Review artifact: `harness/context/08-ui-ux-review-2026-10-19.md`.

## Visual work

Money Stories cover amounts use the direction colors again: received blue, paid apricot, and net follows that sign. Today’s story field sits above the balance figures. Sign-in and account creation stop waiting if the local account service does not answer. Goals, settings, the public sample, Records, and Accounts edits remain. The logo mark stays violet and the CashNarra name stays ink. The activity PDF stays the two-page designed report. Both are locked in `AGENTS.md`. Review asks whether to create a missing account or balance and then attaches the draft record to it. Export asks whether the file is for this workspace, another of the user’s workspaces, or all of them. All means one file each. The ledgers are not combined, and the open workspace does not change. The same dialog asks which dates: today, this week, this month, this year, or a specified day or range. It opens on the dates already on screen. Open periods run through today.

## Product change in the last commit

A business workspace can review profit or loss for the Money Stories period. The review first shows the costs already in the records and asks whether those are complete. Yes calculates profit from those records. No asks only for a cost that is not already recorded. Stock and equipment purchases stay out of the result unless the user adds the part that was used. A positive extra figure needs a note. The estimate is not saved and does not post a journal. Personal workspaces do not offer it. The ordinary cash report still returns profit as null.

The previous commit implemented review findings 6–23 and 25.

Finding 24, measured performance of large workspaces, is NOT RUN. Finding 26, a person using a screen reader, stays EXTERNAL. No certification is claimed.

The previous commit made Today’s story invitation a text field and stated whether transcription is available before recording.

Earlier product facts still in force: percentages come from saved records and need confirmation; recording limit is three minutes and 8 MB; transcription stays off after HTTP 401 `missing_scope`. Do not retry transcription without an audio-capable key. Text remains the fallback.

## Latest evidence

- PASS this turn: local auth health returned 200. A wrong sign-in left “Please wait…” and showed “Invalid login credentials” with the button back on “Sign in”. A new local account opened the first-workspace screen. “Show password” and “Forgot password?” have a 20px gap. Not a fresh full `npm run test:e2e`.
- HISTORICAL PASS this redesign: profit-or-loss unit tests, typecheck, lint, and the sample business story Edge test. The reviewed result was GH₵1,920.00 after a GH₵400.00 cost of goods sold, with stock of GH₵700.00 kept out of that cost.
- HISTORICAL PASS: fresh install, text contrast, 200% zoom, database and Supabase integration, and the gpt-6-luna synthetic narration comparison. Do not rerun them only to report progress.
- EXTERNAL: representative consented voice recordings. Rechecked 2026-10-19: `.local/voice-evaluation/manifest.json` is absent. The only audio under `.local` is `.local/voice-smoke/synthetic.wav` and `synthetic.webm`; those are not consent or a speaker corpus. `npm run eval:voice-intake` returned NOT READY and made no provider call. The intake file cap now matches the product limit of three minutes and 8 MB.
- NOT RUN: a person using a screen reader. Scoped contrast measurements are not certification.
- FAIL (historical): development braces advisory. Do not force Next lint to v14.

## Provider and budget boundary

Historical journal readings, kept only as dated observations: US$0.513872 was already superseded on 2026-10-20; a later inspection that day showed US$0.947507 committed or reserved against the old US$5 ceiling; the ceiling was then raised to US$10 with every reserve and usage line kept, and the journal held US$1.803120 at that edit. On 2026-10-21, before this repair, a one-line synthetic story reached the provider and returned HTTP 429 `credit_balance_exhausted`. Failed clicks had kept full-context holds of US$0.425431 each. A read of the same journal during this repair, after the new event types were added and before any release, still parsed: 162 calls, 13 unsettled, US$5.631999 committed or held. Those 13 holds were not released. The journal does not record which of them were certificate failures, billing refusals, or uncertain timeouts, so none was given a zero-cost release. Do not reinitialise the journal and do not quote any of these figures as a live balance. The live total is `.local/evaluation/budget.jsonl`.

The local story path now reserves the gpt-6-luna short-context envelope, US$0.004, instead of the old model's full context. A proved certificate failure, a billing or authentication refusal, or a daily-allowance stop releases that hold. A timeout or a generic connection error keeps it. Billing, authentication, an unexpected model, and usage that still cannot be priced open `.local/evaluation/provider-pause.json`. The old credit pause was resolved, and the later unpriced pause is also closed. See the 21 October reader-price section. While a pause is open, another story click does not call the reader. The same draft reuses a stored interpretation. A changed draft or a changed account or balance does not. The dev server still uses `scripts/dev.mjs`. Production providers, launch, and voice-quality approval stay off. No provider invoice was reconciled.

Transcription is a separate adapter and stays off. Groq `whisper-large-v3-turbo` is the priced candidate at US$0.04 per audio hour, and `whisper-large-v3` is the accuracy alternative at US$0.111 per audio hour, both with a 10-second minimum. The pilot policy is free-only. Dispatch needs an operator plan record for that Groq organization; a missing, inconsistent, or Developer record does not send audio. A local label cannot keep an upgraded organization free. A confirmed Free success records capacity and a reference cost in `.local/evaluation/groq-capacity.jsonl`, with payable audio spend at US$0. It does not append to `budget.jsonl` and it does not rewrite the thirteen historical holds. That capacity file is a local lock, not a hosted quota manager and not Groq's own balance. HTTP 429 is a temporary stop and is not a paid fallback. A timeout stays uncertain and is not sent again. HTTP 400 `blocked_api_access` pauses only Groq. A Groq pause is `.local/evaluation/groq-pause.json`. It is not present. Do not create `.local/evaluation/groq-plan.json` until an operator has verified the organization. Do not delete the OpenAI pause to try transcription. A Groq transcript would not restore Luna interpretation while that pause remains. The local recorder still allows 8 MB; a hosted function body stops at 4.5 MB, so hosted voice is not enabled. The voice scorer and fictional cases make no provider call. Consented recordings and the live Groq comparison are NOT RUN. Offline tests are not evidence of a Free entitlement or of transcription accuracy.

## Percentage date correction

A calculated bill is recorded on the activity date inside the named sales period. A later day named only as the payment day is kept as the planned payment, not the expense date. Fully paid balances are left out of “Money still owed.” An already saved record is not rewritten. The review screen shows the calculated amount, ordinary dates and the included records directly. A save that would leave goal marks above the account balance names the account, both amounts and the goal. Open Money Stories periods no longer label that balance as owed on a future month-end; see the product change above.

## Device cleanup — 2026-10-20

Removed leftover caches and duplicate copies. Kept the running app, `.local/demo`, `.local/evaluation/budget.jsonl`, voice-smoke audio, zoom evidence, both in-repo design kits, and the local Supabase database volumes. The merged audit is `CashNarra_Elite_UX_Audit_COMPLETE_with_Exports_2026-10-19.md` plus `CashNarra_Redesign_Decision_Brief.md`. The earlier timestamped brag snapshot and video render scratch are gone from the working tree and are still recoverable from git until that deletion is committed. `.next` stayed because the dev server on port 3100 is using it.

## Customer plans — finished comparison, voice not activated — 2026-10-21

`/pricing` shows the finished Free and Plus comparison. Free is GH₵0 a month. Plus is $0.99 a month, with the standard $2.00 crossed out and the 20 October 2026 cedi estimate beside it. Both cards list their records, workspaces, AI stories, voice notes, and report packs, including 500 AI stories a month on Plus. Checkout, webhooks, and payments stay off. Choose Plus does not start a payment. Unlimited stays off the public page and `/api/billing/plans`. A direct purchase returns 403. Campaign dates stay unconfigured. The 10-call daily guard stays in the owner console only.

Voice is on for this computer only. The owner saved a Groq key and confirmed on 21 October 2026 that the Personal organization, Default Project, is on the Free plan. That confirmation is `.local/evaluation/groq-plan.json`. The limits shown for whisper-large-v3-turbo match the local free guard: 20 requests a minute, 2,000 a day, 7,200 audio seconds an hour, and 28,800 a day. `VOICE_ENABLED` and `LOCAL_VOICE_TESTING` are on. `VOICE_QUALITY_APPROVED` stays false. Checkout stays off. Customer recordings remain one minute. The OpenAI pause, the US$10 journal, and the thirteen historical holds were not changed. No recording has been sent.

Plan & usage remains an account screen. Its sample is labelled Example usage. The usage screen can still say voice is not available while the switch is off.


The approved 19 October redesign now includes the public sample, account screen, Records, Accounts, Money Stories, goals, and grouped settings. The pricing page shows Free and Plus in US dollars first. Checkout stays off. Local voice can turn a recording into words. One bounded story check succeeded. A later story is still an unresolved exposure, and the unpriced pause that followed it is closed. Do not set `VOICE_QUALITY_APPROVED`. Do not reopen findings 1–23 or 25 unless a test fails. Do not restart Phase 08. Cursor's work and the Claude UI pass were committed together on 21 October 2026; see the build log entry "Verification, reconciliation and commit". Nothing was pushed.

Sign-in responds again. Do not reset the local database. The story field is above the balances, and the Money Stories figures are colored again. The transactions CSV is one 11-column activity list. The Excel workbook has Overview, Transactions, Accounts and Obligations, styled like the specimen, without record or source IDs. The transactions CSV still carries those IDs because it is the import file. The activity PDF now follows the revised two-page report: dark summary card, colored activity table, account position, cash-movement cards, and the limits box. It uses the workspace’s recorded figures. Export now asks which records and which dates. The date choices are today, this week, this month, this year, or a specified day or range. A person with one workspace is told that, and the other workspace choices stay unavailable. The user asked on 2026-10-21 for GitHub to carry this work.

The remaining Phase 08 release work is still external evidence. The cost repair in the provider section is local accounting. It does not finish Phase 08. The exact next action at the top of this file replaces the request to ask for the Groq key again. The key and the Free-plan confirmation are already saved. The clip in the prepared packet still needs its own consent before any send.

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A Free pilot needs a verified organization record and must not deduct its reference cost from the US$10 journal. A paid runner needs a separate authorized Groq budget.
2. The local Groq key and Free-plan confirmation are saved. Do not set `VOICE_QUALITY_APPROVED`. A real clip is still a separate, deliberate test.
3. A person-led screen-reader pass (finding 26). Keyboard tests are not that pass.
4. Optional measurement of synthetic 100, 1,000 and 5,000 record workspaces (finding 24) before any rendering change. Do not rewrite the ledger for it.

One bounded check on 21 October 2026 read a synthetic sentence, settled US$0.000233, and saved no financial record. The OpenAI billing pause from 10:54 UTC that day is marked resolved. A later real story was held as unpriced at 16:52 UTC. That pause is now closed because standard Luna usage can be priced. The story itself was not sent again, and its US$0.425431 exposure remains. The journal header is still the 20 October US$10 approval. A later approval line raises the active ceiling to US$20. The latest read is 164 calls, 14 unsettled, US$6.057663 committed. Checkout stays off. Voice quality approval stays off.

Phase 09 stays in `harness/build/09-external-launch-gates.md` until the user decides.

No database migrations, reset, or production deployment. The 2026-10-21 request was only to publish this branch. The later cost-and-processing repair is uncommitted. It does not authorise another provider call.

External release work still requires one of these from the user:

1. Consented recordings and the private manifest in `harness/context/03-voice-quality.md`, then `npm run eval:voice-intake`. A Free pilot needs a verified organization record and must not deduct its reference cost from the US$10 journal. A paid runner needs a separate authorized Groq budget.
2. The local Groq key and Free-plan confirmation are saved. Do not set `VOICE_QUALITY_APPROVED`. A real clip is still a separate, deliberate test.
3. A person-led screen-reader pass, or one specific Phase 09 decision in `harness/build/09-external-launch-gates.md`.

Do not invent consent, spend beyond the remaining allowance, enable production providers, push, deploy, or reset a database.

INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE.

