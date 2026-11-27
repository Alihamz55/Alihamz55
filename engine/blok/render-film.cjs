// Render frame film ke JPG.
//   node render-film.cjs test "0,60,300"     -> test/fNNNNN.jpg
//   node render-film.cjs frames "0-599"       -> frames/fNNNNN.jpg (lewati yang sudah ada)
// Jalankan dari folder kerja yang berisi film.html, film.js, avatar.js, words.json, node_modules/three.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const [mode = 'test', spec = '0'] = process.argv.slice(2);
const outDir = mode === 'test' ? 'test' : 'frames'; fs.mkdirSync(outDir, { recursive: true });
const list = spec.split(',').flatMap(s => { const [a, b] = s.split('-').map(Number); return b === undefined ? [a] : Array.from({ length: b - a + 1 }, (_, i) => a + i); });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const srv = http.createServer((q, s) => {
  const f = path.join(process.cwd(), decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); s.end(d); });
}).listen(0, async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('[err]', e.message));
  p.on('console', m => { if (m.type() === 'error') console.log('[page]', m.text()); });
  await p.goto(`http://localhost:${srv.address().port}/film.html`);
  await p.waitForFunction('window.__ready', null, { timeout: 120000 });
  const t0 = Date.now(); let n = 0;
  for (const f of list) {
    const out = path.join(outDir, `f${String(f).padStart(5, '0')}.jpg`);
    if (mode !== 'test' && fs.existsSync(out)) continue;
    const url = await p.evaluate((f) => window.renderFrame(f), f);
    fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); n++;
    if (n % 50 === 0) console.log(`${f} (${((Date.now() - t0) / n / 1000).toFixed(2)} dtk/frame)`);
  }
  console.log('selesai', n, 'frame', ((Date.now() - t0) / Math.max(1, n) / 1000).toFixed(2), 'dtk/frame');
  await b.close(); srv.close();
});
