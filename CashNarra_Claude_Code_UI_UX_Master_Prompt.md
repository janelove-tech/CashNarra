# CashNarra — Claude Code UI and UX master prompt

Prepared 21 October 2026. Save this file in the root of the **actual current local CashNarra project**, open that folder in Claude Code, and ask Claude to read and carry out this file. This is an implementation assignment, not a request for a design essay.

The prompt begins below. Its current owner instruction authorises a fresh, independent UI/UX review and implementation. Earlier “remaining checks only” status notes remain evidence of unfinished verification; they must not prevent the UI work explicitly requested here. Financial, privacy, commercial and production safeguards remain in force.

---

## Your assignment

Act as CashNarra’s principal product designer, UX researcher, financial UX specialist, accessibility engineer, frontend architect, editor and implementation engineer.

Read and understand the entire maintained first-party codebase. Inspect the actual running application. Identify what still makes it feel confusing, visually weak, cumbersome or inconsistent, then **implement a coherent, exceptionally well-crafted UI and UX** across the product.

My ambition is for CashNarra to be compelling beside its competitors: immediately understandable, memorable, easy to start, trustworthy with financial meaning, and pleasant to use repeatedly. Translate that ambition into specific design decisions and working task flows. Do not claim market superiority, conversion gains or usability improvements without evidence.

Do not stop at an audit, recommendations, a plan, screenshots, a new design document or a superficial colour-and-spacing pass. Improve the application itself, verify the result, and leave a clear checkpoint. Where the current design already works, preserve it. Where passing tests conceal poor hierarchy or friction, improve the design without weakening the tested behaviour.

## 1. Establish the real baseline and protect ongoing work

1. Confirm the project root, current branch, HEAD, dirty state, recent relevant commits and whether Cursor or another process is actively editing this checkout. The expected working branch has been `work/cashnarra-v1`; verify rather than assuming.
2. Read `AGENTS.md`, any existing `CLAUDE.md`, applicable nested instructions, `GOALS.md`, `PLANS.md`, `harness/CURRENT.md`, recent `harness/build-log.md` entries, and the current phase file. Read `harness/context/08-remaining-checks.md` if present. Inspect actual paths before assuming a filename exists.
3. Read the current product concept and technology decisions in full, including their final summaries. Read the relevant Narra v2 brand guide, tokens, design decisions, current UI handoff and competitor research. Inventory their contents and apply their latest settled decisions; an older snapshot is not current operational truth.
4. This request explicitly authorises a fresh independent UI/UX review and implementation, even if an older checkpoint says not to reopen a completed UI pass or to perform only external checks. Record this new UI scope in the existing workflow while preserving the earlier evidence and unresolved checks. Stay within the current phase; do not automatically start Phase 09 or call the whole product complete.
5. Preserve all current uncommitted work and newer local improvements. Do not reset, clean, discard, stash away or overwrite another agent’s changes. Do not replace the working tree from an older main/remote branch.
6. If Cursor is editing the same checkout, isolate your work in a suitable branch/worktree or use an agreed editing handoff. A worktree created from HEAD does not include uncommitted changes: safely carry the relevant latest source changes into the isolated baseline without committing/copying secrets or losing provenance. If a specific conflict cannot be resolved safely, continue independent review and ask about that conflict only. Do not let two agents silently rewrite the same files.
7. Keep all work inside this project. Do not inspect unrelated neighbouring projects or harvest personal data. Identify configuration variable names from examples/schema and check configuration presence without printing secret values. Do not dump `.env` files, keys, private recordings, consent records or real financial stories into reports, logs, commits or external tools.

Inspect the installed framework/library versions and the relevant local documentation required by `AGENTS.md`, including shipped Next.js guidance before changing its APIs. Reuse the selected Next.js/React/TypeScript/CSS Modules stack. Do not introduce a major framework upgrade, a replacement styling system or a large UI dependency merely to make the screens look fashionable.

This assignment authorises ordinary local implementation and reversible verification. Proceed without asking me to approve every component, layout or wording choice. Ask only when a concrete unresolved product decision or genuinely missing authority is necessary; complete independent work meanwhile.

## 2. Read the whole first-party system, with honest coverage

Create an inventory before sampling files. Review all maintained first-party production code and relevant tests/configuration across:

