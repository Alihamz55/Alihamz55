import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Bangers";
import { Keyframe, Pose, Stickman, keLayar, poseDi, sendi } from "./Stickman";

/*
 * DUEL STICKMAN — gaya kung fu tangan kosong (original)
 * Alur: saling pasang kuda-kuda → lawan menyerang → ditangkis → pukulan beruntun
 *       → pukulan pamungkas (slow-motion) → lawan terlempar → K.O.
 * Musik & efek suara (whoosh, pukulan) tambahkan di CapCut.
 */

const FONT = loadFont("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const LANTAI = 1500;
const SKALA = 1.3;

// ===== Pose-pose dasar (tanpa posisi x) =====
type Bentuk = Omit<Pose, "x" | "naik">;
const pose = (b: Bentuk, x: number, naik = 0): Pose => ({ ...b, x, naik });

const KUDA_KUDA: Bentuk = { badan: 5, lenganDepan: 60, tanganDepan: 95, lenganBelakang: 35, tanganBelakang: 110, pahaDepan: 22, betisDepan: -5, pahaBelakang: -18, betisBelakang: -12 };
const TANGKIS: Bentuk = { badan: -6, lenganDepan: 120, tanganDepan: 165, lenganBelakang: 70, tanganBelakang: 95, pahaDepan: 18, betisDepan: -5, pahaBelakang: -22, betisBelakang: -15 };
const PUKUL_A: Bentuk = { badan: 10, lenganDepan: 90, tanganDepan: 90, lenganBelakang: 40, tanganBelakang: 125, pahaDepan: 28, betisDepan: -5, pahaBelakang: -20, betisBelakang: -15 };
const PUKUL_B: Bentuk = { badan: 10, lenganDepan: 45, tanganDepan: 125, lenganBelakang: 92, tanganBelakang: 90, pahaDepan: 28, betisDepan: -5, pahaBelakang: -20, betisBelakang: -15 };
const ANCANG: Bentuk = { badan: -6, lenganDepan: 50, tanganDepan: 120, lenganBelakang: -45, tanganBelakang: 40, pahaDepan: 25, betisDepan: -8, pahaBelakang: -25, betisBelakang: -15 };
const PAMUNGKAS: Bentuk = { badan: 22, lenganDepan: 25, tanganDepan: 80, lenganBelakang: 95, tanganBelakang: 92, pahaDepan: 55, betisDepan: -8, pahaBelakang: -55, betisBelakang: -35 };
const HORMAT: Bentuk = { badan: 0, lenganDepan: 30, tanganDepan: 118, lenganBelakang: 25, tanganBelakang: 128, pahaDepan: 6, betisDepan: 0, pahaBelakang: -6, betisBelakang: 0 };

const SIAGA: Bentuk = { badan: 8, lenganDepan: 45, tanganDepan: 150, lenganBelakang: 30, tanganBelakang: 160, pahaDepan: 25, betisDepan: 0, pahaBelakang: -25, betisBelakang: -10 };
const LARI: Bentuk = { badan: 18, lenganDepan: 20, tanganDepan: 120, lenganBelakang: -30, tanganBelakang: 60, pahaDepan: 55, betisDepan: -30, pahaBelakang: -40, betisBelakang: -70 };
const SERANG: Bentuk = { badan: 20, lenganDepan: 40, tanganDepan: 150, lenganBelakang: 92, tanganBelakang: 90, pahaDepan: 35, betisDepan: 0, pahaBelakang: -35, betisBelakang: -10 };
const KENA_A: Bentuk = { badan: -15, lenganDepan: 75, tanganDepan: 170, lenganBelakang: 100, tanganBelakang: 175, pahaDepan: 20, betisDepan: 0, pahaBelakang: -30, betisBelakang: -10 };
const KENA_B: Bentuk = { badan: -24, lenganDepan: 110, tanganDepan: 160, lenganBelakang: 55, tanganBelakang: 150, pahaDepan: 15, betisDepan: 0, pahaBelakang: -32, betisBelakang: -12 };
const TERLEMPAR: Bentuk = { badan: -70, lenganDepan: 160, tanganDepan: 200, lenganBelakang: 120, tanganBelakang: 180, pahaDepan: 60, betisDepan: 40, pahaBelakang: 30, betisBelakang: 10 };
const TERKAPAR: Bentuk = { badan: -88, lenganDepan: -150, tanganDepan: -120, lenganBelakang: -100, tanganBelakang: -92, pahaDepan: 140, betisDepan: 50, pahaBelakang: 95, betisBelakang: 85 };

// ===== Koreografi (dalam "waktu adegan") =====
const JUMLAH_PUKULAN = 12;
const PUKULAN_MULAI = 62;
const JEDA = 4;
const SAAT_PAMUNGKAS = 118;
const SAAT_PUKULAN = Array.from({ length: JUMLAH_PUKULAN }, (_, i) => PUKULAN_MULAI + i * JEDA);

const kunciJagoan: Keyframe[] = [
  [0, pose(KUDA_KUDA, 170)],
  [22, pose(KUDA_KUDA, 170)],
  [44, pose(KUDA_KUDA, 295)],
  [50, pose(TANGKIS, 300)],
  [57, pose(TANGKIS, 305)],
  ...SAAT_PUKULAN.map((f, i): Keyframe => [f, pose(i % 2 === 0 ? PUKUL_A : PUKUL_B, 305 + (i / JUMLAH_PUKULAN) * 70)]),
  [111, pose(ANCANG, 370)],
  [SAAT_PAMUNGKAS, pose(PAMUNGKAS, 435)],
  [138, pose(PAMUNGKAS, 435)],
  [165, pose(KUDA_KUDA, 380)],
  [195, pose(HORMAT, 380)],
  [240, pose(HORMAT, 380)],
];

const kunciLawan: Keyframe[] = [
  [0, pose(SIAGA, 830)],
  [22, pose(SIAGA, 830)],
  [38, pose(LARI, 590)],
  [48, pose(SERANG, 540)],
  [55, pose(SERANG, 542)],
  [59, pose(KENA_A, 548)],
  ...SAAT_PUKULAN.map((f, i): Keyframe => [f + 1, pose(i % 2 === 0 ? KENA_B : KENA_A, 550 + (i / JUMLAH_PUKULAN) * 55)]),
  [113, pose(KENA_A, 610)],
  [SAAT_PAMUNGKAS + 1, pose(KENA_B, 622)],
  [124, pose(TERLEMPAR, 650, 80)],
  [140, pose(TERLEMPAR, 690, 120)],
  [152, pose(TERKAPAR, 700)],
  [240, pose(TERKAPAR, 700)],
];

// Slow-motion: frame asli 110–140 → adegan 110–120 (3x lebih lambat)
const keAdegan = (f: number) => (f < 110 ? f : f < 140 ? 110 + (f - 110) / 3 : f - 20);
const keAsli = (adegan: number) => (adegan < 110 ? adegan : adegan < 120 ? 110 + (adegan - 110) * 3 : adegan + 20);

export const DURASI_DUEL = 260;

// ===== Latar senja =====
const Latar: React.FC = () => (
  <>
    <defs>
      <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a1446" />
        <stop offset="0.55" stopColor="#c2456a" />
        <stop offset="1" stopColor="#ffb44c" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#langit)" />
    <circle cx={540} cy={1080} r={330} fill="#ffd98a" opacity={0.9} />
    {/* Atap-atap di kejauhan */}
    <path
      d="M0 1300 L0 1180 L90 1180 L150 1120 L210 1180 L300 1180 L300 1240 L420 1240 L480 1160 L540 1110 L600 1160 L660 1240 L760 1240 L760 1170 L840 1100 L920 1170 L1080 1170 L1080 1300 Z"
      fill="#3a1840"
      opacity={0.85}
    />
    <rect y={LANTAI} width={1080} height={1920 - LANTAI} fill="#1a0c22" />
    <rect y={LANTAI} width={1080} height={10} fill="#ff9a4c" opacity={0.35} />
  </>
);

// Ledakan kilat di titik pukulan
const Kilat: React.FC<{ x: number; y: number; umur: number; besar: number }> = ({ x, y, umur, besar }) => {
  if (umur < 0 || umur > 8) return null;
  const s = interpolate(umur, [0, 2, 8], [0.4, 1, 1.3]) * besar;
  const o = interpolate(umur, [0, 5, 8], [1, 0.8, 0]);
  const titik = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? 90 : 38;
    const a = (i / 16) * Math.PI * 2;
    return `${Math.cos(a) * r},${Math.sin(a) * r}`;
  }).join(" ");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <polygon points={titik} fill="#fff4b0" stroke="#ff7b1c" strokeWidth={6} />
    </g>
  );
};

