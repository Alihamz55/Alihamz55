# Musik + SFX sintetis untuk Badai Rapor, lalu mix dengan voice.wav -> mix.wav
# Mood: ceria (sekolah) -> mendung minor -> tegang (hujan) -> hangat (piano) -> petir -> ceria lembut -> senja haru.
import numpy as np, wave, json

SR = 48000; DUR = 59.83; N = int(SR * DUR)
rng = np.random.default_rng(7)

def t_(d): return np.arange(int(SR * d)) / SR
def add(buf, x, at, g=1.0):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[:j - i] * g
def env(n, a=0.005, r=0.3):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    return e * np.exp(-np.arange(n) / SR / r)
def midi(m): return 440 * 2 ** ((m - 69) / 12)

def pluck(f, d=1.2, bright=0.5):
    # Karplus-Strong ala ukulele
    n = int(SR * d); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return out * env(n, 0.002, 0.6)
_pl = {}
def pl(m, d=1.0):
    k = (m, d)
    if k not in _pl: _pl[k] = pluck(midi(m), d)
    return _pl[k]
def piano(m, d=2.5):
    t = t_(d); f = midi(m)
    x = sum(a * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (1.2 + h * 0.8)) for h, a in [(1, 1), (2, 0.45), (3, 0.2), (4, 0.08)])
    return x * env(len(t), 0.004, 3.0)
def pad(ms, d, lvl=1.0):
    t = t_(d); x = sum(np.sin(2 * np.pi * midi(m) * t + np.sin(2 * np.pi * 0.2 * t)) + 0.3 * np.sin(2 * np.pi * midi(m) * 2.003 * t) for m in ms)
    e = np.minimum(1, np.minimum(t / 0.6, (d - t) / 0.8)); return x * e * lvl / len(ms)
def bell(m, d=1.5):
    t = t_(d); f = midi(m); return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 4)) * env(len(t), 0.002, 0.5)
def lp(x, a):  # low-pass satu kutub (a kecil = lebih gelap)
    from scipy.signal import lfilter
    return lfilter([a], [1, -(1 - a)], x)
def noise(d): return rng.standard_normal(int(SR * d))

music = np.zeros(N); sfx = np.zeros(N)
CH = {'C': [48, 60, 64, 67], 'G': [43, 59, 62, 67], 'Am': [45, 60, 64, 69], 'F': [41, 60, 65, 69], 'Dm': [50, 62, 65, 69], 'E': [40, 59, 64, 68], 'Em': [40, 59, 64, 67]}
beat = 60 / 100

