import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadDancing } from "@remotion/google-fonts/DancingScript";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";

/*
 * ELEMEN VISUAL "HARI AYAH NASIONAL" UNTUK TEMPLATE CAPCUT
 *
 * 3 klip, masing-masing dirender jadi MP4 lalu dimasukkan ke CapCut:
 *  - AyahPembuka  : judul pembuka "Untuk Ayah, dengan Cinta" (langsung pakai)
 *  - AyahDuluSekarang : bingkai + label DULU / SEKARANG di latar HIJAU
 *                   → di CapCut: Overlay → Hapus latar → Chroma key (pilih hijau)
 *  - AyahPenutup  : "Terima kasih, Ayah" + #HariAyah2026 (langsung pakai)
 *
 * Teks bisa diganti lewat props (atau panel kanan di `npm run dev`).
 */

const FONT_TULISAN = loadDancing("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const FONT_TEGAS = loadNunito("normal", { weights: ["800", "900"], subsets: ["latin"] }).fontFamily;

const WARNA = {
  biru: "#3d8bff",
  biruMuda: "#9cc7ff",
  krem: "#fff6e8",
  emas: "#ffd27a",
  malam: "#0f1d3a",
  hijauLayar: "#00ff00",
};

// ===== Potongan kecil yang dipakai bersama =====

// Hati biru (SVG, supaya tidak bergantung pada font emoji)
const Hati: React.FC<{ ukuran: number; style?: React.CSSProperties }> = ({ ukuran, style }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 100 100" style={style}>
    <defs>
      <linearGradient id="hatiBiru" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7fb6ff" />
        <stop offset="1" stopColor="#1f6fe8" />
      </linearGradient>
    </defs>
    <path
      d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 21 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88 Z"
      fill="url(#hatiBiru)"
      stroke="white"
      strokeWidth={4}
    />
    <ellipse cx="30" cy="28" rx="9" ry="6" fill="white" opacity={0.55} transform="rotate(-30 30 28)" />
  </svg>
);

// Titik-titik cahaya hangat yang melayang pelan (bokeh)
const Bokeh: React.FC<{ jumlah?: number }> = ({ jumlah = 26 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {new Array(jumlah).fill(0).map((_, i) => {
        const besar = 20 + random(`b${i}`) * 90;
        const x = random(`x${i}`) * width;
        const yAwal = random(`y${i}`) * height;
        const y = (yAwal - frame * (0.6 + random(`v${i}`) * 1.4) + height) % height;
        const kedip = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(frame / 14 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: besar,
              height: besar,
              borderRadius: "50%",
              background: i % 3 === 0 ? WARNA.biruMuda : WARNA.emas,
              opacity: kedip,
              filter: `blur(${besar / 6}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Latar senja biru hangat
const LatarSenja: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 38%, #3b5b95 0%, #1d2f5c 45%, ${WARNA.malam} 100%)`,
    }}
  />
);

// Seluruh isi memudar masuk di awal dan keluar di akhir
const useMasukKeluar = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [0, 12, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// Teks muncul naik pelan
const Naik: React.FC<{ mulai: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  mulai,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - mulai, fps, config: { damping: 16 } });
  return <div style={{ opacity: s, transform: `translateY(${(1 - s) * 60}px)`, ...style }}>{children}</div>;
};

// ===== 1. PEMBUKA =====
export type AyahPembukaProps = { baris1: string; baris2: string; keterangan: string };

export const AyahPembuka: React.FC<AyahPembukaProps> = ({ baris1, baris2, keterangan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = useMasukKeluar();
  const popHati = spring({ frame: frame - 40, fps, config: { damping: 8 } });
  const detak = 1 + 0.07 * Math.max(0, Math.sin((frame - 40) / 6));

  return (
    <AbsoluteFill>
      <LatarSenja />
      <Bokeh />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity, textAlign: "center" }}>
        <Naik mulai={8} style={{ fontFamily: FONT_TULISAN, fontSize: 150, color: WARNA.krem, lineHeight: 1 }}>
          {baris1}
        </Naik>
        <Naik
          mulai={22}
          style={{
            fontFamily: FONT_TEGAS,
            fontWeight: 900,
            fontSize: 112,
            color: "white",
            marginTop: 20,
            letterSpacing: 2,
            textShadow: `0 0 40px ${WARNA.biru}`,
          }}
        >
          {baris2}
        </Naik>
        <Hati ukuran={190} style={{ marginTop: 40, transform: `scale(${popHati * detak})` }} />
        <Naik
          mulai={55}
          style={{
            marginTop: 50,
            fontFamily: FONT_TEGAS,
            fontWeight: 800,
            fontSize: 38,
            color: WARNA.emas,
            letterSpacing: 4,
          }}
        >
          {keterangan}
        </Naik>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===== 2. OVERLAY DULU / SEKARANG (latar hijau untuk chroma key) =====
export type AyahDuluSekarangProps = { labelDulu: string; labelSekarang: string };

const Label: React.FC<{ teks: string; mulai: number; akhir: number }> = ({ teks, mulai, akhir }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < mulai || frame >= akhir) return null;
  const pop = spring({ frame: frame - mulai, fps, config: { damping: 10 } });
  const hilang = interpolate(frame, [akhir - 8, akhir], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: hilang,
      }}
    >
      <div
        style={{
          transform: `scale(${pop}) rotate(-3deg)`,
          background: "white",
          color: WARNA.malam,
          fontFamily: FONT_TEGAS,
          fontWeight: 900,
          fontSize: 96,
          letterSpacing: 8,
          padding: "14px 56px",
          borderRadius: 28,
          border: `8px solid ${WARNA.biru}`,
          boxShadow: "0 12px 0 rgba(0,0,0,0.25)",
        }}
      >
        {teks}
      </div>
    </div>
  );
};

export const AyahDuluSekarang: React.FC<AyahDuluSekarangProps> = ({ labelDulu, labelSekarang }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tengah = Math.round(durationInFrames / 2);

  return (
    <AbsoluteFill style={{ background: WARNA.hijauLayar }}>
      {/* Bingkai putih tebal: bagian dalam tetap hijau → foto ayah tampil di situ */}
      <AbsoluteFill style={{ padding: 60 }}>
        <div style={{ flex: 1, border: "26px solid white", borderRadius: 40 }} />
      </AbsoluteFill>
      <Label teks={labelDulu} mulai={0} akhir={tengah} />
      <Label teks={labelSekarang} mulai={tengah} akhir={durationInFrames} />
      {/* Hati kecil di pojok bawah, berdetak */}
      <Hati
        ukuran={150}
        style={{
          position: "absolute",
          right: 100,
          bottom: 110,
          transform: `rotate(12deg) scale(${1 + 0.08 * Math.abs(Math.sin(frame / 8))})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ===== 3. PENUTUP =====
export type AyahPenutupProps = { pesan: string; tagar: string };

export const AyahPenutup: React.FC<AyahPenutupProps> = ({ pesan, tagar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = useMasukKeluar();
  const popHati = spring({ frame: frame - 6, fps, config: { damping: 9 } });

  return (
    <AbsoluteFill>
      <LatarSenja />
      <Bokeh jumlah={34} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity, textAlign: "center", padding: 60 }}>
        <Hati ukuran={170} style={{ transform: `scale(${popHati})`, marginBottom: 40 }} />
        <Naik mulai={14} style={{ fontFamily: FONT_TULISAN, fontSize: 140, color: WARNA.krem, lineHeight: 1.1 }}>
          {pesan}
        </Naik>
        <Naik
          mulai={34}
          style={{
            marginTop: 60,
            fontFamily: FONT_TEGAS,
            fontWeight: 900,
            fontSize: 64,
            color: "white",
            background: WARNA.biru,
            padding: "12px 44px",
            borderRadius: 999,
          }}
        >
          {tagar}
        </Naik>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
