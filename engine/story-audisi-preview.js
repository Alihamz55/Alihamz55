// Audisi Stand Up Absurd — set preview (stage x=0, juri table). Timing to be filled once audio exists.
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
export const TOTAL = 60;
export const SHOTS = [{ id: 'wide', a: 0, b: 19, light: 'stage' }, { id: 'peserta', a: 20, b: 39, light: 'stage' }, { id: 'juri', a: 40, b: 59, light: 'stage' }];
export const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
export const LIGHTS = { stage: { az: 95, el: 52, sky: '#7a6a8a', ground: '#2a1a24', hemi: 0.75, sun: '#fff0dc', sunI: 3.2, fog: '#160c1a', fogNear: 14, fogFar: 60,
  skyTop: '#0c0814', skyHor: '#1a1020', sat: 1.15, vig: 0.4, shadowExt: 7 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
export const RX = -40, SX = 80;
const PES = [0, 0.5, 0], JURI = [2.6, 0, 2.15];
const CAMS = {
  wide: [{ f: 0, pos: [1.2, 2.3, 7.4], look: [1.2, 1.6, 0.8], fov: 46 }, { f: 19, pos: [1.2, 2.3, 7.2], look: [1.2, 1.6, 0.8], fov: 46 }],
  peserta: [{ f: 20, pos: [0, 2.15, 3.4], look: [0, 2.05, 0], fov: 42 }, { f: 39, pos: [0, 2.15, 3.2], look: [0, 2.05, 0], fov: 42 }],
  juri: [{ f: 40, pos: [2.3, 1.75, 5.4], look: [2.6, 1.6, 2.2], fov: 40 }, { f: 59, pos: [2.3, 1.75, 5.2], look: [2.6, 1.6, 2.2], fov: 40 }],
};
export const camAt = (f) => { const c = camFromKeys(CAMS[shotAt(f).id], f, { kicks: [], creep: 0 }); c.flash = 0; return c; };
const dist = (a, b_) => Math.hypot(a[0] - b_[0], a[1] - b_[1], a[2] - b_[2]);
export const dofAt = (f) => { const C = camAt(f); return { focus: dist(C.pos, C.look), cinf: 3 }; };
export const worldAt = () => ({ curtain: 1 });
const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
export const actorsAt = (f, T) => {
  const i = idle(f, 5), j = idle(f, 2);
  return [
    R(T, 'rapi', { seed: 5, blink: blinkAt(f, 5), L: 'hang', R: 'shrug', expr: 'laugh', facing: 1, look: 1, bob: q(i.bob, 3), tilt: q(i.tilt, 1), headTilt: 0 }, PES, { ground: 0.5 }),
    R(T, 'batik', { seed: 2, blink: blinkAt(f, 2), L: 'hip', R: 'hang', expr: 'stubborn', facing: -1, look: -1, bob: q(j.bob, 3), tilt: 0, headTilt: 0 }, JURI, { ground: 0 }),
  ];
};
export const fxAt = () => [];
