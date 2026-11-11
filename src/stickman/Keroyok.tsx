import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Keyframe, Pose, Stickman, keLayar, poseDi, sendi } from "./Stickman";
import {
  ANCANG, Bentuk, FONT, HORMAT, KENA_A, KENA_B, KUDA_KUDA, Kilat, LANTAI, LARI, Latar, PAMUNGKAS,
  PUKUL_A, PUKUL_B, SERANG, SIAGA, SKALA, TANGKIS, TERKAPAR, TERLEMPAR, TeksPop, pose,
} from "./Duel";

/*
 * STICKMAN 1 VS 4 — pertarungan cepat
 * 3 lawan biasa + 1 bos, menyerang bergantian dari kanan & kiri.
 * Setiap pukulan pamungkas: slow-motion + zoom kamera + dentuman.
 * Efek suara ada di public/sfx/ (dibuat oleh scripts/buat-efek-suara.py, bebas hak cipta).
 *
 * Semua waktu di bawah memakai "frame adegan" (sebelum slow-motion diterapkan).
 */

// ===== Pose tambahan =====
const TENDANG: Bentuk = { badan: -20, lenganDepan: 60, tanganDepan: 110, lenganBelakang: -30, tanganBelakang: 30, pahaDepan: 100, betisDepan: 95, pahaBelakang: -8, betisBelakang: -5 };
const MERUNDUK: Bentuk = { badan: 38, lenganDepan: 75, tanganDepan: 150, lenganBelakang: 40, tanganBelakang: 150, pahaDepan: 80, betisDepan: -5, pahaBelakang: -50, betisBelakang: -100 };
const TENDANG_ATAS: Bentuk = { badan: -32, lenganDepan: 40, tanganDepan: 100, lenganBelakang: -60, tanganBelakang: -20, pahaDepan: 150, betisDepan: 160, pahaBelakang: -5, betisBelakang: 0 };
const LOMPAT: Bentuk = { badan: -10, lenganDepan: 120, tanganDepan: 150, lenganBelakang: -40, tanganBelakang: 10, pahaDepan: 95, betisDepan: 95, pahaBelakang: -10, betisBelakang: -60 };

// ===== Slow-motion: [mulai, akhir, kecepatan] =====
type Lambat = [mulai: number, akhir: number, kecepatan: number];
const LAMBAT: Lambat[] = [
  [48, 56, 0.25],
  [83, 91, 0.25],
  [111, 119, 0.25],
  [175, 189, 0.2],
];
const AKHIR_ADEGAN = 250;

const keAsli = (adegan: number) =>
  LAMBAT.reduce((total, [a, b, k]) => total + Math.max(0, Math.min(adegan, b) - a) * (1 / k - 1), adegan);

const keAdegan = (asli: number) => {
  let geser = 0;
  for (const [a, b, k] of LAMBAT) {
    const asliA = a + geser;
    if (asli < asliA) return asli - geser;
    const asliB = asliA + (b - a) / k;
    if (asli < asliB) return a + (asli - asliA) * k;
    geser += (b - a) * (1 / k - 1);
  }
  return asli - geser;
};

export const DURASI_KEROYOK = Math.ceil(keAsli(AKHIR_ADEGAN));

// Pukulan beruntun: pose bergantian A/B
const rantai = (mulai: number, jumlah: number, jeda: number, xAwal: number, xAkhir: number, a: Bentuk, b: Bentuk): Keyframe[] =>
  Array.from({ length: jumlah }, (_, i) => [mulai + i * jeda, pose(i % 2 === 0 ? a : b, xAwal + ((xAkhir - xAwal) * i) / Math.max(1, jumlah - 1))]);