- App routes, layouts, navigation, authentication, onboarding and workspace/account context.
- Components, styling, design tokens, fonts, icons, assets and responsive behaviour.
- Story entry, voice/transcription, interpretation, clarification, proposal editing, save receipts, offline drafts and correction/source history.
- Records, accounts, debts, transfers, Money Stories, existing profit/cost reviews, goals and what-if calculations.
- Exports, date/workspace selection, pricing, subscriptions, entitlement presentation, settings and existing owner/support boundaries.
- API/server actions, schemas, domain calculations, persistence, migrations, access controls, provider adapters, budget/attempt protection and recovery mechanisms that these screens depend on.
- Existing unit, integration and browser tests, fixtures, package scripts, build configuration and current evidence.

Read the implementation, not only filenames or a few search matches. Trace the important user actions into the domain/server code and back to the visible result. Understand how the UI receives authoritative state before changing it.

Do not read every dependency or generated file to simulate thoroughness. Exclude `node_modules`, build output, caches, generated bundles, vendored code, duplicated archives and irrelevant media renders. Inspect relevant binary assets visually rather than treating them as source text. Review needed event shapes through schemas/tests; do not bulk-load private journal contents or customer data.

Maintain a compact coverage record: area/files, what was read, related flows, and anything still unreviewed or excluded. If context runs short, checkpoint exact coverage and resume. Do not say “read the entire codebase” while major maintained first-party areas remain unread.

## 3. Inspect the real product before deciding what to change

Start the application through its documented local workflow. Inspect package scripts first: routine startup/tests must not accidentally invoke paid providers, send recordings, charge customers, send email or mutate production.

Use the available browser tooling and fictional/disposable local fixtures. Inspect the page at actual viewport sizes and operate controls; source review alone is insufficient. If browser access is unavailable, finish independent code work and state the exact visual checks still required. Do not invent screenshots or browser results.

Walk through complete journeys:

1. Understand the landing page, try its fictional examples, find pricing and reach the correct signup/sign-in route.
2. Start with a new workspace, enter a story, clarify a meaningful detail, change a proposal, save through the existing safe test setup, understand the result and return later.
3. Resume a draft, switch between supported typed/voice stages, and experience failed, pending, offline and unresolved states.
4. Find a past record, a named debt and a recorded account balance; trace a summary back to the records.
5. Read a Money Story for a selected period, inspect an existing business profit/cost review where supported, and download the relevant report.
6. Set or inspect a goal and find Explore what-if; change an assumption and explain its effect.
7. Find settings and Plan and usage; exercise supported upgrade/renewal/cancellation states using mocks, not a real charge.

For each journey, assess first use, routine use, interruption, correction and return. Record concrete friction: ambiguous actions, unnecessary steps, lost context, oversized editors/dialogs, weak hierarchy, hidden features, hard-to-read amounts, repetitive copy or unsupported promises. “Looks modern” is not evidence of task quality.

## 4. Design direction: words becoming clarity

CashNarra’s structure is **Record → Understand → Plan**. Its principle is **Serious money. Light interaction.** The interface should make a person’s ordinary words visibly become orderly, reviewable records and an understandable result.

Choose one coherent direction within the existing Narra system. Use confident hierarchy, deliberate proportions, readable typography, restrained colour, useful density and purposeful motion. Aim for warmth and character without clutter. The central transformation and clear financial meaning should make the product distinctive.

Keep these identity decisions:

- The existing paired speech mark; violet mark `#5B49C7`, ink CashNarra name `#29263D` on light surfaces. Use the actual reversed asset on dark surfaces. Do not redraw or redesign the logo.
- Existing Manrope headings and Inter for body, dates, controls and all money. The supplied Manrope asset lacks the cedi glyph.
- Narra tokens, the established spacing scale and restrained surface/depth system. Use apricot and other existing semantic colours purposefully; preserve contrast and non-colour cues.
- The designed two-page activity PDF and the existing export styling. Keep figures derived from the actual reporting system.

Avoid a generic template: repeated equal-sized dashboard cards, gradients on everything, oversized numbers on every screen, tiny grey text, decorative charts, excessive badges, sparkle icons, long AI acknowledgements, giant empty editors, scroll tricks and animation before content appears.

Do not use “premium” to justify fewer labels, hidden controls or poorer accessibility. Give everyday recording a lighter layout than reporting or administration. Use rows and dividers when they communicate relationships better than another card.

Write a short implementation-ready design decision record after inspection: the intended hierarchy, key shared components, typography/spacing choices, responsive behaviour and the most important before/after changes. Then implement it; do not pause for approval of routine design decisions.

## 5. Screen and interaction requirements

### Shell, navigation, authentication and first use

