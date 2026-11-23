// Render video contoh & panduan slot untuk template "Rekap 2026".
// Pakai: node template-capcut/rekap-2026/render.mjs [contoh|slot|test|foto]
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2] || 'contoh';
const FPS = 30;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.error('ERR', e.message));
await p.goto('file://' + path.join(here, 'template.html'));
await p.evaluate(() => window.ready);
if (mode === 'foto') {
  for (let k = 0; k < 16; k++) {
    const url = await p.evaluate(k => window.exportPhoto(k), k);
    fs.writeFileSync(path.join(here, 'contoh-foto', `foto-${String(k + 1).padStart(2, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
  }
} else {
  const total = await p.evaluate(() => window.TOTAL);
  const dir = process.env.FRAMES || path.join(here, '.frames-' + mode);
  fs.mkdirSync(dir, { recursive: true });
  const times = mode === 'test' ? [0.5, 1.6, 2.4, 4.1, 7.8, 9.05, 11, 14.5, 16.6, 17.4] : [...Array(Math.round(total * FPS)).keys()].map(i => i / FPS);
  for (let i = 0; i < times.length; i++) {
    await p.evaluate(([t, m]) => window.drawFrame(t, m), [times[i], mode === 'test' ? 'contoh' : mode]);
    await p.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  console.log('frames', times.length, dir);
}
await b.close();
