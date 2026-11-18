// "Keluarga Asep Joget" -- tiru koreografi tren (barisan kereta -> nunjuk -> jalan maju -> tangan ke atas -> bungkuk).
// Asep (asepJoget), pacar Neng (nengJoget), Pak Darman (darmanJoget, telat sedikit), Ibu (ibuJoget). Tanpa dialog, musik asli.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
export const TOTAL = 769;
const BP = 11.54, PH = 2; // beat period (frames) and phase
const SH = [['wide', 0, 179], ['darmanCU', 180, 226], ['wide', 227, 329], ['walk', 330, 479], ['mid', 480, 629], ['low', 630, 689], ['end', 690, 711], ['encok', 712, 768]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'hall' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = { hall: { az: 70, el: 55, sky: '#e8f2ff', ground: '#9aa4ae', hemi: 1.3, sun: '#fff4e0', sunI: 2.3, fog: '#dfe8f2', fogNear: 40, fogFar: 200, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.08, vig: 0.26, shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const CX = 567.5, Y = 0.5, Z0 = 0.0;
const SLOT = [-0.8, -0.27, 0.27, 0.8]; // Asep, Neng, Darman, Ibu (kiri -> kanan)
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([CX, 1.85, 5.9], [CX, 1.95, 0], 45) }, { f: 329, ...K([CX, 1.85, 5.5], [CX, 1.97, 0], 45) }],
  walk: [{ f: 0, ...K([CX, 1.85, 5.6], [CX, 1.95, 0], 45) }, { f: 149, ...K([CX, 1.9, 6.9], [CX, 2.0, 1.2], 45) }],
  mid: [{ f: 0, ...K([CX, 1.95, 7.1], [CX, 2.02, 1.2], 43) }, { f: 209, ...K([CX, 1.95, 6.8], [CX, 2.04, 1.2], 43) }],
  darmanCU: [{ f: 0, ...K([CX + 0.35, 2.0, 3.7], [CX + 0.15, 2.1, 0], 42) }, { f: 46, ...K([CX + 0.3, 2.0, 3.4], [CX + 0.12, 2.12, 0], 42) }],
  low: [{ f: 0, ...K([CX, 1.0, 5.6], [CX, 2.3, 1.2], 50) }, { f: 59, ...K([CX, 1.05, 5.2], [CX, 2.35, 1.2], 50) }],
  encok: [{ f: 0, ...K([CX + 0.75, 1.95, 4.9], [CX + 0.5, 2.0, 1.2], 40) }, { f: 56, ...K([CX + 0.7, 1.95, 4.5], [CX + 0.5, 2.02, 1.2], 40) }],
  end: [{ f: 0, ...K([CX + 0.1, 1.75, 6.9], [CX + 0.05, 1.85, 1.2], 43) }, { f: 78, ...K([CX + 0.15, 1.75, 6.5], [CX + 0.1, 1.86, 1.2], 43) }],
};
const KICKS = [{ f: 105, a: 0.05 }, { f: 140, a: 0.05 }, { f: 330, a: 0.04 }, { f: 480, a: 0.04 }, { f: 570, a: 0.04 }, { f: 630, a: 0.05 }, { f: 690, a: 0.06 }, { f: 712, a: 0.06 }];
for (let f = 2; f < 690; f += 23.08) KICKS.push({ f: Math.round(f), a: 0.018 }); // denyut kamera tiap 2 ketukan
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: ['darmanCU', 'encok'].includes(shotAt(f).id) ? 8 : shotAt(f).id === 'wide' ? 3 : 5 }; };
export const worldAt = () => ({ curtain: 0, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const S_ = Math.sin, C_ = Math.cos, TAU = Math.PI * 2;
// arm: [elbowX, elbowY, handX, handY, front?, finger?]  (X outward in body units, Y in head-heights from shoulder; negative X = across body)
const A = {
  train: [24, 0.32, 46, 0.42], up: [8, -0.35, 14, -0.85], point: [12, -0.2, 18, -0.72, 0, 'f'],
  head: [26, -0.2, -2, -0.62], cross: [-2, 0.3, -38, 0.18, 1], swingOut: [14, 0.42, 30, 0.7], shoulder: [18, 0.32, 8, 0.02],
  side: (w) => [30, -0.02 + 0.12 * w, 60, -0.05 - 0.18 * w], wave: (w) => [10, -0.38, 18 + 10 * w, -0.88], neigh: [30, 0.05, 58, 0.04],
};
const pose = (f, k, late) => {
  const t = (f - PH - late) / BP, b = 0.5 - 0.5 * C_(TAU * t), alt = Math.floor(t) % 2 ? 1 : -1, sw = S_(Math.PI * t);
  const o = { L: 'hang', R: 'hang', expr: 'grin', facing: 0, look: 0, bob: 0, tilt: 0, headTilt: 0, dx: 0, dz: 0 };
  if (f < 105 || (f >= 140 && f < 180)) { // kereta: hadap kanan, condong, tangan ke pinggang depan
    const deep = f >= 140 ? 1.6 : 1;
    Object.assign(o, { facing: 1, look: 1, L: A.train, R: A.train, tilt: q(-(6 + 6 * b) * deep, 1), bob: q(-0.02 * b, 3), headTilt: q(4 * sw, 1), dx: k * -0.05, expr: k === 2 ? 'squint' : 'grin' });
    if (k === 0) { o.L = 'hang'; o.R = A.up; }
  } else if (f < 140) { // balik badan, pose
    Object.assign(o, { L: 'hip', R: k % 2 ? A.point : 'thumb', headTilt: q(8 * sw, 1), bob: q(0.012 * b, 3), expr: 'smile_closed' });
  } else if (f < 270) { // nunjuk ke atas + goyang pinggul
    Object.assign(o, { L: 'hip', R: alt > 0 ? A.point : [12, -0.1, 22, -0.5, 0, 'f'], tilt: q(5 * sw, 1), dx: 0.12 * sw, bob: q(0.015 * b, 3), headTilt: q(-6 * sw, 1), look: alt, expr: 'grin' });
  } else if (f < 330) { // tangan di kepala + pinggang
    Object.assign(o, { L: 'hip', R: A.head, tilt: q(-4 + 4 * sw, 1), bob: q(0.012 * b, 3), headTilt: 10, expr: 'smile_closed', look: -1 });
  } else if (f < 480) { // jalan maju, tangan menyilang dada bergantian
    const ft = ramp(f, 330, 470);
    Object.assign(o, { L: alt > 0 ? A.cross : A.swingOut, R: alt > 0 ? A.swingOut : A.cross, step: q(t / 2 % 1, 2), dz: q(1.2 * ft, 3), tilt: q(4 * alt, 1), bob: q(0.01 * b, 3), headTilt: q(5 * alt, 1), expr: 'grin' });
  } else if (f < 550) { // tangan dekat bahu, goyang
    Object.assign(o, { L: A.shoulder, R: A.shoulder, dz: 1.2, dx: 0.12 * sw, tilt: q(6 * sw, 1), bob: q(0.015 * b, 3), headTilt: q(-8 * sw, 1), expr: 'grin' });
  } else if (f < 570) { // rangkul
    Object.assign(o, { L: k > 0 ? A.neigh : 'hang', R: k < 3 ? A.neigh : 'hang', dz: 1.2, bob: q(0.015 * b, 3), headTilt: q(6 * sw, 1), expr: 'smile_closed' });
  } else if (f < 630) { // tangan ke samping, ombak
    const w1 = S_(TAU * t / 2), w2 = S_(TAU * t / 2 + 1.6);
    Object.assign(o, { L: A.side(w1), R: A.side(w2), dz: 1.2, tilt: q(5 * w1, 1), bob: q(0.012 * b, 3), headTilt: q(5 * w2, 1), expr: 'grin' });
  } else if (f < 690) { // dua tangan ke atas
    Object.assign(o, { L: A.wave(S_(TAU * t / 2)), R: A.wave(S_(TAU * t / 2 + Math.PI)), dz: 1.2, bob: q(0.02 * b, 3), tilt: q(4 * sw, 1), expr: 'grin' });
  } else { // bungkuk, tangan di kepala
    const d = ramp(f, 690, 712);
    Object.assign(o, { L: A.head, R: A.head, dz: 1.2, bob: q(-0.06 * M.smooth(d), 3), tilt: q(10 * S_(Math.PI * t / 2), 1), headTilt: q(10 * S_(Math.PI * t), 1), expr: 'grin' });
  }
  return o;
};
const WHO = ['asepJoget', 'nengJoget', 'darmanJoget', 'ibuJoget'];
export const actorsAt = (f, T) => {
  const out = [];
  WHO.forEach((who, k) => {
    const late = k === 2 && f < 690 ? 4 : 0; // Pak Darman selalu telat sedikit
    const { dx, dz, ...o } = pose(f, k, late);
    if (f >= 712 && k === 2) Object.assign(o, { L: 'hip', R: 'temple', tilt: 14, bob: -0.07, headTilt: -10, expr: 'shock', blink: 0 }); // encok
    if (f >= 724 && k === 3) Object.assign(o, { L: 'hip', R: A.wave(S_(f * 0.9)), tilt: -6, bob: -0.02, headTilt: 6, expr: 'squint' });
    if (f >= 724 && k === 0) Object.assign(o, { L: 'hang', R: 'thumb', bob: -0.03, tilt: 0, expr: 'grin', facing: 1, look: 1 });
    if (f >= 724 && k === 1) Object.assign(o, { L: 'cheek', R: 'cheek', bob: -0.03, tilt: 0, expr: 'smile_closed', facing: -1, look: -1 });
    if (f < 690) { // HEBOH: miring 2x, lompat tiap ketukan, kaki menghentak, kepala nengok
      const t = (f - PH - late) / BP, hop = Math.abs(Math.sin(Math.PI * t)), beat = Math.floor(t);
      const train = f < 105 || (f >= 140 && f < 180);
      o.tilt = q((o.tilt || 0) * 2.1, 1); o.headTilt = q((o.headTilt || 0) * 1.8, 1);
      o.bob = q((o.bob || 0) * 1.5 + (train ? -0.035 * (1 - hop) : 0.045 * hop * (f >= 630 ? 1.6 : 1)), 3);
      if (o.step === undefined) o.step = q((t / 2) % 1, 2);
      if (!train && f >= 180 && f < 330) { o.facing = beat % 2 ? 1 : -1; o.look = o.facing; }
      if (f >= 180 && f < 330 && k === 2) o.expr = 'squint';
    }
    const i = idle(f, k * 3 + 1);
    const pos = [CX + SLOT[k] + (dx || 0), Y, Z0 + (dz || 0) + (k % 2 ? -0.08 : 0)];
    out.push(R(T, who, { seed: k * 3 + 2, blink: o.blink ?? blinkAt(f, k * 3 + 2), ...o, sweat: f >= 712 && k === 2 ? 1 : 0,
      bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt * 0.4, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 }));
  });
  return out;
};
export const fxAt = () => [];
export const overlayAt = null;
