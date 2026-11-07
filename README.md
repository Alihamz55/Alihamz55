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
