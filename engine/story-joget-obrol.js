// "Pak Darman Juara Poco-Poco" -- pembuka (0-439) + penutup (440-985) untuk video joget. Kostum sama dengan video joget.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
export const TOTAL = 986;
const NA = 440;
const LINES = [['N', 7, 69], ['D', 75, 263], ['A', 269, 307], ['I', 315, 429], ['I', 449, 532], ['D', 538, 598], ['A', 602, 630], ['D', 639, 775], ['A', 784, 892], ['D', 897, 958]];
const TXT = ['AYO BIKIN KONTEN JOGET, BIAR FYP!', 'JOGET ANAK ZAMAN SEKARANG? GAMPANG. BAPAK DULU JUARA POCO-POCO SE-KECAMATAN!', 'PAK, INI MAH CEPET PISAN, LHO.', 'BENTAR, IBU PAKAI KACAMATA HITAM DULU. BIAR ESTETIK.',
  'PAK! VIDEONYA FYP! SEJUTA YANG NONTON!', 'FYP ITU APA, BU?', 'FOR YOUR PAGE, PAK.', 'OH... BAPAK KIRA... FISIOTERAPI YANG PERTAMA.', 'KATANYA JUARA POCO-POCO SE-KECAMATAN...', 'ITU TAHUN DELAPAN LIMA, SEP!'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
const SH = [['neng', 0, 72], ['darman', 73, 268], ['asep', 269, 312], ['ibu', 313, 439],
  ['ibuHP', 440, 536], ['dSit', 537, 601], ['asep2', 602, 637], ['dSit2', 638, 783], ['asep2', 784, 896], ['dSit', 897, 985]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'hall' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = { hall: { az: 70, el: 55, sky: '#e8f2ff', ground: '#9aa4ae', hemi: 1.3, sun: '#fff4e0', sunI: 2.3, fog: '#dfe8f2', fogNear: 40, fogFar: 200, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.08, vig: 0.26, shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const CX = 567.5, Y = 0.5;
const SLOT = [-0.8, -0.27, 0.27, 0.8];
const P1 = SLOT.map((x, k) => [CX + x, Y, k % 2 ? -0.08 : 0]);          // pembuka: berbaris
const P2 = SLOT.map((x, k) => [CX + x, Y, 1.2 + (k % 2 ? -0.08 : 0)]);  // penutup: posisi akhir joget
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, dx, h, d, fov = 38, side = 0.3) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0] + dx, h + 0.12, P[2]], fov) }, { f: 200, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0] + dx, h + 0.13, P[2]], fov) }];
const CAMS = {
  neng: cu(P1[1], 0, 2.0, 2.6, 38, -0.2), darman: cu(P1[2], 0, 1.75, 2.6, 38, -0.35), asep: cu(P1[0], 0, 2.0, 2.4, 38, 0.35), ibu: cu(P1[3], 0, 2.0, 2.4, 38, -0.35),
  ibuHP: cu(P2[3], 0.08, 2.0, 2.7, 38, 0.2), dSit: cu(P2[2], 0, 1.7, 2.4, 38, 0.3), dSit2: cu(P2[2], 0, 1.75, 2.0, 36, 0.25), asep2: cu(P2[0], 0.15, 2.0, 2.5, 38, 0.35),
};
const KICKS = [{ f: 73, a: 0.04 }, { f: 440, a: 0.05 }, { f: 700, a: 0.08 }, { f: 897, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.08 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 8 }; };
export const worldAt = () => ({ curtain: 0, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: (typeof who === 'string' ? who : who.k) + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const IBU_SHADES = { k: 'ibuShades', tunic: "#efe6d2", skin: "#f0c49c", hair: "#2b211c", arms: "#efe6d2", legs: "#6f8fb5", pants: "#6f8fb5", bun: true, shades: true };
const poseOf = (f, k) => {
  const intro = f < NA;
  if (intro) {
    if (k === 0) return { L: f >= 269 && f < 313 ? 'temple' : 'hang', R: 'hang', expr: f >= 269 && f < 313 ? 'nervous' : 'squint', facing: 1, look: 1 };
    if (k === 1) return { L: f < 75 ? 'up' : 'hang', R: f < 75 ? 'wave' : 'cheek', wv: q((f * 0.45) % 6.283, 1), expr: 'grin', facing: f < 75 ? 0 : 1, look: f < 75 ? 0 : 1 };
    if (k === 2) return f >= 75 && f < 269 ? { L: 'hip', R: f > 180 ? 'thumb' : 'hip', expr: 'smile_closed', tilt: -6, bob: 0.012, facing: 0, look: 0 }
      : { L: 'hip', R: 'hip', expr: 'smile_closed', tilt: -3, facing: -1, look: -1 };
    return f >= 313 ? { L: 'hang', R: f < 380 ? 'salute' : 'thumb', expr: f < 380 ? 'squint' : 'smile_closed', facing: -1, look: -1, shades: f >= 372 }
      : { L: 'hang', R: 'hang', expr: 'smile', facing: -1, look: -1 };
  }
  if (k === 2) return { L: 'hip', R: f >= 897 ? 'up' : 'temple', expr: f >= 897 ? 'shock' : f >= 639 ? 'nervous' : 'squint', tilt: 14, bob: -0.09, headTilt: -8, sweat: 1, facing: 0, look: f >= 784 && f < 897 ? -1 : 0, shake: f >= 897 };
  if (k === 3) return { L: 'up', R: 'phone', expr: f < 537 ? 'grin' : 'smile', facing: -1, look: -1, bob: f < 537 ? q(0.02 * Math.abs(Math.sin(f * 0.4)), 3) : 0 };
  if (k === 0) return { L: f >= 784 && f < 897 ? 'cross' : 'hang', R: f >= 602 && f < 638 ? 'point' : f >= 784 && f < 897 ? 'cross' : 'thumb', expr: f >= 897 ? 'nervous' : f >= 784 ? 'squint' : 'grin', facing: 1, look: 1 };
  return { L: 'cheek', R: 'cheek', expr: f >= 700 ? 'grin' : 'smile_closed', facing: 1, look: 1 };
};
const WHO = ['asepJoget', 'nengJoget', 'darmanJoget', 'ibuJoget'], SPK_ = ['A', 'N', 'D', 'I'];
export const actorsAt = (f, T) => {
  const out = [];
  WHO.forEach((who, k) => {
    const { shake, shades, ...o } = poseOf(f, k), i = idle(f, k * 3 + 1), tilt = shake ? sway(f, 5, 0.7) : 0;
    const pos = f < NA ? P1[k] : P2[k];
    out.push(R(T, k === 3 && (shades || f >= NA) ? IBU_SHADES : who, { seed: k * 3 + 2, blink: blinkAt(f, k * 3 + 2), ...o, sweat: o.sweat || 0, expr: talk(f, SPK_[k], o.expr),
      bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 }));
  });
  return out;
};
export const fxAt = () => [];

// ---- overlay: subtitle game-show + kata kunci ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[20, 72, 'FYP!', '#ffe14a'], [180, 268, 'JUARA POCO-POCO', '#ffb03a'], [470, 536, 'SEJUTA!', '#ffe14a'], [700, 783, 'FISIOTERAPI?!', '#ff5d8f'], [915, 985, 'TAHUN 85!', '#8b5cf6']];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#a0522d', 'PAK DARMAN'], N: ['#ff6fae', 'NENG'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt) || (a < NA && f >= NA)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  let s0 = 0, s1 = W.length; if (W.length > 8) { const i0 = Math.max(0, idx); s0 = Math.floor(i0 / 6) * 6; s1 = Math.min(W.length, s0 + 6); }
  const Wv = W.slice(s0, s1), rows = []; let cur = [], len = 0; Wv.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a: s0 ? st[s0] : a, rows, idx: idx - s0 }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  const C_ = telop(f); if (C_) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1550, 1.2, f < 1 ? 1 : pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
