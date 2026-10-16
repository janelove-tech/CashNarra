"""Writes index.html (root composition) from the scene plan + captions/captions.json.
Run once after re-timing narration; Studio edits afterwards live in index.html itself."""
import json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DUR = 59.8
caps = json.load(open(ROOT / "captions/captions.json", encoding="utf-8"))["cues"]

SCENES = [  # id, start, duration
    ("s1-closing", 0.0, 5.0), ("s2-pieces", 5.0, 9.0), ("s3-composer", 14.0, 6.6),
    ("s4-review", 20.6, 9.2), ("s5-place", 29.8, 11.8), ("s6-ahead", 41.6, 7.8), ("s7-ending", 49.4, 10.4),
]
SFX = [  # id, file, start, volume
    ("sfx-close", "sfx_close_click", 0.22, 0.6),
    ("sfx-frag-1", "sfx_fragment", 5.0, 0.32), ("sfx-frag-2", "sfx_fragment", 5.75, 0.3),
    ("sfx-frag-3", "sfx_fragment", 6.62, 0.3), ("sfx-frag-4", "sfx_fragment", 7.42, 0.3),
    ("sfx-frag-5", "sfx_fragment", 8.42, 0.36), ("sfx-frag-6", "sfx_fragment", 9.95, 0.36),
    ("sfx-air", "sfx_air", 13.7, 0.5), ("sfx-typing", "sfx_typing", 18.6, 0.42),
    ("sfx-tap-1", "sfx_tap", 21.0, 0.45), ("sfx-tap-2", "sfx_tap", 25.6, 0.45),
    ("sfx-tap-3", "sfx_tap", 26.2, 0.45), ("sfx-tap-4", "sfx_tap", 28.45, 0.45),
    ("sfx-saved", "sfx_saved", 28.8, 0.5), ("sfx-tap-5", "sfx_tap", 46.25, 0.3),
]
SFX_LEN = {"sfx_close_click": 0.5, "sfx_fragment": 0.4, "sfx_air": 1.2, "sfx_typing": 2.0, "sfx_tap": 0.12, "sfx_saved": 2.0}
# chrome windows: (id, kind, start, end)
CHROME = [
    ("logo-a", "logo-rev", 0.0, 20.6), ("logo-b", "logo-ink", 20.6, 49.4), ("logo-c", "logo-rev", 49.4, 53.2),
    ("label-a", "rev:Illustrative business story", 0.0, 14.0),
    ("label-b", "rev:Product preview • Illustrative data", 14.0, 20.6),
    ("label-c", "ink:Product preview • Illustrative data", 20.6, 49.4),
    ("label-d", "rev:Illustrative business story", 49.4, 53.2),
]

def f(x): return f"{x:.2f}".rstrip("0").rstrip(".")

scenes = "\n".join(
    f'      <div id="{i}" data-composition-id="{i}" data-composition-src="compositions/{i}.html" data-start="{f(s)}" '
    f'data-duration="{f(d)}" data-track-index="1" data-width="1080" data-height="1920"></div>' for i, s, d in SCENES)

chrome = []
for cid, kind, s, e in CHROME:
    if kind.startswith("logo"):
        src = "cashnarra-lockup-reversed.svg" if kind == "logo-rev" else "cashnarra-lockup.svg"
        chrome.append(f'      <div id="{cid}" class="clip chrome-logo" data-start="{f(s)}" data-duration="{f(e - s)}" data-track-index="0">'
                      f'<img src="assets/brand/{src}" alt="CashNarra" /></div>')
    else:
        tone, text = kind.split(":", 1)
        chrome.append(f'      <div id="{cid}" class="clip chrome-label {tone}" data-start="{f(s)}" data-duration="{f(e - s)}" data-track-index="1">'
                      f'{html.escape(text)}</div>')

capdivs = "\n".join(
    f'      <div id="cap-{n:02}" class="clip cap" data-start="{f(c["start"])}" data-duration="{f(c["end"] - c["start"])}" data-track-index="0">'
    f'<span>{html.escape(c["text"])}</span></div>' for n, c in enumerate(caps, 1))

sfx = "\n".join(
    f'      <audio id="{i}" src="assets/audio/{fn}.wav" data-start="{f(s)}" data-duration="{f(SFX_LEN[fn])}" data-track-index="8" data-volume="{v}"></audio>'
    for i, fn, s, v in SFX)

FONT = '@font-face {{ font-family: "Inter"; src: url("assets/fonts/InterVariable.woff2") format("woff2"); font-weight: 100 900; }}'

