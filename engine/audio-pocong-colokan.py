"""Synthesized music + SFX stems for Pocong Antre Colokan (tanpa dialog) (music.wav, sfx.wav). Mix with mix.py."""
import numpy as np, subprocess, wave

SR = 48000
DUR = 615 / 30
N = int(DUR * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def load_voice():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", "voice.wav", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32).copy()
    out = np.zeros(N, np.float32); out[:min(N, len(v))] = v[:N]; return out

def env(n, a=0.005, r=0.2, sus=None):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
    return e

def lp(x, k):  # one-pole low-pass, k in (0,1)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += k * (x[i] - acc); y[i] = acc
    return y

def lp_fast(x, cutoff):
    # FFT brick-ish low-pass (fast, fine for beds)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)

def hp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 - 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)

def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if i < N and j > i: buf[i:j] += sig[: j - i] * gain

midi = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------------- music ----------------
music = np.zeros(N, np.float32)
BPM = 116; beat = 60 / BPM
prog = [(48, [60, 64, 67]), (45, [57, 60, 64]), (53, [57, 60, 65]), (55, [59, 62, 67])]  # C Am F G - bouncy comedy loop
def pluck(f, dur=0.35, bright=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum((bright ** k) * np.sin(2 * np.pi * f * (k + 1) * t) / (k + 1) for k in range(6))
    return (s * env(n, 0.003, dur * 0.35)).astype(np.float32)
def bassnote(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t)
    return (s * env(n, 0.004, dur * 0.5)).astype(np.float32)
def drum(kind):
    if kind == "kick":
        n = int(0.3 * SR); t = np.arange(n) / SR; f = 50 + 90 * np.exp(-t * 30)
        return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)).astype(np.float32)
    if kind == "hat":
        n = int(0.06 * SR); t = np.arange(n) / SR
        return hp_fast((rng.standard_normal(n) * np.exp(-t * 70)).astype(np.float32), 6000)
    n = int(0.16 * SR); t = np.arange(n) / SR
    s = rng.standard_normal(n) * np.exp(-t * 30) * 0.6 + np.sin(2 * np.pi * 210 * t) * np.exp(-t * 22) * 0.5
    return hp_fast(s.astype(np.float32), 300)
MUSIC_END = 0.0  # live recording: no music bed under the set
bar = 0; tt = 0.15
while tt < MUSIC_END:
    root, ch = prog[bar % 4]
    for b in range(4):
        tb = tt + b * beat
        if tb >= MUSIC_END: break
        place(music, drum("kick" if b % 2 == 0 else "snare"), tb, 0.5 if b % 2 == 0 else 0.26)
        place(music, drum("hat"), tb + beat * 0.5, 0.12)
        place(music, bassnote(midi(root - 12 + (7 if b == 2 else 0)), beat * 0.9), tb, 0.45)          # oom
        for m in ch: place(music, pluck(midi(m), 0.2, 0.55), tb + beat * 0.5, 0.07)                   # pah
        if b == 3 and bar % 2: place(music, bassnote(midi(root - 12 + 5), beat * 0.4), tb + beat * 0.5, 0.3)
    mel = [ch[2] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 12] if bar % 2 == 0 else [ch[0] + 12, ch[1] + 12, ch[0] + 12, ch[2] + 12]
    for k, m in enumerate(mel):
        tm = tt + k * beat + (0.25 * beat if k % 2 else 0)
        place(music, pluck(midi(m), 0.3, 0.7), tm, 0.09)
    bar += 1; tt += beat * 4
# i0 = int((MUSIC_END - 0.05) * SR); music[i0:] *= np.linspace(1, 0, N - i0) ** 10
# ---------------- sfx ----------------
sfx = np.zeros(N, np.float32)
def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def thunk(f0=90, d=0.3):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 40))) * np.exp(-t * 14) + lp_fast(noise(d), 1200) * np.exp(-t * 30) * 0.5).astype(np.float32)
def rumble(d):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(noise(d), 160) * 3 * np.minimum(1, t / 0.15) * np.exp(-t / (d * 0.45))
    return s.astype(np.float32)
