// "Wakil Presiden Rumah Tangga" -- Asep mimpi dilantik jadi Wapres Republik Sukamaju (fiktif); presidennya Ibu. Panggung (x=0) + kamar (x=-40). GAYA BARU.
// Kostum baru: asepWapres, asepPiyama, ibuPresiden, darmanAjudan. Properti: fxSpandukTeks, fxPodium, fxGalon, fxCentong.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 986;
const LINES = [["M", 15, 202], ["A", 211, 293], ["A", 302, 357], ["I", 364, 405], ["A", 414, 489], ["I", 495, 619], ["D", 631, 715], ["I", 742, 825], ["A", 835, 953]];
const TXT = ["SAUDARA ASEP... RESMI DILANTIK MENJADI WAKIL PRESIDEN REPUBLIK SUKAMAJU!", "TERIMA KASIH, RAKYAT! ASEP NGGAK NYANGKA!", "TUGAS PERTAMA ASEP APA, BU PRESIDEN?", "ANGKAT JEMURAN. MAU HUJAN.",
  "WAKIL PRESIDEN MASA ANGKAT JEMURAN?!", "WAKIL ITU TUGASNYA MEWAKILI. WAKILIN IBU KE WARUNG... NGUTANG.", "SIAP, PAK WAPRES. GALONNYA JUGA HABIS.", "SEP! BANGUN! WAKILIN IBU KE ARISAN!", "...TERNYATA ASEP UDAH JADI WAKIL DARI LAHIR."];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const WAKE = 721;
