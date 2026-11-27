---
name: kotak-karakter
description: Membuat, mengubah, atau menggambar tokoh kartun 2D bergaya blok (kepala kotak, garis tebal, ekspresi lebay) untuk channel Kotak Kocak, memakai engine kanvas di engine/kotak2d/. Pakai saat diminta membuat tokoh baru, ekspresi baru, adegan atau gambar tes Kotak Kocak, lembar tokoh, atau thumbnail bergaya blok.
---

# Kotak Karakter: tokoh blok 2D untuk Kotak Kocak

Engine: `engine/kotak2d/kotak2d.js`, digambar dengan Canvas 2D ukuran 1080×1920. Render lewat Playwright.

## Render

```bash
cd engine/kotak2d
ln -sf "$(npm root -g)" node_modules   # sekali saja, kalau import playwright gagal
node render.mjs tokoh,ekspresi,a,b,c   # → tes-<nama>.png
```
Setelah render, gabungkan beberapa PNG dengan `ffmpeg ... hstack` lalu **lihat hasilnya** sebelum melapor. Gambar yang akan dikirim ke pengguna disalin ke `branding/kotak-kocak/`.

## Aturan gaya (wajib, supaya konsisten)

- **Garis tepi** `INK = #2a1f3d`, tebal 10 px pada skala 1. Semua bentuk diisi dengan `fs(warna)`.
- **Kepala** kotak membulat (radius 70), lebar 300 × tinggi 280 dikali `T[tokoh].W`. **Mata besar** (radius 46) dengan pupil dan titik kilau.
- **Bayangan datar:** `shade()` menggelapkan 28% sisi kanan kepala dan badan. Tidak ada gradasi di tokoh.
- **Alis digambar paling akhir** (`brows()` dengan halo warna kulit) supaya tidak tertutup rambut atau topi.
  Arah `brow: [kiri, kanan]`: angka **positif** = ujung dalam turun (galak/marah), **negatif** = ujung dalam naik (cemas/kaget).
- **Warna cerah dan jenuh**. Latar memakai gradasi langit, garis kecepatan (`speed()`), atau padang rumput blok.
- **Teks:** font Fredoka 700. `bigWord()` untuk kata kunci, `bubble()` untuk dialog (label nama + kata kuning), `narrTag()` untuk narasi.

## Tokoh tetap (`const T` + cabang `o.who` di `char()` dan `head()`)

| who | Tokoh | Ciri tetap (jangan diubah) |
|---|---|---|
| `bobi` | Bobi | kulit #e9b48a, kaos oranye bergaris krem, topi tosca terbalik dengan kancing kuning, rambut jabrik cokelat tua |
| `kubi` | Neng Kubi | kulit #f3c9a3, rambut kotak ungu #7a3fd1 dengan poni segitiga, jepit kuning, kaos pink + overall jeans |
| `blok` | Om Blok | badan lebar (W 1.25), kulit #c98b5a, kumis kotak, topi satpam biru tua dengan bintang, rompi kuning bergaris reflektor |
| — | Piko | `piko(x, y, s, flip)`: ayam kotak kuning, jengger merah, tidak bicara |

**Menambah tokoh baru:**
1. Tambahkan entri ke `T` (skin, pants, shoe, shirt, W).
2. Tambahkan motif badan di `char()` dan rambut atau topi di `head()` dengan `if (o.who === '<nama>')`.
3. Render `tokoh` untuk mengecek, lalu tambahkan tokohnya ke adegan `SCENES.tokoh`.
4. Catat di tabel ini dan di `panduan/channel-dunia-kotak.md`.

## Ekspresi (`face: {...}`)

| Nama | face |
|---|---|
| pede | `{ look: 6, brow: [-10, 10], mouth: 'grin' }` |
| senang | `{ eye: 'happy', brow: [6, 6], mouth: 'open', blush: true }` |
| kaget | `{ eye: 'tiny', brow: [-16, -16], mouth: 'shock' }` |
| mata bintang | `{ eye: 'star', brow: [10, 10], mouth: 'open' }` |
| nangis air mancur | `{ brow: [-18, -18], mouth: 'open', tears: true }` |
| panik | `{ eye: 'tiny', brow: [-16, -16], mouth: 'wavy', sweat: true }` |
| curiga | `{ look: 18, brow: [-12, 12], mouth: 'smirk' }` |
| pingsan | `{ eye: 'flat', brow: [0, 0], mouth: 'flat' }` |
| marah | `{ brow: [18, 18], mouth: 'wavy' }` |

