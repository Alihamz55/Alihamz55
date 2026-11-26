// Render 5 detik video vertikal dari figur hairline (timbangan) dengan jam palsu,
// supaya setiap frame pasti (deterministik). Pakai: node render-video.cjs <html> <outdir>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const [html, out] = process.argv.slice(2);
const FPS = 30, N = 150;
const FONTS = 'file://' + path.resolve(__dirname, '../pipeline-template/web/fonts/fonts.css');

// Alur 5 detik: [frame, aksi]
const MOVES = { 12: [356, 170], 66: [44, 170] };
const KICK = 66; // zoom kecil saat piring cabai "jatuh"

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => {
    let T = 0, id = 0; const q = new Map();
    performance.now = () => T;
    window.requestAnimationFrame = (cb) => { q.set(++id, cb); return id; };
    window.cancelAnimationFrame = (i) => q.delete(i);
    window.__step = (ms) => { T += ms; const c = [...q.values()]; q.clear(); c.forEach((f) => f(T)); };
  });
  await page.goto('file://' + path.resolve(html) + '?theme=light&intensity=1');
  await page.addStyleTag({ url: FONTS });
  await page.addStyleTag({ content: `
    *{transition:none!important}
    body{background:#FFF1D6;padding:0;display:block;overflow:hidden;width:1080px;height:1920px}
    main{position:absolute;left:-80px;top:520px;width:1240px;max-width:none}
    .plate{border:none;border-radius:0;overflow:visible}
    .controls,#means,#rules,#name,#read,#error{display:none!important}
    #stage{--hairline-plate:#FFF8EA;--hairline-hi:#D8342A;--hairline-edge:#5B3A2B;--hairline-mid:#9C7A66;--hairline-lo:#D8BFA2;--hairline-stroke:3.4;transform-origin:50% 60%}
    .ov{position:absolute;left:0;right:0;text-align:center;font-family:'Fredoka';font-weight:700;opacity:0}
    #banner{top:190px}
    #banner span{display:inline-block;background:#2B1B14;color:#FFF;font-size:62px;padding:18px 40px;border-radius:28px;transform:rotate(-2deg)}
    #judge{top:1440px;font-size:120px;color:#D8342A;-webkit-text-stroke:10px #2B1B14;paint-order:stroke fill;letter-spacing:2px}
    #punch{top:1600px}
    #punch span{display:inline-block;background:#FFD43B;color:#2B1B14;font-size:66px;padding:16px 36px;border-radius:24px;border:7px solid #2B1B14;transform:rotate(1.5deg)}
    #cap{bottom:60px;font-size:30px;font-weight:500;color:#7A5646;opacity:1}
  `});
  await page.evaluate(() => {
    const add = (id, h) => { const d = document.createElement('div'); d.className = 'ov'; d.id = id; d.innerHTML = h; document.body.appendChild(d); };
    add('banner', '<span>Mang Ujang nimbang cabai...</span>');
    add('judge', '7 BIJI CABAI');
    add('punch', '<span>...beratnya kayak cicilan!</span>');
    add('cap', 'Konten komedi. Semua tokoh fiktif.');
  });
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(540, 1880); // di luar figur: posisi "rest"
  const box = await (await page.$('#stage svg')).boundingBox();
  const vb = ([x, y]) => [box.x + (x / 400) * box.width, box.y + (y / 320) * box.height];


  for (let f = 0; f < N; f++) {
    if (MOVES[f]) await page.mouse.move(...vb(MOVES[f]), { steps: 1 });
    await page.evaluate(({ f, KICK }) => {
      window.__step(1000 / 30);
      const o = (id, v, s) => { const e = document.getElementById(id); e.style.opacity = v; e.style.transform = `scale(${s})`; };
      const ease = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
      const sc = (f0) => { const t = (f - f0) / 7; return t < 0 ? 0.6 : t < 1 ? 0.6 + 0.55 * ease(t) - 0.15 * ease(t) * ease(t) : 1; };
      o('banner', f >= 2 ? 1 : 0, sc(2));
      o('judge', f >= 74 ? 1 : 0, sc(74));
      o('punch', f >= 98 ? 1 : 0, sc(98));
      const k = f - KICK, z = k >= 0 && k < 14 ? 1 + 0.07 * Math.sin((k / 14) * Math.PI) : 1;
      document.getElementById('stage').style.transform = `scale(${z})`;
    }, { f, KICK });
    await page.screenshot({ path: path.join(out, `f${String(f).padStart(4, '0')}.png`) });
  }
  await b.close();
  console.log('frames', N);
})();
