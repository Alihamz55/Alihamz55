// "Pocong Antre Colokan" -- episode TANPA DIALOG. Asep (sarung) + Pocong (fx). Kamar (x=RX) lalu pos ronda (x=PX).
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
export const TOTAL = 615;
const SH = [['hp', 0, 74], ['win', 75, 134], ['scared', 135, 194], ['pocong', 195, 244], ['outlet', 245, 284], ['two', 285, 349], ['race', 350, 404],
  ['jalan', 405, 474], ['reveal', 475, 569], ['end', 570, 614]];
export const SHOTS = SH.map(([id, a, b]) => ({ id, a, b, light: a >= 405 ? 'night' : 'room' }));
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const smooth = M.smooth;
export const LIGHTS = {
  room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.05, sun: '#ffe8cc', sunI: 2.1, fog: '#141c3a', fogNear: 40, fogFar: 260,
    skyTop: '#060a24', skyHor: '#22305e', sat: 1.08, vig: 0.4, gain: '#fff0dc', shadowExt: 9 },
  night: { az: 70, el: 42, sky: '#7a8ac0', ground: '#2a3048', hemi: 1.0, sun: '#c8d4ff', sunI: 1.9, fog: '#141c3a', fogNear: 40, fogFar: 260,
    skyTop: '#060a24', skyHor: '#22305e', sat: 1.05, vig: 0.38, gain: '#e8eeff', shadowExt: 12 },
};
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const RX = -40, PX = 120;
const AS = [RX + 0.55, 0.5, 0.4], PC = [RX - 0.55, 0.5, 0.55], WIN = [RX + 0.75, 2.55, -2.3], SOCK = [RX + 1.35, 1.0, -2.38];
// pos ronda: socket on the hut's front-right post, queue to the right
const SOCK2 = [PX - 0.95, 1.25, -0.5], QUEUE = [[PX - 0.35, 0.5, 0.25], [PX + 0.35, 0.5, 0.3], [PX + 1.05, 0.5, 0.25], [PX + 1.75, 0.5, 0.3]], AEND = [PX + 2.45, 0.5, 0.3];
const hop = (f, per = 12, h = 0.28) => h * Math.abs(Math.sin(Math.PI * f / per));
// pocong enters the room hopping (195-222)
const pcPos = (f) => f < 195 ? null : f < 222 ? [lerp(RX - 2.6, PC[0], smooth(ramp(f, 195, 222))), PC[1] + hop(f - 195), PC[2]] : [PC[0], PC[1] + (f >= 330 && f < 342 ? hop(f - 330, 12, 0.12) : 0), PC[2]];
// Asep bungkus sarung hops across the kampung (405-474) and into the queue (475-545)
const abPos = (f) => { if (f < 405) return null;
  if (f < 475) return [lerp(PX + 5.2, PX + 3.4, ramp(f, 405, 474)), 0.5 + hop(f - 405), AEND[2]];
  if (f < 545) return [lerp(PX + 3.4, AEND[0], smooth(ramp(f, 490, 545))), 0.5 + (f >= 490 ? hop(f - 490) : 0), AEND[2]];
  return [AEND[0], 0.5 + (f >= 590 && f < 602 ? hop(f - 590, 12, 0.14) : 0), AEND[2]]; };
