// "Asep Minta Wish Hujan Meteor" -- halaman rumah No.17 (x=240) malam. Kostum baru: asepKupluk, nengBomber, darmanPiyama, ibuMukena.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
import { VIS } from './visemes.js';
export const TOTAL = 1277;
const LINES = [['A', 18, 126], ['N', 134, 199], ['A', 226, 403], ['N', 409, 436], ['A', 463, 547], ['D', 554, 664], ['A', 694, 922], ['N', 928, 982], ['D', 1024, 1138], ['I', 1147, 1228]];
const TXT = ['MALAM INI HUJAN METEOR, NENG! KATANYA WISH-NYA PASTI TERKABUL!', 'AKU MAU WISH YANG ROMANTIS, A.', 'PENGEN HP BARU! PENGEN PS LIMA! PENGEN... NENG JADI ISTRI ASEP!', 'AA...',
  'WAH, METEORNYA KEDIP-KEDIP! BERARTI DI-APPROVE!', 'SEP! ITU PESAWAT! KAMU DARI TADI MINTA KE PILOT!', 'PAK PILOT, YANG HP SAMA PS BATALIN AJA. YANG NENG... TOLONG DIKABULIN.', 'PESAWATNYA UDAH LEWAT, A.', 'PENGEN... ASEP CEPET KERJA.', 'PAK... ITU JUGA PESAWAT.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const SH = [['sky', 0, 60], ['two', 61, 133], ['neng', 134, 199], ['sky', 200, 225], ['asep', 226, 403], ['neng', 404, 436], ['sky', 437, 462], ['asep', 463, 553], ['window', 554, 664],
  ['two', 665, 693], ['asepUp', 694, 922], ['neng', 923, 982], ['sky', 983, 1005], ['two', 1006, 1023], ['window', 1024, 1146], ['window2', 1147, 1276]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'night' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = { night: { az: 120, el: 42, sky: '#7a88c0', ground: '#2a2a3a', hemi: 0.95, sun: '#c8d4ff', sunI: 1.7, fog: '#0e1430', fogNear: 30, fogFar: 140,
  skyTop: '#050820', skyHor: '#1c2858', sat: 1.06, vig: 0.4, shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240;
const AS = [HR - 0.6, 0.53, 1.05], NG = [HR + 0.15, 0.53, 0.95], DM = [HR + 2.55, 0.5, -3.6], IB = [HR + 3.25, 0.5, -3.65];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 38, dx = 0) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0] + dx, h + 0.12, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.85], [P[0] + dx, h + 0.13, P[2]], fov) }];
const CAMS = {
  sky: [{ f: 0, ...K([HR - 0.2, 1.55, 3.4], [HR - 0.2, 3.1, -3], 52) }, { f: 60, ...K([HR - 0.2, 1.55, 3.2], [HR - 0.2, 3.15, -3], 52) }],
  two: [{ f: 0, ...K([HR - 0.2, 2.0, 3.5], [HR - 0.2, 2.15, 1.0], 42) }, { f: 70, ...K([HR - 0.2, 2.0, 3.3], [HR - 0.2, 2.17, 1.0], 42) }],
  asep: cu(AS, 1.95, 2.5, -0.35), neng: cu(NG, 1.95, 2.4, 0.35), asepUp: [{ f: 0, ...K([AS[0] - 0.5, 0.95, AS[2] + 3.4], [AS[0] + 0.2, 3.2, AS[2] - 2], 52) }, { f: 230, ...K([AS[0] - 0.45, 0.95, AS[2] + 3.1], [AS[0] + 0.2, 3.25, AS[2] - 2], 52) }],
  window: cu(DM, 1.95, 2.6, -0.3, 38, 0.1), window2: cu([(DM[0] + IB[0]) / 2, 0.5, DM[2]], 1.95, 3.1, -0.2, 40),
};
const KICKS = [{ f: 61, a: 0.03 }, { f: 463, a: 0.04 }, { f: 554, a: 0.09 }, { f: 1147, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: id === 'sky' ? 1 : id === 'two' ? 3 : 8 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: false, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 134) return { L: 'hang', R: 'point', expr: 'grin', facing: 1, look: 1, headTilt: -6 };
  if (f < 226) return { L: 'hang', R: 'hang', expr: 'smile', facing: 1, look: 1 };
  if (f < 404) return { L: 'pray', R: 'pray', expr: f > 360 ? 'smile_closed' : 'squint', facing: 0, look: 0, blink: 1, headTilt: -4 };
  if (f < 463) return { L: 'pray', R: 'pray', expr: 'smile_closed', facing: 1, look: 1 };
  if (f < 554) return { L: 'up', R: 'point', expr: 'grin', facing: 0, look: 0, headTilt: -8 };
  if (f < 694) return { L: 'hang', R: 'hang', expr: f < 600 ? 'shock' : 'nervous', facing: 1, look: 1, blink: f < 600 ? 0 : undefined, shake: f < 580 };
  if (f < 923) return { L: 'pray', R: 'pray', expr: 'smile_closed', facing: 0, look: 0, headTilt: -10 };
  if (f < 1024) return { L: 'hang', R: 'hang', expr: f > 990 ? 'shock' : 'nervous', facing: 1, look: 1, blink: f > 990 ? 0 : undefined };
  return { L: 'hang', R: 'hang', expr: 'squint', facing: 1, look: 1 };
};
const ngPose = (f) => {
  if (f < 134) return { L: 'hang', R: 'hang', expr: 'smile', facing: -1, look: -1 };
  if (f < 226) return { L: 'cheek', R: 'hang', expr: 'smile_closed', facing: -1, look: -1 };
  if (f < 404) return { L: 'hang', R: 'hang', expr: f > 360 ? 'shock' : 'smile', facing: -1, look: -1, blink: f > 360 ? 0 : undefined };
  if (f < 463) return { L: 'cheek', R: 'cheek', expr: 'smile_closed', facing: -1, look: -1, headTilt: 8 };
  if (f < 923) return { L: 'hang', R: 'hang', expr: f > 554 ? 'nervous' : 'smile', facing: -1, look: -1 };
  if (f < 1024) return { L: 'hang', R: 'hang', expr: f > 990 ? 'shock' : 'squint', facing: -1, look: -1 };
  return { L: 'hang', R: 'hang', expr: 'squint', facing: 1, look: 1 };
};
const dmPose = (f) => {
  if (f < 554) return null;
  if (f < 694) return { L: 'up', R: 'point', expr: 'squint', facing: -1, look: -1, shake: f < 580 };
  if (f < 1024) return { L: 'hip', R: 'hang', expr: 'squint', facing: -1, look: -1 };
  if (f < 1147) return { L: 'pray', R: 'pray', expr: 'smile_closed', facing: 0, look: 0, headTilt: -8 };
  return { L: 'pray', R: 'pray', expr: 'smile_closed', facing: 1, look: 1, headTilt: -6 };
};
const ibPose = (f) => f < 1140 ? null : { L: 'hang', R: 'point', expr: 'squint', facing: -1, look: -1 };
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepKupluk', asPose, 5, AS, 'A'); add('nengBomber', ngPose, 2, NG, 'N'); add('darmanPiyama', dmPose, 8, DM, 'D'); add('ibuMukena', ibPose, 3, IB, 'I');
  return out;
};
export const fxAt = () => [];

