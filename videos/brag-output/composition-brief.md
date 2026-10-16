# Hyperframes Composition Brief: CashNarra

## Objective
Create a cinematic, intimate, grounded vertical launch film for CashNarra: "Make Room for Tomorrow".

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: vertical — 1080x1920, 30fps
- Duration: 59.8s (user override of the 15–25s default; requested 55–60s)

## Source Material
- Project root: `CashNarra/` (Design Kit v2 at `CashNarra_Design_Kit_v2/`)
- Primary files read: README.md, app.js, CashNarra_Interactive_Preview.html, data/illustrative-records.json, tokens/cashnarra.css, marketing/*, Storyline handoff package
- Product name: CashNarra
- Tagline / strongest claim: "Tell Your Money Story. See the Numbers."
- Key UI to show: composer → clarification → 8-record review → save → record detail → Money Story → goal → what-if (captured state by state from the real preview)
- Copy that must appear verbatim:
  - Tell Your Money Story. See the Numbers.
  - Make room for tomorrow.
  - Coming soon
  - Illustrative business story · Product preview • Illustrative data

## Creative Direction
- Tone preset: cinematic
- Creative direction: "cinematic, intimate, grounded"
- Interpretation: slow pushes, controlled crops, deliberate pauses, restrained sound; readable holds on every figure.
- Angle: "The Day You Take Home" — see brag-plan.md.
- Hook: portrait push + "SHOP CLOSED. / MIND STILL OPEN."
- Outro / punchline: "MAKE ROOM FOR TOMORROW." → brand plate → "Coming soon"
- Avoid: generic SaaS language; abstract filler; profit claims; implying money moves on goal allocation; invented URLs.

## Visual Identity
- Background: #29263D (ink) / #F7F7FA (paper) · Text: #29263D / #FFFFFF · Accent: #FFC4A0, #5B49C7
- Display font: Manrope (local, OFL) · Body/amounts: Inter (local, OFL)
- References: campaign-studio.png, kit lockups, editorial story campaign.

## Storyboard
Contract: `brag-output/brag-plan.md`. Scenes: 1 Closing time 5.0s · 2 The day in pieces 9.0s · 3 Somewhere for the story 6.6s · 4 The owner stays in control 9.2s · 5 The pieces find their place 11.8s · 6 Room for what comes next 7.8s · 7 The ending 10.4s.

## Audio
- Audio role: cinematic support under narration
- Music: `assets/audio/music_bed.wav` — original score (bundled tracks rejected: tone mismatch, unverified licence)
- Music treatment: see plan; voice-carved; fade to silence at 59.8s
- Music cue guidance: composed-to-picture; strong cues 16.85s, 28.8s, 53.0–53.2s; beat grid 76 bpm from 5.0s
- Audio-reactive treatment: subtle; three warm glows (S3, S6, S7) read `assets/music-energy.js` (extracted with hyperframes-creative `extract-audio-data.py`)
- SFX: synthesised, sparse, motion-matched (`assets/audio/sfx_*.wav`)
- Voiceover: `assets/audio/narration.wav` (Kokoro-82M local, af_heart)

## Hyperframes Instructions
Built with hyperframes-core / -animation / -creative / -keyframes / -cli conventions: one sub-composition per scene plus chrome and captions sub-compositions; single paused timeline per composition; local assets only (GSAP vendored); `npx hyperframes check` as the single pre-render gate; local render only, no publishing.
