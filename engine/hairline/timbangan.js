/**
 * Timbangan: a market balance. A pile of chillies sits in the left pan, a
 * weight in the right, and the beam leans toward the chillies at rest. The
 * pointer's x leans the beam: the pan on the pointer's side goes down, on a
 * spring. The lower pan gets the bright rim. The slider is the most the beam
 * may lean, in degrees.
 */
const {
  Cam, clamp, facing, fit, poly, open, proj, rad, ringAt, rings, rrect, run, seg, prism,
  spring, stepS, disposer, mk, solid, put, place, pointer, reflect, register,
} = HL;

const L = 58, H = 66, HANG = 34, R = 20, PD = 5, REST = -9, Q = Math.SQRT1_2;
/** The beam runs across the view: u along it, d toward the viewer. */
const W = (u, d) => [(u + d) * Q, (d - u) * Q];
const CHILI = [[-7, -4], [-2, 5], [4, -6], [8, 2], [-9, 6], [1, -1], [-4, -10]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;

  const C = Cam(45, 0.5, 1.95);
  const lo = H - HANG - L * Math.sin(rad(26)), hi = H + 6 + L * Math.sin(rad(26));
  const ext = [-1, 1].flatMap((s) => { const [x, y] = W(s * (L + R), 0); return [[x, y, lo - 4], [x, y, hi]]; });
  fit(C, ext.concat([[-20, -20, 0], [20, 20, 0]]), 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [bRing, bIn] = rings(-20, -20, 20, 20, 9, 1.4);
  reflect(svg, g, P, front, bRing, 0, 12);

  /** One pan's group: three hangers behind, the dish, and what it holds. */
  function panGroup(holds) {
    const grp = mk("g", {}, g);
    const hang = mk("path", { class: "nf lo" }, grp);
    const dish = solid(grp), rim = mk("path", { class: "nf lo" }, grp);
    const extra = holds === "chili"
      ? CHILI.map(() => mk("ellipse", { rx: 2.3, ry: 1.2, class: "dot m" }, grp))
      : [solid(grp), solid(grp)];
    return { grp, hang, dish, rim, extra, holds };
  }

  const left = panGroup("chili");
  const base = solid(g), post = solid(g);
  put(base, prism(P, front, bRing, bIn, 0, 7));
  const [pRing, pIn] = rings(-3.5, -3.5, 3.5, 3.5, 3.5, 0.8);
  put(post, prism(P, front, pRing, pIn, 7, H));
  const beamBack = mk("path", { class: "lo" }, g), beam = mk("path", { class: "sil" }, g);
  const pin = mk("circle", { r: 1.6, class: "dot" }, g);
  const right = panGroup("weight");

  const ends = (th) => [-1, 1].map((s) => [...W(s * L * Math.cos(th), 0), H + 3 - s * L * Math.sin(th)]);
  const beamPath = (th, y) => {
    const pts = [[-L - 3, -2.4], [L + 3, -2.4], [L + 3, 2.4], [-L - 3, 2.4]];
    return poly(pts.map(([u, v]) => P(...W(u * Math.cos(th) + v * Math.sin(th), y), H + 3 - u * Math.sin(th) + v * Math.cos(th))));
  };

  function drawPan(p, ex, ey, ez) {
    const z1 = ez - HANG, z0 = z1 - PD;
    const ring = rrect(ex - R, ey - R, ex + R, ey + R, R, 14), inner = rrect(ex - R + 2, ey - R + 2, ex + R - 2, ey + R - 2, R - 2, 14);
    const top = P(ex, ey, ez);
    p.hang.setAttribute("d", [90, 210, 330].map((a) => seg(top, P(ex + R * Math.cos(rad(a)), ey + R * Math.sin(rad(a)), z1))).join(""));
    put(p.dish, prism(P, front, ring, inner, z0, z1));
    p.rim.setAttribute("d", poly(ringAt(P, inner, z1)));
    if (p.holds === "chili") p.extra.forEach((el, i) => place(el, P(ex + CHILI[i][0], ey + CHILI[i][1], z1 - 1)));
    else {
      const [w, wi] = rings(ex - 6, ey - 6, ex + 6, ey + 6, 6, 1);
      put(p.extra[0], prism(P, front, w, wi, z1 - 1, z1 + 8));
      const [k, ki] = rings(ex - 2, ey - 2, ex + 2, ey + 2, 2, 0.5);
      put(p.extra[1], prism(P, front, k, ki, z1 + 8, z1 + 12));
    }
  }

  const sp = spring(REST);
  let shown = null;
  function draw(th) {
    if (th === shown) return;
    shown = th;
    const t = rad(th), [[lx, ly, lz], [rx, ry, rz]] = ends(t);
    beamBack.setAttribute("d", beamPath(t, -1.6));
    beam.setAttribute("d", beamPath(t, 1.6));
    place(pin, P(...W(0, 1.7), H + 3));
    drawPan(left, lx, ly, lz);
    drawPan(right, rx, ry, rz);
    left.dish.sil.classList.toggle("hi", th < -1);
    right.dish.sil.classList.toggle("hi", th > 1);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const pivot = P(0, 0, H)[0];
  function lean(t) {
    sp.t = t;
    const d = Math.round(Math.abs(t));
    read.textContent = t === REST ? "rest" : d < 1 ? "pas" : (t < 0 ? "cabai " : "anak ") + d + "°";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: ([x]) => lean(clamp((x - pivot) / 150, -1, 1) * max),
    leave: () => lean(REST),
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw(REST);

  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "timbangan",
  means: "A market balance, chillies against a weight: the pan on the pointer's side goes down, and the lower pan's rim is bright.",
  rules: [1, 3, 5, 8],
  range: [10, 18, 26],
  tour: [[330, 170], [80, 170], [230, 170], null],
  mount,
});
