// Render gambar contoh: node render.cjs hero out.png  (mode: hero | faces)
// Jalankan dari folder yang punya index.html, avatar.js, dan node_modules/three.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const [mode = 'hero', out = mode + '.png'] = process.argv.slice(2);
const types = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http.createServer((q, s) => {
  const f = path.join(process.cwd(), decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); }
    s.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); s.end(d); });
}).listen(0, async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('console', m => console.log('[page]', m.text())); p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto(`http://localhost:${srv.address().port}/index.html?mode=${mode}`);
  await p.waitForFunction('window.__done', null, { timeout: 120000 });
  await p.screenshot({ path: out });
  await b.close(); srv.close(); console.log('ok', out);
});
