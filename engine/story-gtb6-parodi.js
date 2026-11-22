// "Asep Masuk Dunia GTB 6" -- parodi game open world (tanpa merek). Depan rumah No.17 (x=240) + kamar (x=-40). GAYA BARU.
// Kostum baru: asepOpenWorld, darmanPolo, ibuSapu. Mang Ujang: ujangGorengan.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1234;
const LINES = [['A', 18, 134], ['A', 145, 227], ['D', 233, 302], ['A', 306, 384], ['I', 399, 488], ['A', 492, 612], ['I', 616, 714], ['A', 732, 823], ['J', 827, 904], ['D', 943, 1103], ['A', 1111, 1189]];
const TXT = ['ASEP MASUK KE DUNIA GTB 6! ASEP JADI KARAKTER UTAMA!', 'GAMPANG! KARAKTER UTAMA MAH BEBAS NGAPAIN AJA!', 'SEP! ITU MOTOR BAPAK!', 'PINJEM, PAK! INI DUNIA OPEN WORLD!', 'SEP! BELUM NYAPU, UDAH KABUR-KABURAN!',
  'TENANG... TINGGAL MASUKIN CHEAT! NYAWA TAK TERBATAS!', 'CHEAT DARI IBU: PIRING KOTOR TAK TERBATAS!', 'MANG! GORENGAN DUA RIBU! MISI SELESAI!', 'UDAH NAIK, SEP. SEKARANG LIMA RIBU.', 'SEP, BANGUN. KAMU NGIGO NYETIR MOTOR PAKAI GULING.', 'PAK... GRAFIKNYA REALISTIS PISAN.'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const WAKE = 943, GAGAL = 905;
const SH = [['wide', 0, 144], ['asep', 145, 232], ['darman', 233, 305], ['ride', 306, 398], ['ibu', 399, 491], ['asep2', 492, 615], ['ibu', 616, 731], ['gerobak', 732, 826], ['ujang', 827, 942], ['kamar', 943, 1110], ['asepCU', 1111, 1233]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a >= WAKE ? 'room' : 'day' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  day: { az: 60, el: 58, sky: '#e8f2ff', ground: '#9aa4ae', hemi: 1.3, sun: '#fff4e0', sunI: 2.5, fog: '#dfe8f2', fogNear: 40, fogFar: 200, skyTop: '#6aa8f0', skyHor: '#e8f2ff', sat: 1.15, vig: 0.22, shadowExt: 10 },
  room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.2, sun: '#ffe8cc', sunI: 2.4, fog: '#141c3a', fogNear: 40, fogFar: 260, skyTop: '#8ab8e8', skyHor: '#e8f2ff', sat: 1.08, vig: 0.32, gain: '#fff2e4', shadowExt: 9 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240, RX = -40;
const AS = [HR - 0.3, 0.53, 1.6], DM = [HR + 0.7, 0.53, 1.5], IB = [HR - 0.4, 0.53, 1.65], GR = [HR + 2.9, 0.53, 1.4], UJ = [HR + 3.5, 0.53, 1.3];
const ASK = [RX - 0.1, 0.5, 0.45], DMK = [RX + 0.85, 0.5, 0.3];
const rideX = (f) => f < 306 ? 0 : f < 398 ? lerp(0, 1.8, M.smooth(ramp(f, 315, 395))) : 1.8;
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 38, dx = 0) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0] + dx, h + 0.12, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.85], [P[0] + dx, h + 0.13, P[2]], fov) }];
const CAMS = {
  wide: [{ f: 0, ...K([HR - 0.3, 1.9, 5.0], [HR - 0.3, 2.0, 1.4], 44) }, { f: 144, ...K([HR - 0.3, 1.95, 4.4], [HR - 0.3, 2.05, 1.4], 42) }],
  asep: cu(AS, 2.0, 2.4, -0.3, 40), asep2: cu([AS[0] + 1.8, 0.5, AS[2]], 2.0, 2.4, -0.3, 40), darman: cu(DM, 2.0, 2.5, 0.35, 40), ibu: cu([IB[0] + 1.6, 0.5, IB[2]], 2.0, 2.6, 0.3, 42),
  ride: [{ f: 0, ...K([HR + 0.2, 1.8, 5.0], [HR + 0.2, 1.8, 1.5], 46) }, { f: 92, ...K([HR + 1.6, 1.8, 4.6], [HR + 1.6, 1.85, 1.5], 46) }],
  gerobak: cu([(GR[0] + UJ[0]) / 2 - 0.4, 0.5, 1.5], 1.95, 3.0, -0.2, 44), ujang: cu(UJ, 2.0, 2.4, 0.3, 40),
  kamar: cu([(ASK[0] + DMK[0]) / 2, 0.5, 0.4], 1.95, 3.0, 0.0, 44), asepCU: cu(ASK, 2.0, 2.2, 0.25, 38),
};
const KICKS = [{ f: 18, a: 0.04 }, { f: 240, a: 0.05 }, { f: 399, a: 0.05 }, { f: 650, a: 0.09 }, { f: GAGAL, a: 0.06 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= WAKE && f < WAKE + 6 ? 0.7 * (1 - (f - WAKE) / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), id = shotAt(f).id; return { focus: dist(C.pos, C.look), cinf: ['wide', 'ride', 'gerobak', 'kamar'].includes(id) ? 3 : 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  const dx = f < 492 ? rideX(f) * (f >= 306 ? 1 : 0) : f < 732 ? 1.8 : 2.6;
  if (f < 145) return { L: 'shrug', R: 'shrug', expr: 'grin', facing: 0, look: 0, dx };
  if (f < 306) return { L: 'hip', R: f < 233 ? 'thumb' : 'hip', expr: f < 233 ? 'smug' : 'nervous', facing: 1, look: 1, dx };
  if (f < 399) return { L: 'reach', R: 'reach', expr: 'grin', facing: 1, look: 1, dx, bob: q(0.01 * Math.sin(f * 0.8), 3) };
  if (f < 492) return { L: 'hang', R: 'hang', expr: 'shock', facing: -1, look: -1, dx, blink: 0, shake: 1 };
  if (f < 616) return { L: 'pray', R: 'up', expr: 'smug', facing: 0, look: 0, dx };
  if (f < 732) return { L: 'up', R: 'up', expr: 'shock', facing: -1, look: -1, dx, blink: 0 };
  if (f < 827) return { L: 'hang', R: 'point', expr: 'grin', facing: 1, look: 1, dx, sweat: 1 };
  return { L: 'hang', R: 'hang', expr: f >= GAGAL ? 'cry' : 'shock', facing: 1, look: 1, dx };
};
const dmPose = (f) => f < 233 || f > 398 ? (f < 233 ? { L: 'hip', R: 'hang', expr: 'smile', facing: -1, look: -1 } : null) : { L: 'up', R: 'point', expr: 'shock', facing: 1, look: 1, shake: f < 300 };
const ibPose = (f) => { if (f < 392 || f >= 732) return null; const dx = 1.6;
  return { L: f >= 616 ? 'shield' : 'hip', R: f >= 616 ? 'shield' : 'reach', expr: f >= 616 ? 'smug' : 'squint', facing: 1, look: 1, dx, shake: f < 470 }; };
const ujPose = (f) => (f < 732 || f >= WAKE ? null : { L: 'hang', R: f >= 827 ? 'shrug' : 'hang', expr: 'smile_closed', facing: -1, look: -1 });
const asKamar = (f) => ({ L: 'cross', R: 'cross', expr: f < 1000 ? 'snore' : f < 1111 ? 'shock' : 'smile_closed', facing: 0, look: 0, blink: f < 990 ? 1 : undefined, tilt: f < 990 ? -8 : 0, headTilt: f < 990 ? -10 : 0 });
const dmKamar = () => ({ L: 'hip', R: 'point', expr: 'squint', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, dx, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, [pos[0] + (dx || 0), pos[1], pos[2]], { ground: 0.5 })); };
  if (f < WAKE) { add('asepOpenWorld', asPose, 5, AS, 'A'); add('darmanPolo', dmPose, 8, DM, 'D'); add('ibuSapu', ibPose, 3, IB, 'I'); add('ujangGorengan', ujPose, 6, UJ, 'J'); }
  else { add('asepOpenWorld', asKamar, 5, ASK, 'A'); add('darmanPolo', dmKamar, 8, DMK, 'D'); }
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => {
  const out = [];
  if (f < WAKE) {
    const sx = f < 306 ? 0 : rideX(f); if (f < 492) out.push(FXC('sk', (p) => T.fxSkuter(p, '#2f7ac8'), [DM[0] - 0.55 + (f >= 306 ? sx - 0.2 : 0), 0.53, DM[2] + 0.35], 1.1, { order: 8 }));
    if (f >= 732) out.push(FXC('gr', (p) => T.fxGerobak(p, 'GORENGAN'), GR, 1.6, { order: 3 }));
    if (f >= 392 && f < 732) out.push(FXC('sapu', (p) => T.fxSapu(p), [IB[0] + 1.6 + 0.32, 0.6, IB[2] + 0.2], 0.95, { order: 9 }));
    if (f >= 616 && f < 732) out.push(FXC('pir', (p) => T.fxPiring(p, 9), [IB[0] + 1.6 + 0.0, 1.05, IB[2] + 0.35], 0.75, { order: 9 }));
  } else out.push(FXC('guling', (p) => T.fxKasur(p, 1), [ASK[0], 0.95, ASK[2] + 0.25], 0.5, { order: 9 }));
  return out;
};

// ---- overlay: HUD game, misi, caption ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[650, 731, 'CHEAT IBU!', '#ff5d8f'], [860, 904, 'LIMA RIBU?!', '#ffe14a']];
const BANNERS = [[145, 300, 'MISI: BELI GORENGAN', '#2f8a4a'], [560, 615, 'CHEAT: NYAWA TAK TERBATAS', '#3a5bd9']];
const SPK = { A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'], J: ['#ffb03a', 'MANG UJANG'] };
const stars = (f) => f < 240 ? 0 : f < 399 ? 1 : f < 700 ? 3 : 5;
const money = (f) => f < 790 ? 'Rp2.000' : 'Rp0';
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  if (f >= 6 && f < GAGAL) T.fxHUD({ g }, stars(f), money(f), f < 650 ? 1 : 0.25, f);
  if (f >= GAGAL && f < WAKE) put(g, 540, 700, 1.6, pop(f, GAGAL, 6), (p) => T.fxGagal(p, f));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1195) put(g, 540, 300, 1.2, pop(f, 1195), (p) => T.fxRoundCard(p, 'GTB 6', 'LEVEL TERSULIT: IBU', '#6a3fb5', Math.min(40, f - 1195)));
  if (f < 1195) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
