// "Bule Belajar Bahasa Gaul" -- pantai sore (x=200). Kostum baru: asepPemandu, buleTuris (Mister Mike), darmanPantai, ibuPantai.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['B', 12, 108], ['A', 112, 201], ['B', 205, 243], ['A', 247, 304], ['B', 308, 350], ['A', 356, 421], ['B', 425, 519], ['A', 525, 573], ['B', 578, 643], ['A', 647, 739], ['D', 750, 936], ['A', 940, 986], ['D', 990, 1088],
  ['B', 1097, 1223], ['I', 1248, 1296], ['B', 1305, 1431], ['A', 1437, 1525]];
const TXT = ['ASEP! SAYA MAU BELAJAR... BAHASA GAUL!', 'SIAP, MISTER! PELAJARAN PERTAMA: GASKEUN!', 'GAS... KAN?', 'GASKEUN! ARTINYA... AYO BERANGKAT!', 'OH! GASKEUN!', 'KEDUA: MAGER. MALAS GERAK.', 'MAGER... LIKE ME EVERY MONDAY.',
  'KETIGA: HEALING.', 'HEALING? ITU BAHASA INGGRIS!', 'DI SINI ARTINYA... JALAN-JALAN PAKAI UANG ORANG TUA.', 'SEP! JANGAN AJARIN YANG ANEH-ANEH. BIAR BAPAK AJARIN YANG SOPAN. KALAU KETEMU ORANG, BILANG... JOSJIS!',
  'PAK, ITU JUGA BAHASA GAUL!', 'BUKAN. ITU BAHASA... BAPAK-BAPAK GAUL.', 'PERMISI, BU! GASKEUN... MAGER... HEALING... JOSJIS!', '...SEP, BULENYA KESURUPAN?', 'BAHASA INDONESIA... MUDAH SEKALI! ASEP, BERAPA BIAYA LES-NYA?', 'GRATIS, MISTER. CUKUP TRAKTIR... HEALING.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1550;
const SH = [['two', 0, 111], ['asep', 112, 204], ['bule', 205, 246], ['asep', 247, 307], ['bule', 308, 355], ['asep', 356, 424], ['bule', 425, 524], ['asep', 525, 577], ['bule', 578, 646], ['asep', 647, 745],
  ['wide', 746, 790], ['darman', 791, 939], ['asep', 940, 989], ['darmanLow', 990, 1092], ['stall', 1093, 1247], ['ibu', 1248, 1304], ['buleS', 1305, 1436], ['asepEnd', 1437, 1549]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'sore' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { sore: { az: 250, el: 25, sky: '#ffd0a0', ground: '#c8a070', hemi: 1.15, sun: '#ffc890', sunI: 2.4, fog: '#f0c8a0', fogNear: 60, fogFar: 260, skyTop: '#5a8ad8', skyHor: '#ffc890', sat: 1.1, vig: 0.28, gain: '#fff0e0', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const BX = 200;
const SX = -1.3, BL = [BX - 0.55 + SX, 0.5, 0.4], AS = [BX + 0.55 + SX, 0.5, 0.4], DM = [BX + 1.6 + SX, 0.5, 0.3], IB = [BX - 2.55 + SX, 0.5, -0.45], BL2 = [BX - 1.6 + SX, 0.5, 0.25], KEL = [BX - 2.55 + SX, 0.5, -0.05];
const dmX = (f) => f < 746 ? null : f < 790 ? lerp(BX + 3.4 + SX, DM[0], (f - 746) / 44) : DM[0];
const blX = (f) => f < 1093 ? BL[0] : f < 1118 ? lerp(BL[0], BL2[0], (f - 1093) / 25) : BL2[0];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  two: [{ f: 0, ...K([BX + SX, 2.0, 4.6], [BX + SX, 1.85, 0.3], 44) }, { f: 111, ...K([BX + SX, 2.0, 4.1], [BX + SX, 1.87, 0.3], 44) }],
  asep: [{ f: 0, ...K([AS[0] - 0.45, 1.85, AS[2] + 2.5], [AS[0], 1.98, AS[2]], 40) }, { f: 100, ...K([AS[0] - 0.38, 1.86, AS[2] + 2.2], [AS[0], 2.0, AS[2]], 40) }],
  asepEnd: [{ f: 0, ...K([AS[0] - 0.3, 1.85, AS[2] + 2.0], [AS[0], 2.05, AS[2]], 38) }, { f: 112, ...K([AS[0] - 0.25, 1.86, AS[2] + 1.75], [AS[0], 2.06, AS[2]], 38) }],
  bule: [{ f: 0, ...K([BL[0] + 0.45, 1.85, BL[2] + 2.5], [BL[0], 1.98, BL[2]], 40) }, { f: 100, ...K([BL[0] + 0.38, 1.86, BL[2] + 2.2], [BL[0], 2.0, BL[2]], 40) }],
  buleS: [{ f: 0, ...K([BL2[0] + 0.45, 1.85, BL2[2] + 2.5], [BL2[0], 1.98, BL2[2]], 40) }, { f: 130, ...K([BL2[0] + 0.38, 1.86, BL2[2] + 2.2], [BL2[0], 2.0, BL2[2]], 40) }],
  wide: [{ f: 0, ...K([BX + 0.6 + SX, 2.05, 5.6], [BX + 0.6 + SX, 1.85, 0.2], 46) }, { f: 44, ...K([BX + 0.6 + SX, 2.05, 5.2], [BX + 0.6 + SX, 1.87, 0.2], 46) }],
  darman: [{ f: 0, ...K([DM[0] + 0.45, 1.85, DM[2] + 2.5], [DM[0], 1.98, DM[2]], 40) }, { f: 148, ...K([DM[0] + 0.38, 1.86, DM[2] + 2.2], [DM[0], 2.0, DM[2]], 40) }],
  darmanLow: [{ f: 0, ...K([DM[0] + 0.4, 1.6, DM[2] + 2.6], [DM[0], 2.0, DM[2]], 44) }, { f: 100, ...K([DM[0] + 0.35, 1.62, DM[2] + 2.3], [DM[0], 2.02, DM[2]], 44) }],
  stall: [{ f: 0, ...K([BX - 1.9 + SX, 2.0, 4.4], [BX - 2.0 + SX, 1.8, 0.0], 46) }, { f: 150, ...K([BX - 2.0 + SX, 2.0, 3.9], [BX - 2.05 + SX, 1.82, 0.0], 46) }],
  ibu: [{ f: 0, ...K([IB[0] + 0.45, 1.85, IB[2] + 2.6], [IB[0], 1.98, IB[2]], 40) }, { f: 56, ...K([IB[0] + 0.38, 1.86, IB[2] + 2.3], [IB[0], 2.0, IB[2]], 40) }],
};
const KICKS = [{ f: 308, a: 0.05 }, { f: 700, a: 0.05 }, { f: 900, a: 0.07 }, { f: 1050, a: 0.04 }, { f: 1200, a: 0.05 }, { f: 1270, a: 0.06 }, { f: 1495, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: ['two', 'wide', 'stall'].includes(S.id) ? 3 : 8 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const walkO = (f, a, C, dir) => { const w = ((f - a) / C) % 1; return { L: 'swing', R: 'swing', walk: q(w, 3), facing: dir, look: dir, bobW: 0.022 * (0.5 - 0.5 * Math.cos(4 * Math.PI * w)) }; };
const blPose = (f) => {
  if (f < 205) return { L: 'up', R: 'wave', wv: q((f * 0.4) % 6.283, 1), expr: 'grin', facing: 1, look: 1 };
  if (f < 308) return { L: 'cheek', R: 'hang', expr: 'squint', facing: 1, look: 1 };
  if (f < 356) return { L: 'up', R: 'up', expr: 'laugh', facing: 0, look: 0, hop: 1 };
  if (f < 578) return { L: f >= 425 ? 'temple' : 'hang', R: 'hang', expr: f >= 425 ? 'sad' : 'smile', facing: 1, look: 1 };
  if (f < 750) return { L: 'shrug', R: f < 647 ? 'point' : 'hang', expr: f < 647 ? 'shock' : 'squint', facing: 1, look: 1 };
  if (f < 1093) return { L: 'hang', R: f >= 900 ? 'thumb' : 'hang', expr: 'grin', facing: 1, look: 1 };
  if (f < 1118) return { ...walkO(f, 1093, 22, -1), expr: 'grin' };
  if (f < 1305) return { L: 'up', R: 'thumb', expr: f < 1223 ? 'laugh' : 'grin', facing: -1, look: -1 };
  return { L: 'hip', R: 'thumb', expr: 'grin', facing: 1, look: 1 };
};
const asPose = (f) => {
  if (f < 750) return { L: f % 300 < 150 ? 'point' : 'hip', R: 'up', expr: f >= 647 ? 'smile_closed' : 'grin', facing: -1, look: -1 };
  if (f < 1093) return { L: 'temple', R: f >= 940 && f < 990 ? 'point' : 'hang', expr: f >= 940 ? 'shock' : 'squint', facing: 1, look: 1 };
  if (f < 1437) return { L: 'cheek', R: 'hang', expr: 'nervous', facing: -1, look: -1 };
  return { L: 'hip', R: 'thumb', expr: 'grin', facing: -1, look: -1 };
};
const dmPose = (f) => { if (f < 790) return { ...walkO(f, 746, 32, -1), expr: 'stern' };
  if (f < 990) return { L: 'hip', R: f >= 890 ? 'thumb' : 'point', expr: f >= 890 ? 'laugh' : 'stern', facing: -1, look: -1 };
  return { L: 'hip', R: 'thumb', expr: 'smile_closed', facing: -1, look: -1 }; };
const ibPose = (f) => ({ L: 'hip', R: f >= 1248 && f < 1304 ? 'temple' : 'hang', expr: f >= 1180 ? 'squint' : 'smile', facing: 1, look: 1, blink: f >= 1223 && f < 1250 ? 0 : undefined });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { if (!pos) return; const { shake, bobW = 0, hop = 0, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    const op = { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob + bobW + hop * 0.05 * Math.abs(Math.sin(f * 0.4)), 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) };
    out.push({ key: who + JSON.stringify(op), draw: (p) => T.romanFront(p, who, op), x: pos[0], y: pos[1], z: pos[2], ground: 0.5 }); };
  add('buleTuris', blPose, 6, [q(blX(f), 4), 0.5, f < 1093 ? BL[2] : BL2[2]], 'B'); add('asepPemandu', asPose, 5, AS, 'A');
  const dx = dmX(f); add('darmanPantai', dmPose, 2, dx === null ? null : [q(dx, 4), 0.5, DM[2]], 'D'); add('ibuPantai', ibPose, 3, IB, 'I');
  return out;
};
export const fxAt = (f, T) => [{ key: 'kelapa', draw: (p) => T.fxKelapa(p), x: KEL[0], y: KEL[1], z: KEL[2], s: 0.75, blob: false, shadow: true, order: 6 }];

// ---- overlay (kartu kecil di atas) ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const JUDGE = [[308, 345, 'GASKEUN!', '#ffe14a'], [895, 936, 'JOSJIS!', '#ffe14a'], [1260, 1300, 'KESURUPAN?!', '#ff5d8f']];
const BANNERS = [[118, 246, 'PELAJARAN 1: GASKEUN', '#e8742c'], [360, 524, 'PELAJARAN 2: MAGER', '#3a5bd9'], [582, 745, 'PELAJARAN 3: HEALING', '#2f9a5a'], [1000, 1092, 'BAHASA BAPAK-BAPAK GAUL', '#b07a2a'], [1455, 1525, 'BIAYA LES: TRAKTIR HEALING', '#e8344a']];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#b07a2a', 'PAK DARMAN'], B: ['#e8742c', 'MISTER MIKE'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  let s0 = 0, s1 = W.length; if (W.length > 8) { const i0 = Math.max(0, idx); s0 = Math.floor(i0 / 7) * 7; s1 = Math.min(W.length, s0 + 7); }
  const Wv = W.slice(s0, s1), rows = []; let cur = [], len = 0; Wv.forEach((w) => { if (cur.length && len + w.length > 20) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a: s0 ? st[s0] : a, rows, idx: idx - s0 }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
export const overlayAt = (f, g, T) => {
  if (f < 28) put(g, 540, 300, 1.2, f < 1 ? 1 : out_(f, 28), (p) => T.fxRoundCard(p, 'BULE BELAJAR GAUL', 'MALAM KOMEDI', '#e8742c', Math.min(40, f + 6)));
  if (f >= 1525) put(g, 540, 330, 1.15, pop(f, 1525), (p) => T.fxRoundCard(p, 'AJARIN KATA APA?', 'TULIS DI KOMENTAR!', '#8b5cf6', Math.min(40, f - 1525)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  const C_ = telop(f); if (C_ && f < 1525) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1560, 1.2, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
