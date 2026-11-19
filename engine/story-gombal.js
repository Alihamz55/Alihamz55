// "Battle Gombal: Asep vs Ucup" -- pos ronda (x=120) malam. Kostum baru: asepKlimis, ucupRonda, nengDress (earphone), darmanHansip.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
export const TOTAL = 1410;
const LINES = [['A', 9, 95], ['U', 100, 135], ['A', 146, 292], ['U', 295, 314], ['A', 318, 439], ['U', 452, 557], ['A', 560, 579], ['U', 584, 700], ['U', 714, 798], ['A', 801, 823], ['U', 827, 878], ['B', 893, 928], ['N', 940, 1053], ['N', 1080, 1171], ['D', 1204, 1355]];
const TXT = ['CUP! YANG GOMBALANNYA PALING MAUT, DAPET HATI NENG!', 'S-SIAP!', 'NENG, KAMU TAU GAK BEDANYA KAMU SAMA SINYAL DI KAMPUNG?', 'APA?', 'SINYAL SUSAH DICARI... KALAU NENG, SUSAH DILUPAIN.',
  'NENG, KAMU TAU GAK KENAPA UCUP PENAKUT?', 'KENAPA?', 'SOALNYA UCUP TAKUT... KEHILANGAN KAMU.', 'NENG, KAMU TAU GAK UCUP BERANI APA DEMI KAMU?', 'APA?', 'RONDA... SENDIRIAN!', 'GIMANA, NENG?',
  'HAH? KALIAN NGOMONG APA? AKU LAGI DENGERIN PODCAST HOROR.', 'TERUS... YANG DARI TADI JAWAB "APA", SIAPA?', 'BAGUS, CUP! KATANYA BERANI RONDA SENDIRIAN. MALAM INI KAMU JAGA!'];
