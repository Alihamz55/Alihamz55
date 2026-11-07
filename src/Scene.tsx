import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// PENTING: di Remotion, animasi 3D harus pakai useCurrentFrame(),
// JANGAN pakai useFrame() dari react-three-fiber (hasil render jadi kacau/acak).
export const Scene: React.FC<{ warna: string }> = ({ warna }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Muncul dengan efek "membal" di awal video
  const muncul = spring({ frame, fps, config: { damping: 12 } });

  // Berputar terus
  const putar = frame * 0.03;

  // Naik-turun pelan (melayang)
  const melayang = Math.sin(frame / 15) * 0.2;

  // Kamera pelan-pelan mendekat
  const zoom = interpolate(frame, [0, 300], [1, 1.25], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      {/* Lampu */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 5]} intensity={1.5} />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#4cc9f0" />

      <group scale={muncul * zoom}>
        {/* Objek utama: donat (torus knot) */}
        <mesh rotation={[putar, putar * 1.3, 0]} position={[0, melayang, 0]}>
          <torusKnotGeometry args={[1, 0.35, 200, 32]} />
          <meshStandardMaterial color={warna} metalness={0.4} roughness={0.25} />
        </mesh>

        {/* Bola-bola kecil yang mengorbit */}
        {[0, 1, 2, 3, 4].map((i) => {
          const sudut = putar * 1.5 + (i * Math.PI * 2) / 5;
          return (
            <mesh
              key={i}
              position={[Math.cos(sudut) * 2.2, Math.sin(sudut * 2) * 0.5, Math.sin(sudut) * 2.2]}
            >
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={0.6} />
            </mesh>
          );
        })}
      </group>
    </>
  );
};
