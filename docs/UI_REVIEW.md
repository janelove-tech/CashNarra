# CashNarra UI, language, and UX review

Reviewed: 21 October 2026. Evidence: all eight supplied screenshots, the earlier CashNarra design brief, current conversation decisions, and the available GitHub source/rules.

## Assessment

The approved logo, restrained palette, legible main headings, editable transcript, and clear unlimited-records benefit are useful foundations. The problems are now mainly task hierarchy, repeated explanations, crowded settings, status accuracy, and unfinished recovery. Another broad visual rewrite is unnecessary.

The screenshots show the words reached the story editor. They do not establish current OpenAI credit, whether the failed click reached the provider, keyboard behavior, responsive CSS widths, contrast ratios, or the current local implementation. The GitHub handoff is older than the reported Groq and pricing work. Findings below distinguish visible observations from behavior that must be tested.

Do not publish screenshots containing real financial content as test fixtures or include them in a public repository. Use synthetic examples for regression evidence.

## Screenshot inventory

| Screenshot | Visible screen/state | What it establishes |
| --- | --- | --- |
| `image(20261021-160737).png` | Signed-in Plan and usage | Long Free summary followed by explicitly labelled example counters; duplicate reset/charge information; a captured voice-off message |
| `image(20261021-160751).png` | Settings | Repeated headings, several explanatory rows, a retention setting squeezed beside two controls, and development/support wording |
| `image(20261021-160753).png` | Public landing, long stacked capture | Fictional worked example and repeated pale brand shapes behind multiple sections |
| `image(20261021-160805).png` | Finished pricing comparison | Correct main quantities and strikethrough; mismatched benefit/CTA alignment and a lengthy price-conversion line |
| `image(20261021-160805-1).png` | Voice dialog with a recorded clip | Long body, dominant record-again control, audio metadata and disclosure, with a primary action partly visible at the lower scroll boundary |
| `image(20261021-160815).png` | Voice dialog with words | Editable transcript exists; multiple full-width actions and instructions about clearing words before another transcript |
| `image(20261021-160814).png` | Story editor containing transcript words | The handoff from voice to typed story happened; the date label is separated from its input by backup/restore; generous empty input height and several competing controls/notices |
| `image(20261021-160823).png` | Failed story understanding | Generic failure status and a separate no-credit error for the same action; transcript words remain intact |

These PNG dimensions are image dimensions, not verified browser CSS viewport sizes. A long page capture is not proof that a layout was tested on a phone. The voice-off and later transcript images may come from different moments; check the current server state before calling their difference a synchronization bug.

## Prioritized fixes

### Q01 — Restore reading and stop presenting history as live status

**Priority:** P1, blocks the primary task. **Evidence:** no-credit failure after transcript handoff; earlier handoff documents a persistent billing pause.

**Observed:** the story could not be understood. **Hypothesis requiring local confirmation:** an old billing pause prevents a fresh request after the owner topped up. Other possible blocks are the running key's account, a provider limit, the local journal, or a daily allowance.

Follow `READER_RECOVERY.md`. A controlled recovery result must distinguish cached rejection, fresh refusal, usable success, and an uncertain outcome. Owner diagnostics should show last-checked time and the actual blocking layer. Ordinary users should not see company provider credit details.

**Acceptance:** one bounded verification under the US$20 cumulative budget, cost recorded, matching old pause resolved only after success, draft/transcript preserved, and no automatic financial save.

### Q02 — Make the recorder's current task and main action obvious

**Priority:** P1. **Evidence:** both voice-dialog screenshots.

The partly visible primary button at the body's lower boundary weakens discoverability. This screenshot alone cannot prove the button is impossible to reach; test scroll, viewport height, keyboard focus, and footer overlap before deciding the CSS cause.

Show only the controls needed for the current state:

| State | Primary action | Secondary actions |
| --- | --- | --- |
| Ready | Start recording | Close |
| Recording | Stop recording | Cancel recording |
| Clip ready | Turn into words | Play, record again, download recording |
| Working | Turning your recording into words… | Stop waiting, with accurate uncertain-outcome handling |
| Words ready | Use these words | Edit words, play recording, optional downloads |
| Definite failure | The appropriate explicit retry if safe | Type instead, keep recording |
| Uncertain outcome | Check the existing attempt if recovery exists | Keep recording, type instead; no automatic resend |

Keep one scrollable body and a footer with the current primary action, or use another layout that demonstrably keeps it reachable. Do not duplicate the same primary action inside the body and footer. Keep secondary tools quiet and descriptive. Do not create a forest of equally emphasized full-width buttons.

