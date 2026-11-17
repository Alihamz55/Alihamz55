// "Ibu Checkout Promo 12.12" -- teras rumah No.17 (x=240), siang. Kostum baru: ibuMasker, darmanSantai, asepKurir. Bayangan tegas (bawaan).
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['I', 12, 53], ['D', 61, 165], ['I', 171, 251], ['A', 272, 297], ['I', 302, 347], ['A', 362, 387], ['I', 392, 448], ['A', 463, 488], ['I', 493, 550], ['D', 557, 612], ['I', 617, 712], ['A', 721, 807],
  ['D', 812, 904], ['I', 909, 1048], ['D', 1056, 1117], ['I', 1132, 1210], ['A', 1218, 1336], ['I', 1342, 1390]];
const TXT = ['CUMA LIHAT-LIHAT KOK, PAK.', 'BU, DARI TADI HP-NYA BUNYI "TING" TERUS.', 'ITU NOTIFIKASI... DISKON.', 'PAKET!', 'OH, ITU PANCI.', 'PAKET!', 'ITU TUTUP PANCINYA.', 'PAKET!', 'ITU... RAK BUAT PANCINYA.',
  'BU! KATANYA CUMA LIHAT-LIHAT!', 'IYA, PAK. LIHAT-LIHAT... SAMBIL CHECKOUT.', 'BU, MASIH ADA EMPAT BELAS PAKET LAGI DI MOTOR.', 'EMPAT BELAS?! UANGNYA DARI MANA, BU?', 'TENANG, PAK. SEMUANYA PAKAI PAYLATER... ATAS NAMA BAPAK.',
  'BAPAK... MAU PINGSAN.', 'JANGAN PINGSAN DI SITU, PAK! KASURNYA BARU DATENG BESOK.', 'PAKET! YANG INI BUAT BAPAK... OBAT PUSING.', 'TADI IBU CHECKOUT JUGA.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1425;
const SH = [['ibuCU', 0, 60], ['two', 61, 170], ['ibu', 171, 260], ['gate', 261, 301], ['ibu', 302, 361], ['asep', 362, 391], ['ibu', 392, 462], ['asep', 463, 492], ['ibu', 493, 556], ['darman', 557, 616],
  ['ibu', 617, 720], ['asep', 721, 811], ['darman', 812, 908], ['ibuECU', 909, 1055], ['darman', 1056, 1131], ['ibu', 1132, 1217], ['asep', 1218, 1341], ['wide', 1342, 1424]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'siang' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { siang: { az: 80, el: 50, sky: '#cfe4ff', ground: '#7a8a5a', hemi: 1.2, sun: '#fff4e0', sunI: 2.4, fog: '#cfe0f0', fogNear: 40, fogFar: 200, skyTop: '#6aa8e8', skyHor: '#d8ecff', sat: 1.06, vig: 0.22, shadowExt: 12 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240;
const IB = [HR + 0.15, 0.5, 0.85], DM = [HR + 1.35, 0.5, 0.65], AS = [HR - 1.15, 0.5, 0.95], PILE = [HR - 0.5, 0.5, 0.35];
const AW = 24, AV = 0.05, AX0 = AS[0] - (272 - 250) * AV;
const asX = (f) => f < 250 ? null : f < 272 ? AX0 + (f - 250) * AV : AS[0];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  ibuCU: [{ f: 0, ...K([IB[0] - 0.2, 1.9, IB[2] + 1.8], [IB[0], 2.06, IB[2]], 36) }, { f: 60, ...K([IB[0] - 0.15, 1.9, IB[2] + 1.55], [IB[0], 2.08, IB[2]], 36) }],
  ibu: [{ f: 0, ...K([IB[0] - 0.45, 1.55, IB[2] + 2.5], [IB[0], 1.98, IB[2]], 40) }, { f: 100, ...K([IB[0] - 0.38, 1.58, IB[2] + 2.2], [IB[0], 2.0, IB[2]], 40) }],
  ibuECU: [{ f: 0, ...K([IB[0] - 0.2, 1.9, IB[2] + 1.85], [IB[0], 2.06, IB[2]], 36) }, { f: 146, ...K([IB[0] - 0.15, 1.9, IB[2] + 1.5], [IB[0], 2.08, IB[2]], 36) }],
  darman: [{ f: 0, ...K([DM[0] - 0.45, 1.55, DM[2] + 2.5], [DM[0], 1.98, DM[2]], 40) }, { f: 100, ...K([DM[0] - 0.38, 1.58, DM[2] + 2.2], [DM[0], 2.0, DM[2]], 40) }],
  asep: [{ f: 0, ...K([AS[0] + 0.45, 1.55, AS[2] + 2.5], [AS[0], 1.98, AS[2]], 40) }, { f: 120, ...K([AS[0] + 0.38, 1.58, AS[2] + 2.2], [AS[0], 2.0, AS[2]], 40) }],
  two: [{ f: 0, ...K([HR + 0.75, 2.0, 4.6], [HR + 0.75, 1.85, 0.7], 44) }, { f: 110, ...K([HR + 0.75, 2.0, 4.2], [HR + 0.75, 1.87, 0.7], 44) }],
  gate: [{ f: 0, ...K([HR - 0.9, 2.1, 5.2], [HR - 1.2, 1.8, 0.8], 46) }, { f: 40, ...K([HR - 0.9, 2.1, 4.9], [HR - 1.0, 1.8, 0.8], 46) }],
  wide: [{ f: 0, ...K([HR + 0.1, 2.3, 6.0], [HR + 0.1, 1.85, 0.7], 46) }, { f: 82, ...K([HR + 0.1, 2.25, 5.4], [HR + 0.1, 1.87, 0.7], 46) }],
};
const KICKS = [{ f: 272, a: 0.04 }, { f: 362, a: 0.04 }, { f: 463, a: 0.05 }, { f: 812, a: 0.06 }, { f: 1010, a: 0.07 }, { f: 1300, a: 0.05 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: ['two', 'gate', 'wide'].includes(S.id) ? 3 : 8 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const ibPose = (f) => {
  if (f < 557) return { L: 'hip', R: 'phone', expr: f >= 302 ? 'smile_closed' : 'smile', facing: f >= 272 ? -1 : 0, look: f >= 272 ? -1 : 0 };
  if (f < 909) return { L: 'hip', R: 'phone', expr: 'smile', facing: 1, look: 1 };
  if (f < 1132) return { L: 'pray', R: 'pray', expr: 'smile_closed', facing: 1, look: 1 };
  if (f < 1342) return { L: 'up', R: 'phone', expr: 'shock', facing: 1, look: 1, blink: 0 };
  return { L: 'hip', R: 'thumb', expr: 'grin', facing: 0, look: 0 };
};
const dmPose = (f) => {
  if (f < 272) return { L: 'cross', R: 'cross', expr: 'squint', facing: -1, look: -1 };
  if (f < 557) return { L: 'temple', R: 'hang', expr: 'nervous', facing: -1, look: -1 };
  if (f < 812) return { L: 'up', R: 'point', expr: 'shock', facing: -1, look: -1, shake: f < 620 };
  if (f < 1056) return { L: 'up', R: 'up', expr: 'shock', facing: -1, look: -1, blink: 0, shake: f < 905 };
  if (f < 1342) return { L: 'belly', R: 'temple', expr: 'sad', facing: -1, look: -1, faint: ramp(f, 1060, 1110) };
  return { L: 'belly', R: 'hang', expr: 'smile_closed', facing: -1, look: -1 };
};
const asPose = (f) => {
  if (f < 272) { const w = ((f - 250) / AW) % 1; return { L: 'swing', R: 'swing', walk: q(w, 3), facing: 1, look: 1, expr: 'grin', bobW: 0.022 * (0.5 - 0.5 * Math.cos(4 * Math.PI * w)) }; }
  if (f < 721) return { L: 'up', R: 'hip', expr: 'grin', facing: 1, look: 1 };
  if (f < 1218) return { L: 'shrug', R: 'hip', expr: f >= 812 ? 'nervous' : 'smile', facing: 1, look: 1 };
  return { L: 'wallet', R: 'thumb', expr: 'grin', facing: 1, look: 1 };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { if (!pos) return; const { shake, bobW = 0, faint = 0, ...o } = pose(f), i = idle(f, seed), tilt = (shake ? sway(f, 6, 0.6) : 0) - faint * 14;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob + bobW, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('ibuMasker', ibPose, 3, IB, 'I'); add('darmanSantai', dmPose, 2, DM, 'D'); const ax = asX(f); add('asepKurir', asPose, 5, ax === null ? null : [q(ax, 4), AS[1], AS[2]], 'A');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: true, order: 6, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  const boxes = [[272, 'PANCI', 0, 0, 0], [362, 'TUTUP', 0.42, 0, 0], [463, 'RAK', 0.2, 0.42, 1]];
  for (const [a, lb, dx, dy, big] of boxes) if (f >= a) out.push(FXC('bx' + lb, (p) => T.fxKardus(p, lb, big), [PILE[0] + dx, PILE[1] + dy, PILE[2] - dx * 0.2], 0.42));
  if (f >= 721) for (let i = 0; i < 14; i++) { const k = Math.min(1, (f - 721 - i * 3) / 6); if (k <= 0) continue;
    out.push(FXC('pl' + i + (k < 1 ? f : ''), (p) => T.fxKardus(p, '', i % 3 === 0), [PILE[0] - 1.0 - (i % 4) * 0.42, PILE[1] + Math.floor(i / 4) * 0.4 + (1 - k) * 0.6, PILE[2] - 0.6], 0.4)); }
  return out;
};

// ---- overlay (kartu kecil di atas) ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const JUDGE = [[812, 860, '+14 PAKET?!', '#ff5d8f'], [1010, 1055, 'ATAS NAMA BAPAK!', '#ffe14a']];
const BANNERS = [[30, 165, 'MODE 12.12: ON', '#e8344a'], [302, 361, 'PAKET #1: PANCI', '#e8742c'], [392, 462, 'PAKET #2: TUTUP PANCI', '#e8742c'], [493, 556, 'PAKET #3: RAK PANCI', '#e8742c'],
  [617, 712, 'LIHAT-LIHAT = CHECKOUT', '#3a5bd9'], [1132, 1217, 'KASUR DATENG BESOK', '#8b5cf6'], [1260, 1341, 'OBAT PUSING', '#2f9a5a']];
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
  if (f < 28) put(g, 540, 300, 1.2, f < 1 ? 1 : out_(f, 28), (p) => T.fxRoundCard(p, 'PROMO 12.12', 'MALAM KOMEDI', '#e8344a', Math.min(40, f + 6)));
  if (f >= 1395) put(g, 540, 330, 1.15, pop(f, 1395), (p) => T.fxRoundCard(p, 'TIM CHECKOUT?', 'ATAU TIM LIHAT-LIHAT? KOMEN!', '#8b5cf6', Math.min(40, f - 1395)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  const C_ = telop(f); if (C_ && f < 1395) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1560, 1.2, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
