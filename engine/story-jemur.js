// "Sep, Angkat Jemuran!" -- Asep (Fenrir, sarung) + Ibu (Gacrux, istri). Depan rumah No. 17 (x=HR), mendung -> hujan.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['I', 12, 87], ['A', 97, 166], ['I', 176, 219], ['A', 228, 333], ['I', 381, 410], ['A', 419, 467], ['A', 539, 646], ['I', 658, 756], ['A', 765, 836], ['I', 847, 947], ['A', 965, 1039], ['I', 1048, 1071]];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1160;
const RAIN = 342;
const SH = [['wide', 0, 96], ['asep', 97, 175], ['ibu', 176, 227], ['asep', 228, 339], ['wide', 340, 380], ['ibu', 381, 418], ['wide', 419, 538], ['asep', 539, 657],
  ['ibu', 658, 764], ['asep', 765, 846], ['ibu', 847, 899], ['line', 900, 964], ['two', 965, 1047], ['end', 1048, 1159]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a >= 340 ? 'rain' : 'mendung' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = {
  mendung: { az: 80, el: 42, sky: '#d0d4dc', ground: '#6a7060', hemi: 1.2, sun: '#eceef4', sunI: 1.6, fog: '#b8bcc8', fogNear: 40, fogFar: 200,
    skyTop: '#7d8696', skyHor: '#c4c8d0', sat: 0.98, vig: 0.22, shadowExt: 12 },
  rain: { az: 80, el: 42, sky: '#8f97a8', ground: '#3a4048', hemi: 1.0, sun: '#c8d0e0', sunI: 1.0, fog: '#6a7280', fogNear: 18, fogFar: 120,
    skyTop: '#3a4250', skyHor: '#6a7280', sat: 0.86, vig: 0.36, gain: '#e8eef8', shadowExt: 12 },
};
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240;
const AS = [HR - 0.7, 0.5, 0.95], IB = [HR + 0.6, 0.5, 0.75], JM = [HR - 3.1, 0.5, -0.7];
// Asep runs off right (470-500) and comes back with the pile (505-538)
const asX = (f) => f < 470 ? AS[0] : f < 500 ? lerp(AS[0], HR + 4.6, smooth(ramp(f, 470, 500))) : f < 505 ? HR + 4.6 : f < 538 ? lerp(HR + 4.6, AS[0], smooth(ramp(f, 505, 538))) : AS[0];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([HR - 0.8, 2.5, 8.4], [HR - 0.8, 2.0, 0.3], 48) }, { f: 120, ...K([HR - 0.8, 2.4, 7.8], [HR - 0.8, 1.95, 0.3], 48) }],
  asep: [{ f: 0, ...K([AS[0], 2.15, 3.7], [AS[0], 2.0, AS[2]], 40) }, { f: 120, ...K([AS[0], 2.15, 3.3], [AS[0], 2.02, AS[2]], 40) }],
  ibu: [{ f: 0, ...K([IB[0], 2.15, 3.5], [IB[0], 2.0, IB[2]], 40) }, { f: 110, ...K([IB[0], 2.15, 3.1], [IB[0], 2.02, IB[2]], 40) }],
  line: [{ f: 0, ...K([JM[0] + 0.3, 2.2, 4.4], [JM[0], 2.0, JM[2]], 44) }, { f: 64, ...K([JM[0] + 0.2, 2.15, 3.8], [JM[0], 2.0, JM[2]], 44) }],
  two: [{ f: 0, ...K([HR - 0.05, 2.25, 5.6], [HR - 0.05, 1.85, 0.8], 42) }, { f: 82, ...K([HR - 0.05, 2.25, 5.2], [HR - 0.05, 1.87, 0.8], 42) }],
  end: [{ f: 0, ...K([HR - 0.05, 2.25, 5.2], [HR - 0.05, 1.87, 0.8], 42) }, { f: 110, ...K([HR - 0.4, 2.5, 8.4], [HR - 0.4, 2.0, 0.4], 48) }],
};
const KICKS = [{ f: 342, a: 0.05 }, { f: 381, a: 0.035 }, { f: 690, a: 0.025 }, { f: 1048, a: 0.035 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 });
  c.flash = f >= RAIN - 2 && f < RAIN + 5 ? 0.85 * (1 - (f - RAIN + 2) / 7) : f >= S.a && f < S.a + 3 && S.a > 0 ? 0.2 * (1 - (f - S.a) / 3) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const A1 = { facing: 1, look: 1 }, I1 = { facing: -1, look: -1 };
