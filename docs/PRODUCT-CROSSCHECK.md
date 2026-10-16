## Update — 16 October 2026

The gaps below were identified before this completion pass. Saved people, optional structured payment dates, editable goal names/targets with history, retained check-in choices, rhythm visibility, and optional in-app reminders are now implemented. Complete private draft backups preserve narration, reviewed edits, and pending save identity; restoration requires the same account and workspace. Basic first-use account guidance is also present. These updates supersede the corresponding missing-feature statements in the original table below.

Remaining limits: full repayment schedules and date handling for ambiguous debt splits; goal archival; richer completeness guidance; scheduled notifications; confirmed learning rules; representative live AI and voice evaluation; provider email and operational/privacy/launch prerequisites. No general AI or voice success is claimed.

# CashNarra product cross-check — 15 October 2026

## Conclusion

CashNarra is meant to turn everyday descriptions of money activity into records people can trust, explain what those records mean, and help them plan towards goals without needing accounting knowledge. The local application implements much of the recording and calculation foundation. **It does not yet deliver the whole conversational product, and it is not launch-ready.** Passing regression tests is evidence for tested behavior, not proof that every product promise is complete.

Sources checked: the final vision and MVP in Research CashNarra Concept.txt; final technology and free-development decisions in Recommend Technology Stack.txt; Narra v2 implementation brief; v2 guide sections on review, rhythm, reminders and privacy; the user's first-release build requirements. Earlier Storyline proposals do not override these. Earlier transcript pricing is not current procurement advice.

## What works, and what is still missing

| Intended capability | Current implementation | Honest status |
|---|---|---|
| Personal/business spaces and sign-in | Supabase Auth, recovery, workspace ownership, manual Cash/Bank/MoMo accounts | Working locally; live email/hosting setup and operational checks remain |
| Known/unknown openings and old debts | Exact opening amounts, customer/supplier/loan balances, partial/full payments | Working and tested; structured optional payment dates are now saved. Full repayment schedules and automatic date transfer after debt replacement remain limited. |
| Tell a whole day's story | Declared mock examples, clarification, editable batch review, exact save; real OpenAI adapter exists | **Partial:** arbitrary narration and conversational corrections are not enabled or evaluated with real AI |
| Correct, split or remove mistakes | Traceable replacements, linked payment preservation and affected totals | Working for supported operations; settled-debt splits/removal need coordinated payment corrections; no guided multi-step assistant for that case |
| Move a record filed in the wrong space | Atomic move of eligible independent records | Working within explicit limits; transfers and linked debts cannot be freely moved |
| Contacts and less repeated work | Reusable saved people, names/aliases on records and obligations | Saved people now work; confirmed classification rules and learning from repeated choices remain unavailable |
| Records and source history | Search/filter, original words while retained, correction history, balance evidence | Working; not a general conversational search over financial history |
| Daily/weekly/monthly understanding | Calculated summaries, templated Money Stories, figure drill-down and optional explanation adapter | Core calculations work; live personalised explanations are unverified; broad question answering is absent |
| Private exports | CSV/PDF/XLSX with exact totals, source references and cedi support | Working for tested examples; broader long/unusual-language document checks remain |
| Goals and honest pacing | Fixed targets, assignments, reviewed-month median pace, separate what-if amounts | Working arithmetic and editable names/targets with change history; goal archival remains limited and estimates do not promise affordability |
| Forgiving check-ins and completeness | Check-in/rest/no-activity choices, catch-up dates, cautious completeness copy | Previous choices are now preserved; rhythm visibility and optional in-app reminders work. A full usable-month guide and scheduled notifications remain unavailable. |
| Offline and shared devices | Opt-in scoped drafts, retry recovery, public-only cache, masking, cross-tab logout | Complete private JSON backup now preserves words, reviewed edits and pending request identity; restoration requires the same account/workspace. Cold offline app loading remains unsupported. |
| Voice | Real recorder and server upload/Opus-duration validation | Local microphone recording, playback and private download enabled with explicit permission. Automatic transcription remains disabled pending provider setup and representative Ghanaian quality evaluation; WebM/Opus only, with text fallback |
| Privacy requests and deletion | Original-word expiry, separate financial history, pending access/deletion requests | **Partial:** request recording is not request fulfilment; no staffed process, operator identity, live privacy contact or final retention policy |
| Branded landing and visual system | Narra v2 marks, tokens, fonts, responsive app | Implemented; visual tests are not a full design or accessibility certification |

## Deferred deliberately

Receipt OCR, statement imports, automatic bank/MoMo/SMS feeds, external reconciliation, payroll/ERP, collaboration, public links, payments, lending, investment advice and tax filing are outside this release. Their absence is not a failure to implement the agreed initial scope. Confirmed learning rules and broader financial memory belong to the concept's growth direction; they must not be advertised as available now.

## Language changes made in this review

- “Record allocation” → “Assign money to this goal.”
- “Raw narration retention” → “How long to keep your original words.”
- “Unsynchronised work” → “Some work has not been saved.”
- Removed database/version language from the ordinary report introduction.
- Explained goal assignments as notes that do not move or reserve money.
- Replaced provider/configuration language in the disabled voice flow with a clear unavailable state and text alternative.
- Rewrote the privacy explanations of storage, AI processing and deletion in plain language while retaining provider names and honest limitations.

The demo remains explicitly labelled as fictional/synthetic. Technical setup details belong in README and developer status documents, not normal recording flows. Record IDs may still appear in audit/export details where they help trace a figure. Further usability checks with representative users are needed; a code review cannot establish that everyone understands the wording.

## Priorities before claiming the first release is complete

1. Evaluate general narration, consequential clarification and conversational corrections against representative synthetic Ghanaian cases, then approved live-provider tests. Do not substitute the fixture interpreter for general AI.
2. Extend review/completeness guidance; check-in history and in-app reminder/visibility controls are now implemented.
3. Continue first-use usability checks; complete draft backup and basic account/opening/old-debt guidance are now implemented.
4. Validate saved people, payment dates and editable goal targets with representative users; retain the stated lifecycle limits.
5. Evaluate voice only after the text workflow is proven; retain text fallback.
6. Complete plain-language usability, accessibility, security and operational review; configure services and resolve the external launch checklist before real customer use.

This audit intentionally distinguishes implemented behavior, limited behavior, unverified integrations and deferred scope. It supersedes any impression that earlier “six-area pass” summaries meant the entire product vision was finished.
