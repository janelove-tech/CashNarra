# CashNarra — Elite UI/UX, Brand Experience, Conversion and Product Design Audit

**Audit date:** 19 October 2026  
**Repository:** https://github.com/janelove-tech/CashNarra  
**Audited default branch:** `main`  
**Observed HEAD:** `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92`  
**Code evidence convention:** `https://github.com/janelove-tech/CashNarra/blob/3b4d1f89fed8c079cc3571aeff6276bfe5f04d92/<path>#L<n>`  
**Visual evidence:** eleven supplied PNG screenshots, filenames listed below.  
**Claim legend:** OBS = observed in supplied screenshot; CODE = verified at named GitHub commit; DOC = supplied canonical source/design kit; HYP = recommendation/hypothesis requiring validation; NOT VERIFIED = current local/uncommitted implementation or actual browser behaviour not inspected independently.

## 1. Executive verdict

**Keep the serious financial engine. Redesign the experience that introduces, demonstrates and operates it.** CashNarra is conceptually differentiated by ordinary narration becoming audited records and usable financial meaning. Its interface is recognisably branded and generally readable, but the screenshots show repetitious section treatments, extensive small helper copy, poor prioritisation of the signature narration-to-review transformation, and a visually thin version of the brand experience. A user is more likely to remember a demonstration of the transformed transaction than any current decorative panel.

The product's essential act should be experienced as **Tell → See what CashNarra understood → Fix only what matters → Save → See the result**. The current app often requires users to infer that proposition through headings and paragraphs. This is a *design and conversion diagnosis*, not an invented observed conversion rate. The product should feel especially strong for Ghanaian owner-operators using cash and MoMo without relying on dialect or stereotypes.

**First five investments:** (1) a useful, truthful interactive landing demonstration; (2) a redesigned first-use path to a first saved batch; (3) a more direct narrator/composer and compact review; (4) a visually legible Money Story and Accounts/Records information hierarchy; (5) stronger design system, interaction states, responsive accessibility and a clean component architecture. Preserve finances, source provenance, approvals and fallback paths.

**Important constraint:** the supplied screenshots and current GitHub `main` are not the same complete revision. The screenshot landing page has many sections, whereas committed `src/app/page.tsx` has a hero, one two-column section and a footer; the screenshot authentication form is split-screen, whereas committed `src/app/auth/page.tsx` is a centred single column. This is verified *version drift*. Cursor must inspect the actual local working tree and reconcile it with the immutable audited commit before any edit. All screenshots below are analysed as observed visuals, not assigned imaginary code identities if local rendering differs.

## 2. Source and repository verification

### Source inventory and precedence

- **Read/reconciled:** `Research CashNarra Concept.txt` (late vision supersedes exploratory automation/financial-inbox ideas); `Recommend Technology Stack.txt` (final Next.js/managed Supabase/Vercel trajectory and free/local development); `Storyline handoff package.txt` (the first Storyline kit was rejected and the v2 Narra redesign followed); `Repository Audit Plan.txt` (prior audit, its checkpoint recommendations, and its limitations); `CashNarra_Design_Kit_v2.zip` (archive listing, README, implementation brief, full Markdown guide, current CSS/JSON token assets, interactive prototype, identity assets, campaign files, screen references, validations); eleven uploaded screenshots; current GitHub tree, key app/API/domain/UI components, tests and status docs.
- **Fixed:** brand name **CashNarra**; tagline **Tell Your Money Story. See the Numbers.**; product structure **Record → Understand → Plan**; **Serious money. Light interaction.**; **Tell. Tap. Done.**; do not confirm the obvious, clarify the important; each interaction should reduce later effort.
- **Initial product:** personal/business workspaces, manual Cash/Bank/MoMo accounts, text narration and multi-event extraction, material clarification, confirmation, exact ledger, corrections, debt semantics, traceable reporting, accessible goals/scenarios, honest missing-data states, exports and offline drafts.
- **Progressive/deferred:** voice quality validation before broad availability; receipt OCR, statement ingestion, bank/MoMo APIs, advanced financial forecasting, staff collaboration and rich accounting/ERP features. No automatic funds movement, bank sync, investment advice, lending or tax filing.
- **Design baseline:** v2 Narra kit is an input to this critique, not a requirement to preserve its weaker decisions. Existing brand symbol may be refined, not casually discarded.
- **Technical decision:** Next.js 16 + React + TypeScript + CSS Modules, Supabase Auth/Postgres, exact decimal/deterministic posting, narrow OpenAI adapter, local IndexedDB drafts, Vercel intended production hosting. Local testing, Supabase Free and mocked AI initially remain correct.

### GitHub verification

- Branch `main`, HEAD `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92`; repository metadata and branch endpoint verified during this audit.
- `src/app/page.tsx` public landing; `src/app/auth/page.tsx` authentication; `src/app/app/page.tsx` loads `src/components/cashnarra.tsx`; `src/app/privacy/page.tsx` privacy; `src/app/layout.tsx` typography/metadata; `src/components/app.module.css` app and landing layout; `src/app/globals.css` and `src/app/tokens.css` foundations; `src/components/ui.tsx` shared Button, Amount, Dialog, RecordRow; `src/components/record-form.tsx` manual event editing; `src/components/voice-capture.tsx` recording; `src/components/workspace-tools.tsx` people and planning tools; `src/components/report-trace.tsx` calculations trace; `src/components/period-explanation.tsx` optional explanation.
- Server/API inspection: `src/app/api/demo/route.ts`, `src/app/api/logout/route.ts`, `src/app/api/workspaces/route.ts`, `src/app/api/understand/route.ts`, `src/app/api/explain/route.ts`, `src/app/api/transcribe/route.ts`, `src/server/ai.ts`, `src/server/auth.ts`, `src/server/recording.ts`; read source `src/domain/dates.ts`, `src/lib/supabase.ts` and code-derived main workflow. Repository tree includes domain ledger/goal/planning modules and versioned Supabase migrations.
- Test evidence: source tree contains Vitest, Playwright, `scripts/test-db.ts` and `scripts/test-supabase.ts`. `docs/BUILD-STATUS.md` records successful local tests and production builds as of 16 Oct; those results were **reported by the repository**, not rerun in this environment. `git ls-remote` failed due DNS/network access; executable checkout/browser benchmark not independently available. There is no basis to claim measured Core Web Vitals, WCAG compliance, real conversion, or current local test passes.
- Existing `AGENTS.md` contains Next.js agent guidance. Reuse/reconcile it and any local checkpoint process, rather than blindly replacing it.

### Verified current-code issues relevant to experience

**CODE-01 — Public demo production contradiction (P1, conditional).** `src/app/page.tsx` shows `Try the synthetic demo` and calls `/api/demo`; `src/app/api/demo/route.ts` rejects when `process.env.VERCEL` is present. Thus shipping that button unchanged on Vercel leads to rejection. The security restriction is intentional and should stay. Build a **client-only, explicitly fictional public demo** without a development/demo session, database writes, auth bypass or genuine AI claims.

**CODE-02 — Giant authenticated component (P2).** `src/components/cashnarra.tsx` is about 2,550 lines and owns pages, data, navigation, modal orchestration and many workflows. This is a verified maintainability risk; it also makes consistent redesign harder. Incrementally extract screens and task components behind the same state/business operations; do not rewrite all logic in one pass.

**CODE-03 — Dense typography (P2).** `src/app/globals.css` defaults to 14px body despite `--cn-type-body-size:16px`; `src/components/app.module.css` uses 13px record descriptions and 11px record metadata. That is likely fatiguing on modest mobile screens. Correct comfortable body to 16/24, dense records to 14–15/20–22, secondary to at least 12.5–14 depending on role; verify overflow and contrast.

**CODE-04 — Account identity (P2).** `src/components/cashnarra.tsx` renders every Cash, Bank and MoMo account with `<Landmark>`, reducing at-a-glance recognition. Introduce account-type symbols with non-colour labels; maintain the same manual-tracking semantics.

**CODE-05 — Form affordance (P2).** `src/components/ui.tsx` Button API is essentially `primary`, `disabled`, `type`, `onClick`; no shared named variants/loading states/controlled accessible labels. Extend it without replacing every caller or breaking keyboard access.

**CODE-06 — Capture affordance (P1/HYP).** In the committed Today view, the large story-like field is a button navigating to a *separate* capture page; it visually resembles an editable composer but cannot accept typing in place. A novice may try to type there. Either make it a real input/composer or make the launcher unmistakably a CTA. Prefer direct inline capture on Today and a full-screen focused expansion only when needed.

**CODE-07 — Clarification effort (P1/HYP).** In committed Review, questions are rendered as separate panels whose answer path calls `manual(...)`, opening the full event editor. For common account-choice ambiguity this unnecessarily escalates a one-tap question into full-form editing. Replace with answer-specific inline options while retaining validation and edits.

**CODE-08 — Voice misleading prominence (P2/HYP).** A `Voice` button is offered on Today even when `voiceEnabled` is false. Clicking opens a recording interface that explains transcription is off. It is not an inert button, and local recording may work, but it risks a promise mismatch. When transcription is unavailable, show `Record audio (transcription unavailable)` in an explicit experimental area, or remove the prominent voice CTA until the gated feature is ready.

**CODE-09 — Auth/landing version drift (P1 handoff risk).** Screenshot layouts cannot safely be rewritten using old GitHub selectors without first checking local changes. Require `git status --short`, `git diff`, file comparison, and a local screenshot baseline in Cursor.

**CODE-10 — Day/period labels (P2 verification).** App `date` initially uses UTC `new Date().toISOString().slice(0,10)`, while reports discuss Africa/Accra. These currently align for Ghana, but an expansion beyond Ghana must use an explicit workspace timezone for day boundaries. Distinguish transaction date from recorded timestamp. The supplied screenshots show October 20 and October 19 groups while today's selected story is October 19: this may be intentional but needs clear relative labels, accurate source date, and snapshot-vs-current-date checks.

### Existing strengths (KEEP)

- Exact monetary arithmetic and hidden deterministic ledger; authoritative totals never generated by the LLM.
- Reviewed/posted separation, all-or-nothing batch saving, idempotency/receipt recovery, bounded extraction, workspace authentication and RLS model.
- A model-based extraction path with financial/domain validation, and a small deterministic mock for two explicitly labelled examples; don't overstate the general interpreter's live quality.
- Correction/source history; unknown openings distinct from zero; receipt distinct from sale; loans, transfers and owner withdrawals classified separately; no invented profit.
- CSV/PDF/spreadsheet exports, optional local draft capture, scoped privacy controls and synthetic demo data.
- Existing strong conceptual brand components: speech-derived mark, Ink/Violet/Apricot roles, Manrope display + Inter financial typography. Keep brand recognisability as the identity matures.

## 3. Current experience diagnosis

### Perceived craft

**What works:** a calm palette, a largely consistent left navigation, legible headings, no flashy false investment dashboards, real financial caution and visible editing controls. **What underperforms:** too much paragraph-based explanation, excessive empty regions, modest font sizes, repeated neutral-bordered controls, generic line icons, an unexceptional mark in repeated placements, an inconsistent hierarchy of actions, little dimensional differentiation between storytelling and financial facts, and extensive support text occupying precious primary-screen space.

Design principles: a **single focal action** per state; information density aligned to *task complexity*, not low density everywhere; **numerical hierarchy** (amount, what it means, period, source); visually distinctive **source → verified event → useful result** transformations; restraint in decorative features.

### Commercial funnel

Visitors should answer in under a glance: What is this? Why would I use it? Can it understand the way I describe my money? Do I stay in control? What happens after clicking? The long captured marketing design builds atmosphere but delays practical proof. The current committed hero explains the concept, but the public sample button relies on a dev-only endpoint. Repair both problems with a lightweight, browser-only, fictional sample that allows meaningful first interaction and leads into an authentic registration invitation.

### Existing UI language

The current app alternates between excellent plain terms (`Record payment`) and literary ones (`Every story has a paper trail`, `Give your story a direction`). In a public campaign, storytelling is valuable; in daily operation, actions must be literal. Prefer `Records`, `Your money this month`, `Add a money event`, `Review 3 records`, `Correct this record`. Reserve evocative copy for moments that justify it, especially the Money Story cover and celebratory first result. Nara is an assistance persona, not a human employee, autonomous accountant, or a claim of independent judgment.

## 4. Screenshot-by-screenshot audit

**SS01 — `image(20261019-181923).png`, Settings.** OBS: a long list of nearly identically weighted setting rows, `Hide amounts`, shared-device mode, narration retention, check-in, people and data requests, followed by a low-contrast legal/status note. The page blends frequent personalization with infrequent privacy-risk actions. **KEEP + IMPROVE:** group into (A) Appearance & screen privacy, (B) Recording and local drafts, (C) Review reminders, (D) Data & account; put data export, access and deletion behind clearly titled actions; allow `Remove original text now` only with consequence/review confirmation and distinct status; don't call operator requests completed. Single column max-width 720; section headers 20/28, row labels 15/22, helper 13/20. On mobile, controls below labels and 100% width when needed. CODE: `src/components/cashnarra.tsx` settings block; screenshot differs in detailed copy so reconcile local.

**SS02 — `image(20261019-181934).png`, Accounts.** OBS: three large equal cards for Cash/MoMo/Bank, each using the same bank icon and retaining significant unproductive whitespace. The total GH₵8,680.00 dominates before account-source context. **KEEP + IMPROVE:** main balance summary with `Recorded from your entries · Not linked to banks`; account rows/cards 96–140px height with visual type identification, known-vs-unknown opening, record count/last activity and a clear `View activity` click target. Offer compact list for 3+ accounts; don't mark a zero verified. Show `Check opening` only when unknown or requires correction, otherwise put it in details. CODE: account grid and `.accountGrid`, `.panel`.

**SS03 — `image(20261019-181935).png`, Records.** OBS: tiny transaction descriptions, amount and dates at opposite ends of very long rows, unbalanced whitespace, no convincing type hierarchy, page-level `Money still owed` mixed into the transaction journal, day headers inconsistent (`20 Oct`, `Today`, `17 Oct`). **REDESIGN presentation / KEEP data:** searchable ledger with sticky search/filter on narrow screens, grouped dates with *date plus relative context*, 15px primary description, 13px supporting type+account, 15px tabular amount; left receipt/payment/credit cue with textual sublabel; desktop max scan width 1040. Separate `People & balances` tab/subview or narrow inset rather than full debt module beneath ledger. Date validation: selected period date, `event.date`, created timestamp, and UTC/Ghana local labels must be compared in e2e. For credit sales show `Owed / No cash received` explicitly rather than an unqualified positive number. CODE: `RecordRow`, `cashnarra.tsx` records view; screenshot date grouping not in committed `rows(filtered)` implementation.

**SS04 — `image(20261019-181944-1).png`, Review-month dialog.** OBS: tall inner scrolling dialog with a three-step explanation before the month picker; user cannot see the complete task at once. **REFACTOR:** a focused short dialog, title `Review a month for this goal`; month picker at top; three concise checkboxes or one clearly worded confirmation with distinct review dimensions; disclosure `Why this matters` for method; persistent footer buttons. Never infer completeness from having ticked the box. Implement via named `GoalMonthReviewDialog` with scrollable body only when truly necessary and clear focus return. CODE: `cashnarra.tsx` goal-review modal.

**SS05 — `image(20261019-181944).png`, Plan.** OBS: primary target GH₵100,000 and assigned GH₵5,800 shown clearly, but the vast right-hand explanation competes with the primary goal; missing-history message is word-heavy. **KEEP + REDESIGN display:** hero progress with 5.8% label, remaining GH₵94,200, a primary `Assign money` button and secondary `Try a monthly amount`; at top show current state `Not enough reviewed history for a pace estimate`. Put 3-month review request into an actionable compact panel. Put allocation/record separation in a 1-line label next to amount and link to details; collapse deeper caveats. No precise finish date until adequate histories. CODE: `forecast(...)` remains unchanged; UI goal grid, scenario and goal-review refactored.

**SS06 — `image(20261019-181947).png`, Money Stories.** OBS: a strong dark cover is the one truly distinct component, but following sections devolve into numbered paragraphs and rows of secondary buttons. Main number GH₵8,000 received outshines money out GH₵14,820 and negative net GH₵6,820; `Here’s the story` currently introduces more prose. **KEEP cover language selectively; REDESIGN composition:** a three-metric strip (received/paid/net), signed net, period and coverage note; an accessible paired bar (same scale) only if it improves quick comparison; `Why these are different` explanation for sales-vs-receipts; exactly one visible noteworthy event if verified by rules; a record-linked ledger of significant events; `See supporting records`. Don't fake profit. CODE: stories, `ReportTrace`, `PeriodExplanation`, report helper.

**SS07 — `image(20261019-181951).png`, Today.** OBS: the balance band occupies valuable attention above the most important task. A large story card contains a textarea-looking region and two competing actions; the right story card is visually stronger than the user input, despite being secondary. **REDESIGN hierarchy:** first screen shows `Tell me what happened` composer with editable field and one dominant action; compact three-line day summary below/adjacent; activity and items needing attention after. Desktop 8/4 columns; mobile composer visible high in viewport before detailed metrics. The demonstration-text placeholder must look instructional, not prefilled financial data. CODE: `cashnarra.tsx` Today, `.balanceBand`, `.composer`, `.homeGrid`, `.capture`.

**SS08 — `image(20261019-181956).png`, Sign-up.** OBS: huge hero panel uses poetic text and the form has unused space, scattered helper links, no clear step toward first record. **REDESIGN / preserve auth:** responsive single task header `Create your account`, simple reason to trust, 2 fields, visible password guidance, password toggle, one primary CTA, verified-email status, optional previous-demo continuity only if safely supported. Public processing notice near the checkbox, not overbearing; remove `Open records` shortcut from new-user form unless it genuinely helps access. Separate marketing introduction is optional on widescreens and never takes more width than the form when actual entry is the task. CODE: auth source differs from screenshot and must be reconciled.

**SS09 — `image(20261019-182000).png`, Sign-in.** OBS: same oversized left hero, small right form, and four low-priority links create competing paths. **REDESIGN:** `Welcome back`, email/password, visible `Forgot password?` near password, show/hide, full-width `Sign in`, one `Create account` link. After session established, preserve intended workspace and draft context. Password managers and paste should work. CODE: auth route; screenshot != HEAD.

**SS10 — `image(20261019-182008).png`, long landing page with FAQ collapsed.** OBS: repeated pale abstract motifs, extended storytelling, wide empty regions and recurring two-column blocks require substantial scrolling to discover the practical product. The dark Ama story is emotionally approachable but duplicates earlier statements. **REDESIGN:** hero with instant worked financial example, benefits in one compact section, minimal 3-step explanation, product Money Story preview, truthful trust boundary, tight FAQ and CTA. Reduce rather than decorate. Keep only one editorial vignette if it genuinely demonstrates a financial ambiguity.

**SS11 — `image(20261019-182020).png`, long landing page with FAQ expanded.** OBS: expanded FAQ becomes a long stack of technical/disclaimer paragraphs, overwhelming the CTA. **IMPROVE:** 5–6 succinct objections; answer first sentence immediately, with second sentence/context links only as needed; use one-open-at-a-time or independent details depending observed behaviour, with keyboard and ARIA. Keep privacy transparency and uncertainties, but don't crowd sales copy with developer status. Present live feature availability plainly. Screenshot from a noncommitted landing implementation.

