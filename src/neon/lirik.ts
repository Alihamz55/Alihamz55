// Pengaturan video "Neon Streets" (lagu G-Funk 92 BPM)
export const FPS = 30;
export const BPM = 92;
export const DURASI_DETIK = 16;
export const DETIK_PER_KETUKAN = 60 / BPM;

// Lirik hook + kapan muncul (detik). Ganti teks/waktu di sini kalau perlu.
export const LIRIK: { teks: string; mulai: number; selesai: number }[] = [
  { teks: "Ridin' down the neon streets", mulai: 2.6, selesai: 5.2 },
  { teks: "Bass so low it shakes the seats", mulai: 5.2, selesai: 7.8 },
  { teks: "Came up from the bottom,", mulai: 7.8, selesai: 10.4 },
  { teks: "now we sittin' at the peak", mulai: 10.4, selesai: 13.0 },
];

// Seberapa kuat "hentakan bass" di detik ini (1 tepat di ketukan, lalu meredup)
export const hentakan = (detik: number): number => {
  const posisi = (detik % DETIK_PER_KETUKAN) / DETIK_PER_KETUKAN;
  return Math.exp(-posisi * 6);
};
