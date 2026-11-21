// "Dad Frank vs Gen Z Slang #1: No Cap" (versi Amerika). Babak 1 siang depan rumah (x=240), babak 2 ruang tengah malam (x=-40).
// Kostum baru: codyCowboy, frankLawn/frankLawnBare (topi dilepas), lindaRobe.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['F', 12, 120], ['C', 125, 206], ['F', 212, 321], ['C', 326, 471], ['F', 476, 578], ['C', 584, 634], ['F', 661, 765], ['C', 771, 807], ['F', 812, 895], ['C', 901, 923], ['F', 928, 1002],
  ['C', 1007, 1043], ['F', 1048, 1142], ['L', 1155, 1324], ['F', 1330, 1390], ['C', 1401, 1453], ['F', 1458, 1520]];
const TXT = ['CODY! THE NEIGHBOR SAID MY LAWN IS "MID." SHOULD I CALL A LAWYER?', 'NO, DAD! "MID" JUST MEANS... AVERAGE.', 'AVERAGE?! THIRTY YEARS OF FERTILIZER, AND I\'M AVERAGE?',
  'RELAX. GOOD FOOD? BUSSIN. COOL GUY? GOT RIZZ. TOTALLY TRUE? NO CAP.', 'BUSSIN... RIZZ... NO CAP. LIKE THIS?', 'NO! KEEP THE CAP ON, DAD!',
  'CODY... I USED ALL YOUR WORDS AT THE HOA MEETING.', 'AND? WERE THEY IMPRESSED?', 'MRS. JOHNSON BROUGHT COOKIES. I SAID: BUSSIN!', 'NICE!', 'THEN I TOLD HER... "YOU GOT RIZZ."', 'DAD... NO.',
  'SHE SAID, "ARE YOU SERIOUS, FRANK?" I SAID: NO CAP!', 'FRANK! THE HOA GROUP CHAT SAYS YOU FLIRTED WITH MRS. JOHNSON... AND STARTED TAKING OFF YOUR CLOTHES?!', 'IT WAS ONE HAT, LINDA!',
  'IT\'S GIVING... COUCH TONIGHT.', 'COUCH? ...IS THAT BUSSIN?'];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 1556;
