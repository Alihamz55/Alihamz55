// "Doa Jomblo Malam Minggu" -- Asep akhirnya ngapel, Ucup (jomblo) berdoa minta hujan... langsung hujan deras, ngapel batal. Rumah No.17 (x=240) malam.
// Kostum baru: asepNgapel, ucupJomblo. Properti: fxBunga (layu), fxPayung, fxChat (pesan Neng). Hujan + kilat di overlay mulai HUJAN.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 987;
const LINES = [["A", 15, 125], ["A", 135, 279], ["U", 291, 388], ["A", 393, 499], ["N", 541, 643], ["U", 670, 795], ["A", 813, 948]];
const TXT = ["MALAM MINGGU INI... ASEP AKHIRNYA NGAPEL!", "CUP, ASEP MAU NGAPEL KE RUMAH NENG! KAMU MAH DI RUMAH AJA YA, JOMBLO.", "YA ALLAH... TURUNKANLAH HUJAN MALAM INI...", "LANGIT CERAH GINI, CUP! MANA MUNGKIN...", "A, HUJANNYA DERES BANGET. NGGAK JADI YA.", "MAAF, SEP... DOA JOMBLO EMANG PALING CEPET DIKABULIN.", "YA ALLAH... MINGGU DEPAN, UCUP JUGA NGAPEL YA."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
export const HUJAN = 490;
const SH = [['asep', 0, 134], ['two', 135, 290], ['ucup', 291, 392], ['asep2', 393, 489], ['wide', 490, 540], ['hp', 541, 669], ['ucup2', 670, 812], ['asepEnd', 813, 986]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a >= HUJAN ? 'storm' : 'night' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  night: { az: 60, el: 46, sky: '#9aa0c8', ground: '#3a3438', hemi: 1.15, sun: '#ffe2b8', sunI: 2.2, fog: '#121a38', fogNear: 30, fogFar: 160, skyTop: '#050820', skyHor: '#1c2858', sat: 1.08, vig: 0.36, shadowExt: 9 },
  storm: { az: 40, el: 50, sky: '#8a98c8', ground: '#2a2a38', hemi: 1.05, sun: '#c8d4ff', sunI: 2.0, fog: '#141a30', fogNear: 30, fogFar: 170, skyTop: '#06081a', skyHor: '#1a2240', sat: 1.0, vig: 0.42, gain: '#dce4ff', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240;
const AS = [HR - 0.4, 0.53, 1.55], UC = [HR + 0.55, 0.53, 1.45];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const MID = [(AS[0] + UC[0]) / 2, 0.53, 1.5];
const CAMS = {
  asep: [{ f: 0, ...K([AS[0] - 0.2, 2.0, AS[2] + 1.9], [AS[0], 2.1, AS[2]], 40) }, { f: 134, ...K([AS[0] - 0.25, 2.0, AS[2] + 2.4], [AS[0], 2.1, AS[2]], 42) }],
  two: [{ f: 0, ...K([MID[0], 1.95, 4.9], [MID[0], 2.0, 1.4], 42) }, { f: 155, ...K([MID[0], 1.95, 4.4], [MID[0], 2.05, 1.4], 42) }],
  ucup: [{ f: 0, ...K([UC[0] + 0.2, 1.4, UC[2] + 2.2], [UC[0], 2.4, UC[2]], 42) }, { f: 101, ...K([UC[0] + 0.15, 1.4, UC[2] + 1.9], [UC[0], 2.5, UC[2]], 40) }],
  asep2: cu(AS, 2.0, 2.2, -0.3, 40),
  wide: [{ f: 0, ...K([MID[0], 2.3, 5.6], [MID[0], 2.3, 1.0], 48) }, { f: 50, ...K([MID[0], 2.3, 5.2], [MID[0], 2.3, 1.0], 48) }],
  hp: cu(AS, 2.0, 2.4, -0.2, 42), ucup2: cu(UC, 2.0, 2.3, 0.3, 40), asepEnd: cu(AS, 2.0, 2.0, -0.2, 38),
};
const KICKS = [{ f: HUJAN, a: 0.09 }, { f: 760, a: 0.07 }, { f: 925, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['two', 'wide'].includes(id) ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 135) return { L: 'cheek', R: 'belly', expr: 'smug', facing: 0, look: 0, headTilt: 5 };
  if (f < 291) return { L: 'hip', R: 'point', expr: 'grin', facing: 1, look: 1 };
  if (f < HUJAN) return { L: 'hip', R: 'belly', expr: f < 393 ? 'squint' : 'grin', facing: 1, look: 1 };
  if (f < 541) return { L: 'up', R: 'belly', expr: 'shock', facing: 0, look: 0, blink: 0, shake: 1 };
  if (f < 813) return { L: 'hang', R: 'belly', expr: f < 600 ? 'shock' : 'cry', facing: 0, look: 0, sweat: 1, headTilt: -6 };
  return { L: 'pray', R: 'pray', expr: 'cry', facing: 0, look: 0, sweat: 1, headTilt: 8 };
};
const ucPose = (f) => {
  if (f < 291) return { L: 'cross', R: 'cross', expr: f < 200 ? 'squint' : 'nervous', facing: -1, look: -1 };
  if (f < HUJAN) return { L: 'up', R: 'up', expr: 'smile_closed', facing: 0, look: 0, headTilt: 10 };
  return { L: 'hang', R: 'reach', expr: f < 670 ? 'shock' : 'smug', facing: -1, look: -1 };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.53 })); };
  add('asepNgapel', asPose, 5, AS, 'A'); add('ucupJomblo', ucPose, 4, UC, 'U');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = []; const lay = q(clamp((f - HUJAN - 20) / 90), 1);
  out.push(FXC('bunga' + lay, (p) => T.fxBunga(p, lay), [AS[0] + 0.28, 0.92, AS[2] + 0.3], 0.4, { order: 9 }));
  if (f >= HUJAN + 40) out.push(FXC('py', (p) => T.fxPayung(p, '#2f8a4a'), [UC[0] + 0.25, UC[1] + 0.5, UC[2] + 0.1], 1.0, { order: 9 }));
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[HUJAN + 2, 540, 'DUARR!', '#ffe14a'], [740, 812, 'DOA JOMBLO', '#c8a0ff']];
const BANNERS = [[0, 110, 'MALAM MINGGU', '#ff5d8f'], [291, 392, 'LANGIT CERAH', '#1d3a8a']];
const SPK = { U: ['#ffd84a', 'UCUP'], N: ['#ff8ac0', 'NENG'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  // hujan + kilat
  if (f >= HUJAN) { let fl = 0; for (const a0 of [HUJAN, 660]) if (f >= a0 && f < a0 + 10) fl = Math.max(fl, (a0 === HUJAN ? 0.9 : 0.5) * (1 - (f - a0) / 10));
    g.save(); g.strokeStyle = 'rgba(200,215,255,0.38)'; g.lineWidth = 3; g.lineCap = 'round';
    for (let i = 0; i < 150; i++) { const x = (i * 97.3 + f * 9) % 1180 - 50, y = ((i * 211.7) + f * 46) % 2050 - 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 10, y + 48); g.stroke(); }
    g.restore();
    if (f >= HUJAN && f < HUJAN + 12 && shotAt(f).id === 'wide') { g.save(); g.strokeStyle = '#ffffff'; g.lineWidth = 12; g.shadowColor = '#bfe0ff'; g.shadowBlur = 30; g.beginPath(); let x = 960, y = 0; g.moveTo(x, y);
      for (let k = 0; k < 9; k++) { x += (k % 2 ? 55 : -35); y += 115; g.lineTo(x, y); } g.stroke(); g.restore(); }
    if (fl > 0.01) { g.fillStyle = `rgba(235,240,255,${fl})`; g.fillRect(0, 0, 1080, 1920); } }
  if (f >= 525 && f < 669) put(g, 540, 900, 1.05, Math.min(pop(f, 525, 6), out_(f, 669)), (p) => T.fxChat(new T.Pen(p.g), [{ text: 'A, hujannya deres banget. Nggak jadi ya 🙏', me: false, k: clamp((f - 541) / 8) }], f < 541 ? 1 : 0, 'Neng'));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 952) put(g, 540, 300, 1.2, pop(f, 952), (p) => T.fxRoundCard(p, 'DOA JOMBLO', 'LANGSUNG DIKABULIN', '#6a3fb5', Math.min(40, f - 952)));
  if (f < 952) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
