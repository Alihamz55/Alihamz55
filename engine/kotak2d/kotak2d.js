// Kotak Kocak 2D: gaya datar, garis tebal, ekspresi lebay. Tokoh orisinal.
const W = 1080, H = 1920, INK = '#2a1f3d', LW = 10;
const cv = document.getElementById('c'), g = cv.getContext('2d');

function rr(x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function fs(fill, lw = LW) { g.fillStyle = fill; g.fill(); g.lineWidth = lw; g.strokeStyle = INK; g.lineJoin = 'round'; g.stroke(); }
function circ(x, y, r) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); }
function shade(x, y, w, h, r) { g.save(); rr(x, y, w, h, r); g.clip(); g.fillStyle = 'rgba(42,31,61,.14)';
  g.fillRect(x + w * 0.72, y, w, h); g.restore(); }

// ---------- wajah ----------
function eyes(cx, cy, s, o) {
  [-1, 1].forEach(k => {
    const ex = cx + k * 62 * s, er = 46 * s;
    circ(ex, cy, er); fs('#fff', 8 * s);
    if (o.eye === 'star') { star(ex, cy, er * .8, '#ffd23f'); return; }
    if (o.eye === 'happy') { g.lineWidth = 11 * s; g.strokeStyle = INK; g.beginPath(); g.arc(ex, cy + er * .35, er * .6, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); return; }
    if (o.eye === 'flat') { g.lineWidth = 9 * s; g.strokeStyle = INK; g.beginPath(); g.moveTo(ex - er * .7, cy); g.lineTo(ex + er * .7, cy); g.stroke(); return; }
    const pr = (o.eye === 'tiny' ? 11 : 22) * s;
    circ(ex + o.look * s, cy + 4 * s, pr); g.fillStyle = INK; g.fill();
    circ(ex + o.look * s + pr * .35, cy - pr * .3, pr * .38); g.fillStyle = '#fff'; g.fill();
  });
}
// alis digambar terakhir (di atas rambut) supaya ekspresi terbaca
function brows(cx, cy, s, o, halo) {
  const b = o.brow || [0, 0];
  const line = (w, col) => { g.lineWidth = w; g.strokeStyle = col; g.lineCap = 'round';
    [-1, 1].forEach((k, i) => { g.beginPath();
      g.moveTo(cx + k * 30 * s, cy - 62 * s + b[i] * s); g.lineTo(cx + k * 98 * s, cy - 62 * s - b[i] * s); g.stroke(); }); };
  if (halo) line(24 * s, halo);
  line(12 * s, INK);
}
function mouth(cx, cy, s, type) {
  g.lineWidth = 9 * s; g.strokeStyle = INK;
  if (typeof type === 'number') { // mulut bicara, 0..1 = seberapa terbuka
    const v = Math.max(0, Math.min(1, type)), h = (14 + 96 * v) * s, w = (70 + 30 * v) * s;
    g.beginPath(); g.roundRect(cx - w / 2, cy - 4 * s, w, h, Math.min(h, w) / 2); fs('#5a1426', 8 * s);
    if (v > .35) { g.save(); g.beginPath(); g.roundRect(cx - w / 2, cy - 4 * s, w, h, Math.min(h, w) / 2); g.clip();
      g.beginPath(); g.ellipse(cx, cy - 4 * s + h, w * .38, h * .3, 0, 0, 7); g.fillStyle = '#ff7f9c'; g.fill(); g.restore(); }
    return; }
  if (type === 'grin') { g.beginPath(); g.moveTo(cx - 70 * s, cy); g.quadraticCurveTo(cx, cy + 95 * s, cx + 70 * s, cy);
    g.closePath(); fs('#6b1e2e', 8 * s); rr(cx - 50 * s, cy + 2 * s, 100 * s, 18 * s, 4 * s); g.fillStyle = '#fff'; g.fill(); }
  else if (type === 'shock') { rr(cx - 50 * s, cy - 22 * s, 100 * s, 112 * s, 44 * s); fs('#5a1426', 8 * s);
    g.save(); rr(cx - 50 * s, cy - 22 * s, 100 * s, 112 * s, 44 * s); g.clip();
    g.beginPath(); g.ellipse(cx, cy + 82 * s, 38 * s, 26 * s, 0, 0, 7); g.fillStyle = '#ff7f9c'; g.fill(); g.restore(); }
  else if (type === 'open') { g.beginPath(); g.moveTo(cx - 75 * s, cy - 10 * s); g.lineTo(cx + 75 * s, cy - 10 * s);
    g.quadraticCurveTo(cx + 70 * s, cy + 110 * s, cx, cy + 110 * s); g.quadraticCurveTo(cx - 70 * s, cy + 110 * s, cx - 75 * s, cy - 10 * s);
    g.closePath(); fs('#5a1426', 8 * s);
    g.save(); g.clip(); g.beginPath(); g.ellipse(cx, cy + 100 * s, 48 * s, 30 * s, 0, 0, 7); g.fillStyle = '#ff7f9c'; g.fill(); g.restore(); }
  else if (type === 'wavy') { g.lineWidth = 9 * s; g.beginPath(); g.moveTo(cx - 60 * s, cy + 20 * s);
    for (let i = 1; i <= 6; i++) g.lineTo(cx - 60 * s + i * 20 * s, cy + 20 * s + (i % 2 ? -14 : 0) * s); g.stroke(); }
  else if (type === 'smirk') { g.beginPath(); g.moveTo(cx - 40 * s, cy + 12 * s); g.quadraticCurveTo(cx + 20 * s, cy + 30 * s, cx + 60 * s, cy - 10 * s); g.stroke(); }
  else if (type === 'flat') { g.beginPath(); g.moveTo(cx - 40 * s, cy + 10 * s); g.lineTo(cx + 40 * s, cy + 10 * s); g.stroke(); }
}
function star(x, y, r, c) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * .45 : r;
  g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); } g.closePath(); fs(c, 7); }

