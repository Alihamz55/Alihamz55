// TANYA NANA — tipe data episode.
// Satu episode = daftar segmen. Setiap segmen punya satu file suara:
// public/tanyanana/<nomor 3 digit>/<urutan segmen>.mp3

export type Ekspresi = "bingung" | "senang" | "kaget" | "dengar";

export type Segmen =
  // Nana bertanya / bereaksi (suara Nana, mulutnya bergerak)
  | { jenis: "tanya"; teks: string; ekspresi?: Ekspresi }
  // Kakak menjawab: satu alasan, satu ikon besar
  | { jenis: "jawab"; teks: string; ikon: string; label: string; sumber?: string }
  // Fakta menarik ("Tahukah Kamu?")
  | { jenis: "fakta"; teks: string; ikon: string; label: string; sumber?: string; efek?: "bersih" | "bintang" }
  // Urutan langkah. `kata` = kata di teks saat langkah itu disebut (untuk sinkron animasi)
  | { jenis: "langkah"; teks: string; judul: string; langkah: { ikon: string; label: string; kata: string }[] }
  // Penutup: misi hari ini + teaser episode besok
  | { jenis: "misi"; teks: string; misi: string; besok?: string };

export type DataEpisode = {
  nomor: number;
  judul: string; // judul video (untuk YouTube)
  segmen: Segmen[];
};

export const FPS = 30;
export const JEDA_AWAL = 6; // frame sebelum suara mulai
export const JEDA_AKHIR = 14; // frame setelah suara selesai

export const kodeEpisode = (n: number) => String(n).padStart(3, "0");

// durasi = { "0": detik, "1": detik, ... } hasil scripts/ukur-suara.py
export const jadwalEpisode = (data: DataEpisode, durasi: Record<string, number>) => {
  let mulai = 0;
  return data.segmen.map((s, i) => {
    const suara = Math.round((durasi[String(i)] ?? s.teks.length / 14) * FPS);
    const d = JEDA_AWAL + suara + JEDA_AKHIR;
    const item = { s, i, mulai, d, suara };
    mulai += d;
    return item;
  });
};

export const totalFrame = (data: DataEpisode, durasi: Record<string, number>) => {
  const j = jadwalEpisode(data, durasi);
  return j[j.length - 1].mulai + j[j.length - 1].d;
};

// Waktu mulai tiap kata (frame), dibagi menurut panjang huruf — cukup akurat untuk TTS
export const waktuKata = (teks: string, awal: number, panjang: number) => {
  const kata = teks.split(" ");
  const bobot = kata.map((k) => k.length + 1);
  const total = bobot.reduce((a, b) => a + b, 0);
  let jalan = 0;
  return kata.map((k, i) => {
    const m = awal + (jalan / total) * panjang;
    jalan += bobot[i];
    return { kata: k, mulai: m };
  });
};

// Frame saat sebuah frasa diucapkan di dalam teks
export const waktuFrasa = (teks: string, frasa: string, awal: number, panjang: number) => {
  const idx = teks.toLowerCase().indexOf(frasa.toLowerCase());
  return awal + (Math.max(0, idx) / teks.length) * panjang;
};
