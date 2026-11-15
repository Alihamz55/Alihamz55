import React from "react";
import { random, useCurrentFrame } from "remotion";

// Potongan "kertas" yang bisa dipakai ulang untuk semua seri Kisah Nabi.
// Gaya diorama: bentuk datar + bayangan tebal supaya terlihat seperti kertas berlapis.

export const BAYANGAN =
  "drop-shadow(0 10px 0 rgba(0,0,0,0.16)) drop-shadow(0 18px 22px rgba(0,0,0,0.14))";

// Bukit bergelombang selebar layar. `geser` = kecepatan gerak parallax.
export const Bukit: React.FC<{
  y: number;
  warna: string;
  amp?: number;
  gel?: number;
  fase?: number;
  geser?: number;
}> = ({ y, warna, amp = 40, gel = 3, fase = 0, geser = 0 }) => {
  const frame = useCurrentFrame();
  const f = fase + frame * geser;
  let d = `M -20 1960 L -20 ${y}`;
  for (let x = -20; x <= 1100; x += 20) {
    const t = (x / 1080) * Math.PI * gel;
    const yy = y + Math.sin(t + f) * amp + Math.sin(t * 2.3 + f * 1.7) * amp * 0.3;
    d += ` L ${x} ${yy.toFixed(1)}`;
  }
  d += " L 1100 1960 Z";
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: BAYANGAN }}>
      <path d={d} fill={warna} />
    </svg>
  );
};

export const Bintang: React.FC<{ jumlah?: number; tinggi?: number; opacity?: number }> = ({
  jumlah = 60,
  tinggi = 1200,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(jumlah).fill(0).map((_, i) => {
        const s = 3 + random(`bs${i}`) * 7;
        const kedip = 0.35 + 0.65 * Math.abs(Math.sin(frame / (10 + random(`bk${i}`) * 20) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`bx${i}`) * 1080,
              top: random(`by${i}`) * tinggi,
              width: s,
              height: s,
              borderRadius: "50%",
              background: "#fff6d5",
              boxShadow: `0 0 ${s * 2}px #ffe08a`,
              opacity: kedip * opacity,
            }}
          />
        );
      })}
    </>
  );
};

export const Awan: React.FC<{ x: number; y: number; skala?: number; opacity?: number }> = ({
  x,
  y,
  skala = 1,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 300,
      height: 130,
      transform: `scale(${skala})`,
      opacity,
      filter: "drop-shadow(0 8px 0 rgba(0,0,0,0.08))",
    }}
  >
    {[
      [0, 50, 120],
      [70, 0, 150],
      [170, 30, 120],
    ].map(([l, t, s], i) => (
      <div key={i} style={{ position: "absolute", left: l, top: t, width: s, height: s, borderRadius: "50%", background: "#fff" }} />
    ))}
    <div style={{ position: "absolute", left: 30, top: 80, width: 250, height: 50, borderRadius: 25, background: "#fff" }} />
  </div>
);

// Pohon kertas. (x, y) = titik pangkal batang (tengah bawah).
export const Pohon: React.FC<{
  x: number;
  y: number;
  skala?: number;
  daun?: string;
  buah?: string;
  cahaya?: number;
}> = ({ x, y, skala = 1, daun = "#3fa34d", buah, cahaya = 0 }) => {
  const frame = useCurrentFrame();
  const goyang = Math.sin(frame / 25 + x) * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 440,
        width: 300,
        height: 440,
        transform: `scale(${skala})`,
        transformOrigin: "50% 100%",
      }}
    >
      {cahaya > 0 && (
        <div
          style={{
            position: "absolute",
            left: -160,
            top: -150,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,230,140,0.9) 0%, rgba(255,215,106,0.35) 40%, transparent 70%)",
            opacity: cahaya * (0.8 + 0.2 * Math.sin(frame / 8)),
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: 125,
          bottom: 0,
          width: 50,
          height: 230,
          borderRadius: 18,
          background: "#8b5a2b",
          filter: BAYANGAN,
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${goyang}deg)`, transformOrigin: "50% 75%", filter: BAYANGAN }}>
        {[
          [150, 140, 135],
          [70, 200, 95],
          [230, 200, 95],
        ].map(([cx, cy, r], i) => (
          <div
            key={i}
            style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: daun }}
          />
        ))}
        <div style={{ position: "absolute", left: 80, top: 40, width: 110, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }} />
        {buah &&
          [
            [95, 150],
            [190, 110],
            [215, 220],
            [120, 245],
            [60, 205],
            [160, 190],
          ].map(([l, t], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: l,
                top: t,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: buah,
                boxShadow: cahaya ? `0 0 18px ${buah}` : "inset -5px -5px 0 rgba(0,0,0,0.15)",
              }}
            />
          ))}
      </div>
    </div>
  );
};
