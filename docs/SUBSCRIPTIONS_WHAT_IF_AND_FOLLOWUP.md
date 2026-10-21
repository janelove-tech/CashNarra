# Latest continuation: complete the customer journeys

Updated 21 October 2026 after the owner's five newer screenshots. Read this before re-running the older recovery procedure.

## Current state and next work

The owner reports the old saved OpenAI billing pause is resolved, one short synthetic story succeeded, and the cumulative testing limit is now US$20. Preserve that evidence, the approval, journal history, and existing Groq setup. Do not repeat the stale-pause repair merely because an earlier README made it the first step.

The new work is to make the experience coherent and complete: fix the new usage-pricing error and financial-figure overlap; use consistent currencies; restore the familiar what-if entry; and implement the correct upgrade, paid management, renewal, and cancellation flows. The reported reader recovery does not make these unfinished tasks complete.

Work in the owner's current local checkout. The available GitHub source is older than the local subscription and Groq changes. Do not overwrite current files or restart the entire architecture. No live charge, cancellation of an actual customer, account upgrade, deployment, or paid transcription fallback is authorized by this handoff.

## Evidence from all five new screenshots

| File | Observation | Limit of the evidence |
| --- | --- | --- |
| `image(20261021-164416).png` | Free is cedi-only while Plus is dollar-first. Main buttons are now aligned, but the extra Plus price lines still shift the benefit rows. | Does not demonstrate a functioning checkout or current FX retrieval. |
| `image(20261021-165300).png` | Goal actions include **Try a monthly amount**; a historical-pace message asks for three reviewed months. | Does not prove the scenario is broken; its familiar what-if name has been lost. |
| `image(20261021-165325).png` | A new error says provider usage cannot be priced. The story stays in the editor. | This is a different error from no credit. Inspect the actual response and attempt record; do not infer the exact parser defect from the screenshot. |
| `image(20261021-165324).png` | The Free subscription screen shows explanatory paragraphs and no upgrade action. It still says notes are included **in the draft**. | A Free view alone cannot prove whether a paid cancellation state exists elsewhere; exercise paid states explicitly. |
| `image(20261021-165407).png` | Money Stories amounts visibly collide and extend outside their intended columns. **Based on 1 saved records** is grammatically wrong. Several caveats repeat. | The screenshot is not a CSS-viewport measurement or a test of all possible amounts. |

Do not include the screenshot originals, private story text, names, or financial figures in a public test fixture. Use synthetic examples for reproduction.

## 1. One currency hierarchy on both pricing cards

The owner's chosen format is dollars first, with cedis in brackets. The earlier handoff used GH₵0 for Free and $0.99 for Plus; that inconsistent direction is superseded.

| Element | Free | Plus |
| --- | --- | --- |
| Plan name | Free | Plus |
| Main price | $0 / month | $0.99 / month |
| Smaller local equivalent | (GH₵0.00) | (≈ GH₵[latest rounded equivalent]) |
| Standard-price line | Reserve alignment space without an invented discount | Standard price, with $2.00 visibly crossed out |
| Main action | Start free, or Current plan for a signed-in Free account | Upgrade to Plus for a signed-in Free account; otherwise Choose Plus |

Keep the actual FX date in one small shared note. A currently displayed GH₵11.50 is only correct for the rate used to produce it; do not hard-code it as a fresh conversion. Each visit reads the latest valid shared rate, rounded to ten pesewas with two decimals. No AI call is needed.

Use the same formatting component for pricing and the subscription's agreed-price summary. At payment confirmation, show the actual charge currency and locked amount; do not confuse a dollar reference price with a cedi payment receipt. This is a display correction, not permission to change the checkout currency or provider amount silently.

Keep card price-header space and corresponding benefit rows aligned on desktop. Stack naturally on smaller screens; do not use fixed heights that clip longer text. All agreed benefits remain, including unlimited financial records, Plus's two-minute voice notes, and the smaller explanations. No preview or availability notes are added to pricing. Unlimited remains private and absent publicly.

## 2. Restore Explore what-if

The goals screenshot contains **Try a monthly amount**. The available source confirms this opens `modal === "scenario"` and calls the deterministic `forecast(goal, date, scenario)` function. The basic scenario survives; its label and placement make it less recognizable.

### Entry points and exact wording

- On a goal card, use **Explore what-if** instead of **Try a monthly amount**.
- Supporting text, where useful: **See how a different monthly amount could change your goal date.**
- Dialog title: **What if you saved a different amount?**
- Field: **Amount to set aside each month**, with the workspace's currency.
- Result: **About [count] months · around [readable month/year]**, only when the deterministic calculation can produce it.
- Small note: **A what-if estimate. Your records stay unchanged.**

On Plan, offer a clear entry for the selected goal, or let the user choose one when they have several. With no goal, provide **Create a goal** as the next step; do not silently drop the feature. Reuse the existing implementation rather than build an unrelated simulator.

### Behavior to preserve

