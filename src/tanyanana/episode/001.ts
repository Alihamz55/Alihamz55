import type { DataEpisode } from "../tipe";

// EPISODE 001 — Kenapa kita harus wudhu sebelum sholat?
// Rujukan: QS. Al-Ma'idah: 6 (perintah wudhu); HR. Muslim (kesalahan gugur bersama air wudhu).
export const ep001: DataEpisode = {
  nomor: 1,
  judul: "Kenapa Kita Harus Wudhu Sebelum Sholat? 💧 | Tanya Nana #001",
  segmen: [
    { jenis: "tanya", teks: "Kak, kenapa sih kita harus wudhu dulu sebelum sholat?" },
    {
      jenis: "jawab",
      ikon: "📖",
      label: "Perintah Allah",
      sumber: "QS. Al-Ma'idah: 6",
      teks: "Karena Allah yang memerintahkan. Di dalam Al-Qur'an, Allah menyuruh kita berwudhu sebelum sholat.",
    },
    {
      jenis: "jawab",
      ikon: "🤲",
      label: "Siap Menghadap Allah",
      teks: "Saat sholat, kita sedang menghadap Allah. Jadi kita bersiap dulu, supaya badan bersih dan hati tenang.",
    },
    {
      jenis: "fakta",
      ikon: "💧",
      label: "Kesalahan Kecil Ikut Luntur!",
      sumber: "HR. Muslim",
      efek: "bersih",
      teks: "Kata Rasulullah, saat kita berwudhu, kesalahan-kesalahan kecil kita ikut luntur bersama air wudhu.",
    },
    { jenis: "tanya", ekspresi: "senang", teks: "Wah, keren! Terus urutannya gimana, Kak?" },
    {
      jenis: "langkah",
      judul: "Urutan Wudhu",
      teks: "Gampang! Niat dulu, lalu cuci kedua telapak tangan, berkumur, bersihkan hidung, basuh wajah, basuh tangan sampai siku, usap kepala, usap telinga, lalu basuh kaki sampai mata kaki.",
      langkah: [
        { ikon: "💭", label: "Niat", kata: "Niat" },
        { ikon: "👐", label: "Telapak tangan", kata: "telapak" },
        { ikon: "👄", label: "Berkumur", kata: "berkumur" },
        { ikon: "👃", label: "Hidung", kata: "hidung" },
        { ikon: "😊", label: "Wajah", kata: "wajah" },
        { ikon: "💪", label: "Tangan s/d siku", kata: "sampai siku" },
        { ikon: "💆", label: "Kepala", kata: "kepala" },
        { ikon: "👂", label: "Telinga", kata: "telinga" },
        { ikon: "🦶", label: "Kaki s/d mata kaki", kata: "kaki sampai" },
      ],
    },
    {
      jenis: "misi",
      misi: "Wudhu yang rapi sebelum sholat hari ini!",
      besok: "Kenapa sholat menghadap kiblat?",
      teks: "Misi hari ini: wudhu yang rapi sebelum sholat, ya! Besok kita cari tahu, kenapa sholat harus menghadap kiblat. Sampai jumpa!",
    },
  ],
};
