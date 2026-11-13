// "Kena Prank Bule Bandung" — 2 voices (Speko: Puck cowok, Aoede bule), 69.4 s, no intro, new set: pantai sore (x=200). 2110 frames.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
// [speaker, start, end]  N = narasi cowok, C = cowok, W = bule
const LINES = [['N', 7, 286], ['C', 307, 495], ['W', 507, 607], ['C', 619, 806], ['W', 818, 960], ['C', 972, 1124], ['W', 1137, 1198], ['C', 1209, 1270], ['W', 1285, 1401], ['C', 1414, 1549], ['W', 1564, 1735], ['C', 1747, 1831], ['W', 1849, 2083]];
const speaker = (f) => { const l = LINES.find(([, a, b]) => f >= a - 2 && f <= b + 2); return l ? (l[0] === 'N' ? 'C' : l[0]) : null; };
const talk = (f, who, expr) => { if (speaker(f) !== who) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 2110;
export const SHOTS = [
  { id: 'narasi', a: 0, b: 306, light: 'pantai' },
  { id: 'dialog', a: 307, b: 1284, light: 'pantai' },
  { id: 'mouth', a: 1285, b: 1413, light: 'pantai' },
  { id: 'dialog2', a: 1414, b: 1563, light: 'pantai' },
  { id: 'twist', a: 1564, b: 1746, light: 'pantai' },
  { id: 'kaget', a: 1747, b: 1848, light: 'pantai' },
  { id: 'end', a: 1849, b: 2109, light: 'pantai' },
];
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { pantai: { az: 110, el: 28, sky: '#ffd8b0', ground: '#7a5a3a', hemi: 0.9, sun: '#ffc080', sunI: 3.0, fog: '#ffc8a0', fogNear: 30, fogFar: 160,
  skyTop: '#6a8ad0', skyHor: '#ffb880', sat: 1.15, vig: 0.36, shadowExt: 8 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
export const RX = -40, SX = 80;
const BX = 200, b = (x, y, z) => [BX + x, y, z];
const BOY = b(-0.5, 0.5, 0.1), GIRL = b(0.5, 0.5, 0.15);
const CAMS = {
  narasi: [{ f: 0, pos: b(-0.45, 2.1, 3.2), look: b(-0.45, 2.0, 0), fov: 40 }, { f: 120, pos: b(-0.3, 2.15, 3.8), look: b(-0.3, 2.0, 0), fov: 40 }, { f: 306, pos: b(0.0, 2.2, 4.6), look: b(0.0, 2.1, 0), fov: 43 }],
  dialog: [{ f: 307, pos: b(0.0, 2.2, 4.6), look: b(0.0, 2.1, 0), fov: 43 }, { f: 1284, pos: b(0.0, 2.15, 4.0), look: b(0.0, 2.05, 0), fov: 42 }],
  mouth: [{ f: 1285, pos: b(0.5, 2.15, 2.5), look: b(0.5, 2.1, 0), fov: 38 }, { f: 1413, pos: b(0.5, 2.15, 2.2), look: b(0.5, 2.12, 0), fov: 38 }],
  dialog2: [{ f: 1414, pos: b(0.0, 2.2, 4.4), look: b(0.0, 2.1, 0), fov: 43 }, { f: 1563, pos: b(0.0, 2.2, 4.1), look: b(0.0, 2.08, 0), fov: 42 }],
  twist: [{ f: 1564, pos: b(0, 2.2, 4.5), look: b(0, 2.1, 0), fov: 44 }, { f: 1746, pos: b(0, 2.18, 4.2), look: b(0, 2.1, 0), fov: 43 }],
  kaget: [{ f: 1747, pos: b(-0.5, 2.15, 2.5), look: b(-0.5, 2.1, 0), fov: 38 }, { f: 1848, pos: b(-0.5, 2.15, 2.3), look: b(-0.5, 2.12, 0), fov: 38 }],
  end: [{ f: 1849, pos: b(0.0, 2.2, 4.2), look: b(0.0, 2.1, 0), fov: 42 }, { f: 2109, pos: b(0.0, 2.3, 5.0), look: b(0.0, 2.1, 0), fov: 44 }],
};
const KICKS = [{ f: 140, a: 0.015 }, { f: 1010, a: 0.02 }, { f: 1230, a: 0.025 }, { f: 1285, a: 0.03 }, { f: 1600, a: 0.035 }, { f: 1747, a: 0.03 }, { f: 1860, a: 0.02 }];
const FLASH = [[307, 3, 0.3], [1285, 4, 0.5], [1414, 3, 0.3], [1564, 5, 0.6], [1747, 3, 0.4], [1849, 3, 0.3]];
export const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { kicks: KICKS, creep: 0.0006 });
  c.flash = 0; for (const [a, n, k] of FLASH) if (f >= a && f < a + n) c.flash = k * (1 - (f - a) / n); return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, [BX, 1.95, 0]), cinf: 3 }; };
