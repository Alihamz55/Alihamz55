// KARAKTER: DAENG (penjual) — kepala bulat, topi fedora putih, kumis, baju pink, celemek merah.
// Bisa dipakai di episode mana pun: <Daeng posisi={[x,y,z]} bicaraSejak={...} />
import { useCurrentFrame } from "remotion";
import { TandaSeru, Tulang, V3 } from "./bentuk";

const KULIT = "#f2b27c";
const BAJU = "#f49ac1";
const CELEMEK = "#d62828";

type Props = {
  posisi: V3;
  hadap?: number;
  bicaraSejak: number | null; // frame mulai bicara (null = diam)
};

export const Daeng: React.FC<Props> = ({ posisi, hadap = 0.25, bicaraSejak }) => {
  const frame = useCurrentFrame();
  const bicara = bicaraSejak !== null;

  const napas = Math.sin(frame / 14) * 0.015;
  const mulut = bicara ? 0.45 + Math.abs(Math.sin(frame / 2.6)) * 0.75 : 0.35;
  const angguk = bicara ? Math.sin(frame / 5) * 0.05 : Math.sin(frame / 30) * 0.02;
  // Tangan kanan gerak-gerak saat bicara
  const lambai = bicara ? Math.sin(frame / 4) * 0.12 : 0;
  const tangan: V3 = [1.05, 1.8 + lambai, 0.5];
  const kedip = frame % 110 < 4 ? 0.15 : 1;

  return (
    <group position={posisi} rotation={[0, hadap, 0]}>
      {/* Badan + celemek */}
      <group scale={[1, 1 + napas, 1]}>
        <mesh position={[0, 1.35, 0]}>
          <capsuleGeometry args={[0.5, 0.7, 8, 24]} />
          <meshStandardMaterial color={BAJU} roughness={0.75} />
        </mesh>
        <mesh position={[0, 1.25, 0.47]}>
          <boxGeometry args={[0.72, 1.0, 0.06]} />
          <meshStandardMaterial color={CELEMEK} roughness={0.7} />
        </mesh>
        {[-0.24, 0.24].map((x) => (
          <mesh key={x} position={[x, 1.88, 0.36]} rotation={[-0.5, 0, 0]}>
            <boxGeometry args={[0.1, 0.4, 0.04]} />
            <meshStandardMaterial color={CELEMEK} />
          </mesh>
        ))}
      </group>

      {/* Lengan kiri bertumpu di meja, lengan kanan menunjuk/menjelaskan */}
      <Tulang dari={[-0.45, 1.8, 0]} ke={[-0.55, 1.4, 0.45]} r={0.13} warna={BAJU} />
      <Tulang dari={[-0.55, 1.4, 0.45]} ke={[-0.2, 1.38, 0.85]} r={0.13} warna={BAJU} />
      <mesh position={[-0.12, 1.38, 0.9]} scale={[1, 0.75, 1]}>
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial color={KULIT} />
      </mesh>
      <Tulang dari={[0.45, 1.8, 0]} ke={[0.8, 1.5, 0.35]} r={0.13} warna={BAJU} />
      <Tulang dari={[0.8, 1.5, 0.35]} ke={tangan} r={0.13} warna={BAJU} />
      <mesh position={[tangan[0] + 0.08, tangan[1] + 0.05, tangan[2]]} rotation={[0, 0, -0.5]} scale={[1, 0.7, 0.55]}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color={KULIT} />
      </mesh>

      {/* Kepala */}
      <group position={[0, 2.55, 0.05]} rotation={[angguk, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.62, 40, 40]} />
          <meshStandardMaterial color={KULIT} roughness={0.55} />
        </mesh>
        {/* Mata besar + kilau */}
        {[-0.21, 0.21].map((x) => (
          <group key={x} position={[x, 0.1, 0.55]} scale={[1, kedip, 1]}>
            <mesh scale={[0.1, 0.14, 0.06]}>
              <sphereGeometry args={[1, 20, 20]} />
              <meshStandardMaterial color="#111" roughness={0.2} />
            </mesh>
            <mesh position={[0.03, 0.05, 0.05]}>
              <sphereGeometry args={[0.03, 10, 10]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        ))}
        {/* Alis */}
        {[-0.21, 0.21].map((x) => (
          <mesh key={x} position={[x, 0.32, 0.53]} rotation={[0, 0, Math.PI / 2 + (x > 0 ? -0.15 : 0.15)]}>
            <capsuleGeometry args={[0.025, 0.12, 4, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))}
        {/* Kumis */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.09, -0.1, 0.6]} rotation={[0, 0, s * 1.15]}>
            <capsuleGeometry args={[0.045, 0.12, 4, 10]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))}
        {/* Mulut terbuka (senyum) */}
        <group position={[0, -0.27, 0.54]} scale={[1, mulut, 1]}>
          <mesh scale={[0.17, 0.12, 0.06]}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color="#7a1c1c" />
          </mesh>
          <mesh position={[0, -0.05, 0.03]} scale={[0.1, 0.05, 0.04]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#e86a6a" />
          </mesh>
        </group>
        {/* Topi fedora putih */}
        <group position={[0, 0.42, 0]} rotation={[0.08, 0, 0.08]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.95, 0.95, 0.05, 48]} />
            <meshStandardMaterial color="#f7f5f0" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.27, 0]}>
            <cylinderGeometry args={[0.42, 0.5, 0.5, 40]} />
            <meshStandardMaterial color="#f7f5f0" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.505, 0.51, 0.1, 40]} />
            <meshStandardMaterial color="#e4e0d6" />
          </mesh>
        </group>
      </group>

      <TandaSeru posisi={[-0.75, 3.35, 0.2]} sejak={bicaraSejak} cermin />
    </group>
  );
};
