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
