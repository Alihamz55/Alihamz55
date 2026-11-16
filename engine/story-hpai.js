// "HP Baru Gaptek 2: Pak Darman vs Asisten AI" -- ruang tengah malam (x=-40). Kostum baru: darmanKoko, asepHoodie, ibuDasterUngu.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['D', 12, 59], ['H', 64, 210], ['D', 218, 280], ['H', 285, 372], ['I', 375, 389], ['A', 395, 479], ['D', 484, 589], ['H', 597, 691], ['I', 721, 764], ['D', 770, 840], ['I', 849, 891], ['H', 896, 920],
  ['D', 935, 982], ['H', 990, 1074], ['A', 1092, 1204], ['D', 1219, 1285], ['H', 1290, 1359], ['I', 1371, 1401], ['D', 1412, 1501]];
const TXT = ['HP! TELEPON IBU!', 'BAIK. MEMESAN... IBU-IBU ARISAN. TIGA PULUH PORSI.', 'BUKAN! BATALKAN!', 'BAIK. MEMBATALKAN... PERNIKAHAN.', 'PAK?!', 'PAK, NGOMONGNYA PELAN-PELAN. YANG JELAS.',
  'YA... UDAH... MATIKAN... AJA... KAMU.', 'BAIK. MEMATIKAN... LAMPU RUMAH.', 'PAK! LAMPUNYA!', 'BUKAN BAPAK, BU! HP-NYA!', 'HP. NYALAKAN LAMPU.', 'BAIK, BU.', 'LHO?! KOK SAMA IBU NURUT?!', 'KARENA IBU... YANG BAYAR CICILAN.',
  'PAK... HP-NYA AJA TAHU SIAPA BOSNYA.', 'HP... TELEPON IBU.', 'IBU ADA DI SEBELAH BAPAK.', 'MAU NGOMONG APA, PAK?', '...ARISAN TIGA PULUH PORSI DIBATALIN YA, BU.'];
