"""Gerak mulut per frame (30 fps) dari voice.wav (suara saja) -> engine/kotak2d/ep01/data.js
Mulut membuka cepat dan menutup lebih pelan supaya terlihat alami; tiap kalimat dinormalisasi sendiri."""
import numpy as np, wave, json
SR, FPS = 48000, 30
with wave.open('voice.wav') as w: a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
hop = SR // FPS; n = len(a) // hop + 1
rms = np.array([np.sqrt(np.mean(a[i*hop:(i+1)*hop]**2)) if len(a[i*hop:(i+1)*hop]) else 0 for i in range(n)])
t = json.load(open('timing.json')); lip = np.zeros(n)
for d in t:
    if not isinstance(d['id'], int): continue
    s, e = int(d['start'] * FPS), int(d['end'] * FPS) + 1
    seg = rms[s:e]; ref = np.percentile(seg, 85) + 1e-6
    v = np.clip((seg / ref - .12) / .88, 0, 1) ** .8
    out = np.zeros_like(v); acc = 0
    for i, x in enumerate(v): acc = x if x > acc else acc * .55 + x * .45; out[i] = acc   # buka cepat, tutup pelan
    lip[s:e] = out
open('../../engine/kotak2d/ep01/data.js', 'w').write('window.TIMING=' + json.dumps(t) + ';\nwindow.LIPS=' +
    json.dumps([round(float(x), 2) for x in lip]) + ';\nwindow.TOTAL_FRAMES=' + str(n) + ';\n')
print(n, 'frame, rata-rata bukaan', round(float(lip[lip > 0].mean()), 2))
