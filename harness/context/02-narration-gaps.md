# Narration gaps already visible

No live model call has been made in this programme.

`src/server/ai.ts` `realExtract` sends `mode`, `date`, `accounts`, `originalRecords`, `obligations`, and `narration`. It does not send workspace type (`Personal` or `Business`).

The same instructions tell the model to generate unique event IDs. Phase 02 should decide whether the application should replace those IDs before review.

The default model is `process.env.OPENAI_MODEL || "gpt-4.1-mini-2025-04-14"`. Recheck current official OpenAI documentation before changing it.

`credit_expense` is now a valid proposal kind. The prompt sentence for it is already in `realExtract`. The evaluation corpus still needs a case that expects that kind, and a case that expects a clarification when the person or the pay-later meaning is missing.