def crash(d=1.2):
    n = int(d * SR); t = np.arange(n) / SR; s = np.zeros(n, np.float32)
    for k in range(14):
        tk = rng.uniform(0, d * 0.6); i = int(tk * SR); g = thunk(rng.uniform(60, 160), 0.35) * rng.uniform(0.3, 0.9)
        s[i:i + len(g)] += g[: n - i]
    s += lp_fast(noise(d), 2500) * np.exp(-t * 3) * 0.25
    return s
def cuckoo():
    out = []
    for f, d in [(740, 0.16), (587, 0.24)]:
        n = int(d * SR); t = np.arange(n) / SR
        out.append(np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.01) * np.exp(-t * 6)); out.append(np.zeros(int(0.06 * SR)))
    return np.concatenate(out).astype(np.float32)
def scrape(d=0.8):
    n = int(d * SR); t = np.arange(n) / SR
    s = noise(d) * (0.5 + 0.5 * np.sin(2 * np.pi * 13 * t)) * np.sin(np.pi * t / d)
    s = hp_fast(lp_fast(s, 5000), 1500)
    ring = np.sin(2 * np.pi * 1870 * t) * np.exp(-t * 3) * 0.2
    return (s * 0.6 + ring).astype(np.float32)
def ting():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(2093, 4), (3136, 6), (4186, 8)]) * 0.3).astype(np.float32)
def sting():
    n = int(2.0 * SR); t = np.arange(n) / SR
    low = np.sin(2 * np.pi * 41 * t) * np.exp(-t * 1.5) * 1.2
    hit = lp_fast(noise(2.0), 900) * np.exp(-t * 6) * 0.8
    stab = brass([midi(45), midi(48), midi(51)], 1.4); s = low + hit; s[: len(stab)] += stab * 2.2 * np.exp(-np.arange(len(stab)) / SR * 2)
    return s.astype(np.float32)
def creak(d=0.6, f0=140):
    n = int(d * SR); t = np.arange(n) / SR
    rate = f0 * (1 + 0.35 * np.sin(2 * np.pi * 1.3 * t / d))
    ph = np.cumsum(rate) / SR; pulses = (np.mod(ph, 1) < 0.08).astype(np.float32)
    s = lp_fast(pulses * (0.6 + 0.4 * rng.random(n).astype(np.float32)), 2200) * np.sin(np.pi * t / d)
    return hp_fast(s, 200) * 2.5
def snap():
    d = 0.5; n = int(d * SR); t = np.arange(n) / SR
    return (hp_fast(noise(d), 800) * np.exp(-t * 18) * 1.4 + np.pad(thunk(120, 0.4), (0, n - int(0.4 * SR))) * 0.6).astype(np.float32)
def splash(d=1.0):
    n = int(d * SR); t = np.arange(n) / SR
    s = lp_fast(noise(d), 4000) * (np.exp(-t * 4) * np.minimum(1, t / 0.01)) + lp_fast(noise(d), 400) * np.exp(-t * 7) * 1.5
    return s.astype(np.float32)
def whoosh(d=0.5):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 1500) * np.sin(np.pi * t / d) ** 2 * 0.6).astype(np.float32)
def snore(d=1.1):
    n = int(d * SR); t = np.arange(n) / SR
    buzz = (np.mod(np.cumsum(60 + 25 * np.sin(np.pi * t / d)) / SR, 1) < 0.3).astype(np.float32)
    return (lp_fast(buzz * 0.5 + noise(d) * 0.15, 700) * np.sin(np.pi * t / d) ** 2).astype(np.float32)
