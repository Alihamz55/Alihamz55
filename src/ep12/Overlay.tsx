import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AKHIR_DIALOG, INTRO_DETIK, FPS, kamus, pembicaraDiFrame } from "./naskah";
import { BalonKomik, PapanNama } from "../shared/Komik";
import { JudulSeriJaksel } from "../shared/JudulEpisode";
import { FONT_JUDUL, FONT_KOMIK } from "../shared/font";

const WARNA = { penjual: "#d62828", jaksel: "#141414" };

// ===== PEMBUKAAN =====
export const Intro: React.FC = () => <JudulSeriJaksel episode={12} bahasa="Makassar" durasi={INTRO_DETIK * FPS} />;

export const PapanWarung: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [AKHIR_DIALOG, AKHIR_DIALOG + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <PapanNama teks="WARUNG COTO DAENG" opacity={opacity} />;
};

// ===== BALON DIALOG =====
export const BalonDialog: React.FC = () => {
  const frame = useCurrentFrame();
  const b = pembicaraDiFrame(frame);
  if (!b) return null;
  return (
    <BalonKomik
      key={b.mulai}
      teks={b.teks}
      sorot={b.sorot}
      ekor={b.siapa === "penjual" ? "kiri" : "kanan"}
      frameLokal={frame - b.mulai}
      durasi={b.durasi}
    />
  );
};

// ===== PENUTUP: KAMUS EPISODE INI =====
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lokal = frame - AKHIR_DIALOG - 10;
  if (lokal < 0) return null;

  const baris = [
    ...kamus.makassar.map((k) => ({ ...k, label: "MAKASSAR", warna: WARNA.penjual })),
    ...kamus.jaksel.map((k) => ({ ...k, label: "JAKSEL", warna: WARNA.jaksel })),
  ];
  const latar = interpolate(lokal, [0, 12], [0, 0.82], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `rgba(20,10,5,${latar})`, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ transform: `scale(${spring({ frame: lokal, fps })}) rotate(-2deg)`, background: "#ffd400", border: "7px solid #111", borderRadius: 24, padding: "8px 36px", color: "#111", fontSize: 92, fontFamily: FONT_JUDUL, marginBottom: 50 }}>
        KAMUS EPISODE 12
      </div>
      {baris.map((k, i) => {
        const s = spring({ frame: lokal - 12 - i * 10, fps, config: { damping: 12 } });
        return (
          <div key={k.kata} style={{ transform: `translateX(${(1 - s) * -1200}px)`, width: "100%", background: "#fffaf0", border: "7px solid #111", borderLeft: `26px solid ${k.warna}`, borderRadius: 34, padding: "20px 34px", marginBottom: 28 }}>
            <div style={{ fontSize: 38, fontFamily: FONT_JUDUL, color: k.warna }}>{k.label}</div>
            <div style={{ fontSize: 70, fontFamily: FONT_KOMIK, color: "#111", lineHeight: 1.2 }}>
              <span style={{ color: "#e3261f" }}>{k.kata}</span> = {k.arti}
            </div>
          </div>
        );
      })}
      <div style={{ opacity: interpolate(lokal, [60, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), marginTop: 50, color: "white", fontSize: 78, fontFamily: FONT_JUDUL, textAlign: "center", WebkitTextStroke: "8px #111", paintOrder: "stroke" }}>
        Bahasa daerahmu apa?
        <br />
        <span style={{ color: "#ffd400" }}>Tulis di komentar!</span>
      </div>
    </AbsoluteFill>
  );
};
