"""Akhiran channel Kotak Kocak (~6 detik): suara Bobi + Neng Kubi, jingle, SFX tombol subscribe.
Hasil: voice.wav, music.wav, sfx.wav, timing.json, dan engine/kotak2d/akhiran/data.js (gerak mulut)."""
import numpy as np, wave, json, subprocess
SR, FPS, DUR = 48000, 30, 6.6
N = int(DUR * SR); rng = np.random.default_rng(5); midi = lambda m: 440 * 2 ** ((m - 69) / 12)
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-af', 'atempo=1.12', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32).copy(); idx = np.where(np.abs(a) > .02)[0]; return a[max(idx[0] - 960, 0): idx[-1] + 2400]
def save(name, y):
    y = y / (np.abs(y).max() + 1e-9) * .9
    with wave.open(name, 'w') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype(np.int16).tobytes())
def place(buf, sig, t0, g=1.0):
    i = int(t0 * SR); j = min(len(buf), i + len(sig))
    if 0 <= i < j: buf[i:j] += sig[:j - i] * g
def env(n, a, r): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
def square(f, d, duty=.25): n = int(d * SR); t = np.arange(n) / SR; return (np.where((t * f) % 1 < duty, 1., -1.) * .35 * env(n, .004, d * .45)).astype(np.float32)
def pluck(f, d=.25): n = int(d * SR); t = np.arange(n) / SR; return (sum((.55 ** k) * np.sin(2 * np.pi * f * (k + 1) * t) / (k + 1) for k in range(6)) * env(n, .003, d * .35)).astype(np.float32)
def kick(): n = int(.25 * SR); t = np.arange(n) / SR; f = 50 + 100 * np.exp(-t * 30); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 12)).astype(np.float32)

# suara
voice = np.zeros(N, np.float32); timing = []; t = .35
for i, who, gap in [(1, 'bobi', .2), (2, 'kubi', 0)]:
    a = load(f'lines/l{i:02d}.wav'); place(voice, a, t); timing.append({'id': i, 'who': who, 'start': round(t, 3), 'end': round(t + len(a) / SR, 3)}); t += len(a) / SR + gap
print('suara selesai di', round(t, 2), 'detik')
json.dump(timing, open('timing.json', 'w'), indent=1); save('voice.wav', voice)

# jingle ceria 124 BPM + akord penutup
music = np.zeros(N, np.float32); B = 60 / 124
prog = [(48, [60, 64, 67]), (53, [57, 60, 65]), (55, [59, 62, 67]), (48, [60, 64, 67])]
mel = [72, 76, 79, 76, 77, 81, 79, 77, 74, 79, 77, 74, 72, None, 84, None]
for bar in range(3):
    root, ch = prog[bar]
    for b in range(4):
        tb = bar * 4 * B + b * B
        place(music, kick(), tb, .8)
        for k, m in enumerate(ch): place(music, pluck(midi(m)), tb + B / 2 + k * .02, .2)
        for h in range(2):
            m = mel[(bar * 8 + b * 2 + h) % 16]
            if m: place(music, square(midi(m), B * .45), tb + h * B / 2, .18)
for m in (60, 64, 67, 72): place(music, square(midi(m), 1.6, .5), 3 * 4 * B, .18)
music[-int(.4 * SR):] *= np.linspace(1, 0, int(.4 * SR)); save('music.wav', music)

# SFX: tombol muncul (pop), diklik (klik + ding), bintang
sfx = np.zeros(N, np.float32)
n = int(.08 * SR); tt = np.arange(n) / SR; popS = (np.sin(2 * np.pi * (900 - 4000 * tt) * tt) * np.exp(-tt * 40)).astype(np.float32)
n = int(.03 * SR); click = (rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 200)).astype(np.float32)
ding = np.zeros(int(.6 * SR), np.float32)
for i, m in enumerate((79, 84, 88)): place(ding, square(midi(m), .25, .5), i * .07)
T_BTN, T_KLIK = .6, timing[0]['end'] - .25
place(sfx, popS, T_BTN, .8); place(sfx, click, T_KLIK, .9); place(sfx, ding, T_KLIK + .03, .7)
save('sfx.wav', sfx); json.dump({'tombol': T_BTN, 'klik': T_KLIK}, open('waktu.json', 'w'))

# gerak mulut
hop = SR // FPS; nf = int(DUR * FPS); rms = np.array([np.sqrt(np.mean(voice[i * hop:(i + 1) * hop] ** 2)) for i in range(nf)]); lip = np.zeros(nf)
for d in timing:
    s, e = int(d['start'] * FPS), int(d['end'] * FPS) + 1; seg = rms[s:e]; v = np.clip((seg / (np.percentile(seg, 85) + 1e-6) - .12) / .88, 0, 1) ** .8
    acc = 0
    for i, x in enumerate(v): acc = x if x > acc else acc * .55 + x * .45; lip[s + i] = acc
open('../../engine/kotak2d/akhiran/data.js', 'w').write('window.TIMING=' + json.dumps(timing) + ';\nwindow.LIPS=' + json.dumps([round(float(x), 2) for x in lip]) +
    ';\nwindow.TOTAL_FRAMES=' + str(nf) + ';\nwindow.WAKTU=' + json.dumps({'tombol': T_BTN, 'klik': T_KLIK}) + ';\n')
