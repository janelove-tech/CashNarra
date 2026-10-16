"""Generates the data-driven parts of "In My Own Words":
compositions/s2-voicenote.html (word-timed transcript + voice waveform), chrome.html, captions.html, index.html.
Timings come from captions/captions.json (assemble_vo2.py)."""
import json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DUR = 59.8
cap = json.load(open(ROOT / "captions/captions.json", encoding="utf-8"))
FONT = ('@font-face { font-family: "Inter"; src: url("assets/fonts/InterVariable.woff2") format("woff2"); font-weight: 100 900; }\n'
        '        @font-face { font-family: "Manrope"; src: url("assets/fonts/ManropeVariable.ttf") format("truetype"); font-weight: 200 800; }')
def f(x): return f"{x:.2f}".rstrip("0").rstrip(".")

SCENES = [("s1-evening", 0.0, 5.2), ("s2-voicenote", 5.2, 18.2), ("s3-typeit", 23.4, 7.0),
          ("s4-review", 30.4, 10.6), ("s5-place", 41.0, 11.6), ("s6-ending", 52.6, 7.2)]
S2_START = 5.2

# ---------- s2: the voice note ----------
words = cap["vn_words"]
toks = [w["w"] for w in words]
p1 = toks.index("GH₵300.") + 1
p2 = toks.index("Abena")
pages = [words[:p1], words[p1:p2], words[p2:]]
page_html = []
for pi, pg in enumerate(pages):
    spans = " ".join(
        f'<span class="w{" fig" if "₵" in w["w"] else ""}" id="s2-w{words.index(w)}">{html.escape(w["w"])}</span>' for w in pg)
    page_html.append(f'          <div class="page" id="s2-p{pi}">{spans}</div>')
word_js = json.dumps([[f"s2-w{i}", round(w["t"] - S2_START, 2), "₵" in w["w"]] for i, w in enumerate(words)])
page_js = json.dumps([[f"s2-p{i}", round(pg[0]["t"] - S2_START, 2)] for i, pg in enumerate(pages)])
vn_on, vn_off = cap["vn_start"], cap["vn_end"]
bars = "".join(f'<i id="s2-b{i}"></i>' for i in range(40))

