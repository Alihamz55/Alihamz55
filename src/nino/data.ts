// Data 3 clip campaign Newlab+ Probio × Nino Fernandez.
// File video, cover & caption ada di public/nino/ (sengaja tidak di-commit,
// karena itu materi campaign milik pihak lain).

export const FPS = 30;
// Berapa frame cover ditempel di awal video (3 frame = 0,1 detik).
// Frame pertama ini otomatis jadi cover default saat upload ke TikTok.
export const FRAME_COVER = 3;
// Lama teks hook tampil setelah cover
export const DETIK_HOOK = 3.5;

export type DataClip = {
  nomor: 1 | 2 | 3;
  durasiDetik: number;
  // Cover
  label: string;
  judul: [string, string];
  subjudul: string;
  // Teks hook di awal video
  hook: [string, string];
};

export const CLIP: DataClip[] = [
  {
    nomor: 1,
    durasiDetik: 74.4667,
    label: "NINO FERNANDEZ",
    judul: ["SUAMI", "IDAMAN"],
    subjudul: "Probio pilihan Nino & Stef",
    hook: ["Nino Fernandez dikenal", "suami idaman"],
  },
  {
    nomor: 2,
    durasiDetik: 77.7667,
    label: "GREEN FLAG",
    judul: ["SELALU SIAP", "BUAT ISTRI"],
    subjudul: "Nino Fernandez × Stef",
    hook: ["Green flag banget,", "Nino selalu siap buat istrinya"],
  },
  {
    nomor: 3,
    durasiDetik: 75.3667,
    label: "COUPLE GOALS",
    judul: ["MASAK", "BUAT STEF"],
    subjudul: "Nino Fernandez × Stef",
    hook: ["Standar suami idaman", "sekarang: kayak Nino"],
  },
];

export const AKSEN = "#FFD60A";
export const GELAP = "#111111";
export const USERNAME = "@klipmomen";
