// "Asep Ikut Kuis Satu Miliar" -- Pak Darman (host) + Asep (peserta) di panggung (x=0) jadi studio kuis; Ibu ditelepon di depan rumah (x=240).
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['D', 12, 157], ['A', 165, 237], ['D', 244, 474], ['A', 483, 563], ['I', 587, 667], ['A', 673, 716], ['I', 722, 769], ['A', 787, 850], ['D', 856, 915], ['A', 936, 992], ['D', 1000, 1033], ['A', 1039, 1083], ['D', 1119, 1249], ['A', 1257, 1352], ['D', 1359, 1458], ['A', 1473, 1552]];
const TXT = ['ASEP! INI PERTANYAAN TERAKHIR. HADIAHNYA... SATU MILIAR!', 'SIAP, PAK! ASEP UDAH LATIHAN TEBAK-TEBAKAN TIAP MALAM!', 'SATU TAMBAH SATU SAMA DENGAN... A, DUA. B, SEBELAS. C, JENDELA. D, TERGANTUNG.',
  'HMM... INI PASTI JEBAKAN. SAYA MAU TELEPON TEMAN!', 'HALO? SEP! JEMURAN UDAH DIANGKAT BELUM?! MAU HUJAN!', 'BU! SATU TAMBAH SATU BERAPA?!', 'POKOKNYA ANGKAT JEMURAN DULU!', 'YA UDAH... SAYA PAKAI LIMA PULUH LIMA PULUH!',
  'KOMPUTER... HAPUS DUA JAWABAN!', 'LHO?! KOK JAWABAN DUA YANG DIHAPUS?!', 'JAWABAN TERAKHIR, SEP?', 'C... JENDELA! KUNCI!', 'BENAR! SATU TAMBAH SATU, KALAU DITULIS NUMPUK... JADI JENDELA!', 'SATU MILIAR! ASEP KAYA RAYA!',
  'HADIAHNYA DICICIL SERIBU TAHUN YA, SEP. SEBULAN DELAPAN PULUH TIGA RIBU.', '...PAK, BOLEH TELEPON TEMAN LAGI?'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1589;
const OPT = { A: 315, B: 354, C: 397, D: 439 }, GONE = { A: 925, B: 940 }, LOCK = 1068, WIN = 1119;
const SH = [['wide', 0, 79], ['host', 80, 160], ['asep', 161, 240], ['host', 241, 314], ['board', 315, 482], ['asep', 483, 563], ['house', 564, 586], ['ibu', 587, 672], ['asepPh', 673, 721], ['ibu', 722, 786],
  ['asep', 787, 855], ['host', 856, 930], ['two', 931, 999], ['host', 1000, 1038], ['asep', 1039, 1095], ['two', 1096, 1145], ['board', 1146, 1256], ['asepJ', 1257, 1358], ['host', 1359, 1470], ['asepECU', 1471, 1588]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: id === 'house' || id === 'ibu' ? 'mendung' : 'studio' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = {
  studio: { az: 95, el: 55, sky: '#6a7ad8', ground: '#1a1440', hemi: 0.85, sun: '#e8f0ff', sunI: 3.1, fog: '#0a0c24', fogNear: 14, fogFar: 60, skyTop: '#04061a', skyHor: '#101640', sat: 1.18, vig: 0.42, gain: '#eef2ff', shadowExt: 7 },
  mendung: { az: 80, el: 42, sky: '#d0d4dc', ground: '#6a7060', hemi: 1.2, sun: '#eceef4', sunI: 1.6, fog: '#b8bcc8', fogNear: 40, fogFar: 200, skyTop: '#7d8696', skyHor: '#c4c8d0', sat: 0.98, vig: 0.22, shadowExt: 12 },
};
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240;
const DM = [-0.8, 0.5, 0.2], AS = [0.8, 0.5, 0.2], IB = [HR - 1.6, 0.5, 0.8], JM = [HR - 3.1, 0.5, -0.7];
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  wide: [{ f: 0, ...K([0, 2.4, 7.4], [0, 2.0, 0], 46) }, { f: 79, ...K([0, 2.3, 6.4], [0, 1.95, 0], 46) }],
  host: [{ f: 0, ...K([DM[0] + 0.45, 1.55, DM[2] + 2.5], [DM[0], 1.98, DM[2]], 40) }, { f: 110, ...K([DM[0] + 0.38, 1.58, DM[2] + 2.2], [DM[0], 2.0, DM[2]], 40) }],
  asep: [{ f: 0, ...K([AS[0] - 0.45, 1.55, AS[2] + 2.5], [AS[0], 1.98, AS[2]], 40) }, { f: 100, ...K([AS[0] - 0.38, 1.58, AS[2] + 2.2], [AS[0], 2.0, AS[2]], 40) }],
  asepPh: [{ f: 0, ...K([AS[0] - 0.3, 1.85, AS[2] + 2.0], [AS[0], 2.05, AS[2]], 38) }, { f: 50, ...K([AS[0] - 0.25, 1.86, AS[2] + 1.8], [AS[0], 2.06, AS[2]], 38) }],
  asepJ: [{ f: 0, ...K([AS[0] - 0.4, 1.3, AS[2] + 3.0], [AS[0], 2.05, AS[2]], 44) }, { f: 100, ...K([AS[0] - 0.3, 1.32, AS[2] + 2.6], [AS[0], 2.08, AS[2]], 44) }],
  asepECU: [{ f: 0, ...K([AS[0] - 0.2, 1.9, AS[2] + 1.85], [AS[0], 2.08, AS[2]], 36) }, { f: 117, ...K([AS[0] - 0.15, 1.9, AS[2] + 1.55], [AS[0], 2.1, AS[2]], 36) }],
  board: [{ f: 0, ...K([0, 2.55, 4.6], [0, 1.85, 0], 46) }, { f: 170, ...K([0, 2.5, 4.3], [0, 1.85, 0], 46) }],
  two: [{ f: 0, ...K([0, 2.5, 4.4], [0, 1.85, 0], 46) }, { f: 70, ...K([0, 2.45, 3.9], [0, 1.88, 0], 46) }],
  house: [{ f: 0, ...K([HR - 2.0, 2.4, 6.5], [HR - 2.2, 1.9, 0], 46) }, { f: 22, ...K([HR - 2.0, 2.35, 6.0], [HR - 2.2, 1.9, 0], 46) }],
  ibu: [{ f: 0, ...K([IB[0] + 0.5, 1.6, IB[2] + 2.5], [IB[0], 1.98, IB[2]], 40) }, { f: 85, ...K([IB[0] + 0.42, 1.62, IB[2] + 2.2], [IB[0], 2.0, IB[2]], 40) }],
};
const KICKS = [{ f: 120, a: 0.05 }, { f: 548, a: 0.04 }, { f: 936, a: 0.05 }, { f: LOCK, a: 0.04 }, { f: WIN, a: 0.07 }, { f: 1257, a: 0.05 }, { f: 1420, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 });
  c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; if (f >= WIN && f < WIN + 5) c.flash = 0.45 * (1 - (f - WIN) / 5); return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
const CINE = ['host', 'asep', 'asepPh', 'asepECU', 'ibu'];
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: CINE.includes(S.id) ? 8 : 3 }; };
export const worldAt = (f) => ({ curtain: 1, night: true, noBig: true, laugh: f >= WIN && f < 1260 ? 1 : f >= 1257 && f < 1300 ? 0.6 : 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const D1 = { facing: 1, look: 1 }, A1 = { facing: -1, look: -1 };
const dmPose = (f) => {
  if (f < 160) return { L: 'up', R: 'hip', expr: f > 110 ? 'laugh' : 'grin', ...D1 };
  if (f < 244) return { L: 'hip', R: 'hang', expr: 'smile', ...D1 };
  if (f < 483) return { L: 'hang', R: 'point', expr: 'stern', ...D1 };
  if (f < 856) return { L: 'cross', R: 'cross', expr: 'squint', ...D1 };
  if (f < 936) return { L: 'up', R: 'hang', expr: 'stern', ...D1 };
  if (f < 1039) return { L: 'hang', R: 'point', expr: f < 1000 ? 'squint' : 'stern', ...D1 };
  if (f < WIN) return { L: 'cross', R: 'cross', expr: 'stern', ...D1, shake: f > 1090 };
  if (f < 1257) return { L: 'up', R: 'up', expr: 'laugh', ...D1 };
  if (f < 1473) return { L: 'hip', R: 'shrug', expr: 'smile_closed', ...D1 };
  return { L: 'hip', R: 'hang', expr: 'smile', ...D1 };
};
const asPose = (f) => {
  if (f < 244) return { L: 'hip', R: 'thumb', expr: 'grin', ...A1 };
  if (f < 483) return { L: 'hang', R: 'temple', expr: f > 400 ? 'nervous' : 'squint', ...A1 };
  if (f < 564) return { L: 'temple', R: f > 530 ? 'up' : 'hang', expr: f > 530 ? 'grin' : 'squint', ...A1 };
  if (f < 787) return { L: 'hang', R: 'phone', expr: f > 740 ? 'shock' : 'nervous', ...A1, facing: 0, look: 0, shake: f > 740 && f < 787 };
  if (f < 936) return { L: 'up', R: 'hang', expr: 'grin', ...A1 };
  if (f < 1000) return { L: 'up', R: 'up', expr: 'shock', ...A1, shake: 1, blink: 0 };
  if (f < 1039) return { L: 'temple', R: 'hang', expr: 'nervous', ...A1 };
  if (f < WIN) return { L: 'pray', R: 'pray', expr: f < 1084 ? 'grin' : 'nervous', ...A1, shake: f > 1084 };
  if (f < 1359) { const j = f >= 1257 ? Math.abs(Math.sin(f * 0.35)) : Math.abs(Math.sin(f * 0.3)) * 0.5; return { L: 'up', R: 'up', expr: f >= 1257 ? 'laugh' : 'shock', ...A1, facing: 0, look: 0, hop: j }; }
  if (f < 1473) return { L: 'hang', R: 'hang', expr: f > 1400 ? 'sad' : 'grin', ...A1 };
  return { L: 'hang', R: 'phone', expr: 'sad', facing: 0, look: 0 };
};
const ibPose = (f) => { if (f < 722) return { L: 'hip', R: 'phone', expr: 'stern', facing: 0, look: 0 };
  return { L: f > 769 ? 'point' : 'hip', R: 'phone', expr: 'stern', facing: -1, look: -1, shake: f < 769 }; };
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk) => { const { shake, hop = 0, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob + hop * 0.06, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: 0.5 })); };
  const S = shotAt(f);
  if (S.light === 'mendung') add('ibuDaster', ibPose, 3, IB, 'I');
  else { add('darman', dmPose, 2, DM, 'D'); add('sarung', asPose, 5, AS, 'A'); }
  return out;
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
export const fxAt = (f, T) => {
  const out = []; const S = shotAt(f);
  if (S.light === 'mendung') out.push(FXC('jem' + (f % 24), (p) => T.fxJemuran(p, 0, f), JM, 1.9, { order: 1 }));
  if (f >= WIN && f < 1360 && S.light === 'studio') out.push(FXC('spk' + (f % 6 < 3 ? 0 : 1), (p) => T.fxSparkle(p, f), [0, 3.2, -0.5], 1.2, { order: 1 }));
  return out;
};