def strum_section(t0, t1, prog, lvl, pattern=(0, 1, 2, 3, 2, 1, 2, 3)):
    t, k = t0, 0
    while t < t1 - 0.05:
        ch = CH[prog[(k // len(pattern)) % len(prog)]]; idx = pattern[k % len(pattern)]
        add(music, pl(ch[idx], 1.0), t, lvl * (1.0 if k % 2 == 0 else 0.7))
        if k % 4 == 0: add(music, pl(ch[0] - 12 if ch[0] > 40 else ch[0], 1.4), t, lvl * 0.8)
        t += beat / 2; k += 1

# 1) ceria 0 - 12.2
strum_section(0.0, 12.2, ['C', 'G', 'Am', 'F'], 0.55)
for k in range(int(12.2 / (beat / 2))):  # shaker
    add(music, lp(noise(0.05), 0.5) * env(int(SR * 0.05), 0.001, 0.02) * (0.5 if k % 2 else 0.25), k * beat / 2, 0.25)
# 2) mendung, minor, lebih pelan 12.2 - 27
strum_section(12.2, 27.0, ['Am', 'F', 'Dm', 'E'], 0.38, pattern=(0, 2, 1, 3))
add(music, pad([57, 60, 64], 14.8, 0.25), 12.2)
# 3) tegang hujan 27 - 36.6 : drone + detak
add(music, pad([45, 52, 57], 9.6, 0.45), 27.0)
for k in range(int(9.4 / beat)): add(music, piano(33, 0.6) * 0.5, 27.0 + k * beat)
# 4) hangat piano 36.8 - 47.0
prog = [['C', 0], ['Am', 1], ['F', 2], ['G', 3]]; bar = beat * 4
for b in range(int(10.2 / bar) + 1):
    ch = CH[prog[b % 4][0]]; t0 = 36.9 + b * bar
    if t0 > 46.9: break
    add(music, piano(ch[0], 3.0) * 0.8, t0)
    for i, m in enumerate([ch[1], ch[2], ch[3], ch[2]]):
        if t0 + i * beat < 46.95: add(music, piano(m + 12, 2.0) * 0.45, t0 + i * beat)
add(music, pad([60, 64, 67], 10.1, 0.18), 36.9)
# (sunyi 47.07 - 47.55 untuk petir)
# 5) ceria lembut 47.55 - 53.6
strum_section(47.55, 53.6, ['F', 'C', 'G', 'C'], 0.45)
# 6) senja haru 53.6 - akhir
for b, c in enumerate(['C', 'G', 'Am', 'F']):
    t0 = 53.65 + b * 1.55; ch = CH[c]
    add(music, piano(ch[0], 3.5) * 0.8, t0); add(music, piano(ch[2] + 12, 3.0) * 0.5, t0 + 0.4); add(music, piano(ch[3] + 12, 3.0) * 0.4, t0 + 0.8)
add(music, piano(72, 3.0) * 0.6, 59.0 - 0.6)
add(music, pad([48, 60, 64, 67], 6.2, 0.3), 53.6)
fade = np.ones(N); fe = int(SR * 1.2); fade[-fe:] = np.linspace(1, 0, fe); music *= fade
# potong musik di petir
i0, i1 = int(47.05 * SR), int(47.55 * SR); music[i0:i1] *= 0.0

# ---------- SFX ----------
for i, m in enumerate([84, 88, 91, 96]): add(sfx, bell(m, 1.2), 0.05 + i * 0.12, 0.35)           # jingle ramalan cuaca
for k in range(3):                                                                                  # HP bergetar
    tb = t_(0.32); add(sfx, np.sign(np.sin(2 * np.pi * 150 * tb)) * lp(noise(0.32), 0.3) * 0.6 * env(len(tb), 0.01, 0.4), 14.3 + k * 0.55, 0.45)
add(sfx, bell(88, 0.8), 16.4, 0.4); add(sfx, bell(93, 0.8), 16.52, 0.4)                           # notifikasi
add(sfx, bell(96, 0.5), 18.55, 0.25)                                                                # centang biru
for tt in np.arange(5.75, 6.85, 0.45): add(sfx, lp(noise(0.09), 0.06) * env(int(SR * 0.09), 0.002, 0.04), tt, 1.2)   # langkah
for tt in np.arange(12.3, 14.2, 0.45): add(sfx, lp(noise(0.09), 0.06) * env(int(SR * 0.09), 0.002, 0.04), tt, 1.0)
r = noise(0.35); add(sfx, (r - lp(r, 0.3)) * env(len(r), 0.01, 0.12) * 0.5, 8.0, 0.6)             # kertas rapor
for k in range(6): add(sfx, np.sin(2 * np.pi * (900 - k * 60) * t_(0.06)) * env(int(SR * 0.06), 0.001, 0.02), 25.9 + k * 0.13, 0.25)  # tetes air di kertas
# hujan
def rainbed(t0, t1, lvl, dark=0.25):
    n = noise(t1 - t0); x = lp(n, dark) - lp(n, 0.02); tt = t_(t1 - t0)
    e = np.minimum(1, np.minimum(tt / 0.4, (t1 - t0 - tt) / 0.4)); add(sfx, x * e, t0, lvl)
rainbed(19.4, 25.35, 0.10); rainbed(25.35, 27.0, 0.25); rainbed(27.0, 36.6, 0.38)
rainbed(36.6, 47.07, 0.18, 0.06); rainbed(47.07, 50.5, 0.12, 0.06)
# petir
tb = t_(3.0); crack = noise(3.0) * np.exp(-tb * 18); rumble = lp(noise(3.0), 0.01) * 6 * np.exp(-tb * 1.2) * np.minimum(1, tb / 0.05)
add(sfx, crack * 0.7 + rumble, 47.07, 0.9)
add(sfx, bell(79, 2.0), 56.2, 0.2); add(sfx, bell(84, 2.0), 56.45, 0.15)                           # kilau senja

# ---------- mix ----------
w = wave.open('voice.wav'); voice = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768; w.close()
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
def rms(x): return np.sqrt(np.mean(x ** 2) + 1e-12)
vr = rms(voice[np.abs(voice) > 0.02])
music *= (vr * 10 ** (-13 / 20)) / rms(music[np.abs(music) > 1e-4])
# ducking saat ada suara
win = int(SR * 0.05); act = np.convolve(np.abs(voice) > 0.03, np.ones(win) / win, 'same') > 0.05
duck = np.where(act, 10 ** (-4 / 20), 1.0); duck = np.convolve(duck, np.ones(int(SR * 0.15)) / int(SR * 0.15), 'same')
music *= duck
sfx *= (0.7 * np.abs(voice).max()) / np.abs(sfx).max()
mix = voice + music + sfx
mix /= np.abs(mix).max() / 0.89
for name, x in [('music.wav', music), ('sfx.wav', sfx), ('mix_raw.wav', mix)]:
    o = wave.open(name, 'wb'); o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); o.close()
print('ok', 'musik rms dB rel suara:', round(20 * np.log10(rms(music) / vr), 1), 'sfx puncak/suara:', round(np.abs(sfx).max() / np.abs(voice).max(), 2))
