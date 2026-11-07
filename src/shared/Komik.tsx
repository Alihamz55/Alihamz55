// Elemen tampilan bergaya komik yang dipakai semua episode
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_JUDUL, FONT_KOMIK } from "./font";

// Tanda kaget kuning (3 garis) versi 2D
export const SeruKuning: React.FC<{ ukuran?: number; putar?: number; style?: React.CSSProperties }> = ({
  ukuran = 1,
  putar = 0,
  style,
}) => (
  <div style={{ position: "absolute", width: 120 * ukuran, height: 120 * ukuran, transform: `rotate(${putar}deg)`, ...style }}>
    {[-40, 0, 40].map((r) => (
      <div
        key={r}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "50%",
          width: 22 * ukuran,
          height: 60 * ukuran,
          marginLeft: -11 * ukuran,
          background: "#ffd400",
          border: `${5 * ukuran}px solid #111`,
          borderRadius: 14 * ukuran,
          transformOrigin: "50% 160%",
          transform: `rotate(${r}deg) translateY(${-30 * ukuran}px)`,
        }}
      />
    ))}
  </div>
);

// Papan nama warung/tempat di bagian atas
export const PapanNama: React.FC<{ teks: string; opacity?: number }> = ({ teks, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 11 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 110, opacity }}>
      <div style={{ position: "relative", transform: `scale(${pop}) rotate(-1deg)` }}>
        <SeruKuning ukuran={0.9} putar={-50} style={{ left: -70, top: -55 }} />
        <div
          style={{
            background: "linear-gradient(#e63027, #b81d17)",
            border: "10px solid #f2b631",
            outline: "5px solid #7a1410",
            borderRadius: 26,
            padding: "14px 46px",
            fontFamily: FONT_JUDUL,
            fontSize: 80,
            color: "white",
            letterSpacing: 1,
            textShadow: "0 6px 0 #7a1410, 0 8px 14px rgba(0,0,0,0.35)",
            boxShadow: "0 14px 30px rgba(0,0,0,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          {teks}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Balon dialog bergaya komik. "ekor" menunjuk ke pembicara (kiri/kanan)
export const BalonKomik: React.FC<{
  teks: string;
  sorot?: string[];
  ekor: "kiri" | "kanan";
  frameLokal: number;
  durasi: number;
}> = ({ teks, sorot = [], ekor, frameLokal, durasi }) => {
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frameLokal, fps, config: { damping: 12, stiffness: 220 } });
  const kata = teks.split(" ");
  const tampil = Math.ceil(interpolate(frameLokal, [0, durasi * 0.55], [1, kata.length], { extrapolateRight: "clamp" }));
  const kiri = ekor === "kiri";

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 60 }}>
      <div style={{ position: "relative", width: 940, transform: `scale(${pop})`, transformOrigin: kiri ? "20% 0%" : "80% 0%" }}>
        {/* Ekor balon */}
        <div
          style={{
            position: "absolute",
            top: -44,
            [kiri ? "left" : "right"]: 170,
            width: 0,
            height: 0,
            borderLeft: "34px solid transparent",
            borderRight: "34px solid transparent",
            borderBottom: "52px solid #111",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -30,
            [kiri ? "left" : "right"]: 181,
            width: 0,
            height: 0,
            borderLeft: "23px solid transparent",
            borderRight: "23px solid transparent",
            borderBottom: "38px solid #fffaf0",
            zIndex: 2,
          }}
        />
        <SeruKuning ukuran={1.1} putar={-50} style={{ left: -20, top: -75, zIndex: 3 }} />
        <div
          style={{
            background: "#fffaf0",
            border: "8px solid #111",
            borderRadius: 70,
            padding: "34px 52px",
            fontFamily: FONT_KOMIK,
            fontSize: 78,
            lineHeight: 1.18,
            color: "#111",
            textAlign: "center",
            boxShadow: "0 16px 0 rgba(0,0,0,0.18)",
          }}
        >
          {kata.map((k, i) => (
            <span key={i} style={{ opacity: i < tampil ? 1 : 0, color: sorot.includes(k) ? "#e3261f" : "#111" }}>
              {k}{" "}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
