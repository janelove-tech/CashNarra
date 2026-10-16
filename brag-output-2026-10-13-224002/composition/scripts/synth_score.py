"""Original cinematic score + SFX for "CashNarra — In My Own Words" (59.8 s).
Synthesised from scratch (numpy/scipy, seeded): piano, string ensemble, cello ostinato,
timpani/boom hits, risers and a synthetic convolution hall. No samples, no third-party audio.
Usage: python synth_score.py <out_dir>
"""
import sys, os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 59.8
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(20261013)


def T(sec): return np.arange(int(sec * SR)) / SR
def lp(x, hz, o=2): return sosfilt(butter(o, hz, "low", fs=SR, output="sos"), x)
def hp(x, hz, o=2): return sosfilt(butter(o, hz, "high", fs=SR, output="sos"), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], "band", fs=SR, output="sos"), x)
def mf(n): return 440.0 * 2 ** ((n - 69) / 12)


N = int(DUR * SR)
dry = np.zeros((N, 2))   # goes through the hall
direct = np.zeros((N, 2))  # stays dry (hits' transients, low end)


def put(buf, sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    sig = np.array(sig, dtype=float)
    fo = min(len(sig) // 4, int(0.03 * SR))  # end-fade every event: no truncation clicks
    if fo > 0:
        ramp = np.linspace(1, 0, fo)
        sig[-fo:] = sig[-fo:] * (ramp if sig.ndim == 1 else ramp[:, None])
    if sig.ndim == 1:
        gl, gr = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
        sig = np.stack([sig * gl, sig * gr], 1)
    j = min(N, i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def env(n, att, rel, sus=1.0):
    e = np.full(n, sus)
    a, r = int(att * SR), int(rel * SR)
    a = min(a, n); r = min(r, n - a)
    e[:a] = np.linspace(0, 1, a) ** 1.5 * sus
    if r > 0: e[-r:] = np.linspace(1, 0, r) ** 1.3 * sus
    return e


# ---------------- instruments ----------------
def piano(note, sec=4.0, vel=1.0):
    f0 = mf(note); t = T(sec); s = np.zeros_like(t)
    B = 0.0004
    for k in range(1, 9):
        fk = f0 * k * np.sqrt(1 + B * k * k)
        if fk > 12000: break
        amp = (1 / k ** 1.25) * (0.6 + 0.4 * vel)
        dec = 0.9 + 0.55 * k * (f0 / 440) ** 0.4
        s += amp * np.sin(2 * np.pi * fk * t + k) * np.exp(-t * dec)
    s += 0.15 * hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 90)  # hammer
    s *= (1 - np.exp(-t * 600))
    return lp(s, 2200 + 3500 * vel) * vel


def strings(notes, sec, att=1.6, rel=2.0, bright=0.4, vib=0.004):
    t = T(sec); L = np.zeros_like(t); R = np.zeros_like(t)
    for n in notes:
        for v in range(5):
            det = (v - 2) * 0.07
            f = mf(n) * 2 ** (det / 12)
            vibr = 1 + vib * np.sin(2 * np.pi * (5.2 + 0.3 * v) * t + v)
            ph = np.cumsum(f * vibr) / SR + rng.random()
            saw = 2 * (ph % 1.0) - 1
            pan = (v - 2) / 2.5
            L += saw * np.sqrt((1 - pan) / 2); R += saw * np.sqrt((1 + pan) / 2)
    cut = 900 + 3000 * bright
    st = np.stack([lp(lp(L, cut), cut * 1.4), lp(lp(R, cut), cut * 1.4)], 1)
    st /= (len(notes) * 5)
    return st * env(len(t), att, rel)[:, None]


def cello(note, sec=0.34):
    t = T(sec); f = mf(note)
    ph = np.cumsum(np.full(len(t), f) * (1 + 0.003 * np.sin(2 * np.pi * 6 * t))) / SR
    saw = 2 * (ph % 1.0) - 1
    e = (1 - np.exp(-t * 60)) * np.exp(-t * 7)
    return lp(saw, 1400) * e


def boom(sec=3.5, f0=48):
    t = T(sec); f = f0 + 38 * np.exp(-t * 14)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    s += 0.35 * lp(rng.standard_normal(len(t)), 300) * np.exp(-t * 9)
    return s * (1 - np.exp(-t * 900))


def timp_roll(sec, f0=55):
    t = T(sec); s = np.zeros_like(t)
    k = 0; at = 0.0
    while at < sec - 0.05:
        hit = np.sin(2 * np.pi * f0 * T(0.4)) * np.exp(-T(0.4) * 8) + 0.3 * lp(rng.standard_normal(int(0.4 * SR)), 400) * np.exp(-T(0.4) * 20)
        g = 0.25 + 0.75 * (at / sec) ** 2
        i = int(at * SR); j = min(len(s), i + len(hit)); s[i:j] += hit[: j - i] * g
        at += 0.075; k += 1
    return s


def riser(sec):
    t = T(sec); n = rng.standard_normal(len(t))
    sweep = np.zeros_like(t)
    for a in range(0, len(t), 2400):  # stepped band sweep
        c = 300 + 3500 * (a / len(t)) ** 2
        seg = n[a:a + 2400]
        sweep[a:a + len(seg)] = bp(seg, c * 0.7, c * 1.3, 1)
    return sweep * (t / sec) ** 2.2


def bell(note, sec=4.0):
    f = mf(note); t = T(sec)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t * 0.8) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 2.1)
         + 0.15 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 3.5))
    return s * (1 - np.exp(-t * 300))


