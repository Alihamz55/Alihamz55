// "Asep Galau Dijogetin" -- Asep (sarung, mic) galau di kamar kos (x=-40) diiringi lagu kiriman pengguna; Pak Darman datang,
// musik mengecil, "mending dijogetin!", lalu musik normal lagi dan Asep, Pak Darman, Ibu joget.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
import { LIPS_SONG } from './lips_song.js';
const LINES = [['D', 386, 503], ['A', 521, 608], ['D', 636, 735], ['I', 785, 825]];
const TXT = ['SEP, KENAPA GALAU? DIPUTUSIN, YA?', 'IYA, PAK... HUHUHU...', 'UDAH! GALAU MAH... MENDING DIJOGETIN AJA!', 'IBU IKUUUT!'];
// song words (s) from transcription -> karaoke + Asep singing
const WORDS = [[2.8, 'HATIMU'], [3.0, 'ADUUHH...'], [3.8, 'LIBATKAN'], [4.6, 'YANG'], [5.4, 'LAIN'], [7.5, 'MEMBUAT'], [8.4, 'CINTAMU'], [13.0, 'TERBELAH'], [14.5, 'JADI'], [14.8, 'DUA'], [16.0, 'BATINMU'],
  [18.5, 'LIBATKAN'], [19.3, 'YANG'], [20.5, 'LAIN'], [22.3, 'MERASAKAN'], [24.0, 'HATIMU'], [27.6, 'JIWAKU'], [29.0, 'RUSAK'], [30.0, 'KARENA'], [31.8, 'MU']];
const LYR = [[0, 4], [5, 6], [7, 10], [11, 13], [14, 15], [16, 19]]; // phrases (word index ranges)
const wordF = WORDS.map(([s], i) => [Math.round(s * 30), Math.round(Math.min(i + 1 < WORDS.length ? WORDS[i + 1][0] : s + 1.4, s + 1.4) * 30)]);
const singing = (f) => (f < 372 || f >= 742) && wordF.some(([a, b]) => f >= a && f <= b);
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (who === 'A' && singing(f)) { const lv = +(LIPS_SONG[f] || 0); return lv ? expr + '_t' + Math.min(3, lv) : expr; }
  if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1032;