// ===== Jagoan =====
const kunciJagoan: Keyframe[] = [
  [0, pose(KUDA_KUDA, 540)],
  [28, pose(KUDA_KUDA, 540)],
  [34, pose(TANGKIS, 540)],
  ...rantai(38, 3, 3, 540, 545, PUKUL_A, PUKUL_B),
  [46, pose(KUDA_KUDA, 540)],
  [50, pose(TENDANG, 545)],
  [58, pose(TENDANG, 545)],
  [64, pose(KUDA_KUDA, 540)],
  [72, pose(TANGKIS, 540)],
  ...rantai(75, 2, 3, 540, 535, PUKUL_B, PUKUL_A),
  [81, pose(ANCANG, 540)],
  [85, pose(PAMUNGKAS, 515)],
  [92, pose(PAMUNGKAS, 515)],
  [98, pose(KUDA_KUDA, 540)],
  [104, pose(KUDA_KUDA, 540)],
  [108, pose(MERUNDUK, 540)],
  [113, pose(TENDANG_ATAS, 545)],
  [121, pose(TENDANG_ATAS, 545)],
  [127, pose(KUDA_KUDA, 560)],
  [138, pose(KUDA_KUDA, 640)],
  [144, pose(TANGKIS, 640)],
  ...rantai(147, 8, 3, 640, 605, PUKUL_A, PUKUL_B),
  [172, pose(ANCANG, 600)],
  [177, pose(PAMUNGKAS, 565)],
  [192, pose(PAMUNGKAS, 565)],
  [205, pose(KUDA_KUDA, 580)],
  [220, pose(HORMAT, 580)],
  [AKHIR_ADEGAN, pose(HORMAT, 580)],
];
const hadapJagoan: [number, 1 | -1][] = [[0, 1], [64, -1], [98, 1], [127, -1], [205, 1]];
const hadapDi = (adegan: number) => [...hadapJagoan].reverse().find(([f]) => adegan >= f)?.[1] ?? 1;

// ===== Lawan =====
type Musuh = { kunci: Keyframe[]; hadap: 1 | -1; warna: string };
const UNGU = "#2b0f3a";
const MUSUH: Musuh[] = [
  {
    hadap: -1, warna: UNGU, kunci: [
      [0, pose(SIAGA, 860)], [22, pose(SIAGA, 860)], [30, pose(LARI, 800)], [34, pose(SERANG, 770)],
      ...rantai(39, 3, 3, 772, 780, KENA_B, KENA_A),
      [49, pose(KENA_A, 782)], [51, pose(KENA_B, 790)],
      [57, pose(TERLEMPAR, 850, 90)], [66, pose(TERLEMPAR, 1400, 260)],
    ],
  },
  {
    hadap: 1, warna: UNGU, kunci: [
      [0, pose(SIAGA, 235)], [60, pose(SIAGA, 235)], [68, pose(LARI, 290)], [72, pose(SERANG, 310)],
      ...rantai(76, 2, 3, 308, 304, KENA_B, KENA_A),
      [84, pose(KENA_A, 300)], [86, pose(KENA_B, 292)],
      [92, pose(TERLEMPAR, 220, 100)], [102, pose(TERLEMPAR, -350, 240)],
    ],
  },
  {
    hadap: -1, warna: UNGU, kunci: [
      [0, pose(SIAGA, 1065)], [96, pose(SIAGA, 1065)], [103, pose(LARI, 860)],
      [108, pose(LOMPAT, 700, 130)], [112, pose(LOMPAT, 680, 110)], [114, pose(KENA_B, 690, 120)],
      [120, pose(TERLEMPAR, 760, 250)], [132, pose(TERLEMPAR, 1400, 520)],
    ],
  },
  {
    hadap: 1, warna: "#5a0f14", kunci: [
      [0, pose(SIAGA, 15)], [128, pose(SIAGA, 15)], [138, pose(LARI, 360)], [144, pose(SERANG, 410)],
      ...rantai(148, 8, 3, 410, 375, KENA_B, KENA_A),
      [173, pose(KENA_A, 372)], [178, pose(KENA_B, 360)],
      [186, pose(TERLEMPAR, 340, 170)], [196, pose(TERKAPAR, 370)], [AKHIR_ADEGAN, pose(TERKAPAR, 370)],
    ],
  },
];