def leaves(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (hp_fast(lp_fast(noise(d), 6000), 2500) * (0.3 + 0.3 * np.sin(2 * np.pi * 0.7 * t) ** 2) * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.4)).astype(np.float32)
def water(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 900) * 0.5 + hp_fast(lp_fast(noise(d), 3000), 1200) * 0.15 * (0.6 + 0.4 * np.sin(2 * np.pi * 0.4 * t))).astype(np.float32)

F = lambda f: f / 30
def buzz(d=0.5):
    n = int(d * SR); t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * 150 * t)) * (np.mod(t, 0.25) < 0.17)
    return lp_fast(s.astype(np.float32), 900) * 0.6
def ding(f0=1320):
    n = int(0.5 * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f0 * t) * np.exp(-t * 9); s[int(0.09 * SR):] += np.sin(2 * np.pi * f0 * 1.5 * t[: n - int(0.09 * SR)]) * np.exp(-t[: n - int(0.09 * SR)] * 9)
    return (s * 0.5).astype(np.float32)
def tap():
    n = int(0.04 * SR); t = np.arange(n) / SR
    return (hp_fast(noise(0.04), 2000) * np.exp(-t * 120)).astype(np.float32)
def pop():
    n = int(0.12 * SR); t = np.arange(n) / SR; f = 400 + 900 * t / 0.12
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 25)).astype(np.float32)
def tick():
    n = int(0.03 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 200) + hp_fast(noise(0.03), 3000) * np.exp(-t * 150) * 0.4).astype(np.float32)
def rimshot():
    out = np.zeros(int(1.4 * SR), np.float32)
    s = drum("snare"); out[: len(s)] += s * 0.8
    i = int(0.22 * SR); out[i: i + len(s)] += s * 0.9; k = drum("kick"); out[i: i + len(k)] += k * 0.7
    j = int(0.44 * SR); n = len(out) - j; t = np.arange(n) / SR
    out[j:] += hp_fast(noise(n / SR), 5000) * np.exp(-t * 3.5) * 0.7
    return out
def boing():
    d = 0.6; n = int(d * SR); t = np.arange(n) / SR; f = 220 * (1 + 0.4 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4)) + 120 * t
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4)).astype(np.float32)
def step():
    n = int(0.08 * SR); t = np.arange(n) / SR
    return (lp_fast(noise(0.08), 900) * np.exp(-t * 45) + np.sin(2 * np.pi * 110 * t) * np.exp(-t * 40) * 0.6).astype(np.float32)
def ring(d=0.9):
    n = int(d * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * (np.mod(t, 0.1) < 0.05)
    return (s * np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.05) * 0.35).astype(np.float32)
def comedy_sting():
    n = int(1.6 * SR); t = np.arange(n) / SR
    low = np.sin(2 * np.pi * 55 * t) * np.exp(-t * 2.2)
    trom = sum(np.sin(2 * np.pi * (233 - 40 * np.minimum(t, 0.9)) * k * t) / k for k in range(1, 6)) * np.exp(-t * 1.6) * 0.35
    return lp_fast((low + trom + lp_fast(noise(1.6), 600) * np.exp(-t * 8) * 0.6).astype(np.float32), 2500)

def ping():
    n = int(0.9 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1250 * t) * np.exp(-t * 5) * 0.8).astype(np.float32)
def eerie(d):
    n = int(d * SR); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t + 2 * np.sin(2 * np.pi * 0.3 * t)) for f in (98, 104, 147)) * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.3)
    return lp_fast(s.astype(np.float32), 900) * 0.4
def stab():
    n = int(1.0 * SR); t = np.arange(n) / SR
    hi = sum(np.sin(2 * np.pi * f * t) for f in (1480, 1568, 1661)) * np.exp(-t * 3) * 0.3
    return (hi + np.sin(2 * np.pi * 50 * t) * np.exp(-t * 4) + lp_fast(noise(1.0), 700) * np.exp(-t * 6) * 0.6).astype(np.float32)
def murmur(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(hp_fast(noise(d), 250), 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t) * np.sin(2 * np.pi * 1.9 * t)) * 0.35).astype(np.float32)

