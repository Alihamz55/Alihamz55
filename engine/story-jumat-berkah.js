// "Asep Antre Nasi Kotak Jumat Berkah" -- depan rumah No.17 (x=240) siang. GAYA BARU: alis, poni naik, rambut mengkilap, lip sync bentuk mulut (visemes.js), caption tengah, kamera dekat.
// Kostum baru: asepKoko (+ penyamaran kacamata hitam / helm kurir / kumis + peci putih), darmanPanitia, ibuCelemek.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1339;
const LINES = [['A', 6, 79], ['D', 84, 187], ['A', 191, 219], ['A', 242, 319], ['D', 323, 453], ['A', 458, 492], ['A', 515, 568], ['D', 572, 605], ['A', 609, 667], ['A', 690, 770], ['D', 776, 841], ['I', 852, 974], ['A', 1001, 1075], ['D', 1084, 1215], ['A', 1221, 1293]];
const TXT = ['JUMAT BERKAH! NASI KOTAK GRATIS!', 'SATU ORANG SATU, YA! YANG UDAH AMBIL, JANGAN BALIK LAGI!', 'MAKASIH, PAK!', 'PERMISI, PAK. SAYA WARGA BARU.', 'WARGA BARU... KOK SARUNGNYA SAMA?', 'SARUNG PASARAN, PAK.',
  'SAYA KURIR, PAK. MAU AMBIL PESANAN.', 'PESANAN SIAPA?', 'PESANAN... ASEP.', 'SELAMAT SIANG. SAYA PAK DARMAN.', 'LHO... TERUS SAYA SIAPA?!', 'SEP! NASI KOTAK ITU IBU YANG MASAK. DI RUMAH KAMU BILANG NGGAK ENAK!',
  '...PANTESAN RASANYA KAYAK DI RUMAH.', 'UDAH, SEP. HUKUMANNYA, MINGGU DEPAN KAMU YANG BAGIIN.', 'SIAP, PAK! SATU ORANG... EMPAT!'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const SH = [['wide', 0, 83], ['darman', 84, 190], ['two', 191, 241], ['asep', 242, 322], ['darman', 323, 457], ['asep', 458, 514], ['asep', 515, 571], ['darman', 572, 608], ['asep', 609, 689],
  ['asep', 690, 775], ['darman', 776, 851], ['ibu', 852, 1000], ['asepCU', 1001, 1083], ['darman', 1084, 1220], ['wide2', 1221, 1338]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'day' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = { day: { az: 60, el: 58, sky: '#e8f2ff', ground: '#9aa4ae', hemi: 1.3, sun: '#fff4e0', sunI: 2.4, fog: '#dfe8f2', fogNear: 40, fogFar: 200, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.08, vig: 0.24, shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240;
const TB = [HR + 0.45, 0.53, 1.2], DM = [HR + 0.55, 0.53, 0.7], AS = [HR - 0.55, 0.53, 1.75], IB = [HR + 0.55, 0.53, 1.95];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 38, dx = 0) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0] + dx, h + 0.12, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.85], [P[0] + dx, h + 0.13, P[2]], fov) }];
const CAMS = {
  wide: [{ f: 0, ...K([HR, 1.95, 5.6], [HR, 2.0, 1.2], 44) }, { f: 83, ...K([HR, 1.95, 5.2], [HR, 2.02, 1.2], 44) }],
  wide2: [{ f: 0, ...K([HR + 0.3, 1.95, 5.6], [HR + 0.3, 2.0, 1.2], 44) }, { f: 118, ...K([HR + 0.3, 1.95, 5.2], [HR + 0.3, 2.02, 1.2], 44) }],
  two: [{ f: 0, ...K([HR, 2.0, 4.4], [HR, 2.05, 1.2], 42) }, { f: 50, ...K([HR, 2.0, 4.2], [HR, 2.07, 1.2], 42) }],
  darman: cu(DM, 2.0, 2.5, 0.35, 40), asep: cu(AS, 2.0, 2.3, -0.35, 40), asepCU: cu(AS, 2.05, 1.9, -0.25, 38), ibu: cu([(AS[0] + IB[0]) / 2, 0.5, AS[2] + 0.1], 2.0, 3.0, 0.15, 44),
};
const KICKS = [{ f: 6, a: 0.03 }, { f: 323, a: 0.04 }, { f: 776, a: 0.08 }, { f: 865, a: 0.09 }, { f: 1270, a: 0.05 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: id.startsWith('wide') ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: (typeof who === 'string' ? who : who.k) + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const BASE = { tunic: "#bfe3b0", skin: "#d9a07a", hair: "#2a1a10", arms: "#bfe3b0", legs: "#d9a07a", sarung: "#7a4a2a", plaid: "#4a2a18", peci: true, koko: true };
const asepOutfit = (f) => f < 242 ? 'asepKoko' : f < 515 ? { k: 'asepShades', ...BASE, shades: true } : f < 690 ? { k: 'asepHelm', ...BASE, motoHelm: '#2f9a5a', shades: false } : { k: 'asepKumis', ...BASE, moustache: '#14101a', peciCol: '#f4f1ea' };
const boxes = (f) => f < 205 ? 0 : f < 440 ? 1 : f < 600 ? 2 : f < 830 ? 3 : 4;
const asPose = (f) => {
  const run = f < 60 ? (f / 22) % 1 : null, dx = f < 60 ? lerp(-2.4, 0, M.smooth(ramp(f, 0, 60))) : 0;
  const hold = boxes(f) > 0 ? 'shield' : 'hang';
  if (f < 84) return { L: run !== null ? 'swing' : 'up', R: run !== null ? 'swing' : 'up', walk: run, expr: 'grin', facing: 1, look: 1, dx };
  if (f < 242) return { L: hold, R: f > 191 && f < 220 ? 'reach' : hold, expr: 'grin', facing: 1, look: 1 };
  if (f < 515) return { L: hold, R: hold, expr: f >= 458 ? 'nervous' : 'smug', facing: 1, look: 1, sweat: f >= 323 && f < 458 ? 1 : 0 };
  if (f < 690) return { L: hold, R: hold, expr: f >= 609 ? 'nervous' : 'smile', facing: 1, look: 1 };
  if (f < 852) return { L: hold, R: hold, expr: 'smug', facing: 1, look: 1 };
  if (f < 1001) return { L: hold, R: hold, expr: 'shock', facing: 1, look: 1, blink: 0, shake: f < 900 };
  if (f < 1221) return { L: hold, R: hold, expr: f < 1084 ? 'smile_closed' : 'nervous', facing: f < 1084 ? 0 : 1, look: f < 1084 ? 0 : 1 };
  return { L: hold, R: hold, expr: 'grin', facing: 1, look: 1 };
};
const dmPose = (f) => {
  if (f < 191) return { L: 'hip', R: f >= 84 ? 'point' : 'hang', expr: f >= 84 ? 'squint' : 'smile', facing: -1, look: -1 };
  if (f < 323) return { L: 'hang', R: 'reach', expr: 'smile', facing: -1, look: -1 };
  if (f < 776) return { L: 'hip', R: 'hip', expr: 'squint', facing: -1, look: -1 };
  if (f < 852) return { L: 'up', R: 'temple', expr: 'shock', facing: -1, look: -1, blink: 0, shake: 1 };
  if (f < 1084) return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1 };
  return { L: 'hip', R: 'point', expr: 'smile_closed', facing: -1, look: -1 };
};
const ibPose = (f) => {
  if (f < 845) return null;
  const dx = lerp(1.6, 0, M.smooth(ramp(f, 845, 870)));
  if (f < 1001) return { L: 'hip', R: 'point', expr: 'squint', facing: -1, look: -1, dx, shake: f > 875 && f < 960 };
  return { L: 'hip', R: 'hip', expr: 'squint', facing: -1, look: -1 };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, dx, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, [pos[0] + (dx || 0), pos[1], pos[2]], { ground: 0.5 })); };
  add(asepOutfit(f), asPose, 5, AS, 'A'); add('darmanPanitia', dmPose, 8, DM, 'D'); add('ibuCelemek', ibPose, 3, IB, 'I');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  const left = Math.max(0, 9 - boxes(f));
  out.push(FXC('meja' + left, (p) => T.fxMejaJB(p, left), TB, 0.88, { order: 3 }));
  out.push(FXC('spanduk', (p) => T.fxSpanduk(p), [HR + 0.4, 2.3, 0.15], 1.1, { order: 2 }));
  const n = boxes(f); if (n) { const dx = f < 60 ? lerp(-2.4, 0, M.smooth(ramp(f, 0, 60))) : 0;
    out.push(FXC('kt' + n, (p) => T.fxKotakTangan(p, n), [AS[0] + dx + 0.05, 1.05, AS[2] + 0.25], 0.18 + 0.1 * n, { order: 9 })); }
  return out;
};

// ---- overlay: caption tengah gaya baru, banner antrean, kata kunci ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[20, 83, 'JUMAT BERKAH', '#ffe14a'], [323, 400, 'WARGA BARU?', '#3a9bff'], [776, 851, 'SAYA SIAPA?!', '#ff5d8f'], [865, 960, 'MASAKAN IBU?!', '#ff5d8f'], [1250, 1300, 'SATU ORANG EMPAT', '#ffe14a']];
const BANNERS = [[220, 300, 'ANTREAN KE-2', '#e8742c'], [495, 570, 'ANTREAN KE-3', '#e8742c'], [670, 760, 'ANTREAN KE-4', '#e8344a']];
const SPK = { A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#ff8ac0', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 340, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1300) put(g, 540, 300, 1.2, pop(f, 1300), (p) => T.fxRoundCard(p, 'JUMAT BERKAH', 'ASEP 4 - WARGA 0', '#2f8a4a', Math.min(40, f - 1300)));
  if (f < 1300) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
