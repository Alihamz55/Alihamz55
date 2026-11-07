import { useCurrentFrame } from "remotion";

type Props = {
  posisi: [number, number, number];
  hadap: number; // rotasi Y (radian)
  warnaBaju: string;
  warnaKulit: string;
  bicara: boolean;
  jenis: "penjual" | "jaksel";
};

// Karakter sederhana dari bentuk dasar (kapsul, bola, silinder)
export const Karakter: React.FC<Props> = ({ posisi, hadap, warnaBaju, warnaKulit, bicara, jenis }) => {
  const frame = useCurrentFrame();

  // Napas pelan (selalu) + lompat kecil saat bicara
  const napas = Math.sin(frame / 12) * 0.02;
  const lompat = bicara ? Math.abs(Math.sin(frame / 4)) * 0.08 : 0;
  // Mulut buka-tutup saat bicara
  const mulut = bicara ? 0.3 + Math.abs(Math.sin(frame / 2.5)) * 0.9 : 0.2;
  // Kepala sedikit miring saat bicara
  const miring = bicara ? Math.sin(frame / 8) * 0.08 : 0;

  return (
    <group position={[posisi[0], posisi[1] + lompat, posisi[2]]} rotation={[0, hadap, 0]}>
      {/* Badan */}
      <mesh position={[0, 0.75, 0]} scale={[1, 1 + napas, 1]}>
        <capsuleGeometry args={[0.42, 0.7, 8, 24]} />
        <meshStandardMaterial color={warnaBaju} roughness={0.7} />
      </mesh>

      {/* Kepala */}
      <group position={[0, 1.75, 0]} rotation={[0, 0, miring]}>
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color={warnaKulit} roughness={0.6} />
        </mesh>
        {/* Mata */}
        {[-0.14, 0.14].map((x) => (
          <mesh key={x} position={[x, 0.06, 0.38]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}
        {/* Mulut */}
        <mesh position={[0, -0.15, 0.39]} scale={[1, mulut, 1]}>
          <boxGeometry args={[0.2, 0.1, 0.04]} />
          <meshStandardMaterial color="#5a1a1a" />
        </mesh>

        {jenis === "penjual" ? (
          // Songkok / peci hitam
          <mesh position={[0, 0.33, 0]}>
            <cylinderGeometry args={[0.33, 0.36, 0.26, 32]} />
            <meshStandardMaterial color="#111" roughness={0.4} />
          </mesh>
        ) : (
          <>
            {/* Kacamata bulat */}
            {[-0.15, 0.15].map((x) => (
              <mesh key={x} position={[x, 0.06, 0.4]}>
                <torusGeometry args={[0.1, 0.018, 12, 32]} />
                <meshStandardMaterial color="#222" metalness={0.6} />
              </mesh>
            ))}
            {/* Topi bucket */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.3, 0.42, 0.25, 32]} />
              <meshStandardMaterial color="#f4e1c1" />
            </mesh>
            <mesh position={[0, 0.19, 0]}>
              <cylinderGeometry args={[0.58, 0.58, 0.03, 32]} />
              <meshStandardMaterial color="#f4e1c1" />
            </mesh>
          </>
        )}
      </group>

      {/* Tangan */}
      {[-0.52, 0.52].map((x) => (
        <mesh key={x} position={[x, 0.85, 0.1]} rotation={[0.3, 0, x > 0 ? -0.25 : 0.25]}>
          <capsuleGeometry args={[0.11, 0.45, 6, 12]} />
          <meshStandardMaterial color={warnaBaju} roughness={0.7} />
        </mesh>
      ))}

      {jenis === "jaksel" && (
        // Gelas es kopi susu di tangan kanan
        <group position={[0.6, 0.7, 0.35]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.09, 0.32, 20]} />
            <meshStandardMaterial color="#c8a27a" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0.03, 0.25, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
            <meshStandardMaterial color="#2d6a4f" />
          </mesh>
        </group>
      )}
    </group>
  );
};
