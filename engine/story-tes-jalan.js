// Tes perbandingan jalan: #old = jalan lama (meluncur, tanpa volume) | #new = siklus jalan IK + volume 2.5D
import { q } from './motion.js';
const NEW = typeof location !== 'undefined' && location.hash === '#new';
export const TOTAL = 150;
export const SHOTS = [{ id: 'trk', a: 0, b: 149, light: 'sore' }];
export const shotAt = () => SHOTS[0];
export const LIGHTS = { sore: { az: 250, el: 30, sky: '#ffd8b0', ground: '#8a6a4a', hemi: 1.1, sun: '#ffd0a0', sunI: 2.3, fog: '#f0c8a0', fogNear: 40, fogFar: 220, skyTop: '#6a8ad8', skyHor: '#ffc8a0', sat: 1.08, vig: 0.3, gain: '#fff0e0', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const C = 28, V = Number(window.WALKV || 0.032), X0 = 155.5;
const X = (f) => X0 + f * V;
export const camAt = (f) => ({ pos: [X(f) + 0.2, 1.85, 4.3], look: [X(f) + 0.2, 1.55, 0.3], fov: 44, flash: 0 });
export const dofAt = () => ({ focus: 4.0, cinf: 3 });
export const worldAt = () => ({ curtain: 1, night: false, noBig: true, laugh: 0 });
export const actorsAt = (f, T) => {
  let o;
  if (NEW) { const w = (f / C) % 1; o = { seed: 5, blink: f % 70 < 3 ? 1 : 0, expr: 'grin', L: 'swing', R: 'swing', walk: q(w, 3), vol: 0, facing: 1, look: 1,
    bob: q(0.022 * (0.5 - 0.5 * Math.cos(4 * Math.PI * w)), 4), tilt: q(1.5 * Math.sin(2 * Math.PI * w), 2), headTilt: q(-1.8 * Math.sin(4 * Math.PI * w + 0.6), 2) }; }
  else o = { seed: 5, blink: f % 70 < 3 ? 1 : 0, expr: 'grin', L: 'hang', R: 'hang', step: q((f / 12) % 1, 2), facing: 1, look: 1, bob: 0, tilt: 0, headTilt: 0 };
  return [{ key: 'as' + JSON.stringify(o), draw: (p) => T.romanFront(p, 'asepHoodie', o), x: q(X(f), 4), y: 0.5, z: 0.4, ground: 0.5 }];
};
export const fxAt = (f, T) => { const out = []; for (let x = 150; x < 170; x += 2.2) out.push({ key: 'lj' + x, draw: (p) => T.fxLampuJalan(p), x, y: 0.5, z: -0.8, s: 2.6, blob: false, shadow: false, order: 1 }); return out; };
export const overlayAt = (f, g) => { g.save(); g.font = '700 64px Fredoka, sans-serif'; g.textAlign = 'center'; g.lineWidth = 12; g.strokeStyle = '#1a1220'; g.fillStyle = NEW ? '#5ad16a' : '#ff5d8f';
  const t = NEW ? 'LAMA (DIPERBAIKI)' : 'LAMA'; g.strokeText(t, 540, 260); g.fillText(t, 540, 260); g.restore(); };