const TeksPop: React.FC<{ teks: string; mulai: number; akhir: number; y: number; ukuran: number; warna: string }> = ({
  teks, mulai, akhir, y, ukuran, warna,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < mulai || frame > akhir) return null;
  const pop = spring({ frame: frame - mulai, fps, config: { damping: 9 } });
  const hilang = interpolate(frame, [akhir - 8, akhir], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <div
      style={{
        position: "absolute", top: y, left: 0, right: 0, textAlign: "center",
        fontFamily: FONT, fontSize: ukuran, color: warna, letterSpacing: 4,
        transform: `scale(${pop}) rotate(-4deg)`, opacity: hilang,
        WebkitTextStroke: "10px #111", paintOrder: "stroke", textShadow: "0 10px 0 rgba(0,0,0,0.35)",
      }}
    >
      {teks}
    </div>
  );
};

export const StickmanDuel: React.FC = () => {
  const frame = useCurrentFrame();
  const adegan = keAdegan(frame);

  const jagoan = poseDi(adegan, kunciJagoan);
  const lawan = poseDi(adegan, kunciLawan);

  // Titik dada lawan (tempat pukulan mendarat)
  const dadaLawan = (a: number) => {
    const p = poseDi(a, kunciLawan);
    const s = sendi(p);
    return keLayar(p, -1, SKALA, LANTAI).ubah([s.leher[0] * 0.75, s.leher[1] * 0.75]);
  };

  // Guncangan layar saat pukulan kena
  let guncang = 0;
  SAAT_PUKULAN.forEach((f) => {
    const umur = frame - keAsli(f);
    if (umur >= 0 && umur < 4) guncang += 6 * (1 - umur / 4);
  });
  const umurPamungkas = frame - keAsli(SAAT_PAMUNGKAS);
  if (umurPamungkas >= 0 && umurPamungkas < 18) guncang += 28 * (1 - umurPamungkas / 18);
  const umurJatuh = frame - keAsli(152);
  if (umurJatuh >= 0 && umurJatuh < 10) guncang += 14 * (1 - umurJatuh / 10);
  const gx = (random(`gx${frame}`) - 0.5) * guncang;
  const gy = (random(`gy${frame}`) - 0.5) * guncang;

  // Bayangan gerak (afterimage) saat bergerak cepat
  const pakaiBayangan = (adegan > 36 && adegan < 110) || (adegan > 118 && adegan < 152);
  const bayangan = pakaiBayangan ? [1.5, 3] : [];

  // Hitungan kombo
  const kombo = SAAT_PUKULAN.filter((f) => adegan >= f).length;

  // Kilatan putih saat pukulan pamungkas
  const kilatLayar = umurPamungkas >= 0 ? interpolate(umurPamungkas, [0, 6], [0.8, 0], { extrapolateRight: "clamp" }) : 0;

  return (
    <AbsoluteFill style={{ background: "#1a0c22" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <g transform={`translate(${gx} ${gy})`}>
          <Latar />
          {bayangan.map((mundur, i) => (
            <g key={i}>
              <Stickman pose={poseDi(adegan - mundur, kunciLawan)} hadap={-1} skala={SKALA} lantai={LANTAI} warna="#2b0f3a" frame={frame} opacity={0.25 / (i + 1)} />
              <Stickman pose={poseDi(adegan - mundur, kunciJagoan)} hadap={1} skala={SKALA} lantai={LANTAI} warna="#0d0d0d" frame={frame} opacity={0.3 / (i + 1)} />
            </g>
          ))}
          <Stickman pose={lawan} hadap={-1} skala={SKALA} lantai={LANTAI} warna="#2b0f3a" frame={frame} />
          <Stickman pose={jagoan} hadap={1} skala={SKALA} lantai={LANTAI} warna="#0d0d0d" ikatKepala="#e3261f" frame={frame} />
          {[52, ...SAAT_PUKULAN].map((f, i) => {
            const [x, y] = dadaLawan(f);
            return <Kilat key={i} x={x + (random(`kx${i}`) - 0.5) * 50} y={y + (random(`ky${i}`) - 0.5) * 60} umur={frame - keAsli(f)} besar={0.7} />;
          })}
          {(() => {
            const [x, y] = dadaLawan(SAAT_PAMUNGKAS);
            return <Kilat x={x} y={y} umur={(frame - keAsli(SAAT_PAMUNGKAS)) / 2.5} besar={2.4} />;
          })()}
        </g>
      </svg>

      <AbsoluteFill style={{ background: "white", opacity: kilatLayar }} />
      <TeksPop teks="FIGHT!" mulai={4} akhir={34} y={420} ukuran={210} warna="#ffd400" />
      {kombo >= 2 && adegan < 116 && (
        <div
          style={{
            position: "absolute", top: 380, right: 70, fontFamily: FONT, fontSize: 120 + kombo * 3,
            color: "#fff", WebkitTextStroke: "9px #e3261f", paintOrder: "stroke", transform: "rotate(6deg)",
          }}
        >
          {kombo}x COMBO!
        </div>
      )}
      <TeksPop teks="K.O.!" mulai={keAsli(150)} akhir={DURASI_DUEL} y={360} ukuran={280} warna="#e3261f" />
    </AbsoluteFill>
  );
};
