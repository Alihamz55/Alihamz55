"""Mix Tanya Nana #002: narasi + ambience + foley prosedural (tanpa musik). Keluaran: out/mix.wav (48 kHz stereo).
Jalankan dengan Python venv pustaka: "$LIB/.venv/bin/python" mix.py"""
import json, os, pathlib, sys
import numpy as np, soundfile as sf, soxr

HERE = pathlib.Path(__file__).resolve().parent
LIB = pathlib.Path(os.environ.get("LIB", "/root/lemo-opuscar"))
sys.path.insert(0, str(LIB / "core" / "audio"))
import sfx
from sfx import SR, add, bp, hp, lp, noise, brown, compress, limit, whoosh, click, thump, ding, pop, ignite

TL = json.load(open(HERE / "timeline.json"))
DUR = TL["dur"]; N = int(DUR * SR)
voice = np.zeros((N, 2)); amb = np.zeros((N, 2)); fol = np.zeros((N, 2))
db = lambda x: 10 ** (x / 20)

# ── narasi: kompres, lalu samakan RMS ──
vmask = np.zeros(N)
for L in TL["lines"]:
    a, sr = sf.read(HERE / L["file"], dtype="float64")
    if a.ndim > 1: a = a.mean(1)
    a = soxr.resample(a, sr, SR)
    a = compress(a / (np.abs(a).max() + 1e-9) * 0.9, thr=0.22, ratio=3.0)
    a *= db(-18) / (np.sqrt(np.mean(a[np.abs(a) > 0.01] ** 2)) + 1e-9)
    i = int(L["t"] * SR); j = min(N, i + len(a))
    voice[i:j] += a[: j - i, None] * [1, 1]
    vmask[max(0, i - int(0.15 * SR)): min(N, j + int(0.25 * SR))] = 1

# ── ambience: angin rendah dekat tanah ↔ udara tinggi yang tipis ──
t = np.arange(N) / SR
high = np.interp(t, [0, 4.5, 9, 30, 33.5, DUR], [0, 0, 1, 1, 0.35, 0.35])           # ketinggian kamera (0 = dekat)
low_bed = lp(brown(DUR), 400) ; low_bed /= np.abs(low_bed).max() + 1e-9
air_bed = bp(noise(DUR), 1800, 7000) ; air_bed /= np.abs(air_bed).max() + 1e-9
swell = 0.75 + 0.25 * np.sin(2 * np.pi * t / 7.3)
bed = (low_bed[:N] * (1 - high) * db(-30) + air_bed[:N] * high * db(-40)) * swell
duck = 1 - 0.5 * np.convolve(vmask, np.ones(4800) / 4800, "same")                    # turun ±6 dB di bawah narasi
amb[:, 0] = bed * duck; amb[:, 1] = np.roll(bed, 960) * duck
# hening ±0,9 s sebelum turn (21,4–22,3)
gate = np.ones(N); a0, a1 = int(21.35 * SR), int(22.3 * SR)
gate[a0:a1] = np.interp(np.arange(a1 - a0), [0, 2400, a1 - a0 - 2400, a1 - a0], [1, 0.02, 0.02, 1])
amb *= gate[:, None]

# ── foley dari window.EV ──
def shimmer(d=1.2, v=1.0, rise=True):
    n = noise(d); x = bp(n, 5000, 11000) * np.linspace(0, 1, len(n)) ** (1.5 if rise else 0.3)
    return x / (np.abs(x).max() + 1e-9) * v * np.hanning(len(n)) ** 0.3
k_city = 0
for e in TL["ev"]:
    at = e["t"]; ty = e["type"]
    if ty == "pin":
        add(fol, ding(0.35) * db(-6), at, 0.6, 0)
    elif ty == "whoosh":
        add(fol, whoosh(0.9, 0.7), at - 0.25, 0.5, 0)
    elif ty == "tick":
        add(fol, click(1.8, 0.5), at, 0.4, 0)
    elif ty == "ignite":
        add(fol, thump(0.9, 55), at, 0.7, 0); add(fol, ignite(0.6), at, 0.35, 0); add(fol, shimmer(1.6, 0.5), at, 0.25, 0)
    elif ty == "ruler":
        add(fol, click(1.4, 0.6), at + 0.55, 0.4, -0.3); add(fol, click(1.4, 0.6), at + 0.6, 0.4, 0.3)
    elif ty == "compass":
        add(fol, click(1.1, 0.6), at, 0.4, 0)
    elif ty == "city":
        add(fol, click(1.2 + 0.15 * k_city, 0.6), at, 0.45, [-0.5, 0.4, -0.3, 0.5, -0.2, 0.3][k_city]); k_city += 1
    elif ty == "converge":
        add(fol, shimmer(1.4, 0.6), at - 1.1, 0.35, 0); add(fol, thump(1.0, 48), at, 0.8, 0); add(fol, ding(0.5), at, 0.35, 0)
    elif ty == "card":
        add(fol, pop(0.8), at, 0.5, 0)
fol *= (1 - 0.3 * np.convolve(vmask, np.ones(2400) / 2400, "same"))[:, None]

mix = voice + amb + fol * db(-4)
for c in range(2): mix[:, c] = limit(mix[:, c], 0.89)
(HERE / "out").mkdir(exist_ok=True)
sf.write(HERE / "out" / "mix.wav", mix.astype(np.float32), SR, subtype="FLOAT")
print("mix", DUR, "s, peak", float(np.abs(mix).max()))
