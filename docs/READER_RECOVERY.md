# Restore story reading after the reported OpenAI top-up

The 21 October billing-pause recovery already succeeded. Do not repeat it. The next work is `docs/SUBSCRIPTIONS_WHAT_IF_AND_FOLLOWUP.md`. Use this procedure only when a current pause is still `billing_rejected`.

Latest owner authorization: 21 October 2026. The owner reports adding OpenAI API credit and requests **US$20 total cumulative testing spend**.

## What the evidence does and does not show

The supplied screenshots show a completed transcript, its words in the story form, and a later no-credit message when understanding was attempted. That locates the visible failure after transcription. It does not prove that the last click reached OpenAI or that the current OpenAI account still has no credit.

Earlier local handoffs say `.local/evaluation/provider-pause.json` preserves a `billing_rejected` stop and blocks later reader calls before they reach the provider. A stale pause is therefore the leading implementation hypothesis after a top-up. Inspect the actual current file and request path to confirm it. The available GitHub source predates that repair and cannot establish the current pause implementation.

OpenAI's official error guide distinguishes exhausted credit, project/organization spend limits, usage limits, and request-rate limits. A paid-up account can still encounter another limit. Read the fresh `error.code`, not only HTTP 429 or a generic `insufficient_quota` type. Sources are linked below.

## The four different controls

| Control | What changes it | What changing it does not do |
| --- | --- | --- |
| OpenAI account credit | A purchase on the organization billed by the running key | Does not clear CashNarra's saved pause or raise its journal ceiling |
| Provider rate/spend/usage limit | The relevant provider setting or assigned tier | Does not create prepaid credit or change a customer plan |
| CashNarra local testing budget | The owner's cumulative testing approval, now US$20 | Does not purchase credit, grant unlimited requests, or reset earlier spend |
| Customer plan allowance and daily guard | The applicable account entitlement and abuse/capacity rules | Does not refill the provider or increase company testing approval |

## Step 1: inspect without spending

Read the current local `AGENTS.md`, current handoff, and relevant phase. Preserve newer adapter/cost repairs. Inspect the running server's effective settings and active port, not only the values written to an environment file. Check:

- Whether story reading is enabled and the configured key is present; never print its value.
- Which project/organization the configured key is intended to bill. If that cannot be established locally, guide the owner to check the non-secret project name in their funded OpenAI account. Do not ask them to buy more credit without evidence.
- The exact saved pause reason and timestamp, its provider/account scope, and whether the UI returns it without a provider request.
- The journal parser/version, approved ceiling, settled cost, and unsettled holds. Compute fresh totals from the actual file, not the old 162-call snapshot.
- The daily call counter, monthly customer allowance, current user/session mode, and any other earlier guard that could prevent the verification.
- Whether a server restart is needed to use an already-updated key or setting. Keep the system certificate store; never disable TLS verification.

Do not call OpenAI's model listing endpoint as proof that billing is restored. Authentication or model visibility does not prove a successful story-reading request can be billed.

## Step 2: apply the US$20 ceiling without losing history

The authorization is **US$20 in total**, counting all older cost and uncertainty. Use the current journal's supported approval-change mechanism. If no such mechanism exists, implement the smallest compatible, locked, audited amendment that the current parser can read. Preserve original approval evidence and every reservation, settlement, release, and historical hold. Do not copy an incompatible journal format from the old branch.

Required properties:

- New admission checks use 20,000,000 USD millionths. The parser, runtime check, active approval, CLI output, tests, and current handoff agree on the same ceiling.
- Earlier US$5/US$10 approvals remain historical. A prior header remains recoverable if the format requires a metadata/header migration; do not silently rewrite history to pretend US$20 was always approved.
- Raising the ceiling is not an initialisation or a zeroing operation. Existing settled usage and holds count unchanged. Do not mark the thirteen old ambiguous holds free.
- An atomic lock or transaction prevents a concurrent request or approval update from passing an obsolete ceiling. A live process lock is not casually deleted.
- Remaining local room equals US$20 minus freshly computed settled payable cost and unresolved reserved exposure, using the journal's actual semantics. Show reference-only Free-tier cost separately.
- Keep the repaired bounded story reservation and provider-specific audio rules. Do not restore the old full-context US$0.43 reserve. The US$0.004 figure previously selected is a conservative hold for the bounded request, not a provider price or guaranteed invoice ceiling for arbitrary future requests.

