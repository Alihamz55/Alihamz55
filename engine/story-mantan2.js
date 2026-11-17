// "Diundang Mantan 2: Aqiqah Anaknya" -- teras rumah No.17 (x=240) lalu gedung acara (x=40, lantai y=0).
// Kostum baru: asepJas, darmanBatikUngu, ibuKebayaHijau, rina. Asep berjalan dengan siklus jalan baru.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['I', 12, 89], ['A', 94, 121], ['I', 126, 172], ['A', 181, 249], ['D', 255, 333], ['R', 423, 496], ['A', 502, 552], ['R', 558, 580], ['A', 610, 629], ['R', 638, 665], ['A', 670, 708], ['R', 717, 781],
  ['I', 823, 871], ['A', 876, 924], ['I', 929, 977], ['R', 1004, 1057], ['A', 1061, 1105]];
const TXT = ['SEP, MANTANMU NGUNDANG LAGI.', 'NIKAH LAGI, BU?!', 'AQIQAH ANAKNYA.', 'TENANG, BU. ASEP UDAH MOVE ON.', 'MOVE ON KOK BAWA AMPLOP PALING TEBEL?', 'ASEP! MAKASIH UDAH DATENG.', 'IYA DONG. SIAPA NAMA DEDEKNYA?', 'ASEP.',
  '...ASEP?', 'BIAR INGET.', 'INGET SAMA AA?', 'INGET... JANGAN SAMPAI KAYAK KAMU.', 'SEP, AMPLOPNYA AMBIL LAGI.', 'UDAH DIMASUKIN KE KOTAK, BU!', 'YA UDAH, KOTAKNYA BAWA PULANG!', 'ASEP! DIEM!', 'IYA, MAAF!'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1140;
const HALL = 341;
const SH = [['teras', 0, 93], ['asepT', 94, 125], ['ibuT', 126, 180], ['asepT', 181, 254], ['darmanT', 255, 340], ['walk', 341, 422], ['rina', 423, 501], ['asep', 502, 557], ['rina', 558, 580], ['bayi', 581, 609],
  ['asepECU', 610, 637], ['rina', 638, 669], ['asep', 670, 716], ['rinaECU', 717, 781], ['asepECU', 782, 822], ['bisik', 823, 875], ['asep', 876, 928], ['ibu', 929, 1003], ['rina', 1004, 1060], ['asepECU', 1061, 1139]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a < HALL ? 'siang' : 'hall' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = {
  siang: { az: 80, el: 50, sky: '#cfe4ff', ground: '#7a8a5a', hemi: 1.2, sun: '#fff4e0', sunI: 2.4, fog: '#cfe0f0', fogNear: 40, fogFar: 200, skyTop: '#6aa8e8', skyHor: '#d8ecff', sat: 1.06, vig: 0.22, shadowExt: 12 },
  hall: { az: 70, el: 50, sky: '#ffe8d0', ground: '#6a4a3a', hemi: 1.15, sun: '#fff0dc', sunI: 2.4, fog: '#3a2a30', fogNear: 30, fogFar: 120, skyTop: '#1a1020', skyHor: '#3a2030', sat: 1.1, vig: 0.32, gain: '#fff2e4', shadowExt: 9 },
};
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240, HX = 40;
const T_AS = [HR - 0.7, 0.5, 0.95], T_IB = [HR + 0.55, 0.5, 0.8], T_DM = [HR + 1.7, 0.5, 0.6];
const H_AS = [HX + 0.6, 0, 0.4], H_RN = [HX + 1.85, 0, 0.3], H_IB = [HX - 0.4, 0, 0.2], H_DM = [HX - 1.0, 0, -0.5];
const WC = 24, WV = 0.022, W0 = HALL, WX0 = H_AS[0] - (422 - HALL) * WV;
const asHallX = (f) => f < 422 ? WX0 + (f - W0) * WV : H_AS[0];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  teras: [{ f: 0, ...K([HR - 0.05, 2.25, 5.6], [HR - 0.05, 1.85, 0.8], 44) }, { f: 93, ...K([HR - 0.05, 2.2, 5.0], [HR - 0.05, 1.87, 0.8], 44) }],
  asepT: [{ f: 0, ...K([T_AS[0] + 0.4, 1.6, T_AS[2] + 2.5], [T_AS[0], 1.98, T_AS[2]], 40) }, { f: 70, ...K([T_AS[0] + 0.34, 1.62, T_AS[2] + 2.2], [T_AS[0], 2.0, T_AS[2]], 40) }],
  ibuT: [{ f: 0, ...K([T_IB[0] - 0.45, 1.6, T_IB[2] + 2.5], [T_IB[0], 1.98, T_IB[2]], 40) }, { f: 55, ...K([T_IB[0] - 0.38, 1.62, T_IB[2] + 2.2], [T_IB[0], 2.0, T_IB[2]], 40) }],
  darmanT: [{ f: 0, ...K([T_DM[0] - 0.45, 1.6, T_DM[2] + 2.5], [T_DM[0], 1.98, T_DM[2]], 40) }, { f: 85, ...K([T_DM[0] - 0.38, 1.62, T_DM[2] + 2.2], [T_DM[0], 2.0, T_DM[2]], 40) }],
  rina: [{ f: 0, ...K([H_RN[0] - 0.45, 1.1, H_RN[2] + 2.5], [H_RN[0], 1.48, H_RN[2]], 40) }, { f: 80, ...K([H_RN[0] - 0.38, 1.12, H_RN[2] + 2.2], [H_RN[0], 1.5, H_RN[2]], 40) }],
  rinaECU: [{ f: 0, ...K([H_RN[0] - 0.2, 1.42, H_RN[2] + 1.85], [H_RN[0], 1.58, H_RN[2]], 36) }, { f: 65, ...K([H_RN[0] - 0.15, 1.42, H_RN[2] + 1.6], [H_RN[0], 1.6, H_RN[2]], 36) }],
  bayi: [{ f: 0, ...K([H_RN[0] + 0.05, 1.3, H_RN[2] + 1.8], [H_RN[0] + 0.05, 1.28, H_RN[2]], 36) }, { f: 30, ...K([H_RN[0] + 0.05, 1.3, H_RN[2] + 1.55], [H_RN[0] + 0.05, 1.3, H_RN[2]], 36) }],
  asep: [{ f: 0, ...K([H_AS[0] + 0.45, 1.1, H_AS[2] + 2.5], [H_AS[0], 1.48, H_AS[2]], 40) }, { f: 80, ...K([H_AS[0] + 0.38, 1.12, H_AS[2] + 2.2], [H_AS[0], 1.5, H_AS[2]], 40) }],
  asepECU: [{ f: 0, ...K([H_AS[0] + 0.2, 1.42, H_AS[2] + 1.85], [H_AS[0], 1.58, H_AS[2]], 36) }, { f: 80, ...K([H_AS[0] + 0.15, 1.42, H_AS[2] + 1.6], [H_AS[0], 1.6, H_AS[2]], 36) }],
  bisik: [{ f: 0, ...K([HX + 0.1, 1.3, 3.0], [HX + 0.1, 1.45, 0.25], 42) }, { f: 52, ...K([HX + 0.1, 1.32, 2.7], [HX + 0.1, 1.47, 0.25], 42) }],
  ibu: [{ f: 0, ...K([H_IB[0] + 0.45, 1.1, H_IB[2] + 2.5], [H_IB[0], 1.48, H_IB[2]], 40) }, { f: 75, ...K([H_IB[0] + 0.38, 1.12, H_IB[2] + 2.2], [H_IB[0], 1.5, H_IB[2]], 40) }],
};
const KICKS = [{ f: 126, a: 0.05 }, { f: 270, a: 0.03 }, { f: 610, a: 0.05 }, { f: 745, a: 0.06 }, { f: 940, a: 0.05 }, { f: 1061, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f);
  if (S.id === 'walk') { const x = asHallX(f); return { pos: [x + 0.05, 1.45, 2.9], look: [x + 0.12, 1.15, 0.35], fov: 46, flash: f < HALL + 2 ? 0.1 : 0 }; }
  const keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f })); const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 });
  c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: ['teras', 'walk', 'bisik'].includes(S.id) ? 3 : 8 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const asPose = (f) => {
  if (f < 94) return { L: 'hip', R: 'hang', expr: 'smile', facing: 1, look: 1 };
  if (f < 126) return { L: 'up', R: 'up', expr: 'shock', facing: 1, look: 1, shake: 1, blink: 0 };
  if (f < 255) return { L: 'cheek', R: 'hip', expr: f < 181 ? 'shock' : 'smile_closed', facing: 1, look: 1 };
  if (f < HALL) return { L: 'wallet', R: 'wallet', expr: 'nervous', facing: 1, look: 1 };
  if (f < 422) { const w = ((f - HALL) / WC) % 1; return { L: 'swing', R: 'swing', walk: q(w, 3), facing: 1, look: 1, expr: 'grin', bobW: 0.022 * (0.5 - 0.5 * Math.cos(4 * Math.PI * w)), headTilt: q(-1.8 * Math.sin(4 * Math.PI * w + 0.6), 2) }; }
  if (f < 558) return { L: 'hip', R: f >= 502 ? 'shrug' : 'hang', expr: 'grin', facing: 1, look: 1 };
  if (f < 670) return { L: 'hang', R: 'hang', expr: f >= 610 ? 'shock' : 'neutral', facing: 1, look: 1, blink: f >= 581 && f < 640 ? 0 : undefined };
  if (f < 717) return { L: 'pray', R: 'pray', expr: 'smile_closed', facing: 1, look: 1 };
  if (f < 823) return { L: 'pray', R: 'pray', expr: f > 745 ? 'shock' : 'smile_closed', facing: 1, look: 1, blink: f > 745 ? 0 : undefined };
  if (f < 1004) return { L: 'hang', R: 'hang', expr: 'nervous', facing: -1, look: -1 };
  if (f < 1061) return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1 };
  return { L: 'hang', R: 'salute', expr: 'shock', facing: 0, look: 0, blink: 0 };
};
const ibPoseT = (f) => ({ L: 'hip', R: f < 94 ? 'wallet' : 'hang', expr: f < 126 ? 'smile' : 'smile_closed', facing: -1, look: -1 });
const dmPoseT = (f) => ({ L: 'hip', R: f >= 255 ? 'point' : 'hang', expr: f >= 255 ? 'grin' : 'smile', facing: -1, look: -1 });
const ibPoseH = (f) => ({ L: 'hip', R: f >= 929 && f < 1003 ? 'point' : 'hang', expr: f >= 823 ? 'stern' : 'smile', facing: 1, look: 1 });
const dmPoseH = () => ({ L: 'cross', R: 'cross', expr: 'squint', facing: 1, look: 1 });
const rnPose = (f) => ({ L: 'pray', R: 'pray', expr: f >= 717 && f < 782 ? 'smile_closed' : f >= 1004 ? 'stern' : 'smile', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk, extra = {}) => { const { shake, bobW = 0, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: spk ? talk(f, spk, o.expr) : o.expr, bob: q(i.bob + bobW, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: pos[1], ...extra })); };
  if (f < HALL) { add('asepJas', asPose, 5, T_AS, 'A'); add('ibuKebayaHijau', ibPoseT, 3, T_IB, 'I'); add('darmanBatikUngu', dmPoseT, 2, T_DM, 'D'); }
  else { add('asepJas', asPose, 5, [q(asHallX(f), 4), 0, H_AS[2]], 'A'); add('rina', rnPose, 7, H_RN, 'R');
    const cry = f >= 990 && f < 1061, bp = () => ({ L: cry ? 'up' : 'hang', R: cry ? 'up' : 'hang', expr: cry ? ((f % 8) < 4 ? 'cry_t3' : 'cry_t2') : 'snore', facing: 0, look: 0, shake: cry });
    add('bayi', bp, 9, [H_RN[0] + 0.02, 0.62, H_RN[2] + 0.08], null, { s: 0.42 });
    if (f >= 800) { add('ibuKebayaHijau', ibPoseH, 3, H_IB, 'I'); add('darmanBatikUngu', dmPoseH, 2, H_DM, 'D'); } }
  return out;
};
export const fxAt = () => [];

