// Tokoh tetap Malam Komedi versi Motion Canvas (vektor + tekstur + shading).
// Wajah & warna kulit mengikuti roman.js. Kostum boleh diganti per episode.
import {blur, Circle, Gradient, Img, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {Reference} from '@motion-canvas/core';
import cloth from './tex/cloth.jpg';

type Num = () => number;
export interface TokohProps {
  ref?: Reference<Node>;
  x?: number | Num;
  y?: number | Num;
  scale?: number | Num | [number, number];
  opacity?: number | Num;
  time: Num; // detik
  mouth?: Num; // 0..1 buka mulut
  run?: Num; // 0 diam .. 1 lari
  look?: Num; // -1 kiri .. 1 kanan (arah pupil)
  alis?: Num; // -1 curiga, 0 biasa, 1 kaget
  talk?: Num; // 0/1 sedang bicara (gerak tangan/kepala)
  blur?: Num; // blur DOF (px)
  blinkSeed?: number;
}

// Cahaya matahari dari kanan atas: sisi kiri bayangan, sisi kanan hangat.
export const shade = (w: number, h: number, kuat = 1) => (
  <Rect
    width={w + 4}
    height={h + 4}
    fill={
      new Gradient({
        type: 'linear',
        from: [-w / 2, -h / 2],
        to: [w / 2, h / 2],
        stops: [
          {offset: 0, color: `rgba(40,18,70,${0.42 * kuat})`},
          {offset: 0.5, color: 'rgba(40,18,70,0)'},
          {offset: 0.85, color: 'rgba(255,214,150,0)'},
          {offset: 1, color: `rgba(255,214,150,${0.45 * kuat})`},
        ],
      })
    }
  />
);
export const tex = (src: string, w: number, h: number, op = 0.35) => (
  <Img src={src} width={Math.max(w, h) + 8} height={Math.max(w, h) + 8} opacity={op} compositeOperation="multiply" />
);

// Bagian badan berbentuk kotak membulat, diberi tekstur + bayangan.
export const Part = (p: {
  w: number; h: number; r?: number | number[]; fill: string; x?: number; y?: number;
  rotation?: number | Num; texSrc?: string | null; texOp?: number; children?: any; offset?: [number, number];
}) => (
  <Rect
    x={p.x ?? 0}
    y={p.y ?? 0}
    width={p.w}
    height={p.h}
    radius={(p.r ?? 0) as any}
    fill={p.fill}
    rotation={p.rotation ?? 0}
    offset={p.offset ?? [0, 0]}
    clip
  >
    {p.texSrc === null ? null : tex(p.texSrc ?? cloth, p.w, p.h, p.texOp ?? 0.3)}
    {shade(p.w, p.h)}
    {p.children}
  </Rect>
);

const Bola = (p: {size: number; fill: string; x?: number; y?: number; kuat?: number; children?: any}) => (
  <Circle size={p.size} x={p.x ?? 0} y={p.y ?? 0} fill={p.fill} clip>
    {shade(p.size, p.size, p.kuat ?? 1)}
    {p.children}
  </Circle>
);

const kedip = (t: number, seed: number) => ((t + seed) % 3.7 < 0.12 ? 0.1 : 1);

// Bayangan kontak di kaki
const Bayangan = (w: number) => (
  <Circle width={w} height={w * 0.2} fill="rgba(30,15,40,0.45)" filters={[blur(8)]} />
);

// ===================== ASEP =====================
// Kostum episode "Asep Hidup Sehat": kaos lari oranye no. 17, ikat kepala merah, sepatu lari.
export function Asep(p: TokohProps) {
  const SKIN = '#d9a07a', HAIR = '#3a2418', KAOS = '#ff7a2f', IKAT = '#e63946';
  const t = p.time, run = p.run ?? (() => 0), talk = p.talk ?? (() => 0);
  const mouth = p.mouth ?? (() => 0), look = p.look ?? (() => 0), alis = p.alis ?? (() => 0);
  const ay = () => Math.sin(t() * 16) * 38 * run();
  const kaki = (s: number) => (
    <Node x={s * 26} y={-150} rotation={() => s * ay()}>
      <Part w={40} h={140} r={18} y={70} fill={SKIN} texSrc={null} />
      <Part w={66} h={34} r={14} x={12} y={142} fill="#f8f8f8" texSrc={null}>
        <Rect width={66} height={8} y={10} fill="#2b6cb0" />
      </Part>
    </Node>
  );
  const tangan = (s: number) => (
    <Node
      x={s * 78}
      y={-330}
      rotation={() => s * 12 - s * ay() * 1.1 - (s > 0 ? Math.sin(t() * 7) * 22 * talk() : 0)}
    >
      <Part w={36} h={130} r={18} y={62} fill={SKIN} texSrc={null} />
      <Part w={48} h={50} r={14} y={18} fill={KAOS} />
    </Node>
  );
  return (
    <Node ref={p.ref} x={p.x ?? 0} y={p.y ?? 0} scale={p.scale ?? 1} opacity={p.opacity ?? 1}
      filters={() => (p.blur && p.blur() > 0.3 ? [blur(p.blur())] : [])}>
      {Bayangan(220)}
      <Node y={() => -Math.abs(Math.sin(t() * 16)) * 18 * run()}>
        {kaki(-1)}
        {kaki(1)}
        <Part w={124} h={62} r={16} y={-170} fill="#1f2937" />
        {tangan(-1)}
        <Part w={152} h={192} r={34} y={-275} fill={KAOS}>
          <Rect width={86} height={70} y={5} radius={10} fill="#ffffff" />
          <Rect width={86} height={70} y={5} radius={10} fill="rgba(0,0,0,0)" stroke="#d1d5db" lineWidth={3} />
          <Txt text="17" y={7} fontFamily="Fredoka" fontWeight={700} fontSize={50} fill="#1f2937" />
          <Rect width={30} height={6} y={-90} radius={3} fill="#c85a1f" />
        </Part>
        {tangan(1)}
        <Node y={-460} rotation={() => Math.sin(t() * 9) * 3 * talk()}>
          <Bola size={48} x={-102} fill={SKIN} />
          <Bola size={48} x={102} fill={SKIN} />
          <Bola size={210} fill={SKIN} kuat={0.8} />
          <Rect width={202} height={82} y={-78} radius={[60, 60, 10, 10]} fill={HAIR} />
          <Part w={216} h={34} y={-48} r={10} fill={IKAT} />
          <Rect width={24} height={64} x={112} y={-30} radius={10} fill={IKAT}
            rotation={() => 25 + Math.sin(t() * 18) * 15 * (0.3 + run())} />
          {[-1, 1].map(s => (
            <>
              <Rect width={42} height={10} x={s * 42} y={() => -8 - alis() * 8} radius={5} fill={HAIR}
                rotation={() => s * (6 - alis() * 14)} />
              <Circle width={28} height={() => 28 * kedip(t(), p.blinkSeed ?? 0)} x={s * 42} y={18} fill="#1a1a1a">
                <Circle size={9} x={() => 4 + look() * 4} y={-5} fill="#fff" />
              </Circle>
              <Circle size={32} x={s * 70} y={52} fill="#f28482" opacity={0.4} />
            </>
          ))}
          <Circle size={22} y={38} fill="#c98a64" />
          <Rect y={66} width={() => 46 + mouth() * 10} height={() => 8 + mouth() * 40} radius={22} fill="#7a1f2b" />
        </Node>
      </Node>
    </Node>
  );
}

// ===================== PAK DARMAN =====================
// Kostum episode ini: jaket training jadul hijau bergaris putih + peci hitam.
export function Darman(p: TokohProps) {
  const SKIN = '#dca27a', HAIR = '#8a8580', KUMIS = '#3a2a20', JAKET = '#2f7d4f', CELANA = '#1e2a4a';
  const t = p.time, run = p.run ?? (() => 0), talk = p.talk ?? (() => 0);
  const mouth = p.mouth ?? (() => 0), look = p.look ?? (() => 0), alis = p.alis ?? (() => 0);
  const ay = () => Math.sin(t() * 15) * 34 * run();
  const kaki = (s: number) => (
    <Node x={s * 32} y={-160} rotation={() => s * ay()}>
      <Part w={50} h={150} r={20} y={74} fill={CELANA}>
        <Rect width={6} height={150} x={s * 18} fill="#ffffff" />
      </Part>
      <Part w={70} h={34} r={14} x={10} y={150} fill="#f2f2f2" texSrc={null} />
    </Node>
  );
  const tangan = (s: number) => (
    <Node x={s * 100} y={-360}
      rotation={() => s * 10 - s * ay() * 1.1 - (s < 0 ? Math.sin(t() * 6) * 20 * talk() : 0)}>
      <Part w={50} h={150} r={22} y={70} fill={JAKET}>
        <Rect width={7} height={150} x={s * 12} fill="#ffffff" />
      </Part>
      <Bola size={46} y={150} fill={SKIN} />
    </Node>
  );
  return (
    <Node ref={p.ref} x={p.x ?? 0} y={p.y ?? 0} scale={p.scale ?? 1} opacity={p.opacity ?? 1}
      filters={() => (p.blur && p.blur() > 0.3 ? [blur(p.blur())] : [])}>
      {Bayangan(260)}
      <Node y={() => -Math.abs(Math.sin(t() * 15)) * 16 * run()}>
        {kaki(-1)}
        {kaki(1)}
        {tangan(1)}
        <Part w={200} h={230} r={[50, 50, 40, 40]} y={-290} fill={JAKET}>
          <Rect width={6} height={230} fill="#e8e8e8" />
          <Line points={[[-40, -115], [0, -70], [40, -115]]} stroke="#ffffff" lineWidth={10} />
          <Rect width={200} height={14} y={100} fill="#ffffff" opacity={0.85} />
        </Part>
        {tangan(-1)}
        <Node y={-500} rotation={() => Math.sin(t() * 7) * 3 * talk()}>
          <Bola size={50} x={-110} fill={SKIN} />
          <Bola size={50} x={110} fill={SKIN} />
          <Rect width={210} height={240} radius={95} fill={SKIN} clip>
            {shade(210, 240, 0.8)}
          </Rect>
          <Rect width={40} height={70} x={-98} y={-40} radius={16} fill={HAIR} />
          <Rect width={40} height={70} x={98} y={-40} radius={16} fill={HAIR} />
          <Part w={170} h={70} y={-112} r={[14, 14, 6, 6]} fill="#1b1b1b" texOp={0.2} />
          {[-1, 1].map(s => (
            <>
              <Rect width={52} height={14} x={s * 46} y={() => -32 - alis() * 10} radius={7} fill={HAIR}
                rotation={() => s * (-4 - alis() * 16)} />
              <Circle width={24} height={() => 24 * kedip(t(), p.blinkSeed ?? 1.3)} x={s * 46} y={-2} fill="#1a1a1a">
                <Circle size={8} x={() => 3 + look() * 4} y={-4} fill="#fff" />
              </Circle>
              <Rect width={30} height={6} x={s * 46} y={18} radius={3} fill="#b07a58" opacity={0.7} />
            </>
          ))}
          <Circle size={36} y={34} fill="#c58b66" />
          <Rect y={() => 78 + mouth() * 6} width={() => 44 + mouth() * 8} height={() => 8 + mouth() * 34} radius={20} fill="#6b1d27" />
          <Rect width={120} height={30} y={60} radius={[14, 14, 20, 20]} fill={KUMIS} />
        </Node>
      </Node>
    </Node>
  );
}

// ===================== BLEKI =====================
export function Bleki(p: TokohProps & {peluit?: Num; gonggong?: Num}) {
  const t = p.time, run = p.run ?? (() => 0);
  const ay = () => Math.sin(t() * 22) * 34 * run();
  const kaki = (x: number, s: number) => (
    <Rect width={26} height={74} x={x} y={-36} radius={13} fill="#1d1d1d" rotation={() => s * ay()} offset={[0, -1]} />
  );
  return (
    <Node ref={p.ref} x={p.x ?? 0} y={p.y ?? 0} scale={p.scale ?? 1} opacity={p.opacity ?? 1}>
      {Bayangan(240)}
      <Node y={() => -Math.abs(Math.sin(t() * 22)) * 12 * run()}>
        <Rect width={30} height={90} x={-95} y={-80} radius={15} fill="#222" offset={[0, 1]}
          rotation={() => -40 + Math.sin(t() * 25) * 25} />
        {kaki(-60, 1)}
        {kaki(60, -1)}
        <Part w={200} h={98} r={48} y={-84} fill="#2b2b2b" texOp={0.25} />
        {kaki(-35, -1)}
        {kaki(80, 1)}
        <Bola size={116} x={104} y={-152} fill="#2b2b2b" />
        <Rect width={38} height={74} x={72} y={-206} radius={18} fill="#111" rotation={-20} />
        <Circle size={24} x={122} y={-168} fill="#fff">
          <Circle size={12} x={4} fill="#111" />
        </Circle>
        <Circle size={22} x={160} y={-142} fill="#111" />
        <Rect width={44} height={() => 4 + (p.gonggong ? p.gonggong() : 0) * 26} x={140} y={-116} radius={10} fill="#7a1f2b" />
        <Node opacity={p.peluit ?? (() => 0)} x={88} y={-100}>
          <Line points={[[-34, -24], [0, 10], [34, -24]]} stroke="#ffffff" lineWidth={5} />
          <Rect width={46} height={28} y={20} radius={10} fill="#ffd23f" stroke="#b8860b" lineWidth={3} />
        </Node>
      </Node>
    </Node>
  );
}