const K = (pos, look, fov) => ({ pos, look, fov });
const CAMS = {
  hp: [{ f: 0, ...K([AS[0] - 0.1, 1.35, AS[2] + 1.9], [AS[0], 2.05, AS[2]], 40) }, { f: 74, ...K([AS[0] - 0.08, 1.4, AS[2] + 1.6], [AS[0], 2.07, AS[2]], 40) }],
  win: [{ f: 0, ...K([RX + 1.7, 1.6, 3.0], [RX + 0.85, 2.45, -2.3], 46) }, { f: 59, ...K([RX + 1.6, 1.65, 2.5], [RX + 0.85, 2.5, -2.3], 44) }],
  scared: [{ f: 0, ...K([AS[0], 1.9, AS[2] + 1.75], [AS[0], 2.05, AS[2]], 38) }, { f: 59, ...K([AS[0], 1.92, AS[2] + 1.55], [AS[0], 2.07, AS[2]], 38) }],
  pocong: [{ f: 0, ...K([PC[0] + 0.25, 1.4, PC[2] + 2.6], [PC[0] - 0.3, 1.9, PC[2]], 42) }, { f: 30, ...K([PC[0] + 0.2, 1.45, PC[2] + 2.1], [PC[0], 1.95, PC[2]], 40) }, { f: 49, ...K([PC[0] + 0.18, 1.48, PC[2] + 1.9], [PC[0], 1.97, PC[2]], 40) }],
  outlet: [{ f: 0, ...K([SOCK[0] - 0.1, 1.15, SOCK[2] + 1.1], [SOCK[0], 1.1, SOCK[2]], 40) }, { f: 39, ...K([SOCK[0] - 0.08, 1.15, SOCK[2] + 0.95], [SOCK[0], 1.1, SOCK[2]], 40) }],
  two: [{ f: 0, ...K([RX, 2.05, 4.0], [RX, 1.85, 0.4], 44) }, { f: 64, ...K([RX, 2.05, 3.7], [RX, 1.87, 0.4], 44) }],
  race: [{ f: 0, ...K([RX, 2.0, 3.6], [RX, 1.9, 0.4], 44) }, { f: 54, ...K([RX + 0.25, 1.98, 3.1], [RX + 0.35, 1.95, 0.4], 42) }],
  jalan: [{ f: 0, ...K([PX + 4.6, 1.3, 4.6], [PX + 4.2, 1.9, 0.3], 44) }, { f: 69, ...K([PX + 3.8, 1.35, 4.4], [PX + 3.4, 1.9, 0.3], 44) }],
  reveal: [{ f: 0, ...K([PX + 2.9, 2.0, 3.0], [PX + 2.6, 1.9, 0.3], 40) }, { f: 45, ease: 'easeOut', ...K([PX + 0.75, 2.6, 8.6], [PX + 0.75, 1.75, 0.0], 48) }, { f: 94, ...K([PX + 0.8, 2.55, 8.1], [PX + 0.8, 1.75, 0.0], 48) }],
  end: [{ f: 0, ...K([AEND[0] - 0.2, 1.75, AEND[2] + 2.7], [AEND[0], 2.2, AEND[2]], 42) }, { f: 44, ...K([AEND[0] - 0.15, 1.8, AEND[2] + 2.3], [AEND[0], 2.22, AEND[2]], 42) }],
};
const KICKS = [{ f: 135, a: 0.05 }, { f: 223, a: 0.035 }, { f: 392, a: 0.05 }, { f: 476, a: 0.04 }];
export const camAt = (f) => { const S = shotAt(f), keys = CAMS[S.id].map((k) => ({ ...k, f: S.a + k.f }));
  const c = camFromKeys(keys, f, { kicks: KICKS, creep: 0 }); c.flash = f >= S.a && f < S.a + 2 && S.a > 0 ? 0.1 * (1 - (f - S.a) / 2) : 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
const CINE = ['hp', 'scared', 'pocong', 'outlet', 'end'];
export const dofAt = (f) => { const C = camAt(f), S = shotAt(f); return { focus: dist(C.pos, C.look), cinf: CINE.includes(S.id) ? 8 : 3 }; };
export const worldAt = () => ({ curtain: 1, night: true, noBig: true, laugh: 0 });

const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
const sway = (f, a = 4, w_ = 0.06) => q(a * Math.sin(f * w_), 1);
const asPose = (f) => {
  if (f < 95) return { L: 'hang', R: 'phone', expr: 'smile', facing: -1, look: -1 };
  if (f < 135) return { L: 'hang', R: 'phone', expr: f < 105 ? 'squint' : 'shock', facing: -1, look: -1, blink: f < 105 ? undefined : 0 };
  if (f < 195) return { L: 'up', R: 'up', expr: 'shock', shake: 1, facing: -1, look: -1, blink: 0 };
  if (f < 285) return { L: 'temple', R: 'hang', expr: 'shock', shake: f < 245 ? 1 : 0, facing: -1, look: -1, blink: 0 };
  if (f < 300) return { L: 'hang', R: 'hang', expr: 'smile_closed', facing: -1, look: -1 };
  if (f < 330) return { L: 'hang', R: 'reach', expr: 'grin', facing: -1, look: -1 };
  if (f < 380) return { L: 'hang', R: 'phone', expr: 'smile', facing: -1, look: -1 };
  if (f < 392) return { L: 'hang', R: 'phone', expr: 'nervous', facing: -1, look: -1 };
  return { L: 'up', R: 'phone', expr: 'shock', shake: 1, facing: -1, look: -1, blink: 0 };
};
export const actorsAt = (f, T) => {
  if (f >= 405) return [];
  const { shake, ...o } = asPose(f), i = idle(f, 5), tilt = shake ? sway(f, 6, 0.6) : 0;
  return [R(T, 'sarung', { seed: 5, blink: o.blink ?? blinkAt(f, 5), ...o, bob: q(i.bob, 3), tilt: q(i.tilt + tilt, 1), headTilt: q((o.headTilt || 0) + i.headTilt, 1) }, AS, { ground: 0.5 })];
};
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const at = (x, yc, z, s) => [x, yc - 1.07 * s, z];
const pop = (f, a, n = 6) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const out_ = (f, b_, n = 5) => q(1 - smooth(ramp(f, b_ - n, b_)), 2);
const scaled = (k, fn) => (pp) => { pp.g.translate(300, 500); pp.g.scale(k, k); pp.g.translate(-300, -500); fn(pp); };
const QPCT = [5, 2, 8, 1];
export const fxAt = (f, T) => {
  const out = [];
  if (f < 405) {
    out.push(FXC('sock', (p) => T.fxColokan(p), at(SOCK[0], SOCK[1], SOCK[2], 0.12), 0.12, { order: 1 }));
    // shadow behind the curtain (95-134)
    if (f >= 95 && f < 135) { const x = lerp(RX + 0.15, RX + 1.35, ramp(f, 95, 134)); out.push(FXC('sil' + q(hop(f - 95, 10, 0.12), 2), (p) => T.fxPocongSil(p, 0.75), [q(x, 3), 1.95 + q(hop(f - 95, 10, 0.12), 2), WIN[2]], 0.6, { order: 1 })); }
    const P_ = pcPos(f); if (P_) { const bl = f % 90 > 85 ? 1 : 0; out.push(FXC('pc' + bl, (p) => T.fxPocong(p, 0, bl, f >= 330 && f < 345 ? 'smug' : 'calm'), [q(P_[0], 3), q(P_[1], 3), P_[2]], 0.95, { order: 2 })); }
    // charger travels from Asep's hand to Pocong (300-326)
    if (f >= 300 && f < 350) { const k = smooth(ramp(f, 305, 326)), x = lerp(AS[0] - 0.35, PC[0] + 0.35, k), y = 1.45 + 0.25 * Math.sin(Math.PI * k);
      out.push(FXC('chg', (p) => T.fxCharger(p), at(q(x, 3), q(y, 3), AS[2] + 0.2, 0.16), 0.16, { order: 6 }));
      if (f >= 326 && f < 342) out.push(FXC('spk' + (f % 6), (p) => T.fxSparkle(p, f * 0.05), at(PC[0] + 0.35, 1.5, AS[2] + 0.25, 0.3), 0.3, { order: 8 })); }
  } else {
    out.push(FXC('sock2', (p) => T.fxColokan(p), at(SOCK2[0], SOCK2[1], SOCK2[2], 0.1), 0.1, { order: 1 }));
    if (f >= 475) {
      QUEUE.forEach((pos, k) => { const b = (f + k * 29) % 100 > 95 ? 1 : 0, dy = k === 0 ? 0 : q(hop((f + k * 7) % 60 < 12 ? (f + k * 7) % 60 : 0, 12, 0.06), 3);
        out.push(FXC('qp' + k + b, (p) => T.fxPocong(p, 0, b, 'calm'), [pos[0], pos[1] + dy, pos[2]], 0.92 - (k % 2) * 0.05, { order: 2 }));
        if (f >= 482) { const s = 0.5, kk = pop(f, 482 + k * 4); if (kk > 0.01) out.push(FXC('qb' + k + kk + ((f % 16) < 9 ? 1 : 0), scaled(kk, (p) => T.fxBaterai(p, QPCT[k], f)), at(pos[0], 3.1, pos[2], s), s, { order: 9 })); } });
      out.push(FXC('chg2', (p) => T.fxCharger(p), at(SOCK2[0] + 0.15, 1.05, SOCK2[2] + 0.1, 0.12), 0.12, { order: 3 }));
    }
    const A_ = abPos(f); if (A_) { const b = f % 80 > 76 ? 1 : 0, mood = f >= 545 ? 'sad' : 'nervous';
      out.push(FXC('ab' + b + mood, (p) => T.fxPocongAsep(p, b, mood), [q(A_[0], 3), q(A_[1], 3), A_[2]], 0.9, { order: 2 }));
      if (f >= 548) { const s = 0.3, kk = pop(f, 548); out.push(FXC('ab0' + kk + ((f % 16) < 9 ? 1 : 0), scaled(kk, (p) => T.fxBaterai(p, 0, f, 0, 1)), at(A_[0], 2.95, A_[2], s), s, { order: 9 })); } }
  }
  return out;
};

// ---- screen-space overlay (icons only, no words) ----
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const shade = (g, a) => { if (a <= 0.005) return; g.fillStyle = `rgba(4,6,16,${a})`; g.fillRect(0, 0, 1080, 1920); };
const moon = (g, x, y, k) => { if (k <= 0.01) return; g.save(); g.translate(x, y); g.scale(k, k); g.fillStyle = '#14101a'; g.beginPath(); g.roundRect(-150, -70, 300, 140, 40); g.fill();
  g.fillStyle = '#fff2b0'; g.beginPath(); g.arc(-70, 0, 46, 0, 7); g.fill(); g.fillStyle = '#14101a'; g.beginPath(); g.arc(-52, -14, 40, 0, 7); g.fill();
  g.font = '700 86px "Fredoka", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffe14a'; g.fillText('+1', 48, 6); g.restore(); };
export const overlayAt = (f, g, T) => {
  // flickering bulb (78-100) + darker room while the shadow hops
  if (f >= 78 && f < 101) { const ph = Math.floor((f - 78) / 3); shade(g, ph % 2 ? 0.78 : 0.15); }
  else if (f >= 101 && f < 135) shade(g, 0.22);
  // 1) Asep's phone: 100% (hook)
  if (f < 75) put(g, 540, 330, 0.95, f < 1 ? 1 : out_(f, 75), (p) => T.fxBaterai(p, 100, f));
  // 2) Pocong's phone: 1% blinking red
  if (f >= 230 && f < 285) put(g, 540, 1560, 0.8, pop(f, 230), (p) => T.fxBaterai(p, 1, f));
  // 3) the race: Pocong up, Asep down
  if (f >= 350 && f < 405) { const k = smooth(ramp(f, 356, 388)), pc = lerp(1, 100, k), as = lerp(100, 1, k), dead = f >= 392;
    put(g, 300, 380, 0.72, pop(f, 350), (p) => T.fxBaterai(p, pc, f, f < 388 ? 1 : 0));
    put(g, 780, 380, 0.72, pop(f, 352), (p) => T.fxBaterai(p, as, f, 0, dead ? 1 : 0));
    if (dead) shade(g, 0.12 * Math.min(1, (f - 392) / 4)); }
  // 4) next night
  if (f >= 408 && f < 474) moon(g, 860, 250, Math.min(pop(f, 408), out_(f, 474)) * 1.0);
  // end: soften to dark so the loop back to frame 0 feels seamless
  if (f >= 604) shade(g, 0.55 * ramp(f, 604, 614));
};