const PILE = [539, 1160];
const asPose = (f) => {
  if (f < 97) return { L: 'hang', R: 'phone', expr: 'smile', ...A1 };
  if (f < 176) return { L: 'hang', R: 'phone', expr: 'stubborn', ...A1 };
  if (f < 340) return { L: 'shrug', R: 'phone', expr: 'grin', ...A1 };
  if (f < 381) return { L: 'up', R: 'phone', expr: 'shock', ...A1, blink: 0 };
  if (f < 470) return { L: 'hang', R: 'phone', expr: 'nervous', ...A1 };
  if (f < 500) return { L: 'hang', R: 'hang', expr: 'nervous', step: q(walk(f, 470, 2.2, 0.7).phase, 2), ...A1 };
  if (f < 539) return { L: 'belly', R: 'belly', expr: 'grin', step: q(walk(f, 505, 2.2, 0.7).phase, 2), facing: -1, look: -1 };
  if (f < 658) return { L: 'belly', R: 'belly', expr: 'grin', ...A1 };
  if (f < 765) return { L: 'belly', R: 'belly', expr: f > 715 ? 'nervous' : 'smile', ...A1 };
  if (f < 847) return { L: 'belly', R: 'belly', expr: 'squint', ...A1 };
  if (f < 965) return { L: 'belly', R: 'belly', expr: 'shock', ...A1, blink: f < 900 ? 0 : undefined };
  if (f < 1048) return { L: 'belly', R: 'belly', expr: 'smile_closed', headTilt: 8, ...A1 };
  return { L: 'belly', R: 'belly', expr: 'nervous', shake: 1, ...A1 };
};
const ibPose = (f) => {
  if (f < 97) return { L: 'point', R: 'hip', expr: 'stubborn', ...I1 };
  if (f < 176) return { L: 'hip', R: 'hip', expr: 'squint', ...I1 };
  if (f < 228) return { L: 'point', R: 'hip', expr: 'stubborn', ...I1 };
  if (f < 340) return { L: 'cross', R: 'cross', expr: 'squint', ...I1 };
  if (f < 381) return { L: 'up', R: 'up', expr: 'shock', ...I1, blink: 0 };
  if (f < 419) return { L: 'point', R: 'hip', expr: 'stubborn', shake: 1, ...I1 };
  if (f < 539) return { L: 'hip', R: 'hip', expr: 'squint', ...I1 };
  if (f < 658) return { L: 'cross', R: 'cross', expr: 'squint', ...I1 };
  if (f < 765) return { L: 'cheek', R: 'hang', expr: 'squint', headTilt: 8, ...I1 };
  if (f < 847) return { L: 'cross', R: 'cross', expr: 'squint', ...I1 };
  if (f < 965) return { L: 'point', R: 'hip', expr: 'stubborn', shake: 1, ...I1 };
  if (f < 1048) return { L: 'temple', R: 'hip', expr: 'shock', ...I1, blink: 0 };
  return { L: 'point', R: 'up', expr: 'stubborn', shake: 1, ...I1 };
};
export const actorsAt = (f, T) => {
  const out = [], i = idle(f, 5), j = idle(f, 3);
  { const { shake, ...o } = asPose(f), tilt = shake ? sway(f, 5, 0.55) : 0;
    out.push(R(T, 'sarung', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, expr: talk(f, 'A', o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, [q(asX(f), 3), AS[1], AS[2]], { ground: 0.5 })); }
  { const { shake, ...o } = ibPose(f), tilt = shake ? sway(f, 5, 0.55) : 0;
    out.push(R(T, 'tante', { seed: 3, blink: o.blink ?? blinkAt(f, 3), ...o, expr: talk(f, 'I', o.expr), bob: q(j.bob, 3), tilt: q(j.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + j.headTilt, 1) }, IB, { ground: 0.5 })); }
  return out;
};

const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 8) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 6) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const scaled = (k, fn) => (pp) => { pp.g.translate(300, 500); pp.g.scale(k, k); pp.g.translate(-300, -500); fn(pp); };
const at = (x, yc, z, s) => [x, yc - 1.07 * s, z];
const camRel = (f, dy, d, s, dx = 0) => { const C = camAt(f), v = [C.look[0] - C.pos[0], C.look[1] - C.pos[1], C.look[2] - C.pos[2]], L = Math.hypot(...v);
  return at(C.pos[0] + v[0] / L * d + dx, C.pos[1] + v[1] / L * d + dy, C.pos[2] + v[2] / L * d, s); };