const J = 742; // joget starts (music back to full)
const SH = [['wide', 0, 119], ['asep', 120, 239], ['asepECU', 240, 332], ['door', 333, 385], ['darman', 386, 515], ['asep2', 516, 630], ['darman2', 631, 741],
  ['party', 742, 784], ['ibu', 785, 840], ['low', 841, 930], ['party2', 931, 1031]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a >= J ? 'party' : 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
const ROOM = { az: 60, el: 48, sky: '#b8c0e8', ground: '#3a3048', hemi: 1.05, sun: '#ffd9b0', sunI: 2.1, fog: '#141c3a', fogNear: 40, fogFar: 260,
  skyTop: '#060a24', skyHor: '#22305e', sat: 1.0, vig: 0.42, gain: '#f0e8ff', shadowExt: 9 };
export const LIGHTS = { room: ROOM, party: { ...ROOM, sky: '#ffb0e0', ground: '#4a2a5a', hemi: 1.25, sun: '#ffe0f4', sunI: 2.5, sat: 1.22, vig: 0.3, gain: '#fff0f8' } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX + 0.1, 0.5, 0.25], DM = [RX + 1.15, 0.5, 0.1], IB = [RX - 1.05, 0.5, 0.15];
const beat = 60 / 86 * 30, B0 = 0.053 * 30;
const bt = (f) => (f - B0) / beat; // beat count
const dmPos = (f) => f < 333 ? null : f < 380 ? [lerp(RX + 3.2, DM[0], smooth(ramp(f, 333, 380))), DM[1], DM[2]] : DM;
const ibPos = (f) => f < 745 ? null : f < 790 ? [lerp(RX - 3.2, IB[0], smooth(ramp(f, 745, 790))), IB[1], IB[2]] : IB;
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([RX + 0.1, 2.3, 5.4], [RX + 0.1, 1.85, 0.0], 46) }, { f: 119, ...K([RX + 0.1, 2.15, 4.5], [RX + 0.1, 1.85, 0.0], 46) }],
  asep: [{ f: 0, ...K([AS[0] - 0.35, 1.55, AS[2] + 2.5], [AS[0], 1.98, AS[2]], 38) }, { f: 119, ...K([AS[0] - 0.25, 1.58, AS[2] + 2.15], [AS[0], 1.99, AS[2]], 38) }],
  asepECU: [{ f: 0, ...K([AS[0] + 0.2, 1.9, AS[2] + 1.85], [AS[0], 2.08, AS[2]], 36) }, { f: 92, ...K([AS[0] + 0.15, 1.9, AS[2] + 1.55], [AS[0], 2.1, AS[2]], 36) }],
  door: [{ f: 0, ...K([RX + 1.2, 2.15, 5.4], [RX + 1.2, 1.75, 0.0], 48) }, { f: 52, ...K([RX + 1.0, 2.12, 5.1], [RX + 1.0, 1.75, 0.0], 48) }],
  darman: [{ f: 0, ...K([DM[0] - 0.4, 1.6, DM[2] + 2.5], [DM[0], 1.98, DM[2]], 40) }, { f: 130, ...K([DM[0] - 0.32, 1.62, DM[2] + 2.2], [DM[0], 2.0, DM[2]], 40) }],
  asep2: [{ f: 0, ...K([AS[0] + 0.3, 1.85, AS[2] + 2.0], [AS[0], 2.05, AS[2]], 38) }, { f: 115, ...K([AS[0] + 0.25, 1.86, AS[2] + 1.75], [AS[0], 2.06, AS[2]], 38) }],
  darman2: [{ f: 0, ...K([DM[0] - 0.3, 1.55, DM[2] + 2.5], [DM[0], 1.8, DM[2]], 40) }, { f: 110, ...K([DM[0] - 0.25, 1.57, DM[2] + 2.25], [DM[0], 1.82, DM[2]], 40) }],
  party: [{ f: 0, ...K([RX + 0.05, 2.2, 6.0], [RX + 0.05, 1.8, 0.0], 50) }, { f: 42, ...K([RX + 0.05, 2.15, 5.7], [RX + 0.05, 1.8, 0.0], 50) }],
  ibu: [{ f: 0, ...K([IB[0] + 0.4, 1.6, IB[2] + 2.4], [IB[0], 1.98, IB[2]], 40) }, { f: 55, ...K([IB[0] + 0.35, 1.62, IB[2] + 2.15], [IB[0], 2.0, IB[2]], 40) }],
  low: [{ f: 0, ...K([RX - 0.3, 1.2, 5.6], [RX + 0.05, 1.85, 0.0], 56) }, { f: 90, ...K([RX + 0.4, 1.2, 5.6], [RX + 0.05, 1.85, 0.0], 56) }],
  party2: [{ f: 0, ...K([RX + 0.05, 2.25, 5.9], [RX + 0.05, 1.85, 0.0], 50) }, { f: 100, ...K([RX + 0.05, 2.1, 4.9], [RX + 0.05, 1.82, 0.0], 50) }],
};
const KICKS = [{ f: 372, a: 0.05 }, { f: 700, a: 0.03 }, { f: J, a: 0.07 }, { f: 785, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 });
  // joget: camera bounces on the beat
  if (f >= J) { const b = bt(f), k = Math.pow(Math.abs(Math.sin(Math.PI * b)), 6) * 0.035; c.pos = [c.pos[0], c.pos[1] - k, c.pos[2]]; }
  c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; if (f >= J && f < J + 4) c.flash = 0.35 * (1 - (f - J) / 4); return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
const CINE = ['asep', 'asepECU', 'darman', 'asep2', 'darman2', 'ibu'];
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: CINE.includes(S.id) ? 8 : 3 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
// joget: arms alternate on the beat, hips sway, little hop
const jog = (f, ph, keepR) => { const b = bt(f) + ph, n = Math.floor(b), s = Math.sin(Math.PI * b);
  const up = n % 2 === 0, wv = q(((f * 0.5) % 6.283), 1);
  return { L: up ? 'up' : 'wave', R: keepR || (up ? 'wave' : 'up'), wv, tiltJ: q(9 * s, 1), bobJ: q(0.035 * Math.abs(s), 3), step: q((b * 0.5) % 1, 2), dx: 0.07 * s }; };