// ===== Pukulan yang kena =====
type Kena = { saat: number; musuh: number; teks?: string };
const PUKULAN_KECIL: Kena[] = [
  ...[38, 41, 44].map((saat) => ({ saat, musuh: 0 })),
  ...[75, 78].map((saat) => ({ saat, musuh: 1 })),
  ...Array.from({ length: 8 }, (_, i) => ({ saat: 147 + i * 3, musuh: 3 })),
];
const PUKULAN_BESAR: Kena[] = [
  { saat: 50, musuh: 0, teks: "POW!" },
  { saat: 85, musuh: 1, teks: "WHAM!" },
  { saat: 113, musuh: 2, teks: "BOOM!" },
  { saat: 177, musuh: 3, teks: "K.O.!" },
];
const WHOOSH = [26, 46, 64, 98, 104, 132, 186];

const dadaMusuh = (i: number, adegan: number) => {
  const m = MUSUH[i];
  const p = poseDi(adegan, m.kunci);
  const s = sendi(p);
  return keLayar(p, m.hadap, SKALA, LANTAI).ubah([s.leher[0] * 0.75, s.leher[1] * 0.75]);
};

const Suara: React.FC<{ saat: number; file: string; volume?: number }> = ({ saat, file, volume = 1 }) => (
  <Sequence from={Math.round(saat)} layout="none">
    <Audio src={staticFile(`sfx/${file}`)} volume={volume} />
  </Sequence>
);

const Orang: React.FC<{ pose: Pose; hadap: 1 | -1; warna: string; frame: number; ikat?: string; opacity?: number }> = (p) => (
  <Stickman pose={p.pose} hadap={p.hadap} skala={SKALA} lantai={LANTAI} warna={p.warna} ikatKepala={p.ikat} frame={p.frame} opacity={p.opacity} />
);

