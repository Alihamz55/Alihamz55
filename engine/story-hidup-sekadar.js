// "Hidup Sekadar Hidup" -- naskah pengguna (versi Asep). Depan rumah No.17 (x=240) saat senja. GAYA BARU.
// Kostum baru: asepSenja, ibuKuning, darmanKaosAbu. Properti: fxDompet, fxHPSaldo, fxKoran.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { VIS } from './visemes.js';
export const TOTAL = 1386;
const LINES = [["A", 15, 145], ["I", 150, 184], ["A", 195, 380], ["D", 386, 515], ["A", 526, 736], ["A", 749, 918], ["A", 930, 1183], ["A", 1198, 1315], ["I", 1318, 1353]];
const TXT = ["KADANG ASEP MIKIR... SEBENARNYA HIDUP TEH BUAT APA, SIH?", "BUAT BAYAR LISTRIK, SEP!", "BANGUN PAGI KERJA, PULANG CAPEK, TIDUR... BESOK DIULANG LAGI.", "SEP, YANG KERJA ITU BAPAK. KAMU KEBAGIAN TIDURNYA AJA.",
  "KATANYA HIDUP HARUS PUNYA TUJUAN. ASEP JUGA PUNYA TUJUAN HIDUP. PENGEN SUKSES, PENGEN KAYA, PENGEN BAHAGIA...", "TAPI TIAP BUKA DOMPET... TUJUAN HIDUP ASEP BERUBAH. YANG PENTING BESOK MASIH BISA MAKAN.",
  "ORANG BILANG JANGAN CUMA SEKADAR HIDUP, HARUS PUNYA MAKNA! MAKANYA ASEP LAGI MENCARI MAKNA HIDUP... DIMULAI DARI MENCARI MAKNA SALDO REKENING.", "TERNYATA HIDUP ITU SEDERHANA. YANG BIKIN RUMIT... CICILAN.", "SAMA HARGA CABAI!"];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const v = VIS[f] || 'X'; return v !== 'X' ? expr + '_v' + v : expr; };
