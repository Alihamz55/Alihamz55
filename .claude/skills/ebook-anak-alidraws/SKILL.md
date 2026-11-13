---
name: ebook-anak-alidraws
description: Membuat ebook/printable edukasi anak (TTS, mewarnai, lembar kerja, cerita, dll.) untuk brand alidraws, lengkap dengan cover, PDF siap cetak A4, thumbnail produk Lynk, sampel gratis, dan teks jualan. Pakai skill ini setiap kali user minta "buat ebook", "buat lembar kerja/printable anak", "produk baru untuk Lynk", thumbnail produk, sampel gratis, atau aset brand alidraws (logo, foto profil, banner).
---

# Ebook Anak alidraws

User adalah kreator konten (YouTube Shorts, TikTok, Facebook) yang menjual ebook edukasi anak
di **lynk.id/alidraws**, dan sedang belajar coding dari nol.
Jawab dalam **bahasa Indonesia santai**. Beri satu rekomendasi dulu, lalu alasannya dalam 1–2 kalimat.
Kasih langkah konkret dan teks siap salin.

## Alur kerja

1. **Pastikan briefnya jelas.** Yang perlu diketahui: jenis produk, jenjang (TK/SD kelas berapa), tema,
   dan jumlah halaman. Kalau belum jelas, tanyakan **satu** pertanyaan singkat. Default kalau user
   bilang "terserah": SD, 10 lembar, tema campuran, dan ada kunci jawaban (bila relevan).
2. **Siapkan font** (font tidak terpasang permanen di server):
   `bash .claude/skills/ebook-anak-alidraws/scripts/siapkan_font.sh <scratchpad>/fonts`
3. **Tulis isinya sendiri.** Semua soal, kata, dan cerita harus orisinal dan **faktanya dicek**
   (hindari fakta yang bisa berubah, misalnya status ibu kota). Jangan menjiplak buku lain.
4. **Buat PDF A4 dengan reportlab.** Contoh lengkap yang sudah terbukti ada di
   `scripts/contoh_ebook_tts.py`: generator TTS, bingkai halaman, header warna per tema,
   kotak soal yang sisinya membulat, footer, dan kunci jawaban. Pakai ulang pola dan fungsi
   gambarnya; jangan mulai dari nol. Isi PDF:
   cover → cara bermain/daftar isi → halaman isi → kunci jawaban (bila ada) → cover belakang.
5. **Periksa secara visual sebelum diserahkan.** Render ke PNG (`pdftoppm -r 50`), gabungkan
   beberapa halaman jadi satu lembar pratinjau, lalu lihat hasilnya. Cek: teks terpotong, elemen
   bertumpuk, glyph kotak kosong (emoji tidak ada di DejaVu, jadi pakai ★ ✓ → ↓), dan ukuran huruf.
6. **Buat aset jualan** di `ebook-<nama>/jualan/`:
   - Thumbnail berbayar dan gratis dengan `scripts/thumbnail.py` (lihat contoh di bawah)
   - Sampel gratis dengan `scripts/pdf_alat.py sampel`, ditambah halaman promo berisi tombol
     ke lynk.id/alidraws (contoh: `scripts/contoh_sampel_promo.py`)
   - Teks jualan Lynk: ikuti `referensi/lynk.md`
7. **Kirim file ke user** dengan SendUserFile, lalu **commit dan push** ke branch kerja.
   Folder `__pycache__/` sudah ada di .gitignore.

## Aturan desain

Lihat `referensi/brand.md` untuk warna dan font. Ringkasnya:
- **Brand (logo, profil, banner):** profesional dan umum, tidak khusus satu produk. Pakai Poppins, navy + oranye.
- **Cover dan isi produk:** boleh ceria dan penuh warna (Luckiest Guy / Baloo 2), satu warna per tema.
- **Ukuran huruf di halaman isi:** soal minimal 12–13 pt, judul 22–26 pt. Anak SD butuh huruf besar.
- **Area kerja anak:** kolom Nama, Kelas, Nilai di setiap lembar kerja.
- Font Luckiest Guy **hanya punya huruf kapital** ("Rp0" jadi "RP0"). Untuk harga atau teks campuran, pakai Baloo 2 atau Poppins.

## Contoh perintah

```bash
SK=.claude/skills/ebook-anak-alidraws/scripts; F=<scratchpad>/fonts
# halaman isi -> png untuk thumbnail
python3 $SK/pdf_alat.py render ebook.pdf --halaman 3 --out hal3.png
# thumbnail berbayar
python3 $SK/thumbnail.py --font-dir $F --cover cover.png --isi hal3.png --judul "10 TTS SERU" \
  --sub "Untuk Anak SD + Kunci Jawaban" --badge "Rp19rb" --tombol "BELI SEKARANG" --warna "#F97316" --out produk.jpg
# thumbnail gratis
python3 $SK/thumbnail.py --font-dir $F --cover cover.png --isi hal3.png --judul "GRATIS!" \
  --sub "Coba 1 TTS + Kunci Jawaban" --badge "Rp0" --tombol "UNDUH SEKARANG" --warna "#EF4444" --out gratis.jpg
# sampel gratis
python3 $SK/pdf_alat.py sampel ebook.pdf --halaman 1,2,3 --tambah promo.pdf --out SAMPEL-GRATIS.pdf
# ganti cover dengan gambar dari Figma/Canva
python3 $SK/pdf_alat.py ganti-cover ebook.pdf --depan depan.png --belakang belakang.png --out ebook.pdf
# aset brand (logo, foto profil, banner)
python3 $SK/brand.py --font-dir $F --out brand/
```

## Catatan penting

- **Figma** (file "TTS Ceria Anak SD - Cover") bisa dipakai untuk desain yang bisa diedit user, tapi
  paket Starter punya **batas pemakaian MCP**. Kalau habis, buat gambarnya dengan PIL dan font di atas.
  Untuk mengambil gambar resolusi tinggi dari Figma: klon frame → `rescale(4)` →
  `get_screenshot` dengan `enableBase64Response: true` (file tersimpan di folder tool-results) →
  hapus klonnya. Unduh langsung lewat curl ke figma.com diblokir jaringan.
- **Canva** lewat Composio hanya bisa upload gambar (teks tidak bisa diedit) dan butuh URL publik.
  Repo GitHub user publik, jadi `raw.githubusercontent.com` bisa dipakai.
- **Harga:** jangan biarkan "pay what you want" menyala dengan minimum 0 di produk berbayar.
- Jangan menjanjikan ukuran atau letak tombol Lynk yang belum terlihat. Kalau ragu, minta screenshot.
