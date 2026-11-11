import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/*
 * EFEK DROSTE / MISE EN ABYME
 * Foto berisi dirinya sendiri di dalam bingkai, terus-menerus tanpa ujung.
 * Kamera masuk ke bingkai, dan setiap `durasiPutaran` detik gambarnya kembali
 * persis ke awal → bisa diulang (loop) tanpa sambungan terlihat.
 *
 * Ganti foto: taruh file di folder public/, lalu ubah prop `gambar`.
 */

export type DrosteProps = {
  /** Path foto di dalam folder public/, contoh "doa/karakter.png" */
  gambar: string;
  /** Ukuran bingkai dalam dibanding bingkai luar (0.5 – 0.75) */
  rasio: number;
  /** Putaran tiap tingkat, dalam derajat (0 = lurus, 15 = spiral) */
  putar: number;
  /** Lama satu putaran zoom, dalam detik */
  durasiPutaran: number;
  /** Titik pusat bingkai dalam (0–1 dari lebar/tinggi layar) */
  pusatX: number;
  pusatY: number;
  /** Warna bingkai */
  warnaBingkai: string;
};

const TEBAL = 34;

const Tingkat: React.FC<{ gambar: string; skala: number; sudut: number; ox: number; oy: number; warna: string }> = ({
  gambar, skala, sudut, ox, oy, warna,
}) => (
  <AbsoluteFill style={{ transformOrigin: `${ox}px ${oy}px`, transform: `scale(${skala}) rotate(${sudut}deg)` }}>
    <AbsoluteFill
      style={{
        border: `${TEBAL}px solid ${warna}`,
        borderRadius: 28,
        overflow: "hidden",
        background: "#222",
        boxShadow: "0 40px 90px rgba(0,0,0,0.65)",
      }}
    >
      <Img src={staticFile(gambar)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  </AbsoluteFill>
);

export const Droste: React.FC<DrosteProps> = ({ gambar, rasio, putar, durasiPutaran, pusatX, pusatY, warnaBingkai }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const panjang = Math.round(durasiPutaran * fps);
  const p = (frame % panjang) / panjang;
  const ox = pusatX * width;
  const oy = pusatY * height;

  // Cukup banyak tingkat sampai bingkai terkecil tak terlihat lagi (< 1 piksel)
  const jumlah = Math.ceil(Math.log(1 / width) / Math.log(rasio)) + 1;
  const tingkat = Array.from({ length: jumlah + 1 }, (_, i) => i - 1);

  return (
    <AbsoluteFill style={{ background: "#111", overflow: "hidden" }}>
      {tingkat.map((k) => {
        const e = k - p;
        return (
          <Tingkat
            key={k}
            gambar={gambar}
            skala={Math.pow(rasio, e)}
            sudut={putar * e}
            ox={ox}
            oy={oy}
            warna={warnaBingkai}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Bingkai PNG transparan untuk merakit efek Droste sendiri di CapCut
export const BingkaiDroste: React.FC<{ warnaBingkai: string }> = ({ warnaBingkai }) => (
  <AbsoluteFill style={{ border: `${TEBAL}px solid ${warnaBingkai}`, borderRadius: 28 }} />
);