Keep the true pre-send notice naming Groq. The text should not misleadingly imply that recording alone sends audio. Once words exist, lead with **Your words are ready. Check and edit them below.** Move focus or announce this state appropriately; do not leave a successful transcript visually subordinate to **Microphone is off**.

The cached transcript belongs to the recording independently of the editable text. Clearing or correcting that text must not trigger another transcription of the same clip. A genuinely new recording is an explicit replacement action, preserving existing work until the person chooses what to discard.

**Acceptance:** the primary action is fully visible and keyboard reachable at a short viewport and with long content; the footer never covers it; focus stays inside the open modal and returns on close; closing/replacing unsaved work cannot silently lose it.

### Q03 — One failure, one message, one clear way forward

**Priority:** P1. **Evidence:** failed story screen.

The generic **Processing failed** banner and the separate no-credit banner repeat the same outcome. They push the form down and make the user decode which message matters.

Use a single failure state near the attempted action. For an ordinary customer, a suitable service message is:

> We couldn't read this story. Your words are still here. You can add a record yourself.

An explicit **Add a record yourself** link opens the existing manual-entry flow with relevant safe context retained. Do not leave a known blocked action looking like the only useful next step. If the owner can resume service, keep that recovery in the protected owner path, not in the customer's pricing card.

Use one accessible error announcement. Clear the error after successful recovery or when its operation is replaced. A message from a previous attempt must not describe a newer result.

**Acceptance:** one failure announcement, preserved text, a working alternative, no automatic resubmission, and no stale failure after success.

### Q04 — Account usage must answer a real question

**Priority:** P1 before customer launch. **Evidence:** Plan and usage screenshot.

The screen labels its example correctly, which is preferable to presenting it as live. Nevertheless, a signed-in person's main usage page should answer **What do I have left?**, not make them read a sample meter beside real account context. The long summary and duplicate reset/charge notes obscure that answer.

Use a compact plan summary and actual account-level rows, for example:

| Row | Actual value pattern |
| --- | --- |
| Current plan | Free · GH₵0 a month, or the subscriber's actual agreement |
| Workspaces | 2 of 3 used, only when true |
| AI stories | [actual remaining] of [actual allowance] left |
| Voice notes today | [actual remaining] of 3 left · up to [active plan duration] each |
| Report packs | [actual remaining] of [actual allowance] left |
| Resets | [actual monthly date]; daily voice reset explained once |

Numbers above are patterns, not defaults or new sample values to insert. Use unknown/null states honestly. If live usage has not been implemented, complete it before treating this as an account meter; keep illustrative data in a separate developer/demo route. Do not show an example alongside actual data without a deliberate demo context.

Financial planning and subscription billing need distinct navigation names. Keep **Plan** for the financial-planning area and use **Subscription** for the account billing/usage entry, with **Your plan and usage** as its page title. Apply the naming consistently across navigation, breadcrumb, and Settings.

**Acceptance:** changing workspaces does not change the account's allowance; no hard-coded example counters in the signed-in account view; current service state is derived from the actual server response rather than old copy.

### Q05 — Simplify settings and stop squeezing the explanation column

**Priority:** P2. **Evidence:** Settings screenshot.

The repeated **Appearance** and **People, due dates and goals** headings consume space without adding information. The original-words explanation wraps into a narrow column beside a selector and a destructive action. Stacked warnings and negatives read like a development checklist.

Use a consistent label/help/control grid and stack controls before text becomes cramped. Keep the section heading once. Put deletion on a separate row with a clear confirmation, rather than beside the retention preference as if both were harmless selections.

Suggested wording, conditional on the actual behavior:

| Current wording | Better wording |
| --- | --- |
| Review rhythm | Reminders |
| No penalties, points or claims of complete finances | Choose when you'd like to check your records. |
| Use shared-device mode | Shared device, with a setting description explaining that drafts are not kept |
| How long to keep your original words | Keep original stories for |
| Remove original words now | Delete original stories, followed by a clear scope confirmation |
| Read the processing notice | How your information is used |

Retain the important distinction that deleting original words does not erase confirmed records or correction history. Explain it at the retention/deletion control rather than repeating privacy qualifications throughout unrelated settings.

Remove development-status prose about this being a local build from normal customer settings. Before launch, implement the support/data-request flow the interface promises. A real stored request may say **Request received**; never claim completed deletion or invent a support response time.

**Acceptance:** at intermediate widths, the help column remains readable and controls stack naturally; destructive deletion is distinct, confirmed, and truthful about what stays.

### Q06 — Put the story and its next action together

**Priority:** P2. **Evidence:** story editor before and after failure.

The date label should be immediately adjacent to the date input. Backup/restore should not interrupt that relationship. A short story does not need a large empty textarea, a storage explanation, a manual-entry button, copy action, consent note, and two error banners to find its next step.