Reconcile all current controls before a live call. If an actual daily guard blocks the owner's verification, explain it and add a narrowly scoped, logged local-owner recovery path if appropriate. Do not disable the guard globally, fabricate customer counters, or change the advertised Plus package as a shortcut.

## Step 3: one controlled resume and check

The owner's top-up statement and instruction to restore reading authorize this bounded local verification; do not ask again merely because an older handoff prohibited retrying before credit was added.

Use or implement a server-side local-owner recovery action that:

1. Names the specific OpenAI billing pause and retains its history. Leave Groq and unrelated pauses alone.
2. Acquires the existing budget/capacity lock and records one fresh recovery attempt. A short-lived lease or equivalent prevents concurrent probes and crash-driven duplicate requests.
3. Lets only this verification pass the stale billing pause while ordinary requests remain protected. Do not globally clear the pause before the result is known.
4. Reserves the existing bounded amount before sending one short synthetic story through the configured reader adapter, with no automatic retry and no financial save. Use safe fixture context rather than private customer financial history.
5. Records returned provider usage before parsing or validation. If the provider answered but the application result is invalid, the company cost still exists.
6. On a usable success, marks the matching pause resolved, clears stale UI error state, and re-enables ordinary reading under the same normal budget/customer limits. Do not remove a newer pause written by another operation.
7. On a fresh definitive billing/authentication refusal, records that actual result and restores/retains the appropriately scoped pause. Release only holds known not to represent billable usage under the current journal rules.
8. On rate limiting, honors the actual cooldown. On a timeout or ambiguous connection outcome, retains uncertainty and does not automatically send the verification again or replay a user's earlier story.

If the current implementation can only recover by removing a file, improve that mechanism rather than telling the owner to delete all state. As a narrow interim repair, archive the specific stale pause and keep ordinary traffic disabled until the one bounded verification resolves; do not destroy evidence or leave an unguarded retry loop.

A successful provider connection or key check is not enough. Verify one usable reader result. Conversely, do not label a saved historical rejection a new provider failure when no fresh request was sent.

## Step 4: respond to a real new failure precisely

| Fresh result | Correct response |
| --- | --- |
| `credit_balance_exhausted` | Verify the running key uses the organization that was topped up; show the new result and time to the owner. Do not assume another top-up is needed until the account is checked. |
| `project_spend_limit_exceeded` / `organization_spend_limit_exceeded` | Guide the owner to the matching provider spending setting. Do not change it silently or describe this as the app's US$20 journal limit. |
| `organization_usage_limit_exceeded` | Explain that the provider-assigned usage tier is the block; a local ceiling increase is not its remedy. |
| 401 or permission failure | Check the actual key/project/permission, then guide secure key correction only if needed. |
| Local budget denial | Report current settled/held/remaining totals and the US$20 cumulative ceiling, without making a provider request. |
| Daily/customer allowance denial | Identify the actual allowance and reset, distinct from credit or company testing spend. |
| Timeout / uncertain result | Keep the attempt unresolved. Preserve the draft/transcript and do not resubmit it automatically. |

In the ordinary customer UI, use one useful service-error message without exposing company credit details. Exact diagnostics belong to the authenticated owner and development evidence.

## Required evidence

- Fresh local journal totals and approval ceiling; all earlier cost/hold entries preserved.
- Whether the last blocked action actually reached the provider.
- Recovery attempt identifier, time, result category, and recorded cost/hold outcome; no key or raw private story in the log.
- Matching pause resolved after success, or current precise blocking condition after failure.
- Existing transcript reused and no financial records saved by verification.
- A plain owner update that distinguishes local configuration, live verification, and UI checks.

## Sources checked 21 October 2026

- OpenAI error codes: https://developers.openai.com/api/docs/guides/error-codes
- OpenAI spend limits: https://developers.openai.com/api/docs/guides/spend-limits

These sources establish provider error meanings. They cannot reveal the owner's current balance or the local journal. The recovery design above is a CashNarra recommendation grounded in the reported pause behavior and current user authorization.
