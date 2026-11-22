// Render tokoh Dad Frank Toons (latar transparan). Jalankan dari folder web pipeline: node karakter.mjs <web_dir> <out_dir>
import { chromium } from 'playwright'; import http from 'http'; import fs from 'fs'; import path from 'path';
const [,, root, out] = process.argv;
const srv = http.createServer((r, s) => { const f = path.join(root, decodeURIComponent(r.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : 'text/html' }); s.end(d); }); }).listen(8766);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1800, height: 3000 } });
for (const [n, qs] of [['frank', 'o=frankLawn&e=grin&l=hip&r=up&s=2'], ['cody', 'o=codyCowboy&e=laugh&l=up&r=point&s=5'], ['linda', 'o=lindaRobe&e=stern&l=hip&r=phone&s=3']]) {
  await pg.goto('http://localhost:8766/dfchar.html?' + qs); await pg.waitForFunction('window.ready');
  await pg.locator('#c').screenshot({ path: `${out}/${n}.png`, omitBackground: true }); }
await b.close(); srv.close();
