# Musik ketukan sintetis 120 BPM (18 dtk) untuk video CONTOH template Rekap 2026.
# Hanya untuk pratinjau/portofolio. Di CapCut, pakai lagu dari pustaka musik CapCut.
import numpy as np, wave, sys
SR = 44100; T = 18.0; N = int(SR * T)
out = np.zeros((N, 2))
rng = np.random.default_rng(3)
def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if i >= N: return
    s = sig[:j - i] * gain
    out[i:j, 0] += s * (1 - pan) ; out[i:j, 1] += s * (1 + pan)
def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR; e = np.minimum(1, t / a) * np.exp(-t / r); return e
def kick():
    n = int(.35 * SR); t = np.arange(n) / SR; f = 50 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .12)
def hat(open_=False):
    n = int((.18 if open_ else .05) * SR); x = rng.standard_normal(n); x = np.diff(x, prepend=0)
    return x * env(n, .001, .06 if open_ else .015) * .35
def clap():
    n = int(.25 * SR); x = rng.standard_normal(n); e = env(n, .001, .07)
    for k in (0.0, .012, .024): e += np.where(np.arange(n) / SR > k, env(n, .001, .01), 0) * .5
    return x * e * .45
def tone(freq, dur, kind='saw', a=.01, r=.4):
    n = int(dur * SR); t = np.arange(n) / SR
    if kind == 'sine': w = np.sin(2 * np.pi * freq * t)
    elif kind == 'bell': w = np.sin(2 * np.pi * freq * t + 2.0 * np.exp(-t * 6) * np.sin(2 * np.pi * freq * 3.5 * t))
    else: w = sum(np.sin(2 * np.pi * freq * k * t) / k for k in range(1, 8)) * .5
    return w * env(n, a, r)
def pad(freqs, dur, gain=.12):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for d in (-0.6, 0.6): s += np.sin(2 * np.pi * (f + d) * t) + .3 * np.sin(4 * np.pi * (f + d) * t)
    e = np.minimum(1, t / .4) * np.minimum(1, (dur - t) / .4)
    return s * e * gain / len(freqs)
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
B = 0.5
# progresi: C - G - Am - F (2 ketukan... 1 bar = 4 ketukan = 2 dtk)
CH = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]
BASS = [36, 43, 45, 41]
# INTRO 0-2: pad + riser
add(pad([mtof(m) for m in CH[0]], 2.0, .10), 0)
n = int(1.5 * SR); x = rng.standard_normal(n) * np.linspace(0, .25, n); add(x, 0.0, .5)
add(clap(), 1.5, 1.2)  # kilat di ketukan ke-4
# BABAK CEPAT 2-7 + BUILD 7-8.5
for i in range(13):
    t = 2.0 + i * B; bar = int((t - 2) // 2) % 4
    add(kick(), t, .9)
    add(hat(), t + B / 2, .8, .3)
    if i % 2 == 1: add(clap(), t, .8)
    if i % 4 == 0: add(tone(mtof(BASS[bar]), 1.9, 'saw', .01, .5), t, .22)
    if i % 4 == 0: add(pad([mtof(m) for m in CH[bar]], 2.0, .07), t)
for k in range(12):  # snare roll makin rapat
    add(clap(), 7.0 + 1.5 * (1 - (1 - k / 12) ** 1.6), .4 + .5 * k / 12)
n = int(1.5 * SR); x = rng.standard_normal(n) * np.linspace(0, .35, n) ** 2; add(x, 7.0, 1.0)
# 8,5-9: hening sesaat (jeda sebelum drop)
# DROP 9-14
mel = [76, 74, 72, 74, 76, 79, 76, 74, 72, 72, 74, 76, 77, 76, 74, 72, 71, 72, 74, 72]
for i in range(10):
    t = 9.0 + i * B; bar = int((t - 9) // 2) % 4
    add(kick(), t, 1.0); add(hat(i % 2 == 1), t + B / 2, .9, -.3)
    if i % 2 == 1: add(clap(), t, 1.0)
    if i % 4 == 0:
        add(pad([mtof(m) for m in CH[bar]] + [mtof(CH[bar][0] + 12)], 2.0, .16), t)
        add(tone(mtof(BASS[bar]), 1.9, 'saw', .01, .6), t, .28)
for i, m in enumerate(mel):
    add(tone(mtof(m), .5, 'bell', .002, .35), 9.0 + i * .25, .16, .2 * ((i % 2) * 2 - 1))
# KENANGAN 14-16: lo-fi + kresek piringan hitam
for i in range(4):
    t = 14.0 + i * B; add(kick(), t, .6)
    if i % 2: add(clap(), t, .35)
add(pad([mtof(m) for m in CH[2]], 2.0, .12), 14.0)
n = int(2 * SR); cr = (rng.random(n) > .9993) * rng.standard_normal(n) * .5 + rng.standard_normal(n) * .01; add(cr, 14.0, 1.0)
# PENUTUP 16-18
add(pad([mtof(m) for m in [60, 64, 67, 72]], 2.0, .16), 16.0)
for i, m in enumerate([72, 76, 79, 84]): add(tone(mtof(m), 1.6, 'bell', .002, .8), 16.25 + i * .25, .14)
# lo-fi: redam frekuensi tinggi di 14-16 (filter sederhana)
a, b_ = int(14 * SR), int(16 * SR)
for ch in range(2):
    seg = out[a:b_, ch].copy(); y = np.zeros_like(seg); acc = 0
    for k in range(len(seg)): acc += .12 * (seg[k] - acc); y[k] = acc
    out[a:b_, ch] = y * 1.6
# fade out & normalisasi
f = int(1.2 * SR); out[-f:] *= np.linspace(1, 0, f)[:, None]
out /= np.max(np.abs(out)) / 0.89
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'musik-contoh.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