// ---------- tokoh ----------
const T = {
  bobi: { skin: '#e9b48a', pants: '#2f4a7a', shoe: '#f4f4f4', shirt: '#ff8a1f', stripe: '#fff3d6', W: 1 },
  kubi: { skin: '#f3c9a3', pants: '#3e6fb8', shoe: '#7a3fd1', shirt: '#ff9ec7', W: 0.95 },
  blok: { skin: '#c98b5a', pants: '#27325a', shoe: '#1e1e1e', shirt: '#4f7bd9', W: 1.25 },
};
// (x,y)=titik kaki; s=skala; o={who, arms:[sudutKiri,sudutKanan], face:{...}}
function char(x, y, s, o) {
  const c = T[o.who], bw = 230 * c.W * s;
  g.save();
  // kaki
  [-1, 1].forEach(k => { rr(x + (k < 0 ? -bw / 2 + 8 * s : 8 * s), y - 170 * s, bw / 2 - 16 * s, 150 * s, 18 * s); fs(c.pants);
    rr(x + (k < 0 ? -bw / 2 : 4 * s), y - 40 * s, bw / 2 - 4 * s, 44 * s, 18 * s); fs(c.shoe); });
  // lengan (di belakang badan)
  const arm = (k, ang) => { g.save(); g.translate(x + k * (bw / 2 + 6 * s), y - 360 * s); g.rotate(ang * k);
    rr(-42 * s, 0, 84 * s, 200 * s, 28 * s); fs(c.skin);
    rr(-42 * s, 0, 84 * s, 80 * s, 26 * s); fs(c.shirt);
    if (o.prop === 'whistle' && k === 1) { rr(-30 * s, 190 * s, 60 * s, 40 * s, 12 * s); fs('#c9ced6'); }
    g.restore(); };
  if (!o.armsFront) { arm(-1, o.arms[0]); arm(1, o.arms[1]); }
  // badan
  rr(x - bw / 2, y - 380 * s, bw, 220 * s, 36 * s); fs(c.shirt);
  g.save(); rr(x - bw / 2, y - 380 * s, bw, 220 * s, 36 * s); g.clip();
  if (o.who === 'bobi') { g.fillStyle = c.stripe; for (let i = 0; i < 4; i++) g.fillRect(x - bw, y - 350 * s + i * 55 * s, bw * 2, 20 * s); }
  if (o.who === 'kubi') { g.fillStyle = c.pants; g.fillRect(x - 70 * s, y - 300 * s, 140 * s, 160 * s);
    g.fillRect(x - 70 * s, y - 390 * s, 22 * s, 100 * s); g.fillRect(x + 48 * s, y - 390 * s, 22 * s, 100 * s);
    g.fillStyle = '#ffd23f'; g.fillRect(x - 66 * s, y - 300 * s, 14 * s, 14 * s); g.fillRect(x + 52 * s, y - 300 * s, 14 * s, 14 * s); }
  if (o.who === 'blok') { g.fillStyle = '#ffd23f'; g.fillRect(x - bw / 2, y - 380 * s, bw * .32, 220 * s); g.fillRect(x + bw * .18, y - 380 * s, bw * .32, 220 * s);
    g.fillStyle = '#e8eef5'; g.fillRect(x - bw / 2, y - 280 * s, bw * .32, 18 * s); g.fillRect(x + bw * .18, y - 280 * s, bw * .32, 18 * s); }
  g.restore();
  rr(x - bw / 2, y - 380 * s, bw, 220 * s, 36 * s); g.lineWidth = LW; g.strokeStyle = INK; g.stroke();
  shade(x - bw / 2, y - 380 * s, bw, 220 * s, 36 * s);
  head(x, y - 380 * s, s, o);
  if (o.armsFront) { arm(-1, o.arms[0]); arm(1, o.arms[1]); }
  g.restore();
}
// kepala; (x,y)=leher
function head(x, y, s, o) {
  const c = T[o.who], hw = 300 * c.W * s, hh = 280 * s, hx = x - hw / 2, hy = y - hh + 10 * s;
  if (o.who === 'kubi') { rr(hx - 26 * s, hy - 20 * s, hw + 52 * s, hh + 10 * s, 70 * s); fs('#7a3fd1'); }
  rr(hx, hy, hw, hh, 70 * s); fs(c.skin);
  shade(hx, hy, hw, hh, 70 * s);
  const f = o.face, cy = hy + hh * .48;
  if (f.blush) { g.fillStyle = 'rgba(255,110,140,.5)'; [-1, 1].forEach(k => { g.beginPath(); g.ellipse(x + k * 105 * s, cy + 62 * s, 30 * s, 16 * s, 0, 0, 7); g.fill(); }); }
  eyes(x, cy, s, f); mouth(x, cy + 70 * s, s, f.mouth);
  if (f.tears) [-1, 1].forEach(k => {
    const x0 = x + k * 62 * s, y0 = cy + 20 * s, cx1 = x + k * 230 * s, cy1 = cy - 170 * s, x1 = x + k * 300 * s, y1 = cy + 330 * s;
    g.lineCap = 'round';
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(cx1, cy1, x1, y1); g.lineWidth = 46 * s; g.strokeStyle = INK; g.stroke();
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(cx1, cy1, x1, y1); g.lineWidth = 32 * s; g.strokeStyle = '#8fd3ff'; g.stroke();
    for (let t = 0.12; t < 1; t += 0.11) { const u = 1 - t;
      const px = u * u * x0 + 2 * u * t * cx1 + t * t * x1, py = u * u * y0 + 2 * u * t * cy1 + t * t * y1;
      circ(px, py, 7 * s); g.fillStyle = '#e8f7ff'; g.fill(); } });
  if (f.sweat) { g.beginPath(); const sx = x + hw * .46, sy = hy + 60 * s; g.moveTo(sx, sy); g.quadraticCurveTo(sx + 26 * s, sy + 50 * s, sx, sy + 62 * s);
    g.quadraticCurveTo(sx - 26 * s, sy + 50 * s, sx, sy); fs('#8fd3ff', 6 * s); }
  if (o.who === 'bobi') { // rambut jabrik + topi tosca terbalik
    g.beginPath(); g.moveTo(hx - 6 * s, hy + 80 * s);
    for (let i = 0; i <= 6; i++) g.lineTo(hx + i * hw / 6, hy + (i % 2 ? 96 : 62) * s);
    g.lineTo(hx + hw + 6 * s, hy + 20 * s); g.lineTo(hx - 6 * s, hy + 20 * s); g.closePath(); fs('#4a2c1a');
    rr(hx - 14 * s, hy - 40 * s, hw + 28 * s, 110 * s, 50 * s); fs('#14a39a');
    rr(hx + hw - 10 * s, hy + 10 * s, 120 * s, 44 * s, 20 * s); fs('#0f8079');
    circ(x, hy - 38 * s, 16 * s); fs('#ffd23f', 6 * s); }
  if (o.who === 'kubi') { rr(hx - 26 * s, hy - 26 * s, hw + 52 * s, 110 * s, 54 * s); fs('#7a3fd1');
    g.beginPath(); g.moveTo(hx + 20 * s, hy + 80 * s); g.lineTo(hx + 130 * s, hy + 80 * s); g.lineTo(hx + 100 * s, hy + 128 * s); g.closePath(); fs('#7a3fd1');
    rr(hx + hw - 40 * s, hy - 40 * s, 66 * s, 66 * s, 12 * s); fs('#ffd23f'); }
  if (o.who === 'blok') { // kumis kotak + topi satpam
    rr(x - 90 * s, cy + 40 * s, 180 * s, 46 * s, 14 * s); fs('#3a2416');
    rr(hx - 20 * s, hy - 70 * s, hw + 40 * s, 120 * s, 30 * s); fs('#27325a');
    rr(hx - 10 * s, hy + 34 * s, hw + 20 * s, 34 * s, 14 * s); fs('#1b2340');
    star(x, hy - 12 * s, 34 * s, '#ffd23f'); }
  brows(x, cy, s, f, c.skin);
}
function piko(x, y, s, flip = 1) {
  g.save(); g.translate(x, y); g.scale(flip * s, s);
  [-30, 30].forEach(k => { g.lineWidth = 10; g.strokeStyle = '#ff9a1f'; g.beginPath(); g.moveTo(k, -60); g.lineTo(k, 0); g.stroke(); });
  rr(-90, -200, 180, 150, 40); fs('#ffd23f');
  rr(-70, -150, 70, 40, 18); fs('#f1bd1c', 7);
  rr(-24, -238, 48, 44, 12); fs('#ff4d3a');
  [-30, 30].forEach(k => { circ(k, -150 - 15, 13); g.fillStyle = INK; g.fill(); });
  g.beginPath(); g.moveTo(-26, -140); g.lineTo(26, -140); g.lineTo(0, -108); g.closePath(); fs('#ff9a1f', 7);
  g.restore();
}