const SH = [['wide', 0, 210], ['asep', 211, 301], ['asep2', 302, 363], ['ibu', 364, 413], ['asep3', 414, 494], ['ibu2', 495, 630], ['darman', 631, 720], ['kamar', 721, 834], ['asepCU', 835, 985]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a >= WAKE ? 'room' : 'stage' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  stage: { az: 30, el: 55, sky: '#f4e8ff', ground: '#3a2a40', hemi: 1.35, sun: '#fff0d8', sunI: 2.6, fog: '#1a1426', fogNear: 40, fogFar: 200, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.15, vig: 0.28, gain: '#fff4e4', shadowExt: 9 },
  room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.2, sun: '#ffe8cc', sunI: 2.4, fog: '#141c3a', fogNear: 40, fogFar: 260, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.08, vig: 0.32, gain: '#fff2e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40;
const AS = [0, 0.5, 0.2], IB = [1.35, 0.5, 0.05], DM = [-1.35, 0.5, 0.05];
const ASK = [RX - 0.1, 0.5, 0.45], IBK = [RX + 0.85, 0.5, 0.3];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const CAMS = {
  wide: [{ f: 0, ...K([0, 1.85, 6.0], [0, 2.0, 0], 46) }, { f: 210, ...K([0, 1.9, 4.6], [0, 2.0, 0], 44) }],
  asep: cu(AS, 2.05, 2.3, -0.3, 40), asep2: cu(AS, 2.05, 2.1, 0.3, 40), ibu: cu(IB, 2.0, 2.3, 0.3, 40), asep3: cu(AS, 2.05, 2.2, -0.3, 40), ibu2: cu(IB, 2.0, 2.1, 0.3, 40), darman: cu(DM, 2.0, 2.3, -0.3, 40),
  kamar: cu([ASK[0] + 0.35, 0.5, 0.4], 1.95, 3.4, 0.0, 46), asepCU: cu(ASK, 2.0, 2.2, 0.25, 38),
};
const KICKS = [{ f: 180, a: 0.05 }, { f: 364, a: 0.06 }, { f: 414, a: 0.05 }, { f: 600, a: 0.09 }, { f: 742, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= WAKE && f < WAKE + 6 ? 0.8 * (1 - (f - WAKE) / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['wide', 'kamar'].includes(id) ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 211) return { L: 'hang', R: f < 180 ? 'hang' : 'wave', wv: f * 0.4, expr: f < 180 ? 'smile_closed' : 'grin', facing: 0, look: 0 };
  if (f < 302) return { L: 'hang', R: 'wave', wv: f * 0.4, expr: 'cry', facing: 0, look: 0 };
  if (f < 364) return { L: 'hang', R: 'salute', expr: 'smug', facing: 1, look: 1 };
  if (f < 414) return { L: 'hang', R: 'salute', expr: 'shock', facing: 1, look: 1, blink: 0 };
  if (f < 495) return { L: 'up', R: 'up', expr: 'shock', facing: 1, look: 1, shake: 1 };
  return { L: 'hang', R: 'hang', expr: 'nervous', facing: 1, look: 1, sweat: 1 };
};
const ibPose = (f) => (f < 364 ? null : { L: 'hip', R: f >= 495 ? 'point' : 'hang', expr: f >= 495 ? 'smug' : 'squint', facing: -1, look: -1 });
const dmPose = (f) => (f < 600 ? null : { L: 'hang', R: 'salute', expr: f < 700 ? 'squint' : 'smile_closed', facing: 1, look: 1 });
const asKamar = (f) => ({ L: 'cross', R: 'cross', expr: f < 742 ? 'snore' : f < 835 ? 'shock' : 'cry', facing: 0, look: 0, blink: f < 742 ? 1 : undefined, tilt: f < 742 ? -8 : 0, headTilt: f < 742 ? -10 : -4 });
const ibKamar = (f) => ({ L: 'hip', R: 'point', expr: 'squint', facing: -1, look: -1, shake: f >= 742 && f < 800 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  if (f < WAKE) { add('asepWapres', asPose, 5, AS, 'A'); add('ibuPresiden', ibPose, 3, IB, 'I'); add('darmanAjudan', dmPose, 8, DM, 'D'); }
  else { add('asepPiyama', asKamar, 5, ASK, 'A'); add('ibuDaster', ibKamar, 3, IBK, 'I'); }
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  if (f < WAKE) {
    out.push(FXC('sp', (p) => T.fxSpandukTeks(p, 'PELANTIKAN WAKIL PRESIDEN', 'REPUBLIK SUKAMAJU'), [0, 1.75, -2.6], 1.35, { order: 1 }));
    out.push(FXC('pod', (p) => T.fxPodium(p, 'SUKAMAJU'), [AS[0], 0.5, AS[2] + 0.45], 1.05, { order: 9 }));
    if (f >= 364) out.push(FXC('cen', (p) => T.fxCentong(p), [IB[0] + 0.36, 1.15, IB[2] + 0.2], 0.42, { order: 9 }));
    if (f >= 600) out.push(FXC('gal', (p) => T.fxGalon(p), [DM[0] - 0.42, 0.5, DM[2] + 0.25], 0.75, { order: 9 }));
  } else { out.push(FXC('guling', (p) => T.fxKasur(p, 1), [ASK[0], 0.95, ASK[2] + 0.25], 0.5, { order: 9 }));
    if (f < 742) out.push(FXC('zz' + Math.floor(f / 3) % 20, (p) => T.fxZzz(p, Math.floor(f / 3)), [ASK[0] + 0.5, 2.3, ASK[2]], 0.5, { order: 9 })); }
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[364, 413, 'PRESIDEN: IBU', '#5dff8a'], [600, 660, 'NGUTANG', '#ffe14a']];
const BANNERS = [[0, 90, 'MIMPI ASEP SEMALAM...', '#6a3fb5']];
const SPK = { M: ['#ffd84a', 'MC'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  if (f >= 150 && f < 364) { const cols = ['#ff5d8f', '#ffd84a', '#5dff8a', '#5ab0ff', '#ffffff', '#ff9a3c'];
    for (let i = 0; i < 90; i++) { const x = (i * 137.5) % 1080 + 30 * Math.sin(f * 0.05 + i), y = ((f - 150) * (6 + (i % 5) * 1.5) + i * 97) % 2100 - 120;
      g.save(); g.translate(x, y); g.rotate(f * 0.1 + i); g.fillStyle = cols[i % 6]; g.fillRect(-10, -5, 20, 10); g.restore(); } }
  if (f >= WAKE && f < WAKE + 4) { g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(0, 0, 1080, 1920); }
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 955) put(g, 540, 300, 1.2, pop(f, 955), (p) => T.fxRoundCard(p, 'WAKIL SEUMUR HIDUP', 'REPUBLIK RUMAH TANGGA', '#d8322f', Math.min(40, f - 955)));
  if (f < 955) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
