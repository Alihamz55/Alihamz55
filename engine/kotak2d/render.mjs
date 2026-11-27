// node render.mjs a,b,c  → tes-a.png, tes-b.png, tes-c.png
import http from 'http'; import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
await new Promise(res => srv.listen(8766, res));
const b = await chromium.launch();
for (const s of (process.argv[2] || 'a').split(',')) {
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto(`http://localhost:8766/kotak2d/index.html?s=${s}`);
  await p.waitForFunction('window.__done === true', null, { timeout: 60000 });
  await p.screenshot({ path: `tes-${s}.png` }); await p.close();
}
await b.close(); srv.close();
