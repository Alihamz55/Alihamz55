// "Asep Maksain Game Berat di HP Kentang" -- kamar malam (x=-40). Kostum baru: asepGamer (lalu kribo + cemong), darmanSarung, ibuRoll. Game fiktif GTB 6.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
export const TOTAL = 1261;
const LINES = [['A', 4, 144], ['A', 150, 378], ['D', 383, 402], ['A', 416, 491], ['I', 497, 591], ['D', 615, 747], ['A', 753, 840], ['A', 882, 953], ['I', 959, 1006], ['D', 1014, 1113], ['A', 1134, 1230]];
const TXT = ['GTB 6 UDAH RILIS! DAN ASEP... MAU MAIN DI HP KENTANG!', 'MEMORI PENUH? TENANG. HAPUS FOTO MANTAN... HAPUS APLIKASI DIET... HAPUS FOTO NIKAHAN BAPAK SAMA IBU.', 'ASEP!', 'PANAS, EUY! MASUK KULKAS DULU.',
  'SEP! KULKAS ITU BUAT IKAN ASIN, BUKAN BUAT HP!', 'ITU GAME, SEP? KOK KAYAK SLIDE PRESENTASI?', 'INI MAH GRAFIKNYA REALISTIS, PAK! SAMPAI ADA ASAPNYA!', 'TUH KAN, BU. LEDAKANNYA HD.', 'KULKASNYA BAU HP GOSONG, SEP!', 'UDAH, PAKAI HP BAPAK. ADA GAME ULAR.', 'GRAFIKNYA... REALISTIS PISAN.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
const BOOM = 846;
const SH = [['screen', 0, 52], ['asep', 53, 149], ['screen', 150, 300], ['asepECU', 301, 382], ['darman', 383, 415], ['screen', 416, 452], ['kulkas', 453, 496], ['ibu', 497, 591],
  ['screen', 592, 660], ['darman', 661, 752], ['asep', 753, 845], ['wide', 846, 881], ['asepECU', 882, 958], ['ibuK', 959, 1010], ['two', 1011, 1113], ['screen', 1114, 1162], ['asep', 1163, 1260]];
const SCREEN = { 0: 'load', 150: 'full', 416: 'dl', 592: 'lag', 1114: 'snake' };
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = { room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.15, sun: '#ffe8cc', sunI: 2.3, fog: '#141c3a', fogNear: 40, fogFar: 260,
  skyTop: '#060a24', skyHor: '#22305e', sat: 1.08, vig: 0.36, gain: '#fff2e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX + 0.3, 0.5, 0.35], DM = [RX + 1.5, 0.5, 0.05], IB = [RX - 0.95, 0.5, -0.35], KL = [RX - 1.75, 0.5, -1.7];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 38, dx = 0) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0] + dx, h + 0.12, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.85], [P[0] + dx, h + 0.13, P[2]], fov) }];
const CAMS = {
  asep: cu(AS, 1.95, 2.7, 0.4), asepECU: cu(AS, 2.08, 2.1, 0.25, 36), darman: cu(DM, 1.9, 2.6, -0.4), ibu: cu(IB, 1.9, 2.6, 0.4), ibuK: cu(IB, 1.9, 2.8, 0.5, 40, -0.35),
  kulkas: cu([KL[0] + 0.8, 0.5, KL[2] + 0.9], 1.7, 2.8, 0.6, 44, -0.2), screen: cu(AS, 1.9, 1.5, 0.1, 36),
  wide: [{ f: 0, ...K([RX + 0.3, 2.0, 5.2], [RX + 0.2, 1.7, 0], 48) }, { f: 35, ...K([RX + 0.3, 2.0, 4.8], [RX + 0.2, 1.7, 0], 48) }],
  two: [{ f: 0, ...K([RX + 0.9, 1.8, 3.6], [RX + 0.9, 1.95, 0.2], 42) }, { f: 100, ...K([RX + 0.9, 1.8, 3.2], [RX + 0.9, 1.97, 0.2], 42) }],
};
const KICKS = [{ f: 53, a: 0.04 }, { f: 383, a: 0.08 }, { f: 497, a: 0.05 }, { f: BOOM, a: 0.1 }, { f: 882, a: 0.04 }, { f: 1163, a: 0.03 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= BOOM && f < BOOM + 6 ? 0.9 * (1 - (f - BOOM) / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.08 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: id === 'wide' || id === 'two' ? 3 : 8 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const boomed = (f) => f >= BOOM;
const asPose = (f) => {
  const B = boomed(f) ? { afro: 1, soot: 1 } : {};
  if (f < 150) return { L: 'up', R: 'text', expr: 'grin', facing: 0, look: 0, ...B };
  if (f < 383) return { L: 'hang', R: 'text', expr: f > 300 ? 'smile' : 'squint', facing: 0, look: 0 };
  if (f < 416) return { L: 'up', R: 'text', expr: 'shock', facing: 1, look: 1, shake: 1, blink: 0 };
  if (f < 497) return { L: 'shrug', R: 'text', expr: 'nervous', facing: -1, look: -1, shake: 1, sweat: 1 };
  if (f < 592) return { L: 'hang', R: 'text', expr: 'nervous', facing: -1, look: -1 };
  if (f < 753) return { L: 'hang', R: 'text', expr: 'squint', facing: 0, look: 0 };
  if (f < BOOM) return { L: 'up', R: 'text', expr: 'grin', facing: 1, look: 1 };
  if (f < 882) return { L: 'hang', R: 'hang', expr: 'shock', facing: 0, look: 0, blink: 0, ...B };
  if (f < 959) return { L: 'thumb', R: 'hang', expr: 'smile_closed', facing: -1, look: -1, ...B };
  if (f < 1134) return { L: 'hang', R: f > 1060 ? 'reach' : 'hang', expr: 'nervous', facing: 1, look: 1, ...B };
  return { L: 'hang', R: 'text', expr: 'smile_closed', facing: 0, look: 0, tear: 1, ...B };
};
const dmPose = (f) => {
  if (f < 383) return null;
  if (f < 497) return { L: 'up', R: 'hip', expr: 'shock', facing: -1, look: -1, shake: f < 416 };
  if (f < 846) return { L: 'hip', R: f > 661 && f < 753 ? 'temple' : 'hang', expr: f > 661 ? 'squint' : 'neutral', facing: -1, look: -1 };
  if (f < 1011) return { L: 'up', R: 'up', expr: 'shock', facing: -1, look: -1, shake: f < 880 };
  return { L: 'hang', R: f < 1135 ? 'reach' : 'hip', expr: 'smile_closed', facing: -1, look: -1, lift: 0.1 };
};
const ibPose = (f) => {
  if (f < 497) return null;
  if (f < 600) return { L: 'hip', R: 'point', expr: 'squint', facing: 1, look: 1, shake: 1 };
  if (f < 846) return { L: 'hip', R: 'hip', expr: 'squint', facing: 1, look: 1 };
  if (f < 959) return { L: 'up', R: 'up', expr: 'shock', facing: 1, look: 1, shake: f < 880 };
  if (f < 1011) return { L: 'cheek', R: 'point', expr: 'nervous', facing: -1, look: -1 };
  return { L: 'hip', R: 'hip', expr: 'squint', facing: 1, look: 1 };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, tear, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, sweat: o.sweat || (tear ? 1 : 0), expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepGamer', asPose, 5, AS, 'A'); add('darmanSarung', dmPose, 8, DM, 'D'); add('ibuRoll', ibPose, 3, IB, 'I');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  const open = (f >= 453 && f < 600) || (f >= 959 && f < 1011), smell = f >= 959 && f < 1011;
  out.push(FXC('kl' + [open, smell, smell ? f % 20 : 0].join(), (p) => T.fxKulkas(p, open ? 1 : 0, smell ? 1 : 0, f), KL, 1.75, { order: 3 }));
  // asap HP: tipis saat panas, tebal menjelang ledakan, awan besar saat POF
  const sm = f >= 451 && f < 497 ? 0.25 : f >= 753 && f < BOOM ? 0.25 + 0.5 * ramp(f, 753, BOOM) : f >= BOOM && f < 960 ? 1.4 * (1 - ramp(f, 900, 960)) : 0;
  if (sm > 0.02) out.push(FXC('sm' + (f % 40) + q(sm, 2), (p) => T.fxSmoke(p, f), [AS[0] + 0.35, 1.45, AS[2] + 0.15], q(0.5 * sm, 2), { order: 9 }));
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[150, 215, 'MEMORI PENUH', '#e8344a'], [383, 415, 'ASEP!', '#ff5d8f'], [BOOM, 881, 'POF!', '#ffe14a'], [920, 958, 'HD', '#39ff6a'], [1060, 1113, 'GAME ULAR', '#9bbc0f']];
const BANNERS = [[416, 452, 'DOWNLOAD 150 GB', '#e8742c'], [592, 660, 'FPS: 1', '#3a5bd9'], [753, 845, 'SUHU HP: 99°C', '#e8344a']];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#a0522d', 'PAK DARMAN'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  let s0 = 0, s1 = W.length; if (W.length > 8) { const i0 = Math.max(0, idx); s0 = Math.floor(i0 / 6) * 6; s1 = Math.min(W.length, s0 + 6); }
  const Wv = W.slice(s0, s1), rows = []; let cur = [], len = 0; Wv.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a: s0 ? st[s0] : a, rows, idx: idx - s0 }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  const S = shotAt(f);
  if (S.id === 'screen') { const mode = SCREEN[S.a], k = mode === 'full' ? (f > 205 ? 1 : 0) + (f > 255 ? 1 : 0) + (f > 330 ? 1 : 0) : mode === 'dl' ? ramp(f, 420, 450) : 0;
    put(g, 540, 820, 1.12, f < 1 ? 1 : pop(f, S.a, 5), (p) => T.fxGameHP(p, mode, f, k)); }
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1215) put(g, 540, 300, 1.2, pop(f, 1215), (p) => T.fxRoundCard(p, 'HP KENTANG VS GAME BERAT', '0 - 1', '#e8344a', Math.min(40, f - 1215)));
  const C_ = telop(f); if (C_ && f < 1215) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1550, 1.2, f < 1 ? 1 : pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