**Common screenshot inconsistencies to investigate:** account and Records screens use materially different density; all account types share one bank glyph; periods and relative date grouping may be confusing; landing header/CTA differs by snapshot; voice is prominent despite gated transcription; some screenshot `Today` records have October 19 dates while a separate future-dated October 20 obligation is visible—investigate grouping semantics instead of labelling it a confirmed defect; no supplied 320/360/390 render is proof of narrow-screen behaviour.

## 5. Current UX and code architecture

| Page/user task | Committed source-of-truth | Current disposition | UI refactor boundary |
|---|---|---|---|
| Landing | `src/app/page.tsx`, `src/components/app.module.css` | REDESIGN | Public page sections, public demo component |
| Sign in/up/recovery | `src/app/auth/page.tsx`, `/auth/confirm` | REFACTOR UX / KEEP Supabase | `AuthForm`, `AuthStatus`, `PasswordField` |
| App layout | `src/app/app/page.tsx`, `src/components/cashnarra.tsx` | REFACTOR | `AppShell`, `WorkspaceSwitcher`, `DesktopSidebar`, `MobileNav` |
| Today | `cashnarra.tsx` approx. lines 758–976 | REDESIGN view | `TodayScreen`, `StoryComposer`, `DaySummary`, `RecentActivity`, `AttentionList` |
| Capture | `cashnarra.tsx` approx. lines 977–1110 | KEEP + IMPROVE | `StoryCapture`, `DraftPersistenceStatus`, `CaptureExamples` |
| Clarification/review | `cashnarra.tsx` approx. lines 1111–1236; `record-form.tsx` | REFACTOR | `ClarificationStep`, `BatchReview`, `RecordEditor`, `BatchSaveBar` |
| Records and debt | `cashnarra.tsx` approx. lines 1237–1386; `ui.tsx` `RecordRow` | REDESIGN view | `LedgerList`, `RecordFilters`, `ObligationsSection`, `RecordDetail` |
| Money Stories | `cashnarra.tsx` approx. lines 1387–1548; `report-trace.tsx`, `period-explanation.tsx` | REDESIGN presentation | `MoneyStory`, `MovementStrip`, `SignificantEvents`, `ReportTrace` |
| Accounts | `cashnarra.tsx` approx. lines 1549–1625 | KEEP + IMPROVE | `AccountsOverview`, `AccountRow`, `OpeningBalanceEditor` |
| Goals | `cashnarra.tsx` approx. lines 1626–1757, goal dialogs from ~2160; domain `goals.ts` | REDESIGN view / KEEP forecasts | `GoalCard`, `ScenarioPanel`, `GoalMonthReview` |
| Settings/privacy | `cashnarra.tsx` approx. lines 1758–1907; `src/app/privacy/page.tsx` | REFACTOR grouping | `AppearanceSettings`, `DraftPrivacy`, `DataRequests` |
| UI design system | `src/app/tokens.css`, `src/app/globals.css`, `src/components/app.module.css`, `src/components/ui.tsx`, `src/design/tokens.json` | KEEP + IMPROVE | Tokens + accessible foundation component layer |
| Financial posting | `src/domain/ledger.ts`, `src/server/store.ts`, Supabase migrations, `/api/workspaces` | KEEP | API-compatible existing operations |
| AI interpretation | `src/server/ai.ts`, `/api/understand` | KEEP + EVALUATE | Stable extraction contract; UX only around uncertain fields |
| Voice | `voice-capture.tsx`, `/api/transcribe`, `server/recording.ts` | DEFER prominent positioning | Gated optional capture, text fallback |
| Offline and exports | `src/lib/drafts.ts`, `draft-backup.tsx`, `src/lib/exports.ts`, `public/sw.js` | KEEP + HARDEN | Clear status and recovery UI |

**Refactor rule:** the user-facing `CashNarra` shell may continue to own loaded workspace and coordinated operations initially; presentational components receive explicit props and callback operations. Extract in this order: shared amount/row/controls → page displays → dialogs → capture/review state orchestration. Preserve idempotent `perform/saveBatch/recover` flow and never replicate posting logic client-side in redesign components.

## 6. External research synthesis and applicability

**Research performed:** 19 October 2026. The primary evidence below supports general UX patterns; it does not prove CashNarra-specific conversion improvement.

1. **Nielsen Norman Group, Progressive Disclosure (2022):** showing primary choices first and deferring rarely used options reduces initial complexity. Apply to long settings, goal review, and Money Story methodology, while keeping any risk-critical statement visible at decision time. This is usability guidance, not measured CashNarra uplift. https://www.nngroup.com/videos/progressive-disclosure/
2. **NN/g, Information Scent (2020):** understandable labels and relevant nearby context help users predict a click's result. Replace vague CTA (`See how it works` without destination) with contextual alternatives (`Try a sample money story`, `Review 3 example records`); be explicit about no real posting. https://www.nngroup.com/articles/information-scent/
3. **NN/g, Visual Hierarchy (2021) and Layer Cake (2019):** visual contrast, scale, grouping and descriptive headings improve focus and scanning. Applied to primary recording action, amount panels and transaction list; user testing must show whether users identify correct next step faster. https://www.nngroup.com/articles/visual-hierarchy-ux-definition/ and https://www.nngroup.com/articles/layer-cake-pattern-scanning/
4. **Microsoft Research, 18 Human–AI Interaction Guidelines (2019):** make capabilities and limits clear, allow efficient correction, ask when uncertain, and explain system reasoning. The guidelines underwent published evaluation; CashNarra must still test Ghanaian narration ambiguities. https://www.microsoft.com/en-us/research/blog/guidelines-for-human-ai-interaction-design/
5. **GOV.UK Design System, Questions and Errors:** ask a focused question, do not ask for the same information twice, preserve entered input on errors and offer repair instructions. Directly relevant to `Which account paid for delivery?` and `Save could not be confirmed`. Do not transform financial review into a multi-page tax form. https://design-system.service.gov.uk/patterns/question-pages/ and https://design-system.service.gov.uk/components/error-message/
6. **WCAG 2.2:** Target Size (Minimum) AA uses 24×24 CSS pixels or specific exceptions, not a blanket 44-pixel legal AA rule. Adopt CashNarra's more comfortable 44–48px target as a product design preference; test focus not obscured and accessible authentication. https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum and https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
7. **web.dev Core Web Vitals:** field targets are LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at 75th percentile. These are measurement targets, not achieved CashNarra results. Avoid heavy animation/demo infrastructure and test ordinary mobile connections. https://web.dev/articles/vitals
8. **Baymard, delayed account creation (2023):** in checkout testing, early account creation can distract from a user's immediate purchase task. *Analogy only*, not proof for fintech signup: CashNarra can demonstrate value with a fictional sample before requiring registration; true private records still require appropriate authentication. https://baymard.com/research-articles/delayed-account-creation
9. **Duolingo, official product blog (2022):** a published description of Streak Freeze explicitly recognises that losing a streak can demotivate learners and builds in flexibility. Transfer the forgiving catch-up principle, not a streak counter: a day without recording is not a financial failure. This is Duolingo's own product rationale, not CashNarra-specific measured evidence. https://blog.duolingo.com/how-duolingo-streak-builds-habit/
10. **Monzo, official product help:** the Trends/Insights separation of Money In, Money Out, balance and period-specific analysis is a useful reference for clear metric grouping and source drill-down. CashNarra MUST NOT copy Monzo's bank-connected balance or left-to-spend claims, because its own accounts are manually recorded. https://monzo.com/help/business-accounts/what-is-insights
11. **Todoist and Wise:** relevant inspiration for forgiving task completion and trustworthy financial language, respectively, but this review does not assert a specific independently validated pattern from their current builds. Avoid unsupported competitor performance or conversion claims.

**Research transfer test:** each chosen pattern must demonstrate either fewer clarification steps, higher correct task completion, clearer financial comprehension, less confusion or faster safe recovery. A more animated interface alone is not a successful transfer.

## 7. Recommended design direction and design system

### Three credible concepts

| Direction | Core idea and signature | Landing expression | App expression | Advantage | Risk/effort |
|---|---|---|---|---|---|
| **A. The Living Ledger** | Financial events become a vertical narrative with a persistent fine storyline connecting words, reviewed entries, and consequence | Hero animates source phrase into typed events; visual timeline | A continuous traceable activity stream with focused review steps | Differentiated while grounded in the product | Medium; avoid overly decorative line art / screen-reader reading-order pitfalls |
| **B. The Daily Counter** | Warm compact merchant-counter utility; tactile action sheet and receipt aesthetics | Demonstrate one day closed in a receipt | Dense, fast, strongly transactional | Immediate familiarity for traders | Medium; risks looking like POS software or hiding the planning/storytelling identity |
| **C. The Calm Financial Journal** | Editorial, spacious, richly written journal entries | People-first stories, photography and reflective chapters | Editorial reports and note-like cards | Emotional trust and attractive campaigns | Low–medium; repeats today's verbosity and may delay core task |

**Recommendation: A — The Living Ledger**, blended with B's quick-action ergonomics. It advances the existing Narra speech mark into a recognizable visual behaviour: **words become precise events; events become explanatory totals**. Maintain the existing brand palette, but introduce restrained *connection devices*, not more cards or purple gradients.

### Brand signature and logo evolution

Retain CashNarra wordmark and paired speech-mark concept as continuity. Refine the symbol rather than replacing it with a conventional bank/coin chart: make the two forms optically balanced; strengthen silhouette at 16px, 24px and 40px; tune negative-space “N” clarity; prepare monochrome, reverse and app-mask versions. Commission/prototype at least 6 vector silhouette variants, not 6 different brand stories. Validate recognition in a 5-second unlabelled thumbnail test and 24-hour recall test; no invented result. Keep wordmark Manrope and do not place the GH₵ glyph in Manrope.

**Living Ledger's visual invariant:** an unobtrusive `source → event → result` connector, 1–2 px, with exactly three meaningful nodes or states, appears in the marketing demo, review step and Money Story trace. It is never a meaningless wavy decoration. No mascot. Avoid glowing neural networks, floating 3D banking symbols and endless SVG wallpaper.

### Final foundations — proposed tokens

| Role | Light | Dark | Notes |
|---|---|---|---|
| Page | `#F7F7FA` | `#191723` | Existing baseline |
| Surface | `#FFFFFF` | `#242131` | Primary controls and reading zones |
| Soft surface | `#F0ECFC` | `#322C43` | Composer and focused process step |
| Ink | `#29263D` | `#F6F3FB` | Main readable foreground |
| Muted readable | `#625F73` | `#C1BBCE` | Secondary; verify with actual font/size |
| Border | `#E1DEEB` | `#423B53` | Dividers, not universal card outlines |
| Brand primary | `#5B49C7` | `#BEAEFF` | Actions/progress, contrast verify |
| Brand pressed | `#403194` | `#AB96F0` | Feedback |
| Accent | `#FFC4A0` | `#FFC4A0` | Brand storytelling accents, not every financial outgoing amount |
| Success | `#226247` | `#9DD5AD` | Confirmed/save state only |
| Warning | `#79501B` | `#F4CE91` | Clarification/draft ambiguity, not outgoing money |
| Error | `#AE302C` | `#FFABA3` | Failures, not debts or expenses |
| Money received | `#445BA1` | `#BACAFB` | Direction only; text label always |
| Money paid | `#95603E` | `#F1BA94` | Direction only; not a moral judgment |
| Focus ring | `#5B49C7` | `#D0C3FF` | 3px at visible offset |

**Typography:** Manrope 700/800 for 48/52 hero, 32/40 page title, 24/32 summary and 20/28 section title; Inter 400/500/600 for body 16/24, primary row 15/22, supporting 13/20, label 14/20, micro only 12/18 for nonessential metadata. Amounts Inter 600 with tabular-nums; hero amounts 36–40/44–48; headline financial key 28/36; normal amounts 15–18/24. At 320px, allow a long amount to wrap across label and numeric sub-lines; never truncate or crop meaningful digits.

**Spacing/layout:** 4px base; task spacing 8/12/16/24/32/48/64; desktop sidebar 224px, main max 1180px, screen horizontal 32px, page sections separated 40–56px (not indiscriminately 100+). Tablet 24px horizontal; mobile 16px at 320, 20px at 360+, content 20–24px vertical. Breakpoints tailored to real component fit at `360`, `760`, `960`, `1150` (320 handled with fluid layout). No arbitrary 3-column account cards at intermediate widths; adapt to fit content. One button max per primary card, with text links for secondary actions.

**Controls:** primary solid brand, secondary surface border, quiet text, danger only for irreversible/far-reaching action. Heights 48 main, 44 secondary; 12px control radius, 16–20 panel radius (24 reserved for hero or major story), no pill overload. Input 16px, max-width appropriate to field, persistent labels, examples outside input. Review controls have predictable focus and data preservation. Icons Lucide 18–20, 1.75–2 stroke; direction marked by text and symbols, not colour alone. Navigation labels are readable; active state may use left accent + background, not only colour.

**Depth:** one very soft shadow for interactive floating review/drawer and raised demo sample; normal ledger rows use separators and type, not shadows. No full-page background gradients. Brand device usage limited to hero/demo transitions and story cover.

**Motion:** press 100ms; menu/accordion 160ms; narration-to-card reveal 180–220ms (stagger max 60ms per row; cap total 450ms); goal fill 300ms after confirmed state; no count-up of financial amounts during official save. `prefers-reduced-motion: reduce` disables transforms/staggers and uses immediate reveals. Animation never blocks accessibility focus or submission.

**States:** loading label plus skeleton only on content whose shape is known; errors with exact recovery; local draft, processing, clarification, ready-to-review, saving, saved, save-outcome-unknown are visually and semantically distinct. Never use success green for an unverified financial outcome.

## 8. Landing-page redesign blueprint

### Funnel recommendation

**Attention → immediately demonstrated result → relevance → proof of user control → registration.** The landing page is not an investor narrative. Show a familiar statement becoming reliable records in the first viewport; avoid requiring visitor scroll to learn its purpose. All visuals use fictional sample information.

### Five headline directions

| Approach | Headline | Support copy | Primary CTA | Optional secondary | Mechanism / risk |
|---|---|---|---|---|---|
| **A: Clear outcome — RECOMMENDED** | **Tell us what happened with your money. We'll help you make sense of it.** | `Describe a sale, expense or payment in your own words. Review the records CashNarra finds, save them, and see the numbers clearly.` | `Try a sample story` | `Create an account` | Plain benefit and honest human confirmation; careful not to imply automatic live voice |
| Frustration | **Your money records shouldn't take another hour of your day.** | `Turn everyday descriptions into organised records without rebuilding your day in a spreadsheet.` | `See an example` | `Start my records` | Pain relevance; risk of unproven time-saving claim, so avoid precise time guarantee |
| Simplicity | **A lot happened today. One story can record it.** | `Tell CashNarra about several money events at once. Check what it understood before saving.` | `Show me how` | `Create an account` | Highlights batch value; “one story” must not imply zero corrections |
| Financial understanding | **Finally know where the money went.** | `Track what came in, what went out and what is still owed—based on what you record.` | `Explore a Money Story` | `Get started` | Outcome focus; risk of implying complete omniscience; qualification needed |
| Transformation | **From “I sold 900” to records you can actually use.** | `Your own words become separate, reviewable sales, payments and expenses.` | `Try the example` | `Start recording` | Strong before/after; might skew to businesses over Personal users |

**Recommended headline treatment:** A for initial test, with a shorter visual variant `Your money, explained from your own words.` in the next qualitative test. Place the official tagline in footer/brand lockup, onboarding closing note and share templates. It is a brand signature, not the primary information-scent headline.

### Page sections (avoid building anything unneeded)

**Section 1 — Hero, sample instantly visible.** Heading `Tell us what happened with your money. We'll help you make sense of it.` Supporting text as A above. Left column about 45%, right interactive sample 55% at ≥960; mobile stacks short heading → sample → CTA. Public demo stage: visible sample narration quote; three separated events; one accounting distinction. Primary `Try a sample story` scrolls/focuses/opens embedded demo directly; secondary `Create an account` leads to `/auth?mode=signup` with intent parameter supported by auth. Trust caption `A fictional example. No account needed. Nothing is saved.` The source statement must specify *GH₵80 delivery* rather than leave amount unstated:

> “I sold 900 cedis in cash, paid 80 cedis cash for delivery, and Abena paid 200 cedis cash towards her old debt.”

Interpretation: cash sale +GH₵900; delivery payment −GH₵80; previous customer debt payment +GH₵200 cash (assume the sample clearly states cash, or show a required payment-account selection); sales GH₵900 and receipts GH₵1,100; net cash movement +GH₵1,020; old debt reduced by GH₵200. If payment account is genuinely unspecified, demo must stop for selection instead of assigning one silently. **Use the sample variant with all amounts and accounts known for the first animation; introduce an unspecified payment account in the second optional step.** No live AI invocation is necessary.

**Section 2 — One workflow, three beats.** Headline `One story. Clear records. Your decision.` Three steps visually connected: `1 Tell it your way` (`Several events in one message`); `2 Check what CashNarra understood` (`Fix a detail if needed`); `3 Save and see the meaning` (`Your accounts, records and Money Stories update`). Desktop one narrative line with real mini-views; mobile vertical connected steps. No repetitive 3 equal shadow cards.

**Section 3 — Show an actual useful result.** Headline `Know what came in—and what it meant.` Display an illustrative Money Story screenshot: received, paid out, sales distinct from collections, remaining debts, one line of interpretive explanation and record trace link. Support `Old customer payments are not counted as new sales. Transfers are not expenses.` A small `See the explanation` interaction expands one example, not a full transcript.

**Section 4 — Relevant audience and trust boundaries.** Headline `For the shop, the side hustle and your own everyday money.` Three use cases in a single compact strip, each with one specific example. Beneath: `Your money stays in your accounts. CashNarra records what you tell it. It doesn't access your bank or MoMo automatically.` Display no fake locks, certificates, bank logos or customer avatars.

**Section 5 — Objections.** `A few things worth knowing` and a compact accessible accordion, 5–6 questions: What if it gets something wrong? Does it move money? Can I keep business and personal separate? Can I export? Do I need accounting knowledge? Is voice available? Avoid making long privacy/legal notice part of hero content. Link to `/privacy` for full detail. If available states differ by environment, drive text from runtime feature flags rather than marketing assumptions.

**Section 6 — Closing CTA.** `Your next money story starts with one ordinary day.` Supporting: `Start with something you remember. Check the details before saving.` CTA `Create my account` → `/auth?mode=signup`; secondary `Try the fictional example again` scrolls/focuses demo. Show true development availability: until real customer onboarding is operationally ready, label as pilot/private testing or disable honest registration where required; never imply a public launch already happened.

**Cut rule:** if session observation shows section 2 adds no comprehension beyond interactive hero, remove it. If customer story section causes scroll without improving relevance, shorten or remove. No large photo/vignette just to fill an empty section.

### Public demo: exact interaction design