const DOMP = 765, SALDO = 1130;
const SH = [['asep', 0, 149], ['ibu', 150, 194], ['asep2', 195, 385], ['darman', 386, 525], ['asep3', 526, 748], ['dompet', 749, 929], ['asep4', 930, 1197], ['asepEnd', 1198, 1317], ['ibu2', 1318, 1385]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: 'senja' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = {
  senja: { az: 250, el: 16, sky: '#ffc89a', ground: '#5a4040', hemi: 1.2, sun: '#ffb070', sunI: 2.6, fog: '#e8a080', fogNear: 40, fogFar: 200, skyTop: '#5a4a9a', skyHor: '#ffa860', sat: 1.15, vig: 0.3, gain: '#ffe8d0', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240;
const AS = [HR - 0.3, 0.53, 1.6], DM = [HR + 0.9, 0.53, 1.45], IB = [HR - 1.3, 0.53, 1.25];
const K = (pos, look, fov) => ({ pos, look, fov });
const cu = (P, h, d, side, fov = 40) => [{ f: 0, ...K([P[0] + side, h, P[2] + d], [P[0], h + 0.1, P[2]], fov) }, { f: 150, ...K([P[0] + side * 0.85, h, P[2] + d * 0.86], [P[0], h + 0.11, P[2]], fov) }];
const CAMS = {
  asep: [{ f: 0, ...K([AS[0] - 0.4, 1.7, AS[2] + 2.9], [AS[0], 2.15, AS[2]], 42) }, { f: 149, ...K([AS[0] - 0.3, 1.8, AS[2] + 2.3], [AS[0], 2.15, AS[2]], 40) }],
  ibu: cu(IB, 2.0, 2.2, -0.3, 40), asep2: cu(AS, 2.0, 2.3, 0.3, 40), darman: cu(DM, 2.0, 2.4, 0.3, 40), asep3: cu(AS, 2.0, 2.4, -0.3, 42),
  dompet: cu(AS, 2.0, 2.2, 0.25, 40), asep4: cu(AS, 2.0, 2.3, -0.25, 40), asepEnd: cu(AS, 2.05, 2.0, 0.2, 38), ibu2: cu(IB, 2.0, 2.1, -0.3, 40),
};
const KICKS = [{ f: 150, a: 0.06 }, { f: 470, a: 0.08 }, { f: 790, a: 0.06 }, { f: 1150, a: 0.09 }, { f: 1318, a: 0.07 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f < 6 ? 0.9 * (1 - f / 6) : f >= S.a && f < S.a + 2 && S.a > 0 ? 0.06 : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 7 }; };
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a, w) => q(a * Math.sin(f * w), 1);
const asPose = (f) => {
  if (f < 150) return { L: 'hang', R: 'cheek', expr: 'neutral', facing: 0, look: 0, headTilt: 6, blink: f > 20 && f < 60 ? 0 : undefined };
  if (f < 195) return { L: 'hang', R: 'cheek', expr: 'shock', facing: -1, look: -1, blink: 0 };
  if (f < 386) return { L: 'hang', R: 'temple', expr: 'nervous', facing: 0, look: 0 };
  if (f < 526) return { L: 'hang', R: 'hang', expr: 'shock', facing: 1, look: 1 };
  if (f < 749) return { L: f < 640 ? 'hip' : 'up', R: f < 640 ? 'cheek' : 'up', expr: f < 640 ? 'smug' : 'grin', facing: 0, look: 0, bob: f >= 640 ? q(0.01 * Math.abs(Math.sin(f * 0.3)), 3) : 0 };
  if (f < 930) return { L: 'wallet', R: 'wallet', expr: f < DOMP + 15 ? 'smile' : 'cry', facing: 0, look: 0 };
  if (f < SALDO) return { L: 'hip', R: 'point', expr: 'grin', facing: 0, look: 0 };
  if (f < 1198) return { L: 'hang', R: 'phone', expr: 'cry', facing: 0, look: 0 };
  return { L: 'hang', R: 'cheek', expr: f < 1285 ? 'smile_closed' : 'cry', facing: 0, look: 0, headTilt: -4 };
};
const ibPose = (f) => ({ L: 'hip', R: 'point', expr: 'squint', facing: 1, look: 1, shake: (f >= 150 && f < 180) || (f >= 1318 && f < 1345) });
const dmPose = (f) => ({ L: 'text', R: 'text', expr: f < 470 ? 'squint' : 'smug', facing: -1, look: -1 });
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const o0 = pose(f); if (!o0) return; const { shake, ...o } = o0, i = idle(f, seed), tl = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q((o.bob || 0) + i.bob, 3), tilt: q((o.tilt || 0) + i.tilt + tl, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  add('asepSenja', asPose, 5, AS, 'A'); add('ibuKuning', ibPose, 3, IB, 'I'); add('darmanKaosAbu', dmPose, 8, DM, 'D');
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
export const fxAt = (f, T) => [FXC('koran', (p) => T.fxKoran(p), [DM[0] + 0.02, 1.05, DM[2] + 0.3], 0.62, { order: 9 })];

// ---- overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - M.smooth(ramp(f, b_ - n, b_)), 2);
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
const JUDGE = [[470, 525, 'SKAKMAT', '#ff5d8f'], [790, 860, 'KOSONG', '#c8c0b0'], [1150, 1197, 'MAKNA: KURANG', '#ffe14a']];
const BANNERS = [[0, 100, 'HIDUP SEKADAR HIDUP', '#e8742c'], [650, 684, 'SUKSES', '#2f8a4a'], [685, 711, 'KAYA', '#e2b04a'], [712, 748, 'BAHAGIA', '#ff5d8f']];
const SPK = { A: ['#5dff8a', 'ASEP'], D: ['#ffb07a', 'PAK DARMAN'], I: ['#c8a0ff', 'IBU'] };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => {
  if (f >= DOMP && f < 920) put(g, 540, 960, 1.15, Math.min(pop(f, DOMP, 6), out_(f, 920)), (p) => T.fxDompet(p, clamp((f - DOMP) / 12), Math.max(0, f - DOMP - 14)));
  if (f >= SALDO && f < 1197) put(g, 540, 1000, 1.08, Math.min(pop(f, SALDO, 6), out_(f, 1197)), (p) => T.fxHPSaldo(p, f - SALDO));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 360, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 300, 1.15, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  if (f >= 1356) put(g, 540, 300, 1.2, pop(f, 1356), (p) => T.fxRoundCard(p, 'SEKADAR HIDUP', 'YANG PENTING BESOK MAKAN', '#e8742c', Math.min(40, f - 1356)));
  if (f < 1356) for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; if (f < a - 1 || f > b + 10) continue;
    const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = 0;
    W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot) idx = k; acc += wt[k]; });
    const s0 = Math.floor(idx / 3) * 3, chunk = W.slice(s0, s0 + 3), [hue, nm] = SPK[who], st0 = a + (b - a) * W.slice(0, s0).reduce((x, w) => x + w.replace(/[^A-Z0-9]/g, '').length + 2, 0) / tot;
    put(g, 540, 1430, 1.75, f < 1 ? 1 : pop(f, st0 - 1, 4), (p) => T.fxBigCap(p, chunk, idx - s0, hue, nm, 1)); break; }
};
