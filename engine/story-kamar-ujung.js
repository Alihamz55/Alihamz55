// "Asep Mau Dipindah dari Kamar Ujung" -- kamar (x=-40) + pos ronda (x=120). GAYA BARU (alis, poni, rambut kilap, VIS lip sync, caption tengah).
// Kostum baru: asepKaosCula, darmanKoran, ibuHanduk, juragan (Juragan Kilau, fiktif). Ucup: teman.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1457;
const LINES = [['D', 6, 156], ['A', 160, 209], ['D', 212, 296], ['A', 300, 361], ['I', 366, 498], ['D', 504, 635], ['A', 644, 774], ['I', 778, 969], ['J', 981, 1119], ['D', 1124, 1193], ['U', 1220, 1292], ['A', 1296, 1415]];
const TXT = ['BADAK MAU DIPINDAH DARI UJUNG KULON... SEP. KAMU JUGA PINDAH DARI KAMAR UJUNG.', 'LHO, KENAPA ASEP, PAK?!', 'KULITMU KAYAK BADAK. TEBEL.', 'PAK, ASEP BUKAN BADAK!',
  'TEBEL, SEP. UTANG GORENGAN MANG UJANG TIGA BULAN, MASIH BERANI LEWAT DEPAN WARUNGNYA.', 'UDAH. KAMARMU BAPAK SEWAIN. LUMAYAN BUAT BAYAR LISTRIK.', 'TOLAK RELOKASI! BIARKAN ASEP HIDUP DI KAMARNYA SENDIRI!',
  'SEP, BADAK AJA TINGGAL LIMA PULUH, TENANG. KAMU CUMA SATU, BERISIKNYA KAYAK SERATUS.', 'PERMISI... KAMAR UJUNG YANG DISEWAIN? WAH, DI BAWAHNYA ADA EMASNYA!', 'NAH, INI PENYEWANYA. BAYAR DI MUKA.',
  'SEP? NGAPAIN TIDUR DI SINI?', 'LAGI RELOKASI, CUP. INI... HABITAT KEDUA.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const NIGHT = 1196;
const SH = [['hp', 0, 75], ['darman', 76, 159], ['asep', 160, 211], ['darman', 212, 299], ['asep', 300, 365], ['ibu', 366, 503], ['darman', 504, 643], ['hug', 644, 777], ['ibu', 778, 980],
  ['door', 981, 1123], ['darman', 1124, 1195], ['ronda', 1196, 1295], ['rondaCU', 1296, 1456]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a >= NIGHT ? 'night' : 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.2, sun: '#ffe8cc', sunI: 2.4, fog: '#141c3a', fogNear: 40, fogFar: 260, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.08, vig: 0.32, gain: '#fff2e4', shadowExt: 9 },
  night: { az: 60, el: 46, sky: '#9aa0c8', ground: '#3a3438', hemi: 1.1, sun: '#ffe2b8', sunI: 2.1, fog: '#121a38', fogNear: 30, fogFar: 160, skyTop: '#050820', skyHor: '#1c2858', sat: 1.08, vig: 0.38, shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40, PX = 120;
const DM = [RX + 0.95, 0.5, 0.25], AS = [RX - 0.05, 0.5, 0.45], IB = [RX - 1.05, 0.5, 0.2], JG = [RX + 1.85, 0.5, 0.45], KS = [RX + 0.42, 0.5, 0.6];
const ASR = [PX - 2.2, 0.5, 0.2], UC = [PX - 1.4, 0.5, 0.25];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 38, dx = 0) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0] + dx, h + 0.12, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.85], [P[0] + dx, h + 0.13, P[2]], fov) }];
const CAMS = {
  hp: cu(DM, 2.0, 2.4, -0.3, 40), darman: cu(DM, 2.0, 2.5, -0.35, 40), asep: cu(AS, 2.0, 2.4, 0.3, 40), ibu: cu(IB, 2.0, 2.5, 0.35, 40),
  hug: cu([AS[0] + 0.2, 0.5, AS[2]], 1.95, 2.7, -0.2, 44), door: cu([JG[0] - 0.35, 0.5, 0.45], 2.0, 3.0, 0.1, 44),
  ronda: cu([(ASR[0] + UC[0]) / 2, 0.5, 0.2], 1.85, 3.4, 0.0, 44), rondaCU: cu(ASR, 1.75, 2.3, 0.3, 40),
};
const KICKS = [{ f: 76, a: 0.04 }, { f: 300, a: 0.04 }, { f: 650, a: 0.05 }, { f: 935, a: 0.09 }, { f: 1060, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: id === 'door' || id === 'ronda' ? 3 : 7 }; };
export const worldAt = (f) => ({ curtain: 1, night: f >= NIGHT, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 160) return { L: 'hang', R: 'hang', expr: 'smile', facing: 1, look: 1 };
  if (f < 300) return { L: 'shrug', R: 'shrug', expr: f < 212 ? 'shock' : 'nervous', facing: 1, look: 1, blink: f < 212 ? 0 : undefined };
  if (f < 644) return { L: 'hip', R: 'point', expr: f < 366 ? 'stubborn' : 'nervous', facing: 1, look: 1, sweat: f >= 366 && f < 504 ? 1 : 0 };
  if (f < 981) return { L: 'cross', R: 'cross', expr: f < 778 ? 'cry' : 'sad', facing: 0, look: 0 };
  return { L: 'cross', R: 'cross', expr: 'shock', facing: 1, look: 1, blink: 0, shake: f < 1060 };
};
const dmPose = (f) => {
  if (f < 212) return { L: 'hang', R: 'text', expr: f < 76 ? 'neutral' : 'squint', facing: f < 90 ? 0 : -1, look: f < 90 ? 0 : -1 };
  if (f < 981) return { L: 'hip', R: f >= 504 && f < 644 ? 'point' : 'text', expr: 'squint', facing: -1, look: -1 };
  return { L: 'hip', R: f >= 1124 ? 'thumb' : 'hang', expr: f >= 1124 ? 'grin' : 'smile', facing: 1, look: 1 };
};
const ibPose = (f) => {
  if (f < 366) return null;
  if (f < 981) return { L: 'temple', R: f >= 778 ? 'point' : 'hip', expr: 'squint', facing: 1, look: 1 };
  return { L: 'hip', R: 'hip', expr: 'neutral', facing: 1, look: 1 };
};
const jgPose = (f) => {
  if (f < 975) return null; const dx = lerp(1.6, 0, M.smooth(ramp(f, 975, 1000)));
  return { L: 'hang', R: 'reach', lift: 0.0, expr: f > 1040 ? 'smug' : 'smile', facing: -1, look: -1, dx };
};
const asRonda = (f) => ({ L: 'cross', R: 'cross', expr: 'sad', facing: 0, look: f > 1296 ? 0 : 1, bob: -0.16, headTilt: -10, blink: f < 1296 ? 1 : undefined });
const ucPose = (f) => ({ L: 'hang', R: 'up', expr: 'nervous', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, dx, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, [pos[0] + (dx || 0), pos[1], pos[2]], { ground: 0.5 })); };
  if (f < NIGHT) { add('asepKaosCula', asPose, 5, AS, 'A'); add('darmanKoran', dmPose, 8, DM, 'D'); add('ibuHanduk', ibPose, 3, IB, 'I'); add('juragan', jgPose, 9, JG, 'J'); }
  else { add('asepKaosCula', asRonda, 5, ASR, 'A'); add('teman', ucPose, 7, UC, 'U'); }
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  if (f >= 644 && f < NIGHT) out.push(FXC('kasur', (p) => T.fxKasur(p, 0), KS, 0.95, { order: 8 }));
  if (f >= 975 && f < NIGHT) { const dx = lerp(1.6, 0, M.smooth(ramp(f, 975, 1000))), on = f >= 1000 && f < 1124 ? 1 : 0;
    out.push(FXC('det' + on + (on ? f % 6 : 0), (p) => T.fxDetektor(p, f, on), [JG[0] + dx - 0.45, 0.55, JG[2] + 0.25], 0.95, { order: 9 })); }
  if (f >= NIGHT) out.push(FXC('gulung', (p) => T.fxKasur(p, 1), [ASR[0] + 0.02, 0.6, ASR[2] + 0.25], 0.65, { order: 9 }));
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[212, 299, 'KULIT BADAK', '#9aa4ae'], [650, 777, 'TOLAK RELOKASI!', '#ff5d8f'], [935, 980, 'KAYAK SERATUS', '#ffe14a'], [1060, 1123, 'ADA EMASNYA!', '#f2c94c'], [1370, 1420, 'HABITAT KEDUA', '#5dff8a']];
const BANNERS = [[1196, 1260, 'MALAMNYA', '#3a5bd9']];
const SPK = { A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#ff8ac0', 'IBU'], J: ['#f2c94c', 'JURAGAN'], U: ['#ffb03a', 'UCUP'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  if (shotAt(f).id === 'hp') put(g, 540, 780, 1.1, f < 1 ? 1 : pop(f, 0, 5), (p) => T.fxBerita(p));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 340, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1420) put(g, 540, 300, 1.2, pop(f, 1420), (p) => T.fxRoundCard(p, 'LINDUNGI BADAK JAWA', 'ASEP JUGA BOLEH', '#2f8a4a', Math.min(40, f - 1420)));
  if (f < 1420) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
