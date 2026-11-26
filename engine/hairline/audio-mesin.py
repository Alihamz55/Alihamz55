# Suara sintetis 5 detik untuk video hairline mesin: dengung mesin idle, "klak" logam
# tiap bagian terbongkar, dan raungan gas di akhir. Pakai: python3 audio-mesin.py out.wav
import sys, numpy as np, wave
SR = 48000; D = 5.0; n = int(SR * D); t = np.arange(n) / SR
rng = np.random.default_rng(8)
def env(L, a, r):
    x = np.arange(L) / SR; return np.minimum(1, x / a) * np.exp(-x / r)
def at(sec, sig, g):
    i = int(sec * SR); j = min(n, i + len(sig)); mix[i:j] += g * sig[: j - i]
# idle V8: denyut pembakaran ~ 4 per putaran, rpm naik pelan, lalu gas di frame 128
rpm = 800 + 400 * t / D + np.where(t > 128 / 30, 3200 * (1 - np.exp(-(t - 128 / 30) * 5)), 0)
fire = np.cumsum(rpm / 60 * 4 / SR)
mix = 0.35 * np.sign(np.sin(2 * np.pi * fire)) * (0.5 + 0.5 * np.sin(2 * np.pi * fire / 8 + 1))
mix = np.convolve(mix, np.ones(60) / 60, 'same') + 0.05 * np.convolve(rng.standard_normal(n), np.ones(20) / 20, 'same')
# klak logam tiap bagian terbongkar
for f in (14, 44, 74, 104):
    L = int(0.4 * SR); x = np.arange(L) / SR
    at(f / 30, sum(np.sin(2 * np.pi * h * x) * env(L, 0.001, 0.05 + 0.03 * k) for k, h in enumerate([880, 1630, 2740])), 0.35)
    at(f / 30, rng.standard_normal(int(0.03 * SR)) * env(int(0.03 * SR), 0.0005, 0.008), 0.6)
mix *= np.minimum(1, (D - t) / 0.25) * np.minimum(1, t / 0.15)
mix = mix / np.max(np.abs(mix)) * 0.7
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
