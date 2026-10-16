# Phase 02 — AI and general narration quality

## Purpose

Prove that ordinary, messy descriptions become financially correct proposals, or a material clarification, without the model posting or guessing.

## Already observed

Read `harness/context/02-narration-gaps.md` before editing `src/server/ai.ts`.

## Recheck the model first

`src/server/ai.ts` defaults to `process.env.OPENAI_MODEL || "gpt-4.1-mini-2025-04-14"`.

Before changing that default, read current official OpenAI model and deprecation documentation. Keep `OPENAI_MODEL` configurable. Do not rewrite the Responses API boundary if it still fits. Do not call the live API unless the user has already opted in and a local key exists. Evaluation that needs a provider is EXTERNAL when no key or budget approval exists.

## Interpretation contract

Review and fix, with tests that do not require a live model where the rule is deterministic:

- Workspace type is supplied to interpretation.
- Ambiguous party, missing transfer destination, missing account, and missing amount become clarification, not guesses.
- Obligation linkage is explicit.
- Model uncertainty is distinct from deterministic validation failure.
- Proposal IDs are application-generated where the current design should own them.
- Foreign or invalid account identifiers are rejected.
- The model cannot post, authorise, or calculate official totals.

## Evaluation corpus

Create synthetic, human-reviewable cases. No real customer data. Include multiple events in one narration, cash sales, Bank, MoMo, mixed receipts, credit sales, debt settlement, partial settlement, stock purchase, stock on credit, operating expense on credit, payable settlement, loan receipt, principal, interest, owner contribution, owner withdrawal, transfers, corrections, ambiguous narration, missing amount, missing account, missing person, colloquial Ghanaian English, `2k` and `4.5k`, “momo”, common Ghanaian names, irrelevant text, and prompt-injection-like narration.

For safety-critical cases the result must match the expected meaning or ask the expected clarification. A JSON-valid response is not a correct financial response.

Record metrics such as expected-kind match, expected-clarification match, silent-guess count, and invalid-id count. Separate fixture/mock results from live-provider results.

## Acceptance

- Contract gaps found in code are fixed or explicitly blocked.
- Corpus exists in the repo and can be reviewed without a provider.
- Live evaluation is PASS only if this agent ran it, otherwise EXTERNAL or NOT RUN.
- No direct posting path is added.
