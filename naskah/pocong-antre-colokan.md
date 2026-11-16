# Pocong Antre Colokan (Malam Komedi, episode tanpa dialog)

**Format:** YouTube Shorts **tanpa dialog**, sekitar 20 detik, lalu tempel akhiran (total sekitar 26 detik).
- Lucunya hanya dari gerakan, ekspresi, SFX, dan musik, jadi bisa ditonton orang dari negara mana pun.
- Teks di layar hanya ikon atau angka (🔋, %, ❤️), tanpa kata-kata.
- Ganti adegan setiap 2–4 detik, kamera zoom (kick) di setiap kejutan.

**Kenapa formatnya begini:** Shorts dengan views terbanyak di dunia (Colin Amazing, NuNu Tv, Monica Toy) hampir semuanya
bisa dimengerti tanpa bahasa, durasinya 10–30 detik, dan punya twist di akhir yang membuat penonton menonton ulang.

**Tokoh:**
- **Asep:** outfit `sarung` (peci). Polos dan penakut kalau sendirian.
- **Pocong:** FX `fxPocong`. Sopan, selalu butuh colokan.
- **Pocong figuran:** 3–4 `fxPocong` tambahan dengan skala dan warna kain sedikit beda.

**Latar:** kamar Asep (x -40), lalu pos ronda (x 120). Malam hari, cahaya bulan biru dan lampu bohlam kuning.

**Caption:** Konten komedi. Semua tokoh fiktif.
**Judul usulan:** `Pocong Juga Butuh Colokan 🔋👻 #shorts`

---

| Detik | Adegan | Kamera | Layar / FX | SFX & musik |
|---|---|---|---|---|
| 0.0–2.5 | **HOOK.** Kamar gelap. Asep tiduran sambil main HP, wajahnya kena cahaya layar. Ikon baterai di HP: **100%** 🔋 hijau. | Close-up wajah Asep dari bawah (kamera rendah), lalu cut ke layar HP | Ikon 🔋100% besar di tengah | Jangkrik, musik lo-fi pelan |
| 2.5–4.5 | Lampu bohlam berkedip. Tirai jendela bergerak. Asep membeku. | *Over-the-shoulder* dari belakang Asep ke jendela | Kedip lampu (gelap–terang 3×) | Bunyi "nging" tinggi, musik berhenti mendadak |
| 4.5–6.5 | Bayangan putih **melompat-lompat** di balik tirai. Asep langsung menutupi diri dengan sarung sampai cuma matanya yang kelihatan. | Zoom pelan ke tirai, lalu **kick** ke mata Asep | Getar kecil (shake) | "Duk… duk… duk…" lompatan, detak jantung |
| 6.5–9.0 | Pocong masuk, berdiri tepat di depan Asep. Hening. Pocong pelan-pelan **menunjuk colokan di dinding** dengan dagunya, lalu memperlihatkan HP-nya yang terselip di ikatan kain: **1%** 🔋 merah berkedip. | Close-up wajah Pocong (DOF kuat, `cinf` 8), lalu cut ke HP-nya | Ikon 🔋1% merah berkedip | Bunyi "tit… tit…" baterai lemah |
| 9.0–11.5 | Asep lega dan tertawa kecil, mencabut charger HP-nya sendiri lalu memberikannya ke Pocong. Pocong membungkuk sopan. | Medium shot berdua, hangat | ✨ kecil saat charger berpindah tangan | Musik lo-fi masuk lagi, "ding" lucu |
| 11.5–13.5 | Pocong mengecas HP-nya. Ikon Pocong naik cepat 1→100%. Bersamaan, **HP Asep turun 100→1%** dan layarnya mati. Asep melongo. | Split-screen kiri-kanan (dua HP), lalu **kick** ke wajah Asep | Dua angka baterai berlawanan arah | "Wuuup" naik & "wuuung" turun, lalu "plop" layar mati |
| 13.5–16.0 | **Malam berikutnya.** Asep membungkus diri dengan sarung dari kepala sampai kaki (mirip pocong), **melompat-lompat** keluar rumah sambil memeluk charger. | Wide shot jalan kampung, kamera rendah | Teks kecil "🌙 +1" di pojok | Lompatan "duk duk", musik kocak tempo cepat |
| 16.0–19.0 | **TWIST.** Sampai di pos ronda: ternyata ada **barisan 4 pocong antre di satu colokan**, masing-masing memegang HP. Pocong yang tadi melambai dari depan antrean. | Kamera mundur (pull-back) memperlihatkan antrean panjang | 🔋 di atas kepala tiap pocong (5%, 2%, 8%, 1%) | Musik berhenti, satu "jreng!" |
| 19.0–20.5 | Asep pasrah, berdiri di **ujung antrean** dan melompat kecil sekali. Freeze frame. | Close-up Asep, zoom-in pelan | Ikon 🔋0% di atas kepala Asep | Jangkrik saja (biar *loop* ke detik 0) |

*(Tempel `video/Akhiran-YouTube-Asep.mp4`.)*

---

## Catatan produksi

- **Tanpa Speko/TTS**: tidak ada dialog, jadi langkah 2–4 pipeline (suara dan `lips.js`) dilewati. Mulut cukup diam atau ekspresi saja.
  Timeline dibuat langsung di `story_main.js` berdasarkan detik di tabel (30 fps → sekitar 615 frame).
- **Telop**: `fxTelop` tidak dipakai. Ikon baterai bisa dibuat sebagai FX baru, misalnya `fxBaterai(x, y, persen, warna)` di `zfx.js`.
  Nama ini belum dipakai, tapi cek dulu supaya tidak bentrok.
- **Audio**: SFX lompatan, "tit-tit" baterai, dan "jreng" dibuat di `audio.py`. Karena tidak ada suara,
  `mix.py` perlu disesuaikan: patokan level ke musik, dan puncak SFX sekitar -3 dB dari puncak musik.
- **Loop**: frame terakhir (jangkrik, gelap) sengaja mirip dengan frame pertama supaya penonton tidak sadar videonya mengulang.
- **Lanjutan seri** (kalau ramai): "Pocong Rebutan Wi-Fi", "Pocong Minta Pinjam Power Bank", "Pocong Nonton Bola di Pos Ronda".
