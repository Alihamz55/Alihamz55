// Pustaka animasi Kotak Kocak: kamera, tokoh bergerak, gerak mulut, subtitle, teks pop.
// Tiap episode menyediakan: TEXT (teks per kalimat), SHOT (adegan per id), lalu data.js (TIMING, LIPS).
const FPS = 30, GY = 1300;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const eOut = x => 1 - Math.pow(1 - clamp(x), 3);
const eInOut = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eBack = x => { x = clamp(x); return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2); };

const SUBCOL = { N: ['rgba(42,31,61,.9)', 'BOBI · NARASI'], bobi: ['rgba(255,128,20,.96)', 'BOBI'],
  kubi: ['rgba(150,80,230,.96)', 'NENG KUBI'], blok: ['rgba(40,70,160,.96)', 'OM BLOK'] };

// ---------- bantu ----------
let F = 0, CUR = null, TS = 0;
const speaks = who => CUR && CUR.active && (CUR.who === who || (who === 'bobi' && CUR.who === 'N'));
function lipOf(who) { return speaks(who) ? (LIPS[F] || 0) : 0; }
function talkFace(who, face) { return speaks(who) ? Object.assign({}, face, { mouth: lipOf(who) }) : face; }
function blink(face, off) { return ((F + off) % 97 < 3 && (!face.eye || face.eye === 'normal')) ? Object.assign({}, face, { eye: 'flat' }) : face; }
function C(who, x, y, s, o = {}) {
  const breath = 1 + .018 * Math.sin(F * .16 + who.length), sq = (o.sq || 1) * breath;
  g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot); g.scale(1 / Math.sqrt(sq), sq);
  let face = blink(o.face || { look: 0 }, who.length * 31);
  if (o.talk !== false) face = talkFace(o.talkAs || who, face);
  char(0, 0, s, { who, arms: o.arms || [.15, .15], face, prop: o.prop, armsFront: o.armsFront }); g.restore();
}
function cam(z, cx, cy, shake, fn) {
  const sx = shake ? Math.sin(F * 2.7) * shake : 0, sy = shake ? Math.cos(F * 3.3) * shake : 0;
  z *= 1 + .025 * Math.min(TS, 4);
  cx = clamp(cx, 540 / z + 20, W - 540 / z - 20); cy = clamp(cy, 960 / z + 20, H - 960 / z - 20);
  g.save(); g.translate(540 + sx, 960 + sy); g.scale(z, z); g.translate(-cx, -cy); fn(); g.restore();
}
function pop(txt, y, size, col, t, rot = 0) {
  if (t < 0) return; const k = eBack(t / .3);
  g.save(); g.translate(540, y); g.rotate(rot); g.scale(k, k); g.translate(-540, -y); bigWord(txt, y, size, col); g.restore();
}
function sparkle(x, y, t, n = 5, r = 140) {
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + t * 1.5, k = .6 + .4 * Math.sin(t * 6 + i);
    star(x + Math.cos(a) * r, y + Math.sin(a) * r * .7, 26 * k, '#ffd23f'); }
}
// subtitle: kotak berwarna + label nama; *kata* = kuning
function sub(id, who) {
  const txt = TEXT[id]; if (!txt) return; const [col, name] = SUBCOL[who];
  g.font = '700 58px Fredoka'; const toks = []; let hl = false;
  txt.split(/(\*)/).forEach(p => { if (p === '*') { hl = !hl; return; } p.split(/(\s+)/).forEach(w => w && toks.push({ w, hl })); });
  const lines = [[]]; let lw = 0;
  toks.forEach(t => { const w = g.measureText(t.w).width; if (lw + w > 860 && t.w.trim()) { lines.push([]); lw = 0; } if (!lines.at(-1).length && !t.w.trim()) return; lines.at(-1).push(t); lw += w; });
  const h = 70 + lines.length * 68, y = 1580 - h / 2;
  rr(80, y, 920, h, 36); g.fillStyle = col; g.fill(); g.lineWidth = 9; g.strokeStyle = '#fff'; g.stroke();
  g.font = '700 38px Fredoka'; const nw = g.measureText(name).width + 50;
  rr(110, y - 34, nw, 60, 22); g.fillStyle = INK; g.fill(); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(name, 110 + nw / 2, y - 3);
  g.font = '700 58px Fredoka'; g.textAlign = 'left';
  lines.forEach((ln, i) => { const tw = ln.reduce((a, t) => a + g.measureText(t.w).width, 0); let x = 540 - tw / 2;
    ln.forEach(t => { g.fillStyle = t.hl ? '#ffe94a' : '#fff'; g.fillText(t.w, x, y + 70 + i * 68); x += g.measureText(t.w).width; }); });
}
function dust(x, y, t) {
  for (let i = 0; i < 10; i++) { const a = Math.PI + i / 9 * Math.PI, d = eOut(t / .6) * (120 + (i % 3) * 50), s = 34 * (1 - clamp(t / .9));
    if (s <= 0) continue; rr(x + Math.cos(a) * d * 1.6 - s / 2, y + Math.sin(a) * d * .7 - s / 2, s, s, 6); fs(i % 2 ? '#c9a27a' : '#e8d3b5', 5); }
}
function darken(alpha) { g.fillStyle = `rgba(20,10,40,${alpha})`; g.fillRect(0, 0, W, H); }

// latar dunia (tanpa tokoh)
function world() { kampung(GY); stairs(700, GY); sign(40, 1040, 'TUTORIAL:\nNAIK TANGGA'); }
const STEP = i => ({ x: 700 + 65 + i * 130, y: GY - (i + 1) * 120 });

// tokoh tetap di posisi masing-masing (dipakai banyak adegan)
const KUBI = { x: 820, y: 1410, s: .88 }, BOBI = { x: 300, y: 1440, s: .95 };
const FACE = {
  pede: { look: 6, brow: [-10, 10], mouth: 'grin' }, kubiSinis: { look: -14, brow: [8, -8], mouth: 'smirk', blush: true },
  kubiCuriga: { look: -18, brow: [-12, 12], mouth: 'smirk', blush: true }, kaget: { eye: 'tiny', brow: [-16, -16], mouth: 'shock' },
  panik: { look: 10, brow: [-14, -14], mouth: 'wavy', sweat: true }, pingsan: { eye: 'flat', brow: [0, 0], mouth: 'flat' },
  galak: { look: -16, brow: [14, 14], mouth: 'flat' }, senang: { eye: 'happy', brow: [6, 6], mouth: 'open', blush: true },
  curiga: { look: 18, brow: [-12, 12], mouth: 'smirk' }, sedih: { look: 6, brow: [-16, -16], mouth: 'flat' },
};
function bobiLying(x, face, s = .8) { C('bobi', x, GY + 30, s, { rot: -Math.PI / 2, arms: [3.0, 3.0], face }); }

window.drawFrame = function (f) {
  F = f; const t = f / FPS; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  // kalimat aktif = yang terakhir dimulai (jeda antar kalimat menahan adegan sebelumnya)
  CUR = TIMING[0]; for (const d of TIMING) if (d.start <= t) CUR = d;
  const isLine = typeof CUR.id === 'number';
  CUR = Object.assign({}, CUR, { active: isLine && t <= CUR.end + .05 });
  TS = t - CUR.start; SHOT[CUR.id](TS);
  if (isLine) sub(CUR.id, CUR.who);
};
