// Banner (2560x1440) dan logo (800x800) channel Kotak Kocak. Tokoh orisinal, tanpa logo platform.
// Area aman banner YouTube (terlihat di semua perangkat): 1546x423 di tengah -> x 507..2053, y 508..931.
const SAFE = { x: 507, y: 508, w: 1546, h: 423 };
function rays(cx, cy, c) { g.save(); g.translate(cx, cy); for (let i = 0; i < 32; i++) { g.rotate(Math.PI / 16);
  g.beginPath(); g.moveTo(0, 0); g.lineTo(-120, -3000); g.lineTo(120, -3000); g.closePath(); g.fillStyle = i % 2 ? c : 'rgba(0,0,0,0)'; g.fill(); } g.restore(); }
function titleAt(x, y, size, rot = -.03) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.font = `700 ${size}px Fredoka`; const w = g.measureText('KOTAK KOCAK').width + size * .9, h = size * 1.55;
  rr(-w / 2, -h / 2, w, h, h * .28); fs('#ff4d8d', size * .1);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = size * .2; g.strokeStyle = INK; g.strokeText('KOTAK KOCAK', 0, size * .04);
  g.fillStyle = '#fff'; g.fillText('KOTAK KOCAK', 0, size * .04); g.restore();
}
function tagline(x, y, txt, size) {
  g.font = `600 ${size}px Fredoka`; const w = g.measureText(txt).width + size * 1.4;
  rr(x - w / 2, y - size * .75, w, size * 1.5, size * .75); fs('#ffd23f', size * .12);
  g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, x, y + 2);
}
function banner(cek) {
  sky('#7b5cff', '#ff8fd0'); rays(1280, 720, 'rgba(255,255,255,.12)');
  // dekorasi luar area aman (terlihat di TV/desktop)
  cloud(260, 260, 1.6); cloud(2300, 330, 1.4); cloud(420, 1150, 1.2); cloud(2180, 1160, 1.3);
  ground(1080); hill(1060, 70, 160, 2.0, '#7ed957'); ground(1110);
  el('treeOrange', 180, 1120, 1.6); el('tree', 2380, 1120, 1.7); el('house2', 2080, 1118, 1.3); el('houseAlt1', 430, 1116, 1.2);
  el('bushAlt1', 700, 1170, 1.6); el('bush1', 1900, 1175, 1.6);
  char(330, 1150, .62, { who: 'blok', arms: [.2, -2.2], face: { eye: 'happy', brow: [0, 0], mouth: 'grin' } });
  piko(2300, 1230, .9, -1);
  // isi area aman: judul, tagline, Bobi & Neng Kubi
  titleAt(1280, 640, 128);
  tagline(1280, 845, 'Kartun lucu dari Dunia Kotak!', 58);
  char(650, 925, .5, { who: 'bobi', arms: [-2.5, .2], face: { look: 10, brow: [-10, 10], mouth: 'open', blush: true } });
  char(1915, 925, .47, { who: 'kubi', arms: [.15, -2.4], face: { look: -10, brow: [6, 6], mouth: 'grin', blush: true } });
  [[560, 560], [2010, 560], [790, 880], [1780, 880], [1280, 520]].forEach(([x, y], i) => star(x, y, 26 + (i % 3) * 8, '#ffd23f'));
  if (cek) { g.save(); g.setLineDash([24, 16]); g.lineWidth = 6; g.strokeStyle = '#00ff66'; g.strokeRect(SAFE.x, SAFE.y, SAFE.w, SAFE.h);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, W, SAFE.y); g.fillRect(0, SAFE.y + SAFE.h, W, H); g.fillRect(0, SAFE.y, SAFE.x, SAFE.h); g.fillRect(SAFE.x + SAFE.w, SAFE.y, W, SAFE.h);
    g.font = '600 40px Fredoka'; g.fillStyle = '#fff'; g.textAlign = 'left'; g.fillText('AREA AMAN (terlihat di HP)', SAFE.x + 10, SAFE.y - 24); g.restore(); }
}
function logo() {
  sky('#ff8fd0', '#7b5cff'); rays(400, 430, 'rgba(255,255,255,.18)');
  // Bobi close-up, kepala di tengah lingkaran
  g.save(); g.translate(365, 440); g.scale(1.42, 1.42); g.translate(-400, -470);
  head(400, 600, 1, { who: 'bobi', face: { look: 6, brow: [-10, 10], mouth: 'grin', blush: true } }); g.restore();
  star(150, 230, 40, '#ffd23f'); star(660, 610, 34, '#ffd23f'); star(140, 600, 26, '#ffd23f');
}
(async () => { await loadKenney(); await document.fonts.load('700 100px Fredoka'); await document.fonts.load('600 40px Fredoka');
  MODE === 'logo' ? logo() : banner(MODE === 'cek'); window.__done = true; })();
