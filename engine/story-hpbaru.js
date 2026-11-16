// "Handphone Baru" — Asep (Fenrir) & Ucup (Puck), operator (Kore). 93 s, depan rumah x=240 + flashback genteng malam.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['A', 6, 76], ['U', 85, 169], ['A', 178, 302], ['U', 312, 589], ['A', 610, 711], ['U', 720, 769], ['A', 778, 878], ['U', 888, 902], ['A', 911, 1033], ['U', 1057, 1175], ['A', 1185, 1335], ['U', 1344, 1391], ['A', 1400, 1516], ['U', 1541, 1676], ['A', 1686, 1716], ['U', 1725, 1940], ['A', 1964, 2089], ['U', 2099, 2135], ['A', 2145, 2238], ['U', 2254, 2355], ['H', 2395, 2474], ['U', 2488, 2500], ['A', 2504, 2515], ['U', 2528, 2640], ['A', 2649, 2709]];
const speaker = (f) => { const l = LINES.find(([, a, b]) => f >= a - 2 && f <= b + 2); return l ? l[0] : null; };
const talk = (f, who, expr) => { if (speaker(f) !== who) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 2790;
export const SHOTS = [
  ['wide', 0, 84], ['uc', 85, 177], ['two', 178, 311], ['uc', 312, 609], ['as', 610, 719], ['uc', 720, 777], ['as', 778, 910],
  ['roof', 911, 1056, 'night'], ['uc', 1057, 1184], ['two', 1185, 1343], ['uc', 1344, 1399], ['as', 1400, 1540], ['uc', 1541, 1685],
  ['as', 1686, 1724], ['uc', 1725, 1963], ['as', 1964, 2098], ['uc', 2099, 2144], ['as', 2145, 2253], ['two', 2254, 2394],
  ['two2', 2395, 2527], ['uc', 2528, 2648], ['end', 2649, 2789],
].map(([id, a, b, light = 'day']) => ({ id, a, b, light }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = {
  day: { az: 90, el: 40, sky: '#e6f2ff', ground: '#8a9a6a', hemi: 1.35, sun: '#fff2dc', sunI: 2.5, fog: '#d8ecff', fogNear: 40, fogFar: 220,
    skyTop: '#4a9fe6', skyHor: '#d4ecff', sat: 1.12, vig: 0.18, shadowExt: 12 },
  night: { az: 60, el: 40, sky: '#4a5a9a', ground: '#1a2030', hemi: 0.75, sun: '#b4c8ff', sunI: 1.4, fog: '#0e1838', fogNear: 40, fogFar: 260,
    skyTop: '#040820', skyHor: '#1c2c5c', sunDisc: '#fff6d0', sunSize: 0.0025, sat: 1.05, vig: 0.38, gain: '#e4ecff', shadowExt: 12 },
};
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
export const RX = -40, SX = 80;
const HR = 240;
const UC = [HR - 0.55, 0.5, 0.6], AS0 = [HR + 0.62, 0.5, 0.95], ROOF = [HR + 0.6, 5.42, -3.05];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([HR + 0.2, 2.5, 8.2], [HR + 0.2, 2.0, 0.5], 46) }, { f: 85, ...K([HR + 0.2, 2.4, 7.4], [HR + 0.2, 1.95, 0.5], 46) }],
  uc: [{ f: 0, ...K([UC[0] + 0.05, 2.15, 3.6], [UC[0], 2.0, UC[2]], 40) }, { f: 400, ...K([UC[0] + 0.05, 2.15, 3.2], [UC[0], 2.02, UC[2]], 40) }],
  as: [{ f: 0, ...K([AS0[0] - 0.05, 2.15, 3.9], [AS0[0], 2.0, AS0[2]], 40) }, { f: 400, ...K([AS0[0] - 0.05, 2.15, 3.5], [AS0[0], 2.02, AS0[2]], 40) }],
  two: [{ f: 0, ...K([HR + 0.05, 2.3, 7.4], [HR + 0.05, 1.9, 0.7], 42) }, { f: 400, ...K([HR + 0.05, 2.3, 6.9], [HR + 0.05, 1.92, 0.7], 42) }],
  two2: [{ f: 0, ...K([HR + 0.05, 2.25, 6.6], [HR + 0.05, 1.9, 0.7], 42) }, { f: 133, ...K([HR + 0.05, 2.25, 6.2], [HR + 0.05, 1.92, 0.7], 42) }],
  roof: [{ f: 0, ...K([HR + 0.5, 4.9, 3.6], [HR + 0.6, 6.3, -3.0], 46) }, { f: 146, ...K([HR + 0.5, 5.2, 2.6], [HR + 0.6, 6.4, -3.0], 44) }],
  end: [{ f: 0, ...K([HR + 0.2, 2.4, 6.0], [HR + 0.2, 1.95, 0.6], 44) }, { f: 141, ...K([HR + 0.2, 2.6, 7.8], [HR + 0.2, 2.1, 0.6], 46) }],
};
const KICKS = [{ f: 560, a: 0.02 }, { f: 960, a: 0.02 }, { f: 1440, a: 0.02 }, { f: 1830, a: 0.025 }, { f: 2395, a: 0.03 }, { f: 2490, a: 0.035 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 3 && S.a > 0 ? 0.25 * (1 - (f - S.a) / 3) : 0;
  if (S.id === 'roof' && f < S.a + 6) c.flash = 0.6 * (1 - (f - S.a) / 6); return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
export const worldAt = (f) => ({ curtain: 1, night: shotAt(f).light === 'night' });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const asPose = (f) => {
  if (f < 60) return { L: 'hang', R: 'point', expr: 'shock', facing: -1, look: -1, step: q((f * 0.045) % 1, 2) };
  if (f < 178) return { L: 'hip', R: 'point', expr: 'squint', facing: -1, look: -1 };
  if (f < 312) return { L: 'hip', R: 'phone', expr: 'stubborn', facing: -1, look: -1 };
  if (f < 610) return { L: 'cross', R: 'cross', expr: f > 560 ? 'shock' : 'squint', facing: -1, look: -1 };
  if (f < 778) return { L: 'hang', R: 'cheek', expr: 'nervous' };
  if (f < 911) return { L: 'hang', R: 'phone', expr: f > 840 ? 'nervous' : 'stubborn', facing: -1, look: -1 };
  if (f < 1057) return { L: 'up', R: 'up', expr: f > 990 ? 'grin' : 'smile', look: 0, wave: 1 };
  if (f < 1185) return { L: 'hang', R: 'hang', expr: 'smile', facing: -1, look: -1 };
  if (f < 1344) return { L: 'hip', R: 'phone', expr: 'stubborn', facing: -1, look: -1 };
  if (f < 1400) return { L: 'hang', R: 'hang', expr: 'grin', facing: -1, look: -1 };
  if (f < 1541) return { L: 'shrug', R: 'shrug', expr: f > 1460 ? 'stubborn' : 'grin', shake: f > 1460 ? 1 : 0 };
  if (f < 1686) return { L: 'cross', R: 'cross', expr: 'squint', facing: -1, look: -1 };
  if (f < 1725) return { L: 'hip', R: 'point', expr: 'grin', facing: -1, look: -1 };
  if (f < 1964) return { L: 'hang', R: 'hang', expr: f > 1880 ? 'shock' : 'squint', facing: -1, look: -1, blink: f > 1880 ? 0 : undefined };
  if (f < 2099) return { L: 'hang', R: 'up', expr: 'squint', facing: -1, look: -1 };
  if (f < 2145) return { L: 'hang', R: 'hang', expr: 'squint', facing: -1, look: -1 };
  if (f < 2254) return { L: 'hip', R: 'lift', expr: 'grin', facing: -1, look: -1 };
  if (f < 2395) return { L: 'hang', R: 'thumb', expr: 'smile', facing: -1, look: -1 };
  if (f < 2528) return { L: 'hang', R: 'hang', expr: 'shock', facing: -1, look: -1, blink: 0 };
  if (f < 2649) return { L: 'hang', R: 'hang', expr: 'shock', facing: -1, look: -1 };
  return { L: 'up', R: 'phone', expr: 'grin', facing: 1, look: 1, step: f > 2690 ? q((f * 0.07) % 1, 2) : 0 };
};
const ucPose = (f) => {
  if (f < 85) return { L: 'reach', R: 'phone', expr: 'nervous', lift: 0 };
  if (f < 178) return { L: 'reach', R: 'phone', expr: 'smile', facing: 1, look: 1 };
  if (f < 312) return { L: 'reach', R: 'phone', expr: 'nervous', facing: 1, look: 1 };
  if (f < 610) return { L: 'reach', R: 'reach', expr: f > 500 ? 'cry' : 'stubborn', shake: 1, lift: q(0.2 + 0.2 * Math.sin(f * 0.4), 1) };
  if (f < 720) return { L: 'hang', R: 'phone', expr: 'nervous', facing: 1, look: 1 };
  if (f < 778) return { L: 'hang', R: 'shrug', expr: 'smile', facing: 1, look: 1 };
  if (f < 1057) return { L: 'hang', R: 'phone', expr: 'shock', facing: 1, look: 1 };
  if (f < 1185) return { L: 'cheek', R: 'cheek', expr: f < 1100 ? 'shock' : 'cry', facing: 1, look: 1 };
  if (f < 1344) return { L: 'hang', R: 'phone', expr: 'nervous', facing: 1, look: 1 };
  if (f < 1400) return { L: 'hang', R: 'shrug', expr: 'smile', facing: 1, look: 1 };
  if (f < 1541) return { L: 'hang', R: 'hang', expr: f > 1470 ? 'shock' : 'nervous', facing: 1, look: 1 };
  if (f < 1686) return { L: 'hang', R: 'phone', expr: 'nervous', facing: 1, look: 1 };
  if (f < 1725) return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1 };
  if (f < 1964) return { L: 'shrug', R: 'shrug', expr: f > 1840 ? 'cry' : 'stubborn', shake: 1 };
  if (f < 2099) return { L: 'hang', R: 'phone', expr: 'shock', facing: 1, look: 1, blink: 0 };
  if (f < 2145) return { L: 'hang', R: 'cheek', expr: 'nervous', facing: 1, look: 1 };
  if (f < 2254) return { L: 'hang', R: 'hang', expr: 'shock', facing: 1, look: 1 };
  if (f < 2356) return { L: 'reach', R: 'thumb', expr: 'grin', lift: 0 };
  if (f < 2395) return { L: 'hang', R: 'phone', expr: 'shock', blink: 0 };
  if (f < 2528) return { L: 'hang', R: 'phone', expr: 'shock', facing: 1, look: 1, blink: 0 };
  if (f < 2649) return { L: 'hang', R: 'point', expr: 'grin', facing: 1, look: 1 };
  return { L: 'belly', R: 'cheek', expr: 'laugh', shake: 1 };
};
export const actorsAt = (f, T) => {
  const out = [], i = idle(f, 5), j = idle(f, 2), roof = shotAt(f).id === 'roof';
  { const { shake, ...o } = ucPose(f), tilt = shake ? sway(f, 6, 0.5) : 0;
    out.push(R(T, 'santai', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, expr: talk(f, 'U', o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q(i.headTilt, 1) }, UC, { ground: 0.5 })); }
  { const { shake, wave, ...o } = asPose(f), tilt = shake ? sway(f, 6, 0.55) : wave ? sway(f, 5, 0.12) : 0;
    let pos = AS0;
    if (roof) pos = ROOF;
    else if (f < 60) pos = [q(lerp(HR + 3.6, AS0[0], smooth(clamp(f / 60))), 3), AS0[1], AS0[2]];
    else if (f > 2690) pos = [q(AS0[0] + (f - 2690) * 0.045, 3), AS0[1] + q(Math.abs(Math.sin(f * 0.35)) * 0.08, 3), AS0[2]];
    out.push(R(T, 'teman', { seed: 2, blink: o.blink ?? blinkAt(f, 2), ...o, expr: talk(f, 'A', o.expr), bob: q(j.bob, 3), tilt: q(j.tilt + tilt, 1), headTilt: q(j.headTilt, 1) }, pos, { ground: pos[1] })); }
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
  const note = (key, a, b_, text, col, roll = -0.03) => card(key, a, b_, (p) => T.fxNoteCard(p, text, col), top(0.32), 0.2, roll);
  const shout = (key, a, b_, text, col, size, dy = 0.3) => card(key, a, b_, (p) => T.fxShout(p, text, col, size), top(dy), 0.22, -0.04);
  if (f < 84) { const k = q((f < 1 ? 1 : 1 + 0.03 * Math.sin(f * 0.5)) * out_(f, 84), 2); out.push(FXC('hook' + k, scaled(k, (p) => T.fxHook(p, 'HANDPHONE BARU', 'ASEP & UCUP GAPTEK')), camRel(f, 0.24, 1.1, 0.3), 0.3, { order: 10 })); }
  note('pulsa', 100, 177, 'MAU ISI PULSA', '#e0f4ff');
  shout('pagar', 380, 609, 'TEKAN PAGAR (#)', '#ffd84a', 54);
  shout('bintang', 820, 910, 'TEKAN BINTANG (*)', '#ffd84a', 50);
  note('semalam', 950, 1056, 'NUNGGU BINTANG TURUN', '#fff8d8');
  note('bat', 1230, 1343, 'BATERAI LEMAH', '#ffe0e0', 0.03);
  card('uduk', 1440, 1540, (p) => T.fxUduk(p), (f_) => camRel(f_, 0.2, 1.1, 0.2, -0.05), 0.2, -0.05);
  note('geser', 1580, 1685, 'GESER UNTUK MEMBUKA', '#e0f4ff');
  note('kulkas', 1820, 1963, 'LEMARI, KASUR, KULKAS', '#fff8d8', 0.03);
  note('pesawat', 2000, 2098, 'MODE PESAWAT ✈', '#ffe0e0');
  note('rafia', 2170, 2253, 'DIIKAT TALI RAFIA', '#fff8d8', 0.03);
  if (f >= 2356 && f < 2395) { const t = q((f % 8) / 8, 1); out.push(FXC('ring' + t, (p) => T.fxPhoneMsg(p, 'KRING!', 'SMS MASUK', 1 + t), camRel(f, 0.15, 1.1, 0.2, -0.04), 0.2, { order: 9 })); }
  card('sms', 2395, 2487, (p) => T.fxPhoneMsg(p, 'BERHASIL ✔', 'Pulsa diisi'), (f_) => camRel(f_, 0.18, 1.1, 0.2), 0.2, 0.03);
  shout('lho', 2488, 2527, 'LHO?!', '#ff8ac8', 110);
  shout('bintang2', 2660, 2789, 'IKET KE BINTANG!', '#ffd84a', 50);
  for (const a of [2560, 2720]) if (f >= a && f < a + 40) { const t = q(ramp(f, a, a + 18), 2); out.push(FXC('haha' + a + t, (p) => T.fxHaha(p, t), camRel(f, -0.02, 1.1, 0.16, 0.06), 0.16, { order: 9 })); }
  return out;
};
