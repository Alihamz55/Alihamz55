import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadAmiri } from "@remotion/google-fonts/Amiri";
import { FONT_JUDUL } from "../../shared/font";
import { Awan, BAYANGAN, Bintang, Bukit, Pohon } from "../kertas";
import { DOA_ARAB, DOA_ARTI, DOA_SUMBER } from "./naskah";

const FONT_ARAB = loadAmiri("normal", { weights: ["700"], subsets: ["arabic"] }).fontFamily;

type P = { d: number }; // d = durasi adegan (frame)

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const UNGU = "radial-gradient(circle at 50% 35%, #7b5cff 0%, #3a1f9e 55%, #1a0b4d 100%)";
const PINK = "#ff5fa8";
const EMAS = "#ffd76a";

// Kamera pelan mendekat — dipakai di hampir semua adegan
const Kamera: React.FC<{ d: number; dari?: number; ke?: number; children: React.ReactNode }> = ({
  d,
  dari = 1,
  ke = 1.06,
  children,
}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, d], [dari, ke], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

const Cahaya: React.FC<{ x: number; y: number; ukuran: number; opacity?: number }> = ({ x, y, ukuran, opacity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - ukuran * 2,
          top: y - ukuran * 2,
          width: ukuran * 4,
          height: ukuran * 4,
          transform: `rotate(${frame * 0.6}deg)`,
          background: "repeating-conic-gradient(rgba(255,236,170,0.35) 0deg 8deg, transparent 8deg 20deg)",
          WebkitMaskImage: "radial-gradient(circle, black 10%, transparent 65%)",
          maskImage: "radial-gradient(circle, black 10%, transparent 65%)",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - ukuran / 2,
          top: y - ukuran / 2,
          width: ukuran,
          height: ukuran,
          borderRadius: "50%",
          background: "radial-gradient(circle, #fffef5 0%, #fff1b8 45%, rgba(255,215,106,0) 72%)",
          boxShadow: `0 0 ${ukuran * 0.6}px ${EMAS}`,
          opacity,
          transform: `scale(${1 + Math.sin(frame / 7) * 0.04})`,
        }}
      />
    </>
  );
};

