// "Cabai Rp80 Ribu" -- Ibu (tante) menawar di lapak Mang Ujang (ujang). Pasar pagi (x=PX). Telops in screen space.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['I', 12, 80], ['U', 86, 136], ['I', 146, 247], ['U', 253, 326], ['I', 333, 392], ['U', 398, 535], ['I', 544, 630], ['U', 634, 660], ['I', 664, 694], ['U', 699, 718],
  ['I', 723, 843], ['U', 852, 1033], ['I', 1051, 1196], ['U', 1202, 1241], ['I', 1248, 1554]];
const TXT = ['MANG, CABAI MERAH SEKILO BERAPA?', 'DELAPAN PULUH RIBU, BU.', 'DELAPAN PULUH?! MANG, INI CABAI APA EMAS?!', 'KALAU EMAS, BU, SAYA UDAH PENSIUN.', 'KEMARIN MASIH TIGA PULUH, MANG!',
  'KEMARIN ITU KEMARIN, BU. CABAI SEKARANG NAIK PANGKAT.', 'YA UDAH, SEPEREMPAT.', 'DUA PULUH RIBU.', 'SATU ONS!', 'DELAPAN RIBU.', 'SATU BIJI, MANG. SATU BIJI!',
  'INI, BU. SAYA KASIH PITA, BIAR KAYAK KADO. KALAU MAU MURAH, BU... TANAM SENDIRI AJA.', 'TANAM DI MANA, MANG?! RUMAH SAYA NGONTRAK! HALAMAN SAYA CUMA SEUKURAN KESET!', 'DI POT AJA, BU...',
  'POT SAYA UDAH DIPAKAI JEMUR SANDAL, MANG! POKOKNYA, KALAU SAYA PUNYA LADANG CABAI, SAYA NGGAK BAKAL NAWAR DI SINI! SAYA YANG JUALAN... DELAPAN PULUH RIBU!'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1624;
const SH = [['wide', 0, 85], ['lowBoard', 86, 145], ['ibuLow', 146, 252], ['ots', 253, 332], ['ibuECU', 333, 397], ['ujang', 398, 543], ['two', 544, 633], ['ujang', 634, 663],
  ['ibu', 664, 698], ['ujang', 699, 722], ['ibu', 723, 851], ['two', 852, 1050], ['ibu', 1051, 1201], ['ujang', 1202, 1247], ['ibu', 1248, 1420], ['two', 1421, 1557], ['wide', 1558, 1623]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'pagi' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { pagi: { az: 125, el: 26, sky: '#dfe6f2', ground: '#6a5a48', hemi: 1.0, sun: '#ffd6a0', sunI: 2.9, fog: '#e8dcc8', fogNear: 28, fogFar: 150,
  skyTop: '#6aa0d8', skyHor: '#ffe2b8', sat: 1.12, vig: 0.38, gain: '#fff0dc', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const PX = 400, TX = PX + 0.45, TZ = -0.15;
const IB = [PX - 0.75, 0.5, 0.55], UJ = [PX + 0.75, 0.5, -0.75], BD = [TX - 0.62, 1.28, TZ + 0.42];
const ibX = (f) => f < 40 ? lerp(PX - 3.6, IB[0], smooth(ramp(f, 0, 40))) : f < 544 ? IB[0] : f < 1556 ? lerp(IB[0], PX - 0.6, smooth(ramp(f, 544, 760))) : lerp(PX - 0.6, PX - 4.2, smooth(ramp(f, 1556, 1600)));
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  lowBoard: [{ f: 0, ...K([BD[0] + 0.7, 1.5, 1.75], [BD[0] - 0.05, 1.68, -0.3], 42) }, { f: 60, ...K([BD[0] + 0.55, 1.48, 1.5], [BD[0] - 0.05, 1.7, -0.3], 42) }],
  ibuLow: [{ f: 0, ...K([IB[0] + 0.55, 1.55, 2.75], [IB[0] - 0.02, 1.98, IB[2]], 40) }, { f: 107, ...K([IB[0] + 0.45, 1.55, 2.45], [IB[0] - 0.02, 2.0, IB[2]], 40) }],
  ots: [{ f: 0, ...K([IB[0] - 0.5, 2.2, IB[2] + 1.55], [UJ[0] - 0.05, 1.95, UJ[2]], 38) }, { f: 80, ...K([IB[0] - 0.42, 2.18, IB[2] + 1.35], [UJ[0] - 0.05, 1.97, UJ[2]], 38) }],
  ibuECU: [{ f: 0, ...K([IB[0] + 0.3, 1.8, 2.0], [IB[0], 2.08, IB[2]], 38) }, { f: 64, ...K([IB[0] + 0.25, 1.8, 1.8], [IB[0], 2.09, IB[2]], 38) }],
  wide: [{ f: 0, ...K([PX - 0.2, 2.4, 6.6], [PX - 0.2, 1.8, -0.4], 48) }, { f: 85, ...K([PX - 0.2, 2.35, 6.1], [PX - 0.2, 1.8, -0.4], 48) }],
  board: [{ f: 0, ...K([BD[0] + 0.1, 1.62, 1.75], [BD[0], 1.62, BD[2]], 40) }, { f: 60, ...K([BD[0] + 0.08, 1.62, 1.45], [BD[0], 1.62, BD[2]], 40) }],
  ibu: [{ f: 0, ...K([IB[0] + 0.05, 2.1, 3.2], [IB[0] + 0.05, 1.96, IB[2]], 40) }, { f: 160, ...K([IB[0] + 0.1, 2.1, 2.8], [IB[0] + 0.1, 1.97, IB[2]], 40) }],
  ujang: [{ f: 0, ...K([UJ[0], 2.2, 2.6], [UJ[0], 2.05, UJ[2]], 40) }, { f: 140, ...K([UJ[0], 2.2, 2.25], [UJ[0], 2.06, UJ[2]], 40) }],
  two: [{ f: 0, ...K([PX, 2.0, 5.2], [PX, 1.5, -0.1], 44) }, { f: 200, ...K([PX, 2.0, 4.6], [PX, 1.52, -0.1], 44) }],
};
const KICKS = [{ f: 108, a: 0.05 }, { f: 146, a: 0.05 }, { f: 790, a: 0.05 }, { f: 1051, a: 0.05 }, { f: 1495, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f), cine = ['lowBoard', 'ibuLow', 'ots', 'ibuECU'].includes(S.id); return { focus: dist(C.pos, C.look), cinf: cine ? 9 : 3 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const IR = { facing: 1, look: 1 }, UL = { facing: -1, look: -1 };
const ibPose = (f) => {
  if (f < 40) return { L: 'hang', R: 'hang', expr: 'smile', step: q(walk(f, 0, 1.6, 0.6).phase, 2), ...IR };
  if (f < 146) return { L: 'hip', R: 'hang', expr: f > 108 ? 'shock' : 'smile', ...IR, blink: f > 108 ? 0 : undefined };
  if (f < 253) return { L: 'temple', R: 'up', expr: 'shock', shake: 1, ...IR, blink: 0 };
  if (f < 333) return { L: 'cross', R: 'cross', expr: 'squint', ...IR };
  if (f < 398) return { L: 'point', R: 'hip', expr: 'stubborn', shake: 1, ...IR };
  if (f < 544) return { L: 'hip', R: 'hip', expr: 'squint', ...IR };
  if (f < 664) return { L: 'hang', R: 'hang', expr: 'nervous', ...IR };
  if (f < 723) return { L: 'pray', R: 'pray', expr: 'nervous', ...IR };
  if (f < 852) return { L: 'up', R: 'up', expr: f > 780 ? 'cry' : 'nervous', shake: f > 780 ? 1 : 0, ...IR };
  if (f < 935) return { L: 'hang', R: 'hang', expr: 'squint', ...IR };
  if (f < 990) return { L: 'belly', R: 'belly', expr: 'smile_closed', ...IR };
  if (f < 1051) return { L: 'belly', R: 'belly', expr: 'squint', ...IR };
  if (f < 1202) return { L: 'point', R: 'belly', expr: 'stubborn', shake: 1, ...IR };
  if (f < 1248) return { L: 'cross', R: 'belly', expr: 'squint', ...IR };
  if (f < 1556) return { L: f > 1480 ? 'up' : 'point', R: 'belly', expr: 'stubborn', shake: 1, ...IR };
  return { L: 'hang', R: 'belly', expr: 'stubborn', step: q(walk(f, 1556, 1.9, 0.7).phase, 2), facing: -1, look: -1 };
};
const ujPose = (f) => {
  if (f < 86) return { L: 'hip', R: 'hang', expr: 'smile', ...UL };
  if (f < 146) return { L: 'up', R: 'hip', expr: 'grin', ...UL };
  if (f < 253) return { L: 'hang', R: 'hang', expr: 'nervous', ...UL };
  if (f < 398) return { L: 'cross', R: 'cross', expr: 'smile_closed', ...UL };
  if (f < 544) return { L: 'shrug', R: 'shrug', expr: 'smile', ...UL };
  if (f < 852) return { L: 'hip', R: 'hip', expr: 'squint', ...UL };
  if (f < 980) return { L: 'point', R: 'hang', expr: 'smile', ...UL };
  if (f < 1051) return { L: 'cheek', R: 'hang', expr: 'grin', ...UL };
  if (f < 1202) return { L: 'hang', R: 'hang', expr: 'shock', ...UL, blink: 0 };
  if (f < 1248) return { L: 'pray', R: 'pray', expr: 'nervous', ...UL };
  return { L: 'hang', R: 'hang', expr: 'shock', ...UL, blink: f > 1556 ? 0 : undefined };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const { shake, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who === 'tante' ? 'ibuPasar' : who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('tante', ibPose, 3, [q(ibX(f), 3), IB[1], IB[2]], 'I'); add('ujang', ujPose, 11, UJ, 'U');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
export const fxAt = (f, T) => {
  const out = [], rv = q(smooth(ramp(f, 92, 110)), 2);
  out.push(FXC('board' + rv, (p) => T.fxPriceBoard(p, rv), BD, 0.36, { order: 2 }));
  if (f >= 860) { const g = f < 935 ? [PX + 0.2, 1.42, TZ + 0.25] : [ibX(f) + 0.13, 1.18, IB[2] + 0.14]; const k = f < 935 ? pop(f, 860) : 1;
    if (k > 0.01) out.push(FXC('gift' + k, (p) => { p.g.translate(300, 500); p.g.scale(k, k); p.g.translate(-300, -500); T.fxCabaiPita(p); }, g, 0.2, { order: 6 })); }
  { const x = ibX(f) - 0.32; out.push(FXC('kj', (p) => T.fxKeranjang(p), [x, 0.62, IB[2] + 0.12], 0.26, { order: 4 })); }
  return out;
};

// ---- screen-space overlay: game-show telops ----
const JUDGE = [[110, 170, 'Rp80.000/KG!', '#ff5d8f'], [790, 852, 'SEBIJI!', '#ffe14a'], [1492, 1556, 'Rp80.000!', '#ff5d8f']];
const BANNERS = [[88, 109, 'PASAR, JAM 6 PAGI', '#3a5bd9', '#ffffff', false], [440, 543, 'CABAI NAIK PANGKAT', '#e8742c', '#ffffff', false],
  [548, 663, 'SEPEREMPAT = Rp20.000', '#e8344a', '#ffffff', false], [664, 722, 'SEONS = Rp8.000', '#e8344a', '#ffffff', false], [723, 789, 'SEBIJI = ...', '#e8344a', '#ffffff', false],
  [990, 1050, 'TANAM SENDIRI?!', '#3f9a4a', '#ffffff', false], [1100, 1201, 'RUMAH NGONTRAK', '#8b5cf6', '#ffffff', false]];
const SPK = { I: ['#d9478a', 'IBU'], U: ['#e8742c', 'MANG UJANG'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  // long lines: show a window of up to ~7 words around the spoken word so the plate stays 2-3 rows
  let s0 = 0, s1 = W.length; if (W.length > 8) { const i0 = Math.max(0, idx); s0 = Math.floor(i0 / 7) * 7; s1 = Math.min(W.length, s0 + 7); }
  const Wv = W.slice(s0, s1), rows = []; let cur = [], len = 0; Wv.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { n, who, a: s0 ? st[s0] : a, rows, idx: idx - s0, key: s0 }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
export const overlayAt = (f, g, T) => {
  if (f < 86) put(g, 540, 560, 1.75, f < 1 ? 1 : out_(f, 86), (p) => T.fxRoundCard(p, 'CABAI Rp80 RIBU', 'MALAM KOMEDI', '#e8344a', Math.min(40, f + 6)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 1.3, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ffe14a', f));
  for (const [a, b_, t, hue, fg, dot] of BANNERS) put(g, 540, 270, 1.35, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, fg, dot, f));
  const C_ = telop(f); if (C_) { const [hue, nm] = SPK[C_.who]; put(g, 540, f >= 86 && f < 400 ? 1430 : 1300, f >= 86 && f < 400 ? 1.45 : 1.6, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
