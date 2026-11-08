// Panggung 3D: gambar karakter + gerakan napas halus, sorot lampu, partikel cahaya, air mata
import { useCallback, useEffect, useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import { AdditiveBlending, ShaderMaterial, SRGBColorSpace, Texture, TextureLoader } from "three";
import { cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AirMata } from "./AirMata";
import { bukaMulut, puncak } from "./lagu";

const GBR_W = 941;
const GBR_H = 1672;
const JARAK = 5;
const FOV = 50;
// Ukuran bidang gambar supaya pas memenuhi layar (+6% cadangan untuk zoom)
const H = 2 * JARAK * Math.tan(((FOV / 2) * Math.PI) / 180) * 1.06;
const W = H * (GBR_W / GBR_H);

export const kePlane = (px: number, py: number): [number, number, number] => [
  (px / GBR_W - 0.5) * W,
  (0.5 - py / GBR_H) * H,
  0,
];

// Shader: gambar + gerakan napas/goyang halus di area kepala & tangan
const vertex = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const fragment = `
uniform sampler2D map; uniform float t; uniform float terang; uniform float buka;
varying vec2 vUv;
void main(){
  vec2 uv = vUv;
  vec2 rasio = vec2(${(GBR_W / GBR_H).toFixed(4)}, 1.0);
  float m = smoothstep(0.30, 0.04, distance(uv * rasio, vec2(0.537, 0.64) * rasio));
  uv.x += sin(t * 0.8) * 0.0020 * m;
  uv.y += sin(t * 1.6) * 0.0018 * m;

  // GERAK MULUT: bibir bawah & dagu ditarik ke bawah sesuai suara vokal
  vec2 px = vec2(vUv.x * ${GBR_W}.0, (1.0 - vUv.y) * ${GBR_H}.0); // posisi dalam piksel gambar
  vec2 mulut = vec2(512.0, 534.0); // tepat di bagian dalam mulut (di bawah gigi)
  float dx = (px.x - mulut.x) / 42.0;
  float bawah = px.y - mulut.y;  // positif = di bawah garis mulut
  float wx = exp(-dx * dx);
  float turun = smoothstep(0.0, 7.0, bawah) * (1.0 - smoothstep(50.0, 110.0, bawah));
  float naik = smoothstep(0.0, -10.0, bawah) * (1.0 - smoothstep(-14.0, -40.0, bawah));
  uv.y += buka * wx * (turun * 12.0 - naik * 2.0) / ${GBR_H}.0;
  // sedikit melebar ke samping saat terbuka lebar
  uv.x -= buka * dx * 0.08 * exp(-dx * dx) * turun * 4.0 / ${GBR_W}.0;
  vec4 c = texture2D(map, uv);
  c.rgb *= 1.0 + terang * 0.10;
  gl_FragColor = c;
  #include <colorspace_fragment>
}`;

const tingkatPuncak = (detik: number) =>
  Math.max(
    0,
    ...puncak.map(([a, b]) =>
      interpolate(detik, [a - 1, a, b, b + 1.5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    )
  );

const Kamera: React.FC<{ durasi: number }> = ({ durasi }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = useThree((s) => s.camera);
  const detik = frame / fps;
  // Kamera pelan-pelan mendekat ke wajah, lebih dekat saat puncak
  const maju = interpolate(detik, [0, durasi], [0, 1]);
  const dekat = maju * 0.9 + tingkatPuncak(detik) * 0.35;
  const wajah = kePlane(490, 560);
  camera.position.set(wajah[0] * dekat * 0.5, wajah[1] * dekat * 0.45, JARAK - dekat);
  camera.lookAt(wajah[0] * dekat * 0.5, wajah[1] * dekat * 0.45, 0);
  return null;
};

// Sorot lampu yang berdenyut mengikuti musik
const SorotLampu: React.FC<{ dari: [number, number]; ke: [number, number]; kuat: number; warna: string }> = ({ dari, ke, kuat, warna }) => {
  const a = kePlane(...dari);
  const b = kePlane(...ke);
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const panjang = Math.hypot(dx, dy);
  const sudut = Math.atan2(dy, dx) - Math.PI / 2;
  return (
    <mesh position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.02]} rotation={[0, 0, sudut]}>
      <planeGeometry args={[0.9, panjang, 1, 1]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uniforms={{ kuat: { value: kuat } }}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `}
        fragmentShader={`uniform float kuat; varying vec2 vUv; void main(){
          float lebar = mix(0.06, 0.5, 1.0 - vUv.y);
          float tepi = smoothstep(lebar, 0.0, abs(vUv.x - 0.5));
          float a = tepi * vUv.y * kuat * 0.35;
          gl_FragColor = vec4(${warna} * a, a);
        }`}
      />
    </mesh>
  );
};

// Partikel cahaya (debu berkilau) yang naik pelan
const Partikel: React.FC<{ kuat: number }> = ({ kuat }) => {
  const frame = useCurrentFrame();
  const titik = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => {
        const r = (n: number) => Math.abs((Math.sin(i * 91.7 + n * 13.1) * 43758.5453) % 1);
        return { x: (r(1) - 0.5) * W, y0: (r(2) - 0.5) * H, kec: 0.002 + r(3) * 0.004, ukuran: 0.008 + r(4) * 0.02, fase: r(5) * 6.28, emas: r(6) > 0.4 };
      }),
    []
  );
  return (
    <group>
      {titik.map((p, i) => {
        let y = p.y0 + frame * p.kec;
        y = ((y + H / 2) % H) - H / 2;
        const kerlip = 0.5 + 0.5 * Math.sin(frame / 9 + p.fase);
        return (
          <mesh key={i} position={[p.x + Math.sin(frame / 40 + p.fase) * 0.05, y, 0.05]}>
            <circleGeometry args={[p.ukuran * (1 + kuat * 0.5), 10]} />
            <meshBasicMaterial color={p.emas ? "#ffe39a" : "#c9b8ff"} transparent opacity={(0.25 + 0.6 * kerlip) * (0.5 + kuat * 0.5)} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Panggung: React.FC<{ durasi: number; volume: number }> = ({ durasi, volume }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const detik = frame / fps;
  const [tekstur, setTekstur] = useState<Texture | null>(null);
  const [handle] = useState(() => delayRender("Memuat gambar karakter"));

  useEffect(() => {
    new TextureLoader().load(
      staticFile("doa/karakter.png"),
      (t) => {
        t.colorSpace = SRGBColorSpace;
        setTekstur(t);
      },
      undefined,
      (e) => cancelRender(e)
    );
  }, [handle]);

  const bahan = useMemo(
    () =>
      tekstur
        ? new ShaderMaterial({ uniforms: { map: { value: tekstur }, t: { value: 0 }, terang: { value: 0 }, buka: { value: 0 } }, vertexShader: vertex, fragmentShader: fragment })
        : null,
    [tekstur]
  );

  // Setelah bahan siap: gambar ulang adegan, baru lanjutkan render
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    if (!bahan) return;
    advance(performance.now());
    continueRender(handle);
  }, [bahan, advance, handle]);

  const pk = tingkatPuncak(detik);
  const kuat = Math.min(1, volume * 2.2 + pk * 0.4);
  if (bahan) {
    bahan.uniforms.t.value = detik;
    bahan.uniforms.terang.value = kuat;
    bahan.uniforms.buka.value = bukaMulut(frame);
  }

  const kePlaneStabil = useCallback(kePlane, []);

  return (
    <>
      <Kamera durasi={durasi} />
      {bahan && (
        <mesh material={bahan}>
          <planeGeometry args={[W, H]} />
        </mesh>
      )}
      <SorotLampu dari={[110, 0]} ke={[420, 1250]} kuat={0.4 + kuat * 0.8} warna="vec3(1.0, 0.85, 0.5)" />
      <SorotLampu dari={[830, 0]} ke={[560, 1250]} kuat={0.4 + kuat * 0.8} warna="vec3(1.0, 0.85, 0.5)" />
      <SorotLampu dari={[470, -100]} ke={[480, 1400]} kuat={pk * 0.9} warna="vec3(0.75, 0.7, 1.0)" />
      <Partikel kuat={kuat} />
      <AirMata kePlane={kePlaneStabil} durasi={durasi} />
    </>
  );
};