Keep the sequence: date → story → **Understand my story** → secondary manual/copy tools. Move backup/restore to a compact draft tool. Keep the storage preference with one concise explanation, and deeper details behind its own link. Keep essential processing disclosure; do not hide that data leaves the device.

Use a compact starting input that can grow for longer stories. Do not replace an accessible native date input solely to obtain a cosmetic format. Where needed, show an unambiguous readable date without changing the underlying ISO value.

**Acceptance:** labels name and sit beside their fields; the user can proceed without retyping the transcript; primary and secondary actions remain visually distinct at phone widths and keyboard-open states.

### Q07 — Make pricing easy to compare

**Priority:** P2. **Evidence:** finished pricing screenshot.

The core content now reflects the owner's decisions. Keep it. The Plus price header has more lines than Free, so matching benefits and CTAs fall at different heights. The long cedi-rate sentence competes with the price and the standard-price discount.

Group the offer as **$0.99 / month**, **(≈ GH₵[current rounded amount])**, and nearby **Standard price $2.00** with an actual strikethrough. Keep the rate date as a small separate line. Do not hard-code yesterday's number as a live lookup. Use a flexible shared layout that aligns matching rows and card actions without fixing heights that clip translated/wrapped text.

Keep the permanent-price explanation once, below the cards. Keep essential quota explanations, but avoid repeating the same shared-account message in multiple places. Use **Formatted report packs** consistently and retain its smaller explanation.

No availability or development notes belong on this pricing page, as the owner requested. Keep actual checkout authorization separate. A **Choose Plus** button must not silently do nothing: implement its safe next step or retain a plainly disabled control in the private development build; before public launch it must perform the actual intended signup/selection/payment flow. Do not fake success or initiate payment while payments are off.

**Acceptance:** matching benefits and CTAs compare cleanly on desktop, stack cleanly on narrow screens, retain $0.99/$2 and current cedi logic, and never expose Unlimited.

### Q08 — Reduce landing-page repetition and background distraction

**Priority:** P2. **Evidence:** long public landing capture.

Keep the fictional worked example: it demonstrates a useful distinction between a new sale and an old-balance payment. The repeated pale brand shapes behind much of the body add visual noise. Several successive sections repeat the sample's benefit instead of helping a visitor decide.

Use the large motif in a deliberate hero or closing treatment, with quieter reading areas. Keep one strong demonstration, a short explanation of how it works, a useful output example, and a concise FAQ. Remove a section when it repeats information without answering a distinct customer question. Do not remove the hero proof or swap it for abstract decorative cards.

Keep money facts understandable. **Net movement** needs its plain explanation and **not profit** distinction where it matters; do not replace it with **profit** to shorten the page.

**Acceptance:** a new visitor can identify what the product does, try the sample, understand that they review before saving, and find account creation without reading development notes. No paid AI is needed for the public example.

### Q09 — Check decorative quantities and small language regressions

**Priority:** P2/P3 after the blocked flow. **Evidence:** background Today screen in the voice-dialog captures.

The captured story card draws long tracks for both money-in and money-out while both values are zero. If these are quantitative bars, their fills must follow the actual common scale and a zero state must not imply a positive amount. If they are merely dividers, remove the meter-like styling or use a neutral separator. Do not invent chart values from a screenshot.

The captured **1 days you checked in** shows missing singular/plural handling. Check one/other language across days, records, notes, and packs. Keep progress encouraging without penalties or claims that complete finances are guaranteed.

**Acceptance:** zero/unknown/positive states are visually and semantically distinct, and one-day wording is grammatical.

## Principles behind the recommendations

Nielsen Norman Group's heuristics support showing useful status, familiar language, consistent controls, restrained information, and recovery from errors. The recommendations here are specific CashNarra applications, not a claim that a checklist proves usability.

W3C's modal-dialog pattern supplies keyboard/focus behavior. WCAG's target-size guidance defines a minimum with exceptions; CashNarra's more comfortable touch targets are a product choice. Check contrast and reflow in the browser rather than estimating compliance from the screenshots.

Cursor's documentation supports version-controlled `.mdc` project rules and `alwaysApply: true`. These instructions provide repeatable context; they do not mechanically guarantee every output. Pair them with the concrete checks in `UI_ACCEPTANCE.md` and review the result.

## Sources read 21 October 2026

- Cursor project rules: https://cursor.com/docs/rules
- Nielsen Norman Group, usability heuristics: https://www.nngroup.com/articles/ten-usability-heuristics/
- W3C modal dialog pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- W3C target size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- W3C text contrast: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- W3C reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html

This is a screenshot review and implementation handoff. The running local app, speech accuracy, accessibility, provider balance, and regression suite were not independently tested here.
