# Budget-controlled narration capture — 2026-10-16

Continues clean `df2ae479cf66820fa3f3e8fdfa3e4c4b6fa072a2`. No audit restart or ledger rewrite.

## Approval and current state

The user's existing approval is **US$5 total**, shared across narration and later voice evaluation. No new approval required within that ceiling. Local API key remains absent; no consenting-speaker recordings found in the local test directory. No paid calls occurred. `.local/evaluation/budget.jsonl` was initialised once at zero committed spend; preserve it across runs. Never delete/reinitialise it to obtain another allowance.

Application AI/voice configuration remains disabled. This CLI cannot post records or approve voice quality. It uses only the synthetic corpus and fixture, with the same extraction request builder and validation as the application. Explicit default service tier ensures standard pricing rather than a project-selected priority tier. Model output is captured separately from validation-added questions.

## Commands

```bash
# Default is a no-network readiness report; it does not load results as success.
npm run eval:capture

# Already completed in this checkout. ONLY initialise a genuinely new,
# reconciled ledger after confirming there has been no prior evaluation spend.
npm run eval:capture -- --initialise-budget

# After configuring OPENAI_API_KEY in ignored .env.local and verifying rates:
npm run eval:capture -- --live

# Scoring is offline. Substitute the actual private capture path printed by CLI.
npm run eval:narration -- .local/evaluation/runs/RUN_ID/outputs.json
```

Do not paste keys into chat, change provider flags, run simultaneous captures, or run paid evaluation as a routine test. The `--live` check in this continuation exited before opening the budget or contacting a provider because the key is absent. That is a verified guard, not a live quality PASS.

## Budget and recovery