const speaks = (f, who) => LINES.some(([w, a, b]) => (w === who || (w === 'B' && (who === 'A' || who === 'U'))) && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
const SH = [['wide', 0, 99], ['ucup', 100, 145], ['asepN', 146, 294], ['ucup', 295, 317], ['asepN', 318, 451], ['ucupN', 452, 559], ['asep', 560, 583], ['ucupN', 584, 713],
  ['ucupN', 714, 800], ['asep', 801, 826], ['ucupLow', 827, 892], ['wide', 893, 939], ['neng', 940, 1171], ['wide', 1172, 1203], ['wide2', 1204, 1409]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'night' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = { night: { az: 60, el: 46, sky: '#9aa0c8', ground: '#3a3438', hemi: 1.1, sun: '#ffe2b8', sunI: 2.1, fog: '#121a38', fogNear: 30, fogFar: 160,
  skyTop: '#050820', skyHor: '#1c2858', sat: 1.08, vig: 0.38, shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const PX = 120;
const AS = [PX - 2.62, 0.5, 0.15], NG = [PX - 1.95, 0.5, -0.25], UC = [PX - 1.28, 0.5, 0.15], DM0 = [PX + 2.2, 0.5, 0.3], DM = [PX - 0.35, 0.5, 0.3];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 38, dx = 0) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0] + dx, h + 0.12, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.85], [P[0] + dx, h + 0.13, P[2]], fov) }];
const CAMS = {
  wide: [{ f: 0, ...K([PX - 1.95, 1.9, 6.0], [PX - 1.95, 1.95, 0], 42) }, { f: 100, ...K([PX - 1.95, 1.9, 5.6], [PX - 1.95, 1.97, 0], 42) }],
  wide2: [{ f: 0, ...K([PX - 1.6, 1.9, 6.2], [PX - 1.5, 1.95, 0], 44) }, { f: 200, ...K([PX - 1.55, 1.9, 5.8], [PX - 1.45, 1.97, 0], 44) }],
  two: [{ f: 0, ...K([PX - 1.95, 1.95, 3.6], [PX - 1.95, 2.05, 0], 40) }, { f: 30, ...K([PX - 1.95, 1.95, 3.4], [PX - 1.95, 2.05, 0], 40) }],
  asep: cu(AS, 1.95, 2.4, -0.35), ucup: cu(UC, 1.95, 2.4, 0.35), neng: cu(NG, 1.95, 2.3, 0.2),
  asepN: cu([(AS[0] + NG[0]) / 2, 0.5, 0], 1.95, 3.5, -0.25, 44), ucupN: cu([(UC[0] + NG[0]) / 2, 0.5, 0], 1.95, 3.5, 0.25, 44),
  ucupLow: [{ f: 0, ...K([UC[0] + 0.3, 1.05, UC[2] + 2.3], [UC[0], 2.2, UC[2]], 44) }, { f: 65, ...K([UC[0] + 0.25, 1.05, UC[2] + 2.0], [UC[0], 2.25, UC[2]], 44) }],
};
const KICKS = [{ f: 9, a: 0.03 }, { f: 380, a: 0.04 }, { f: 640, a: 0.04 }, { f: 860, a: 0.06 }, { f: 945, a: 0.09 }, { f: 1080, a: 0.04 }, { f: 1300, a: 0.05 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: id.startsWith('wide') ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const AWK = 1172; // saling menoleh, mundur selangkah
const asPose = (f) => {
  if (f < 146) return { L: 'hip', R: 'point', expr: 'grin', facing: 1, look: 1 };
  if (f < 452) return { L: 'hang', R: f > 318 ? 'cheek' : 'hip', expr: 'smile_closed', facing: 1, look: 1, headTilt: 8, tilt: 5 };
  if (f < 893) return { L: 'cross', R: 'cross', expr: f >= 560 && f < 584 || f >= 801 && f < 827 ? 'neutral' : 'squint', facing: 1, look: 1 };
  if (f < 940) return { L: 'pray', R: 'pray', expr: 'smile', facing: 1, look: 1 };
  if (f < AWK) return { L: 'hang', R: 'hang', expr: f < 1080 ? 'shock' : 'nervous', facing: 1, look: 1, blink: f < 1000 ? 0 : undefined };
  if (f < 1204) return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1, sweat: 1, dx: -0.25 * M.smooth(ramp(f, 1185, 1200)) };
  return { L: 'temple', R: 'hang', expr: 'nervous', facing: 1, look: 1, dx: -0.25, sweat: 1 };
};
const ucPose = (f) => {
  if (f < 146) return { L: 'shrug', R: 'shrug', expr: 'nervous', facing: -1, look: -1, shake: 1, sweat: 1 };
  if (f < 452) return { L: 'cross', R: 'cross', expr: f >= 295 && f < 318 ? 'neutral' : 'squint', facing: -1, look: -1 };
  if (f < 714) return { L: 'pray', R: 'hang', expr: 'smile_closed', facing: -1, look: -1, headTilt: -8, tilt: -5 };
  if (f < 893) return { L: 'hip', R: f >= 827 ? 'up' : 'hip', expr: 'grin', facing: -1, look: -1 };
  if (f < 940) return { L: 'pray', R: 'pray', expr: 'smile', facing: -1, look: -1 };
  if (f < AWK) return { L: 'hang', R: 'hang', expr: f < 1080 ? 'shock' : 'nervous', facing: -1, look: -1, blink: f < 1000 ? 0 : undefined };
  if (f < 1204) return { L: 'hang', R: 'hang', expr: 'nervous', facing: -1, look: -1, sweat: 1, dx: 0.25 * M.smooth(ramp(f, 1185, 1200)) };
  if (f < 1356) return { L: 'shrug', R: 'shrug', expr: 'shock', facing: -1, look: -1, dx: 0.25, shake: f > 1290, blink: 0 };
  return { L: 'up', R: 'up', expr: 'shock', facing: 0, look: 0, dx: 0.25, tilt: 80 * M.smooth(ramp(f, 1356, 1366)), bob: -0.25 * M.smooth(ramp(f, 1356, 1366)), blink: 1 };
};
const ngPose = (f) => {
  const ear = f < 935;
  if (f < 935) return { L: 'hang', R: 'hang', expr: 'smile_closed', facing: 0, look: 0, headTilt: sway(f, 4, 0.12), blink: 1 };
  if (f < 960) return { L: 'cheek', R: 'hang', expr: 'neutral', facing: 0, look: 0, noEar: 1 };
  return { L: 'hang', R: f >= 1080 && f < 1171 ? 'point' : 'hang', expr: 'neutral', facing: f >= 1080 ? 1 : 0, look: f >= 1080 ? 1 : 0, noEar: 1 };
};
const dmPose = (f) => { if (f < 1180) return null; const w = ramp(f, 1180, 1225), walk = f < 1225 ? (f / 30) % 1 : null;
  return { L: walk !== null ? 'swing' : f > 1300 ? 'hip' : 'up', R: walk !== null ? 'swing' : 'point', walk, expr: 'grin', facing: -1, look: -1, dx: lerp(DM0[0], DM[0], M.smooth(w)) - DM[0] }; };
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, dx, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, [pos[0] + (dx || 0), pos[1], pos[2]], { ground: 0.5 })); };
  add('asepKlimis', asPose, 5, AS, 'A'); add('nengDress', ngPose, 2, NG, 'N'); add('ucupRonda', ucPose, 7, UC, 'U'); add('darmanHansip', dmPose, 8, DM, 'D');
  return out;
};
export const fxAt = () => [];

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[30, 99, 'BATTLE GOMBAL', '#ffe14a'], [380, 451, 'SUSAH DILUPAIN', '#ff6fae'], [640, 713, 'TAKUT KEHILANGAN', '#ff6fae'], [860, 892, 'RONDA SENDIRIAN', '#ffe14a'], [945, 1040, 'EARPHONE!', '#3a9bff']];
const score = (f) => [f >= 440 ? 1 : 0, (f >= 700 ? 1 : 0) + (f >= 878 ? 1 : 0)];
const SPK = { A: ['#2f9a5a', 'ASEP'], U: ['#e8742c', 'UCUP'], N: ['#ff6fae', 'NENG'], D: ['#a0522d', 'PAK DARMAN'], B: ['#8b5cf6', 'ASEP & UCUP'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  let s0 = 0, s1 = W.length; if (W.length > 8) { const i0 = Math.max(0, idx); s0 = Math.floor(i0 / 6) * 6; s1 = Math.min(W.length, s0 + 6); }
  const Wv = W.slice(s0, s1), rows = []; let cur = [], len = 0; Wv.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a: s0 ? st[s0] : a, rows, idx: idx - s0 }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  if (f >= 100 && f < 940) { const [a, u] = score(f), bump = [440, 700, 878].some((c) => f >= c && f < c + 8) ? 1.12 : 1;
    put(g, 540, 150, 1.25 * bump, pop(f, 100), (p) => T.fxBanner(p, `ASEP ${a} – ${u} UCUP`, '#14101a', '#ffe14a', false, f)); }
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 340, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  if (f >= 1366) put(g, 540, 300, 1.2, pop(f, 1366), (p) => T.fxRoundCard(p, 'PEMENANG:', 'EARPHONE', '#3a5bd9', Math.min(40, f - 1366)));
  const C_ = telop(f); if (C_ && f < 1366) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1550, 1.2, f < 1 ? 1 : pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
