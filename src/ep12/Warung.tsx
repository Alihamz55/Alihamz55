import { useThree } from "@react-three/fiber";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Daeng } from "../karakter/Daeng";
import { Jaksel } from "../karakter/Jaksel";
import { AKHIR_DIALOG, FPS, INTRO_DETIK, pembicaraDiFrame } from "./naskah";

// Kamera bergerak pelan ke arah orang yang sedang bicara
const Kamera: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera);

  const masuk = interpolate(frame, [0, INTRO_DETIK * FPS], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  let targetX = 0;
  const sampel = 12;
  for (let i = 0; i < sampel; i++) {
    const p = pembicaraDiFrame(frame - i);
    targetX += p ? (p.siapa === "penjual" ? -0.25 : 0.25) : 0;
  }
  targetX /= sampel;

  const keluar = interpolate(frame, [AKHIR_DIALOG, AKHIR_DIALOG + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(masuk, [0, 1], [6, 2.75]) + keluar * 1.2;
  const z = interpolate(masuk, [0, 1], [14, 8.6]) + keluar * 2;
  camera.position.set(targetX, y, z);
  camera.lookAt(targetX * 0.8, 2.25, 0);
  return null;
};

const Uap: React.FC<{ posisi: [number, number, number]; besar?: number }> = ({ posisi, besar = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <group position={posisi} scale={besar}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const t = ((frame + i * 13) % 90) / 90;
        return (
          <mesh key={i} position={[Math.sin(t * 6 + i) * 0.1, t * 1.1, 0]} scale={0.08 + t * 0.12}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="white" transparent opacity={(1 - t) * 0.45} />
          </mesh>
        );
      })}
    </group>
  );
};

// Mangkok putih motif ayam jago
const MangkokAyamJago: React.FC<{ posisi: [number, number, number] }> = ({ posisi }) => (
  <group position={posisi}>
    <mesh>
      <cylinderGeometry args={[0.36, 0.22, 0.26, 40]} />
      <meshStandardMaterial color="#fbfbfb" roughness={0.25} />
    </mesh>
    <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.33, 32]} />
      <meshStandardMaterial color="#7a4a22" />
    </mesh>
    {/* ayam jago (merah) + daun (hijau) di sisi depan */}
    <mesh position={[0.1, 0.0, 0.3]} scale={[0.06, 0.05, 0.02]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial color="#d62828" />
    </mesh>
    <mesh position={[0.15, 0.04, 0.3]} scale={[0.02, 0.03, 0.02]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial color="#d62828" />
    </mesh>
    {[-0.12, -0.05].map((x, i) => (
      <mesh key={x} position={[x, 0.01, 0.3]} rotation={[0, 0, i ? 0.6 : -0.6]} scale={[0.05, 0.025, 0.015]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color="#2e8b3a" />
      </mesh>
    ))}
    <Uap posisi={[0, 0.15, 0]} besar={0.7} />
  </group>
);

// Gelas/cangkir hijau digantung
const GelasHijau: React.FC<{ x: number; fase: number }> = ({ x, fase }) => {
  const frame = useCurrentFrame();
  return (
    <group position={[x, 4.55, -2.2]} rotation={[0, 0, Math.sin(frame / 22 + fase) * 0.06]}>
      <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.025, 8, 16]} />
        <meshStandardMaterial color="#6b4423" metalness={0.5} />
      </mesh>
      <group position={[0, -0.5, 0]} rotation={[0, 0, 0.12]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.2, 0.42, 28]} />
          <meshStandardMaterial color="#43a047" roughness={0.35} />
        </mesh>
        <mesh position={[0.25, 0, 0]}>
          <torusGeometry args={[0.11, 0.035, 10, 20]} />
          <meshStandardMaterial color="#43a047" roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
};