chrome_doc = f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {FONT.format()}
        #chrome {{ position: absolute; inset: 0; font-family: "Inter", sans-serif; }}
        #chrome .chrome-logo {{ position: absolute; left: 80px; top: 98px; width: 200px; height: 40px; }}
        #chrome .chrome-logo img {{ display: block; width: 200px; height: 40px; }}
        #chrome .chrome-label {{ position: absolute; right: 80px; top: 104px; font-weight: 600; font-size: 24px; letter-spacing: 0.01em; }}
        #chrome .chrome-label.rev {{ color: #e6e1f2; }}
        #chrome .chrome-label.ink {{ color: #4f4b63; }}
      </style>
      <div id="chrome" data-composition-id="chrome" data-width="1080" data-height="1920">
        <div class="chrome-logo" id="chrome-logo-rev"><img src="assets/brand/cashnarra-lockup-reversed.svg" alt="CashNarra" /></div>
        <div class="chrome-logo" id="chrome-logo-ink" style="opacity: 0"><img src="assets/brand/cashnarra-lockup.svg" alt="CashNarra" /></div>
        <div class="chrome-label rev" id="chrome-story">Illustrative business story</div>
        <div class="chrome-label rev" id="chrome-preview-rev" style="opacity: 0">Product preview • Illustrative data</div>
        <div class="chrome-label ink" id="chrome-preview-ink" style="opacity: 0">Product preview • Illustrative data</div>
      </div>
      <script>
        (function () {{
          const tl = gsap.timeline({{ paused: true }});
          // ink on the paper scenes (20.6–49.4), reversed on ink/photo scenes
          tl.set("#chrome-logo-rev", {{ opacity: 1 }}, 0).set("#chrome-logo-rev", {{ opacity: 0 }}, 20.6).set("#chrome-logo-rev", {{ opacity: 1 }}, 49.4);
          tl.set("#chrome-logo-ink", {{ opacity: 0 }}, 0).set("#chrome-logo-ink", {{ opacity: 1 }}, 20.6).set("#chrome-logo-ink", {{ opacity: 0 }}, 49.4);
          tl.set("#chrome-story", {{ opacity: 1 }}, 0).set("#chrome-story", {{ opacity: 0 }}, 14.0).set("#chrome-story", {{ opacity: 1 }}, 49.4);
          tl.set("#chrome-preview-rev", {{ opacity: 0 }}, 0).set("#chrome-preview-rev", {{ opacity: 1 }}, 14.0).set("#chrome-preview-rev", {{ opacity: 0 }}, 20.6);
          tl.set("#chrome-preview-ink", {{ opacity: 0 }}, 0).set("#chrome-preview-ink", {{ opacity: 1 }}, 20.6).set("#chrome-preview-ink", {{ opacity: 0 }}, 49.4);
          window.__timelines["chrome"] = tl;
        }})();
      </script>
    </template>
  </body>
</html>
"""

captions_doc = f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {FONT.format()}
        #captions {{ position: absolute; inset: 0; font-family: "Inter", sans-serif; }}
        #captions .cap {{ position: absolute; left: 70px; right: 70px; bottom: 350px; display: flex; justify-content: center; }}
        #captions .cap span {{ display: block; max-width: 940px; padding: 14px 28px 16px; border-radius: 18px; background: rgba(28, 26, 42, 0.86);
          color: #ffffff; font-weight: 600; font-size: 44px; line-height: 1.24; text-align: center; letter-spacing: -0.005em; }}
      </style>
      <div id="captions" data-composition-id="captions" data-width="1080" data-height="1920">
{capdivs}
      </div>
      <script>
        (function () {{
          const tl = gsap.timeline({{ paused: true }});
          // same text and timing as captions/captions.srt; a quick, quiet rise per cue
          document.querySelectorAll("#captions .cap").forEach((clip) => {{
            tl.fromTo(clip.querySelector("span"), {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }}, parseFloat(clip.dataset.start));
          }});
          window.__timelines["captions"] = tl;
        }})();
      </script>
    </template>
  </body>
</html>
"""

doc = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>CashNarra — Make Room for Tomorrow</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <script src="assets/music-energy.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #29263d; }}
      #root {{ position: relative; width: 100%; height: 100%; overflow: hidden; background: #29263d; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{f(DUR)}" data-width="1080" data-height="1920">
      <!-- scenes -->
{scenes}
      <!-- persistent brand mark + honesty labels -->
      <div id="chrome" data-composition-id="chrome" data-composition-src="compositions/chrome.html" data-start="0" data-duration="53.2" data-track-index="2" data-width="1080" data-height="1920"></div>
      <!-- burned-in captions -->
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-track-kind="captions" data-start="0" data-duration="{f(DUR)}" data-track-index="3" data-width="1080" data-height="1920"></div>
      <!-- sound -->
      <audio id="vo" src="assets/audio/narration.wav" data-start="0" data-duration="{f(DUR)}" data-track-index="6" data-volume="1"></audio>
      <audio id="music" src="assets/audio/music_mix.wav" data-start="0" data-duration="{f(DUR)}" data-track-index="7" data-volume="1"></audio>
{sfx}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
"""
(ROOT / "index.html").write_text(doc, encoding="utf-8")
(ROOT / "compositions/chrome.html").write_text(chrome_doc, encoding="utf-8")
(ROOT / "compositions/captions.html").write_text(captions_doc, encoding="utf-8")
print("index.html written:", len(caps), "captions,", len(SFX), "sfx")
