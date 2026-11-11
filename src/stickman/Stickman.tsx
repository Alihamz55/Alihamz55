import { Easing, interpolate } from "remotion";

/*
 * SISTEM POSE STICKMAN 2D
 *
 * Satu pose = posisi tubuh dalam angka sudut (derajat).
 * Aturan sudut lengan & kaki: 0 = lurus ke bawah, 90 = lurus ke depan, 180 = ke atas, -90 = ke belakang.
 * Sudut badan (badan): 0 = tegak, positif = condong ke depan, negatif = condong ke belakang.
 *
 * Gerakan dibuat dengan "keyframe": daftar [frame, pose]. Di antara dua keyframe,
 * pose dihaluskan otomatis (seperti keyframe di CapCut).
 */

export type Pose = {
  x: number; // posisi horizontal di layar (piksel)
  naik: number; // terangkat dari lantai (untuk lompat / terlempar)
  badan: number;
  lenganDepan: number;
  tanganDepan: number;
  lenganBelakang: number;
  tanganBelakang: number;
  pahaDepan: number;
  betisDepan: number;
  pahaBelakang: number;
  betisBelakang: number;
};

export type Keyframe = [frame: number, pose: Pose];

const UKURAN = { badan: 150, leher: 45, kepala: 40, lengan: 85, kaki: 115, tebal: 18 };

const arah = (derajat: number) => {
  const r = (derajat * Math.PI) / 180;
  return [Math.sin(r), Math.cos(r)] as const;
};

// Hitung letak semua sendi (koordinat lokal, pinggul di 0,0, menghadap kanan)
export const sendi = (p: Pose) => {
  const t = (p.badan * Math.PI) / 180;
  const leher = [UKURAN.badan * Math.sin(t), -UKURAN.badan * Math.cos(t)] as const;
  const kepala = [leher[0] + UKURAN.leher * Math.sin(t), leher[1] - UKURAN.leher * Math.cos(t)] as const;
  const tambah = (a: readonly [number, number], sudut: number, panjang: number) => {
    const [dx, dy] = arah(sudut);
    return [a[0] + dx * panjang, a[1] + dy * panjang] as const;
  };
  const sikuDepan = tambah(leher, p.lenganDepan, UKURAN.lengan);
  const tanganDepan = tambah(sikuDepan, p.tanganDepan, UKURAN.lengan);
  const sikuBelakang = tambah(leher, p.lenganBelakang, UKURAN.lengan);
  const tanganBelakang = tambah(sikuBelakang, p.tanganBelakang, UKURAN.lengan);
  const lututDepan = tambah([0, 0], p.pahaDepan, UKURAN.kaki);
  const kakiDepan = tambah(lututDepan, p.betisDepan, UKURAN.kaki);
  const lututBelakang = tambah([0, 0], p.pahaBelakang, UKURAN.kaki);
  const kakiBelakang = tambah(lututBelakang, p.betisBelakang, UKURAN.kaki);
  return {
    leher, kepala, sikuDepan, tanganDepan, sikuBelakang, tanganBelakang,
    lututDepan, kakiDepan, lututBelakang, kakiBelakang,
  };
};

// Pose di frame tertentu, dihaluskan di antara keyframe
export const poseDi = (frame: number, kunci: Keyframe[]): Pose => {
  if (frame <= kunci[0][0]) return kunci[0][1];
  for (let i = 0; i < kunci.length - 1; i++) {
    const [f0, a] = kunci[i];
    const [f1, b] = kunci[i + 1];
    if (frame <= f1) {
      const t = interpolate(frame, [f0, f1], [0, 1], { easing: Easing.inOut(Easing.quad) });
      const hasil = {} as Pose;
      (Object.keys(a) as (keyof Pose)[]).forEach((k) => {
        hasil[k] = a[k] + (b[k] - a[k]) * t;
      });
      return hasil;
    }
  }
  return kunci[kunci.length - 1][1];
};

// Ubah titik lokal → titik di layar (otomatis menapak lantai)
export const keLayar = (p: Pose, hadap: 1 | -1, skala: number, lantai: number) => {
  const s = sendi(p);
  const titik = [s.kakiDepan, s.kakiBelakang, s.lututDepan, s.lututBelakang, s.leher, s.tanganDepan, s.tanganBelakang];
  const palingBawah = Math.max(0, ...titik.map((q) => q[1]), s.kepala[1] + UKURAN.kepala);
  const pinggulY = lantai - (palingBawah + UKURAN.tebal / 2) * skala - p.naik * skala;
  return {
    pinggulY,
    ubah: (q: readonly [number, number]) => [p.x + q[0] * skala * hadap, pinggulY + q[1] * skala] as const,
  };
};

export const Stickman: React.FC<{
  pose: Pose;
  hadap: 1 | -1;
  skala: number;
  lantai: number;
  warna: string;
  ikatKepala?: string;
  frame: number;
  opacity?: number;
}> = ({ pose, hadap, skala, lantai, warna, ikatKepala, frame, opacity = 1 }) => {
  const s = sendi(pose);
  const { pinggulY } = keLayar(pose, hadap, skala, lantai);
  const garis = (titik: (readonly [number, number])[]) => titik.map((q) => q.join(",")).join(" ");
  const gaya = { fill: "none", stroke: warna, strokeWidth: UKURAN.tebal, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  // Pita ikat kepala berkibar ke belakang
  const kibar = Math.sin(frame / 3) * 10;
  const belakangKepala = [s.kepala[0] - UKURAN.kepala * 0.9, s.kepala[1] - 8] as const;

  return (
    <g transform={`translate(${pose.x} ${pinggulY}) scale(${skala * hadap} ${skala})`} opacity={opacity}>
      <polyline points={garis([s.leher, s.sikuBelakang, s.tanganBelakang])} {...gaya} />
      <polyline points={garis([[0, 0], s.lututBelakang, s.kakiBelakang])} {...gaya} />
      <polyline points={garis([[0, 0], s.leher])} {...gaya} />
      <circle cx={s.kepala[0]} cy={s.kepala[1]} r={UKURAN.kepala} fill={warna} />
      {ikatKepala && (
        <g stroke={ikatKepala} strokeWidth={9} strokeLinecap="round" fill="none">
          <line x1={s.kepala[0] - 38} y1={s.kepala[1] - 12} x2={s.kepala[0] + 38} y2={s.kepala[1] - 12} />
          <path d={`M ${belakangKepala[0]} ${belakangKepala[1]} q -30 ${kibar} -70 ${10 + kibar}`} />
          <path d={`M ${belakangKepala[0]} ${belakangKepala[1] + 4} q -25 ${-kibar} -60 ${28 - kibar}`} />
        </g>
      )}
      <polyline points={garis([[0, 0], s.lututDepan, s.kakiDepan])} {...gaya} />
      <polyline points={garis([s.leher, s.sikuDepan, s.tanganDepan])} {...gaya} />
    </g>
  );
};
