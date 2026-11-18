// Video puisi "Aku Ingin" karya Sapardi Djoko Damono.
// Bait 1 (kayu, api, abu) bernuansa hangat; bait 2 (awan, hujan, tiada) bernuansa biru.
// Audio dibuat oleh scripts/buat-audio-puisi.py (suara + beat lo-fi lembut).
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import waktu from "./waktu.json";

const SERIF = loadCormorant("italic", { weights: ["500", "600"], subsets: ["latin"] }).fontFamily;
const SERIF_TEGAK = loadCormorant("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;

export const DURASI_PUISI = waktu.total;
const B = waktu.baris as [number, number][];

const TEKS = [
  "aku ingin mencintaimu dengan sederhana;",
  "dengan kata yang tak sempat diucapkan",
  "kayu kepada api yang menjadikannya abu",
  "aku ingin mencintaimu dengan sederhana;",
  "dengan isyarat yang tak sempat disampaikan",
  "awan kepada hujan yang menjadikannya tiada",
];
// kata yang diberi cahaya
const KUNCI = new Set(["sederhana;", "abu", "tiada", "api", "hujan"]);

const BPM = 76;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0 → 1 seiring waktu (detik) dengan easing lembut
const naik = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

const campur = (c1: number[], c2: number[], k: number) =>
  c1.map((v, i) => Math.round(v + (c2[i] - v) * k));
const rgb = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;

// ---------- latar ----------
const Langit: React.FC<{ t: number }> = ({ t }) => {
  // hangat (senja) → biru (mendung) di jeda antar-bait, lalu redup di akhir
  const kb = naik(t, B[2][1], B[3][0]);
  const akhir = naik(t, B[5][1] - 0.5, B[6][0] + 0.8);
  const atas = campur(campur([38, 18, 30], [20, 30, 52], kb), [10, 12, 22], akhir * 0.6);
  const tengah = campur(campur([120, 52, 40], [62, 82, 110], kb), [30, 36, 52], akhir * 0.6);
  const bawah = campur(campur([230, 140, 70], [150, 170, 190], kb), [60, 66, 80], akhir * 0.6);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${rgb(atas)} 0%, ${rgb(tengah)} 62%, ${rgb(bawah)} 100%)`,
      }}
    />
  );
};

// cahaya bulat lembut yang bernapas (seperti matahari terbenam / bulan)
const Cahaya: React.FC<{ t: number; denyut: number }> = ({ t, denyut }) => {
  const kb = naik(t, B[2][1], B[3][0]);
  const warna = rgb(campur([255, 190, 120], [210, 225, 255], kb));
  const r = 360 + denyut * 18 + Math.sin(t * 0.6) * 10;
  const y = interpolate(t, [0, DURASI_PUISI], [1180, 1320]);
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${warna}cc 0%, ${warna}33 38%, transparent 70%)`,
        filter: "blur(6px)",
        opacity: 0.55,
      }}
    />
  );
};

// bara api naik (bait 1) – berubah jadi abu abu-abu yang turun setelah kata "abu"
const BaraDanAbu: React.FC<{ t: number }> = ({ t }) => {
  const nyala = naik(t, B[2][0], B[2][0] + 1.5) * (1 - naik(t, B[2][1] + 0.6, B[3][0] + 0.6));
  const dasar = 0.35 * (1 - naik(t, B[2][1], B[3][0] + 0.5));
  const jadiAbu = naik(t, B[2][1] - 1.0, B[2][1] + 0.4);
  const n = 70;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x0 = random(`bx${i}`) * 1080;
    const cepat = 60 + random(`bv${i}`) * 140;
    const fase = random(`bp${i}`) * 30;
    const ukuran = 3 + random(`bs${i}`) * 7;
    const opas = Math.max(dasar, nyala);
    if (opas <= 0.01) continue;
    // naik untuk bara, turun pelan untuk abu
    const yNaik = 1920 - (((t + fase) * cepat) % 2100);
    const yTurun = ((t + fase) * cepat * 0.35) % 2100 - 100;
    const y = yNaik * (1 - jadiAbu) + yTurun * jadiAbu;
    const x = x0 + Math.sin((t + fase) * 1.3) * 30;
    const warna = rgb(campur([255, 170 - Math.round(random(`bc${i}`) * 80), 60], [190, 185, 180], jadiAbu));
    out.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: ukuran,
          height: ukuran,
          borderRadius: "50%",
          background: warna,
          boxShadow: `0 0 ${ukuran * 3 * (1 - jadiAbu)}px ${warna}`,
          opacity: opas * (0.5 + 0.5 * Math.sin(t * 3 + i)),
        }}
      />,
    );
  }
  // cahaya api di dasar layar saat baris "kayu kepada api"
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 700,
          background: `radial-gradient(ellipse at 50% 100%, rgba(255,120,40,${0.75 * nyala}) 0%, rgba(255,80,20,${0.3 * nyala}) 35%, transparent 70%)`,
        }}
      />
      {out}
    </>
  );
};

