# Musik + SFX sintetis 5 detik untuk tes hairline timbangan. Pakai: python3 audio-timbangan.py out.wav
import sys, numpy as np, wave
SR = 48000; D = 5.0; n = int(SR * D); t = np.arange(n) / SR
mix = np.zeros(n)
def at(sec, sig, g=1.0):
    i = int(sec * SR); j = min(n, i + len(sig)); mix[i:j] += g * sig[: j - i]
def env(L, a=0.005, r=0.2):
    x = np.arange(L) / SR; return np.minimum(1, x / a) * np.exp(-x / r)
# musik: bass + plak ringan, 120 bpm, nada ceria
rng = np.random.default_rng(3)
for k, f in enumerate([98, 98, 131, 110, 98, 147, 131, 110, 98, 98]):
    L = int(0.5 * SR); x = np.arange(L) / SR
    at(k * 0.5, np.sin(2 * np.pi * f * x) * env(L, 0.01, 0.18), 0.22)
    at(k * 0.5 + 0.25, rng.standard_normal(int(0.05 * SR)) * env(int(0.05 * SR), 0.001, 0.015), 0.05)
# whoosh (pointer ke kanan, frame 12)
L = int(0.35 * SR); x = np.arange(L) / SR
w = np.convolve(rng.standard_normal(L), np.ones(30) / 30, 'same') * np.sin(np.pi * x / x[-1]) ** 2
at(12 / 30, w, 0.9)
# BRAK! piring cabai jatuh (frame 66): thud rendah + klenteng logam
L = int(0.6 * SR); x = np.arange(L) / SR
thud = np.sin(2 * np.pi * (120 * np.exp(-x * 8) + 45) * x) * env(L, 0.002, 0.15)
clank = sum(np.sin(2 * np.pi * f * x) * env(L, 0.001, 0.12 + 0.04 * i) for i, f in enumerate([523, 1240, 2010]))
at(66 / 30, thud + 0.25 * clank, 0.9)
# pop judul (frame 74) dan ding punchline (frame 98)
L = int(0.12 * SR); x = np.arange(L) / SR
at(74 / 30, np.sin(2 * np.pi * (300 + 900 * x / x[-1]) * x) * env(L, 0.002, 0.04), 0.5)
L = int(1.2 * SR); x = np.arange(L) / SR
at(98 / 30, (np.sin(2 * np.pi * 1320 * x) + 0.5 * np.sin(2 * np.pi * 1980 * x)) * env(L, 0.002, 0.35), 0.35)
fade = np.minimum(1, (D - t) / 0.3); mix *= fade
mix = mix / np.max(np.abs(mix)) * 0.7
with wave.open(sys.argv[1], 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((mix * 32767).astype('<i2').tobytes())