// ---- screen-space overlay ----
const JUDGE = [[118, 160, 'SATU MILIAR!', '#ffe14a'], [936, 975, 'LHO?!', '#ff5d8f'], [WIN, WIN + 34, 'BENAR!', '#5ad16a'], [1257, 1300, 'KAYA RAYA!', '#ffe14a']];
const BANNERS = [[520, 563, 'BANTUAN: TELEPON TEMAN', '#3a5bd9', '#ffffff', false], [760, 786, 'TUT... TUT... TUT...', '#555a66', '#ffffff', false], [815, 855, 'BANTUAN: 50:50', '#8b5cf6', '#ffffff', false],
  [1385, 1470, 'DICICIL 1000 TAHUN', '#e8344a', '#ffffff', false], [1430, 1470, 'Rp83 RIBU/BULAN', '#e8742c', '#ffffff', false]];
const SPK = { A: ['#2f9a5a', 'ASEP'], I: ['#d9478a', 'IBU'], D: ['#b07a2a', 'PAK DARMAN'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  let s0 = 0, s1 = W.length; if (W.length > 8) { const i0 = Math.max(0, idx); s0 = Math.floor(i0 / 7) * 7; s1 = Math.min(W.length, s0 + 7); }
  const Wv = W.slice(s0, s1), rows = []; let cur = [], len = 0; Wv.forEach((w) => { if (cur.length && len + w.length > 17) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  return { who, a: s0 ? st[s0] : a, rows, idx: idx - s0 }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
// quiz board (own design): question bar + 4 answer pills
const pill = (g, x, y, w, h, fill, stroke) => { g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x - w / 2 + 26, y - h / 2); g.lineTo(x + w / 2 - 26, y - h / 2); g.lineTo(x + w / 2, y); g.lineTo(x + w / 2 - 26, y + h / 2); g.lineTo(x - w / 2 + 26, y + h / 2); g.closePath();
  g.fillStyle = fill; g.fill(); g.lineWidth = 6; g.strokeStyle = stroke; g.stroke(); };
const board = (g, f, cy) => {
  g.save(); g.font = '700 46px Fredoka, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.strokeStyle = '#8fb4ff'; g.lineWidth = 4; g.beginPath(); g.moveTo(40, cy - 150); g.lineTo(1040, cy - 150); g.moveTo(40, cy + 15); g.lineTo(1040, cy + 15); g.moveTo(40, cy + 140); g.lineTo(1040, cy + 140); g.stroke();
  pill(g, 540, cy - 150, 940, 130, '#0b1a5a', '#cfe0ff'); g.fillStyle = '#ffffff'; g.font = '700 72px Fredoka, sans-serif'; g.fillText('1 + 1 = ?', 540, cy - 146);
  const opts = [['A', 'DUA', 295, cy + 15], ['B', 'SEBELAS', 785, cy + 15], ['C', 'JENDELA', 295, cy + 150], ['D', 'TERGANTUNG', 785, cy + 150]];
  for (const [L, t, x, y] of opts) { const k = pop(f, OPT[L], 6); if (k <= 0.01) continue; const gone = GONE[L] && f >= GONE[L];
    let fill = '#0b1a5a', st = '#cfe0ff', tc = '#ffffff';
    if (gone) { fill = 'rgba(11,26,90,0.55)'; st = '#5a6a9a'; }
    if (L === 'C' && f >= LOCK) { fill = '#ff9a1f'; st = '#fff2c0'; tc = '#1a1220'; }
    if (L === 'C' && f >= WIN) { const bl = f < WIN + 30 && (f % 6) < 3; fill = bl ? '#ff9a1f' : '#2fbf5a'; st = '#eaffea'; tc = bl ? '#1a1220' : '#ffffff'; }
    g.save(); g.translate(x, y); g.scale(k, k); g.translate(-x, -y); pill(g, x, y, 470, 118, fill, st);
    if (!gone) { g.fillStyle = L === 'C' && f >= LOCK ? tc : '#ffb23a'; g.font = '700 50px Fredoka, sans-serif'; g.textAlign = 'left'; g.fillText(L + ':', x - 195, y + 3); g.fillStyle = tc; g.font = (t.length > 8 ? '700 44px' : '700 52px') + ' Fredoka, sans-serif'; g.fillText(t, x - 135, y + 3); g.textAlign = 'center'; }
    g.restore(); }
  g.restore(); };
// "1 + 1" stacks into a window
const jendela = (g, f) => { const t = ramp(f, 1150, 1235), cx = 540, cy = 640, s = 1;
  g.save(); g.lineCap = 'round'; const a1 = smooth(ramp(f, 1180, 1205)), a2 = smooth(ramp(f, 1205, 1225));
  // panes fill
  if (a2 > 0) { g.globalAlpha = a2; g.fillStyle = '#9fd8ff'; g.fillRect(cx - 230, cy - 230, 460, 460); g.globalAlpha = 1; }
  g.strokeStyle = '#ffffff'; g.lineWidth = 34;
  const ox = lerp(170, 230, a1); // the two "1"s slide out to become the sides
  g.beginPath(); g.moveTo(cx - ox, cy - 230 * lerp(0.6, 1, a1)); g.lineTo(cx - ox, cy + 230 * lerp(0.6, 1, a1)); g.moveTo(cx + ox, cy - 230 * lerp(0.6, 1, a1)); g.lineTo(cx + ox, cy + 230 * lerp(0.6, 1, a1)); g.stroke();
  const pl = lerp(80, 230, a1); g.beginPath(); g.moveTo(cx - pl, cy); g.lineTo(cx + pl, cy); g.moveTo(cx, cy - pl); g.lineTo(cx, cy + pl); g.stroke();
  if (a2 > 0) { g.globalAlpha = a2; g.beginPath(); g.moveTo(cx - 230, cy - 230); g.lineTo(cx + 230, cy - 230); g.moveTo(cx - 230, cy + 230); g.lineTo(cx + 230, cy + 230); g.stroke(); g.globalAlpha = 1; }
  g.strokeStyle = '#1a1220'; g.lineWidth = 6; g.globalCompositeOperation = 'destination-over'; g.globalCompositeOperation = 'source-over';
  if (f < 1180) { g.fillStyle = '#ffffff'; g.font = '700 70px Fredoka, sans-serif'; g.textAlign = 'center'; g.fillText('1 + 1', cx, cy - 300); }
  if (f >= 1211) { const k = pop(f, 1211, 6); g.save(); g.translate(cx, cy + 330); g.scale(k, k); g.fillStyle = '#ffe14a'; g.strokeStyle = '#1a1220'; g.lineWidth = 12; g.font = '700 96px Fredoka, sans-serif'; g.textAlign = 'center'; g.strokeText('= JENDELA!', 0, 0); g.fillText('= JENDELA!', 0, 0); g.restore(); }
  g.restore(); };
export const overlayAt = (f, g, T) => {
  const S = shotAt(f);
  if ((S.id === 'board' && f < 1146) || S.id === 'two') board(g, f, 1130);
  if (S.id === 'board' && f >= 1146) { g.save(); g.fillStyle = 'rgba(6,10,40,0.55)'; g.fillRect(0, 0, 1080, 1920); g.restore(); jendela(g, f); }
  if (f < 76) put(g, 540, 560, 1.75, f < 1 ? 1 : out_(f, 76), (p) => T.fxRoundCard(p, 'KUIS SATU MILIAR', 'MALAM KOMEDI', '#3a5bd9', Math.min(40, f + 6)));
  if (f >= 1532) put(g, 540, 600, 1.6, pop(f, 1532), (p) => T.fxRoundCard(p, 'KAMU JAWAB APA?', 'A, B, C, ATAU D? TULIS DI KOMENTAR!', '#8b5cf6', Math.min(40, f - 1532)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 300, 1.25, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue, fg, dot] of BANNERS) put(g, 540, a === 1430 ? 380 : 250, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, fg, dot, f));
  const C_ = telop(f); if (C_ && f < 1532) { const [hue, nm] = SPK[C_.who]; put(g, 540, (S.id === 'board' && f < 1146) || S.id === 'two' ? 1700 : 1420, 1.45, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
