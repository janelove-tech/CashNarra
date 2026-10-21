# Focused checks for the current repair

Use these checks in the owner's current local app after applying the fixes. Keep existing financial/security regression checks relevant to touched code. Routine UI tests use synthetic data and mocked providers, not paid requests.

## Evidence labels

Use PASS only for a check actually completed on the current implementation. Use FAIL, NOT RUN, HISTORICAL PASS, or EXTERNAL accurately. Rules installed, typecheck passed, live reader recovered, and representative voice accuracy are different claims.

Screenshots alone do not prove keyboard, focus, contrast, network behavior, quotas, or persistence. Record the actual CSS viewport width/height and tested state. Keep private screenshots and stories out of public logs.

## Reader recovery and budget

- [ ] Existing budget parses after the US$20 cumulative approval update. Earlier usage/holds and approval history remain.
- [ ] Remaining room is derived from the current journal, not copied from an old report. A second worker cannot over-admit a request or change the approval unsafely.
- [ ] Fresh inspection establishes which block actually stopped story reading. A stored billing rejection is not labelled as a new provider answer.
- [ ] One controlled verification can pass only the matching stale billing pause. Ordinary traffic stays protected until the result; a concurrent/newer pause cannot be deleted by that verification.
- [ ] One short synthetic reader request succeeds, or a new precise refusal/uncertain outcome is recorded. No automatic retries and no financial record is saved by the test.
- [ ] Usage is recorded before application parsing/review. Definitive nonbillable refusal, rate limiting, and uncertain timeout preserve correct hold semantics.
- [ ] A successful result resolves the matching old pause and stale UI error. Failure preserves the new reason and appropriate protection.
- [ ] A previously transcribed recording is reused; reader recovery makes no Groq request.

Only the single bounded provider verification in the recovery procedure is authorized as part of this repair's live check. Additional paid testing requires a concrete need and remains within the same cumulative ceiling; do not run a corpus or repeated smoke calls merely because room remains.

## Dialog and story journey

Test recording/clip/words/error states at 390×844 and a short viewport such as 390×640. Check one intermediate width such as 768, one desktop width such as 1280, and 200% browser zoom on a representative affected layout. Check 320 CSS pixels for reflow on the changed public pages/forms. These are project test choices, not evidence until run.

- [ ] The voice dialog fits the viewport. Its current primary action is fully visible or can be reached with ordinary scrolling without the footer covering it.
- [ ] Tab and Shift+Tab stay within the modal; focus is visibly indicated. The close control is named. Escape follows the close flow without silently discarding unsaved work. Focus returns to the opener after closing.
- [ ] The keyboard and mobile browser controls do not cover the action or focused input. Test on a real phone when available; a desktop viewport resize alone is not a soft-keyboard test.
- [ ] Starting, stopping, clip ready, working, words ready, failure, and uncertain outcomes have distinct useful states. Completed words become the focus of the dialog.
- [ ] Exactly one primary action is emphasized per state. Downloads, record again, and discard are secondary and cannot be confused with continuing.
- [ ] The pre-send disclosure identifies Groq accurately, and audio is sent only on the user's deliberate action.
- [ ] Double clicks, edited words, cleared words, and a failed reader step do not cause another transcription of the same clip. A timeout is not silently resubmitted.
- [ ] The user can edit and use the transcript without retyping it. The resulting story is still unsaved until the existing confirmed save flow finishes.
- [ ] Story date label and input remain adjacent. Backup/restore does not interrupt them. The short-story view does not hide its main action behind unnecessary blank space or repeated warnings.
- [ ] One failed understanding action yields one error announcement and a working manual alternative. Success clears the old error.

## Account usage and settings

- [ ] A signed-in account page uses actual account-wide values. Missing usage is unknown, never zero or a fallback sample.
- [ ] The same account sees the same limits when changing workspace. A daily voice unit and monthly AI-story unit are settled according to successful steps rather than extracted-record count.
- [ ] Reset dates come from actual account periods and are displayed once. One-day/one-record wording uses the correct singular form.
- [ ] The billing/usage navigation is distinguishable from financial planning, consistently across sidebar, breadcrumb, page, and settings link.
- [ ] Settings explanations remain readable at intermediate widths. Controls stack before squeezing the label/help text.
- [ ] Retention selection and destructive deletion are separate. Deletion names its scope and preserves the actual confirmed-record/history rules.
- [ ] Data-request confirmation reflects actual stored status. No invented processing success, staff availability, or response time.

## Pricing and public landing

- [ ] Free and Plus retain all agreed prices and quantities whether checkout or providers are configured or not. No preview, coming-soon, not-for-sale, or availability notes appear on pricing.
- [ ] Plus visibly presents $0.99 per month and crossed-out standard $2.00. The cedi amount comes from the latest valid shared rate used on page load, rounds to ten pesewas, and has the actual rate date.
- [ ] Financial records are explicitly unlimited; AI usage is separately limited. Plus has two-minute notes; Free has one-minute notes. Report packs explain PDF/Excel and free re-download of the same pack.
- [ ] Matching benefit rows and CTAs compare cleanly on desktop, and descriptions remain readable when cards stack. Long text does not clip.
- [ ] No AI inference or transcription request happens just to load the page or public fictional sample.
- [ ] Start free reaches account creation. The Plus action has an implemented safe next step before public launch. With payments off, it cannot charge or report a successful subscription.
- [ ] Unlimited is absent from anonymous HTML, public plan responses, structured pricing data, and upgrade choices. Direct disabled-plan purchase requests fail on the server.
- [ ] No duplicated large brand motif sits behind every reading section. Each retained landing section answers a distinct useful question.
- [ ] Zero values do not produce positive-looking quantitative bars. Unknown amounts are not displayed as zero. Money direction and error states have text meaning as well as color.

## Accessibility and final review

- [ ] Measure text contrast in the actual light/dark surfaces: at least 4.5:1 for ordinary text and 3:1 for qualifying large text, applying WCAG's definitions and exceptions. Check relevant control/focus contrast too; do not infer a pass from brand colors alone.
- [ ] Check semantic headings, explicit form labels, accessible icon-button names, focus visibility, and reduced-motion behavior.
- [ ] Touch controls are comfortably usable and do not overlap. Understand WCAG's 24×24 minimum/spacing exceptions; the project's approximately 44-pixel touch preference is a separate design target.
- [ ] At narrow widths and zoom, ordinary reading/controls reflow without horizontal clipping. Do not hide overflow to conceal broken layout.
- [ ] Review the actual rendered customer words. Remove developer diagnostics, redundant negatives, repeated warnings, and stale messages while preserving essential consent and financial meaning.
- [ ] Add or update a small number of meaningful tests for these observed failures in the repository's existing test suite. Do not create a parallel framework or snapshot every sentence.
- [ ] Update current handoff and build log with the result, actual checks, and any exact remaining block. Keep the final explanation understandable without reading a technical log.

Do not claim WCAG certification, representative speech accuracy, hosted readiness, or payment support from this checklist alone. The checks that require a person or external service remain identified until actually completed.
