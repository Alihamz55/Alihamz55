import { AbsoluteFill, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { loadFont as loadBungee } from "@remotion/google-fonts/Bungee";
import { loadFont as loadMonoton } from "@remotion/google-fonts/Monoton";
import { Kota } from "./Kota";

const FONT_KECIL = loadBungee("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const FONT_JUDUL = loadMonoton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

// Cover art persegi 3000x3000 untuk Spotify/DistroKid.
// Aturan toko musik: jangan taruh link, @akun medsos, atau logo toko di cover.
export const Cover: React.FC<{ subjudul: string }> = ({ subjudul }) => {
  const { width, height } = useVideoConfig();
  const s = width / 1000; // skala ukuran teks
  const glow = (w: string) => `0 0 ${8 * s}px ${w}, 0 0 ${24 * s}px ${w}, 0 0 ${60 * s}px ${w}, 0 ${4 * s}px 0 #000`;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0414" }}>
      <ThreeCanvas width={width} height={height} camera={{ fov: 55, position: [0, 1.9, 7.5], rotation: [0.06, 0, 0] }}>
        <Kota />
      </ThreeCanvas>
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) ${2 * s}px, transparent ${2 * s}px, transparent ${5 * s}px)`,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 * s }}>
        <div style={{ fontFamily: FONT_JUDUL, fontSize: 150 * s, color: "#fff", textAlign: "center", lineHeight: 1.05, textShadow: glow("#ff2bd6") }}>
          NEON
          <br />
          STREETS
        </div>
      </AbsoluteFill>
      {subjudul && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 55 * s }}>
          <div style={{ fontFamily: FONT_KECIL, fontSize: 44 * s, color: "#ffd23f", letterSpacing: 4 * s, textShadow: glow("#ff8a00") }}>
            {subjudul}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
