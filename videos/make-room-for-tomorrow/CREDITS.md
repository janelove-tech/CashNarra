# Credits & provenance — "CashNarra — Make Room for Tomorrow"

| Element | Source | Licence / status |
| --- | --- | --- |
| Campaign portrait (`assets/img/campaign-studio.png`) | CashNarra Design Kit v2 | AI-generated **fictional** campaign model; not a real user or testimonial. Labelled on screen. |
| CashNarra logo, symbol, lockups (`assets/brand/`) | CashNarra Design Kit v2 | Original vector concept artwork; **needs trademark clearance** before public use. |
| Inter (`assets/fonts/InterVariable.woff2`) | Design Kit v2 | SIL Open Font License 1.1 (`assets/fonts/OFL-Inter.txt`). All amounts set in Inter (has ₵). |
| Manrope (`assets/fonts/ManropeVariable.ttf`) | Design Kit v2 | SIL Open Font License 1.1 (`assets/fonts/OFL-Manrope.txt`). Headings only. |
| Product UI (`assets/ui/*.png`) | Captured from `CashNarra_Interactive_Preview.html` (kit v2) by `scripts/capture-ui.mjs` | Design demo with fictional Ama Works data. Not a live service. |
| Narration (`assets/audio/narration.wav`) | Generated locally: Kokoro-82M (kokoro-onnx, voice `af_heart`) via `scripts/narrate.py` | Kokoro-82M is Apache-2.0. No cloud TTS used. |
| Music bed + SFX (`assets/audio/music_bed.wav`, `sfx_*.wav`) | Synthesised from scratch by `scripts/synth_audio.py` (numpy/scipy, seeded) | Original to this project; no samples or third-party audio. Free for commercial use. |
| Animation runtime (`assets/vendor/gsap.min.js`) | GSAP 3.14.2 | GSAP Standard "No Charge" licence. |
| Composition & render | HyperFrames 0.8.154 (local CLI, local Chrome) | No paid services; nothing published. |

**Product truth carried into the film:** complete canonical 8-record example and its delivery-account
clarification variant; money received GH₵2,300; money paid out GH₵930; people owe GH₵700 (Abena GH₵400 ·
Kojo GH₵300); Abena's GH₵200 is a receivable settlement, not a sale; the GH₵500 Bank → MoMo transfer is excluded
from both totals; no profit claim; goal allocation "assigned, not moved"; what-if is conditional and leaves records
unchanged. Status: product in development — "Coming soon". No URL, waitlist or early-access page invented.

## Reproduce
```
# narration (needs a Python with kokoro-onnx + soundfile + scipy; model files in ~/.cache/hyperframes/tts)
python scripts/narrate.py .work/vo af_heart 0.94
python scripts/assemble_vo.py .work/vo assets/audio captions
python scripts/synth_audio.py assets/audio
node scripts/capture-ui.mjs <chrome> ../../CashNarra_Design_Kit_v2/CashNarra_Interactive_Preview.html assets/ui   # needs puppeteer-core
python scripts/duck_mix.py <music_bed +3 dB> assets/audio/narration.wav assets/audio/music_mix.wav   # simple -9 dB voice duck (replaces the carve)
python scripts/build_index.py
npx hyperframes check && npx hyperframes render
```