// ───────────────────────── 0. JUDUL ─────────────────────────
export const Judul: React.FC<P> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pill = spring({ frame: frame - 4, fps, config: { damping: 12 } });
  const bukit = spring({ frame, fps, config: { damping: 16 } });
  const huruf = "Nabi Adam".split("");
  const salam = interpolate(frame, [32, 45], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: UNGU }}>
      <Bintang jumlah={70} />
      <Cahaya x={540} y={760} ukuran={260} opacity={0.6} />
      <AbsoluteFill style={{ transform: `translateY(${(1 - bukit) * 500}px)` }}>
        <Bukit y={1380} warna="#5b3fd0" amp={50} geser={0.01} />
        <Bukit y={1520} warna="#4a2fb8" amp={40} fase={2} geser={-0.012} />
        <Bukit y={1680} warna="#2c1a7a" amp={30} fase={4} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 540, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${pill})`,
            background: PINK,
            color: "#fff",
            border: "7px solid #fff",
            borderRadius: 60,
            padding: "8px 46px",
            fontFamily: FONT_JUDUL,
            fontSize: 62,
            boxShadow: "0 10px 0 rgba(0,0,0,0.2)",
          }}
        >
          📖 Kisah Nabi
        </div>
      </div>
      <div style={{ position: "absolute", top: 680, width: "100%", textAlign: "center", fontFamily: FONT_JUDUL, fontSize: 200 }}>
        {huruf.map((h, i) => {
          const s = spring({ frame: frame - 10 - i * 2, fps, config: { damping: 9, stiffness: 140 } });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                minWidth: h === " " ? 50 : undefined,
                color: EMAS,
                WebkitTextStroke: "12px #c2410c",
                paintOrder: "stroke fill",
                textShadow: "0 14px 0 rgba(0,0,0,0.25)",
                transform: `translateY(${(1 - s) * 250}px) scale(${s})`,
              }}
            >
              {h}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 920,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT_JUDUL,
          fontSize: 64,
          color: "#fff",
          opacity: salam,
          transform: `translateY(${(1 - salam) * 30}px)`,
        }}
      >
        ‘alaihissalam
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 1. DICIPTAKAN DARI TANAH ─────────────────────────
export const Tanah: React.FC<P> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pusatX = 540;
  const pusatY = 720;
  const nyala = spring({ frame: frame - d * 0.55, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#ffe9c7, #f7b267)" }}>
      <Kamera d={d}>
        <Awan x={60} y={240} skala={0.8} />
        <Awan x={720} y={380} skala={0.6} />
        <Cahaya x={pusatX} y={pusatY} ukuran={300 * nyala} opacity={nyala} />
        <Bukit y={1180} warna="#d4a373" amp={45} geser={0.004} />
        <Bukit y={1330} warna="#b07d4f" amp={35} fase={1.5} geser={-0.005} />
        <Bukit y={1500} warna="#8a5a33" amp={30} fase={3} />
        {/* Butiran tanah berputar naik lalu menyatu menjadi cahaya */}
        {new Array(70).fill(0).map((_, i) => {
          const sx = 80 + random(`tx${i}`) * 920;
          const sy = 1250 + random(`ty${i}`) * 500;
          const tunda = random(`td${i}`) * d * 0.15;
          const t = interpolate(frame, [tunda, tunda + d * 0.5], [0, 1], clamp);
          const e = Easing.inOut(Easing.cubic)(t);
          const a = random(`ta${i}`) * Math.PI * 2 + e * 6;
          const lengkung = Math.sin(e * Math.PI) * 150;
          const x = sx + (pusatX - sx) * e + Math.cos(a) * lengkung;
          const y = sy + (pusatY - sy) * e + Math.sin(a) * lengkung;
          const s = 10 + random(`ts${i}`) * 18;
          const warna = ["#8a5a33", "#b07d4f", "#d4a373", "#6b4423"][i % 4];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - s / 2,
                top: y - s / 2,
                width: s,
                height: s,
                borderRadius: "40%",
                background: interpolateColors(e, [0.6, 1], [warna, "#fff1b8"]),
                opacity: interpolate(e, [0.85, 1], [1, 0], clamp),
                transform: `rotate(${frame * 4 + i * 20}deg)`,
              }}
            />
          );
        })}
      </Kamera>
    </AbsoluteFill>
  );
};

// ───────────────────────── 2. DIAJARI NAMA-NAMA ─────────────────────────
const BENDA = [
  ["🌳", "Pohon"],
  ["🐦", "Burung"],
  ["⛰️", "Gunung"],
  ["💧", "Air"],
  ["🐪", "Unta"],
  ["🌙", "Bulan"],
] as const;

export const Nama: React.FC<P> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#bfeaff, #fdf3d8)" }}>
      <Kamera d={d}>
        <Awan x={-40} y={160} skala={0.9} />
        <Awan x={760} y={1180} skala={0.7} />
        <Bukit y={1420} warna="#9be38a" amp={30} geser={0.004} />
        <Bukit y={1560} warna="#6fcf6a" amp={25} fase={2} />
        <Cahaya x={540} y={760} ukuran={170} />
        {BENDA.map(([ikon, nama], i) => {
          const s = spring({ frame: frame - 10 - i * 7, fps, config: { damping: 10 } });
          const sudut = (i / BENDA.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.006;
          const r = 340 * s;
          const x = 540 + Math.cos(sudut) * r;
          const y = 760 + Math.sin(sudut) * r;
          return (
            <div
              key={nama}
              style={{
                position: "absolute",
                left: x - 105,
                top: y - 115,
                width: 210,
                height: 230,
                transform: `scale(${s}) rotate(${Math.sin(frame / 15 + i) * 5}deg)`,
                background: "#fff",
                borderRadius: 36,
                filter: BAYANGAN,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 110, lineHeight: 1.1 }}>{ikon}</div>
              <div style={{ fontFamily: FONT_JUDUL, fontSize: 44, color: "#3a1f9e" }}>{nama}</div>
            </div>
          );
        })}
      </Kamera>
    </AbsoluteFill>
  );
};

// ───────────────────────── 3. MALAIKAT SUJUD, IBLIS MENOLAK ─────────────────────────
// Malaikat disimbolkan sebagai bola cahaya; Iblis sebagai awan gelap.
export const Sujud: React.FC<P> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sombong = interpolate(frame, [d * 0.55, d * 0.8], [1, 1.35], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, #4b37b0 0%, #23166a 55%, #0e0832 100%)" }}>
      <Kamera d={d}>
        <Bintang jumlah={50} />
        <Cahaya x={540} y={330} ukuran={200} opacity={0.8} />
        {new Array(6).fill(0).map((_, i) => {
          const x = 110 + i * 125;
          const muncul = spring({ frame: frame - i * 4, fps, config: { damping: 12 } });
          const tunduk = interpolate(frame, [d * 0.3 + i * 3, d * 0.3 + i * 3 + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
          const apung = Math.sin(frame / 12 + i) * 10 * (1 - tunduk);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 50,
                top: 860 + apung + tunduk * 150,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "radial-gradient(circle, #ffffff 0%, #fff4c7 50%, rgba(255,215,106,0.2) 75%)",
                boxShadow: `0 0 50px ${EMAS}`,
                transform: `scale(${muncul}) scaleY(${1 - tunduk * 0.35}) scaleX(${1 + tunduk * 0.2})`,
              }}
            />
          );
        })}
        {/* Iblis: awan gelap yang tetap tegak & membesar karena sombong */}
        <div
          style={{
            position: "absolute",
            left: 840,
            top: 760,
            width: 160,
            height: 220,
            transform: `scale(${sombong}) translateX(${Math.sin(frame * 0.9) * 3 * (sombong - 1) * 4}px)`,
            transformOrigin: "50% 100%",
            opacity: spring({ frame: frame - 25, fps, config: { damping: 14 } }),
          }}
        >
          {new Array(7).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 20 + Math.sin(frame / 9 + i * 1.7) * 30,
                top: i * 26,
                width: 120 - Math.abs(i - 3) * 8,
                height: 90,
                borderRadius: "50%",
                background: "#14081f",
                filter: "blur(6px)",
                opacity: 0.85,
              }}
            />
          ))}
        </div>
        <Bukit y={1200} warna="#2a1c78" amp={30} geser={0.004} />
        <Bukit y={1350} warna="#1b1157" amp={25} fase={2} />
      </Kamera>
    </AbsoluteFill>
  );
};

// ───────────────────────── TAMAN SURGA (dipakai adegan 4 & 5) ─────────────────────────
const TamanSurga: React.FC<{ gelap: number; papan: number; buahJatuh?: number }> = ({ gelap, papan, buahJatuh }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#9fe3ff, #e8fbff)" }}>
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 170,
          width: 190,
          height: 190,
          borderRadius: "50%",
          background: "#fff3a8",
          boxShadow: "0 0 90px #ffe066",
        }}
      />
      <Awan x={-60 + frame * 0.6} y={260} skala={0.8} />
      <Awan x={600 - frame * 0.4} y={450} skala={0.55} />
      <Bukit y={980} warna="#a8e890" amp={50} geser={0.003} />
      <Bukit y={1120} warna="#7bd46f" amp={40} fase={1} />
      <Bukit y={1235} warna="#5ec8f2" amp={14} gel={4} geser={0.04} />
      <Pohon x={160} y={1290} skala={0.85} daun="#4bb35a" buah="#ff7aa8" />
      <Pohon x={920} y={1300} skala={0.9} daun="#4bb35a" buah="#ffb347" />
      <Pohon x={540} y={1270} skala={1.25} daun="#2f9e44" buah={buahJatuh === undefined || buahJatuh < 0 ? "#ffd43b" : "#ffd43b"} cahaya={1 - gelap * 0.6} />
      <Bukit y={1300} warna="#4cb052" amp={30} fase={3} />
      {/* Bunga */}
      {new Array(26).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`fx${i}`) * 1040,
            top: 1380 + random(`fy${i}`) * 480 + Math.sin(frame / 10 + i) * 4,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: ["#ff8fc2", "#fff27a", "#ffffff", "#ffb38a"][i % 4],
            boxShadow: "0 0 0 7px rgba(255,255,255,0.45)",
          }}
        />
      ))}
      {/* Kupu-kupu */}
      {new Array(4).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: ((i * 270 + frame * (2 + i * 0.5)) % 1200) - 60,
            top: 780 + i * 110 + Math.sin(frame / 8 + i) * 50,
            fontSize: 64,
            transform: `scaleX(${0.6 + 0.4 * Math.abs(Math.sin(frame / 3 + i))})`,
          }}
        >
          🦋
        </div>
      ))}
      {/* Papan larangan: "Jangan dekati pohon ini" (QS. Al-Baqarah: 35) */}
      <div
        style={{
          position: "absolute",
          left: 690,
          top: 1110,
          transform: `scale(${papan}) rotate(${-4 + Math.sin(frame / 20) * 2}deg)`,
          transformOrigin: "50% 100%",
          filter: BAYANGAN,
        }}
      >
        <div style={{ position: "absolute", left: 130, top: 120, width: 26, height: 150, background: "#7a4a22", borderRadius: 8 }} />
        <div
          style={{
            position: "relative",
            width: 290,
            padding: "16px 20px",
            background: "#c98a4b",
            border: "6px solid #8b5a2b",
            borderRadius: 20,
            fontFamily: FONT_JUDUL,
            fontSize: 40,
            lineHeight: 1.1,
            color: "#fff8e7",
            textAlign: "center",
          }}
        >
          Jangan dekati pohon ini!
        </div>
      </div>
      <AbsoluteFill style={{ background: "#1e0b3c", opacity: gelap * 0.62 }} />
    </AbsoluteFill>
  );
};

// ───────────────────────── 4. TINGGAL DI SURGA ─────────────────────────
export const Surga: React.FC<P> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const papan = spring({ frame: frame - d * 0.62, fps, config: { damping: 9 } });
  return (
    <AbsoluteFill>
      <Kamera d={d} dari={1} ke={1.1}>
        <TamanSurga gelap={0} papan={papan} />
      </Kamera>
    </AbsoluteFill>
  );
};

// ───────────────────────── 5. BISIKAN IBLIS ─────────────────────────
export const Bisikan: React.FC<P> = ({ d }) => {
  const frame = useCurrentFrame();
  const gelap = interpolate(frame, [0, d * 0.75], [0.1, 0.9], clamp);
  const jatuh = interpolate(frame, [d * 0.6, d * 0.78], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const pantul = frame > d * 0.78 ? Math.abs(Math.sin((frame - d * 0.78) / 3)) * Math.max(0, 1 - (frame - d * 0.78) / 15) * 40 : 0;
  return (
    <AbsoluteFill>
      <Kamera d={d} dari={1.1} ke={1.18}>
        <TamanSurga gelap={gelap} papan={1} buahJatuh={jatuh} />
        {/* Asap gelap merayap dari kanan menuju pohon */}
        {new Array(9).fill(0).map((_, i) => {
          const t = interpolate(frame, [i * 4, d * 0.6 + i * 4], [0, 1], clamp);
          const x = interpolate(t, [0, 1], [1250, 560 + Math.cos(i) * 140]);
          const y = 960 + Math.sin(t * Math.PI * 2 + i) * 90 + i * 22;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 80,
                top: y - 50,
                width: 160,
                height: 100,
                borderRadius: "50%",
                background: "#1a0b2e",
                filter: "blur(18px)",
                opacity: 0.7 * Math.min(1, t * 3),
              }}
            />
          );
        })}
        {/* Buah jatuh dari pohon */}
        {frame > d * 0.6 && (
          <div
            style={{
              position: "absolute",
              left: 560,
              top: interpolate(jatuh, [0, 1], [930, 1320]) - pantul,
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "#ffd43b",
              boxShadow: "0 0 30px #ffd43b, inset -8px -8px 0 rgba(0,0,0,0.15)",
              transform: `rotate(${jatuh * 360}deg)`,
            }}
          />
        )}
      </Kamera>
    </AbsoluteFill>
  );
};

// ───────────────────────── 6. DITURUNKAN KE BUMI ─────────────────────────
export const Turun: React.FC<P> = ({ d }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [8, d - 15], [0, -1920], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#ffd8a8" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 3840, transform: `translateY(${y}px)` }}>
        {/* Langit */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: "linear-gradient(#cfefff, #ffe2bd)" }}>
          {new Array(8).fill(0).map((_, i) => (
            <Awan key={i} x={random(`ax${i}`) * 800 - 60} y={120 + i * 220} skala={0.6 + random(`as${i}`) * 0.6} />
          ))}
        </div>
        {/* Bumi */}
        <div style={{ position: "absolute", left: 0, top: 1920, width: 1080, height: 1920, background: "linear-gradient(#ffe2bd, #ffb36b)" }}>
          <div
            style={{
              position: "absolute",
              left: 420,
              top: 520,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "#ffef9a",
              boxShadow: "0 0 120px #ffb347",
            }}
          />
          <Bukit y={950} warna="#e9a25f" amp={60} gel={2} />
          <Pohon x={200} y={1080} skala={0.55} daun="#7a9e3b" />
          <Pohon x={860} y={1110} skala={0.65} daun="#6b8f2f" />
          <Bukit y={1080} warna="#d4823f" amp={45} fase={2} gel={2.5} />
          <Bukit y={1250} warna="#b5652c" amp={35} fase={4} gel={2} />
        </div>
      </div>
      {/* Garis gerak ke bawah */}
      {new Array(14).fill(0).map((_, i) => {
        const kuat = Math.sin(interpolate(frame, [8, d - 15], [0, Math.PI], clamp));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`gx${i}`) * 1080,
              top: ((random(`gy${i}`) * 1920 - frame * 60) % 1920 + 1920) % 1920,
              width: 6,
              height: 160,
              borderRadius: 3,
              background: "rgba(255,255,255,0.7)",
              opacity: kuat * 0.8,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ───────────────────────── 7. BERTAUBAT + DOA ─────────────────────────
export const Taubat: React.FC<P> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kartu = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const kata = DOA_ARAB.split(" ");
  const arti = interpolate(frame, [d * 0.55, d * 0.65], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0b1033, #2a1b5e)" }}>
      <Kamera d={d} ke={1.04}>
        <Bintang jumlah={90} tinggi={1500} />
        <svg width={220} height={220} style={{ position: "absolute", left: 800, top: 170, filter: "drop-shadow(0 0 30px #ffe08a)" }}>
          <defs>
            <mask id="sabit">
              <rect width={220} height={220} fill="white" />
              <circle cx={140} cy={90} r={80} fill="black" />
            </mask>
          </defs>
          <circle cx={110} cy={110} r={90} fill="#ffe08a" mask="url(#sabit)" />
        </svg>
        <Bukit y={1420} warna="#1a1440" amp={40} geser={0.003} />
        <Bukit y={1580} warna="#110c30" amp={30} fase={2} />
      </Kamera>
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: 330,
          transform: `scale(${kartu})`,
          background: "rgba(255,255,255,0.08)",
          border: "4px solid rgba(255,215,106,0.6)",
          borderRadius: 44,
          padding: "30px 46px 40px",
          textAlign: "center",
          boxShadow: "0 0 60px rgba(255,215,106,0.25)",
        }}
      >
        <div style={{ fontSize: 96, transform: `translateY(${Math.sin(frame / 12) * 8}px)` }}>🤲</div>
        <div
          style={{
            direction: "rtl",
            fontFamily: FONT_ARAB,
            fontSize: 70,
            lineHeight: 1.9,
            color: "#fff3c4",
            textShadow: `0 0 22px ${EMAS}`,
            marginTop: 10,
          }}
        >
          {kata.map((k, i) => {
            const mulai = 20 + i * ((d * 0.45) / kata.length);
            return (
              <span key={i} style={{ opacity: interpolate(frame, [mulai, mulai + 8], [0, 1], clamp) }}>
                {k}{" "}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: FONT_JUDUL,
            fontSize: 38,
            lineHeight: 1.3,
            color: "#e9e3ff",
            opacity: arti,
            transform: `translateY(${(1 - arti) * 20}px)`,
          }}
        >
          {DOA_ARTI}
          <div style={{ marginTop: 12, fontSize: 32, color: EMAS }}>({DOA_SUMBER})</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 8. TAUBAT DITERIMA ─────────────────────────
export const Diterima: React.FC<P> = ({ d }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, d * 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const langitAtas = interpolateColors(p, [0, 1], ["#2a1b5e", "#8fd3ff"]);
  const langitBawah = interpolateColors(p, [0, 1], ["#5a3a8e", "#ffe3b0"]);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${langitAtas}, ${langitBawah})` }}>
      <Kamera d={d}>
        <Bintang jumlah={60} opacity={1 - p} />
        <Cahaya x={540} y={interpolate(p, [0, 1], [1400, 820])} ukuran={300} />
        <Bukit y={1250} warna={interpolateColors(p, [0, 1], ["#1a1440", "#8fd67f"])} amp={45} geser={0.004} />
        <Bukit y={1420} warna={interpolateColors(p, [0, 1], ["#110c30", "#5fae5a"])} amp={35} fase={2} />
        {new Array(12).fill(0).map((_, i) => {
          const t = ((frame + i * 13) % 70) / 70;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 80 + random(`hx${i}`) * 900,
                top: 1300 - t * 700,
                fontSize: 50 + random(`hs${i}`) * 30,
                opacity: Math.sin(t * Math.PI) * p,
              }}
            >
              {i % 2 ? "✨" : "💛"}
            </div>
          );
        })}
      </Kamera>
    </AbsoluteFill>
  );
};

