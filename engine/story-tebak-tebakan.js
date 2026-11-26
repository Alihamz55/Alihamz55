// "Tebak-tebakan Pos Ronda" -- Asep vs Ucup adu tebak-tebakan absurd; jawaban terakhir muncul di belakang Ucup (Pocong). Pos ronda (x=120) malam.
// Permintaan pengguna: TANPA tawa penonton, kamera santai (shot panjang, dorongan pelan, tanpa kick/flash). Kostum baru: asepParka, ucupHoodie. Properti: fxSenter.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1495;
const LINES = [["U", 15, 98], ["A", 111, 192], ["U", 204, 238], ["A", 248, 355], ["A", 373, 423], ["U", 434, 490], ["A", 501, 621], ["A", 639, 698], ["A", 710, 831], ["A", 850, 1007], ["U", 1022, 1097], ["A", 1109, 1196], ["P", 1214, 1286], ["U", 1301, 1362], ["P", 1380, 1456]];
const TXT = ["SEP, NGOBROL DONG... UCUP TAKUT.", "TEBAK-TEBAKAN AJA! KENAPA JAM DINDING DIGANTUNG?", "BIAR KELIHATAN?", "SALAH! KALAU DITIDURIN... NANTI TELAT BANGUN.", "MOTOR APA YANG PALING SETIA?", "MOTOR... BARU?",
  "MOTOR BAPAK. NGGAK PERNAH DISERVIS, TETEP MAU DIAJAK KE MANA-MANA.", "APA BEDANYA ASEP SAMA SANDAL JEPIT?", "SANDAL JEPIT KALAU ILANG DICARIIN... ASEP NGGAK.", "TERAKHIR! APA YANG PUTIH, DIIKET, TERUS LONCAT-LONCAT?", "AH, GAMPANG... LONTONG!",
  "SALAH, CUP. JAWABANNYA... DI BELAKANG KAMU.", "PERMISI... ADA COLOKAN?", "AAAAAAA! POCOOONG!", "LONTONG... SAYA MIRIP LONTONG?"];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const PC_IN = 1150, RUN = 1301;
const SH = [['two', 0, 247], ['asep', 248, 372], ['two2', 373, 638], ['asep2', 639, 849], ['two3', 850, 1108], ['reveal', 1109, 1300], ['kabur', 1301, 1379], ['pocong', 1380, 1494]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'night' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = { night: { az: 60, el: 46, sky: '#9aa0c8', ground: '#3a3438', hemi: 1.1, sun: '#ffe2b8', sunI: 2.1, fog: '#121a38', fogNear: 30, fogFar: 160,
  skyTop: '#050820', skyHor: '#1c2858', sat: 1.08, vig: 0.38, shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const PX = 120;
const AS = [PX - 2.3, 0.5, 0.15], UC = [PX - 1.5, 0.5, 0.15], PC = [PX - 1.2, 0.5, -0.55], PC2 = [PX - 1.9, 0.5, 0.1];
const K = (pos, look, fov) => ({ pos, look, fov });
const slow = (P, h, d0, d1, side, fov, n) => [{ f: 0, ...K([P[0] + side, h, P[2] + d0], [P[0], h + 0.08, P[2]], fov) }, { f: n, ...K([P[0] + side * 0.8, h, P[2] + d1], [P[0], h + 0.1, P[2]], fov) }];
const MID = [(AS[0] + UC[0]) / 2, 0.5, 0.15];
const CAMS = {
  two: slow(MID, 1.95, 3.9, 3.2, 0, 42, 247), asep: slow(AS, 2.0, 2.7, 2.3, -0.3, 40, 124), two2: slow(MID, 1.95, 3.6, 3.0, 0.2, 42, 265),
  asep2: slow(AS, 2.0, 2.5, 1.9, -0.25, 38, 210), two3: slow(MID, 1.95, 3.7, 2.9, 0, 42, 258),
  reveal: [{ f: 0, ...K([UC[0] + 0.15, 2.0, UC[2] + 2.8], [UC[0] + 0.1, 2.1, UC[2]], 40) }, { f: 191, ...K([UC[0] + 0.12, 2.05, UC[2] + 2.2], [UC[0] + 0.15, 2.15, UC[2]], 40) }],
  kabur: [{ f: 0, ...K([PX - 1.4, 1.9, 6.0], [PX - 1.4, 1.95, 0], 44) }, { f: 78, ...K([PX - 1.4, 1.9, 5.6], [PX - 1.4, 1.95, 0], 44) }],
  pocong: slow(PC2, 1.9, 3.0, 2.3, 0.1, 40, 114),
};
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: [], creep: 0 }); c.flash = 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['two', 'two2', 'two3', 'kabur'].includes(id) ? 3 : 6 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 111) return { L: 'cross', R: 'cross', expr: 'smile_closed', facing: 1, look: 1 };
  if (f < 850) return { L: 'hip', R: (f >= 248 && f < 372) || (f >= 501 && f < 638) || (f >= 710 && f < 849) ? 'shrug' : 'point', expr: f >= 780 && f < 849 ? 'nervous' : 'grin', facing: 1, look: 1 };
  if (f < 1109) return { L: 'hang', R: 'point', expr: f < 1022 ? 'smug' : 'squint', facing: 1, look: 1 };
  if (f < RUN) return { L: 'hang', R: 'point', expr: 'shock', facing: 1, look: 1, blink: 0 };
  return { L: 'hang', R: 'hang', expr: 'shock', facing: 1, look: 1, blink: 0 };
};
const ucPose = (f) => {
  const run = f >= RUN ? clamp((f - RUN) / 45) : 0;
  if (run >= 1) return null;
  const o = f < 1022 ? { L: 'cross', R: 'hang', expr: f < 204 ? 'nervous' : f < 248 || (f >= 434 && f < 501) ? 'squint' : 'shock', facing: -1, look: -1, shake: f < 98 }
    : f < RUN ? { L: 'up', R: 'up', expr: f < 1180 ? 'grin' : 'nervous', facing: -1, look: -1, sweat: f >= 1180 ? 1 : 0, blink: f >= 1214 ? 0 : undefined }
    : { L: 'swing', R: 'swing', expr: 'shock', facing: 1, look: 1, walk: ((f - RUN) / 10) % 1, blink: 0 };
  return { ...o, dx: run * 3.2 };
};
export const actorsAt = (f, T) => {
  const out = [];
  if (shotAt(f).id === 'pocong') return out;
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, dx, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 5, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, [pos[0] + (dx || 0), pos[1], pos[2]], { ground: 0.5 })); };
  add('asepParka', asPose, 5, AS, 'A'); add('ucupHoodie', ucPose, 4, UC, 'U');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const mouthAt = (f) => { if (!speaks(f, 'P')) return 0; const v = VIS[f] || 'X'; return v === 'X' ? 0 : v === 'A' ? 0.1 : 'DE'.includes(v) ? 1 : 0.5; };