// ---------- latar & efek ----------
function sky(c1, c2) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function speed(cx, cy, c1, c2) { g.save(); g.translate(cx, cy); for (let i = 0; i < 28; i++) {
  g.rotate(Math.PI * 2 / 28); g.beginPath(); g.moveTo(0, 0); g.lineTo(-90, -2000); g.lineTo(90, -2000); g.closePath();
  g.fillStyle = i % 2 ? c1 : c2; g.fill(); } g.restore(); }
function ground(y) { g.fillStyle = '#5cc94a'; g.fillRect(0, y, W, H - y);
  g.fillStyle = '#4cae3e'; for (let x = 0; x < W; x += 60) g.fillRect(x, y, 30, 18);
  g.lineWidth = LW; g.strokeStyle = INK; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
function cloud(x, y, s) { [[0, 0, 160, 70], [40, -40, 100, 60], [-50, 10, 90, 50]].forEach(([dx, dy, w, h]) => { rr(x + dx * s, y + dy * s, w * s, h * s, 30 * s); fs('#fff', 7); }); }
function stairs(x, y) { for (let i = 0; i < 3; i++) for (let j = 0; j <= i; j++) {
  const bx = x + i * 130, by = y - (j + 1) * 120; rr(bx, by, 130, 120, 10); fs('#a5703f', 8);
  if (j === i) { rr(bx, by, 130, 34, 10); fs('#5cc94a', 8); } } }
function sign(x, y, txt) { rr(x + 70, y - 40, 24, 200, 6); fs('#8a5a2b', 8);
  rr(x, y - 140, 360, 130, 18); fs('#c98f55'); g.font = '700 44px Fredoka'; g.fillStyle = INK; g.textAlign = 'center';
  g.textBaseline = 'middle'; txt.split('\n').forEach((t, i) => g.fillText(t, x + 180, y - 100 + i * 52)); }

// ---------- telop ----------
function bigWord(txt, y, size, col = '#ffd23f') { g.save(); g.font = `700 ${size}px Fredoka`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineJoin = 'round'; g.lineWidth = size * .22; g.strokeStyle = INK; g.strokeText(txt, W / 2, y);
  g.fillStyle = col; g.fillText(txt, W / 2, y); g.restore(); }
function bubble(name, col, text, hl) {
  const y = 1540; rr(80, y, 920, 160, 36); g.fillStyle = col; g.fill(); g.lineWidth = 9; g.strokeStyle = '#fff'; g.stroke();
  rr(110, y - 36, 250, 64, 22); g.fillStyle = INK; g.fill();
  g.font = '700 40px Fredoka'; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(name, 235, y - 4);
  g.font = '700 64px Fredoka'; const full = text + (hl || ''), wFull = g.measureText(full).width;
  let tx = W / 2 - wFull / 2; g.textAlign = 'left'; g.fillStyle = '#fff'; g.fillText(text, tx, y + 85);
  if (hl) { g.fillStyle = '#ffe94a'; g.fillText(hl, tx + g.measureText(text).width, y + 85); }
}
function narrTag(y) { rr(W / 2 - 150, y, 300, 60, 30); g.fillStyle = 'rgba(42,31,61,.85)'; g.fill();
  g.font = '600 36px Fredoka'; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('NARASI · BOBI', W / 2, y + 31); }

// ---------- aset Kenney (CC0) ----------
const IMG = {};
function loadImg(path) { return new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = path; }); }
async function loadKenney() {
  const el = ['cloud1','cloud3','cloud4','cloud6','sun','tree','treeOrange','treeLong','treePine','house1','house2','houseAlt1','houseSmall1','houseSmallAlt2',
    'bush1','bush2','bushAlt1','bushOrange1','fence','treeSmall_green1','treeSmall_greenAlt2'];
  const ly = ['cloudLayer1','cloudLayerB1','hills','hillsLarge','mountains','groundLayer1','groundLayer2'];
  await Promise.all([...el.map(async n => IMG[n] = await loadImg(`assets/kenney/elemen/${n}.png`)),
    ...ly.map(async n => IMG[n] = await loadImg(`assets/kenney/latar/Elements/${n}.png`))]);
}
// gambar elemen; (x,y) = titik bawah-tengah
function el(n, x, y, s = 1, flip = 1) { const im = IMG[n]; if (!im) return;
  g.save(); g.translate(x, y); g.scale(flip, 1); g.drawImage(im, -im.width * s / 2, -im.height * s, im.width * s, im.height * s); g.restore(); }
