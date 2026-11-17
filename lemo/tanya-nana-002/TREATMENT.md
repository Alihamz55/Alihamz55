# TREATMENT — Tanya Nana #002: "Kenapa Sholat Menghadap Kiblat?"

Gaya: **3D Map Explainer** (Lemo-Opuscar). Format **1080×1920, 24 fps**, ±40 detik, Bahasa Indonesia.
Suara: Nana = Speko *Nina*; Kakak = Speko *Siti* (sama dengan #001). Subtitle dibakar ke gambar + `.srt`.

## Batasan produksi (dicatat jujur)
- **Tanpa citra satelit.** Host citra (EOX, NASA, Wikimedia) diblokir jaringan lingkungan ini, dan akses tambahan tidak disetujui.
  Daratan diwarnai satu warna netral hangat (bukan ramp warna), reliefnya dari **ketinggian asli** (AWS Terrain Tiles) dengan bayangan matahari rendah yang dipanggang;
  laut diwarnai menurut **kedalaman asli**. Garis pantai: Natural Earth (domain publik).
- **Tanpa musik melodis**, mengikuti episode #001. Lapisan suara: ambience + foley + narasi.
- **ffmpeg 7 tidak tersedia**, jadi `mux.sh` diganti mux sendiri (loudnorm dua tahap ke −14 LUFS dengan ffmpeg 6.1).
- **Aturan peta (DIRECTOR §13):** tanpa garis batas negara; bingkai kamera dijaga agar wilayah Tiongkok tidak masuk frame (dicek otomatis per frame kunci).

## 1. Tiga struktur kandidat
1. **Corong (funnel):** globe → Indonesia → Makkah → kembali ke globe. *Ditolak:* globe penuh pasti memuat Tiongkok (aturan peta), dan pembuka "dari luar angkasa" adalah klise gaya ini.
2. **Satu perjalanan sepanjang garis:** dari rumah Nana di Jakarta, garis kiblat menyala lurus ke Ka'bah. Lalu dari banyak kota dunia, garis-garis lain mengalir ke titik yang sama. *Dipilih:* sesuai pertanyaan anak ("ke mana aku menghadap?"), lalu membesar ke makna ("semua menghadap satu titik").
3. **Perbandingan:** arah kiblat dari Jakarta vs Kairo vs Nairobi, berdampingan. *Ditolak:* terlalu abstrak untuk anak 4–10 tahun.

## 2. Logline & arc
Nana bertanya kenapa sholat harus menghadap kiblat. Sebuah garis cahaya berangkat dari Indonesia dan menyala sepanjang hampir 8.000 km ke Ka'bah, lalu garis-garis dari seluruh dunia mengalir ke titik yang sama, sehingga satu arah sholat menjadi tanda kekompakan umat.
- **Setup:** titik kecil bercahaya di Jawa: "dari sini kita sholat".
- **Turn:** kamera naik dan memperlihatkan betapa jauhnya Ka'bah (7.917 km, barat laut).
- **Ending:** garis-garis dari banyak kota menyatu di Ka'bah. Ditutup dengan misi hari ini.

## 3. Benchmark (tata bahasa saja)
- **Pelajari:** penjelas peta 3D ala berita: satu titik → naik → rute menyala; ritme "satu informasi per gerakan kamera". Juga peta navigasi laut: penggaris jarak dan mawar kompas yang bersih.
- **Jangan ambil:** warna, ikon, font, jalur kamera, atau shot spesifik dari karya mana pun.

## 4. Shot list
| # | Waktu | Framing / sudut | Gerak kamera | Kenapa |
|---|---|---|---|---|
| 1 | 0–4.5 s | Close oblique rendah (pitch ~45°) di atas Jawa Barat, titik cahaya di Jakarta | Push pelan + drift | Hook: "rumah Nana" kecil & hangat; pertanyaan tampil besar |
| 2 | 4.5–11.5 s | Dari close ke wide region | **Crane naik** (jarak log), heading berputar sampai garis Jakarta→Makkah vertikal di frame | Memperlihatkan jarak; Ka'bah menyala (pin + ring) di atas |
| 3 | 11.5–18.5 s | Wide oblique menghadap rute | **Tracking** mengikuti kepala garis yang menyala | *Native move:* garis menyala sepanjang lintasan aslinya (great circle) |
| 4 | 18.5–22 s | Near-locked oblique | **Hold + drift**, penggaris & kompas | Membaca angka: 7.917 km, arah 295° barat laut |
| 5 | 22–30 s | Wide region berpusat Makkah | **Pull-out besar** lalu **orbit pelan** | *Signature:* garis dari 6 kota mengalir ke Ka'bah |
| 6 | 30–33 s | Medium oblique di Makkah | **Push in** | Reaksi Nana: "kompak!" |
| 7 | 33–41 s | Medium tinggi, garis tetap berdenyut | **Crane up + hold** | Kartu misi & teaser besok di langit/laut kosong |

Kamera tidak pernah berhenti mati: jarak diinterpolasi dalam ruang log, kunci kubik monoton, hold tetap drift.

## 5. Beat sheet (target; dikunci ulang dari durasi suara asli)
| Detik | Peristiwa |
|---|---|
| 0.0 | Frame sudah berisi: titik Jakarta bercahaya, ring pulse. Chip "KENAPA YA? #002". |
| 0.3–3.6 | **Nana:** "Kak, kenapa sih kalau sholat kita harus menghadap kiblat?" |
| 4.5 | Crane naik dimulai (whoosh). |
| 5.0–11.0 | **Kakak:** "Kiblat itu arah ke Ka'bah, di kota Makkah. Allah memerintahkan kita menghadap ke sana setiap kali sholat." Pin Ka'bah menyala di ~7.5 s; sumber "QS. Al-Baqarah: 144". |
| 11.5 | Garis menyala (sub thump + shimmer), kepala garis bergerak ±6 s. |
| 12.0–18.0 | **Kakak:** "Dari Indonesia, Ka'bah jauh sekali. Hampir delapan ribu kilometer, ke arah barat laut." |
| 18.5 | Penggaris tumbuh dari tengah, angka 7.917 km; kompas 295°. |
| 21.5 | **Setengah detik hening** sebelum turn. |
| 22.0–28.5 | **Kakak:** "Tahukah kamu? Saat sholat, umat Islam di seluruh dunia menghadap ke satu titik yang sama: Ka'bah." Garis 6 kota tumbuh satu per satu (tick per kota). |
| 29.0–31.5 | **Nana:** "Wah, jadi kita semua kompak, ya, Kak!" |
| 32.0–39.0 | **Kakak:** "Misi hari ini: cari tahu arah kiblat di rumahmu, ya! Besok kita cari tahu, kenapa baca bismillah sebelum makan." Kartu misi + teaser. |
| 41.0 | Akhir. |

## 6. Cue map (tanpa musik)
Tidak ada grid tempo musik; titik sinkron = awal tiap baris narasi (timestamp kata dari transkripsi) dan peristiwa visual di `window.EV`:
`pin_jkt` 0.2 s · `crane` 4.5 s · `pin_kabah` saat kata "Ka'bah" pertama · `ignite` 11.5 s · `ruler` saat kata "kilometer" · `silence` 21.5 s · `city_n` saat kata "seluruh dunia" + 0.45 s × n · `card` saat kata "Misi".

## 7. Desain suara
| Bagian | Ambience | Foley utama | Musik |
|---|---|---|---|
| 1 Hook | angin rendah lembut + laut jauh | tick halus pin | — |
| 2 Crane | udara tinggi menipis | whoosh naik | — |
| 3 Garis | udara tinggi | sub thump + shimmer elektrik saat menyala, desis kepala garis | — |
| 4 Ukur | udara tinggi | tick ujung penggaris ×2 | — |
| 5 Kota | udara tinggi | **hening 0.5 s**, lalu tick per kota + shimmer naik saat semua menyatu | — |
| 6–7 Misi | udara turun menebal | "pop" kartu | — |
Narasi dikompres, foley diduck di bawah narasi; −14 LUFS, true peak ≤ −1 dB.

## 8. Subtitle & tipografi
- Subtitle: rak legenda di kiri bawah, garis vertikal amber, satu baris Bahasa Indonesia (tanpa baris kedua), lantai gradasi gelap lembut; dipecah per frasa supaya tidak terbungkus.
- Font: Barlow Condensed (OFL) untuk label & angka peta; label lautan biru pucat, label darat coklat gelap.
- Merek Tanya Nana sebagai lapisan 2D: chip "KENAPA YA? #002", lencana wajah Nana saat dia bicara, dan kartu misi bergaya #001.
- Sumber (satu baris kecil di pojok): "Elevasi: AWS Terrain Tiles (SRTM/GEBCO/ETOPO1) · Garis pantai: Natural Earth · Relief ×3 · Rute: lintasan great-circle".

## 9. Fakta (lihat FACTS.md)
- Perintah menghadap Masjidil Haram: QS. Al-Baqarah: 144.
- Jarak & arah dihitung (rumus haversine & bearing awal, R = 6371 km) dari Monas Jakarta (−6.1754, 106.8272) ke Ka'bah (21.4225, 39.8262): **7.917 km, 295.1° (barat laut)**.