# ---------------- arrangement (key: D minor → F major) ----------------
Dm, Bb, F, C, Gm, Am = [38, 50, 53, 57], [34, 50, 53, 58], [41, 53, 57, 60], [36, 52, 55, 60], [43, 55, 58, 62], [45, 52, 57, 60]
BEAT = 60 / 84

# 0–5.2 closing: low drone + a descending piano motif
put(dry, strings([38, 45, 50], 6.0, att=1.6, rel=1.6, bright=0.2), 0.0, 0.85)
for n, at in ((69, 0.55), (65, 1.75), (64, 2.95), (62, 4.1)):
    put(dry, piano(n, 4.0, 0.6), at, 0.58, -0.15)

# 5.2–23.4 the voice note: a warm, present bed under her voice — full string chords, a low piano
# arpeggio on the beat and a soft heartbeat pulse (sits mostly below the speech band)
for ch, at, d in ((Dm, 5.0, 5.2), (Bb, 9.6, 5.0), (F, 14.2, 5.0), (C, 18.8, 5.2)):
    put(dry, strings(ch, d, att=1.2, rel=1.6, bright=0.25), at, 0.75)
ARP = {0: [50, 57, 53, 57], 1: [46, 53, 50, 53], 2: [41, 48, 45, 48], 3: [48, 55, 52, 55]}
b = 5.4; k = 0
while b < 23.0:
    sec = min(3, int((b - 5.0) / 4.6))
    put(dry, piano(ARP[sec][k % 4], 2.2, 0.45), b, 0.32, 0.2 if k % 2 else -0.2)
    if k % 2 == 0:
        put(direct, boom(0.9, 50) * 0.6, b, 0.22)
    b += BEAT; k += 1

# 23.4–30.4 or type it: strings swell in, the motif rises
put(dry, strings(Bb, 3.8, att=1.0, rel=1.4, bright=0.45), 23.3, 0.85)
put(dry, strings(F + [65], 4.2, att=0.8, rel=1.6, bright=0.5), 26.6, 0.9)
for n, at in ((69, 23.5), (72, 24.6), (74, 25.7), (72, 26.9), (77, 28.1), (76, 29.3)):
    put(dry, piano(n, 3.5, 0.6), at, 0.33, 0.1)

# 30.4–41.0 the records: cello ostinato drives, piano motif on top
seq = [(Dm, 30.4), (Bb, 33.0), (F, 35.7), (C, 38.3)]
for ch, at in seq:
    put(dry, strings([x + 12 for x in ch[1:]], 2.9, att=0.6, rel=1.0, bright=0.45), at, 0.75)
b = 30.4; k = 0
while b < 40.9:
    root = [c for c, at in seq if at <= b + 1e-6][-1][0]
    put(direct, cello(root + 12 if k % 4 == 2 else root, 0.32), b, 0.34, -0.2)
    if k % 4 == 0:
        put(direct, boom(1.0, 52) * 0.5, b, 0.35)
    b += BEAT / 2; k += 1
for n, at in ((74, 31.0), (72, 32.4), (69, 33.6), (77, 36.2), (76, 37.6), (74, 39.0)):
    put(dry, piano(n, 3.0, 0.55), at, 0.28, 0.15)

# 41.0–52.6 the meaning: full strings, roll + riser into the big lift on "came in" (47.6)
put(dry, strings(Bb + [62], 3.4, att=0.5, rel=1.2, bright=0.5), 41.0, 0.95)
put(dry, strings(Gm + [65], 3.4, att=0.6, rel=1.2, bright=0.55), 44.2, 0.95)
put(direct, timp_roll(1.6, 55), 46.0, 0.35)
put(dry, riser(2.0), 45.6, 0.12)
put(direct, boom(4.0, 44), 47.6, 0.85)                           # strong cue: 47.6
put(dry, strings(F + [65, 69, 72], 5.2, att=0.25, rel=2.2, bright=0.55), 47.55, 0.8)
put(dry, bell(77, 4.0), 47.6, 0.13, 0.2)
put(dry, strings(C + [64, 67], 3.0, att=0.9, rel=1.4, bright=0.55), 51.4, 0.8)
for n, at in ((72, 48.4), (74, 49.3), (77, 50.2), (79, 51.1)):
    put(dry, piano(n, 3.0, 0.65), at, 0.28, 0.1)