- Entirely local JS/React data, generated from an immutable fixture; **never** invoke `/api/demo` on production or create real financial records.
- Stage A: source text visible. Click `See how CashNarra reads this` (initial CTA may auto-focus this control). Show three events sequentially with quick 160–220ms transitions or instantly under reduced motion.
- Stage B: display `3 possible records` and event types with checked account labels and exact amounts. If user chooses `Try a trickier story`, source changes to `...paid 80 for delivery` (account omitted); show one inline question `Was delivery paid from Cash or MoMo?` Two 44px choices.
- Stage C: clicking choice updates fictional preview. No “Saved to your account.” Show `That's what you'd review before saving.`
- Stage D: CTA `Record my own story` → `/auth?mode=signup`; secondary `Reset example`. Preserve marketing attribution as anonymous event-only metadata, never transfer fictional records into personal account as real entries.
- Error case: no JS → static worked example remains visible and readable. On slow devices skip all animation; no remote API requirement.
- Accessibility: announcement `Three possible records shown`, keyboard reachable answer controls, focus moves only on explicit step change, respect reduced motion; same text content visible without CSS transitions.

### FAQ ready copy

**Do I need to know accounting?** `No. Describe what happened as you normally would. CashNarra suggests the records and you review them before saving.`

**Does CashNarra connect to my bank or MoMo?** `Not in the initial version. You add and update Cash, Bank and MoMo records yourself. Shown balances are based on your entries, not verified by a bank.`

**Will it move or hold my money?** `No. CashNarra records and explains money activity. It does not transfer funds or operate a wallet.`

**What if it misunderstands a payment?** `Correct the proposed event before saving. Saved records can also be corrected, with a history of the change.`

**Can I use it for business and personal money?** `Yes. Keep separate workspaces so your shop and personal records do not get mixed together.`

**Can I export my information?** `The application includes private CSV, PDF and spreadsheet exports. Verify the actual readiness and coverage before promoting this to live customers.`

**Is speaking available?** `Text recording is the primary supported workflow. Short audio recording/transcription is being evaluated and is not generally promised yet.` (Update only after real quality and availability verification.)

**Are the numbers guaranteed correct?** `CashNarra calculates from records you confirm. It can help you understand those entries, but missing activity and unverified account balances remain important limitations.`

## 9. Registration and onboarding redesign

### Definition of first meaningful success

**A new person can describe something that happened with their money, review an accurately interpreted event, safely save it, and see a clearly attributed result.** Activation should be measured when the confirmed batch is persistently saved and the user sees its Money Story effect, not when they merely register or click the hero CTA. The demo is **pre-activation exploration**, not a financial record. Target journey:

`Public fictional demonstration → Create account → Email verification if required → Choose Personal/Business workspace → Describe first event → Account detail just-in-time → Clarify only material ambiguity → Review events → Confirm/save → See first Money Story + record trail.`

### Three concepts and the decision

- **A. Value before registration:** safe fictional client demo, then real signup. **USE on marketing site.** Works with current backend rules and allows product understanding before authentication. Guardrail: no private user data or server-bound financial extraction in public demo.
- **B. Minimal registration, narration next:** email/password, workspace choice, immediate editable composer; defer nonessential account/goal/notification preferences until needed. **USE for authenticated first-run.** The first financial account can be added at the moment a transaction requires it, with unknown opening allowed; no silent zero.
- **C. Personalised questionnaire:** ask industry, ambitions, number of banks, preferred reminder, average revenue etc. **REJECT** for initial activation: high effort and little proven benefit. Workspace type is useful; further context should be requested only when it changes processing.

**Recommended:** A + B together. The product must not require a long setup survey before first tangible value. For financial accuracy, require a workspace and at least the account required for the record before authoritative posting, but allow uncertainty/unknown opening to remain explicit.

### Exact screen contracts

#### Screen 0 — Demo (anonymous, public)
- **Title:** `Here's what CashNarra would understand.` **Fields:** none required, optional two-choice clarifying example. **CTA:** `Create my account` → `/auth?mode=signup`. **Secondary:** `Try another example` / `Reset example`.
- **Validation:** cannot save a demo record to real accounts; all amounts and names tagged `Example`. **No network:** deterministic sample still renders. **Back:** back to marketing hero. **Mobile:** one screen flow with vertically linked rows. **Success:** fictional review completion only.

#### Screen 1 — Create account
- **Title:** `Start your money records.` **Support:** `Create an account to keep the records you confirm.` **Fields:** email (required); password (required, at least current backend validated length, support password manager and paste); processing notice acknowledgement only where there is an appropriate lawful purpose. Show password toggle; password rules live near field.
- **CTA:** `Create account`. **Secondary:** `I already have an account` → signin. **Validation:** email format, password guidance, duplicate/recovery flow without account enumeration. **Loading:** `Creating your account…`, locked submit, preserve input. **Error:** `We couldn't create your account. Check your connection and try again.` with specific safe underlying details when available. **Verification:** `Check your email to finish setting up` and `Resend email` subject to rate limits; show address and recovery option. No promise of delivery when SMTP is unconfigured.
- **Mobile:** 360–440px centred form width, full-width button; optional illustration removed before content. **Security:** no real record persisted before authentication; no password stored in analytics.

#### Screen 2 — First workspace
- **Title:** `Which money are you recording?` **Select:** `Business money` / `Personal money` (required). **Name:** `What should we call this space?` (optional; e.g. `My shop`, `Personal`). **CTA:** `Continue to my first record`. **Secondary:** `Back`.
- **Validation:** enforce permitted workspace types and naming rules in existing server API. **Loading:** creating once with stable request identity. **Error:** recover original request rather than duplicate workspace. **Mobile:** 2 sizeable choice rows, examples in helper text. **Returning account:** if workspace exists, skip; never create a duplicate automatically.

#### Screen 3 — Narrate first event
- **Title:** `What happened with your money?` **Label:** `Describe it in your own words`. **Placeholder:** `I sold 900 cedis in cash and paid 80 for delivery.` **Support:** `Include more than one thing if you like. You can check everything before saving.` **CTA:** `Review what I said`. **Secondary:** `Add manually`, `Save a private draft` (only if user explicitly opts into device persistence), `Choose another date`.
- **Validation:** no empty request, 12,000-character limit per current API; exact date shown when not today. If AI is gated/unavailable, say `Automatic understanding isn't available here yet. Add a record manually.` Avoid leading a real user to a disabled mock for arbitrary text.
- **Loading:** `Finding the money events…`; keep draft text visible and editable until request begins; processing cancellation/restoration explain actual guarantees. **Offline:** `Saved on this device only` if opted in, else advise copying draft. **Mobile:** textarea high in first viewport and review action accessible above bottom navigation.

#### Screen 4 — Clarify, when necessary
- **Title:** `Just one detail before you review.` **Question:** `Was the GH₵80 delivery paid from Cash or MoMo?` **Options:** `Cash`, `MoMo`, `Another account`, or `I'm not sure` where an unresolved draft can remain safely unposted. **CTA:** answer selection continues directly to review; no full transaction form for a simple option. **Secondary:** `Edit the whole record`, `Back to my words`.
- **Validation:** domain rules decide which field matters; do not treat model-generated confidence percentages as calibrated probabilities. After answer, regenerate/revalidate the affected event without changing unrelated events. **Error:** keep previous selection and explain next step. **Keyboard:** grouped radio/choice buttons and visible focus.

#### Screen 5 — Review/save
- **Title:** `Review the 3 records we found.` **Rows:** classification, account, amount, date, party (when applicable); one edit affordance per event; inline different label for non-cash credit/debt; original words as expandable evidence. **Summary:** `3 records ready · 0 questions left`; totals by money in/out are informational, not substitutes for individual review. **CTA:** `Save 3 records`. **Secondary:** `Add a record`, `Change my words`, `Discard draft` with confirmation when significant.
- **Validation:** server remains authoritative for IDs, opening balances, debt references, balanced posting and duplicate warnings. **Loading:** `Saving all 3 records…`. **Unknown outcome:** `We couldn't confirm the save. We'll check the original request before trying again.` Preserve original request key. **Rejected:** show server reason and keep draft intact. **Success:** only after receipt.

#### Screen 6 — First success
- **Title:** `Your first story is recorded.` **Support:** `3 records saved in [workspace]. Here's how they changed your recorded money.` Show receipt confirmation, net movement **only when fully supported**, event list, and attribution. **CTA:** `See my Money Story`. **Secondary:** `Record something else`, `Check my accounts`. One restrained animated connector, no confetti for recorded financial loss or borrowing. **Returning users:** normal Today screen, not repeated walkthrough.

### Interrupted/returning states

- **Only explored demo:** anonymous session does not claim financial progress; signup starts empty and explains that the demo used fictional data.
- **Registered, unverified:** verification state and resend recovery, no unexplained dashboard bounce.
- **Verified, no workspace:** resume workspace chooser; no “empty banking dashboard”.
- **Workspace created, no accounts:** show `Ready for your first money story` and offer narration first; add the needed account just before save. Unknown opening stays unknown.
- **Partway through story:** if device storage opted in, restore subject to owner/workspace identity; otherwise browser/session and explicitly available copy/export recovery only. Do not promise drafts survive an arbitrary browser eviction.
- **Started a batch, save status unclear:** preserve idempotency key, query authoritative receipt before retry; no duplicate posting. Existing implementation's `pending`/`recover` handling must be retained.
- **Returning inactive user:** `Welcome back. Start with any day you remember.` Do not shame or count missing days as zero activity.

## 10. Authenticated application redesign

### Today — a task-focused home

**Desktop layout contract:** max width 1180. Header row workspace/name left and action/privacy right. **Primary region** 8/12 columns uses one real editable `<textarea>` composer (or autosizing textarea) with date chip and sample text under field; **support rail** 4/12 columns shows a compact selected-period status and `Your Money Story` preview. Recorded balance is a 1-line anchored summary **below** the composer header or a compact line in rail, not a large preamble. Recent activity follows primary area; goal progress appears only when one is set; attention items appear near composer if there is a draft or clarification.

**Mobile order:** header with workspace/menu → short `What happened with your money?` heading → composer → `Review what I said` primary → 2 concise metrics (received/paid) with period labels → needs-attention block (if any) → recent records → Money Story preview → optional goal/check-in. Ensure composer top begins within early viewport, before secondary figures. No sticky keyboard-obscuring save CTA.

**First-time state:** `Start with anything you remember—a sale, payment or expense.` One example chip; do not show meaningless GH₵0.00 as proof of no activity. **Active:** `Pick up where you left off` if draft present. **Missing information:** show `1 detail needs your answer` link into review; not frightening “overdue” banners. **Checked-in rest:** `You marked today as quiet` with `Add something after all` link. **Returning:** date chooser defaults to current local date but can be changed intentionally.

**P0 financial representation safeguard:** recorded balance cannot be labelled `available`, `verified`, or `safe to spend` without external confirmation. Unknown opening is a first-class state.

### Narration and review — signature workflow

1. Input as natural text with supporting example chip(s), direct date selection and `Add manually` alternative. Avoid turning first action into a new screen unless this meaningfully helps keyboard/voice use.
2. Processing feedback uses an honest stage label: `Reading your story…` and then `Checking the proposed records…`. Do not show synthetic percentage progression or count before validated result exists.
3. Clarification questions appear as **single-purpose choice rows**, not separate full-form panels. Account ambiguity offers registered Cash/MoMo/Bank choices; debt ambiguity offers `New sale` versus `Payment of an existing balance` only if those are financially valid options. Any complicated split still offers an advanced editor.
4. Reviewed results are clear groups: money received, money paid, things still owed, internal movements. Do not add all positive-looking amounts into income. Rows show source excerpt on hover/tap expand; inline pencil/edit accessible via button, while row opens detail. Display full count and global state `Not saved yet` above action.
5. Save bar contains one primary `Save [n] records`, one quiet `Edit story`. Save operation kept exactly as existing. Error/unknown-outcome recovery is a separate important state, not a generic toast. After receipt, move to a compact first result and suggestions such as `See Money Story`.
6. Natural corrections initially stay behind existing single-record correction path; if arbitrary conversational corrections are not tested, label them as limited, not live general chat. Preserve every prior event and its source for the permitted retention window.
7. **Explicit test cases:** loan proceeds never sales, cash→MoMo movement excluded from spent, customer pays prior debt not new sale, owner withdrawal distinct from expense, partial debt settlement adjusts balance once, stock doesn't generate unsupported profit, duplicate or uncertain batch remains intact under retry.

**Differentiating interaction:** a faint 3-step source/record/result connector appears only once during a flow, with precise review status and linked explanation. This is more defensible than a chatbot typing effect or indiscriminate “AI thinking” animation.

### Records — scanning, traceability, debt

- Top header: `Records`, supporting `Search and correct what you've saved.` Right/next row: `Add record` (quiet or secondary; primary action remains story capture in global nav). Search occupies about 55–60% of toolbar; filters `All`, `Money in`, `Money out`, `Still owed`, `Transfers`, `More` on desktop. Mobile: search full width, chips horizontally scroll with visible overflow cue, filter drawer for account/date/type.
- Each transaction: 40px icon area (type semantic, non-colour label); 15px description, second line `Credit sale · Kojo · Cash not received` or `Business expense · DeeJay Cash`, right tabular 15px amount and date 12.5px; 68–80px row depending density; text wraps at 2 lines for long descriptions, full detail on open. Currency GH₵ on all amount displays where space allows; no clipped cents.
- Group by actual transaction date; compare with Africa/Accra date `today`, `yesterday` and future dates. Headings `Today · Mon 19 Oct` and `Tomorrow · Tue 20 Oct` only when that resolves correctly at runtime; never display static Today because the sample was created today. Explicit `Date recorded` in details if it differs.
- Credit event **value** gets an `Unpaid/Receivable` semantics label, not money-in arrow. Account movements and debit/credit links are in detail. Opening balances absent from ordinary transaction list, available in a distinct `Opening balances` entry.
- Debt section must be navigable independently via an in-view `People & balances` tab/section; each person has amount owed, direction, due date if known, `Record payment` and source link. No assumed default due date.
- Corrections: a record detail bottom bar `Correct`, `Remove duplicate` (appropriately reversible), `See change history`. For settled-linked obligations, explain blocked action and available coordinated correction flow; do not silently orphan payments.
- Empty state differentiated: no records ever, no results for query, no records in date period, and connection unavailable. No recorded entry does not mean no money activity.

### Accounts — meaningful density and account types

- Header `Your recorded accounts` and subheading `Based on what you've entered—not connected to your bank or MoMo.` Aggregate recorded balance may be unknown: show `Some balances are unknown` and known-account subtotal if mathematically appropriate, never fill missing accounts with zero.
- Compact account rows/cards with icons: wallet-like for cash, phone for MoMo, landmark for bank, with visible textual type; name, amount, `Last entry`, status `Opening unknown` or `Opening recorded`, action `View transactions` → account-filtered Records. Sort by use/favourite, not alphabetical if usage data is available and deliberate.
- Desktop 2-column compact grid or full-width ordered list (test task speed), mobile single rows. The manual account opening correction is in account details with reason and change history, not a same-looking giant CTA in every card.
- Account creation: name, type Cash/Bank/MoMo, currency GHS for now, first tracked date, optional opening `Known amount` or `I don't know yet` (explicit radio); do not silently use zero. Example copy `Enter what you knew was in this account when you began recording—or leave it unknown.`

### Money Stories — numbers first, explanation second

**First viewport:** period (Day/Week/Month) + date; title `Your money story for [period]`; 3 equally legible figures: `Money received`, `Money paid out`, `Net movement`. A modest signed indicator shows deficit without casting shame. Underneath: `Based on X saved records. Unrecorded activity may be missing.` From screenshot period: GH₵8,000 received; GH₵14,820 paid; **−GH₵6,820 net movement**, explicitly not profit. These are illustrative user-provided screenshot numbers, not audited external balances.

**Next:** a short, rules-driven plain-language explanation `More money went out than came in during this recorded period. The biggest recorded outgoing amounts were VAT and money taken home.` Include only if top events are programmatically supported by actual selected period data. Each mentioned event navigates to a filtered source record; no LLM-invented reasons. Separate clearly: `Sales recorded` vs `Money received` (incl. debt settlement/loans/owner money where relevant). Add `People owe you / You owe` snapshot if reliable.

**Chart decision:** an aligned paired horizontal bar with shared scale and labelled GH₵ values can quickly show received vs paid. Do **not** use a pie for inflow/outflow, present sign-agnostic area without labels, or chart a handful of records with fake trends. For month comparisons, add a small table first; only show time series after sufficient actual dates and missing-day qualifiers. Provide accessible data table for all charts.

**Evidence disclosure:** `How these numbers were worked out` expands records, date basis, exclusions, opening balances, unknowns and version. `Profit not available` remains visible as one clear sentence when cost-of-sales information is absent. `Ask Nara to explain` appears only if live AI explanation is configured and evaluated; deterministic explanation fallback first.

### Goals and planning — motivating without false certainty

- Goal creation step 1: `What are you working towards?` name; target amount GHS; optional target date only if supported by validated code. Step 2: `Have you already set money aside?` optional actual allocation, choose account; explain earmarking does not reserve/move money. Final `Create goal`; no fake bank transfer.
- Goal overview: name, target, assigned amount and numeric percentage, amount remaining, one `Assign money` main CTA. Show `Pace estimate not ready` inline if fewer than three fully reviewed months (or other actual logic). `Try a monthly amount` opens one focused assumption input and updates scenario instantly in **deterministic** code; no arbitrary “confidence” badges.
- The review-month procedure is a short progressive dialog: picker first, 2–3 concrete confirmation criteria second, final submit third; full explanation under `How this affects the estimate`. Respect months with zero assignments versus unchecked months.
- Separate `Your actual contributions` from `What if you added ...` with a visually distinct soft surface, **never** combine scenario results with assigned balances or post scenario amount as expense.
- When a date can be estimated, label `If you assign GH₵600 each month, the goal could be reached around [month]` and show the specific assumptions; never say `You can afford it`. Multiple goals cannot count the same contribution capacity twice. Interest/fees/price changes excluded unless modelled.
- If records insufficient, show one constructive next action: `Review past months` or `Try a monthly amount`; avoid a three-paragraph diagnostic lecture.

### Settings and authentication

- Group sections according to job: `Appearance`, `Screen privacy`, `Recording & drafts`, `Review rhythm`, `Your data`, `Account`. Hide amounts **screen masking only**, with unambiguous toggle state; shared-device mode describes local draft clearing and asks before losing unsaved data. Device state persists only if intended and safe.
- Retention controls: time selector + `Remove original words now` as a **separate reviewed action**; don't conflating 0 days setting and instant delete without clarity. Explain saved accounting facts and corrections have separate retention/legal basis. Show request statuses `Pending review`, `Processed`, `Unable to proceed` accurately, not imaginary completion.
- Auth screens: switch mode with links not a distracting array of equivalent buttons; proper `<form>`, field descriptions/errors and a single dominant action. Keep all actual Supabase access and recovery semantics. Add a password show toggle with accessible state; not a local-only cosmetic mock.
- Privacy notice copy needs precise operational truth: in a development build with no staffed operator, never suggest a staffed customer-support response or live deletion guarantee. External-launch readiness is a separate gate, not a job for frontend cosmetics.

### Ethical retention and habit mechanics

**Allowed mechanisms:** a forgiving `Checked this day` indicator, optional catch-up, a visible `You have a draft` cue, a clearly linked `See what you learned this week`, small stable milestones like `Your first Money Story is ready`. **Avoid:** spending-based points, negative-movement badges framed as failure, coercive streaks, daily guilt, loan celebration, public leaderboards and forced sound. User benefit is **reliable memory and usable results**; possible harm is falsely believing checked-in days prove complete financial records. Evaluate with short diary studies and follow-up interviews, not only return-frequency events.

