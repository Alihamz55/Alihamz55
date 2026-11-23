// "Ibu Kecanduan Sinetron" -- parodi sinetron fiktif "Terikat Cicilan". Ruang tengah malam (kamar x=-40), sudut pandang TV. GAYA BARU.
// Kostum baru: ibuSinetron, asepKaosMi, darmanSarungBiru. Properti: fxTV, fxSofa, fxRemote.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1147;
const LINES = [["T", 15, 84], ["A", 93, 161], ["I", 191, 366], ["A", 374, 448], ["D", 456, 547], ["I", 553, 693], ["D", 701, 788], ["I", 812, 841], ["A", 859, 944], ["I", 951, 1114]];
const TXT = ["MAS... KAMU TEGA!", "BU, ASEP LAPAR.", "KAMU... LAPAR? SELAMA INI... KAMU MENYEMBUNYIKAN RASA LAPAR DARI IBU?!", "BU, ASEP CUMA MINTA NASI...", "BU, BAPAK MAU NONTON BERITA. SININ REMOTENYA.",
  "TIDAK, PAK! REMOTE INI... ADALAH JANJI IBU!", "JANJI APA? TV-NYA AJA MASIH NYICIL.", "...BERSAMBUNG.", "BU... TERUS MAKAN MALAMNYA?", "MAKAN MALAM... TAYANG BESOK. JAM TUJUH."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const OFF = 800;
const SH = [['tv', 0, 88], ['wide', 89, 161], ['z1', 162, 176], ['z2', 177, 190], ['z3', 191, 366], ['asep', 367, 452], ['darman', 453, 550], ['ibu2', 551, 697], ['darman2', 698, 799], ['gelap', 800, 858], ['asep2', 859, 950], ['ibu3', 951, 1146]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'tv' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  tv: { az: 20, el: 40, sky: '#b8c8f0', ground: '#4a3a48', hemi: 1.25, sun: '#d8e4ff', sunI: 2.3, fog: '#141c3a', fogNear: 40, fogFar: 260, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.1, vig: 0.34, gain: '#f0f2ff', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [RX - 0.85, 0.5, -0.4], IB = [RX + 0.15, 0.5, -0.55], DM = [RX + 1.15, 0.5, -0.4], TVP = [RX + 0.3, 0.5, 4.6];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const still = (P, h, d, side, fov) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }];
const CAMS = {
  tv: [{ f: 0, ...K([TVP[0], 1.6, TVP[2] + 3.9], [TVP[0], 1.55, TVP[2]], 40) }, { f: 88, ...K([TVP[0], 1.6, TVP[2] + 3.4], [TVP[0], 1.6, TVP[2]], 40) }],
  wide: [{ f: 0, ...K([RX + 0.15, 1.9, 4.3], [RX + 0.15, 1.7, -0.5], 50) }, { f: 72, ...K([RX + 0.15, 1.9, 4.0], [RX + 0.15, 1.7, -0.5], 50) }],
  z1: still(IB, 2.0, 2.9, 0, 42), z2: still(IB, 2.05, 2.0, 0, 42), z3: cu(IB, 2.1, 1.55, 0.1, 42),
  asep: cu(AS, 2.0, 2.3, -0.3, 40), darman: cu(DM, 2.0, 2.4, 0.3, 40), ibu2: cu(IB, 2.0, 2.2, 0.2, 40), darman2: cu(DM, 2.0, 2.2, 0.25, 40),
  gelap: still([RX + 0.15, 0.5, -0.5], 1.9, 4.2, 0, 50), asep2: cu(AS, 2.0, 2.3, -0.25, 40), ibu3: cu(IB, 2.0, 2.3, 0.2, 40),
};
const KICKS = [{ f: 162, a: 0.05 }, { f: 177, a: 0.06 }, { f: 191, a: 0.08 }, { f: 600, a: 0.07 }, { f: 770, a: 0.07 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : ['z1', 'z2', 'z3'].includes(S.id) && f < S.a + 4 ? 0.5 * (1 - (f - S.a) / 4) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['wide', 'gelap', 'tv'].includes(id) ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const inS = (f, ...ids) => ids.includes(shotAt(f).id);
const asPose = (f) => { if (f < OFF) return { L: 'hang', R: f >= 367 && f < 453 ? 'belly' : 'hang', expr: f < 162 ? 'neutral' : f < 367 ? 'shock' : 'nervous', facing: f >= 162 && f < 367 ? 1 : 0, look: f >= 162 && f < 367 ? 1 : 0 };
  return { L: 'belly', R: 'belly', expr: 'cry', facing: 0, look: 0, headTilt: -5 }; };
const ibPose = (f) => { const hug = f >= 551;
  if (f < 162) return { L: 'hang', R: 'hang', expr: 'cry', facing: 0, look: 0 };
  if (f < 551) return { L: 'cheek', R: f >= 191 ? 'cheek' : 'hang', expr: f < 191 ? 'shock' : 'cry', facing: 0, look: 0, shake: f >= 191 && f < 366, blink: f < 191 ? 0 : undefined };
  if (f < OFF) return { L: 'cross', R: 'cross', expr: f < 700 ? 'cry' : 'squint', facing: f < 700 ? 0 : 1, look: f < 700 ? 0 : 1, shake: f >= 590 && f < 640 };
  return { L: 'cross', R: 'cross', expr: f < 951 ? 'neutral' : 'smug', facing: 0, look: 0, blink: f >= OFF && f < 858 ? 0 : undefined }; };
const dmPose = (f) => { if (f < 453) return { L: 'hang', R: 'hang', expr: 'squint', facing: -1, look: -1 };
  if (f < 698) return { L: 'hip', R: 'reach', expr: 'squint', facing: -1, look: -1 };
  if (f < OFF) return { L: 'hip', R: 'point', expr: 'smug', facing: -1, look: -1 };
  return { L: 'hang', R: 'hang', expr: 'shock', facing: 0, look: 0 }; };
export const actorsAt = (f, T) => {
  const out = [];
  if (inS(f, 'tv')) return out;
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepKaosMi', asPose, 5, AS, 'A'); add('ibuSinetron', ibPose, 3, IB, 'I'); add('darmanSarungBiru', dmPose, 8, DM, 'D');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  out.push(FXC('tv' + (f < OFF ? 'd' + Math.floor(f / 2) % 60 : 'off'), (p) => T.fxTVSinetron(p, f < OFF ? 'drama' : 'off', Math.floor(f / 2)), TVP, 1.15, { order: 3 }));
  out.push(FXC('sofa', (p) => T.fxSofa(p), [RX + 0.15, 0.5, -1.25], 1.55, { order: 1 }));
  if (f >= 551) out.push(FXC('rem', (p) => T.fxRemote(p), [IB[0] + 0.02, 1.2, IB[2] + 0.3], 0.33, { order: 9 }));
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[162, 176, 'JENG!', '#ff5d8f'], [177, 190, 'JENG!!', '#ff5d8f'], [191, 215, 'JENG!!!', '#ff5d8f'], [598, 650, 'JANJI IBU', '#c8a0ff'], [770, 799, 'NYICIL', '#ffe14a']];
const BANNERS = [[0, 80, 'TERIKAT CICILAN • JAM 7 MALAM', '#6a2a5a']];
const SPK = { T: ['#ff8ac0', 'TV'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  if (f >= OFF) { g.fillStyle = f < 858 ? 'rgba(6,8,20,0.9)' : 'rgba(6,8,24,0.5)'; g.fillRect(0, 0, 1080, 1920); }
  else if (!inS(f, 'tv')) { g.fillStyle = `rgba(90,120,255,${0.04 + 0.03 * Math.sin(f * 0.9) * Math.sin(f * 0.23)})`; g.fillRect(0, 0, 1080, 1920); }
  if (f >= 812 && f < 858) put(g, 540, 820, 1.4, pop(f, 812), (p) => T.fxRoundCard(p, 'BERSAMBUNG', 'TERIKAT CICILAN', '#6a2a5a', Math.min(40, f - 812)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1118) put(g, 540, 300, 1.2, pop(f, 1118), (p) => T.fxRoundCard(p, 'BESOK JAM 7', 'EPISODE: MAKAN MALAM', '#6a2a5a', Math.min(40, f - 1118)));
  if (f < 1118) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
