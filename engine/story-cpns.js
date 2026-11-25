// "Asep Disuruh Daftar CPNS" -- tren formasi CPNS 2026 (generik, tanpa logo/situs asli). Ruang tengah (x=-40) siang. GAYA BARU.
// Kostum baru: asepTesCPNS, ibuMint, darmanKrem. Properti: fxHPCpns (buka/loading/foto/formasi), fxMap, fxSofa.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1127;
const LINES = [["I", 15, 118], ["A", 124, 191], ["I", 197, 243], ["A", 254, 345], ["A", 369, 466], ["D", 474, 554], ["D", 572, 689], ["A", 697, 761], ["D", 767, 895], ["I", 919, 988], ["A", 994, 1031], ["I", 1043, 1091]];
const TXT = ["SEP! CPNS UDAH BUKA! DAFTAR SEKARANG, BIAR ADA PENSIUNNYA!", "BU, ASEP MAU JADI KONTEN KREATOR AJA.", "KONTEN KREATOR ADA PENSIUNNYA?", "...ADA, BU. PENSIUN KALAU AKUNNYA KENA BANNED.", "OKE, UPLOAD PAS FOTO... LHO, KOK DITOLAK?",
  "SEP, ITU PAS FOTO APA FOTO KUCING?", "NIH, ADA FORMASI YANG COCOK BUAT KAMU: PENJAGA MALAM.", "COCOK, PAK! ASEP TIAP MALAM BEGADANG!", "BEGADANG MAIN GAME ITU BUKAN JAGA, SEP. ITU DIJAGA IBU.", "POKOKNYA KALAU LULUS, IBU SYUKURAN!", "KALAU NGGAK LULUS?", "KAMU YANG DISYUKURIN."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const TOLAK = 440, HL = 655;
const SH = [['ibu', 0, 123], ['asep', 124, 196], ['ibu1', 197, 253], ['asep2', 254, 368], ['hp', 369, 473], ['darman', 474, 571], ['darman2', 572, 696], ['asep3', 697, 766], ['darman3', 767, 918], ['ibu2', 919, 993], ['asep4', 994, 1042], ['ibu3', 1043, 1126]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'day' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  day: { az: 60, el: 52, sky: '#eef2ff', ground: '#5a4a48', hemi: 1.4, sun: '#fff4e0', sunI: 2.5, fog: '#d8e0ec', fogNear: 40, fogFar: 260, skyTop: '#6aa8f0', skyHor: '#e8f2ff', sat: 1.12, vig: 0.24, gain: '#fff8ee', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX - 0.85, 0.5, -0.4], IB = [RX + 0.15, 0.5, -0.3], DM = [RX + 1.15, 0.5, -0.4];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const CAMS = {
  ibu: [{ f: 0, ...K([IB[0] + 0.2, 2.0, IB[2] + 1.8], [IB[0], 2.12, IB[2]], 40) }, { f: 123, ...K([IB[0] + 0.25, 2.0, IB[2] + 2.3], [IB[0], 2.1, IB[2]], 42) }],
  asep: cu(AS, 2.0, 2.3, -0.3, 40), ibu1: cu(IB, 2.0, 2.2, 0.3, 40), asep2: cu(AS, 2.0, 2.1, -0.25, 38), hp: cu(AS, 2.0, 2.4, 0.3, 42),
  darman: cu(DM, 2.0, 2.2, 0.3, 40), darman2: cu(DM, 2.0, 2.4, 0.25, 42), asep3: cu(AS, 2.0, 2.3, -0.3, 40), darman3: cu(DM, 2.0, 2.1, 0.25, 38),
  ibu2: cu(IB, 2.0, 2.3, 0.3, 40), asep4: cu(AS, 2.0, 2.1, -0.25, 38), ibu3: cu(IB, 2.0, 2.0, 0.2, 38),
};
const KICKS = [{ f: 15, a: 0.05 }, { f: 330, a: 0.07 }, { f: TOLAK, a: 0.06 }, { f: 520, a: 0.06 }, { f: HL, a: 0.05 }, { f: 860, a: 0.09 }, { f: 1070, a: 0.09 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 124) return { L: 'hang', R: 'hang', expr: 'shock', facing: 1, look: 1 };
  if (f < 254) return { L: 'hip', R: 'thumb', expr: 'smug', facing: 1, look: 1 };
  if (f < 369) return { L: 'hang', R: 'temple', expr: f < 300 ? 'nervous' : 'smile_closed', facing: 1, look: 1 };
  if (f < 474) return { L: 'text', R: 'text', expr: f < TOLAK ? 'grin' : 'shock', facing: 0, look: 0, blink: f >= TOLAK ? 0 : undefined };
  if (f < 697) return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1, sweat: f < 572 ? 1 : 0 };
  if (f < 767) return { L: 'up', R: 'up', expr: 'grin', facing: 1, look: 1, bob: q(0.012 * Math.abs(Math.sin(f * 0.35)), 3) };
  if (f < 994) return { L: 'hang', R: 'hang', expr: f < 860 ? 'shock' : 'nervous', facing: 1, look: 1 };
  return { L: 'belly', R: 'belly', expr: f < 1060 ? 'nervous' : 'cry', facing: 1, look: 1 };
};
const ibPose = (f) => { if (f < 124) return { L: 'hip', R: 'phone', expr: 'grin', facing: -1, look: -1, shake: f > 15 && f < 50 };
  if (f < 919) return { L: 'hip', R: 'point', expr: 'squint', facing: -1, look: -1 };
  if (f < 1043) return { L: 'shrug', R: 'shrug', expr: 'grin', facing: 0, look: 0, bob: q(0.01 * Math.abs(Math.sin(f * 0.3)), 3) };
  return { L: 'hip', R: 'point', expr: 'smug', facing: -1, look: -1 }; };
const dmPose = (f) => ({ L: 'text', R: 'text', expr: f < 860 || f > 900 ? 'squint' : 'smug', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepTesCPNS', asPose, 5, AS, 'A'); add('ibuMint', ibPose, 3, IB, 'I'); add('darmanKrem', dmPose, 8, DM, 'D');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => [FXC('sofa', (p) => T.fxSofa(p, '#4a7aa8'), [RX + 0.15, 0.5, -1.25], 1.55, { order: 1 }),
  FXC('map', (p) => T.fxMapBerkas(p), [DM[0] + 0.02, 1.0, DM[2] + 0.3], 0.55, { order: 9 })];

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[330, 368, 'KENA BANNED', '#ff5d8f'], [500, 571, 'FILTER KUCING', '#ffb03a'], [860, 918, 'DIJAGA IBU', '#ff5d8f'], [1070, 1094, 'DISYUKURIN', '#ffe14a']];
const BANNERS = [[0, 100, 'CPNS 2026 DIBUKA!', '#c0392b']];
const SPK = { A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  const hp = (mode, a, b_, k, x = 540, y = 900, sc = 1.2) => { if (f >= a && f < b_) put(g, x, y, sc, Math.min(pop(f, a, 6), out_(f, b_)), (p) => T.fxHPCpns(p, mode, f - a, k)); };
  hp('buka', 30, 118, 0, 800, 1000, 0.8);
  hp('loading', 369, 410, 0); hp('foto', 410, 554, f >= TOLAK ? clamp((f - TOLAK) / 6) : 0);
  hp('formasi', 600, 696, f >= HL ? 1 : 0);
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1095) put(g, 540, 300, 1.2, pop(f, 1095), (p) => T.fxRoundCard(p, 'CPNS 2026', 'FORMASI: PENJAGA MALAM', '#c0392b', Math.min(40, f - 1095)));
  if (f < 1095) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
