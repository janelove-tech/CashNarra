# Phase 04 — Core narration/review UI refactor

## Purpose

Split the central client component into maintainable boundaries without a visual redesign.

## Preserve

Narra v2, visual hierarchy, narration prominence, Today / Records / Money Stories / Plan, clarification, compact review, record rows, stories, plans, dialogs, and existing accessibility behaviour.

## Likely boundaries

Use these only if they match the code:

```text
AppShell, TodayView, CaptureFlow, Clarification, BatchReview,
RecordsView, RecordDetail, MoneyStoryView, PlanView, AccountsView,
SettingsView, useWorkspaceData, useDraftRecovery, useSaveRecovery
```

Choose cleaner boundaries when the current file already has them. Do not create files mechanically.

## Acceptance

- User-visible narration, review, save, correction, stories, and plan flows still behave as before.
- The main client file is no longer the only place those behaviours live.
- Browser verification covers the changed flows, including a mobile width.
- No Narra v2 token or layout redesign.
