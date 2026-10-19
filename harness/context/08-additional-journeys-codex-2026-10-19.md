# Additional customer journeys — independent Codex review

19 October 2026. Separate from Cursor's implementation of the original 14 findings.

## Coordination boundary

User approved this parallel review on the basis that product code and shared handoff files would remain untouched. Accordingly, this file is the only repository write for this review. CURRENT, build-log, the original review, tests, configuration, Git index and product files were not edited by this review. No build/server restart, database write/reset, provider call, email, signup, sign-out or microphone access. No private financial data copied into this file. Browser inspection used a separate authentication tab without submitting forms. Synthetic checks ran in memory on Node 24.19.0.

The shared tree was already dirty with Cursor's trust fixes when inspected; HEAD began at 70d9941 and advanced to a3deaae during the review. These findings describe the observed source state; recheck the relevant paths before implementation. Do not undo Cursor's changes. Original findings 1–14 remain Cursor's scope. New items below start at 15; overlap is explicitly identified.

## New findings

### 15 — HIGH: unresolved questions do not survive draft backup/restore

**Evidence: reproduced at data boundary; browser save bypass not exercised.** `src/lib/drafts.ts` stores text and proposed events, but not questions or calculation review state. `src/lib/draft-backup.ts` parses the same reduced shape. The restore callback in `cashnarra.tsx` explicitly clears questions and opens review for restored events. BatchReview disables save based on `questions.length` and structural validation cannot recover uncertainty about meaning.

Synthetic reproduction: create a structurally valid GHS25 expense with the unresolved question “Was this paid or still owed?”; run `validateExtraction`, then `draftBackup` and `restoreBackup`. Result: one question before backup, no question after restoration, one proposed record retained. This remains true even when an extra `questions` property is included in the input: the backup schema drops it. No money was posted.

**Customer impact:** “complete draft” may look ready to save despite a consequential unanswered question. Invalid missing amounts may still be rejected; the risk is structurally valid but semantically uncertain events.

**Acceptance:** version the draft format to preserve review obligations, or deliberately mark restored proposals as needing reinterpretation/review. Test paid-versus-owed ambiguity, calculation confirmation, edited proposals, old backup versions and reload. Restoration must not silently turn an unanswered question into an accepted answer. Preserve lost-save request identity separately.

### 16 — HIGH: closing the voice dialog may discard recoverable work

**Evidence: source path; no recording made.** VoiceCapture holds clip/transcript locally. It warns on `beforeunload`, but Dialog's Close/Escape calls `onClose` directly; the parent unmounts VoiceCapture, aborts work and releases the clip URL. Internal dialog closure does not trigger browser beforeunload.

**Acceptance:** with a recorded clip or edited transcript, Close/Escape must offer keep working, keep a private copy, or explicit discard. Cancel recording should remain distinct from abandoning a completed clip. Test closing during permission request, recording, transcription and transcript editing. Coordinate with original finding 5, but this is loss prevention rather than composer layout.

### 17 — HIGH: check sign-out results before claiming the device is signed out

**Evidence: source path; failure injection NOT RUN.** The logout handler awaits `supabase().auth.signOut()` without inspecting its returned `error`, and does not check the HTTP response from `/api/logout`. The installed Auth SDK signature returns `{ error: AuthError | null }`; failure does not necessarily throw. The handler then broadcasts sign-out and navigates away.

**Acceptance:** inject an SDK-returned error and a non-success logout HTTP response. Show accurate session status and a retry path; do not claim the session has been ended when it has not. Keep sensitive UI cleared where appropriate. Preserve/export unfinished work before destructive local cleanup. Test reload after failure on a shared device. This is a targeted risk, not a claim that logout normally fails.

### 18 — MEDIUM: signup and recovery do not clearly identify the current task

**Evidence: observed live, without submitting.** Sign-in presents two “Sign in” buttons. Signup presents two “Create account” buttons, while the introduction still says “Sign in…”. Recovery keeps the same generic heading/introduction. Source has no visible password-length hint, show-password control, or email-confirmation resend action.

**Acceptance:** use task-specific heading and one primary submit action. Secondary actions should clearly switch modes: “Already have an account? Sign in.” State the password requirement before submission, provide accessible reveal, and give confirmation-email next steps/resend with throttling. Preserve email on mode changes; do not expose it in logs. Verify expired links and mobile password-manager behaviour. Do not assume email deliverability from rendering these screens.

### 19 — MEDIUM: the first-workspace state needs a guided first success

