# Tanya Nana — Konsep Channel

**Satu pertanyaan kecil, satu jawaban Islami, setiap hari.**

## Identitas
| | |
|---|---|
| Nama channel | **Tanya Nana** (cek dulu ketersediaan nama & handle `@tanyanana` di YouTube) |
| Alternatif nama | Kenapa Ya, Nana? · Nana Penasaran · Si Kecil Bertanya |
| Penonton | Anak 4–10 tahun + orang tua yang menemani (setel **Made for Kids**) |
| Karakter | **Nana**, anak perempuan berhijab teal, selalu penasaran. Suara: Speko *Nina* |
| Narator | **Kakak**, menjawab dengan lembut. Suara: Speko *Siti* (Cartesia) |
| Warna | Krem `#FFF4D6`, teal `#1FAB89`, oranye `#FF8A3D`, kuning `#FFC93C`, ungu `#6C5CE7` |

## Format satu episode (±60 detik, vertikal 9:16)
1. **Tanya** (hook, 3 detik pertama): Nana bertanya, pertanyaan tampil besar.
2. **Jawab 1–2**: alasan sederhana + ikon besar + sumber (ayat/hadits) bila ada.
3. **Tahukah Kamu?**: satu fakta menarik.
4. *(opsional)* **Langkah**: urutan/cara melakukan.
5. **Misi Hari Ini**: satu tindakan kecil untuk anak + teaser pertanyaan besok.

## Jadwal mingguan
| Hari | Segmen |
|---|---|
| Senin–Kamis | **Kenapa Ya?**: pertanyaan harian |
| Jumat | **Keajaiban Ciptaan Allah**: hewan & alam |
| Sabtu | **Misi Kebaikan Pekan Ini** |
| Minggu | **Kompilasi** 6 episode pekan itu (video panjang, sumber pemasukan) |

## Rencana 30 hari pertama
| # | Hari | Judul | Rujukan untuk dicek |
|---|---|---|---|
| 1 | Sen | Kenapa kita harus wudhu sebelum sholat? ✅ | QS. Al-Ma'idah: 6; HR. Muslim |
| 2 | Sel | Kenapa sholat menghadap kiblat? | QS. Al-Baqarah: 144 |
| 3 | Rab | Kenapa baca bismillah sebelum makan? | HR. Bukhari & Muslim (hadits Umar bin Abi Salamah) |
| 4 | Kam | Kenapa makan pakai tangan kanan? | HR. Muslim |
| 5 | Jum | Lebah, namanya jadi nama surat di Al-Qur'an! | QS. An-Nahl: 68–69 |
| 6 | Sab | Misi: bantu ibu tanpa disuruh | QS. Al-Isra: 23 |
| 7 | Min | Kompilasi pekan 1 | |
| 8 | Sen | Kenapa kita mengucap salam? | HR. Muslim (sebarkan salam) |
| 9 | Sel | Kenapa Allah tidak kelihatan? | QS. Al-An'am: 103 |
| 10 | Rab | Kenapa harus sayang ayah & ibu? | QS. Luqman: 14 |
| 11 | Kam | Kenapa nggak boleh bohong? | HR. Bukhari & Muslim (jujur membawa kebaikan) |
| 12 | Jum | Semut yang bisa bicara! | QS. An-Naml: 18 |
| 13 | Sab | Misi: ucapkan salam ke 3 orang | |
| 14 | Min | Kompilasi pekan 2 | |
| 15 | Sen | Kenapa kita puasa di bulan Ramadan? | QS. Al-Baqarah: 183 |
| 16 | Sel | Kenapa kita harus sayang binatang? | HR. Bukhari (orang yang memberi minum anjing kehausan) |
| 17 | Rab | Kenapa kita berbagi / sedekah? | QS. Al-Baqarah: 261 |
| 18 | Kam | Kenapa kita bilang Alhamdulillah? | QS. Ibrahim: 7 |
| 19 | Jum | Unta, Allah suruh kita memperhatikannya! | QS. Al-Ghasyiyah: 17 |
| 20 | Sab | Misi: sedekahkan satu makanan/mainan | |
| 21 | Min | Kompilasi pekan 3 | |
| 22 | Sen | Kenapa baca doa sebelum tidur? | HR. Bukhari |
| 23 | Sel | Kenapa nggak boleh marah-marah? | HR. Bukhari ("Jangan marah") |
| 24 | Rab | Kenapa kita harus sabar? | QS. Al-Baqarah: 153 |
| 25 | Kam | Kenapa kita bilang Insya Allah? | QS. Al-Kahfi: 23–24 |
| 26 | Jum | Burung Hudhud yang pintar | QS. An-Naml: 20–22 |
| 27 | Sab | Misi: rapikan mainan sendiri sebelum tidur | |
| 28 | Min | Kompilasi pekan 4 | |
| 29 | Sen | Kenapa kita minta maaf kalau salah? | QS. Ali Imran: 134 |
| 30 | Sel | Kenapa kita harus menjaga kebersihan? | HR. Muslim ("bersuci adalah separuh iman") |

> ⚠️ Rujukan di atas untuk **dicek ulang** oleh ustadz/orang yang paham sebelum naskah final dibuat.
> Ikuti adab: tidak menggambarkan sosok Allah, Nabi, atau malaikat.

## Aturan agar aman dari kebijakan YouTube
- Setiap video **isi dan visualnya berbeda** (pertanyaan, ikon, fakta, misi). Jangan upload video yang hanya beda teks.
- Kalau bisa, rekam **suara Kakak dengan suara asli Anda**; suara Nana boleh tetap dari Speko.
- Judul & thumbnail jujur, ramah anak, tanpa clickbait berlebihan.

## Cara produksi satu episode
1. Salin `src/tanyanana/episode/001.ts` jadi `002.ts`, lalu ubah naskahnya (pertanyaan, jawaban, ikon, misi).
2. Buat suara tiap segmen dengan Speko (segmen `tanya` = suara Nina, lainnya = Siti), lalu simpan:
   `python3 scripts/simpan-suara-speko.py <hasil-speko.txt> public/tanyanana/002/<urutan>.mp3`
3. Ukur durasi: `python3 scripts/ukur-suara.py 002`
4. Daftarkan di `src/Root.tsx` (salin blok `TanyaNana-001`).
5. Render: `npx remotion render TanyaNana-002 out/tanya-nana-002.mp4 --crf=26`