Keep workspace, current location and relevant date/period clear. Preserve useful destination names and existing working routes. Goals, Explore what-if, Pricing and Plan and usage must remain easy to find. Use consistent headers, active states, focus treatment and back/return behaviour.

Make signup/sign-in mode, errors and waiting states understandable. Preserve entered values where appropriate. An unresponsive service must not leave a permanent spinner. Avoid onboarding questionnaires when someone can first reach a useful result with minimal context.

### Today and story entry

One clear invitation: **What happened with your money?** Keep the relevant date with the words and **Understand my story** as the main action, with a clear empty-input state. Typed input, the existing recording control and a quieter manual-record route should work together.

Preserve the fuller **Tell your story** page, draft retention and **Draft backup**. Moving to the fuller editor must retain words without automatically paying to read them again. Distinguish a draft, an empty day and a completed day. Missing records do not establish zero movement.

Before/during recording, show the applicable length limit and elapsed time. Preserve the existing progression from capture to editable words to interpretation. Keep the next control reachable when a transcript grows or a keyboard opens. Present existing voice functionality accurately; no live recording or provider call is needed for this UI assignment.

### Clarification, review, save and correction

Clarify the important; do not confirm the obvious. Ask one financially material question at a time and retain previous answers.

Use compact, readable proposed-record rows with event, amount, account, date and relevant person. Keep original words/source phrases within reach. Put **Change** beside a proposal. Preserve correct current headings such as **Check this record** and **Check these N records**; use the real count in the save action.

Editing a proposal should use existing local review rules, not automatically reread the whole narration. Keep the save action reachable without obscuring content. Show saved success only after authoritative persistence returns its receipt. Preserve exactly-once saving, interrupted-save recovery states and source/correction history. A transcript or interpretation is not a saved financial record.

### Records, accounts and debts

Make history scan well: quiet date grouping, clear descriptions/context, consistent amount alignment and useful existing filters. Preserve workspace/period when opening details and returning. Keep long names and full money values available.

Recorded balances, unknown balances and changes are different. Show the existing starting-balance action when needed. Within existing supported views, make **People owe you** and **You owe** understandable through names, amounts, direction and supporting records. A settlement remains linked to the prior debt. Reuse existing selectors/models; do not invent a new debt system.

### Money Stories, calculations and exports

Lead with the selected period and **Money in**, **Money out**, **Net movement**. Explain net movement once; it is not profit. Keep each figure traceable to the same included records, period and workspace. Do not compare an incomplete month with a full month without explanation.

Preserve the separate, reviewed business profit/cost functionality where it exists. A rule against calling net cash movement profit is not permission to delete a legitimate reviewed profit feature. Keep that feature’s existing completeness questions, cost rules and deterministic calculations intact.

Preserve full currency/amount pairs, stacking behaviour, singular/plural wording, unknown states and thin zero bars. Do not fill a zero bar decoratively or abbreviate actual money to keep columns aligned.

Keep existing export formats, scope and date choices. Preserve workspace separation; do not combine ledgers because a single download looks simpler. Improve the export interaction if needed without replacing designed reports, hard-coding specimen figures or exposing internal identifiers in inappropriate presentation exports.

### Goals

Show the goal’s target, amount set aside, remaining amount and the basis of any estimate together. Keep **Explore what-if** visible. Compare recorded pace/current assumptions with **Try a different amount** using the existing pure calculation.

A scenario changes an estimate, not saved money, an account balance or a goal allocation. A supported explicit “use” action must explain its actual effect. Distinguish a person’s assumed monthly amount from a reliable history-based pace. Do not hide a supported manual scenario merely because history is insufficient or invent a guaranteed completion date.

### Settings, pricing, Plan and usage

Group existing settings by purpose with short, readable explanations. Keep **Reminders** and **Data and privacy** understandable. **Delete original stories** remains a separate confirmed action that preserves saved financial records.

Use the real public plan catalogue. Make **Unlimited financial records** clear on Free and Plus, explain unclear benefits beside them, and keep quantity/unit presentation consistent. Do not confuse unlimited records with unlimited AI or voice processing.

Preserve the current commercial decisions:

| Item | Free | Plus |
| --- | --- | --- |
| Monthly USD price | $0 | $0.99 offer; $2.00 standard visibly struck through |
| Financial records | Unlimited | Unlimited |
| Workspaces | 3 | 10 |
| Monthly AI stories | 100 | 500 |
| Daily voice notes across workspaces | 3 | 3 |
| Maximum per note | 1 minute | 2 minutes |
| Monthly report packs | 10 | 100 |

