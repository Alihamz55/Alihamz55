// "Parkir Rp35 Ribu" -- Pak Darman (darmanMotor) parkir 5 detik, Asep (asepParkir) juru parkir dadakan, Mang Ujang (ujangGorengan) cameo. Warung sore (x=160).
// Kartu teks diperkecil (+posisi atas) supaya tidak menutupi karakter.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['D', 12, 79], ['A', 96, 124], ['D', 130, 223], ['A', 228, 338], ['D', 344, 374], ['A', 379, 512], ['D', 518, 565], ['A', 571, 653], ['D', 668, 718], ['A', 723, 786], ['D', 792, 846], ['A', 852, 942],
  ['U', 972, 1071], ['D', 1077, 1208], ['A', 1214, 1296], ['D', 1304, 1378], ['A', 1393, 1433]];
const TXT = ['CUMA LIMA DETIK, BELI GORENGAN.', 'TIGA PULUH LIMA RIBU, PAK!', 'TIGA PULUH LIMA RIBU?! SAYA BARU PARKIR LIMA DETIK!', 'JUSTRU ITU, PAK. LIMA DETIK ITU... JAM SIBUK.', 'RINCIANNYA APA?!',
  'PARKIR, SEPULUH RIBU. JAGA HELM, SEPULUH RIBU...', 'TERUS LIMA BELAS RIBU LAGI?', 'BIAYA... MOTORNYA GANTENG, PAK.', 'KAMU DARI TADI NGGAK NGAPA-NGAPAIN!', 'SIAPA BILANG? SAYA BANTU MUNDURIN.',
  'MOTORNYA DARI TADI DIEM!', 'NAH. BERHASIL KAN, PAK? NGGAK KE MANA-MANA.', 'GORENGANNYA LIMA RIBU, PAK. CABENYA NGGAK DIKASIH, MAHAL.', 'GORENGAN LIMA RIBU... PARKIRNYA TIGA PULUH LIMA RIBU?!',
  'GORENGANNYA MAU DIJAGAIN JUGA, PAK? SEPULUH RIBU.', 'UDAH! MULAI BESOK BAPAK JALAN KAKI!', 'PEJALAN KAKI LIMA RIBU, PAK!'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1474;
const SH = [['wide', 0, 83], ['whistle', 84, 129], ['darman', 130, 227], ['asep', 228, 343], ['darman', 344, 378], ['asepBook', 379, 517], ['darman', 518, 570], ['asepECU', 571, 667], ['two', 668, 722],
  ['asep', 723, 791], ['darman', 792, 851], ['asepECU', 852, 941], ['stare', 942, 971], ['ujang', 972, 1076], ['darman', 1077, 1213], ['asep', 1214, 1303], ['leave', 1304, 1392], ['asepEnd', 1393, 1473]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'sore' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { sore: { az: 250, el: 30, sky: '#ffd8b0', ground: '#8a6a4a', hemi: 1.1, sun: '#ffd0a0', sunI: 2.3, fog: '#f0c8a0', fogNear: 40, fogFar: 220,
  skyTop: '#6a8ad8', skyHor: '#ffc8a0', sat: 1.08, vig: 0.3, gain: '#fff0e0', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const WX = 160;
const DM = [WX - 0.9, 0.5, 0.6], AS = [WX + 1.15, 0.5, 0.6], UJ = [WX - 1.75, 0.5, -0.75], MOTOR = [WX + 0.1, 0.5, 0.15], TIANG = [WX + 2.2, 0.5, -0.4], GRB = [WX - 2.3, 0.5, -0.55];
const asX = (f) => f < 84 ? WX + 2.6 : f < 98 ? lerp(WX + 2.6, AS[0], M.back(ramp(f, 84, 98))) : AS[0];
const dmX = (f) => f < 1335 ? DM[0] : lerp(DM[0], WX - 4.0, ramp(f, 1335, 1392));
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([WX + 0.1, 2.3, 6.4], [WX + 0.1, 1.8, 0.2], 46) }, { f: 83, ...K([WX - 0.2, 2.2, 5.6], [WX - 0.3, 1.8, 0.3], 46) }],
  whistle: [{ f: 0, ...K([AS[0] - 0.35, 1.35, AS[2] + 2.2], [AS[0], 2.0, AS[2]], 40) }, { f: 45, ...K([AS[0] - 0.3, 1.38, AS[2] + 1.9], [AS[0], 2.02, AS[2]], 40) }],
  darman: [{ f: 0, ...K([DM[0] + 0.45, 1.55, DM[2] + 2.5], [DM[0], 1.98, DM[2]], 40) }, { f: 130, ...K([DM[0] + 0.38, 1.58, DM[2] + 2.2], [DM[0], 2.0, DM[2]], 40) }],
  asep: [{ f: 0, ...K([AS[0] - 0.45, 1.55, AS[2] + 2.5], [AS[0], 1.98, AS[2]], 40) }, { f: 110, ...K([AS[0] - 0.38, 1.58, AS[2] + 2.2], [AS[0], 2.0, AS[2]], 40) }],
  asepBook: [{ f: 0, ...K([AS[0] - 0.3, 1.75, AS[2] + 2.1], [AS[0], 1.92, AS[2]], 40) }, { f: 140, ...K([AS[0] - 0.25, 1.78, AS[2] + 1.8], [AS[0], 1.95, AS[2]], 40) }],
  asepECU: [{ f: 0, ...K([AS[0] - 0.2, 1.85, AS[2] + 2.15], [AS[0], 2.0, AS[2]], 36) }, { f: 95, ...K([AS[0] - 0.15, 1.86, AS[2] + 1.9], [AS[0], 2.02, AS[2]], 36) }],
  two: [{ f: 0, ...K([WX + 0.12, 2.0, 6.0], [WX + 0.12, 1.8, 0.4], 48) }, { f: 55, ...K([WX + 0.12, 2.0, 5.6], [WX + 0.12, 1.8, 0.4], 48) }],
  stare: [{ f: 0, ...K([DM[0], 1.95, DM[2] + 2.0], [DM[0], 1.98, DM[2]], 36) }, { f: 30, ...K([DM[0], 1.96, DM[2] + 1.75], [DM[0], 2.0, DM[2]], 36) }],
  ujang: [{ f: 0, ...K([UJ[0] - 0.1, 1.85, UJ[2] + 2.7], [UJ[0] - 0.2, 1.95, UJ[2]], 42) }, { f: 105, ...K([UJ[0] - 0.1, 1.86, UJ[2] + 2.4], [UJ[0] - 0.2, 1.97, UJ[2]], 42) }],
  leave: [{ f: 0, ...K([WX - 0.6, 2.3, 6.4], [WX - 0.9, 1.8, 0.2], 46) }, { f: 88, ...K([WX - 1.6, 2.3, 6.4], [WX - 1.6, 1.8, 0.2], 46) }],
  asepEnd: [{ f: 0, ...K([AS[0] - 0.4, 1.4, AS[2] + 2.3], [AS[0], 2.0, AS[2]], 40) }, { f: 80, ...K([AS[0] - 0.35, 1.42, AS[2] + 2.0], [AS[0], 2.02, AS[2]], 40) }],
};
const KICKS = [{ f: 96, a: 0.06 }, { f: 300, a: 0.04 }, { f: 610, a: 0.05 }, { f: 900, a: 0.05 }, { f: 1170, a: 0.07 }, { f: 1393, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
const CINE = ['whistle', 'darman', 'asep', 'asepBook', 'asepECU', 'stare', 'ujang', 'asepEnd'];
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: CINE.includes(S.id) ? 8 : 3 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const D1 = { facing: 1, look: 1 }, A1 = { facing: -1, look: -1 };
const dmPose = (f) => {
  if (f < 84) return { L: 'hang', R: 'hip', expr: 'smile', facing: 0, look: 0 };
  if (f < 130) return { L: 'hang', R: 'hang', expr: 'shock', ...D1, blink: 0 };
  if (f < 228) return { L: 'up', R: 'hip', expr: 'shock', ...D1, shake: 1 };
  if (f < 379) return { L: 'hip', R: f > 340 ? 'point' : 'hip', expr: 'stern', ...D1 };
  if (f < 571) return { L: 'cross', R: 'cross', expr: 'squint', ...D1 };
  if (f < 723) return { L: 'hip', R: 'point', expr: 'stern', ...D1 };
  if (f < 852) return { L: 'temple', R: 'point', expr: 'stern', ...D1, shake: f > 792 };
  if (f < 972) return { L: 'hang', R: 'hang', expr: 'squint', facing: 0, look: 0 };
  if (f < 1077) return { L: 'hang', R: 'hang', expr: 'neutral', facing: -1, look: -1 };
  if (f < 1214) return { L: 'up', R: 'up', expr: f > 1160 ? 'shock' : 'stern', ...D1, shake: f > 1160 };
  if (f < 1304) return { L: 'cross', R: 'cross', expr: 'stern', ...D1 };
  if (f < 1335) return { L: 'hip', R: 'hip', expr: 'stern', facing: -1, look: -1 };
  return { L: 'hang', R: 'hang', expr: f > 1395 ? 'shock' : 'stern', facing: -1, look: -1, walking: true };
};
const asPose = (f) => {
  if (f < 130) return { L: 'point', R: 'hip', expr: 'grin', ...A1 };
  if (f < 379) return { L: 'hip', R: 'shrug', expr: f > 300 ? 'smile_closed' : 'smile', ...A1 };
  if (f < 571) return { L: 'wallet', R: 'wallet', expr: 'squint', ...A1 };
  if (f < 668) return { L: 'wallet', R: 'thumb', expr: 'grin', ...A1 };
  if (f < 852) return { L: 'hip', R: 'shrug', expr: 'smile', ...A1 };
  if (f < 972) return { L: 'hip', R: 'thumb', expr: 'smile_closed', ...A1 };
  if (f < 1214) return { L: 'hang', R: 'hang', expr: 'smile', ...A1 };
  if (f < 1304) return { L: 'hang', R: 'shrug', expr: 'grin', ...A1 };
  if (f < 1393) return { L: 'hang', R: 'hang', expr: 'smile', facing: -1, look: -1 };
  return { L: 'point', R: 'up', expr: 'grin', ...A1 };
};
const ujPose = (f) => ({ L: 'hang', R: f > 972 && f < 1071 ? 'shrug' : 'hang', expr: 'smile_closed', facing: 1, look: 1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const { shake, walking, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    if (walking) o.step = q((f / 12) % 1, 2);
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('darmanMotor', dmPose, 2, [q(dmX(f), 3), DM[1], DM[2]], 'D'); add('asepParkir', asPose, 5, [q(asX(f), 3), AS[1], AS[2]], 'A'); add('ujangGorengan', ujPose, 4, UJ, 'U');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
export const fxAt = (f, T) => [
  FXC('motor', (p) => T.fxSkuter(p, '#2f7ac8'), MOTOR, 0.95, { order: 2, shadow: true }),
  FXC('tiang', (p) => T.fxTiang(p), TIANG, 3.4, { order: 1 }),
  FXC('gerobak', (p) => T.fxGerobak(p), [GRB[0] - 0.55, GRB[1], GRB[2]], 0.72, { order: 3, shadow: true }),
];

// ---- screen-space overlay (smaller cards, kept above faces) ----
const JUDGE = [[84, 126, 'PRIIIT!', '#ffe14a'], [300, 338, 'JAM SIBUK?!', '#ff5d8f'], [1170, 1208, 'Rp35 RIBU?!', '#ff5d8f'], [1393, 1409, 'PRIIIT!', '#ffe14a']];
const BANNERS = [[140, 223, '5 DETIK = Rp35.000', '#e8344a'], [420, 512, 'PARKIR 10RB + HELM 10RB', '#3a5bd9'], [612, 667, 'BIAYA MOTOR GANTENG: 15RB', '#8b5cf6'], [895, 971, 'NGGAK KE MANA-MANA', '#2f9a5a'],
  [1240, 1303, 'JAGA GORENGAN: Rp10.000', '#e8742c'], [1409, 1436, 'PEJALAN KAKI: Rp5.000', '#e8344a']];
const SPK = { A: ['#2f9a5a', 'ASEP'], D: ['#b07a2a', 'PAK DARMAN'], U: ['#3a8f6a', 'MANG UJANG'] };
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
  if (f < 80) put(g, 540, 300, 1.25, f < 1 ? 1 : out_(f, 80), (p) => T.fxRoundCard(p, 'PARKIR Rp35 RIBU', 'MALAM KOMEDI', '#e8344a', Math.min(40, f + 6)));
  if (f >= 1436) put(g, 540, 330, 1.2, pop(f, 1436), (p) => T.fxRoundCard(p, 'TARIF PARKIR TERANEH?', 'TULIS DI KOMENTAR!', '#3a5bd9', Math.min(40, f - 1436)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  const C_ = telop(f); if (C_ && f < 1436) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1540, 1.2, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