- The three-reviewed-month requirement applies to a claim about historical pace. It must not disable a scenario whose monthly amount the user explicitly supplies. The inspected `forecast` already distinguishes these cases; preserve that distinction.
- Keep actual progress and the hypothetical result visually separate. Changing the scenario changes neither allocations nor authoritative balances, saved records, goals, or cash movement.
- Use exact-decimal calculations and the existing duration/unknown-state rules. No paid AI is needed.
- Avoid an unexplained hard-coded monthly assumption presented as if it came from the person's records. Start from a clearly labelled current assumption or let the person enter one; Reset restores that initial assumption.
- Handle zero, invalid input, a completed goal, very long estimates, and an unavailable historical comparison honestly. Do not invent an achievable date or affordability guarantee.
- Do not make existing basic what-if functionality a paid-only feature while repairing its discoverability.

## 3. Subscription needs actions for each real state

The current screenshot is a **Free** account. It should offer an upgrade, and it does not need a cancel-paid button. A paid subscriber must have a discoverable way to manage or end future paid access. Do not hide all lifecycle work behind a plan-description page.

Put the following into the same account-level **Subscription** area, linked from every workspace:

| Real state | Main information | Primary/secondary actions |
| --- | --- | --- |
| Free | Current plan; real usage; shared scope | **Upgrade to Plus**; View plan details |
| Paid Plus, recurring | Agreed protected price; paid-through date; next renewal; real usage | **Manage subscription**; **Cancel subscription**; payment history |
| Paid Plus, manual renewal | Agreed price; access end date; no automatic renewal | **Renew Plus**; **Switch to Free**; payment history |
| Cancellation scheduled | **Plus until [date], then Free**; remaining access | **Keep Plus** if the actual renewal mode supports undoing the scheduled change |
| Plus expired | Actual access state; preserved price agreement | **Renew Plus**; use Free |
| Payment pending/failed | Actual payment state and reference; current access retained according to verified evidence | Check payment / retry the existing safe flow, without duplicate charges |

Use actual account data, not these example states as live defaults. Keep protected USD price and changing cedi equivalent clear. A free page should say **Free**, not **Free pilot** or **included in the draft** as development copy.

### Upgrade flow

**Upgrade to Plus → compare benefits → review the exact plan, period, protected price and charge → deliberately approve payment → verified success → paid access and updated usage.**

- An unauthenticated selection carries a safe plan intention through sign-in, then requires a fresh server-owned quote. A URL or browser field cannot assign a paid entitlement.
- Verify account ownership, plan visibility, purchasability, campaign time, quote validity, currency, amount, and verified payment. Handle replayed callbacks idempotently.
- The selected $0.99 offer becomes a durable subscriber agreement when the qualifying purchase is verified. A later catalogue change or campaign end cannot reprice that subscriber.
- A visible **Choose Plus** that silently stays on the same page is not a finished flow. Build the real route and safe states now. Test with a sandbox adapter/test mode; do not fake payment success to make a button look functional.

### Cancellation and downgrade flow

Recommended product behavior is period-end cancellation. Implement it with an explicit confirmation:

> Cancel Plus? You'll keep Plus until [paid-through date]. After that, your account returns to Free. Your records will stay available.

Use **Keep Plus** and **Cancel subscription** as distinct actions. Do not use a misleading **Delete account** action to cancel billing. Do not require the customer to contact support merely to find the cancellation control.

- For genuine recurring billing, stop the next renewal through the appropriate authenticated server/provider operation. Keep cancellation pending if confirmation is uncertain. Do not report it complete after merely changing a browser flag.
- Keep access through the verified paid period separately from the provider's recurring status. Stopping future renewal must not erase time already paid for.
- For a manually paid MoMo period, there may be no automatic charge to stop. Use truthful manual-renewal wording and a scheduled **Switch to Free**, rather than claim a provider recurring subscription was cancelled.
- Preserve saved records, provenance, corrections, and export access. If more than three workspaces exist, let the person choose which remain active under Free; keep read/export access to the rest. Do not delete or combine workspaces to enforce the lower limit.
- Preserve the acquired price agreement after cancellation, expiry, or a renewal gap. The owner did not make uninterrupted payment a condition. A later voluntary upgrade explicitly accepts a new agreement; do not silently erase the old history.
- Replayed or delayed callbacks must not cancel another account, duplicate an access period, or restore a renewal that was deliberately stopped. Reconcile genuinely conflicting payment/cancellation events with provider evidence.

Paystack's current documentation supports subscription disable/management operations for its supported recurring channels; its subscription guide lists Card and Direct Debit (Nigeria), not automatic MoMo subscriptions. Apply these operations only to a real matching subscription type. The access-retention and protected-price rules above are CashNarra product choices, not claims that Paystack automatically implements them.

### Development and keys

This instruction authorizes implementing and testing the management journeys. It does not authorize a live charge, paid assignment to the owner's Free account, cancellation of a real subscriber, or enabling production payments. Exercise Free, active paid, expiring, cancellation-pending, and cancelled fixtures privately through the real state-handling code.

If provider sandbox keys are genuinely needed and absent, finish independent work and guide the owner to the provider's test-key settings and the actual ignored local fields. Let the owner enter secrets in the editor. Use the existing key-guidance rule; never request live keys merely to test a plan card or expose a secret in chat, browser code, or logs.