export const StickmanKeroyok: React.FC = () => {
  const frame = useCurrentFrame();
  const adegan = keAdegan(frame);

  // Kamera: zoom ke titik pukulan saat slow-motion
  let zoom = 0;
  let fokus: readonly [number, number] = [540, 1100];
  LAMBAT.forEach(([a, b], i) => {
    if (adegan >= a && adegan <= b) {
      const p = (adegan - a) / (b - a);
      zoom = 0.38 * Math.max(0, Math.min(1, p / 0.15, (1 - p) / 0.25));
      fokus = dadaMusuh(PUKULAN_BESAR[i].musuh, PUKULAN_BESAR[i].saat);
    }
  });

  // Guncangan layar
  let guncang = 0;
  PUKULAN_KECIL.forEach(({ saat }) => {
    const umur = frame - keAsli(saat);
    if (umur >= 0 && umur < 4) guncang += 7 * (1 - umur / 4);
  });
  PUKULAN_BESAR.forEach(({ saat }) => {
    const umur = frame - keAsli(saat);
    if (umur >= 0 && umur < 16) guncang += 26 * (1 - umur / 16);
  });
  const gx = (random(`gx${frame}`) - 0.5) * guncang;
  const gy = (random(`gy${frame}`) - 0.5) * guncang;

  const kilatLayar = Math.max(
    0,
    ...PUKULAN_BESAR.map(({ saat }) => {
      const umur = frame - keAsli(saat);
      return umur >= 0 ? interpolate(umur, [0, 7], [0.85, 0], { extrapolateRight: "clamp" }) : 0;
    }),
  );

  const kombo = [...PUKULAN_KECIL, ...PUKULAN_BESAR].filter(({ saat }) => adegan >= saat).length;
  const bayangan = adegan > 22 && adegan < 200 ? [1.5, 3] : [];
  const fx = fokus[0];
  const fy = fokus[1];

  return (
    <AbsoluteFill style={{ background: "#1a0c22" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <g transform={`translate(${gx} ${gy}) translate(${fx} ${fy}) scale(${1 + zoom}) translate(${-fx} ${-fy})`}>
          <Latar />
          {bayangan.map((mundur, i) => (
            <g key={i} opacity={0.28 / (i + 1)}>
              {MUSUH.map((m, j) => (
                <Orang key={j} pose={poseDi(adegan - mundur, m.kunci)} hadap={m.hadap} warna={m.warna} frame={frame} />
              ))}
              <Orang pose={poseDi(adegan - mundur, kunciJagoan)} hadap={hadapDi(adegan - mundur)} warna="#0d0d0d" frame={frame} />
            </g>
          ))}
          {MUSUH.map((m, j) => (
            <Orang key={j} pose={poseDi(adegan, m.kunci)} hadap={m.hadap} warna={m.warna} frame={frame} />
          ))}
          <Orang pose={poseDi(adegan, kunciJagoan)} hadap={hadapDi(adegan)} warna="#0d0d0d" ikat="#e3261f" frame={frame} />
          {PUKULAN_KECIL.map(({ saat, musuh }, i) => {
            const [x, y] = dadaMusuh(musuh, saat);
            return <Kilat key={i} x={x + (random(`kx${i}`) - 0.5) * 50} y={y + (random(`ky${i}`) - 0.5) * 60} umur={frame - keAsli(saat)} besar={0.7} />;
          })}
          {PUKULAN_BESAR.map(({ saat, musuh }, i) => {
            const [x, y] = dadaMusuh(musuh, saat);
            return <Kilat key={i} x={x} y={y} umur={(frame - keAsli(saat)) / 3} besar={2.3} />;
          })}
        </g>
      </svg>

      {/* Bingkai gelap saat slow-motion */}
      <AbsoluteFill style={{ background: "radial-gradient(circle, transparent 45%, rgba(0,0,0,0.85) 100%)", opacity: zoom / 0.38 }} />
      <AbsoluteFill style={{ background: "white", opacity: kilatLayar }} />

      <TeksPop teks="1 VS 4" mulai={0} akhir={24} y={380} ukuran={230} warna="#fff" />
      <TeksPop teks="FIGHT!" mulai={24} akhir={50} y={400} ukuran={210} warna="#ffd400" />
      {PUKULAN_BESAR.slice(0, -1).map(({ saat, teks }, i) => (
        <TeksPop key={i} teks={teks!} mulai={Math.round(keAsli(saat))} akhir={Math.round(keAsli(saat)) + 34} y={330} ukuran={200} warna="#ffd400" />
      ))}
      <TeksPop teks="K.O.!" mulai={Math.round(keAsli(177))} akhir={DURASI_KEROYOK} y={330} ukuran={280} warna="#e3261f" />
      <TeksPop teks="PERFECT!" mulai={Math.round(keAsli(212))} akhir={DURASI_KEROYOK} y={640} ukuran={150} warna="#ffd400" />
      {kombo >= 2 && adegan < 176 && (
        <div
          style={{
            position: "absolute", top: 210, right: 60, fontFamily: FONT, fontSize: 100 + kombo * 2,
            color: "#fff", WebkitTextStroke: "9px #e3261f", paintOrder: "stroke", transform: "rotate(6deg)",
          }}
        >
          {kombo}x COMBO!
        </div>
      )}

      {/* ===== Efek suara ===== */}
      <Suara saat={0} file="whoosh.wav" volume={0.6} />
      <Suara saat={keAsli(24)} file="pukul.wav" volume={0.8} />
      {WHOOSH.map((s) => <Suara key={`w${s}`} saat={keAsli(s)} file="whoosh.wav" volume={0.6} />)}
      {PUKULAN_KECIL.map(({ saat }) => <Suara key={`p${saat}`} saat={keAsli(saat)} file="pukul.wav" volume={0.75} />)}
      {LAMBAT.map(([a]) => <Suara key={`s${a}`} saat={keAsli(a)} file="slowmo.wav" volume={0.7} />)}
      {PUKULAN_BESAR.map(({ saat }) => <Suara key={`d${saat}`} saat={keAsli(saat)} file="dentum.wav" />)}
      <Suara saat={keAsli(196)} file="gong.wav" volume={0.8} />
    </AbsoluteFill>
  );
};