// ---- overlay (kartu kecil di atas) ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const JUDGE = [[126, 160, 'AQIQAH?!', '#ff5d8f'], [610, 640, 'ASEP?!', '#ffe14a']];
const BANNERS = [[30, 93, 'UNDANGAN AQIQAH', '#3a8f6a'], [275, 340, 'AMPLOP PALING TEBEL', '#e8742c'], [581, 609, 'NAMA BAYI: ASEP', '#3a5bd9'], [750, 822, 'JANGAN SAMPAI KAYAK KAMU', '#e8344a'], [945, 1003, 'BAWA PULANG KOTAKNYA', '#8b5cf6']];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#b07a2a', 'PAK DARMAN'], R: ['#e8742c', 'RINA'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  const rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 20) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a, rows, idx }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
export const overlayAt = (f, g, T) => {
  if (f < 28) put(g, 540, 300, 1.2, f < 1 ? 1 : out_(f, 28), (p) => T.fxRoundCard(p, 'DIUNDANG MANTAN 2', 'MALAM KOMEDI', '#e8344a', Math.min(40, f + 6)));
  if (f >= 1108) put(g, 540, 330, 1.15, pop(f, 1108), (p) => T.fxRoundCard(p, 'MANTAN NGUNDANG AQIQAH?', 'DATENG NGGAK? KOMEN!', '#8b5cf6', Math.min(40, f - 1108)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  const C_ = telop(f); if (C_ && f < 1108) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1560, 1.2, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