const POPS = [
  ['cuaca', 268, 340, 'KATA APLIKASI: HUJAN JAM 5', '', '#ffffff'],
  ['jeder', 344, 381, 'JEDERRR!', '', '#ffd84a', '#1a1220', 1.3],
  ['detik', 482, 537, '10 DETIK KEMUDIAN', '', '#1a1220', '#ffd84a', 1.05],
  ['macan', 690, 765, 'DASTER MOTIF MACAN?!', '', '#ffffff', '#c0302c'],
  ['burt', 856, 900, 'JEMURAN BU RT', '', '#ffd84a'],
  ['kita', 904, 965, 'JEMURAN KITA...', 'KEHUJANAN', '#ffffff', '#1a1220', 1, -0.3],
  ['end', 1074, 1160, 'SEP, ANGKAT JEMURAN!', 'KAMU PERNAH SALAH ANGKAT?', '#ffd84a', '#1a1220', 1.1],
];
export const fxAt = (f, T) => {
  const out = [];
  // our clothesline in the yard (dry before the rain, soaked after)
  { const wet = f >= RAIN + 20 ? 1 : 0, s = 1.9; out.push(FXC('jem' + wet + (wet ? 0 : f % 24), (p) => T.fxJemuran(p, wet, f), [JM[0], JM[1], JM[2]], s, { order: 1, shadow: false })); }
  // clothes pile in Asep's arms
  if (f >= 505) { const s = 0.62, x = asX(f) + (f < 539 ? -0.05 : 0.05); out.push(FXC('pile', (p) => T.fxPile(p), at(x, 1.38, AS[2] + 0.14, s), s, { order: 5 })); }
  if (f >= RAIN) out.push(FXC('rain' + (f % 16), (p) => T.fxRain(p, f % 16), camRel(f, 0, 1.0, 0.42), 0.42, { order: 3 }));
  const card = (key, a, b_, draw, posf, s = 0.3) => { if (f < a || f >= b_) return; const k = q(Math.min(pop(f, a), out_(f, b_)), 2); if (k > 0.01) out.push(FXC(key + k, scaled(k, draw), posf(f), s, { order: 9 })); };
  if (f < 97) { const k = q(f < 1 ? 1 : out_(f, 97), 2); out.push(FXC('hook' + k, scaled(k, (p) => T.fxPop(p, 'SEP, ANGKAT JEMURAN!', 'MALAM KOMEDI', '#ffd84a')), camRel(f, 0.21, 1.1, 0.3), 0.3, { order: 10 })); }
  for (const [key, a, b_, t, sub, bg, fg = '#1a1220', big = 1, dy = 0.235] of POPS) { const s = q(0.3 * big, 3);
    card(key, a, b_, (p) => T.fxPop(p, t, sub, bg, fg), (f_) => camRel(f_, dy, 1.1, s), s); }
  return out;
};
