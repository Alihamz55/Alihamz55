"""Analisis vokal untuk lip-sync (tanpa model AI).

1. Pisahkan vokal dari musik pakai REPET-SIM (musik = bagian yang berulang).
2. Deteksi nada penyanyi (pYIN) -> tahu kapan benar-benar bernyanyi.
3. Hitung bentuk mulut per frame video: buka, lebar (i/e), bulat (o/u).

Pemakaian: python3 vocal_lipsync.py <lagu.mp3> <keluaran.npz> [vokal.wav]
"""
import sys
import numpy as np, librosa, soundfile as sf
from scipy.ndimage import gaussian_filter1d, median_filter

AUD, OUT = sys.argv[1], sys.argv[2]
FPS, SR = 30, 22050
y, _ = librosa.load(AUD, sr=SR, mono=False)
mid = y.mean(0) if y.ndim > 1 else y

# --- 1. pisahkan vokal (REPET-SIM) ---
S_full, phase = librosa.magphase(librosa.stft(mid, n_fft=2048, hop_length=512))
S_filter = librosa.decompose.nn_filter(S_full, aggregate=np.median, metric='cosine',
                                       width=int(librosa.time_to_frames(2, sr=SR)))
S_filter = np.minimum(S_full, S_filter)
mask_v = librosa.util.softmask(S_full - S_filter, 10 * S_filter, power=2)
S_voc = mask_v * S_full
vocal = librosa.istft(S_voc * phase, hop_length=512, length=len(mid))
if len(sys.argv) > 3:
    sf.write(sys.argv[3], vocal, SR)

# --- 2. nada penyanyi per frame video ---
hop = SR // FPS
n = int(len(mid) / hop) + 1
f0, voiced, vprob = librosa.pyin(vocal, fmin=90, fmax=900, sr=SR, frame_length=2048, hop_length=hop)

# --- 3. energi & formant dari vokal ---
V = np.abs(librosa.stft(vocal, n_fft=2048, hop_length=hop))
fr = librosa.fft_frequencies(sr=SR, n_fft=2048)
def band(lo, hi): return V[(fr >= lo) & (fr < hi)].sum(0)
rms = band(150, 4000)
L = min(len(rms), len(vprob), n)
rms, vprob = rms[:L], np.nan_to_num(vprob[:L])
f1 = band(500, 1100)[:L]; low = band(150, 500)[:L]; f2 = band(1700, 3200)[:L]
tot = band(150, 3200)[:L] + 1e-9

r = np.log1p(rms / (np.percentile(rms, 50) + 1e-9))
r = np.clip((r - np.percentile(r, 35)) / (np.percentile(r, 97) - np.percentile(r, 35) + 1e-9), 0, 1)
sing = median_filter((vprob > 0.25).astype(float), 5)
sing = np.maximum(sing, (gaussian_filter1d(vprob, 1) > 0.45).astype(float))
gate = gaussian_filter1d(sing, 1.2)
opn = r * gate
# attack cepat, release sedang -> konsonan terlihat menutup
out = np.zeros_like(opn); v = 0
for i, x in enumerate(opn):
    v += (x - v) * (0.75 if x > v else 0.45); out[i] = v
opn = np.where(out < 0.08, 0, out)
wide = gaussian_filter1d(f2 / tot, 1.5); wide = np.clip((wide - np.percentile(wide, 15)) / (np.percentile(wide, 90) - np.percentile(wide, 15) + 1e-9), 0, 1)
rnd = gaussian_filter1d(low / (low + f1 + 1e-9), 1.5); rnd = np.clip((rnd - np.percentile(rnd, 20)) / (np.percentile(rnd, 92) - np.percentile(rnd, 20) + 1e-9), 0, 1)
rnd = rnd * (1 - wide * 0.7)
np.savez(OUT, open=opn, wide=wide, round=rnd, sing=gate, f0=np.nan_to_num(f0[:L]))
print('frames', L, 'singing %', round(100 * (gate > 0.5).mean(), 1))
for s in range(0, L // FPS, 3):
    seg = gate[s * FPS:(s + 3) * FPS]
    print(f'{s:3d}s ' + ''.join('#' if x > 0.5 else '.' for x in seg[::3]))