## 11. Ready-to-use UX copy replacement library

Copy below is implementation-ready. `Existing` cites current committed code or a supplied screenshot; when the proposed UI state does not yet exist, it is marked **NEW**. All environmental statements must be feature-flag driven before release.

| Area | Existing copy | Proposed copy | Why / intended effect |
|---|---|---|---|
| Landing headline | `Your money. In your words.` | **`Tell us what happened with your money. We'll help you make sense of it.`** | Distinguish user input and outcome, not only brand poetry |
| Landing support | `Tell CashNarra what happened with your money. Review the records. See what the numbers mean.` | `Describe a sale, expense or payment in your own words. Check the records CashNarra finds, save them, and see the numbers clearly.` | Concreteness and review responsibility |
| Landing demo CTA | `Try the synthetic demo` | `Try a sample money story` | Natural public label; fictional disclosure below; browser-only destination |
| Landing secondary CTA | `Start my records` | `Create my account` | Honest next page destination |
| Landing trust caption | `Demo uses fictional Ama Works data. No real AI calls or money movement.` | `Fictional example. No account needed. Nothing is saved.` | Concise, accurate for redesigned public client demo |
| Landing feature headline | `Serious money. Light interaction.` | `From your words to records you can review.` | Replace abstract brand doctrine with process demonstration |
| Landing goal heading | `See what it could take.` | `Give your money a goal, without guessing.` | Outcome clarity; avoid promise of accurate affordability |
| Registration heading (screen) | `Create your account.` | `Start your money records.` | Links signup to user benefit |
| Registration helper | `An email you can open, and a password of at least 8 characters. Then you are in.` | `Use an email you can access. You'll review every money record before it's saved.` | Improves relevance; precise minimum rule near field |
| Signup CTA | `Create account` | `Create account` | **KEEP**; explicit, conventional action |
| Verification (NEW) | `Check your email to confirm your account.` | `Check your email to finish setting up. You can continue after verification.` | Clear next step; no premature save claim |
| Signin headline (screenshot) | `Sign in.` | `Welcome back.` | Warmer but still direct; form title can remain `Sign in` for assistive semantics |
| Signin helper (screenshot) | `The email and password you chose.` | `Sign in to continue your money records.` | Purposeful copy, no redundant explanation |
| Workspace choice (NEW) | — | `Which money are you recording?` | User understands personal vs business without jargon |
| Workspace opening help | `Choose personal or business. Account openings can stay unknown.` | `Give this space a name. You can add the account details when you record something.` | Better first-use sequence; unknown state remains in account form |
| Today page heading | `Let’s make sense of your money.` | `What happened with your money?` | Brings signature action first |
| Today supporting line | `Start with the day you remember.` | `Tell CashNarra in your own words. Several things can go in one story.` | Immediate task instruction |
| Today composer heading | `What happened with your money today?` | `Tell your money story` | When title already asks same question, avoid duplication |
| Composer placeholder | `“I sold 900 cash, paid for delivery, and Abena paid part of her balance…”` | `I sold 900 cedis in cash and paid 80 for delivery…` | More complete reusable example; account ambiguity clarified as needed |
| Composer primary | `Tell your story` | `Review what I said` | For a real inline input, describes the next step; disabled until nonempty |
| Composer helper | `You review the records before they’re saved.` | `Nothing goes into your records until you check and save it.` | Concrete assurance |
| Voice CTA (gated) | `Voice` | `Voice (not ready)` or hide primary affordance | Avoid feature promise mismatch; if recording-only, label accurately |
| Capture heading | `Tell it as it happened.` | `Tell your story` | Cleaner, fits app navigation |
| Processing | `Waiting for processing…` | `Reading your story…` | Human-readable stage; second stage `Checking proposed records…` |
| Clarification heading | `Just one detail.` | `One detail to check` | Not always just one; dynamic count when >1 |
| Clarification option (NEW) | Full-editor button `Add the missing detail` | `Which account paid the GH₵80 delivery?` `[Cash] [MoMo] [Other]` | Fast, answer-specific correction |
| Review heading | `Your story, organised.` | `Review the 3 records we found` | Gives count and next job |
| Review status | `3 proposed records · not saved yet` | `3 records ready · Not saved yet` | Preserve authoritative distinction in simpler words |
| Review save | `Save reviewed 3 records` | `Save 3 records` | Short and actionable; header already establishes review |
| Saving | `Saving` | `Saving all 3 records…` | Clear atomic batch action |
| Save unknown | `Save not confirmed. Check the original request before retrying.` | `We couldn't confirm the save. Check the original request before trying again.` | Explain recovery path; preserve request |
| Success | `Saved · original action receipt confirmed` | `Your 3 records are saved.` | Human outcome, only after receipt; receipt detail still accessible |
| Records title | `Every story has a paper trail.` | `Your records` | Better navigation scent for everyday work |
| Records subtitle | `Search, inspect and correct your saved records.` | `Find, review or correct a saved record.` | Shorter, action-focused |
| Records empty | `No matching records. Missing activity is not treated as zero.` | `No records match these filters. Try another date or clear the filters.` | Specific recovery; missing-data note in period context |
| Debt section | `Money still owed` | `People & balances` | Covers owed to/by user; contextual tabs `People owe you` / `You owe` |
| Accounts heading | `Your accounts` | `Your recorded accounts` | Reinforces manual data boundary |
| Accounts helper | `One recorded picture. Your money stays in your own accounts.` | `Balances based on what you've entered—not linked to your bank or MoMo.` | Immediately clarifies source |
| Unknown opening (NEW) | — | `Opening amount unknown` | Never render GH₵0.00 for unknown |
| Money Stories support | `The numbers, with their meaning.` | `Understand what your saved records show.` | Direct benefit without implying comprehensive finances |
| Story cover | `GH₵8,000.00 came in. Here’s the story.` | `Here’s what moved this period.` | Balanced treatment of received/paid/net, not one-sided receipts |
| Money Story net | `Recorded net movement was —GH₵6,820.00. It is money received minus money paid out.` | `Net movement: −GH₵6,820. Money paid out exceeded money received in these records.` | Lower reading cost and period specificity |
| Profit note | `Profit is unavailable. Cost of sales, inventory consumed and other necessary information are missing.` | `Profit isn't available from these records yet. We need cost-of-sales and other information to calculate it reliably.` | Preserve honest refusal with next-step explanation |
| Plan heading | `Give your story a direction.` | `Your goals` | Routine task title; reserve poetry for campaigns |
| Goal amount label | `Money added for this goal` / `Money assigned to this goal` | `Money you've set aside in CashNarra` | User-focused, but **always follow with** `This does not move or reserve money in your bank or MoMo.` |
| Goal insufficient history | `Not enough history to estimate yet` | `A pace estimate needs three reviewed full months.` | Explain exact model threshold if true; offer `Review past months` |
| Goal forecast (NEW) | — | `If you assign GH₵600 per month, you could reach this amount around [month].` | Conditional deterministic scenario, not a promise |
| Goal review dialog | `Review a completed month` + long guidance | `Review a month for this goal` + compact criteria + `Why this matters` | Put task before method |
| Settings heading | `Make it work for you.` | `Settings` | Familiar, searchable standard term |
| Masking note | `Keep amounts out of sight while you use the app.` | `Hide amounts on this screen. This is not encryption.` | Correct security model |
| Shared-device note | `Unfinished stories are not kept on this device.` | `Shared-device mode turns off stored drafts and clears local copies. Unsaved information may be lost.` | Explicit consequence; confirm before destructive effect |
| Retention label | `How long to keep your original words` | `Original story retention` | Short header plus `Your saved financial records remain separate.` |
| Data access CTA | `Request a copy of my data` | `Request my data` | Avoid implied automatic download; show pending status |
| Deletion CTA | `Request account-data deletion` | `Request account deletion review` | Truth about manual processing stage; confirm consequences |
| Demo limitation | `This local build has no staffed support service.` | For development only: `Data requests are recorded but are not handled by a support team in this development build.` | Don't market an inoperable support workflow as production-ready |
| Session recovery (NEW) | — | `You were signed out. Your saved records are safe. If you had an unfinished draft, check this device after signing in.` | Safe, conditional recovery; avoid guarantees that local drafts survive |

**Editorial rules:** use one stable term per concept (`Recorded balance`, `Money received`, `Money paid out`, `Sales value`, `Net movement`, `People owe you`, `You owe`, `Assigned to goal`, `Scenario`). Avoid `available balance`, `profit` when unsupported, `verified` for manual accounts, `Nara has moved your money`, `AI guarantee`, `fully complete records`, `safe to spend` or `automatic bank syncing`. Be conversational without pretending Nara is a human accountant. Reserve creative language for marketing headings and a single Money Story reveal, not button labels or validation messages.

## 12. Responsive, accessibility and performance specification

### Responsive targets and exact behaviour

| Viewport | Layout contract | Test-specific risk |
|---|---|---|
| 320px | 16px gutters, single-column composer, 44–48px tap targets, no currency clipping, bottom nav with concise labels | Large GH₵ amount, long description, expanded on-screen keyboard, reduced motion |
| 360px | 20px gutters, primary CTA full width, settings controls stack, filter chips scroll intentionally | Keyboard plus sticky navigation collision |
| 390px | Composer + 2 compact metrics without horizontal overflow; 4-item mobile nav | Modal bottom button and full account name |
| 760–959px | No 3-column ledger cards; mobile/tablet layout based on component fit | Intermediate widths before desktop sidebar; content order |
| 960–1149px | Fixed navigation/sidebar if fit; Today 7/5 or stacked depending content width | Three account cards and long amounts |
| ≥1150px | 224px sidebar, 1180px maximum content, 8/4 primary/secondary content | Avoid 500px-wide empty report paragraphs, keep 60–85 character reading lines |

**Mobile navigation:** keep 4 primary entries Today, Records, Stories, Plan; access Accounts and Settings from labelled Workspace/Menu control. `Stories` abbreviation on mobile is acceptable if `Money Stories` appears in page title. Provide non-colour active indicator, visible focus and keyboard return. Add a `Record` central action only if tested to improve discoverability and it does not create five cramped tabs. Don't hide a core action behind a hamburger when it's repeatedly used.

**Scrollable dialogs:** maximum width 560px and max-height `min(90dvh,...)`; overflow body, persistent accessible title and footer, focus trapped by native `<dialog>`, Esc close, focus restored to invoking control. Avoid nested independently scrolling internal areas when not needed. Ensure an open keyboard does not hide confirmation buttons; test `100dvh` and viewport changes.

**Accessibility:** WCAG 2.2 AA design target, not compliance claim. Validate contrast text at >=4.5:1 normal and >=3:1 large text, non-text contrast at >=3:1 where criterion applies, semantic grouping of figures, programmatic labels, `<fieldset>` for account choice, focus-visible 3px, no hover-only explanation, screen-reader announcements of extracted count/save status, accessible error summary+inline guidance where multiple fields fail, icon-only buttons with purpose labels, reduced motion, 200–400% zoom and reflow. WCAG 2.2 AA pointer targets are >=24x24 CSS pixels subject to exceptions; 44px controls are a more comfortable CashNarra design preference.

**Financial accessibility:** read `minus six thousand eight hundred and twenty Ghana cedis` appropriately; use typographic minus `−`, account for codepoint GH₵ in font/exports, distinct textual direction for positive and negative, data table alternatives to bars/charts, no masked amount leaked in `aria-label`, hover title, export preview or low-visibility text. Announce a goal scenario separately from actual money assigned.

**Real performance plan:** measure web.dev field CWV 75th percentile LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 in actual pilot traffic; collect synthetic Lighthouse/PageSpeed checks in CI as regression clues, not substitutes for field data. Device protocol: midrange Android phone with throttled 4G/3G and CPU slowdown, 320/360/390/768/1440 viewports, warm and cold navigation, offline/poor network, 500-row record sets. Track client bundle sizes by route, dynamic load of export libraries, font network payload, repeated client report calculations and hydration cost of `cashnarra.tsx`.

**Technical directions:** retain CSS Modules; extract smaller React components; avoid adding chart, animation, UI-framework or state-machine dependencies unless proven necessary. Use local Inter WOFF2; verify the Manrope TTF loading cost and conversion/subsetting while retaining licence. Public demo must be static/client-only and resilient without its animation; lazy-load any optional media. Avoid reading entire ledger into every row if profiling shows heavy re-renders. No financial narration in analytics, error logs, browser performance labels or demo telemetry.

## 13. Privacy-conscious conversion and activation measurement

### Minimal architecture

Instrument a short first-party, consent-aware event layer within the existing Next.js application, activated only when the deployment has a defined privacy policy/retention strategy. Use in-memory batching or one narrowly scoped endpoint as necessary; if no safe operational collection exists yet, start with **manual usability observation plus aggregated server counters**. No paid analytics SaaS is required to start. Never emit raw narration, accounts, names, amounts, creditor labels, email, IP-derived profile or passwords as event properties.

| Event | Exact trigger | Safe properties | Why |
|---|---|---|---|
| `landing_view` | Landing hydrated/visible (avoid double count) | version, device_bucket, campaign_coarse | Funnel starting point |
| `landing_demo_started` | User intentionally opens/uses demo | demo_variant, ui_version | Comprehension interest |
| `landing_demo_completed` | User views fictional interpreted result | demo_variant, has_clarification_boolean | Demo completion |
| `landing_cta_clicked` | Click on named CTA | cta_id, page_section | Intent path; no user-specific content |
| `signup_started` | Entered auth signup mode | entry_source | Signup initiation |
| `signup_completed` | Server confirms account created | mode, success_boolean | Auth completion; no email |
| `verification_completed` | Valid verified callback | auth_method | Necessary activation step |
| `workspace_created` | Authoritative receipt | workspace_type | Initial setup |
| `narration_started` | Composer first focused/edited; once per task | input_mode=`text`, environment | Capturing intent; **not** contents |
| `interpretation_requested` | Submitted valid input | ui_version, sample_boolean | Task step |
| `interpretation_completed` | Validated response displayed | proposed_count_bucket, questions_count_bucket | Workflow health; no amounts |
| `clarification_abandoned` | Explicit cancel/navigation with unsolved question | question_field_class, step | Friction without content |
| `review_opened` | Review visible | count_bucket | High-value step |
| `batch_saved` | Only after authoritative receipt | event_count_bucket, duration_bucket, first_saved_boolean | **Core activation numerator** |
| `batch_save_unknown` | Network response missing authoritative outcome | retry_required_boolean | Reliability guardrail |
| `money_story_viewed` | Meaningful story summary visible | period_type, first_story_boolean | Value realised |
| `record_correction_completed` | Authoritative correction receipt | correction_kind | Learnability; no original text |
| `goal_created` | Authoritative goal receipt | none | Optional deeper adoption |
| `return_visit` | Active authenticated new session/day | cohort_week_bucket | Useful repeat use, not compulsive streak |
| `error_boundary_seen` | Safe error class shown | error_code_class, route | Engineering failures |

Define a consent/notice event policy, first-party retention period, access controls, event schema version and deletion process. Anonymous funnel data should use aggregate counters or ephemeral identifiers; if linking anonymous demo→signup, obtain an appropriate permission/basis and avoid persistent user fingerprinting. Form completion without verification is not the same as activated saved records.

### Primary success metrics and guardrails

- **Primary activation:** percentage of newly verified users who create their first correctly confirmed saved batch and visit its record-backed result within a defined observation window (evaluate 1 day and 7 days separately). Denominator carefully defined; always report counts and missing data.
- **Time to value:** start first narration → first authoritative saved receipt → first Money Story displayed; median and task failure distribution for observed pilot.
- **Clarification burden:** material questions per successfully saved event, with financial correctness tests as *non-negotiable guardrail*. Fewer questions is not a win if the system guesses wrong.
- **Correction efficiency:** time and steps from detecting misclassification to accurately corrected records, including linked obligations.
- **Truthfulness guardrail:** no double-post, misleading verified-balance claim, profit fabrication, wrong owner-money classification or untraceable event; any severe semantic regression blocks rollout.
- **Return usage:** users voluntarily recording another meaningful session, not merely checking in for a streak.

### Experiments, chosen for realistic development traffic

1. **Hero headline:** A outcome-led vs `A lot happened today. One story can record it.` HYP improved initial comprehension. Primary: unprompted correct explanation of product in 10 seconds (qualitative first), later demo-start rate. Guardrail: unsupported capability expectations. Small sample: 5–8 representative people per concept before quantitative test. Decision: choose more accurate comprehension rather than click-only winner.
2. **Public demo:** static screenshot vs click-through three-event example. HYP interactive sample reduces misunderstanding. Primary: can person accurately distinguish old debt payment from new sales? Guardrail: task completion and page speed. If traffic small, moderated tests with 8–12 people rather than p-hacked A/B.
3. **CTA:** `Try a sample story` vs `See an example`. HYP first suggests active participation. Metric: actually completed fictional review, not click. Guardrail: error/feature misinterpretation.
4. **Signup ordering:** demo→signup vs straight signup. HYP lower unproductive signup friction. Primary: qualified first-save activation per landing visitor. Guardrail: identity/security/completion drop-off. Quantitative only with plausible sufficient traffic and predeclared window.
5. **First narration:** inline Today composer vs separate capture page. HYP inline capture reduces uncertainty. Primary: correctly completed first batch and median time. Guardrail: accidental entry, draft loss and accessibility.
6. **Clarification:** inline account choice vs full RecordForm. HYP fewer steps at same correctness. Primary: right answer and completion time, guardrail: no incorrectly posted events, focus/keyboard success.

**Interpretation:** Don't declare a winner based on low-volume click counts. Document recruitment bias, business/personal participant mix, familiarity with MoMo, network/device environment, first-use vs returning status and variations in story complexity. Never invent uplift percentages.

## 14. Prioritised implementation backlog — evidence to acceptance

**Priority:** P0 = actual safety/integrity/security blocker; P1 = core conversion or usability blocker; P2 = important comprehension, accessibility, performance and quality; P3 = polish. **Do not infer P0 solely from appearance.** No independently demonstrated new P0 security exploit was found in this screenshot/code audit. **Effort** is relative S/M/L for an existing small application; estimates must be recalibrated after reconciliation with Cursor's actual worktree. **Impact** is a hypothesis for user outcomes, not measured uplift.

### Main traceability matrix