Show USD first and an approximate cedi equivalent in brackets, using the actual dated rate and existing valid cache/refresh behaviour when the page opens. Round to GH₵0.10 and display two decimal places. An earlier GH₵11.50 example is not a permanent conversion. Keep a truthful dated fallback on failure and reserve layout space during loading.

If an advertised allowance and an operational guard disagree, record the concrete mismatch as a product dependency. Do not silently lower the promised allowance, raise a company budget or fabricate capacity to make the UI appear consistent.

An existing subscriber keeps their agreed USD price unless they voluntarily upgrade. A public offer ending or catalogue changing must not rewrite that agreement. Do not add an uninterrupted-renewal condition, invent campaign dates or add fake countdowns. The future $10/$5.99 Unlimited plan remains private/deactivated and absent from public markup/data/APIs.

Keep the finished public offer free of preview, coming-soon, not-for-sale and development/availability notes. Inside the actual Plus review, accurately say whether payment or access has occurred. **Choose Plus currently opens review; it must not claim a charge or paid activation.**

In Plan and usage, show actual plan/agreement/usage/reset state. Unknown counters are not zero, a fabricated allowance or a permanent loading state. Use the existing truthful unknown state. Expose Upgrade for Free and supported manage/cancel/renew/switch actions for the correct paid state. Preserve recurring versus non-renewing rules, paid-through access and readable excess workspaces on downgrade. Mock states are acceptable for verification; fictitious live payments or counters are not.

### Landing page and trust

Preserve the working Record → Understand → Plan demonstration, the main Try an example action and a direct Start free route. The fictional story should be readable before **See the records** reveals proposals and totals. Missing required details delay the summary; reset genuinely resets the local illustration.

Preserve the current fixed calculation: sales GH₵900; old-debt receipt GH₵200; delivery GH₵80; money in GH₵1,100; out GH₵80; net movement GH₵1,020. Do not invent opening balances, remaining debt or profit. The separate fictional goal has GH₵1,500 remaining: GH₵300/month gives about five months; GH₵500/month about three.

The public examples stay fixed/local, with no provider, auth, financial/storage request, persistent browser write or microphone permission from their interactions. Normal assets, existing public catalogue/FX requests and explicit signup navigation are separate. Do not invite arbitrary private input into an imitation live demo.

You may improve presentation or an evidenced comprehension problem, while preserving the approved promise, example meaning and working routes. Do not replace the page with a generic AI-service template. Use real product evidence rather than invented testimonials, ratings, user counts, bank endorsements, security certifications or savings promises.

## 6. Language: understandable without accounting or engineering knowledge

Use ordinary international English, with Ghanaian terms where helpful. Keep the tone calm, respectful, warm and concrete. Use familiar verbs, short sentences and contextual explanation. Avoid forced slang, guilt, roasts, manufactured intimacy and vague AI claims.

Use the same term for the same thing: story, transcript, proposed record, saved record, account, workspace and plan are different. Name a specific action when its effect is known. A smaller explanatory line should still be readable.

| Situation | Suitable wording |
| --- | --- |
| Start interpreting words | Understand my story |
| Approve a batch | Save 3 records / Save this record, using the actual count |
| Fix a proposal | Change |
| Clarify account | Which account did this money come from? |
| Reading failed with words retained | We couldn’t finish reading this story. Your words are still here. |
| Empty period | No records for this month yet. |
| Unknown balance | Add a starting balance to see how much is in this account. |
| AI-story perk | Turn what you type or say into records you can check. |
| Voice perk | Speak your story, then check the words. |
| Report-pack perk | Download your records and summaries in a tidy file. |

Match messages to the actual state and working next action. One issue gets one coherent message; field errors stay near their controls. Do not imply a timeout is safe/free to retry or that an unavailable result was recovered.

Keep provider names, tokens, budget holds, certificate traces, internal files, phase numbers and debugging terms out of ordinary customer flows. Use technical detail in private engineering evidence where useful. Updates to me should explain the visible outcome, why it helps, what you checked and any real limitation in plain English.

## 7. Financial, privacy and cost protections

These protections are part of the quality bar, not excuses to avoid ordinary frontend work:

