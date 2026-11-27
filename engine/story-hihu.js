// "Asep Kena Hihu Seharian" -- tren kata "hihu" (prank aman di rumah, BUKAN prank motor di jalan). Suara "HIHU" pakai klip dari pengguna (sudah berizin). Ruang tengah siang (x=-40).
// Kostum baru: asepTieDye, ibuBungaCoklat, darmanGaris, ucupMerah. Properti: fxMejaRendang, fxSofa.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 931;
const LINES = [["I", 15, 63], ["A", 66, 90], ["I", 91, 117], ["D", 138, 186], ["A", 189, 248], ["D", 250, 275], ["U", 296, 357], ["A", 360, 422], ["U", 423, 449], ["A", 470, 517], ["I", 528, 608], ["A", 626, 652], ["A", 656, 707], ["A", 737, 785], ["D", 788, 814], ["A", 832, 892]];
const TXT = ["SEP! ADA DUIT JATUH DI BAWAH KURSI!", "MANA, BU? MANA?!", "HIHU!", "SEP, SENDALMU DIBAWA KUCING!", "HAH?! ITU SENDAL ASEP SATU-SATUNYA!", "HIHU!", "SEP! ADA NENG NYARIIN DI DEPAN!", "BENTAR! ASEP RAPIHIN RAMBUT DULU!", "HIHU!", "POKOKNYA ASEP NGGAK BAKAL KETIPU LAGI!", "SEP, MAKAN! ADA RENDANG!", "HIHU...", "ASEP NGGAK KETIPU LAGI!", "LHO... RENDANGNYA MANA, PAK?", "HIHU.", "...INI HIHU PALING JAHAT."];
const HIHU = [91, 250, 423, 626, 788];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const SH = [['ibu', 0, 65], ['asep', 66, 137], ['darman', 138, 188], ['asep2', 189, 295], ['ucup', 296, 359], ['asep3', 360, 469], ['asep4', 470, 527], ['ibu2', 528, 625], ['asep5', 626, 736], ['meja', 737, 831], ['asepEnd', 832, 930]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'day' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  day: { az: 60, el: 52, sky: '#eef2ff', ground: '#5a4a48', hemi: 1.4, sun: '#fff4e0', sunI: 2.5, fog: '#d8e0ec', fogNear: 40, fogFar: 260, skyTop: '#6aa8f0', skyHor: '#e8f2ff', sat: 1.12, vig: 0.24, gain: '#fff8ee', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX - 0.6, 0.5, -0.3], IB = [RX + 0.4, 0.5, -0.4], DM = [RX + 1.3, 0.5, -0.5], UC = [RX + 2.3, 0.5, -0.1], DMT = [RX + 1.6, 0.5, -0.6], TB = [RX + 1.6, 0.5, -0.15];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const CAMS = {
  ibu: cu(IB, 2.0, 2.2, 0.3, 40), asep: cu(AS, 1.9, 2.3, -0.3, 42), darman: cu(DM, 2.0, 2.2, 0.3, 40), asep2: cu(AS, 2.0, 2.3, -0.3, 42), ucup: cu(UC, 2.0, 2.3, 0.3, 40),
  asep3: cu(AS, 2.0, 2.2, -0.25, 40), asep4: cu(AS, 2.0, 2.1, 0.25, 38), ibu2: cu(IB, 2.0, 2.3, 0.3, 40), asep5: cu(AS, 2.0, 2.2, -0.25, 40),
  meja: [{ f: 0, ...K([TB[0] + 0.2, 1.75, TB[2] + 2.4], [TB[0], 1.6, TB[2]], 42) }, { f: 43, ...K([TB[0] + 0.15, 1.7, TB[2] + 2.0], [TB[0], 1.6, TB[2]], 40) }],
  asepEnd: cu(AS, 2.0, 2.0, 0.2, 38),
};
const KICKS = HIHU.map((f) => ({ f, a: 0.08 }));
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const tricked = (f) => HIHU.slice(0, 3).some((h) => f >= h && f < h + 45);
const asPose = (f) => {
  if (f < 66) return { L: 'hang', R: 'hang', expr: 'shock', facing: 1, look: 1 };
  if (f < 138) return { L: 'reach', R: 'reach', lift: 0, expr: f < 91 ? 'grin' : 'shock', facing: 0, look: 0, bob: 0.05, headTilt: 12, blink: f >= 91 ? 0 : undefined };
  if (f < 296) return { L: 'hang', R: f < 250 ? 'up' : 'point', expr: f < 250 ? 'shock' : 'squint', facing: -1, look: -1, shake: f >= 189 && f < 248 };
  if (f < 470) return { L: 'temple', R: 'cheek', expr: f < 423 ? 'smug' : 'shock', facing: 1, look: 1 };
  if (f < 528) return { L: 'up', R: 'up', expr: 'squint', facing: 0, look: 0, shake: 1 };
  if (f < 737) return { L: 'cross', R: 'cross', expr: 'smug', facing: 0, look: 0, headTilt: 6 };
  return { L: 'hang', R: 'hang', expr: f < 832 ? 'shock' : 'cry', facing: 1, look: 1 };
};
const ibPose = (f) => (f < 528 ? { L: 'hip', R: f >= 91 && f < 137 ? 'point' : 'hang', expr: f < 91 ? 'nervous' : 'grin', facing: -1, look: -1 } : { L: 'hip', R: 'reach', expr: 'smile', facing: -1, look: -1 });
const dmPose = (f) => (f >= 700 ? null : { L: 'hip', R: f >= 250 && f < 295 ? 'point' : 'hang', expr: f < 250 ? 'shock' : 'grin', facing: -1, look: -1 });
const dmEat = (f) => (f < 700 ? null : { L: 'belly', R: 'cheek', expr: f < 788 ? 'smile_closed' : 'smug', facing: -1, look: -1, bob: q(0.006 * Math.abs(Math.sin(f * 0.6)), 3) });
const ucPose = (f) => (f < 286 || f > 470 ? null : { L: 'hang', R: f >= 423 ? 'point' : 'wave', wv: f * 0.4, expr: f < 423 ? 'nervous' : 'grin', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepTieDye', asPose, 5, AS, 'A'); add('ibuBungaCoklat', ibPose, 3, IB, 'I'); add('darmanGaris', dmPose, 8, DM, 'D'); add('darmanGaris', dmEat, 8, DMT, 'D'); add('ucupMerah', ucPose, 4, UC, 'U');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [FXC('sofa', (p) => T.fxSofa(p, '#5a8a6a'), [RX - 0.2, 0.5, -1.25], 1.6, { order: 1 })];
  const empty = f >= 700 ? 1 : 0; out.push(FXC('meja' + empty + (empty ? 0 : Math.floor(f / 3) % 20), (p) => T.fxMejaRendang(p, empty, f), TB, 0.85, { order: 8 }));
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[91, 137, 'HIHU!', '#ffe14a'], [250, 295, 'HIHU!', '#ffe14a'], [423, 469, 'HIHU!', '#ffe14a'], [626, 655, 'HIHU...', '#c8a0ff'], [788, 831, 'HIHU.', '#ff5d8f']];
const BANNERS = [[470, 527, 'KETIPU 3 KALI', '#c0392b']];
const SPK = { U: ['#ffd84a', 'UCUP'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 897) put(g, 540, 300, 1.2, pop(f, 897), (p) => T.fxRoundCard(p, 'HIHU', 'KORBAN: ASEP (4X)', '#c0392b', Math.min(40, f - 897)));
  if (f < 897) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
