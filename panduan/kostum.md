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
| Doa Jomblo Malam Minggu | `asepNgapel` (batik navy motif emas, rambut klimis, bunga mawar) **baru** | | | Ucup `ucupJomblo` (kaos hitam, sarung diselempang, payung hijau) **baru** |
| Asep vs Tukang Bully | `asepRompi` (rompi cokelat berkancing, lengan kemeja putih) **baru** | | | Bang Jali `jali` (tokoh baru: jaket jeans, rambut jabrik, kalung rantai) **baru**, Ucup `ucupHijau` (kaos hijau) **baru** |
| Asep Kena Hihu Seharian | `asepTieDye` (kaos ungu motif oranye, celana training abu) **baru** | `darmanGaris` (kaos garis biru-putih, sarung abu) **baru** | `ibuBungaCoklat` (daster cokelat bunga kuning) **baru** | Ucup `ucupMerah` (kaos merah) **baru** |
| Asep Nabung Beli PS | `asepKolor` (kaos kuning, kolor merah, topi biru) **baru** | `darmanKalkulator` (kemeja kotak hijau, kacamata) **baru** | `ibuArisan` (gamis mustard, tas selempang) **baru** | Neng `nengOverall` (kaos putih, overall jeans, jepit pink) **baru** |
| Solo Gitar di Atas Genteng | `asepRocker` (jaket kulit hitam, bandana merah, kacamata hitam, gitar listrik merah polos) **baru** | `darmanHujan` (kaos krem, sarung biru, peci, payung) **baru** | `ibuEmber` (daster hijau, kerah putih, ember) **baru** | |
| Tebak-tebakan Pos Ronda | `asepParka` (parka hijau army, sarung ungu di leher) **baru** | | | Ucup `ucupHoodie` (hoodie kuning bertudung, senter) **baru**, Pocong (efek gema) |
| Begadang Nonton Bola | `asepJersey` (jersey hijau-putih garis polos, sarung di bahu, rambut acak) **baru** | `darmanJersey` (jersey merah polos, syal kuning) **baru** | `ibuRolUngu` (daster ungu muda, rol rambut pink) **baru** | |
| Asep Disuruh Daftar CPNS | `asepTesCPNS` (kemeja putih, celana hitam, rambut klimis) **baru** | `darmanKrem` (kaos krem, kacamata, map berkas) **baru** | `ibuMint` (daster mint, kerudung instan hijau) **baru** | |
| Asep Anak Jaksun (stand up) | `asepJaksel` (kemeja linen krem, chino hijau zaitun, kacamata bulat, tote bag "SLOW LIVING") **baru** | `darmanKotak` (kemeja kotak cokelat, di kursi penonton) **baru** | `ibuPenonton` (kerudung ungu, baju krem, di kursi penonton) **baru** | MC (suara saja) |
| Hidup Sekadar Hidup | `asepSenja` (flanel kotak abu, kupluk cokelat, "anak senja") **baru** | `darmanKaosAbu` (kaos abu, celana training biru, kacamata, koran) **baru** | `ibuKuning` (daster kuning, handuk kecil di bahu) **baru** | |
| Kuis Survei Keluarga | `asepTim` (kaos seragam hijau, ikat kepala merah) **baru** | `darmanTim` (kaos seragam hijau, kacamata) **baru** | `ibuTim` (seragam hijau, kebaya kuning) **baru** | Mang Ujang `ujangTim` & Ucup `ucupTim` (seragam oranye) **baru**, Host `hostKuis` (jas kuning, dasi merah, rambut klimis) **baru** |
| Wakil Presiden Rumah Tangga | `asepWapres` (jas hitam, dasi merah, peci, selempang merah) dan `asepPiyama` (piyama garis biru, rambut acak) **baru** | `darmanAjudan` (kemeja putih, topi, tali emas, bawa galon) **baru** | `ibuPresiden` (kebaya hijau tua, selempang putih, centong) **baru** | |
| Ibu Kecanduan Sinetron | `asepKaosMi` (kaos kuning polos, celana pendek biru) **baru** | `darmanSarungBiru` (kaos putih, sarung kotak biru, peci) **baru** | `ibuSinetron` (daster batik ungu tua, rambut dicepol, memeluk remote) **baru** | |
| Oyen Lepas di Pesawat | `asepTerbang` (jaket bomber hijau, bantal leher biru) **baru** | `darmanMudik` (batik biru, kacamata di dahi) **baru** | `ibuMudik` (gamis merah, kerudung kuning) **baru** | Pramugari `pramugari` (seragam biru tua, syal merah) **baru**, Pilot `pilot` (kemeja putih, dasi, topi) **baru**, kucing `fxOyen` |
| Asep Masuk Dunia GTB 6 (parodi) | `asepOpenWorld` (kemeja bunga merah, celana pendek krem, kacamata di dahi) **baru** | `darmanPolo` (polo kuning, topi hijau) **baru** | `ibuSapu` (daster ungu bunga kuning, sapu lidi) **baru** | Mang Ujang `ujangGorengan` |
| Asep Mau Dipindah dari Kamar Ujung | `asepKaosCula` (kaos abu sablon siluet cula, training biru) **baru** | `darmanKoran` (singlet, sarung hijau, kacamata) **baru** | `ibuHanduk` (daster toska, handuk di kepala) **baru** | Juragan Kilau `juragan` (helm proyek, rompi, kalung rantai) **tokoh fiktif baru**, suara Algieba |
| Asep Antre Jumat Berkah (gaya baru) | `asepKoko` (koko hijau muda, sarung kotak, peci) + penyamaran kacamata hitam / helm kurir / kumis + peci putih **baru** | `darmanPanitia` (rompi panitia oranye, peci putih) **baru** | `ibuCelemek` (gamis biru, kerudung krem, celemek bunga) **baru** | |
| Battle Gombal Asep vs Ucup | `asepKlimis` (kemeja batik biru, rambut klimis) **baru** | `darmanHansip` (jaket hansip hijau, peci) **baru** | | Ucup `ucupRonda` (flanel hijau, sarung selempang) **baru**; Neng `nengDress` (dress kuning, bando, earphone) **baru** |
| Asep Minta Wish Hujan Meteor | `asepKupluk` (kaos abu, sarung diselempangkan, kupluk rajut merah) **baru** | `darmanPiyama` (piyama garis biru, rambut berantakan) **baru** | `ibuMukena` (mukena putih) **baru** | Neng `nengBomber` (jaket bomber pink, syal putih) **baru** |
| Asep Maksain Game Berat (GTB 6) | `asepGamer` (kaos hitam garis hijau neon, headset di leher), lalu kribo + cemong (`afro`, `soot`) **baru** | `darmanSarung` (kaos oblong putih, sarung kotak cokelat, peci) **baru** | `ibuRoll` (daster oranye, roll rambut pink) **baru** | |
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

