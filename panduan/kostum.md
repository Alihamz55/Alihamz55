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
| Akhiran YouTube baru (`Akhiran-YouTube-Asep-Host.mp4`) | `asepHost` (jas ungu, dasi merah, peci) **baru**, khusus akhiran | | | |
| Keluarga Joget (tren dansa) | `asepJoget` (jaket cokelat, celana olive, kacamata hitam) **baru** | `darmanJoget` (kaos hitam, celana putih, kacamata hitam) **baru** | `ibuJoget` (sweater krem, celana jeans) **baru** | Neng (pacar Asep) `nengJoget` **tokoh baru** (kaos hitam, celana putih, bando pink), tidak bicara |
| Bule Belajar Bahasa Gaul | `asepPemandu` (rompi pemandu, topi rimba) **baru** | `darmanPantai` (kemeja bunga biru) **baru** | `ibuPantai` (daster kuning bunga) **baru** | Mister Mike `buleTuris` **tokoh baru**, suara Iapetus logat Inggris |
| Akali Bagasi | `asepMudik` lalu `asepLapis` (7 lapis jaket, gemuk) **baru** | `darmanPetugas` (petugas bandara) **baru** | `ibuKardigan asepPemandu buleTuris darmanPantai ibuPantai` (gamis marun, kardigan krem) **baru** | |
| Promo 12.12 | `asepKurir asepMudik asepLapis darmanPetugas ibuKardigan asepPemandu buleTuris darmanPantai ibuPantai` (jaket hijau tua, topi kuning, tas selempang) **baru** | `darmanSantai` (singlet, celana pendek) **baru** | `ibuMasker` (daster oranye, masker wajah hijau) **baru** | |
| Diundang Mantan 2 (Aqiqah) | `asepJas` (jas biru tua, dasi merah, tanpa peci) **baru** | `darmanBatikUngu` **baru** | `ibuKebayaHijau` **baru** | Rina (mantan) `rina` **tokoh baru**, suara Aoede |
| Ibu Ngambek Dibonceng | `asepMartabak asepJas darmanBatikUngu ibuKebayaHijau rina ibuMasker darmanSantai asepKurir asepMudik asepLapis darmanPetugas ibuKardigan asepPemandu buleTuris darmanPantai ibuPantai` (kaos merah, celemek, ikat kepala) **baru** | `darmanJeans` (jaket jeans, helm putih) **baru** | `ibuGamis` (gamis hijau, helm pink) **baru** | |
| HP Baru Gaptek 2 (Asisten AI) | `asepHoodie` (hoodie abu) **baru** | `darmanKoko` (koko putih, kacamata di dahi) **baru** | `ibuDasterUngu darmanJeans ibuGamis asepMartabak asepJas darmanBatikUngu ibuKebayaHijau rina ibuMasker darmanSantai asepKurir asepMudik asepLapis darmanPetugas ibuKardigan asepPemandu buleTuris darmanPantai ibuPantai` (daster ungu bunga) **baru** | |
| Parkir Rp35 Ribu | `asepParkir` (rompi oranye, topi pet, peluit) **baru** | `darmanMotor` (jaket kulit, helm merah) **baru** | | Mang Ujang `ujangGorengan darmanKoko asepHoodie ibuDasterUngu darmanJeans ibuGamis asepMartabak asepJas darmanBatikUngu ibuKebayaHijau rina ibuMasker darmanSantai asepKurir asepMudik asepLapis darmanPetugas ibuKardigan asepPemandu buleTuris darmanPantai ibuPantai` **baru** |
| Kuis Satu Miliar | `sarung` | `darman` | `ibuDaster` | |
| Galau Dijogetin | `sarung` | `darman` | `ibuDaster` | |
| Ibu Live Jualan | `sarung` | | `ibuDaster` | Pocong |
| Brownies Viral | `asepKoki` | `darman` | `ibuDaster` | |
| Cabai Rp80 Ribu | | | `ibuPasar` | `ujang` |
| Naik Gunung v3 | `gunungA` | | | Ucup `gunungU` |
| Adik Nggak Mau Tidur | `sarung` | `darman` | `tante` | `bayi` |

> `sarung` dan `darman` sudah terlalu sering dipakai. Hindari kedua kostum ini sampai 5 video ke depan.

**Pose tangan bebas:** `L`/`R` boleh berupa array `[sikuX, sikuY, tanganX, tanganY, depan?, 'f']` untuk gerakan joget (contoh `engine/story-joget.js`).

**Fitur aksesori baru di `roman.js`** (bisa dipakai di outfit lain): `vest` (rompi dengan garis reflektor), `zipJacket` (kerah dan resleting), `whistle` (peluit dengan tali), `motoHelm` (helm motor dengan warna sesuai isian), `koko` (kerah dan kancing koko), `hoodie` (tudung, tali, dan kantong), `floral` (motif bunga di baju), `shades` (kacamata hitam), `glassesUp` (kacamata di dahi), `headband` (ikat kepala satu warna), `tie` (dasi dan kerah jas), `faceMask` (masker wajah), `layers` (daftar warna jaket berlapis; gabungkan dengan `stout`).

**Properti tambahan:** `fxKardus(p, label, big)` (kardus paket polos dengan label tanpa merek), `fxKoper`, `fxNampan(p, n)`, `fxKelapa` (meja es kelapa).

**Latar baru:** terminal bandara di `main.js` (x=560), berisi meja check-in, timbangan, mesin pemeriksaan, gerbang detektor, dan kursi tunggu.

**Properti baru di `zfx.js`:** `fxSkuter(p, warna)`, `fxTiang`, `fxGerobak(p, label)`, `fxLampuJalan`. Contoh adegan naik motor ada di `engine/story-ngambek.js`: pengendara diletakkan di belakang skuter dengan skala 1.9, kamera ikut bergerak.

## Outfit yang sudah ada di `roman.js` (bisa jadi dasar varian baru)

`civA civB civC workA workB komik handuk rapi batik batikRun pengantin tante istri pejuang kartini bayi galau santai zainuddin santaiSweat hrd genit bule darman flanel sarung gunungA gunungU ujang ibuPasar asepKoki ibuDaster teman asepParkir darmanMotor ujangGorengan darmanKoko asepHoodie ibuDasterUngu darmanJeans ibuGamis asepMartabak asepJas darmanBatikUngu ibuKebayaHijau rina ibuMasker darmanSantai asepKurir asepMudik asepLapis darmanPetugas ibuKardigan asepPemandu buleTuris darmanPantai ibuPantai`
