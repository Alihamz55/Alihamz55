// "Oyen Lepas di Pesawat" -- kucing oren kabur dari kandang di kabin, jadi kapten. Kabin (x=660) + kokpit (x=680). GAYA BARU.
// Kostum baru: asepTerbang, ibuMudik, darmanMudik, pramugari, pilot. Kucing: fxOyen.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1261;
const LINES = [['P', 15, 173], ['A', 182, 243], ['I', 249, 339], ['D', 345, 522], ['A', 534, 644], ['L', 662, 845], ['A', 854, 894], ['L', 900, 985], ['A', 1006, 1053], ['I', 1062, 1183], ['A', 1200, 1225]];
const TXT = ['MOHON MAAF, PENERBANGAN DITUNDA. ADA PENUMPANG TANPA TIKET... BERKELIARAN DI KABIN.', 'WADUH! ITU SI OYEN! KANDANGNYA KEBUKA!', 'ADUH, MAAF YA BU, PAK! KUCINGNYA BARU PERTAMA KALI NAIK PESAWAT!',
  'BIARIN, SEP. KUCING OREN MAH EMANG NGGAK BISA DIATUR. KAYAK KAMU.', 'OYEN! SINI! LHO... KOK MASUK RUANG PILOT?!', 'PARA PENUMPANG YANG TERHORMAT... KAPTEN ANDA HARI INI: OYEN. MEONG.', 'PAK PILOT! KOK NYERAH?!',
  'DIA UDAH PEGANG SETIR, MAS. SAYA NGGAK BERANI.', 'OYEN! ITU KURSI ASEP!', 'UDAH, SEP. KAMU DUDUK DI KANDANG AJA. MUAT KOK.', '...MEONG.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const SH = [['pa', 0, 109], ['paw', 110, 181], ['asep', 182, 248], ['ibu', 249, 344], ['darman', 345, 533], ['asep2', 534, 653], ['kokpit', 654, 853], ['asep3', 854, 899], ['pilot', 900, 999], ['kursi', 1000, 1061], ['ibu2', 1062, 1190], ['kandang', 1191, 1260]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'cabin' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  cabin: { az: 40, el: 62, sky: '#f4f6fa', ground: '#6a7080', hemi: 1.45, sun: '#fff4e0', sunI: 2.2, fog: '#e8eef5', fogNear: 40, fogFar: 200, skyTop: '#6aa8f0', skyHor: '#e8f2ff', sat: 1.12, vig: 0.24, gain: '#fff6ea', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const CX = 660, KX = 680;
const PR = [CX, 0.5, -2.0], AS1 = [CX, 0.5, -1.6], IB1 = [CX, 0.5, -0.6], DM1 = [CX, 0.5, -1.0], AS2 = [CX, 0.5, -2.6];
const AS4 = [CX - 0.1, 0.5, 0.05], AS5 = [CX - 0.1, 0.5, 0.35], IB2 = [CX + 0.15, 0.5, -0.4];
const PL = [KX + 0.55, 0.5, -0.3], ASK = [KX - 0.6, 0.5, 0.1], OYK = [KX - 0.64, 1.23, -1.3], SEAT = [CX - 1.4, 1.03, 0.9];
const K = (pos, look, fov) => ({ pos, look, fov });
const cuF = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] - d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] - d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const CAMS = {
  pa: cuF(PR, 2.0, 2.25, 0.3, 44), paw: [{ f: 0, ...K([CX + 0.5, 2.2, -3.9], [CX + 0.1, 1.9, 0.5], 48) }, { f: 71, ...K([CX + 0.4, 2.15, -3.5], [CX, 1.9, 0.5], 46) }], asep: cuF(AS1, 2.0, 2.3, -0.3, 42), ibu: cuF(IB1, 2.0, 2.35, 0.35, 42), darman: cuF(DM1, 2.0, 2.4, -0.3, 42),
  asep2: [{ f: 0, ...K([CX + 0.35, 2.05, -0.3], [CX, 1.85, -4.3], 44) }, { f: 119, ...K([CX + 0.3, 2.0, -0.9], [CX, 1.85, -4.3], 44) }],
  kokpit: [{ f: 0, ...K([KX, 2.0, 3.4], [KX, 1.85, -1.0], 46) }, { f: 199, ...K([KX - 0.15, 1.95, 2.8], [KX - 0.2, 1.85, -1.0], 44) }],
  asep3: cu(ASK, 2.0, 2.3, -0.3, 40), pilot: cu(PL, 2.0, 2.5, 0.25, 42),
  kursi: [{ f: 0, ...K([CX - 0.7, 2.9, -0.7], [CX - 1.0, 1.45, 0.75], 46) }, { f: 61, ...K([CX - 0.75, 2.85, -0.55], [CX - 1.05, 1.45, 0.75], 45) }],
  ibu2: cuF(IB2, 2.0, 2.35, 0.3, 42), kandang: cuF(AS4, 1.9, 2.7, 0.0, 44),
};
const KICKS = [{ f: 182, a: 0.04 }, { f: 488, a: 0.08 }, { f: 805, a: 0.08 }, { f: 1006, a: 0.04 }, { f: 1150, a: 0.08 }, { f: 1200, a: 0.05 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['kokpit', 'asep2', 'kursi', 'paw'].includes(id) ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const inS = (f, ...ids) => ids.includes(shotAt(f).id);
const asPose = (f) => {
  if (inS(f, 'asep')) return { pos: AS1, L: 'up', R: 'point', expr: 'shock', facing: 1, look: 1, blink: 0, shake: 1 };
  if (inS(f, 'asep2')) return { pos: [AS2[0], 0.5, AS2[2] - 0.5 * M.smooth(ramp(f, 534, 600))], L: 'reach', R: 'reach', expr: f < 590 ? 'grin' : 'shock', facing: 0, look: 0 };
    if (inS(f, 'asep3')) return { pos: ASK, L: 'up', R: 'up', expr: 'shock', facing: 1, look: 1, shake: 1 };
  if (inS(f, 'kursi')) return { pos: AS5, L: 'hip', R: 'point', expr: 'squint', facing: 1, look: 1, shake: f < 1050 };
  if (inS(f, 'ibu2')) return { pos: [AS4[0] - 0.35, 0.5, AS4[2] + 0.4], L: 'hip', R: 'hang', expr: f < 1150 ? 'squint' : 'shock', facing: 1, look: 1 };
  if (inS(f, 'kandang')) return { pos: AS4, L: 'hang', R: 'hang', expr: 'cry', facing: 0, look: 0, headTilt: -6 };
  return null;
};
const prPose = (f) => (f < 110 ? { pos: PR, L: 'hang', R: 'phone', expr: f < 120 ? 'smile' : 'nervous', facing: 0, look: f < 120 ? 0 : 1, sweat: f >= 120 ? 1 : 0 } : null);
const ibPose = (f) => { if (inS(f, 'ibu')) return { pos: IB1, L: 'pray', R: 'pray', expr: 'nervous', facing: -1, look: -1, sweat: 1, headTilt: q(6 * Math.sin(f * 0.25), 1) };
  if (inS(f, 'ibu2')) return { pos: IB2, L: 'hip', R: 'point', expr: 'smug', facing: -1, look: -1 }; return null; };
const dmPose = (f) => (inS(f, 'darman') ? { pos: DM1, L: 'cross', R: 'cross', expr: f < 480 ? 'smile_closed' : 'smug', facing: 0, look: f < 480 ? 0 : 1 } : null);
const plPose = (f) => { if (inS(f, 'kokpit')) return { pos: PL, L: 'hang', R: 'mic', expr: 'nervous', facing: -1, look: -1, sweat: 1 };
  if (inS(f, 'pilot')) return { pos: PL, L: 'shield', R: 'shield', expr: 'nervous', facing: -1, look: -1, sweat: 1, shake: 1 }; return null; };
const PAX = [['rina', CX + 0.75, 0.8], ['darmanSantai', CX - 0.75, 1.85], ['nengDress', CX + 1.4, 1.85], ['teman', CX - 0.75, -0.25], ['darmanKoko', CX + 1.4, -1.3], ['ibuKardigan', CX - 1.4, -1.3]];
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, spk) => { const o0 = pose(f); if (!o0) return; const { shake, pos, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepTerbang', asPose, 5, 'A'); add('pramugari', prPose, 2, 'P'); add('ibuMudik', ibPose, 3, 'I'); add('darmanMudik', dmPose, 8, 'D'); add('pilot', plPose, 7, 'L');
  if (!inS(f, 'kokpit', 'asep3', 'pilot')) PAX.forEach(([who, x, z], k) => { const sh = (f >= 110 && f < 250) || inS(f, 'kursi');
    out.push(R(T, who, { seed: 11 + k, blink: blinkAt(f, 11 + k), L: 'hang', R: 'hang', expr: sh ? 'shock' : 'squint', facing: 0, look: x > CX ? 1 : -1, bob: 0, tilt: 0, headTilt: 0 }, [x, -0.05, z + 0.12], { s: 0.82, blob: false })); });
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = []; const O = (pose, pos, s, dir = 1) => out.push(FXC('oy' + pose + dir + (pose === 'run' ? f % 40 : Math.floor(f / 3) % 40), (p) => T.fxOyen(p, pose, pose === 'run' ? f : Math.floor(f / 3), dir), pos, s, { order: 8 }));
  if (f >= 110 && f < 182) O('run', [lerp(CX + 1.8, CX - 1.8, ramp(f, 112, 178)), 1.95, -0.25 + 0.3 - 0.14], 0.6);
  if (f >= 182 && f < 249) O('run', [lerp(CX + 1.0, CX - 1.2, ramp(f, 195, 240)), 0.5, 0.3], 0.55);
  if (inS(f, 'darman')) O('smug', [CX + 0.72, 1.95, -0.09], 0.5);
  if (inS(f, 'asep2') && f < 610) O('run', [lerp(CX + 0.5, CX, ramp(f, 560, 608)), 0.5, -4.1], 0.55, -1);
  if (inS(f, 'kokpit', 'asep3', 'pilot')) { out.push(FXC('kok', (p) => T.fxKokpit(p), [KX, 0.5, -1.6], 1.9, { order: 1 })); O('cap', OYK, 0.7); }
  if (inS(f, 'kursi', 'ibu2')) O('smug', SEAT, 0.65);
  if (inS(f, 'kandang')) { O('smug', SEAT, 0.55); out.push(FXC('kdg', (p) => T.fxKandang(p), [AS4[0], 0.5, AS4[2] - 0.2], 1.4, { order: 9 })); }
  return out;
};

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[480, 533, 'KAYAK KAMU', '#ff5d8f'], [800, 853, 'KAPTEN OYEN', '#ffe14a'], [1140, 1190, 'MUAT KOK', '#5dff8a']];
const BANNERS = [[10, 120, 'MALAM AIR: DITUNDA', '#1d3a6a'], [1000, 1060, 'KURSI 17A', '#e8742c']];
const SPK = { P: ['#7ac8ff', 'PRAMUGARI'], A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'], L: ['#ffd84a', 'PILOT'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1228) put(g, 540, 300, 1.2, pop(f, 1228), (p) => T.fxRoundCard(p, 'MALAM AIR', 'KAPTEN BARU: OYEN', '#e8742c', Math.min(40, f - 1228)));
  if (f < 1228) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