def applause(d):
    n = int(d * SR); t = np.arange(n) / SR; s = np.zeros(n, np.float32)
    for k in range(int(d * 60)):
        i = int(rng.uniform(0, d - 0.05) * SR); c = hp_fast(noise(0.03), 1500) * np.exp(-np.arange(int(0.03 * SR)) / SR * 90); s[i:i + len(c)] += c * rng.uniform(0.3, 1)
    return s * np.minimum(1, t / 0.2) * np.minimum(1, (d - t) / 0.6)
def kaching():
    n = int(0.7 * SR); t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(1568, 5), (2093, 6), (3136, 8)]) * 0.35 + hp_fast(noise(0.7), 3000) * np.exp(-t * 25) * 0.4).astype(np.float32)
def cricket():
    d = 0.5; n = int(d * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 4300 * t) * (np.mod(t, 0.05) < 0.03) * (t < 0.3)
    return (s * np.minimum(1, t / 0.005)).astype(np.float32)
def strings(fs, d):
    n = int(d * SR); t = np.arange(n) / SR
    sig = sum(sum(np.sin(2 * np.pi * f * (1 + 0.003 * k) * t + k) for k in (-1, 0, 1)) for f in fs)
    return lp_fast((sig * (0.75 + 0.25 * np.sin(2 * np.pi * 6 * t)) * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.4)).astype(np.float32), 1800) * 0.25
# ---- wedding loop (light, bouncy) under the talking parts ----
wprog = [(48, [64, 67, 72]), (53, [65, 69, 72]), (55, [62, 67, 71]), (48, [64, 67, 72])]
def loop(t0, t1, g=1.0):
    tt = t0; bar = 0
    while tt < t1 - 0.05:
        root, ch = wprog[bar % 4]
        for b_ in range(4):
            tb = tt + b_ * beat
            if tb >= t1: break
            place(music, bassnote(midi(root - 12 + (7 if b_ % 2 else 0)), beat * 0.8), tb, 0.35 * g)
            for m in ch: place(music, pluck(midi(m), 0.25, 0.6), tb + beat * 0.5, 0.06 * g)
            place(music, drum("hat"), tb + beat * 0.5, 0.06 * g)
        for k, m in enumerate([ch[2] + 12, ch[1] + 12, ch[0] + 12, ch[1] + 12]): place(music, pluck(midi(m), 0.3, 0.7), tt + k * beat, 0.07 * g)
        bar += 1; tt += beat * 4
def rdw(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; sr = w.getframerate()
    return np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x).astype(np.float32)
LCL = [rdw(f"crowd/k{i}.wav") for i in (1, 2, 3, 4)]; WOO = rdw("crowd/woo.wav")
def crowd_laugh(d, k=1.0):
    n = int(d * SR); out = np.zeros(n, np.float32)
    for v in range(int(5 + 6 * k)):
        c = LCL[v % 4]; pr = rng.uniform(0.82, 1.22); st = rng.uniform(0, max(0.01, len(c) / SR - 1.5))
        idx = (st * SR + np.arange(n) * pr).astype(int); ok = idx < len(c); seg = np.zeros(n, np.float32); seg[ok] = c[idx[ok]]
        off = int(rng.uniform(0, 0.35) * SR); seg = np.roll(seg, off); seg[:off] = 0
        out += seg * rng.uniform(0.4, 1.0)
    out = lp_fast(out, 5500)
    out = out + 0.35 * np.roll(out, int(0.045 * SR)) + 0.2 * np.roll(out, int(0.09 * SR))  # room
    if k >= 1.2: out += applause(d)[:n] * 0.6 * np.abs(out).max()
    t = np.arange(n) / SR; envl = np.minimum(1, t / 0.12) * np.clip((d - t) / (0.6 * d), 0, 1) ** 1.3
    out = out * envl; pk = np.abs(out).max() + 1e-9
    return (np.tanh(out / pk * 2.4) / np.tanh(2.4) * pk).astype(np.float32)  # denser, louder laugh
