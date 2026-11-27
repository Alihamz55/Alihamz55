import {Circle, Layout, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  easeOutBack,
  sequence,
  waitFor,
} from '@motion-canvas/core';

// Tes format vertikal 1080x1920 dengan gaya telop Malam Komedi.
// Titik (0,0) ada di TENGAH layar, jadi:
//   y layar 300  -> y = 300 - 960 = -660  (kartu judul)
//   y layar 1550 -> y = 1550 - 960 = 590  (papan subtitle)
const FONT = 'Fredoka';
const KUNING = '#ffd23f';

export default makeScene2D(function* (view) {
  const kartu = createRef<Rect>();
  const panggung = createRef<Circle>();
  const papan = createRef<Rect>();
  const banner = createRef<Rect>();

  // Subtitle: kata aktif berwarna kuning
  const kata = ['Halo', 'semuanya,', 'ini', 'Malam', 'Komedi!'];
  const aktif = createSignal(-1);

  view.add(
    <>
      {/* Lampu panggung */}
      <Circle ref={panggung} size={0} y={0} fill="#ff9f1c" opacity={0.25} />

      {/* Kartu pembuka (atas) */}
      <Rect
        ref={kartu}
        y={-660}
        width={820}
        height={200}
        radius={40}
        fill="#ff4f79"
        stroke="#ffffff"
        lineWidth={8}
        scale={0}
        rotation={-4}
      >
        <Txt text="MALAM KOMEDI" fontFamily={FONT} fontWeight={700} fontSize={96} fill="#ffffff" />
      </Rect>

      {/* Banner kecil */}
      <Rect ref={banner} y={-490} width={560} height={90} radius={45} fill={KUNING} opacity={0}>
        <Txt text="Tes format vertikal" fontFamily={FONT} fontWeight={600} fontSize={48} fill="#1b1030" />
      </Rect>

      {/* Papan subtitle (bawah) dengan label nama */}
      <Rect
        ref={papan}
        y={590}
        width={1000}
        height={190}
        radius={36}
        fill="#2d6cdf"
        stroke="#ffffff"
        lineWidth={6}
        opacity={0}
      >
        <Rect x={-350} y={-95} width={200} height={64} radius={32} fill="#ffffff">
          <Txt text="ASEP" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#2d6cdf" />
        </Rect>
        <Layout layout gap={14} alignItems="center">
          {kata.map((k, i) => (
            <Txt
              text={k}
              fontFamily={FONT}
              fontWeight={700}
              fontSize={56}
              fill={() => (aktif() === i ? KUNING : '#ffffff')}
              scale={() => (aktif() === i ? 1.12 : 1)}
            />
          ))}
        </Layout>
      </Rect>
    </>,
  );

  // 1. Kartu pembuka muncul + lampu panggung membesar
  yield* all(
    kartu().scale(1, 0.6, easeOutBack),
    kartu().rotation(0, 0.6),
    panggung().size(1300, 0.8),
  );
  yield* banner().opacity(1, 0.3);

  // 2. Subtitle muncul, kata disorot satu per satu
  yield* papan().opacity(1, 0.3);
  for (let i = 0; i < kata.length; i++) {
    aktif(i);
    yield* waitFor(0.35);
  }
  aktif(-1);

  // 3. Kick di punchline
  yield* sequence(0.05, kartu().scale(1.15, 0.12).to(1, 0.2), panggung().scale(1.1, 0.12).to(1, 0.2));
  yield* waitFor(1);
});
