import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AKHIR_DIALOG, INTRO_DETIK, FPS, jadwal, kamus, pembicaraDiFrame } from "./naskah";

const FONT = "Arial, Helvetica, sans-serif";
const WARNA = { penjual: "#2e7d32", jaksel: "#d81b60" };
const NAMA = { penjual: "DAENG (Penjual)", jaksel: "ANAK JAKSEL" };

// ===== PEMBUKAAN =====
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const akhir = INTRO_DETIK * FPS;
  if (frame >= akhir) return null;

  const pop = spring({ frame, fps, config: { damping: 10 } });
  const pop2 = spring({ frame: frame - 12, fps, config: { damping: 10 } });
  const hilang = interpolate(frame, [akhir - 10, akhir], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: hilang, fontFamily: FONT, background: "rgba(0,0,0,0.35)" }}>
      <div style={{ transform: `scale(${pop})`, background: "#111", color: "#ffd166", padding: "16px 40px", borderRadius: 20, fontSize: 60, fontWeight: 900 }}>
        EPISODE 12
      </div>
      <div
        style={{
          transform: `scale(${pop2})`,
          marginTop: 30,
          color: "white",
          fontSize: 92,
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.1,
          WebkitTextStroke: "6px black",
          paintOrder: "stroke",
        }}
      >
        JAKSEL vs
        <br />
        BAHASA MAKASSAR
      </div>
    </AbsoluteFill>
  );
};

// ===== PAPAN NAMA WARUNG (atas) =====
export const PapanNama: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [INTRO_DETIK * FPS - 5, INTRO_DETIK * FPS + 10, AKHIR_DIALOG, AKHIR_DIALOG + 10], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 170, opacity, fontFamily: FONT }}>
      <div style={{ background: "#c0392b", color: "white", fontSize: 54, fontWeight: 900, padding: "12px 36px", borderRadius: 14, border: "6px solid #fff3", letterSpacing: 2 }}>
        WARUNG COTO DAENG
      </div>
    </AbsoluteFill>
  );
};

// ===== BALON DIALOG (bawah) =====
export const BalonDialog: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = pembicaraDiFrame(frame);
  if (!b) return null;

  const lokal = frame - b.mulai;
  const pop = spring({ frame: lokal, fps, config: { damping: 14, stiffness: 200 } });
  const kata = b.teks.split(" ");
  // Kata muncul satu per satu (selesai di 60% durasi baris)
  const kataTampil = Math.ceil(interpolate(lokal, [0, b.durasi * 0.6], [1, kata.length], { extrapolateRight: "clamp" }));
  const kiri = b.siapa === "penjual";

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: kiri ? "flex-start" : "flex-end", padding: "0 50px 300px", fontFamily: FONT }}>
      <div style={{ transform: `scale(${pop})`, transformOrigin: kiri ? "bottom left" : "bottom right", maxWidth: 900 }}>
        <div style={{ display: "inline-block", background: WARNA[b.siapa], color: "white", fontSize: 38, fontWeight: 900, padding: "8px 22px", borderRadius: "14px 14px 0 0", marginLeft: kiri ? 30 : 0, float: kiri ? "none" : "right", marginRight: kiri ? 0 : 30 }}>
          {NAMA[b.siapa]}
        </div>
        <div style={{ clear: "both", background: "white", border: `8px solid ${WARNA[b.siapa]}`, borderRadius: 36, padding: "28px 38px", fontSize: 70, fontWeight: 900, lineHeight: 1.15, color: "#111", boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}>
          {kata.map((k, i) => (
            <span key={i} style={{ opacity: i < kataTampil ? 1 : 0, color: b.sorot?.includes(k) ? "#e65100" : "#111" }}>
              {k}{" "}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
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
  const latar = interpolate(lokal, [0, 12], [0, 0.85], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `rgba(10,10,30,${latar})`, justifyContent: "center", alignItems: "center", fontFamily: FONT, padding: 60 }}>
      <div style={{ transform: `scale(${spring({ frame: lokal, fps })})`, color: "#ffd166", fontSize: 92, fontWeight: 900, marginBottom: 50 }}>
        KAMUS EPISODE 12
      </div>
      {baris.map((k, i) => {
        const s = spring({ frame: lokal - 12 - i * 10, fps, config: { damping: 12 } });
        return (
          <div key={k.kata} style={{ transform: `translateX(${(1 - s) * -1200}px)`, width: "100%", background: "white", borderLeft: `20px solid ${k.warna}`, borderRadius: 24, padding: "22px 34px", marginBottom: 26 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: k.warna }}>{k.label}</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: "#111", lineHeight: 1.15 }}>
              {k.kata} <span style={{ color: "#777" }}>=</span> <span style={{ fontWeight: 700 }}>{k.arti}</span>
            </div>
          </div>
        );
      })}
      <div style={{ opacity: interpolate(lokal, [60, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), marginTop: 50, color: "white", fontSize: 70, fontWeight: 900, textAlign: "center" }}>
        Bahasa daerahmu apa?
        <br />
        Tulis di komentar!
      </div>
    </AbsoluteFill>
  );
};

export { jadwal };
