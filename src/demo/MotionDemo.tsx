import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_JUDUL } from "../shared/font";

// Contoh motion graphic 5 detik di atas animasi "Asep & Ucup Naik Gunung" (tanpa tulisan bawaan).
// Baris dialog: [mulai, selesai, teks] dalam frame lokal (30 fps).
const BARIS: [number, number, string][] = [
  [0, 46, "PO-POCONG!"],
  [53, 152, "IYA. HP SAYA LOWBAT. MAU LIVE TIKTOK."],
];

type Potongan = { kata: string[]; mulaiKata: number[] };

// Bagi kalimat jadi potongan maks 2 kata (<= 12 huruf); waktu tiap kata sebanding panjangnya.
const potong = (a: number, b: number, teks: string): Potongan[] => {
  const W = teks.split(" ");
  const bobot = W.map((w) => w.replace(/[^A-Z0-9]/g, "").length + 2);
  const total = bobot.reduce((x, y) => x + y, 0);
  let acc = 0;
  const mulai = W.map((_, k) => { const t = a + ((b - a) * acc) / total; acc += bobot[k]; return t; });
  const hasil: Potongan[] = [];
  let cur: number[] = [], len = 0;
  W.forEach((w, k) => {
    if (cur.length && (len + w.length > 12 || cur.length >= 2)) { hasil.push({ kata: cur.map((i) => W[i]), mulaiKata: cur.map((i) => mulai[i]) }); cur = []; len = 0; }
    cur.push(k); len += w.length + 1;
  });
  hasil.push({ kata: cur.map((i) => W[i]), mulaiKata: cur.map((i) => mulai[i]) });
  return hasil;
};

const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  for (const [a, b, teks] of BARIS) {
    if (f < a || f > b + 6) continue;
    const pts = potong(a, b, teks);
    let ci = 0;
    pts.forEach((p, i) => { if (f >= p.mulaiKata[0]) ci = i; });
    const p = pts[ci];
    const t0 = p.mulaiKata[0];
    const masuk = spring({ frame: f - t0, fps, config: { damping: 11, stiffness: 180, mass: 0.6 } });
    const keluar = interpolate(f, [b + 1, b + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    let aktif = 0;
    p.mulaiKata.forEach((m, i) => { if (f >= m) aktif = i; });
    return (
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", top: 1150 }}>
        <div style={{
          transform: `translateY(${(1 - masuk) * 40}px) scale(${0.7 + 0.3 * masuk})`, opacity: keluar,
          background: "rgba(16,10,26,0.82)", border: "6px solid #ffd84a", borderRadius: 44, padding: "14px 44px 18px",
          boxShadow: "0 14px 0 rgba(0,0,0,0.35)", display: "flex", gap: 26,
        }}>
          {p.kata.map((w, i) => {
            const on = i === aktif;
            const bump = spring({ frame: f - p.mulaiKata[i], fps, config: { damping: 9, stiffness: 260, mass: 0.5 } });
            const s = on ? 1 + 0.16 * bump - 0.08 * Math.min(1, Math.max(0, (f - p.mulaiKata[i] - 6) / 6)) : 1;
            return (
              <span key={i} style={{
                fontFamily: FONT_JUDUL, fontSize: 104, lineHeight: 1.05, letterSpacing: 1,
                color: on ? "#ffd84a" : "#ffffff", display: "inline-block", transform: `scale(${s})`,
                WebkitTextStroke: "3px #120c10", textShadow: "0 6px 0 #120c10",
              }}>{w}</span>
            );
          })}
        </div>
      </AbsoluteFill>
    );
  }
  return null;
};

// Kartu "POCONG!": jatuh dari atas dengan pegas, goyang, sinar di belakang.
const KartuPocong: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < 2 || f > 50) return null;
  const s = spring({ frame: f - 2, fps, config: { damping: 8, stiffness: 160, mass: 0.7 } });
  const keluar = interpolate(f, [44, 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const goyang = Math.sin(f * 0.9) * 4 * Math.max(0, 1 - (f - 2) / 26);
  const sinar = interpolate(f, [2, 50], [0, 60]);
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 250, opacity: keluar }}>
      <div style={{ position: "relative", transform: `translateY(${(1 - s) * -420}px) rotate(${-4 + goyang}deg) scale(${0.6 + 0.4 * s})` }}>
        <div style={{
          position: "absolute", left: "50%", top: "50%", width: 900, height: 900, marginLeft: -450, marginTop: -450, borderRadius: "50%",
          background: "repeating-conic-gradient(rgba(255,216,74,0.55) 0deg 10deg, transparent 10deg 24deg)", transform: `rotate(${sinar}deg)`,
          WebkitMaskImage: "radial-gradient(circle, black 30%, transparent 68%)", maskImage: "radial-gradient(circle, black 30%, transparent 68%)",
        }} />
        <div style={{
          position: "relative", background: "#ffffff", border: "10px solid #120c10", borderRadius: 34, padding: "10px 60px 22px",
          boxShadow: "0 18px 0 #c0302c", fontFamily: FONT_JUDUL, fontSize: 170, color: "#c0302c", letterSpacing: 4,
        }}>POCONG!</div>
      </div>
    </AbsoluteFill>
  );
};

// Lencana "LIVE TIKTOK": meluncur dari kanan, titik merah berdenyut.
const LencanaLive: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = 112;
  if (f < a) return null;
  const s = spring({ frame: f - a, fps, config: { damping: 12, stiffness: 170 } });
  const denyut = 0.75 + 0.25 * Math.sin((f - a) * 0.5);
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 170 }}>
      <div style={{
        transform: `translateX(${(1 - s) * 700}px) rotate(-3deg)`, display: "flex", alignItems: "center", gap: 26,
        background: "#e8344a", border: "9px solid #120c10", borderRadius: 999, padding: "16px 56px 20px 40px", boxShadow: "0 14px 0 rgba(0,0,0,0.35)",
      }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ffffff", transform: `scale(${denyut})`, boxShadow: "0 0 0 10px rgba(255,255,255,0.3)" }} />
        <span style={{ fontFamily: FONT_JUDUL, fontSize: 118, color: "#ffffff", WebkitTextStroke: "3px #120c10" }}>LIVE TIKTOK</span>
      </div>
    </AbsoluteFill>
  );
};

export const MotionDemo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // "punch zoom" saat teriakan: video membesar sedikit lalu kembali dengan pegas
  const punch = spring({ frame: f, fps, config: { damping: 10, stiffness: 200 } });
  const zoom = 1.1 - 0.1 * punch;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo src={staticFile("demo/pocong-clean.mp4")} />
      </AbsoluteFill>
      <KartuPocong />
      <LencanaLive />
      <Subtitle />
    </AbsoluteFill>
  );
};
