// Info lagu untuk video DoaPanggung
import dataMulut from "./mulut.json";

export const DURASI_DETIK = 67.2;

// Bagian puncak lagu (detik) → air mata lebih deras, cahaya lebih terang
export const puncak: [number, number][] = [
  [18, 22],
  [36, 40],
  [54, 62],
];

// Seberapa lebar mulut terbuka di tiap frame (0 = tertutup, 1 = paling lebar).
// Dihitung otomatis dari suara vokal lagu (lihat README).
export const bukaMulut = (frame: number): number => (dataMulut as number[])[frame] ?? 0;
