# CashNarra UI and UX pass — design record, 21 October 2026

Written after inspecting the running local app (Edge-based in-app browser, `http://127.0.0.1:3100`, fictional Ama Works workspace) at 1280×900 and 390×844, plus the public landing, pricing, Plus review and sign-up pages. This record is short on purpose: it names what was wrong, what changed, and why. It does not replace `docs/ux/CASHNARRA_FINAL_HANDOFF.md`, which stays the screen contract.

## Direction

One direction, inside the existing Narra system: **a person's words become orderly rows and one clear result.** Everyday recording gets the lightest layout; reporting and administration get rows and dividers, not more cards. Nothing new in colour, type, logo or dependencies.

- Headings: Manrope. Body, controls, dates and every amount: Inter with tabular numerals. Unchanged.
- One primary action per screen state. Everything else is a quiet text action or a bordered secondary button.
- Status sits with the thing it describes. A draft status appears only on the story screens.
- Rows and dividers for related records, people and settings. Cards only for a distinct task or summary.
- Readable dates everywhere a person reads them (13 Oct 2026, not 2026-10-13). ISO stays in inputs and exports.
- 44–48 px controls, 3 px focus outline, reduced-motion equivalence, dark theme from the same tokens.

## What was wrong, and what changed

| Screen | Observed in the running app | Change |
| --- | --- | --- |
| Shell | Accounts, Tell your story and the review screen were all labelled “Your story” in the header. Subscription had no icon beside Settings. The sidebar clipped on short desktop windows. | Every screen names itself in the header. Subscription has a card icon and an active state; Settings has an active state. The sidebar scrolls instead of clipping. |
| Every screen | “Draft in this tab · not saved” and other story progress followed the person onto Money Stories, Records and Settings. | Story progress shows only on Today, Tell your story and the review screen. Sign-out and save receipts still show where they belong. |
| Today | Two competing headings; the story label floated away from its box; two help sentences ran together (“yourself.You review”); on a 390×844 phone the main action sat below the fold. | The page title is quieter and the composer is the invitation. The story label and the date sit on one row above the box; the box grows with the text. One help line. Order: Understand my story, Voice, then a quiet Tell your story. The main action is now inside the first phone screen. |
| Records | Every row repeated the ISO date under the amount although the list is grouped by day; day headings were as large as page titles. | Quiet day headings; rows inside a day group drop the date. Elsewhere rows show a readable date. |
| People & balances | Each person was a tall block with two full-size buttons; direction and dates read like database fields. | Two groups, **People owe you** and **You owe**. Each row: name, since-date, due date and overdue note, amount, then two quiet actions. The add-person control moved into the section header. |
| Review (clarification) | Under the three account choices a full create-account form was always open with its own large primary button, competing with Save. | The form waits behind “Use an account that is not listed” unless the story names an account the workspace does not have, in which case it opens on its own. Its button is secondary. Same for balances. |
| Review (duplicates) | The duplicate warning repeated the entire original story once per record (eight times for the sample). | A compact list of the saved records with the same amount and date, then one collapsible block with the original story. |
| Review (actions) | Four equal buttons were pinned to the bottom of a phone screen, taking a third of it. | Only Save N records (or the recovery check) is pinned, with a quiet Add record. Back to words and Discard draft are quiet links under the heading. |
| Record detail | Raw record id above the words; an empty “Correction history” heading. | Readable date, account and person on the meaning line; the original words under “From your story”; “No corrections yet” when there are none; the id behind a small Reference control. |
| Money Stories | “What this period shows” was a bullet list with colon-separated amounts. | Aligned rows with the amount on the right. Cover, drilldowns and figures unchanged. |
| Explore what-if | The recorded pace was a sentence above the field and the result repeated the same caveat twice. | A two-part comparison: Recorded pace with its estimate, and Your try with its estimate, then the field. The reason line appears once. Reset is a quiet action. |
| Settings | The Appearance row had no label; Sign out sat among data-request buttons. | Every row has a label and one line of help. Sign out is its own Account section with a clear consequence line. |
| Subscription | A bullet list; “report packs: not counted yet” started lowercase. | Rows under a narrower panel; counts capitalised. Unknown counts still read “not counted yet”, never zero. |
| Pricing (phone) | The Free card reserved a tall empty block for the crossed-out price that only matters when cards sit side by side. | The placeholder is hidden when cards stack. Desktop alignment unchanged. |

## What was deliberately left alone

The landing page, the Plus review, sign-in, the export dialog, the voice dialog, the activity PDF, the profit-or-loss review, the ledger, journals, pauses and provider configuration. They already met the contract or are outside this pass.

## Evidence

Checks and their labels live in `harness/build-log.md` under the 21 October 2026 Claude entries. A human screen-reader session, a real phone keyboard, a live recording and the representative voice corpus remain NOT RUN or EXTERNAL.