Official [GPT-4.1 Mini model documentation](https://developers.openai.com/api/docs/models/gpt-4.1-mini), opened 2026-10-16: standard text input $0.40/million tokens, output $1.60/million, context limit 1,047,576. Requests fix max output to 4,000, store:false and default service tier, use no tools, cap serialised input at 100 KB, and refuse a different model. Recheck official pricing before live execution if these rates may have changed. `store:false` is not guaranteed zero retention.

Before each call, the runner fsyncs a **$0.425431** reservation: the entire model input context plus bounded output at standard rates, rounded up to a USD millionth. It does not rely on an approximate tokenizer. Verified response usage replaces that reservation with the actual standard-rate upper estimate, ignoring cache discounts. All arithmetic is safe integer microdollars. The cumulative cap is 5,000,000 microdollars. This limits this runner's token charges at the recorded rates, not unrelated account spend, taxes or other provider charges.

One exclusive lock covers the whole run. A crash retains the lock and any unanswered reservations. Errors/timeouts have no automatic retry or refund. Missing, malformed, truncated, over-budget or inconsistent journal data fails closed. Initialisation refuses to overwrite an existing journal. Do not run a second runner from another clone or reconstruct a lost ledger as empty.

If interrupted: verify the process has ended, inspect the private captures and journal, reconcile uncertain requests against provider usage, and only then remove a stale `budget.lock`. Keep unknown reservations charged. Retain the journal. Do not invent zero-cost failures or use repeated requests to discover whether a prior call succeeded. Future voice tooling must extend/use this same cumulative journal with independently verified audio cost bounds; it must not create another $5 budget.

Each successful response has a private per-case capture containing the request/hash, model/response ID, time/latency, usage, raw structured output and validated output or rejection flag. `outputs.json` feeds the scorer. Failed validation is evidence, not success; unreadable provider responses stop the run conservatively. Console output contains case IDs and budget totals, never narration, credentials or provider error bodies. A capture-complete message is not a quality verdict; inspect evidence and score.

## Fixture and scoring correction

The payable case incorrectly named Kojo while fixture opening debt belongs to Adjei Packaging. Corrected the narration to the canonical opening counterparty so the expected payable settlement is answerable. No product fixture or financial semantics changed. Scoring now rejects broken proposal/question linkage and no longer awards a definite-case match when server validation adds clarification. It still scores only the corpus's specified fields: human review of accounts, parties and debt references remains necessary before a quality verdict.

## Offline validation

Seven added tests cover upward charge rounding and invalid usage; missing/reinitialised budgets; concurrent runs; unknown/lost response reservations; ceiling enforcement; one-time settlements; corrupted/interrupted journals; and shared production request boundaries (some tests cover multiple cases). All 102 unit tests passed. No test invokes OpenAI. Read CURRENT/build-log for the final build and browser results.

## Live evaluation return — 2026-10-17

Key now present in ignored .env.local; AI_ENABLED and VOICE_ENABLED remain false. Initial attempt stopped before a capture, retaining 425431 microUSD of uncertain usage. A non-generative empty Responses request diagnosed Node certificate validation failure. NODE_USE_SYSTEM_CA=1 uses Windows trusted certificates without bypassing TLS; the empty request then returned 400 missing model. Do not set NODE_TLS_REJECT_UNAUTHORIZED=0. Existing US$5 cumulative approval continues, and the original reservation is retained.

Added allowlisted error categories/status/codes; no provider bodies/messages/headers are printed. Tests verify secret-bearing errors cannot leak through diagnostics. All 104 unit tests passed, typecheck/lint and production build passed (Windows sandbox required elevated tests/build). No schema, deterministic ledger, posting or review permission was weakened.

Private synthetic captures under .local/evaluation/runs (not committed):
- eed10c82-a2b0-4270-b2b7-4091db715293: original prompt, FAIL, 15 kind + 2 clarification matches, 2 silent guesses, 1 invalid output.
- 37bdd244-367f-49dd-8d24-b4eabfe70af3: revised interpretation, FAIL, 14 kind + 6 clarification matches, 1 silent guess, 0 invalid.
- dd9edf0f-160b-4dd9-ae3c-061f80f50c0b: explicit field rules, FAIL, 15 kind + 7 clarification matches, 0 silent guesses/invalid outputs. Remaining errors: momo-sale, credit-sale, partial-debt, stock-credit, credit-expense, loan. These include unnecessary questions as well as a paid-sale misclassification; do not weaken the corpus to pass.

Further general examples are under evaluation. Captures contain full request hashes and usage for reproducibility. Synthetic corpus success cannot establish representative voice quality or launch readiness.

Final experiment dbfb6da3-277c-423f-a1d1-316e39517151: FAIL, 21 kind + 4 clarification matches, 3 silent guesses, 0 invalid. General examples improved definite classification but regressed clarification safety, so that addition was removed. Retained the explicit-field-rule prompt tested in dd9edf0f (22/28, zero silent guesses in that run). No prompt is approved for release. Do not cherry-pick the 25/28 headline or enable AI. Further work should compare a supported replacement model under reviewed pricing and the same cumulative budget rather than continue fitting examples to this corpus.

Cumulative journal: 493565 microUSD committed, comprising 68134 microUSD calculated successful usage plus 425431 microUSD uncertain initial reservation. Remaining ceiling 4506435 microUSD. Actual provider invoice is not independently reconciled. All raw captures remain private/ignored. No consented voice recordings supplied; voice evaluation NOT RUN.

## Replacement comparison

Official pricing checked 2026-10-17: https://developers.openai.com/api/docs/pricing and https://developers.openai.com/api/docs/models/gpt-6-luna . Standard Luna input/output are US$0.10/0.50 per million; long-context US$0.20/0.75, cache write up to US$0.25. These are below the existing journal uncached US$0.40/1.60 bounds. `--compare-luna` changes only the evaluation request model, retaining store:false, default service tier, 4000 output cap, 100KB serialized request cap, no retries and the same journal. Usage is deliberately overestimated at the old rates, not represented as Luna invoice cost. Production model configuration is unchanged. No extra $5 budget was created.

Comparison result: PASS for this synthetic corpus. Run 388f7100-40b5-4814-8376-d65affb4b5da, gpt-6-luna, 21 kind matches + 7 clarification matches = 28/28, zero silent guesses, invalid outputs or missing cases. Inspected every captured event account/toAccount/party/obligation reference against fixture and narration: paid MoMo sale, named new debts, opening Abena partial/full settlements, supplier settlement, transfers and selected correction match. Missing account/amount/debt fields remain unresolved with questions. No fixture alterations or postprocessing of captured output. One synthetic business corpus run is not representative general or voice quality certification. Application defaults and enablement remain unchanged.

Final cumulative committed/reserved: US$0.513235 (US$0.425431 uncertain initial reservation + US$0.087804 conservatively costed successful usage); US$4.486765 remains. Luna usage is costed above its actual published rate. No invoice reconciliation. Typecheck PASS after comparison CLI addition; earlier 104 unit tests, lint and production build remain PASS for unchanged application/budget logic. No UI/DB migration was made.
