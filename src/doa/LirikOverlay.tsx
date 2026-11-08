import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadAmiri } from "@remotion/google-fonts/Amiri";
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";
import { lirik } from "./lirik";

const ARAB = loadAmiri("normal", { weights: ["700"], subsets: ["arabic", "latin"] }).fontFamily;
const LATIN = loadNunito("italic", { weights: ["600"], subsets: ["latin"] }).fontFamily;

export const LirikOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const detik = frame / fps;
  const b = lirik.find((l) => detik >= l.mulai && detik < l.selesai && l.arab.trim() !== "");

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      {/* gradasi gelap di bawah supaya lirik terbaca */}
      <AbsoluteFill style={{ background: "linear-gradient(transparent 62%, rgba(20,8,50,0.75) 100%)" }} />
      {b && <Baris key={b.mulai} {...b} detik={detik} />}
    </AbsoluteFill>
  );
};

const Baris: React.FC<{ mulai: number; selesai: number; arab: string; terjemahan?: string; detik: number }> = ({ mulai, selesai, arab, terjemahan, detik }) => {
  const masuk = interpolate(detik, [mulai, mulai + 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keluar = interpolate(detik, [selesai - 0.4, selesai], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = Math.min(masuk, keluar);
  return (
    <div style={{ position: "absolute", bottom: 170, width: "100%", padding: "0 60px", textAlign: "center", opacity: o, transform: `translateY(${(1 - masuk) * 30}px)` }}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: ARAB,
          fontSize: 92,
          lineHeight: 1.6,
          color: "#fff6dc",
          textShadow: "0 0 18px rgba(255,210,120,0.85), 0 0 40px rgba(255,150,200,0.6), 0 4px 8px rgba(0,0,0,0.6)",
        }}
      >
        {arab}
      </div>
      {terjemahan && (
        <div style={{ fontFamily: LATIN, fontStyle: "italic", fontSize: 40, color: "#f3e6ff", marginTop: 6, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {terjemahan}
        </div>
      )}
    </div>
  );
};
