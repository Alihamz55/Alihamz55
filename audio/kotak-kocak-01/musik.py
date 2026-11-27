"""Kotak Kocak #1: musik latar + SFX sintetis (orisinal, tanpa sampel).
Hasil: music.wav dan sfx.wav, lalu dicampur dengan mix.py (musik -6 dB di bawah suara).
Aransemen mengikuti timing.json: ceria -> berhenti saat 'musuh terbesarku' -> ceria lagi saat Piko naik level.
"""
import json, wave
import numpy as np

SR = 48000
T = {str(d['id']): d for d in json.load(open('timing.json'))}
DUR = T['17']['end'] + 0.4
N = int(DUR * SR)
rng = np.random.default_rng(3)
midi = lambda m: 440 * 2 ** ((m - 69) / 12)

def env(n, a, r):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR); j = min(len(buf), i + len(sig))
    if 0 <= i < j: buf[i:j] += sig[: j - i] * gain
def hp(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 - 1 / (1 + (f / fc) ** 4)
    return np.fft.irfft(X, len(x)).astype(np.float32)

# ---------- instrumen ----------
def pluck(f, dur=.3, bright=.55):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum((bright ** k) * np.sin(2 * np.pi * f * (k + 1) * t) / (k + 1) for k in range(6))
    return (s * env(n, .003, dur * .35)).astype(np.float32)
def square(f, dur, duty=.25):  # bunyi game retro buatan sendiri
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.where((t * f) % 1 < duty, 1.0, -1.0) * .35
    return (s * env(n, .004, dur * .45)).astype(np.float32)
def bass(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    return ((np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t)) * env(n, .004, dur * .5)).astype(np.float32)
def kick():
    n = int(.25 * SR); t = np.arange(n) / SR; f = 50 + 100 * np.exp(-t * 30)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 12)).astype(np.float32)
def hat():
    n = int(.05 * SR); t = np.arange(n) / SR
    return hp((rng.standard_normal(n) * np.exp(-t * 80)).astype(np.float32), 7000)
def clap():
    n = int(.14 * SR); t = np.arange(n) / SR
    return hp((rng.standard_normal(n) * np.exp(-t * 28)).astype(np.float32), 1500) * .7

# ---------- musik ----------
music = np.zeros(N, np.float32)
BPM = 124; B = 60 / BPM
PROG = [(48, [60, 64, 67]), (45, [57, 60, 64]), (53, [57, 60, 65]), (55, [59, 62, 67])]   # C Am F G
MELODI = [72, 74, 76, 79, 76, 74, 72, None, 69, 72, 74, 72, 67, None, 71, 74]           # riff ceria 2 bar
t_tegang0, t_tegang1 = T['13']['start'] - .1, T['14']['start'] + 1.6                   # bagian dramatis

def bagian_ceria(t0, t1, lead=True):
    bar, t = 0, t0
    while t < t1 - .01:
        root, chord = PROG[bar % 4]
        for b in range(4):
            tb = t + b * B
            if tb >= t1: break
            place(music, kick(), tb, .9 if b in (0, 2) else .55)
            if b in (1, 3): place(music, clap(), tb, .5)
            place(music, hat(), tb + B / 2, .35)
            place(music, bass(midi(root - 12 + (7 if b == 2 else 0)), B * .9), tb, .55)
            for k, m in enumerate(chord): place(music, pluck(midi(m), .22, .5), tb + B / 2 + k * .02, .22)
            if lead:
                for h in range(2):
                    m = MELODI[(bar % 2) * 8 + b * 2 + h]
                    if m: place(music, square(midi(m), B * .45), tb + h * B / 2, .2)
        t += 4 * B; bar += 1

bagian_ceria(0, t_tegang0)
# dramatis: dengung rendah bergetar + detak lambat
n = int((t_tegang1 - t_tegang0) * SR); tt = np.arange(n) / SR
drone = (np.sin(2 * np.pi * midi(36) * tt) + .5 * np.sin(2 * np.pi * midi(43) * tt)) * (.6 + .4 * np.sin(2 * np.pi * 5 * tt))
drone *= np.minimum(1, tt / .3) * np.minimum(1, (tt[-1] - tt) / .15)
place(music, drone.astype(np.float32), t_tegang0, .35)
for i in range(int((T['14']['start'] - t_tegang0) / .9)): place(music, kick(), t_tegang0 + .3 + i * .9, .8)
# "Ayam." = hening sebentar (bagian dramatis selesai), lalu ceria lagi sampai akhir
bagian_ceria(t_tegang1, DUR - .6)
# akord penutup
for m in (60, 64, 67, 72): place(music, square(midi(m), 1.2, .5), DUR - 1.4, .18)
fade = np.ones(N, np.float32); fade[-int(.5 * SR):] = np.linspace(1, 0, int(.5 * SR)); music *= fade

# ---------- SFX tambahan (di atas bunyi jatuh + peluit dari assemble.py) ----------
sfx = np.zeros(N, np.float32)
def dung():
    n = int(.6 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * (70 + 40 * np.exp(-t * 8)) * t) * np.exp(-t * 4)).astype(np.float32)
def boing():
    n = int(.25 * SR); t = np.arange(n) / SR; f = 300 + 500 * t / .25
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * .5).astype(np.float32)
def naik_level():
    out = np.zeros(int(.7 * SR), np.float32)
    for i, m in enumerate((72, 76, 79, 84)): place(out, square(midi(m), .18, .5), i * .09)
    return out
def pop():
    n = int(.08 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * (900 - 4000 * t) * t) * np.exp(-t * 40) * .4).astype(np.float32)
place(sfx, dung(), T['5']['start'], .9)                       # punchline "nonton orang main"
p0 = T['14']['start'] + .3
for i in range(3): place(sfx, boing(), p0 + i * .55, .7)        # Piko melompat
place(sfx, naik_level(), p0 + 2 * .55 + .45, .8)              # PIKO NAIK LEVEL
for k, dt in [('1', 1.1), ('3', 1.3), ('9', 1.1), ('11', 1.9), ('15', .8), ('17', .2)]:
    place(sfx, pop(), T[k]['start'] + dt, .8)                 # teks besar muncul

def load(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
base = load('sfx_dasar.wav'); sfx[:min(N, len(base))] += base[:N]
def save(name, y):
    y = y / (np.abs(y).max() + 1e-9) * .9
    with wave.open(name, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype(np.int16).tobytes())
save('music.wav', music); save('sfx.wav', sfx)
print('music', round(N / SR, 2), 'detik')
