#!/usr/bin/env python3
"""Musik + SFX untuk episode Motion Canvas "Asep Hidup Sehat".

Memakai fungsi bunyi sintetis dari engine/pipeline-template/audio.py (bagian definisi saja),
lalu menaruh cue sesuai waktu kalimat di src/audio/hidup-sehat.json.
Jalankan dari folder motion-canvas:  python3 tools/audio_hidup_sehat.py  -> music.wav, sfx.wav
Lalu mix:  python3 ../engine/pipeline-template/mix.py src/audio/hidup-sehat.wav music.wav sfx.wav --out mix_raw.wav
"""
import json, os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TPL = os.path.join(HERE, '..', '..', 'engine', 'pipeline-template')
data = json.load(open(os.path.join(HERE, '..', 'src', 'audio', 'hidup-sehat.json')))
L = data['lines']
DUR_EP = data['duration']

# Ambil definisi fungsi dari audio.py template (berhenti sebelum cue episode lamanya).
src = open(os.path.join(TPL, 'audio.py')).read()
src = src.replace('DUR = 1408 / 30', f'DUR = {DUR_EP}')
src = src.split('\nloop(0, F(1045)')[0]
cwd = os.getcwd(); os.chdir(TPL)  # crowd/*.wav dibaca relatif
g = {'__name__': 'tpl'}
exec(compile(src, 'audio.py', 'exec'), g)
os.chdir(cwd)
SR, N, music, sfx, place, rng = g['SR'], g['N'], g['music'], g['sfx'], g['place'], g['rng']
S = lambda name, *a: g[name](*a)

def bark():
    n = int(0.16 * SR); t = np.arange(n) / SR
    f = 620 * np.exp(-t * 5)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph)
    noise = rng.standard_normal(n) * 0.35
    e = np.minimum(1, t / 0.008) * np.exp(-t * 18)
    return ((tone + noise) * e * 0.6).astype(np.float32)

def steps(t0, t1, dt, gain):
    t = t0
    while t < t1:
        place(sfx, S('step'), t, gain); t += dt

# ---------- musik: loop ringan, berhenti sebentar sebelum punchline ----------
punch = 35.5
S('loop', 0, punch - 0.6, 0.45)
fo = int(0.5 * SR); i1 = int((punch - 0.6) * SR); music[i1 - fo:i1] *= np.linspace(1, 0, fo); music[i1:] = 0
i2 = int((L[11]['start'] - 0.35) * SR)
tmp = np.zeros_like(music); g['music'] = tmp
S('loop', L[11]['start'] - 0.35, DUR_EP, 0.5)
music[i2:] += tmp[i2:]
fo = int(0.5 * SR); music[-fo:] *= np.linspace(1, 0, fo)

# ---------- SFX ----------
place(sfx, S('whoosh'), 0.05, 0.4); steps(0.1, 1.35, 0.17, 0.25)
place(sfx, S('pop'), 0.15, 0.35)
place(sfx, S('ding'), L[1]['end'] - 0.6, 0.25)                 # "kereta pribadi"
place(sfx, S('kaching'), 14.7, 0.35)                            # MAHAL!
place(sfx, S('stab'), 18.6, 0.3)                                # TULANG?!
place(sfx, S('boing'), L[5]['start'], 0.35)                     # "Tulang?"
place(sfx, S('whoosh'), L[6]['start'] - 0.05, 0.35); steps(L[6]['start'], L[6]['end'], 0.13, 0.22)
place(sfx, S('cricket'), 28.5, 0.3)                             # ASEP: LIBUR
place(sfx, S('rimshot'), punch, 0.45)                           # SI BLEKI!
place(sfx, S('crowd_laugh', 1.6, 0.9), punch + 0.25, 0.55)
place(sfx, bark(), L[10]['end'] + 0.12, 0.6); place(sfx, bark(), L[10]['end'] + 0.35, 0.6)
place(sfx, S('whoosh'), L[11]['start'] - 0.4, 0.4)              # flash BESOKNYA
steps(L[11]['start'] - 0.2, L[11]['end'] + 0.3, 0.13, 0.22)
place(sfx, bark(), 39.2, 0.45)
place(sfx, S('pop'), L[11]['end'] + 0.1, 0.35)
place(sfx, S('crowd_laugh', 1.3, 1.0), L[11]['end'] + 0.1, 0.6)

import wave
def write_stem(name, x):
    x = x / max(1e-9, np.abs(x).max()) * 0.9
    with wave.open(name, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
write_stem('music.wav', music); write_stem('sfx.wav', sfx)
print('ok stems', N / SR)