const asPose = (f) => {
  if (f < 372) return { L: 'cheek', R: 'mic', expr: f < 120 ? 'sad' : 'sob', facing: 0, look: 0, sw: 1 };
  if (f < 516) return { L: 'cheek', R: 'mic', expr: f < 386 ? 'shock' : 'sad', facing: 1, look: 1, blink: f < 386 ? 0 : undefined };
  if (f < 631) return { L: 'temple', R: 'mic', expr: 'sob', facing: 1, look: 1, shake: 1 };
  if (f < J) return { L: 'cheek', R: 'mic', expr: f > 700 ? 'shock' : 'sad', facing: 1, look: 1, blink: f > 700 ? 0 : undefined };
  const j = jog(f, 0, 'mic'); return { ...j, expr: f < 860 ? 'cry' : 'grin', facing: 0, look: 0 };
};
const dmPose = (f) => {
  if (f < 386) return { L: 'hang', R: 'hang', expr: 'neutral', facing: -1, look: -1, walking: f < 380 };
  if (f < 516) return { L: 'hip', R: 'shrug', expr: 'nervous', facing: -1, look: -1 };
  if (f < 631) return { L: 'hip', R: 'hang', expr: 'sad', facing: -1, look: -1 };
  if (f < J) return { L: 'hip', R: f > 690 ? 'up' : 'point', expr: f > 690 ? 'laugh' : 'grin', facing: -1, look: -1 };
  const j = jog(f, 0.5); return { ...j, expr: 'laugh', facing: 0, look: 0 };
};
const ibPose = (f) => { const j = jog(f, 0.25); if (f < 790) return { ...j, L: 'up', R: 'up', expr: 'laugh', facing: 1, look: 1, walking: true };
  return { ...j, L: 'wave', R: 'wave', expr: 'laugh', facing: 0, look: 0 }; };
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { if (!pos) return; const { shake, sw, tiltJ = 0, bobJ = 0, dx = 0, walking, ...o } = pose(f), i = idle(f, seed);
    const tilt = (shake ? sway(f, 6, 0.6) : 0) + (sw ? sway(f, 3, 0.05) : 0) + tiltJ;
    if (walking) { o.step = q((f / 14) % 1, 2); }
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob + bobJ, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) },
      [q(pos[0] + dx, 3), pos[1], pos[2]], { ground: 0.5 })); };
  add('sarung', asPose, 5, AS, 'A'); add('darman', dmPose, 2, dmPos(f), 'D'); add('ibuDaster', ibPose, 3, ibPos(f), 'I');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
export const fxAt = (f, T) => {
  const out = [];
  // broken heart floats above Asep while galau; splits on "terbelah"
  if (f >= 150 && f < 372) { const k = Math.min(pop(f, 150, 10), out_(f, 372, 8)), sp = q(smooth(ramp(f, 250, 290)), 2), y = 2.75 + 0.04 * Math.sin(f * 0.08);
    if (k > 0.01) out.push(FXC('lv' + sp + k, (p) => T.fxLove(p, sp), [AS[0] + 0.55, q(y, 3), AS[2] + 0.1], 0.32 * k)); }
  if (f >= J) { const b = bt(f), sp = (f % 6) < 3 ? 0 : 1; out.push(FXC('sp' + sp + Math.floor(b), (p) => T.fxSparkle(p, f), [RX + 0.05, 3.1, -1.0], 1.0, { order: 1 })); }
  return out;
};

// ---- screen-space overlay ----
const JUDGE = [[372, 420, 'NGIIIK!', '#ffe14a'], [700, 741, 'DIJOGETIN!', '#ff5d8f'], [J, J + 40, 'GOYAAANG!', '#ffe14a']];
const BANNERS = [[150, 239, 'LAGI GALAU BERAT', '#3a5bd9', '#ffffff', false], [400, 503, 'DIPUTUSIN?!', '#e8344a', '#ffffff', false], [800, 900, 'SATU RUMAH JOGET', '#e8742c', '#ffffff', false]];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#b07a2a', 'PAK DARMAN'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  const rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a, rows, idx }; } return null; };
// karaoke lyric line (only while the song is loud)
const lyric = (f) => { if (f >= 372 && f < J) return null; for (const [i0, i1] of LYR) { const a = wordF[i0][0] - 6, b = wordF[i1][1] + 4; if (f < a || f > b) continue;
  const W = WORDS.slice(i0, i1 + 1).map((w) => w[1]); let idx = -1; for (let k = i0; k <= i1; k++) if (f >= wordF[k][0]) idx = k - i0;
  const rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  let off = 0, ri = idx; for (const r of rows) { if (ri < r.length) break; ri -= r.length; off++; }
  return { a, rows, idx }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
export const overlayAt = (f, g, T) => {
  if (f < 110) put(g, 540, 560, 1.75, f < 1 ? 1 : out_(f, 110), (p) => T.fxRoundCard(p, 'ASEP LAGI GALAU', 'MALAM KOMEDI', '#3a5bd9', Math.min(40, f + 6)));
  if (f >= 972) put(g, 540, 600, 1.6, pop(f, 972), (p) => T.fxRoundCard(p, 'GALAU? JOGETIN AJA!', 'LAGU GALAU ANDALANMU? TULIS DI KOMENTAR!', '#e8344a', Math.min(40, f - 972)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 300, 1.25, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue, fg, dot] of BANNERS) put(g, 540, 250, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, fg, dot, f));
  const C_ = telop(f); if (C_ && f < 972) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1420, 1.45, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
  else if (f < 972) { const L_ = lyric(f); if (L_) put(g, 540, 1420, 1.35, pop(f, L_.a, 5), (p) => T.fxTelop(p, L_.rows, L_.idx, '#8b5cf6', 'LAGU', 1)); }
};
