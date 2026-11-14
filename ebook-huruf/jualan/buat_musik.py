"""Musik latar ceria orisinal (dibuat dari kode, bebas hak cipta) untuk iklan alidraws.

Pakai: python3 buat_musik.py <detik> <output.wav>
Gaya: marimba + bass + tepuk tangan + hi-hat, 112 bpm, akor C - G - Am - F.
"""
import sys, wave
import numpy as np

SR = 44100
detik = float(sys.argv[1]); out = sys.argv[2]
BPM = 112; KETUK = 60 / BPM
n = int(SR * (detik + 1))
mix = np.zeros(n)

def frek(midi): return 440 * 2 ** ((midi - 69) / 12)

def marimba(f, dur, vol):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 7)
    nada = np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*f*4*t)*np.exp(-t*25) + 0.15*np.sin(2*np.pi*f*10*t)*np.exp(-t*60)
    att = np.minimum(1, t / 0.004)
    return vol * nada * env * att

def bass(f, dur, vol):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 3) * np.minimum(1, t / 0.01)
    return vol * (np.sin(2*np.pi*f*t) + 0.25*np.sin(2*np.pi*2*f*t)) * env

rng = np.random.default_rng(7)
def derau(dur, vol, peluruhan, hp=True):
    m = int(SR * dur); x = rng.standard_normal(m)
    if hp: x = np.diff(np.concatenate([[0], x]))
    return vol * x * np.exp(-np.arange(m) / SR * peluruhan)

def taruh(sig, waktu):
    i = int(waktu * SR)
    if i >= n: return
    j = min(n, i + len(sig)); mix[i:j] += sig[:j - i]

# akor: (nada dasar bass, nada akor)
AKOR = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]
# melodi 2 birama per pola (nada midi, ketukan mulai, panjang), 8 ketukan
MELODI = [
    [(72, 0, .5), (74, .5, .5), (76, 1, 1), (79, 2, 1), (76, 3, 1)],
    [(74, 0, .5), (76, .5, .5), (74, 1, 1), (71, 2, 1), (67, 3, 1)],
    [(72, 0, .5), (74, .5, .5), (76, 1, .5), (72, 1.5, .5), (69, 2, 1), (72, 3, 1)],
    [(77, 0, 1), (76, 1, .5), (74, 1.5, .5), (72, 2, 2)],
]

birama = int(detik / (4 * KETUK)) + 1
for b in range(birama):
    t0 = b * 4 * KETUK
    akar, nada = AKOR[b % 4]
    # bass: ketukan 1 dan 3
    taruh(bass(frek(akar), KETUK * 1.8, .45), t0)
    taruh(bass(frek(akar + 7), KETUK * 1.8, .35), t0 + 2 * KETUK)
    # iringan akor marimba (off-beat)
    for k in range(4):
        for m in nada:
            taruh(marimba(frek(m), KETUK, .09), t0 + (k + .5) * KETUK)
    # melodi (mulai birama ke-2 supaya pembukaan tidak ramai)
    if b >= 1:
        for (m, mulai, pj) in MELODI[b % 4]:
            taruh(marimba(frek(m), max(pj * KETUK, .35), .22), t0 + mulai * KETUK)
    # perkusi
    for k in range(8):
        taruh(derau(.05, .05, 60), t0 + k * KETUK / 2)              # hi-hat
    for k in (1, 3):
        taruh(derau(.15, .18, 25, hp=False), t0 + k * KETUK)       # tepuk tangan
    taruh(bass(55, .25, .6) * np.exp(-np.arange(int(SR*.25))/SR*18), t0)  # kick

mix = mix[:int(SR * detik)]
# fade in/out
f_in, f_out = int(SR * .5), int(SR * 2)
mix[:f_in] *= np.linspace(0, 1, f_in); mix[-f_out:] *= np.linspace(1, 0, f_out)
mix = mix / np.max(np.abs(mix)) * 0.8
data = (mix * 32767).astype(np.int16)
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print("tersimpan:", out, f"{detik:.1f} detik")
