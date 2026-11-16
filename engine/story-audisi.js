// "Audisi Stand Up Paling Absurd" — Speko: Charon (juri), Fenrir (peserta). 72 s, stage x=0 + juri table.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['J', 6, 77], ['P', 86, 245], ['J', 256, 307], ['P', 317, 577], ['J', 587, 607], ['P', 617, 753], ['J', 789, 827], ['P', 837, 1058], ['J', 1069, 1114], ['P', 1123, 1248], ['J', 1258, 1349], ['P', 1359, 1459], ['J', 1484, 1668], ['P', 1681, 1753], ['J', 1762, 1814], ['P', 1823, 1854], ['J', 1863, 1949], ['P', 1958, 2111]];
const speaker = (f) => { const l = LINES.find(([, a, b]) => f >= a - 2 && f <= b + 2); return l ? l[0] : null; };
const talk = (f, who, expr) => { if (speaker(f) !== who) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 2190;
export const SHOTS = [
  { id: 'wide', a: 0, b: 85 }, { id: 'pes', a: 86, b: 255 }, { id: 'jur', a: 256, b: 316 }, { id: 'pes2', a: 317, b: 586 },
  { id: 'jur', a: 587, b: 616 }, { id: 'wide2', a: 617, b: 788 }, { id: 'jur', a: 789, b: 836 }, { id: 'pes2', a: 837, b: 1068 },
  { id: 'jur', a: 1069, b: 1122 }, { id: 'pes', a: 1123, b: 1257 }, { id: 'jur', a: 1258, b: 1358 }, { id: 'wide2', a: 1359, b: 1483 },
  { id: 'jur', a: 1484, b: 1680 }, { id: 'wide2', a: 1681, b: 1761 }, { id: 'jur', a: 1762, b: 1822 }, { id: 'pes', a: 1823, b: 1862 },
  { id: 'jur', a: 1863, b: 1957 }, { id: 'end', a: 1958, b: 2189 },
].map((s) => ({ ...s, light: 'stage' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { stage: { az: 95, el: 52, sky: '#7a6a8a', ground: '#2a1a24', hemi: 0.75, sun: '#fff0dc', sunI: 3.2, fog: '#160c1a', fogNear: 14, fogFar: 60,
  skyTop: '#0c0814', skyHor: '#1a1020', sat: 1.15, vig: 0.4, shadowExt: 7 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
export const RX = -40, SX = 80;
const PES = [0, 0.5, 0], JURI = [2.6, 0, 2.15];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([1.55, 2.4, 8.8], [1.55, 1.6, 1.0], 46) }, { f: 85, ...K([1.55, 2.4, 8.4], [1.55, 1.6, 1.0], 46) }],
  pes: [{ f: 0, ...K([0, 2.15, 3.0], [0, 2.05, 0], 40) }, { f: 400, ...K([0, 2.15, 2.6], [0, 2.08, 0], 40) }],
  pes2: [{ f: 0, ...K([0, 2.1, 3.9], [0, 1.95, 0], 42) }, { f: 400, ...K([0, 2.1, 3.5], [0, 1.97, 0], 42) }],
  jur: [{ f: 0, ...K([2.3, 1.75, 5.0], [2.6, 1.6, 2.15], 40) }, { f: 400, ...K([2.35, 1.72, 4.6], [2.6, 1.62, 2.15], 40) }],
  wide2: [{ f: 0, ...K([1.55, 2.35, 8.4], [1.55, 1.6, 1.0], 46) }, { f: 400, ...K([1.55, 2.35, 7.9], [1.55, 1.6, 1.0], 46) }],
  end: [{ f: 0, ...K([1.55, 2.35, 8.0], [1.55, 1.6, 1.0], 46) }, { f: 232, ...K([1.55, 2.5, 9.0], [1.55, 1.65, 1.0], 47) }],
};
const KICKS = [{ f: 640, a: 0.02 }, { f: 1150, a: 0.02 }, { f: 1560, a: 0.03 }, { f: 1790, a: 0.03 }, { f: 1958, a: 0.025 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 3 && S.a > 0 ? 0.25 * (1 - (f - S.a) / 3) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
export const worldAt = () => ({ curtain: 1 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const pesPose = (f) => {
  if (f < 86) return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1 };
  if (f < 256) return { L: 'belly', R: 'cheek', expr: 'laugh', shake: 1 };
  if (f < 317) return { L: 'hang', R: 'hang', expr: 'grin', facing: 1, look: 1 };
  if (f < 617) return { L: 'hang', R: 'shrug', expr: f % 120 < 60 ? 'laugh' : 'grin', shake: 1 };
  if (f < 789) return { L: 'shrug', R: 'shrug', expr: 'laugh', shake: f > 680 ? 1 : 0, facing: 1, look: 1 };
  if (f < 837) return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1 };
  if (f < 1069) return { L: 'hang', R: 'temple', expr: f > 950 ? 'laugh' : 'grin', shake: f > 950 ? 1 : 0 };
  if (f < 1123) return { L: 'hang', R: 'hang', expr: 'nervous' };
  if (f < 1359) return { L: 'hang', R: 'point', expr: 'smile', facing: 1, look: 1 };
  if (f < 1484) return { L: 'belly', R: 'thumb', expr: 'laugh', facing: 1, look: 1, shake: 1 };
  if (f < 1681) return { L: 'hang', R: 'point', expr: 'grin', facing: 1, look: 1 };
  if (f < 1762) return { L: 'up', R: 'up', expr: 'grin', facing: 1, look: 1 };
  if (f < 1823) return { L: 'hang', R: 'hang', expr: 'shock', facing: 1, look: 1, blink: 0 };
  if (f < 1863) return { L: 'hang', R: 'hang', expr: 'nervous', headTilt: -8 };
  if (f < 1958) return { L: 'hang', R: 'hang', expr: 'shock', facing: 1, look: 1, blink: 0 };
  return { L: 'up', R: 'up', expr: 'laugh', shake: 1, jump: 1 };
};
const jurPose = (f) => {
  if (f < 256) return { L: 'hip', R: 'hang', expr: 'stubborn' };
  if (f < 617) return { L: 'cross', R: 'cross', expr: 'squint', facing: -1, look: -1 };
  if (f < 837) return { L: 'cross', R: 'cross', expr: 'stubborn', facing: -1, look: -1 };
  if (f < 1123) return { L: 'hip', R: 'point', expr: 'stubborn', facing: -1, look: -1 };
  if (f < 1359) return { L: 'hang', R: 'point', expr: 'shock', facing: -1, look: -1 };
  if (f < 1484) return { L: 'cross', R: 'cross', expr: 'squint', facing: -1, look: -1 };
  if (f < 1540) return { L: 'hang', R: 'cheek', expr: 'smile_closed', facing: -1, look: -1 };
  if (f < 1762) return { L: 'belly', R: 'cheek', expr: 'laugh', shake: 1 };
  if (f < 1863) return { L: 'cross', R: 'cross', expr: 'stubborn', facing: -1, look: -1 };
  if (f < 1958) return { L: 'hang', R: 'thumb', expr: 'smile', facing: -1, look: -1 };
  return { L: 'belly', R: 'hang', expr: 'laugh', facing: -1, look: -1 };
};
export const actorsAt = (f, T) => {
  const out = [], i = idle(f, 5), j = idle(f, 2);
  { const { shake, jump, ...o } = pesPose(f);
    const tilt = shake ? sway(f, 6, 0.55) : 0, hop = jump ? Math.abs(Math.sin(f * 0.22)) * 0.12 : 0;
    out.push(R(T, 'rapi', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, expr: talk(f, 'P', o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q(i.headTilt + (o.headTilt || 0), 1) }, [PES[0], q(PES[1] + hop, 3), PES[2]], { ground: 0.5 })); }
  { const { shake, ...o } = jurPose(f), tilt = shake ? sway(f, 5, 0.6) : 0;
    out.push(R(T, 'batik', { seed: 2, blink: o.blink ?? blinkAt(f, 2), ...o, expr: talk(f, 'J', o.expr), bob: q(j.bob, 3), tilt: q(j.tilt + tilt, 1), headTilt: q(j.headTilt, 1) }, JURI, { ground: 0 })); }
  return out;
};

const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 8) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 6) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const scaled = (k, fn) => (pp) => { pp.g.translate(300, 500); pp.g.scale(k, k); pp.g.translate(-300, -500); fn(pp); };
const at = (x, yc, z, s) => [x, yc - 1.07 * s, z];
const camRel = (f, dy, d, s, dx = 0) => { const C = camAt(f), v = [C.look[0] - C.pos[0], C.look[1] - C.pos[1], C.look[2] - C.pos[2]], L = Math.hypot(...v);
  return at(C.pos[0] + v[0] / L * d + dx, C.pos[1] + v[1] / L * d + dy, C.pos[2] + v[2] / L * d, s); };
export const fxAt = (f, T) => {
  const out = [];
  const card = (key, a, b_, draw, posf, s = 0.3, roll = 0, order = 9) => { if (f < a || f >= b_) return; const k = q(Math.min(pop(f, a), out_(f, b_)), 2); if (k > 0.01) out.push(FXC(key + k, scaled(k, draw), posf(f), s, { roll, order })); };
  const top = (dy = 0.3) => (f_) => camRel(f_, dy, 1.1, 0.22);
  const shout = (key, a, b_, text, col, size, dy = 0.3) => card(key, a, b_, (p) => T.fxShout(p, text, col, size), top(dy), 0.22, -0.04);
  if (f < 85) { const k = q((f < 1 ? 1 : 1 + 0.03 * Math.sin(f * 0.5)) * out_(f, 85), 2); out.push(FXC('hook' + k, scaled(k, (p) => T.fxHook(p, 'AUDISI STAND UP', 'PALING ABSURD!')), camRel(f, 0.24, 1.1, 0.3), 0.3, { order: 10 })); }
  card('joko', 100, 240, (p) => T.fxNoteCard(p, 'PESERTA #47'), top(0.32), 0.22, -0.03);
  card('q', 380, 586, (p) => T.fxQ(p), (f_) => camRel(f_, 0.3, 1.1, 0.15, 0.08), 0.15, sway(f, 0.3, 0.1));
  shout('nggaktau', 640, 788, 'SAYA JUGA NGGAK TAU!', '#ffd84a', 46);
  card('miskin', 870, 1068, (p) => T.fxNoteCard(p, 'MISKIN BANGET'), top(0.32), 0.22, 0.03);
  card('utang', 1160, 1358, (p) => T.fxNoteCard(p, 'UTANG 50 RIBU', '#ffe0e0'), top(0.32), 0.22, -0.05);
  shout('bayar', 1380, 1483, 'BAYAR PAKE KETAWA!', '#7fd0a0', 48);
  shout('nggaklucu', 1560, 1680, 'NGGAK LUCU! HAHAHA', '#ff8ac8', 42);
  card('tdk', 1790, 1862, (p) => T.fxStampC(p, 'TIDAK', 'LOLOS', '#c0302c'), top(0.3), 0.22);
  card('lunas', 1900, 2189, (p) => T.fxStampC(p, 'UTANG', 'LUNAS ✔'), top(0.3), 0.22);
  for (const a of [700, 1400, 1600, 1990, 2080]) if (f >= a && f < a + 40) { const t = q(ramp(f, a, a + 18), 2); out.push(FXC('haha' + a + t, (p) => T.fxHaha(p, t), camRel(f, -0.02, 1.1, 0.16, 0.06), 0.16, { order: 9 })); }
  return out;
};
