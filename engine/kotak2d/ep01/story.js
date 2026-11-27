// Kotak Kocak #1: Bobi Ngaku Pro. Animasi per frame (30 fps), dipanggil lewat drawFrame(f).
// Memakai fungsi gambar dari kotak2d.js dan data suara/gerak mulut dari ep01/data.js.
const FPS = 30, GY = 1300;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const eOut = x => 1 - Math.pow(1 - clamp(x), 3);
const eInOut = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eBack = x => { x = clamp(x); return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2); };

const TEXT = {
  1: 'Kenalin. Aku Bobi. Pemain paling *pro* di Dunia Kotak.',
  2: 'Bob, itu *area tutorial.* Buat yang baru main.',
  3: 'Santai. Aku udah main *tiga tahun.*',
  4: 'Serius, Bob? *Tiga tahun?*',
  5: 'Tiga tahun... *nonton orang main.*',
  6: 'Tantangan hari ini: tangga. *Cuma tiga.*',
  7: 'Lompat... mendarat... *gaya!*',
  9: 'Tangga pertama. *Langsung tamat.*',
  10: 'Itu baru *tangga pertama,* Bob.',
  11: 'Ini teknik pro. Namanya, *tiarap strategis.*',
  12: 'Hei! *Dilarang tiduran* di sini!',
  13: 'Terus, datanglah *musuh terbesarku.*',
  14: 'Ayam. *Seekor ayam.*',
  15: 'Pasti dibantu *orang dalam!*',
  16: 'Mending kamu *nonton lagi* aja, Bob.',
  17: 'Oke. Sampai jumpa... *tiga tahun lagi!*',
};
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

