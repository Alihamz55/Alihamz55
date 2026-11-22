// node render.mjs  -> logo.png (800x800), banner.png (2560x1440)
import { chromium } from 'playwright'; import path from 'path';
const d = path.dirname(new URL(import.meta.url).pathname);
const b = await chromium.launch();
for (const [n, w, h] of [['logo', 800, 800], ['banner', 2560, 1440]]) {
  const pg = await b.newPage({ viewport: { width: w, height: h } });
  await pg.goto('file://' + d + '/' + n + '.html'); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
  await pg.screenshot({ path: d + '/' + n + '.png' }); await pg.close(); }
await b.close();