// ───────────────────────── 9. PELAJARAN + SUBSCRIBE ─────────────────────────
const PELAJARAN = ["😌 Jangan sombong seperti Iblis", "🤲 Kalau salah, segera minta maaf & bertaubat", "💛 Allah Maha Pengampun"];

export const Penutup: React.FC<P> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kartu = spring({ frame, fps, config: { damping: 13 } });
  const tombol = spring({ frame: frame - 70, fps, config: { damping: 10 } });
  const denyut = 1 + Math.max(0, Math.sin(frame / 5)) * 0.05;
  return (
    <AbsoluteFill style={{ background: UNGU }}>
      <Bintang jumlah={60} />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 380,
          transform: `scale(${kartu}) rotate(${(1 - kartu) * -8}deg)`,
          background: "#fff8e7",
          border: "8px solid #fff",
          borderRadius: 50,
          padding: "44px 50px",
          boxShadow: "0 16px 0 rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ fontFamily: FONT_JUDUL, fontSize: 76, color: PINK, textAlign: "center", marginBottom: 26 }}>💡 Pelajaran untuk Kita</div>
        {PELAJARAN.map((t, i) => {
          const s = spring({ frame: frame - 15 - i * 12, fps, config: { damping: 12 } });
          return (
            <div
              key={i}
              style={{
                fontFamily: FONT_JUDUL,
                fontSize: 52,
                lineHeight: 1.2,
                color: "#3a1f9e",
                margin: "22px 0",
                opacity: s,
                transform: `translateX(${(1 - s) * -120}px)`,
              }}
            >
              {t}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1330,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT_JUDUL,
          fontSize: 56,
          color: "#fff",
          opacity: tombol,
        }}
      >
        Nantikan kisah Nabi berikutnya!
      </div>
      <div style={{ position: "absolute", top: 1450, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${tombol * denyut})`,
            background: "#ff1f3d",
            color: "#fff",
            fontFamily: FONT_JUDUL,
            fontSize: 66,
            padding: "16px 60px",
            borderRadius: 26,
            boxShadow: "0 10px 0 rgba(0,0,0,0.3)",
          }}
        >
          ▶ Subscribe
        </div>
      </div>
    </AbsoluteFill>
  );
};
