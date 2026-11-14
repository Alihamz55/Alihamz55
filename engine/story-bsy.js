// "Bapak Siapa Ya?" — stand up Pak Darman (Charon) + Asep di kursi penonton (Fenrir). Stage x=0 + audience.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['D', 9, 57], ['D', 78, 375], ['D', 417, 572], ['D', 611, 833], ['D', 878, 1094], ['D', 1107, 1391], ['D', 1442, 1700], ['D', 1712, 1940], ['D', 1982, 2269], ['D', 2311, 2614], ['D', 2653, 2901], ['D', 2916, 3063], ['A', 3120, 3191], ['D', 3281, 3344]];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 3400;
const SH = [['wide', 0, 77], ['med', 78, 260], ['close', 261, 375], ['crowd', 376, 416], ['side', 417, 572], ['crowd', 573, 610],
  ['med', 611, 760], ['close', 761, 833], ['crowd', 834, 877], ['side', 878, 1094], ['med', 1095, 1300], ['close', 1301, 1391], ['crowd', 1392, 1441],
  ['med2', 1442, 1711], ['close', 1712, 1940], ['crowd', 1941, 1981], ['side', 1982, 2269], ['crowd', 2270, 2310],
  ['med', 2311, 2540], ['close', 2541, 2652], ['med2', 2653, 2840], ['aud', 2841, 2915], ['two', 2916, 3063],
  ['asep', 3064, 3250], ['shockD', 3251, 3360], ['end', 3361, 3399]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'stage' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { stage: { az: 95, el: 52, sky: '#7a6a8a', ground: '#2a1a24', hemi: 0.8, sun: '#fff0dc', sunI: 3.2, fog: '#160c1a', fogNear: 14, fogFar: 60,
  skyTop: '#0c0814', skyHor: '#1a1020', sat: 1.15, vig: 0.4, shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const DAR = [0, 0.5, 0], ASP = [1.2, 0, 3.0];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([0, 2.4, 9.0], [0, 1.6, 0.5], 46) }, { f: 77, ...K([0, 2.4, 8.5], [0, 1.6, 0.5], 46) }],
  med: [{ f: 0, ...K([0, 2.1, 3.9], [0, 1.95, 0], 42) }, { f: 300, ...K([0, 2.1, 3.5], [0, 1.97, 0], 42) }],
  close: [{ f: 0, ...K([0, 2.15, 3.0], [0, 2.05, 0], 40) }, { f: 300, ...K([0, 2.15, 2.6], [0, 2.08, 0], 40) }],
  side: [{ f: 0, ...K([1.5, 2.0, 3.6], [0, 1.95, 0], 42) }, { f: 300, ...K([1.3, 2.0, 3.3], [0, 1.95, 0], 42) }],
  med2: [{ f: 0, ...K([-1.2, 2.1, 4.0], [0, 1.9, 0], 42) }, { f: 300, ...K([-1.0, 2.1, 3.7], [0, 1.92, 0], 42) }],
  crowd: [{ f: 0, ...K([0.3, 2.7, 0.9], [1.3, 0.9, 4.2], 54) }, { f: 60, ...K([0.38, 2.65, 1.05], [1.32, 0.9, 4.2], 54) }],
  aud: [{ f: 0, ...K([0.6, 1.8, 1.0], [1.2, 1.2, 3.0], 46) }, { f: 75, ...K([0.75, 1.75, 1.4], [1.2, 1.35, 3.0], 46) }],
  two: [{ f: 0, ...K([3.0, 1.9, 5.8], [0.7, 1.5, 1.4], 46) }, { f: 148, ...K([2.8, 1.9, 5.3], [0.7, 1.5, 1.4], 46) }],
  asep: [{ f: 0, ...K([0.75, 1.95, 0.7], [1.2, 1.62, 3.0], 54) }, { f: 186, ...K([0.85, 1.92, 1.1], [1.2, 1.62, 3.0], 54) }],
  shockD: [{ f: 0, ...K([0, 2.15, 2.9], [0, 2.05, 0], 40) }, { f: 110, ...K([0, 2.15, 2.4], [0, 2.08, 0], 40) }],
  end: [{ f: 0, ...K([2.6, 2.2, 7.0], [0.6, 1.4, 1.5], 46) }, { f: 39, ...K([2.6, 2.3, 7.6], [0.6, 1.45, 1.5], 47) }],
};
const KICKS = [{ f: 2584, a: 0.03 }, { f: 3151, a: 0.035 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 3 && S.a > 0 ? 0.25 * (1 - (f - S.a) / 3) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
const LAUGH = [[375, 430, 1], [572, 615, 0.8], [833, 885, 1], [1391, 1450, 1], [1940, 1990, 1], [2269, 2318, 0.8], [2614, 2655, 0.6], [3191, 3285, 1.4], [3344, 3399, 1]];
const laughAt = (f) => { let v = 0; for (const [a, b, k] of LAUGH) if (f >= a && f <= b) v = Math.max(v, k * Math.min(1, (f - a) / 6, (b - f) / 10 + 0.2)); return q(v, 2); };
export const worldAt = (f) => ({ curtain: q(smooth(ramp(f, 4, 44)), 3), laugh: laughAt(f) });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const darPose = (f) => {
  const L = LAUGH.find(([a, b]) => f >= a && f <= b);
  if (f >= 3251) return f < 3281 ? { L: 'hang', R: 'mic', expr: 'shock', blink: 0 } : { L: 'hang', R: 'hang', expr: f < 3345 ? 'cry' : 'sob' };
  if (f >= 3064) return { L: 'hang', R: 'mic', expr: f < 3120 ? 'smile' : 'smile_closed' };
  if (f >= 2916) return { L: 'point', R: 'mic', expr: 'grin', facing: 1, look: 1 };
  if (f >= 2653) return { L: f > 2840 ? 'point' : 'hip', R: 'mic', expr: 'grin', facing: f > 2820 ? 1 : 0, look: f > 2820 ? 1 : 0 };
  if (f >= 2540 && f < 2614) return { L: 'point', R: 'mic', expr: 'stubborn', shake: 1 };
  if (L) return { L: 'belly', R: 'mic', expr: 'laugh', shake: 1 };
  if (f < 78) return { L: 'up', R: 'mic', expr: 'grin' };
  const beat = Math.floor(f / 90) % 4;
  const Ls = ['hang', 'shrug', 'hip', 'point'][beat];
  if (f >= 761 && f < 833) return { L: 'shrug', R: 'mic', expr: 'smile' };
  if (f >= 1301 && f < 1391) return { L: 'temple', R: 'mic', expr: 'nervous' };
  if (f >= 1850 && f < 1940) return { L: 'pray', R: 'mic', expr: 'smile_closed' };
  if (f >= 2050 && f < 2150) return { L: 'cheek', R: 'mic', expr: 'smile' };
  if (f >= 2200 && f < 2269) return { L: 'hang', R: 'mic', expr: 'squint' };
  if (f >= 950 && f < 1094) return { L: 'point', R: 'mic', expr: 'stubborn' };
  return { L: Ls, R: 'mic', expr: beat % 2 ? 'smile' : 'grin' };
};
const aspPose = (f) => {
  const L = LAUGH.find(([a, b]) => f >= a && f <= b);
  if (f >= 3192) return { L: 'hang', R: 'hang', expr: 'smile_closed' };
  if (f >= 3120) return { L: 'hang', R: 'hang', expr: 'nervous' };
  if (f >= 2916) return { L: 'hang', R: 'hang', expr: 'nervous', facing: f % 70 < 35 ? 1 : -1, look: f % 70 < 35 ? 1 : -1 };
  if (f >= 2850) return { L: 'hang', R: 'hang', expr: 'shock', blink: 0 };
  if (L && f < 2600) return { L: 'belly', R: 'hang', expr: 'laugh', shake: 1 };
  if (f >= 2541 && f < 2652) return { L: 'hang', R: 'hang', expr: 'nervous' };
  return { L: 'hang', R: 'hang', expr: 'smile' };
};
export const actorsAt = (f, T) => {
  const out = [], i = idle(f, 5), j = idle(f, 2), sid = shotAt(f).id;
  { const { shake, ...o } = darPose(f), tilt = shake ? sway(f, 5, 0.55) : 0;
    out.push(R(T, 'darman', { seed: 2, blink: o.blink ?? blinkAt(f, 2), ...o, expr: talk(f, 'D', o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q(i.headTilt, 1) }, DAR, { ground: 0.5 })); }
  if (sid !== 'wide') { const { shake, ...o } = aspPose(f), tilt = shake ? sway(f, 6, 0.6) : 0;
    const rise = q(smooth(ramp(f, 2868, 2890)), 3), y = q(-0.48 * (1 - rise), 3);
    out.push(R(T, 'sarung', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, expr: talk(f, 'A', o.expr), bob: q(j.bob, 3), tilt: q(j.tilt + tilt, 1), headTilt: q(j.headTilt, 1) }, [ASP[0], y, ASP[2]], { ground: 0 })); }
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
  ['name', 90, 240, 'PAK DARMAN', 'BAPAKNYA ASEP', '#ffffff'],
  ['ngitung', 343, 412, 'NGGAK BISA NGITUNG', '', '#ffd84a'],
  ['remed', 531, 608, 'SERING REMEDIAL', '', '#ffd84a'],
  ['soal', 640, 770, '5 − 7 = ?', 'KATA BU GURU', '#ffffff'],
  ['kurang', 781, 875, 'UANGNYA KURANG!', '', '#ffd84a'],
  ['bukan', 990, 1100, 'NILAI JELEK', 'BUKAN ANAK BAPAK!', '#ffffff'],
  ['empat', 1150, 1300, 'NILAI MATEMATIKA: 4', '', '#ffffff', '#c0302c'],
  ['rs', 1326, 1440, 'NGAMBIL ANAK DI RS MANA?', '', '#ffd84a'],
  ['permen', 1560, 1705, 'PERMEN = Rp100.000', '', '#ffffff'],
  ['ikhlas', 1880, 1980, 'KEMBALIAN? IKHLAS', '', '#ffd84a'],
  ['tujuh', 2090, 2200, 'ISTRI UMUR 17?!', 'UCAPAN ULANG TAHUN', '#ffffff'],
  ['curiga', 2240, 2308, 'DIA CURIGA', '', '#ffd84a'],
  ['aturan', 2480, 2650, 'NILAI DI BAWAH 70', 'JANGAN PANGGIL BAPAK!', '#ffffff'],
  ['berdiri', 2850, 2914, 'ASEP! BERDIRI!', '', '#ffd84a'],
  ['berapa', 3000, 3118, 'NILAI ASEP BERAPA?', '', '#ffffff'],
  ['siapa', 3151, 3280, 'BAPAK SIAPA YA?', '', '#ffd84a', '#1a1220', 1.25],
  ['nurut', 3290, 3400, 'TERNYATA DIA NURUT', 'MALAM KOMEDI', '#ffffff'],
];
export const fxAt = (f, T) => {
  const out = [];
  const card = (key, a, b_, draw, posf, s = 0.3, roll = 0, order = 9) => { if (f < a || f >= b_) return; const k = q(Math.min(pop(f, a), out_(f, b_)), 2); if (k > 0.01) out.push(FXC(key + k, scaled(k, draw), posf(f), s, { roll, order })); };
  if (f < 78) { const k = q(f < 1 ? 1 : out_(f, 78), 2); out.push(FXC('hook' + k, scaled(k, (p) => T.fxPop(p, 'STAND UP BAPAKNYA ASEP', 'MALAM KOMEDI', '#ffd84a')), camRel(f, 0.12, 1.1, 0.34), 0.34, { order: 10 })); }
  for (const [key, a, b_, t, sub, bg, fg = '#1a1220', big = 1] of POPS) { const s = q(0.3 * big, 3);
    card(key, a, b_, (p) => T.fxPop(p, t, sub, bg, fg), (f_) => camRel(f_, 0.235, 1.1, s), s, 0); }
  for (const [a, , k] of LAUGH) if (f >= a && f < a + 40 && k >= 0.8) { const t = q(ramp(f, a, a + 18), 2); out.push(FXC('haha' + a + t, (p) => T.fxHaha(p, t), camRel(f, -0.12, 1.1, 0.16, 0.1), 0.16, { order: 8 })); }
  return out;
};
