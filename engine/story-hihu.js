// "Asep Kena Hihu Seharian" -- tren kata "hihu" (prank aman di rumah, BUKAN prank motor di jalan). Suara "HIHU" pakai klip dari pengguna (sudah berizin). Ruang tengah siang (x=-40).
// Kostum baru: asepTieDye, ibuBungaCoklat, darmanGaris, ucupMerah. Properti: fxMejaRendang, fxSofa.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 736;
const LINES = [["I", 15, 63], ["I", 66, 92], ["D", 113, 160], ["D", 163, 189], ["U", 210, 271], ["U", 274, 300], ["A", 321, 368], ["I", 378, 459], ["A", 477, 502], ["A", 507, 558], ["D", 594, 620], ["A", 638, 697]];
const TXT = ["SEP! ADA DUIT JATUH DI BAWAH KURSI!", "HIHU!", "SEP, SENDALMU DIBAWA KUCING!", "HIHU!", "SEP! ADA NENG NYARIIN DI DEPAN!", "HIHU!", "POKOKNYA ASEP NGGAK BAKAL KETIPU LAGI!", "SEP, MAKAN! ADA RENDANG!", "HIHU...", "ASEP NGGAK KETIPU LAGI!", "HIHU.", "...INI HIHU PALING JAHAT."];
const HIHU = [66, 163, 274, 477, 594];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const SH = [['ibu', 0, 63], ['asep', 64, 112], ['darman', 113, 162], ['asep2', 163, 209], ['ucup', 210, 273], ['asep3', 274, 320], ['asep4', 321, 377], ['ibu2', 378, 476], ['asep5', 477, 593], ['meja', 594, 637], ['asepEnd', 638, 735]];
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
  if (f < 64) return { L: 'hang', R: 'hang', expr: 'shock', facing: 1, look: 1 };
  if (f < 113) return { L: 'reach', R: 'reach', lift: 0, expr: f < 66 ? 'grin' : 'shock', facing: 0, look: 0, bob: 0.05, headTilt: 12, blink: 0 };
  if (f < 210) return { L: 'hang', R: 'point', expr: f < 163 ? 'shock' : 'squint', facing: -1, look: -1 };
  if (f < 321) return { L: 'temple', R: 'cheek', expr: f < 274 ? 'smug' : 'shock', facing: 1, look: 1 };
  if (f < 378) return { L: 'up', R: 'up', expr: 'squint', facing: 0, look: 0, shake: 1 };
  if (f < 594) return { L: 'cross', R: 'cross', expr: 'smug', facing: 0, look: 0, headTilt: 6 };
  return { L: 'hang', R: 'hang', expr: f < 660 ? 'shock' : 'cry', facing: 1, look: 1 };
};
const ibPose = (f) => (f < 378 ? { L: 'hip', R: f >= 66 && f < 112 ? 'point' : 'hang', expr: f < 66 ? 'nervous' : 'grin', facing: -1, look: -1 } : { L: 'hip', R: 'reach', expr: 'smile', facing: -1, look: -1 });
const dmPose = (f) => (f >= 560 ? null : { L: 'hip', R: f >= 163 && f < 209 ? 'point' : 'hang', expr: f < 163 ? 'shock' : 'grin', facing: -1, look: -1 });
const dmEat = (f) => (f < 560 ? null : { L: 'belly', R: 'cheek', expr: f < 594 ? 'smile_closed' : 'smug', facing: -1, look: -1, bob: q(0.006 * Math.abs(Math.sin(f * 0.6)), 3) });
const ucPose = (f) => (f < 200 || f > 330 ? null : { L: 'hang', R: f >= 274 ? 'point' : 'wave', wv: f * 0.4, expr: f < 274 ? 'nervous' : 'grin', facing: -1, look: -1 });
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
  const empty = f >= 560 ? 1 : 0; out.push(FXC('meja' + empty + (empty ? 0 : Math.floor(f / 3) % 20), (p) => T.fxMejaRendang(p, empty, f), TB, 0.85, { order: 8 }));
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[66, 112, 'HIHU!', '#ffe14a'], [163, 209, 'HIHU!', '#ffe14a'], [274, 320, 'HIHU!', '#ffe14a'], [477, 506, 'HIHU...', '#c8a0ff'], [594, 637, 'HIHU.', '#ff5d8f']];
const BANNERS = [[321, 377, 'KETIPU 3 KALI', '#c0392b']];
const SPK = { U: ['#ffd84a', 'UCUP'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 702) put(g, 540, 300, 1.2, pop(f, 702), (p) => T.fxRoundCard(p, 'HIHU', 'KORBAN: ASEP (4X)', '#c0392b', Math.min(40, f - 702)));
  if (f < 702) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
