// "Solo Gitar di Atas Genteng" -- Asep rocker solo gitar di genteng saat hujan (audio gitar dari pengguna). Rumah No.17 (x=240) malam hujan.
// Kostum baru: asepRocker, darmanHujan, ibuEmber. Properti: fxGitar (play/hug/over), fxPayung, fxEmber, fxPisang. Hujan + kilat di overlay.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1034;
const LINES = [["A", 15, 100], ["D", 415, 493], ["A", 502, 580], ["I", 730, 843], ["A", 855, 968]];
const TXT = ["INI SAATNYA... SOLO GITAR LEGENDARIS!", "SEP! TURUN! NTAR KESAMBER PETIR!", "GITARIS SEJATI NGGAK TAKUT PETIR, PAK!", "SEP! MUMPUNG DI ATAS... SEKALIAN BENERIN GENTENG BOCOR!", "SOLO GITAR LEGENDARIS... JADI SOLO TUKANG GENTENG."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
export const PETIR = 650;
export const FLASH = [5, 200, 330, PETIR];
const SH = [['low', 0, 100], ['solo1', 101, 250], ['solo2', 251, 414], ['darman', 415, 501], ['asepTalk', 502, 599], ['wide', 600, 729], ['ibu', 730, 854], ['asepEnd', 855, 1033]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'storm' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = { storm: { az: 40, el: 50, sky: '#8a98c8', ground: '#2a2a38', hemi: 1.05, sun: '#c8d4ff', sunI: 2.0, fog: '#141a30', fogNear: 30, fogFar: 170,
  skyTop: '#06081a', skyHor: '#1a2240', sat: 1.0, vig: 0.42, gain: '#dce4ff', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240;
const AS = [HR, 4.78, -2.25], DM = [HR + 0.9, 0.53, 1.45], IB = [HR - 0.9, 0.53, 1.5], PS = [HR + 3.0, 0.53, 0.4];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const HEAD = AS[1] + 1.55;
const CAMS = {
  low: [{ f: 0, ...K([HR + 0.3, 1.3, 3.6], [HR, HEAD, AS[2]], 50) }, { f: 100, ...K([HR + 0.2, 1.5, 3.0], [HR, HEAD, AS[2]], 48) }],
  solo1: [{ f: 0, ...K([HR - 2.2, HEAD - 0.4, 0.3], [HR, HEAD - 0.2, AS[2]], 40) }, { f: 149, ...K([HR - 0.7, HEAD - 0.5, 0.7], [HR, HEAD - 0.2, AS[2]], 40) }],
  solo2: [{ f: 0, ...K([HR - 2.0, 2.4, 2.2], [HR, HEAD, AS[2]], 44) }, { f: 163, ...K([HR - 0.9, 2.1, 2.6], [HR, HEAD, AS[2]], 42) }],
  darman: cu(DM, 2.0, 2.3, 0.3, 40),
  asepTalk: [{ f: 0, ...K([HR + 0.3, HEAD - 0.3, 0.4], [HR, HEAD - 0.1, AS[2]], 38) }, { f: 97, ...K([HR + 0.2, HEAD - 0.3, 0.1], [HR, HEAD - 0.1, AS[2]], 38) }],
  wide: [{ f: 0, ...K([HR + 1.6, 2.3, 7.0], [HR + 1.3, 3.6, -1.0], 54) }, { f: 129, ...K([HR + 1.6, 2.3, 6.6], [HR + 1.3, 3.6, -1.0], 54) }],
  ibu: cu(IB, 2.0, 2.3, -0.3, 40),
  asepEnd: [{ f: 0, ...K([HR - 0.3, HEAD - 0.2, 0.6], [HR, HEAD, AS[2]], 40) }, { f: 178, ...K([HR - 0.2, HEAD - 0.2, 0.0], [HR, HEAD, AS[2]], 38) }],
};
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: [{ f: PETIR, a: 0.08 }, { f: 730, a: 0.04 }], creep: 0 }); c.flash = 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['wide', 'low', 'solo2'].includes(id) ? 3 : 6 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const playing = (f) => (f >= 95 && f < PETIR);
const asPose = (f) => {
  if (f < 95) return { L: 'point', R: 'up', expr: 'smug', facing: 0, look: 0 };
  if (f < PETIR) { const hb = f < 415 || f >= 580 ? q(8 * Math.sin(f * 0.35), 1) : 0;
    return { L: 'point', R: 'belly', expr: f >= 502 && f < 580 ? 'smug' : (f % 90 < 45 ? 'smile_closed' : 'grin'), facing: 0, look: 0, headTilt: hb, bob: q(0.012 * Math.abs(Math.sin(f * 0.35)), 3) }; }
  if (f < 855) return { L: 'cross', R: 'cross', expr: f < 730 ? 'shock' : 'cry', facing: 0, look: 0, shake: f < 720, blink: 0 };
  return { L: 'up', R: 'up', expr: 'cry', facing: 0, look: 0, headTilt: -4 };
};
const dmPose = (f) => ({ L: 'hang', R: 'reach', expr: f >= 415 && f < 500 ? 'squint' : f >= PETIR && f < 730 ? 'shock' : 'nervous', facing: 0, look: 0, shake: f >= 415 && f < 450 });
const ibPose = (f) => (f < 700 ? null : { L: 'shield', R: 'point', expr: 'squint', facing: 0, look: 0, shake: f >= 730 && f < 760 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: pos[1] })); };
  add('asepRocker', asPose, 5, AS, 'A'); add('darmanHujan', dmPose, 8, DM, 'D'); add('ibuEmber', ibPose, 3, IB, 'I');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  const gm = f < PETIR ? 'play' : f < 855 ? 'hug' : 'over';
  out.push(FXC('gt' + gm, (p) => T.fxGitar(p, gm, f), [AS[0], AS[1], AS[2] + 0.18], 1.0, { order: 9 }));
  out.push(FXC('py', (p) => T.fxPayung(p), [DM[0] + 0.25, DM[1] + 0.5, DM[2] + 0.1], 1.0, { order: 9 }));
  if (f >= 700) out.push(FXC('em', (p) => T.fxEmber(p), [IB[0], 0.95, IB[2] + 0.3], 0.5, { order: 9 }));
  const burnt = f >= PETIR + 3 ? 1 : 0; out.push(FXC('ps' + burnt + (burnt ? Math.floor(f / 3) % 30 : Math.floor(f / 6) % 20), (p) => T.fxPisang(p, burnt, f), PS, 1.5, { order: 2 }));
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[PETIR + 4, 728, 'DUARR!', '#ffe14a'], [915, 968, 'TUKANG GENTENG', '#ff5d8f']];
const BANNERS = [[110, 260, 'SOLO GITAR LEGENDARIS', '#d8322f']];
const SPK = { A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  // hujan + kilat
  { let fl = 0; for (const a0 of FLASH) if (f >= a0 && f < a0 + 10) fl = Math.max(fl, (a0 === PETIR ? 0.95 : 0.55) * (1 - (f - a0) / 10));
    g.save(); g.strokeStyle = 'rgba(200,215,255,0.38)'; g.lineWidth = 3; g.lineCap = 'round';
    for (let i = 0; i < 150; i++) { const x = (i * 97.3 + f * 9) % 1180 - 50, y = ((i * 211.7) + f * 46) % 2050 - 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 10, y + 48); g.stroke(); }
    g.restore();
    if (f >= PETIR && f < PETIR + 12 && shotAt(f).id === 'wide') { g.save(); g.strokeStyle = '#ffffff'; g.lineWidth = 12; g.shadowColor = '#bfe0ff'; g.shadowBlur = 30; g.beginPath(); let x = 960, y = 0; g.moveTo(x, y);
      for (let k = 0; k < 9; k++) { x += (k % 2 ? 55 : -35); y += 115; g.lineTo(x, y); } g.stroke(); g.restore(); }
    if (fl > 0.01) { g.fillStyle = `rgba(235,240,255,${fl})`; g.fillRect(0, 0, 1080, 1920); } }
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 975) put(g, 540, 300, 1.2, pop(f, 975), (p) => T.fxRoundCard(p, 'SOLO GITAR', 'SOLO TUKANG GENTENG', '#d8322f', Math.min(40, f - 975)));
  if (f < 975) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
