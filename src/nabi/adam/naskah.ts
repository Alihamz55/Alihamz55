// NASKAH "Kisah Nabi Adam ‘alaihissalam" — seri Kisah Nabi (Nasyid Mungil)
// Ubah teks di sini. Durasi tiap adegan otomatis mengikuti panjang narasi (`suara`).
// Narasi dibuat dengan Speko TTS (suara wanita "Siti", Cartesia sonic-3.5, speed 0.9).
// Kalau teks diubah, buat ulang file suaranya lalu perbarui angka `suara`.
//
// Adab: sosok Nabi, Hawa, dan malaikat TIDAK digambarkan.
// Cerita disampaikan lewat simbol (tanah, cahaya, taman, pohon) + caption.

export const FPS = 30;

export type IdAdegan =
  | "judul"
  | "tanah"
  | "nama"
  | "sujud"
  | "surga"
  | "bisikan"
  | "turun"
  | "taubat"
  | "diterima"
  | "penutup";

export type Adegan = {
  id: IdAdegan;
  teks: string; // caption di bawah ("" = tanpa caption)
  suara: number; // durasi narasi (detik) di public/nabi-adam/<id>.mp3
  captionDetik?: number; // kalau caption hanya bagian awal narasi
};

// Narasi mulai sedikit setelah adegan muncul, lalu ada jeda sebelum adegan berikutnya
export const JEDA_AWAL = 12; // frame
const JEDA_AKHIR_DETIK = 0.9;

export const naskah: Adegan[] = [
  { id: "judul", teks: "", suara: 3.04 },
  { id: "tanah", teks: "Allah menciptakan Nabi Adam dari tanah, lalu meniupkan ruh kepadanya.", suara: 5.28 },
  { id: "nama", teks: "Allah mengajarkan Nabi Adam nama-nama segala sesuatu.", suara: 4.88 },
  { id: "sujud", teks: "Para malaikat sujud memberi hormat. Hanya Iblis yang menolak, karena sombong.", suara: 6.08 },
  { id: "surga", teks: "Nabi Adam dan Hawa tinggal di surga. Boleh makan apa saja, kecuali mendekati satu pohon.", suara: 7.84 },
  { id: "bisikan", teks: "Iblis terus membisikkan tipu daya, hingga keduanya memakan buah pohon itu.", suara: 5.52 },
  { id: "turun", teks: "Maka Nabi Adam dan Hawa diturunkan ke bumi.", suara: 4.32 },
  { id: "taubat", teks: "Mereka sangat menyesal, lalu berdoa memohon ampun:", suara: 15.84, captionDetik: 3.74 },
  { id: "diterima", teks: "Allah Maha Penerima taubat. Allah mengampuni mereka.", suara: 4.8 },
  { id: "penutup", teks: "", suara: 12.24 },
];

// Doa Nabi Adam — QS. Al-A'raf: 23
export const DOA_ARAB =
  "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ";
export const DOA_ARTI =
  "“Ya Tuhan kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni dan merahmati kami, niscaya kami termasuk orang-orang yang rugi.”";
export const DOA_SUMBER = "QS. Al-A'raf: 23";

// ===== Hitungan waktu otomatis (tidak perlu diubah) =====
export const jadwal = (() => {
  let mulai = 0;
  return naskah.map((a) => {
    const durasi = JEDA_AWAL + Math.round((a.suara + JEDA_AKHIR_DETIK) * FPS);
    const item = { ...a, mulai, durasi };
    mulai += durasi;
    return item;
  });
})();

export const TOTAL_FRAME = jadwal[jadwal.length - 1].mulai + jadwal[jadwal.length - 1].durasi;
