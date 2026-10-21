<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CashNarra agent rules

The repository is the shared memory for Cursor, Codex, and any later agent. Do not rely on conversation history.

## Startup

Before changing product code, read `GOALS.md`, `PLANS.md`, `harness/CURRENT.md`, the latest `harness/build-log.md` entries, and only the in-progress `harness/build/<phase>.md`. Then compare Git (`branch`, `HEAD`, `status`, recent log) with `CURRENT.md`. Continue from **Exact next action**. Do not restart a full audit because a session is new.

## Source precedence

1. Current explicit user instructions.
2. Final decisions in `Research CashNarra Concept.txt`.
3. Final decisions in `Recommend Technology Stack.txt`.
4. `CashNarra_Design_Kit_v2` / Narra v2.
5. Earlier notes, including `Storyline handoff package.txt` and historical status docs, only where not superseded.

Status documents are evidence, not proof that current code works. Voice is required in V1 by user decision on 16 October 2026. That overrides older notes that deferred voice.

## Product

CashNarra turns ordinary money stories into trustworthy records, understanding, and realistic planning. Structure: Record, Understand, Plan. Serious money, light interaction. Tell, tap, done. Do not confirm the obvious; clarify the important.

V1 includes personal/business workspaces, typed narration, and voice narration through the same pipeline. CashNarra organises money. It does not move money. Do not add banking, wallets, MoMo or card payments, lending, investment advice, tax filing, POS, inventory, payroll, HR, CRM, ERP, or automatic bank/MoMo aggregation. Receipt OCR, statement import, rich collaboration, and sophisticated forecasting stay later unless the user explicitly changes scope.

## Locked presentation

User decision, 19 October 2026. Do not undo these while changing nearby layout, copy, or exports.

The logo mark is violet `#5B49C7`. The CashNarra name stays ink `#29263D`. Light screens use `public/brand/cashnarra-logo.svg`. Do not use the all-violet lockup or the all-ink lockup there. Dark surfaces use the white reversed lockup. Icon-only marks use `cashnarra-symbol.svg`. Do not redraw the mark as squares.

The activity PDF stays the two-page designed report: violet mark, ink name, dark summary card, colored activity table, accounts and cash-movement page, and the private-record footer. Figures come from the ledger report. Do not replace it with a plain text list, paint the PDF name violet, or hard-code the specimen amounts.

## Financial invariants

Money received is not automatically income. Money paid is not automatically an expense. A sale is not a cash receipt. A transfer is not spending. A loan received is not revenue. Loan principal repayment is not an operating expense. Owner contribution is not sales. Owner withdrawal is not a business expense. A credit sale is not a cash receipt. Receivable settlement is not another sale. Payable settlement is not another expense. Stock purchase is not automatically a profit expense. Goal allocation is not money movement. Missing or unknown information is not zero. Do not fabricate profit.

Authoritative money uses exact decimals. Accepted journals balance. Batch saves are atomic. Retries are idempotent. Corrections keep history and provenance. Never show Saved before authoritative persistence succeeds.

Preserve the deterministic ledger, atomic workspace commit, receipts, and TypeScript plus PostgreSQL posting model. Harden them. Do not replace them with a rules engine or a rewrite.

## AI and voice

AI may propose structure and explain. AI must not authorise access, write the ledger, calculate authoritative balances, report totals, or goal forecasts, decide that persistence succeeded, or receive uncontrolled database authority.

Voice is V1 and quality-gated. Flow: record, transcribe, editable transcript, the same narration interpretation, material clarification, compact review, user confirmation, deterministic save. Typed narration stays available. Transcription is not confirmation. Voice must not post records automatically.

## Security

Strict tenant isolation. Server-only secrets. No service-role key in the browser. No public cache of authenticated financial responses. Privileged functions must check ownership explicitly.

## Workflow

