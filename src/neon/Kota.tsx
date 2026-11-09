import { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { hentakan } from "./lirik";

// Angka acak yang selalu sama setiap render (biar video tidak berubah-ubah)
const acak = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const PANJANG = 120; // panjang satu putaran kota (gedung diulang terus)
const KECEPATAN = 14; // kecepatan mobil

// Tekstur jendela gedung (sebagian menyala ungu/oranye/kuning)
const buatTeksturJendela = (seed: number) => {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0a0614";
  g.fillRect(0, 0, 64, 128);
  const warna = ["#ffb347", "#ff4fd8", "#7df9ff", "#ffe066"];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 6; x++) {
      const r = acak(seed * 1000 + y * 10 + x);
      if (r > 0.55) {
        g.fillStyle = warna[Math.floor(r * 100) % warna.length];
        g.globalAlpha = 0.5 + r * 0.5;
        g.fillRect(4 + x * 10, 4 + y * 8, 6, 4);
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  return t;
};

const Palem: React.FC<{ posisi: [number, number, number] }> = ({ posisi }) => (
  <group position={posisi}>
    <mesh position={[0, 3, 0]}>
      <cylinderGeometry args={[0.12, 0.2, 6, 6]} />
      <meshBasicMaterial color="#1a0630" />
    </mesh>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <mesh key={i} position={[0, 6, 0]} rotation={[0.9, (i / 6) * Math.PI * 2, 0]}>
        <boxGeometry args={[0.25, 0.05, 2.6]} />
        <meshBasicMaterial color="#1a0630" />
      </mesh>
    ))}
  </group>
);

// Mobil lowrider dilihat dari belakang, memantul ikut bass (hidrolik)
export const Lowrider: React.FC<{ bass: number; detik: number }> = ({ bass, detik }) => {
  const loncat = bass * 0.18;
  const miring = Math.sin(detik * 2.4) * 0.03;
  return (
    <group position={[0, 0.3 + loncat, 1.2]} rotation={[0, 0, miring]} scale={0.8}>
      {/* badan */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.4, 0.55, 4]} />
        <meshBasicMaterial color="#3a0a5e" />
      </mesh>
      {/* kabin */}
      <mesh position={[0, 0.85, 0.4]}>
        <boxGeometry args={[1.9, 0.5, 1.8]} />
        <meshBasicMaterial color="#25063d" />
      </mesh>
      {/* kaca belakang */}
      <mesh position={[0, 0.85, 1.31]}>
        <planeGeometry args={[1.6, 0.38]} />
        <meshBasicMaterial color="#ff8fd8" transparent opacity={0.35} />
      </mesh>
      {/* garis krom */}
      <mesh position={[0, 0.2, 2.01]}>
        <planeGeometry args={[2.4, 0.08]} />
        <meshBasicMaterial color="#d9d9ff" />
      </mesh>
      {/* lampu belakang */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.45, 2.01]}>
          <planeGeometry args={[0.5, 0.16 + bass * 0.05]} />
          <meshBasicMaterial color="#ff1a3c" />
        </mesh>
      ))}
      {/* plat nomor */}
      <mesh position={[0, 0.3, 2.02]}>
        <planeGeometry args={[0.6, 0.2]} />
        <meshBasicMaterial color="#ffd23f" />
      </mesh>
      {/* ban */}
      {[-1.15, 1.15].map((x) =>
        [-1.3, 1.3].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -0.05 - loncat, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.38, 0.38, 0.3, 16]} />
            <meshBasicMaterial color="#050208" />
          </mesh>
        ))
      )}
      {/* cahaya neon di bawah mobil */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.33 - loncat, 0]}>
        <planeGeometry args={[2.8, 4.4]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.25 + bass * 0.25} />
      </mesh>
    </group>
  );
};

