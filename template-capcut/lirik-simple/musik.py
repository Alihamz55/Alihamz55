# Musik lo-fi sintetis 80 BPM (15 dtk) untuk video CONTOH template Lirik Simple.
# Hanya pratinjau. Di CapCut, pakai lagu dari pustaka musik CapCut.
import numpy as np, wave, sys
SR = 44100; T = 15.0; N = int(SR * T); out = np.zeros((N, 2)); rng = np.random.default_rng(5)
def add(s, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR); j = min(N, i + len(s))
    if i < N: out[i:j, 0] += s[:j-i] * gain * (1 - pan); out[i:j, 1] += s[:j-i] * gain * (1 + pan)
def env(n, a, r): t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / r)
def kick():
    n = int(.4 * SR); t = np.arange(n) / SR; return np.sin(2*np.pi*np.cumsum(45 + 80*np.exp(-t*25))/SR) * env(n, .003, .15)
def snap():
    n = int(.2 * SR); return rng.standard_normal(n) * env(n, .001, .05) * .3
def hat():
    n = int(.06 * SR); return np.diff(rng.standard_normal(n), prepend=0) * env(n, .001, .02) * .2
def keys(f, d):
    n = int(d * SR); t = np.arange(n) / SR
    w = np.sin(2*np.pi*f*t) + .35*np.sin(4*np.pi*f*t) * np.exp(-t*3) + .15*np.sin(6*np.pi*f*t)*np.exp(-t*5)
    return w * env(n, .01, 1.2) * (1 + .004*np.sin(2*np.pi*5*t))
m = lambda k: 440 * 2 ** ((k - 69) / 12)
B = 60 / 80
CH = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]]  # Am7 Fmaj7 Cmaj7 G7
t = 0.0; bar = 0
while t < T:
    for k in CH[bar % 4]: add(keys(m(k), 4 * B), t + rng.random() * .03, .07)
    add(keys(m(CH[bar % 4][0] - 12), 4 * B), t, .12)
    for i in range(4):
        tb = t + i * B
        if i in (0, 2) or (i == 3 and bar % 2): add(kick(), tb + (0.38 * B if i == 3 else 0), .55)
        if i in (1, 3): add(snap(), tb, .9, .2)
        add(hat(), tb + B / 2 + .02, 1, -.3); add(hat(), tb, .6, -.3)
    t += 4 * B; bar += 1
mel = [(0.6, 76), (1.6, 74), (2.3, 72), (3.2, 69), (4.1, 72), (5.1, 74), (5.8, 76), (6.7, 79), (7.6, 77), (8.6, 76), (9.3, 74), (10.2, 72), (11.1, 72), (12.1, 74), (12.8, 71), (13.6, 69)]
for tt, k in mel: add(keys(m(k), 1.4), tt, .09, .25)
n = N; out[:, 0] += (rng.random(n) > .9995) * rng.standard_normal(n) * .3 + rng.standard_normal(n) * .006
# redam frekuensi tinggi (rasa lo-fi)
for ch in range(2):
    x = out[:, ch]; y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += .18 * (x[i] - acc); y[i] = acc
    out[:, ch] = y
f = int(1.0 * SR); out[-f:] *= np.linspace(1, 0, f)[:, None]; out[:int(.3*SR)] *= np.linspace(0, 1, int(.3*SR))[:, None]
out /= np.max(np.abs(out)) / .89
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'musik-contoh.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