// awan berarak (bait 2) dan hujan pada baris terakhir, lalu semua menipis jadi "tiada"
const AwanDanHujan: React.FC<{ t: number }> = ({ t }) => {
  const awanMasuk = naik(t, B[2][1] + 0.2, B[3][0] + 1.0);
  const tiada = naik(t, B[5][1] - 0.6, B[6][0] + 0.6);
  const hujan = naik(t, B[5][0] + 0.3, B[5][0] + 1.2) * (1 - tiada);
  const awan: React.ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const w = 380 + random(`aw${i}`) * 420;
    const y = 120 + random(`ay${i}`) * 520;
    const x = ((random(`ax${i}`) * 1600 + t * (10 + random(`as${i}`) * 18)) % 1700) - 400;
    awan.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: w * 0.42,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(230,236,248,0.55) 0%, rgba(200,210,230,0.18) 50%, transparent 72%)",
          filter: "blur(14px)",
          opacity: awanMasuk * (1 - tiada * 0.9),
        }}
      />,
    );
  }
  const tetes: React.ReactNode[] = [];
  if (hujan > 0.01) {
    for (let i = 0; i < 110; i++) {
      const x0 = random(`hx${i}`) * 1180 - 50;
      const v = 1500 + random(`hv${i}`) * 900;
      const f = random(`hf${i}`) * 5;
      const y = ((t + f) * v) % 2200 - 200;
      const p = 40 + random(`hl${i}`) * 50;
      tetes.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: x0 - y * 0.08,
            top: y,
            width: 2,
            height: p,
            background: "linear-gradient(180deg, transparent, rgba(210,225,255,0.75))",
            transform: "rotate(5deg)",
            opacity: hujan * (0.4 + random(`ho${i}`) * 0.6),
          }}
        />,
      );
    }
  }
  return (
    <>
      {awan}
      {tetes}
    </>
  );
};

// ---------- teks ----------
const Baris: React.FC<{ i: number; t: number; denyut: number }> = ({ i, t, denyut }) => {
  const [a, b] = B[i];
  const kata = TEKS[i].split(" ");
  // perkiraan waktu tiap kata ~ sebanding panjang hurufnya
  const panjang = kata.map((k) => k.replace(/[^a-z]/gi, "").length + 1.5);
  const jml = panjang.reduce((x, y) => x + y, 0);
  const dur = b - a;
  let acc = 0;
  const masuk = kata.map((_, j) => {
    const s = a + (acc / jml) * dur * 0.92 - 0.12;
    acc += panjang[j];
    return s;
  });
  // baris tampil sampai baris berikut muncul
  const hilangMulai = i === 5 ? B[6][0] - 0.4 : B[i + 1][0] - 0.35;
  const keluar = naik(t, hilangMulai, hilangMulai + 0.45);
  if (t < a - 0.3 || keluar >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 700,
        textAlign: "center",
        fontFamily: SERIF,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 100,
        lineHeight: 1.22,
        color: "#fff7ec",
        textShadow: "0 4px 24px rgba(0,0,0,0.45)",
        opacity: 1 - keluar,
        transform: `translateY(${-keluar * 40}px) scale(${1 + denyut * 0.006})`,
        filter: `blur(${keluar * 6}px)`,
      }}
    >
      {kata.map((k, j) => {
        const p = naik(t, masuk[j], masuk[j] + 0.5);
        const kunci = KUNCI.has(k);
        const nyala = kunci ? naik(t, masuk[j] + 0.1, masuk[j] + 0.8) : 0;
        const bait2 = i >= 3;
        const warnaKunci = bait2 ? "#cfe0ff" : "#ffd08a";
        // kata "tiada" memudar pelan di akhir
        const pudar = k === "tiada" ? 1 - naik(t, b + 0.4, b + 1.6) * 0.75 : 1;
        return (
          <span
            key={j}
            style={{
              display: "inline-block",
              marginRight: 22,
              opacity: p * pudar,
              transform: `translateY(${(1 - p) * 26}px)`,
              filter: `blur(${(1 - p) * 8}px)`,
              color: kunci ? warnaKunci : undefined,
              fontWeight: kunci ? 600 : 500,
              textShadow: kunci
                ? `0 0 ${18 + 26 * nyala}px ${warnaKunci}${Math.round(nyala * 200).toString(16).padStart(2, "0")}, 0 4px 24px rgba(0,0,0,0.45)`
                : undefined,
            }}
          >
            {k}
          </span>
        );
      })}
    </div>
  );
};