def notif():
    n = int(0.35 * SR); t = np.arange(n) / SR
    return (sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(1760, 9), (2637, 12)]) * 0.35).astype(np.float32)
def sweep(f0, f1, d, g=0.5):
    n = int(d * SR); t = np.arange(n) / SR; f = f0 + (f1 - f0) * t / d
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / 0.02) * np.minimum(1, (d - t) / 0.05) * g).astype(np.float32)
def beep(f0=2000, d=0.09):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sign(np.sin(2 * np.pi * f0 * t)) * 0.25 * np.minimum(1, (d - t) / 0.01)).astype(np.float32)
def heart():
    a = thunk(55, 0.25); out = np.zeros(int(0.45 * SR), np.float32); out[:len(a)] += a; i = int(0.18 * SR); out[i:i + len(a)] += a * 0.7; return out
def hopduk(): return thunk(75, 0.25) * 0.9
# music: light loop -> cut at the flicker -> eerie -> loop back after relief -> faster loop -> stop at the reveal
loop(0, F(78), 0.4)
place(music, eerie(F(285) - F(80)), F(80), 0.5)
loop(F(287), F(405), 0.45)
BPM = 140; beat = 60 / BPM
loop(F(405), F(476), 0.5)
place(music, eerie(F(615) - F(500)), F(500), 0.3)
fo = int(0.06 * SR); i0 = int(F(78) * SR); music[i0 - fo:i0] *= np.linspace(1, 0, fo)
i1 = int(F(476) * SR); music[i1 - fo:i1] *= np.linspace(1, 0, fo)
# sfx
for k in range(3): place(sfx, cricket(), F(5 + k * 25), 0.25)
place(sfx, sweep(3200, 3300, 0.9, 0.25), F(78), 1.0)              # "nging"
for k in range(8): place(sfx, tick(), F(78 + k * 3), 0.5)            # bulb flicker
for k in range(4): place(sfx, hopduk(), F(100 + k * 10), 0.45)         # duk.. duk..
place(sfx, whoosh(0.4), F(132), 0.6)
for k in range(4): place(sfx, heart(), F(138 + k * 15), 0.8)           # detak jantung
for k in range(3): place(sfx, hopduk(), F(197 + k * 12), 0.6)          # pocong masuk
for k in range(3): place(sfx, beep(2000), F(232 + k * 16), 0.5); place(sfx, beep(2000), F(236 + k * 16), 0.5)  # tit-tit
place(sfx, ding(), F(288), 0.45)
place(sfx, whoosh(0.45), F(305), 0.5)
place(sfx, ting(), F(326), 0.35)
place(sfx, boing(), F(330), 0.3)
place(sfx, sweep(300, 1400, F(388) - F(356), 0.35), F(356), 1.0)       # pocong naik
place(sfx, sweep(900, 140, F(388) - F(356), 0.35), F(356), 1.0)        # asep turun
place(sfx, pop(), F(392), 0.6); place(sfx, comedy_sting(), F(393), 0.6)
place(sfx, notif(), F(408), 0.3)
for k in range(6): place(sfx, hopduk(), F(410 + k * 12), 0.5); place(sfx, boing(), F(410 + k * 12), 0.08)
place(sfx, stab(), F(476), 0.7)                                         # jreng!
for k in range(5): place(sfx, hopduk(), F(492 + k * 12), 0.45)
for k in range(4): place(sfx, beep(1700, 0.06), F(484 + k * 4), 0.3)
for k in range(3): place(sfx, cricket(), F(552 + k * 22), 0.3)
place(sfx, hopduk(), F(592), 0.4)
# Write STEMS only. Levels are set by mix.py (music and SFX at 50 % of the voice), never here.
def write_stem(name, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9
    with wave.open(name, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
write_stem("music.wav", music); write_stem("sfx.wav", sfx)
print("ok stems", N / SR)
