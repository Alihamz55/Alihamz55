// Thumbnail scene for Seri Mantan #3: crying photographer at the ex's wedding (wedding hall set, x=40).
import { M, camFromKeys, idle, blinkAt, q, clamp, lerp, ramp } from './motion.js';
export const TOTAL = 30;
export const SHOTS = [{ id: 'hall', a: 0, b: 29, light: 'hall' }];
export const shotAt = () => SHOTS[0];
export const LIGHTS = {
  hall: { az: 80, el: 50, sky: '#fff0d8', ground: '#8a6a4a', hemi: 0.9, sun: '#fff0d0', sunI: 2.6, fog: '#f7ead6', fogNear: 20, fogFar: 80,
    skyTop: '#f7ead6', skyHor: '#f7ead6', sat: 1.15, vig: 0.38, shadowExt: 8 },
  room: { az: 95, el: 52, sky: '#7a8aa8', ground: '#2a2420', hemi: 0.6, sun: '#ffdcae', sunI: 3.0, fog: '#18141c', fogNear: 14, fogFar: 60, skyTop: '#0c0c18', skyHor: '#1a1a28', sat: 1.15, vig: 0.42, shadowExt: 7 },
  film: { az: 70, el: 40, sky: '#d8bc8c', ground: '#4a3420', hemi: 0.75, sun: '#ffe6c0', sunI: 2.8, fog: '#d9c59c', fogNear: 25, fogFar: 140, skyTop: '#a8875a', skyHor: '#ead6a8', sat: 0.32, vig: 0.55, shadowExt: 8 },
};
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
export const RX = -40, SX = 80;
const HX = 40;
export const camAt = () => ({ pos: [HX + 0.2, 1.7, 4.3], look: [HX + 0.2, 1.75, -1], fov: 44, flash: 0 });
export const dofAt = () => ({ focus: 3.3, cinf: 1.2 });
export const worldAt = () => ({});
const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
export const actorsAt = (f, T) => [
  R(T, 'batik', { seed: 5, L: 'hang', R: 'belly', expr: 'sob', blink: 0, headTilt: -6 }, [HX - 0.2, 0, 0.6], { ground: 0 }),
  R(T, 'pengantin', { seed: 8, L: 'hang', R: 'thumb', expr: 'grin', blink: 0 }, [HX + 1.15, 0.43, -2.55], { ground: 0.43 }),
  R(T, 'istri', { seed: 2, L: 'hang', R: 'wave', wv: 1.2, expr: 'smile', blink: 0, facing: -1 }, [HX + 0.55, 0.43, -2.55], { ground: 0.43 }),
];
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const at = (x, yc, z, s) => [x, yc - 1.07 * s, z];
export const fxAt = (f, T) => [FXC('cam', (p) => T.fxCamera(p), at(HX - 0.05, 1.2, 1.1, 0.28), 0.28, { roll: 0.1 })];
