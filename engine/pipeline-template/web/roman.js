FACE.sad = { eye: ["lid", "lid"], brow: [-6, 3], mouth: "frown" };
FACE.cry = { eye: ["squeeze", "squeeze"], brow: [-6, 3], mouth: "wave" };
FACE.sob = { eye: ["squeeze", "squeeze"], brow: [-6, 3], mouth: "O" };
FACE.snore = { eye: ["dash", "dash"], brow: [0, -1], mouth: "o" };
FACE.stubborn = { eye: ["lid", "lid"], brow: [4, -3], mouth: "frown" };
FACE.squint = { eye: ["slit", "slit"], brow: [3, -2], mouth: "dash" };
// lip-sync variants: expr_t1..expr_t3 keep eyes/brows, replace the mouth
for (const k of Object.keys(FACE)) for (const lv of [1, 2, 3]) FACE[k + "_t" + lv] = { ...FACE[k], mouth: "talk" + lv };

// ---------------- Roman-era cast (our own designs), built on the Pen / blob / face helpers above ----------------
const STEEL = "#aeb6bf", BRASS = "#d9a845", LEATHER = "#7a4a2a";
export const OUTFITS = {
  legion: { tunic: "#b8322f", cape: "#8f2228", skin: SKIN, helmet: true, armor: true, spear: true, shield: true },
  old: { tunic: "#9c4a3c", cape: "#6e3330", skin: "#f3d6bb", helmet: "old", armor: true, spear: true, shield: false, beard: "#f4f1ea", brows: "#f4f1ea" },
  toga: { tunic: "#f1ead8", skin: "#f5c9a0", toga: "#6b3c8f", hair: "#3b2a20", stout: true },
  civA: { tunic: "#4f7fb8", skin: "#f5c9a0", hair: "#5a3b2a" },
  civB: { tunic: "#d9a441", skin: SKIN, hair: "#2b211c", dress: "#c25a7a" },
  civC: { tunic: "#5d8a3a", skin: "#c99067", hair: "#1e1714", stout: true },
  workA: { tunic: "#8a5d3b", skin: "#f5c9a0", cap: "#c2733a", apron: "#d8c9a6" },
  workB: { tunic: "#3f6a6f", skin: "#ecd0b6", cap: "#5b4a8a", moustache: "#4a3020" },
  // ---- "Otw" cast ----
  komik: { tunic: "#f2b632", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#2f3d63", pants: "#2f3d63" },
  handuk: { tunic: "#e8b48a", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#e8b48a", towel: "#7fc7d9", bare: true, wet: true },
  rapi: { tunic: "#d8453b", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#3a3a46", pants: "#3a3a46", sweat: true },
  batik: { tunic: "#8a4b22", skin: "#e8b48a", hair: "#2a1d18", arms: "#8a4b22", legs: "#2b2f3a", pants: "#2b2f3a", batik: "#e2b04a" },
  batikRun: { tunic: "#8a4b22", skin: "#e8b48a", hair: "#2a1d18", arms: "#8a4b22", legs: "#2b2f3a", pants: "#2b2f3a", batik: "#e2b04a", sweat: true },
  pengantin: { tunic: "#f4f1ea", skin: "#e8b48a", hair: "#2a1d18", arms: "#f4f1ea", legs: "#f4f1ea", pants: "#f4f1ea", peci: true, gold: true },
  tante: { tunic: "#b83a7a", skin: "#f0c49c", hair: "#2b211c", arms: "#b83a7a", dress: "#b83a7a", bun: true, glasses: true, kebaya: "#f2c14e" },
  istri: { tunic: "#f3e6c8", skin: "#f0c8a0", hair: "#2b211c", arms: "#f3e6c8", dress: "#f3e6c8", bun: true, crown: true },
  pejuang: { tunic: "#efe9d8", skin: "#d9a07a", hair: "#2a1d18", arms: "#efe9d8", legs: "#6b5a3a", pants: "#6b5a3a", peci: true, ikat: true },
  kartini: { tunic: "#f6f1e6", skin: "#dfa984", hair: "#1c1410", arms: "#f6f1e6", dress: "#7a4f2c", bun: true, kebaya: "#e3d6bd" },
  bayi: { tunic: "#bfe3ff", skin: "#f2c6a0", hair: "#2a1d18", arms: "#bfe3ff", legs: "#bfe3ff" },
  galau: { tunic: "#7d8496", skin: "#e8b48a", hair: "#2a1d18", arms: "#7d8496", legs: "#2b2f3a", pants: "#2b2f3a" },
  santai: { tunic: "#e2574c", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#e8b48a", pants: "#3a5a8a" },
  zainuddin: { tunic: "#efe6d2", skin: "#e8b48a", hair: "#2a1d18", arms: "#efe6d2", legs: "#3a3a46", pants: "#3a3a46", peci: true },
  santaiSweat: { tunic: "#e2574c", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#e8b48a", pants: "#3a5a8a", sweat: true },
  hrd: { tunic: "#3a3f52", skin: "#f0c49c", hair: "#2b211c", arms: "#3a3f52", dress: "#3a3f52", bun: true, glasses: true },
  genit: { tunic: "#ff7ab8", skin: "#f2c6a0", hair: "#3a2418", arms: "#f2c6a0", dress: "#ff7ab8", bun: true },
  bule: { tunic: "#3a8fd5", skin: "#f6d8c4", hair: "#f2c94c", arms: "#f6d8c4", dress: "#3a8fd5", bun: true },
  teman: { tunic: "#8fa8d8", skin: "#d9a07a", hair: "#3a2418", arms: "#8fa8d8", legs: "#8fa8d8", stripes: "#5f7bb5", bedhead: true },
};

/** galea: iron bowl, brass brow band, cheek guards, transverse red crest */
const galea = (p, H, cx, hc, light, thick, ow, old, u) => {
  const crest = old ? "#8d4b3f" : "#d2372f", bowl = old ? "#8f8a7e" : STEEL;
  // crest (behind the bowl top)
  const cy0 = hc - H.b * 0.98;
  const cr = ellPts(cx, cy0, 0.66 * 2 * H.a, 0.42 * 2 * H.b, 180, 360, 0, 40);
  cr.push([cx + 0.66 * 2 * H.a * 0.98, cy0 + 4 * u], [cx - 0.66 * 2 * H.a * 0.98, cy0 + 4 * u]);
  const crP = [...ellPts(cx, cy0 + 2 * u, 0.62 * 2 * H.a, 0.36 * 2 * H.b, 180, 360, 0, 40)];
  p.shadedFill(crP, crest, mul(crest, [0.7, 0.62, 0.7]), light, 0.62 * 2 * H.a, 0.3);
  p.clip(crP, () => { for (let i = -9; i <= 9; i++) p.stroke([[cx + i * 7.4 * u, cy0], [cx + i * 9.4 * u, cy0 - 0.62 * H.b * Math.cos(i / 11)]], 1.4 * u, mul(crest, [0.62, 0.55, 0.62])); });
  if (old) p.clip(crP, () => { for (let i = 0; i < 6; i++) p.ell(cx + (i - 3) * 22 * u, cy0 - 18 * u - (i % 2) * 10 * u, 9 * u, 5 * u, "#6f6a5e", 0); });
  p.inkRing(crP, ow * 0.85, thick);
  p.poly(rrect(cx - 10 * u, cy0 - 6 * u, cx + 10 * u, cy0 + 6 * u, 3 * u), BRASS, 2 * u);
  // bowl: upper head cap
  const bandY = hc - H.b * 0.42;
  const bp = ellPts(cx, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
  p.shadedFill(bp, bowl, mul(bowl, [0.62, 0.64, 0.72]), light, H.a, 0.4);
  p.clip(bp, () => {
    p.stroke(ellPts(cx - 20 * u, bandY - 0.3 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 300, 0, 16), 4 * u, "#ffffff55");
    if (old) for (let i = 0; i < 9; i++) p.ell(cx + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (3 + (i % 3) * 2) * u, (2 + (i % 2)) * u, "#8a4b22", 0);
  });
  p.inkRing(bp, ow * 0.9, thick);
  p.band([[cx - H.a * 1.04, bandY], [cx + H.a * 1.04, bandY]], old ? "#a88a4a" : BRASS, 7 * u, 1.8 * u, "round");
  for (const s of [-1, 1]) p.dot(cx + s * 0.55 * H.a, bandY, 2.2 * u, "#fff3c4");
};
const cheeks = (p, H, cx, hc, light, ow, old, u) => {
  const bowl = old ? "#8f8a7e" : STEEL;
  for (const s of [-1, 1]) {
    const x0 = cx + s * 0.78 * H.a, x1 = cx + s * 1.07 * H.a, y0 = hc - H.b * 0.42, y1 = hc + H.b * 0.48;
    const pts = [[x0, y0], [x1, y0], [x1 - s * 0.04 * H.a, y1 - 0.1 * H.b], [x0 + s * 0.06 * H.a, y1], [x0 - s * 0.05 * H.a, (y0 + y1) / 2]];
    p.shadedFill(pts, bowl, mul(bowl, [0.62, 0.64, 0.72]), light, 0.2 * H.a, 0.3);
    p.poly(pts, null, ow * 0.8);
    p.dot((x0 + x1) / 2, (y0 + y1) / 2 - 0.05 * H.b, 2.2 * u, BRASS);
  }
};
const cobweb = (p, cx, cy, r, u) => {
  const g = p.g; g.save(); g.globalAlpha = 0.8;
  for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 6); p.stroke([[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], 1.1 * u, "#f2f2f2"); }
  for (let k = 1; k <= 4; k++) { const rr = r * k / 4.3, pts = []; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 6); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } p.stroke(pts, 1 * u, "#f2f2f2"); }
  g.restore();
};

/** front-facing Roman-era character. opts: expr, blink, look, facing, seed, L/R arm poses, tilt, headTilt, bob, nohelmet, light */
export const romanFront = (p, key, opts = {}) => {
  const O = typeof key === "string" ? OUTFITS[key] : key;
  const { expr = "neutral", blink = 0, look = 0, facing = 0, seed = 3, L = "hang", R = O.spear ? "spear" : "hang", tilt = 0, headTilt = 0,
    bob = 0, nohelmet = false, light = rad(-120), web = false, step = 0 } = opts;
  const lid = lidOf(blink), skin = O.skin ?? SKIN;
  const H = headBlob(seed, 118, facing), W = 2 * H.a, HH = 2 * H.b, u = W / 100;
  const torsoL = O.stout ? 1.12 : 1.08, legsL = 1.38, sole = 975;
  const torsoBot = sole - legsL * HH - bob * HH, chin = torsoBot - torsoL * HH, hc = chin - H.b, hipY = torsoBot - 0.12 * HH;
  const thick = thickAngle(light), ow = 5 * u, cx = 300;
  const legCol = O.legs ?? mix(O.tunic, INK, 0.62), armCol = O.arms ?? mix(O.tunic, INK, 0.5);
  const helmet = !!O.helmet && !nohelmet, old = O.helmet === "old";
  p.rot = null;
  // ---- cape behind everything ----
  if (O.cape) {
    const cp = [[cx - 0.48 * W, chin + 0.08 * HH], [cx + 0.48 * W, chin + 0.08 * HH], [cx + 0.62 * W, sole - 0.55 * HH], [cx + 0.2 * W, sole - 0.45 * HH], [cx - 0.2 * W, sole - 0.5 * HH], [cx - 0.62 * W, sole - 0.55 * HH]];
    p.gradFill(cp, O.cape, mul(O.cape, [0.6, 0.6, 0.7]), light); p.inkRing(cp, ow * 0.8, thick);
  }
  // ---- legs ----
  const dress = !!O.dress;
  for (const side of [-1, 1]) {
    const up = Math.max(0, Math.sin(Math.PI * 2 * (step + (side > 0 ? 0.5 : 0)))) * 30 * (step ? 1 : 0);
    const hx = cx + side * 16 * u, fx = cx + side * 22 * u, fy = sole - 4 * u - up;
    p.stroke(curve([hx, hipY], [(hx + fx) / 2 + side * 2 * u, (hipY + fy) / 2], [fx, fy]), 5.8 * u, legCol);
    const sandal = O.helmet ? LEATHER : "#5a3b2a";
    p.stroke([[fx - side * 3 * u, fy], [fx + side * 13 * u, fy + 0.5 * u]], 7.5 * u + 3, INK);
    p.stroke([[fx - side * 3 * u, fy], [fx + side * 13 * u, fy + 0.5 * u]], 7.5 * u, sandal);
    if (O.helmet) for (let k = 1; k <= 3; k++) p.stroke([[fx - 4 * u, fy - k * 0.07 * HH], [fx + 4 * u, fy - k * 0.07 * HH - 2 * u]], 2 * u, LEATHER);
  }
  // ---- upper body ----
  p.rot = tilt ? [rad(tilt), cx, hipY] : null;
  const T = { a: (0.4 * W) / 1.06 * (O.stout ? 1.12 : 1), b: 0.5 * (torsoBot - (chin - 0.25 * HH)), nTop: 2.2, nBot: 2.6, egg: O.stout ? 0.17 : 0.12, asym: 0.04 * facing, rot: 0, noise: 0.006, seed: seed + 7 };
  const tcx = cx + 3 * u * facing, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
  const S = (side) => [tcx + side * 0.85 * T.a, chin + 0.12 * HH];
  const arm = (side, pose) => {
    const s = S(side), X = (k) => tcx + side * (T.a * 1.1 + k * u);
    switch (pose) {
      case "spear": return { pts: [s, [X(6), s[1] + 0.42 * HH], [X(10), s[1] + 0.2 * HH]], front: false };
      case "point": return { pts: [s, [X(28), s[1] - 0.02 * HH], [X(62), s[1] - 0.1 * HH]], front: false, finger: true };
      case "up": return { pts: [s, [X(14), s[1] - 0.3 * HH], [X(22), s[1] - 0.75 * HH]], front: false };
      case "wave": return { pts: [s, [X(16), s[1] - 0.2 * HH], [X(30 + 10 * Math.sin(opts.wv || 0)), s[1] - 0.62 * HH]], front: false };
      case "hip": return { pts: [s, [X(22), s[1] + 0.3 * HH], [tcx + side * T.a * 0.95, torsoBot - 0.3 * HH]], front: false };
      case "belly": return { pts: [s, [X(8), s[1] + 0.45 * HH], [tcx + side * 0.25 * T.a, torsoBot - 0.35 * HH]], front: true };
      case "temple": return { pts: [s, [X(26), s[1] + 0.05 * HH], [cx + side * (H.a + 16 * u), hc - 0.1 * HH]], front: false, swirl: true };
      case "lift": return { pts: [s, [X(20), s[1] - 0.25 * HH], [X(4), s[1] - 0.82 * HH]], front: false };
      case "shield": return { pts: [s, [X(4), s[1] + 0.4 * HH], [tcx + side * 0.6 * T.a, torsoBot - 0.1 * HH]], front: true };
      case "cross": return { pts: [s, [X(2), s[1] + 0.38 * HH], [tcx - side * 0.45 * T.a, s[1] + 0.32 * HH]], front: true };
      case "reach": { const lf = (opts.lift || 0) * 0.62 * HH; return { pts: [s, [X(42), s[1] - 0.12 * HH - lf * 0.6], [X(82), s[1] - 0.5 * HH - lf]], front: false }; }
      case "cheek": return { pts: [s, [X(16), s[1] + 0.05 * HH], [cx + side * (H.a + 2 * u), hc + 0.25 * H.b]], front: false };
      case "mic": return { pts: [s, [X(8), s[1] + 0.4 * HH], [cx + side * 0.25 * H.a + 6 * u * facing, hc + 1.05 * H.b]], front: true, mic: true };
      case "phone": return { pts: [s, [X(18), s[1] + 0.1 * HH], [cx + side * (H.a + 4 * u), hc + 0.15 * H.b]], front: false, phone: true };
      case "text": return { pts: [s, [X(2), s[1] + 0.4 * HH], [tcx + side * 0.22 * T.a, chin + 0.42 * HH]], front: true, text: true };
      case "pray": return { pts: [s, [X(0), s[1] + 0.38 * HH], [tcx + side * 0.05 * T.a, chin + 0.3 * HH]], front: true };
      case "shrug": return { pts: [s, [X(18), s[1] + 0.3 * HH], [X(40), s[1] + 0.02 * HH]], front: false, palm: true };
      case "sock": return { pts: [s, [X(20), s[1] - 0.25 * HH], [X(10), s[1] - 0.7 * HH]], front: false, sock: true };
      case "salute": return { pts: [s, [X(26), s[1] - 0.05 * HH], [cx + side * (H.a * 0.55), hc - 0.45 * H.b]], front: false, palm: true };
      case "wallet": return { pts: [s, [X(6), s[1] + 0.36 * HH], [tcx + side * 0.15 * T.a, chin + 0.4 * HH]], front: true, wallet: true };
      case "violin": return { pts: [s, [X(26), s[1] + 0.06 * HH], [X(50), s[1] - 0.2 * HH]], front: true, violin: true };
      case "bow": { const b = Math.sin(opts.bw || 0); return { pts: [s, [X(26), s[1] + 0.34 * HH], [X(4 + 30 * b), s[1] + 0.2 * HH - b * 0.04 * HH]], front: true, bow: true }; }
      case "violinDown": return { pts: [s, [X(6), s[1] + 0.42 * HH], [X(6), chin + 0.98 * HH]], front: false, fiddleDown: true };
      case "thumb": return { pts: [s, [X(20), s[1] + 0.12 * HH], [X(44), s[1] - 0.12 * HH]], front: false, thumb: true };
      default: return { pts: [s, [X(4), s[1] + 0.48 * HH], [X(3), chin + 1.04 * HH]], front: false };
    }
  };
  const arms = [arm(-1, L), arm(1, R)];
  const drawArm = (a) => {
    p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 5.2 * u, armCol);
    const [hx, hy] = a.pts[2];
    p.dot(hx, hy, 5.5 * u);
    if (a.finger) { const dx = a.pts[2][0] - a.pts[1][0], dy = a.pts[2][1] - a.pts[1][1], l = Math.hypot(dx, dy); p.stroke([[hx, hy], [hx + dx / l * 14 * u, hy + dy / l * 14 * u]], 2.6 * u); }
    if (a.thumb) p.stroke([[hx, hy], [hx + Math.sign(hx - cx) * 6 * u, hy - 12 * u]], 2.6 * u);
    if (a.wallet) { p.poly(rrect(hx - 20 * u, hy - 12 * u, hx + 20 * u, hy + 14 * u, 4 * u), "#6b3f22", 2.2 * u); p.stroke([[hx - 20 * u, hy], [hx + 20 * u, hy]], 1.4 * u, "#3a2414"); }
    if (a.violin) { const B = [cx - 0.42 * H.a, chin + 0.17 * HH], ang = Math.atan2(hy - B[1], hx - B[0]), L = Math.hypot(hx - B[0], hy - B[1]), g = p.g;
      g.save(); g.translate(B[0], B[1]); g.rotate(ang);
      p.band([[24 * u, 0], [L + 6 * u, 0]], "#2a1a12", 8 * u, 1.6 * u);
      p.ell(L + 10 * u, 0, 7 * u, 6 * u, "#5a3018", 1.8 * u);
      p.poly([...ellPts(-20 * u, 0, 24 * u, 26 * u, 0, 360, 0, 28)], "#b0561f", 2.2 * u); p.poly([...ellPts(16 * u, 0, 19 * u, 20 * u, 0, 360, 0, 24)], "#b0561f", 2.2 * u);
      p.poly(rrect(-22 * u, -15 * u, 18 * u, 15 * u, 4 * u), "#b0561f", 0);
      p.ell(-26 * u, -6 * u, 8 * u, 6 * u, "#d98a4a", 0);
      for (const sy of [-1, 1]) p.stroke([[-6 * u, sy * 11 * u], [-12 * u, sy * 7 * u], [-4 * u, sy * 3 * u]], 1.6 * u);
      p.band([[-36 * u, 0], [-24 * u, 0]], "#2a1a12", 6 * u, 0);
      for (let i = -1.5; i <= 1.5; i++) p.stroke([[-36 * u, i * 1.6 * u], [L + 2 * u, i * 1.3 * u]], 0.6 * u, "#f4e6c0");
      g.restore(); p.dot(hx, hy, 5.5 * u, armCol); }
    if (a.bow) { const B = [cx - 0.42 * H.a + 6 * u, chin + 0.17 * HH], dx = B[0] - hx, dy = B[1] - hy, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, e = [hx + ux * 150 * u, hy + uy * 150 * u], s0 = [hx - ux * 14 * u, hy - uy * 14 * u];
      p.stroke([s0, e], 3 * u, "#4a2a16"); p.stroke([[s0[0] + uy * 4 * u, s0[1] - ux * 4 * u], [e[0] + uy * 1.5 * u, e[1] - ux * 1.5 * u]], 1.4 * u, "#f4f1ea"); p.dot(hx, hy, 5.5 * u, armCol); }
    if (a.fiddleDown) { const g = p.g; g.save(); g.translate(hx, hy); g.rotate(-1.35);
      p.band([[16 * u, 0], [70 * u, 0]], "#2a1a12", 7 * u, 1.4 * u); p.ell(-14 * u, 0, 20 * u, 22 * u, "#b0561f", 2 * u); p.ell(16 * u, 0, 16 * u, 17 * u, "#b0561f", 2 * u); p.poly(rrect(-14 * u, -13 * u, 14 * u, 13 * u, 3 * u), "#b0561f", 0); g.restore(); p.dot(hx, hy, 5.5 * u, armCol); }
    if (a.palm) { const sd = Math.sign(hx - cx); p.ell(hx + sd * 4 * u, hy - 4 * u, 7 * u, 5 * u, armCol, 2 * u); }
    if (a.phone) { p.poly(rrect(hx - 7 * u, hy - 20 * u, hx + 7 * u, hy + 14 * u, 3 * u), "#2b2f3a", 2.2 * u); p.poly(rrect(hx - 4.5 * u, hy - 17 * u, hx + 4.5 * u, hy + 10 * u, 2 * u), "#8fd3ff", 0); p.dot(hx, hy, 5 * u, armCol); }
    if (a.sock) { const sk = [[hx - 6 * u, hy - 4 * u], [hx + 6 * u, hy - 4 * u], [hx + 7 * u, hy + 34 * u], [hx + 24 * u, hy + 40 * u], [hx + 24 * u, hy + 52 * u], [hx - 4 * u, hy + 50 * u], [hx - 7 * u, hy + 40 * u]];
      p.poly(sk, "#f4f1ea", 2.2 * u); p.band([[hx - 6 * u, hy + 4 * u], [hx + 6 * u, hy + 4 * u]], "#d8453b", 4 * u, 0); p.band([[hx - 6.5 * u, hy + 12 * u], [hx + 6.5 * u, hy + 12 * u]], "#d8453b", 4 * u, 0); p.dot(hx, hy, 5.5 * u, armCol); }
  };
  // spear behind
  if (O.spear && R === "spear") {
    const [hx, hy] = arms[1].pts[2], s0 = [hx + 2 * u, sole - 2 * u], s1 = [hx - 3 * u, 70];
    p.band([s0, s1], old ? "#6d5236" : "#8a5a34", 4.2 * u, 1.4 * u, "round");
    const tip = [[s1[0] - 7 * u, s1[1] + 6 * u], [s1[0], s1[1] - 34 * u], [s1[0] + 7 * u, s1[1] + 6 * u], [s1[0], s1[1] + 14 * u]];
    p.poly(tip, old ? "#8b7c6a" : "#c9cfd6", 2 * u);
    if (web) cobweb(p, s1[0] - 2 * u, s1[1] + 60 * u, 70 * u, u);
  }
  for (const a of arms) if (!a.front) drawArm(a);
  // torso
  if (dress) {
    const D = { a: 0.5 * W * 0.98, b: 0.5 * ((sole - 0.35 * HH) - (chin - 0.2 * HH)), nTop: 2.0, nBot: 3.0, egg: 0.35, asym: 0, rot: 0, noise: 0.006, seed: seed + 9 };
    const dp = blobPts(cx, sole - 0.35 * HH - D.b, D);
    p.gradFill(dp, O.dress, mul(O.dress, SH_CLOTH), light); p.inkRing(dp, ow, thick);
  }
  // skirt / pteruges below the torso
  if (O.pants) { // shorts / trousers top part
    const sk = [[tcx - 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 0.95 * T.a, torsoBot + 0.34 * HH], [tcx + 0.06 * T.a, torsoBot + 0.34 * HH], [tcx, torsoBot + 0.12 * HH], [tcx - 0.06 * T.a, torsoBot + 0.34 * HH], [tcx - 0.95 * T.a, torsoBot + 0.34 * HH]];
    p.gradFill(sk, O.pants, mul(O.pants, SH_CLOTH), light); p.poly(sk, null, ow * 0.8);
  } else if (O.towel) {
    const sk = [[tcx - 0.98 * T.a, torsoBot - 0.24 * HH], [tcx + 0.98 * T.a, torsoBot - 0.24 * HH], [tcx + 1.1 * T.a, torsoBot + 0.62 * HH], [tcx - 1.1 * T.a, torsoBot + 0.62 * HH]];
    p.gradFill(sk, O.towel, mul(O.towel, SH_CLOTH), light);
    p.clip(sk, () => { for (let i = 0; i < 3; i++) p.band([[tcx - 1.2 * T.a, torsoBot + (0.12 + i * 0.18) * HH], [tcx + 1.2 * T.a, torsoBot + (0.12 + i * 0.18) * HH]], "#ffffff88", 3 * u, 0);
      p.stroke([[tcx + 0.45 * T.a, torsoBot - 0.24 * HH], [tcx + 0.3 * T.a, torsoBot + 0.6 * HH]], 2 * u, mul(O.towel, [0.7, 0.7, 0.8])); });
    p.poly(sk, null, ow * 0.8);
  } else if (!dress) {
    const sk = [[tcx - 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 1.0 * T.a, torsoBot + 0.3 * HH], [tcx - 1.0 * T.a, torsoBot + 0.3 * HH]];
    p.gradFill(sk, O.tunic, mul(O.tunic, SH_CLOTH), light); p.poly(sk, null, ow * 0.8);
    if (O.armor) for (let i = -3; i <= 3; i++) { const x = tcx + i * 0.27 * T.a, st = [[x - 9 * u, torsoBot - 0.05 * HH], [x + 9 * u, torsoBot - 0.05 * HH], [x + 9 * u, torsoBot + 0.22 * HH], [x - 9 * u, torsoBot + 0.22 * HH]]; p.poly(st, old ? "#5e4632" : LEATHER, 1.6 * u); }
  }
  p.gradFill(tp, O.tunic, mul(O.tunic, O.bare ? SH_SKIN : SH_CLOTH), light);
  p.clip(tp, () => {
    if (O.armor) {
      const top = chin - 0.1 * HH, bot = torsoBot - 0.25 * HH, n = 5;
      for (let i = 0; i < n; i++) {
        const y0 = top + (bot - top) * i / n, y1 = top + (bot - top) * (i + 1) / n;
        const c = old ? (i % 2 ? "#8d8679" : "#9a9384") : (i % 2 ? "#a7b0ba" : "#bcc4cc");
        p.poly([[tcx - 1.5 * T.a, y0], [tcx + 1.5 * T.a, y0 + 3 * u], [tcx + 1.5 * T.a, y1 + 3 * u], [tcx - 1.5 * T.a, y1]], c, 1.8 * u);
      }
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], LEATHER, 0.08 * HH, 1.5 * u);
      for (let i = -2; i <= 2; i++) p.dot(tcx + i * 0.3 * T.a, torsoBot - 0.2 * HH, 2.4 * u, BRASS);
      if (old) for (let i = 0; i < 5; i++) p.ell(tcx + Math.sin(i * 1.7) * 0.7 * T.a, top + (bot - top) * ((i * 0.31) % 1), 6 * u, 3 * u, "#8a4b22", 0);
    } else if (O.bare) {
      p.stroke(ellPts(tcx - 0.32 * T.a, chin + 0.38 * HH, 0.22 * T.a, 0.08 * HH, 20, 160, 0, 10), 1.6 * u, mul(skin, [0.7, 0.6, 0.6]));
      p.stroke(ellPts(tcx + 0.32 * T.a, chin + 0.38 * HH, 0.22 * T.a, 0.08 * HH, 20, 160, 0, 10), 1.6 * u, mul(skin, [0.7, 0.6, 0.6]));
      p.dot(tcx, torsoBot - 0.42 * HH, 2 * u, mul(skin, [0.6, 0.5, 0.5]));
    } else if (O.batik || O.gold) {
      if (O.batik) for (let i = -4; i <= 4; i++) for (let j = 0; j < 6; j++) { const x = tcx + i * 0.32 * T.a + (j % 2) * 0.16 * T.a, y = chin + (0.05 + j * 0.2) * HH;
        p.ell(x, y, 7 * u, 5 * u, O.batik, 1.4 * u); p.dot(x, y, 1.8 * u, INK); }
      if (O.gold) { p.band([[tcx - 0.5 * T.a, chin + 0.02 * HH], [tcx, chin + 0.3 * HH], [tcx + 0.5 * T.a, chin + 0.02 * HH]], "#e2b04a", 6 * u, 1.4 * u);
        for (let i = 0; i < 4; i++) p.dot(tcx, chin + (0.4 + i * 0.18) * HH, 2.6 * u, "#e2b04a"); }
      p.stroke([[tcx - 0.2 * T.a, chin + 0.02 * HH], [tcx, chin + 0.16 * HH], [tcx + 0.2 * T.a, chin + 0.02 * HH]], 2 * u);
    } else if (O.kebaya) {
      for (let i = -3; i <= 3; i++) p.ell(tcx + i * 0.3 * T.a, chin + (0.3 + (i % 2) * 0.25) * HH, 6 * u, 6 * u, O.kebaya, 1.2 * u);
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], O.kebaya, 0.05 * HH, 1.2 * u);
    } else if (O.stripes) {
      for (let i = -6; i <= 6; i++) p.band([[tcx + i * 0.3 * T.a, chin - 0.2 * HH], [tcx + i * 0.3 * T.a, torsoBot + 0.1 * HH]], O.stripes, 5 * u, 0);
      for (let i = 0; i < 3; i++) p.dot(tcx, chin + (0.2 + i * 0.22) * HH, 2.4 * u, "#f4f1ea");
    } else {
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], O.apron ? "#5a3b2a" : "#e2c27a", 0.05 * HH, 1.2 * u);
      if (O.toga) p.band([[tcx - 1.0 * T.a, chin - 0.1 * HH], [tcx + 1.1 * T.a, torsoBot - 0.1 * HH]], O.toga, 0.16 * HH, 1.6 * u);
      if (O.apron) p.poly([[tcx - 0.55 * T.a, torsoBot - 0.2 * HH], [tcx + 0.55 * T.a, torsoBot - 0.2 * HH], [tcx + 0.6 * T.a, torsoBot + 0.2 * HH], [tcx - 0.6 * T.a, torsoBot + 0.2 * HH]], O.apron, 1.6 * u);
      p.stroke([[tcx - 0.2 * T.a, chin + 0.02 * HH], [tcx, chin + 0.16 * HH], [tcx + 0.2 * T.a, chin + 0.02 * HH]], 2 * u);
    }
  });
  p.inkRing(tp, ow, thick);
  if (O.armor) for (const s of [-1, 1]) { // shoulder plates
    const sp = ellPts(tcx + s * 0.72 * T.a, chin + 0.1 * HH, 0.42 * T.a, 0.13 * HH, 180, 360, s * 8, 20);
    p.poly(sp, old ? "#9a9384" : "#c5ccd3", 1.8 * u);
  }
  if (O.moss) {/* reserved */}
  for (const a of arms) if (a.front) drawArm(a);
  if (arms.some((a) => a.text)) { const ax = (arms[0].pts[2][0] + arms[1].pts[2][0]) / 2, ay = (arms[0].pts[2][1] + arms[1].pts[2][1]) / 2;
    p.poly(rrect(ax - 15 * u, ay - 26 * u, ax + 15 * u, ay + 18 * u, 4 * u), "#2b2f3a", 2.2 * u); p.poly(rrect(ax - 11.5 * u, ay - 22 * u, ax + 11.5 * u, ay + 13 * u, 2.5 * u), "#8fd3ff", 0);
    p.poly(rrect(ax - 9 * u, ay - 18 * u, ax + 2 * u, ay - 12 * u, 2 * u), "#ffffff", 0); p.poly(rrect(ax - 2 * u, ay - 8 * u, ax + 9 * u, ay - 2 * u, 2 * u), "#b9f5a0", 0);
    for (const a of arms) p.dot(a.pts[2][0], a.pts[2][1] + 4 * u, 5.5 * u, armCol); }
  // shield in front, held by the left hand
  if (O.shield && L === "shield") {
    const sx = tcx - 0.55 * T.a, sy = torsoBot + 0.05 * HH, sw = 0.36 * W, sh = 0.78 * HH;
    const sp = rrect(sx - sw, sy - sh, sx + sw, sy + sh, 8 * u);
    p.gradFill(sp, "#c0302c", "#7d1d22", light);
    p.clip(sp, () => {
      p.band([[sx - sw, sy], [sx + sw, sy]], BRASS, 6 * u, 1.2 * u);
      p.band([[sx, sy - sh], [sx, sy + sh]], BRASS, 6 * u, 1.2 * u);
      for (const s of [-1, 1]) { p.stroke([[sx + s * 12 * u, sy - 14 * u], [sx + s * 34 * u, sy - 46 * u], [sx + s * 22 * u, sy - 44 * u], [sx + s * 46 * u, sy - 74 * u]], 3.5 * u, BRASS); p.stroke([[sx + s * 12 * u, sy + 14 * u], [sx + s * 34 * u, sy + 46 * u], [sx + s * 22 * u, sy + 44 * u], [sx + s * 46 * u, sy + 74 * u]], 3.5 * u, BRASS); }
      p.stroke(ellPts(sx - sw * 0.5, sy - sh * 0.7, sw * 0.3, sh * 0.1, 200, 320, 0, 10), 3 * u, "#ffffff44");
    });
    p.ell(sx, sy, 13 * u, 13 * u, "#e6c068", 2.2 * u);
    p.inkRing(sp, ow, thick);
  }
  // ---- head ----
  const [cpx, cpy] = rotAbout([cx, chin], rad(tilt), [cx, hipY]);
  const Ah = tilt + headTilt;
  p.rot = Ah ? [rad(Ah), cx, chin, cpx - cx, cpy - chin] : null;
  if (helmet) galea(p, H, cx, hc, light, thick, ow, old, u);
  const hp = blobPts(cx, hc, H);
  if (O.hair && !helmet) { const hb = blobPts(cx, hc - 0.03 * HH, { ...H, a: H.a * 1.04, b: H.b * 1.05 }); p.poly(hb, O.hair, 0); }
  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
  p.inkRing(hp, ow, thick);
  if (helmet) {
    const bandY = hc - H.b * 0.42, bp = ellPts(cx, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
    p.shadedFill(bp, old ? "#8f8a7e" : STEEL, mul(old ? "#8f8a7e" : STEEL, [0.62, 0.64, 0.72]), light, H.a, 0.4);
    p.clip(bp, () => { p.stroke(ellPts(cx - 20 * u, bandY - 0.3 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 300, 0, 16), 5 * u, "#ffffff66");
      if (old) for (let i = 0; i < 9; i++) p.ell(cx + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (4 + (i % 3) * 2) * u, (2.5 + (i % 2)) * u, "#8a4b22", 0); });
    p.poly(bp, null, ow * 0.9);
    p.band([[cx - H.a * 1.05, bandY], [cx + H.a * 1.05, bandY]], old ? "#a88a4a" : BRASS, 7 * u, 1.8 * u, "round");
    p.poly(rrect(cx - 4 * u, bandY - 0.55 * H.b, cx + 4 * u, bandY - 3 * u, 2 * u), old ? "#a88a4a" : BRASS, 1.5 * u);
    cheeks(p, H, cx, hc, light, ow, old, u);
  } else if (O.cap) hatOn(p, { hat: "cap", cap: O.cap, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false);
  else if (O.hair) hatOn(p, { hat: "hair", hair: O.hair, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false);
  else if (O.helmet && nohelmet) { // bald old head with white side tufts
    for (const s of [-1, 1]) p.ell(cx + s * 0.9 * H.a, hc - 0.1 * H.b, 0.22 * H.a, 0.3 * H.b, "#f4f1ea", 3 * u);
  }
  if (O.beard) {
    const bd = blobPts(cx + 6 * u * facing, hc + 0.85 * H.b, { a: 0.62 * H.a, b: 0.75 * H.b, nTop: 2.4, nBot: 1.6, egg: -0.35, asym: 0, rot: 0, noise: 0.02, seed: seed + 4 });
    p.shadedFill(bd, O.beard, mul(O.beard, [0.86, 0.86, 0.92]), light, 0.6 * H.a, 0.3);
    p.clip(bd, () => { for (let i = -3; i <= 3; i++) p.stroke([[cx + i * 9 * u, hc + 0.45 * H.b], [cx + i * 7 * u, hc + 1.35 * H.b]], 1.2 * u, "#c9c4bb"); });
    p.inkRing(bd, ow * 0.8, thick);
  }
  faceFront(p, cx, hc, W, expr, facing, look, lid, helmet, skin, O.beard ? O.beard : O.moustache, !!O.stout);
  if (O.ikat) { p.band([[cx - 1.0 * H.a, hc - 0.55 * H.b], [cx + 1.0 * H.a, hc - 0.55 * H.b]], "#d8322f", 7 * u, 1.4 * u); p.band([[cx - 1.0 * H.a, hc - 0.42 * H.b], [cx + 1.0 * H.a, hc - 0.42 * H.b]], "#f4f1ea", 6 * u, 1.4 * u); }
  if (opts.medal) { p.stroke([[cx - 14 * u, chin + 4 * u], [cx, chin + 40 * u], [cx + 14 * u, chin + 4 * u]], 3 * u, "#d8322f"); p.ell(cx, chin + 50 * u, 12 * u, 12 * u, "#b8bec6", 2.4 * u); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; p.dot(cx + Math.cos(a) * 12 * u, chin + 50 * u + Math.sin(a) * 12 * u, 2.2 * u, "#8a9098"); } }
  if (O.bun) { p.ell(cx, hc - 1.02 * H.b, 0.42 * H.a, 0.3 * H.b, O.hair, ow * 0.7); if (O.crown) for (let i = -3; i <= 3; i++) p.dot(cx + i * 0.2 * H.a, hc - 0.92 * H.b - Math.cos(i / 3) * 0.12 * H.b, 4.5 * u, "#e2b04a"); }
  if (O.glasses) for (const sd of [-1, 1]) { p.g.save(); p.g.fillStyle = "rgba(220,240,255,.25)"; p.ell(cx + 7 * u * facing + sd * 15 * u, hc - 6 * u, 13 * u, 11 * u, "rgba(220,240,255,.25)", 2.6 * u); p.g.restore();
    if (sd < 0) p.stroke([[cx + 7 * u * facing - 2 * u, hc - 8 * u], [cx + 7 * u * facing + 2 * u, hc - 8 * u]], 2.4 * u); if (opts.glint) p.dot(cx + 7 * u * facing + sd * 15 * u, hc - 6 * u, 9 * u, "#fff6a8"); }
  if (O.peci) { const top = hc - 1.2 * H.b; p.poly(rrect(cx - 0.66 * H.a, top - 0.02 * H.b, cx + 0.66 * H.a, top + 0.5 * H.b, 6 * u), "#101018", ow * 0.6); p.band([[cx - 0.64 * H.a, top + 0.4 * H.b], [cx + 0.64 * H.a, top + 0.4 * H.b]], "#e2b04a", 3 * u, 0); }
  if (O.bedhead) for (let i = 0; i < 7; i++) { const a = rad(-160 + i * 23), x0 = cx + Math.cos(a) * H.a * 0.85, y0 = hc + Math.sin(a) * H.b * 0.88, x1 = cx + Math.cos(a + (i % 2 ? 0.25 : -0.2)) * H.a * 1.28, y1 = hc + Math.sin(a + (i % 2 ? 0.25 : -0.2)) * H.b * 1.3;
    p.poly([[x0 - 9 * u, y0], [x1, y1], [x0 + 9 * u, y0]], O.hair, 2.4 * u); }
  if (O.wet) for (let i = 0; i < 4; i++) p.ell(cx + (i - 1.5) * 26 * u, hc - 0.7 * H.b + (i % 2) * 12 * u, 3.5 * u, 6 * u, "#9fd4ff", 1.6 * u);
  if (O.sweat || opts.sweat) for (const s of [-1, 1]) p.ell(cx + s * 0.95 * H.a, hc - 0.3 * H.b, 4.5 * u, 8 * u, "#9fd4ff", 1.8 * u);
  if (O.brows) for (const s of [-1, 1]) p.ell(cx + 7 * u * facing + s * 14 * u, hc - 20 * u, 11 * u, 5 * u, O.brows, 2 * u);
  if (O.beard) { // re-draw the mouth over the beard for open mouths
    if (expr === "shock" || expr === "snore") p.ell(cx + 8 * u * facing, hc + 22 * u, 6 * u, 7 * u, "#5a1e28", 2 * u);
  }
  p.rot = null;
  { const a = arms.find((x) => x.mic); if (a) { const [hx, hy] = a.pts[2]; p.band([[hx, hy + 8 * u], [hx, hy - 10 * u]], "#2b2f3a", 6 * u, 1.6 * u, "round"); p.ell(hx, hy - 16 * u, 9 * u, 10 * u, "#5d6470", 2.4 * u);
    p.clip(ellPts(hx, hy - 16 * u, 9 * u, 10 * u, 0, 360, 0, 24), () => { for (let i = -2; i <= 2; i++) { p.stroke([[hx + i * 4 * u, hy - 27 * u], [hx + i * 4 * u, hy - 5 * u]], 1 * u, "#2b2f3a"); p.stroke([[hx - 10 * u, hy - 16 * u + i * 4 * u], [hx + 10 * u, hy - 16 * u + i * 4 * u]], 1 * u, "#2b2f3a"); } });
    p.dot(hx, hy + 2 * u, 5.5 * u, armCol); } }
  if (arms.some((a) => a.swirl)) { // cuckoo swirl next to the temple
    const a = arms.find((x) => x.swirl), [hx, hy] = a.pts[2], ph = opts.swirl || 0, pts = [];
    for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 4 + ph, r = (4 + i * 0.7) * u; pts.push([hx + Math.cos(t) * r, hy - 40 * u + Math.sin(t) * r]); }
    p.stroke(pts, 3 * u, "#ffffff"); p.stroke(pts, 1.4 * u, INK);
  }
};

