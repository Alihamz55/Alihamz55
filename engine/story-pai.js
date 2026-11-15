// "Pacaran Sama AI" — Asep (Fenrir, sarung) + Pak Darman (Charon) + Vira hologram AI (Kore). Kamar Asep x=RX, malam.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['A', 12, 111], ['D', 126, 237], ['A', 249, 341], ['D', 356, 434], ['A', 447, 550], ['D', 562, 716], ['V', 758, 908], ['D', 920, 998], ['V', 1010, 1206], ['D', 1227, 1342], ['A', 1369, 1507], ['V', 1518, 1714], ['D', 1732, 1859], ['A', 1898, 1982], ['V', 2012, 2174], ['A', 2192, 2289], ['D', 2310, 2527]];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 2610;
const SH = [['asepV', 0, 125], ['wide', 126, 246], ['asepV', 247, 355], ['dar', 356, 446], ['asepV', 447, 561], ['dar', 562, 716], ['asep', 717, 757],
  ['vira', 758, 919], ['dar', 920, 1009], ['vira', 1010, 1226], ['dar', 1227, 1368], ['asepV', 1369, 1517], ['vira', 1518, 1731], ['dar', 1732, 1897],
  ['asepV', 1898, 2011], ['vira', 2012, 2191], ['asep', 2192, 2309], ['two', 2310, 2527], ['end', 2528, 2609]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.15, sun: '#ffe8cc', sunI: 2.3, fog: '#141c3a', fogNear: 40, fogFar: 260,
  skyTop: '#060a24', skyHor: '#22305e', sat: 1.08, vig: 0.32, gain: '#fff2e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX - 0.75, 0.5, 0.4], DAR = [RX + 0.9, 0.5, 0.4], VI = [RX + 0.06, 1.98, 0.85];
const darX = (f) => f < 100 ? RX + 3.3 : f < 140 ? lerp(RX + 3.3, DAR[0], smooth(ramp(f, 100, 140))) : f < 2290 ? DAR[0] : lerp(DAR[0], RX + 0.05, smooth(ramp(f, 2290, 2320)));
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  asepV: [{ f: 0, ...K([RX - 0.36, 2.1, 4.0], [RX - 0.36, 1.86, 0.5], 42) }, { f: 200, ...K([RX - 0.36, 2.1, 3.65], [RX - 0.36, 1.88, 0.5], 42) }],
  wide: [{ f: 0, ...K([RX + 0.15, 2.4, 6.6], [RX + 0.15, 1.75, 0.3], 44) }, { f: 120, ...K([RX + 0.15, 2.4, 6.1], [RX + 0.15, 1.77, 0.3], 44) }],
  dar: [{ f: 0, ...K([RX + 0.9, 2.15, 3.3], [RX + 0.9, 2.02, 0.4], 40) }, { f: 200, ...K([RX + 0.9, 2.15, 2.9], [RX + 0.9, 2.04, 0.4], 40) }],
  asep: [{ f: 0, ...K([RX - 0.75, 2.15, 3.1], [RX - 0.75, 2.02, 0.4], 40) }, { f: 120, ...K([RX - 0.75, 2.15, 2.7], [RX - 0.75, 2.04, 0.4], 40) }],
  vira: [{ f: 0, ...K([RX + 0.06, 2.12, 3.0], [RX + 0.06, 2.1, 0.85], 42) }, { f: 220, ...K([RX + 0.06, 2.12, 2.7], [RX + 0.06, 2.11, 0.85], 42) }],
  two: [{ f: 0, ...K([RX - 0.3, 2.2, 4.4], [RX - 0.3, 1.85, 0.4], 42) }, { f: 218, ...K([RX - 0.3, 2.2, 3.9], [RX - 0.3, 1.87, 0.4], 42) }],
  end: [{ f: 0, ...K([RX - 0.3, 2.2, 4.4], [RX - 0.3, 1.85, 0.4], 42) }, { f: 82, ...K([RX - 0.2, 2.5, 6.4], [RX - 0.2, 1.8, 0.4], 44) }],
};
const KICKS = [{ f: 660, a: 0.025 }, { f: 1800, a: 0.035 }, { f: 2012, a: 0.03 }, { f: 2440, a: 0.03 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 3 && S.a > 0 ? 0.2 * (1 - (f - S.a) / 3) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const asPose = (f) => {
  if (f < 126) return { L: 'cheek', R: 'phone', expr: f % 90 < 50 ? 'smile_closed' : 'grin', headTilt: 8, facing: 1, look: 1 };
  if (f < 247) return { L: 'hang', R: 'phone', expr: 'shock', facing: 1, look: 1 };
  if (f < 356) return { L: 'point', R: 'phone', expr: 'grin', facing: 1, look: 1 };
  if (f < 447) return { L: 'hang', R: 'phone', expr: 'squint', facing: 1, look: 1 };
  if (f < 562) return { L: 'shrug', R: 'phone', expr: 'stubborn', facing: 1, look: 1 };
  if (f < 758) return { L: 'hang', R: 'phone', expr: f > 660 ? 'shock' : 'nervous', facing: 1, look: 1, blink: f > 660 && f < 700 ? 0 : undefined };
  if (f < 1227) return { L: 'cheek', R: 'phone', expr: f > 1150 ? 'nervous' : 'smile', facing: 1, look: 1 };
  if (f < 1369) return { L: 'temple', R: 'phone', expr: 'nervous', facing: 1, look: 1 };
  if (f < 1518) return { L: 'cheek', R: 'phone', expr: 'smile_closed', headTilt: 8, facing: 1, look: 1 };
  if (f < 1898) return { L: 'hang', R: 'phone', expr: f > 1640 ? 'nervous' : 'smile', facing: 1, look: 1 };
  if (f < 2012) return { L: 'pray', R: 'phone', expr: 'grin', facing: 1, look: 1 };
  if (f < 2192) return { L: 'hang', R: 'phone', expr: 'shock', facing: 1, look: 1, blink: 0 };
  if (f < 2310) return { L: 'up', R: 'phone', expr: 'cry', shake: 1, facing: 1, look: 1 };
  if (f < 2440) return { L: 'hang', R: 'phone', expr: 'sob', facing: 1, look: 1 };
  return { L: 'temple', R: 'hang', expr: 'sob', shake: 1 };
};
const darPose = (f) => {
  if (f < 140) return { L: 'hang', R: 'hang', expr: 'squint', step: q(walk(f, 100, 1.6, 0.6).phase, 2), facing: -1, look: -1 };
  if (f < 247) return { L: 'point', R: 'hip', expr: 'squint', facing: -1, look: -1 };
  if (f < 447) return { L: 'temple', R: 'hip', expr: 'nervous', facing: -1, look: -1 };
  if (f < 640) return { L: 'hip', R: 'hang', expr: 'squint', facing: -1, look: -1 };
  if (f < 758) return { L: 'hip', R: 'shrug', expr: 'smile', facing: -1, look: -1 };
  if (f < 1010) return { L: 'pray', R: 'pray', expr: 'grin', facing: -1, look: -1 };
  if (f < 1227) return { L: 'hang', R: 'hang', expr: f > 1080 ? 'shock' : 'smile', facing: -1, look: -1, blink: f > 1080 ? 0 : undefined };
  if (f < 1369) return { L: 'point', R: 'hip', expr: 'stubborn', shake: 1, facing: -1, look: -1 };
  if (f < 1732) return { L: 'cross', R: 'cross', expr: f > 1640 ? 'squint' : 'stubborn', facing: -1, look: -1 };
  if (f < 1898) return { L: 'point', R: 'up', expr: f > 1790 ? 'laugh' : 'grin', facing: -1, look: -1 };
  if (f < 2192) return { L: 'cross', R: 'cross', expr: f > 2060 ? 'smile_closed' : 'squint', facing: -1, look: -1 };
  if (f < 2290) return { L: 'hang', R: 'hip', expr: 'squint', facing: -1, look: -1 };
  if (f < 2440) return { L: 'point', R: 'hang', expr: 'smile', facing: -1, look: -1 };
  return { L: 'point', R: 'hang', expr: 'smile_closed', facing: -1, look: -1 };
};
export const actorsAt = (f, T) => {
  const out = [], i = idle(f, 5), j = idle(f, 2);
  { const { shake, ...o } = asPose(f), tilt = shake ? sway(f, 5, 0.55) : 0;
    out.push(R(T, 'sarung', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, expr: talk(f, 'A', o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, AS, { ground: 0.5 })); }
  { const { shake, ...o } = darPose(f), tilt = shake ? sway(f, 5, 0.55) : 0;
    out.push(R(T, 'darman', { seed: 2, blink: o.blink ?? blinkAt(f, 2), ...o, expr: talk(f, 'D', o.expr), bob: q(j.bob, 3), tilt: q(j.tilt + tilt, 1), headTilt: q(j.headTilt, 1) }, [q(darX(f), 3), DAR[1], DAR[2]], { ground: 0.5 })); }
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
  ['pacar', 300, 372, 'PACAR ASEP: AI', '', '#ffffff'],
  ['rt', 372, 446, 'AI ANAK PAK RT?', '', '#ffd84a'],
  ['buatan', 645, 757, 'PANTES MAU SAMA KAMU', 'KECERDASAN BUATAN', '#ffd84a'],
  ['empat', 1070, 1145, 'NILAI BAPAK: 4', '', '#ffffff', '#c0302c'],
  ['persen', 1145, 1226, 'PELUANG: 2%', 'JADI MERTUA YANG BAIK', '#ffd84a'],
  ['ghibah', 1260, 1368, 'GHIBAH DIGITAL!', '', '#ffffff'],
  ['langganan', 1625, 1731, 'LANGGANAN SISA 2 HARI', '', '#ffffff', '#c0302c'],
  ['tagihan', 1795, 1897, 'ITU TAGIHAN!', '', '#ffd84a', '#1a1220', 1.2],
  ['kuota', 2040, 2191, 'KUOTA HABIS', 'HUBUNGAN DIJEDA', '#ffffff', '#c0302c'],
  ['putus', 2440, 2610, 'DIPUTUSIN KUOTA', 'MALAM KOMEDI', '#ffd84a', '#1a1220', 1.15],
];
const viraMood = (f) => f >= 2012 ? 'error' : (f >= 1010 && f < 1230) || (f >= 1625 && f < 1731) ? 'flat' : 'love';
export const fxAt = (f, T) => {
  const out = [];
  const card = (key, a, b_, draw, posf, s = 0.3) => { if (f < a || f >= b_) return; const k = q(Math.min(pop(f, a), out_(f, b_)), 2); if (k > 0.01) out.push(FXC(key + k, scaled(k, draw), posf(f), s, { order: 9 })); };
  if (f < 126) { const k = q(f < 1 ? 1 : out_(f, 126), 2); out.push(FXC('hook' + k, scaled(k, (p) => T.fxPop(p, 'PACARAN SAMA AI', 'MALAM KOMEDI', '#ffd84a')), camRel(f, 0.21, 1.1, 0.3), 0.3, { order: 10 })); }
  // Vira hologram: glitches at 1995-2012 and shrinks away at 2280-2300
  const glitch = f >= 1995 && f < 2012 && f % 4 < 2, gone = f >= 2300;
  if (!glitch && !gone) { const k = f < 2280 ? 1 : q(1 - smooth(ramp(f, 2280, 2300)), 2), s = 0.48;
    const m = speaks(f, 'V') ? +(LIPS[f] || 0) : 0, mood = viraMood(f), bl = mood !== 'error' && f % 110 > 104 ? 1 : 0, bob = q(0.02 * Math.sin(f * 0.08), 3);
    if (k > 0.01) out.push(FXC('vira' + [m, mood, bl, f % 4, k].join(), scaled(k, (p) => T.fxVira(p, m, mood, f % 4, bl)), at(VI[0], VI[1] + bob, VI[2], s), s, { order: 6 })); }
  for (const [key, a, b_, t, sub, bg, fg = '#1a1220', big = 1] of POPS) { const s = q(0.3 * big, 3);
    card(key, a, b_, (p) => T.fxPop(p, t, sub, bg, fg), (f_) => camRel(f_, 0.235, 1.1, s), s); }
  return out;
};