const ACT2 = 635;
const SH = [['wide', 0, 124], ['cody', 125, 211], ['frankCU', 212, 325], ['codyCU', 326, 475], ['frank', 476, 583], ['two', 584, ACT2 - 1],
  ['room', ACT2, 770], ['cody2', 771, 811], ['frank2', 812, 900], ['cody2', 901, 927], ['frank2', 928, 1006], ['cody2CU', 1007, 1047], ['frank2CU', 1048, 1150],
  ['linda', 1151, 1329], ['frankECU', 1330, 1400], ['codyCam', 1401, 1457], ['frankEnd', 1458, 1555]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a < ACT2 ? 'day' : 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
const ROOM = { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.15, sun: '#ffe8cc', sunI: 2.3, fog: '#141c3a', fogNear: 40, fogFar: 260, skyTop: '#060a24', skyHor: '#22305e', sat: 1.08, vig: 0.32, gain: '#fff2e4', shadowExt: 9 };
const DAY = { az: 230, el: 42, sky: '#d8ecff', ground: '#7a8a4a', hemi: 1.15, sun: '#fff0d8', sunI: 2.4, fog: '#dfeeff', fogNear: 40, fogFar: 220, skyTop: '#4a86d8', skyHor: '#d6ecff', sat: 1.1, vig: 0.26, gain: '#fff6ea', shadowExt: 10 };
export const LIGHTS = { day: DAY, room: ROOM };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const HR = 240, RX = -40;
const FR = [HR - 0.75, 0.56, 1.1], CO = [HR + 0.55, 0.56, 1.1];
const FR2 = [RX + 0.2, 0.5, 0.5], CO2 = [RX + 1.35, 0.5, 0.4], LI0 = [RX - 2.6, 0.5, -0.2], LI1 = [RX - 0.95, 0.5, 0.55];
const LIN = 1151, LIN2 = 1178;
const liPos = (f) => f < LIN ? LI0 : f < LIN2 ? [lerp(LI0[0], LI1[0], smooth(ramp(f, LIN, LIN2))), 0.5, lerp(LI0[2], LI1[2], smooth(ramp(f, LIN, LIN2)))] : LI1;
const K = (pos, look, fov) => ({ pos, look, fov });
const near = (P, dx, h, dz, lh, fov, dx2 = dx * 0.85, dz2 = dz * 0.88, n = 120) => [{ f: 0, ...K([P[0] + dx, h, P[2] + dz], [P[0], lh, P[2]], fov) }, { f: n, ...K([P[0] + dx2, h + 0.03, P[2] + dz2], [P[0], lh + 0.02, P[2]], fov) }];
const CAMS = {
  wide: [{ f: 0, ...K([HR - 0.1, 2.0, 5.6], [HR - 0.1, 1.85, 0.6], 46) }, { f: 124, ...K([HR - 0.2, 1.95, 4.8], [HR - 0.2, 1.88, 0.7], 46) }],
  cody: near(CO, -0.45, 1.6, 2.5, 2.0, 40), codyCU: near(CO, -0.22, 1.85, 1.95, 2.03, 36),
  frank: near(FR, 0.45, 1.6, 2.5, 2.0, 40), frankCU: near(FR, 0.22, 1.85, 1.95, 2.03, 36),
  two: [{ f: 0, ...K([HR - 0.1, 1.9, 4.3], [HR - 0.1, 1.9, 0.9], 44) }, { f: 50, ...K([HR - 0.1, 1.9, 3.9], [HR - 0.1, 1.92, 0.9], 44) }],
  room: [{ f: 0, ...K([RX + 0.5, 2.1, 5.0], [RX + 0.5, 1.85, 0.2], 46) }, { f: 135, ...K([RX + 0.5, 2.05, 4.3], [RX + 0.5, 1.88, 0.3], 46) }],
  cody2: near(CO2, -0.45, 1.55, 2.5, 1.98, 40), cody2CU: near(CO2, -0.2, 1.86, 1.9, 2.02, 36),
  frank2: near(FR2, 0.45, 1.55, 2.5, 1.98, 40), frank2CU: near(FR2, 0.2, 1.86, 1.9, 2.02, 36), frankECU: near(FR2, 0.12, 1.9, 1.6, 2.04, 34),
  linda: [{ f: 0, ...K([RX - 0.6, 1.7, 3.6], [RX - 1.2, 1.95, 0.3], 42) }, { f: 178, ...K([LI1[0] + 0.15, 1.75, LI1[2] + 2.2], [LI1[0], 2.0, LI1[2]], 40) }],
  codyCam: [{ f: 0, ...K([CO2[0], 1.95, CO2[2] + 1.9], [CO2[0], 2.0, CO2[2]], 36) }, { f: 56, ...K([CO2[0], 1.96, CO2[2] + 1.65], [CO2[0], 2.02, CO2[2]], 36) }],
  frankEnd: near(FR2, 0.4, 1.55, 2.4, 1.98, 40, 0.35, 2.1, 97),
};
const KICKS = [{ f: 290, a: 0.06 }, { f: 545, a: 0.05 }, { f: 1110, a: 0.05 }, { f: 1160, a: 0.06 }, { f: 1270, a: 0.07 }, { f: 1332, a: 0.08 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: /CU|ECU|Cam|cody$|frank$|cody2$|frank2$|linda/.test(S.id) ? 8 : 3 }; };
export const worldAt = (f) => ({ curtain: 1, night: f >= ACT2, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const capOff = (f) => f >= ACT2 || (f >= 545 && f < 615);
const frPose = (f) => {
  if (f < 125) return { L: 'hip', R: 'point', expr: 'stern', facing: 1, look: 1, shake: f > 60 && f < 120 };
  if (f < 212) return { L: 'hang', R: 'hang', expr: 'squint', facing: 1, look: 1 };
  if (f < 326) return { L: 'up', R: 'up', expr: f > 280 ? 'shock' : 'stern', facing: 0, look: 0, shake: f > 280 };
  if (f < 476) return { L: 'cross', R: 'cross', expr: 'squint', facing: 1, look: 1 };
  if (f < 545) return { L: 'temple', R: 'hang', expr: 'nervous', facing: 0, look: 0 };
  if (f < 584) return { L: 'hang', R: 'up', expr: 'grin', facing: 0, look: 0 };
  if (f < ACT2) return { L: 'hang', R: f < 615 ? 'up' : 'hang', expr: 'nervous', facing: 1, look: 1 };
  if (f < 812) return { L: 'hang', R: 'hang', expr: 'sad', facing: 1, look: 1, headTilt: 6 };
  if (f < 1007) return { L: 'shrug', R: 'hang', expr: f > 960 ? 'grin' : 'neutral', facing: 1, look: 1 };
  if (f < 1048) return { L: 'temple', R: 'hang', expr: 'nervous', facing: 1, look: 1 };
  if (f < 1151) return { L: 'hip', R: f > 1100 ? 'up' : 'hang', expr: f > 1100 ? 'grin' : 'nervous', facing: 0, look: 0 };
  if (f < 1330) return { L: 'hang', R: 'hang', expr: 'shock', facing: -1, look: -1, blink: 0 };
  if (f < 1401) return { L: 'up', R: 'up', expr: 'shock', facing: -1, look: -1, shake: true };
  if (f < 1458) return { L: 'hang', R: 'hang', expr: 'sad', facing: -1, look: -1 };
  return { L: 'hang', R: 'hang', expr: f > 1495 ? 'smile_closed' : 'nervous', facing: 0, look: 0, headTilt: -6 };
};
const coPose = (f) => {
  if (f < 125) return { L: 'hip', R: 'hang', expr: 'squint', facing: -1, look: -1 };
  if (f < 212) return { L: 'shrug', R: 'shrug', expr: 'smile', facing: -1, look: -1 };
  if (f < 326) return { L: 'hang', R: 'hang', expr: 'nervous', facing: -1, look: -1 };
  if (f < 476) return { L: 'hip', R: 'point', expr: 'grin', facing: 0, look: 0 };
  if (f < 584) return { L: 'hip', R: 'hang', expr: 'smile', facing: -1, look: -1 };
  if (f < ACT2) return { L: 'up', R: 'point', expr: 'shock', facing: -1, look: -1 };
  if (f < 901) return { L: 'hip', R: 'hang', expr: 'grin', facing: -1, look: -1 };
  if (f < 1007) return { L: 'up', R: 'up', expr: 'laugh', facing: -1, look: -1 };
  if (f < 1151) return { L: 'temple', R: 'hang', expr: 'shock', facing: -1, look: -1 };
  if (f < 1401) return { L: 'hang', R: 'hang', expr: 'shock', facing: -1, look: -1, blink: 0 };
  if (f < 1458) return { L: 'hip', R: 'hang', expr: 'squint', facing: 0, look: 0 };
  return { L: 'cross', R: 'cross', expr: 'smile_closed', facing: -1, look: -1 };
};
const liPose = (f) => {
  if (f < LIN2) return { L: 'hang', R: 'phone', expr: 'stern', facing: 1, look: 1, walking: f >= LIN };
  if (f < 1330) return { L: 'hip', R: 'phone', expr: f > 1260 ? 'shock' : 'stern', facing: 1, look: 1, shake: f > 1260 };
  return { L: 'cross', R: 'cross', expr: 'stern', facing: 1, look: 1 };
};
export const actorsAt = (f, T) => {
  const out = [];
  const add = (who, pose, seed, pos, spk, g = 0.5) => { const { shake, walking, ...o } = pose(f), i = idle(f, seed), tilt = shake ? sway(f, 6, 0.6) : 0;
    if (walking) o.step = q((f / 12) % 1, 2);
    out.push(R(T, who, { seed, blink: o.blink ?? blinkAt(f, seed), ...o, expr: talk(f, spk, o.expr), bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, pos, { ground: g })); };
  const fr = capOff(f) ? 'frankLawnBare' : 'frankLawn';
  if (f < ACT2) { add(fr, frPose, 2, FR, 'F', 0.56); add('codyCowboy', coPose, 5, CO, 'C', 0.56); }
  else { add(fr, frPose, 2, FR2, 'F'); add('codyCowboy', coPose, 5, CO2, 'C'); if (f >= LIN - 2) add('lindaRobe', liPose, 3, liPos(f), 'L'); }
  return out;
};
export const fxAt = () => [];

// ---- screen-space overlay ----
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const JUDGE = [[290, 325, 'AVERAGE?!', '#ff5d8f'], [1110, 1150, 'NO CAP!', '#ffe14a'], [1334, 1395, 'ONE HAT!', '#ffe14a']];
const BANNERS = [[55, 124, 'MID = LAWYER?!', '#e8742c'], [365, 405, 'BUSSIN = GOOD FOOD', '#2f9a5a'], [406, 438, 'RIZZ = CHARM', '#d9478a'], [439, 475, 'NO CAP = TRUE', '#3a5bd9'],
  [550, 583, 'NO CAP = NO HAT?', '#e8344a'], [960, 1006, 'BUSSIN!', '#e8742c'], [1060, 1100, 'RIZZ?!', '#d9478a'], [1190, 1324, 'HOA GROUP CHAT: 99+', '#3a3f52'], [1410, 1457, 'COUCH TONIGHT', '#8b5cf6']];
const SPK = { C: ['#2f9a5a', 'CODY'], F: ['#b07a2a', 'DAD FRANK'], L: ['#d9478a', 'MOM LINDA'] };
const telop = (f) => { for (let n = LINES.length - 1; n >= 0; n--) { const [who, a, b] = LINES[n]; const nxt = n + 1 < LINES.length ? LINES[n + 1][1] - 1 : 99999;
  if (f < a - 1 || f > Math.min(b + 18, nxt)) continue;
  const W = TXT[n].split(' '), wt = W.map((w) => w.replace(/[^A-Z0-9]/g, '').length + 2), tot = wt.reduce((x, y) => x + y, 0);
  let acc = 0, idx = -1; const st = []; W.forEach((w, k) => { st.push(a + (b - a) * acc / tot); if (f >= st[k] && f <= b + 2) idx = k; acc += wt[k]; });
  const rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 20) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
  // long lines: show only the 3 rows around the active word
  let rs = rows; if (rows.length > 3) { let c = 0, ri = 0; rows.forEach((r, j) => { if (idx >= c && idx < c + r.length) ri = j; c += r.length; }); const s0 = Math.max(0, Math.min(ri - 1, rows.length - 3)); let off = 0; for (let j = 0; j < s0; j++) off += rows[j].length; rs = rows.slice(s0, s0 + 3); idx -= off; }
  return { who, a, rows: rs, idx }; } return null; };
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const popk = (f, a, b_) => (f < a || f >= b_ ? 0 : Math.min(pop(f, a), out_(f, b_)));
export const overlayAt = (f, g, T) => {
  if (f < 54) put(g, 540, 300, 1.2, f < 1 ? 1 : out_(f, 54), (p) => T.fxRoundCard(p, 'DAD FRANK VS GEN Z', 'SLANG #1', '#3a5bd9', Math.min(40, f + 6)));
  if (f >= ACT2 && f < 700) { g.save(); g.fillStyle = `rgba(6,8,24,${0.6 * out_(f, 700, 12)})`; g.fillRect(0, 0, 1080, 1920); g.restore();
    put(g, 540, 620, 1.2, Math.min(pop(f, ACT2), out_(f, 700)), (p) => T.fxRoundCard(p, 'THAT NIGHT...', 'AFTER THE HOA MEETING', '#3a3f52', Math.min(40, f - ACT2 + 6))); }
  if (f >= 1522) put(g, 540, 330, 1.15, pop(f, 1522), (p) => T.fxRoundCard(p, 'WHAT SLANG NEXT?', 'COMMENT BELOW!', '#8b5cf6', Math.min(40, f - 1522)));
  for (const [a, b_, t, fill] of JUDGE) put(g, 540, 200, 0.92, popk(f, a, b_), (p) => T.fxJudge(p, t, fill, '#ff5d8f', f));
  for (const [a, b_, t, hue] of BANNERS) put(g, 540, 165, 1.3, popk(f, a, b_), (p) => T.fxBanner(p, t, hue, '#ffffff', false, f));
  const C_ = telop(f); if (C_ && f < 1522 && !(f >= ACT2 && f < 660)) { const [hue, nm] = SPK[C_.who]; put(g, 540, 1550, 1.2, pop(f, C_.a - 1, 5), (p) => T.fxTelop(p, C_.rows, C_.idx, hue, nm, 1)); }
};
