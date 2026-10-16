"""Place measured Kokoro phrases on the film timeline -> narration.wav, captions.srt, captions.json.
Usage: python assemble_vo.py <phrase_dir> <out_audio_dir> <captions_dir>"""
import sys, json, os
import numpy as np, soundfile as sf
from scipy.signal import resample_poly

src, out_audio, out_caps = sys.argv[1:4]
DUR, SR = 59.8, 48000
meta = {p["id"]: p for p in json.load(open(f"{src}/phrases.json", encoding="utf-8"))["phrases"]}

# phrase id -> start time (s). Pauses are deliberate; see STORYBOARD.md.
SCHEDULE = [
    ("p01", 0.60), ("p02", 2.30),
    ("p03", 5.00), ("p04", 5.75), ("p05", 6.62), ("p06", 7.42),
    ("p07", 8.42), ("p08", 9.95), ("p09", 11.85), ("p09b", 13.00),
    ("p10", 14.40), ("p11", 16.90), ("p12", 18.60),
    ("p13", 21.00), ("p14", 24.20),
    ("p15", 30.20), ("p16", 32.90), ("p17", 35.40),
    ("p18", 41.90), ("p19", 43.40), ("p20", 46.00),
    ("p21", 49.80), ("p22", 51.50), ("p23", 54.00), ("p24", 55.50), ("p25", 58.20),
]
# caption cues: (first phrase, last phrase, text)
CUES = [
    ("p01", "p01", "Your shop is closed."),
    ("p02", "p02", "Your head is still doing the accounts."),
    ("p03", "p06", "Cash. MoMo. Stock. Delivery."),
    ("p07", "p07", "Kojo still owes you."),
    ("p08", "p08", "Abena paid part of her debt."),
    ("p09", "p09b", "Your day… in pieces."),
    ("p10", "p10", "Give your money story somewhere to live."),
    ("p11", "p11", "Meet CashNarra."),
    ("p12", "p12", "Type it as it happened."),
    ("p13", "p13", "It turns your words into records."),
    ("p14", "p14", "You check the details, fill in what’s missing, and save."),
    ("p15", "p15", "Abena’s payment reduces her debt."),
    ("p16", "p16", "Kojo still owes three hundred."),
    ("p17", "p17", "You see what came in, what went out, and what’s still owed."),
    ("p18", "p18", "Now look ahead."),
    ("p19", "p19", "That new equipment. Your progress."),
    ("p20", "p20", "What a different contribution could change."),
    ("p21", "p21", "You’ve done the work."),
    ("p22", "p22", "Make room for tomorrow."),
    ("p23", "p23", "CashNarra."),
    ("p24", "p24", "Tell your money story. See the numbers."),
    ("p25", "p25", "Coming soon."),
]
start = dict(SCHEDULE)
end = {pid: start[pid] + meta[pid]["dur"] for pid in start}

# overlap guard
order = sorted(SCHEDULE, key=lambda x: x[1])
for (a, ta), (b, tb) in zip(order, order[1:]):
    assert end[a] + 0.12 <= tb, f"{a} overlaps {b}: {end[a]:.2f} > {tb:.2f}"
assert max(end.values()) <= DUR - 0.4

mix = np.zeros(int(DUR * SR), dtype=np.float32)
for pid, t in SCHEDULE:
    a, sr = sf.read(f"{src}/{pid}.wav", dtype="float32")
    a = resample_poly(a, SR // 1000, sr // 1000).astype(np.float32)
    i = int(round(t * SR))
    mix[i:i + len(a)] += a
mix *= 0.89 / np.max(np.abs(mix))  # about -1 dBFS peak
os.makedirs(out_audio, exist_ok=True)
sf.write(f"{out_audio}/narration.wav", mix, SR, subtype="PCM_16")

def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

cues = []
for i, (a, b, text) in enumerate(CUES):
    s = round(start[a] - 0.05, 2)
    nxt = start[CUES[i + 1][0]] - 0.08 if i + 1 < len(CUES) else DUR
    e = round(min(end[b] + 0.45, nxt), 2)
    cues.append({"start": s, "end": e, "text": text})
os.makedirs(out_caps, exist_ok=True)
with open(f"{out_caps}/captions.srt", "w", encoding="utf-8") as f:
    for i, c in enumerate(cues, 1):
        f.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}\n\n")
json.dump({"cues": cues, "phrases": [{"id": p, "start": t, "end": round(end[p], 3), "text": meta[p]["text"]} for p, t in SCHEDULE]},
          open(f"{out_caps}/captions.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for c in cues: print(f"{c['start']:6.2f}-{c['end']:6.2f} {c['text']}")
print("last speech ends", round(max(end.values()), 2))
