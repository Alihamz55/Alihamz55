// Katalog karakter & kostum (frame 0..5 = 6 grup), panggung Malam Komedi (x=0) + beberapa latar.
import { M, camFromKeys, idle, blinkAt, q } from './motion.js';
export const TOTAL = 6;
const G = [
  { t: 'TOKOH TETAP', x: 0, light: 'stage', who: [['sarung', 'ASEP'], ['darman', 'PAK DARMAN'], ['tante', 'IBU']] },
  { t: 'PARKIR Rp35 RIBU', x: 160, light: 'sore', who: [['asepParkir', 'ASEP'], ['darmanMotor', 'PAK DARMAN'], ['ujangGorengan', 'MANG UJANG']] },
  { t: 'HP BARU GAPTEK 2', x: -40, light: 'room', who: [['asepHoodie', 'ASEP'], ['darmanKoko', 'PAK DARMAN'], ['ibuDasterUngu', 'IBU']] },
  { t: 'IBU NGAMBEK', x: 160, light: 'malam', who: [['asepMartabak', 'ASEP'], ['darmanJeans', 'PAK DARMAN'], ['ibuGamis', 'IBU']] },
  { t: 'DAPUR & PASAR', x: 480, light: 'sore', who: [['asepKoki', 'ASEP KOKI'], ['ibuPasar', 'IBU PASAR'], ['ujang', 'MANG UJANG']] },
  { t: 'NAIK GUNUNG', x: 320, light: 'malam', who: [['gunungA', 'ASEP'], ['gunungU', 'UCUP'], ['ibuDaster', 'IBU DASTER']] },
];
export const SHOTS = G.map((g, i) => ({ id: 'g' + i, a: i, b: i, light: g.light }));
export const shotAt = (f) => SHOTS[Math.min(5, f)];
export const LIGHTS = {
  stage: { az: 95, el: 52, sky: '#7a6a8a', ground: '#2a1a24', hemi: 0.85, sun: '#fff0dc', sunI: 3.0, fog: '#160c1a', fogNear: 14, fogFar: 60, skyTop: '#0c0814', skyHor: '#1a1020', sat: 1.15, vig: 0.35, shadowExt: 7 },
  sore: { az: 250, el: 30, sky: '#ffd8b0', ground: '#8a6a4a', hemi: 1.1, sun: '#ffd0a0', sunI: 2.3, fog: '#f0c8a0', fogNear: 40, fogFar: 220, skyTop: '#6a8ad8', skyHor: '#ffc8a0', sat: 1.08, vig: 0.3, gain: '#fff0e0', shadowExt: 10 },
  room: { az: 60, el: 48, sky: '#c8c0e0', ground: '#4a3a48', hemi: 1.15, sun: '#ffe8cc', sunI: 2.3, fog: '#141c3a', fogNear: 40, fogFar: 260, skyTop: '#060a24', skyHor: '#22305e', sat: 1.08, vig: 0.32, gain: '#fff2e4', shadowExt: 9 },
  malam: { az: 60, el: 45, sky: '#7a88c8', ground: '#2a2638', hemi: 0.95, sun: '#ffd8a8', sunI: 1.9, fog: '#141c3a', fogNear: 30, fogFar: 160, skyTop: '#060a24', skyHor: '#22305e', sat: 1.05, vig: 0.4, gain: '#f4ecff', shadowExt: 9 },
};
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const g_ = (f) => G[Math.min(5, f)];
export const camAt = (f) => { const x = g_(f).x; return { pos: [x, 2.0, 5.6], look: [x, 1.75, 0.3], fov: 50, flash: 0 }; };
export const dofAt = () => ({ focus: 5.4, cinf: 3 });
export const worldAt = (f) => ({ curtain: 1, night: g_(f).light !== 'sore', noBig: true, laugh: 0 });
const EX = ['grin', 'smile', 'laugh'], AR = [['hip', 'thumb'], ['up', 'hip'], ['hip', 'wave']];
export const actorsAt = (f, T) => { const g = g_(f); return g.who.map(([o, _], i) => { const x = g.x + (i - 1) * 1.15;
  const opts = { seed: 3 + i, blink: 0, expr: EX[i], L: AR[i][0], R: AR[i][1], wv: 1.2, facing: 0, look: 0, bob: 0, tilt: 0, headTilt: 0 };
  return { key: o + f, draw: (p) => T.romanFront(p, o, opts), x, y: 0.5, z: 0.3, ground: 0.5 }; }); };
export const fxAt = () => [];
const put = (g, cx, cy, sc, fn) => { g.save(); g.translate(cx, cy); g.scale(sc, sc); g.translate(-300, -500); fn({ g }); g.restore(); };
export const overlayAt = (f, g, T) => { const G0 = g_(f);
  put(g, 540, 250, 1.3, (p) => T.fxBanner(p, G0.t, '#e8344a', '#ffffff', false, 0));
  G0.who.forEach(([o, nm], i) => { g.save(); g.font = '700 40px Fredoka, sans-serif'; g.textAlign = 'center'; g.lineWidth = 10; g.strokeStyle = '#1a1220'; g.fillStyle = '#ffe14a';
    const x = 540 + (i - 1) * 330, y = 1640; g.strokeText(nm, x, y); g.fillText(nm, x, y); g.font = '600 28px Fredoka, sans-serif'; g.fillStyle = '#ffffff'; g.lineWidth = 7; g.strokeText(o, x, y + 46); g.fillText(o, x, y + 46); g.restore(); });
};
