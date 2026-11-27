import {makeScene2D, Circle, Txt} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';

// Contoh scene: lingkaran kuning + judul "Malam Komedi"
export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  const title = createRef<Txt>();

  view.add(
    <>
      <Circle ref={circle} width={320} height={320} fill="#ffcc00" />
      <Txt ref={title} text="Malam Komedi" fontSize={90} fill="#ffffff" y={300} opacity={0} />
    </>,
  );

  yield* all(circle().scale(1.5, 1).to(1, 1), title().opacity(1, 1));
});
