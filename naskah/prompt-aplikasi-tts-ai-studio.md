# Prompt: Aplikasi TTS "Malam Komedi Voice Studio" (Google AI Studio → Build)

Salin semua teks di dalam blok di bawah ke kolom prompt di AI Studio (menu **Build**).

```
Buatkan aplikasi web bernama "Malam Komedi Voice Studio" untuk membuat voiceover stand-up comedy berbahasa Indonesia memakai model Text-to-Speech (TTS) Gemini terbaru yang tersedia. Aplikasi ini dipakai pembuat konten kartun stand-up "Malam Komedi" untuk YouTube Shorts, TikTok, dan Facebook Reels. Seluruh tampilan dalam bahasa Indonesia, sederhana, dan nyaman dipakai di HP.

FITUR UTAMA
1. Kolom naskah besar. Pengguna menempel naskah satu paragraf atau per baris.
2. Pemisahan suara otomatis:
   - Teks di luar tanda kutip = suara KOMIKA (narator utama).
   - Teks di dalam tanda kutip "..." = suara LAWAN BICARA.
   - Pakai mode multi-speaker TTS jika model mendukung; jika tidak, generate per bagian lalu gabungkan berurutan.
   - Tampilkan pratinjau naskah dengan warna berbeda untuk Komika dan Lawan Bicara, dan izinkan pengguna mengubah peran tiap bagian dengan sekali ketuk.
3. Pilihan suara:
   - Dropdown suara untuk Komika dan Lawan Bicara, berisi daftar suara yang tersedia dari model.
   - Tombol "Dengar contoh" untuk tiap suara.
   - Tombol "Simpan sebagai suara tetap channel" (disimpan di localStorage) supaya setiap episode memakai suara yang sama.
4. Arahan gaya (style prompt) siap pakai, bisa diedit, dengan preset:
   - "Stand-up Santai" (default): stand-up comedian muda Indonesia yang curhat ke penonton, santai dan ekspresif, logat Jakarta ("gue", "nggak"), kalimat pertama langsung bertenaga tanpa basa-basi.
   - "Galau Lebay": sedih dramatis tapi lucu, suara sedikit bergetar di bagian sedih.
   - "Dramatis Film Jadul": berat, puitis, seperti film klasik Indonesia.
   - "Heboh/Panik": cepat, tinggi, kaget.
   Arahan gaya Lawan Bicara bisa diatur terpisah (misal: "manis seperti cewek berbisik", "datar seperti admin olshop", "serak baru bangun tidur").
5. Penanda timing komedi di naskah (jelaskan di bantuan kecil di bawah kolom naskah):
   - "..." = jeda dramatis sekitar 1 detik sebelum punchline.
   - [JEDA] = jeda 1,5 detik.
   - HURUF BESAR = penekanan / dibaca lebih keras.
   - [BISIK], [NANGIS], [KETAWA], [CEPAT] = gaya khusus untuk kalimat berikutnya.
   Ubah penanda ini menjadi instruksi yang dipahami model TTS (bukan dibacakan).
6. Slider kecepatan bicara (lambat – normal – cepat), default normal.
7. Tombol "Buat 3 Versi": generate 3 take sekaligus, tampilkan sebagai 3 pemutar audio supaya pengguna memilih yang paling lucu.
8. Unduh audio dalam format WAV (mono), dengan nama file otomatis dari judul episode, misal "seri-mantan-3.wav".
9. Kolom "Judul episode" dan "Seri" (contoh: Seri Mantan, Seri Kenalan) di atas naskah.
10. Riwayat episode: simpan judul, naskah, arahan gaya, dan suara yang dipakai di localStorage, supaya episode lama bisa dibuka dan di-generate ulang dengan pengaturan yang sama.

PEMERIKSA NASKAH (sebelum generate)
- Hitung perkiraan durasi (asumsi sekitar 2,5 kata per detik) dan beri peringatan jika lebih dari 60 detik.
- Beri peringatan jika kalimat pertama terlalu panjang (lebih dari 12 kata), karena di Shorts kalimat pertama harus langsung menarik.
- Beri peringatan jika naskah tidak berisi tanda "..." sama sekali (kemungkinan tidak ada jeda punchline).

TAMPILAN
- Tema malam: latar ungu gelap, aksen kuning dan pink, judul "MALAM KOMEDI Voice Studio" dengan ikon mikrofon.
- Satu tombol besar utama: "🎤 Buat Suara".
- Tampilkan pesan error yang jelas dalam bahasa Indonesia jika generate gagal atau kuota habis.

BATASAN
- Jangan meniru suara orang sungguhan atau tokoh terkenal. Jika pengguna menulis "tiru suara [nama orang]", tampilkan pesan bahwa fitur itu tidak tersedia.
- Jangan menambahkan musik latar; output hanya suara.
```

## Cara pakai
1. Buka AI Studio, pilih **Build**, tempel prompt di atas, lalu jalankan.
2. Coba dengan naskah yang sudah ada, misalnya `kenalan-cewek-di-facebook.md`.
3. Kalau ada fitur yang kurang pas, minta perbaikan di chat AI Studio, misalnya "tambah tombol putar per kalimat".
