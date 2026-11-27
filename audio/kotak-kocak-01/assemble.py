# Gabungkan suara Kotak Kocak #1 + SFX sintetis (bunyi jatuh, peluit). Hasil: preview.wav, timing.json
import numpy as np, wave, json, glob
SR = 48000
def load(p):
    with wave.open(p) as w: a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    # buang hening di awal/akhir
    idx = np.where(np.abs(a) > 0.02)[0]
    a = a[max(idx[0] - 960, 0): idx[-1] + 2400] if len(idx) else a
    # pendekkan jeda di tengah kalimat yang > 0,4 detik menjadi 0,3 detik
    loud = np.convolve(np.abs(a) > 0.02, np.ones(480), 'same') > 0
    out, i = [], 0
    while i < len(a):
        j = i
        while j < len(a) and loud[j] == loud[i]: j += 1
        seg = a[i:j]
        if not loud[i] and len(seg) > SR * .4: seg = np.concatenate([seg[:int(SR * .15)], seg[-int(SR * .15):]])
        out.append(seg); i = j
    return np.concatenate(out)
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
out, vo, timing, pos = [], [], [], 0
for item, who, gap in SEQ:
    sfx = item in ('bruk', 'priit')
    a = bruk() if item == 'bruk' else priit() if item == 'priit' else load(f'fast/l{item:02d}.wav')
    timing.append({'id': item, 'who': who, 'start': round(pos / SR, 3), 'end': round((pos + len(a)) / SR, 3)})
    gap *= .8; z = np.zeros(int(SR * gap), np.float32)
    out += [a, z]; vo += [np.zeros_like(a) if sfx else a, z]; pos += len(a) + len(z)
def save(name, y, peak=None):
    with wave.open(name, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
y = np.concatenate(out); k = .89 / np.abs(y).max()
save('preview.wav', y * k)
v = np.concatenate(vo); save('voice.wav', v * k)          # suara saja (untuk mix.py dan gerak mulut)
save('sfx_dasar.wav', (y - v) * k)                         # bunyi jatuh + peluit
json.dump(timing, open('timing.json', 'w'), indent=1)
print('total', round(len(y) / SR, 2), 'detik')