- Exact-decimal authoritative money, balanced journals, atomic batch saving, idempotent receipts, source history and reviewed corrections stay intact.
- AI proposes structure and explains; it does not authorise access, write the ledger independently, calculate authoritative balances/report totals/goal forecasts in prose or decide saving succeeded.
- Received money is not automatically sales/revenue; transfers are not spending; debt settlement is not another sale/expense; loan principal and owner money retain existing classifications; goal allocation is not money movement. Unknown is not zero.
- Preserve tenant isolation, explicit ownership checks, server-only secrets and no public caching of private financial responses.
- CashNarra records money. Do not add banking, wallets, money transfers, lending, tax filing, inventory, payroll, ERP, automatic bank/MoMo aggregation or new financial services to satisfy a design comparison.
- Preserve current provider configuration, free-only Groq safeguards, pauses, unresolved attempts, historical holds and the cumulative US$20 evaluation ceiling. Do not reset journals, release uncertain holds, restore obsolete pauses or reread a story automatically. Internal holds are not customer charges or provider invoices.
- Routine design work uses fictional/disposable data and mock provider/billing states. No paid inference, transcription, customer charge, production migration or deployment is necessary for this assignment. Do not send a real clip without its already valid specific consent/authority; do not invent a consent record or request already configured keys again.
- Do not change real saved records, quotas, subscriber agreements or the financial persistence model to make a screen look simpler. If a UI needs a missing backend capability, finish its truthful supported states and record that dependency separately.

## 8. Current reported state: verify, preserve and improve intelligently

The latest owner reports say the landing and main app UI pass have already been implemented. Local fictional-workspace checks in Edge reported UI-01–UI-11 and UI-14–UI-18 passing the scenarios actually exercised. Widths 320/360/390/768/1024/1440, light/dark, focus return, CSS 200% zoom, reduced motion, proposal change, lost-save and offline-draft behaviour were checked. UI-12 pricing and UI-13 subscription results remained historical; landing LP results stayed as recorded. None of this proves that every current screen is visually excellent or that every clause passed.

The newer follow-up also reports:

- `harness/context/08-remaining-checks.md` prepares the unpaid checks.
- Voice intake returned NOT READY because private recording consent was absent. An offline text check preserved negation/transfer direction; it did not hear speech. The Groq key is already saved.
- The empty-day screen was then checked on fictional 12 October 2026: no records sentence, with no misleading GH₵0.00 movement; 13 October still displayed its amount. The records were not deleted.
- Live recording through stop/transcription, a person using a screen reader, a real phone keyboard, field speed and 100/1,000/5,000-record timings remained unrun. Large-workspace timing is optional; no pass/fail timing target was invented.
- Full typecheck still failed in `scripts/lib/evaluation-budget.ts` around an event union containing an approval without `id`, and in `scripts/lib/story-attempt.ts` where possibly absent values were used as required strings. Inspect current diagnostics; line numbers may have moved.
- No live clip, financial save, provider call, payment, journal change or migration occurred in that preparation. Phase 08 remained incomplete and Phase 09 external.

Use the actual current checkout and evidence to reconcile these facts. Do not restore older voice-off, $10-budget, missing-what-if or already-fixed UI status from a stale snapshot. Do not describe historical reports as checks you performed.

You may fix a narrow, demonstrated type/validation issue needed for reliable verification if its behaviour is clear and covered by appropriate tests. For the budget union, narrow to the correct event variant before accessing call identifiers; do not invent IDs or rewrite the journal. For attempt identifiers, preserve the real required/optional semantics through sound validation; do not hide errors using empty-string defaults, unchecked casts or non-null assertions. Do not let this become a budget/recovery-engine rewrite or consume the entire UI assignment. Keep unresolved defects explicit.

The previous verification-only exact-next-action note is superseded **for the UI inspection and implementation newly requested here**. Its missing consent, human testing and other evidence gaps remain open. Complete independent local UI work without pretending those external checks passed.

## 9. Learn selectively from competitors and current guidance

Use the supplied competitor research as a starting point. If web access is available, check current primary product/help pages and relevant official guidance where it changes a decision. Cite the exact page, observation date and what you actually observed in the short design record. Do not infer current market share, quality or conversion from marketing. Do not spend the whole task researching.

Useful references and questions:

- **Oze, LedgerGH and Khatabook:** how quickly can someone enter a local event, find a named debt and understand its direction?
- **MonAi and TalkieMoney:** how obvious are typing/recording, input switching and the result?
- **Copilot:** how readable and editable is review? Its imported-record review does not replace CashNarra’s authorisation to create records.
- **Dime and Monarch:** what makes rows, summaries and navigation scan well without overwhelming the home screen?
- **YNAB:** how does changing an assumption make a goal outcome clear?
- **Wave and Lunch Money:** how are reporting, record management, price protection and subscription actions explained?
- **Cleo:** what does consistency of voice achieve? Retain CashNarra’s calm style; do not copy roasts or financial-services scope.

