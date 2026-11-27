import {
  Circle,
  Gradient,
  Layout,
  Line,
  makeScene2D,
  Node,
  Rect,
  Txt,
} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  easeOutBack,
  spawn,
  usePlayback,
  waitFor,
} from '@motion-canvas/core';
import data from '../audio/asep-lari.json';

// "Asep Hidup Sehat" - tes adegan Motion Canvas dengan suara Asep (Achird).
// Kostum baru: kaos lari oranye + nomor dada 17 + ikat kepala merah + sepatu lari.
// Titik (0,0) = tengah layar 1080x1920.

const FONT = 'Fredoka';
const KUNING = '#ffd23f';
const SKIN = '#d9a07a';
const HAIR = '#3a2418';
const KAOS = '#ff7a2f';
const IKAT = '#e63946';
const L = data.lines;

export default makeScene2D(function* (view) {
  // ---------- jam & mulut dari data suara ----------
  const now = createSignal(0);
  spawn(function* () {
    const pb = usePlayback();
    while (true) {
      now(pb.frame / pb.fps);
      yield;
    }
  });
  const mouth = () => data.mouth[Math.floor(now() * data.fps)] ?? 0;
  const bicara = () => L.some(l => now() >= l.start && now() <= l.end);

  // ---------- status adegan ----------
  const lari = createSignal(0); // 0 diam, 1 lari
  const scroll = createSignal(0);
  const ayunan = () => Math.sin(now() * 16) * 38 * lari();

  const cam = createRef<Node>();
  const asep = createRef<Node>();
  const bleki = createRef<Node>();
  const peluit = createRef<Node>();
  const kartu = createRef<Rect>();
  const banner = createRef<Rect>();
  const bannerTxt = createRef<Txt>();
  const judge = createRef<Node>();

  // ---------- bintang untuk judge ----------
  const bintang = (r1: number, r2: number, n = 12) =>
    Array.from({length: n * 2}, (_, i) => {
      const r = i % 2 ? r2 : r1;
      const a = (i / (n * 2)) * Math.PI * 2;
      return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
    });

  // ---------- rumah-rumah latar (bergeser saat lari) ----------
  const warnaRumah = ['#f4a261', '#e9c46a', '#8ecae6', '#f28482', '#b5e48c'];
  const rumah = Array.from({length: 10}, (_, i) => (
    <Node x={() => ((i * 330 - scroll()) % 3300 + 3300) % 3300 - 1650} y={180}>
      <Rect width={260} height={240} fill={warnaRumah[i % 5]} radius={8} />
      <Line
        points={[[-160, -120], [0, -250], [160, -120]]}
        closed
        fill="#8d4b3a"
      />
      <Rect width={70} height={110} y={65} fill="#6b3e2e" radius={6} />
      <Rect width={60} height={60} x={-80} y={-30} fill="#fff6d5" radius={6} />
      <Rect width={60} height={60} x={80} y={-30} fill="#fff6d5" radius={6} />
    </Node>
  ));

  // ---------- Bleki (anjing) ----------
  const blekiNode = (
    <Node ref={bleki} x={-900} y={420} scale={1.3}>
      <Rect
        width={30}
        height={90}
        x={-95}
        y={-80}
        radius={15}
        fill="#222"
        rotation={() => -40 + Math.sin(now() * 25) * 25}
        offset={[0, 1]}
      />
      <Rect width={24} height={70} x={-55} y={-35} radius={12} fill="#222" rotation={() => ayunan() * 0.8} offset={[0, -1]} />
      <Rect width={24} height={70} x={55} y={-35} radius={12} fill="#222" rotation={() => -ayunan() * 0.8} offset={[0, -1]} />
      <Rect width={190} height={95} y={-80} radius={46} fill="#2b2b2b" />
      <Circle size={110} x={100} y={-150} fill="#2b2b2b" />
      <Rect width={36} height={70} x={70} y={-200} radius={18} fill="#111" rotation={-20} />
      <Circle size={22} x={118} y={-165} fill="#fff">
        <Circle size={11} x={3} fill="#111" />
      </Circle>
      <Circle size={20} x={155} y={-140} fill="#111" />
      {/* Peluit pelatih (muncul di akhir) */}
      <Node ref={peluit} opacity={0} x={85} y={-95}>
        <Line points={[[-30, -20], [0, 10], [30, -20]]} stroke="#ffffff" lineWidth={5} />
        <Rect width={44} height={26} y={18} radius={10} fill={KUNING} stroke="#b8860b" lineWidth={3} />
      </Node>
    </Node>
  );

  // ---------- Asep ----------
  const kaki = (sisi: number) => (
    <Node x={sisi * 26} y={-150} rotation={() => sisi * ayunan()}>
      <Rect width={40} height={140} y={70} radius={18} fill={SKIN} />
      <Rect width={64} height={34} x={12} y={142} radius={14} fill="#ffffff" stroke="#2b6cb0" lineWidth={6} />
    </Node>
  );
  const tangan = (sisi: number) => (
    <Node
      x={sisi * 78}
      y={-330}
      rotation={() => sisi * 12 - sisi * ayunan() * 1.1}
    >
      <Rect width={36} height={130} y={62} radius={18} fill={SKIN} />
      <Rect width={46} height={48} y={18} radius={14} fill={KAOS} />
    </Node>
  );

  const asepNode = (
    <Node ref={asep} y={430} scale={1.45}>
      <Node y={() => -Math.abs(Math.sin(now() * 16)) * 18 * lari()}>
        {kaki(-1)}
        {kaki(1)}
        <Rect width={120} height={60} y={-170} radius={16} fill="#1f2937" />
        {tangan(-1)}
        <Rect width={150} height={190} y={-275} radius={34} fill={KAOS} />
        <Rect width={86} height={70} y={-270} radius={10} fill="#ffffff">
          <Txt text="17" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#1f2937" />
        </Rect>
        {tangan(1)}
        {/* Kepala */}
        <Node y={-460} rotation={() => (bicara() ? Math.sin(now() * 9) * 3 : 0)}>
          <Circle size={48} x={-102} fill={SKIN} />
          <Circle size={48} x={102} fill={SKIN} />
          <Circle size={210} fill={SKIN} />
          <Rect width={200} height={80} y={-78} radius={[60, 60, 10, 10]} fill={HAIR} />
          <Rect width={214} height={34} y={-48} radius={10} fill={IKAT} />
          <Rect width={24} height={64} x={112} y={-30} radius={10} fill={IKAT} rotation={() => 25 + Math.sin(now() * 18) * 15 * (0.3 + lari())} />
          <Rect width={42} height={10} x={-42} y={-8} radius={5} fill={HAIR} rotation={-6} />
          <Rect width={42} height={10} x={42} y={-8} radius={5} fill={HAIR} rotation={6} />
          <Circle size={26} x={-42} y={18} fill="#1a1a1a" />
          <Circle size={26} x={42} y={18} fill="#1a1a1a" />
          <Circle size={8} x={-37} y={13} fill="#fff" />
          <Circle size={8} x={47} y={13} fill="#fff" />
          <Circle size={30} x={-70} y={52} fill="#f28482" opacity={0.45} />
          <Circle size={30} x={70} y={52} fill="#f28482" opacity={0.45} />
          <Rect
            y={62}
            width={() => 46 + mouth() * 10}
            height={() => 8 + mouth() * 40}
            radius={22}
            fill="#7a1f2b"
          />
        </Node>
      </Node>
    </Node>
  );

  // ---------- Telop subtitle per kalimat (kata aktif kuning) ----------
  const papan = L.map(line => {
    const words = line.text.split(' ');
    const total = line.text.replace(/ /g, '').length;
    let acc = 0;
    const mulai = words.map(w => {
      const t = line.start + (acc / total) * (line.end - line.start);
      acc += w.length;
      return t;
    });
    const tampil = () => now() >= line.start - 0.1 && now() < line.end + 0.25;
    return (
      <Rect
        y={600}
        width={980}
        height={250}
        radius={36}
        fill="#2d6cdf"
        stroke="#ffffff"
        lineWidth={6}
        opacity={() => (tampil() ? 1 : 0)}
      >
        <Rect x={-340} y={-125} width={200} height={64} radius={32} fill="#ffffff">
          <Txt text="ASEP" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#2d6cdf" />
        </Rect>
        <Layout layout wrap="wrap" width={920} gap={12} justifyContent="center" alignContent="center">
          {words.map((w, i) => {
            const on = () => now() >= mulai[i] && (i === words.length - 1 || now() < mulai[i + 1]);
            return (
              <Txt
                text={w}
                fontFamily={FONT}
                fontWeight={700}
                fontSize={52}
                fill={() => (on() ? KUNING : '#ffffff')}
              />
            );
          })}
        </Layout>
      </Rect>
    );
  });

  view.add(
    <>
      <Node ref={cam}>
        {/* Langit pagi */}
        <Rect
          width={1080}
          height={1920}
          fill={
            new Gradient({
              type: 'linear',
              from: [0, -960],
              to: [0, 300],
              stops: [
                {offset: 0, color: '#ffb37a'},
                {offset: 1, color: '#ffe8b8'},
              ],
            })
          }
        />
        <Circle size={260} x={300} y={-380} fill="#fff1a8" opacity={0.9} />
        {rumah}
        {/* Jalan */}
        <Rect width={1080} height={700} y={650} fill="#7cb66a" />
        <Rect width={1080} height={220} y={420} fill="#6b7280" />
        {Array.from({length: 8}, (_, i) => (
          <Rect
            width={90}
            height={14}
            y={420}
            radius={7}
            fill="#f3f4f6"
            x={() => ((i * 160 - scroll() * 1.4) % 1280 + 1280) % 1280 - 640}
          />
        ))}
        {blekiNode}
        {asepNode}
      </Node>

      {/* Overlay layar: judul, banner, judge, subtitle */}
      <Rect ref={kartu} y={-660} width={860} height={190} radius={40} fill="#ff4f79" stroke="#ffffff" lineWidth={8} scale={0}>
        <Txt text="ASEP HIDUP SEHAT" fontFamily={FONT} fontWeight={700} fontSize={88} fill="#ffffff" />
      </Rect>
      <Rect ref={banner} y={-500} width={520} height={90} radius={45} fill={KUNING} opacity={0}>
        <Txt ref={bannerTxt} text="" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#1b1030" />
      </Rect>
      <Node ref={judge} x={-250} y={170} scale={0}>
        <Line points={bintang(260, 190)} closed fill={KUNING} stroke="#ffffff" lineWidth={8} />
        <Txt text="SI BLEKI!" fontFamily={FONT} fontWeight={700} fontSize={96} fill="#e63946" rotation={-6} />
      </Node>
      {papan}
    </>,
  );

  const sampai = (t: number) => waitFor(Math.max(0, t - now()));
  const gantiBanner = function* (teks: string) {
    bannerTxt().text(teks);
    yield* banner().opacity(0, 0).to(1, 0.15);
  };

  // ===== Kalimat 1: Asep pede mau hidup sehat =====
  yield* kartu().scale(1, 0.45, easeOutBack);
  yield* sampai(L[0].start + 0.3);
  yield* gantiBanner('MISI: HIDUP SEHAT');
  yield* sampai(L[0].end - 0.6);
  yield* cam().scale(1.08, 0.12).to(1, 0.2);

  // ===== Kalimat 2: lari 5 km... dikejar Bleki =====
  yield* sampai(L[1].start);
  lari(1);
  yield* all(gantiBanner('5 KILO!'), bleki().x(-330, 0.6));
  spawn(function* () {
    while (lari() > 0) {
      scroll(scroll() + 22);
      yield;
    }
  });
  yield* sampai(L[1].end - 0.4);
  yield* cam().scale(1.08, 0.12).to(1, 0.2);

  // ===== Kalimat 3: Bleki mudik, Asep nggak lari =====
  yield* sampai(L[2].start);
  lari(0);
  bleki().x(-900);
  yield* gantiBanner('BLEKI: MUDIK');
  yield* sampai(L[2].end - 0.9);
  yield* gantiBanner('ASEP: LIBUR');
  yield* cam().scale(1.1, 0.12).to(1, 0.2);

  // ===== Kalimat 4: close-up, personal trainer = si Bleki =====
  yield* sampai(L[3].start);
  yield* all(
    banner().opacity(0, 0.15),
    cam().scale(1.35, 0.4),
    cam().y(70, 0.4),
  );
  yield* sampai(L[3].end - 1.0);
  // Bleki nongol dari balik Asep, pakai peluit pelatih
  peluit().opacity(1);
  bleki().position([300, 420]).scale([-1.4, 1.4]);
  yield* all(
    judge().scale(0.65, 0.3, easeOutBack),
    cam().scale(1.5, 0.12).to(1.35, 0.25),
  );
  yield* sampai(data.duration);
});
