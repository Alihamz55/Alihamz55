# Kotak Kocak #1: Bobi Ngaku Pro (versi narasi + dialog)

Versi ini menggantikan `kotak-kocak-01-bobi-ngaku-pro.md` untuk gaya **2D datar** (engine `engine/kotak2d/`).
**Bobi** bercerita sebagai "aku" (narasi), lalu tokoh lain bicara langsung (dialog).
Tanpa nama, logo, atau bunyi khas game mana pun. Caption: **"Konten komedi. Semua tokoh fiktif."**

**Aturan tampilan:**
- **NARASI:** suara Bobi (Sadachbia) dengan instruksi *"Bocah sok jago bercerita ke penonton, santai, sedikit dramatis, seperti curhat"*. Mulut Bobi diam, ekspresinya lebay. Label kecil "NARASI · BOBI", kata kunci tampil besar di tengah atas.
- **DIALOG:** suara masing-masing tokoh, mulut bergerak, papan subtitle berwarna dengan label nama (Bobi oranye, Neng Kubi ungu, Om Blok biru tua).

**Kostum:** dasar (episode pertama). Bobi kaos oranye bergaris + topi tosca terbalik, Neng Kubi rambut ungu + overall, Om Blok rompi satpam + topi + kumis kotak.

---

## 1. Judul
**Bobi Ngaku Pro**

## 2. Hook (0–3 detik)
**NARASI:** Kenalin. Aku Bobi. Pemain paling pro di Dunia Kotak.
*(Teks besar: "PEMAIN PRO?!")*

## 3. Naskah lengkap

| # | Jenis | Tokoh | Kalimat | Visual / teks besar |
|---|---|---|---|---|
| 1 | NARASI | Bobi | Kenalin. Aku Bobi. Pemain paling pro di Dunia Kotak. | Bobi pose tangan ke atas, bintang-bintang. "PEMAIN PRO?!" |
| 2 | DIALOG | Neng Kubi | Bob, itu area tutorial. Buat yang baru main. | Papan "TUTORIAL: NAIK TANGGA" |
| 3 | NARASI | Bobi | Santai. Aku udah main tiga tahun. | Bobi membusungkan dada |
| 4 | DIALOG | Neng Kubi | Serius, Bob? Tiga tahun? | Neng Kubi menyipitkan mata |
| 5 | NARASI | Bobi | ...Tiga tahun nonton orang main. | **Close-up Bobi kaget, garis kecepatan. "NONTON DOANG."** |
| 6 | NARASI | Bobi | Tantangan hari ini: tangga. Cuma tiga. | Zoom ke tangga. "3 TANGGA" |
| 7 | DIALOG | Bobi | Lompat... mendarat... gaya! | Bobi melompat |
| 8 | — | — | *(BRUK!)* | Bobi jatuh tengkurap, kotak debu beterbangan. Hening 0,5 detik |
| 9 | NARASI | Bobi | Tangga pertama. Langsung tamat. | "TAMAT." |
| 10 | DIALOG | Neng Kubi | Itu baru tangga pertama, Bob. | |
| 11 | DIALOG | Bobi | Ini teknik pro. Namanya tiarap strategis. | "TIARAP STRATEGIS" + bintang |
| 12 | DIALOG | Om Blok | PRIIIT! Dilarang tiduran di sini! | "PRIIIT!" |
| 13 | NARASI | Bobi | Terus datanglah musuh terbesarku. | Musik tegang, bayangan gelap |
| 14 | NARASI | Bobi | Ayam. Seekor ayam. | Piko melompat 3 tangga dengan santai. "PIKO NAIK LEVEL!" |
| 15 | DIALOG | Bobi | Pasti dibantu orang dalam! | Bobi berbisik ke kamera |
| 16 | DIALOG | Om Blok | Mending kamu nonton lagi aja, Bob. | |
| 17 | NARASI | Bobi | Oke. Sampai jumpa... tiga tahun lagi. | Bobi hormat. Kartu penutup |

## 4. Punchline utama
> NARASI: "Aku udah main tiga tahun." → Neng Kubi: "Serius?" → NARASI: **"...Tiga tahun nonton orang main."**

Narasi membuat punchline ini lebih kuat: Bobi seolah membongkar kebohongannya sendiri ke penonton.

## 5. Tag tambahan
- **Rule of three:** "Lompat... mendarat... gaya!" → BRUK → NARASI: "Langsung tamat."
- **"Tiarap strategis."** Gengsi tetap dijaga meski muka masih di rumput.
- **"Musuh terbesarku... Ayam. Seekor ayam."** Misdirection: narasi dramatis yang ternyata cuma ayam.

## 6. Callback penutup
**"Sampai jumpa... tiga tahun lagi."** Memakai lagi "tiga tahun nonton orang main" dari awal.

## 7. Estimasi durasi
17 kalimat (9 narasi, 8 dialog), sekitar **42–46 detik** dengan atempo 1.12. Ditambah akhiran channel, total di bawah 60 detik.

## 8. Arahan intonasi dan jeda komedi

| Bagian | Arahan |
|---|---|
| Narasi umum | Santai seperti curhat ke teman, sedikit dramatis. Lebih pelan dari dialog supaya kontras. |
| "...Tiga tahun nonton orang main." | **Jeda 0,5 detik** sebelum bicara, lalu cepat dan pelan seperti mengaku. Kamera kick zoom + SFX "dung!". |
| "Lompat... mendarat... gaya!" | Dialog, jeda 0,2 detik antar kata, makin pede. |
| BRUK | Hening 0,5 detik setelah bunyi jatuh. Jangan pakai bunyi khas game lain. |
| "Langsung tamat." | Datar, pasrah. |
| "Terus datanglah musuh terbesarku." | Suara diberatkan, seperti trailer film. |
| "Ayam. Seekor ayam." | Jeda 0,3 detik di antara dua kalimat, nada kecewa. |
| "Pasti dibantu orang dalam!" | Berbisik curiga. |
| "Sampai jumpa... tiga tahun lagi." | Ceria, hormat ke kamera. |

## Gambar tes
`engine/kotak2d/render.mjs a,b,c` → adegan A (dialog Neng Kubi), B (narasi "NONTON DOANG."), C (Om Blok + Bobi tiarap).