export const worldAt = () => ({ curtain: 1 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const boyPose = (f) => {
  if (f < 140) return { L: 'hang', R: 'shrug', expr: 'smile_closed', headTilt: -4 };
  if (f < 307) return { L: 'hang', R: 'point', facing: 1, look: 1, expr: 'grin' };
  if (f < 507) return { L: 'hip', R: 'wave', wv: q((f * 0.3) % 6.283, 1), facing: 1, look: 1, expr: 'smile_closed' };
  if (f < 619) return { L: 'hang', R: 'hang', facing: 1, look: 1, expr: 'nervous' };
  if (f < 818) return { L: 'hang', R: 'temple', facing: 1, look: 1, expr: 'squint' };
  if (f < 972) return { L: 'hang', R: 'temple', facing: 1, look: 1, expr: 'nervous' };
  if (f < 1137) return { L: 'hip', R: 'thumb', facing: 1, look: 1, expr: 'grin' };
  if (f < 1209) return { L: 'hang', R: 'hang', facing: 1, look: 1, expr: 'nervous' };
  if (f < 1285) return { L: 'up', R: 'up', facing: 1, look: 1, expr: 'laugh' };
  if (f < 1414) return { L: 'hang', R: 'hang', facing: 1, look: 1, expr: 'shock', blink: 0 };
  if (f < 1564) return { L: 'hang', R: 'point', facing: 1, look: 1, expr: 'smile' };
  if (f < 1747) return { L: 'hang', R: 'hang', facing: 1, look: 1, expr: 'shock', blink: 0 };
  if (f < 1849) return { L: 'up', R: 'temple', expr: 'shock', blink: 0 };
  return { L: 'hang', R: 'cheek', facing: 1, look: 1, expr: 'nervous', headTilt: -5 };
};
const girlPose = (f) => {
  if (f < 507) return { L: 'hang', R: 'wave', wv: q((f * 0.2) % 6.283, 1), facing: -1, look: -1, expr: 'smile' };
  if (f < 818) return { L: 'hang', R: 'shrug', facing: -1, look: -1, expr: 'smile' };
  if (f < 1137) return { L: 'hip', R: 'hang', facing: -1, look: -1, expr: 'squint' };
  if (f < 1285) return { L: 'hip', R: 'hip', facing: -1, look: -1, expr: 'stubborn' };
  if (f < 1414) return { L: 'hip', R: 'point', facing: -1, look: -1, expr: 'shock' };
  if (f < 1564) return { L: 'hip', R: 'hip', facing: -1, look: -1, expr: 'stubborn' };
  if (f < 1849) return { L: 'hip', R: 'point', facing: -1, look: -1, expr: 'laugh' };
  return { L: 'cheek', R: 'point', facing: -1, look: -1, expr: 'laugh', shake: 1 };
};
export const actorsAt = (f, T) => {
  const out = [], i = idle(f, 5), o = boyPose(f);
  out.push(R(T, f >= 1564 && f < 1849 ? 'santaiSweat' : 'santai', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, expr: talk(f, 'C', o.expr), bob: q(i.bob, 3), tilt: q(i.tilt, 1), headTilt: q(i.headTilt + (o.headTilt || 0), 1) }, BOY, { ground: 0.5 }));
  if (f >= 130) {
    const g = girlPose(f), j = idle(f, 2), enter = smooth(ramp(f, 130, 160)), { shake, ...gp } = g;
    const gx = GIRL[0] + (1 - enter) * 1.6, tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, 'bule', { seed: 2, blink: blinkAt(f, 2), ...gp, expr: talk(f, 'W', g.expr), bob: q(j.bob + (shake ? Math.abs(Math.sin(f * 0.5)) * 0.01 : 0), 3), tilt: q(j.tilt + tilt, 1), headTilt: q(j.headTilt, 1) }, [q(gx, 3), 0.5, GIRL[2]], { ground: 0.5 }));
  }
  return out;
};

const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 8) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 6) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const scaled = (k, fn) => (pp) => { pp.g.translate(300, 500); pp.g.scale(k, k); pp.g.translate(-300, -500); fn(pp); };
const at = (x, yc, z, s) => [x, yc - 1.07 * s, z];
const camRel = (f, dy, d, s) => { const C = camAt(f), v = [C.look[0] - C.pos[0], C.look[1] - C.pos[1], C.look[2] - C.pos[2]], L = Math.hypot(...v);
  return at(C.pos[0] + v[0] / L * d, C.pos[1] + v[1] / L * d + dy, C.pos[2] + v[2] / L * d, s); };
