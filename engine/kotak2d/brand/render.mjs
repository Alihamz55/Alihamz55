// node brand/render.mjs  -> banner-kotak-kocak.png, logo-kotak-kocak.png, banner-cek-area-aman.png
import http from 'http'; import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
await new Promise(res => srv.listen(8768, res));
const b = await chromium.launch(); const p = await b.newPage();
p.on('pageerror', e => console.log('[err]', e.message));
for (const [m, out] of [['banner', 'banner-kotak-kocak.png'], ['logo', 'logo-kotak-kocak.png'], ['cek', 'banner-cek-area-aman.png']]) {
  await p.goto(`http://localhost:8768/kotak2d/brand/brand.html?m=${m}`); await p.waitForFunction('window.__done === true', null, { timeout: 60000 });
  const url = await p.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  fs.writeFileSync(process.argv[2] ? path.join(process.argv[2], out) : out, Buffer.from(url.split(',')[1], 'base64')); console.log(out);
}
await b.close(); srv.close();
