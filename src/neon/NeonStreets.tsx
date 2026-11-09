import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { loadFont as loadBungee } from "@remotion/google-fonts/Bungee";
import { loadFont as loadMonoton } from "@remotion/google-fonts/Monoton";
import { Kota } from "./Kota";
import { DURASI_DETIK, LIRIK, hentakan } from "./lirik";

const FONT_LIRIK = loadBungee("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const FONT_JUDUL = loadMonoton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const glow = (warna: string) =>
  `0 0 8px ${warna}, 0 0 24px ${warna}, 0 0 48px ${warna}, 0 4px 0 #000`;

export const NeonStreets: React.FC<{ pakaiLagu: boolean }> = ({ pakaiLagu }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const detik = frame / fps;
  const bass = hentakan(detik);

  // Kamera goyang kecil tiap ketukan bass (efek "shake")
  const goyangY = 1.6 + bass * 0.12;
  const goyangX = Math.sin(detik * 0.7) * 0.6;

  const baris = LIRIK.find((l) => detik >= l.mulai && detik < l.selesai);
  const masuk = baris ? spring({ frame: frame - baris.mulai * fps, fps, config: { damping: 12 } }) : 0;

  const judulOpacity = interpolate(detik, [0.2, 0.8, 2.1, 2.6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const akhirOpacity = interpolate(detik, [13.1, 13.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeHitam = interpolate(detik, [0, 0.4, DURASI_DETIK - 0.5, DURASI_DETIK], [1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0414" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 62, position: [0, 2.6, 8.5], rotation: [-0.12, 0, 0] }}>
        <group position={[-goyangX, 1.6 - goyangY, 0]}>
          <Kota />
        </group>
      </ThreeCanvas>

      {/* Efek VHS: garis-garis + vignette */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)",
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />

      {/* Judul pembuka */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: judulOpacity }}>
        <div style={{ fontFamily: FONT_JUDUL, fontSize: 150, color: "#fff", textAlign: "center", lineHeight: 1.1, textShadow: glow("#ff2bd6") }}>
          NEON
          <br />
          STREETS
        </div>
      </AbsoluteFill>

      {/* Lirik hook */}
      {baris && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 1250 }}>
          <div
            style={{
              fontFamily: FONT_LIRIK,
              fontSize: 84,
              color: "#fff",
              textAlign: "center",
              padding: "0 70px",
              lineHeight: 1.15,
              transform: `scale(${0.6 + masuk * 0.4 + bass * 0.04})`,
              opacity: masuk,
              textShadow: glow("#00e5ff"),
            }}
          >
            {baris.teks}
          </div>
        </AbsoluteFill>
      )}

      {/* Penutup */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: akhirOpacity }}>
        <div style={{ fontFamily: FONT_JUDUL, fontSize: 130, color: "#fff", textAlign: "center", lineHeight: 1.1, textShadow: glow("#ff8a00") }}>
          NEON
          <br />
          STREETS
        </div>
        <div style={{ fontFamily: FONT_LIRIK, fontSize: 46, color: "#ffd23f", marginTop: 40, textShadow: glow("#ff2bd6") }}>
          90s WEST COAST G-FUNK
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeHitam }} />

      {/* Taruh lagu dari Flow di public/neon/lagu.mp3, lalu render dengan pakaiLagu=true */}
      {pakaiLagu && <Audio src={staticFile("neon/lagu.mp3")} />}
    </AbsoluteFill>
  );
};
