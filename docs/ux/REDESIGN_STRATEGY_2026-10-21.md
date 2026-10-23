# CashNarra redesign — strategy, concepts and decision (21 October 2026)

Owner instruction: `CashNarra_Claude_Code_UI_UX_Master_Prompt (1).md`. Fixed: the logo assets, the colour system in `src/app/tokens.css`, and the Manrope and Inter families. Everything else about presentation and interaction was open. Baseline `020a6ae` on `work/cashnarra-v1`; work on branch `redesign/words-to-records`.

## 1. Strategy note

**Who, and when.** The clearest first audience is the owner-operator in Ghana who runs a shop, a stall, a salon, a delivery or a small trade, takes money in cash and MoMo, gives some customers credit, and settles up with suppliers and a lender. The moment they reach for CashNarra is the end of a working day, or the minute after something happened: a sale, a delivery paid, Abena finally paying part of what she owed. Freelancers and people keeping personal records have the same moment with fewer parties. One message serves all three because the moment is the same: *something happened with my money, and I want it kept properly before I forget.*

**What they do today.** They remember. They write in a notebook or on the back of a receipt. They scroll MoMo messages. Some keep a spreadsheet that is three weeks behind. The entry cost is the problem, not the arithmetic.

**What makes them hesitate.** Accounting words. Apps that ask for a category before they can type. Fear that a finance app will touch their money, or get it wrong silently. Not knowing what the app did with what they said.

**First-session result.** A person can type or say one ordinary sentence about today, see it become two or three plain rows they can check, change one detail, save, and read a one-line answer: what came in, what went out, who still owes. That is reachable in the first session with no account balances and no setup beyond a workspace name.

**What grows with use.** A day-by-day log of their own words and the records behind them. Answers that stay traceable: who owes what, what moved this month, what a goal needs. A goal estimate that becomes more reliable as months are reviewed.

**The strongest truthful reason to choose it.** Your own words become records you can trust, and the app shows its working every time. The interface should demonstrate this, not announce it: show words turning into rows, show the question it asks when meaning is unclear, show the figure with its records behind it.

**Primary narrative.** *Say what happened. Keep it properly. Know where you stand.* Secondary audiences stay visible through the examples (a salon day, a freelancer invoice paid, a household month) rather than through separate pages.

## 2. Three concepts

All three keep the logo, colours and fonts. Rendered prototypes are in `design/concepts/` (fictional data, static, no provider calls). Screenshots from the in-app browser are referenced in the build log.

| | Concept A — The Receipt | Concept B — The Story Log | Concept C — The Desk |
| --- | --- | --- | --- |
| Central argument | Say it once, keep it properly. Records you could show anyone. | Your money, told day by day. Words and records stay together. | Know where you stand today. Answers first, entry when needed. |
| Composition | Editorial, paper-like, hairlines, ledger strips, apricot stamps. | A dated log: each day shows the words, then the rows, then the day's movement. Composer docked at the bottom on phones. | A results desk: today's figures strip, people owing, goal, with a prominent entry bar. |
| Public hero | A spoken sentence on an apricot speech card becoming a ledger strip with totals. | The log itself: one day's story becoming rows, with the question CashNarra asked. | A Money Story card answering "where did it go?" with its records opened. |
| App home | A day page: date, one-line composer, today's lines, balances footer. | The log with the composer; a draft resumes at the top. | Figures and lists first; entry bar above them. |
| Review | A receipt column: words, lines with Change, "Not saved yet", a signing-style save. | Proposals appear under the words in the log; the question sits first; save docked. | Split pane: words left, rows right; stacked on phones. |
| Strength | Trust, clarity of the record itself. | Provenance is visible by default; mobile-first; a reason to return (your own log). | Immediate overview for returning users; strong for reports. |
| Weakness | Can feel like bookkeeping; weak reason to return beyond duty. | Needs discipline so it does not read as a chat with an AI; desktop needs a second column. | Empty on a first visit; dashboard sameness; entry is secondary. |
| Mobile fit | Good. | Best. | Fair. |
| Implementation fit | Moderate. | Good: the state model is already a story with proposals. | Moderate: more summary components. |

