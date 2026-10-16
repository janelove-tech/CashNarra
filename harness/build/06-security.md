# Phase 06 — Supabase, RPC, and RLS security hardening

## Purpose

Keep the narrow ownership model and close gaps against current Supabase and PostgreSQL guidance.

## Review before editing

Read current official guidance for `SECURITY DEFINER`, `search_path`, and grants. Do not weaken RLS to make tests pass.

## Harden where the code requires it

- Definer functions and private implementation functions.
- Schema qualification and a hardened `search_path`.
- Exact grants and explicit `auth.uid()` checks.
- Client write boundaries, receipt ownership, and move/settlement ownership.
- Browser secret exposure and cache headers.

## Prove

User A cannot list, infer, read, mutate, settle, move, or retrieve receipts for User B.

Re-run concurrency, idempotency, and rollback tests after SQL changes.

## Acceptance

- Isolation tests cover the actions above.
- SQL changes still pass `npm run test:db`.
- `npm run test:supabase` is PASS only if executed against local Supabase; otherwise NOT RUN with the reason.
- No service-role key is added to client code.
