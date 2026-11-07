// NASKAH EPISODE 12 — Bahasa Makassar di warung coto
// Ubah teks atau durasi di sini, animasi otomatis ikut menyesuaikan.

export const FPS = 30;

export type Pembicara = "penjual" | "jaksel";

export type Baris = {
  siapa: Pembicara;
  teks: string;
  detik: number; // lama baris ini tampil
  // kata yang disorot (warna kuning) di balon dialog
  sorot?: string[];
};

export const INTRO_DETIK = 3;
export const OUTRO_DETIK = 6;

export const naskah: Baris[] = [
  { siapa: "penjual", teks: "Mau pesan apa, kita?", detik: 2.5, sorot: ["kita?"] },
  { siapa: "jaksel", teks: "Kita? Aku sendirian, Bang. Literally cuma aku.", detik: 3.5, sorot: ["Kita?"] },
  { siapa: "penjual", teks: "Kita itu artinya Anda, Kak.", detik: 2.8, sorot: ["Kita", "Anda,"] },
  { siapa: "jaksel", teks: "Ohh... lowkey malu sih. Oke, coto satu.", detik: 3.3, sorot: ["lowkey"] },
  { siapa: "penjual", teks: "Cotomi, Kak?", detik: 2.2, sorot: ["Cotomi,"] },
  { siapa: "jaksel", teks: "Mi?! Aku pesen coto, bukan mi!", detik: 3, sorot: ["Mi?!", "mi!"] },
  { siapa: "penjual", teks: "Mi itu artinya sudah, Kak. Coto saja, toh?", detik: 3.5, sorot: ["sudah,"] },
  { siapa: "jaksel", teks: "Oke noted. Aku belajar banyak today.", detik: 2.8, sorot: ["noted."] },
  { siapa: "penjual", teks: "Bayarmi, Kak.", detik: 2.2, sorot: ["Bayarmi,"] },
  { siapa: "jaksel", teks: "Bayar... mi? Aku kan nggak pesen mi!", detik: 3.2, sorot: ["mi?", "mi!"] },
];

export const kamus = {
  makassar: [
    { kata: "kita", arti: "Anda (sapaan sopan)" },
    { kata: "-mi", arti: "sudah / saja" },
  ],
  jaksel: [{ kata: "lowkey", arti: "agak-agak, diam-diam" }],
};

// ===== Hitungan waktu otomatis (tidak perlu diubah) =====
export const jadwal = (() => {
  let mulai = INTRO_DETIK * FPS;
  return naskah.map((b) => {
    const durasi = Math.round(b.detik * FPS);
    const item = { ...b, mulai, durasi };
    mulai += durasi;
    return item;
  });
})();

export const AKHIR_DIALOG = jadwal[jadwal.length - 1].mulai + jadwal[jadwal.length - 1].durasi;
export const TOTAL_FRAME = AKHIR_DIALOG + OUTRO_DETIK * FPS;

// Siapa yang sedang bicara di frame tertentu (null = tidak ada)
export const pembicaraDiFrame = (frame: number) =>
  jadwal.find((b) => frame >= b.mulai && frame < b.mulai + b.durasi) ?? null;
