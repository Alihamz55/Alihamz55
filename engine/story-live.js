// "Ibu Live Jualan TikTok" -- Ibu (ibuDaster) + Asep (sarung) + Pocong (fx). Ruang tengah malam (x=RX). Cinematic, phone screen as sharp overlay.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['I', 12, 150], ['A', 158, 246], ['I', 276, 396], ['A', 403, 476], ['I', 485, 646], ['A', 653, 751], ['I', 759, 783], ['A', 810, 861], ['I', 868, 954], ['A', 962, 1044], ['P', 1095, 1258], ['I', 1276, 1350]];
const TXT = ['HALO, HALO! SELAMAT DATANG DI LIVE IBU! HARI INI JUALAN SAYUR SEGAR!', 'BU... KAMERANYA KEBALIK. YANG KELIHATAN CUMA PLAFON.', 'OH! PANTES DARI TADI YANG KOMEN CUMA CICAK.', 'BU, YANG NONTON... SATU ORANG.',
  'NGGAK APA-APA! SATU PENONTON JUGA REZEKI! HALO, KAK! NAMANYA SIAPA?', 'NAMANYA... POCONG UNDERSCORE LOWBAT.', 'POCONG?!', 'BU! DIA BORONG SEMUA!', 'ALHAMDULILLAH! KIRIM KE MANA, KAK?',
  'ALAMATNYA... POHON PISANG BELAKANG RUMAH.', 'PERMISI, BU. SAYA AMBIL SENDIRI AJA. SEKALIAN... NUMPANG NGECAS.', '...LIVE-NYA IBU MATIIN DULU, YA.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1408;
const SH = [['wide', 0, 157], ['asep', 158, 246], ['screen', 247, 275], ['ibu', 276, 402], ['asep', 403, 484], ['ibu', 485, 652], ['screen', 653, 700], ['asep', 701, 758],
  ['ibu', 759, 785], ['screen', 786, 861], ['ibu', 862, 961], ['asep', 962, 1044], ['door', 1045, 1094], ['pocong', 1095, 1258], ['ibuECU', 1259, 1350], ['wide', 1351, 1407]];
const SCREEN = { 247: ['ceiling', 0, 0], 653: ['live', 1, 0], 786: ['live', 2, 1] };
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.15, sun: '#ffe8cc', sunI: 2.3, fog: '#141c3a', fogNear: 40, fogFar: 260,
  skyTop: '#060a24', skyHor: '#22305e', sat: 1.08, vig: 0.36, gain: '#fff2e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const IB = [RX - 0.4, 0.5, 0.35], AS = [RX + 0.95, 0.5, 0.15], TP = [RX + 0.25, 0.5, 0.95], PC = [RX + 1.75, 0.5, -0.1];
const pcPos = (f) => { if (f < 1045) return null; const hop = (a) => 0.3 * Math.abs(Math.sin(Math.PI * (f - a) / 10));
  if (f < 1090) return [lerp(RX + 3.4, PC[0], ramp(f, 1045, 1090)), PC[1] + hop(1045), PC[2]]; return [PC[0], PC[1] + (f % 90 < 10 ? hop(0) * 0.4 : 0), PC[2]]; };
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([RX + 0.2, 2.25, 5.6], [RX + 0.2, 1.8, 0.0], 48) }, { f: 157, ...K([RX + 0.2, 2.2, 5.0], [RX + 0.2, 1.82, 0.0], 48) }],
  asep: [{ f: 0, ...K([AS[0] - 0.2, 2.05, AS[2] + 2.6], [AS[0], 1.97, AS[2]], 40) }, { f: 90, ...K([AS[0] - 0.15, 2.05, AS[2] + 2.3], [AS[0], 1.98, AS[2]], 40) }],
  ibu: [{ f: 0, ...K([IB[0] + 0.45, 1.58, IB[2] + 2.5], [IB[0], 2.0, IB[2]], 40) }, { f: 160, ...K([IB[0] + 0.38, 1.6, IB[2] + 2.2], [IB[0], 2.02, IB[2]], 40) }],
  screen: [{ f: 0, ...K([TP[0] - 0.1, 1.95, TP[2] + 1.2], [TP[0], 1.85, TP[2]], 40) }, { f: 75, ...K([TP[0] - 0.08, 1.95, TP[2] + 1.0], [TP[0], 1.85, TP[2]], 40) }],
  door: [{ f: 0, ...K([RX + 1.0, 2.1, 5.0], [RX + 1.6, 1.7, 0.0], 46) }, { f: 50, ...K([RX + 1.0, 2.1, 4.6], [RX + 1.6, 1.7, 0.0], 46) }],
  pocong: [{ f: 0, ...K([PC[0] - 0.4, 1.55, PC[2] + 2.5], [PC[0], 1.88, PC[2]], 40) }, { f: 160, ...K([PC[0] - 0.32, 1.58, PC[2] + 2.15], [PC[0], 1.9, PC[2]], 40) }],
  ibuECU: [{ f: 0, ...K([IB[0] + 0.28, 1.85, IB[2] + 1.85], [IB[0], 2.07, IB[2]], 38) }, { f: 90, ...K([IB[0] + 0.22, 1.85, IB[2] + 1.65], [IB[0], 2.08, IB[2]], 38) }],
};
const KICKS = [{ f: 247, a: 0.04 }, { f: 759, a: 0.06 }, { f: 786, a: 0.04 }, { f: 1095, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
const CINE = ['asep', 'ibu', 'screen', 'pocong', 'ibuECU'];
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: CINE.includes(S.id) ? (S.id === 'screen' ? 12 : 8) : 3 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const I1 = { facing: 1, look: 1 }, A1 = { facing: -1, look: -1 };
const ibPose = (f) => {
  if (f < 158) return { L: 'up', R: 'wave', wv: q((f * 0.45) % 6.283, 1), expr: 'grin', ...I1 };
  if (f < 276) return { L: 'hang', R: 'wave', wv: q((f * 0.45) % 6.283, 1), expr: 'smile', ...I1 };
  if (f < 403) return { L: 'cheek', R: 'hang', expr: 'nervous', ...I1 };
  if (f < 485) return { L: 'hang', R: 'hang', expr: 'squint', ...I1 };
  if (f < 653) return { L: 'up', R: 'wave', wv: q((f * 0.45) % 6.283, 1), expr: 'grin', ...I1 };
  if (f < 759) return { L: 'hang', R: 'hang', expr: 'smile', ...I1 };
  if (f < 810) return { L: 'up', R: 'up', expr: 'shock', shake: 1, ...I1, blink: 0 };
  if (f < 962) return { L: 'pray', R: 'pray', expr: 'grin', ...I1 };
  if (f < 1095) return { L: 'hang', R: 'hang', expr: f > 1045 ? 'shock' : 'squint', ...I1, blink: f > 1045 ? 0 : undefined };
  if (f < 1276) return { L: 'temple', R: 'hang', expr: 'nervous', shake: 1, facing: 1, look: 1, blink: 0 };
  return { L: 'pray', R: 'pray', expr: 'smile_closed', ...I1 };
};
const asPose = (f) => {
  if (f < 158) return { L: 'cross', R: 'cross', expr: 'squint', ...A1 };
  if (f < 276) return { L: 'point', R: 'hang', expr: 'nervous', ...A1 };
  if (f < 403) return { L: 'temple', R: 'hang', expr: 'squint', ...A1 };
  if (f < 485) return { L: 'hang', R: 'phone', expr: 'nervous', ...A1 };
  if (f < 759) return { L: 'hang', R: 'phone', expr: f > 690 ? 'shock' : 'squint', ...A1 };
  if (f < 868) return { L: 'up', R: 'phone', expr: 'shock', shake: 1, ...A1, blink: 0 };
  if (f < 1045) return { L: 'temple', R: 'phone', expr: 'nervous', ...A1 };
  return { L: 'up', R: 'up', expr: 'shock', shake: 1, facing: 1, look: 1, blink: 0 };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const { shake, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('ibuDaster', ibPose, 3, IB, 'I'); add('sarung', asPose, 5, AS, 'A');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
export const fxAt = (f, T) => {
  const out = [];
  out.push(FXC('tp' + (f % 20), (p) => T.fxTripod(p, f), TP, 0.78, { order: 3 }));
  out.push(FXC('kj', (p) => T.fxKeranjang(p), [IB[0] - 0.55, 0.5, IB[2] + 0.2], 0.26, { order: 3 }));
  { const P_ = pcPos(f); if (P_) { const m = speaks(f, 'P') ? +(LIPS[f] || 0) : 0, bl = f % 100 > 95 ? 1 : 0;
    out.push(FXC('pc' + [m, bl].join(), (p) => T.fxPocong(p, m, bl, 'calm'), [q(P_[0], 3), q(P_[1], 3), P_[2]], 0.95, { order: 2 })); } }
  return out;
};

// ---- screen-space overlay ----
const JUDGE = [[864, 930, 'BORONG SEMUA!', '#ffe14a'], [760, 786, 'POCONG?!', '#ff5d8f']];
const BANNERS = [[250, 275, 'KAMERA KEBALIK', '#e8344a', '#ffffff', false], [410, 484, 'PENONTON: 1', '#3a5bd9', '#ffffff', false], [700, 758, 'POCONG_LOWBAT', '#8b5cf6', '#ffffff', false],
  [975, 1044, 'ALAMAT: POHON PISANG', '#3f9a4a', '#ffffff', false], [1180, 1258, 'NUMPANG NGECAS', '#e8742c', '#ffffff', false]];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], P: ['#8b5cf6', 'POCONG'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  let s0 = 0, s1 = W.length; if (W.length > 8) { const i0 = Math.max(0, idx); s0 = Math.floor(i0 / 7) * 7; s1 = Math.min(W.length, s0 + 7); }
  const Wv = W.slice(s0, s1), rows = []; let cur = [], len = 0; Wv.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { n, who, a: s0 ? st[s0] : a, rows, idx: idx - s0 }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
export const overlayAt = (f, g, T) => {
  const S = shotAt(f); if (S.id === 'screen') { const [mode, n, hi] = SCREEN[S.a]; put(g, 540, 800, 1.12, pop(f, S.a, 5), (p) => T.fxPhoneLive(p, mode, f, n, hi && f >= 790 ? 1 : 0)); }
  if (f < 158) put(g, 540, 560, 1.75, f < 1 ? 1 : out_(f, 158), (p) => T.fxRoundCard(p, 'IBU LIVE JUALAN', 'MALAM KOMEDI', '#e8344a', Math.min(40, f + 6)));
  if (f >= 1351) put(g, 540, 600, 1.7, pop(f, 1351), (p) => T.fxRoundCard(p, 'LIVE CUMA 1 PENONTON?', 'TULIS DI KOMENTAR!', '#8b5cf6', Math.min(40, f - 1351)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 300, 1.25, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue, fg, dot] of BANNERS) put(g, 540, shotAt(f).id === 'screen' ? 150 : 250, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, fg, dot, f));
  const C_ = telop(f); if (C_ && f < 1351) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1420, 1.45, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
