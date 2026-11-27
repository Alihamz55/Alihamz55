// Akhiran channel Kotak Kocak (6,6 detik). Butuh anim-lib.js. Tombol subscribe generik (tanpa logo platform).
const TEXT = {
  1: 'Eh, jangan lupa *subscribe,* ya! Biar aku *makin pro!*',
  2: 'Biar bisa *nonton terus,* maksudnya.',
};
function bell(x, y, s, wig) {
  g.save(); g.translate(x, y); g.rotate(wig); g.scale(s, s);
  g.beginPath(); g.moveTo(-26, 20); g.quadraticCurveTo(-26, -30, 0, -32); g.quadraticCurveTo(26, -30, 26, 20); g.lineTo(32, 28); g.lineTo(-32, 28); g.closePath(); fs('#ffd23f', 6);
  circ(0, 34, 8); fs('#ffd23f', 5); g.restore();
}
function cursor(x, y, press) {
  g.save(); g.translate(x, y); const k = press ? .85 : 1; g.scale(k, k);
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 74); g.lineTo(18, 58); g.lineTo(32, 88); g.lineTo(46, 81); g.lineTo(32, 52); g.lineTo(56, 52); g.closePath(); fs('#ffffff', 7);
  g.restore();
}
function adegan() {
  const T = F / FPS, kl = WAKTU.klik, done = T >= kl;
  sky('#7b5cff', '#ff8fd0');
  g.save(); g.translate(540, 760); g.rotate(T * .3); g.translate(-540, -760); speed(540, 760, 'rgba(255,255,255,.16)', 'rgba(255,255,255,0)'); g.restore();
  ground(1420); el('treeOrange', 50, 1430, 1.3); el('tree', 1040, 1430, 1.3); el('bushAlt1', 120, 1480, 1.4); el('bush1', 980, 1490, 1.4);
  // logo
  { const k = eBack(T / .35); g.save(); g.translate(540, 200); g.scale(k, k); g.rotate(-.03); g.translate(-540, -200);
    rr(170, 110, 740, 180, 46); fs('#ff4d8d', 10); bigWord('KOTAK KOCAK', 202, 104, '#ffffff'); g.restore(); }
  // tombol subscribe generik
  if (T > WAKTU.tombol) {
    const k = eBack((T - WAKTU.tombol) / .3) * (done && T < kl + .15 ? .9 : 1) * (1 + (done ? 0 : .03 * Math.sin(T * 8)));
    g.save(); g.translate(540, 430); g.scale(k, k); g.translate(-540, -430);
    rr(230, 365, 620, 130, 65); fs(done ? '#4f7bd9' : '#ff3b3b', 10);
    bell(330, 425, 1.1, done ? Math.sin(T * 30) * .35 * Math.max(0, 1 - (T - kl) / 1) : 0);
    g.font = '700 60px Fredoka'; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(done ? 'TERIMA KASIH!' : 'SUBSCRIBE', 580, 432); g.restore();
    if (done) sparkle(540, 430, T, 7, 360);
    // kursor datang lalu klik
    const ct = clamp((T - (kl - .7)) / .6), cx = lerp(980, 640, eInOut(ct)), cy = lerp(1000, 450, eInOut(ct));
    if (T > kl - .7 && T < kl + .8) cursor(cx, cy, Math.abs(T - kl) < .12);
  }
  // tokoh
  const kx = lerp(1350, 790, eOut((T - 3.55) / .4));
  C('bobi', 290, 1450, 1.18, { face: T < kl ? { look: 8, brow: [-10, 10], mouth: 'grin' } : { eye: 'star', brow: [10, 10], mouth: 'grin' },
    arms: [.2, -2.5 + .35 * Math.sin(T * 9)] });
  if (T > 3.55) C('kubi', kx, 1440, 1.08, { face: { look: -18, brow: [8, -8], mouth: 'smirk', blush: true }, arms: [.15, .15] });
  piko(545, 1470 - Math.abs(Math.sin(T * 7)) * 40, .75, 1);
}
const SHOT = { 1: adegan, 2: adegan };
