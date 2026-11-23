# Template "Lirik Simple": gaya pemutar musik (CapCut HP)

1 slot foto/video · ±15 detik · lirik muncul kata per kata

## Isi paket

| File | Fungsi |
|---|---|
| `Lirik-Simple-contoh.mp4` | Contoh hasil jadi (lirik & musik contoh buatan sendiri) |
| `overlay/01-kartu-pemutar.png` | Kartu pemutar musik di bawah (tanpa logo aplikasi apa pun) |
| `overlay/02-gradasi-baca.png` | Bayangan halus supaya lirik selalu terbaca di foto terang |
| `overlay/03-label-diputar.png` | Tulisan kecil "♪ SEDANG DIPUTAR ♪" di atas |
| `overlay/04-bingkai-polaroid.png` | Untuk varian estetik (foto dalam polaroid) |
| `overlay/05-garis-progres-15dtk.mp4` | Garis progres + waktu 0:00→0:15 yang berjalan, latar hitam |

## Susunan

| Waktu | Isi |
|---|---|
| 0,0–0,4 | Fade dari hitam |
| 0,6–4,0 | Lirik baris 1 |
| 4,1–7,5 | Lirik baris 2 |
| 7,6–11,0 | Lirik baris 3 |
| 11,1–14,6 | Lirik baris 4 |
| 14,5–15,0 | Fade ke hitam |

Sepanjang video: foto latar membesar pelan (zoom 104% → 114%).

## Langkah di CapCut HP

1. **Proyek baru** → 1 foto/video (contoh: `rekap-2026/contoh-foto/foto-01.jpg`) → rasio **9:16** → durasi **15 dtk**.
2. **Zoom pelan:** pilih klip → **Animasi → Kombo/Masuk → "Zoom in pelan"**, atau pakai **Keyframe**: di detik 0 skala 104%, di detik 15 skala 114%.
3. **Overlay** (urutan dari bawah ke atas): `02-gradasi-baca` → `03-label-diputar` → `01-kartu-pemutar`. Regangkan masing-masing sampai penuh layar, durasi 15 dtk.
4. **Garis progres:** Overlay → `05-garis-progres-15dtk.mp4`, regangkan penuh → **Campuran (Blend) → Layar (Screen)**. Latar hitamnya hilang dan tinggal garis putih yang berjalan.
5. **Judul & penyanyi:** **Teks** biasa (bukan gambar, supaya pengguna bisa ganti):
   - Judul: tebal, putih, ±ukuran 9, di kanan kotak foto kecil
   - Penyanyi: biasa, putih 70%, sedikit lebih kecil, di bawah judul
6. **Musik:** Audio → pustaka CapCut → pilih lagu → potong bagian reff ±15 dtk.
7. **Lirik:** pilih salah satu:
   - **Otomatis (disarankan):** **Teks → Lirik otomatis (Auto lyrics)**. CapCut mengenali lirik lagu dan menyamakan waktunya sendiri.
   - **Manual:** Teks → tambah satu teks per baris, durasi sesuai tabel.
   Gaya teks: font bulat tebal, putih, **bayangan/glow** lembut, di tengah layar (±45% dari atas).
   Animasi: **Masuk → "Ketik"/"Muncul per kata"**, atau pilih efek teks **karaoke** supaya kata yang dinyanyikan berubah warna (kuning muda `#FFE9A8`).
8. Fade: klip foto → Animasi → Masuk "Memudar" 0,4 dtk, Keluar "Memudar" 0,5 dtk.

## Saat publish sebagai template

- Slot yang bisa diganti: **foto latar** (izinkan foto & video).
- Teks yang bisa diganti: **judul, penyanyi** (lirik biarkan terkunci kalau memakai lirik otomatis).
- Judul template: `Lirik estetik ✨ 1 foto` atau `[judul lagu] lirik`
- Tag: `lirik, lyrics, lirik estetik, lagu viral, 1 foto, now playing`
- Sampul: frame saat lirik baris kedua tampil.

## Varian cepat

- **Polaroid:** tambah `04-bingkai-polaroid`, kecilkan foto supaya pas di dalam bingkai, latar diberi blur (Kanvas → Blur).
- **3 foto:** ganti foto setiap ganti baris lirik (slot 1: 0–4, slot 2: 4–7,5, slot 3: 7,5–11, slot 4: 11–15).
- **Tanpa kartu:** hapus `01-kartu-pemutar` dan `05-garis-progres` untuk gaya paling minimal.

## ⚠️ Hak cipta

- Pakai **lagu dari pustaka musik CapCut** saja.
- Lirik di video contoh ditulis sendiri. Untuk template, lirik mengikuti lagu yang kamu pilih dari CapCut (paling aman lewat fitur lirik otomatis).

## Membuat ulang file (pengembang)

```
node template-capcut/lirik-simple/buat-overlay.mjs
FRAMES=/tmp/lc node template-capcut/lirik-simple/render.mjs contoh    # lalu gabung frame dengan ffmpeg
FRAMES=/tmp/lp node template-capcut/lirik-simple/render.mjs progres
python3 template-capcut/lirik-simple/musik.py musik.wav
```
