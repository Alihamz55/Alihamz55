import { createContext, use } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_JUDUL } from "./font";
import { SeruKuning } from "./Komik";

/*
 * TEMPLATE JUDUL EPISODE (pola "compound components")
 *
 * Judul dibangun dari potongan-potongan kecil yang bisa disusun bebas,
 * jadi tidak perlu banyak pilihan true/false. Contoh:
 *
 *   <JudulEpisode.Root durasi={90}>
 *     <JudulEpisode.Lencana>EPISODE 13</JudulEpisode.Lencana>
 *     <JudulEpisode.Judul>
 *       <JudulEpisode.Seru />
 *       <JudulEpisode.Baris>JAKSEL vs</JudulEpisode.Baris>
 *       <JudulEpisode.BarisSorot>BAHASA</JudulEpisode.BarisSorot>
 *       <JudulEpisode.BarisSorot>SUNDA</JudulEpisode.BarisSorot>
 *     </JudulEpisode.Judul>
 *   </JudulEpisode.Root>
 *
 * Mau tanpa lencana? Hapus saja baris <Lencana>. Mau 4 baris judul? Tambah <Baris>.
 */

const WARNA_SOROT = "#ffd400";
const WARNA_GARIS = "#111";

// ===== Data bersama (dibaca semua potongan lewat context) =====
type JudulContextValue = {
  /** Lama judul tampil, dalam frame */
  durasi: number;
};

const JudulContext = createContext<JudulContextValue | null>(null);

const useJudul = () => {
  const nilai = use(JudulContext);
  if (!nilai) throw new Error("Potongan JudulEpisode harus ada di dalam <JudulEpisode.Root>");
  return nilai;
};

// Efek "pop" (membesar memantul) mulai dari frame tertentu
const usePop = (muncul: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - muncul, fps, config: { damping: 10 } });
};

// ===== Root: wadah + latar gelap + memudar di akhir =====
const Root: React.FC<{
  /** Lama judul tampil, dalam frame (contoh: 3 detik x 30 fps = 90) */
  durasi: number;
  /** Gelapnya latar belakang, 0 sampai 1 */
  gelap?: number;
  children: React.ReactNode;
}> = ({ durasi, gelap = 0.45, children }) => {
  const frame = useCurrentFrame();
  if (frame >= durasi) return null;

  const hilang = interpolate(frame, [durasi - 10, durasi], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <JudulContext value={{ durasi }}>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", opacity: hilang, background: `rgba(0,0,0,${gelap})` }}
      >
        {children}
      </AbsoluteFill>
    </JudulContext>
  );
};

// ===== Lencana kuning miring, contoh "EPISODE 12" =====
const Lencana: React.FC<{ muncul?: number; children: React.ReactNode }> = ({ muncul = 4, children }) => {
  useJudul();
  const pop = usePop(muncul);
  return (
    <div
      style={{
        transform: `scale(${pop}) rotate(-3deg)`,
        background: WARNA_SOROT,
        border: `7px solid ${WARNA_GARIS}`,
        color: WARNA_GARIS,
        padding: "10px 44px",
        borderRadius: 24,
        fontSize: 76,
        fontFamily: FONT_JUDUL,
      }}
    >
      {children}
    </div>
  );
};

// ===== Blok judul besar (isi dengan Baris / BarisSorot / Seru) =====
const Judul: React.FC<{ muncul?: number; ukuran?: number; children: React.ReactNode }> = ({
  muncul = 14,
  ukuran = 120,
  children,
}) => {
  useJudul();
  const pop = usePop(muncul);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${pop})`,
        marginTop: 40,
        color: "white",
        fontSize: ukuran,
        fontFamily: FONT_JUDUL,
        textAlign: "center",
        lineHeight: 1.05,
        WebkitTextStroke: `10px ${WARNA_GARIS}`,
        paintOrder: "stroke",
      }}
    >
      {children}
    </div>
  );
};

// Baris judul biasa (putih)
const Baris: React.FC<{ children: React.ReactNode }> = ({ children }) => <span>{children}</span>;

// Baris judul yang disorot (kuning) — dibuat terpisah, bukan pakai pilihan true/false
const BarisSorot: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: WARNA_SOROT }}>{children}</span>
);

// Tanda kaget kuning di pojok kanan atas judul
const Seru: React.FC<{ ukuran?: number; putar?: number }> = ({ ukuran = 1.3, putar = 40 }) => {
  useJudul();
  return <SeruKuning ukuran={ukuran} putar={putar} style={{ right: -60, top: -110 }} />;
};

export const JudulEpisode = { Root, Lencana, Judul, Baris, BarisSorot, Seru };

// ===== Siap pakai untuk seri "Jaksel vs Bahasa Daerah" =====
// Cukup isi nomor episode dan nama bahasanya.
export const JudulSeriJaksel: React.FC<{ episode: number; bahasa: string; durasi: number }> = ({
  episode,
  bahasa,
  durasi,
}) => (
  <JudulEpisode.Root durasi={durasi}>
    <JudulEpisode.Lencana>EPISODE {episode}</JudulEpisode.Lencana>
    <JudulEpisode.Judul>
      <JudulEpisode.Seru />
      <JudulEpisode.Baris>JAKSEL vs</JudulEpisode.Baris>
      <JudulEpisode.BarisSorot>BAHASA</JudulEpisode.BarisSorot>
      <JudulEpisode.BarisSorot>{bahasa.toUpperCase()}</JudulEpisode.BarisSorot>
    </JudulEpisode.Judul>
  </JudulEpisode.Root>
);