s2 = f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {FONT}
        #s2-voicenote {{ position: absolute; inset: 0; overflow: hidden; background: #29263d; font-family: "Inter", sans-serif; }}
        #s2-voicenote .crop {{ position: absolute; opacity: 0; will-change: transform; background: url("assets/img/campaign-studio.png") 0 0 / 100% 100% no-repeat; }}
        #s2-voicenote #s2-ca {{ left: -2685px; top: -95px; width: 4608px; height: 3072px; transform-origin: 3225px 855px; }}
        #s2-voicenote #s2-cb {{ left: -3300px; top: -510px; width: 4608px; height: 3072px; transform-origin: 3900px 1410px; }}
        #s2-voicenote #s2-cc {{ left: -1632px; top: -26px; width: 3379px; height: 2253px; transform-origin: 2332px 726px; }}
        #s2-voicenote .ink {{ position: absolute; inset: 0; background: #1c1a2a; opacity: 0.66; }}
        #s2-voicenote .vignette {{ position: absolute; inset: 0; background: radial-gradient(110% 75% at 50% 50%, rgba(25,23,35,0) 40%, rgba(25,23,35,0.8) 100%); }}
        #s2-voicenote .say {{ position: absolute; left: 80px; top: 186px; font-family: "Manrope", sans-serif; font-weight: 800; font-size: 76px;
          letter-spacing: -0.035em; color: #ffc4a0; line-height: 1; }}
        #s2-voicenote .rec {{ position: absolute; right: 80px; top: 196px; display: flex; align-items: center; gap: 14px; padding: 12px 24px;
          border-radius: 999px; background: rgba(28,26,42,0.85); border: 2px solid rgba(255,196,160,0.35); color: #ffffff; font-weight: 600;
          font-size: 32px; font-variant-numeric: tabular-nums; }}
        #s2-voicenote .dot {{ display: block; width: 22px; height: 22px; border-radius: 50%; background: #ffc4a0; }}
        #s2-voicenote .page {{ position: absolute; left: 80px; top: 316px; width: 920px; font-weight: 600; font-size: 66px; line-height: 1.26;
          letter-spacing: -0.02em; color: #ffffff; }}
        #s2-voicenote .w {{ display: inline-block; opacity: 0; }}
        #s2-voicenote .w.fig {{ color: #ffc4a0; font-variant-numeric: tabular-nums; }}
        #s2-voicenote .wave {{ position: absolute; left: 80px; top: 1010px; width: 920px; height: 130px; display: flex; align-items: center;
          justify-content: space-between; }}
        #s2-voicenote .wave i {{ display: block; width: 12px; height: 120px; border-radius: 6px; background: #ffc4a0; transform: scaleY(0.06); }}
        #s2-voicenote .note {{ position: absolute; left: 80px; top: 1158px; width: 920px; text-align: center; font-weight: 500; font-size: 25px; color: #d9d4e9; }}
        #s2-voicenote .device {{ position: absolute; left: 272px; top: 451px; width: 536px; height: 1118px; border-radius: 70px; background: #15131f;
          padding: 18px; box-shadow: 0 40px 120px rgba(10,8,20,0.6), inset 0 0 0 2px rgba(255,255,255,0.08); will-change: transform; }}
        #s2-voicenote .screen {{ width: 500px; height: 1082px; border-radius: 54px; overflow: hidden;
          background: #f7f7fa url("assets/ui/voice.png") 0 0 / 500px 1082px no-repeat; }}
      </style>
      <div id="s2-voicenote" data-composition-id="s2-voicenote" data-width="1080" data-height="1920">
        <div class="crop" id="s2-ca"></div><div class="crop" id="s2-cb"></div><div class="crop" id="s2-cc"></div>
        <div class="ink"></div><div class="vignette"></div>
        <div class="device" id="s2-device"><div class="screen"></div></div>
        <div class="say" id="s2-say">SAY IT.</div>
        <div class="rec" id="s2-rec"><span class="dot" id="s2-dot"></span><span id="s2-time">0:00</span></div>
{chr(10).join(page_html)}
        <div class="wave">{bars}</div>
        <div class="note" id="s2-note">Voice capture: the app’s design preview · editable transcript</div>
      </div>
      <script>
        (function () {{
          const tl = gsap.timeline({{ paused: true }});
          const A = window.CN_AUDIO, S = {S2_START};
          // three framings while she talks: eyes → the phone in her hand → her, wider
          [["#s2-ca", 0, 6.3], ["#s2-cb", 6.3, 6.0], ["#s2-cc", 12.3, 5.9]].forEach(([id, at, d]) => {{
            tl.set(id, {{ opacity: 1 }}, at).set(id, {{ opacity: 0 }}, at + d);
            tl.fromTo(id, {{ scale: 1 }}, {{ scale: 1.05, duration: d, ease: "none" }}, at);
          }});
          // recording starts: the real voice screen tucks down so her words can fill the frame
          tl.fromTo("#s2-device", {{ y: 0, scale: 0.86 }}, {{ y: 380, scale: 0.34, duration: 0.75, ease: "power3.inOut" }}, 0);
          tl.fromTo("#s2-say", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }}, 0.05);
          tl.fromTo("#s2-rec", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, 0.05);
          tl.fromTo("#s2-note", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.5 }}, 1.0);
          // the transcript: each word appears as she says it (Whisper word timings); figures in apricot
          const W = {word_js};
          W.forEach(([id, at, fig]) => tl.fromTo("#" + id, {{ opacity: 0, y: 14 }},
            {{ opacity: 1, y: 0, duration: fig ? 0.22 : 0.16, ease: "power2.out", immediateRender: true }}, Math.max(0.01, at - 0.04)));
          const P = {page_js};
          P.forEach(([id, at], i) => {{
            if (i > 0) tl.to("#" + P[i - 1][0], {{ opacity: 0, y: -40, duration: 0.3, ease: "power2.in" }}, at - 0.32);
          }});
          tl.to("#" + P[P.length - 1][0], {{ opacity: 0, y: -30, duration: 0.3, ease: "power2.in" }}, 17.85);
          // live timer + waveform, both read from timeline time (seek-safe); the waveform is her voice energy
          const px = {{ t: 0 }}, timeEl = document.getElementById("s2-time"), dot = document.getElementById("s2-dot");
          const bars = [...Array(40)].map((_, i) => document.getElementById("s2-b" + i));
          tl.fromTo(px, {{ t: 0 }}, {{ t: 18.2, duration: 18.2, ease: "none", onUpdate: () => {{
            const g = S + px.t, rec = g >= {vn_on} - 0.2 && g <= {vn_off} + 0.05;
            const secs = Math.max(0, Math.min(Math.floor({vn_off} - {vn_on}), Math.floor(g - {vn_on})));
            timeEl.textContent = "0:" + String(secs).padStart(2, "0");
            dot.style.opacity = rec ? (0.55 + 0.45 * Math.abs(Math.cos(px.t * 3.1))).toFixed(2) : "1";
            dot.style.borderRadius = g > {vn_off} + 0.05 ? "5px" : "50%";
            const fi = Math.min(A.voice.length - 1, Math.round(g * A.fps));
            const v = rec ? A.voice[fi] : 0;
            bars.forEach((b, i) => {{
              const shape = 0.45 + 0.55 * Math.abs(Math.sin(i * 1.7 + px.t * 7.3)) * (1 - Math.abs(i - 19.5) / 26);
              b.style.transform = "scaleY(" + (0.06 + 0.94 * v * shape).toFixed(3) + ")";
            }});
          }} }}, 0);
          window.__timelines["s2-voicenote"] = tl;
        }})();
      </script>
    </template>
  </body>