**Evidence: source review, fresh-account walkthrough NOT RUN.** The empty state asks users to choose Personal/Business and says “Account openings can stay unknown.” Guidance to add accounts exists on Accounts, but it is not a continuous first-story journey.

**Acceptance:** explain workspaces as separate sets of records, give concrete personal/business examples, then guide the user to one account and a first story. Allow “I don't know the starting balance” without making the user feel blocked. Explicitly show that an unknown starting balance prevents a complete balance, not recording today's activity. Evaluate first correct save without help; do not require filling optional contacts/goals first.

### 20 — MEDIUM: personal use still exposes the business vocabulary and category set

**Evidence: source review.** RecordForm renders all `kinds` regardless of workspace type. WorkspaceTools contact roles default to Customer/Supplier/Other. No corresponding Personal branching appears in these controls. The extraction request does correctly include workspace type: preserve that.

**Acceptance:** personal examples should cover salary, household spending, money lent/borrowed and transfers. Prioritize relevant choices while retaining advanced valid record types. Use neutral people labels when appropriate. Do not change financial semantics just to rename a category. Test the same ordinary story in Personal and Business, especially own-account transfers versus business owner withdrawals.

### 21 — MEDIUM: normal formatted amounts are rejected by manual entry

**Evidence: reproduced.** `RecordForm` passes the raw input to `money()`. In-memory checks: `17000.00` accepted; `17,000.00`, `GH₵17,000.00`, and surrounding whitespace rejected. The display itself uses comma-separated cedi amounts, so copying a displayed amount into a field is frustrating.

**Acceptance:** a deliberately narrow input normalizer may accept supported pasted GHS formatting and trim whitespace before strict exact-decimal validation. Do not weaken the ledger/API money representation, use floating point, or guess ambiguous decimal conventions. Reject malformed grouping and unsupported currencies clearly. Test pasted values and mobile keyboards.

### 22 — MEDIUM: context selection silently omits later accounts/debts

**Evidence: reproduced for accounts; source for debts.** `extractionRequest` takes the first 50 accounts and first 50 obligations, rather than selecting by the story. A synthetic workspace with 51 accounts and narration explicitly naming Account 50 sends only 50 accounts and omits that account. No provider called. Initial test setup replaced fixture accounts while retaining old records and correctly failed domain validation; the corrected empty-workspace setup reproduced the omission.

**Acceptance:** bounded context should select relevant authorized records, or ask an explicit account/debt choice when omitted. Never let the model invent an identifier. Test an old/new debt beyond the cap, duplicate names, closed/settled balances and more than 50 accounts. Keep bounded context and tenant authorization; a larger prompt alone is not a reliable fix.

### 23 — MEDIUM: long-story review needs its own evaluation, beyond the eight-record fixture

**Evidence: source inspection; large-batch usability/performance NOT RUN.** Review renders all proposed rows and questions. Backup permits up to 100 events. There is no demonstrated evidence that a customer can review, edit and confirm such a batch comfortably. This extends original finding 6; do not rebuild its in-place clarification controls in parallel.

**Acceptance:** test 1, 10, 30 and 100 synthetic events with a mix of debts, transfers, expenses and repeated amounts. Show a concise batch overview and outstanding-question progress, maintain position after editing, and make source-to-record comparison available. Keep one atomic save. Do not add pagination that hides unreviewed material or treat a count of rows as proof of review.

### 24 — MEDIUM: account growth and slow-device performance are unmeasured

**Evidence: source inspection; benchmark NOT RUN.** Authorized workspace retrieval loads its state; records/reports are processed client-side and rows are mapped directly. This is not proof of unacceptable performance. No measurements from this review support a speed claim.

**Acceptance:** measure synthetic 100/1,000/5,000-record workspaces on a throttled mobile profile: first usable view, search delay, long tasks, export time and memory. Include correction history and obligations. Establish agreed budgets before changing architecture. Preserve the existing ledger and atomic commit; prioritize rendering/selection improvements over an unsolicited rewrite. Original finding 10 covers filters; this item covers measured scale.

### 25 — MEDIUM: session expiry needs a distinct recovery journey

**Evidence: validation gap, not a reproduced defect.** Existing cross-tab sign-out and lost-response tests do not establish the complete experience when authentication expires during clarification or saving. A generic failed-save message may be truthful but does not tell the user how to authenticate without losing the draft.

**Acceptance:** expire only an isolated test session, then interpret/save. Keep reviewed work, explain that sign-in is needed, recover only into the same owner/workspace, and check the original request before any retry. Also test switching to a different user. Do not reuse the user's real session to force this failure.

