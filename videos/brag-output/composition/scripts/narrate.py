"""Generate narration phrases with local Kokoro-82M (kokoro-onnx).
Usage: python narrate.py <out_dir> [voice] [speed]
Writes one WAV per phrase + phrases.json (durations after silence trim)."""
import sys, json, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

CACHE = os.path.expanduser("~/.cache/hyperframes/tts")
out = sys.argv[1]; voice = sys.argv[2] if len(sys.argv) > 2 else "af_heart"
speed = float(sys.argv[3]) if len(sys.argv) > 3 else 0.94
os.makedirs(out, exist_ok=True)
k = Kokoro(f"{CACHE}/models/kokoro-v1.0.onnx", f"{CACHE}/voices/voices-v1.0.bin")
LANG = "en-gb" if voice.startswith("b") else "en-us"
# Pronunciation overrides (espeak default -> intended)
FIX = {"ɐbˈiːnə": "ˈɑːbɛnə"}  # Abena: AH-beh-nah, not uh-BEE-nuh

PHRASES = [
 ("p01", "Your shop is closed."),
 ("p02", "Your head is still doing the accounts."),
 ("p03", "Cash."), ("p04", "MoMo."), ("p05", "Stock."), ("p06", "Delivery."),
 ("p07", "Kojo still owes you."),
 ("p08", "Abena paid part of her debt."),
 ("p09", "Your day..."), ("p09b", "in pieces."),
 ("p10", "Give your money story somewhere to live."),
 ("p11", "Meet CashNarra."),
 ("p12", "Type it as it happened."),
 ("p13", "It turns your words into records."),
 ("p14", "You check the details, fill in what's missing, and save."),
 ("p15", "Abena's payment reduces her debt."),
 ("p16", "Kojo still owes three hundred."),
 ("p17", "You see what came in, what went out, and what's still owed."),
 ("p18", "Now look ahead."),
 ("p19", "That new equipment. Your progress."),
 ("p20", "What a different contribution could change."),
 ("p21", "You've done the work."),
 ("p22", "Make room for tomorrow."),
 ("p23", "CashNarra."),
 ("p24", "Tell your money story. See the numbers."),
 ("p25", "Coming soon."),
]
meta = []
for pid, text in PHRASES:
    ph = k.tokenizer.phonemize(text, LANG)
    for a, b in FIX.items(): ph = ph.replace(a, b)
    audio, sr = k.create(ph, voice=voice, speed=speed, lang=LANG, is_phonemes=True)
    a = np.asarray(audio, dtype=np.float32)
    thr = 0.01 * np.max(np.abs(a)); idx = np.where(np.abs(a) > thr)[0]
    s = max(0, idx[0] - int(0.03 * sr)); e = min(len(a), idx[-1] + int(0.08 * sr))
    a = a[s:e]
    sf.write(f"{out}/{pid}.wav", a, sr, subtype="PCM_16")
    meta.append({"id": pid, "text": text, "phonemes": ph, "dur": round(len(a) / sr, 3), "sr": sr})
    print(pid, round(len(a)/sr,2), text, "|", ph)
json.dump({"voice": voice, "speed": speed, "lang": LANG, "phrases": meta},
          open(f"{out}/phrases.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