Study the principle, choose a CashNarra adaptation and explain the user benefit. Do not copy competitor brand assets, pages, claimed capabilities or entire feature lists. A new dependency, feature or dashboard customisation system needs a real product reason. Our differentiator should be understandable financial meaning and a well-crafted end-to-end experience, rather than a larger menu.

## 10. Verify the actual quality

Treat WCAG 2.2 AA as the accessibility target for the changes, not a certification claim. Check relevant semantics, reading order, names, labels, contrast, focus, dialogs, status feedback, keyboard use, zoom/reflow and reduced motion. Comfortable 44–48px controls are the existing design preference, not a blanket statement of the standard’s exact minimum. Preserve full amount values and readable text.

Required viewport/content checks: 320, 360, 390, 768, 1024 and 1440 CSS widths; short 360×640 and 390×640 screens; 390×844; intermediate desktop content with the sidebar; light/dark; 200% text/zoom; long names, large/negative amounts, multi-record stories and long transcripts.

Check the applicable empty, populated, loading, validation, failed, unresolved, offline, success and billing states. Do not infer them from the happy-path screenshot. Use mock or disposable local data for persistence and subscription checks.

Inspect before and after in a real browser. Test complete transitions, focus and actual responses, not only snapshots. If a task is still unclear or ugly at a required width, iterate. Reuse existing relevant UI/LP cases and tests; add a focused behavioural regression test when it protects meaningful new behaviour. Avoid tests that merely mirror static copy.

Inspect relevant browser console/network failures and whether each click invokes the correct existing action. Distinguish public-demo side-effect restrictions from normal app/auth reads. Keep essential content immediate, reserve image/FX space and avoid animation or provider responses on the critical rendering path. Use existing performance budgets; if absent, record measurements without fabricating a pass threshold. Local lab evidence is not field performance.

Run appropriate existing lint, typecheck, build and relevant unit/integration/browser checks after inspecting their safety and commands. First establish known baseline failures; repair change-introduced failures and safe scoped defects. Do not disable checks, delete tests, loosen financial validation or claim the full project passed because edited-screen lint passed. Rerun only when changes, failures or missing evidence justify it.

Record results as **PASS, FAIL, HISTORICAL PASS, NOT RUN or EXTERNAL**, with build/environment and precise scope. A focus test is not a human screen-reader pass, text validation is not speech recognition, and one consented clip would not establish accent accuracy. Keep unavailable human/device/field checks explicit while completing independent work.

## 11. Delivery and continuity

Work in coherent units and update the existing checkpoint/build log after each: baseline and coverage; shared visual grammar; capture/review journey; understanding/planning; account/settings/pricing/export polish; verification. Avoid unrelated rewrites. Keep tests, data and screenshots fictional or disposable; keep private evidence out of public deliverables.

Create or update a short project-root `CLAUDE.md` where appropriate, preserving any existing instructions. Point to `AGENTS.md`, the current harness and canonical design sources; put the essential financial/privacy/language rules in its body. Do not create a competing product spec or paste every report into the file. Keep Claude and Cursor using the same decisions and progress record.

Deliver:

1. Implemented UI/UX improvements across the relevant existing screens and working supported transitions.
2. A concise coverage/design record showing concrete issues, chosen changes and relevant source observations; avoid a huge essay.
3. Reusable components/styles and plain-language copy integrated with the existing architecture.
4. Actual verification evidence and any specific unresolved baseline, human, device or service dependency.
5. An updated current checkpoint/build log with the exact next action, preserving phase and consent boundaries.

Keep commits small and limited to your own work if the project workflow authorises commits. Do not automatically push, open external communications, deploy or mix another agent’s uncommitted work into your commit.

The work is complete only when the implemented changes satisfy the applicable requirements and change-related checks pass, with genuine external/baseline limitations clearly recorded. If something remains blocked, do not claim a fully verified product; leave the exact unfinished unit and finish independent work that is still possible.

Finish in understandable English:

- What now looks or works better, screen by screen.
- Why the most important changes help a person use CashNarra.
- What you actually tested and what remains unverified or failing.
- What I can now do in the app and the exact next action.

Start now. Read the real project, inspect the running product, make sound design decisions and implement the improvements. Do not wait for me to choose every minor detail or stop after presenting a plan.
