# Malam Komedi: catatan proyek untuk Claude

Repo ini milik kreator konten **Malam Komedi**, berisi sketsa komedi kartun Indonesia untuk YouTube Shorts, TikTok, dan Facebook.
Isi repo: naskah (`naskah/`), video jadi (`video/`), kode animasi (`engine/`), dan website (`site/`).

## Cara menjawab pengguna

- Bahasa Indonesia santai dan sederhana. Pengguna sedang belajar coding dari nol.
- Mulai dengan **satu rekomendasi terbaik**, lalu alasannya dalam 1–2 kalimat. Beri maksimal 3 opsi dan tandai yang paling disarankan.
- Beri langkah konkret. Bilang terus terang kalau ada risiko. Kalau permintaannya kurang jelas, tanya satu pertanyaan singkat dulu.
- Jangan meng-upload ke YouTube, TikTok, atau Facebook. Upload selalu dilakukan pengguna sendiri.

## Aturan konten (wajib)

- **Politik:** tanpa nama, wajah, atau karikatur tokoh asli. Pakai negara atau tokoh fiktif, dan caption "Konten satire/komedi". Data channel menunjukkan video politik sepi penonton, jadi lebih baik dihindari.
- **Caption setiap video:** "Konten komedi. Semua tokoh fiktif."
- **Video Lagu Kartini** jangan di-upload tanpa izin Dodit Mulyanto.
- **Kloning suara** hanya dengan persetujuan. Jangan meniru materi komedian lain.
- **Tragedi** (kecelakaan, kematian, KDRT) tidak dijadikan bahan lelucon.
- **Merek** (misalnya brownies tertentu, logo YouTube) jangan ditampilkan. Tombol subscribe dibuat generik.

## Menulis naskah komedi (wajib)

Setiap kali menulis naskah, ide, atau materi komedi, **ikuti `panduan/master-comedy-writer.md`**. Ringkasannya:
- **Rumus:** SETUP → EXPECTATION → MISDIRECTION → PUNCHLINE → TAG.
- **Teknik humor:** observational, misunderstanding, exaggeration, irony, analogy, wordplay, callback, rule of three.
- **Struktur:** Hook (0–3 dtk) → Setup (3–10) → Build-up (10–20) → Punchline (20–30) → Tag/Callback (30–40) → Ending yang mudah diingat.
- **Format output naskah:**
  1. Judul
  2. Hook
  3. Naskah lengkap
  4. Punchline utama
  5. Tag
  6. Callback penutup
  7. Estimasi durasi
  8. Arahan intonasi & jeda
- **Gaya bahasa:** sehari-hari, santai, sedikit sarkastik, campuran gaya Jaksel dan humor lokal. Tapi **tetap pertahankan ciri tokoh tetap**: Asep logat Sunda yang polos, Pak Darman kolot, Ibu cerewet.
- **Aturan konten di atas tetap berlaku.** Panduan ini tidak membolehkan humor politik nyata, lelucon soal tragedi, atau merek.
- Durasi tetap mengikuti format video: cerita maksimal 52 detik.

## Kostum baru setiap video (wajib)

- Setiap video baru, buat **kostum baru yang cocok dengan cerita** untuk tokoh utama (minimal Asep) di `roman.js`, supaya penonton tidak bosan.
- Wajah, warna kulit, dan suara tokoh tetap sama. Kostum tidak boleh memakai logo atau merek asli.
- Jangan mengulang kostum dari 5 video terakhir. Daftar dan aturan lengkapnya ada di **`panduan/kostum.md`**, dan setiap kostum baru dicatat di sana.
- Saat mengusulkan naskah, sebutkan juga rencana kostumnya.

## Channel dan tren

- YouTube **@malamkomedi** (sekitar 100 subscriber per November 2026). Video terlaris: Handphone Baru (24 ribu) dan Diundang ke Nikahan Mantan (23 ribu). Keduanya bertema relate sehari-hari.
- Strategi: **seri dengan tokoh tetap**, tema relate dan lagi tren (cari lewat Firecrawl), upload 1 video per hari jam 18.00–21.00 WIB.
- Website **https://malam-komedi.vercel.app**: proyek Vercel `malam-komedi`, tim `team_vpElMlyQBcpuyBLecPx3Pkgj`, kode di `site/`. Terverifikasi di Google Search Console (tag meta di `site/index.html`, jangan dihapus). Gambar kartu diambil lewat jsDelivr dari repo ini.

## Tokoh tetap (outfit di `roman.js`, suara Speko/Gemini)

