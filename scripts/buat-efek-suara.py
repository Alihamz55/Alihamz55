"""
Membuat efek suara pertarungan dari nol (bebas hak cipta), disimpan ke public/sfx/.

Cara pakai:
    python3 scripts/buat-efek-suara.py

Hasil: whoosh.wav, pukul.wav, dentum.wav, slowmo.wav, gong.wav
"""
import os
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(7)
FOLDER = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")


def waktu(detik):
    return np.arange(int(SR * detik)) / SR


def lowpass(x, cutoff):
    """Filter peredam suara tinggi (cutoff boleh berubah tiap sampel)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    prev = 0.0
    for i in range(len(x)):
        prev = (1 - a[i]) * x[i] + a[i] * prev
        y[i] = prev
    return y


def sinus_geser(f_awal, f_akhir, t):
    f = f_awal * (f_akhir / f_awal) ** (t / t[-1])
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def simpan(nama, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    fade = min(len(x), int(SR * 0.01))
    x[-fade:] *= np.linspace(1, 0, fade)
    data = (x * 32767).astype(np.int16)
    os.makedirs(FOLDER, exist_ok=True)
    with wave.open(os.path.join(FOLDER, nama), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print("dibuat:", nama)


# Whoosh: desir angin cepat (lari, ayunan tendangan)
t = waktu(0.35)
bentuk = np.sin(np.pi * t / t[-1]) ** 2
simpan("whoosh.wav", lowpass(rng.standard_normal(len(t)), 400 + 3000 * bentuk) * bentuk)

# Pukul: "duk!" pendek dan padat
t = waktu(0.22)
dentum = sinus_geser(160, 55, t) * np.exp(-t * 28)
klik = lowpass(rng.standard_normal(len(t)), 2500) * np.exp(-t * 90)
simpan("pukul.wav", np.tanh(2.5 * (dentum + 0.8 * klik)))

# Dentum: pukulan pamungkas, berat dan menggelegar
t = waktu(1.3)
bawah = sinus_geser(90, 32, t) * np.exp(-t * 3.2)
retak = lowpass(rng.standard_normal(len(t)), 3500) * np.exp(-t * 22)
gemuruh = lowpass(rng.standard_normal(len(t)), 180) * np.exp(-t * 2.5) * 3
simpan("dentum.wav", np.tanh(2.2 * (bawah + 0.7 * retak + gemuruh)))

# Slow-mo: desir berat yang melambat dan turun
t = waktu(1.1)
bentuk = np.minimum(1, t / 0.15) * np.exp(-np.maximum(0, t - 0.15) * 2.2)
desir = lowpass(rng.standard_normal(len(t)), 1800 * np.exp(-t * 2.5) + 80)
simpan("slowmo.wav", (desir * 2 + 0.6 * sinus_geser(220, 45, t)) * bentuk)

# Gong: penutup K.O.
t = waktu(3.0)
nada = sum(
    amp * np.sin(2 * np.pi * f * t) * np.exp(-t * d)
    for f, amp, d in [(110, 1, 1.0), (233, 0.6, 1.4), (304, 0.5, 1.8), (431, 0.35, 2.4), (612, 0.25, 3.2)]
)
pukulan = lowpass(rng.standard_normal(len(t)), 900) * np.exp(-t * 30) * 0.5
simpan("gong.wav", nada * (1 + 0.15 * np.sin(2 * np.pi * 4 * t)) + pukulan)