</html>
"""
(ROOT / "compositions/s2-voicenote.html").write_text(s2, encoding="utf-8")

# ---------- chrome ----------
chrome = f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {FONT}
        #chrome {{ position: absolute; inset: 0; font-family: "Inter", sans-serif; }}
        #chrome .logo {{ position: absolute; left: 80px; top: 98px; width: 200px; height: 40px; }}
        #chrome .logo img {{ display: block; width: 200px; height: 40px; }}
        #chrome .label {{ position: absolute; right: 80px; top: 104px; font-weight: 600; font-size: 24px; letter-spacing: 0.01em; }}
        #chrome .rev {{ color: #e6e1f2; }}
        #chrome .ink {{ color: #4f4b63; }}
      </style>
      <div id="chrome" data-composition-id="chrome" data-width="1080" data-height="1920">
        <div class="logo" id="chrome-logo-rev"><img src="assets/brand/cashnarra-lockup-reversed.svg" alt="CashNarra" /></div>
        <div class="logo" id="chrome-logo-ink" style="opacity: 0"><img src="assets/brand/cashnarra-lockup.svg" alt="CashNarra" /></div>
        <div class="label rev" id="chrome-story">Illustrative business story</div>
        <div class="label rev" id="chrome-prev-rev" style="opacity: 0">Product preview • Illustrative data</div>
        <div class="label ink" id="chrome-prev-ink" style="opacity: 0">Product preview • Illustrative data</div>
      </div>
      <script>
        (function () {{
          const tl = gsap.timeline({{ paused: true }});
          const sw = (id, pts) => pts.forEach(([t, o]) => tl.set(id, {{ opacity: o }}, t));
          sw("#chrome-logo-rev", [[0, 1], [30.4, 0], [52.6, 1]]);
          sw("#chrome-logo-ink", [[0, 0], [30.4, 1], [52.6, 0]]);
          sw("#chrome-story", [[0, 1], [3.2, 0], [52.6, 1]]);
          sw("#chrome-prev-rev", [[0, 0], [3.2, 1], [30.4, 0]]);
          sw("#chrome-prev-ink", [[0, 0], [30.4, 1], [52.6, 0]]);
          window.__timelines["chrome"] = tl;
        }})();
      </script>
    </template>
  </body>
</html>
"""
(ROOT / "compositions/chrome.html").write_text(chrome, encoding="utf-8")

# ---------- captions (burned cues only; the voice note is carried by the on-screen transcript) ----------
burn = [c for c in cap["cues"] if c["burn"]]
capdivs = "\n".join(
    f'        <div id="cap-{n:02}" class="clip cap" data-start="{f(c["start"])}" data-duration="{f(c["end"] - c["start"])}" data-track-index="0">'
    f'<span>{html.escape(c["text"])}</span></div>' for n, c in enumerate(burn, 1))
captions = f"""<!doctype html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
        {FONT}
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
(ROOT / "compositions/captions.html").write_text(captions, encoding="utf-8")

# ---------- root ----------
SFX = [("sfx-close", "sfx_close_click", 0.25, 0.5, 0.5), ("sfx-rec-on", "sfx_rec_start", 5.22, 0.55, 0.22),
       ("sfx-rec-off", "sfx_rec_stop", 23.15, 0.55, 0.22), ("sfx-air", "sfx_air", 23.3, 0.4, 1.2),
       ("sfx-typing", "sfx_typing", 26.5, 0.4, 3.0), ("sfx-tap-1", "sfx_tap", 30.95, 0.45, 0.12),
       ("sfx-tap-2", "sfx_tap", 37.18, 0.45, 0.12), ("sfx-tap-3", "sfx_tap", 37.9, 0.45, 0.12),
       ("sfx-tap-4", "sfx_tap", 39.95, 0.45, 0.12), ("sfx-saved", "sfx_saved", 40.3, 0.45, 2.0)]
scenes = "\n".join(
    f'      <div id="{i}" data-composition-id="{i}" data-composition-src="compositions/{i}.html" data-start="{f(s)}" '
    f'data-duration="{f(d)}" data-track-index="1" data-width="1080" data-height="1920"></div>' for i, s, d in SCENES)
sfx = "\n".join(
    f'      <audio id="{i}" src="assets/audio/{fn}.wav" data-start="{f(s)}" data-duration="{f(d)}" data-track-index="{9 if i == 'sfx-air' else 8}" data-volume="{v}"></audio>'
    for i, fn, s, v, d in SFX)
index = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>CashNarra — In My Own Words</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <script src="assets/audio-data.js"></script>
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
      <!-- brand mark + honesty labels -->
      <div id="chrome" data-composition-id="chrome" data-composition-src="compositions/chrome.html" data-start="0" data-duration="55.4" data-track-index="2" data-width="1080" data-height="1920"></div>
      <!-- burned-in captions -->
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-track-kind="captions" data-start="0" data-duration="{f(DUR)}" data-track-index="3" data-width="1080" data-height="1920"></div>
      <!-- sound -->
      <audio id="vo" src="assets/audio/narration.wav" data-start="0" data-duration="{f(DUR)}" data-track-index="6" data-volume="1"></audio>
      <audio id="music" src="assets/audio/score_mix.wav" data-start="0" data-duration="{f(DUR)}" data-track-index="7" data-volume="1"></audio>
{sfx}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
"""
(ROOT / "index.html").write_text(index, encoding="utf-8")
print("built:", len(words), "transcript words,", len(burn), "burned captions")