# 52.6–59.8 resolve: motif returns, plate lands on F major (55.4), rings to silence
for n, at in ((69, 52.8), (65, 53.9), (64, 54.6)):
    put(dry, piano(n, 4.0, 0.6), at, 0.36, -0.1)
put(direct, boom(4.5, 41), 55.4, 0.7)                             # strong cue: 55.4
put(dry, strings([29, 41, 53, 57, 60, 65, 67], 4.6, att=0.4, rel=3.4, bright=0.6), 55.35, 1.2)
put(dry, piano(65, 4.4, 0.7), 55.4, 0.38)
put(dry, piano(72, 4.2, 0.6), 55.42, 0.3, 0.2)
put(dry, bell(84, 4.0), 58.2, 0.08, 0.2)

# ---------------- hall (synthetic stereo IR, 3.2 s) ----------------
tir = T(3.2)
irL = rng.standard_normal(len(tir)) * np.exp(-tir * 2.1)
irR = rng.standard_normal(len(tir)) * np.exp(-tir * 2.1)
irL, irR = lp(irL, 5200), lp(irR, 5200)
irL[: int(0.012 * SR)] = 0; irR[: int(0.017 * SR)] = 0  # pre-delay
irL /= np.sqrt(np.sum(irL ** 2)); irR /= np.sqrt(np.sum(irR ** 2))
wetL = fftconvolve(dry[:, 0], irL)[:N]; wetR = fftconvolve(dry[:, 1], irR)[:N]
mix = dry * 0.62 + np.stack([wetL, wetR], 1) * 0.55 + direct
mix[:, 0] += fftconvolve(direct[:, 0], irL)[:N] * 0.18
mix[:, 1] += fftconvolve(direct[:, 1], irR)[:N] * 0.18
mix = hp(mix.T, 30).T
fade = np.interp(np.arange(N) / SR, [0, 0.05, DUR - 2.4, DUR], [0, 1, 1, 0])
mix *= fade[:, None]
mix = np.tanh(mix * 1.2) / 1.2
mix *= 0.6 / np.max(np.abs(mix))
sf.write(f"{out}/score.wav", mix.astype(np.float32), SR, subtype="PCM_16")


# ---------------- SFX ----------------
def save(name, sig, gain=0.6):
    sig = sig / (np.max(np.abs(sig)) + 1e-9) * gain
    sf.write(f"{out}/{name}.wav", np.stack([sig, sig], 1).astype(np.float32), SR, subtype="PCM_16")


t = T(0.22)  # record start: soft two-tone blip up
blip = np.sin(2 * np.pi * 880 * t) * np.exp(-t * 18) * (t < 0.09) + np.sin(2 * np.pi * 1320 * t) * np.exp(-(t - 0.1) * 18) * (t >= 0.1)
save("sfx_rec_start", blip * (1 - np.exp(-t * 400)), 0.4)
blip2 = np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 18) * (t < 0.09) + np.sin(2 * np.pi * 880 * t) * np.exp(-(t - 0.1) * 18) * (t >= 0.1)
save("sfx_rec_stop", blip2 * (1 - np.exp(-t * 400)), 0.4)
t = T(0.12)
save("sfx_tap", bp(rng.standard_normal(len(t)), 900, 4000) * np.exp(-t * 160) + 0.5 * np.sin(2 * np.pi * 520 * t) * np.exp(-t * 90), 0.5)
t = T(3.0); typing = np.zeros_like(t); at = 0.0; kt = T(0.06)
while at < 2.7:
    tk = hp(rng.standard_normal(len(kt)), 2200) * np.exp(-kt * 240) * (0.6 + 0.4 * rng.random())
    i = int(at * SR); typing[i:i + len(tk)] += tk[: len(typing) - i]
    at += 0.07 + 0.07 * rng.random()
save("sfx_typing", typing, 0.3)
t = T(1.2)
save("sfx_air", bp(rng.standard_normal(len(t)), 300, 2400) * np.sin(np.pi * np.clip(t / 1.2, 0, 1)) ** 2, 0.35)
t = T(2.0); ch = np.zeros_like(t)
for f, d, g in ((mf(81), 0.0, 0.6), (mf(86), 0.11, 0.5)):
    b2 = bell(81 if f == mf(81) else 86, 1.9); i = int(d * SR); ch[i:i + len(b2)] += b2[: len(ch) - i] * g
save("sfx_saved", ch, 0.4)
t = T(0.5)
save("sfx_close_click", bp(rng.standard_normal(len(t)), 1800, 6500) * np.exp(-t * 90) + 0.7 * np.sin(2 * np.pi * 140 * t) * np.exp(-t * 30), 0.55)
print("ok", DUR)
