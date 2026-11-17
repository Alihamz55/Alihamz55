// "Asep Akali Bagasi" -- terminal bandara (x=560). Kostum baru: asepMudik -> asepLapis (7 lapis), darmanPetugas, ibuKardigan.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['D', 12, 111], ['A', 117, 205], ['A', 253, 321], ['D', 327, 361], ['I', 370, 446], ['A', 452, 533], ['D', 560, 610], ['A', 616, 651], ['D', 657, 675], ['I', 741, 809], ['A', 815, 866], ['D', 875, 1051],
  ['A', 1075, 1134], ['A', 1149, 1244], ['I', 1250, 1316], ['A', 1323, 1382]];
const TXT = ['MAS, KOPERNYA KELEBIHAN LIMA KILO. BAYAR DUA RATUS RIBU.', 'DUA RATUS?! TUNGGU, PAK. LIMA MENIT.', 'UDAH, PAK. TIMBANG LAGI.', 'PAS. SILAKAN.', 'SEP... KAMU KOK KAYAK LEMPER?', 'INI STRATEGI, BU. HEMAT DUA RATUS RIBU.',
  'MAS, TOLONG LEPAS JAKETNYA.', 'YANG MANA, PAK?', 'SEMUANYA.', 'SEP, ANTREANNYA UDAH SAMPE PARKIRAN!', 'UDAH, PAK. TUJUH LAPIS.', 'OKE. TAPI MAS... NAMPANNYA KELEBIHAN MUATAN. BAYAR DUA RATUS RIBU.', '...PAK, BAYARNYA PAKAI JAKET BOLEH?',
  'BU... PULANGNYA ASEP NAIK BUS AJA.', 'BUS JUGA ADA BAGASINYA, SEP.', 'SIAP. STRATEGI LEMPER LAGI.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1418;
const SEC = 540, M0 = 676, M1 = 740, P0 = 1330, P1 = 1385;
const SH = [['desk', 0, 116], ['asep', 117, 205], ['card', 206, 252], ['asepLow', 253, 326], ['darman', 327, 369], ['ibu', 370, 451], ['asepLow', 452, 539], ['secWide', 540, 559], ['darman2', 560, 615], ['asepSec', 616, 656],
  ['darman2', 657, 675], ['secWide', 676, 740], ['ibuQ', 741, 814], ['asepSec', 815, 874], ['darman2', 875, 985], ['tray', 986, 1074], ['asepSec', 1075, 1148], ['two', 1149, 1249], ['ibuQ', 1250, 1322], ['asepSec', 1323, 1417]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'terminal' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { terminal: { az: 90, el: 60, sky: '#e8f2ff', ground: '#9aa4ae', hemi: 1.3, sun: '#ffffff', sunI: 2.2, fog: '#dfe8f2', fogNear: 40, fogFar: 200, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.04, vig: 0.22, shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const AX = 560;
const DM1 = [AX - 1.6, 0.5, -1.85], AS1 = [AX - 0.75, 0.5, -0.25], IB1 = [AX - 2.7, 0.5, 0.15], KOPER = [AX - 0.1, 0.62, -1.3];
const DM2 = [AX + 1.65, 0.5, 0.1], AS2 = [AX + 4.1, 0.5, 0.25], IB2 = [AX + 5.6, 0.5, 0.35], TRAY = [AX + 2.3, 1.22, -0.55];
const nJacket = (f) => f < 253 ? -1 : f < M0 ? 7 : f < M1 ? Math.max(0, 7 - Math.floor((f - M0) / 9)) : f < P0 ? 0 : f < P1 ? Math.min(7, Math.floor((f - P0) / 7)) : 7;
const LAY = ["#3a7ad8", "#f2c14e", "#2f9a5a", "#8b5cf6", "#e8742c", "#f4f1ea", "#d8322f"];
const asOutfit = (f) => { const n = nJacket(f); if (n <= 0) return ['asepMudik', 'asepMudik'];
  return ['lapis' + n, { tunic: LAY[n - 1], skin: "#d9a07a", hair: "#3a2418", arms: LAY[n - 1], legs: "#3a3f52", pants: "#3a3f52", stout: n >= 3, layers: LAY.slice(0, n), cap: "#2f9a5a" }]; };
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  desk: [{ f: 0, ...K([AX - 1.0, 2.0, 4.0], [AX - 1.2, 1.85, -0.8], 44) }, { f: 116, ...K([AX - 1.0, 2.0, 3.6], [AX - 1.2, 1.87, -0.8], 44) }],
  asep: [{ f: 0, ...K([AS1[0] + 0.45, 1.55, AS1[2] + 2.5], [AS1[0], 1.98, AS1[2]], 40) }, { f: 90, ...K([AS1[0] + 0.38, 1.58, AS1[2] + 2.2], [AS1[0], 2.0, AS1[2]], 40) }],
  card: [{ f: 0, ...K([AX - 1.0, 2.0, 4.0], [AX - 1.2, 1.85, -0.8], 44) }, { f: 46, ...K([AX - 1.0, 2.0, 3.9], [AX - 1.2, 1.85, -0.8], 44) }],
  asepLow: [{ f: 0, ...K([AS1[0] + 0.5, 1.2, AS1[2] + 2.8], [AS1[0], 1.95, AS1[2]], 44) }, { f: 85, ...K([AS1[0] + 0.42, 1.22, AS1[2] + 2.5], [AS1[0], 1.97, AS1[2]], 44) }],
  darman: [{ f: 0, ...K([DM1[0] + 0.45, 1.75, DM1[2] + 2.5], [DM1[0], 2.05, DM1[2]], 40) }, { f: 45, ...K([DM1[0] + 0.4, 1.76, DM1[2] + 2.3], [DM1[0], 2.06, DM1[2]], 40) }],
  ibu: [{ f: 0, ...K([IB1[0] + 0.45, 1.55, IB1[2] + 2.5], [IB1[0], 1.98, IB1[2]], 40) }, { f: 80, ...K([IB1[0] + 0.38, 1.58, IB1[2] + 2.2], [IB1[0], 2.0, IB1[2]], 40) }],
  secWide: [{ f: 0, ...K([AX + 2.85, 2.1, 5.5], [AX + 2.85, 1.75, -0.3], 46) }, { f: 64, ...K([AX + 2.85, 2.05, 5.1], [AX + 2.85, 1.77, -0.3], 46) }],
  darman2: [{ f: 0, ...K([DM2[0] + 0.45, 1.55, DM2[2] + 2.5], [DM2[0], 1.98, DM2[2]], 40) }, { f: 110, ...K([DM2[0] + 0.38, 1.58, DM2[2] + 2.2], [DM2[0], 2.0, DM2[2]], 40) }],
  asepSec: [{ f: 0, ...K([AS2[0] - 0.45, 1.55, AS2[2] + 2.5], [AS2[0], 1.98, AS2[2]], 40) }, { f: 95, ...K([AS2[0] - 0.38, 1.58, AS2[2] + 2.2], [AS2[0], 2.0, AS2[2]], 40) }],
  ibuQ: [{ f: 0, ...K([IB2[0] - 0.45, 1.55, IB2[2] + 2.5], [IB2[0], 1.98, IB2[2]], 40) }, { f: 75, ...K([IB2[0] - 0.38, 1.58, IB2[2] + 2.2], [IB2[0], 2.0, IB2[2]], 40) }],
  tray: [{ f: 0, ...K([TRAY[0] + 0.35, 1.85, TRAY[2] + 2.3], [TRAY[0] + 0.05, 1.55, TRAY[2]], 40) }, { f: 88, ...K([TRAY[0] + 0.3, 1.82, TRAY[2] + 1.9], [TRAY[0] + 0.05, 1.55, TRAY[2]], 40) }],
  two: [{ f: 0, ...K([AX + 4.85, 1.95, 4.6], [AX + 4.85, 1.85, 0.3], 46) }, { f: 100, ...K([AX + 4.85, 1.95, 4.2], [AX + 4.85, 1.87, 0.3], 46) }],
};
const KICKS = [{ f: 117, a: 0.04 }, { f: 253, a: 0.06 }, { f: 370, a: 0.04 }, { f: 657, a: 0.05 }, { f: 986, a: 0.07 }, { f: 1340, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0;
  if (f >= SEC && f < SEC + 20) c.flash = (f % 8) < 4 ? 0.18 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: ['desk', 'card', 'secWide', 'two'].includes(S.id) ? 3 : 8 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const asPose = (f) => {
  if (f < 117) return { L: 'hang', R: 'hang', expr: 'smile', facing: -1, look: -1 };
  if (f < 253) return { L: 'up', R: 'point', expr: f < 160 ? 'shock' : 'grin', facing: -1, look: -1 };
  if (f < SEC) return { L: 'hip', R: 'thumb', expr: f < 452 ? 'nervous' : 'grin', facing: -1, look: -1 };
  if (f < M0) return { L: 'hang', R: 'hang', expr: f >= 616 ? 'nervous' : 'shock', facing: -1, look: -1, blink: f < 560 ? 0 : undefined };
  if (f < M1) return { L: (f % 18) < 9 ? 'up' : 'lift', R: (f % 18) < 9 ? 'lift' : 'up', expr: 'nervous', facing: 0, look: 0 };
  if (f < 1075) return { L: 'hip', R: f >= 815 ? 'thumb' : 'hang', expr: f >= 986 ? 'shock' : 'grin', facing: -1, look: -1, blink: f >= 986 ? 0 : undefined };
  if (f < 1149) return { L: 'pray', R: 'pray', expr: 'sad', facing: -1, look: -1 };
  if (f < P0) return { L: 'hang', R: 'hang', expr: 'sad', facing: 1, look: 1 };
  return { L: (f % 14) < 7 ? 'up' : 'lift', R: 'thumb', expr: 'grin', facing: 0, look: 0 };
};
const dmPose = (f) => {
  if (f < SEC) return { L: 'hang', R: f < 111 ? 'point' : 'hang', expr: f >= 253 && f < 327 ? 'shock' : 'neutral', facing: 1, look: 1, blink: f >= 253 && f < 290 ? 0 : undefined };
  if (f < 875) return { L: 'hip', R: f >= 560 && f < 675 ? 'point' : 'hang', expr: 'neutral', facing: 1, look: 1 };
  return { L: 'hip', R: f >= 960 ? 'point' : 'hang', expr: 'smile_closed', facing: 1, look: 1 };
};
const ibPose = (f) => {
  if (f < SEC) return { L: 'cheek', R: 'hang', expr: f >= 370 ? 'squint' : 'smile', facing: 1, look: 1 };
  if (f < 1250) return { L: 'temple', R: 'hang', expr: 'nervous', facing: -1, look: -1 };
  return { L: 'cross', R: 'cross', expr: 'squint', facing: -1, look: -1 };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (key, O, pose, seed, pos, spk) => { const { shake, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    const op = { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) };
    out.push({ key: key + JSON.stringify(op), draw: (p) => T.romanFront(p, O, op), x: pos[0], y: pos[1], z: pos[2], ground: 0.5 }); };
  const [ak, aO] = asOutfit(f), sec = f >= SEC;
  add(ak, aO, asPose, 5, sec ? AS2 : AS1, 'A'); add('darmanPetugas', 'darmanPetugas', dmPose, 2, sec ? DM2 : DM1, 'D'); add('ibuKardigan', 'ibuKardigan', ibPose, 3, sec ? IB2 : IB1, 'I');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: true, order: 6, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  if (f < SEC) out.push(FXC('koper', (p) => T.fxKoper(p), KOPER, 0.55));
  if (f >= M0) { const n = f < P0 ? Math.min(7, f < M1 ? 7 - nJacket(f) : 7) : Math.max(0, 7 - nJacket(f)); out.push(FXC('tray' + n, (p) => T.fxNampan(p, n), TRAY, 0.6, { order: 7 }));
    if (f < M1) { const k = ((f - M0) % 9) / 9, x = lerp(AS2[0], TRAY[0], k), y = lerp(1.9, TRAY[1] + 0.3, k) + Math.sin(Math.PI * k) * 0.8;
      out.push(FXC('fly' + Math.floor((f - M0) / 9) + ':' + q(k, 2), (p) => T.fxNampan(p, 1), [q(x, 3), q(y, 3), 0.2], 0.4, { shadow: false, order: 9 })); } }
  return out;
};

// ---- overlay (kartu kecil di atas) ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const JUDGE = [[540, 560, 'TIIIT!', '#ff5d8f'], [986, 1040, 'NAMPAN OVERLOAD!', '#ffe14a']];
const BANNERS = [[20, 111, 'KELEBIHAN 5 KG', '#e8344a'], [260, 326, '7 LAPIS JAKET', '#e8742c'], [380, 451, 'MODE LEMPER', '#8b5cf6'], [680, 740, 'LEPAS... SATU-SATU', '#3a5bd9'], [1000, 1074, 'Rp200.000 (LAGI)', '#e8344a'], [1335, 1390, 'STRATEGI LEMPER 2', '#2f9a5a']];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#b07a2a', 'PETUGAS'] };
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
  if (f < 28) put(g, 540, 300, 1.2, f < 1 ? 1 : out_(f, 28), (p) => T.fxRoundCard(p, 'AKALI BAGASI', 'MALAM KOMEDI', '#3a5bd9', Math.min(40, f + 6)));
  if (f >= 206 && f < 253) { g.save(); g.fillStyle = 'rgba(20,16,40,0.55)'; g.fillRect(0, 0, 1080, 1920); g.restore(); put(g, 540, 900, 1.5, Math.min(pop(f, 206), out_(f, 253)), (p) => T.fxRoundCard(p, '5 MENIT KEMUDIAN...', '', '#f2c14e', Math.min(40, f - 206))); }
  if (f >= 1390) put(g, 540, 330, 1.15, pop(f, 1390), (p) => T.fxRoundCard(p, 'TRIK PALING NEKAT?', 'TULIS DI KOMENTAR!', '#8b5cf6', Math.min(40, f - 1390)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  const C_ = telop(f); if (C_ && f < 1390) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1560, 1.2, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
