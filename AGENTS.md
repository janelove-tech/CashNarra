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
