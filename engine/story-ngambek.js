// "Ibu Ngambek tapi Tetap Minta Dibonceng" -- motor malam lewat jalan (sekitar x=128..185), berhenti di gerobak martabak (Asep).
// Kostum baru: darmanJeans, ibuGamis, asepMartabak. Kartu teks kecil di atas.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['D', 12, 41], ['I', 45, 59], ['D', 63, 118], ['I', 122, 176], ['I', 204, 236], ['D', 240, 288], ['I', 292, 375], ['I', 381, 456], ['D', 460, 569], ['I', 573, 601], ['D', 606, 649], ['I', 654, 675],
  ['D', 679, 722], ['I', 726, 746], ['D', 750, 772], ['I', 776, 877], ['D', 883, 931], ['I', 937, 991], ['A', 1009, 1080], ['D', 1084, 1106], ['A', 1110, 1222], ['I', 1231, 1338], ['D', 1356, 1405], ['I', 1411, 1487]];
const TXT = ['BU... MASIH MARAH?', 'NGGAK.', 'TERUS KENAPA DARI TADI DIEM?', 'AKU NGGAK NGOMONG SAMA KAMU.', 'BELOK KIRI.', 'LHO, KATANYA NGGAK NGOMONG?', 'ITU BUKAN NGOMONG. ITU NAVIGASI.', 'PELAN. ADA POLISI TIDUR. KLAKSON ORANG ITU.',
  'YA UDAH, BAPAK MINTA MAAF. BAPAK SALAH APA, BU?', 'PIKIR SENDIRI.', 'LUPA ULANG TAHUN?', 'BUKAN.', 'LUPA JEMPUT?', 'BUKAN.', 'TERUS APA?!', 'SEMALEM... DI MIMPI AKU, KAMU SELINGKUH.', 'ITU KAN MIMPI, BU!', 'BERHENTI DI MARTABAK.',
  'MARTABAK SPESIAL, PAK? BUAT MINTA MAAF, YA?', 'KOK KAMU TAHU?', 'BAPAK-BAPAK YANG DATENG JAM SEGINI, MUKANYA KAYAK BAPAK SEMUA.', 'DUA. YANG SATU BUAT AKU... YANG SATU JUGA BUAT AKU.', 'BU... UDAH NGGAK MARAH, KAN?', 'AKU NGGAK NGOMONG SAMA KAMU. ...BELOK KANAN.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1518;
// motor x: jalan, melambat & berhenti di martabak (960-1000), jalan lagi dari 1356
const V = 0.045, X0 = 128;
const motX = (f) => { if (f <= 960) return X0 + f * V; const x960 = X0 + 960 * V;
  if (f <= 1000) { const u = (f - 960) / 40; return x960 + V * 40 * (u - u * u / 2); } const xs = x960 + V * 20;
  if (f < 1356) return xs; const u = Math.min(1, (f - 1356) / 40); return xs + V * (f - 1356) * (0.5 + 0.5 * u); };
const XS = X0 + 960 * V + V * 20, CART = [XS + 1.7, 0.5, -0.3], ASP = [XS + 1.7, 0.5, -0.75];
const SH = [['ride', 0, 62], ['darman', 63, 121], ['ibu', 122, 239], ['darman', 240, 291], ['ibu', 292, 459], ['ride', 460, 572], ['ibu', 573, 605], ['darman', 606, 653], ['ibu', 654, 678], ['darman', 679, 725],
  ['ibu', 726, 749], ['darman', 750, 775], ['ibuECU', 776, 882], ['darmanECU', 883, 936], ['ride', 937, 1000], ['asep', 1001, 1083], ['darman', 1084, 1109], ['asep', 1110, 1230], ['cart', 1231, 1355], ['ride', 1356, 1410], ['ibu', 1411, 1517]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'malam' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { malam: { az: 60, el: 45, sky: '#7a88c8', ground: '#2a2638', hemi: 0.95, sun: '#ffd8a8', sunI: 1.9, fog: '#141c3a', fogNear: 30, fogFar: 160, skyTop: '#060a24', skyHor: '#22305e', sat: 1.05, vig: 0.4, gain: '#f4ecff', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RIDE_Y = 0.78, MZ = 0.45;
const dmP = (f) => [q(motX(f) + 0.28, 3), RIDE_Y, MZ - 0.05], ibP = (f) => [q(motX(f) - 0.32, 3), RIDE_Y, MZ - 0.12];
const K = (pos, look, fov) => ({ pos, look, fov });
// camera keys are relative to the motor (dx), so the camera tracks along the road
const CAMS = {
  ride: [{ f: 0, ...K([0, 2.1, 5.0], [0, 1.85, 0.2], 46) }, { f: 120, ...K([-0.3, 2.05, 4.6], [-0.1, 1.85, 0.2], 46) }],
  darman: [{ f: 0, ...K([0.7, 1.95, 2.6], [0.28, 2.25, 0.4], 40) }, { f: 60, ...K([0.62, 1.96, 2.35], [0.28, 2.27, 0.4], 40) }],
  darmanECU: [{ f: 0, ...K([0.4, 2.25, 2.0], [0.28, 2.33, 0.4], 36) }, { f: 50, ...K([0.36, 2.26, 1.8], [0.28, 2.35, 0.4], 36) }],
  ibu: [{ f: 0, ...K([-0.75, 1.95, 2.6], [-0.32, 2.25, 0.33], 40) }, { f: 120, ...K([-0.68, 1.96, 2.35], [-0.32, 2.27, 0.33], 40) }],
  ibuECU: [{ f: 0, ...K([-0.45, 2.25, 2.0], [-0.32, 2.33, 0.33], 36) }, { f: 105, ...K([-0.4, 2.26, 1.75], [-0.32, 2.35, 0.33], 36) }],
  asep: [{ f: 0, ...K([-0.45, 1.85, 2.6], [0, 2.0, 0], 40, true) }, { f: 120, ...K([-0.38, 1.86, 2.3], [0, 2.02, 0], 40) }],
  cart: [{ f: 0, ...K([0.8, 2.2, 5.0], [0.8, 1.85, 0.0], 46) }, { f: 125, ...K([0.8, 2.15, 4.5], [0.8, 1.88, 0.0], 46) }],
};
const KICKS = [{ f: 292, a: 0.03 }, { f: 776, a: 0.04 }, { f: 883, a: 0.07 }, { f: 1110, a: 0.04 }, { f: 1300, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), base = S.id === 'asep' ? ASP : [motX(f), 0, 0];
  const keys = CAMS[S.id].map((k) => ({ f: S.a + k.f, pos: [k.pos[0] + base[0], k.pos[1], k.pos[2] + (S.id === 'asep' ? ASP[2] : 0)], look: [k.look[0] + base[0], k.look[1], k.look[2] + (S.id === 'asep' ? ASP[2] : 0)], fov: k.fov }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 });
  const riding = f < 1000 || f >= 1356; if (riding) { const j = Math.sin(f * 1.7) * 0.006; c.pos = [c.pos[0], c.pos[1] + j, c.pos[2]]; }
  c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: ['darman', 'darmanECU', 'ibu', 'ibuECU', 'asep'].includes(S.id) ? 8 : 3 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const dmPose = (f) => {
  if (f < 460) return { L: 'reach', R: 'reach', lift: 0, expr: f < 240 ? 'nervous' : 'squint', facing: -1, look: -1 };
  if (f < 776) return { L: 'reach', R: 'reach', lift: 0, expr: 'nervous', facing: -1, look: -1 };
  if (f < 883) return { L: 'reach', R: 'reach', lift: 0, expr: 'shock', facing: -1, look: -1, blink: 0 };
  if (f < 937) return { L: 'up', R: 'up', expr: 'shock', facing: -1, look: -1, shake: 1 };
  if (f < 1000) return { L: 'reach', R: 'reach', lift: 0, expr: 'sad', facing: 0, look: 0 };
  if (f < 1231) return { L: 'hang', R: f >= 1084 && f < 1110 ? 'shrug' : 'hang', expr: f >= 1084 && f < 1110 ? 'shock' : 'sad', facing: 1, look: 1 };
  if (f < 1356) return { L: 'wallet', R: 'wallet', expr: 'sad', facing: 1, look: 1 };
  return { L: 'reach', R: 'reach', lift: 0, expr: 'smile', facing: -1, look: -1 };
};
const ibPose = (f) => {
  if (f < 1000) return { L: 'cross', R: 'cross', expr: f >= 776 && f < 883 ? 'stern' : 'squint', facing: 0, look: 0, headTilt: -6 };
  if (f < 1356) return { L: 'cross', R: f >= 1231 ? 'point' : 'cross', expr: 'squint', facing: f >= 1231 ? 1 : 0, look: f >= 1231 ? 1 : 0 };
  return { L: 'cheek', R: 'belly', expr: 'squint', facing: 0, look: 0, headTilt: -6 };
};
const asPose = (f) => ({ L: f > 1110 && f < 1222 ? 'shrug' : 'hang', R: 'hang', expr: f > 1180 ? 'smile_closed' : 'smile', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const { shake, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: pos[1] })); };
  add('darmanJeans', dmPose, 2, dmP(f), 'D'); add('ibuGamis', ibPose, 3, ibP(f), 'I');
  if (f >= 937) add('asepMartabak', asPose, 5, ASP, 'A');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const X = motX(f), out = [FXC('motor', (p) => T.fxSkuter(p, '#c0302c'), [q(X, 3), 0.5, MZ + 0.4], 1.9, { order: 8, shadow: true })];
  for (let x = 126; x < 200; x += 5.5) { if (Math.abs(x - X) > 9) continue;
    out.push(FXC('lj' + x, (p) => T.fxLampuJalan(p), [x, 0.5, -1.6], 3.0, { order: 1 })); }
  if (f >= 937) out.push(FXC('grb', (p) => T.fxGerobak(p, 'MARTABAK'), CART, 0.85, { order: 3, shadow: true }));
  return out;
};

// ---- screen-space overlay (small cards, top) ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const JUDGE = [[883, 925, 'MIMPI?!', '#ff5d8f']];
const BANNERS = [[60, 176, 'MODE NGAMBEK: ON', '#e8344a'], [330, 459, 'BUKAN NGOMONG, NAVIGASI', '#3a5bd9'], [654, 678, 'TEBAKAN 1: SALAH', '#555a66'], [726, 749, 'TEBAKAN 2: SALAH', '#555a66'],
  [800, 882, 'ALASAN: MIMPI', '#8b5cf6'], [1009, 1083, 'MARTABAK DAMAI', '#e8742c'], [1290, 1355, '2 MARTABAK, 0 MAAF', '#2f9a5a']];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#b07a2a', 'PAK DARMAN'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  const rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 20) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a, rows, idx }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
export const overlayAt = (f, g, T) => {
  if (f < 58) put(g, 540, 300, 1.2, f < 1 ? 1 : out_(f, 58), (p) => T.fxRoundCard(p, 'IBU NGAMBEK', 'MALAM KOMEDI', '#d9478a', Math.min(40, f + 6)));
  if (f >= 1488) put(g, 540, 330, 1.15, pop(f, 1488), (p) => T.fxRoundCard(p, 'ALASAN NGAMBEK TERANEH?', 'TULIS DI KOMENTAR!', '#8b5cf6', Math.min(40, f - 1488)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  const C_ = telop(f); if (C_ && f < 1488) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1560, 1.2, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
