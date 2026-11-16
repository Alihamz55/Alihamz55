// Facebook end card: Ikuti -> Suka -> Komentar -> Bagikan, on the Malam Komedi stage. 135 frames @ 30 fps.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
export const TOTAL = 135;
export const SHOTS = [{ id: 'end', a: 0, b: 134, light: 'stage' }];
export const shotAt = () => SHOTS[0];
export const LIGHTS = { stage: { az: 95, el: 52, sky: '#6a5a8a', ground: '#2a1a24', hemi: 0.6, sun: '#f4dcff', sunI: 3.0, fog: '#160c1a', fogNear: 14, fogFar: 60,
  skyTop: '#0c0814', skyHor: '#1a1020', sat: 1.15, vig: 0.42, shadowExt: 7 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
export const RX = -40, SX = 80;
const smooth = M.smooth;
export const camAt = (f) => { const c = camFromKeys([{ f: 0, pos: [0.25, 2.05, 4.4], look: [0.2, 1.95, 0], fov: 40 }, { f: 134, pos: [0.25, 2.05, 4.1], look: [0.2, 1.95, 0], fov: 40 }], f,
  { creep: 0, kicks: [26, 50, 74, 98].map((k) => ({ f: k, a: 0.012 })) }); c.flash = f < 4 ? 0.6 * (1 - f / 4) : 0; return c; };
export const dofAt = (f) => { const C = camAt(f); return { focus: Math.hypot(C.pos[0] + 0.35, C.pos[1] - 1.95, C.pos[2]), cinf: 2 }; };
export const worldAt = () => ({ curtain: 1 });
const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
export const actorsAt = (f, T) => { const i = idle(f, 5), bow = smooth(ramp(f, 112, 124)) - smooth(ramp(f, 128, 134));
  const o = f < 110 ? { L: 'mic', R: 'wave', wv: q((f * 0.45) % 6.283, 1), expr: f < 50 ? 'laugh' : 'grin' } : { L: 'mic', R: 'hang', expr: 'smile_closed' };
  return [R(T, 'komik', { seed: 5, blink: blinkAt(f, 5), ...o, bob: q(i.bob, 3), tilt: q(i.tilt + bow * 14, 1), headTilt: q(i.headTilt, 1) }, [-0.4, 0.5, 0], { ground: 0.5 })]; };
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 8, ...extra });
const pop = (f, a, n = 8) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
const scaled = (k, fn) => (pp) => { pp.g.translate(300, 500); pp.g.scale(k, k); pp.g.translate(-300, -500); fn(pp); };
const at = (x, yc, z, s) => [x, yc - 1.07 * s, z];
const BX = 0.5, Z = 1.0, S = 0.5;
const BTN = [['follow', 'fxFbFollow', 6, 26, 2.55], ['like', 'fxFbLike', 30, 50, 2.22], ['com', 'fxFbComment', 54, 74, 1.89], ['share', 'fxFbShare', 78, 98, 1.56]];
export const fxAt = (f, T) => {
  const out = [];
  for (const [id, fn, a, tap, y] of BTN) {
    if (f < a) continue;
    const on = f >= tap, press = f >= tap && f < tap + 4 ? 0.9 : 1, k = q(pop(f, a) * press, 2);
    out.push(FXC(id + k + on, scaled(k, (p) => T[fn](p, on)), at(BX, y, Z, S), S));
    if (f >= tap && f < tap + 12) { const t = q((f - tap) / 12, 2); out.push(FXC(id + 'b' + t, (p) => T.fxBurstRing(p, t), at(BX, y, Z - 0.01, S), S, { order: 7 })); }
  }
  // cursor: fingertip glides to each button and taps
  if (f >= 14 && f < 108) {
    const tg = (y) => [BX - 0.12, y - 0.01];
    const keys = [[14, [0.95, 1.2]], [22, tg(2.55)], [27, tg(2.55)], [46, tg(2.22)], [51, tg(2.22)], [70, tg(1.89)], [75, tg(1.89)], [94, tg(1.56)], [100, tg(1.56)], [108, [1.0, 1.0]]];
    let j = keys.findIndex((kk, i) => f >= kk[0] && f <= keys[i + 1][0]); if (j < 0) j = keys.length - 2;
    const t = smooth((f - keys[j][0]) / (keys[j + 1][0] - keys[j][0])), x = lerp(keys[j][1][0], keys[j + 1][1][0], t), y = lerp(keys[j][1][1], keys[j + 1][1][1], t);
    const click = BTN.some((b) => f >= b[3] && f < b[3] + 2), s = 0.42;
    out.push(FXC('cur' + q(x, 3) + q(y, 3) + click, (p) => T.fxCursor(p, click), [x + 40 * 0.00225 * s, y - (975 - 350) * 0.00225 * s, Z + 0.2], s, { order: 10 }));
  }
  if (f >= 104) { const k = pop(f, 104); out.push(FXC('thx' + k, scaled(k, (p) => T.fxShout(p, 'TERIMA KASIH!', '#ffd84a', 66)), at(0.15, 1.2, 1.3, 0.62), 0.62, { order: 10, roll: -0.04 })); }
  return out;
};
