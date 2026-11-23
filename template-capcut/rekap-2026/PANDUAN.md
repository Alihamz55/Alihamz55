# Template "Rekap 2026: Tahun Ini Aku…" (CapCut HP)

16 slot foto/video · ±18 detik · tempo 120 BPM (1 ketukan = 0,5 detik)

## Isi paket

| File | Fungsi |
|---|---|
| `Rekap-2026-contoh.mp4` | Contoh hasil jadi. Tiru gerakannya, dan bisa dipakai sebagai portofolio |
| `Rekap-2026-panduan-slot.mp4` | Versi papan "SLOT 1–16" dengan jam di pojok. Taruh di CapCut sebagai patokan waktu |
| `stiker/01-2026.png` | Teks emas "2026" untuk intro |
| `stiker/02-tahun-ini-aku.png` | Teks di slot 1 |
| `stiker/03-bye-2026.png`, `04-hello-2027.png` | Teks penutup |
| `stiker/05-kilau.png`, `06-hati.png` | Kilauan dan hati untuk hiasan |
| `stiker/07-terima-kasih-2026.png` | Pengganti teks penutup (untuk varian) |
| `stiker/08-bingkai-film.png` | Bingkai film layar penuh untuk slot 14–15 |
| `contoh-foto/foto-01…16.jpg` | 16 foto contoh bebas hak cipta untuk mengisi template saat dibuat |

> Musik di video contoh adalah ketukan sintetis buatan sendiri, hanya untuk pratinjau.
> **Di CapCut, pakai lagu dari pustaka musik CapCut** (tempo ±120 BPM), supaya template tidak ditolak.

## Susunan waktu (final)

| Waktu (dtk) | Bagian | Slot | Efek |
|---|---|---|---|
| 0,0–2,0 | Intro | – (latar hitam) | Stiker `01-2026` animasi Pop + kilauan. Flash putih di 1,5 |
| 2,0–3,0 | Babak cepat | 1 | Stiker `02-tahun-ini-aku` animasi Ketik. Getar (shake) singkat |
| 3,0–7,0 | Babak cepat | 2–9 (0,5 dtk masing-masing) | Zoom pukul di tiap ketukan; getar di slot 4 & 7 |
| 7,0–8,5 | Build-up | 10 | Zoom makin cepat + getar makin kuat, layar memutih di akhir |
| 8,5–9,0 | Jeda | – | Layar putih (flash) |
| 9,0–14,0 | DROP | 11–13 (±1,67 dtk) | Gerak lambat (zoom pelan), transisi Zoom-in, kilauan, filter hangat |
| 14,0–16,0 | Kenangan | 14–15 (1 dtk) | Stiker `08-bingkai-film` + filter film/grain |
| 16,0–18,0 | Penutup | 16 | `bye 2026` (16,3) → `hello 2027` (17,1) → layar menggelap |

## Langkah di CapCut HP

1. **Proyek baru** → masukkan `foto-01` s.d. `foto-16` (urut) + 1 gambar hitam (atau klip hitam bawaan CapCut) di depan. Rasio **9:16**.
2. **Patokan waktu:** Overlay → tambah `Rekap-2026-panduan-slot.mp4`, regangkan penuh, lalu turunkan **Opasitas ±40%**. Sekarang kamu bisa lihat SLOT berapa harus ada di detik berapa. *(Hapus overlay ini sebelum publish.)*
3. **Musik:** Audio → pilih lagu tren ±120 BPM → **Ketukan → Otomatis**. Geser lagu supaya drop/reff jatuh di **detik 9**.
4. **Potong durasi** tiap foto sesuai tabel (tarik ujung klip sampai pas di titik ketukan).
5. **Stiker:** Overlay → tambah PNG dari folder `stiker/`, posisikan sesuai video contoh.
   - `01-2026`: Animasi → Masuk → **Pop/Zoom**
   - `02-tahun-ini-aku`: Animasi → Masuk → **Ketik/Wipe ke kanan**
   - `03-bye-2026` dan `04-hello-2027`: **Memudar masuk**
6. **Efek** (Efek → Efek video, taruh di lapisan efek, jangan ditempel ke foto): Flash di 1,5 dan 8,5; Shake di slot 1, 4, 7; Zoom/Shake makin kuat di slot 10; Kilau + gerak lambat di 9–14; Film/Grain di 14–16; Fade out di 17,5–18.
7. **Transisi** di antara slot 11–12–13: **Zoom in / Pull in** (durasi ±0,2 dtk). Slot lain tanpa transisi (potong keras).
8. Putar 3–4 kali dan bandingkan dengan `Rekap-2026-contoh.mp4`. **Hapus overlay panduan slot**.

## Saat publish sebagai template

- Slot yang bisa diganti: **centang 16 foto**. Latar hitam intro **tidak**.
- Teks yang bisa diganti: tidak ada (semua stiker gambar). Kalau mau teks bisa diganti, ketik ulang "tahun ini aku…" pakai **Teks** CapCut, bukan stiker.
- Izinkan **foto & video**.
- Judul: `Rekap 2026 ✨ 16 foto`
- Tag: `rekap 2026, recap 2026, tahun ini, year end, 2026 moments, dump 2026`
- Sampul: frame di detik ±9–10 (awal drop).

## Varian cepat (duplikat proyek)

- **8 foto:** slot 2–9 dikurangi jadi 4 (masing-masing 1 dtk).
- **Terima kasih 2026:** ganti `03-bye-2026` dengan `07-terima-kasih-2026`.
- **Bestie/pasangan:** tambah `06-hati` di slot 16.

## Membuat ulang file (untuk pengembang)

Dari root repo:
```
node template-capcut/rekap-2026/buat-stiker.mjs        # stiker
node template-capcut/rekap-2026/render.mjs foto         # foto contoh
FRAMES=/tmp/fc node template-capcut/rekap-2026/render.mjs contoh   # lalu gabung frame dengan ffmpeg
python3 template-capcut/rekap-2026/musik.py musik.wav
```
