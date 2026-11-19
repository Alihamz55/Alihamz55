// YouTube end card v5: Asep + Neng + Ucup (video Battle Gombal), tiap tokoh satu kalimat.
// YouTube end card "Malam Komedi": whole cast on the stage (x=0), subscribe / like / komen buttons clicked in sync with Asep's line.
import { M, camFromKeys, idle, blinkAt, walk, q, clamp, lerp, ramp } from './motion.js';
import { LIPS } from './lips.js';
const LINES = [['A', 9, 46], ['N', 51, 111], ['U', 116, 230]];
const speaks = (f, who) => LINES.some(([w, a, b]) => w === who && f >= a - 2 && f <= b + 2);
const talk = (f, who, expr) => { if (!speaks(f, who)) return expr; const lv = +(LIPS[f] || 0); return lv ? expr + '_t' + lv : expr; };
export const TOTAL = 302;
export const SHOTS = [{ id: 'end', a: 0, b: 301, light: 'stage' }];
export const shotAt = () => SHOTS[0];
const smooth = M.smooth;
export const LIGHTS = { stage: { az: 95, el: 52, sky: '#6a5a8a', ground: '#2a1a24', hemi: 0.75, sun: '#f4dcff', sunI: 3.0, fog: '#160c1a', fogNear: 14, fogFar: 60,
  skyTop: '#0c0814', skyHor: '#1a1020', sat: 1.15, vig: 0.38, shadowExt: 7 } };
export const lightFor = (S) => ({ ...LIGHTS[S.light] });
const CLICK = { like: 76, kom: 98, sub: 130 };
export const camAt = (f) => { const c = camFromKeys([{ f: 0, pos: [0, 1.75, 7.0], look: [0, 3.0, 0], fov: 44 }, { f: 301, pos: [0, 1.75, 6.6], look: [0, 3.0, 0], fov: 44 }], f,
  { creep: 0, kicks: [CLICK.like, CLICK.kom, CLICK.sub, 236].map((k) => ({ f: k, a: 0.012 })) }); c.flash = f < 4 ? 0.6 * (1 - f / 4) : 0; return c; };
export const dofAt = (f) => { const C = camAt(f); return { focus: Math.hypot(C.pos[0], C.pos[1] - 1.9, C.pos[2]), cinf: 2.5 }; };
export const worldAt = () => ({ curtain: 1 });
const R = (T, who, o, pos, extra = {}) => ({ key: who + JSON.stringify(o), draw: (p) => T.romanFront(p, who, o), x: pos[0], y: pos[1], z: pos[2], ...extra });
export const actorsAt = (f, T) => { const end = f >= 236, out = [];
  const one = (who, seed, x, spk, facing) => { const i = idle(f, seed), me = LINES.find((l) => l[0] === spk), on = f >= me[1] - 2 && f <= me[2] + 2;
    const o = end ? { L: 'wave', R: 'wave', wv: q((f * 0.45 + seed) % 6.283, 1), expr: spk === 'U' ? 'nervous' : 'laugh' }
      : on ? { L: 'wave', R: 'up', wv: q((f * 0.45) % 6.283, 1), expr: talk(f, spk, 'grin') } : { L: 'hang', R: 'wave', wv: q((f * 0.3 + seed) % 6.283, 1), expr: 'smile' };
    out.push(R(T, who, { seed, blink: blinkAt(f, seed), ...o, facing, look: 0, bob: q(i.bob + (end || on ? 0.02 * Math.abs(Math.sin(f * 0.35 + seed)) : 0), 3), tilt: q(i.tilt, 1), headTilt: q(i.headTilt, 1), sweat: spk === 'U' && end ? 1 : 0 }, [x, 0.5, 0.3], { ground: 0.5 })); };
  one('asepKlimis', 5, -0.85, 'A', 1); one('nengDress', 2, 0, 'N', 0); one('ucupRonda', 7, 0.85, 'U', -1); return out; };
const FXC = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 7, ...extra });
const pop = (f, a, n = 7) => (f < a ? 0 : q(M.back(clamp((f - a) / n)), 2));
export const fxAt = () => [];

// ---- screen-space overlay ----
const put = (g, cx, cy, sc, k, fn) => { if (k <= 0.01) return; g.save(); g.translate(cx, cy); g.scale(sc * k, sc * k); g.translate(-300, -500); fn({ g }); g.restore(); };
const BTN = [['sub', 16, 470], ['like', 22, 630], ['kom', 28, 790]];
const SPK = { A: ['#2f9a5a', 'ASEP'], N: ['#ff6fae', 'NENG'], U: ['#e8742c', 'UCUP'] };
const TXT = ['MAKASIH UDAH NONTON!', 'JANGAN LUPA LIKE SAMA KOMEN, YA!', 'SAMA SUBSCRIBE! BIAR UCUP NGGAK RONDA SENDIRIAN!'];
export const overlayAt = (f, g, T) => {
  put(g, 540, 215, 1.4, pop(f, 2), (p) => T.fxChannel(p, 'MALAM KOMEDI', 'YouTube: @malamkomedi', f));
  for (const [kind, a, y] of BTN) { const on = f >= CLICK[kind] ? 1 : 0, bump = on && f < CLICK[kind] + 6 ? 1.08 : 1;
    put(g, 540, y, 1.2 * bump, f < 236 ? pop(f, a) : Math.max(0, 1 - (f - 236) / 6), (p) => T.fxYtBtn(p, kind, on, f)); }
  // cursor travels to each button just before its click
  if (f >= 40 && f < 236) { const tgt = [[CLICK.like, 630], [CLICK.kom, 790], [CLICK.sub, 470]]; let x = 760, y = 900;
    for (let k = 0; k < tgt.length; k++) { const [c, ty] = tgt[k], c0 = k ? tgt[k - 1][0] : 40, y0 = k ? tgt[k - 1][1] + 30 : 980;
      if (f <= c) { const u = smooth(clamp((f - c0) / Math.max(1, c - c0 - 2))); x = lerp(k ? 700 : 820, 700, u); y = lerp(y0, ty + 30, u); break; } x = 700; y = ty + 30; }
    const press = Object.values(CLICK).some((c) => f >= c && f < c + 4) ? 1 : 0; put(g, x, y, 0.9, 1, (p) => T.fxHand(p, press)); }
  if (f >= 236) put(g, 540, 820, 1.35, pop(f, 236), (p) => T.fxJudge(p, 'TERIMA KASIH!', '#ffe14a', '#ff5d8f', f));
  for (let n = 0; n < LINES.length; n++) { const [who, a, b] = LINES[n]; const nx = n + 1 < LINES.length ? LINES[n + 1][1] - 2 : 999; if (f < a - 1 || f > Math.min(b + 12, nx) || f >= 236) continue;
    const W = TXT[n].split(' '), rows = []; let cur = [], len = 0; W.forEach((w) => { if (cur.length && len + w.length > 18) { rows.push(cur); cur = []; len = 0; } cur.push(w); len += w.length + 1; }); rows.push(cur);
    const wt = W.map((w) => w.length + 2), tot = wt.reduce((x, y) => x + y, 0); let acc = 0, idx = -1; W.forEach((w, k) => { if (f >= a + (b - a) * acc / tot && f <= b + 2) idx = k; acc += wt[k]; });
    const [hue, nm] = SPK[who]; put(g, 540, 1040, 1.25, pop(f, a - 1, 5), (p) => T.fxTelop(p, rows, idx, hue, nm, 1)); }
};
