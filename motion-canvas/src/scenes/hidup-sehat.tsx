// Episode: "Asep Hidup Sehat" (Asep, Pak Darman, si Bleki) - Motion Canvas.
// Sinematik: kamera per kalimat (wide, OTS, close-up), DOF (blur latar & tokoh
// yang tidak fokus), cahaya pagi hangat + sinar matahari + vignette, tekstur.
import {
  blur,
  Circle,
  Gradient,
  Img,
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
  easeInOutCubic,
  easeOutBack,
  spawn,
  usePlayback,
  waitFor,
} from '@motion-canvas/core';
import data from '../audio/hidup-sehat.json';
import {Asep, Bleki, Darman, shade} from '../tokoh';
import plaster from '../tex/plaster.jpg';
import wood from '../tex/wood.jpg';
import gravel from '../tex/gravel.jpg';
import tarp from '../tex/tarp.jpg';

const FONT = 'Fredoka';
const KUNING = '#ffd23f';
const L = data.lines;
const W = 3600; // lebar satu putaran jalan (untuk adegan lari)

export default makeScene2D(function* (view) {
  // ---------------- jam ----------------
  const now = createSignal(0);
  spawn(function* () {
    const pb = usePlayback();
    while (true) {
      now(pb.frame / pb.fps);
      yield;
    }
  });
  const lineNow = () => L.find(l => now() >= l.start && now() <= l.end);
  const mouthOf = (spk: string) => () =>
    lineNow()?.spk === spk ? data.mouth[Math.floor(now() * data.fps)] ?? 0 : 0;
  const talkOf = (spk: string) => () => (lineNow()?.spk === spk ? 1 : 0);

  // ---------------- state ----------------
  const camX = createSignal(0), camY = createSignal(0), camZ = createSignal(1);
  const kick = createSignal(1);
  const shake = createSignal(0);
  const bgBlur = createSignal(2);
  const aBlur = createSignal(0), dBlur = createSignal(0);
  const scroll = createSignal(0);
  const aRun = createSignal(0), dRun = createSignal(0), bRun = createSignal(0);
  const aAlis = createSignal(0), dAlis = createSignal(0);
  const aLook = createSignal(1), dLook = createSignal(-1);
  const peluit = createSignal(0), gonggong = createSignal(0);
  const flash = createSignal(0);
  const OY = -60; // titik fokus kamera sedikit di atas tengah (subtitle di bawah)

  const asep = createRef<Node>(), darman = createRef<Node>(), bleki = createRef<Node>();
  const kartu = createRef<Rect>(), kartuTxt = createRef<Txt>();
  const banner = createRef<Rect>(), bannerTxt = createRef<Txt>();
  const judge = createRef<Node>(), judgeTxt = createRef<Txt>();

  const wrap = (bx: number, f = 1) => () => ((bx - scroll() * f) % W + W * 1.5) % W - W / 2;

  // ---------------- latar: gang perumahan pagi ----------------
  const warnaRumah = ['#f2b880', '#e9d18f', '#9cc9de', '#ef9a8a', '#bcd98e', '#d8b4e2', '#f7d08a', '#a7d3b5', '#f0a6a6', '#c7c0e8'];
  const rumah = warnaRumah.map((c, i) => {
    const bx = i * 360 - 1570; // i=5 -> x 230 (rumah No. 17 Pak Darman)
    return (
      <Node x={wrap(bx)} y={120}>
        <Rect width={330} height={300} y={-150} fill={c} clip>
          <Img src={plaster} width={340} height={340} opacity={0.45} compositeOperation="multiply" />
          {shade(330, 300, 0.7)}
        </Rect>
        <Line points={[[-190, -300], [0, -470], [190, -300]]} closed fill="#9b3f2b" />
        <Rect width={380} height={170} y={-385} clip opacity={0.4} compositeOperation="multiply">
          <Img src={tarp} width={400} height={400} />
        </Rect>
        <Rect width={84} height={150} y={-75} fill="#6b3e2e" clip>
          <Img src={wood} width={160} height={160} opacity={0.55} compositeOperation="multiply" />
        </Rect>
        <Rect width={80} height={70} x={-105} y={-170} fill="#fff3c9" stroke="#7a4a32" lineWidth={6} />
        <Rect width={80} height={70} x={105} y={-170} fill="#fff3c9" stroke="#7a4a32" lineWidth={6} />
        {i === 5 ? (
          <Rect width={70} height={44} x={-8} y={-190} radius={6} fill="#1e3a8a">
            <Txt text="17" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#fff" />
          </Rect>
        ) : null}
      </Node>
    );
  });
  // pagar kayu di depan rumah
  const pagar = Array.from({length: 24}, (_, i) => (
    <Rect x={wrap(i * 150 - 1800)} y={60} width={22} height={130} radius={[8, 8, 0, 0]} fill="#c99a6b" clip>
      <Img src={wood} width={140} height={140} opacity={0.5} compositeOperation="multiply" />
    </Rect>
  ));
  // tiang listrik (sedikit di depan, bergeser lebih cepat = paralaks)
  const tiang = Array.from({length: 3}, (_, i) => (
    <Node x={wrap(i * 1200 - 900, 1.25)} y={160}>
      <Rect width={30} height={1100} y={-550} fill="#5b5b66" />
      <Rect width={220} height={18} y={-1000} fill="#4b4b55" />
    </Node>
  ));
  const garisJalan = Array.from({length: 18}, (_, i) => (
    <Rect x={wrap(i * 200 - 1800, 1.4)} y={520} width={110} height={14} radius={7} fill="#eeeeee" opacity={0.8} />
  ));

  // ---------------- telop subtitle (overlay layar) ----------------
  const warnaPapan: Record<string, [string, string]> = {A: ['#2d6cdf', 'ASEP'], D: ['#2f7d4f', 'PAK DARMAN']};
  const papan = L.map(line => {
    const words = line.text.split(' ');
    const total = line.text.replace(/ /g, '').length;
    let acc = 0;
    const mulai = words.map(w => {
      const t = line.start + (acc / total) * (line.end - line.start);
      acc += w.length;
      return t;
    });
    const [warna, nama] = warnaPapan[line.spk];
    const tampil = () => now() >= line.start - 0.08 && now() < line.end + 0.2;
    return (
      <Rect y={590} width={980} height={250} radius={36} fill={warna} stroke="#ffffff" lineWidth={6}
        opacity={() => (tampil() ? 1 : 0)} shadowColor="rgba(0,0,0,0.35)" shadowBlur={20} shadowOffsetY={8}>
        <Rect x={line.spk === 'A' ? -340 : 300} y={-125} width={nama.length * 26 + 60} height={64} radius={32} fill="#ffffff">
          <Txt text={nama} fontFamily={FONT} fontWeight={700} fontSize={38} fill={warna} />
        </Rect>
        <Layout layout wrap="wrap" width={920} gap={12} justifyContent="center" alignContent="center">
          {words.map((w, i) => {
            const on = () => now() >= mulai[i] && (i === words.length - 1 || now() < mulai[i + 1]);
            return <Txt text={w} fontFamily={FONT} fontWeight={700} fontSize={52} fill={() => (on() ? KUNING : '#ffffff')} />;
          })}
        </Layout>
      </Rect>
    );
  });

  const bintang = (r1: number, r2: number, n = 12) =>
    Array.from({length: n * 2}, (_, i) => {
      const r = i % 2 ? r2 : r1;
      const a = (i / (n * 2)) * Math.PI * 2;
      return [Math.cos(a) * r * 1.5, Math.sin(a) * r] as [number, number];
    });

  view.add(
    <>
      {/* ===== DUNIA (ikut kamera) ===== */}
      <Node
        scale={() => camZ() * kick()}
        x={() => -camX() * camZ() * kick() + Math.sin(now() * 31) * shake()}
        y={() => -camY() * camZ() * kick() + OY + Math.cos(now() * 27) * shake()}
      >
        {/* Latar (kena DOF) */}
        <Node filters={() => [blur(bgBlur())]}>
          <Rect width={6000} height={4000} y={-1200}
            fill={new Gradient({type: 'linear', from: [0, -2400], to: [0, 200], stops: [
              {offset: 0, color: '#f59e6b'}, {offset: 0.55, color: '#ffd6a0'}, {offset: 1, color: '#fff1d0'}]})} />
          <Circle size={300} x={() => 520 - scroll() * 0.05} y={-820} fill="#fff6c8" shadowColor="#ffe9a0" shadowBlur={120} />
          {/* bukit jauh */}
          {Array.from({length: 6}, (_, i) => (
            <Circle size={1100} x={wrap(i * 700 - 1800, 0.35)} y={60} fill="#b9c99a" opacity={0.7} />
          ))}
          {rumah}
          <Rect width={6000} height={60} y={130} fill="#cfc6b8" />
          {pagar}
          <Rect width={6000} height={20} y={130} fill="#a89f92" />
          {/* jalan + tekstur kerikil */}
          <Rect width={6000} height={900} y={600} fill="#7d7b80" clip>
            {Array.from({length: 7}, (_, i) => (
              <Img src={gravel} width={1024} height={1024} x={() => wrap(i * 1024 - 3000, 1.4)()} opacity={0.5}
                compositeOperation="multiply" />
            ))}
          </Rect>
          {garisJalan}
          {/* bayangan rumah yang memanjang (sinar pagi dari kanan) */}
          <Rect width={6000} height={120} y={210} fill="rgba(40,20,60,0.18)" />
        </Node>
        {tiang}
        <Bleki ref={bleki} x={-900} y={470} scale={1.2} time={now} run={bRun} peluit={peluit} gonggong={gonggong} />
        <Darman ref={darman} x={230} y={470} scale={1.3} time={now} mouth={mouthOf('D')} talk={talkOf('D')}
          run={dRun} look={dLook} alis={dAlis} blur={dBlur} blinkSeed={1.7} />
        <Asep ref={asep} x={-230} y={470} scale={1.3} time={now} mouth={mouthOf('A')} talk={talkOf('A')}
          run={aRun} look={aLook} alis={aAlis} blur={aBlur} />
      </Node>

      {/* ===== CAHAYA SINEMATIK (overlay layar) ===== */}
      <Rect width={1080} height={1920} fill="#ff9a4a" opacity={0.22} compositeOperation="soft-light" />
      <Node compositeOperation="screen" opacity={0.3} filters={[blur(18)]}>
        {[0, 1, 2, 3].map(i => (
          <Line points={[[620, -1100], [-500 + i * 260, 1100], [-380 + i * 260, 1100]]} closed
            fill="#fff0c0" opacity={() => 0.18 + 0.08 * Math.sin(now() * 0.8 + i * 1.7)} />
        ))}
      </Node>
      <Circle size={900} x={560} y={-1000} compositeOperation="screen"
        fill={new Gradient({type: 'radial', from: 0, to: 0, fromRadius: 0, toRadius: 450, stops: [
          {offset: 0, color: 'rgba(255,240,190,0.75)'}, {offset: 1, color: 'rgba(255,240,190,0)'}]})} />
      <Rect width={1080} height={1920}
        fill={new Gradient({type: 'radial', from: 0, to: 0, fromRadius: 380, toRadius: 1150, stops: [
          {offset: 0, color: 'rgba(25,10,35,0)'}, {offset: 1, color: 'rgba(25,10,35,0.62)'}]})} />
      <Rect width={1080} height={1920} fill="#ffffff" opacity={flash} />

      {/* ===== TELOP ===== */}
      <Rect ref={kartu} y={-660} width={880} height={180} radius={40} fill="#ff4f79" stroke="#ffffff" lineWidth={8}
        scale={0} shadowColor="rgba(0,0,0,0.35)" shadowBlur={24} shadowOffsetY={10}>
        <Txt ref={kartuTxt} text="ASEP HIDUP SEHAT" fontFamily={FONT} fontWeight={700} fontSize={80} fill="#ffffff" />
      </Rect>
      <Rect ref={banner} y={-795} height={96} radius={48} fill={KUNING} opacity={0} layout paddingLeft={44} paddingRight={44}
        alignItems="center" shadowColor="rgba(0,0,0,0.3)" shadowBlur={16} shadowOffsetY={6}>
        <Txt ref={bannerTxt} text="" fontFamily={FONT} fontWeight={700} fontSize={54} fill="#1b1030" />
      </Rect>
      <Node ref={judge} y={-760} scale={0}>
        <Line points={bintang(170, 120)} closed fill={KUNING} stroke="#ffffff" lineWidth={8}
          shadowColor="rgba(0,0,0,0.35)" shadowBlur={20} />
        <Txt ref={judgeTxt} text="" fontFamily={FONT} fontWeight={700} fontSize={78} fill="#e63946" rotation={-5} />
      </Node>
      {papan}
    </>,
  );

  // ---------------- helper ----------------
  const sampai = (t: number) => waitFor(Math.max(0, t - now()));
  const cut = (x: number, y: number, z: number, bb: number) => {
    camX(x); camY(y); camZ(z); bgBlur(bb);
  };
  const dorong = (z: number, dur: number) => spawn(camZ(z, dur, easeInOutCubic));
  const tendang = (k = 1.12) => spawn(kick(k, 0.08).to(1, 0.22));
  function* setBanner(teks: string) {
    if (!teks) {
      yield* banner().opacity(0, 0.1);
      return;
    }
    bannerTxt().text(teks);
    banner().scale(0.6);
    yield* all(banner().opacity(1, 0.12), banner().scale(1.3, 0.2, easeOutBack));
  }
  function* setJudge(teks: string) {
    banner().opacity(0);
    judgeTxt().text(teks);
    judge().scale(0);
    yield* judge().scale(0.92, 0.25, easeOutBack);
  }
  const hideJudge = () => judge().scale(0);
  // jalan bergulir saat adegan lari
  spawn(function* () {
    while (true) {
      const v = Math.max(aRun(), dRun());
      if (v > 0) scroll(scroll() + 24 * v);
      yield;
    }
  });

  // ===== 0 | ASEP: "Pak Darman! ... personal trainer!" — wide, kamera rendah =====
  cut(0, 40, 1.08, 2);
  asep().x(-760);
  aRun(1);
  spawn(kartu().scale(1.2, 0.45, easeOutBack));
  dorong(1.08, 4.5);
  yield* asep().x(-230, 1.3);
  aRun(0);
  yield* sampai(2.9);
  yield* all(kartu().scale(0, 0.2), setBanner('MISI: HIDUP SEHAT'));
  yield* sampai(L[0].end - 0.8);
  yield* setBanner('PERSONAL TRAINER');
  tendang();

  // ===== 1 | DARMAN: "Trainer? Kamu punya kereta pribadi?" — OTS dari bahu Asep =====
  yield* sampai(L[1].start);
  cut(100, -85, 2.0, 8); aBlur(7); dAlis(1); aLook(1); dLook(-1);
  dorong(2.12, 2.6);
  yield* setBanner('KERETA PRIBADI?');
  yield* sampai(L[1].end - 0.6);
  tendang(1.08);

  // ===== 2 | ASEP: "Bukan kereta, Pak! Pelatih! ..." — reverse OTS =====
  yield* sampai(L[2].start);
  cut(-100, -33, 2.0, 8); aBlur(0); dBlur(7); dAlis(0); aAlis(1);
  dorong(2.25, 6);
  yield* setBanner('BUKAN KERETA!');
  yield* sampai(9.9);
  aAlis(-0.5);
  yield* setBanner('GALAK & DISIPLIN');

  // ===== 3 | DARMAN: "Wah, mahal itu..." — medium Darman =====
  yield* sampai(L[3].start);
  cut(230, -25, 1.55, 6); dBlur(0); aBlur(0); dAlis(-1); aAlis(0);
  dorong(1.65, 2.8);
  yield* setBanner('');
  yield* sampai(14.7);
  yield* setJudge('MAHAL!');
  tendang(1.06);

  // ===== 4 | ASEP: "Gratis, Pak. Cuma dikasih tulang." — close-up Asep =====
  yield* sampai(L[4].start);
  hideJudge();
  cut(-230, -43, 2.6, 10); aAlis(0);
  dorong(2.75, 2.2);
  yield* setBanner('GRATIS!');
  yield* sampai(18.6);
  yield* setJudge('TULANG?!');
  tendang();

  // ===== 5 | DARMAN: "Tulang?" — extreme close-up, kick =====
  yield* sampai(L[5].start);
  hideJudge();
  cut(230, -94, 2.8, 12); dAlis(1); dLook(0);
  tendang(1.15);
  yield* waitFor(0.1);

  // ===== 6 | ASEP: "Hari pertama lari lima kilo!..." — adegan lari, kamera handheld =====
  yield* sampai(L[6].start);
  darman().opacity(0);
  cut(-230, 65, 1.35, 5); aAlis(1); aLook(1);
  aRun(1); shake(8);
  yield* setBanner('HARI 1: 5 KILO!');
  yield* sampai(21.9);
  yield* setBanner('HARI 2: 5 KILO!');
  yield* sampai(L[6].end - 0.2);

  // ===== 7 | DARMAN: "Hebat! Hari ketiga?" — two-shot =====
  yield* sampai(L[7].start);
  aRun(0); shake(0); scroll(0);
  darman().opacity(1);
  cut(0, 78, 1.25, 4); dAlis(1); dLook(-1); aAlis(0);
  dorong(1.35, 2.9);
  yield* setBanner('HEBAT!');
  yield* sampai(25.0);
  yield* setBanner('HARI KETIGA?');

  // ===== 8 | ASEP: "Hari ketiga pelatihnya dibawa mudik. Asep juga libur." — close-up =====
  yield* sampai(L[8].start);
  cut(-230, -32, 2.3, 9); dAlis(0);
  dorong(2.4, 3);
  yield* setBanner('PELATIH: MUDIK');
  yield* sampai(28.4);
  yield* setBanner('ASEP: LIBUR');
  tendang(1.06);

  // ===== 9 | DARMAN: "Pelatih kok dibawa mudik? Emang siapa?" — OTS, dorong pelan (tegang) =====
  yield* sampai(L[9].start);
  cut(100, -80, 1.9, 8); aBlur(7); dAlis(-1);
  dorong(2.45, 4.4);
  yield* setBanner('SIAPA PELATIHNYA?');

  // ===== 10 | ASEP: "Si Bleki, Pak." — reveal two-shot, Bleki lompat masuk =====
  yield* sampai(L[10].start);
  aBlur(0); dAlis(1); dLook(-1); aLook(1);
  cut(0, 70, 1.2, 4);
  bleki().position([0, 900]);
  peluit(1);
  yield* setBanner('');
  yield* sampai(35.5);
  spawn(bleki().position([0, 470], 0.35, easeOutBack));
  yield* setJudge('SI BLEKI!');
  tendang(1.14);
  yield* sampai(L[10].end + 0.1);
  hideJudge();
  // gonggong "GUK!"
  cut(0, 335, 1.9, 9);
  yield* all(gonggong(1, 0.08).to(0, 0.15).to(1, 0.08).to(0, 0.15), setBanner('GUK! GUK!'));
  tendang(1.1);

  // ===== 11 | DARMAN: "Sep! Tolong! Kereta pribadinya ngejar Bapak!" — besoknya, dikejar =====
  yield* sampai(L[11].start - 0.35);
  yield* flash(1, 0.12);
  asep().opacity(0);
  darman().x(140); bleki().x(-280); bleki().y(470); bleki().scale(1.1);
  dRun(1); bRun(1); dAlis(1); dLook(1); shake(9);
  cut(-40, 60, 1.15, 5);
  yield* all(flash(0, 0.3), setBanner('BESOKNYA...'));
  yield* sampai(38.9);
  yield* setBanner('KERETA PRIBADI!');

  // penutup
  yield* sampai(L[11].end + 0.05);
  yield* setBanner('');
  kartuTxt().text('PELATIH: SI BLEKI');
  yield* kartu().scale(1.2, 0.35, easeOutBack);
  yield* sampai(data.duration);
});