const HPTXT = { 64: ['MEMESAN:', 'IBU-IBU ARISAN', '30 PORSI'], 285: ['MEMBATALKAN:', 'PERNIKAHAN', ''], 597: ['MEMATIKAN:', 'LAMPU RUMAH', ''], 896: ['MENYALAKAN:', 'LAMPU RUMAH', ''],
  990: ['ALASAN:', 'IBU YANG BAYAR', 'CICILAN'], 1290: ['LOKASI IBU:', 'DI SEBELAH', 'BAPAK'] };
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1533;
const OFF = 693, ON = 921; // lampu mati / nyala
const SH = [['wide', 0, 63], ['hp', 64, 217], ['darman', 218, 284], ['hp', 285, 374], ['ibuDoor', 375, 394], ['asep', 395, 483], ['darmanECU', 484, 596], ['hp', 597, 692], ['dark', 693, 895], ['hp', 896, 934],
  ['darman', 935, 989], ['hp', 990, 1091], ['asep', 1092, 1218], ['darman', 1219, 1289], ['hp', 1290, 1370], ['two', 1371, 1411], ['darmanECU', 1412, 1532]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a >= OFF && a < ON ? 'dark' : 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
const ROOM = { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.15, sun: '#ffe8cc', sunI: 2.3, fog: '#141c3a', fogNear: 40, fogFar: 260, skyTop: '#060a24', skyHor: '#22305e', sat: 1.08, vig: 0.32, gain: '#fff2e4', shadowExt: 9 };
export const LIGHTS = { room: ROOM, dark: { ...ROOM, hemi: 0.16, sunI: 0.18, sky: '#3a4a8a', ground: '#0a0a14', sat: 0.7, vig: 0.75, gain: '#9ab0ff' } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const DM = [RX + 0.2, 0.5, 0.5], AS = [RX + 1.35, 0.5, 0.4], IB0 = [RX - 2.5, 0.5, -0.2], IB1 = [RX - 0.85, 0.5, 0.5];
const ibPos = (f) => f < 790 ? IB0 : f < 845 ? [lerp(IB0[0], IB1[0], smooth(ramp(f, 790, 845))), 0.5, lerp(IB0[2], IB1[2], smooth(ramp(f, 790, 845)))] : IB1;
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([RX + 0.3, 2.2, 5.2], [RX + 0.3, 1.85, 0.2], 46) }, { f: 63, ...K([RX + 0.25, 2.1, 4.4], [RX + 0.25, 1.88, 0.3], 46) }],
  hp: [{ f: 0, ...K([DM[0] + 0.15, 1.75, DM[2] + 1.4], [DM[0], 1.85, DM[2]], 40) }, { f: 150, ...K([DM[0] + 0.1, 1.76, DM[2] + 1.2], [DM[0], 1.86, DM[2]], 40) }],
  darman: [{ f: 0, ...K([DM[0] + 0.45, 1.55, DM[2] + 2.5], [DM[0], 1.98, DM[2]], 40) }, { f: 120, ...K([DM[0] + 0.38, 1.58, DM[2] + 2.2], [DM[0], 2.0, DM[2]], 40) }],
  darmanECU: [{ f: 0, ...K([DM[0] + 0.2, 1.88, DM[2] + 1.85], [DM[0], 2.02, DM[2]], 36) }, { f: 120, ...K([DM[0] + 0.15, 1.88, DM[2] + 1.6], [DM[0], 2.04, DM[2]], 36) }],
  ibuDoor: [{ f: 0, ...K([IB0[0] + 0.5, 1.7, IB0[2] + 2.4], [IB0[0], 2.0, IB0[2]], 40) }, { f: 20, ...K([IB0[0] + 0.45, 1.7, IB0[2] + 2.1], [IB0[0], 2.02, IB0[2]], 40) }],
  asep: [{ f: 0, ...K([AS[0] - 0.45, 1.55, AS[2] + 2.5], [AS[0], 1.98, AS[2]], 40) }, { f: 125, ...K([AS[0] - 0.38, 1.58, AS[2] + 2.2], [AS[0], 2.0, AS[2]], 40) }],
  dark: [{ f: 0, ...K([RX - 0.3, 2.1, 5.0], [RX - 0.3, 1.85, 0.2], 48) }, { f: 200, ...K([RX - 0.3, 2.05, 4.4], [RX - 0.3, 1.88, 0.3], 48) }],
  two: [{ f: 0, ...K([RX - 0.32, 1.8, 3.6], [RX - 0.32, 1.95, 0.5], 44) }, { f: 40, ...K([RX - 0.32, 1.8, 3.3], [RX - 0.32, 1.96, 0.5], 44) }],
};
const KICKS = [{ f: 64, a: 0.04 }, { f: 285, a: 0.05 }, { f: 375, a: 0.06 }, { f: 1040, a: 0.07 }, { f: 1290, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0;
  if (f >= ON && f < ON + 4) c.flash = 0.5 * (1 - (f - ON) / 4); return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: S.id === 'hp' ? 14 : ['darman', 'darmanECU', 'asep', 'ibuDoor'].includes(S.id) ? 8 : 3 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const dmPose = (f) => {
  const dark = f >= OFF && f < ON;
  if (f < 64) return { L: 'hip', R: 'phone', expr: 'grin', facing: 0, look: 0 };
  if (f < 285) return { L: 'up', R: 'phone', expr: 'shock', facing: 0, look: 0, shake: f > 218 };
  if (f < 395) return { L: 'temple', R: 'phone', expr: 'nervous', facing: -1, look: -1 };
  if (f < 484) return { L: 'hang', R: 'phone', expr: 'squint', facing: 1, look: 1 };
  if (f < 597) return { L: 'hang', R: 'phone', expr: 'stern', facing: 0, look: 0, headTilt: 6 };
  if (f < OFF) return { L: 'hang', R: 'phone', expr: 'shock', facing: 0, look: 0, blink: 0 };
  if (dark) return { L: 'up', R: f > 850 ? 'hang' : 'phone', expr: 'shock', facing: -1, look: -1, blink: 0, shake: f > 770 && f < 840 };
  if (f < 1092) return { L: 'up', R: 'hang', expr: f > 1040 ? 'shock' : 'stern', facing: -1, look: -1, shake: f < 990 };
  if (f < 1219) return { L: 'cross', R: 'cross', expr: 'sad', facing: 1, look: 1 };
  if (f < 1371) return { L: 'hang', R: 'phone', expr: 'sad', facing: 0, look: 0 };
  if (f < 1412) return { L: 'hang', R: 'phone', expr: 'nervous', facing: -1, look: -1, blink: 0 };
  return { L: 'hang', R: 'hang', expr: f > 1460 ? 'smile_closed' : 'nervous', facing: -1, look: -1 };
};
const asPose = (f) => {
  if (f < 395) return { L: 'hip', R: 'hang', expr: f > 285 ? 'shock' : 'squint', facing: -1, look: -1 };
  if (f < 484) return { L: 'shrug', R: 'hip', expr: 'smile', facing: -1, look: -1 };
  if (f >= OFF && f < ON) return { L: 'up', R: 'up', expr: 'shock', facing: 0, look: 0, blink: 0 };
  if (f < 1092) return { L: 'hip', R: 'hang', expr: 'squint', facing: -1, look: -1 };
  if (f < 1219) return { L: 'belly', R: 'point', expr: 'laugh', facing: -1, look: -1 };
  return { L: 'hip', R: 'hang', expr: 'smile_closed', facing: -1, look: -1 };
};
const ibPose = (f) => {
  if (f < 790) return { L: 'hip', R: 'point', expr: f < 375 ? 'neutral' : 'stern', facing: 1, look: 1, blink: f >= 375 && f < 395 ? 0 : undefined };
  if (f < 845) return { L: 'hang', R: 'hang', expr: 'stern', facing: 1, look: 1, walking: true };
  if (f < 935) return { L: 'hip', R: 'phone', expr: 'stern', facing: 0, look: 0 };
  if (f < 1371) return { L: 'hip', R: 'phone', expr: 'smile_closed', facing: 0, look: 0 };
  return { L: 'cross', R: 'cross', expr: 'stern', facing: 1, look: 1 };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const { shake, walking, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    if (walking) o.step = q((f / 12) % 1, 2);
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('darmanKoko', dmPose, 2, DM, 'D'); add('asepHoodie', asPose, 5, AS, 'A'); add('ibuDasterUngu', ibPose, 3, ibPos(f), 'I');
  return out;
};
export const fxAt = () => [];

// ---- screen-space overlay (small cards near the top) ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
const phone = (g, f, a, lines) => { const k = pop(f, a, 6); if (k <= 0.01) return; g.save(); g.translate(540, 880); g.scale(1.25 * k, 1.25 * k); g.rotate(-0.03);
  rr(g, -250, -430, 500, 860, 60); g.fillStyle = '#16181f'; g.fill(); g.lineWidth = 10; g.strokeStyle = '#1a1220'; g.stroke();
  rr(g, -225, -400, 450, 800, 40); const gr = g.createLinearGradient(0, -400, 0, 400); gr.addColorStop(0, '#2a3a8a'); gr.addColorStop(1, '#6a3aa0'); g.fillStyle = gr; g.fill();
  g.fillStyle = '#ffffff'; g.font = '700 46px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ASISTEN', 0, -330);
  const sp = speaks(f, 'H'), lv = sp ? +(LIPS[f] || 0) : 0;
  for (let i = 0; i < 15; i++) { const h = 20 + (sp ? (lv * 40 + 60 * Math.abs(Math.sin(f * 0.6 + i * 0.9))) * Math.sin(Math.PI * (i + 0.5) / 15) : 8 * Math.sin(f * 0.2 + i)); g.fillStyle = '#9fe8ff';
    rr(g, -196 + i * 27, -120 - h / 2, 16, h, 8); g.fill(); }
  lines.forEach((t, j) => { g.font = (j === 1 ? '700 60px' : '700 48px') + ' Fredoka, sans-serif'; g.fillStyle = j === 1 ? '#ffe14a' : '#ffffff'; g.fillText(t, 0, 40 + j * 80); });
  g.restore(); };
const JUDGE = [[375, 395, 'PAK?!', '#ff5d8f'], [1040, 1091, 'BAYAR CICILAN!', '#ffe14a']];
const BANNERS = [[100, 217, 'ARISAN 30 PORSI', '#e8742c'], [320, 374, 'PERNIKAHAN DIBATALKAN?!', '#e8344a'], [700, 760, 'LAMPU MATI', '#3a3f52'], [1110, 1218, 'BOSNYA: IBU', '#d9478a'], [1440, 1500, 'ARISAN DIBATALIN', '#2f9a5a']];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#b07a2a', 'PAK DARMAN'], H: ['#4a5a8a', 'HP'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  const rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 20) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a, rows, idx }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
export const overlayAt = (f, g, T) => {
  const S = shotAt(f);
  if (S.light === 'dark') { g.save(); g.fillStyle = 'rgba(4,6,20,0.55)'; g.fillRect(0, 0, 1080, 1920); g.restore(); }
  if (S.id === 'hp') { const key = Object.keys(HPTXT).map(Number).filter((x) => x <= f).pop(); phone(g, f, S.a, HPTXT[key] || ['', '', '']); }
  if (f < 60) put(g, 540, 300, 1.25, f < 1 ? 1 : out_(f, 60), (p) => T.fxRoundCard(p, 'HP BARU GAPTEK 2', 'MALAM KOMEDI', '#3a5bd9', Math.min(40, f + 6)));
  if (f >= 1502) put(g, 540, 330, 1.15, pop(f, 1502), (p) => T.fxRoundCard(p, 'ORTU SALAH PERINTAH?', 'CERITAIN DI KOMENTAR!', '#8b5cf6', Math.min(40, f - 1502)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, S.id === 'hp' ? 130 : 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  const C_ = telop(f); if (C_ && f < 1502) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1560, 1.2, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