// ---- overlay: langit (meteor & pesawat), telop ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const meteor = (g, x0, y0, len, k, w = 6) => { if (k <= 0 || k >= 1) return; const x = x0 - 500 * k, y = y0 + 260 * k, a = Math.sin(Math.PI * k);
  const gr = g.createLinearGradient(x, y, x + len, y - len * 0.52); gr.addColorStop(0, `rgba(255,255,240,${a})`); gr.addColorStop(1, 'rgba(160,200,255,0)');
  g.save(); g.strokeStyle = gr; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y - len * 0.52); g.stroke();
  g.fillStyle = `rgba(255,255,255,${a})`; g.shadowColor = '#bfe0ff'; g.shadowBlur = 30; g.beginPath(); g.arc(x, y, w * 1.3, 0, 7); g.fill(); g.restore(); };
const plane = (g, x, y, f, blink) => { g.save(); const on = Math.floor(f / 8) % 2;
  g.shadowBlur = 24; g.fillStyle = '#ffffff'; g.shadowColor = '#ffffff'; g.beginPath(); g.arc(x, y, 10, 0, 7); g.fill();
  if (blink) { g.fillStyle = on ? '#ff3b3b' : '#3bff6a'; g.shadowColor = g.fillStyle; g.beginPath(); g.arc(x + (on ? -22 : 22), y + 2, 14, 0, 7); g.fill(); }
  g.restore(); };
const JUDGE = [[30, 126, 'HUJAN METEOR', '#ffe14a'], [500, 553, 'DI-APPROVE!', '#39ff6a'], [554, 640, 'PESAWAT?!', '#ff5d8f'], [760, 860, 'PAK PILOT', '#3a9bff'], [1170, 1235, 'JUGA PESAWAT', '#ff5d8f']];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#a0522d', 'PAK DARMAN'], N: ['#ff6fae', 'NENG'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  let s0 = 0, s1 = W.length; if (W.length > 8) { const i0 = Math.max(0, idx); s0 = Math.floor(i0 / 6) * 6; s1 = Math.min(W.length, s0 + 6); }
  const Wv = W.slice(s0, s1), rows = []; let cur = [], len = 0; Wv.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a: s0 ? st[s0] : a, rows, idx: idx - s0 }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  const id = shotAt(f).id;
  if (id === 'sky') {
    if (f < 61) { meteor(g, 900, 300, 260, ramp(f, 8, 30)); meteor(g, 700, 520, 180, ramp(f, 30, 48), 4); }
    if (f >= 200 && f < 226) plane(g, lerp(250, 420, ramp(f, 200, 226)), 520, f, 0);
    if (f >= 437 && f < 463) plane(g, lerp(420, 600, ramp(f, 437, 463)), 500, f, 1);
    if (f >= 983 && f < 1006) meteor(g, 1050, 220, 520, ramp(f, 984, 1004), 12);
  }
  if (id === 'asepUp') plane(g, lerp(150, 950, ramp(f, 694, 922)), 330, f, 1);
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  if (f >= 1236) put(g, 540, 300, 1.2, pop(f, 1236), (p) => T.fxRoundCard(p, 'WISH TERKABUL: 0', 'PILOT BINGUNG: 1', '#3a5bd9', Math.min(40, f - 1236)));
  { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    if (f < 1236) put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue === '#2f9a5a' ? '#5dff8a' : hue === '#ff6fae' ? '#ff8ac0' : '#ffd84a', nm, 1)); break; } }
};