export const Kota: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const detik = frame / fps;
  const maju = (detik * KECEPATAN) % PANJANG;
  const bass = hentakan(detik);

  const gedung = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const sisi = i % 2 === 0 ? -1 : 1;
        const tinggi = 6 + acak(i) * 22;
        const lebar = 3 + acak(i + 50) * 3;
        return {
          x: sisi * (12 + acak(i + 99) * 7),
          z: -(i / 40) * PANJANG,
          tinggi,
          lebar,
          tekstur: buatTeksturJendela(i),
          neon: ["#ff2bd6", "#00e5ff", "#ff8a00"][i % 3],
        };
      }),
    []
  );

  // Posisi z yang diulang terus supaya jalan terasa tanpa ujung
  const ulang = (z: number) => {
    const p = z + maju;
    return p > 8 ? p - PANJANG : p;
  };

  return (
    <>
      <fog attach="fog" args={["#2a0b45", 20, 95]} />

      {/* Langit gradasi + matahari retro */}
      <mesh position={[0, 18, -110]}>
        <planeGeometry args={[400, 120]} />
        <shaderMaterial
          fog={false}
          uniforms={{}}
          vertexShader="varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
          fragmentShader="varying vec2 vUv; void main(){ vec3 a=vec3(1.0,0.45,0.15); vec3 b=vec3(0.55,0.08,0.55); vec3 c=vec3(0.04,0.01,0.12); vec3 col = vUv.y<0.45 ? mix(a,b,vUv.y/0.45) : mix(b,c,(vUv.y-0.45)/0.55); gl_FragColor=vec4(col,1.0);}"
        />
      </mesh>
      <mesh position={[0, 8, -105]}>
        <circleGeometry args={[16, 48]} />
        <shaderMaterial
          fog={false}
          transparent
          vertexShader="varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
          fragmentShader="varying vec2 vUv; void main(){ vec3 col=mix(vec3(1.0,0.2,0.55),vec3(1.0,0.85,0.2),vUv.y); float garis = vUv.y<0.5 ? step(0.5, fract(vUv.y*14.0)) : 1.0; gl_FragColor=vec4(col, garis);}"
        />
      </mesh>

      {/* Aspal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]}>
        <planeGeometry args={[14, 200]} />
        <meshBasicMaterial color="#1d0f3a" />
      </mesh>
      {/* Garis melintang ungu (gaya retro), ikut bergerak */}
      {Array.from({ length: 40 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, ulang(-i * 3)]}>
          <planeGeometry args={[13.8, 0.06]} />
          <meshBasicMaterial color="#6b1fa8" />
        </mesh>
      ))}
      {/* Trotoar */}
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 14, -0.02, -50]}>
          <planeGeometry args={[14, 200]} />
          <meshBasicMaterial color="#07030f" />
        </mesh>
      ))}
      {/* Garis tepi neon */}
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 6.9, 0.01, -50]}>
          <planeGeometry args={[0.15, 200]} />
          <meshBasicMaterial color={s < 0 ? "#ff2bd6" : "#00e5ff"} />
        </mesh>
      ))}
      {/* Marka tengah yang bergerak */}
      {Array.from({ length: 30 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, ulang(-i * 4)]}>
          <planeGeometry args={[0.25, 2]} />
          <meshBasicMaterial color="#ffd23f" />
        </mesh>
      ))}

      {/* Gedung */}
      {gedung.map((b, i) => (
        <group key={i} position={[b.x, 0, ulang(b.z)]}>
          <mesh position={[0, b.tinggi / 2, 0]}>
            <boxGeometry args={[b.lebar, b.tinggi, b.lebar]} />
            <meshBasicMaterial map={b.tekstur} />
          </mesh>
          {/* papan neon di atap, berdenyut ikut bass */}
          <mesh position={[0, b.tinggi + 0.3, 0]}>
            <boxGeometry args={[b.lebar * 0.8, 0.25 + bass * 0.15, 0.1]} />
            <meshBasicMaterial color={b.neon} />
          </mesh>
        </group>
      ))}

      {/* Pohon palem */}
      {Array.from({ length: 16 }, (_, i) => (
        <Palem key={i} posisi={[(i % 2 === 0 ? -1 : 1) * 7.8, 0, ulang(-i * 7.5)]} />
      ))}

      <Lowrider bass={bass} detik={detik} />

      {/* Lampu jalan */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[(i % 2 === 0 ? 1 : -1) * 7.6, 4.5, ulang(-i * 10 - 3)]}>
          <sphereGeometry args={[0.25 + bass * 0.08, 10, 10]} />
          <meshBasicMaterial color="#ffb347" />
        </mesh>
      ))}
    </>
  );
};
