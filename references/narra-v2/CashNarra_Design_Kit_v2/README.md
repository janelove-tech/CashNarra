# CashNarra — Narra design kit v2

Open **CashNarra_Interactive_Preview.html** in a desktop or phone browser. It is self-contained: no install, network calls, backend or API key. It uses only fictional Ama Works data. The identity and artwork are proposed concepts.

## Start with these

- **CashNarra_Interactive_Preview.html:** inspectable UI. Try Today → Tell your story → Try an unclear version → Understand → choose an account → Review → edit → Save → Money Story. Search Records, open Abena's payment, record a part payment, explore a what-if, and try dark appearance / hidden amounts.
- **CashNarra_Brand_and_Product_Design_Guide_v2.pdf:** complete brand, UX, financial presentation, accessibility, privacy, research and implementation guide. The Markdown and HTML are editable sources.
- **CashNarra_Implementation_Brief_v2.pdf:** one-page starting brief.
- **CashNarra_Identity_Board.png:** selected identity at a glance.
- **marketing/:** three campaign concepts; each has 1080×1350 feed and 1080×1920 story PNGs and editable HTML/CSS. Two three-page PDF sets are RGB review masters.
- **assets/:** outlined SVG wordmark/lockups, filled speech symbol, app-icon SVG/PNGs, locally supplied fonts/licences and Lucide icon paths/licence.
- **tokens/:** semantic light/dark JSON and matching CSS custom properties.
- **screens/:** 16 standalone inspectable states plus selected PNG exports.
- **applications/:** landing hero, onboarding email, private Money Story share and the checked two-page illustrative report.

## What actually works in the demo

Example narration → necessary account clarification → eight-record review; draft and confirmed-record edits; local mock save; search and movement filters; partial receivable settlement; deterministic contribution what-if; CSV export; dark appearance; hidden amounts; modal focus and Escape behaviour. Corrections recompute affected balances and receipt/outflow totals; the original source remains visible. A scenario never changes actual records.

The mock interpretation supports the supplied example and its unclear delivery-account variant. It does not pretend to understand arbitrary narration. Changes are in browser memory and reset when the document is reloaded. It does not store or send real financial data. The “saved” screen is explicitly labelled as a design demo.

## What remains a design preview

Real authentication and workspace creation, provider AI extraction, authoritative ledger posting, duplicate detection, split/move/remove and full audit persistence, IndexedDB/service-worker recovery, microphone/audio processing, account/goal creation, new goal allocations, weekly/monthly reports, real reminders, retention/deletion and private sharing need production implementation. Their guide specifications and preview states are not live services. The voice screen does not access the microphone. The offline screen simulates recovery.

## Implementation path

Keep the agreed **Next.js / React / TypeScript / CSS Modules, managed Supabase and intended Vercel** direction. Start locally and with Supabase Free; mock AI for routine development. This kit adds no hosting account, paid plan or deployment. Translate the inspectable layouts into components; do not ship the monolithic demo as the financial application.

Use semantic tokens, exact decimal arithmetic, tenant isolation, atomic idempotent saves, traceable corrections and deterministic totals. Keep component responsibilities separated: AppShell, Composer, Clarification, BatchReview, RecordRow, Ledger, RecordDetail, AccountCard, MoneyStory, Goal, Scenario, Settings and Feedback. Production money figures come from validated ledger calculations, never from an AI-generated paragraph.

Self-host fonts with next/font/local; convert/subset production font files to WOFF2 as appropriate. **All financial amounts use Inter**, which includes ₵ and tabular numerals. Manrope in this kit lacks ₵ and is reserved for headings/wordmark. Retain font licence files. Import Lucide icons individually or use the provided licensed paths.

## Verification and boundaries

The checked seed has money received GH₵2,300.00; money paid out GH₵930.00; net movement GH₵1,370.00; recorded closing balances GH₵5,970.00; people owe GH₵700.00; user owes GH₵1,500.00. Sales value GH₵2,400.00 is different from money received. Transfer and goal allocation are not expenses. Profit is unavailable in this dataset.

The checks folder records contrast calculations and functional/responsive inspection. WCAG 2.2 AA is a design target; these checks are not a complete accessibility audit, legal certification, forecast validation or evidence of user adoption. Run the guide's representative-user, assistive-technology and production recovery tests before launch.

The guide retains Ghana-specific applicability questions and provider/privacy launch conditions from the approved product and stack scope. There is no regulator approval, licence exemption claim, bank affiliation, protected balance or financial guarantee.

## Campaign use and asset provenance

The logo is original vector concept artwork and needs actual trademark clearance. Typography and Lucide licences are included. The studio photograph is an **AI-generated fictional campaign model**, not a real user or testimonial. The flyers label proposed UI and fictional data. “Coming soon” is intentional; no live URL, app-store listing, pricing or invented waitlist has been inserted. Before posting, set a genuine destination and check each platform's UI overlays. Before professional printing, preflight colour, bleed, trim and output profile.

The redesigned specifications in this kit are the current visual handoff. Use these tokens and assets consistently across the product, campaigns and reports.
