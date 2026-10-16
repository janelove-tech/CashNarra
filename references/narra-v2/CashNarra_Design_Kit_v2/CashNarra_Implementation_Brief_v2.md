# CashNarra Implementation Brief — v2


**Product:** CashNarra. **Tagline:** Tell Your Money Story. See the Numbers. **Structure:** Record → Understand → Plan. **Principle:** Serious money. Light interaction.

**Direction:** Narra — words into clarity. Filled opposing speech shapes; outlined Manrope 800 wordmark. Violet #5B49C7, ink #29263D, apricot #FFC4A0, paper #F7F7FA, tint #F0ECFC. White surfaces. Dark values and status roles come from the supplied semantic tokens. No mascot, financial glow or stock finance imagery.

**Type:** Manrope 700–800 for headings; Inter 400–600 for copy and all amounts. Inter supports ₵ and tabular numerals; the supplied Manrope does not. Desktop page 32/40; mobile 27/34; amount 40/48 desktop, 37/46 mobile; editable fields 16/26. Minimum effective touch target 44 px, primary mobile flow action 48 px. Control radius 12, surface 20, hero/dialog 24. 4 px spacing scale.

**Navigation:** Today / Records / Money Stories / Plan. Accounts and workspace selector in app chrome; settings and privacy accessible directly. Sidebar 224 px; bottom navigation 72 px at 760 px and below. Mobile home makes narration visible before secondary metrics. Search never requires chat.

**Reusable pieces:** AppNavigation, Button/IconButton, TextInput/Textarea, Composer, SourceQuote, AccountChoice, RecordRow, BatchSummary, SegmentedFilter, AccountCard, StatusBadge, GoalProgress, Rhythm, StoryPreview, Notice, Dialog, Feedback. Keep working rows level, aligned and lightly separated. Don't box every paragraph.

**Signature behaviour:** words → important question only → compact batch review → confirmed saving → traceable Money Story. Every important number opens its records/period/assumptions. Correction preserves the original source and updates affected totals. Rest and catch-up never erase history; check-ins never assert completeness.

**Safeguards:** locally captured is not saved; unknown is not zero; transfer isn't spending; old debt payment isn't new sales; allocations aren't money moved; forecasts aren't affordability guarantees. Save atomically with idempotent posting, exact decimals and tenant isolation. Retain narration through processing/save errors. Resolve Ghanaian launch applicability and provider/retention questions from the stack guide. Target WCAG 2.2 AA; don't claim tested conformance.

**Build order:** Next.js/React/TypeScript/CSS Modules locally; Supabase Free with migrations and synthetic seed data; mock AI first. Build accounts/openings, text extraction, clarification, review/save and correction; then traceable Money Stories and exports; then goals/scenarios; short voice after text validation. Intended production host remains Vercel subject to terms/actual operational needs. No paid deployment is authorised by this handoff.

**Start now:** inspect the interactive preview, copy tokens and outlined mark, implement the narration/review loop with the shared Ama Works dataset, then verify 320 px reflow, keyboard and save recovery. Campaign assets are proposed: three concepts, feed and story exports. The demo is a design tool, not a production financial application.