/** loose helmet prop card (lifted off the old soldier) */
export const helmetCard = (p) => {
  const H = headBlob(3, 118, 0), u = 2 * H.a / 100, hc = 560, light = rad(-120), thick = thickAngle(light), ow = 5 * u;
  galea(p, H, 300, hc, light, thick, ow, true, u);
  const bandY = hc - H.b * 0.42, bp = ellPts(300, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
  // dark inside visible from below
  p.ell(300, bandY, H.a * 1.05, 0.12 * H.b, "#2a221e", 0);
  p.shadedFill(bp, "#8f8a7e", mul("#8f8a7e", [0.62, 0.64, 0.72]), light, H.a, 0.4);
  p.clip(bp, () => { for (let i = 0; i < 9; i++) p.ell(300 + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (4 + (i % 3) * 2) * u, (2.5 + (i % 2)) * u, "#8a4b22", 0); });
  p.poly(bp, null, ow * 0.9);
  p.band([[300 - H.a * 1.05, bandY], [300 + H.a * 1.05, bandY]], "#a88a4a", 7 * u, 1.8 * u, "round");
  cheeks(p, H, 300, hc, light, ow, true, u);
};

/** ZZZ for the sleeping guard */
export const fxZ = (p, t) => {
  const g = p.g; g.save(); g.font = "900 120px Arial Black, Arial"; g.lineJoin = "round";
  for (let i = 0; i < 3; i++) {
    const k = (t + i / 3) % 1, x = 220 + i * 70 + Math.sin(k * 6) * 20, y = 700 - k * 500, s = 0.5 + k * 0.7;
    g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = Math.min(1, (1 - k) * 2.5);
    g.lineWidth = 16; g.strokeStyle = INK; g.strokeText("Z", 0, 0); g.fillStyle = "#ffffff"; g.fillText("Z", 0, 0); g.restore();
  }
  g.restore();
};
/** falling leaf */
export const fxLeaf = (p, col) => { p.poly([[300, 380], [420, 470], [300, 620], [180, 470]], col, 14); p.stroke([[300, 400], [300, 600]], 8); };
/** dust cloud puff (k 0..1 growth) */
export const fxDust = (p, k, col = "#e8dcc4") => {
  const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - k * k);
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, r = 90 + 150 * k; p.ell(300 + Math.cos(a) * r, 520 + Math.sin(a) * r * 0.6, 120 + 60 * k, 100 + 50 * k, col, 12); }
  p.ell(300, 520, 170 + 110 * k, 140 + 80 * k, col, 0);
  g.restore();
};
export const fxDrip = (p) => p.ell(300, 500, 40, 64, "#9fd4ff", 10);
export const fxWood = (p, seed) => { p.poly([[200, 420], [400, 400], [420, 560], [230, 600]], "#5b3d22", 14); p.stroke([[240, 450], [380, 440]], 6, "#3a2614"); p.ell(330, 520, 26, 18, "#4d7a32", 0); };

