// "Asep Anak Jaksun" -- stand up comedy: Asep belajar bahasa Jaksel, logat Sunda bocor; Ibu & Pak Darman menyela dari kursi penonton. Panggung (x=0). GAYA BARU.
// Kostum baru: asepJaksel (+ fxTote), ibuPenonton, darmanKotak. Tawa penonton di setiap punchline (worldAt.laugh + SFX).
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1506;
const LINES = [["M", 15, 66], ["A", 75, 204], ["A", 210, 366], ["D", 371, 452], ["A", 482, 530], ["A", 548, 675], ["A", 679, 860], ["A", 902, 1027], ["I", 1032, 1086], ["A", 1116, 1212], ["I", 1216, 1289], ["A", 1316, 1467]];
const TXT = ["KITA SAMBUT... ASEP!", "KATANYA, BIAR DITERIMA NONGKRONG DI KAFE JAKSEL... HARUS BISA BAHASA JAKSEL.", "JADI ASEP LATIHAN. WHICH IS... LITERALLY... BASICALLY...", "WISKI?! ASTAGFIRULLAH, SEP!", "BUKAN, PAK! WHICH IS!",
  "TERUS KATANYA HARUS PAKE KATA PREFER. ASEP COBA: ASEP PREFER PISANG.", "TAPI LIDAH SUNDA TEH SUSAH... JADINYA: ASEP FREFER... FISANG.", "KEMARIN ASEP PRAKTEK KE IBU: BU, ASEP LITERALLY BUTUH DUIT.", "IBU LITERALLY NGGAK PUNYA!",
  "ANYWAY... JUJURLY... ASEP UDAH KEREN BELUM?", "KEREN APANYA? SUNDA-NYA MASIH KENCENG!", "YA UDAH... SEKARANG ASEP BUKAN ANAK JAKSEL. ASEP ANAK... JAKSUN. JAKARTA SUNDA."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
export const LAUGHS = [[455, 520, 1], [532, 560, 0.7], [835, 905, 1.3], [1088, 1125, 1], [1290, 1320, 1], [1440, 1506, 1.2]];
const SH = [['wide', 0, 74], ['asep', 75, 209], ['asep1b', 210, 370], ['darman', 371, 481], ['asep2', 482, 547], ['asep3', 548, 678], ['asep4', 679, 901], ['asep5', 902, 1031], ['ibu', 1032, 1115], ['asep6', 1116, 1215], ['ibu2', 1216, 1315], ['asepEnd', 1316, 1439], ['wideEnd', 1440, 1505]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'stage' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  stage: { az: 30, el: 55, sky: '#f4e8ff', ground: '#3a2a40', hemi: 1.35, sun: '#fff0d8', sunI: 2.6, fog: '#1a1426', fogNear: 40, fogFar: 200, skyTop: '#140f1e', skyHor: '#2a2036', sat: 1.15, vig: 0.3, gain: '#fff4e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const AS = [0, 0.5, 0.1], IB = [0.75, -0.32, 2.45], DM = [1.35, -0.32, 2.5];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
// kamera dari panggung ke arah penonton (menghadap +z)
const aud = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] - d], [P[0], h - 0.05, P[2]], fov) }, { f: 120, ...K([P[0] + side * 0.85, h, P[2] - d * 0.86], [P[0], h - 0.04, P[2]], fov) }];
const CAMS = {
  wide: [{ f: 0, ...K([0.3, 1.9, 7.2], [0, 2.0, 0], 44) }, { f: 74, ...K([0.2, 1.95, 6.0], [0, 2.0, 0], 42) }],
  asep: cu(AS, 2.05, 2.4, -0.35, 40), asep1b: cu(AS, 2.05, 2.1, 0.35, 38), asep2: cu(AS, 2.05, 2.0, -0.3, 38), asep3: cu(AS, 2.05, 2.4, 0.35, 40),
  asep4: [{ f: 0, ...K([AS[0] - 0.2, 2.05, AS[2] + 2.6], [AS[0], 2.15, AS[2]], 40) }, { f: 222, ...K([AS[0] - 0.1, 2.1, AS[2] + 1.7], [AS[0], 2.2, AS[2]], 36) }],
  asep5: cu(AS, 2.05, 2.3, -0.3, 40), asep6: cu(AS, 2.05, 2.5, 0.35, 42), asepEnd: cu(AS, 2.05, 2.2, -0.25, 38),
  darman: aud(DM, 1.4, 1.9, -0.25, 42), ibu: aud(IB, 1.35, 1.85, 0.25, 42), ibu2: aud(IB, 1.35, 1.75, 0.2, 42),
  wideEnd: [{ f: 0, ...K([0.3, 1.9, 6.4], [0, 2.0, 0], 44) }, { f: 66, ...K([0.4, 1.95, 7.2], [0, 2.0, 0], 46) }],
};
const KICKS = [{ f: 371, a: 0.07 }, { f: 835, a: 0.1 }, { f: 1060, a: 0.07 }, { f: 1250, a: 0.06 }, { f: 1430, a: 0.08 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['wide', 'wideEnd'].includes(id) ? 3 : 7 }; };
const lgAt = (f) => { let v = 0; for (const [a, b, k] of LAUGHS) if (f >= a && f < b) v = Math.max(v, k * Math.min(1, (f - a) / 6, (b - f) / 10)); return v; };
export const worldAt = (f) => ({ curtain: 1, night: false, noBig: true, laugh: q(lgAt(f || 0), 2) });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 75) return { L: 'wave', wv: f * 0.4, R: 'mic', expr: 'grin', facing: 0, look: 0 };
  if (f < 210) return { L: 'shrug', R: 'mic', expr: 'smug', facing: 0, look: 0 };
  if (f < 371) return { L: 'hip', R: 'mic', expr: 'smug', facing: 0, look: 0, headTilt: 5 };
  if (f < 548) return { L: 'up', R: 'mic', expr: 'shock', facing: 1, look: 1, shake: f >= 482 && f < 530 };
  if (f < 679) return { L: 'point', R: 'mic', expr: 'grin', facing: 0, look: 0 };
  if (f < 902) return { L: 'hip', R: 'mic', expr: f < 835 ? 'smug' : 'smile_closed', facing: 0, look: 0, headTilt: 4 };
  if (f < 1116) return { L: 'shrug', R: 'mic', expr: f < 1032 ? 'nervous' : 'shock', facing: f < 1032 ? 0 : 1, look: f < 1032 ? 0 : 1 };
  if (f < 1316) return { L: 'thumb', R: 'mic', expr: f < 1216 ? 'smug' : 'nervous', facing: f < 1216 ? 0 : 1, look: f < 1216 ? 0 : 1 };
  return { L: 'hang', R: 'mic', expr: f < 1400 ? 'nervous' : 'grin', facing: 0, look: 0 };
};
const ibPose = (f) => ({ L: 'hang', R: (f >= 1032 && f < 1100) || (f >= 1216 && f < 1300) ? 'point' : 'hang', expr: f >= 1032 ? 'squint' : 'smile', facing: -1, look: -1, shake: (f >= 1032 && f < 1060) || (f >= 1216 && f < 1245) });
const dmPose = (f) => ({ L: f >= 371 && f < 460 ? 'up' : 'hang', R: f >= 371 && f < 460 ? 'up' : 'hang', expr: f >= 371 && f < 482 ? 'shock' : 'smile_closed', facing: -1, look: -1, shake: f >= 371 && f < 410, blink: f >= 371 && f < 460 ? 0 : undefined });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk, ex = {}) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5, ...ex })); };
  add('asepJaksel', asPose, 5, AS, 'A'); add('ibuPenonton', ibPose, 3, IB, 'I', { s: 0.86, blob: false }); add('darmanKotak', dmPose, 8, DM, 'D', { s: 0.86, blob: false });
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => [FXC('tote', (p) => T.fxTote(p), [AS[0] - 0.42, 0.95, AS[2] + 0.12], 0.42, { order: 9 })];

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[371, 452, 'WISKI?!', '#ff5d8f'], [835, 905, 'FREFER FISANG', '#ffe14a'], [1060, 1115, 'LITERALLY', '#c8a0ff'], [1430, 1470, 'JAKSUN', '#5dff8a']];
const BANNERS = [[0, 74, 'OPEN MIC: ASEP', '#6a3fb5'], [210, 370, 'KELAS BAHASA JAKSEL', '#2f8a4a']];
const SPK = { M: ['#ffd84a', 'MC'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1472) put(g, 540, 300, 1.2, pop(f, 1472), (p) => T.fxRoundCard(p, 'JAKSUN', 'JAKARTA SUNDA', '#2f8a4a', Math.min(40, f - 1472)));
  if (f < 1472) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
