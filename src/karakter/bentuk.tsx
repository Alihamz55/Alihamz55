// Bentuk-bentuk dasar yang dipakai semua karakter
import { useMemo } from "react";
import { BackSide, Quaternion, Vector3 } from "three";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export type V3 = [number, number, number];

// Garis hitam (outline) ala kartun: bola hitam sedikit lebih besar, dilihat dari dalam
export const GarisLuar: React.FC<{ tebal?: number; children: React.ReactNode }> = ({ tebal = 1.06, children }) => (
  <group scale={tebal}>{children}</group>
);
export const BahanGaris = () => <meshBasicMaterial color="#111" side={BackSide} />;

// Tulang/anggota badan: kapsul yang menghubungkan titik "dari" ke titik "ke"
export const Tulang: React.FC<{ dari: V3; ke: V3; r: number; warna: string; garis?: boolean }> = ({
  dari,
  ke,
  r,
  warna,
  garis,
}) => {
  const { pos, q, len } = useMemo(() => {
    const a = new Vector3(...dari);
    const b = new Vector3(...ke);
    const arah = b.clone().sub(a);
    return {
      len: Math.max(0.001, arah.length()),
      pos: a.clone().add(b).multiplyScalar(0.5),
      q: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), arah.normalize()),
    };
  }, [dari, ke]);
  return (
    <group position={pos} quaternion={q}>
      <mesh>
        <capsuleGeometry args={[r, len, 6, 14]} />
        <meshStandardMaterial color={warna} roughness={0.55} />
      </mesh>
      {garis && (
        <mesh>
          <capsuleGeometry args={[r + 0.02, len, 6, 14]} />
          <BahanGaris />
        </mesh>
      )}
    </group>
  );
};

// Tanda kaget kuning (3 garis) yang muncul di dekat kepala saat bicara
export const TandaSeru: React.FC<{ posisi: V3; sejak: number | null; cermin?: boolean }> = ({ posisi, sejak, cermin }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (sejak === null) return null;
  const s = spring({ frame: frame - sejak, fps, config: { damping: 9, stiffness: 180 } });
  const arah = cermin ? -1 : 1;
  return (
    <group position={posisi} scale={[s * arah, s, s]}>
      {[-0.55, 0, 0.55].map((sudut, i) => (
        <group key={i} rotation={[0, 0, sudut]}>
          <group position={[0, 0.32, 0]}>
            <mesh>
              <capsuleGeometry args={[0.05, 0.2, 4, 10]} />
              <meshBasicMaterial color="#ffd400" />
            </mesh>
            <mesh>
              <capsuleGeometry args={[0.075, 0.2, 4, 10]} />
              <BahanGaris />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};