export const headCenter = (seed = 3) => { const H = headBlob(seed, 118, 0), HH = 2 * H.b; return 975 - 1.38 * HH - 1.08 * HH - H.b; };

// ---------------- "Otw" props / fx ----------------
/** chat bubble: text, me=true (green, tail right) or friend (white, tail left) */
export const fxBubble = (p, text, me = false, k = 1) => {
  const g = p.g; g.save();
  const fs = text.length > 16 ? 50 : text.length > 9 ? 62 : 78;
  g.font = `900 ${fs}px "DejaVu Sans", Arial, sans-serif`;
  const lines = []; { const words = text.split(" "); let cur = ""; for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > 470 && cur) { lines.push(cur); cur = w; } else cur = t; } lines.push(cur); }
  const tw = Math.max(...lines.map((l) => g.measureText(l).width)), lh = fs * 1.18, bw = tw + 70, bh = lines.length * lh + 50;
  const cx = 300, cy = 500; g.translate(cx, cy); g.scale(k, k); g.translate(-cx, -cy);
  const x0 = cx - bw / 2, y0 = cy - bh / 2, x1 = cx + bw / 2, y1 = cy + bh / 2;
  const tail = me ? [[x1 - 70, y1 - 4], [x1 - 10, y1 + 50], [x1 - 30, y1 - 4]] : [[x0 + 30, y1 - 4], [x0 + 10, y1 + 50], [x0 + 70, y1 - 4]];
  const col = me ? "#c9f7b0" : "#ffffff";
  p.poly(tail, col, 9); p.poly(rrect(x0, y0, x1, y1, 34), col, 9); p.poly(tail.map(([x, y]) => [x, y - 9]), col, 0);
  g.fillStyle = INK; g.textAlign = "center"; g.textBaseline = "middle";
  lines.forEach((l, i) => g.fillText(l, cx, y0 + 25 + lh * (i + 0.5)));
  g.restore();
};
/** audience member seen from behind (dark silhouette with a warm rim) */
export const fxCrowd = (p, seed = 1, hue = 0) => {
  const r = (n) => (Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1, a = Math.abs;
  const body = ["#2a1f3a", "#33233f", "#2b2440", "#3a2638"][seed % 4];
  const sh = [[120, 1000], [130, 760], [190, 690], [410, 690], [470, 760], [480, 1000]];
  p.poly(sh, body, 0);
  const hr = 95 + a(r(1)) * 25; p.ell(300, 590, hr, hr * 1.08, body, 0);
  if (a(r(2)) > 0.5) p.ell(300, 520, hr * 0.9, hr * 0.6, "#1c1428", 0);
  p.stroke(ellPts(300, 590, hr, hr * 1.08, 200, 330, 0, 20), 9, "#ffb35c88");
  p.stroke([[190, 690], [130, 760]], 9, "#ffb35c66");
};
/** big question mark */
export const fxQ = (p) => { const g = p.g; g.save(); g.font = '900 380px "DejaVu Sans", Arial'; g.textAlign = "center"; g.lineJoin = "round"; g.lineWidth = 26; g.strokeStyle = INK; g.strokeText("?", 300, 640); g.fillStyle = "#ffd84a"; g.fillText("?", 300, 640); g.restore(); };
/** flying sock */
export const fxSock = (p, col = "#f4f1ea") => { p.poly([[250, 300], [330, 300], [335, 560], [430, 600], [430, 680], [250, 670]], col, 14); p.band([[250, 340], [330, 340]], "#3a7bd5", 20, 0); };
/** flying shirt */
export const fxShirt = (p, col = "#4fa36b") => { p.poly([[200, 380], [260, 350], [340, 350], [400, 380], [450, 470], [395, 500], [380, 460], [380, 650], [220, 650], [220, 460], [205, 500], [150, 470]], col, 14); };
/** laugh text burst "HAHA" (sound-effect lettering) */
export const fxHaha = (p, t) => { const g = p.g; g.save(); g.font = '900 120px "DejaVu Sans", Arial'; g.textAlign = "center"; g.lineJoin = "round";
  ["HA", "HA", "HA"].forEach((w, i) => { const k = Math.max(0, Math.min(1, t * 3 - i * 0.5)); if (!k) return; g.save(); g.translate(150 + i * 150, 560 - i * 60 - k * 40); g.rotate((i - 1) * 0.15); g.scale(k, k);
    g.lineWidth = 22; g.strokeStyle = INK; g.strokeText(w, 0, 0); g.fillStyle = "#ffd84a"; g.fillText(w, 0, 0); g.restore(); }); g.restore(); };
/** sweat drops / speed lines for running */
export const fxSpeed = (p) => { for (let i = 0; i < 5; i++) p.band([[100, 300 + i * 90], [500 - (i % 2) * 120, 300 + i * 90]], "#ffffff", 14, 6); };

// ---------------- intro / outro graphics ----------------
const bigText = (g, txt, x, y, size, fill, stroke = INK, lw = 26) => { g.font = `900 ${size}px "DejaVu Sans", Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  g.lineWidth = lw; g.strokeStyle = stroke; g.strokeText(txt, x, y); g.fillStyle = fill; g.fillText(txt, x, y); };
/** show title "MALAM KOMEDI" with a star burst; t = spin phase */
export const fxTitle = (p, t = 0) => {
  const g = p.g; g.save();
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + t; g.fillStyle = i % 2 ? "#ffd84a55" : "#ff5fa244"; g.beginPath(); g.moveTo(300, 500); g.arc(300, 500, 420, a, a + Math.PI / 16); g.closePath(); g.fill(); }
  p.poly(rrect(20, 360, 580, 660, 40), "#241726", 0); p.poly(rrect(34, 374, 566, 646, 32), "#3a2350", 10);
  for (let i = 0; i < 14; i++) { const x = 50 + i * 38.5; p.ell(x, 386, 7, 7, i % 2 ? "#ffd84a" : "#fff3c4", 0); p.ell(x, 634, 7, 7, i % 2 ? "#fff3c4" : "#ffd84a", 0); }
  bigText(g, "MALAM", 300, 455, 118, "#ffd84a", INK, 22);
  bigText(g, "KOMEDI", 300, 565, 112, "#ff5fa2", INK, 22);
  for (const [x, y, r] of [[60, 300, 30], [540, 300, 26], [560, 720, 32], [50, 720, 24]]) { const pts = []; for (let k = 0; k < 10; k++) { const rr = k % 2 ? r * 0.42 : r, b = k * Math.PI / 5 - Math.PI / 2 + t * 0.5; pts.push([x + rr * Math.cos(b), y + rr * Math.sin(b)]); } p.poly(pts, "#ffd84a", 6); }
  g.restore();
};
const thumb = (p, cx, cy, s, col) => { const P = (x, y) => [cx + x * s, cy + y * s];
  p.poly([P(-30, -5), P(-10, -5), P(-10, 40), P(-30, 40)], col, 0);
  p.poly([P(-6, -5), P(8, -40), P(14, -48), P(22, -44), P(20, -12), P(44, -12), P(48, -4), P(42, 40), P(-6, 40)], col, 0); };
export const fxLike = (p, pressed = false) => {
  const bg = pressed ? "#1f5fb8" : "#3a7bd5";
  p.poly(rrect(70, 400, 530, 600, 100), bg, 12); thumb(p, 175, 505, 1.5, "#ffffff");
  bigText(p.g, "LIKE", 365, 503, 92, "#ffffff", INK, 16);
};
export const fxSub = (p, pressed = false) => {
  p.poly(rrect(20, 410, 580, 590, 40), pressed ? "#8a8a8a" : "#e0352b", 12);
  bigText(p.g, pressed ? "SUBSCRIBED" : "SUBSCRIBE", 300, 502, pressed ? 70 : 78, "#ffffff", INK, 14);
};
export const fxBell = (p, swing = 0) => {
  const g = p.g; g.save(); g.translate(300, 380); g.rotate(swing); g.translate(-300, -380);
  p.poly([[300, 380], [372, 420], [390, 560], [430, 610], [170, 610], [210, 560], [228, 420]], "#ffd84a", 12);
  p.ell(300, 380, 22, 22, "#ffd84a", 10); p.ell(300, 636, 34, 26, "#ffd84a", 10);
  p.stroke([[250, 450], [242, 540]], 10, "#fff3c4"); g.restore();
  if (Math.abs(swing) > 0.05) for (const s of [-1, 1]) { p.stroke([[300 + s * 150, 430], [300 + s * 190, 400]], 12); p.stroke([[300 + s * 160, 500], [300 + s * 210, 500]], 12); }
};
export const fxCursor = (p, click = false) => {
  const s = click ? 0.85 : 1, P = (x, y) => [300 + x * s, 420 + y * s];
  p.poly([P(-40, -10), P(-40, -70), P(-20, -70), P(-20, -20), P(0, -30), P(20, -26), P(40, -20), P(52, 10), P(46, 80), P(-20, 80), P(-56, 20)], "#ffffff", 10);
  if (click) for (let i = 0; i < 5; i++) { const a = -Math.PI * (0.15 + i * 0.17); p.stroke([[300 - 30 + Math.cos(a) * 110, 350 + Math.sin(a) * 110], [300 - 30 + Math.cos(a) * 150, 350 + Math.sin(a) * 150]], 12, "#ffd84a"); }
};

// ---------------- "Kondangan" fx ----------------
export const fxRadar = (p, t) => { const g = p.g; g.save();
  p.ell(300, 500, 230, 230, "rgba(40,180,90,.25)", 10); p.ell(300, 500, 150, 150, null, 4); p.ell(300, 500, 70, 70, null, 4);
  g.strokeStyle = "#7dff9a"; g.lineWidth = 6; for (const r of [70, 150, 230]) { g.beginPath(); g.arc(300, 500, r, 0, 7); g.stroke(); }
  const a = t * Math.PI * 2; g.fillStyle = "rgba(125,255,154,.45)"; g.beginPath(); g.moveTo(300, 500); g.arc(300, 500, 230, a - 0.7, a); g.closePath(); g.fill();
  g.strokeStyle = "#d9ffe0"; g.lineWidth = 8; g.beginPath(); g.moveTo(300, 500); g.lineTo(300 + Math.cos(a) * 230, 500 + Math.sin(a) * 230); g.stroke();
  p.dot(300 + Math.cos(2.2) * 120, 500 + Math.sin(2.2) * 120, 16, "#ff5f5f"); g.restore(); };
export const fxCalendar = (p, year) => { p.poly(rrect(130, 280, 470, 720, 30), "#ffffff", 12); p.poly(rrect(130, 280, 470, 400, 30), "#d8453b", 0); p.poly([[130, 380], [470, 380], [470, 400], [130, 400]], "#d8453b", 0);
  for (const x of [200, 400]) p.poly(rrect(x - 12, 250, x + 12, 320, 10), "#5d6470", 6);
  const g = p.g; g.save(); g.font = '900 64px "DejaVu Sans", Arial'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffffff"; g.fillText("KONDANGAN", 300, 345 - 5 + 0, 320);
  g.font = '900 150px "DejaVu Sans", Arial'; g.fillStyle = INK; g.fillText(String(year), 300, 560); g.restore(); p.poly(rrect(130, 280, 470, 720, 30), null, 12); };
export const fxPlate = (p, full = 1) => { p.ell(300, 600, 200, 60, "#ffffff", 10); p.ell(300, 590, 150, 40, "#f1ece2", 0);
  for (let i = 0; i < Math.round(9 * full); i++) p.ell(230 + (i % 4) * 45 + (i > 3 ? 20 : 0), 575 - Math.floor(i / 4) * 32, 34, 24, i % 3 ? "#6b3a1f" : "#8a4b22", 6); };
export const fxConfetti = (p, t, seed = 1) => { for (let i = 0; i < 26; i++) { const x = (Math.sin(i * 12.9 + seed) * 0.5 + 0.5) * 560 + 20, y = ((i * 37 + t * 900) % 900) + 50;
  p.g.save(); p.g.translate(x, y); p.g.rotate(i + t * 8); p.poly([[-14, -7], [14, -7], [14, 7], [-14, 7]], ["#ffd84a", "#ff5fa2", "#7dd3ff", "#8be08b"][i % 4], 3); p.g.restore(); } };
export const fxGlow = (p) => { for (const s of [-1, 1]) { p.ell(300 + s * 70, 500, 60, 40, "rgba(255,40,40,.45)", 0); p.ell(300 + s * 70, 500, 24, 16, "#ff3b3b", 0); } };
export const fxHeart = (p) => { p.poly([[300, 640], [160, 500], [170, 410], [240, 380], [300, 430], [360, 380], [430, 410], [440, 500]], "#ff5f8a", 12); };
