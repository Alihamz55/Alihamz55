// LIRIK LAGU — isi teks Arab (dan terjemahan kalau mau) di setiap baris.
// Waktu (detik) sudah disesuaikan dengan jeda vokal di lagu ini.
// Kalau lirik suatu baris kosong (""), baris itu tidak ditampilkan.

export type BarisLirik = {
  mulai: number; // detik
  selesai: number; // detik
  arab: string;
  terjemahan?: string;
};

// Teks contoh. Ganti dengan lirik lagumu.
const CONTOH = "اكتب كلمات الأغنية هنا";

export const lirik: BarisLirik[] = [
  { mulai: 0.5, selesai: 4.0, arab: CONTOH, terjemahan: "(baris 1 — tulis lirik di src/doa/lirik.ts)" },
  { mulai: 4.5, selesai: 8.5, arab: CONTOH, terjemahan: "(baris 2)" },
  { mulai: 9.0, selesai: 13.0, arab: CONTOH, terjemahan: "(baris 3)" },
  { mulai: 13.5, selesai: 17.5, arab: CONTOH, terjemahan: "(baris 4)" },
  { mulai: 18.0, selesai: 22.0, arab: CONTOH, terjemahan: "(baris 5)" },
  { mulai: 22.5, selesai: 26.5, arab: CONTOH, terjemahan: "(baris 6)" },
  { mulai: 27.0, selesai: 31.0, arab: CONTOH, terjemahan: "(baris 7)" },
  { mulai: 31.5, selesai: 35.5, arab: CONTOH, terjemahan: "(baris 8)" },
  { mulai: 36.0, selesai: 39.5, arab: CONTOH, terjemahan: "(baris 9)" },
  { mulai: 40.0, selesai: 44.0, arab: CONTOH, terjemahan: "(baris 10)" },
  { mulai: 44.5, selesai: 48.5, arab: CONTOH, terjemahan: "(baris 11)" },
  { mulai: 49.0, selesai: 53.5, arab: CONTOH, terjemahan: "(baris 12)" },
  { mulai: 54.0, selesai: 57.5, arab: CONTOH, terjemahan: "(baris 13)" },
  { mulai: 58.0, selesai: 62.0, arab: CONTOH, terjemahan: "(baris 14)" },
  { mulai: 62.5, selesai: 67.0, arab: CONTOH, terjemahan: "(baris 15)" },
];

// Bagian puncak lagu (detik) → air mata lebih deras, cahaya lebih terang
export const puncak: [number, number][] = [
  [18, 22],
  [36, 40],
  [54, 62],
];

export const DURASI_DETIK = 67.2;
