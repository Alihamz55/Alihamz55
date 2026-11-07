import { useThree } from "@react-three/fiber";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { Karakter } from "./Karakter";
import { AKHIR_DIALOG, INTRO_DETIK, FPS, pembicaraDiFrame } from "./naskah";

const POS_PENJUAL: [number, number, number] = [-1.15, 0, -0.6];
const POS_JAKSEL: [number, number, number] = [1.15, 0, 0.6];

// Kamera bergerak pelan ke arah orang yang sedang bicara
const Kamera: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera);

  // Intro: kamera turun dari atas
  const masuk = interpolate(frame, [0, INTRO_DETIK * FPS], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Hitung target x dengan halus (rata-rata beberapa frame terakhir)
  let targetX = 0;
  const sampel = 12;
  for (let i = 0; i < sampel; i++) {
    const p = pembicaraDiFrame(frame - i);
    targetX += p ? (p.siapa === "penjual" ? -0.35 : 0.35) : 0;
  }
  targetX /= sampel;

  const keluar = interpolate(frame, [AKHIR_DIALOG, AKHIR_DIALOG + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(masuk, [0, 1], [6, 2.5]) + keluar * 1.5;
  const z = interpolate(masuk, [0, 1], [13, 10]) + keluar * 2;
  camera.position.set(targetX, y, z);
  camera.lookAt(targetX * 0.8, 1.2, 0);
  return null;
};

// Uap dari mangkok coto
const Uap: React.FC<{ posisi: [number, number, number] }> = ({ posisi }) => {
  const frame = useCurrentFrame();
  return (
    <group position={posisi}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t = ((frame + i * 15) % 90) / 90;
        return (
          <mesh key={i} position={[Math.sin(t * 6 + i) * 0.08, t * 0.8, 0]} scale={0.06 + t * 0.08}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="white" transparent opacity={(1 - t) * 0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

const MangkokCoto: React.FC<{ posisi: [number, number, number] }> = ({ posisi }) => (
  <group position={posisi}>
    <mesh>
      <cylinderGeometry args={[0.3, 0.18, 0.2, 32]} />
      <meshStandardMaterial color="#f8f8f8" roughness={0.3} />
    </mesh>
    {/* Kuah coto cokelat */}
    <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.27, 32]} />
      <meshStandardMaterial color="#7a4a22" />
    </mesh>
    <Uap posisi={[0, 0.12, 0]} />
  </group>
);

// Ketupat hijau yang digantung
const Ketupat: React.FC<{ posisi: [number, number, number]; fase: number }> = ({ posisi, fase }) => {
  const frame = useCurrentFrame();
  return (
    <group position={posisi} rotation={[0, 0, Math.sin(frame / 20 + fase) * 0.1]}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.5, 6]} />
        <meshStandardMaterial color="#6b4f2a" />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, Math.PI / 4]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial color="#7cb342" roughness={0.8} />
      </mesh>
    </group>
  );
};

export const Warung: React.FC = () => {
  const frame = useCurrentFrame();
  const aktif = pembicaraDiFrame(frame);

  return (
    <>
      <Kamera />
      <color attach="background" args={["#f6c177"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 6, 5]} intensity={1.6} />
      <pointLight position={[0, 3.5, 1]} intensity={8} color="#ffcf8a" />

      {/* Lantai */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>
      {/* Dinding belakang */}
      <mesh position={[0, 3, -2.5]}>
        <planeGeometry args={[20, 7]} />
        <meshStandardMaterial color="#e9d8a6" />
      </mesh>
      {/* Balok kayu tempat gantung ketupat */}
      <mesh position={[0, 3.2, -2.3]}>
        <boxGeometry args={[4.5, 0.12, 0.12]} />
        <meshStandardMaterial color="#6b4f2a" />
      </mesh>

      {/* Ketupat */}
      {[-1.6, -0.8, 0.8, 1.6].map((x, i) => (
        <Ketupat key={x} posisi={[x, 2.9, -2.2]} fase={i} />
      ))}

      {/* Penjual di belakang meja */}
      <Karakter
        jenis="penjual"
        posisi={POS_PENJUAL}
        hadap={0.45}
        warnaBaju="#2e7d32"
        warnaKulit="#c68642"
        bicara={aktif?.siapa === "penjual"}
      />

      {/* Meja / gerobak */}
      <mesh position={[-0.9, 0.55, -0.1]}>
        <boxGeometry args={[2.4, 1.1, 0.8]} />
        <meshStandardMaterial color="#8d5524" roughness={0.8} />
      </mesh>
      <mesh position={[-0.9, 1.12, -0.1]}>
        <boxGeometry args={[2.6, 0.06, 1]} />
        <meshStandardMaterial color="#5d3a1a" />
      </mesh>
      {/* Panci besar */}
      <mesh position={[-0.15, 1.4, -0.3]}>
        <cylinderGeometry args={[0.35, 0.35, 0.5, 32]} />
        <meshStandardMaterial color="#9e9e9e" metalness={0.8} roughness={0.3} />
      </mesh>
      <Uap posisi={[-0.15, 1.68, -0.3]} />
      <MangkokCoto posisi={[0.1, 1.25, 0.2]} />

      {/* Jaksel di depan meja */}
      <Karakter
        jenis="jaksel"
        posisi={POS_JAKSEL}
        hadap={-0.55}
        warnaBaju="#f48fb1"
        warnaKulit="#f1c27d"
        bicara={aktif?.siapa === "jaksel"}
      />
    </>
  );
};
