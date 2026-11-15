// "Bikin Brownies Viral" -- Asep (asepKoki) + Ibu (ibuDaster) + Pak Darman (darman). Dapur sore hujan (x=KX). Cinematic cameras, telops in screen space.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['A', 12, 119], ['I', 125, 210], ['A', 216, 334], ['I', 412, 471], ['A', 477, 570], ['I', 639, 746], ['A', 752, 828], ['D', 843, 938], ['D', 968, 1062], ['I', 1070, 1102], ['D', 1108, 1170], ['D', 1221, 1345], ['A', 1353, 1439]];
const TXT = ['BU! ASEP MAU BIKIN BROWNIES CRISPY YANG LAGI VIRAL. GAMPANG, CUMA LIMA MENIT!', 'LIMA MENIT? YANG DI VIDEO ITU UDAH DIPOTONG, SEP!', 'TENANG, BU. ASEP UDAH NONTON TUTORIALNYA... TIGA PULUH DETIK.',
  'SEP! OVENNYA JANGAN DIPOLIN!', 'BIAR CEPET, BU. CRISPY ITU KAN ARTINYA... PANAS BANGET.', 'YA AMPUN... INI BROWNIES APA ASPAL?!', 'INI VERSI... EXTRA CRISPY, BU.', 'SEP, INI KERAS BANGET. BAPAK COBA GIGIT...',
  '...GIGI BAPAK YANG CRISPY.', 'BUANG AJA, SEP!', 'EH, JANGAN! PAS BANGET INI.', 'NAH! GENTENG BOCOR BERES. SEP, BIKIN SEPULUH LAGI!', 'SIAP, PAK! MALAM KOMEDI BUKA JASA TAMBAL GENTENG!'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1498;
const OPEN = 600, KREK = 940, SEAL = 1205;
const SH = [['wide', 0, 124], ['ibu', 125, 215], ['asepLow', 216, 334], ['egg', 335, 360], ['asep', 361, 385], ['knob', 386, 411], ['ibu', 412, 476], ['asepLow', 477, 570], ['oven', 571, 638],
  ['ibu', 639, 746], ['asep', 747, 842], ['two', 843, 938], ['darmanECU', 939, 967], ['darman', 968, 1062], ['ibu', 1063, 1107], ['darman', 1108, 1170], ['leak', 1171, 1220], ['wide', 1221, 1345], ['asepCam', 1346, 1439], ['end', 1440, 1497]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'sore' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = { sore: { az: 120, el: 30, sky: '#dfe6f2', ground: '#6a5a48', hemi: 1.1, sun: '#ffd6a0', sunI: 2.5, fog: '#e8dcc8', fogNear: 28, fogFar: 150,
  skyTop: '#6a7a90', skyHor: '#c8d0dc', sat: 1.1, vig: 0.36, gain: '#fff0dc', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const KX = 480;
const AS = [KX - 0.3, 0.5, -0.55], IB = [KX - 1.45, 0.5, 0.35], DR = [KX + 0.85, 0.5, 0.25], LEAK = [KX + 1.35, 3.88, 0.15];
const drX = (f) => f < 805 ? KX + 3.6 : f < 842 ? lerp(KX + 3.6, DR[0], smooth(ramp(f, 805, 842))) : f < 1171 ? DR[0] : lerp(DR[0], KX + 1.12, smooth(ramp(f, 1171, 1190)));
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([KX - 0.2, 2.35, 5.4], [KX - 0.2, 1.85, -0.8], 50) }, { f: 124, ...K([KX - 0.2, 2.3, 4.9], [KX - 0.2, 1.87, -0.8], 50) }],
  ibu: [{ f: 0, ...K([IB[0] + 0.5, 1.62, IB[2] + 2.4], [IB[0], 1.98, IB[2]], 40) }, { f: 110, ...K([IB[0] + 0.42, 1.62, IB[2] + 2.1], [IB[0], 2.0, IB[2]], 40) }],
  asepLow: [{ f: 0, ...K([AS[0] + 0.45, 1.5, AS[2] + 2.5], [AS[0], 2.03, AS[2]], 40) }, { f: 120, ...K([AS[0] + 0.38, 1.52, AS[2] + 2.2], [AS[0], 2.05, AS[2]], 40) }],
  asep: [{ f: 0, ...K([AS[0] + 0.2, 2.05, AS[2] + 2.7], [AS[0], 1.95, AS[2]], 40) }, { f: 95, ...K([AS[0] + 0.15, 2.05, AS[2] + 2.4], [AS[0], 1.96, AS[2]], 40) }],
  egg: [{ f: 0, ...K([KX - 0.15, 1.9, -0.7], [KX - 0.35, 1.5, -1.45], 40) }, { f: 25, ...K([KX - 0.18, 1.85, -0.85], [KX - 0.35, 1.5, -1.45], 40) }],
  knob: [{ f: 0, ...K([KX + 1.2, 1.64, -0.5], [KX + 1.2, 1.64, -1.3], 40) }, { f: 25, ...K([KX + 1.2, 1.64, -0.7], [KX + 1.2, 1.64, -1.3], 40) }],
  oven: [{ f: 0, ...K([KX + 0.55, 1.35, 0.7], [KX + 0.8, 1.95, -1.4], 46) }, { f: 67, ...K([KX + 0.55, 1.38, 0.4], [KX + 0.8, 1.97, -1.4], 46) }],
  two: [{ f: 0, ...K([KX + 0.25, 2.1, 3.9], [KX + 0.25, 1.72, -0.2], 44) }, { f: 95, ...K([KX + 0.25, 2.08, 3.5], [KX + 0.25, 1.74, -0.2], 44) }],
  darmanECU: [{ f: 0, ...K([DR[0] - 0.12, 1.98, DR[2] + 1.5], [DR[0], 2.02, DR[2]], 38) }, { f: 28, ...K([DR[0] - 0.12, 1.98, DR[2] + 1.35], [DR[0], 2.02, DR[2]], 38) }],
  darman: [{ f: 0, ...K([DR[0] - 0.15, 2.05, DR[2] + 2.6], [DR[0], 1.97, DR[2]], 40) }, { f: 95, ...K([DR[0] - 0.12, 2.05, DR[2] + 2.3], [DR[0], 1.98, DR[2]], 40) }],
  leak: [{ f: 0, ...K([KX + 0.85, 1.25, 2.4], [KX + 1.25, 2.8, 0.0], 48) }, { f: 50, ...K([KX + 0.85, 1.25, 2.1], [KX + 1.25, 2.85, 0.0], 48) }],
  asepCam: [{ f: 0, ...K([AS[0], 1.98, AS[2] + 2.2], [AS[0], 1.98, AS[2]], 40) }, { f: 94, ...K([AS[0], 1.98, AS[2] + 1.9], [AS[0], 1.98, AS[2]], 40) }],
  end: [{ f: 0, ...K([KX - 0.2, 2.3, 4.9], [KX - 0.2, 1.87, -0.8], 50) }, { f: 57, ...K([KX - 0.2, 2.6, 6.2], [KX - 0.2, 1.9, -0.8], 50) }],
};
const KICKS = [{ f: 335, a: 0.03 }, { f: 361, a: 0.04 }, { f: 386, a: 0.03 }, { f: OPEN, a: 0.05 }, { f: 639, a: 0.04 }, { f: KREK, a: 0.07 }, { f: SEAL, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
const CINE = ['ibu', 'asepLow', 'asep', 'egg', 'knob', 'oven', 'darmanECU', 'darman', 'asepCam'];
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: CINE.includes(S.id) ? 8 : 3 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const A1 = { facing: -1, look: -1 }, AR = { facing: 1, look: 1 }, I1 = { facing: 1, look: 1 }, DL = { facing: -1, look: -1 };
const asPose = (f) => {
  if (f < 125) return { L: 'thumb', R: 'phone', expr: 'grin', ...A1 };
  if (f < 216) return { L: 'hang', R: 'phone', expr: 'smile', ...A1 };
  if (f < 335) return { L: 'hip', R: 'phone', expr: 'grin', ...A1 };
  if (f < 361) return { L: 'point', R: 'hang', expr: 'shock', ...AR };
  if (f < 386) return { L: 'up', R: 'up', expr: 'shock', shake: 1, ...A1, blink: 0 };
  if (f < 412) return { L: 'point', R: 'hang', expr: 'grin', ...AR };
  if (f < 477) return { L: 'hang', R: 'hang', expr: 'squint', ...A1 };
  if (f < OPEN) return { L: 'shrug', R: 'shrug', expr: 'grin', ...A1 };
  if (f < 639) return { L: 'belly', R: 'belly', expr: 'shock', ...AR, blink: 0 };
  if (f < 843) return { L: 'belly', R: 'belly', expr: f < 747 ? 'nervous' : 'smile_closed', ...A1 };
  if (f < 1108) return { L: 'belly', R: 'belly', expr: f > KREK ? 'shock' : 'nervous', ...AR };
  if (f < 1221) return { L: 'hang', R: 'hang', expr: 'shock', ...AR };
  if (f < 1346) return { L: 'up', R: 'hang', expr: 'laugh', ...AR };
  return { L: 'point', R: 'thumb', expr: 'grin', facing: 1, look: 0 };
};
const ibPose = (f) => {
  if (f < 125) return { L: 'hip', R: 'hang', expr: 'squint', ...I1 };
  if (f < 216) return { L: 'point', R: 'hip', expr: 'stubborn', ...I1 };
  if (f < 412) return { L: 'cross', R: 'cross', expr: 'squint', ...I1 };
  if (f < 477) return { L: 'up', R: 'point', expr: 'shock', shake: 1, ...I1, blink: 0 };
  if (f < 639) return { L: 'temple', R: 'hip', expr: 'nervous', ...I1 };
  if (f < 747) return { L: 'temple', R: 'up', expr: 'shock', shake: 1, ...I1, blink: 0 };
  if (f < 1063) return { L: 'cross', R: 'cross', expr: 'squint', ...I1 };
  if (f < 1108) return { L: 'point', R: 'hip', expr: 'stubborn', shake: 1, ...I1 };
  return { L: 'cheek', R: 'hang', expr: 'shock', ...I1, blink: f > SEAL ? 0 : undefined };
};
const drPose = (f) => {
  if (f < 843) return { L: 'hang', R: 'hang', expr: 'smile', step: q(walk(f, 805, 1.6, 0.6).phase, 2), ...DL };
  if (f < KREK) return { L: 'point', R: 'hang', expr: 'squint', ...DL };
  if (f < 968) return { L: 'cheek', R: 'hang', expr: 'cry', shake: 1, ...DL, blink: 0 };
  if (f < 1108) return { L: 'cheek', R: 'hang', expr: 'cry', ...DL };
  if (f < 1171) return { L: 'belly', R: 'belly', expr: 'grin', ...DL };
  if (f < 1221) return { L: 'up', R: 'up', expr: 'stubborn', step: f < 1190 ? q(walk(f, 1171, 1.6, 0.6).phase, 2) : 0, facing: 1, look: 1 };
  return { L: 'thumb', R: 'hip', expr: 'laugh', ...DL };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const { shake, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepKoki', asPose, 5, AS, 'A'); add('ibuDaster', ibPose, 3, IB, 'I'); add('darman', drPose, 2, [q(drX(f), 3), DR[1], DR[2]], 'D');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
export const fxAt = (f, T) => {
  const out = [];
  if (f >= 345 && f < 412) { const k = pop(f, 345); out.push(FXC('egg' + k, (p) => T.fxEgg(p, k), [KX - 0.3, 1.47, -1.22], 0.26, { order: 3 })); }
  if (f >= 361 && f < 412) out.push(FXC('fl' + (f - 361), (p) => T.fxFlour(p, f - 361), [AS[0], 1.05, AS[2] + 0.2], 0.62, { order: 6 }));
  if (f >= 386 && f < 412) { const a = q(-2.4 + 3.6 * smooth(ramp(f, 388, 402)), 2); out.push(FXC('kn' + a, (p) => T.fxKnob(p, a), [KX + 1.2, 1.44, -1.3], 0.2, { order: 3 })); }
  if (f >= OPEN - 4 && f < 720) out.push(FXC('sm' + (f % 40), (p) => T.fxSmoke(p, f), [KX + 0.85, 1.6, -1.2], 0.75, { order: 5 }));
  if (f >= OPEN) { const bite = f >= KREK ? 1 : 0; let pos, hold = 1;
    if (f < 1108) pos = [AS[0] + (f < 639 || (f >= 843 && f < 1108) ? 0.05 : -0.05), 1.3, AS[2] + 0.16];
    else if (f < 1171) { pos = [drX(f) - 0.06, 1.3, DR[2] + 0.16]; hold = 0; }
    else { const u = smooth(ramp(f, 1176, SEAL)); pos = [lerp(drX(f) + 0.1, LEAK[0], u), lerp(1.75, LEAK[1] - 0.12, u), lerp(DR[2] + 0.16, LEAK[2], u)]; hold = 0; }
    out.push(FXC('tray' + bite + hold, (p) => T.fxTray(p, bite, hold), pos, f >= 1171 ? 0.34 : 0.24, { order: 5 })); }
  if (f < SEAL) out.push(FXC('drip' + (f % 25), (p) => T.fxLeak(p, f), [LEAK[0], 0.8, LEAK[2]], 1.62, { order: 4 }));
  return out;
};

// ---- screen-space overlay: game-show telops ----
const JUDGE = [[645, 700, 'ASPAL?!', '#ff5d8f'], [KREK, 968, 'KREK!', '#ffe14a'], [SEAL + 1, 1250, 'BERES!', '#7ee08a']];
const BANNERS = [[128, 210, 'BROWNIES VIRAL: 170 JUTA VIEWS', '#e8742c', '#ffffff', false], [290, 334, 'TUTORIAL 30 DETIK', '#3a5bd9', '#ffffff', false],
  [386, 411, 'OVEN DIPOLIN!', '#e8344a', '#ffffff', false], [572, 638, 'HASILNYA...', '#3a3a44', '#ffffff', false], [762, 842, 'EXTRA CRISPY?!', '#8b5cf6', '#ffffff', false],
  [1360, 1440, 'JASA TAMBAL GENTENG', '#2f9a5a', '#ffffff', false]];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#b8642c', 'PAK DARMAN'] };
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
  if (f < 125) put(g, 540, 560, 1.75, f < 1 ? 1 : out_(f, 125), (p) => T.fxRoundCard(p, 'BIKIN BROWNIES VIRAL', 'MALAM KOMEDI', '#8a4b22', Math.min(40, f + 6)));
  if (f >= 1440) put(g, 540, 600, 1.7, pop(f, 1440), (p) => T.fxRoundCard(p, 'GAGAL RESEP VIRAL?', 'CERITAIN DI KOMENTAR!', '#e8742c', Math.min(40, f - 1440)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 1.3, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ffe14a', f));
  for (const [a, b_, t, hue, fg, dot] of BANNERS) put(g, 540, 270, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, fg, dot, f));
  const C_ = telop(f); if (C_ && f < 1440) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1400, 1.45, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