Pilihan nilai:
- `eye`: `normal`, `tiny`, `happy`, `star`, `flat`
- `mouth`: `grin`, `open`, `shock`, `smirk`, `flat`, `wavy`
- tambahan: `look` (geser pupil), `blush`, `sweat`, `tears`

Ekspresi baru ditambahkan sebagai cabang baru di `eyes()` atau `mouth()`, lalu dimasukkan ke `SCENES.ekspresi`.

## Latar berwarna (aset Kenney, CC0)

Aset ada di `engine/kotak2d/assets/kenney/` (lisensi di `LICENSE-Kenney-CC0.txt`, bebas dipakai komersial; kredit "Kenney" di deskripsi video bersifat opsional tapi disarankan).
- `elemen/`: pohon, semak, rumah, pagar, awan, kaktus, kastil (PNG). Daftarkan namanya di `loadKenney()`, lalu gambar dengan `el(nama, x, yBawah, skala)`.
- `latar/` dan `latar-platformer/`: lapisan latar jadi. Warnanya pucat, cocok hanya untuk latar sangat jauh (`layer()`).
- `kampung(gy)`: latar kampung siap pakai (langit, matahari, awan, 2 bukit `hill()`, rumah, pohon, pagar, semak, rumput). Pakai ini sebagai contoh untuk membuat latar baru, misalnya pantai atau pasar.
- Unduh paket Kenney baru lewat Playwright (curl ditolak situsnya). Environment "Alihamz55" sudah mengizinkan kenney.nl.

## Membuat adegan

Tambahkan fungsi baru di `SCENES`, misalnya `SCENES.d = () => {...}`. Urutan menggambar:
1. latar (`sky`, `speed`, `ground`, `stairs`, `cloud`)
2. tokoh, mulai dari yang paling belakang
3. telop (`bigWord`, `bubble`, `narrTag`)

Bagian layar yang dipakai:
- teks besar di atas: y 150–350
- tokoh: y 500–1450
- subtitle: y ≈ 1540, supaya wajah tidak tertutup

Tokoh tiarap: `g.translate` lalu `g.rotate(-Math.PI/2)` sebelum `char()`. Close-up: `g.scale(1.75)` di sekitar titik kaki.

## Animasi dan akhiran channel

- **Struktur:** pustaka bersama `engine/kotak2d/anim-lib.js` (kamera, tokoh bergerak, gerak mulut, subtitle, teks pop) dan satu folder per episode (`ep01/`, `akhiran/`) berisi `story.js` (TEXT + SHOT) dan `data.js` (TIMING + LIPS).
- **Render:** `EP=<folder> node anim-render.mjs <mulai> <akhir> <audio.wav> <out.mp4>`, atau `... test "f1,f2"` untuk gambar tes. Render 52 detik butuh sekitar 1 menit.
- **Audio episode:** `audio/kotak-kocak-01/`: `assemble.py` (suara + SFX dasar), `musik.py` (musik + SFX), `../../engine/pipeline-template/mix.py`, lalu `lips.py` (gerak mulut).
- **Akhiran channel:** `video/Akhiran-Kotak-Kocak.mp4` (6,7 detik, Bobi mengajak subscribe, tombol generik tanpa logo platform). Tempel di akhir setiap episode dengan ffmpeg concat menjadi `*-YT.mp4`, dan pastikan totalnya di bawah 60 detik (episode maksimal sekitar 52 detik).

## Larangan (wajib)

- **Jangan meniru tokoh channel lain.** Contohnya anak berambut cokelat dengan baju oranye bergambar petir dari channel animasi game populer. Gaya umum boleh (kepala kotak, mata besar, ekspresi lebay), desain tokoh orang lain tidak.
- **Jangan pakai nama, logo, avatar, UI, atau bunyi khas game mana pun** ("Roblox", avatar "noob", bunyi "oof"), baik di gambar, teks, maupun judul.
- **Tanpa merek asli** di kostum atau properti.
- Semua aturan konten di `CLAUDE.md` tetap berlaku. Caption: "Konten komedi. Semua tokoh fiktif."
