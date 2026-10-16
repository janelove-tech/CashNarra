# Phase 05 — Data loading and offline hardening

## Purpose

Make reads cheaper and recovery safer without speculative schema normalisation.

## Direction

Keep the V1 workspace aggregate unless measurement shows it is inadequate. Prefer a list of workspace summaries plus one workspace state fetch. After a mutation, refresh the affected workspace rather than every workspace.

Measure a realistic synthetic workspace: response bytes, server time, parse time, render time, and refresh cost.

## Preserve

IndexedDB drafts, stale revision protection, user and workspace scoping, public-only service-worker cache, retry identity, and private backup/restore.

Offline drafts are not authoritative records. Reconnection does not auto-post.

## Acceptance

- Simple list operations do not require every full workspace payload.
- Mutation refresh is scoped.
- Draft, logout, and failed-save behaviour still holds.
- Measurements are recorded. Unavailable timings are NOT RUN.
