"""Buat data gerak mulut (lip-sync) dari suara vokal di lagu.

Pemakaian: python3 scripts/buat-gerak-mulut.py <lagu.mp3> <keluaran.json> [fps]
Butuh: ffmpeg dan numpy (pip install numpy)
"""
import json
import subprocess
import sys

import numpy as np

lagu, keluaran = sys.argv[1], sys.argv[2]
fps = int(sys.argv[3]) if len(sys.argv) > 3 else 30
sr = 16000

# Ambil frekuensi suara manusia saja (300–3000 Hz)
raw = subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-i", lagu, "-ac", "1", "-ar", str(sr),
     "-af", "highpass=f=300,lowpass=f=3000", "-f", "s16le", "-"],
    check=True, capture_output=True,
).stdout
a = np.frombuffer(raw, dtype=np.int16).astype(float) / 32768

w = sr // fps
n = int(np.ceil(len(a) / w))
a = np.pad(a, (0, n * w - len(a)))
db = 20 * np.log10(np.sqrt((a.reshape(n, w) ** 2).mean(1)) + 1e-6)

lo, hi = np.percentile(db, 25), np.percentile(db, 98)
x = np.clip((db - lo) / (hi - lo), 0, 1)

# Tonjolkan suku kata: bandingkan dengan rata-rata 0,4 detik
k = 12
pelan = np.convolve(x, np.ones(k) / k, mode="same")
y = np.clip(0.55 * x + 1.2 * np.maximum(0, x - pelan * 0.85), 0, 1)

# Buka cepat, tutup agak pelan (lebih natural)
hasil, v = [], 0.0
for t in y:
    v += (t - v) * (0.7 if t > v else 0.35)
    hasil.append(round(float(v), 3))

with open(keluaran, "w") as f:
    json.dump(hasil, f)
print(f"Selesai: {len(hasil)} frame → {keluaran}")
