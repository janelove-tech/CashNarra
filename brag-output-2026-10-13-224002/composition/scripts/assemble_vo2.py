"""Place Ama's lines + the voice note on the timeline -> narration.wav, captions.srt, captions.json.
The voice note gets a phone-mic treatment (band-limited, slightly driven) so it reads as a recording.
Usage: python assemble_vo2.py <phrase_dir> <audio_out_dir> <captions_dir>"""
import sys, json, os
import numpy as np, soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt

src, out_audio, out_caps = sys.argv[1:4]
DUR, SR = 59.8, 48000
meta = {p["id"]: p for p in json.load(open(f"{src}/phrases.json", encoding="utf-8"))["phrases"]}
SCHEDULE = [("n01", 0.70), ("vn", 5.40), ("n02", 23.60), ("n03", 26.30), ("n04", 30.70), ("n05", 33.50),
            ("n06", 37.15), ("n07", 38.30), ("n08", 41.30), ("n09", 45.50), ("n10", 47.60),
            ("n12", 52.90), ("n14", 55.60), ("n15", 58.20)]
start = dict(SCHEDULE); end = {p: start[p] + meta[p]["dur"] for p in start}
order = sorted(SCHEDULE, key=lambda x: x[1])
for (a, _), (b, tb) in zip(order, order[1:]):
    assert end[a] + 0.12 <= tb, f"{a} overlaps {b}"
assert max(end.values()) <= DUR - 0.5

def phone(x):
    x = sosfilt(butter(2, [230, 6200], "band", fs=SR, output="sos"), x)
    x = np.tanh(x * 2.2) / np.tanh(2.2)
    return x * 0.82

mix = np.zeros(int(DUR * SR), dtype=np.float32)
for pid, t in SCHEDULE:
    a, sr = sf.read(f"{src}/{pid}.wav", dtype="float32")
    a = resample_poly(a, SR // 1000, sr // 1000).astype(np.float32)
    if pid == "vn":
        a = phone(a / np.max(np.abs(a))).astype(np.float32) * np.max(np.abs(a))
    i = int(round(t * SR)); mix[i:i + len(a)] += a
mix *= 0.89 / np.max(np.abs(mix))
os.makedirs(out_audio, exist_ok=True)
sf.write(f"{out_audio}/narration.wav", mix, SR, subtype="PCM_16")

# voice-note transcript: display text = the canonical clarification variant, word-timed by Whisper
DISPLAY = ("Today I sold GH₵2,400: GH₵900 cash, GH₵1,200 MoMo, and Kojo still owes GH₵300. I bought GH₵700 of stock "
           "with cash, paid GH₵80 delivery, moved GH₵500 from bank to MoMo, Abena paid GH₵200 of what she owed into MoMo, "
           "and I took GH₵150 cash home.")
words = json.load(open(f"{src}/vn_words.json"))
merged = []
for w in words:  # whisper splits "$2" ",400," — rejoin
    if merged and w["w"].startswith(","): merged[-1]["e"] = w["e"]
    else: merged.append(dict(w))
tokens = DISPLAY.split(" ")
assert len(tokens) == len(merged), (len(tokens), len(merged))
vn_words = [{"t": round(start["vn"] + m["s"], 2), "w": tok} for tok, m in zip(tokens, merged)]

CUES = [  # (first, last, text, burn)
    ("n01", "n01", "Every evening, before I lock up, I tell my phone how the day went.", True),
    ("vn", "vn", None, False),
    ("n02", "n02", "No forms. No accounting words.", True),
    ("n03", "n03", "Busy with a customer? I type it as it happens.", True),
    ("n04", "n04", "CashNarra turns my words into records.", True),
    ("n05", "n05", "It asks what I left out. Which account paid for delivery?", True),
    ("n06", "n07", "MoMo. I check all eight, and I save.", True),
    ("n08", "n08", "Abena’s GH₵200 is not a new sale. She owes GH₵400 now.", True),
    ("n09", "n09", "Kojo still owes GH₵300.", True),
    ("n10", "n10", "GH₵2,300 came in. GH₵930 went out.", True),
    ("n12", "n12", "My day. My words. My numbers.", True),
    ("n14", "n14", "Tell your money story. See the numbers.", True),
    ("n15", "n15", "Coming soon.", True),
]
cues = []
for i, (a, b, text, burn) in enumerate(CUES):
    nxt = start[CUES[i + 1][0]] - 0.08 if i + 1 < len(CUES) else DUR
    if a == "vn":  # one SRT cue per spoken clause of the voice note (on-screen transcript carries it)
        clauses, cur = [], []
        for w in vn_words:
            cur.append(w)
            if w["w"].endswith((",", ".", ":")) and len(" ".join(x["w"] for x in cur)) > 14:
                clauses.append(cur); cur = []
        if cur: clauses.append(cur)
        for j, c in enumerate(clauses):
            ce = clauses[j + 1][0]["t"] - 0.05 if j + 1 < len(clauses) else round(end["vn"] + 0.3, 2)
            cues.append({"start": round(c[0]["t"] - 0.05, 2), "end": round(ce, 2), "text": "🎙 " + " ".join(x["w"] for x in c), "burn": False})
        continue
    cues.append({"start": round(start[a] - 0.05, 2), "end": round(min(end[b] + 0.45, nxt), 2), "text": text, "burn": burn})

def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"
os.makedirs(out_caps, exist_ok=True)
with open(f"{out_caps}/captions.srt", "w", encoding="utf-8") as f:
    for i, c in enumerate(cues, 1):
        f.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text'].replace('🎙 ', '[voice note] ')}\n\n")
json.dump({"cues": cues, "vn_words": vn_words, "vn_start": start["vn"], "vn_end": round(end["vn"], 2),
           "phrases": [{"id": p, "start": t, "end": round(end[p], 3)} for p, t in SCHEDULE]},
          open(f"{out_caps}/captions.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for c in cues: print(f"{c['start']:6.2f}-{c['end']:6.2f} {'B' if c['burn'] else ' '} {c['text']}")
print("vn", start["vn"], "->", round(end["vn"], 2), "| last speech", round(max(end.values()), 2))