export const fxAt = (f, T) => {
  const out = [];
  // senter Ucup (terlempar saat kabur)
  if (f < RUN) out.push(FXC('sn' + (f < 1214 ? 'on' : 'off'), (p) => T.fxSenter(p, -0.25, 1), [UC[0] + 0.32, 1.12, UC[2] + 0.25], 0.42, { order: 9 }));
  else if (f < 1380) { const k = clamp((f - RUN) / 25); out.push(FXC('snf' + Math.floor(f / 2), (p) => T.fxSenter(p, -0.25 + k * 6, 1), [UC[0] + 0.32 + k * 0.9, 1.12 + Math.sin(k * Math.PI) * 0.9 - k * 0.55, UC[2] + 0.25], 0.42, { order: 9 })); }
  // Pocong: muncul pelan di belakang Ucup, lalu duduk sendirian
  if (f >= PC_IN && f < 1380) { const a = clamp((f - PC_IN) / 30), m = q(mouthAt(f), 1), bl = f % 100 > 95 ? 1 : 0, hop = f >= 1240 ? q(Math.abs(Math.sin((f - 1240) * 0.12)) * 0.06, 3) : 0;
    out.push(FXC('pc' + [m, bl, hop, q(a, 1)].join(), (p) => { p.g.globalAlpha = a; T.fxPocong(p, m, bl, 'calm'); p.g.globalAlpha = 1; }, [PC[0], PC[1] + hop, PC[2]], 0.95, { order: 2 })); }
  if (f >= 1380) { const m = q(mouthAt(f), 1), bl = f % 100 > 95 ? 1 : 0;
    out.push(FXC('pc2' + [m, bl].join(), (p) => T.fxPocong(p, m, bl, 'calm'), PC2, 0.95, { order: 2 })); }
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[300, 372, 'TELAT BANGUN', '#7ac8ff'], [570, 638, 'SETIA', '#5dff8a'], [790, 849, 'NGGAK DICARIIN', '#c8a0ff'], [1060, 1108, 'LONTONG?!', '#ffe14a']];
const BANNERS = [[0, 100, 'RONDA MALAM', '#1d3a8a']];
const SPK = { U: ['#ffd84a', 'UCUP'], P: ['#e8ecf0', 'POCONG'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1460) put(g, 540, 300, 1.2, pop(f, 1460), (p) => T.fxRoundCard(p, 'TEBAK-TEBAKAN', 'JAWABAN: BUKAN LONTONG', '#1d3a8a', Math.min(40, f - 1460)));
  if (f < 1460) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
