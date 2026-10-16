"""Duck the score under the narration (simple, predictable sidechain) -> score_mix.wav.
Full level between lines; about -9.5 dB under the voice, with a gentle 2-4 kHz dip for clarity.
Usage: python duck_mix.py <score.wav> <narration.wav> <out.wav>"""
import sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
sc, vo, out = sys.argv[1:4]
m, sr = sf.read(sc, dtype="float64"); v, _ = sf.read(vo, dtype="float64")
if v.ndim > 1: v = v.mean(1)
n = min(len(m), len(v)); m, v = m[:n], v[:n]
hop = sr // 100  # 10 ms
rms = np.sqrt(np.convolve(v ** 2, np.ones(hop) / hop, "same"))
active = (rms > 10 ** (-42 / 20)).astype(float)
# hold 250 ms so gaps between words don't pump, then smooth: 80 ms attack, 450 ms release
hold = int(0.25 * sr); act = np.maximum.accumulate(active)  # placeholder shape
idx = np.where(active > 0)[0]
held = np.zeros(n)
if len(idx):
    # mark samples within `hold` after any active sample
    last = -10**9; j = 0
    for i in range(0, n, hop):
        while j < len(idx) and idx[j] <= i: last = idx[j]; j += 1
        held[i:i + hop] = 1.0 if i - last <= hold else 0.0
duck_db = -9.5
target = 10 ** (duck_db * held / 20)
g = np.empty(n); cur = 1.0
a_att, a_rel = np.exp(-1 / (0.08 * sr / hop)), np.exp(-1 / (0.45 * sr / hop))
for i in range(0, n, hop):
    t = target[i]; a = a_att if t < cur else a_rel
    cur = a * cur + (1 - a) * t; g[i:i + hop] = cur
presence = sosfilt(butter(2, [2000, 4200], "band", fs=sr, output="sos"), m, axis=0)
dip = (1 - g) / (1 - 10 ** (duck_db / 20))  # 0..1 while ducking
mixed = m * g[:, None] - presence * (0.35 * dip)[:, None]
sf.write(out, mixed.astype(np.float32), sr, subtype="PCM_16")
print("ducked: under-voice gain", round(20 * np.log10(g[held > 0].mean()), 1), "dB")