### 26 — MEDIUM: keyboard checks do not establish screen-reader comprehension

**Evidence: source inspection and missing manual evidence.** There is useful foundation: native dialog, focus return/trap, live statuses, labels and an error summary. Auth mode changes do not change the heading or announce the selected mode. Focusable-item selection in Dialog does not explicitly exclude hidden descendants; this is a targeted test case, not a proven focus trap failure.

**Acceptance:** a real screen-reader user should complete signup, resolve a material question, explain a signed amount, edit a record, recover a draft and dismiss/reopen voice without losing work. Check reading order, repeated control names, error association, announcement volume, hidden controls and focus return after navigation. Run magnification and touch exploration separately. Do not claim certification or customer comprehension from axe alone.

## Evidence summary and limits

- PASS: three auth modes inspected without submission. Confirmed duplicate primary/mode labels and unchanged task introduction.
- FAIL against desired preservation: synthetic backup round trip loses the unresolved question while retaining its proposed event. No browser save was attempted.
- FAIL against relevant-context expectation: specifically named 51st account omitted from extraction context. No AI call.
- PASS observation of current strict input behaviour: only canonical amount accepted in four input examples. Input friendliness is the proposed improvement; exact arithmetic remains correct.
- NOT RUN: fresh signup/email delivery, signed-out recovery fault injection, real microphone/representative transcription, full 100-event browser review, scale benchmarks and human screen-reader/customer testing.
- No blanket full-suite rerun: Cursor is editing and owns the running implementation validation. No claims that this review validated the current moving tree end to end.

## Customer validation plan

Use separate consented test sessions and synthetic data. Ask a first-time user to create their own workspace, enter a cash/credit story, correct one amount, understand a percentage, recover an interruption and explain a goal mark. Include at least personal and small-business perspectives, different numeracy levels and a screen-reader participant. Do not coach during the task; record assistance separately.

Measure first correct save, completion without help, repeated fields, unnecessary clarifications, retained work after failure, and a short post-task ease rating. Ask users to explain a sales total, money received and an unknown balance in their own words. A technically successful save with misunderstood meaning is not success. Satisfaction remains unmeasured until these sessions happen.

## Independent handoff

Suggested next queue after coordinating with Cursor: 15 (draft clarification preservation), 16 (voice close recovery), 17 (verified logout), then 18–22. Original 14 remain Cursor's work; 23–26 are targeted validation work, not permission to rewrite. Reproduce source-path risks in an isolated session before fixing them. This review does not implement any fix, close Phase 08 or alter external launch gates.

## Implementation — 2026-10-19

- 15: draft backups are `cashnarra-draft-2` and keep questions and calculations. An older backup restores the records and requires “I have checked every record” before saving. The lost-save request identity check remains.
- 16: Close or Escape with a clip or typed words stays inside the voice dialog and offers keep working or discard. Cancelling a recording inside the recorder is unchanged.
- 17: sign-out checks the Auth SDK error and the logout response. Drafts are cleared only after that succeeds. A failure stays on the page and does not say the device is signed out. Injected-failure browser proof is NOT RUN.
- 18: the auth page uses a task heading, one primary submit, secondary mode switches, a password-length note, show password, and a throttled confirmation resend. Email stays in the field. Deliverability was not tested.
- 19: an empty account explains separate workspaces, one account and a first story, and that an unknown opening blocks a complete balance rather than today’s activity. A fresh signup walkthrough is NOT RUN.
- 20: personal workspaces list household and lending choices first and use friendlier people labels. The stored kinds and Customer/Supplier/Other values are unchanged. Business still says Customer and Business expense.
- 21: the record form and in-place amount answers accept pasted GHS formatting before exact-decimal checks. Ledger `money()` is unchanged.
- 22: narration context keeps a named account or balance inside the first 50 and says when names were left out. The prompt tells the model to ask rather than invent an identifier.
- 23: review states how many records are proposed and how many questions remain, and keeps every proposed record on the page. A 10/30/100-event browser pass is NOT RUN.
- 24: scale on 100/1,000/5,000 records is NOT RUN. No architecture change.
- 25: a 401 from understanding or saving keeps the draft and says sign-in is needed. A save still asks to check the original request. An isolated expired-session browser run is NOT RUN.
- 26: the dialog focus trap skips hidden controls, and the auth heading changes with the task. A person using a screen reader remains EXTERNAL. No certification.