Do not assume a floating-USD benchmark can silently reprice a shared fixed-GHS recurring provider plan each month. Preserve the existing quote/agreement design and state the real approved charge before payment. Do not alter other subscribers' provider amounts as part of this repair.

## 4. Repair the new provider-usage pricing failure

The screenshot's error is **usage CashNarra cannot price**. It is not the previous **no remaining credit** message. The successful synthetic sentence proves that one request succeeded, not that every larger or differently shaped response can pass the app's cost validation.

Before making another live call:

1. Find the exact failing attempt and inspect its already returned, non-secret metadata: request ID, model, endpoint/processing tier, usage structure, status, configured limits, and which validation rejected it. Do not log private prompt/transcript content.
2. Check for a model/rate mapping mismatch, an endpoint-specific usage shape, absent/null fields, an obsolete bound, or incorrect handling of nested cached/reasoning usage. These are hypotheses; identify the failing field rather than guessing.
3. Normalize usage for the actual endpoint and configured model using the installed SDK/current official documentation. Reconcile totals without double counting nested details. Verify the applicable published rate/tier rather than using a rate from an unrelated model.
4. Preserve usage evidence and the unresolved exposure if cost still cannot be established. Do not settle at zero, delete the hold, expand bounds indiscriminately, or turn off cost checks just to suppress the error.
5. Preserve a returned usable interpretation and its attempt identity securely. Repair accounting and reuse that result where possible; do not send the same story again to solve an internal pricing problem. Proposed records still pass the normal validation/review and user-confirmed save.
6. Add an offline regression using a synthetic version of the actual failing usage shape. Check a valid response, missing/unknown usage, a rejected bound, and duplicate settlement. Keep the cumulative US$20 history and no-auto-retry behavior.

If another live request is necessary after the offline fix, explain its specific purpose and keep it bounded within the existing approval. Do not re-run the whole corpus or recreate the already resolved billing pause.

In the customer app use a plain single message and preserve the words. The exact token-price diagnostic belongs in the owner view. Do not call a provider-completed but internally unpriced attempt free or insist the owner top up again without a fresh billing error.

## 5. Money figures must never collide

The Money Stories summary visibly overlaps. Treat this as a high-priority readability defect because a person cannot reliably distinguish the amounts.

- Measure the available content width, not just the browser width; the sidebar and padding consume space.
- Move the summary from three columns to two or one whenever the full values need it. Keep label and amount together.
- Never hide overflow, add an ellipsis to authoritative money, break digits arbitrarily, or shrink numbers to unreadable type to fit a decorative layout.
- Verify all values remain fully visible for large positive and negative figures, zero, and unknown states. Use exact synthetic values such as `GH₵9,999,999,999.99` in the test, not the owner's balances.
- Correct **Based on 1 saved record** / **Based on [n] saved records**.
- Keep one concise coverage note: **Based on the records you've saved.** Keep **net movement is not profit** where that distinction matters; move repeated long caveats into the existing details area.

## Focused acceptance checks

- [ ] Both price cards use USD first and cedis in brackets; $0/$0.99 and crossed-out $2 remain correct. No availability notes; no public Unlimited.
- [ ] Every goal has a discoverable **Explore what-if** path. An explicit monthly assumption works without reviewed history and leaves saved records/allocations unchanged. No provider call occurs.
- [ ] The Free subscription view has a working **Upgrade to Plus** route. Paid fixtures have management and cancellation/renewal actions appropriate to their actual billing mode.
- [ ] Sandbox upgrade uses a verified payment and immutable price agreement; forged plan IDs, replayed callbacks, and a provider failure cannot grant paid access or charge twice.
- [ ] Cancellation retains the paid-through period, then applies Free without deleting records or resetting the protected price agreement. A failed/pending cancellation never claims confirmed success.
- [ ] A downgrade with more than three workspaces keeps read/export access and allows active-workspace selection. No ledger movement or record deletion is used as enforcement.
- [ ] The new usage-pricing failure is diagnosed and reproduced offline using the actual relevant response shape; cost and result handling preserve both evidence and idempotency.
- [ ] Money amounts do not overlap or clip at 320/390/intermediate/desktop content widths, 200% zoom, or with long values. Verify complete displayed text and non-overlapping element bounds.
- [ ] The actual requested changes are inspected in the rendered app. Report remaining requested work as incomplete rather than claiming all UI/UX is fixed after a successful provider smoke test.

## Sources and limits

Primary pages checked on 21 October 2026:

- Paystack subscriptions and supported recurring channels: https://paystack.com/docs/payments/subscriptions/
- Paystack subscription disable/management API: https://paystack.com/docs/api/subscription/
- OpenAI published model/processing-tier pricing: https://developers.openai.com/api/docs/pricing

The exact what-if label and deterministic behavior were also checked in the available `src/components/cashnarra.tsx` and `src/domain/goals.ts`; newer local files still need reconciliation. This handoff does not claim the current app has already been modified, any subscriber has been charged/cancelled, or the new usage-pricing failure has been reproduced here.