| ID | Priority / category | Observed or verified evidence | User consequence | Recommended implementation / actual code | Effort | Impact hypothesis | Acceptance / validation |
|---|---|---|---|---|---|---|---|
| **CN-001** | P1 Workflow protection | OBS auth and landing substantially different from CODE `src/app/auth/page.tsx`, `src/app/page.tsx` | Cursor edits stale layout and loses newer local work | `git status`, diff local HEAD, screenshot comparison; freeze screenshot baseline and establish work branch; no destructive reset | S | Protect work | Exact local branch/HEAD/modified files documented; approved file map before UI edits |
| **CN-002** | P1 Conversion | CODE public CTA POSTs `/api/demo`; CODE route rejects `process.env.VERCEL` | Intended production visitor gets error | `src/app/page.tsx`, new `src/components/landing/sample-demo.tsx` and scoped CSS; deterministic client-only demo; keep `/api/demo` locked | M | More truthful proof, fewer blocked clicks | Demo runs in production build without auth/API/db; no real storage; keyboard path; CTA never 403 |
| **CN-003** | P1 Conversion/Copy | OBS marketing lengthy, repetitive; CODE short landing at HEAD | Value not demonstrated promptly | Build ordered marketing sections around interactive before/after example and concise trust copy; remove repeated sections if low value | L | Better first-visit comprehension | In 10-second observed test participants identify what app does; mobile first viewport presents demo/CTA |
| **CN-004** | P1 UX | CODE Today composer display is clickable `button` (`.capture`) not editable input; OBS looks like input | User may attempt to type but navigates | Replace Today launcher with real textarea or transparent CTA semantics; wire to existing `text`/`changeDraft`; retain draft locking | M | First narration easier | Type directly; draft persists according to existing preference; no duplicated posting; works at 320–1440 |
| **CN-005** | P1 UX/AI | CODE `questions.map()` opens full `manual()` editor for simple account ambiguity | Excess steps; abandonment | Inline field-specific one-tap answers; revalidate event; full edit remains optional; `cashnarra.tsx`, new `ClarificationChoice` | M | Lower clarification burden | Cash/MoMo question resolved by one choice; event unchanged except selected field; save only if all material questions resolved |
| **CN-006** | P1 Onboarding | OBS signup heavy split design; CODE distinct single-form auth source | Purpose/destination unclear, mismatch | Auth form single primary action; specific sign-up/sign-in links; post-auth first workspace/narration path; preserve auth/session logic | M | Fewer first-use dead ends | Existing signup, verification, recovery and signout tests still pass; unverified state explicit |
| **CN-007** | P1 Trust/Copy | CODE voice button offered while `voiceEnabled` may be false | Users expect voice-to-record action when gated | Hide/qualify prominent voice action by truthful runtime state; recording-only function accurately labelled | S | Fewer false expectations | No unconditional `Voice` CTA claiming transcript; text fallback always available |
| **CN-008** | P2 UI/Accessibility | CODE body 14px, row 13/11px | Dense hard-to-scan records | tokens/global CSS/row typography: body 16/24, primary row 15/22, meta 13/20, responsive checks | S | Better readability | No truncation/clipping at 320/200% zoom, contrast passes selected roles |
| **CN-009** | P2 Design/Architecture | CODE 2,550-line `cashnarra.tsx` monolith | Inconsistent, risky visual changes | Extract `AppShell`, Today, Records, Stories, Accounts, Goals, Settings, dialogs behind stable operations | L staged | Faster safe iteration | No ledger/API semantics copied; tests pass after each extraction |
| **CN-010** | P2 Records UX | OBS long transaction rows and tiny labels; CODE single generic `RecordRow` | Type/account/direction not quickly recognized | Row label hierarchy, credit vs cash indicator, date groups, filters; `ui.tsx`, `cashnarra.tsx` and CSS | M | Faster record recognition | 10-record locate/correct task, 320 mobile no horizontal scroll; credit sale not counted cash |
| **CN-011** | P2 Records/Trust | OBS `Today` and explicit dated sections; CODE flat rows; UTC default | Confusion about selected period and future records | Standard date group component based on `event.date` + workspace tz; explicit created timestamp in detail | M | Better chronology comprehension | 19/20 Oct fixtures and time-zone boundary tests; no static `Today` mismatch |
| **CN-012** | P2 Accounts UI | CODE all account types use `Landmark`; OBS oversized cards | Cash, MoMo and Bank indistinguishable, space wasted | Type-specific icon/text, compact list/card, unknown opening status and filtered drilldown | M | Faster account recognition | 3 account types identifiable without colour, recorded/unknown semantics preserved |
| **CN-013** | P2 Money Stories | OBS dark header then text-heavy numbered chapters; CODE similar `storyCover`, `.chapter` | Poor period comprehension | Three-metric first-view summary, comparative bars/table, one rules-supported insight and evidence links | L | Faster financial understanding | 8,000–14,820 = −6,820 visibly correct; no fabricated profit; all values traceable |
| **CN-014** | P2 Goals | OBS full-height review-month modal; CODE long instructions before month field | Needed action buried | Focused goal-month form, disclosure for methodology, sticky safe footer where necessary | M | Less review friction | Select/review completed month in short focused flow; incomplete month not auto-reviewed |
| **CN-015** | P2 Goals/Trust | OBS goal side explanation competes with progress | Slow path to assigned/remaining/pace | One progress card and explicit unknown-history/scenario states; retain `forecast()` and actual allocations | M | Better goal comprehension | GH₵5,800/100,000 = 5.8%; remaining 94,200; what-if never posts |
| **CN-016** | P2 Settings/Privacy | OBS many equal rows and privacy action cluster | Hard to discover/review consequences | Group settings; labelled subsections; confirmation for destructive device/retention actions, request status | M | Better trust/control | No local draft cleared without consequence explained; deletion request never says completed automatically |
| **CN-017** | P2 Design System | CODE UI Button limited variants, CSS repeated patterns | Inconsistent task prominence | Extend `ui.tsx` typed variants, sizes, loading, icon affordance, accessible status; consume tokens | M | More coherent UI | All interactive controls have focus/disabled/loading/no fake click; no new framework |
| **CN-018** | P2 Accessibility | Screenshot desktop only; CODE responsive media queries/ARIA foundations | Mobile/accessibility may contain unseen failures | Test 320,360,390,768,1024,1440 at keyboard/zoom/AT; correct actual failures | M | Reduce exclusion | WCAG 2.2 AA checklist evidence; no claim of compliance until manual screen reader tests |
| **CN-019** | P2 UX/Quality | CODE status and save recovery exist but diverse copy | Users may misunderstand unclear save | Consistent status badges and recovery copy; preserve `pending` ID and receipt lookup | S–M | More confident recovery | Simulated lost response recovers exact original batch, never double posts |
| **CN-020** | P2 Performance | CODE main app client component, font TTF, export modules lazy-loaded | Possible bundle/interaction cost | Measure, then split component and preload only critical font; retain dynamic export imports | M | Faster modest-phone interaction | Lighthouse/field baselines recorded; no invented speed gain; unchanged finance |
| **CN-021** | P2 Analytics | No verified public activation event implementation in current source review | No basis to choose winners | Minimal privacy-safe event contracts + manual research; avoid raw financial payloads | M | Better decisions | Event schema contains no amount, email, narration or person; save conversion receipt based |
| **CN-022** | P3 Brand polish | OBS icon weak at small sizes, repeated generic decorations | Weak recall | Optical refinement variants for paired mark; test thumbnail; retain current recognizable silhouette | M | More distinctive visual signature | 16/24/40px vector check, mono/reversed legible, user recall assessed |
| **CN-023** | P3 Motion | OBS static repetitive views; CODE existing reduced-motion rules | Missed opportunity to communicate state | 100–220ms purposeful source→record transitions; disable with reduced motion | S | Better perceived continuity | No delayed task, focus shift, counter animation or required audio |
| **CN-024** | P2 Metadata/SEO | CODE global metadata is basic only; landing differs from screenshots | Weak share previews and intent specificity | Metadata, Open Graph/social imagery only from approved real assets, accessible headings, structured safe canonical | S | Better credible discovery | SEO metadata accurately describes current capabilities; no fake ratings/claims |

### Detailed acceptance contracts — screens, responsive and safety

- **CN-002 Public demo:** (a) `/` has exactly one direct primary demo action; (b) title `Fictional example`; (c) events computed from fixed immutable fixture, not random financial data; (d) if account ambiguous, show choice before displaying qualified totals; (e) no `/api/demo`, `/api/understand`, Supabase, storage write or personal-data transfer while demoing; (f) accessible even if animations do not run; (g) test direct visit and browser back; (h) target mobile <=390 does not exceed viewport.
- **CN-004 Today composer:** (a) text input has associated label, 16px editing font; (b) preserving existing `text`/draft revisions and `pending` lock; (c) works after interrupted save; (d) editing and account-choice changes do not silently post; (e) keyboard focus is visible when bottom navigation present.
- **CN-005 Clarification:** (a) each question shows expected record context and valid choices; (b) selection updates one proposed field; (c) server/domain validation still runs; (d) no save while material questions unresolved; (e) `I'm not sure` retains draft not forced zero/default; (f) screen reader announces new ready-state.
- **CN-010 Records:** (a) every row has semantic date, amount and subtype; (b) due balance not described as cash received; (c) search finds people/description/amount in allowed workspace; (d) filters do not silently change another view; (e) record correction opens linked provenance and preserves audit; (f) row/amount wrapping at 320 and zoom.
- **CN-012 Accounts:** (a) Cash, Bank and MoMo icons with labels; (b) no `verified` badge; (c) known recorded zero versus unknown opening visually distinct; (d) total excludes unknown according to existing financial semantics; (e) account transaction drilldown correctly filters records.
- **CN-013 Money Stories:** (a) all 3 values derive from `report`, same selected period and workspace; (b) signed net mathematically verified; (c) old debt payments excluded from sales, transfers excluded from cashflow; (d) record-backed `how calculated`; (e) profit unavailable when domain says so; (f) no AI insight without supported source; (g) selected week/month dates consistent with all figures.
- **CN-014 Goals:** (a) one month picker visible without inner scroll on standard laptop and 390 mobile; (b) only completed months selected; (c) review indication describes the deliberate user action, not guaranteed data completeness; (d) zero contributions and unchecked months distinguished; (e) focus restored after dismissal, Escape works, checked state preserved on validation failure.
- **CN-016 Privacy:** (a) signed-in user understands screen masking versus data encryption; (b) local draft removal warns of effect; (c) retention setting and remove-now action have distinct language; (d) data requests show persisted state, not “deleted”; (e) no unstaffed promise; (f) destructive controls keyboard accessible.
- **CN-017 Design system:** (a) semantic tokens for app wide light/dark; (b) no font file copied from unrelated sources; (c) any extended Button API preserves existing callers; (d) consistent variants/roles in one place; (e) disabled and busy status encoded `disabled`/`aria-busy` as appropriate; (f) no colour-only financial meaning.

**P0 guardrails for all tasks:** cross-workspace disclosure; unauthorized mutations; incorrect authoritative totals; double posting; destructive untraceable correction; fake payment claims; LLM-determined official totals. If any is found or introduced, stop redesign and fix immediately with a regression test.

## 15. Cursor implementation roadmap — dependency-first

**No phase automatically authorises deployment, public launch, provider spending or production database edits.** Each phase must be small and committed after passing targeted validation. The plan below assumes the local worktree is reconciled at Phase 0; actual local files and test commands take precedence over old screenshot selectors.

### Phase 0 — Baseline and protection

**Objective:** establish what code the screenshots actually represent. **Actions:** read existing `AGENTS.md`, `docs/BUILD-STATUS.md`, `docs/PRODUCT-CROSSCHECK.md`, any local `GOALS/PLANS/harness` files, all canonical sources and this audit; run `git status --short`, `git log -5 --oneline`, `git rev-parse HEAD`; compare committed landing/auth screens against screenshot and capture local worktree; create `ux/redesign-cashnarra-2026` working branch only when safe; preserve unrelated modifications. **Tests:** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` if dependencies/environment available; relevant Playwright baseline. **Deliverable:** evidence-based file map, baseline screenshots, toolchain and source-version notes. **Risk:** overwriting newer local work. **Done:** branch/HEAD/worktree and screenshot-version differences recorded, no destructive operations.

### Phase 1 — Foundations and reusable components

**Objective:** establish design craft with small safe changes. **Actions:** extend semantic tokens/global font styles; refine shared Button/Amount/RecordRow/Dialogs; add focus/loading/error states; preserve cedi/Inter and reduced-motion. Extract one component at a time from `cashnarra.tsx`. **Tests:** visual regression at desktop/mobile and `ui.tsx` accessibility; no financial API changes. **Non-goals:** new React UI framework, animation dependency, ledger rewrite. **Done:** a minimal audited component foundation with tests.

### Phase 2 — Landing-page transformation

**Objective:** demonstrate value before registration. **Actions:** reconcile current local landing source; implement short structure and browser-only fictional worked example; brand connector motif; CTA routing and feature boundary copy; remove redundant long sections. Keep `/api/demo` development restriction. **Tests:** public no-login sample, no network/db writes, mobile, keyboard, no-JS fallback, build and metadata. **Non-goals:** real AI on public demo, user-created financial records without sign-in, paid media. **Done:** useful visual proof in hero; actual primary CTA route works in Vercel-like build.

### Phase 3 — Auth and first use

**Objective:** shorten path from signup to first reviewed saved record. **Actions:** rewrite auth copy/layout while preserving Supabase flows; add workspace type/name focused first-run; recover interrupted states; skip optional account opening until required by a proposed event; contextual `what next` guidance. **Tests:** auth signup, verify/recover (in configured test mode), return, workspace create once, unknown opening, first event setup, expired link states. **Non-goals:** new auth provider, bypassing verification, uncontrolled local credential storage. **Done:** new account can reach and safely save an eligible first batch without unnecessary questions.

### Phase 4 — CashNarra's central interaction

**Objective:** make natural recording clearly easier. **Actions:** direct Today textarea + date, processing feedback, field-specific clarification with one-tap options, compact batch review/save and readable recovery; preserve `perform/saveBatch/recover`, original source and idempotency; hide/qualify gated voice. **Tests:** 1 and many events, ambiguous account, debt payment, correction, duplicate, interrupted save and offline draft; validate no financial semantic drift. **Non-goals:** changing LLM model/ledger structure, making mock support arbitrary text, live voice enablement without validation. **Done:** faster review without weaker checks.

### Phase 5 — Authenticated financial views

**Objective:** align pages with the new components and information hierarchy. **Order:** Today supporting metrics → Records/People & balances → Accounts → Money Stories → Goals → Settings. **Actions:** date/period groups, account icons/unknown states, three-metric stories and source drilldown, progressive goal review, grouped privacy settings. **Tests:** exact amounts, ledger trace, account balances, correction effects, goal deterministic scenario, settings and data requests. **Non-goals:** inventory/profit claims, bank integrations, richer data imports, UI-only financial recalculation. **Done:** users understand actual supported figures and can find records behind them.

### Phase 6 — Polishing accessibility, mobile and performance

**Objective:** finish trustworthiness in real use. **Actions:** test 320/360/390/768/1024/1440 + zoom + keyboard + screen reader; repair real blockers, measure performance, intentional reduced-motion transitions, logo optical refinement if validated. **Tests:** manual keyboard/AT, axe/Lighthouse for screening, network failure, Android-like slow CPU; no overlays obscure focus. **Non-goals:** celebratory gamification, heavy animations, new mascot. **Done:** documented evidence and remaining exceptions, no unverified WCAG claim.

### Phase 7 — Verification and measurement

**Objective:** independently validate first-use and full-record workflows. **Actions:** privacy-safe activation events if legally/operationally appropriate; regression suites, source-to-claim audit, screen comparison and task testing with Ghana-based small-business/personal users; update checkpoints. **Tests:** full scripts in §18; production build in local/staging-like mode, not production deploy. **Non-goals:** fake user metrics/testimonials, payment launch. **Done:** release-readiness report separates code-ready, operationally blocked and deferred capabilities.

### Checkpoint protocol (reuse existing when available)

Keep `AGENTS.md` succinct and preserve existing Next.js agent block; `GOALS.md` freezes approved UX goals (if missing); `PLANS.md` has phases; `harness/build/ux-<phase>.md` only if a compatible phase-file convention doesn't exist; `harness/build-log.md` lists observed results, diffs/commit SHAs and next action. No secrets or raw user narrations. After atomic progress: run targeted validation, record actual result, inspect diff, commit a coherent phase when passing. On interruption: record branch, HEAD, current phase, files touched, test status, uncommitted work, known broken state and exact next command. **Git is the primary durable checkpoint.** Never clean/reset unowned local work.

## 16. Master Cursor implementation prompt — ready to paste

```text
# CASHNARRA — IMPLEMENT THE APPROVED ELITE UX REDESIGN SAFELY

You are the lead frontend engineer, product designer, UX writer, design-systems engineer, accessibility reviewer and regression-testing partner for the *existing* CashNarra repository. This is an IMPLEMENTATION task, not an invitation to redesign the financial backend or write a new prototype. Work against the ACTUAL LOCAL CHECKOUT in Cursor; do not confuse it with the October 19 GitHub snapshot or the v2 preview.

FIRST READ, in this order:
1. The local repository's AGENTS.md and any existing checkpoint/build instructions.
2. This approved report: CashNarra_Elite_UX_Audit_and_Redesign_2026-10-19.md (place it under docs/ux/ or use an absolute user-provided local path if not present).
3. Research CashNarra Concept.txt, with later final vision controlling earlier discussions.
4. Recommend Technology Stack.txt, including the final free/local-development decision.
5. Storyline handoff package.txt and the actual CashNarra_Design_Kit_v2 archive/embedded copies; v2 is a baseline to improve, not an untouchable design.
6. Repository Audit Plan.txt and current docs/BUILD-STATUS.md, PRODUCT-CROSSCHECK.md, SOURCE-DECISIONS.md, LAUNCH-READINESS.md where present.
7. The supplied screenshot baseline or local screenshots corresponding to it.

MISSION:
Implement the report's chosen 'Living Ledger' design direction: visibly transform natural words into precise, reviewable money events and clear financial understanding; create an excellent public fictional sample, focused signup/onboarding, truly usable Today composer, one-tap material clarification, compact review/save, readable Records and Accounts, balanced Money Stories, clearer goals and privacy settings. Respect the existing CashNarra brand name, tagline, Record → Understand → Plan, Serious money. Light interaction and Tell. Tap. Done. Follow the report's exact copy library unless local functionality makes a claim false, in which case preserve truth and document the necessary copy adjustment.

NON-NEGOTIABLE:
- AI interprets and explains; application/Postgres domain logic controls posting, authorisation, exact money arithmetic, transaction identity, debt linkage, source provenance, corrections, totals and goal maths.
- Do not change ledger, Supabase Auth/RLS, exact decimal representation, idempotent commit flow, request-receipt recovery, source retention or export logic except for a demonstrated defect confirmed by tests.
- Do not introduce automatic bank/MoMo feeds, wallets, payments, loans, tax filing, inventory, POS, investment advice, ERP or unsupported feature claims.
- Never treat a missing opening amount as zero, money in as sales, all money out as expenses, a debt settlement as new sales, a transfer as spending, a goal allocation as a payment, checked-in days as proof of complete records, or net movement as profit.
- No fake buttons, simulated 'saved' states in authenticated UI, nonoperational CTAs, fake external provider integrations, fabricated bank verification or invented testimonials.
- The local screenshot landing/auth pages visibly differ from public HEAD `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92`. DO NOT assume the local code matches GitHub. Reconcile first and preserve all unrelated local changes.
- Do not reset/clean, overwrite uncommitted user work, modify secrets, deploy, buy services, change production env, migrate production data, or activate paid APIs without explicit authorization. Use development/free resources and mocks for routine tests.