One coding phase is normally in progress. Phase 09 stays external until the user decides. Do not mark a phase complete while tests you ran are failing. Use labels PASS, FAIL, HISTORICAL PASS, NOT RUN, and EXTERNAL. HISTORICAL PASS is not PASS.

After each coherent unit, update `harness/CURRENT.md` and `harness/build-log.md`. If you stop mid-phase, write `INCOMPLETE — DO NOT TREAT AS PHASE COMPLETE` and an exact next action. Never put secrets in the harness.

Do not spend money, enable production providers, migrate production data, or deploy production without explicit user approval. Do not reset a non-disposable database.

## Customer language

Customer-facing text must use ordinary English and explain the customer's action or benefit. Use the approved wording in the current pricing handoff. Keep provider details, environment variables, development status, database terms, quota implementation, and diagnostics in owner/developer views.

An inactive purchase does not remove the plan's prices or benefits. Show the complete finished package without preview, coming-soon, not-for-sale, or availability notes on the pricing page. Keep readiness checks private and finish the advertised features before launch. Genuine service errors belong beside the attempted action. Never describe an internal processing guard on a pricing card.

Use one clear benefit heading and a smaller explanation where needed. Distinguish unlimited saved financial records from the stated AI-story allowance. Never promise a successful save, payment, or transcription before there is evidence.

Apply these rules to headings, buttons, tooltips, errors, empty states, emails, exports, and agent progress/final summaries. In messages to the owner, lead with what works, what changed, and the exact blocker; give implementation detail only when it is needed or requested. Before finishing a UI change, review the rendered words as well as the code.

## Product quality and current reader recovery

### Current owner decisions — 21 October 2026

The owner reports topping up the existing OpenAI API account and explicitly approves **US$20 total cumulative local evaluation spend**, including all previous usage and unresolved holds. This supersedes the previous US$10 ceiling. Preserve every historical budget event and approval; do not reset the journal or create a second allowance. The latest user instruction takes precedence over this dated ceiling if it changes later.

The one bounded verification already succeeded on 21 October 2026. Do not repeat it. A later story was held as unpriced; price that returned usage from the published Luna card and keep the exposure until a real price exists. Do not resend that story. See `docs/SUBSCRIPTIONS_WHAT_IF_AND_FOLLOWUP.md`. Use `docs/READER_RECOVERY.md` only when a current billing pause actually matches.

The local Groq key and Free-plan confirmation have been reported supplied, and a transcript was shown. Verify current state before asking for them again. Keep free-only transcription and reuse completed transcripts. No paid fallback, automatic top-up, deployment, or customer charge is authorized by this instruction.

### Product quality is part of implementation

Follow the always-applied rules in `.cursor/rules/`. A task is not finished because code compiles. The affected customer flow must be understandable, reachable, visually coherent, and checked in the rendered app.

Keep ordinary customer language separate from owner diagnostics. Lead each screen with the person's next action or useful result. Give each task one clear primary action. Keep advanced controls secondary, labels beside their fields, and the main dialog action fully visible and reachable. Preserve drafts through errors and recovery.

Customer pricing shows the finished Free and Plus offer without development or availability notes. Unlimited remains private and disabled. Account usage must use genuine account-level counters; examples belong in a separate demo, never as the signed-in account's main meter. Unknown usage is not zero.

Use the screenshot review to fix specific regressions rather than restart an indiscriminate redesign. Preserve truthful financial meaning, exact authoritative calculations, provenance, confirmation, and tenant isolation.

### Evidence before completion

Use the acceptance checks in `docs/UI_ACCEPTANCE.md` for changed flows. Record actual viewport sizes and states tested. Inspect the rendered words and screenshots; include short viewport, zoom, keyboard, and error recovery where relevant. Never label an unrun check PASS, claim a real speech-quality result from mocks, or claim accessibility certification from automated checks.

Update `harness/CURRENT.md` and the build log after each coherent unit. Distinguish what is historical, what was inspected now, what was tested, and what remains blocked. Keep secrets and raw private financial stories out of those logs.
