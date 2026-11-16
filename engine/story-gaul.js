// "Pak Darman vs Bahasa Gaul #1: Josjis" -- Asep (Fenrir, sarung) + Pak Darman (Charon). Rumah, x=RX.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['A', 12, 74], ['D', 85, 195], ['A', 209, 338], ['D', 348, 564], ['A', 573, 658], ['D', 715, 857], ['A', 866, 900], ['D', 911, 1115], ['A', 1133, 1160], ['D', 1169, 1380], ['A', 1394, 1422], ['D', 1431, 1518]];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1610;
const SH = [['wide', 0, 84], ['dar', 85, 208], ['asep', 209, 347], ['dar', 348, 572], ['asep', 573, 659], ['wide', 660, 714], ['dar', 715, 865], ['asep', 866, 910],
  ['dar', 911, 1132], ['asep', 1133, 1168], ['dar', 1169, 1393], ['asep', 1394, 1430], ['two', 1431, 1518], ['end', 1519, 1609]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.15, sun: '#ffe8cc', sunI: 2.3, fog: '#141c3a', fogNear: 40, fogFar: 260,
  skyTop: '#060a24', skyHor: '#22305e', sat: 1.08, vig: 0.32, gain: '#fff2e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX - 0.75, 0.5, 0.4], DAR = [RX + 0.9, 0.5, 0.4];
// Darman walks out (660-686) and back in (690-714) for the "malamnya" jump
const darX = (f) => f < 660 ? DAR[0] : f < 686 ? lerp(DAR[0], RX + 3.4, smooth(ramp(f, 660, 686))) : f < 690 ? RX + 3.4 : f < 714 ? lerp(RX + 3.4, DAR[0], smooth(ramp(f, 690, 714))) : DAR[0];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([RX + 0.15, 2.4, 6.6], [RX + 0.15, 1.75, 0.3], 44) }, { f: 90, ...K([RX + 0.15, 2.4, 6.1], [RX + 0.15, 1.77, 0.3], 44) }],
  dar: [{ f: 0, ...K([RX + 0.9, 2.15, 3.3], [RX + 0.9, 2.02, 0.4], 40) }, { f: 220, ...K([RX + 0.9, 2.15, 2.9], [RX + 0.9, 2.04, 0.4], 40) }],
  asep: [{ f: 0, ...K([RX - 0.75, 2.15, 3.1], [RX - 0.75, 2.02, 0.4], 40) }, { f: 140, ...K([RX - 0.75, 2.15, 2.7], [RX - 0.75, 2.04, 0.4], 40) }],
  two: [{ f: 0, ...K([RX + 0.07, 2.25, 5.6], [RX + 0.07, 1.82, 0.4], 42) }, { f: 88, ...K([RX + 0.07, 2.25, 5.2], [RX + 0.07, 1.84, 0.4], 42) }],
  end: [{ f: 0, ...K([RX + 0.07, 2.25, 5.2], [RX + 0.07, 1.84, 0.4], 42) }, { f: 90, ...K([RX + 0.07, 2.5, 6.2], [RX + 0.07, 1.8, 0.4], 44) }],
};
const KICKS = [{ f: 150, a: 0.03 }, { f: 1070, a: 0.035 }, { f: 1300, a: 0.03 }, { f: 1440, a: 0.03 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 3 && S.a > 0 ? 0.2 * (1 - (f - S.a) / 3) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const A1 = { facing: 1, look: 1 }, D1 = { facing: -1, look: -1 };
const asPose = (f) => {
  if (f < 85) return { L: 'hang', R: 'point', expr: 'grin', ...A1 };
  if (f < 209) return { L: 'belly', R: 'hang', expr: f > 150 ? 'laugh' : 'smile', ...A1 };
  if (f < 348) return { L: 'hang', R: 'thumb', expr: 'grin', ...A1 };
  if (f < 573) return { L: 'hang', R: 'hang', expr: f > 470 ? 'smile_closed' : 'smile', ...A1 };
  if (f < 660) return { L: 'up', R: 'thumb', expr: 'grin', ...A1 };
  if (f < 715) return { L: 'hang', R: 'hang', expr: 'smile', ...A1 };
  if (f < 866) return { L: 'hang', R: 'hang', expr: 'squint', ...A1 };
  if (f < 911) return { L: 'cheek', R: 'hang', expr: 'grin', headTilt: 8, ...A1 };
  if (f < 1133) return { L: 'hang', R: 'hang', expr: f > 1072 ? 'shock' : 'nervous', ...A1, blink: f > 1072 && f < 1110 ? 0 : undefined };
  if (f < 1169) return { L: 'temple', R: 'temple', expr: 'shock', ...A1, blink: 0 };
  if (f < 1394) return { L: 'belly', R: 'hang', expr: f > 1300 ? 'smile_closed' : 'nervous', ...A1 };
  if (f < 1431) return { L: 'hang', R: 'thumb', expr: 'grin', ...A1 };
  if (f < 1519) return { L: 'pray', R: 'pray', expr: 'nervous', ...A1 };
  return { L: 'shrug', R: 'shrug', expr: 'grin', ...A1 };
};
const darPose = (f) => {
  if (f < 85) return { L: 'hip', R: 'hip', expr: 'smile', headTilt: -6, ...D1 };
  if (f < 209) return { L: 'temple', R: 'hip', expr: f > 140 ? 'shock' : 'squint', ...D1, blink: f > 140 && f < 180 ? 0 : undefined };
  if (f < 348) return { L: 'cross', R: 'cross', expr: 'squint', ...D1 };
  if (f < 470) return { L: 'point', R: 'hip', expr: 'squint', ...D1 };
  if (f < 573) return { L: 'up', R: 'hip', expr: 'laugh', ...D1 };
  if (f < 660) return { L: 'thumb', R: 'hip', expr: 'grin', ...D1 };
  if (f < 686) return { L: 'hang', R: 'hang', expr: 'grin', step: q(walk(f, 660, 1.6, 0.6).phase, 2), facing: 1, look: 1 };
  if (f < 690) return { L: 'hang', R: 'hang', expr: 'nervous', ...D1 };
  if (f < 715) return { L: 'hang', R: 'hang', expr: 'nervous', step: q(walk(f, 690, 1.4, 0.6).phase, 2), ...D1 };
  if (f < 866) return { L: 'temple', R: 'hang', expr: 'nervous', headTilt: 8, ...D1 };
  if (f < 911) return { L: 'hang', R: 'hang', expr: 'squint', ...D1 };
  if (f < 1068) return { L: 'shrug', R: 'hang', expr: 'nervous', ...D1 };
  if (f < 1133) return { L: 'up', R: 'thumb', expr: 'laugh', ...D1 };
  if (f < 1169) return { L: 'hang', R: 'hang', expr: 'nervous', ...D1 };
  if (f < 1290) return { L: 'shrug', R: 'shrug', expr: 'nervous', ...D1 };
  if (f < 1394) return { L: 'temple', R: 'hang', expr: 'cry', ...D1 };
  if (f < 1431) return { L: 'cross', R: 'cross', expr: 'squint', ...D1 };
  return { L: 'point', R: 'hip', expr: 'stubborn', shake: 1, ...D1 };
};
export const actorsAt = (f, T) => {
  const out = [], i = idle(f, 5), j = idle(f, 2);
  { const { shake, ...o } = asPose(f), tilt = shake ? sway(f, 5, 0.55) : 0;
    out.push(R(T, 'sarung', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, expr: talk(f, 'A', o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, AS, { ground: 0.5 })); }
  { const { shake, ...o } = darPose(f), tilt = shake ? sway(f, 5, 0.55) : 0;
    out.push(R(T, 'darman', { seed: 2, blink: o.blink ?? blinkAt(f, 2), ...o, expr: talk(f, 'D', o.expr), bob: q(j.bob, 3), tilt: q(j.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + j.headTilt, 1) }, [q(darX(f), 3), DAR[1], DAR[2]], { ground: 0.5 })); }
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
  ['tanya', 88, 150, 'JOSJIS = ?', '', '#ffffff'],
  ['sakit', 150, 208, 'PENYAKIT?!', '', '#ffffff', '#c0302c', 1.15],
  ['arti', 290, 347, 'JOSJIS = MANTAP', 'BAHASA GAUL TIKTOK', '#ffd84a'],
  ['malam', 662, 714, 'MALAMNYA...', 'SEPULANG RAPAT RT', '#1a1220', '#ffd84a', 1.1],
  ['iuran', 960, 1066, 'IURAN SAMPAH: Rp50.000', '', '#ffffff', '#c0302c'],
  ['jos', 1068, 1132, 'JOSJIS!', '', '#ffd84a', '#1a1220', 1.25],
  ['bendahara', 1295, 1393, 'BENDAHARA RT BARU', '', '#ffd84a'],
  ['end', 1519, 1610, 'PAK DARMAN VS BAHASA GAUL #1', 'KOMEN KATA GAUL BERIKUTNYA!', '#ffd84a', '#1a1220', 1.1],
];
export const fxAt = (f, T) => {
  const out = [];
  const card = (key, a, b_, draw, posf, s = 0.3) => { if (f < a || f >= b_) return; const k = q(Math.min(pop(f, a), out_(f, b_)), 2); if (k > 0.01) out.push(FXC(key + k, scaled(k, draw), posf(f), s, { order: 9 })); };
  if (f < 85) { const k = q(f < 1 ? 1 : out_(f, 85), 2); out.push(FXC('hook' + k, scaled(k, (p) => T.fxPop(p, 'PAK DARMAN VS BAHASA GAUL', 'MALAM KOMEDI', '#ffd84a')), camRel(f, 0.21, 1.1, 0.3), 0.3, { order: 10 })); }
  for (const [key, a, b_, t, sub, bg, fg = '#1a1220', big = 1] of POPS) { const s = q(0.3 * big, 3);
    card(key, a, b_, (p) => T.fxPop(p, t, sub, bg, fg), (f_) => camRel(f_, 0.235, 1.1, s), s); }
  return out;
};
