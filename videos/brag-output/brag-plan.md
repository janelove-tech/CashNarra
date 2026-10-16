# Brag Plan: CashNarra — Make Room for Tomorrow

## What is this app?
CashNarra lets a small-business owner tell the day's money story in her own words; it proposes records she checks, completes and saves, then shows what came in, what went out and what's still owed (design preview — "Coming soon").

## The angle
"The Day You Take Home." One fictional Ghanaian business owner (Ama, of the kit's Ama Works) at closing time. The day's money still crowds her mind — cash, MoMo, stock, delivery, Kojo's debt, Abena's part payment. CashNarra gives that story somewhere to live, the facts get reviewed, and there is room to look ahead. Emotional arc: busy mind → somewhere to put the story → reviewed facts → room to look ahead. The owner is capable and hardworking; the product supports her, never rescues her.

## Hook (first 2-3 seconds)
A slow, tight push into the portrait; a single latch click gives way to room tone. "SHOP CLOSED." then "MIND STILL OPEN." in the negative space above her. VO: "Your shop is closed. Your head is still doing the accounts."

## Key moments (the middle)
- The day in pieces: real figures from the canonical example surface around her, never more than two at once; Kojo's and Abena's debts hold longest.
- Match cut from her phone to the real composer; the complete example is typed into the actual UI.
- CashNarra asks "Which account paid for delivery?" — she taps MoMo, reviews 8 records, saves.
- Abena GH₵600 owed → GH₵200 received → GH₵400 remaining; Kojo GH₵300 still owed; Money Story: received GH₵2,300 · paid out GH₵930 · people owe GH₵700.
- New equipment goal: GH₵1,200 assigned toward GH₵6,000, 20%; the contribution what-if, visibly conditional.

## Outro / punchline
Back to her, uncluttered: "MAKE ROOM FOR TOMORROW." Brand plate settles ~53s: logo, "Tell Your Money Story. See the Numbers.", "Coming soon". No URL (no approved early-access page supplied).

## User flow worth showing
Tell (type the story) → Clarify + review (choose MoMo, check 8 records, save) → See the meaning (Money Story, debts, goal and what-if). All captured from `CashNarra_Interactive_Preview.html` (Design Kit v2).

## Tone
- Preset: cinematic
- Creative direction: "cinematic, intimate, grounded" (user)
- Interpretation: trailer craft without trailer bombast — controlled crops, slow pushes, deliberate pauses, restrained sound; scale comes from closeness and calm, not volume. Readable holds on every figure.

## Format: vertical — 1080x1920
## Duration: 59.8s
User override: "My duration requirement overrides Brag's default 15–25-second limits throughout planning, composition and validation." Requested 55–60s.

## Visual identity (from the project)
- Background: ink #29263D (story surface) → paper #F7F7FA (app background)
- Accent: apricot #FFC4A0; action violet #5B49C7
- Text: #29263D on paper; #FFFFFF / #D9D4E9 on ink
- Money: in #445BA1 · out #95603E
- Display font: Manrope 800 (kit, OFL) — headings only (no ₵ glyph)
- Body font: Inter (kit, OFL) — all amounts (has ₵, tabular numerals)
- Strongest visual element: the campaign studio portrait + the real review/Money Story screens

## Share copy (draft)
CashNarra. Tell Your Money Story. See the Numbers. Make room for tomorrow — coming soon.

## Audio direction
- Role: cinematic support under an intimate voice
- Music: original instrumental score synthesised for this film (`scripts/synth_audio.py`), not a bundled track. Reasons: the bundled "Happy Beats / Business Moves" tracks are upbeat and fight the intimate tone, and their licence is marked unverified in the skill README — the brief requires commercially permitted music. The score is the project's own.
- Music treatment: drone → 76 bpm pulse under the fragments (5–13.4s) → full drop (13.6–16.8s) → single bell on "Meet CashNarra" → clean arpeggio under the interaction → light pulse under the figures → open voicing at "Now look ahead" (41.4s) → resolving Dmaj9 under the brand plate, fade to silence by 59.8s. Voice-carved (`data-fx-carve`), speech ≥20 dB over the bed.
- Music cue guidance: the score is composed to picture, so cues are known by construction — strong cues 16.85s (bell, "Meet CashNarra"), 28.8s (saved chime), 53.0–53.2s (resolve + bell, brand plate). Beat grid 76 bpm from 5.0s (5.00, 5.79, 6.58, 7.37 …) for the first four fragments.
- Audio-reactive treatment: subtle — the warm glows behind the composer (S3), the "room ahead" light (S6) and the brand plate (S7) breathe with the score's low/mid warmth. No text reacts.
- SFX posture: sparse, motion-matched — latch click, soft fragment ticks, air on the match cut, typing, taps on real UI actions, one saved chime.
- Audio-coupled moments: typing in the composer; taps on Understand / MoMo / Review / Save / slider; saved chime; plate resolve.
- Restraint rule: never louder than the voice; no stingers, risers or whooshes on every cut.

## Voiceover script
Kokoro-82M (local), voice `af_heart`, speed 0.94. Abena forced to /ˈɑːbɛnə/ (Kokoro default was "uh-BEE-nuh"). Verified by local Whisper transcript.

| Start | Line |
| --- | --- |
| 0.60 | Your shop is closed. |
| 2.30 | Your head is still doing the accounts. |
| 5.00 | Cash. MoMo. Stock. Delivery. |
| 8.42 | Kojo still owes you. |
| 9.95 | Abena paid part of her debt. |
| 11.85 | Your day… in pieces. |
| 14.40 | Give your money story somewhere to live. |
| 16.90 | Meet CashNarra. |
| 18.60 | Type it as it happened. |
| 21.00 | It turns your words into records. |
| 24.20 | You check the details, fill in what's missing, and save. |
| 30.20 | Abena's payment reduces her debt. |
| 32.90 | Kojo still owes three hundred. |
| 35.40 | You see what came in, what went out, and what's still owed. |
| 41.90 | Now look ahead. |
| 43.40 | That new equipment. Your progress. |
| 46.00 | What a different contribution could change. |
| 49.80 | You've done the work. |
| 51.50 | Make room for tomorrow. |
| 54.00 | CashNarra. |
| 55.50 | Tell your money story. See the numbers. |
| 58.20 | Coming soon. |

## Storyboard

### Scene 1 — Closing time — 5.0s
Portrait, slow push; SHOP CLOSED. / MIND STILL OPEN.; CashNarra mark + "Illustrative business story".
Sequential/interaction: two lines, one per VO line.
Audio intent: a door latch, then quiet. Audio-coupled idea: latch click at 0.22s.
Transition mood: hard → Scene 2

### Scene 2 — The day in pieces — 9.0s
Three tightening framings (shoulders → eyes → phone). Fragments: Cash sales GH₵900 · MoMo sales GH₵1,200 · Stock GH₵700 · Delivery GH₵80 · Kojo still owes GH₵300 · Abena paid GH₵200 toward an old balance.
Sequential/interaction: yes — max two fragments at once; debts hold 3.5–3.9s.
Audio intent: a restrained pulse; the mind getting heavier. Audio-coupled idea: soft tick per fragment; first four on the beat grid.
Transition mood: dramatic (match cut) → Scene 3

### Scene 3 — Somewhere for the story — 6.6s
Match cut from her phone to the real composer; fragments drift then converge into the text box; "Meet CashNarra" lockup; "Your money. In your words."; the complete example is typed into the real UI; readable excerpt card labelled as an excerpt.
Sequential/interaction: yes — typing (29 captured states). Audio intent: music drops away, then one bell.
Transition mood: soft (device fills to paper) → Scene 4

### Scene 4 — The owner stays in control — 9.2s
Tap Understand → "Just one detail. Which account paid for delivery?" (held, focus frame) → tap MoMo → Review 8 records (rows align) → Save → "A clearer picture of today."
Sequential/interaction: yes — simulated taps. Audio-coupled idea: taps, saved chime.
Transition mood: clean → Scene 5

### Scene 5 — The pieces find their place — 11.8s
Abena GH₵600 → −GH₵200 → GH₵400 remaining (+ real record crop); Kojo GH₵300 still owed (+ review row, "People owe you GH₵700"); Money Story cover + held rows: Money received GH₵2,300 · Money paid out GH₵930 · People owe you GH₵700; transfer-excluded note.
Sequential/interaction: rows arrive with "came in / went out / still owed", then hold ~3s.
Transition mood: clean → Scene 6

### Scene 6 — Room for what comes next — 7.8s
New equipment goal (GH₵1,200 of GH₵6,000, 20%, "Assigned, not moved."); what-if slider +GH₵0 → +GH₵200 (12 → 8 monthly contributions) with "Scenario · your records stay the same" visible; "A what-if, not a promise."
Sequential/interaction: slider drag. Audio intent: the score opens up; warm light grows.
Transition mood: hard → Scene 7

### Scene 7 — The ending — 10.4s
Portrait returns, wider and warmer: MAKE ROOM FOR / TOMORROW. Brand plate from ~53.2s: logo, tagline, fine print, "Coming soon".
Audio intent: resolve and settle to silence.

**Music mood for this video:** cinematic, intimate
**Audio summary:** a quiet room, a pulse that crowds, a silence that makes space, an ordered middle, an opening, and a resolve.

## Grounding
Every figure and claim comes from `data/illustrative-records.json`, `app.js` (sample text, receivable(), totals(), goal, scenario) and the kit README: GH₵2,300 received · GH₵930 out · GH₵700 owed (Abena 400 · Kojo 300) · transfer excluded · no profit claim · allocations don't move money · what-if conditional. Character and data are fictional and labelled. No URL, waitlist or pricing invented.
