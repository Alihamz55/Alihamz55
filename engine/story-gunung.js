// "Asep & Ucup Naik Gunung... Ketemu Pocong" -- fast-tempo Shorts with per-word captions. Perkemahan gunung (x=MX), malam.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['U', 12, 73], ['A', 79, 140], ['U', 145, 171], ['A', 175, 199], ['U', 205, 247], ['U', 274, 335], ['P', 342, 434], ['A', 437, 483], ['P', 490, 589], ['U', 594, 642], ['P', 650, 784], ['A', 795, 825], ['P', 832, 958], ['U', 979, 1045], ['A', 1051, 1123]];
const TXT = ['SEP... GUNUNG INI KATANYA ANGKER.', 'TENANG, CUP. GUE UDAH BACA DOA.', 'DOA APA?', 'DOA MAU MAKAN.', 'ITU MAH BUAT MAKAN, SEP!', 'S-SEP... DI BELAKANG LU...',
  'PERMISI, MAS. ADA COLOKAN?', 'PO-POCONG!', 'IYA. HP SAYA LOWBAT. MAU LIVE TIKTOK.', 'POCONG MAIN TIKTOK?!', 'FOLLOWERS SAYA SEJUTA. KALIAN BERAPA?', '...SERATUS.',
  'YA AMPUN. MENDING KALIAN YANG GENTAYANGAN.', 'SEP... KITA KALAH SAMA POCONG.', 'MAKANYA SUBSCRIBE! BIAR NGGAK KALAH SAMA POCONG!'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1194;
const SH = [['two', 0, 78], ['asep', 79, 144], ['ucup', 145, 174], ['asep', 175, 204], ['ucup', 205, 249], ['wide', 250, 273], ['ucup', 274, 341], ['pocong', 342, 436],
  ['asep', 437, 489], ['pocong', 490, 593], ['ucup', 594, 649], ['pocong', 650, 794], ['asep', 795, 831], ['three', 832, 958], ['wide', 959, 978], ['two', 979, 1050],
  ['asepCam', 1051, 1123], ['end', 1124, 1193]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'gunung' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { gunung: { az: 60, el: 40, sky: '#5a6aa8', ground: '#1a2030', hemi: 0.95, sun: '#b8c8ff', sunI: 1.5, fog: '#0e1636', fogNear: 14, fogFar: 95,
  skyTop: '#040820', skyHor: '#1c2c5c', sat: 1.08, vig: 0.4, gain: '#eef0ff', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const MX = 320;
const AS = [MX - 0.75, 0.5, 0.4], UC = [MX + 0.75, 0.5, 0.4], PC = [MX - 1.65, 0.5, -0.15];
const hop = (f, a) => 0.32 * Math.abs(Math.sin(Math.PI * (f - a) / 10));
const pcPos = (f) => {
  if (f < 250) return null;
  if (f < 300) return [lerp(MX - 4.2, PC[0], ramp(f, 250, 300)), PC[1] + hop(f, 250), PC[2]];
  if (f < 959) return [PC[0], PC[1] + (f % 90 < 10 ? hop(f, 0) * 0.4 : 0), PC[2]];
  if (f < 992) return [lerp(PC[0], MX - 5.5, ramp(f, 959, 992)), PC[1] + hop(f, 959), PC[2]];
  return null;
};
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  two: [{ f: 0, ...K([MX, 2.1, 4.8], [MX, 1.6, 0.0], 44) }, { f: 80, ...K([MX, 2.05, 4.3], [MX, 1.62, 0.0], 44) }],
  asep: [{ f: 0, ...K([AS[0], 2.1, 3.0], [AS[0], 1.95, AS[2]], 40) }, { f: 70, ...K([AS[0], 2.1, 2.6], [AS[0], 1.97, AS[2]], 40) }],
  ucup: [{ f: 0, ...K([UC[0], 2.1, 3.0], [UC[0], 1.95, UC[2]], 40) }, { f: 70, ...K([UC[0], 2.1, 2.6], [UC[0], 1.97, UC[2]], 40) }],
  pocong: [{ f: 0, ...K([PC[0] + 0.35, 2.05, 2.9], [PC[0], 1.9, PC[2]], 40) }, { f: 140, ...K([PC[0] + 0.3, 2.05, 2.4], [PC[0], 1.92, PC[2]], 40) }],
  wide: [{ f: 0, ...K([MX - 2.0, 2.4, 6.6], [MX - 2.0, 1.6, -0.3], 48) }, { f: 30, ...K([MX - 2.0, 2.35, 6.2], [MX - 2.0, 1.6, -0.3], 48) }],
  three: [{ f: 0, ...K([MX - 0.45, 2.2, 6.4], [MX - 0.45, 1.62, 0.0], 48) }, { f: 126, ...K([MX - 0.45, 2.2, 5.9], [MX - 0.45, 1.64, 0.0], 48) }],
  asepCam: [{ f: 0, ...K([AS[0], 1.98, 2.5], [AS[0], 1.98, AS[2]], 40) }, { f: 72, ...K([AS[0], 1.98, 2.1], [AS[0], 1.98, AS[2]], 40) }],
  end: [{ f: 0, ...K([MX - 0.2, 2.2, 4.8], [MX - 0.2, 1.65, 0.0], 46) }, { f: 70, ...K([MX - 0.3, 2.9, 7.6], [MX - 0.3, 1.8, -0.5], 48) }],
};
const KICKS = [{ f: 175, a: 0.035 }, { f: 437, a: 0.06 }, { f: 594, a: 0.04 }, { f: 795, a: 0.035 }, { f: 1051, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.12 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const AR = { facing: 1, look: 1 }, AL = { facing: -1, look: -1 }, UL = { facing: -1, look: -1 };
const asPose = (f) => {
  if (f < 79) return { L: 'cross', R: 'cross', expr: 'smile', ...AR };
  if (f < 145) return { L: 'hip', R: 'thumb', expr: 'grin', ...AR };
  if (f < 175) return { L: 'hip', R: 'hip', expr: 'smile', ...AR };
  if (f < 205) return { L: 'pray', R: 'pray', expr: 'smile_closed', ...AR };
  if (f < 274) return { L: 'hang', R: 'temple', expr: 'squint', ...AR };
  if (f < 342) return { L: 'cross', R: 'cross', expr: 'smile', ...AR };
  if (f < 437) return { L: 'cheek', R: 'hang', expr: 'squint', ...AR };
  if (f < 490) return { L: 'up', R: 'up', expr: 'shock', shake: 1, ...AL, blink: 0 };
  if (f < 650) return { L: 'temple', R: 'hang', expr: 'nervous', ...AL };
  if (f < 795) return { L: 'hang', R: 'hang', expr: 'squint', ...AL };
  if (f < 959) return { L: 'hang', R: 'hang', expr: f < 832 ? 'cry' : 'sob', ...AL };
  if (f < 1051) return { L: 'hang', R: 'hang', expr: 'nervous', ...AR };
  if (f < 1124) return { L: 'point', R: 'up', expr: 'grin', facing: 1, look: 0 };
  return { L: 'up', R: 'up', expr: 'laugh', facing: 1, look: 0 };
};
const ucPose = (f) => {
  if (f < 145) return { L: 'temple', R: 'hang', expr: 'nervous', ...UL };
  if (f < 205) return { L: 'hang', R: 'hang', expr: 'squint', ...UL };
  if (f < 250) return { L: 'point', R: 'hip', expr: 'stubborn', shake: 1, ...UL };
  if (f < 342) return { L: 'point', R: 'temple', expr: 'shock', ...UL, blink: 0 };
  if (f < 490) return { L: 'up', R: 'up', expr: 'shock', shake: 1, ...UL, blink: 0 };
  if (f < 594) return { L: 'temple', R: 'hang', expr: 'nervous', ...UL };
  if (f < 650) return { L: 'point', R: 'hip', expr: 'shock', ...UL };
  if (f < 959) return { L: 'cross', R: 'cross', expr: f < 795 ? 'squint' : 'nervous', ...UL };
  if (f < 979) return { L: 'up', R: 'hang', expr: 'shock', ...UL };
  if (f < 1051) return { L: 'hang', R: 'hang', expr: 'cry', ...UL };
  return { L: 'shrug', R: 'shrug', expr: 'smile', ...UL };
};
export const actorsAt = (f, T) => {
  const out = [], i = idle(f, 5), j = idle(f, 7);
  { const { shake, ...o } = asPose(f), tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, 'gunungA', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, expr: talk(f, 'A', o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, AS, { ground: 0.5 })); }
  { const { shake, ...o } = ucPose(f), tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, 'gunungU', { seed: 7, blink: o.blink ?? blinkAt(f, 7), ...o, expr: talk(f, 'U', o.expr), bob: q(j.bob, 3), tilt: q(j.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + j.headTilt, 1) }, UC, { ground: 0.5 })); }
  return out;
};

const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const scaled = (k, fn) => (pp) => { pp.g.translate(300, 500); pp.g.scale(k, k); pp.g.translate(-300, -500); fn(pp); };
const at = (x, yc, z, s) => [x, yc - 1.07 * s, z];
const camRel = (f, dy, d, s, dx = 0) => { const C = camAt(f), v = [C.look[0] - C.pos[0], C.look[1] - C.pos[1], C.look[2] - C.pos[2]], L = Math.hypot(...v);
  return at(C.pos[0] + v[0] / L * d + dx, C.pos[1] + v[1] / L * d + dy, C.pos[2] + v[2] / L * d, s); };
// ---- game-show telop kit (Lemo-Opuscar "game-show" style): judgement words, corner banners, round cards, speaker telops ----
const JUDGE = [[440, 492, 'POCONG!', '#ff5d8f'], [798, 834, 'SERATUS?!', '#ffe14a']];
const BANNERS = [[178, 249, 'DOA MAU MAKAN?!', '#ffb03a', '#ffffff', false], [540, 650, 'LIVE TIKTOK', '#e8344a', '#ffffff', true],
  [690, 796, 'FOLLOWERS: 1 JUTA', '#3fbf6a', '#ffffff', false], [836, 958, 'MALAM KOMEDI: 100', '#3a5bd9', '#ffffff', false]];
const SPK = { A: ['#2f9a5a', 'ASEP'], U: ['#ff6b3a', 'UCUP'], P: ['#8b5cf6', 'POCONG'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot && f <= b + 2) idx = k; acc += wt[k]; });
  const rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { n, who, a, rows, idx }; } return null; };
