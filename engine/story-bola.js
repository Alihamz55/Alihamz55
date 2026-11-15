// "Adik Nggak Mau Tidur Sebelum Gol" -- Ibu (tante) + adik bayi + Asep (sarung) + Pak Darman. Ruang tengah malam (x=RX). Telops in screen space.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['I', 12, 106], ['A', 112, 184], ['I', 190, 342], ['D', 350, 440], ['D', 446, 496], ['D', 514, 596], ['A', 602, 662], ['I', 668, 780], ['A', 789, 851], ['A', 887, 926], ['I', 935, 974], ['D', 986, 1105], ['I', 1112, 1239], ['A', 1248, 1324]];
const TXT = ['DEK, BOBO YUK. UDAH JAM SEBELAS.', 'BU, LIAT. MATANYA MELOTOT KE TV.', 'NINA BOBO... OH, NINA BOBO...', 'TENANG, BU. BIAR BAPAK YANG TIDURIN.', 'DEK... MEREM YA... MEREM...',
  'EH, EH, SERANGAN BALIK! AYO! AYOOO!', 'PAK! BAPAK YANG BIKIN DIA MELEK!', 'YA AMPUN, SATU RUMAH BEGADANG!', 'GOOOOL!', 'LHO... DIA TIDUR.', 'AKHIRNYA...',
  'BU... SEKARANG BAPAK YANG NGGAK BISA TIDUR. KEBANYAKAN TERIAK.', 'SINI, IBU NINA BOBOIN. NINA BOBO...', 'BU, ASEP JUGA!'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1395;
const GOAL = 800, SLEEP = 852;
const SH = [['fam', 0, 111], ['asep', 112, 189], ['ibu', 190, 349], ['dar', 350, 445], ['darBayi', 446, 513], ['tv', 514, 560], ['dar', 561, 601], ['asep', 602, 667],
  ['ibu', 668, 788], ['tv', 789, 830], ['fam', 831, 886], ['bayi', 887, 934], ['ibu', 935, 985], ['dar', 986, 1111], ['fam', 1112, 1247], ['asep', 1248, 1324], ['end', 1325, 1394]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.15, sun: '#ffe8cc', sunI: 2.3, fog: '#141c3a', fogNear: 40, fogFar: 260,
  skyTop: '#060a24', skyHor: '#22305e', sat: 1.08, vig: 0.32, gain: '#fff2e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX - 1.15, 0.5, 0.45], IB = [RX - 0.15, 0.5, 0.3], BY = [RX - 0.12, 0.84, 0.62], DR = [RX + 0.9, 0.5, 0.45], TV = [RX + 2.6, 1.34, -1.6];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  fam: [{ f: 0, ...K([RX - 0.1, 2.25, 6.0], [RX - 0.1, 1.75, 0.3], 46) }, { f: 120, ...K([RX - 0.1, 2.2, 5.5], [RX - 0.1, 1.77, 0.3], 46) }],
  asep: [{ f: 0, ...K([AS[0], 2.1, 3.1], [AS[0], 1.97, AS[2]], 40) }, { f: 80, ...K([AS[0], 2.1, 2.7], [AS[0], 1.99, AS[2]], 40) }],
  ibu: [{ f: 0, ...K([IB[0], 1.75, 3.4], [IB[0], 1.5, IB[2]], 42) }, { f: 150, ...K([IB[0], 1.75, 3.05], [IB[0], 1.52, IB[2]], 42) }],
  dar: [{ f: 0, ...K([DR[0], 2.15, 3.1], [DR[0], 2.0, DR[2]], 40) }, { f: 120, ...K([DR[0], 2.15, 2.7], [DR[0], 2.02, DR[2]], 40) }],
  darBayi: [{ f: 0, ...K([RX + 0.4, 1.9, 3.3], [RX + 0.4, 1.6, 0.4], 42) }, { f: 70, ...K([RX + 0.4, 1.85, 2.9], [RX + 0.4, 1.6, 0.4], 42) }],
  bayi: [{ f: 0, ...K([BY[0], 1.75, 2.9], [BY[0], 1.55, BY[2]], 38) }, { f: 50, ...K([BY[0], 1.75, 2.6], [BY[0], 1.56, BY[2]], 38) }],
  tv: [{ f: 0, ...K([TV[0] - 0.2, 1.95, 0.4], [TV[0], 1.95, TV[2]], 40) }, { f: 45, ...K([TV[0] - 0.15, 1.95, 0.0], [TV[0], 1.95, TV[2]], 40) }],
  end: [{ f: 0, ...K([RX - 0.1, 2.2, 5.5], [RX - 0.1, 1.77, 0.3], 46) }, { f: 70, ...K([RX - 0.1, 2.6, 7.6], [RX - 0.1, 1.8, 0.0], 48) }],
};
const KICKS = [{ f: 514, a: 0.035 }, { f: 602, a: 0.035 }, { f: GOAL, a: 0.06 }, { f: 831, a: 0.05 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.12 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const F1 = { facing: 1, look: 1 }, F0 = { facing: 1, look: 0 }, FL = { facing: -1, look: -1 };
const asPose = (f) => {
  if (f < 112) return { L: 'hang', R: 'hang', expr: 'smile', ...F1 };
  if (f < 190) return { L: 'point', R: 'belly', expr: 'grin', ...F1 };
  if (f < 446) return { L: 'cross', R: 'cross', expr: 'squint', ...F1 };
  if (f < 602) return { L: 'hang', R: 'hang', expr: f > 514 ? 'shock' : 'smile', ...F0 };
  if (f < 668) return { L: 'point', R: 'hip', expr: 'stubborn', shake: 1, facing: 1, look: 1 };
  if (f < 789) return { L: 'temple', R: 'hang', expr: 'nervous', ...F0 };
  if (f < 887) return { L: 'up', R: 'up', expr: 'laugh', shake: 1, ...F0 };
  if (f < 1112) return { L: 'cheek', R: 'hang', expr: 'shock', ...F1, blink: 0 };
  if (f < 1248) return { L: 'cross', R: 'cross', expr: 'squint', ...F1 };
  return { L: 'pray', R: 'pray', expr: 'grin', headTilt: 8, ...F1 };
};
const ibPose = (f) => {
  if (f < 190) return { L: 'belly', R: 'belly', expr: 'smile', headTilt: -8, ...F0 };
  if (f < 350) return { L: 'belly', R: 'belly', expr: 'smile_closed', headTilt: -8, ...F0 };
  if (f < 668) return { L: 'belly', R: 'belly', expr: 'squint', ...F0 };
  if (f < 789) return { L: 'belly', R: 'belly', expr: 'cry', shake: 1, ...F0 };
  if (f < 887) return { L: 'belly', R: 'belly', expr: 'shock', ...F0, blink: 0 };
  if (f < 1112) return { L: 'belly', R: 'belly', expr: 'smile_closed', ...F0 };
  return { L: 'hip', R: 'cheek', expr: 'smile_closed', headTilt: 8, ...FL };
};
const drPose = (f) => {
  if (f < 350) return { L: 'cross', R: 'cross', expr: 'squint', ...FL };
  if (f < 446) return { L: 'thumb', R: 'hip', expr: 'smile', ...FL };
  if (f < 514) return { L: 'pray', R: 'pray', expr: 'smile_closed', ...FL };
  if (f < 789) return { L: 'up', R: 'point', expr: 'laugh', shake: 1, ...F0 };
  if (f < 887) return { L: 'up', R: 'up', expr: 'laugh', shake: 1, ...F0 };
  if (f < 986) return { L: 'hang', R: 'hang', expr: 'shock', ...FL };
  if (f < 1112) return { L: 'temple', R: 'hang', expr: 'cry', ...FL };
  return { L: 'pray', R: 'pray', expr: 'nervous', ...FL };
};
const byPose = (f) => f < SLEEP ? { L: 'hang', R: 'hang', expr: 'shock', blink: 0, facing: 1, look: 0 } : { L: 'hang', R: 'hang', expr: 'snore', facing: 1, look: 0 };
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk, extra = {}) => { const { shake, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: spk ? talk(f, spk, o.expr) : o.expr, bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5, ...extra })); };
  add('sarung', asPose, 5, AS, 'A'); add('tante', ibPose, 3, IB, 'I'); add('darman', drPose, 2, DR, 'D');
  add('bayi', byPose, 9, [BY[0], BY[1] + (f >= SLEEP ? 0 : 0.01 * Math.sin(f * 0.3)), BY[2]], null, { s: 0.5, order: 3, blob: false });
  return out;
};

