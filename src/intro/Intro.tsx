import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT_JUDUL } from "../shared/font";

// Motion graphic intro channel "Nasyid Mungil" (9:16, 8 detik @30fps)
// Urutan: latar & sorot lampu → dua karakter muncul → judul per huruf
// → tagline → tombol Subscribe berdenyut → semua mengecil & keluar.

export const INTRO_DURASI = 240;

const UNGU_TERANG = "#7b5cff";
const UNGU = "#3a1f9e";
const UNGU_GELAP = "#1a0b4d";
const PINK = "#ff5fa8";
const BIRU = "#5aa9ff";
const EMAS = "#ffd76a";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Latar: React.FC = () => {
  const frame = useCurrentFrame();
  const putar = frame * 0.25;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% ${38 + Math.sin(frame / 40) * 3}%, ${UNGU_TERANG} 0%, ${UNGU} 50%, ${UNGU_GELAP} 100%)`,
      }}
    >
      {/* Sinar berputar pelan di belakang */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          width: 2600,
          height: 2600,
          marginLeft: -1300,
          marginTop: -1300,
          transform: `rotate(${putar}deg)`,
          background: `repeating-conic-gradient(rgba(255,255,255,0.07) 0deg 10deg, transparent 10deg 24deg)`,
          maskImage: "radial-gradient(circle, black 15%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 15%, transparent 60%)",
        }}
      />
    </AbsoluteFill>
  );
};

const SorotLampu: React.FC = () => {
  const frame = useCurrentFrame();
  const masuk = interpolate(frame, [0, 25], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ayun = Math.sin(frame / 22) * 6;
  const beam = (sisi: "kiri" | "kanan") => {
    const tanda = sisi === "kiri" ? -1 : 1;
    return (
      <div
        style={{
          position: "absolute",
          top: -200,
          [sisi === "kiri" ? "left" : "right"]: 60,
          width: 340,
          height: 1900,
          transformOrigin: "50% 0%",
          transform: `rotate(${tanda * (22 + ayun * tanda)}deg) scaleY(${masuk})`,
          background: "linear-gradient(rgba(255,220,140,0.55), rgba(255,220,140,0))",
          filter: "blur(14px)",
          opacity: masuk,
        }}
      />
    );
  };
  return (
    <AbsoluteFill>
      {beam("kiri")}
      {beam("kanan")}
    </AbsoluteFill>
  );
};

const Partikel: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      {new Array(40).fill(0).map((_, i) => {
        const x = random(`x${i}`) * width;
        const kecepatan = 1.5 + random(`v${i}`) * 3;
        const y = height - ((random(`y${i}`) * height + frame * kecepatan) % (height + 100));
        const ukuran = 6 + random(`s${i}`) * 18;
        const kedip = 0.4 + 0.6 * Math.abs(Math.sin(frame / (8 + random(`k${i}`) * 12) + i));
        const muncul = interpolate(frame, [i * 0.8, i * 0.8 + 15], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 20 + i) * 20,
              top: y,
              width: ukuran,
              height: ukuran,
              borderRadius: "50%",
              background: "#fff3c4",
              boxShadow: `0 0 ${ukuran}px ${EMAS}`,
              opacity: kedip * muncul,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Bintang: React.FC<{ x: number; y: number; mulai: number; ukuran: number }> = ({ x, y, mulai, ukuran }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - mulai, fps, config: { damping: 8, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: ukuran,
        color: EMAS,
        textShadow: `0 0 30px ${EMAS}`,
        transform: `scale(${s}) rotate(${(frame - mulai) * 2}deg)`,
      }}
    >
      ✦
    </div>
  );
};

const Foto: React.FC<{
  src: string;
  warna: string;
  mulai: number;
  dariKiri: boolean;
  posX: string;
  geserGambar: string;
}> = ({ src, warna, mulai, dariKiri, posX, geserGambar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - mulai, fps, config: { damping: 11, stiffness: 90 } });
  const geserX = interpolate(s, [0, 1], [dariKiri ? -700 : 700, 0]);
  const goyang = Math.sin((frame - mulai) / 14 + (dariKiri ? 0 : 2)) * 14;
  const ukuran = 470;
  return (
    <div
      style={{
        position: "absolute",
        left: posX,
        top: 520 + goyang,
        width: ukuran,
        height: ukuran,
        marginLeft: -ukuran / 2,
        transform: `translateX(${geserX}px) scale(${s}) rotate(${(1 - s) * (dariKiri ? -40 : 40)}deg)`,
        borderRadius: "50%",
        border: "14px solid #fff",
        boxShadow: `0 0 0 12px ${warna}, 0 0 70px rgba(255,200,120,0.75)`,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ position: "absolute", width: 1120, left: geserGambar, top: -380 }}
      />
    </div>
  );
};

const Judul: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kata = ["Nasyid", "Mungil"];
  let indeks = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 1060,
        width: "100%",
        textAlign: "center",
        fontFamily: FONT_JUDUL,
        lineHeight: 1.0,
      }}
    >
      {kata.map((k, baris) => (
        <div key={k} style={{ fontSize: baris === 0 ? 190 : 210 }}>
          {k.split("").map((huruf) => {
            const i = indeks++;
            const mulai = 55 + i * 3;
            const s = spring({ frame: frame - mulai, fps, config: { damping: 9, stiffness: 140 } });
            const lompat = Math.sin((frame - mulai) / 9 + i * 0.6) * 6 * Math.min(1, Math.max(0, (frame - mulai) / 30));
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  color: baris === 0 ? "#fff" : EMAS,
                  transform: `translateY(${(1 - s) * 260 + lompat}px) scale(${s})`,
                  opacity: Math.min(1, s * 1.5),
                  WebkitTextStroke: `10px ${baris === 0 ? PINK : "#c2410c"}`,
                  paintOrder: "stroke fill",
                  textShadow: "0 14px 0 rgba(0,0,0,0.25)",
                }}
              >
                {huruf}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Tagline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 100, fps, config: { damping: 14 } });
  const lebar = interpolate(s, [0, 1], [0, 100]);
  return (
    <div
      style={{
        position: "absolute",
        top: 1520,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: PINK,
          border: "8px solid #fff",
          borderRadius: 60,
          padding: "12px 50px",
          clipPath: `inset(0 ${50 - lebar / 2}% 0 ${50 - lebar / 2}% round 60px)`,
          fontFamily: FONT_JUDUL,
          fontSize: 66,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        Lagu & Doa untuk Si Kecil
      </div>
    </div>
  );
};

const Subscribe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 130, fps, config: { damping: 10 } });
  const denyut = 1 + Math.max(0, Math.sin((frame - 150) / 5)) * 0.06 * (frame > 150 ? 1 : 0);
  // Kursor "mengklik" tombol
  const kursorMasuk = interpolate(frame, [150, 168], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const klik = frame >= 170 && frame < 176 ? 0.9 : 1;
  const sudahKlik = frame >= 172;
  return (
    <div
      style={{
        position: "absolute",
        top: 1680,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        transform: `scale(${s * denyut * klik})`,
      }}
    >
      <div
        style={{
          position: "relative",
          background: sudahKlik ? "#6b7280" : "#ff1f3d",
          color: "#fff",
          fontFamily: FONT_JUDUL,
          fontSize: 64,
          padding: "16px 56px",
          borderRadius: 24,
          boxShadow: "0 10px 0 rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <span style={{ fontSize: 50 }}>{sudahKlik ? "🔔" : "▶"}</span>
        {sudahKlik ? "Subscribed" : "Subscribe"}
        {frame >= 150 && (
          <div
            style={{
              position: "absolute",
              right: -30 - kursorMasuk * 300,
              bottom: -60 - kursorMasuk * 200,
              fontSize: 90,
              transform: `scale(${klik})`,
              filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.4))",
            }}
          >
            👆
          </div>
        )}
      </div>
    </div>
  );
};

export const Intro: React.FC<{ pakaiMusik: boolean }> = ({ pakaiMusik }) => {
  const frame = useCurrentFrame();
  // Keluar: semua mengecil ke tengah lalu fade
  const keluar = interpolate(frame, [205, 235], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  // Kilatan putih di awal
  const kilat = interpolate(frame, [0, 10], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: UNGU_GELAP }}>
      <AbsoluteFill style={{ transform: `scale(${1 - keluar * 0.3})`, opacity: 1 - keluar, borderRadius: keluar * 200, overflow: "hidden" }}>
        <Latar />
        <SorotLampu />
        <Partikel />
        <Bintang x={110} y={300} mulai={40} ukuran={110} />
        <Bintang x={860} y={380} mulai={48} ukuran={80} />
        <Bintang x={880} y={1000} mulai={70} ukuran={70} />
        <Bintang x={80} y={1020} mulai={78} ukuran={90} />
        <Foto src="doa/karakter-laki.png" warna={BIRU} mulai={20} dariKiri={false} posX="68%" geserGambar="-330px" />
        <Foto src="doa/karakter.png" warna={PINK} mulai={30} dariKiri posX="32%" geserGambar="-318px" />
        <Judul />
        <Tagline />
        <Subscribe />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: kilat }} />
      {pakaiMusik && (
        <Audio
          src={staticFile("doa/lagu.mp3")}
          volume={(f) => interpolate(f, [0, 15, INTRO_DURASI - 40, INTRO_DURASI], [0, 0.8, 0.8, 0], clamp)}
        />
      )}
    </AbsoluteFill>
  );
};
