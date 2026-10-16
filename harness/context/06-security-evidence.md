# Security review — 2026-10-16

Official sources fetched:
- https://www.postgresql.org/docs/17/sql-createfunction.html
- https://supabase.com/docs/guides/database/functions

Existing application relations are schema-qualified. Migration 010 sets empty search_path on the five SECURITY DEFINER functions, removes PUBLIC/anon execute, preserves authenticated execute only on the four user operations, and leaves global source minimisation maintenance-only. Public schema CREATE is revoked from client roles. Trigger function direct execute is revoked. Existing explicit auth.uid ownership and RLS are unchanged.

PASS: disposable test:db after migration, including function ACL/search_path assertions, denied schema creation, concurrent settlements, idempotency, atomic move rollback, owner table/receipt/RPC isolation. PASS: actual local Supabase SDK suite before and after additive migration 010. Applied only 010 using the pinned localhost:58322 connection; 20 existing workspace rows preserved. No reset, migration-up, migration-history rewrite, production change, or service-role browser code.

The legacy migrations' search_path declarations are superseded by migration 010. Local schema_migrations history is still incomplete; do not infer that a blanket migration-up is safe. Future fresh databases run all files in order. This is test evidence, not a complete independent security audit.