// lapisan selebar layar; y = tepi bawah lapisan
function layer(n, y, alpha = 1, dx = 0) { const im = IMG[n]; if (!im) return; const k = W / im.width * 1.1;
  g.save(); g.globalAlpha = alpha; g.drawImage(im, -W * .05 + dx, y - im.height * k, im.width * k, im.height * k); g.restore(); }
// latar kampung kartun berwarna (Kenney + rumput kita)
// bukit bergelombang bergaris tebal (gaya kita)
function hill(y, amp, wl, ph, col) { g.beginPath(); g.moveTo(-20, H);
  for (let x = -20; x <= W + 20; x += 10) g.lineTo(x, y - amp * (0.5 + 0.5 * Math.sin(x / wl + ph)));
  g.lineTo(W + 20, H); g.closePath(); fs(col, 8); }
// latar kampung kartun berwarna (elemen Kenney CC0 + bukit dan rumput kita)
function kampung(gy) {
  sky('#3fb0ff', '#bdeaff');
  g.save(); g.translate(890, 560); for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); rr(-12, -150, 24, 50, 12); fs('#ffb52e', 6); } g.restore();
  circ(890, 560, 80); fs('#ffd23f', 8);
  el('cloud4', 170, 640, 1.0); el('cloud3', 640, 520, .8); el('cloud1', 980, 760, .7);
  hill(gy - 250, 120, 140, 1.2, '#a8e66f');
  el('treePine', 120, gy - 190, .9); el('treeLong', 760, gy - 220, .85); el('houseSmallAlt2', 520, gy - 180, 1.4);
  hill(gy - 120, 90, 110, 3.1, '#7ed957');
  el('house2', 840, gy + 6, 1.15); el('houseAlt1', 130, gy + 4, 1.0);
  el('treeOrange', 320, gy + 8, 1.25); el('tree', 1010, gy + 8, 1.2); el('treeLong', 640, gy + 8, 1.1);
  el('fence', 470, gy + 6, 1.2); el('fence', 590, gy + 6, 1.2);
  ground(gy);
  el('bushAlt1', 160, gy + 60, 1.3); el('bush1', 960, gy + 70, 1.3); el('bushOrange1', 540, gy + 120, 1.1);
}