const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
export const fxAt = (f, T) => {
  const out = [];
  const goal = f >= GOAL ? 1 : 0;
  out.push(FXC('tv' + (f % 60) + goal, (p) => T.fxTV(p, f, goal && f < GOAL + 40 ? 1 : 0, goal ? '1 - 0' : '0 - 0'), TV, 0.62, { order: 1 }));
  if (f >= SLEEP + 6) out.push(FXC('z' + (f % 50), (p) => T.fxZzz(p, f), [BY[0] + 0.14, BY[1] + 0.3, BY[2] + 0.05], 0.32, { order: 6 }));
  return out;
};

// ---- screen-space overlay: game-show telops (sharp, after the lens pass) ----
const JUDGE = [[GOAL + 2, 852, 'GOOOL!', '#ff5d8f']];
const BANNERS = [[118, 189, 'JAM 23.00', '#3a5bd9', '#ffffff', false], [200, 342, 'MATA MELOTOT', '#ff6b3a', '#ffffff', false],
  [516, 600, 'SERANGAN BALIK!', '#e8344a', '#ffffff', true], [670, 786, 'SATU RUMAH BEGADANG', '#8b5cf6', '#ffffff', false], [892, 934, 'ZZZ...', '#3a5bd9', '#bfe3ff', false]];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#b8642c', 'PAK DARMAN'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot && f <= b + 2) idx = k; acc += wt[k]; });
  const rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { n, who, a, rows, idx }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
export const overlayAt = (f, g, T) => {
  if (f < 112) put(g, 540, 560, 1.75, f < 1 ? 1 : out_(f, 112), (p) => T.fxRoundCard(p, 'ADIK NGGAK MAU TIDUR', 'MALAM KOMEDI', '#3a5bd9', Math.min(40, f + 6)));
  if (f >= 1325) put(g, 540, 600, 1.75, pop(f, 1325), (p) => T.fxRoundCard(p, 'SIAPA PALING HEBOH?', 'TAG DI KOMENTAR!', '#e8344a', Math.min(40, f - 1325)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 430, 1.45, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ffe14a', f));
  for (const [a, b_, t, hue, fg, dot] of BANNERS) put(g, 540, 270, 1.35, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, fg, dot, f));
  const C_ = telop(f); if (C_ && f < 1325) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1300, 1.6, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
