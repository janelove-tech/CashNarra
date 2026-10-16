"""Original instrumental bed + sparse SFX for "Make Room for Tomorrow".
Synthesised from scratch with numpy/scipy (no samples, no third-party audio),
so the output is the project's own and free for commercial use.
Usage: python synth_audio.py <out_dir>
"""
import sys, os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 59.8
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(20261013)  # seeded: reproducible


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env_points(points, n):
    """Piecewise-linear envelope from (time, value) points."""
    ts, vs = zip(*points)
    return np.interp(np.arange(n) / SR, ts, vs)


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    if j > i:
        buf[i:j] += sig[: j - i] * gain


def pad_voice(freq, sec, bright=0.35):
    """Warm detuned pad tone (two slightly detuned saws, low-passed)."""
    t = t_axis(sec)
    s = np.zeros_like(t)
    for det in (-0.12, 0.0, 0.11):
        f = freq * 2 ** (det / 12)
        ph = (f * t + rng.random()) % 1.0
        s += 2 * ph - 1
    s /= 3
    s = lp(s, 380 + 2200 * bright, 2)
    att, rel = min(1.6, sec / 3), min(2.2, sec / 2.5)
    e = np.ones_like(t)
    a, r = int(att * SR), int(rel * SR)
    e[:a] = np.linspace(0, 1, a) ** 1.6
    e[-r:] = np.linspace(1, 0, r) ** 1.4
    return s * e


def chord(notes, sec, bright=0.35):
    return sum(pad_voice(midi(n), sec, bright) for n in notes) / len(notes)


def pluck(freq, sec=1.6, decay=3.2, bright=0.5):
    t = t_axis(sec)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t * 6)
    s += 0.12 * np.sin(2 * np.pi * 3 * freq * t) * np.exp(-t * 9)
    e = np.exp(-t * decay) * (1 - np.exp(-t * 400))
    return lp(s * e, 1200 + 3000 * bright)


def thump(sec=0.9):
    t = t_axis(sec)
    f = 46 + 40 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) * (1 - np.exp(-t * 900))


def bell(freq, sec=4.0):
    t = t_axis(sec)
    s = (np.sin(2 * np.pi * freq * t) * np.exp(-t * 0.9)
         + 0.4 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 2.2)
         + 0.18 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t * 4))
    return s * (1 - np.exp(-t * 300))


N = int(DUR * SR)
music = np.zeros((N, 2))
L, R = 0, 1


def put_st(sig, at, gain=1.0, pan=0.0):
    gl, gr = gain * np.sqrt((1 - pan) / 2), gain * np.sqrt((1 + pan) / 2)
    place(music[:, L], sig, at, gl)
    place(music[:, R], sig, at, gr)


# --- Room tone (whole film, very low) -------------------------------------------
noise = rng.standard_normal(N)
room = lp(hp(noise, 60), 900) * 0.012
music[:, L] += room
music[:, R] += lp(hp(rng.standard_normal(N), 60), 900) * 0.012

# --- 00–05: low drone enters after the click -------------------------------------
put_st(chord([38, 45], 4.0, 0.15) * env_points([(0, 0), (1.5, 0.6), (4.0, 1)], int(4.0 * SR)), 1.2, 0.20)

# --- 05–13.6: restrained pulse (76 bpm) + dim pad -----------------------------------
BEAT = 60 / 76
b = 5.0
k = 0
while b < 13.4:
    put_st(thump(), b, 0.30 if k % 2 == 0 else 0.20)
    if k % 4 == 3:
        put_st(pluck(midi(62 + (0 if k % 8 == 3 else 2)), 1.2, 4.5, 0.3), b + BEAT / 2, 0.06, 0.3)
    b += BEAT
    k += 1
put_st(chord([35, 47, 54, 57], 4.4, 0.25), 5.0, 0.20)     # Bm
put_st(chord([31, 47, 50, 54], 4.6, 0.25), 9.2, 0.20)     # Gmaj7
# --- 13.6–16.8: the drop (room tone only) --------------------------------------------
# --- 16.8: a single soft swell + bell on "Meet CashNarra" -----------------------------
put_st(bell(midi(74), 4.5), 16.85, 0.10, -0.1)
put_st(bell(midi(81), 4.0), 16.88, 0.04, 0.2)
# --- 19.4–29.8: clean, ordered pad + quiet arpeggio -----------------------------------
put_st(chord([38, 50, 54, 57, 64], 5.6, 0.3), 19.2, 0.19)   # Dadd9
put_st(chord([33, 49, 52, 57, 64], 5.6, 0.3), 24.4, 0.19)   # A
arp = [62, 66, 69, 73, 69, 66]
t0 = 20.6
for i in range(int((29.6 - t0) / (BEAT / 2))):
    put_st(pluck(midi(arp[i % len(arp)]), 1.4, 5.0, 0.25), t0 + i * BEAT / 2, 0.035, 0.35 if i % 2 else -0.35)
