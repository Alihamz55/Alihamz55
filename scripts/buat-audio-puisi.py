"""Rakit audio video puisi "Aku Ingin" (Sapardi Djoko Damono).

Masukan : public/puisi/l1.wav ... l7.wav (suara per baris, 48 kHz mono)
Keluaran: public/puisi/suara.wav  (suara saja)
          public/puisi/musik.wav  (beat lo-fi lembut + piano + pad, sintetis)
          src/puisi/waktu.json    (detik mulai/selesai tiap baris + durasi total)

Jalankan: python3 scripts/buat-audio-puisi.py
"""
import json
import wave
from pathlib import Path

import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public" / "puisi"

INTRO = 1.6            # judul tampil dulu
# jeda setelah tiap baris (detik). Jeda antar-bait lebih panjang supaya "bernapas".
JEDA = [0.45, 0.35, 1.3, 0.45, 0.35, 1.4, 0.0]
EKOR = 2.2             # musik tetap jalan sebentar setelah nama penyair


def baca(p):
    with wave.open(str(p)) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        if w.getnchannels() == 2:
            a = a.reshape(-1, 2).mean(1)
    return a


def tulis(p, a):
    a = np.clip(a, -1, 1)
    st = a if a.ndim == 2 else np.stack([a, a], 1)
    with wave.open(str(p), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


# ---------- suara ----------
baris = [baca(PUB / f"l{i}.wav") for i in range(1, 8)]
t = INTRO
waktu = []
for a, j in zip(baris, JEDA):
    waktu.append([round(t, 3), round(t + len(a) / SR, 3)])
    t += len(a) / SR + j
total = t + EKOR
N = int(total * SR)
suara = np.zeros(N, np.float32)
for a, (mulai, _) in zip(baris, waktu):
    s = int(mulai * SR)
    suara[s:s + len(a)] += a
suara *= 0.89 / (np.abs(suara).max() + 1e-9)

# ---------- musik ----------
rng = np.random.default_rng(7)
BPM = 76
ketuk = 60 / BPM
musik = np.zeros((N, 2), np.float32)


def taruh(sig, detik, pan=0.0, vol=1.0):
    s = int(detik * SR)
    if s >= N:
        return
    sig = sig[: N - s] * vol
    musik[s:s + len(sig), 0] += sig * (1 - pan) * 0.5 * 2 ** 0.5
    musik[s:s + len(sig), 1] += sig * (1 + pan) * 0.5 * 2 ** 0.5


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def piano(midi, dur=2.6):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = hz(midi)
    sig = sum(np.sin(2 * np.pi * f * k * tt) * (0.55 ** (k - 1)) * np.exp(-tt * (1.6 + k * 0.9)) for k in range(1, 6))
    serang = np.minimum(1, tt / 0.006)
    return (sig * serang).astype(np.float32)


def pad(midis, dur):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    sig = np.zeros(n, np.float32)
    for m in midis:
        for d in (-0.08, 0.08):  # dua osilator sedikit fals → hangat
            sig += np.sin(2 * np.pi * hz(m + d) * tt).astype(np.float32)
    env = np.minimum(1, tt / 1.2) * np.minimum(1, (dur - tt) / 1.2)
    return sig * env / len(midis) / 2


def kick():
    n = int(0.35 * SR)
    tt = np.arange(n) / SR
    f = 50 + 70 * np.exp(-tt * 30)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)).astype(np.float32)


def hat():
    n = int(0.06 * SR)
    tt = np.arange(n) / SR
    s = rng.standard_normal(n).astype(np.float32)
    s = np.diff(s, prepend=0)  # high-pass sederhana
    return s * np.exp(-tt * 70) * 0.25


def snare_lembut():
    n = int(0.25 * SR)
    tt = np.arange(n) / SR
    s = rng.standard_normal(n).astype(np.float32)
    s = np.convolve(s, np.ones(6) / 6, "same")  # brush: noise yang dihaluskan
    return s * np.exp(-tt * 18) * 0.5 + np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 30) * 0.2


# progresi Fmaj7 – Em7 – Dm9 – Cmaj7 (sendu, tidak gelap)
AKOR = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60, 64], [48, 52, 55, 59]]
BAR = ketuk * 4
mulai_beat = waktu[0][0] - 0.2            # beat masuk tepat saat baris pertama
akhir_beat = waktu[6][0]                  # beat berhenti saat nama penyair → hening yang manis
nbar = int(total / BAR) + 1
for b in range(nbar):
    t0 = 0.0 + b * BAR
    ak = AKOR[b % 4]
    taruh(pad(ak, BAR + 1.0), t0, vol=0.10)
    # arpeggio piano naik-turun, 8 not per bar
    pola = [0, 1, 2, 3, 2, 1, 2, 3]
    for k, idx in enumerate(pola):
        m = ak[idx % len(ak)] + 12
        taruh(piano(m), t0 + k * ketuk / 2 + rng.uniform(0, 0.012), pan=(-0.35 if k % 2 else 0.35), vol=0.11)
    taruh(piano(ak[0] - 12, 3.5), t0, vol=0.16)  # bas piano
    for k in range(4):
        tb = t0 + k * ketuk
        if mulai_beat <= tb < akhir_beat:
            if k in (0, 2):
                taruh(kick(), tb, vol=0.32)
            if k in (1, 3):
                taruh(snare_lembut(), tb, vol=0.22)
            for h in range(2):
                taruh(hat(), tb + h * ketuk / 2 + (0.03 if h else 0), pan=0.3, vol=0.5 if h == 0 else 0.3)

# not penutup panjang di akhir
taruh(piano(65, 5) + piano(72, 5) + piano(77, 5), waktu[6][1] + 0.3, vol=0.13)

# gema sederhana (beberapa pantulan) → ruang yang luas
gema = musik.copy()
for d, g in ((0.11, 0.35), (0.23, 0.25), (0.37, 0.18), (0.53, 0.12), (0.79, 0.07)):
    s = int(d * SR)
    gema[s:, 0] += musik[:-s, 1] * g
    gema[s:, 1] += musik[:-s, 0] * g
musik = gema

# fade in/out
tt = np.arange(N) / SR
env = np.minimum(1, tt / 1.0) * np.clip((total - tt) / 1.8, 0, 1)
musik *= env[:, None]

# musik dijaga ~ -14 dB di bawah puncak suara supaya kata-kata tetap jelas
musik *= (0.89 * 10 ** (-14 / 20)) / (np.abs(musik).max() + 1e-9) * 1.6

tulis(PUB / "suara.wav", suara)
tulis(PUB / "musik.wav", musik)
(ROOT / "src" / "puisi").mkdir(exist_ok=True)
json.dump({"total": round(total, 3), "baris": waktu}, open(ROOT / "src" / "puisi" / "waktu.json", "w"), indent=1)
print("total", round(total, 2), "detik")
for w in waktu:
    print(w)