BASELINE GATE — BEFORE MODIFYING SOURCE:
A. Show git status --short, git branch --show-current, git rev-parse HEAD and git log -5 --oneline. Identify staged/unstaged/untracked files and user modifications. Respect any dirty worktree.
B. Read package.json and existing scripts; confirm actual current architecture. Map active Landing, Auth, App shell, Today, Capture, Review, Records, Stories, Accounts, Plan, Settings and source CSS/modules. Compare current local rendering with screenshots at 320, 360, 390, 768, 1024 and 1440 where browser runtime is available.
C. Check current Next.js version's local package documentation per AGENTS.md before changing framework-dependent APIs.
D. Record current test results by running (when feasible) npm run lint, npm run typecheck, npm test, npm run build, npm run test:e2e plus appropriate DB/Supabase integration tests only against configured LOCAL/ISOLATED databases. Distinguish BLOCKED from FAILED. Do not run destructive migrations on real data.
E. Create or select a safe working branch. Reuse existing checkpoint system and preserve AGENTS.md's framework guidance; initialize only minimal missing plan/build-log files. Document baseline and mismatches before phase 1.

PHASED EXECUTION:
Phase 1 tokens, readable typography, accessible Button/Amount/RecordRow/Dialog and coherent app layout; extract UI components incrementally. Keep present business operations untouched.
Phase 2 public landing: implement the report's exact benefit-led hero and a LIGHTWEIGHT CLIENT-ONLY fictional demo. The demo must work on Vercel, not call /api/demo, not obtain real auth/AI, and clearly state nothing is saved. Keep development `/api/demo` disabled on Vercel.
Phase 3 signup/signin/recovery and first-use: single clear action, honest messages, workspace choice and direct first narration, preserving Supabase checks and unknown opening amounts.
Phase 4 central flow: real editable Today composer, extracted event group, one-tap account clarification, review/save/error/recovery and gated voice truthfulness. Keep saveBatch/perform/recover semantics and business validation intact.
Phase 5 Today/Records/Accounts/Money Stories/Goals/Settings views with exact copy and layout specified in the report, truthful finances, source drilldowns and progressive methods.
Phase 6 mobile/accessibility/performance/interaction craft. Measure before adding dependencies. Use `prefers-reduced-motion` and keyboard/AT patterns, then run exact viewport checks.
Phase 7 privacy-safe measurement, final UX study scripts, full regression verification, documentation.

AT EVERY PHASE:
1. Read the relevant report sections and local implementation files; update phase notes only for material discoveries.
2. Implement one coherent scope; prefer CSS Modules and existing libraries. Do NOT install a new UI or animation framework without measured justification.
3. Create/extend tests for each new behaviour and every changed journey. Maintain financial tests as immutable guardrails.
4. Run targeted unit/type/lint/build and Playwright as environment permits; visually inspect both themes in desktop and mobile, keyboard/focus, zoom and error states.
5. If regression appears, fix it before the phase is complete; never conceal failures. If blocked by unavailable provider/local DB, label unverified, supply reproducible commands and continue only tasks not dependent on that verification.
6. Update the existing build log/plan with actual work, changed files, test commands/results, browser evidence, remaining risks and next action. Preserve a resume checkpoint on meaningful in-progress work.
7. Inspect git diff and commit an isolated verified phase on the work branch; record resulting SHA. Never commit secrets, raw financial content, generated screenshots not needed, node_modules or temporary output.
8. Continue automatically through unblocked phases. Ask for user input only when a consequential contradictory requirement, required secret/SSH, production action, destructive operation, legal claim or financial semantics decision cannot safely be resolved from sources and code.

SPECIAL ACCEPTANCE GATES:
- Public sample: no real money, no real users, no server demo, no backend writes; source sentence → 3 correct events → optional field clarification → clear 'not saved' message → signup CTA.
- First-use: an authenticated new user can establish correct workspace/account context and get first confirmed receipt without redundant questionnaire.
- Capture and review: arbitrary *real AI* quality is NOT assumed proven by mock. Mocks remain labelled examples. Unresolved material ambiguity stops posting.
- Save: atomic, exact, idempotent. Lost response recovers authoritative prior receipt rather than re-posting.
- Money Stories: report math from domain; screenshot example 8000.00 received − 14820.00 out = −6820.00 net; do not label profit.
- Goal: 5800.00 of 100000.00 = 5.8%, 94200.00 remaining; assignment and what-if never move money.
- Unknown opening and credit sale must not look like verified cash.
- Accidental draft-clearing and deletion request status must be explicit and correct.
- Responsive at 320/360/390/768/1024/1440; keyboard, focus, reduced-motion and relevant WCAG 2.2 AA checkpoints tested; no invented compliance claim.
- No unapproved deployment or production migrations.