// ---------- adegan (satu per kalimat) ----------
const SHOT = {
  1(t) { // Bobi masuk, pose "pemain pro"
    const walk = t < 1, x = walk ? lerp(-220, BOBI.x, eOut(t)) : BOBI.x, sw = Math.sin(t * 14);
    const arms = walk ? [.15 + .5 * sw, .15 - .5 * sw] : [.25, .15 - 2.75 * eBack((t - 1) / .35)];
    cam(1 + .02 * t, 540, 960, 0, () => { world();
      C('bobi', x, BOBI.y - (walk ? Math.abs(sw) * 24 : 0), BOBI.s, { arms, face: FACE.pede, rot: walk ? sw * .04 : 0 });
      C('kubi', KUBI.x, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); piko(480, 1500, .75, -1);
      if (t > 1.2) sparkle(x, 780, t);
    });
    narrTag(150); pop('PEMAIN PRO?!', 320, 120, '#ffd23f', t - 1.1, -.04);
  },
  2(t) { // Neng Kubi menegur
    cam(1.5 + .02 * t, 780, 1010, 0, () => { world(); C('bobi', BOBI.x, BOBI.y, BOBI.s, { face: FACE.pede });
      C('kubi', KUBI.x, KUBI.y, KUBI.s, { face: FACE.kubiSinis, arms: [.15, .15 - .6 * lipOf('kubi')] }); piko(480, 1500, .75, -1); });
  },
  3(t) { // Bobi membusungkan dada
    const puff = 1 + .05 * Math.sin(t * 5);
    cam(1.5 + .03 * t, 310, 1010, 0, () => { world();
      C('bobi', BOBI.x, BOBI.y, BOBI.s, { face: t > 1.3 ? { eye: 'star', brow: [10, 10], mouth: 'grin' } : FACE.pede, arms: [.55, .55], sq: puff });
      C('kubi', KUBI.x, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); });
    narrTag(150); pop('3 TAHUN!', 320, 140, '#ffd23f', t - 1.3, .05);
  },
  4(t) { // Kubi curiga, Bobi mulai panik
    cam(1.18, 560, 1060, 0, () => { world(); C('bobi', BOBI.x, BOBI.y, BOBI.s, { face: FACE.panik });
      C('kubi', KUBI.x, KUBI.y, KUBI.s, { face: FACE.kubiCuriga, arms: [.15, -.7] }); piko(480, 1500, .75, -1); });
  },
  5(t) { // close-up: "nonton orang main"
    const z = 1.25 - .25 * eOut(t / .2);
    sky('#ffb44a', '#ff7a2f'); g.save(); g.translate(540, 900); g.rotate(t * .25); g.translate(-540, -900);
    speed(540, 900, 'rgba(255,255,255,.28)', 'rgba(255,255,255,0)'); g.restore();
    cam(z, 540, 1500, t < .3 ? 14 : 0, () => { g.save(); g.translate(540, 1500); g.scale(1.75, 1.75); g.translate(-540, -1500);
      C('bobi', 540, 1820, 1, { face: FACE.kaget, arms: [.4, .4] }); g.restore(); });
    narrTag(150); pop('NONTON DOANG.', 330, 118, '#ffffff', t - .05); star(180, 430, 46, '#ffd23f'); star(910, 250, 38, '#ffd23f');
  },
  6(t) { // kamera geser ke tangga
    cam(1.2, lerp(420, 800, eInOut(t / 2.5)), 1010, 0, () => { world();
      C('bobi', 560, BOBI.y, BOBI.s, { face: { look: 16, brow: [-10, 10], mouth: 'grin' }, arms: [.25, .25] });
      C('kubi', 1040, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); piko(420, 1500, .75, 1); });
    narrTag(150); pop('CUMA 3 TANGGA', 320, 112, '#ffd23f', t - 1.6, -.03);
  },
  7(t) { // "Lompat... mendarat... gaya!" lalu lompat
    const jt = clamp((t - 2.5) / .6), x = lerp(560, 690, jt), y = BOBI.y - Math.sin(jt * Math.PI) * 260;
    const crouch = t < 2.5 ? 1 - .12 * Math.sin(clamp(t / 2.5) * Math.PI) : 1;
    cam(1.25, 660, 1000, 0, () => { world();
      C('bobi', x, y, BOBI.s, { face: t < 2.5 ? FACE.pede : { eye: 'star', brow: [10, 10], mouth: 'open' }, arms: jt > 0 ? [-2.6, -2.6] : [.5, .5], sq: crouch, rot: jt * .25 });
      C('kubi', 1040, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); });
  },
  bruk(t) { // jatuh tengkurap
    cam(1.25, 660, 1000, t < .4 ? 18 * (1 - t / .4) : 0, () => { world(); bobiLying(745, FACE.pingsan);
      C('kubi', 1040, KUBI.y, KUBI.s, { face: FACE.kaget }); dust(560, GY + 10, t); });
    pop('BRUK!', 320, 170, '#ffffff', t, .06);
  },
  9(t) { // "Langsung tamat."
    cam(1.35, 470, 1150, 0, () => { world(); bobiLying(745, FACE.pingsan); C('kubi', 1040, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); });
    narrTag(150); pop('TAMAT.', 320, 150, '#c9ced6', t - 1.1);
  },
  10(t) { // Kubi mendekat
    const kx = lerp(1040, 930, eOut(t / .8));
    cam(1.2, 640, 1060, 0, () => { world(); bobiLying(745, FACE.pingsan);
      C('kubi', kx, KUBI.y - (t < .8 ? Math.abs(Math.sin(t * 14)) * 16 : 0), KUBI.s, { face: { look: -20, brow: [-6, 6], mouth: 'smirk', blush: true } }); });
  },
  11(t) { // "tiarap strategis" (sambil tetap tiarap)
    cam(1.6, 300, 1240, 0, () => { world(); bobiLying(745, { look: 0, brow: [-10, 10], mouth: 'grin' }); C('kubi', 930, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); });
    pop('TIARAP STRATEGIS', 320, 104, '#ffd23f', t - 1.9, -.03); if (t > 2) sparkle(540, 330, t, 6, 420);
  },
  priit(t) { // Om Blok datang
    const bx = lerp(1350, 880, eOut(t / .45));
    cam(1.05, 600, 1000, 6, () => { world(); bobiLying(745, FACE.kaget); C('kubi', lerp(930, 1060, eOut(t / .45)), KUBI.y, KUBI.s, { face: FACE.kaget });
      C('blok', bx, 1420, 1, { face: FACE.galak, arms: [.2, 1.9], prop: 'whistle' }); });
    pop('PRIIIT!', 320, 160, '#ffffff', t, .05);
  },
  12(t) { // Om Blok menegur
    cam(1.35, 830, 980, 0, () => { world(); bobiLying(745, FACE.kaget); C('kubi', 1060, KUBI.y, KUBI.s, { face: FACE.kubiSinis });
      C('blok', 880, 1420, 1, { face: FACE.galak, arms: [.2, -1.0 - .8 * lipOf('blok')], prop: 'whistle' }); });
  },
  13(t) { // "musuh terbesarku" (dramatis)
    const z = 1.1 + .12 * t / 3.7;
    cam(z, 700, 1000, 0, () => { world(); bobiLying(745, FACE.kaget);
      g.save(); g.globalAlpha = .95; g.filter = 'brightness(0)'; piko(STEP(1).x, STEP(1).y, 1.7, -1); g.restore(); });
    darken(.5); narrTag(150); pop('MUSUH TERBESARKU...', 320, 96, '#ff6b6b', t - .4);
  },
  14(t) { // Piko melompat 3 tangga dengan santai
    let px = 520, py = GY - 100;
    [0, 1, 2].forEach(i => { const ht = clamp((t - .3 - i * .55) / .45); if (ht <= 0) return;
      const from = i ? STEP(i - 1) : { x: 520, y: GY - 100 }, to = STEP(i);
      px = lerp(from.x, to.x, ht); py = lerp(from.y, to.y, ht) - Math.sin(ht * Math.PI) * 90; });
    cam(1.0, 540, 960, 0, () => { world(); bobiLying(745, FACE.kaget);
      piko(px, py, .9, -1); if (t > 2.1) sparkle(px, py - 120, t, 5, 110); });
    narrTag(150); if (t < 2) pop('AYAM.', 320, 150, '#ffffff', t - .05); else pop('PIKO NAIK LEVEL!', 320, 104, '#7dff6b', t - 2);
  },
  15(t) { // close-up Bobi berbisik
    cam(1.4, 540, 900, 0, () => { world(); }); darken(.25);
    g.save(); g.translate(540, 1500); g.scale(1.9, 1.9); g.translate(-540, -1500);
    C('bobi', 540, 1860, 1, { face: FACE.curiga, arms: [.3, -1.3 - .15 * Math.sin(t * 6)] }); g.restore();
    pop('ORANG DALAM!', 320, 120, '#ffd23f', t - .8, .04);
  },
  16(t) { // Om Blok menasihati
    cam(1.15, 660, 1020, 0, () => { world(); C('bobi', 470, BOBI.y, BOBI.s, { face: FACE.sedih });
      C('blok', 860, 1420, 1, { face: { look: -12, brow: [-6, -6], mouth: 'flat' }, arms: [.2, .2 - .6 * lipOf('blok')] }); piko(STEP(2).x, STEP(2).y, .9, -1); });
  },
  17(t) { // penutup: hormat
    cam(1.25, 520, 1000, 0, () => { world(); C('bobi', 470, BOBI.y, BOBI.s, { face: FACE.senang, arms: [.2, lerp(.2, -2.5, eBack(t / .4)) + (t > .4 ? .35 * Math.sin(t * 9) : 0)] });
      C('blok', 860, 1420, 1, { face: { eye: 'happy', brow: [0, 0], mouth: 'grin' } }); piko(STEP(2).x, STEP(2).y, .9, -1); });
    narrTag(150); pop('SAMPAI JUMPA!', 320, 124, '#ffd23f', t - .2);
    if (t > 2.2) { const k = eBack((t - 2.2) / .3); g.save(); g.translate(540, 560); g.scale(k, k); g.translate(-540, -560);
      rr(190, 470, 700, 180, 40); fs('#ff4d8d'); bigWord('KOTAK KOCAK', 560, 92, '#ffffff'); g.restore(); }
  },
};

window.drawFrame = function (f) {
  F = f; const t = f / FPS; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  // kalimat aktif = yang terakhir dimulai (jeda antar kalimat menahan adegan sebelumnya)
  CUR = TIMING[0]; for (const d of TIMING) if (d.start <= t) CUR = d;
  const isLine = typeof CUR.id === 'number';
  CUR = Object.assign({}, CUR, { active: isLine && t <= CUR.end + .05 });
  TS = t - CUR.start; SHOT[CUR.id](TS);
  if (isLine) sub(CUR.id, CUR.who);
};
