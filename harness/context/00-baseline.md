# Baseline discoveries — 16 October 2026

Live Git matched the forensic audit. `main` and `origin/main` were `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92`. No other local or remote branches existed. The only untracked file was `docs/Repository Audit Plan 1248pm 16th October.txt`.

`codex/cashnarra-v1-remediation` did not exist, so the programme branch is `work/cashnarra-v1`.

User decision on 16 October 2026: voice input is required in V1 and remains quality-gated. It must use the typed narration pipeline. Older status notes that defer voice are superseded for scope, not for the no-automatic-post rule.

Confirmed payable gap, not yet changed in Phase 00: `credit_purchase` posts stock against a payable. `expense` always credits a cash account. PostgreSQL `payable_payment` accepts only `credit_purchase` and `opening_payable` (`supabase/migrations/202610130001_core.sql`).

`src/server/ai.ts` model default is `OPENAI_MODEL` or `gpt-4.1-mini-2025-04-14`. Recheck official OpenAI docs before changing it in Phase 02.

`scripts/test-db.ts` refuses any database that is not localhost and named `cashnarra_test`. `playwright.config.ts` uses `channel: "msedge"`. `npm run doctor` requires Node 24 and `SITE_URL`.
