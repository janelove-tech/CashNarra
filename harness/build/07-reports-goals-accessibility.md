# Phase 07 — Reports, goals, exports, and accessibility

## Reports

Verify daily, weekly, and monthly totals; traceability; transfer exclusion; debt semantics; unknown state; and no unsupported profit. Credit-expense postings from Phase 01 must appear as expenses when incurred and must not appear again when paid.

## Goals

Verify deterministic actual allocation, current pace, insufficient data, zero and negative pace, competing goals where supported, visible assumptions, and isolated what-if. Never describe a scenario as a guarantee.

## Exports

Verify CSV, PDF, and XLSX; GH₵ rendering; long values; correction and provenance references; formula-injection safety; and totals.

## Accessibility

Target WCAG 2.2 AA. Automated checks are evidence, not certification.

Cover keyboard-first critical workflows, visible focus, dialog trap and restore, processing/error/success announcements, error association, 320px reflow, 200% and 400% zoom, reduced motion, contrast, 44px targets, hidden-amount names, and representative screen-reader notes. Mark physical assistive-technology checks NOT RUN when they were not performed.

## Status

Implemented on `work/cashnarra-v1` after Phase 06 commit `4897fc0`. Evidence: `harness/context/07-accessibility.md`.

## Acceptance

- Report, goal, and export tests cover the cases above.
- Accessibility evidence is recorded with honest labels.
- No profit figure is invented when inputs are insufficient.