const Judul: React.FC<{ t: number }> = ({ t }) => {
  const p = naik(t, 0.1, 0.9);
  const q = 1 - naik(t, B[0][0] - 0.3, B[0][0] + 0.3);
  if (q <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 780, left: 0, right: 0, textAlign: "center", opacity: p * q }}>
      <div style={{ fontFamily: SERIF_TEGAK, fontWeight: 500, fontSize: 40, letterSpacing: 14, color: "#ffe2c0" }}>
        SEBUAH PUISI
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 150,
          color: "#fff7ec",
          textShadow: "0 0 40px rgba(255,200,140,0.5)",
          transform: `translateY(${(1 - p) * 20}px)`,
        }}
      >
        Aku Ingin
      </div>
    </div>
  );
};

const Penyair: React.FC<{ t: number }> = ({ t }) => {
  const s = B[6][0];
  const p = naik(t, s - 0.2, s + 0.9);
  if (p <= 0) return null;
  const garis = naik(t, s + 0.2, s + 1.4);
  return (
    <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", opacity: p }}>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 110, fontWeight: 600, color: "#f2f5ff" }}>
        Aku Ingin
      </div>
      <div style={{ margin: "26px auto", width: 420 * garis, height: 2, background: "rgba(240,244,255,0.7)" }} />
      <div style={{ fontFamily: SERIF_TEGAK, fontSize: 58, fontWeight: 500, letterSpacing: 6, color: "#dfe7ff" }}>
        Sapardi Djoko Damono
      </div>
      <div
        style={{
          marginTop: 80,
          fontFamily: SERIF_TEGAK,
          fontSize: 34,
          letterSpacing: 4,
          color: "rgba(230,236,255,0.65)",
          opacity: naik(t, s + 1.2, s + 2.2),
        }}
      >
        dibacakan ulang · Malam Komedi
      </div>
    </div>
  );
};

// butiran film tipis + vinyet supaya terasa sinematik
const Vinyet: React.FC = () => (
  <AbsoluteFill
    style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.55) 100%)" }}
  />
);

export const Puisi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // denyut mengikuti beat (76 BPM): 1 di ketukan, meluruh cepat
  const mulaiBeat = B[0][0] - 0.2;
  const fase = ((t - mulaiBeat) * BPM) / 60;
  const adaBeat = t > mulaiBeat && t < B[6][0];
  const denyut = adaBeat ? Math.exp(-(fase - Math.floor(fase)) * 5) : 0;
  // kamera pelan maju
  const zoom = interpolate(t, [0, DURASI_PUISI], [1.0, 1.08]);
  const fadeAkhir = 1 - naik(t, DURASI_PUISI - 1.2, DURASI_PUISI);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, opacity: fadeAkhir }}>
        <Langit t={t} />
        <Cahaya t={t} denyut={denyut} />
        <AwanDanHujan t={t} />
        <BaraDanAbu t={t} />
        <Vinyet />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: fadeAkhir }}>
        <Judul t={t} />
        {TEKS.map((_, i) => (
          <Baris key={i} i={i} t={t} denyut={denyut} />
        ))}
        <Penyair t={t} />
      </AbsoluteFill>
      <Audio src={staticFile("puisi/suara.wav")} />
      <Audio src={staticFile("puisi/musik.wav")} />
    </AbsoluteFill>
  );
};