FINAL OUTPUT:
Provide per-phase summary, actual files changed, decisions/screenshot-versus-HEAD reconciliation, verified test evidence, page screenshots/viewport checks if browser available, final commit SHAs, unchanged financial integrity safeguards, P0/P1/P2 backlog statuses, blocked items, launch-readiness boundaries and exact next steps. Do not say 'complete' without evidence. Stop only after finishing all unblocked approved phases or encountering a material blocker, leaving a durable checkpoint.
```

## 17. Dedicated Cursor phase prompts, resumable and independently usable

### Prompt 0 — reconcile baseline and start safely

```text
Audit the actual local CashNarra checkout WITHOUT modifying source files yet. Read AGENTS.md, all existing repo checkpoints, and the approved CashNarra Elite UX Audit report. Fetch no new speculative architecture. Record git status/branch/HEAD, current screen files, differences between local landing/auth and supplied October 19 screenshots versus GitHub HEAD 3b4d1f89..., and existing tests. Run safe baseline lint/type/unit/build and local-only browser checks when possible, noting BLOCKED separately. Preserve uncommitted work. Produce a source-to-screen map, phased plan, and a safe UX branch. Update existing checkpoint files minimally. Stop before editing UI until local version reconciliation is complete, then report the result.
```

### Prompt 1 — design tokens and component foundations

```text
Implement ONLY approved UI foundations from sections 7, 12 and CN-008/009/017 of the CashNarra audit. Inspect current tokens, globals, app.module.css, ui.tsx, and local modified files first. Resolve typography mismatch (body should visually use 16/24, readable rows 15/22, supporting 13/20), Inter ₵ formatting/tabular numbers, semantic light/dark colours, focus, loading/disabled control states, and typed Button variants. Incrementally extract one reusable component at a time. Keep domain calculations, APIs, Supabase, save/retry, and routes unchanged. Render 320/390/1440 light/dark and test keyboard focus/amount wrapping. Run lint/typecheck/unit/build and relevant e2e. Record actual work and commit this phase if it passes.
```

### Prompt 2 — landing page and public sample

```text
Implement ONLY the approved landing transformation and client-only fictional sample (report sections 8 and CN-002/003/024). Reconcile the actual local landing page against uploaded long screenshot first. Hero primary copy: 'Tell us what happened with your money. We'll help you make sense of it.' Sample: 'I sold 900 cedis in cash, paid 80 cedis cash for delivery, and Abena paid 200 cedis cash towards her old debt' (make payment account explicit, or clarify it before computing account totals). Show 3 reviewable events and the distinction between sales 900 and old debt settlement 200. Make the demo public and browser-only; do not call /api/demo, Supabase or live AI. Keep /api/demo restricted on Vercel. Provide real /auth?mode=signup CTA routing, only if auth handles mode. Build responsive hero/3-step/trust/FAQ/final CTA with concise exact copy; no duplicate long storytelling sections. Test static no-JS fallback, Lighthouse screening, click paths, keyboard and reduced motion. No claims of real money movement or generally available voice. Run tests and commit phase.
```

### Prompt 3 — authentication and activation

```text
Implement ONLY the report's first-use flow and authentication copy/layout (sections 9 and 11; CN-006). Inspect actual local auth screens before changing anything; screenshots differ from GitHub. Preserve Supabase sign-in/sign-up/verification/recovery and cookie/session security. Add explicit auth mode routing (`/auth?mode=signup`), single dominant CTA, password reveal/accessible autocomplete, error recovery, honest verification state. After real session, guide workspace Personal/Business choice and immediate first narration; do not demand unknown opening balance or a long setup questionnaire. Create Cash/MoMo/Bank account details just in time before posting, with 'unknown' first class. Test returning user, interrupted onboarding, verified/unverified link, duplicate workspace prevention, keyboard/password manager, mobile 320/390. Do not redesign ledger or spend on email providers. Run tests, update checkpoint, commit.
```

### Prompt 4 — signature recording, clarification, review

```text
Implement ONLY CashNarra's signature Tell → Interpret → Clarify → Review → Save UX (sections 10 and 11; CN-004/005/007/019). Inspect cashnarra.tsx, record-form.tsx, voice-capture.tsx, ui.tsx and existing tests. Let Today accept typed words directly and reuse existing protected draft state. Show honest interpretation stages. For a simple account question offer a direct Cash/MoMo/Other choice with a full editor alternative; retain domain validation. Present editable grouped events with source evidence, not-saved status and exactly one main 'Save N records' action. Ensure network-unknown save recovers the existing request receipt and never posts twice. Do NOT alter official ledger, posting, money arithmetic, correction provenance, RLS or source retention. Gate/prominently qualify voice when transcription disabled. Test multiple events, credit sale vs receipt, transfer, owner withdrawal, debt settlement, duplicates, correction, offline draft, failed/post-success response. Run tests and commit phase.
```

### Prompt 5 — financial screens and settings

```text
Implement ONLY the approved authenticated view redesign for Today supporting data, Records/People & balances, Accounts, Money Stories, Goals and Settings (sections 10–12; CN-010 through CN-016). Work in small individually testable changes, avoid a monolithic rewrite of cashnarra.tsx. Records: readable amount/date/type rows, account/date filtering and provenance, credit sales not visually treated as cash. Accounts: Cash/MoMo/Bank-specific icons/text and meaningful compact summaries; unknown balance is not zero. Money Stories: first viewport 3 equally legible period metrics, correct net, supporting records and no invented profit. Goals: clear assigned/target/remaining, deterministic scenario separate from money movement, short review-month flow. Settings: grouped privacy/local-draft/data requests with destructive consequences and honest pending statuses. Do not alter financial algorithms or assume bank verification. Verify source-calculated amounts and responsive 320–1440; run full targeted tests and commit coherent subphases.
```

### Prompt 6 — mobile, accessibility, brand craft, performance

```text
Inspect actual rendered CashNarra at 320/360/390/768/1024/1440, light/dark and 200–400% zoom; keyboard-only and screen-reader checks, reduced motion, slow CPU/network and offline drafts. Correct actual accessibility and responsive failures against WCAG 2.2 AA target, clearly distinguishing standards (24px minimum with exceptions) from preferred 44–48px controls. Enhance paired Narra speech symbol only if recognisability improves at favicon/24/40 sizes. Add short purposeful <220ms record reveal motion with reduced-motion fallback, never animating authoritative amount changes. Measure LCP/INP/CLS and bundles; do not claim successful thresholds without field data. Keep CSS Modules, no heavy UI/animation dependency. Validate the full core journey and checkpoint/commit.
```

### Prompt 7 — privacy-safe analytics and independent study setup

```text
Implement only the approved privacy-safe product event contracts from section 13 if a proper notice, storage, retention and lawful processing approach exists. If not, document that gate and prepare a no-collection event interface plus manual usability study checklist. Never log narration, names, emails, amounts, raw records, passwords, account identifiers or sensitive contents. Events such as landing_demo_completed, first authoritative batch_saved, first money_story_viewed and save-unknown capture metadata only; validate schema in tests. Prepare 5–8 participant scenario scripts for Ghanaian cash/MoMo users and personal users covering sample comprehension, first record, correcting old debt, opening unknown, goals and privacy. Do not invent results or conversion lift. Run tests and commit.
```

### Universal resume-after-interruption prompt

```text
RESUME CASHNARRA UX REMEDIATION. Read AGENTS.md, GOALS.md/PLANS.md (if used), the relevant existing build log and current phase file, and the approved 2026-10-19 UX audit. Inspect branch, HEAD, git status, current file diffs and last recorded test results. Do not reset or discard work. Reproduce the smallest sanity check, identify exact next incomplete atomic task, and continue ONLY approved phase scope. Do not repeat completed phases or blindly trust a 'passed' note without context. On completion run tests, inspect diff, update checkpoint with actual results, commit if coherent and verified. State blockers and remaining steps without claiming unverified success.
```

### Independent final verification prompt

```text
ACT AS AN INDEPENDENT CASHNARRA RELEASE-CANDIDATE REVIEWER, not the implementing agent. Read the canonical sources, approved UX audit, final branch/commit history and actual changed code. Do not assume a task is complete because a checklist says it is. Run full lint/typecheck/unit/build, isolated database & Supabase integration if configured, and Playwright across all specified sizes; test keyboard, screen reader, reduced motion, error messages, local/offline drafts, signup/verification/recovery, true public no-account client demo, real auth first batch, ambiguity, corrections, date grouping, credit/loan/owner semantics, transfers, debt settlement, atomic retry and original receipt recovery, record drilldowns, 3-value Money Stories, deterministic goal scenarios, privacy requests and exported totals. Trace every marketing claim to actual ready functionality. Report each backlog ID as PASS/FAIL/BLOCKED/DEFERRED with exact file/test/browser evidence, severity and remediation. Verify NO cross-workspace leak, incorrect authoritative money, fabricated profit, fake payment or auto-erase claim. Check Git state and no accidental production changes/secrets. Do not patch faults silently during independent evaluation. Produce an evidence-backed verdict, screenshots/recordings where available, an explicit not-tested list, and a short mandatory remediation plan. Only assert readiness for a specific environment if all applicable gates pass.
```

## 18. Final independent verification checklist and definition of done

Mark each item **PASS / FAIL / BLOCKED / DEFERRED** with actual commands, test IDs, responsive screenshots and immutable commit SHA; no checklist item can be marked pass from appearance alone.

### Core product and navigation
- [ ] Landing public hero and client-only example operate without account, AI API, demo cookie or database mutation; demo tagged fictional.
- [ ] Public hero CTAs have real working destinations and truthful capability copy in a Vercel-like build.
- [ ] Signup/signin/verify/recover and return workspace flow operate; password managers/paste allowed; session state secure.
- [ ] New user can select workspace, narrate, clarify, review, save and read first source-backed Money Story.
- [ ] Returning user with saved workspace enters correct screen; no phantom default data.
- [ ] App desktop/mobile navigation is complete and keyboard friendly.

### Financial correctness
- [ ] Exact decimal GH₵ arithmetic unchanged and validated; no JS-float authority.
- [ ] Known zero and unknown opening balances distinguishable.
- [ ] Transfer from Cash to MoMo changes both sides once, with no false received/paid increase.
- [ ] Customer old debt payment reduces debt and raises cash without a second sale.
- [ ] Credit sale increases receivable/sales and shows no immediate cash receipt.
- [ ] Loan principal and interest distinguished; loan receipt not business sales.
- [ ] Owner contribution/withdrawal distinguished from revenue/operating expense.
- [ ] Stock acquisition does not magically produce a credible profit calculation without cost information.
- [ ] Save-all atomic; failed save leaves no partial batch; retry uses same request identity.
- [ ] Lost response checks prior receipt; no double post.
- [ ] Correction, split, and permitted movement preserve provenance and balance effects; linked obligations safe.
- [ ] User/workspace isolation verified at both application and database/RLS levels.
- [ ] Every dashboard/Story/account total derives from deterministic domain result and links to included sources.
- [ ] Screenshot calculation example: 8,000 received − 14,820 paid = −6,820 net; no profit claim.
- [ ] Goal example: 5,800 / 100,000 = 5.8%; remaining 94,200; scenario changes actual balance by zero.
- [ ] Calendar group labels accurate on Ghana day boundaries and explicit date entry, including future records.

### Usability and accessibility
- [ ] Today editable composer is immediately visible and keyboard focusable at 320/360/390.
- [ ] Clarification of account/amount/debt meaning can be answered without unnecessary full-form navigation when supported.
- [ ] Every action has default/hover/focus/pressed/disabled/loading/error/unknown-outcome/success states as applicable.
- [ ] WCAG 2.2 AA audit target tested, with contrast measurements and exceptions documented; no unsupported compliance claim.
- [ ] Text scales/reflows to 200–400%; full amounts and long counterparty names remain readable.
- [ ] Account icons identified with text, record direction is not colour-only, story chart has accessible table/data.
- [ ] Dialog focus, Escape, focus return, field errors and onscreen keyboard behaviour verified.
- [ ] Reduced motion avoids transforms/delays but all content/status remains accessible.
- [ ] Screen masking hides figures in UI and accessible labels as intended; does not imply encryption.

### Operational/privacy/performance
- [ ] Offline draft consent, sharing/privacy mode, restoration, clearing and unsynchronised logout behaviours tested.
- [ ] Status `Saved` displayed only after server receipt; no UI optimistic false post.
- [ ] Live voice claims reflect gate and tested transcription readiness; disabled paths clear.
- [ ] Data access/deletion requests display `pending review` where applicable, never pretend immediate erasure.
- [ ] Export CSV/PDF/XLSX calculates numbers accurately, includes provenance where specified, and handles formula injection.
- [ ] Supabase Auth, database migrations, schema permissions and external providers unchanged unless separately approved.
- [ ] Lighthouse and lab performance run with recorded device/network; field CWV separately gathered when traffic supports it.
- [ ] No raw financial text, name, amount or passwords in analytics, feature logging or public demo telemetry.
- [ ] Financial/protection regression tests and full production build pass or remaining BLOCKED results documented with owner and command.
- [ ] Checkpoints, phase commits, code-to-screenshot version reconciliation, and rollback plan documented.
- [ ] Company operational/Ghanaian regulatory/provider launch questions remain a separate **unresolved gate**, not silently marked satisfied by a prettier UI.

## 19. Remaining material assumptions and uncertainties

1. **The supplied screenshots may reflect uncommitted/otherwise inaccessible local files.** Definitive current selector-level planning must follow local worktree reconciliation. Do not map every observed landing section to committed source or claim current Playwright screenshots show that state.
2. **Actual browser execution and present production metrics unavailable.** GitHub source was inspected, but npm, browser, live auth, real Supabase, provider transcription/AI, screen readers, network performance and actual customer flows were not executed here.
3. **Potentially different pilot/legal states:** registration and privacy request operations are shown in dev screenshots/code while the public service may not yet have verified operational readiness. Do not launch marketing that promises a production service without resolving these items.
4. **Live AI interpretation has not been established by the available verified evidence.** A rigorous test corpus of representative Ghanaian financial language is needed before claiming arbitrary narration accuracy. Quality must be assessed separately from visual redesign.
5. **Logo recognition and conversion success are hypotheses.** New vector proposals need testing; no trademark clearance established and no observed experiment results available.
6. **Any external voice or analytics collection** must pass actual feature readiness, privacy/cost and consent/processing checks before public activation.
7. **Developer resources:** local/free development is agreed; Vercel production remains the direction subject to actual terms and legal/operational obligations. Do not infer paid plan provisioning from this audit.

## 20. Final recommended direction and smallest practical path

**Choose The Living Ledger and implement it incrementally.** Keep violet/ink/apricot as a continuity baseline, existing Manrope/Inter roles, the paired speech icon (refined rather than replaced), and especially the entire deterministic ledger/security/recovery layer. Make a single visual signature ubiquitous where meaningful: **ordinary words → reviewed financial events → an understandable result**. Prioritise honest interaction and readable sums over decorative animation or more cards.

**Five essential improvements in dependency order:**

1. Reconcile local screenshot code against immutable HEAD and protect the worktree before editing.
2. Put a safe interactive fictional example in a clear benefit-led public hero; CTA should work without dev-only demo backend.
3. Make Today a true one-place narrative input, then give field-specific, one-tap clarifications and compact saved-record confirmation.
4. Rebuild Records, Accounts and Money Stories around quick scan, meaningful money distinctions and traceable numbers.
5. Reorganise first-use, goals and privacy controls with purposeful progression, clearer copy, accessible mobile layouts and non-deceptive state feedback.

**Do NOT spend this phase on:** replacing Next.js/Supabase or the ledger, new payment integrations, full accounting/inventory/ERP, live chat/voice agent frameworks, broad AI auto-recording, decorative dashboards full of unsupported charts, a new CSS-in-JS framework, point systems or social leaderboards, hiring expensive design vendors before validating the signature interaction, or unapproved paid production deployment.

**Smallest credible launch-quality improvement:** first ship **public worked demo + redesigned editable Today composer + fast clarification + readable review/save + record-backed first Money Story**. Verify with a few actual target users and full financial regression tests. Once this single through-line is consistently excellent, spread the improved design system across secondary pages.

> **CashNarra should become memorable because it makes a difficult financial moment feel understandable and controlled—not because it has the most elaborate dashboard.**

---

### Supporting research references

- Nielsen Norman Group — Progressive Disclosure: https://www.nngroup.com/videos/progressive-disclosure/
- NN/g — Visual Hierarchy: https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- NN/g — Information Scent: https://www.nngroup.com/articles/information-scent/
- NN/g — Layer Cake Scanning: https://www.nngroup.com/articles/layer-cake-pattern-scanning/
- Microsoft Research — Guidelines for Human–AI Interaction: https://www.microsoft.com/en-us/research/blog/guidelines-for-human-ai-interaction-design/
- GOV.UK Design System — Question pages: https://design-system.service.gov.uk/patterns/question-pages/
- GOV.UK Design System — Error messages: https://design-system.service.gov.uk/components/error-message/
- W3C WCAG 2.2 — Target size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- W3C WCAG 2.2 — Accessible authentication: https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
- web.dev — Core Web Vitals: https://web.dev/articles/vitals
- Baymard — Delayed account creation (checkout-specific analogy): https://baymard.com/research-articles/delayed-account-creation
- Duolingo — Streak flexibility: https://blog.duolingo.com/how-duolingo-streak-builds-habit/
- Monzo — Business Insights and separated financial views: https://monzo.com/help/business-accounts/what-is-insights

**End of audit.**


---

# PART 21 — COMPLETE EXPORT EXPERIENCE REDESIGN ADDENDUM

This part supersedes the general export styling/UX remarks in earlier sections only where more specific. Read the format-specific acceptance tests before making changes. The attached PDF/CSV may have come from a later local build than public GitHub HEAD; reconcile first.

# CASHNARRA — EXPORT EXPERIENCE, REPORT DESIGN, BRANDING & ENGINEERING AUDIT

**Audit date:** 19 October 2026  
**Applies to:** CashNarra's PDF, CSV and XLSX exports; export-selection user experience; privacy, provenance and accessibility  
**Evidence:** user-supplied `CashNarra_2026-10-19_2026-10-19.pdf` and `.csv`; public GitHub `janelove-tech/CashNarra`, `main` @ `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92`; previous CashNarra UX audit and canonical source documents.  
**Status:** source-and-artifact audit plus approved proposed direction, **not** proof that code has been changed or real exports have been re-tested.

## 1. Executive decision

**The current exported files are functionally useful, but they are not finished product-quality documents.** The sample PDF is a plain text-led document with no actual CashNarra logo treatment, weak financial hierarchy, visually intrusive UUIDs and an awkward page break. The CSV preserves important fields but combines several logically distinct tables of different widths in one file and supplies positive transaction amounts without a separate machine-computable direction/cash-effect field. The committed XLSX implementation writes all cells as strings in one unstructured sheet; an actual XLSX was **not supplied**, so rendered XLSX defects are predictions from the implementation, not observations of an exported workbook.

**Decide now:** one consistent export identity, but **three format-specific experiences**:

- **PDF = readable human report:** elegant, printable, financially careful, branded, with optional evidence appendix.
- **XLSX = working financial workbook:** actual numbers and date types, meaningful worksheets, filters, frozen headers, relevant formulas, full traceability.
- **CSV = reliable data interchange:** strictly rectangular transaction data with a published schema; separate supplementary CSVs when requested, not various mini-tables placed in a single sheet.

**Non-negotiables:** unchanged authoritative domain totals and financial distinctions, unknown ≠ zero, credit sales ≠ cash received, settlements ≠ new sales, owner withdrawal ≠ operating expense, transfers ≠ external cash movement, net movement ≠ profit, period-end account balances ≠ independent bank verification. Do not invent invoices, tax determination, evidence, bank reconciliation, or audit status.

### Snapshot of verified example data

| Data element | Observed in uploaded files | Arithmetic/evidence status |
|---|---:|---|
| Date | 19 October 2026 | Both export filenames and document use ISO dates |
| Posted activity lines | 9 | Nine records in uploaded CSV and PDF |
| Money received | GH₵8,000.00 | GH₵3,000 cash sales + GH₵3,000 prior receivable + GH₵2,000 prior receivable |
| Money paid out | GH₵14,820.00 | GH₵10,380 expenses + GH₵4,440 owner cash withdrawal |
| Net movement | −GH₵6,820.00 | 8,000.00 − 14,820.00 |
| Sales value | GH₵5,000.00 | GH₵3,000 cash sale + GH₵2,000 credit sale; not receipts |
| Recorded expenses | GH₵10,380.00 | 6,800 + 1,500 + 600 + 1,480 |
| Recorded account balances | GH₵8,680.00 | Cash 7,180 + MoMo 1,500 + Bank 0 |
| People owe / You owe | GH₵0.00 / GH₵0.00 | Snapshot on period-end; do not generalise to all workspaces |
| Profit | Unavailable | Correctly not inferred from money movement |

**Counterparty note:** the original PDF says `Mr JAames`. This may be a typo, but the report faithfully reproduces saved text. Never silently change source data in an export; provide a correction workflow in CashNarra itself.

## 2. Evidence and scope: what was and was not inspected

**Inspected actual files:** the supplied two-page, A4 jsPDF PDF and all 33 physical CSV rows with UTF-8 BOM; parsed structured data and visually rendered both PDF pages. The PDF is 37,413 bytes, generated by jsPDF 4.2.1, PDF 1.3, with text selection but **no tagged structure** according to `pdfinfo`. The CSV has 33 rows including three blank rows: 18 rows of width six, seven of width four, three of width two, two of width three, and three blank. There are nine actual transaction rows after the six-column header.

**Inspected committed source:**

- [`src/lib/exports.ts`](https://github.com/janelove-tech/CashNarra/blob/3b4d1f89fed8c079cc3571aeff6276bfe5f04d92/src/lib/exports.ts) — `safeText`, `exportRows`, `csv`, `downloadReport`; PDF, XLSX and CSV generation.
- [`src/components/cashnarra.tsx`](https://github.com/janelove-tech/CashNarra/blob/3b4d1f89fed8c079cc3571aeff6276bfe5f04d92/src/components/cashnarra.tsx) near lines 2514–2550 — Export dialog and download feedback.
- [`tests/exports.test.ts`](https://github.com/janelove-tech/CashNarra/blob/3b4d1f89fed8c079cc3571aeff6276bfe5f04d92/tests/exports.test.ts) and `tests/final-safeguards.test.ts` — current coverage and safeguards.
- [`src/domain/ledger.ts`](https://github.com/janelove-tech/CashNarra/blob/3b4d1f89fed8c079cc3571aeff6276bfe5f04d92/src/domain/ledger.ts) `report()` — financial reporting source of truth, not to be replaced.
- `src/app/tokens.css`, Design Kit v2, the prior 20-part CashNarra UX audit — branding and downstream design requirements.

**Important baseline difference:** the supplied CSV and PDF include an explicit `Recorded expenses` line; the retrieved GitHub `src/lib/exports.ts` at the audited SHA does **not** produce that line. Therefore the supplied files were not necessarily created from that exact committed source. Cursor **must inspect the actual local checkout** before editing. Preserve any post-commit work.

**Not inspected:** a user-generated XLSX file, live export-dialog browser behaviour, generated report from a restored authenticated session, all printer drivers, screen reader operation on the PDF, and production deployment. XLSX recommendations reflect verified implementation limitations, not a visually audited XLSX sample. Any redesign specimens accompanying this guide are conceptual design artifacts produced here and **not** generated by the CashNarra application.

## 3. PDF audit, page by page

### Page 1 — overwhelming information without hierarchy — REDESIGN (P1 quality)

**Observed:** title is the largest line but only normal text. Five finance statements stack in the same unstructured column, a long exclusions paragraph wraps at the top, followed by seven record blocks. Each transaction uses a prominent date/description line, then category and amount as ordinary prose; the full UUID and source UUID sit immediately under each transaction. Colour, grouping, whitespace and amount alignment do not help the eye distinguish inflows, outflows, non-cash sales or old-debt settlements.

**Consequence:** a recipient must read almost everything to learn what happened. The summary cannot be skimmed; sales versus money received is easy to misinterpret. Audit IDs compete with actual financial facts. The PDF does not look like it belongs to CashNarra's purple/ink/apricot interface.

**Recommendation:** intentional editorial report system: compact branded masthead, human date and workspace title, financial position cards/strips, one-sentence interpretation, a clearly labelled transaction table with three information bands (description; category/account; amount), and references relegated to appendix/footnotes or optional evidence section. Bold large amounts only for true summary metrics. Type distinctions and signed cash effects by text as well as colour. Do not imply that business expenses equal all money paid out.

### Page 2 — poor continuation, unsupported empty space — REDESIGN (P2)

**Observed:** page 2 starts with the last two activity items, then accounts and prior obligations in free-text sentences; the rest is mostly blank. It has no repeating report title, no labelled table headers, and little visual relationship to page 1. Footer gives `Private · 2 / 2`, which denotes intended handling but does not encrypt or restrict the file.

**Consequence:** printed pages can become separated, and users cannot immediately recognise page 2. Valuable balances are visually buried; excessive empty space undermines perceived care. Long provenance strings create line breaks.

**Recommendation:** use a compact one-page summary/transaction design whenever content and readability permit. For fuller reports, make the second page a *purposeful* `Accounts, obligations & audit trail` continuation: repeat masthead and period, display accounts and obligations in tables, put long IDs in an audit reference table, repeat page number + export reference. Page breaks must keep headers with rows; long descriptions must wrap; no orphan totals or tables. Print in monochrome and at 80% scale to ensure legibility.

### PDF semantic/accessibility concerns

- `pdfinfo` reports **Tagged: no**. That is concrete evidence the attached document lacks PDF's navigable tagged structure; it is not in itself proof of every accessibility failure. Target correct heading/table semantics, reading order, document language, document title, selectable/searchable text, contrast, and assistive-technology testing. Changing colours alone cannot remedy this.
- The sample's PDF metadata does not disclose a meaningful `Title`, `Subject`, or `Author`; specify `CashNarra — Recorded Activity — [date range]`, `CashNarra-generated user-recorded report` and appropriate creator/producer. Exclude user/customer names from public file metadata unless explicitly intended.
- Do not label the output `official financial statement`, `verified`, `audited`, `tax approved`, or `bank statement`.
- Do not promise confidentiality because text says `Private`. Offer real handling controls where available (private client-side downloads, warning before sharing, no accidental public URL). PDF password encryption is optional future work with carefully tested UX, not automatic security.

## 4. CSV audit — structural correctness vs interchange expectations

**Strengths to KEEP:** BOM aids some Excel openings, stable record/source IDs provide traceability, ISO dates are useful for transfer, amounts use dot-decimal strings and preserve exact two-decimal representation, existing `safeText` supplies some spreadsheet-formula-injection protection, and source omissions are not silently used to invent numbers.

**Observed defects:** one `.csv` combines a six-column transaction table, differently shaped summary rows, free-text metadata rows, a four-column accounts table and a four-column obligation table. This is a **valid way to quote rows but a poor single rectangular dataset**: 33 rows have five different column counts (including blank). An importer cannot safely interpret it as one uniform transaction dataset. Additionally, the `Amount GHS (exact)` values are all positive magnitudes even for `Business expense` and `Money taken home`. Someone summing the column does **not** recover cash movement; credit sales have economic value but no cash receipt.

**Decisive correction:** do **not** simply put minus signs in front of all outflows without considering transfers, stock, owner money, loans, credit activity and debt settlements. Derive a separate `cash_effect_ghs` from the authoritative ledger/report logic. Preserve positive `recorded_amount_ghs` for event magnitude if useful; make `cash_effect_ghs` signed and 0 for non-cash credit sale, with explicit row meaning. Never use description/label string matching as a source of financial truth.

**Recommended default `Transactions CSV` schema (V1):**

`record_id,activity_date,description,event_type,recorded_amount_ghs,cash_effect_ghs,cash_effect_type,account,related_account,counterparty,source_id`

- `record_id`, `source_id`: plain text unchanged, stable.
- `activity_date`: ISO `YYYY-MM-DD`.
- `description`, `counterparty`, account labels: text with appropriate CSV-spreadsheet-safety handling.
- `event_type`: stable coded event kind **and/or** readable event label using separate columns when possible (e.g. `credit_sale` with a human label).
- `recorded_amount_ghs`: fixed two-decimal decimal string, magnitude; non-empty when posted.
- `cash_effect_ghs`: exact signed two-decimal decimal string computed from ledger journal cash-side movements; `0.00` *only when known*, and blank/explicit availability field for unknown/unsupported semantics.
- `cash_effect_type`: enum `in`, `out`, `none`, `internal_transfer`, `unknown`, not inferred from a colour.
- `account`, `related_account`, `counterparty`: only include values already recorded and authorised; blanks rather than invented data.

One header and exactly the same 11 fields on **every data row**. Clarify treatment for transfers involving two internal accounts, cross-workspace moves, opening balances and debts in code-level integration tests before implementing. Do not overpromise single `cash_effect` field's ability to represent all multi-account effects. Do not use a CSV transaction table as a substitute for a balanced journal export.

**Supplementary files:** offer a `Complete data package (.zip)` containing `transactions.csv`, `summary.csv`, `accounts.csv`, `obligations.csv`, and a plain `README.txt` with period, currency, column schema, semantics and privacy notice **only if complete data export is needed**. For simplicity, MVP may ship one `Transactions CSV` and one richer XLSX. Never stuff multiple unrelated tables into one CSV while labelling it machine-ready.

**Security/interoperability:** Excel may interpret CSV cells as formulas; OWASP cautions that quoted and apostrophe-prefixed cells are not universally reliable, particularly across reopen/save cycles. Separate predictable interchange output from spreadsheet-user safeguards if one method damages raw text; use threat-modelled escaping/encoding and test with real Excel/LibreOffice on dangerous leading characters, embedded separators, newlines, BOM, unicode and formula-like strings. Avoid altering the meaning of legitimate negative amounts. Do not claim universal CSV formula safety without relevant client testing.

## 5. XLSX audit — CODE-VERIFIED limitation; no uploaded workbook

**Current committed implementation:** `downloadReport(...,"xlsx")` calls `write-excel-file` on `exportRows()` and maps **every cell** to `{ type: String, value }` with fixed widths. On source inspection, that means even money values, dates and summary numbers are exported as **text**; there are no typed numeric/date cells, no separate data/summary/accounts worksheets and no explicit branded header, freeze/filter or formatting rules in the code. An actual XLSX rendering has not been provided, so do not claim to have visually tested one.

**Recommended workbook design, minimum V1:**

1. **Overview** — branded but restrained: `CashNarra`, workspace, reporting date range, currency, `Recorded activity`, 4 principal facts (`Received`, `Paid out`, `Net movement`, `Recorded account balances`), `Sales value` and `Recorded expenses` in a second band, liabilities/receivables, and `Profit cannot be calculated` statement. Short source/provenance information and manual-record disclaimer.
2. **Transactions** — real table with filters, frozen row, date as date, money as numeric cells with currency formats, amount/cash effect separately, codes plus readable descriptions, and identifiers hidden from primary view only if still retrievable in adjacent columns. No fake formulas for authoritative values.
3. **Accounts** — name/type, declared opening/date, calculated recorded closing balance, status `Manually recorded`; unknown opening stays blank/`Unknown` not zero.
4. **Obligations** — direction if actually available, counterparty, original amount, remaining amount as at period end, reference ID and optionally due date when stored; no manufactured overdue labels.
5. **Read me / Audit metadata** — export timestamp/timezone, workspace id if appropriate, ledger version, report range, column dictionary, exclusions and privacy caveat. Optional full source ID index if not already in transaction table.

For small V1, the fifth sheet may be omitted if its content fits cleanly into Overview without clutter. Ensure Excel printing page layout and view properties where practical. Formulas in a demonstration workbook may reconcile exported values, but **the application must export authoritative numbers computed by its existing domain logic**; no dependence on Excel recomputation for financial correctness. Do not require Microsoft Excel macros, external data connectors, or new paid libraries.

**Style:** white document surfaces, ink text `#29263D`, brand violet `#5B49C7` for headings and navigation, subtle lavender `#F0ECFC` grouping, apricot `#FFC4A0` for gentle emphasis without conflating spending with danger, restrained borders `#E1DEEB`, tabular numerals, date/currency formatting, freeze the header row and use filters. Keep black-and-white contrast functional. Avoid dark purple as the background of every worksheet cell.

## 6. Export-dialog and after-download UX — exact requirements

**Current committed dialog:** `Export a private report` followed by a sentence showing date/workspace/GHS and three equal-weight buttons `CSV`, `PDF`, `XLSX`. The action downloads based on the same `from/to` used by Money Stories, and `setStatus("Private report downloaded.")` is called on resolve. There is no purpose-led format description, clear privacy choice, selective report scope, format-preview sample, or consistent human-readable filename handling.

**New dialog structure:**

- Title: **`Export your records`**
- Description: **`Choose a format for reading, working with or importing your recorded information.`**
- Label: **`What would you like to export?`** default `Recorded activity for [period]` with optional `Complete data` only when implemented and scoped.
- Period display: `19 Oct 2026` or `17–19 Oct 2026`; `Change period` opens a controlled date picker; no implicit crossing of workspaces.
- Format radio/card choices: `PDF report — Best for reading or printing`; `Excel workbook (.xlsx) — Best for working with the numbers`; `Transactions CSV — Best for importing records into another tool`.
- Optional checkbox (only if implemented): `Include full audit references in PDF` (default off for compact summary; full IDs remain available in records/account exports). If omitted, PDF must still make a reliable traceable reference possible.
- Privacy line: `This file contains private financial information. Anyone you share it with may keep a copy.`
- If app amounts are masked, show explicit **`Amounts are hidden on screen, but this export will contain them.`** with a separate unmask/continue confirmation if necessary; do not accidentally expose masked amounts in preview.
- Preview: optional responsive *sample layout* or local in-memory current-report preview; never render private financial data on public endpoints and never label fictional preview as user's actual data.
- Primary CTA: **`Download PDF`** / **`Download Excel workbook`** / **`Download transactions CSV`**, dynamically reflecting selection. Secondary: `Cancel`.
- Loading: `Preparing your file…`; success only after file generation triggers a browser download action: `Download started. Check your Downloads folder.` This is not proof of successful writing to disk; do not say `saved on your device` or `delivered` prematurely.
- Errors: `We couldn't prepare the PDF. Your records are unchanged. Try again or choose another format.` Keep dialog open, enable retry, preserve selected period/format. In offline PDF-font failure, show the actual actionable recovery.
- Post-download: do **not** automatically email, save to the cloud, use arbitrary public URLs or upload file content to analytics; offer `Open records` only when relevant.