const TOP = (x = 0, y = 2.95) => at(BX + x, y, 0.8, 0.5);
export const fxAt = (f, T) => {
  const out = [];
  const card = (key, a, b_, draw, pos, s = 0.6, roll = 0, order = 8) => { if (f < a || f >= b_) return; const k = q(Math.min(pop(f, a), out_(f, b_)), 2); if (k > 0.01) out.push(FXC(key + k, scaled(k, draw), pos, s, { roll, order })); };
  const shout = (key, a, b_, text, col, size, pos = TOP(), s = 0.5, roll = -0.04) => card(key, a, b_, (p) => T.fxShout(p, text, col, size), pos, s, roll, 9);
  if (f < 95) { const k = q((f < 1 ? 1 : 1 + 0.03 * Math.sin(f * 0.5)) * out_(f, 95), 2); out.push(FXC('hook' + k, scaled(k, (p) => T.fxHook(p, 'KENA PRANK', 'BULE BANDUNG?!')), camRel(f, 0.2, 1.1, 0.3), 0.3, { order: 10 })); }
  card('suatu', 98, 160, (p) => T.fxNoteCard(p, 'SUATU HARI...'), TOP(-0.05, 2.95), 0.55);
  if (f >= 130 && f < 200) { const t = q(f / 30, 2); out.push(FXC('spk' + t, (p) => T.fxSparkle(p, t), at(BX + 0.5, 2.1, 0.4, 0.5), 0.5, { order: 8 })); }
  shout('cantik', 165, 240, 'CANTIK BANGET!', '#ff8ac8', 64, camRel(f, 0.3, 1.1, 0.3), 0.3);
  shout('sehat', 430, 500, 'SEHAT WALAFIAT!', '#7fd0a0', 60, camRel(f, 0.3, 1.1, 0.3), 0.3);
  card('home', 700, 806, (p) => T.fxNoteCard(p, 'HOME = RUMAH'), TOP(-0.1, 2.9), 0.45);
  shout('mandi', 760, 806, 'HABIS MANDI!', '#bfe6ff', 70, TOP(-0.45, 2.55), 0.4);
  card('q', 840, 972, (p) => T.fxQ(p), at(BX - 0.5, 2.85, 0.4, 0.25), 0.25, sway(f, 0.3, 0.1));
  card('stamp', 1040, 1137, (p) => T.fxStamp(p, 'NGANGGUR', 'FULL TIME'), TOP(-0.05, 2.9), 0.45);
  shout('wait', 1140, 1205, '?!', '#ffd84a', 150, at(BX + 0.55, 2.85, 0.4, 0.25), 0.25, 0);
  { const t = q((f % 60) / 60, 2); if (f >= 1225 && f < 1285) out.push(FXC('hearts' + t, (p) => T.fxHearts(p, t), at(BX - 0.5, 2.3, 0.5, 0.55), 0.55, { order: 6 })); }
  shout('iloveyou', 1230, 1285, 'I LOVE YOU TOO?!', '#ff5fa2', 56, camRel(f, 0.3, 1.1, 0.3), 0.3);
  card('mouth', 1290, 1414, (p) => T.fxHook(p, 'DO YOU UNDERSTAND', 'THE WORDS...?!'), at(BX + 0.5, 2.36, 1.0, 0.22), 0.22, 0, 9);
  card('kamus', 1418, 1564, (p) => T.fxKamus(p), TOP(-0.05, 2.95), 0.5);
  card('ktp', 1600, 1747, (p) => T.fxKTP(p), at(BX + 0.1, 2.95, 0.8, 0.58), 0.58, 0.03);
  shout('sampu', 1570, 1640, 'SAMPURASUN!', '#ffd84a', 66, camRel(f, 0.12, 1.1, 0.3), 0.3);
  card('jadi', 1750, 1849, (p) => T.fxHook(p, 'JADI DARI', 'TADI...?!'), at(BX - 0.5, 2.36, 1.0, 0.22), 0.22, 0, 9);
  card('prank', 1880, 2110, (p) => T.fxStamp(p, 'KENA', 'PRANK!'), TOP(0.0, 3.0), 0.5);
  for (const a of [1855, 1990, 2060]) if (f >= a && f < a + 40) { const t = q(ramp(f, a, a + 18), 2); out.push(FXC('haha' + a + t, (p) => T.fxHaha(p, t), at(BX + 0.15, 2.65, 0.8, 0.45), 0.45, { order: 9 })); }
  return out;
};