**Comparison.** On immediate comprehension, B and A tie: both show words becoming rows. On felt usefulness, C wins for a returning business owner but loses on a first visit. On distinctive character, B is the only one that nobody else in the shortlist does: Oze and Wave are desks, Khatabook is a ledger, MonAi and TalkieMoney are chat-like but hide provenance. On trust, A and B tie because the words stay beside the rows. On repeat-use appeal, B wins: the log is the person's own history, and "finish your draft" and "today has no story yet" are natural returns. On mobile, B wins.

## 3. Decision

**Ship Concept B, The Story Log, with two borrowings.** From C: a quiet "today so far" strip and the people-owing answer on the home screen for returning users. From A: ledger-row discipline for every record row, amounts right-aligned in Inter, hairlines rather than cards. The public page demonstrates the log: one fictional day's words, the question, the rows, the day's movement, then what a month of days gives you.

Rules for the log so it is not a chat: the person's words are quoted on a speech-mark surface derived from the logo motif, never a bubble; CashNarra never "replies" in prose; proposals are rows; the only question is a material one with short choices; nothing in the log is saved until the receipt exists, and the log says so.

## 4. Information architecture

- **Home** (`/app`): the composer and the story log. Draft, empty-day and reviewed-day states. Today-so-far strip for days with records.
- **Records**: one page with three views — Records, People (owe you / you owe), Accounts.
- **Stories**: Money Stories by day, week, month, with the profit review for business workspaces.
- **Plan**: goals with Explore what-if inline on each goal.
- **Account menu**: workspace switch, plan and usage, settings and privacy, sign out.
- Public: `/` landing, `/pricing`, `/pricing/plus`, `/auth`, `/privacy`. Routes are unchanged so existing links keep working.

## 5. Visual grammar

- Type: Manrope 800 for titles, Inter for everything that is read quickly, Inter tabular numerals for money. Body 16/24, meta 13/20, titles 28–40.
- Surfaces: paper background, white working surfaces, ink story surfaces, the apricot accent reserved for the person's own words and a few moments of warmth. No gradients.
- Rows and hairlines for records, people, settings. Cards only for a distinct task or summary.
- The speech-mark motif from the logo symbol appears as a quote surface and as the empty-state illustration. The logo files are never altered.
- Motion: 160–220 ms, content-first, reduced-motion equivalent. Rows arrive, they do not bounce.

## 6. Implementation map (what shipped where)

| Area | Files | What a person sees |
| --- | --- | --- |
| Grammar | `src/components/app.module.css` (rewritten), `src/components/ui.tsx` | One stylesheet built from the fixed tokens: rows and hairlines, the apricot quote surface, quiet text actions, a top app bar, a bottom bar on phones. |
| Words | `src/components/said.tsx` | The person's words as a quoted apricot surface with the logo's speech mark. Used on Home, the review and the public example. |
| Story log | `src/components/story-log.tsx`, Home in `src/components/cashnarra.tsx` | Days newest first; for each day the words, then the records they produced, then in and out. "Added by hand" and "words removed" states. |
| Home | `src/components/cashnarra.tsx` | Composer (date, Understand my story, Speak, Add a manual record, Draft backup), saved panel with consequence lines, the log, an "in brief" column with balances, money in and out, net movement, people and the first goal. The separate editor page is gone. |
| Records | `src/components/cashnarra.tsx` | One page, three views: Records, People, Accounts. Direction words, readable dates, supporting records and actions. |
| Review | `src/components/batch-review.tsx` | Question card first, the words with Change the words, rows with Change, duplicates once, only Save N records pinned. |
| Public site | `src/app/page.tsx`, `src/components/landing/*` | Hero, the fictional day as a log card, three steps, the ink answer band, the fictional goal, control list, Free and Plus, questions, close. |
| Pricing and Plus review | `src/components/billing.module.css` | Same tokens as the app, dark theme included. |
| Tests | `tests/e2e/*.spec.ts` | Labels and navigation updated (Home, Speak, People view, the hero heading); financial, saving, duplicate, draft and voice assertions kept. |

Evidence captures from headless Edge are in `design/evidence/` (after) and the concept renders in `design/concepts/shots/`. The pre-redesign screens are the commit `020a6ae` on `work/cashnarra-v1`; check it out to compare.
