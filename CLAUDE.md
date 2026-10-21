# CashNarra — Claude Code notes

Read `AGENTS.md` first. It is the shared rule set for every agent in this repository, and it wins over anything here. Then follow its startup order: `GOALS.md`, `PLANS.md`, `harness/CURRENT.md`, the latest `harness/build-log.md` entries, and the in-progress `harness/build/<phase>.md`. Compare Git with `CURRENT.md` before changing product code, and continue from **Exact next action**.

## Where the design truth lives

- Screen contract: `docs/ux/CASHNARRA_FINAL_HANDOFF.md` (section 15 for app screens, section 8 for the landing page).
- Design decisions from the 21 October 2026 UI pass: `docs/ux/UI_DESIGN_RECORD_2026-10-21.md`.
- Tokens: `src/app/tokens.css` and `src/design/tokens.json`. Brand guide and assets: `CashNarra_Design_Kit_v2/`.
- Acceptance checks: `docs/UI_ACCEPTANCE.md`. Observed problems: `docs/UI_REVIEW.md`.
- Always-on product rules: `.cursor/rules/*.mdc` (logo, activity PDF, customer language, UI/UX, delivery).

## Rules that must survive any edit

- Money received is not income; a sale is not a cash receipt; a transfer is not spending; a debt payment is not another sale; a loan is not revenue; goal marks do not move money; unknown is not zero. Never fabricate profit. Net movement is not profit.
- Exact decimals, balanced journals, atomic batch saves, idempotent retries, provenance and correction history stay in the deterministic ledger. AI proposes and explains; it never writes the ledger or reports totals.
- Show Saved only after the authoritative receipt. A transcript is not a saved record. A review is not a payment.
- Strict tenant isolation, server-only secrets, no public cache of private financial responses.
- Customer-facing words are ordinary English with the customer's next action first. Provider names, budgets, pauses, phase numbers and diagnostics stay in owner or developer views.
- Logo: violet mark `#5B49C7`, ink name `#29263D`, reversed white lockup on dark surfaces. Activity PDF stays the designed two-page report.
- Pricing shows the finished Free and Plus offer with USD first and a dated cedi estimate. Unlimited stays private. Choose Plus opens a review and never claims a charge.

## Working here

- Dev server: `npm run dev` (port 3100). Browser tests: `npm run test:e2e` (Edge, reuses the running server). Unit tests: `npm test`. Typecheck: `npm run typecheck`. Lint: `npm run lint`.
- The fictional workspace opens by posting to `/api/demo`, then visiting `/app`. Use it for every UI check; never real financial stories.
- No provider call, payment, journal change, database reset, migration or deployment without explicit owner approval. The cumulative local evaluation ceiling is in `AGENTS.md`.
- After each coherent unit, update `harness/CURRENT.md` and `harness/build-log.md` with PASS, FAIL, HISTORICAL PASS, NOT RUN or EXTERNAL. Never relabel an unrun check.
- Cursor may be editing the same checkout. Check file modification times before editing a file you have not touched recently, and never discard or stash another agent's changes.
