// KARAKTER: ANAK JAKSEL — stickman hitam, kepala putih, topi hitam, kacamata hitam,
// syal kuning, tas selempang, sneakers hitam-kuning. Pose santai bersandar di meja.
// Bisa dipakai di episode mana pun: <Jaksel posisi={[x,y,z]} bicaraSejak={...} />
import { useCurrentFrame } from "remotion";
import { BahanGaris, TandaSeru, Tulang, V3 } from "./bentuk";

const HITAM = "#141414";
const KUNING = "#f5b700";
const R = 0.065; // tebal lengan/kaki

const Sepatu: React.FC<{ posisi: V3; putar: number }> = ({ posisi, putar }) => (
  <group position={posisi} rotation={[0, putar, 0]}>
    <mesh position={[0, 0.05, 0.08]}>
      <boxGeometry args={[0.26, 0.08, 0.48]} />
      <meshStandardMaterial color="white" />
    </mesh>
    <mesh position={[0, 0.16, 0.04]}>
      <boxGeometry args={[0.24, 0.16, 0.42]} />
      <meshStandardMaterial color={HITAM} />
    </mesh>
    <mesh position={[0, 0.17, 0.08]}>
      <boxGeometry args={[0.25, 0.08, 0.2]} />
      <meshStandardMaterial color={KUNING} />
    </mesh>
    <mesh position={[0, 0.28, -0.08]}>
      <boxGeometry args={[0.22, 0.14, 0.18]} />
      <meshStandardMaterial color={KUNING} />
    </mesh>
  </group>
);

type Props = {
  posisi: V3;
  hadap?: number;
  bicaraSejak: number | null;
};

export const Jaksel: React.FC<Props> = ({ posisi, hadap = -0.25, bicaraSejak }) => {
  const frame = useCurrentFrame();
  const bicara = bicaraSejak !== null;

  const goyang = Math.sin(frame / 18) * 0.02;
  const angguk = bicara ? Math.sin(frame / 4.5) * 0.07 : Math.sin(frame / 25) * 0.03;
  const mulut = bicara ? 0.4 + Math.abs(Math.sin(frame / 2.4)) * 0.8 : 0.25;

  // Titik-titik sendi (pose bersandar, kaki menyilang)
  const pinggul: V3 = [0, 1.5, 0];
  const leher: V3 = [-0.08 + goyang, 2.5, 0];
  const bahuKiri: V3 = [-0.1 + goyang, 2.38, 0];
  const bahuKanan: V3 = [0.02 + goyang, 2.38, 0];

  return (
    <group position={posisi} rotation={[0, hadap, 0]}>
      {/* Kaki menyilang */}
      <Tulang dari={pinggul} ke={[0.02, 0.8, 0.05]} r={R} warna={HITAM} />
      <Tulang dari={[0.02, 0.8, 0.05]} ke={[0.2, 0.25, 0.1]} r={R} warna={HITAM} />
      <Tulang dari={pinggul} ke={[0.02, 0.8, -0.05]} r={R} warna={HITAM} />
      <Tulang dari={[0.02, 0.8, -0.05]} ke={[-0.12, 0.25, -0.05]} r={R} warna={HITAM} />
      <Sepatu posisi={[0.22, 0, 0.12]} putar={-0.3} />
      <Sepatu posisi={[-0.14, 0, -0.05]} putar={0.2} />

      {/* Badan */}
      <Tulang dari={pinggul} ke={leher} r={R + 0.01} warna={HITAM} />

      {/* Lengan kiri: siku bertumpu di meja */}
      <Tulang dari={bahuKiri} ke={[-0.55, 1.42, 0.1]} r={R} warna={HITAM} />
      <Tulang dari={[-0.55, 1.42, 0.1]} ke={[-0.9, 1.45, 0.3]} r={R} warna={HITAM} />
      <mesh position={[-0.95, 1.45, 0.32]}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color={HITAM} />
      </mesh>
      {/* Lengan kanan: tangan di pinggang */}
      <Tulang dari={bahuKanan} ke={[0.5, 1.95, 0]} r={R} warna={HITAM} />
      <Tulang dari={[0.5, 1.95, 0]} ke={[0.18, 1.6, 0.05]} r={R} warna={HITAM} />
      <mesh position={[0.16, 1.58, 0.06]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color={HITAM} />
      </mesh>

      {/* Tas selempang + tali */}
      <Tulang dari={[-0.12, 2.35, 0.08]} ke={[0.25, 1.75, 0.15]} r={0.025} warna={HITAM} />
      <group position={[0.3, 1.6, 0.12]} rotation={[0, 0, -0.1]}>
        <mesh>
          <boxGeometry args={[0.42, 0.32, 0.12]} />
          <meshStandardMaterial color="#1c1c1c" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.06, 0.065]}>
          <boxGeometry args={[0.44, 0.14, 0.02]} />
          <meshStandardMaterial color="#262626" />
        </mesh>
        {/* Logo mahkota kecil */}
        {[-0.05, 0, 0.05].map((x, i) => (
          <mesh key={x} position={[x, -0.06 + (i === 1 ? 0.02 : 0), 0.07]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.022, 0.07, 4]} />
            <meshBasicMaterial color="white" />
          </mesh>
        ))}
      </group>

      {/* Syal kuning */}
      <group position={[leher[0], 2.43, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.07, 12, 28]} />
          <meshStandardMaterial color={KUNING} roughness={0.8} />
        </mesh>
      </group>
      <Tulang dari={[leher[0] + 0.05, 2.4, 0.15]} ke={[0.05 + goyang, 1.95, 0.18]} r={0.06} warna={KUNING} />
      <Tulang dari={[leher[0] - 0.02, 2.4, 0.15]} ke={[-0.08 + goyang, 2.05, 0.2]} r={0.055} warna={KUNING} />

      {/* Kepala putih dengan garis hitam */}
      <group position={[leher[0] - 0.02, 2.88, 0]} rotation={[angguk, 0.15, -0.06]}>
        <mesh>
          <sphereGeometry args={[0.4, 40, 40]} />
          <meshStandardMaterial color="white" roughness={0.4} />
        </mesh>
        <mesh scale={1.07}>
          <sphereGeometry args={[0.4, 40, 40]} />
          <BahanGaris />
        </mesh>
        {/* Kacamata hitam */}
        {[-0.15, 0.15].map((x) => (
          <mesh key={x} position={[x, 0.02, 0.36]} scale={[0.15, 0.1, 0.05]}>
            <sphereGeometry args={[1, 20, 20]} />
            <meshStandardMaterial color="#050505" metalness={0.6} roughness={0.15} />
          </mesh>
        ))}
        <mesh position={[0, 0.05, 0.39]}>
          <boxGeometry args={[0.1, 0.03, 0.03]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
        {/* Mulut kecil */}
        <mesh position={[0.02, -0.2, 0.36]} scale={[0.07, 0.03 * mulut * 2, 0.03]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* Topi hitam (lidah topi ke samping-depan) */}
        <group rotation={[-0.15, 0, 0.12]}>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.43, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={HITAM} roughness={0.5} side={2} />
          </mesh>
          <mesh position={[-0.3, 0.1, 0.28]} rotation={[0.1, -0.75, 0.05]} scale={[1, 1, 1.4]}>
            <cylinderGeometry args={[0.3, 0.3, 0.035, 32, 1, false, -Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color={HITAM} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshStandardMaterial color={HITAM} />
          </mesh>
        </group>
      </group>

      <TandaSeru posisi={[0.65, 3.35, 0]} sejak={bicaraSejak} />
    </group>
  );
};
