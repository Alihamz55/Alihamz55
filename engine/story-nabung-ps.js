// "Asep Nabung Beli PS" -- celengan ayam diisi gopek, keluarga "pinjem" lewat kertas utang. Ruang tengah siang (x=-40). Konsol tidak digambar (tanpa merek).
// Kostum baru: asepKolor, darmanKalkulator, ibuArisan, nengOverall. Properti: fxCelengan (utuh/slip/pecah), fxKalkulator, fxSofa.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1349;
const LINES = [["A", 15, 101], ["I", 109, 148], ["A", 154, 218], ["D", 227, 458], ["A", 466, 525], ["I", 555, 608], ["D", 622, 687], ["N", 700, 751], ["A", 799, 882], ["I", 891, 1012], ["D", 1024, 1184], ["A", 1193, 1313]];
const TXT = ["MULAI HARI INI, ASEP NABUNG BUAT BELI PS LIMA!", "SEHARI NABUNG BERAPA, SEP?", "GOPEK, BU! YANG PENTING KONSISTEN!", "HARGANYA DELAPAN JUTA... DIBAGI GOPEK... SEP, KEBELI PAS KAMU UMUR ENAM PULUH EMPAT.", "NGGAK APA-APA, PAK. PENSIUN MAIN GAME.",
  "IBU PINJEM DULU, BUAT ARISAN.", "BAPAK PINJEM, BUAT BENSIN.", "AKU PINJEM YA, A. BUAT BAKSO.", "INI CELENGAN... APA BUKU UTANG KELUARGA?!", "TENANG, SEP. NANTI IBU BAYAR... PAKAI KUPON ARISAN.", "SEKARANG KEBELINYA... PAS KAMU UMUR SERATUS DUA PULUH DELAPAN.", "UDAH, PAK. ASEP PINJEM HP BAPAK AJA. ADA GAME ULAR."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const PECAH = 762;
const SH = [['asep', 0, 108], ['ibu', 109, 153], ['asep2', 154, 226], ['darman', 227, 465], ['asep3', 466, 554], ['ibu2', 555, 621], ['darman2', 622, 699], ['neng', 700, 760], ['pecah', 761, 890], ['ibu3', 891, 1023], ['darman3', 1024, 1192], ['asepEnd', 1193, 1348]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'day' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  day: { az: 60, el: 52, sky: '#eef2ff', ground: '#5a4a48', hemi: 1.4, sun: '#fff4e0', sunI: 2.5, fog: '#d8e0ec', fogNear: 40, fogFar: 260, skyTop: '#6aa8f0', skyHor: '#e8f2ff', sat: 1.12, vig: 0.24, gain: '#fff8ee', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX - 0.85, 0.5, -0.4], IB = [RX + 0.15, 0.5, -0.3], DM = [RX + 1.15, 0.5, -0.4], NG = [RX + 1.95, 0.5, -0.2];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const CAMS = {
  asep: [{ f: 0, ...K([AS[0] - 0.2, 1.9, AS[2] + 1.9], [AS[0], 1.95, AS[2]], 40) }, { f: 108, ...K([AS[0] - 0.25, 1.95, AS[2] + 2.4], [AS[0], 2.0, AS[2]], 42) }],
  ibu: cu(IB, 2.0, 2.3, 0.3, 40), asep2: cu(AS, 2.0, 2.3, -0.3, 40), darman: cu(DM, 2.0, 2.4, 0.3, 42), asep3: cu(AS, 2.0, 2.2, -0.25, 40),
  ibu2: cu(IB, 2.0, 2.2, 0.25, 40), darman2: cu(DM, 2.0, 2.2, 0.25, 40), neng: cu(NG, 2.0, 2.2, 0.25, 40), pecah: cu(AS, 2.0, 2.4, -0.2, 42),
  ibu3: cu(IB, 2.0, 2.2, 0.25, 40), darman3: cu(DM, 2.0, 2.2, 0.25, 40), asepEnd: cu(AS, 2.0, 2.1, -0.2, 38),
};
const KICKS = [{ f: 430, a: 0.07 }, { f: PECAH, a: 0.06 }, { f: 860, a: 0.09 }, { f: 990, a: 0.06 }, { f: 1160, a: 0.08 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 466) return { L: 'belly', R: 'belly', expr: f < 227 ? 'grin' : f < 430 ? 'smug' : 'shock', facing: f < 109 ? 0 : 1, look: f < 109 ? 0 : 1 };
  if (f < 761) return { L: 'belly', R: 'belly', expr: f < 555 ? 'smile_closed' : 'smile', facing: 0, look: 0 };
  if (f < 891) return { L: 'up', R: 'up', expr: 'shock', facing: 0, look: 0, shake: 1, blink: 0 };
  if (f < 1193) return { L: 'hang', R: 'hang', expr: 'cry', facing: 1, look: 1 };
  return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1, headTilt: -5 };
};
const ibPose = (f) => (f >= 555 && f < 621 ? { L: 'hip', R: 'reach', expr: 'smug', facing: -1, look: -1 } : f >= 891 && f < 1023 ? { L: 'hip', R: 'point', expr: 'smug', facing: -1, look: -1 } : { L: 'hip', R: 'hang', expr: 'squint', facing: -1, look: -1 });
const dmPose = (f) => ({ L: 'hip', R: 'cheek', expr: (f >= 227 && f < 466) || (f >= 1024 && f < 1193) ? 'squint' : f >= 622 && f < 699 ? 'smug' : 'smile_closed', facing: -1, look: -1 });
const ngPose = (f) => ({ L: 'hang', R: f >= 700 && f < 760 ? 'reach' : 'hang', expr: f >= 700 && f < 760 ? 'smile' : 'smile_closed', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepKolor', asPose, 5, AS, 'A'); add('ibuArisan', ibPose, 3, IB, 'I'); add('darmanKalkulator', dmPose, 8, DM, 'D'); add('nengOverall', ngPose, 2, NG, 'N');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [FXC('sofa', (p) => T.fxSofa(p, '#c87a3a'), [RX + 0.6, 0.5, -1.25], 1.7, { order: 1 })];
  if (f < 761) { const sh = f < 100 ? f : 0; out.push(FXC('cl' + (sh ? f % 6 : 0), (p) => T.fxCelengan(p, 'utuh', sh), [AS[0] - 0.05, 0.92, AS[2] + 0.32], 0.4, { order: 9 })); }
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[30, 100, 'PS LIMA', '#5ab0ff'], [430, 465, 'UMUR 64', '#ffe14a'], [835, 890, 'BUKU UTANG?!', '#ff5d8f'], [980, 1023, 'KUPON ARISAN', '#c8a0ff'], [1160, 1192, 'UMUR 128', '#ffe14a']];
const BANNERS = [[490, 554, 'HARI KE-1', '#2f8a4a'], [555, 621, 'HARI KE-2', '#e8742c'], [622, 699, 'HARI KE-3', '#c0392b'], [700, 760, 'HARI KE-4', '#6a3fb5'], [761, 830, 'HARI KE-30', '#1d3a8a']];
const SPK = { N: ['#ff8ac0', 'NENG'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  const calc = (a, b_, txt) => { if (f >= a && f < b_) put(g, 790, 1020, 1.05, Math.min(pop(f, a, 6), out_(f, b_)), (p) => T.fxKalkulator(p, txt)); };
  calc(240, 330, '8.000.000'); calc(330, 400, ': 500'); calc(400, 466, 'UMUR 64');
  calc(1030, 1110, '+ UTANG'); calc(1110, 1193, 'UMUR 128');
  const slip = (a, b_, lab) => { if (f >= a && f < b_) put(g, 780, 1000, 1.05, Math.min(pop(f, a, 6), out_(f, b_)), (p) => T.fxCelengan(p, 'slip', 0, lab, clamp((f - a - 12) / 30))); };
  slip(565, 621, 'IBU'); slip(632, 699, 'BAPAK'); slip(708, 760, 'NENG');
  if (f >= 500 && f < 554) put(g, 780, 1000, 1.05, Math.min(pop(f, 500, 6), out_(f, 554)), (p) => T.fxCelengan(p, 'utuh', 0));
  if (f >= PECAH && f < 890) put(g, 540, 820, 1.55, Math.min(pop(f, PECAH, 5), out_(f, 890)), (p) => T.fxCelengan(p, 'pecah', f - PECAH));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1318) put(g, 540, 300, 1.2, pop(f, 1318), (p) => T.fxRoundCard(p, 'Rp500', 'TABUNGAN 30 HARI • UTANG: BANYAK', '#e8742c', Math.min(40, f - 1318)));
  if (f < 1318) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
