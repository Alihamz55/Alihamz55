// "Asep vs Tukang Bully" -- Bang Jali (fiktif) ngeledek Asep di pos ronda; balasan Asep yang polos malah jadi pujian, Jali luluh & traktir es teh. Tanpa kekerasan, ledekan ringan (bukan fisik/SARA).
// Kostum baru: asepRompi, jali (tokoh baru), ucupHijau. Properti: fxSendalBeda, fxEsTeh. Pos ronda (x=120) sore.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1015;
const LINES = [["J", 15, 141], ["A", 150, 324], ["J", 338, 406], ["A", 414, 521], ["J", 536, 595], ["A", 602, 715], ["J", 745, 800], ["U", 815, 867], ["A", 876, 979]];
const TXT = ["EH, ADA ASEP! MOTORNYA MASIH YANG SUARANYA KAYAK BATUK ITU YA?", "IYA, BANG! MOTOR ASEP EMANG BATUK... SOALNYA KANGEN DIBAWA KE BENGKEL, KAYAK MOTOR ABANG YANG KINCLONG!", "JOMBLO TERUS LU, SEP!", "IYA, BANG. ASEP NUNGGU JADI GANTENG DULU... KAYAK ABANG.",
  "SENDAL LU BEDA WARNA, SEP!", "BIAR KAYAK ABANG, BANG. ABANG KAN BEDA DARI YANG LAIN.", "...YA UDAH, SEP. GUA TRAKTIR ES TEH.", "SEP! AJARIN UCUP DONG!", "GAMPANG, CUP. TINGGAL JUJUR... SAMA KEPEPET."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const SH = [['two', 0, 149], ['asep', 150, 337], ['jali', 338, 413], ['asep2', 414, 535], ['jali2', 536, 601], ['asep3', 602, 744], ['jali3', 745, 814], ['ucup', 815, 875], ['asepEnd', 876, 1014]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'sore' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  sore: { az: 250, el: 22, sky: '#ffd8b0', ground: '#5a4a40', hemi: 1.25, sun: '#ffc890', sunI: 2.5, fog: '#e8b890', fogNear: 40, fogFar: 200, skyTop: '#6a8ad0', skyHor: '#ffc08a', sat: 1.12, vig: 0.28, gain: '#fff0e0', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const PX = 120;
const AS = [PX - 2.4, 0.5, 0.2], JL = [PX - 1.5, 0.5, 0.15], UC = [PX - 0.55, 0.5, -0.25];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const MID = [(AS[0] + JL[0]) / 2, 0.5, 0.2];
const CAMS = {
  two: [{ f: 0, ...K([MID[0], 1.95, 3.9], [MID[0], 2.0, 0.1], 42) }, { f: 149, ...K([MID[0], 1.95, 3.3], [MID[0], 2.05, 0.1], 42) }],
  asep: cu(AS, 2.0, 2.3, -0.35, 40), jali: cu(JL, 2.0, 2.3, 0.35, 40), asep2: cu(AS, 2.0, 2.2, -0.3, 40), jali2: cu(JL, 2.0, 2.2, 0.3, 40),
  asep3: cu(AS, 2.0, 2.1, -0.25, 38), jali3: cu(JL, 2.0, 2.1, 0.25, 38), ucup: cu(UC, 2.0, 2.3, 0.3, 40), asepEnd: cu(AS, 2.0, 2.2, -0.25, 38),
};
const KICKS = [{ f: 500, a: 0.06 }, { f: 700, a: 0.07 }, { f: 760, a: 0.08 }, { f: 950, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: id === 'two' ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 150) return { L: 'hang', R: 'hang', expr: 'squint', facing: 1, look: 1 };
  if (f < 338) return { L: 'hip', R: 'point', expr: f < 230 ? 'squint' : 'grin', facing: 1, look: 1 };
  if (f < 602) return { L: 'hang', R: f < 536 ? 'cheek' : 'hang', expr: f < 536 ? 'smile' : 'nervous', facing: 1, look: 1 };
  if (f < 876) return { L: 'pray', R: 'pray', expr: f < 745 ? 'smile_closed' : 'shock', facing: 1, look: 1 };
  return { L: 'hip', R: 'thumb', expr: 'smug', facing: -1, look: -1 };
};
const jlPose = (f) => {
  if (f < 338) return { L: 'hip', R: 'point', expr: f < 150 ? 'smug' : f < 300 ? 'grin' : 'shock', facing: -1, look: -1 };
  if (f < 536) return { L: 'cross', R: 'cross', expr: f < 414 ? 'grin' : 'nervous', facing: -1, look: -1, sweat: f >= 470 ? 1 : 0 };
  if (f < 745) return { L: 'hang', R: 'point', expr: f < 602 ? 'nervous' : 'shock', facing: -1, look: -1, sweat: 1 };
  return { L: 'hang', R: 'reach', expr: 'smile_closed', facing: -1, look: -1, headTilt: -8 };
};
const ucPose = (f) => (f < 805 ? null : { L: 'hang', R: 'up', expr: 'grin', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepRompi', asPose, 5, AS, 'A'); add('jali', jlPose, 9, JL, 'J'); add('ucupHijau', ucPose, 4, UC, 'U');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[250, 337, 'MALAH MUJI', '#5dff8a'], [480, 535, 'KAYAK ABANG', '#ff8ac0'], [680, 744, 'BEDA DARI YANG LAIN', '#c8a0ff'], [760, 814, 'LULUH', '#ffe14a']];
const BANNERS = [[0, 110, 'PERANG LEDEKAN', '#c0392b']];
const SPK = { U: ['#ffd84a', 'UCUP'], J: ['#7ac8ff', 'BANG JALI'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  if (f >= 545 && f < 601) put(g, 830, 1180, 0.62, Math.min(pop(f, 545, 6), out_(f, 601)), (p) => T.fxSendalBeda(p));
  if (f >= 770 && f < 1015) put(g, f < 876 ? 230 : 850, 1150, 0.62, pop(f, f < 876 ? 770 : 876, 6), (p) => T.fxEsTeh(p));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 985) put(g, 540, 300, 1.2, pop(f, 985), (p) => T.fxRoundCard(p, 'BALAS BULLY', 'PAKAI KEPOLOSAN', '#2f8a4a', Math.min(40, f - 985)));
  if (f < 985) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
