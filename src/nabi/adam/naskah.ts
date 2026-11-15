// NASKAH "Kisah Nabi Adam ‘alaihissalam" — seri Kisah Nabi (Nasyid Mungil)
// Ubah teks atau durasi di sini, caption & animasi otomatis ikut menyesuaikan.
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
  detik: number;
};

export const naskah: Adegan[] = [
  { id: "judul", teks: "", detik: 3 },
  { id: "tanah", teks: "Allah menciptakan Nabi Adam dari tanah, lalu meniupkan ruh kepadanya.", detik: 6.5 },
  { id: "nama", teks: "Allah mengajarkan Nabi Adam nama-nama segala sesuatu.", detik: 5.5 },
  { id: "sujud", teks: "Para malaikat sujud memberi hormat. Hanya Iblis yang menolak, karena sombong.", detik: 6.5 },
  { id: "surga", teks: "Nabi Adam dan Hawa tinggal di surga. Boleh makan apa saja, kecuali mendekati satu pohon.", detik: 7 },
  { id: "bisikan", teks: "Iblis terus membisikkan tipu daya, hingga keduanya memakan buah pohon itu.", detik: 6.5 },
  { id: "turun", teks: "Maka Nabi Adam dan Hawa diturunkan ke bumi.", detik: 5 },
  { id: "taubat", teks: "Mereka sangat menyesal, lalu berdoa memohon ampun:", detik: 9.5 },
  { id: "diterima", teks: "Allah Maha Penerima taubat. Allah mengampuni mereka.", detik: 5 },
  { id: "penutup", teks: "", detik: 5 },
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
    const durasi = Math.round(a.detik * FPS);
    const item = { ...a, mulai, durasi };
    mulai += durasi;
    return item;
  });
})();

export const TOTAL_FRAME = jadwal[jadwal.length - 1].mulai + jadwal[jadwal.length - 1].durasi;
