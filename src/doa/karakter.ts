// DAFTAR KARAKTER untuk video "Doa di Panggung".
// Semua koordinat dalam piksel gambar (941 x 1672).
// Tambah karakter baru: taruh gambarnya di public/doa/, lalu salin satu blok di bawah.

type Titik = [number, number];

export type KonfigKarakter = {
  gambar: string;
  mulut: Titik; // tepat di bagian dalam mulut (di bawah gigi atas)
  jalurAirMataKiri: Titik[];
  jalurAirMataKanan: Titik[];
  wajah: Titik; // titik yang didekati kamera
};

export const KARAKTER = {
  perempuan: {
    gambar: "doa/karakter.png",
    mulut: [512, 534],
    jalurAirMataKiri: [[415, 492], [410, 515], [405, 550], [407, 585], [410, 612]],
    jalurAirMataKanan: [[560, 467], [570, 495], [580, 530], [580, 565], [576, 602]],
    wajah: [490, 560],
  },
  laki: {
    gambar: "doa/karakter-laki.png",
    mulut: [509, 538],
    jalurAirMataKiri: [[427, 497], [422, 520], [417, 555], [420, 590], [425, 615]],
    jalurAirMataKanan: [[547, 481], [555, 505], [565, 540], [567, 575], [565, 605]],
    wajah: [495, 570],
  },
} satisfies Record<string, KonfigKarakter>;

export type NamaKarakter = keyof typeof KARAKTER;