// ---------- adegan ----------
const SCENES = {
  // A: dialog. Lebar, area tutorial.
  a() {
    kampung(1260); stairs(700, 1260); sign(40, 1000, 'TUTORIAL:\nNAIK TANGGA');
    char(250, 1440, 0.95, { who: 'bobi', arms: [0.25, 2.7], face: { look: 6, brow: [-10, 10], mouth: 'grin' } });
    char(640, 1410, 0.88, { who: 'kubi', arms: [0.15, 0.15], face: { look: -14, eye: 'normal', brow: [8, -8], mouth: 'smirk', blush: true } });
    piko(440, 1500, 0.75, -1);
    bigWord('PEMAIN PRO?!', 300, 120);
    bubble('NENG KUBI', 'rgba(150,80,230,.95)', 'Serius, Bob? ', 'Tiga tahun?');
  },
  // B: narasi. Close-up reaksi Bobi, garis kecepatan.
  b() {
    sky('#ffb44a', '#ff7a2f'); speed(540, 900, 'rgba(255,255,255,.28)', 'rgba(255,255,255,0)');
    g.save(); g.translate(540, 1500); g.scale(1.75, 1.75); g.translate(-540, -1500);
    char(540, 1820, 1, { who: 'bobi', arms: [0.4, 0.4], face: { look: 0, eye: 'tiny', brow: [-16, -16], mouth: 'shock', sweat: true } });
    g.restore();
    narrTag(150);
    bigWord('NONTON DOANG.', 330, 118, '#ffffff');
    star(180, 420, 50, '#ffd23f'); star(910, 250, 40, '#ffd23f');
  },
  // C: Om Blok datang (dialog), Bobi tiarap.
  c() {
    kampung(1300); stairs(620, 1300);
    // Bobi tiarap: diputar 90 derajat
    g.save(); g.translate(460, 1330); g.rotate(-Math.PI / 2);
    char(0, 0, 0.62, { who: 'bobi', arms: [3.0, 3.0], face: { look: 0, eye: 'flat', brow: [0, 0], mouth: 'flat' } });
    g.restore();
    char(800, 1420, 1.0, { who: 'blok', arms: [0.2, 1.9], prop: 'whistle', face: { look: -16, brow: [14, 14], mouth: 'shock' } });
    bigWord('PRIIIT!', 330, 150, '#ffffff');
    bubble('OM BLOK', 'rgba(40,70,160,.95)', 'Dilarang ', 'tiduran di sini!');
  },
};
// LEMBAR TOKOH: semua tokoh berdiri berjajar
SCENES.tokoh = () => {
  sky('#fff6e0', '#ffe2b8'); ground(1500);
  bigWord('TOKOH KOTAK KOCAK', 180, 92);
  char(200, 1560, 1.0, { who: 'bobi', arms: [0.2, 0.2], face: { look: 4, brow: [-10, 10], mouth: 'grin' } });
  char(540, 1560, 0.97, { who: 'kubi', arms: [0.15, 0.15], face: { look: -8, brow: [8, -8], mouth: 'smirk', blush: true } });
  char(880, 1560, 0.92, { who: 'blok', arms: [0.15, 0.15], face: { look: -6, brow: [12, 12], mouth: 'flat' } });
  piko(560, 1820, 0.7, 1);
  g.font = '700 46px Fredoka'; g.fillStyle = INK; g.textAlign = 'center';
  [['BOBI', 200], ['NENG KUBI', 540], ['OM BLOK', 880]].forEach(([n, x]) => g.fillText(n, x, 1640));
  g.fillText('PIKO', 700, 1770);
};
// LEMBAR EKSPRESI: 9 ekspresi Bobi
SCENES.ekspresi = () => {
  sky('#58b6ff', '#cfeeff');
  bigWord('EKSPRESI BOBI', 150, 100);
  const L = [
    ['pede', { look: 6, brow: [-10, 10], mouth: 'grin' }],
    ['senang', { eye: 'happy', brow: [6, 6], mouth: 'open', blush: true }],
    ['kaget', { eye: 'tiny', brow: [-16, -16], mouth: 'shock' }],
    ['mata bintang', { eye: 'star', brow: [10, 10], mouth: 'open' }],
    ['nangis', { eye: 'normal', look: 0, brow: [-18, -18], mouth: 'open', tears: true }],
    ['panik', { eye: 'tiny', brow: [-16, -16], mouth: 'wavy', sweat: true }],
    ['curiga', { look: 18, brow: [-12, 12], mouth: 'smirk' }],
    ['pingsan', { eye: 'flat', brow: [0, 0], mouth: 'flat' }],
    ['marah', { look: 0, brow: [18, 18], mouth: 'wavy' }],
  ];
  L.forEach(([n, f], i) => {
    const cx = 190 + (i % 3) * 350, cy = 560 + Math.floor(i / 3) * 520;
    rr(cx - 165, cy - 290, 330, 470, 36); g.fillStyle = 'rgba(255,255,255,.55)'; g.fill();
    g.save(); g.beginPath(); g.roundRect(cx - 165, cy - 290, 330, 470, 36); g.clip();
    head(cx, cy + 80, 0.82, { who: 'bobi', face: Object.assign({ look: 0 }, f) }); g.restore();
    g.font = '700 42px Fredoka'; g.fillStyle = INK; g.textAlign = 'center'; g.fillText(n.toUpperCase(), cx, cy + 140);
  });
};
(async () => {
  if (window.ANIM) { await loadKenney(); await document.fonts.load('700 100px Fredoka'); await document.fonts.load('600 40px Fredoka'); window.__ready = true; return; }
  await loadKenney(); await document.fonts.load('700 100px Fredoka'); await document.fonts.load('600 40px Fredoka');
  SCENES[new URLSearchParams(location.search).get('s') || 'a']();
  window.__done = true;
})();
