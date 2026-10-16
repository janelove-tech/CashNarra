# Phase 01 — Financial semantics and posting parity

## Purpose

Close the ordinary-expense payable gap and make TypeScript and PostgreSQL posting drift obvious, without replacing the current architecture.

## Confirmed gap

Stock bought on credit already posts `Dr Stock / Cr Payable` through `credit_purchase`.

A cash operating expense posts `Dr Expense / Cr Cash` through `expense`.

There is no event for an operating expense incurred on credit. `payable_payment` in `supabase/migrations/202610130001_core.sql` only links to `credit_purchase` or `opening_payable`. Paying an electrician later must not create another expense.

## Required behaviour

Narration: “The electrician repaired the shop for GH₵800 and I'll pay him next week.”

```text
Dr Expense
Cr Payable
```

Later payment:

```text
Dr Payable
Cr Cash/Bank/MoMo
```

Keep stock on credit as:

```text
Dr Stock
Cr Payable
```

Add the smallest explicit domain event, `credit_expense`, or an equally clear name if the existing type system already has a better fit. Do not build an enterprise accounts-payable module.

## Layers to update together

- `src/domain/types.ts`
- `src/domain/ledger.ts` labels, posting, obligations, and any settlement rules
- PostgreSQL `commit_workspace` posting, party requirement, account-null rule, and payable settlement linkage
- Planning, manual record form, review labels, reports, exports, corrections, fixtures
- AI structured schema and prompt so the model can propose the event and cannot post it
- Unit tests, database tests, and an e2e case if the current suite already covers manual record posting

## Posting parity

Add a table-driven test that states the expected debit and credit template for every supported event kind and checks the TypeScript poster against that table.

PostgreSQL remains the authoritative poster. Add a database assertion that the same fixtures produce the same account keys and signed amounts as TypeScript. Do not introduce a rules engine.

## Invariants to preserve

Exact decimals, balanced journals, atomic commit, idempotent retry, unknown is not zero, credit sale is not cash, settlement is not a new sale or expense, loan principal is not an operating expense, owner movements are equity, transfers are not spending.

## Acceptance

- Credit expense creates a payable and an expense, and moves no cash account.
- Settlement reduces that payable and cash, and does not add a second expense.
- Stock-on-credit behaviour stays intact.
- All existing event kinds still post as before.
- Parity test fails if TypeScript and PostgreSQL templates diverge.
- Focused unit tests and `npm run test:db` pass, or failures are recorded honestly.
- No rewrite of the workspace-commit model.

## Context

Add `harness/context/01-financial-semantics.md` only if implementation discovers something a later session would otherwise have to rediscover.