**Fitur aksesori baru di `roman.js`** (bisa dipakai di outfit lain): `vest` (rompi dengan garis reflektor), `zipJacket` (kerah dan resleting), `whistle` (peluit dengan tali), `motoHelm` (helm motor dengan warna sesuai isian), `koko` (kerah dan kancing koko), `hoodie` (tudung, tali, dan kantong), `floral` (motif bunga di baju), `shades` (kacamata hitam), `neon` (garis neon di kaos), `headset`, `rollers` (roll rambut), `beanie` (kupluk rajut + pompom), `scarf` (syal), `mukena` (kerudung mukena di sekeliling wajah), `earbuds` (earphone putih; opsi `noEar: 1` saat dilepas), `slick` (rambut klimis mengilap), `peciCol` (warna peci), `bib` (celemek bunga); ekspresi baru `smug` (senyum licik), `horn` (sablon cula), `chain` (kalung rantai), `turban` (handuk di kepala), `hardhat` (helm proyek); opsi tokoh `afro: 1` (rambut kribo habis ledakan) dan `soot: 1` (muka cemong), `glassesUp` (kacamata di dahi), `headband` (ikat kepala satu warna), `tie` (dasi dan kerah jas), `faceMask` (masker wajah), `layers` (daftar warna jaket berlapis; gabungkan dengan `stout`).