export const fxAt = (f, T) => {
  const out = [];
  out.push(FXC('fire' + (f % 24), (p) => T.fxFire(p, f), [MX, 0.5, -0.2], 0.42, { order: 2 }));
  { const P_ = pcPos(f); if (P_) { const sp = speaks(f, 'P'), m = sp ? +(LIPS[f] || 0) : 0, mood = f >= 650 && f < 959 ? 'smug' : f < 342 ? 'shock' : 'calm', bl = f % 100 > 95 ? 1 : 0;
    out.push(FXC('pc' + [m, mood, bl].join(), (p) => T.fxPocong(p, m, bl, mood), [q(P_[0], 3), q(P_[1], 3), P_[2]], 1.0, { order: 2 })); } }
  if (globalThis.__CLEAN !== false && globalThis.__CLEAN !== undefined) return out;
  const card = (key, a, b_, draw, posf, s = 0.3) => { if (f < a || f >= b_) return; const k = q(Math.min(pop(f, a), out_(f, b_)), 2); if (k > 0.01) out.push(FXC(key + k, scaled(k, draw), posf(f), s, { order: 9 })); };
  // round cards: opening title + closing call to action (glyph-by-glyph pop)
  if (f < 79) { const t = Math.min(40, f + 6), k = q(f < 1 ? 1 : out_(f, 79), 2); out.push(FXC('hook' + k + '_' + t + '_' + (f % 90), scaled(k, (p) => T.fxRoundCard(p, 'ASEP & UCUP NAIK GUNUNG', 'MALAM KOMEDI', '#ff6b3a', t)), camRel(f, 0.17, 1.1, 0.34), 0.34, { order: 10 })); }
  if (f >= 1124) { const t = Math.min(40, f - 1124), k = pop(f, 1124); out.push(FXC('end' + k + '_' + t + '_' + (f % 90), scaled(k, (p) => T.fxRoundCard(p, 'SUBSCRIBE!', 'BIAR NGGAK KALAH SAMA POCONG', '#e8344a', t)), camRel(f, 0.15, 1.1, 0.34), 0.34, { order: 10 })); }
  for (const [a, b_, t, fill] of JUDGE) card('j' + t + (f % 90), a, b_, (p) => T.fxJudge(p, t, fill, '#ffe14a', f), (f_) => camRel(f_, 0.27, 1.1, 0.27), 0.27);
  for (const [a, b_, t, hue, fg, dot] of BANNERS) card('b' + t + (dot ? f % 13 : ''), a, b_, (p) => T.fxBanner(p, t, hue, fg, dot, f), (f_) => camRel(f_, 0.31, 1.1, 0.27), 0.27);
  // speaker telop at the bottom (inside the Shorts safe zone)
  const C_ = telop(f); if (C_ && f < 1124) { const [hue, nm] = SPK[C_.who], k = pop(f, C_.a - 1, 5);
    out.push(FXC('tel' + C_.n + '_' + C_.idx + '_' + k, scaled(k, (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)), camRel(f, -0.14, 1.1, 0.3), 0.3, { order: 11 })); }
  return out;
};