const Tanaman: React.FC<{ posisi: [number, number, number] }> = ({ posisi }) => {
  const frame = useCurrentFrame();
  return (
    <group position={posisi}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.35, 0.28, 0.7, 28]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.6} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return (
          <group key={i} position={[0, 0.75, 0]} rotation={[Math.cos(a) * 0.7, a, Math.sin(a) * 0.7 + Math.sin(frame / 25 + i) * 0.03]}>
            <mesh position={[0, 0.45, 0]} scale={[0.16, 0.5, 0.05]}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={i % 2 ? "#2e7d32" : "#388e3c"} roughness={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

const WadahSendok: React.FC<{ posisi: [number, number, number] }> = ({ posisi }) => (
  <group position={posisi}>
    <mesh position={[0, 0.22, 0]}>
      <boxGeometry args={[0.45, 0.45, 0.32]} />
      <meshStandardMaterial color="#b07a45" roughness={0.8} />
    </mesh>
    {[-0.14, -0.05, 0.04, 0.13].map((x, i) => (
      <group key={x} position={[x, 0.55, 0]} rotation={[0, 0, (i - 1.5) * 0.12]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
          <meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.28, 0]} scale={[0.06, 0.09, 0.03]}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#b0b6bc" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
    ))}
  </group>
);

export const Warung: React.FC = () => {
  const frame = useCurrentFrame();
  const aktif = pembicaraDiFrame(frame);
  const sejak = (s: "penjual" | "jaksel") => (aktif?.siapa === s ? aktif.mulai : null);

  return (
    <>
      <Kamera />
      <color attach="background" args={["#f3e3c3"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 7, 6]} intensity={1.7} />
      <pointLight position={[0, 4, 2]} intensity={10} color="#ffd9a0" />

      {/* Lantai merah bata + dinding krem */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#b4472a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4, -2.5]}>
        <planeGeometry args={[30, 9]} />
        <meshStandardMaterial color="#f3e3c3" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.12, -2.45]}>
        <boxGeometry args={[30, 0.24, 0.08]} />
        <meshStandardMaterial color="#7a4a2a" />
      </mesh>

      {/* Bingkai di dinding kanan */}
      <mesh position={[2.75, 3.3, -2.44]}>
        <boxGeometry args={[0.9, 1.6, 0.08]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      <mesh position={[2.75, 3.3, -2.39]}>
        <boxGeometry args={[0.7, 1.4, 0.02]} />
        <meshStandardMaterial color="#dfe8d5" />
      </mesh>

      {/* Rel kayu + gelas hijau */}
      <mesh position={[-0.6, 4.6, -2.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 5.5, 16]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
      {[-2.5, -1.3, 0.1, 1.3].map((x, i) => (
        <GelasHijau key={x} x={x} fase={i} />
      ))}

      <Tanaman posisi={[2.7, 0, -1.6]} />

      {/* Daeng di belakang meja */}
      <Daeng posisi={[-1.35, 0, -0.95]} bicaraSejak={sejak("penjual")} />

      {/* Panci besar + uap */}
      <mesh position={[-0.35, 1.7, -0.35]}>
        <cylinderGeometry args={[0.45, 0.45, 0.8, 36]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[-0.35, 2.12, -0.35]}>
        <cylinderGeometry args={[0.47, 0.47, 0.05, 36]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} />
      </mesh>
      <Uap posisi={[-0.35, 2.2, -0.35]} />

      {/* Meja kayu */}
      <mesh position={[-1.2, 0.65, 0]}>
        <boxGeometry args={[3.4, 1.3, 1]} />
        <meshStandardMaterial color="#8a4f26" roughness={0.75} />
      </mesh>
      <mesh position={[-1.2, 1.33, 0.02]}>
        <boxGeometry args={[3.6, 0.08, 1.12]} />
        <meshStandardMaterial color="#6e3b1a" roughness={0.6} />
      </mesh>
      {[0.95, 0.6, 0.25].map((y) => (
        <mesh key={y} position={[-1.2, y, 0.505]}>
          <boxGeometry args={[3.4, 0.02, 0.01]} />
          <meshStandardMaterial color="#6e3b1a" />
        </mesh>
      ))}
      <WadahSendok posisi={[-2.55, 1.37, -0.05]} />
      <MangkokAyamJago posisi={[-0.75, 1.5, 0.2]} />

      {/* Jaksel bersandar di ujung meja */}
      <Jaksel posisi={[1.35, 0, 0.45]} bicaraSejak={sejak("jaksel")} />
    </>
  );
};
