// YouTube end card "Dad Frank Toons" (English): Cody on the front lawn (x=240), subscribe / like / comment buttons clicked in sync with his line.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['C', 10, 134]];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 177;
export const SHOTS = [{ id: 'end', a: 0, b: 176, light: 'day' }];
export const shotAt = () => SHOTS[0];
const smooth = M.smooth;
export const LIGHTS = { day: { az: 230, el: 42, sky: '#d8ecff', ground: '#7a8a4a', hemi: 1.15, sun: '#fff0d8', sunI: 2.4, fog: '#dfeeff', fogNear: 40, fogFar: 220,
  skyTop: '#4a86d8', skyHor: '#d6ecff', sat: 1.1, vig: 0.26, gain: '#fff6ea', shadowExt: 10 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const CLICK = { like: 52, kom: 66, sub: 86 };
const HR = 240;
export const camAt = (f) => { const c = camFromKeys([{ f: 0, pos: [HR, 1.5, 4.9], look: [HR, 2.55, 1.1], fov: 44 }, { f: 176, pos: [HR, 1.5, 4.6], look: [HR, 2.55, 1.1], fov: 44 }], f,
  { creep: 0, kicks: [CLICK.like, CLICK.kom, CLICK.sub, 138].map((k) => ({ f: k, a: 0.012 })) }); c.flash = f < 4 ? 0.6 * (1 - f / 4) : 0; return c; };
export const dofAt = (f) => { const C = camAt(f); return { focus: Math.hypot(C.pos[0] - HR, C.pos[1] - 1.9, C.pos[2] - 1.1), cinf: 2.5 }; };
export const worldAt = () => ({ curtain: 1 });
const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
export const actorsAt = (f, T) => { const i = idle(f, 5), end = f >= 138;
  const o = end ? { L: 'wave', R: 'wave', wv: q((f * 0.45) % 6.283, 1), expr: 'laugh' }
    : f < 10 ? { L: 'hang', R: 'wave', wv: q((f * 0.45) % 6.283, 1), expr: 'grin' }
    : { L: 'wave', R: 'up', wv: q((f * 0.45) % 6.283, 1), expr: talk(f, 'C', 'grin') };
  return [R(T, 'codyCowboy', { seed: 5, blink: blinkAt(f, 5), ...o, facing: 1, look: 0, bob: q(i.bob + (end ? 0.02 * Math.abs(Math.sin(f * 0.35)) : 0), 3), tilt: q(i.tilt, 1), headTilt: q(i.headTilt, 1) }, [HR, 0.56, 1.1], { ground: 0.56 })]; };
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 7) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
export const fxAt = () => [];

// ---- screen-space overlay ----
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const BTN = [['sub', 16, 470], ['like', 22, 630], ['kom', 28, 790]];
const SPK = { C: ['#2f9a5a', 'CODY'] };
const TXT = ['THANKS FOR WATCHING! LIKE, COMMENT, AND SUBSCRIBE... BEFORE DAD LEARNS ANOTHER WORD!'];
export const overlayAt = (f, g, T) => {
  put(g, 540, 215, 1.4, pop(f, 2), (p) => T.fxChannel(p, 'DAD FRANK TOONS', 'YouTube: @dadfranktoons', f));
  for (const [kind, a, y] of BTN) { const on = f >= CLICK[kind] ? 1 : 0, bump = on && f < CLICK[kind] + 6 ? 1.08 : 1;
    put(g, 540, y, 1.2 * bump, f < 138 ? pop(f, a) : Math.max(0, 1 - (f - 138) / 6), (p) => T.fxYtBtn(p, kind, on, f, true)); }
  // cursor travels to each button just before its click
  if (f >= 32 && f < 138) { const tgt = [[CLICK.like, 630], [CLICK.kom, 790], [CLICK.sub, 470]]; let x = 760, y = 900;
    for (let k = 0; k < tgt.length; k++) { const [c, ty] = tgt[k], c0 = k ? tgt[k - 1][0] : 32, y0 = k ? tgt[k - 1][1] + 30 : 980;
      if (f <= c) { const u = smooth(clamp((f - c0) / Math.max(1, c - c0 - 2))); x = lerp(k ? 700 : 820, 700, u); y = lerp(y0, ty + 30, u); break; } x = 700; y = ty + 30; }
    const press = Object.values(CLICK).some((c) => f >= c && f < c + 4) ? 1 : 0; put(g, x, y, 0.9, 1, (p) => T.fxHand(p, press)); }
  if (f >= 138) put(g, 540, 690, 1.35, pop(f, 138), (p) => T.fxJudge(p, 'THANK YOU!', '#ffe14a', '#ff5d8f', f));
  for (let n = 0; n < LINES.length; n++) { const [who, a, b] = LINES[n]; const nx = n + 1 < LINES.length ? LINES[n + 1][1] - 2 : 999; if (f < a - 1 || f > Math.min(b + 12, nx) || f >= 138) continue;
    const W = TXT[n].split(' '), rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 27) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
    const wt = W.map((w) => w.length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = -1; W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot && f <= b + 2) idx = k; acc += wt[k]; });
    const [hue, nm] = SPK[who]; put(g, 540, 1720, 1.15, pop(f, a - 1, 5), (p) => T.fxTelop(p, rows, idx, hue, nm, 1)); }
};
