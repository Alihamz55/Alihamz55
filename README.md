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

Contoh pemakaian di episode baru:

```tsx
<Daeng posisi={[-1.35, 0, -0.95]} bicaraSejak={null} />
<Jaksel posisi={[1.35, 0, 0.45]} bicaraSejak={frameMulaiBicara} />
```

`bicaraSejak` = frame saat karakter mulai bicara (mulut bergerak + tanda kaget muncul), atau `null` kalau diam.

### Bikin episode baru (misal episode 13)
1. Salin folder `src/ep12` jadi `src/ep13`.
2. Ubah naskah di `src/ep13/naskah.ts` dan judul di `src/ep13/Overlay.tsx`.
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

## Video "Neon Streets" (G-Funk rap)

Video lirik 3D 16 detik: mobil lowrider melaju di kota neon malam hari, lirik hook muncul ikut ketukan 92 BPM.

| Mau ganti... | Edit file |
|---|---|
| Teks lirik + waktu muncul | `src/neon/lirik.ts` |
| Kota, mobil, warna neon | `src/neon/Kota.tsx` |
| Judul, font, efek VHS | `src/neon/NeonStreets.tsx` |

Render tanpa suara: `npm run render:neon`, hasilnya `out/neon-streets.mp4`.
Untuk menyertakan lagu, taruh file lagu di `public/neon/lagu.mp3`, lalu render dengan `npm run render:neon -- --props='{"pakaiLagu":true}'`.
