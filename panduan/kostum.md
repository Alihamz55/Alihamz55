# Aturan kostum: ganti kostum di setiap video baru

**Tujuan:** penonton tidak bosan. Setiap video baru, tokoh utama memakai kostum yang **baru dan cocok dengan cerita**.

## Aturan

1. **Setiap video baru, buat minimal 1 outfit baru** di `engine/pipeline-template/web/roman.js` (objek `OUTFITS`) untuk tokoh utama, biasanya Asep, dan kalau bisa juga untuk tokoh kedua.
   - Nama outfit: `<tokoh><Tema>`, misalnya `asepKuis` atau `darmanHost`.
   - Setelah menambah outfit, jalankan `cat toonbase.js roman.js zfx.js > toon.js`.
2. **Kostum harus nyambung dengan cerita**, misalnya:
   - kuis → jas
   - pantai → kemeja bunga
   - ronda → jaket dan sarung
   - kondangan → batik
   - olahraga → kaos dan ikat kepala
3. **Ciri wajah dan identitas tidak boleh berubah.** Bentuk kepala, warna kulit, wajah, dan suara tetap sama, supaya penonton langsung mengenali tokohnya. Peci Asep boleh diganti topi yang cocok dengan tema.
4. **Jangan mengulang kostum** yang dipakai dalam 5 video terakhir. Cek dulu daftar di bawah.
5. **Tanpa logo atau merek asli** di kostum, misalnya klub bola, merek baju, atau logo acara TV.
6. **Catat** setiap kostum baru di daftar di bawah, lalu commit.

## Daftar kostum yang sudah dipakai (terbaru di atas)

| Video | Asep | Pak Darman | Ibu | Lainnya |
|---|---|---|---|---|
| Kuis Satu Miliar | `sarung` | `darman` | `ibuDaster` | |
| Galau Dijogetin | `sarung` | `darman` | `ibuDaster` | |
| Ibu Live Jualan | `sarung` | | `ibuDaster` | Pocong |
| Brownies Viral | `asepKoki` | `darman` | `ibuDaster` | |
| Cabai Rp80 Ribu | | | `ibuPasar` | `ujang` |
| Naik Gunung v3 | `gunungA` | | | Ucup `gunungU` |
| Adik Nggak Mau Tidur | `sarung` | `darman` | `tante` | `bayi` |

> `sarung` dan `darman` sudah terlalu sering dipakai. **Video berikutnya wajib pakai kostum baru** untuk Asep dan Pak Darman.

## Outfit yang sudah ada di `roman.js` (bisa jadi dasar varian baru)

`civA civB civC workA workB komik handuk rapi batik batikRun pengantin tante istri pejuang kartini bayi galau santai zainuddin santaiSweat hrd genit bule darman flanel sarung gunungA gunungU ujang ibuPasar asepKoki ibuDaster teman`
