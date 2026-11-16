import numpy as np, wave
SR = 48000; D = 135 / 30; N = int(D * SR); rng = np.random.default_rng(3)
t_ = lambda d: np.arange(int(d * SR)) / SR
def place(b, s, t0, g=1.0):
    i = int(t0 * SR); j = min(N, i + len(s))
    if j > i: b[i:j] += s[: j - i] * g
def lp(x, c):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / (1 + (f / c) ** 4); return np.fft.irfft(X, len(x))
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
def pluck(f, d=0.3, b=0.6): t = t_(d); return sum((b ** k) * np.sin(2 * np.pi * f * (k + 1) * t) / (k + 1) for k in range(6)) * np.minimum(1, t / 0.003) * np.exp(-t / (d * 0.35))
def bass(f, d): t = t_(d); return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t)) * np.exp(-t / (d * 0.5))
def kick(): t = t_(0.3); return np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-t * 30)) / SR) * np.exp(-t * 11)
def hat(): t = t_(0.06); return lp(rng.standard_normal(len(t)), 9000) * np.exp(-t * 70) * 0.5
def pop(): t = t_(0.12); return np.sin(2 * np.pi * np.cumsum(400 + 900 * t / 0.12) / SR) * np.exp(-t * 25)
def tap(): t = t_(0.04); return rng.standard_normal(len(t)) * np.exp(-t * 120) * 0.6
def ding(f0): t = t_(0.5); return np.sin(2 * np.pi * f0 * t) * np.exp(-t * 9) * 0.6
def sparkle(): t = t_(0.6); return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(2093, 5), (2637, 6), (3136, 7)]) * 0.25
music = np.zeros(N); sfx = np.zeros(N)
beat = 60 / 120; prog = [(48, [60, 64, 67]), (53, [57, 60, 65]), (55, [59, 62, 67]), (48, [60, 64, 67])]
tt = 0; bar = 0
while tt < D:
    root, ch = prog[bar % 4]
    for b in range(4):
        tb = tt + b * beat
        if tb >= D: break
        place(music, kick() * (b % 2 == 0), tb, 0.5); place(music, hat(), tb + beat / 2, 0.3)
        place(music, bass(midi(root - 12 + (7 if b == 2 else 0)), beat * 0.9), tb, 0.45)
        for m in ch: place(music, pluck(midi(m), 0.2), tb + beat / 2, 0.08)
    for k, m in enumerate([ch[2] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 12]): place(music, pluck(midi(m), 0.3, 0.7), tt + k * beat, 0.1)
    bar += 1; tt += beat * 4
fo = int(0.4 * SR); music[-fo:] *= np.linspace(1, 0, fo)
F = lambda f: f / 30
for a, tp, f0 in [(6, 26, 1320), (30, 50, 1480), (54, 74, 1660), (78, 98, 1760)]:
    place(sfx, pop(), F(a), 0.7); place(sfx, tap(), F(tp), 0.8); place(sfx, ding(f0), F(tp) + 0.02, 0.5); place(sfx, sparkle(), F(tp), 0.4)
place(sfx, sparkle(), F(104), 0.6); place(sfx, pop(), F(104), 0.6)
mix = music * 0.45 + sfx * 0.6
mix = mix / np.abs(mix).max() * 0.85
with wave.open("mix_raw.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", D)