| Tokoh | Outfit | Suara | Ciri |
|---|---|---|---|
| Asep | `sarung` (peci); varian `asepKoki` (topi koki + celemek), `gunungA` (jaket) | **Achird** (mulai 16 Nov 2026; video lama pakai Fenrir). Instruksi: "Anak muda Indonesia logat Sunda, polos, sok pede, semangat, bicara cepat dan lucu" | anak muda, polos, sok pede |
| Pak Darman | `darman` (batik) | Charon | bapak kolot, salah paham bahasa gaul |
| Ibu (Bu Darman) | `tante` (kebaya pink); varian `ibuDaster`, `ibuPasar` (selendang batik) | Gacrux | cerewet, hemat |
| Ucup | `gunungU` (jaket merah) / `teman` | Puck | teman Asep, penakut |
| Pocong | FX `fxPocong` (bukan outfit) | Algenib + efek gema | sopan, followers sejuta, selalu butuh colokan |
| Mang Ujang | `ujang` (celemek, handuk di leher) | Umbriel | pedagang cabai yang santai |
| Adik bayi | `bayi` (s 0.5) | (tidak bicara) | |

**Speko TTS:** `voice` sesuai tabel, `intent:{language:'id',optimizeFor:'accuracy'}`, `constraints:{allowedProviders:{tts:['google-tts:gemini-3.8-flash-lite-tts']}}`, plus `instructions` untuk gaya bicara.
Hasilnya tersimpan di file tool-result. Ambil audionya dengan `json.loads(json.load(f)[1]['text'])['audio_base64']` (WAV 24 kHz).

## Gaya video standar (terbaru)

- **Durasi cerita maksimal 52 detik**, lalu tempel `video/Akhiran-YouTube-Asep.mp4` (5,9 detik) supaya total di bawah 60 detik. Versi siap upload diberi nama `*-YT.mp4`.
- **Tempo cepat:** `atempo=1.12`, jeda antar kalimat 0,15–0,3 detik, ganti adegan di setiap kalimat, kamera zoom (kick) di punchline.
- **Telop gaya "game-show"** (dari plugin lemo-opuscar), digambar di **overlay layar** (`overlayAt` di story, setelah efek lensa) supaya tajam:
  - papan subtitle berwarna per tokoh dengan label nama, kata aktif kuning (`fxTelop`, y≈1300–1430)
  - kata kunci dengan ledakan bintang (`fxJudge`)
  - banner (`fxBanner`)
  - kartu pembuka dan penutup (`fxRoundCard`)
  - font Fredoka (`web/fonts`)
- **Sinematik:** kamera rendah, close-up, *over-the-shoulder*, DOF kuat (`cinf` 8 di close-up), cahaya hangat, tekstur dari `web/tex` (dibuat oleh `scripts/buat-tekstur.py`).
- **Cara berjalan (standar baru, mulai 17 Nov 2026):** kalau tokoh berjalan, jangan pakai `step` lagi, karena tokoh jadi terlihat meluncur. Pakai siklus jalan baru:
  - **Opsi tokoh:** `walk: (f / C) % 1` (C sekitar 24–32 frame per siklus; Asep cepat sekitar 24, Pak Darman lambat sekitar 34), `L: 'swing', R: 'swing'`, `facing` sesuai arah jalan.
  - **Gerak badan:** `bob: 0.022 * (0.5 - 0.5 * cos(4π·walk))`, dan `headTilt` sedikit terlambat dari badan.
  - **Hasilnya:** kaki yang menapak lurus, kaki yang terangkat menekuk ke luar, kaki tidak menyilang, dan tangan berayun.
  - **Contoh:** `engine/story-tes-jalan.js`.
  - **Efek volume 2.5D (`vol: 1`) tidak dipakai.** Pengguna memilih tampilan lama.
- **Bayangan tegas (gaya Sci-Fi Sitcom, mulai 17 Nov 2026):** bayangan pada tokoh dibuat tegas, tanpa gradasi. Fitur ini **aktif otomatis** di `roman.js` (`opts.flat` bawaan 1; isi `flat: 0` kalau ingin gradasi lama).
  - **Garis bergetar (`boil`) tidak dipakai**, karena menurut pengguna terasa aneh.
- **Audio:** musik dan SFX sintetis di `audio.py`. `mix.py` menjaga musik di -6 dB terhadap suara, dan puncak SFX ≤ 0,7× puncak suara. Kalau SFX terlalu pelan, cari puncaknya lalu kecilkan bunyi yang paling keras.