# --- 29.8–41.6: steadier, light pulse returns -----------------------------------------
for ch, at in (([35, 50, 54, 59], 29.6), ([31, 50, 55, 59], 33.8), ([38, 50, 54, 57], 37.8)):
    put_st(chord(ch, 4.6, 0.32), at, 0.19)
b = 30.0
k = 0
while b < 41.0:
    if k % 2 == 0:
        put_st(thump(), b, 0.12)
    b += BEAT
    k += 1
# --- 41.6–49.4: open up — wider, brighter voicing -------------------------------------
put_st(chord([31, 43, 50, 55, 59, 66], 4.4, 0.55), 41.4, 0.24)   # Gmaj7 open
put_st(chord([33, 45, 52, 57, 61, 64], 4.4, 0.6), 45.2, 0.24)    # A add9
for i, n in enumerate([74, 78, 81, 83, 86, 81, 78, 83]):
    put_st(pluck(midi(n), 2.0, 2.6, 0.5), 41.8 + i * BEAT, 0.045, (-0.4 + 0.1 * i))
# --- 49.4–59.8: resolve — warm Dmaj9, settle and fade ------------------------------------
put_st(chord([26, 38, 50, 54, 57, 61, 64], 6.0, 0.4), 49.2, 0.24)
put_st(chord([26, 38, 50, 54, 57, 61, 64], 7.0, 0.3), 53.0, 0.22)
put_st(bell(midi(74), 5.0), 53.2, 0.07)
put_st(bell(midi(78), 4.0), 58.2, 0.035, 0.2)

# master fade in/out, gentle limiter
fade = env_points([(0, 0), (0.05, 1), (DUR - 3.0, 1), (DUR, 0)], N)
music *= fade[:, None]
music = np.tanh(music * 1.4) / 1.4
peak = np.max(np.abs(music))
music *= 0.5 / peak  # bed peaks at -6 dBFS before track gain
sf.write(f"{out}/music_bed.wav", music.astype(np.float32), SR, subtype="PCM_16")

# --- SFX --------------------------------------------------------------------------
def save(name, sig, gain=0.7):
    sig = sig / (np.max(np.abs(sig)) + 1e-9) * gain
    sf.write(f"{out}/{name}.wav", np.stack([sig, sig], 1).astype(np.float32), SR, subtype="PCM_16")


# closing click: door latch — short transient + low knock
t = t_axis(0.5)
click = bp(rng.standard_normal(len(t)), 1800, 6500) * np.exp(-t * 90)
knock = np.sin(2 * np.pi * 140 * t) * np.exp(-t * 30)
click2 = np.zeros_like(t)
place(click2, bp(rng.standard_normal(len(t)), 2200, 7000) * np.exp(-t * 140), 0.055, 0.6)
save("sfx_close_click", click + 0.7 * knock + click2, 0.6)

# UI tap: soft, dry tick
t = t_axis(0.12)
tap = bp(rng.standard_normal(len(t)), 900, 4000) * np.exp(-t * 160) + 0.5 * np.sin(2 * np.pi * 520 * t) * np.exp(-t * 90)
save("sfx_tap", tap, 0.5)

# key ticks for typing
t = t_axis(0.06)
tick = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 220)
save("sfx_key", tick, 0.35)

# air: soft whoosh for the match cut
t = t_axis(1.2)
air = bp(rng.standard_normal(len(t)), 300, 2400) * np.sin(np.pi * np.clip(t / 1.2, 0, 1)) ** 2
save("sfx_air", air, 0.35)

# saved: two-note soft chime (A5 → D6)
t = t_axis(2.0)
ch = np.zeros_like(t)
place(ch, bell(midi(81), 2.0), 0.0, 0.6)
place(ch, bell(midi(86), 1.9), 0.11, 0.5)
save("sfx_saved", ch, 0.4)

# fragment: very soft paper/glass tick for each thought fragment
t = t_axis(0.4)
frag = bp(rng.standard_normal(len(t)), 1200, 5000) * np.exp(-t * 35) * 0.5 + np.sin(2 * np.pi * midi(86) * t) * np.exp(-t * 14) * 0.25
save("sfx_fragment", frag, 0.3)
# typing: ~1.9 s of soft key ticks on a slightly uneven, seeded rhythm
t = t_axis(2.0)
typing = np.zeros_like(t)
k_t = t_axis(0.06)
at = 0.0
while at < 1.85:
    tk = hp(rng.standard_normal(len(k_t)), 2200) * np.exp(-k_t * 240) * (0.6 + 0.4 * rng.random())
    place(typing, tk, at)
    at += 0.075 + 0.07 * rng.random()
save("sfx_typing", typing, 0.3)
print("ok", DUR)