**Properti tambahan:** `fxHUD(g, stars, money, hp, t)` (HUD game parodi tanpa merek), `fxGagal`, `fxSapu`, `fxPiring`, `fxBerita` (layar berita HP), `fxKasur(p, rolled)`, `fxDetektor(p, t, on)`, `fxGameHP(p, mode, t, k)` (layar HP penuh: load/full/dl/lag/snake), `fxKulkas(p, open, smell, t)`, `fxKardus(p, label, big)` (kardus paket polos dengan label tanpa merek), `fxKoper`, `fxNampan(p, n)`, `fxKelapa` (meja es kelapa), `fxOyen(p, pose, t, dir)` (kucing oren gendut berkalung lonceng; pose `sit`, `run`, `smug`, `cap` topi pilot), `fxKokpit` (kartu latar kokpit pesawat), `fxKandang` (kandang kucing jumbo, digambar di depan tokoh), `fxTVSinetron(p, mode, t)` (TV + bufet; `drama` = sinetron fiktif "TERIKAT CICILAN" dengan siluet generik, `off`), `fxSofa(p, warna)`, `fxRemote`, `fxSpandukTeks(p, baris1, baris2, bg, fg)` (spanduk 2 baris, teks otomatis muat), `fxPodium(p, label)` (podium dengan lambang bintang fiktif + mic), `fxGalon`, `fxCentong`, `fxPapanSurvei(p, rows, rev, flash, t)` (papan jawaban kuis survei fiktif, baris bisa dibalik), `fxMejaTim(p, label, warna, lit)` (meja tim + tombol bel), `fxSilangBesar` (tanda X merah besar untuk jawaban salah), `fxDompet(p, buka, t)` (dompet kosong + ngengat terbang), `fxHPSaldo(p, t)` (layar saldo Rp12.500 tanpa merek bank), `fxKoran` (koran "HARGA CABAI NAIK LAGI"), `fxTote` (tote bag kanvas polos "SLOW LIVING"), `fxHPCpns(p, mode, t, k)` (layar HP pendaftaran CPNS generik: `buka`, `loading`, `foto` pas foto filter kucing + stempel DITOLAK, `formasi`), `fxMapBerkas` (map cokelat), `fxTVIklan(p, t)` (TV iklan kopi generik "GOOOL!"; pasangan `fxTV` bola BIRU vs MERAH), `fxSenter(p, rot, on)` (senter dengan sorot cahaya), `fxGitar(p, mode, t)` (gitar listrik merah polos: `play`/`hug`/`over`), `fxPayung`, `fxEmber`, `fxPisang(p, gosong, t)` (pohon pisang, bisa gosong berasap), `fxCelengan(p, state, t, label, k)` (celengan ayam: `utuh`/`slip` kertas utang masuk/`pecah`), `fxKalkulator(p, teks)`, `fxMejaRendang(p, kosong, t)` (meja makan + piring rendang beruap / kosong), `fxSendalBeda` (sendal jepit merah & biru), `fxEsTeh` (es teh plastik), `fxBunga(p, layu)` (buket mawar, bisa layu kena hujan).

**Berdiri di atas genteng rumah No. 17:** posisi `[240, 4.78, -2.25]` (lereng depan atap); kamera dari halaman menghadap ke atas. Contoh `engine/story-solo-genteng.js`. Hujan dan kilat digambar di overlay.

**Adegan penonton panggung (x=0):** tokoh yang duduk di barisan depan ditaruh di z≈2.45–2.5, `y: -0.32`, `s: 0.86`; kamera dari panggung menghadap +z (`aud()` di `engine/story-jaksun.js`). Penonton ikut bergoyang saat tawa lewat `worldAt(f).laugh`. Tawa penonton realistis: `crowd_laugh()` di `engine/audio-standup-jaksun.py`.

**Latar baru:** terminal bandara di `main.js` (x=560), berisi meja check-in, timbangan, mesin pemeriksaan, gerbang detektor, dan kursi tunggu. **Kabin pesawat** (x=660): lorong, 7 baris kursi biru, jendela, bagasi kabin, pintu KOKPIT, tanda kursi 17A; kamera dari depan menghadap +z supaya penumpang terlihat. **Kokpit** (x=680): lantai + dinding, dipakai bersama kartu `fxKokpit`.

**Properti baru di `zfx.js`:** `fxSkuter(p, warna)`, `fxTiang`, `fxGerobak(p, label)`, `fxLampuJalan`. Contoh adegan naik motor ada di `engine/story-ngambek.js`: pengendara diletakkan di belakang skuter dengan skala 1.9, kamera ikut bergerak.

## Outfit yang sudah ada di `roman.js` (bisa jadi dasar varian baru)

`civA civB civC workA workB komik handuk rapi batik batikRun pengantin tante istri pejuang kartini bayi galau santai zainuddin santaiSweat hrd genit bule darman flanel sarung gunungA gunungU ujang ibuPasar asepKoki ibuDaster teman asepParkir darmanMotor ujangGorengan darmanKoko asepHoodie ibuDasterUngu darmanJeans ibuGamis asepMartabak asepJas darmanBatikUngu ibuKebayaHijau rina ibuMasker darmanSantai asepKurir asepMudik asepLapis darmanPetugas ibuKardigan asepPemandu buleTuris darmanPantai ibuPantai`