## Cara membuat video (pipeline)

Folder kerja `/home/user/shorts/` ada di server sementara dan **tidak ikut tersimpan**. Template lengkapnya ada di `engine/pipeline-template/`.

1. `cp -r engine/pipeline-template /home/user/shorts/<proyek>` lalu `cd` ke sana. Playwright sudah terpasang; kalau `import 'playwright'` gagal, jalankan `ln -s "$(npm root -g)" node_modules`.
2. Buat suara per kalimat dengan Speko, simpan ke `lines/lNN.wav`, lalu `ffmpeg -af atempo=1.12` ke `fast/`.
3. Edit `assemble.py` (`spk`, `gap_after`, jumlah kalimat), lalu `python3 assemble.py`. Hasilnya `orig.wav` dan daftar `LINES` (frame mulai dan akhir tiap kalimat).
4. `ffmpeg -i orig.wav -ar 48000 voice_full.wav` lalu `python3 tools/lips.py voice_full.wav TOTAL > web/lips.js`.
5. Tulis `web/story_main.js`. Contoh terbaru ada di `engine/story-live.js`, `story-brownies.js`, dan `story-cabai.js`.
   - Latar yang tersedia di `main.js` (posisi x): panggung 0, kamar/ruang tengah -40, rumah No. 17 240, pos ronda 120, pantai 200, gunung 320, pasar 400, dapur 480, gedung pernikahan 40, terminal bandara 560 (baru).
6. Setiap kali mengubah `toonbase.js`, `roman.js`, atau `zfx.js`, jalankan `cat toonbase.js roman.js zfx.js > toon.js` di `web/`. Nama fungsi FX tidak boleh bentrok dengan yang sudah ada.
7. Tes beberapa gambar dulu: `node render.mjs test "60,300,..."`, lalu buat tile dengan ffmpeg dan lihat hasilnya.
8. Render penuh di latar belakang (3 proses): `node render.mjs frames "0-N"`. Waktunya sekitar 4 detik per gambar, jadi 50 detik video ±35 menit.
9. `python3 audio.py && python3 mix.py voice_full.wav music.wav sfx.wav --out mix_raw.wav && bash finish.sh "Judul"`. Cek QA: tidak ada black/freeze, dan loudness sekitar -14 LUFS.
10. Tempel akhiran: `ffmpeg -i video.mp4 -i video/Akhiran-YouTube-Asep.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" ...` ke `video/<Judul>-YT.mp4`.
11. Commit dan push ke branch kerja, lalu kirim file ke pengguna dengan SendUserFile.

## Status per 17 November 2026

- **Data channel (28 hari):** 73,5 ribu penayangan, 73,5% penonton tetap menonton, 120 subscriber. Jam tonton video panjang masih 0.
- **Siap upload (13 video `*-YT.mp4`):**
  - HP Baru Gaptek 2 (lanjutan video terlaris, upload duluan)
  - Ibu Ngambek Dibonceng
  - Parkir Rp35 Ribu
  - Asep Kuis Satu Miliar
  - Asep Galau Dijogetin (lagu dengan izin, tulis kredit di deskripsi)
  - Cabai Rp80 Ribu
  - Brownies Viral
  - Asep & Ucup Naik Gunung v3
  - Ibu Live Jualan
  - Adik Nggak Mau Tidur
  - Sep Angkat Jemuran
  - Bahasa Gaul #1
- **Gaya terbaru:**
  - **Kartu teks kecil di atas layar:** banner y≈165 dengan skala 1.3, judge y≈200 dengan skala 0.92, kartu pembuka dan penutup y≈300 dengan skala 1.2.
  - **Subtitle:** y≈1540–1560 dengan skala 1.2, supaya wajah tokoh tidak tertutup.
  - **Contoh terbaru:** `engine/story-ngambek.js`, `story-hpai.js`, dan `story-parkir.js`.
- **Ide berikutnya:**
  - "Diundang Mantan 2: Aqiqah Anaknya" (lanjutan video terlaris kedua)
  - "Ibu Checkout Promo 12.12" (upload awal Desember)
  - kompilasi panjang 8–10 menit untuk jam tonton (tanpa render, cukup gabungkan video yang ada)
  - video panjang "Pak Darman vs Asisten AI", dikerjakan per babak
- **Pengguna sedang fokus ke Shorts.** Pengguna khawatir token habis kalau render terlalu lama, jadi pekerjaan panjang dikerjakan per bagian dan setiap bagian langsung di-commit.
