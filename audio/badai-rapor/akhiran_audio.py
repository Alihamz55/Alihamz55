# Audio akhiran Kota Kotak (6 dtk): suara Mama + Raka, musik ceria, SFX pop/klik/lonceng -> akhiran_mix.wav
import numpy as np, wave
SR = 48000; DUR = 6.0; N = int(SR * DUR); rng = np.random.default_rng(3)
def rd(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768; w.close(); return x
def t_(d): return np.arange(int(SR * d)) / SR
def add(b, x, at, g=1.0):
    i = int(at * SR); j = min(len(b), i + len(x)); b[i:j] += x[:j - i] * g
def env(n, a=0.003, r=0.3): e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na); return e * np.exp(-np.arange(n) / SR / r)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def bell(m, d=0.8): t = t_(d); f = midi(m); return (np.sin(2*np.pi*f*t) + 0.4*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*4)) * env(len(t), 0.002, 0.35)
def pl(m, d=0.6):
    p = max(2, int(SR / midi(m))); buf = rng.uniform(-1, 1, p); n = int(SR * d); o = np.zeros(n)
    for i in range(n): o[i] = buf[i % p]; buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return o * env(n, 0.002, 0.5)
voice = np.zeros(N); add(voice, rd('mama_f.wav'), 0.35); add(voice, rd('raka_f.wav'), 2.95)
music = np.zeros(N); beat = 0.3
prog = [[60, 64, 67], [55, 59, 62, 67], [57, 60, 64], [53, 57, 60, 65]]
k = 0; t = 0.0
while t < 5.6:
    ch = prog[(k // 8) % 4]; add(music, pl(ch[k % len(ch)] + (12 if k % 4 == 3 else 0)), t, 0.6 if k % 2 == 0 else 0.4)
    if k % 4 == 0: add(music, pl(ch[0] - 12, 0.9), t, 0.5)
    t += beat / 2 * 1.0; k += 1
add(music, bell(84, 1.2), 5.4, 0.6); add(music, bell(91, 1.2), 5.5, 0.5)
fade = np.ones(N); fade[int(5.5 * SR):] = np.linspace(1, 0, N - int(5.5 * SR)); music *= fade
sfx = np.zeros(N)
for i in range(9): add(sfx, np.sin(2*np.pi*(500 + i*60)*t_(0.07)) * env(int(SR*0.07), 0.001, 0.03), 0.18 + 0.07*i, 0.5)  # balok jatuh
add(sfx, bell(88, 0.5), 0.8, 0.4)                                   # pil episode
add(sfx, np.sin(2*np.pi*t_(0.12)*(300 + 900*t_(0.12)/0.12)) * env(int(SR*0.12), 0.001, 0.06), 2.9, 0.6)  # pop tombol
n = rng.standard_normal(int(SR*0.03)); add(sfx, n * env(len(n), 0.0005, 0.008), 4.15, 0.8)   # klik
add(sfx, bell(93, 1.0), 4.45, 0.6); add(sfx, bell(96, 1.0), 4.6, 0.5)                          # lonceng
add(sfx, bell(86, 0.5), 4.7, 0.3)
def rms(x): return np.sqrt(np.mean(x**2) + 1e-12)
vr = rms(voice[np.abs(voice) > 0.02])
music *= (vr * 10 ** (-12 / 20)) / rms(music[np.abs(music) > 1e-4])
win = int(SR*0.05); act = np.convolve(np.abs(voice) > 0.03, np.ones(win)/win, 'same') > 0.05
duck = np.convolve(np.where(act, 10 ** (-4/20), 1.0), np.ones(int(SR*0.15))/int(SR*0.15), 'same'); music *= duck
sfx *= 0.7 * np.abs(voice).max() / np.abs(sfx).max()
mix = voice + music + sfx; mix /= np.abs(mix).max() / 0.89
o = wave.open('akhiran_mix.wav', 'wb'); o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((mix * 32767).astype(np.int16).tobytes()); o.close()
print('ok')
