// YouTube end card v15: Asep baju tes CPNS (asepTesCPNS: kemeja putih, celana hitam, rambut klimis) + map berkas (video Asep Disuruh Daftar CPNS).
// YouTube end card "Malam Komedi": whole cast on the stage (x=0), subscribe / like / komen buttons clicked in sync with Asep's line.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['A', 10, 110]];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 183;
export const SHOTS = [{ id: 'end', a: 0, b: 182, light: 'stage' }];
export const shotAt = () => SHOTS[0];
const smooth = M.smooth;
export const LIGHTS = { stage: { az: 95, el: 52, sky: '#6a5a8a', ground: '#2a1a24', hemi: 0.75, sun: '#f4dcff', sunI: 3.0, fog: '#160c1a', fogNear: 14, fogFar: 60,
  skyTop: '#0c0814', skyHor: '#1a1020', sat: 1.15, vig: 0.38, shadowExt: 7 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const CLICK = { like: 58, kom: 68, sub: 100 };
export const camAt = (f) => { const c = camFromKeys([{ f: 0, pos: [0, 1.75, 6.4], look: [0, 3.0, 0], fov: 44 }, { f: 182, pos: [0, 1.75, 6.0], look: [0, 3.0, 0], fov: 44 }], f,
  { creep: 0, kicks: [CLICK.like, CLICK.kom, CLICK.sub, 118].map((k) => ({ f: k, a: 0.012 })) }); c.flash = f < 4 ? 0.6 * (1 - f / 4) : 0; return c; };
export const dofAt = (f) => { const C = camAt(f); return { focus: Math.hypot(C.pos[0], C.pos[1] - 1.9, C.pos[2]), cinf: 2.5 }; };
export const worldAt = () => ({ curtain: 1 });
const R = (T, who, o, pos, extra = {}) => ({ key: (typeof who === 'string' ? who : who.k) + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
export const actorsAt = (f, T) => { const i = idle(f, 5), end = f >= 118;
  const o = end ? { L: 'wave', R: 'wave', wv: q((f * 0.45) % 6.283, 1), expr: 'laugh' }
    : f < 10 ? { L: 'hang', R: 'wave', wv: q((f * 0.45) % 6.283, 1), expr: 'grin' }
    : { L: 'wave', R: 'up', wv: q((f * 0.45) % 6.283, 1), expr: talk(f, 'A', 'grin') };
  return [R(T, 'asepTesCPNS', { seed: 5, blink: blinkAt(f, 5), ...o, L: 'shield', facing: 1, look: 0, bob: q(i.bob + (end ? 0.02 * Math.abs(Math.sin(f * 0.35)) : 0), 3), tilt: q(i.tilt, 1), headTilt: q(i.headTilt, 1) }, [0, 0.5, 0.3], { ground: 0.5 })]; };
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 7) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
export const fxAt = (f, T) => [{ key: 'map', draw: (p) => T.fxMapBerkas(p), x: -0.42, y: 0.95, z: 0.42, s: 0.42, blob: false, shadow: false, order: 9 }];

// ---- screen-space overlay ----
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const BTN = [['sub', 16, 470], ['like', 22, 630], ['kom', 28, 790]];
const SPK = { A: ['#2f9a5a', 'ASEP'], P: ['#8b5cf6', 'POCONG'] };
const TXT = ['MAKASIH UDAH NONTON! JANGAN LUPA LIKE, KOMEN, DAN SUBSCRIBE!', 'BIAR NGGAK KALAH SAMA SAYA!'];
export const overlayAt = (f, g, T) => {

  put(g, 540, 215, 1.4, pop(f, 2), (p) => T.fxChannel(p, 'MALAM KOMEDI', 'YouTube: @malamkomedi', f));
  for (const [kind, a, y] of BTN) { const on = f >= CLICK[kind] ? 1 : 0, bump = on && f < CLICK[kind] + 6 ? 1.08 : 1;
    put(g, 540, y, 1.2 * bump, f < 118 ? pop(f, a) : Math.max(0, 1 - (f - 118) / 6), (p) => T.fxYtBtn(p, kind, on, f)); }
  // cursor travels to each button just before its click
  if (f >= 40 && f < 118) { const tgt = [[CLICK.like, 630], [CLICK.kom, 790], [CLICK.sub, 470]]; let x = 760, y = 900;
    for (let k = 0; k < tgt.length; k++) { const [c, ty] = tgt[k], c0 = k ? tgt[k - 1][0] : 40, y0 = k ? tgt[k - 1][1] + 30 : 980;
      if (f <= c) { const u = smooth(clamp((f - c0) / Math.max(1, c - c0 - 2))); x = lerp(k ? 700 : 820, 700, u); y = lerp(y0, ty + 30, u); break; } x = 700; y = ty + 30; }
    const press = Object.values(CLICK).some((c) => f >= c && f < c + 4) ? 1 : 0; put(g, x, y, 0.9, 1, (p) => T.fxHand(p, press)); }
  if (f >= 118) put(g, 540, 820, 1.35, pop(f, 118), (p) => T.fxJudge(p, 'TERIMA KASIH!', '#ffe14a', '#ff5d8f', f));
  for (let n = 0; n < LINES.length; n++) { const [who, a, b] = LINES[n]; const nx = n + 1 < LINES.length ? LINES[n + 1][1] - 2 : 999; if (f < a - 1 || f > Math.min(b + 12, nx) || f >= 118) continue;
    const W = TXT[n].split(' '), rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 18) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
    const wt = W.map((w) => w.length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = -1; W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot && f <= b + 2) idx = k; acc += wt[k]; });
    const [hue, nm] = SPK[who]; put(g, 540, 1040, 1.25, pop(f, a - 1, 5), (p) => T.fxTelop(p, rows, idx, hue, nm, 1)); }
};
