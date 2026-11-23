// "Kata yang Paling Sering Diucapkan Ibu" -- kuis survei keluarga (fiktif, tanpa nama/logo acara asli). Panggung (x=0). GAYA BARU.
// Kostum baru: asepTim, ibuTim, darmanTim (hijau "TIM DARMAN"), ujangTim, ucupTim (oranye), hostKuis. Properti: fxPapanSurvei, fxMejaTim, fxSilangBesar.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 920;
const LINES = [["H", 15, 182], ["A", 191, 248], ["D", 275, 288], ["I", 309, 439], ["H", 454, 563], ["H", 581, 691], ["I", 700, 743], ["A", 764, 887]];
const TXT = ["SERATUS ORANG DISURVEI! SEBUTKAN KATA YANG PALING SERING DIUCAPKAN IBU-IBU!", "GAMPANG! SAYANG!", "HEMAT!", "MANA ADA IBU NGOMONG ITU-ITU TERUS... SEP! DUDUK YANG BENER!",
  "JAWABAN NOMOR SATU... SEP! ENAM PULUH ORANG!", "BU... TADI IBU JAWAB SAMBIL MARAHIN ANAK.", "SEP! JANGAN KETAWA!", "TERNYATA NAMA ASEP... UDAH JADI BAHASA IBU."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const X1 = 252, T1 = 292, SEP1 = 385, REV = 515, T2 = 745;
const SH = [['wide', 0, 80], ['host', 81, 190], ['asep', 191, 274], ['darman', 275, 291], ['board', 292, 308], ['ibu', 309, 453], ['board2', 454, 580], ['host2', 581, 699], ['ibu2', 700, 763], ['asepCU', 764, 919]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'stage' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  stage: { az: 30, el: 55, sky: '#f4e8ff', ground: '#3a2a40', hemi: 1.4, sun: '#fff0d8', sunI: 2.6, fog: '#1a1426', fogNear: 40, fogFar: 200, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.18, vig: 0.26, gain: '#fff4e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const BRD = [0, 0.5, -2.3], H = [0.05, 0.5, 0.9];
const DM = [-2.45, 0.5, 0.0], IB = [-1.8, 0.5, 0.1], AS = [-1.15, 0.5, 0.2], UJ = [1.3, 0.5, 0.2], UC = [1.95, 0.5, 0.1];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const CAMS = {
  wide: [{ f: 0, ...K([0, 2.2, 6.6], [0, 2.0, -0.6], 58) }, { f: 80, ...K([0, 2.2, 6.0], [0, 2.0, -0.6], 56) }],
  host: cu(H, 2.0, 2.3, 0.3, 40), asep: cu(AS, 2.0, 2.3, 0.35, 40), darman: cu(DM, 2.0, 2.3, 0.35, 40), ibu: cu(IB, 2.0, 2.4, 0.3, 42),
  board: [{ f: 0, ...K([0, 2.35, 2.7], [0, 2.4, -2.3], 44) }], board2: [{ f: 0, ...K([0, 2.35, 2.9], [0, 2.4, -2.3], 46) }, { f: 126, ...K([0, 2.35, 2.3], [0, 2.4, -2.3], 44) }],
  host2: cu(H, 2.0, 2.2, -0.3, 40), ibu2: cu(IB, 2.0, 2.2, 0.3, 40), asepCU: cu(AS, 2.0, 2.1, 0.2, 38),
};
const KICKS = [{ f: X1, a: 0.06 }, { f: T1, a: 0.04 }, { f: SEP1, a: 0.08 }, { f: REV, a: 0.08 }, { f: 700, a: 0.07 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['wide', 'board', 'board2'].includes(id) ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => { if (f < 191) return { L: 'hang', R: 'hang', expr: 'grin', facing: 0, look: 0 };
  if (f < X1) return { L: 'hip', R: 'up', expr: 'smug', facing: 1, look: 1 };
  if (f < 309) return { L: 'hang', R: 'hang', expr: 'shock', facing: 0, look: 0, blink: 0 };
  if (f < 764) return { L: 'hang', R: 'hang', expr: f >= SEP1 ? 'shock' : 'nervous', facing: -1, look: -1, shake: (f >= SEP1 && f < SEP1 + 30) || (f >= 700 && f < 730) };
  return { L: 'hang', R: 'hang', expr: 'nervous', facing: 0, look: 0, headTilt: -6, sweat: 1 }; };
const ibPose = (f) => { if (f < 309) return { L: 'hang', R: 'hang', expr: 'smile', facing: 0, look: 0 };
  if (f < SEP1) return { L: 'hip', R: 'shrug', expr: 'smug', facing: 0, look: 0 };
  if (f < 454) return { L: 'hip', R: 'point', expr: 'squint', facing: 1, look: 1, shake: f < SEP1 + 25 };
  if (f < 700) return { L: 'hang', R: 'cheek', expr: 'shock', facing: 0, look: 0 };
  return { L: 'hip', R: 'point', expr: 'squint', facing: 1, look: 1, shake: f < 730 }; };
const dmPose = (f) => (f >= 275 && f < 309 ? { L: 'hip', R: 'up', expr: 'smug', facing: 1, look: 1 } : { L: 'hang', R: 'hang', expr: 'smile_closed', facing: 1, look: 1 });
const hPose = (f) => (f < 581 ? { L: 'hip', R: 'mic', expr: 'grin', facing: 0, look: 0 } : { L: 'belly', R: 'mic', expr: 'smile_closed', facing: -1, look: -1, shake: 1 });
const ujPose = (f) => ({ L: 'hang', R: 'hang', expr: f >= REV ? 'shock' : 'grin', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepTim', asPose, 5, AS, 'A'); add('ibuTim', ibPose, 3, IB, 'I'); add('darmanTim', dmPose, 8, DM, 'D'); add('hostKuis', hPose, 9, H, 'H');
  add('ujangTim', ujPose, 6, UJ, 'X'); add('ucupTim', ujPose, 4, UC, 'X');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const ROWS = [['SEP!', 60], ['HEMAT', 25], ['UDAH MAKAN?', 8], ['MATIIN LAMPU!', 5], ['NANTI AJA', 2]];
export const fxAt = (f, T) => {
  const out = [];
  const rev = [q(ramp(f, REV, REV + 8), 2), q(ramp(f, T1, T1 + 8), 2), 0, 0, 0], fl = (f >= REV + 8 && f < 600) || (f >= T2 && f < T2 + 20) ? 0 : -1;
  out.push(FXC('brd' + rev.join() + fl + (Math.floor(f / 4) % 2), (p) => T.fxPapanSurvei(p, ROWS, rev, fl, f), BRD, 1.75, { order: 1 }));
  const lit = (f >= 191 && f < 205) || (f >= 275 && f < 289);
  out.push(FXC('mt1' + lit, (p) => T.fxMejaTim(p, 'TIM DARMAN', '#2f8a4a', lit), [-1.8, 0.5, 0.75], 1.15, { order: 9 }));
  out.push(FXC('mt2', (p) => T.fxMejaTim(p, 'TIM UJANG', '#f08a2a', 0), [1.62, 0.5, 0.75], 1.0, { order: 9 }));
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[REV, 580, 'SEP! = 60', '#ffe14a'], [T2, 763, 'TING!', '#5dff8a']];
const BANNERS = [[0, 80, 'KUIS SURVEI KELUARGA', '#1d3a8a']];
const SPK = { H: ['#ffd84a', 'HOST'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  if (f >= X1 && f < 280) put(g, 540, 820, 1.3, Math.min(pop(f, X1, 4), out_(f, 280)), (p) => T.fxSilangBesar(p, 1));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 890) put(g, 540, 300, 1.2, pop(f, 890), (p) => T.fxRoundCard(p, 'BAHASA IBU', 'JAWABAN NO. 1: SEP!', '#1d3a8a', Math.min(40, f - 890)));
  if (f < 890) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
