# Video 3D Shorts — Three.js + Remotion

Template untuk bikin video animasi 3D vertikal (1080x1920, 9:16) buat YouTube Shorts, TikTok, dan Facebook Reels.

- **Three.js** (lewat `@react-three/fiber` + `@remotion/three`) → animasi 3D
- **Remotion** → caption ala TikTok, audio, dan render jadi MP4

## Cara pakai (langkah demi langkah)

1. Install [Node.js](https://nodejs.org) (versi 18 ke atas).
2. Di folder ini, jalankan:
   ```bash
   npm install
   ```
3. Buka editor preview (muncul di browser, bisa diputar seperti video):
   ```bash
   npm run dev
   ```
4. Render jadi file MP4 (hasilnya ada di `out/video.mp4`):
   ```bash
   npm run render
   ```
   Kalau muncul error `Error creating WebGL context`, pakai:
   ```bash
   npm run render -- --gl=swangle
   ```

## Mau ganti apa? Edit file ini

| Mau ganti...                        | Edit file                         |
|-------------------------------------|-----------------------------------|
| Bentuk/gerakan objek 3D             | `src/Scene.tsx`                   |
| Teks judul, warna, durasi video     | `src/Root.tsx`                    |
| Kata-kata caption + waktunya        | `public/captions.json`            |
| Gaya caption (warna, ukuran, posisi)| `src/Captions.tsx`                |
| Musik latar                         | ganti file `public/musik.mp3`     |
| Voiceover                           | taruh `public/voiceover.mp3`, lalu buka komentar di `src/Video3D.tsx` |

## Format caption

`public/captions.json` berisi daftar kata. Waktu pakai milidetik (1000 = 1 detik).
Kata selain kata pertama diawali spasi:

```json
{ "text": " semua!", "startMs": 900, "endMs": 1500, "timestampMs": 1200, "confidence": 1 }
```

Kata yang sedang diucapkan otomatis berwarna kuning.

## Aturan penting

Untuk animasi 3D, selalu pakai `useCurrentFrame()` dari Remotion.
**Jangan** pakai `useFrame()` dari react-three-fiber, karena hasil render bisa patah-patah atau tidak sinkron.

## Seri "Jaksel vs Bahasa Daerah"

Karakter dan tampilan sudah dibuat terpisah supaya bisa dipakai ulang di setiap episode:

| Bagian | File |
|---|---|
| Karakter **Daeng** (topi fedora putih, kumis, baju pink, celemek merah) | `src/karakter/Daeng.tsx` |
| Karakter **Anak Jaksel** (stickman, topi + kacamata hitam, syal kuning, sneakers) | `src/karakter/Jaksel.tsx` |
| Papan nama, balon dialog komik, tanda kaget kuning | `src/shared/Komik.tsx` |
| Font (Lilita One + Permanent Marker) | `src/shared/font.ts` |
| Template judul episode (pembukaan) | `src/shared/JudulEpisode.tsx` |

Contoh pemakaian di episode baru:

```tsx
<Daeng posisi={[-1.35, 0, -0.95]} bicaraSejak={null} />
<Jaksel posisi={[1.35, 0, 0.45]} bicaraSejak={frameMulaiBicara} />
```

`bicaraSejak` = frame saat karakter mulai bicara (mulut bergerak + tanda kaget muncul), atau `null` kalau diam.

### Bikin episode baru (misal episode 13)
1. Salin folder `src/ep12` jadi `src/ep13`.
2. Ubah naskah di `src/ep13/naskah.ts`. Untuk judul, cukup ganti satu baris di `src/ep13/Overlay.tsx`:
   ```tsx
   <JudulSeriJaksel episode={13} bahasa="Sunda" durasi={INTRO_DETIK * FPS} />
   ```
   Mau judul dengan susunan lain? Rakit sendiri dari potongan `JudulEpisode`:
   ```tsx
   <JudulEpisode.Root durasi={90}>
     <JudulEpisode.Lencana>SPESIAL LEBARAN</JudulEpisode.Lencana>
     <JudulEpisode.Judul>
       <JudulEpisode.Seru />
       <JudulEpisode.Baris>JAKSEL</JudulEpisode.Baris>
       <JudulEpisode.BarisSorot>MUDIK!</JudulEpisode.BarisSorot>
     </JudulEpisode.Judul>
   </JudulEpisode.Root>
   ```
3. Daftarkan di `src/Root.tsx` (salin blok `<Composition id="Episode12" ...>` lalu ganti jadi 13).
4. Render: `npx remotion render Episode13 out/episode13.mp4`

## Video "Doa di Panggung" (karakter hijab pink + lagu)

Komposisi `DoaPanggung`: gambar karakter dianimasikan (napas/goyang halus, kamera pelan mendekat ke wajah),
**mulut bergerak mengikuti suara vokal lagu**, sorot lampu dan partikel cahaya berdenyut mengikuti musik,
dan efek air mata mengalir di pipi.

| Mau ganti... | Edit file |
|---|---|
| Bagian puncak lagu (air mata lebih deras, cahaya lebih terang) | `puncak` di `src/doa/lagu.ts` |
| Posisi & besar gerak mulut | bagian `GERAK MULUT` di `src/doa/Panggung.tsx` |
| Posisi jalur air mata | `JALUR_KIRI` / `JALUR_KANAN` di `src/doa/AirMata.tsx` |
| Karakter (perempuan / laki-laki / tambah baru) | `src/doa/karakter.ts` + gambar di `public/doa/` (ukuran 941x1672) |

### Ganti lagu
Gerak mulut dibaca dari file `src/doa/mulut.json` (1 angka per frame, 0 = tertutup, 1 = terbuka lebar).
Kalau lagunya diganti, buat ulang file itu:

```bash
cp lagu-baru.mp3 public/doa/lagu.mp3
python3 scripts/buat-gerak-mulut.py public/doa/lagu.mp3 src/doa/mulut.json
```
lalu ubah `DURASI_DETIK` di `src/doa/lagu.ts`.

Render karakter perempuan: `npm run render:doa` → `out/doa-panggung.mp4`
Render karakter laki-laki: `npm run render:doa-laki` → `out/doa-panggung-laki.mp4`

## Hari Ayah Nasional — elemen untuk template CapCut (#HariAyah2026)

3 klip vertikal (1080x1920) di `src/ayah/HariAyah.tsx`, render sekaligus dengan `npm run render:ayah`:

| Klip | File hasil | Cara pakai di CapCut |
|---|---|---|
| Pembuka "Untuk Ayah, dengan Cinta" (4 detik) | `out/ayah-1-pembuka.mp4` | Taruh paling depan di timeline |
| Bingkai + label DULU / SEKARANG (6 detik, latar hijau) | `out/ayah-2-dulu-sekarang.mp4` | Overlay di atas 2 foto → Hapus latar → **Chroma key** → pilih warna hijau |
| Penutup "Terima kasih, Ayah" + #HariAyah2026 (4 detik) | `out/ayah-3-penutup.mp4` | Taruh paling belakang |

Ganti teks lewat `defaultProps` di `src/Root.tsx` (contoh: `labelDulu: "TAHUN 2005"`), atau panel kanan saat `npm run dev`.

## Stickman Duel (animasi kung fu 2D)

Komposisi `StickmanDuel` (8,7 detik): kuda-kuda → tangkisan → 12x pukulan beruntun → pukulan pamungkas slow-motion → K.O.
Render: `npm run render:duel` → `out/stickman-duel.mp4`. Tambahkan musik & efek suara (whoosh, pukulan) di CapCut.

| Mau ganti... | Edit |
|---|---|
| Pose (sudut tangan/kaki) | konstanta `KUDA_KUDA`, `PUKUL_A`, dst. di `src/stickman/Duel.tsx` |
| Urutan & waktu gerakan | `kunciJagoan` / `kunciLawan` (daftar `[frame, pose]`) di file yang sama |
| Jumlah pukulan beruntun | `JUMLAH_PUKULAN` |
| Sistem pose & gambar stickman | `src/stickman/Stickman.tsx` |

### Stickman 1 VS 4 (pertarungan cepat + slow-motion + efek suara)

Komposisi `StickmanKeroyok` (12,6 detik): 3 lawan + 1 bos menyerang bergantian dari kanan & kiri.
Setiap pukulan pamungkas memakai slow-motion, zoom kamera, kilatan putih, dan dentuman.
Render: `npm run render:keroyok` → `out/stickman-1vs4.mp4` (sudah ada suaranya).

| Mau ganti... | Edit di `src/stickman/Keroyok.tsx` |
|---|---|
| Bagian mana yang slow-motion & seberapa lambat | `LAMBAT` (`[mulai, akhir, kecepatan]`, 0.25 = 4x lebih lambat) |
| Gerakan jagoan / lawan | `kunciJagoan` / `MUSUH` |
| Teks POW!/WHAM!/BOOM! | `PUKULAN_BESAR` |

Efek suara (whoosh, pukul, dentum, slowmo, gong) dibuat dari nol oleh `python3 scripts/buat-efek-suara.py`
dan disimpan di `public/sfx/` — bebas hak cipta.

## Efek Droste / Mise en abyme (gambar di dalam gambar, tanpa ujung)

Komposisi `Droste` (6 detik, 3 putaran yang menyambung mulus): foto memuat dirinya sendiri di dalam bingkai,
kamera terus masuk ke bingkai sambil sedikit berputar.

1. Taruh foto di folder `public/` (contoh `public/foto-ayah.jpg`).
2. Ubah `defaultProps` komposisi `Droste` di `src/Root.tsx`:
   - `gambar`: nama file foto
   - `pusatX` / `pusatY`: letak bingkai dalam (0–1). Taruh di bagian yang **tidak menutupi wajah**, misalnya tangan atau badan.
   - `rasio`: besar bingkai dalam (0.35–0.65), `putar`: 0 = lurus, 10–20 = spiral
3. Render: `npx remotion render Droste out/droste.mp4`

`BingkaiDroste` = bingkai putih PNG transparan untuk merakit efek ini manual di CapCut:
`npx remotion still BingkaiDroste out/bingkai-droste.png --image-format=png`
