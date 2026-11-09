// Pengaturan video "Neon Streets" (lagu dari Flow: public/neon/lagu.mp3)
// Angka di bawah diukur dari lagunya langsung (tempo & ketukan).
export const FPS = 30;
export const BPM = 89.1;
export const DURASI_DETIK = 16;
export const DETIK_PER_KETUKAN = 60 / BPM;
export const DETIK_PER_BAR = DETIK_PER_KETUKAN * 4;

// Detik di lagu tempat video mulai (build-up sebelum hook pertama)
export const MULAI_LAGU = 7.39;
// Detik di lagu saat hook pertama "jatuh" (bass masuk)
export const HOOK_DI_LAGU = 10.08;
// Ketukan pertama di dalam video (dipakai untuk denyut bass)
export const KETUKAN_PERTAMA = 7.43 - MULAI_LAGU;

const hookDiVideo = HOOK_DI_LAGU - MULAI_LAGU;
const teksHook = [
  "Ridin' down the neon streets",
  "Bass so low it shakes the seats",
  "Came up from the bottom,",
  "now we sittin' at the peak",
];

// Tiap baris lirik tampil selama 1 bar
export const LIRIK: { teks: string; mulai: number; selesai: number }[] = teksHook.map((teks, i) => ({
  teks,
  mulai: hookDiVideo + i * DETIK_PER_BAR,
  selesai: hookDiVideo + (i + 1) * DETIK_PER_BAR,
}));

export const AKHIR_LIRIK = LIRIK[LIRIK.length - 1].selesai;

// Seberapa kuat "hentakan bass" di detik ini (1 tepat di ketukan, lalu meredup)
export const hentakan = (detik: number): number => {
  const t = detik - KETUKAN_PERTAMA;
  if (t < 0) return 0;
  const posisi = (t % DETIK_PER_KETUKAN) / DETIK_PER_KETUKAN;
  return Math.exp(-posisi * 6);
};
