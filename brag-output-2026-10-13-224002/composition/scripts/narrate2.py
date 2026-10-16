"""'In My Own Words' — Ama's first-person narration + the voice note, local Kokoro-82M.
Usage: python narrate2.py <out_dir>"""
import sys, os, json
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
CACHE = os.path.expanduser("~/.cache/hyperframes/tts")
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
k = Kokoro(f"{CACHE}/models/kokoro-v1.0.onnx", f"{CACHE}/voices/voices-v1.0.bin")
VOICE, LANG = "af_heart", "en-us"
FIX = {"ɐbˈiːnə": "ˈɑːbɛnə"}  # Abena: AH-beh-nah
PHRASES = [  # id, text, speed
 ("n01", "Every evening, before I lock up, I tell my phone how the day went.", 0.93),
 ("vn",  "Today I sold two thousand four hundred: nine hundred cash, twelve hundred MoMo, and Kojo still owes three hundred. "
         "I bought seven hundred of stock with cash, paid eighty delivery, moved five hundred from bank to MoMo, "
         "Abena paid two hundred of what she owed into MoMo, and I took a hundred and fifty cash home.", 1.1),
 ("n02", "No forms. No accounting words.", 0.93),
 ("n03", "Busy with a customer? I type it as it happens.", 0.95),
 ("n04", "CashNarra turns my words into records.", 0.95),
 ("n05", "It asks what I left out. Which account paid for delivery?", 0.95),
 ("n06", "MoMo.", 0.95),
 ("n07", "I check all eight, and I save.", 0.95),
 ("n08", "Abena's two hundred is not a new sale. She owes four hundred now.", 0.96),
 ("n09", "Kojo still owes three hundred.", 0.95),
 ("n10", "Two thousand three hundred came in. Nine hundred and thirty went out.", 0.97),
 ("n11", "And the new equipment? Twenty percent there.", 0.95),
 ("n12", "My day. My words. My numbers.", 0.9),
 ("n13", "CashNarra.", 0.92),
 ("n14", "Tell your money story. See the numbers.", 0.93),
 ("n15", "Coming soon.", 0.92),
]
meta = []
for pid, text, speed in PHRASES:
    ph = k.tokenizer.phonemize(text, LANG)
    for a, b in FIX.items(): ph = ph.replace(a, b)
    audio, sr = k.create(ph, voice=VOICE, speed=speed, lang=LANG, is_phonemes=True)
    a = np.asarray(audio, dtype=np.float32)
    thr = 0.01 * np.max(np.abs(a)); idx = np.where(np.abs(a) > thr)[0]
    a = a[max(0, idx[0] - int(0.03 * sr)): min(len(a), idx[-1] + int(0.08 * sr))]
    sf.write(f"{out}/{pid}.wav", a, sr, subtype="PCM_16")
    meta.append({"id": pid, "text": text, "speed": speed, "dur": round(len(a) / sr, 3), "sr": sr})
    print(pid, round(len(a) / sr, 2), text[:60])
json.dump({"voice": VOICE, "phrases": meta}, open(f"{out}/phrases.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
