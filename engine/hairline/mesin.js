/**
 * Mesin: a twin-turbo V8, seen three-quarters from the front. The pointer's x pulls it apart
 * along its own axes: the intake lifts, the two heads part, the turbos swing
 * out and the pulleys come forward, on one spring. The pointer's height picks
 * a layer, which gets the bright edge. At rest it sits slightly exploded with
 * the turbos bright. The slider is the widest gap, in world units.
 */
const {
  Cam, clamp, facing, fit, hull, poly, proj, rings, prism,
  spring, stepS, disposer, mk, solid, put, place, pointer, reflect, register,
} = HL;

const LAYERS = ["intake", "kepala", "turbo", "puli"], REST = 0.3;
/** Local frame: a along the engine (its front at +a, nearest the viewer), c across it, z up. World x = a, y = c. */
const W = (c, a) => [a, c];
const box = (c0, a0, c1, a1, r, b) => rings(a0, c0, a1, c1, r, b);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;

  const C = Cam(45, 0.5, 2.0);
  const G = 30;
  fit(C, [[...W(-56 - G - 12, 10), 10], [...W(56 + G + 12, 10), 34], [...W(0, -30), 56 + G * 1.2],
    [...W(0, 36 + G * 0.8), 0], [...W(-34, 32), 0], [...W(34, -32), 0], [...W(-31 - G / 2, -30), 50 + G * 0.35]], 200, 168);
  const P = proj(C), front = facing(C);
  const L = (a, c, z) => P(...W(c, a), z);

  /** A cylinder lying along a, from a0 to a1: its silhouette, its front face, and a hub. */
  function cyl(a0, a1, c, z, R, hub) {
    const ring = (a, r) => Array.from({ length: 24 }, (_, k) => L(a, c + r * Math.cos((k * Math.PI) / 12), z + r * Math.sin((k * Math.PI) / 12)));
    const fr = ring(a1, R);
    return { sil: poly(hull(ring(a0, R).concat(fr))), crease: poly(ring(a1, R - 1.6)) + (hub ? poly(ring(a1, R * hub)) : "") };
  }

  const g = mk("g", {}, svg);
  const [bR, bI] = box(-34, -32, 34, 32, 8, 1.6);
  reflect(svg, g, P, front, bR, 0, 14);
  // Painted back to front by a + c: the far turbo, the block, the far head, the intake, the near head, the pulleys, the near turbo.
  const sol = (n) => Array.from({ length: n }, () => solid(g));
  const dots = (n, cls) => Array.from({ length: n }, () => mk("circle", { r: 1.7, class: cls }, g));
  const tFar = sol(2), eFar = dots(1, "dot"), block = solid(g);
  put(block, prism(P, front, bR, bI, 0, 34));
  const hFar = sol(2), cFar = dots(4, "dot m"), intake = { s: sol(2) }, hNear = sol(2), cNear = dots(4, "dot m");
  const puli = { s: sol(3) }, tNear = sol(2), eNear = dots(1, "dot");
  const turbos = { s: [...tFar, ...tNear] }, heads = { s: [...hFar, ...hNear] }, coils = [...cFar, ...cNear], eye = [eFar[0], eNear[0]];
  const parts = [intake, heads, turbos, puli];

  function draw(gap, pick) {
    [-1, 1].forEach((s, i) => {
      const c = s * (46 + gap);
      put(turbos.s[i * 2], cyl(-6, 8, c, 20, 13, 0.55));
      put(turbos.s[i * 2 + 1], cyl(8, 18, c + s * 4, 20, 6.5, 0));
      place(eye[i], L(18, c + s * 4, 20));
      const oc = s * gap * 0.5, oz = gap * 0.35, c0 = s < 0 ? -31 + oc : 12 + oc, c1 = s < 0 ? -12 + oc : 31 + oc;
      const [hR, hI] = box(c0, -29, c1, 28, 5, 1.4), [vR, vI] = box(c0 + 1.5, -27, c1 - 1.5, 25, 4, 1.2);
      put(heads.s[i * 2], prism(P, front, hR, hI, 30 + oz, 44 + oz));
      put(heads.s[i * 2 + 1], prism(P, front, vR, vI, 44 + oz, 50 + oz));
      for (let k = 0; k < 4; k++) place(coils[i * 4 + k], L(-19 + k * 13, (c0 + c1) / 2, 50 + oz));
    });
    const iz = gap * 1.2, [iR, iI] = box(-9, -26, 9, 22, 6, 1.6);
    put(intake.s[0], prism(P, front, iR, iI, 38 + iz, 56 + iz));
    put(intake.s[1], cyl(22, 32, 0, 48 + iz, 7, 0.5));
    const pa = 32 + gap * 0.8;
    put(puli.s[0], cyl(pa, pa + 4, 0, 13, 11, 0.4));
    put(puli.s[1], cyl(pa, pa + 3, -11, 27, 6, 0.35));
    put(puli.s[2], cyl(pa, pa + 6, 14, 28, 6.5, 0.5));
    parts.forEach((p, i) => p.s.forEach((sd) => sd.sil.classList.toggle("hi", i === pick)));
  }

  const sp = spring(REST * max);
  let pick = 2, shown = "";
  const B = register(stage, (dt) => {
    const m = stepS(sp, dt), key = sp.x.toFixed(2) + pick;
    if (key !== shown) { shown = key; draw(sp.x, pick); }
    return m;
  });
  bag.add(B.unregister);

  // Bands from the rest pose: they never move with the parts.
  const band = [52, 40, 20].map((z) => L(0, 0, z)[1]);
  const layerAt = (y) => (y < band[0] ? 0 : y < band[1] ? 1 : y < band[2] ? 2 : 3);
  function set(t, p) {
    sp.t = t; pick = p;
    read.textContent = p < 0 ? "rest" : LAYERS[p] + " " + Math.round(t);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([x, y]) => set(clamp((x - 50) / 300, 0, 1) * max, layerAt(y)),
    leave: () => { set(REST * max, -1); pick = 2; },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw(REST * max, pick);

  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "mesin",
  means: "A twin-turbo V8 that comes apart under the pointer: intake up, heads apart, turbos out, pulleys forward.",
  rules: [1, 3, 5, 6],
  range: [12, 20, 30],
  tour: [[120, 110], [250, 150], [330, 200], [300, 260], null],
  mount,
});
