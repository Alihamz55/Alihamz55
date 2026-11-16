// "Malam Minggu Kelabu" — Asep (Fenrir, sarung+peci) & Ucup (Puck, flanel), HP (Kore). 113 s, depan rumah x=240, malam + gerimis.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [["A", 7, 97], ["U", 108, 289], ["A", 300, 366], ["U", 377, 733], ["A", 763, 822], ["U", 833, 1283], ["A", 1313, 1397], ["U", 1408, 1744], ["A", 1774, 1897], ["U", 1907, 2002], ["A", 2026, 2100], ["A", 2110, 2378], ["U", 2408, 2469], ["A", 2479, 2556], ["U", 2580, 2675], ["A", 2684, 2711], ["H", 2744, 2851], ["U", 2875, 2912], ["A", 2876, 2907], ["U", 2940, 3238], ["A", 3268, 3345]];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 3400;
export const SHOTS = [
  ['wide', 0, 107], ['uc', 108, 299], ['as', 300, 376], ['pu', 377, 762], ['as', 763, 832], ['pu', 833, 1312], ['as', 1313, 1407],
  ['pu', 1408, 1773], ['as', 1774, 1906], ['uc', 1907, 2025], ['as', 2026, 2109], ['pa', 2110, 2407], ['uc', 2408, 2478], ['as', 2479, 2579],
  ['uc', 2580, 2683], ['two', 2684, 2874], ['two2', 2875, 2939], ['pu', 2940, 3267], ['end', 3268, 3399],
].map(([id, a, b]) => ({ id, a, b, light: 'night' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = {
  night: { az: 70, el: 42, sky: '#7a8ac0', ground: '#2a3048', hemi: 1.0, sun: '#c8d4ff', sunI: 1.9, fog: '#141c3a', fogNear: 40, fogFar: 260,
    skyTop: '#060a24', skyHor: '#22305e', sat: 1.05, vig: 0.34, gain: '#e8eeff', shadowExt: 12 },
};
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
export const RX = -40, SX = 80;
const HR = 240;
const UC = [HR - 0.55, 0.5, 0.6], AS0 = [HR + 0.62, 0.5, 0.95];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([HR + 0.05, 2.6, 8.6], [HR + 0.05, 2.3, 0.5], 46) }, { f: 108, ...K([HR + 0.05, 2.5, 7.6], [HR + 0.05, 2.2, 0.5], 46) }],
  uc: [{ f: 0, ...K([UC[0] + 0.05, 2.15, 3.6], [UC[0], 2.0, UC[2]], 40) }, { f: 400, ...K([UC[0] + 0.05, 2.15, 3.2], [UC[0], 2.02, UC[2]], 40) }],
  as: [{ f: 0, ...K([AS0[0] - 0.05, 2.15, 3.9], [AS0[0], 2.0, AS0[2]], 40) }, { f: 400, ...K([AS0[0] - 0.05, 2.15, 3.5], [AS0[0], 2.02, AS0[2]], 40) }],
  pu: [{ f: 0, ...K([UC[0] + 0.3, 1.7, 4.4], [UC[0] + 0.05, 2.3, UC[2]], 40) }, { f: 500, ...K([UC[0] + 0.2, 1.72, 3.8], [UC[0] + 0.03, 2.32, UC[2]], 40) }],
  pa: [{ f: 0, ...K([AS0[0] - 0.3, 1.7, 4.7], [AS0[0] - 0.05, 2.3, AS0[2]], 40) }, { f: 300, ...K([AS0[0] - 0.2, 1.72, 4.1], [AS0[0] - 0.03, 2.32, AS0[2]], 40) }],
  two: [{ f: 0, ...K([HR + 0.05, 2.3, 7.4], [HR + 0.05, 1.9, 0.7], 42) }, { f: 400, ...K([HR + 0.05, 2.3, 6.9], [HR + 0.05, 1.92, 0.7], 42) }],
  two2: [{ f: 0, ...K([HR + 0.05, 1.5, 6.4], [HR + 0.05, 2.6, 0.7], 44) }, { f: 65, ...K([HR + 0.05, 1.45, 6.0], [HR + 0.05, 2.7, 0.7], 44) }],
  end: [{ f: 0, ...K([HR + 0.05, 2.3, 6.6], [HR + 0.05, 1.95, 0.6], 44) }, { f: 132, ...K([HR + 0.05, 2.6, 8.4], [HR + 0.05, 2.2, 0.6], 46) }],
};
const PUNCH = [670, 1258, 1715, 2320, 3214];
const KICKS = [...PUNCH.map((f) => ({ f, a: 0.025 })), { f: 1907, a: 0.02 }, { f: 2744, a: 0.03 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 3 && S.a > 0 ? 0.2 * (1 - (f - S.a) / 3) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const inPunch = (f, a, b_) => f >= a && f < b_;
// Ucup reading a poem: hand on chest + arm to the sky, alternating per line; deadpan at the punchline
const poem = (f, a, punch, end, cry = false) => {
  if (f >= punch) return { L: 'hang', R: 'hang', expr: f > end ? 'nervous' : 'squint', look: 0 };
  const ph = Math.floor((f - a) / 70) % 2;
  return { L: ph ? 'belly' : 'up', R: ph ? 'up' : 'cheek', expr: cry ? 'cry' : (ph ? 'nervous' : 'shock'), headTilt: ph ? -10 : 8, look: 0 };
};
const ucPose = (f) => {
  if (f < 108) return { L: 'hang', R: 'phone', expr: 'nervous', headTilt: -6 };
  if (f < 300) return { L: 'cheek', R: 'hang', expr: 'cry', headTilt: -8, facing: 1, look: 1 };
  if (f < 377) return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1 };
  if (f < 763) return poem(f, 377, 666, 740);
  if (f < 833) return { L: 'hang', R: 'shrug', expr: 'nervous', facing: 1, look: 1 };
  if (f < 1313) return poem(f, 833, 1240, 1290);
  if (f < 1408) return { L: 'hang', R: 'hang', expr: 'shock', facing: 1, look: 1 };
  if (f < 1774) return poem(f, 1408, 1700, 1750, true);
  if (f < 1907) return { L: 'hang', R: 'hang', expr: 'squint', facing: 1, look: 1 };
  if (f < 2026) return { L: 'hang', R: 'point', expr: 'squint', facing: 1, look: 1 };
  if (f < 2408) return { L: 'hang', R: 'hang', expr: f > 2320 ? 'shock' : 'smile', facing: 1, look: 1, blink: f > 2320 ? 0 : undefined };
  if (f < 2479) return { L: 'shrug', R: 'shrug', expr: 'stubborn', facing: 1, look: 1, shake: 1 };
  if (f < 2580) return { L: 'hang', R: 'hang', expr: 'squint', facing: 1, look: 1 };
  if (f < 2684) return { L: 'up', R: 'phone', expr: 'laugh', jump: 1 };
  if (f < 2744) return { L: 'hang', R: 'phone', expr: 'grin', facing: 1, look: 1 };
  if (f < 2875) return { L: 'hang', R: 'phone', expr: f > 2790 ? 'shock' : 'grin', blink: f > 2790 ? 0 : undefined };
  if (f < 2940) return { L: 'hang', R: 'hang', expr: 'nervous', headTilt: 14 };
  if (f < 3268) return poem(f, 2940, 3210, 3250, true);
  return { L: 'temple', R: 'hang', expr: 'cry', facing: 1, look: 1 };
};
const asPose = (f) => {
  if (f < 108) return { L: 'hip', R: 'point', expr: 'squint', facing: -1, look: -1 };
  if (f < 377) return { L: 'cross', R: 'cross', expr: f < 300 ? 'smile' : 'grin', facing: -1, look: -1 };
  if (f < 763) return { L: 'cross', R: 'cross', expr: f > 670 ? 'shock' : 'squint', facing: -1, look: -1 };
  if (f < 833) return { L: 'hip', R: 'point', expr: 'grin', facing: -1, look: -1 };
  if (f < 1313) return { L: 'hang', R: 'cheek', expr: f > 1258 ? 'shock' : 'squint', facing: -1, look: -1 };
  if (f < 1408) return { L: 'hip', R: 'shrug', expr: 'stubborn', facing: -1, look: -1 };
  if (f < 1774) return { L: 'hang', R: 'hang', expr: f > 1600 ? 'cry' : 'nervous', facing: -1, look: -1 };
  if (f < 1907) return { L: 'cross', R: 'cross', expr: 'cry', shake: 1 };
  if (f < 2026) return { L: 'hang', R: 'hang', expr: 'shock', facing: -1, look: -1, blink: 0 };
  if (f < 2110) return { L: 'hip', R: 'thumb', expr: 'grin', facing: -1, look: -1 };
  if (f < 2408) { if (f >= 2320) return { L: 'hip', R: 'point', expr: 'stubborn', facing: -1, look: -1 };
    const ph = Math.floor((f - 2110) / 60) % 2; return { L: ph ? 'belly' : 'up', R: ph ? 'up' : 'belly', expr: ph ? 'grin' : 'smile', headTilt: ph ? 8 : -8 }; }
  if (f < 2479) return { L: 'hip', R: 'point', expr: 'stubborn', facing: -1, look: -1 };
  if (f < 2580) return { L: 'hang', R: 'thumb', expr: 'smile', facing: -1, look: -1 };
  if (f < 2744) return { L: 'hang', R: 'shrug', expr: 'grin', facing: -1, look: -1 };
  if (f < 2875) return { L: 'hang', R: 'hang', expr: f > 2790 ? 'shock' : 'smile', facing: -1, look: -1 };
  if (f < 2940) return { L: 'hang', R: 'hang', expr: 'nervous', headTilt: -14 };
  if (f < 3268) return { L: 'hang', R: 'cheek', expr: f > 3214 ? 'shock' : 'cry', facing: -1, look: -1 };
  return { L: 'belly', R: 'point', expr: f > 3300 ? 'stubborn' : 'cry', facing: -1, look: -1, clap: f < 3300 ? 1 : 0 };
};
export const actorsAt = (f, T) => {
  const out = [], i = idle(f, 5), j = idle(f, 2);
  { const { shake, jump, ...o } = ucPose(f), tilt = shake ? sway(f, 6, 0.5) : 0, hop = jump ? Math.abs(Math.sin(f * 0.25)) * 0.12 : 0;
    out.push(R(T, 'flanel', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, expr: talk(f, 'U', o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q(i.headTilt + (o.headTilt || 0), 1) }, [UC[0], q(UC[1] + hop, 3), UC[2]], { ground: 0.5 })); }
  { const { shake, clap, ...o } = asPose(f), tilt = shake ? sway(f, 4, 0.9) : 0;
    if (clap) { o.L = Math.floor(f / 5) % 2 ? 'pray' : 'belly'; o.R = o.L; }
    out.push(R(T, 'sarung', { seed: 2, blink: o.blink ?? blinkAt(f, 2), ...o, expr: talk(f, 'A', o.expr), bob: q(j.bob, 3), tilt: q(j.tilt + tilt, 1), headTilt: q(j.headTilt + (o.headTilt || 0), 1) }, AS0, { ground: 0.5 })); }
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
  // gerimis over the whole frame
  out.push(FXC('rain' + (f % 16), (p) => T.fxRain(p, f % 16), camRel(f, 0, 1.0, 0.42), 0.42, { order: 3 }));
  const card = (key, a, b_, draw, posf, s = 0.3, roll = 0, order = 9) => { if (f < a || f >= b_) return; const k = q(Math.min(pop(f, a), out_(f, b_)), 2); if (k > 0.01) out.push(FXC(key + k, scaled(k, draw), posf(f), s, { roll, order })); };
  const top = (dy = 0.3) => (f_) => camRel(f_, dy, 1.1, 0.22);
  const note = (key, a, b_, text, col, roll = -0.03) => card(key, a, b_, (p) => T.fxNoteCard(p, text, col), top(0.32), 0.2, roll);
  const shout = (key, a, b_, text, col, size, dy = 0.3) => card(key, a, b_, (p) => T.fxShout(p, text, col, size), top(dy), 0.22, -0.04);
  if (f < 107) { const k = q((f < 1 ? 1 : 1 + 0.03 * Math.sin(f * 0.5)) * out_(f, 107), 2); out.push(FXC('hook' + k, scaled(k, (p) => T.fxHook(p, 'MALAM MINGGU', 'KELABU...')), camRel(f, 0.24, 1.1, 0.3), 0.3, { order: 10 })); }
  note('galau', 150, 299, 'GALAU MODE: ON', '#d8e0ff');
  note('p1', 390, 640, 'PUISI #1', '#fff8d8');
  note('sabun', 668, 762, 'DISKON SABUN?!', '#ffd84a', 0.04);
  note('belanja', 775, 832, 'DAFTAR BELANJA', '#fff8d8', 0.03);
  note('p2', 845, 1220, 'PUISI #2', '#fff8d8');
  note('3th', 1250, 1312, 'UDAH 3 TAHUN!', '#ffd84a', 0.04);
  note('kabur', 1330, 1407, 'ITU KABUR', '#ffe0e0', 0.03);
  note('p3', 1420, 1690, 'PUISI #3', '#fff8d8');
  note('nangkep', 1712, 1773, 'NGGAK ADA YG NANGKEP', '#ffd84a', 0.04);
  note('hujan', 1950, 2025, 'LU KEHUJANAN!', '#ffd84a', 0.04);
  note('pa', 2120, 2300, 'PUISI ASEP', '#e0f4ff');
  note('utang', 2318, 2407, 'BALIKIN DUIT GUA!', '#ffd84a', 0.04);
  note('realis', 2490, 2579, 'PUISI REALIS', '#fff8d8', 0.03);
  if (f >= 2712 && f < 2744) { const t = q((f % 8) / 8, 1); out.push(FXC('ring' + t, (p) => T.fxPhoneMsg(p, 'TING!', '1 pesan baru', 1 + t), camRel(f, 0.15, 1.1, 0.2, -0.04), 0.2, { order: 9 })); }
  card('kuota', 2744, 2874, (p) => T.fxPhoneMsg(p, 'OPERATOR', 'Kuota mau habis'), (f_) => camRel(f_, 0.18, 1.1, 0.2), 0.2, 0.03);
  shout('kelabu', 2878, 2939, 'KELABU...', '#c0c8dc', 80);
  note('p4', 2950, 3180, 'PUISI PENUTUP', '#fff8d8');
  note('nagih', 3212, 3267, 'NAGIH MELULU!', '#ffd84a', 0.04);
  note('bayar', 3310, 3399, 'BAYAR UTANG!', '#ffd84a', 0.04);
  for (const a of [735, 1285, 1745, 2380, 3240, 3350]) if (f >= a && f < a + 40) { const t = q(ramp(f, a, a + 18), 2); out.push(FXC('haha' + a + t, (p) => T.fxHaha(p, t), camRel(f, -0.02, 1.1, 0.16, 0.06), 0.16, { order: 9 })); }
  return out;
};
