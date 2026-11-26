// Render 5 detik video vertikal "Mesin V8 Twin-Turbo" dari figur hairline mesin,
// dengan jam palsu supaya setiap frame pasti. Pakai: node render-mesin.cjs <html> <outdir>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const [html, out] = process.argv.slice(2);
const N = 150;
const FONTS = 'file://' + path.resolve(__dirname, '../pipeline-template/web/fonts/fonts.css');
const NAMA = { intake: 'INTAKE', kepala: 'KEPALA SILINDER', turbo: 'TURBO', puli: 'PULI & SABUK' };
// [frame, lapisan, x viewBox] — x makin ke kanan = makin terbongkar
const PATH = [[14, 'intake', 160], [44, 'kepala', 230], [74, 'turbo', 290], [104, 'puli', 348], [128, null, 0]];

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
  await page.goto('file://' + path.resolve(html) + '?theme=dark&intensity=1');
  await page.addStyleTag({ url: FONTS });
  await page.addStyleTag({ content: `
    *{transition:none!important}
    :root{--ground:#0D0E11}
    body{background:radial-gradient(circle at 50% 48%,#262A33 0,#0D0E11 70%);padding:0;display:block;overflow:hidden;width:1080px;height:1920px}
    main{position:absolute;left:-60px;top:500px;width:1200px;max-width:none}
    .plate{border:none;border-radius:0;overflow:visible}
    .controls,#means,#rules,#name,#read,#error{display:none!important}
    #stage{--hairline-plate:#16181D;--hairline-hi:#FF3B30;--hairline-edge:#D5DAE1;--hairline-mid:#7C8491;--hairline-lo:#3A3F49;--hairline-stroke:3;transform-origin:50% 55%}
    .ov{position:absolute;left:0;right:0;text-align:center;font-family:'Fredoka';font-weight:700}
    #title{top:200px;color:#fff;font-size:92px;letter-spacing:1px;line-height:1}
    #title small{display:block;font-size:40px;font-weight:500;color:#9AA3AF;margin-top:18px;letter-spacing:6px}
    #part{top:1480px;font-size:96px;color:#FF3B30;letter-spacing:3px}
    #step{top:1600px;font-size:38px;font-weight:500;color:#9AA3AF;letter-spacing:8px}
  `});
  await page.evaluate(() => {
    const add = (id, h) => { const d = document.createElement('div'); d.className = 'ov'; d.id = id; d.innerHTML = h; document.body.appendChild(d); };
    add('title', 'MESIN V8<small>TWIN-TURBO · BONGKAR</small>');
    add('part', ''); add('step', '');
  });
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(540, 1880);
  const box = await (await page.$('#stage svg')).boundingBox();
  const vb = (x, y) => [box.x + (x / 400) * box.width, box.y + (y / 320) * box.height];

  // Cari pita tinggi tiap lapisan (pita diam, dari pose istirahat), ambil titik tengahnya.
  const band = {};
  for (let y = 20; y <= 300; y += 4) {
    await page.mouse.move(...vb(200, y));
    const r = (await page.textContent('#read')).split(' ')[0];
    (band[r] = band[r] || []).push(y);
  }
  await page.mouse.move(540, 1880);
  const mid = (k) => band[k][Math.floor(band[k].length / 2)];
  await page.evaluate(() => window.__step(3000)); // kembali ke istirahat

  let label = '', idx = 0;
  for (let f = 0; f < N; f++) {
    const hit = PATH.find((p) => p[0] === f);
    if (hit) {
      if (hit[1]) { await page.mouse.move(...vb(hit[2], mid(hit[1]))); label = NAMA[hit[1]]; idx++; }
      else { await page.mouse.move(540, 1880); label = 'SIAP JALAN'; idx = 0; }
    }
    await page.evaluate(({ f, label, idx, start }) => {
      window.__step(1000 / 30);
      const e = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
      const k = (f - start) / 7, s = f < 14 ? 0 : 0.7 + 0.3 * e(k) + 0.08 * Math.sin(Math.min(k, 1) * Math.PI);
      const p = document.getElementById('part');
      p.textContent = label; p.style.transform = `scale(${s})`; p.style.opacity = f < 14 ? 0 : 1;
      document.getElementById('step').textContent = idx ? `BAGIAN ${idx} / 4` : '';
      const t = document.getElementById('title'); t.style.opacity = e(f / 10); t.style.transform = `translateY(${(1 - e(f / 10)) * -40}px)`;
      const z = 1 + 0.05 * e(f / 150);
      document.getElementById('stage').style.transform = `scale(${z})`;
    }, { f, label, idx, start: hit ? f : (PATH.filter((p) => p[0] <= f).pop() || [0])[0] });
    await page.screenshot({ path: path.join(out, `f${String(f).padStart(4, '0')}.png`) });
  }
  await b.close();
  console.log('pita', Object.fromEntries(Object.entries(band).map(([k, v]) => [k, [v[0], v.at(-1)]])));
})();