**Filename:** choose stable format-specific ASCII-safe, low-exposure filenames such as `CashNarra_Activity_2026-10-19_1532Z.pdf`, `CashNarra_Transactions_2026-10-19_1532Z.csv`, `CashNarra_Workbook_2026-10-19_1532Z.xlsx`. Include a collision-resistant counter or export timestamp where possible. Keep names/user identity out of filename by default; do not use raw workspace name or description without sanitisation. Use the actual period boundaries and date timezone, not a made-up export time.

## 7. Selected PDF report blueprint — component by component

**A4 portrait. Print-friendly.** Good default margins: 18–20mm left/right; top 18mm; footer baseline ≥12mm from edge. Optional Letter output later only if justified. Use embedded glyph-complete font, 9.5–11pt body, 7.5–8.5pt trace labels, 12–14pt section headings, 23–30pt summary money; keep amount strings whole and right aligned. Large-print variant / accessible HTML alternative if tagged PDF cannot be emitted correctly in current tooling.

**Page structure:**

1. **Masthead:** compact speech mark + CashNarra wordmark, `RECORDED ACTIVITY` eyebrow, workspace label and human-readable period. Unobtrusive `GHS` and `User-recorded` descriptors.
2. **Financial headline:** `Your money for 19 Oct 2026` or `Recorded activity: 19 Oct 2026`. Under it two high-level amounts `Money received / Money paid out` and `Net movement` as a distinct result, with explicit `not profit` note.
3. **Useful distinction strip:** `Sales value` vs `Recorded expenses` vs `Money taken home` where defined; say why receipts can differ from sales.
4. **Transactions:** clear table headings `Activity`, `Meaning`, `Cash effect`, with source amount and noncash credit-sale indication. Long descriptions wrap and tables page-break cleanly. For outflows print `−GH₵...`; for credit sale show `No cash received in this event` instead of treating GH₵2,000 as cash. Rows can link to evidence appendix; no arbitrary truncation of IDs.
5. **Accounts:** current manually recorded balances and declared openings at or before the period; unknown remains unknown.
6. **Outstanding obligations:** people owe/you owe plus named balances when included and authorised. Avoid printing raw personal names in more places than necessary.
7. **Limitations:** short, truth-forward footnote: `Based on records entered in CashNarra. Recorded balances are not bank-verified. Net cash movement is not profit. Profit is unavailable because necessary cost information is missing.` Link or reference to more detailed documentation if truly provided.
8. **Footer:** `CashNarra · Private financial record · Page X of Y · Exported [timestamp]` and a compact unique export reference, not a security claim.
9. **Optional appendix:** record/source UUIDs, ledger version, report exclusions, detailed calculations and correction references, clearly separated from presentation pages; never lose information when users request full detailed evidence.

**Motion:** none in export files. **Brand graphics:** no stock-money imagery or busy gradient. Use speech-mark motif sparingly in header, thin tracking line between narration and results, and one purposeful apricot highlight. Export files should feel part of the product, not like a marketing flyer.

## 8. Semantic truth and reconciliation contract

The same structured `report(w,from,to)` output supplies UI, PDF, XLSX and CSV. No export format may recalculate finances differently or substitute its own interpretation. At minimum test:

| Assertion | Attached example | Acceptance |
|---|---|---|
| Received minus paid = net movement | 8,000 − 14,820 = −6,820 | Exactly consistent across all formats |
| Received includes old balance payments, not treated as sales | 3,000 + 2,000 old debts | Show `Old balance received`, separate from revenue |
| Credit sale contributes to sales, not money received | 2,000 Swami credit sale | No +2,000 cash effect from that event |
| Operating expenses vs total outflow | 10,380 vs 14,820 | Owner withdrawal of 4,440 excluded from expenses |
| Balances | 7,180 + 1,500 + 0 = 8,680 | Account sum matches recorded total if all openings known |
| Profit | Unavailable | Never replace with net cash figure or invented margin |
| Source IDs | 9 posted rows have source IDs | Full provenance retrievable without visual clutter |
| Date basis | 2026-10-19 one day | No silently included 20 Oct obligation or wrong timezone |
| Unknown openings | source-dependent | Do not export zero for unknown values |
| Hidden amounts | screen privacy | Export warning before revealing original figures |

A **critical quality issue** is separating *human-readable report presentation* from *unambiguous exported data*: on-screen `GH₵8,000.00` is appropriate in a PDF, whereas machine export should use `8000.00` and separate `GHS` metadata. For XLSX use numbers and appropriate custom number format rather than embedding currency strings in numeric cells.

## 9. Exact design-system and implementation rules

**Reuse current repo tokens:** `--cn-text #29263D`, `--cn-action #5B49C7`, `--cn-brand-soft #F0ECFC`, `--cn-accent #FFC4A0`, `--cn-border #E1DEEB`, `--cn-surface #FFFFFF`. No new monolithic design framework. Use Inter/Manrope where embedding/licences/glyph checks permit, or a compatible font that renders GH₵, ₵ and true minus; validate output in multiple PDF viewers. No font files are part of the user-delivered artifacts.

**Engineering refactor boundary:** extract `src/lib/exports.ts` into a small `buildExportModel` + format adapters (`pdf`, `csv`, `xlsx`) if it reduces duplication. Keep existing function entry points `downloadReport` compatible until all caller tests are updated. `buildExportModel` must be a pure, deterministic transformation of the existing report and authorised workspace data. In particular: don't edit ledger posting, Supabase auth, RLS, transaction IDs, commit semantics or goal maths for a visual redesign. Avoid a heavyweight reporting service, extra database tables, payment service, remote PDF generator or charting library.

**PDF approach:** prefer current jsPDF only if accessible tagging, page semantics and long-text layout can be demonstrated. Otherwise provide an accessible HTML/print route as an interim fallback and research a small alternative PDF generator; do not claim automatically tagged PDF via an API that does not expose real structure. Ensure SSR/client font-loading errors remain recoverable. PDF should be generated client-side from authorised data if that is the current safe scope.

**XLSX approach:** evaluate whether the existing `write-excel-file` package can create true numbers, dates and multiple sheets with necessary formatting; only switch packages if tests prove a product-essential capability is impossible or unduly awkward. Numeric cells and no formula injection are higher priority than decoration.

**CSV approach:** rectangular table, real CRLF where practical, standard quote escaping, UTF-8 BOM compatibility, safe encoded text. Document a stable schema version as metadata outside the CSV (README for package or documented public developer schema); avoid introducing schema rows in the transaction table.

## 10. Prioritised engineering backlog and acceptance contracts

| ID | Priority | Evidence and area | Exact implementation | Verification and pass criterion |
|---|---|---|---|---|
| **EXP-001** | **P1** | Uploaded PDF + `exports.ts` — weak overview | Build branded masthead + human report overview with separately labelled received/paid/net/sales/expenses | Three top-level totals readable without prose; no incorrect profit |
| **EXP-002** | **P1** | CSV 33 nonuniform rows | Transactions CSV with one stable documented header; auxiliary tables not embedded beneath it | Every transaction CSV row has exactly same field count; import into parser succeeds |
| **EXP-003** | **P1** | CSV positive amounts | Add ledger-derived cash effect/direction and preserve event magnitude | Credit sale 2000 = zero cash effect; known outgoing values negative; net = −6820 |
| **EXP-004** | **P1** | Source XLSX `{type:String}` | Real typed money/date cells; distinct sheets and headers | SUM over exported cash effects computes −6820; date sorts correctly |
| **EXP-005** | **P1** | PDF footers/UUIDs | Design two-tier provenance: compact display with full IDs in accessible appendix/columns | Every included record traceable; no UUID truncation in full evidence |
| **EXP-006** | **P1** | UI export-dialog | Purpose-led format choices, period and privacy warning, dynamic CTA, retry-safe download | Correct file chosen; error does not dismiss modal or claim success |
| **EXP-007** | **P1** | Signed event semantics | Derive report view model from authoritative `report()` and ledger journal, no string matching | Tests cover old debt, credit sale, owner draw, transfer, opening, unknown |
| **EXP-008** | **P2** | PDF `Tagged: no` | Establish real tagged PDF/structured reading or accessible HTML alternative | Independent PDF structure/AT check or clearly documented alternative; no false conformance claim |
| **EXP-009** | **P2** | PDF page 2 orphan continuation | Page templates, repeated masthead, sections/tables, orphan control | A4 1/2/10/100 events: no clipped text, orphan tables or empty trailing page |
| **EXP-010** | **P2** | XLSX format/brand | Overview, Transactions, Accounts, Obligations, metadata; freeze/filter/formats | Workbook usable on desktop Excel and common mobile viewer; print area clear |
| **EXP-011** | **P2** | PDF metadata and timezone | Set title, document language where supported, creator, human date and explicit TZ | pdfinfo metadata correct; displayed period accurate |
| **EXP-012** | **P2** | CSV formula safety | Threat model + adversarial test fixtures for names, quoted cells, tabs, CRLF, formula strings | Dangerous text inert in tested spreadsheet apps; legitimate amounts unchanged |
| **EXP-013** | **P2** | Masking vs export | Warn when exporting unmasked amounts from a masked screen | No private values rendered in preview/announcement unexpectedly |
| **EXP-014** | **P2** | File naming and collisions | Descriptive safe filenames for report type/date and unique generation context | Multiple same-day exports do not silently overwrite without browser indication |
| **EXP-015** | **P2** | Print/low-data | Print at A4, B/W and mobile download with PDF lightweight fonts/assets | Render image diffs, no unexpected remote requests, readable grayscale |
| **EXP-016** | **P3** | Exclusion text repeated | Consolidate report caveat into short direct text and audit appendix | Caveat still accurate and findable, no duplicated warning paragraph |
| **EXP-017** | **P3** | Optional options overload | Default to three easy choices; hide complete-data package until needed | No more than one primary button and three format explanations by default |

Severity is about usability/data interoperability, not proof of security vulnerabilities; promotion to P0 only on independently demonstrated financial corruption, unsafe disclosure or broken authorised boundaries.

## 11. Step-by-step Cursor implementation phases

**Phase E0 — preserve and verify:** read repo `AGENTS.md`; inspect branch, `git status`, HEAD, previous UX audit and files; compare actual generated output with supplied PDF/CSV. Build exact nine-row fixtures based on user-authorised sample with no production secrets; classify the local mismatch where `Recorded expenses` appears only in supplied files. Do not overwrite local work. Add baseline PDF render and CSV snapshot tests.

**Phase E1 — format-neutral report/view model:** preserve current `report()` calculations; introduce exact `ExportReport` presentation fields using decimal strings and ledger-derived cash effects. Write finance semantic tests and labelled unknown states. This phase changes neither styling nor download behaviour yet.

**Phase E2 — CSV first:** emit one rectangular transactions CSV. Use contract tests on field count, ISO dates, quoted text, formula injection, signed cash effects and source provenance. If compatibility requires legacy CSV, keep a clearly named `legacyExportRows` until consumers migrate rather than silently breaking users.

**Phase E3 — XLSX workbook:** typed money/dates, tabs, filters/frozen rows and Overview layout. Test workbook with an independent parser and external viewing where available; assert numbers not strings and reconciled totals.

**Phase E4 — professional PDF:** implement branded and accessible report structure, page layout, metadata, account/obligation tables, optional audit references. Render 1, 2, 10, 100 and long-text test datasets; test cedi/minus symbols and grayscale. If accessible tagged PDF support cannot be verified, label gap and ship an accessible HTML printable view rather than claiming WCAG compliance.

**Phase E5 — export-selection UX:** adapt dialog and statuses using existing UI components. Make privacy and format meaning obvious, preserve selected period and workspace, and explicitly warn about masked amounts.

**Phase E6 — independent release verification:** financial invariants, duplicate/retention/multi-account semantics, adversarial text, source fidelity, PDF layout/accessibility, XLSX data types, CSV importability, mobile downloads, no private analytics logging. Update existing checkpoint system, finish each phase with tests and Git commit on safe work branch.

## 12. Master Cursor prompt — export workstream, ready to paste

```text
# CASHNARRA — IMPLEMENT THE APPROVED EXPORT EXPERIENCE REDESIGN
Act as a principal fintech report designer, expert frontend/Next.js engineer, financial data export engineer, CSV/XLSX/PDF specialist, accessibility reviewer, and independent QA lead. Work in the actual local CashNarra repository, not a new prototype. This is a SUBPROJECT of the existing CashNarra Elite UX Redesign.

READ FIRST: AGENTS.md; current Git history/status; canonical CashNarra concept and technology decisions; previous CashNarra elite UI/UX audit; and `CashNarra_Export_Experience_Audit_and_Design_Blueprint.md`. Inspect the actual local `src/lib/exports.ts`, report/domain logic, export modal, tests, assets and current build outputs. The user-supplied `CashNarra_2026-10-19_2026-10-19.csv` and `.pdf` are reference evidence, not permission to hard-code user data. Confirm whether local files contain changes absent from GitHub HEAD 3b4d1f89fed8c079cc3571aeff6276bfe5f04d92. Do not reset or overwrite work.

MISSION: Transform PDF into a professionally typeset, recognisably CashNarra, print-friendly, accessible, traceable report. Transform XLSX into a styled, multi-sheet numeric/date-typed workbook useful for analysis. Transform CSV into a documented, rectangular machine-friendly transaction export with correct financial meaning. Improve the export selection/recovery/privacy user experience. Implement in phases E0–E6 with small verified commits and durable checkpoints.

ACCOUNTING GUARDRAILS: authoritative numbers come only from existing ledger and report functions. Cash received ≠ sales, cash out ≠ all expenses, old debt payment ≠ new sales, credit sale ≠ cash receipt, owner withdrawal ≠ operating expense, transfer ≠ external outflow, goal assignment ≠ money movement, net movement ≠ profit, unknown ≠ zero. Preserve posted record/source IDs, correction links, workspace isolation and retention rules. Do not edit Supabase RLS, ledger posting, AI authority, database migrations or production services for the sake of export cosmetics.

BASELINE: git status/log/HEAD; inspect all export code and existing tests; generate baseline artifacts on synthetic fixtures; compare against supplied CSV/PDF, including the fact that supplied files have `Recorded expenses` while committed `exports.ts` lacks the corresponding summary line. Reconcile differences in actual local code. Record baseline output and existing test results before editing.

IMPLEMENT E0: fixtures and tests. E1: one read-only format-neutral exact-decimal export model derived from domain report and journal, including cash effect per financial event. E2: rectangular transactions CSV with stable schema, quoted/BOM/CRLF/anti-formula safeguards tested, separate auxiliary data rather than mixed row widths. E3: XLSX with Overview, Transactions, Accounts and Obligations, typed numbers/dates, filters/frozen rows, branded headers, preserved UUIDs and formulas used only for useful verification, not authoritative ledger. E4: PDF branded masthead, right-aligned exact amounts, meaningful summary, row hierarchy, account/debt details, audit references, print pagination, privacy caveat, correct cedi glyph, metadata, and real PDF accessibility verification or clearly documented accessible HTML fallback. E5: purpose-led export UI, date/workspace check, privacy/unmask warning, one dynamic Download CTA, correct error and completion message. E6: independent multi-format cross-check and snapshot/render/AT/mobile tests.

TEST with nine-event illustrative dataset: received 8000.00, paid 14820.00, net -6820.00, sales 5000.00, recorded expenses 10380.00, owner withdrawal 4440.00, recorded balances 8680.00, outstanding at end 0.00/0.00. Also test credit sale 2000.00 with no cash receipt and 5000.00 of old receivable receipts without sales duplication. Test transfers, owner money, unknown opening, long descriptions, dangerous CSV cells, exports while masking, expired raw source, more than one page and unknown network/download outcome. Verify CSV field count; XLSX typed numeric/date values; PDF no clipped/overlapping text and no falsely claimed tagged accessibility; exact source ID provenance across formats.

Do not introduce extra reporting servers, new payment/bank integrations, charting frameworks, OCR, tax filing, fictional branding claims, unverified profit or third-party telemetry. Reuse existing CSS tokens and libraries where feasible, only select new libraries if actual requirements justify them. No hardcoded customer data beyond test fixtures; no secrets or production data in tests/screenshots/commits; no live deployment or external API costs without authorisation.

CHECKPOINT after each phase with changed files, commands/tests/results, visual evidence, issues, next steps and SHA. If interrupted, resume from latest verified checkpoint. Final report: exact file changes; sample generated PDF/XLSX/CSV compared with reference; output semantics and reconciliation; accessibility status; every EXP ID as PASS/FAIL/BLOCKED/DEFERRED; test/build results; Git commits; pre-launch limitations. Never call output complete based only on a successful build.
```

## 13. Independent final verification prompt

```text
Act as an INDEPENDENT CashNarra export release reviewer. Read the approved export audit and the local working tree, not the implementing agent's claims. Run actual exported files from current application logic under local synthetic/authenticated test accounts and compare them, field by field, to authoritative domain report values. Validate non-cash/credit/settlement/transfer/owner/unknown semantics; CSV rectangularity + formula injection; XLSX numeric/date types, styles and worksheets; PDF branding, print pagination, font glyphs, metadata, reading order, tagged PDF or accessible alternative, and full UUID provenance. Test 1, 9 and 100 transactions; multilingual descriptions, wrapped names, very large amounts, and masked UI. Check the export modal honestly reports started downloads vs completed saves and never logs raw financial data. Rerun existing repo test/build and relevant E2E suites. Review the Git diff for changed ledger/auth code and unexpected dependencies. For every EXP-001 to EXP-017 give PASS/FAIL/BLOCKED with concrete command/path/screenshot evidence. Do not claim accessibility conformance without accessible-document verification; do not claim any production launch approval. Do not silently patch during independent verification.
```

## 14. Supporting research references (official; retrieved 19 October 2026)

1. [RFC 4180 — Common Format and MIME Type for CSV Files](https://www.rfc-editor.org/rfc/rfc4180): describes fixed column counts within a CSV table, quoting and line conventions. Its status is informational, not a regulatory duty.
2. [OWASP — CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection): formula-injection attack patterns and caveats concerning escaping strategies in spreadsheet applications.
3. [W3C WAI — PDF3: Ensuring correct tab and reading order](https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF3): meaningful structure and AT reading order; sufficient technique, not a blanket legal requirement.
4. [Microsoft Support — Format numbers](https://support.microsoft.com/en-us/excel/format-numbers): numeric/date formatting and treatment of imported text.

These sources support interoperable and accessible-format recommendations; none establishes an observed CashNarra conversion uplift, legal audit approval or production accessibility certification.

## 15. Final directive

**Fix data meaning and format architecture first, then report layout, then export dialog polish.** A beautiful PDF with misleading totals is worse than the current plain report; a colourful spreadsheet with all numbers stored as text is not a usable workbook; and a CSV that mixes five different row shapes is not a dependable transaction interchange file. Preserve the correct ledger, implement true format-specific exports, and express the CashNarra visual identity with discipline.
