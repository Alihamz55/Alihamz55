import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_JUDUL } from "../shared/font";

// Caption kertas di bawah layar. Kata yang sedang "dibaca" berwarna pink,
// kata yang belum dibaca masih samar — membantu anak mengikuti bacaan.
export const CaptionCerita: React.FC<{ teks: string; durasi: number }> = ({ teks, durasi }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!teks) return null;

  const kata = teks.split(" ");
  const bobot = kata.map((k) => k.length + 2);
  const total = bobot.reduce((a, b) => a + b, 0);
  const awal = 8;
  const akhir = durasi - 20;
  let jalan = awal;
  const mulaiKata = bobot.map((b) => {
    const m = jalan;
    jalan += (b / total) * (akhir - awal);
    return m;
  });

  const masuk = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 170,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - masuk) * 200}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 40px",
          background: "#fff8e7",
          border: "6px solid #fff",
          borderRadius: 44,
          padding: "26px 44px",
          boxShadow: "0 12px 0 rgba(0,0,0,0.18), 0 20px 40px rgba(0,0,0,0.25)",
          fontFamily: FONT_JUDUL,
          fontSize: 60,
          lineHeight: 1.25,
          textAlign: "center",
        }}
      >
        {kata.map((k, i) => {
          const mulai = mulaiKata[i];
          const berikut = mulaiKata[i + 1] ?? akhir;
          const aktif = frame >= mulai && frame < berikut;
          const sudah = frame >= mulai;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 16,
                color: aktif ? "#ff4f9a" : sudah ? "#3b2a1a" : "rgba(59,42,26,0.3)",
                transform: `scale(${aktif ? 1.08 : 1})`,
              }}
            >
              {k}
            </span>
          );
        })}
      </div>
    </div>
  );
};
