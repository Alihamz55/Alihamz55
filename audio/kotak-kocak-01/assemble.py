# Gabungkan suara Kotak Kocak #1 + SFX sintetis (bunyi jatuh, peluit). Hasil: preview.wav, timing.json
import numpy as np, wave, json, glob
SR = 48000
def load(p):
    with wave.open(p) as w: a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    # buang hening di awal/akhir
    idx = np.where(np.abs(a) > 0.02)[0]
    return a[max(idx[0] - 960, 0): idx[-1] + 2400] if len(idx) else a
def bruk():  # bunyi jatuh: dentum rendah + derak kotak
    t = np.arange(int(SR * .45)) / SR
    thud = np.sin(2 * np.pi * (90 - 60 * t) * t) * np.exp(-t * 9)
    rattle = np.random.default_rng(1).normal(0, 1, len(t)) * np.exp(-t * 14) * .35
    return (thud + rattle) * .6
def priit():  # peluit: nada tinggi bergetar
    t = np.arange(int(SR * .55)) / SR
    f = 2900 + 120 * np.sin(2 * np.pi * 32 * t)
    env = np.minimum(1, t * 40) * np.minimum(1, (t[-1] - t) * 25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env * .25
# (kalimat, siapa, jeda sesudahnya)
SEQ = [(1,'N',.25),(2,'kubi',.25),(3,'N',.2),(4,'kubi',.55),(5,'N',.3),(6,'N',.25),(7,'bobi',.1),
       ('bruk',None,.55),(9,'N',.25),(10,'kubi',.25),(11,'bobi',.2),('priit',None,.05),(12,'blok',.3),
       (13,'N',.2),(14,'N',.3),(15,'bobi',.25),(16,'blok',.25),(17,'N',.3)]
out, timing, pos = [], [], 0
for item, who, gap in SEQ:
    a = bruk() if item == 'bruk' else priit() if item == 'priit' else load(f'fast/l{item:02d}.wav')
    timing.append({'id': item, 'who': who, 'start': round(pos / SR, 3), 'end': round((pos + len(a)) / SR, 3)})
    gap *= .8; out += [a, np.zeros(int(SR * gap), np.float32)]; pos += len(a) + int(SR * gap)
y = np.concatenate(out); y = y / np.abs(y).max() * .89
with wave.open('preview.wav', 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype(np.int16).tobytes())
json.dump(timing, open('timing.json', 'w'), indent=1)
print('total', round(len(y) / SR, 2), 'detik')
