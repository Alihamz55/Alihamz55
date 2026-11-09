// Efek air mata: menggenang di kelopak mata, mengalir di pipi, lalu menetes jatuh.
import { useMemo } from "react";
import { CatmullRomCurve3, Vector3 } from "three";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { puncak } from "./lagu";

type KePlane = (px: number, py: number) => [number, number, number];

import type { KonfigKarakter } from "./karakter";

// Jadwal tetesan (detik mulai, sisi). Lebih rapat saat puncak lagu.
const buatJadwal = (durasi: number) => {
  const hasil: { t: number; sisi: "kiri" | "kanan" }[] = [];
  let t = 5;
  let i = 0;
  while (t < durasi - 3) {
    const diPuncak = puncak.some(([a, b]) => t >= a - 1 && t <= b);
    hasil.push({ t, sisi: i % 2 === 0 ? "kiri" : "kanan" });
    // jeda acak tapi tetap sama setiap render (pakai sin, bukan Math.random)
    const acak = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    t += diPuncak ? 0.9 + Math.abs(acak) * 0.6 : 2.6 + Math.abs(acak) * 1.8;
    i++;
  }
  return hasil;
};

const LAMA_ALIR = 2.4; // detik dari mata sampai dagu
const LAMA_JATUH = 0.7;

const Tetes: React.FC<{ jalur: CatmullRomCurve3; mulai: number; z: number }> = ({ jalur, mulai, z }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - mulai;
  if (t < -0.8 || t > LAMA_ALIR + LAMA_JATUH + 1.5) return null;

  // Menggenang dulu sebelum mengalir
  const genang = interpolate(t, [-0.8, 0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = interpolate(t, [0, LAMA_ALIR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => x * x * (3 - 2 * x),
  });
  const ujung = jalur.getPoint(p);
  const jatuh = Math.max(0, t - LAMA_ALIR);
  const posY = ujung.y - 2.2 * jatuh * jatuh;
  const pudar = interpolate(t, [LAMA_ALIR, LAMA_ALIR + LAMA_JATUH], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Jejak basah di pipi memudar pelan
  const jejakPudar = interpolate(t, [LAMA_ALIR, LAMA_ALIR + 1.5], [0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ukuran = 0.012 + 0.006 * genang;

  const titikJejak = 70;
  return (
    <group>
      {/* Jejak basah berkilau */}
      {Array.from({ length: titikJejak }).map((_, i) => {
        const q = (i / (titikJejak - 1)) * p;
        const v = jalur.getPoint(q);
        return (
          <mesh key={i} position={[v.x, v.y, z]}>
            <circleGeometry args={[0.0065, 10]} />
            <meshBasicMaterial color="#e8f6ff" transparent opacity={jejakPudar * (0.25 + 0.4 * (i / titikJejak))} depthWrite={false} />
          </mesh>
        );
      })}
      {/* Tetesan */}
      {pudar > 0 && (
        <group position={[ujung.x, posY, z + 0.002]} scale={[ukuran, ukuran * (1.3 + p * 0.3), ukuran]}>
          <mesh>
            <circleGeometry args={[1, 24]} />
            <meshBasicMaterial color="#cfeeff" transparent opacity={0.75 * pudar * Math.max(genang, 0.2)} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, 0.001]} scale={0.75}>
            <ringGeometry args={[0.75, 1, 24]} />
            <meshBasicMaterial color="#6fa8c8" transparent opacity={0.45 * pudar} depthWrite={false} />
          </mesh>
          {/* kilau putih */}
          <mesh position={[-0.35, 0.35, 0.002]}>
            <circleGeometry args={[0.3, 12]} />
            <meshBasicMaterial color="white" transparent opacity={0.95 * pudar} depthWrite={false} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Kilau basah di kelopak mata (berkedip pelan)
const KilauMata: React.FC<{ posisi: [number, number, number]; kuat: number }> = ({ posisi, kuat }) => {
  const frame = useCurrentFrame();
  const kedip = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <group position={posisi}>
      {[-0.025, 0, 0.025].map((x, i) => (
        <mesh key={x} position={[x, 0, 0]}>
          <circleGeometry args={[0.004 + (i === 1 ? 0.002 : 0), 8]} />
          <meshBasicMaterial color="white" transparent opacity={kuat * (0.4 + 0.6 * ((kedip + i * 0.3) % 1))} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

export const AirMata: React.FC<{ kePlane: KePlane; durasi: number; karakter: KonfigKarakter }> = ({ kePlane, durasi, karakter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = 0.01;
  const [kiri, kanan] = useMemo(
    () =>
      [karakter.jalurAirMataKiri, karakter.jalurAirMataKanan].map(
        (j) => new CatmullRomCurve3(j.map(([x, y]) => new Vector3(...kePlane(x, y))))
      ),
    [kePlane, karakter]
  );
  const jadwal = useMemo(() => buatJadwal(durasi), [durasi]);
  const detik = frame / fps;
  const kilau = interpolate(detik, [3, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <group>
      <KilauMata posisi={kePlane(...karakter.jalurAirMataKiri[0])} kuat={kilau} />
      <KilauMata posisi={kePlane(...karakter.jalurAirMataKanan[0])} kuat={kilau} />
      {jadwal.map((j, i) => (
        <Tetes key={i} jalur={j.sisi === "kiri" ? kiri : kanan} mulai={j.t} z={z} />
      ))}
    </group>
  );
};
