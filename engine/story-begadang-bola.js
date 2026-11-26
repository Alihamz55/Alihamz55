// "Begadang Nonton Bola" -- tren pertandingan bola Eropa tengah malam + tarif listrik. Ruang tengah malam (x=-40). Tanpa nama/logo klub atau liga asli. GAYA BARU.
// Kostum baru: asepJersey, darmanJersey, ibuRolUngu. Properti: fxTV (BIRU vs MERAH), fxTVIklan, fxSofa, fxZzz.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1109;
const LINES = [["D", 15, 71], ["A", 79, 171], ["D", 180, 291], ["A", 336, 430], ["T", 442, 505], ["D", 510, 568], ["A", 576, 662], ["I", 689, 809], ["D", 817, 895], ["I", 901, 942], ["A", 969, 1073]];
const TXT = ["SEP... BANGUN. BOLANYA UDAH MULAI.", "PAK, INI JAM DUA PAGI...", "BOLA EROPA, SEP. LAKI-LAKI SEJATI ITU BEGADANG.", "PAK... YANG NGAJAK BEGADANG, KOK YANG TIDUR DULUAN BAPAK?", "GOOOOOOL!", "GOOOL! SIAPA YANG GOL, SEP?!",
  "PAK, ITU IKLAN KOPI.", "JAM DUA PAGI TERIAK-TERIAK! TARIF LISTRIK NAIK, KALIAN MALAH NONTON BOLA!", "BU, INI PERTANDINGAN PENTING!", "PENTING MANA SAMA TOKEN LISTRIK?!", "SKOR AKHIR... IBU SATU, BAPAK NOL."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const SLEEP = 296, LAMP = 689;
const SH = [['darman', 0, 78], ['asep', 79, 179], ['darman2', 180, 295], ['wide', 296, 335], ['asep2', 336, 441], ['tv', 442, 509], ['darman3', 510, 575], ['asep3', 576, 688], ['ibu', 689, 816], ['darman4', 817, 900], ['ibu2', 901, 968], ['asepEnd', 969, 1108]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a >= LAMP ? 'lamp' : 'tv' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  tv: { az: 20, el: 40, sky: '#8aa0e0', ground: '#2a2440', hemi: 1.0, sun: '#b8ccff', sunI: 2.0, fog: '#0e1430', fogNear: 40, fogFar: 260, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.05, vig: 0.42, gain: '#d8e0ff', shadowExt: 9 },
  lamp: { az: 60, el: 50, sky: '#fff0d8', ground: '#4a3a48', hemi: 1.35, sun: '#ffe8cc', sunI: 2.5, fog: '#141c3a', fogNear: 40, fogFar: 260, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.1, vig: 0.28, gain: '#fff2e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX - 0.8, 0.5, -0.4], DM = [RX + 0.15, 0.5, -0.5], IB = [RX + 1.2, 0.5, -0.25], TVP = [RX + 0.3, 0.5, 4.6];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const CAMS = {
  darman: cu(DM, 2.0, 2.0, -0.3, 38), asep: cu(AS, 2.0, 2.2, -0.3, 40), darman2: cu(DM, 2.0, 2.3, 0.3, 40),
  wide: [{ f: 0, ...K([RX + 0.0, 1.9, 4.0], [RX + 0.0, 1.7, -0.5], 48) }, { f: 39, ...K([RX + 0.0, 1.9, 3.6], [RX + 0.0, 1.7, -0.5], 46) }],
  asep2: cu([(AS[0] + DM[0]) / 2, 0.5, -0.45], 1.95, 2.8, -0.2, 44),
  tv: [{ f: 0, ...K([TVP[0], 1.3, TVP[2] + 2.9], [TVP[0], 1.22, TVP[2]], 40) }, { f: 67, ...K([TVP[0], 1.3, TVP[2] + 2.4], [TVP[0], 1.24, TVP[2]], 38) }],
  darman3: cu(DM, 2.0, 2.0, 0.25, 38), asep3: cu(AS, 2.0, 2.1, -0.25, 38), ibu: cu(IB, 2.0, 2.3, 0.3, 40), darman4: cu(DM, 2.0, 2.2, 0.3, 40), ibu2: cu(IB, 2.0, 2.0, 0.25, 38),
  asepEnd: [{ f: 0, ...K([AS[0] - 0.2, 2.0, AS[2] + 2.3], [AS[0], 2.1, AS[2]], 40) }, { f: 139, ...K([AS[0] - 0.1, 2.05, AS[2] + 1.7], [AS[0], 2.15, AS[2]], 36) }],
};
const KICKS = [{ f: 442, a: 0.08 }, { f: 510, a: 0.07 }, { f: LAMP, a: 0.06 }, { f: 925, a: 0.09 }, { f: 1040, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= LAMP && f < LAMP + 5 ? 0.7 * (1 - (f - LAMP) / 5) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['wide', 'tv', 'asep2'].includes(id) ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asleepD = (f) => f >= SLEEP && f < 510;
const asPose = (f) => {
  if (f < 180) return { L: 'cross', R: 'cross', expr: f < 79 ? 'snore' : 'nervous', facing: 1, look: 1, blink: f < 79 ? 1 : undefined, headTilt: -6 };
  if (f < 336) return { L: 'cross', R: 'cross', expr: f < SLEEP ? 'nervous' : 'shock', facing: 1, look: 1, headTilt: -4 };
  if (f < 576) return { L: 'hip', R: 'point', expr: f < 442 ? 'squint' : 'shock', facing: 1, look: 1 };
  if (f < 689) return { L: 'cross', R: 'cross', expr: 'squint', facing: 1, look: 1 };
  if (f < 969) return { L: 'cross', R: 'cross', expr: 'nervous', facing: 1, look: 1, sweat: 1 };
  return { L: 'cheek', R: 'hang', expr: f < 1040 ? 'nervous' : 'smile_closed', facing: 0, look: 0 };
};
const dmPose = (f) => {
  if (f < SLEEP) return { L: 'hip', R: f < 180 ? 'point' : 'thumb', expr: f < 180 ? 'grin' : 'smug', facing: -1, look: -1 };
  if (f < 510) return { L: 'cross', R: 'cross', expr: 'snore', facing: 0, look: 0, blink: 1, tilt: -6, headTilt: -14 };
  if (f < 576) return { L: 'up', R: 'up', expr: 'shock', facing: 0, look: 0, shake: 1, blink: 0 };
  if (f < 817) return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1, sweat: f >= LAMP ? 1 : 0 };
  if (f < 969) return { L: 'pray', R: 'pray', expr: 'cry', facing: 1, look: 1 };
  return { L: 'cross', R: 'cross', expr: 'snore', facing: 0, look: 0, blink: 1, tilt: -6, headTilt: -14 };
};
const ibPose = (f) => (f < LAMP ? null : { L: 'hip', R: 'point', expr: 'squint', facing: -1, look: -1, shake: (f >= LAMP && f < 720) || (f >= 901 && f < 930) });
export const actorsAt = (f, T) => {
  const out = [];
  if (shotAt(f).id === 'tv') return out;
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepJersey', asPose, 5, AS, 'A'); add('darmanJersey', dmPose, 8, DM, 'D'); add('ibuRolUngu', ibPose, 3, IB, 'I');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [FXC('sofa', (p) => T.fxSofa(p, '#6a5a8a'), [RX + 0.15, 0.5, -1.25], 1.55, { order: 1 })];
  const ad = f >= 430 && f < 700, t2 = Math.floor(f / 2);
  out.push(FXC('tv' + (ad ? 'ad' : 'm') + (t2 % 60), (p) => ad ? T.fxTVIklan(p, t2) : T.fxTV(p, t2, 0, '0 - 0'), TVP, 1.15, { order: 3 }));
  if (asleepD(f) || f >= 1000) out.push(FXC('zz' + Math.floor(f / 3) % 20, (p) => T.fxZzz(p, Math.floor(f / 3)), [DM[0] + 0.45, 2.3, DM[2]], 0.5, { order: 9 }));
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[300, 335, 'ZZZ...', '#7ac8ff'], [600, 688, 'IKLAN KOPI', '#ffb03a'], [925, 968, 'TOKEN LISTRIK', '#ff5d8f']];
const BANNERS = [[0, 78, 'JAM 02.00 PAGI', '#1d3a8a']];
const SPK = { T: ['#ffb03a', 'TV'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  if (f < LAMP && shotAt(f).id !== 'tv') { g.fillStyle = `rgba(90,120,255,${0.05 + 0.03 * Math.sin(f * 0.9) * Math.sin(f * 0.23)})`; g.fillRect(0, 0, 1080, 1920); }
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1076) put(g, 540, 300, 1.2, pop(f, 1076), (p) => T.fxRoundCard(p, 'SKOR AKHIR', 'IBU 1 - 0 BAPAK', '#c0392b', Math.min(40, f - 1076)));
  if (f < 1076) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
