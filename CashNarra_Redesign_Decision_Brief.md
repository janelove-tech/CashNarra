# CashNarra — Redesign Decision Brief (19 October 2026)

## Executive decision
Keep the financial architecture and rebuild the experience around one visually memorable, safe transformation: **Natural narration → accurate proposed events → human confirmation → source-backed financial understanding**. Creative direction: **The Living Ledger**; continue CashNarra violet/ink/apricot, existing paired speech mark (optical refinement) and Inter/Manrope, with clearer hierarchy and less prose.

## Immutable audit facts
- GitHub repository: https://github.com/janelove-tech/CashNarra (main @ `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92`).
- The screenshots **do not fully match this HEAD**, especially the long public landing and split-screen authentication. Cursor must reconcile the local checkout first.
- The public demo API is intentionally disabled on Vercel even though the committed landing has a server-demo CTA: replace with **fictional client-only preview**.
- Existing exact ledger, atomic posting, Supabase Auth/RLS, source corrections, debt and goal semantics must be preserved.
- Current `cashnarra.tsx` has ~2550 lines; extract presentation components incrementally, not a rewrite.
- No live browser or local tests were independently rerun during this audit.

## First five implementation priorities
1. **Baseline reconciliation and protection** before modifying local work.
2. **Public hero with a fictional worked example** showing several correctly classified events and an honest CTA.
3. **Inline Today composer and focused one-tap clarification** with a readable batch review/save, preserving request-receipt recovery.
4. **Money Stories/Records/Accounts hierarchy:** Money In, Money Out, Net Movement (not profit), dates, debt settlement vs sale, traceable records and unknown balances.
5. **First-use, goals and privacy polish:** no onboarding questionnaire, progressive goal review, grouped settings, accurately gated voice, mobile/accessibility verification.

## Safeguards and process
Build in small Git-checkpointed phases. Use Next.js/TypeScript/CSS Modules, Supabase Free/local data and mocked AI for routine development. Do not activate production services, deploy, rewrite ledger or silently alter permissions. Verify 320/360/390/768/1024/1440 with keyboard, focus, reduced motion, authentic registration, save-recovery and financial regression tests.

## Hand-off
- Complete report, including the export audit and the implementation prompts: `CashNarra_Elite_UX_Audit_COMPLETE_with_Exports_2026-10-19.md`

**Commercial goal:** Visitors understand the value immediately; first-time users save one trustworthy story; returning users recognize exactly where to resume.
