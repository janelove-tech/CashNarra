# Financial semantics discoveries

`credit_expense` is the event for an operating expense incurred on credit.

Posting:

- Incurred: debit `expense`, credit `payable:<record id>`. No cash account. A person is required.
- Later payment: existing `payable_payment`. It reduces the payable and the chosen Cash, Bank, or MoMo account. It does not add another expense.
- Stock on credit remains `credit_purchase`: debit `stock`, credit `payable:<record id>`.

TypeScript posting templates for every kind are in `tests/posting-parity.test.ts`. PostgreSQL `commit_workspace` is replaced in `supabase/migrations/202610160009_credit_expense.sql`. `scripts/test-db.ts` compares the disposable database journal with `ledger()` after the fixture commit.

Local Supabase project `cashnarra-development` (port 58322) had 18 workspaces. Its `supabase_migrations.schema_migrations` table only lists `202610130001` through `202610130003`, while later functions such as `guard_planning_history` already exist. Do not run `supabase migration up` or `supabase db reset` against that database. The credit-expense function was applied with `psql` on 16 October 2026. Workspace count stayed 18.

Browser verification saved one synthetic Ama Works record, “Electrician repaired the shop”, GH₵800, unpaid operating expense, dated 2026-10-13. Recorded balances stayed GH₵5,970.00 and money out stayed GH₵930.00. That was the local demo workspace, not production.
