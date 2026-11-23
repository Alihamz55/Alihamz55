// Overlay PNG transparan 1080x1920 untuk template "Lirik Simple" (gaya pemutar musik, tanpa logo merek).
// Jalankan dari root repo: node template-capcut/lirik-simple/buat-overlay.mjs
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const fontCss = 'file://' + path.resolve(here, '../../engine/pipeline-template/web/fonts/fonts.css');
const css = `<link rel="stylesheet" href="${fontCss}"><style>html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden;font-family:'Fredoka',sans-serif}.a{position:absolute}</style>`;
const ico = {
  prev: `<svg width="70" height="70" viewBox="0 0 70 70"><rect x="10" y="14" width="8" height="42" rx="3" fill="#fff"/><path d="M60 14v42L22 35z" fill="#fff"/></svg>`,
  pause: `<svg width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="55" r="52" fill="#fff"/><rect x="38" y="32" width="11" height="46" rx="4" fill="#1b1b24"/><rect x="61" y="32" width="11" height="46" rx="4" fill="#1b1b24"/></svg>`,
  next: `<svg width="70" height="70" viewBox="0 0 70 70"><rect x="52" y="14" width="8" height="42" rx="3" fill="#fff"/><path d="M10 14v42l38-21z" fill="#fff"/></svg>`,
  heart: `<svg width="60" height="56" viewBox="0 0 100 90"><path d="M50 86C20 64 4 48 4 28 4 14 15 4 28 4c10 0 18 6 22 14 4-8 12-14 22-14 13 0 24 10 24 24 0 20-16 36-46 58z" fill="#ff5d8f"/></svg>`,
  loop: `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#fffc" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 26v-4a10 10 0 0 1 10-10h28l-7-7M48 30v4a10 10 0 0 1-10 10H10l7 7"/></svg>`,
};
const pages = {
  // Kartu pemutar musik: kotak kiri untuk foto kecil, ruang judul & penyanyi diketik di CapCut
  '01-kartu-pemutar': `<div class="a" style="left:60px;top:1400px;width:960px;height:400px;border-radius:48px;background:rgba(20,20,30,.55);border:2px solid rgba(255,255,255,.25);backdrop-filter:blur(2px)"></div>
    <div class="a" style="left:100px;top:1440px;width:150px;height:150px;border-radius:26px;background:linear-gradient(135deg,#ff9a8b,#a18cd1);display:flex;align-items:center;justify-content:center;font-size:84px;color:#fff">♪</div>
    <div class="a" style="left:880px;top:1485px">${ico.heart}</div>
    <div class="a" style="left:100px;top:1640px;width:880px;height:10px;border-radius:5px;background:rgba(255,255,255,.3)"></div>
    <div class="a" style="left:110px;top:1700px">${ico.loop}</div>
    <div class="a" style="left:330px;top:1690px">${ico.prev}</div>
    <div class="a" style="left:485px;top:1670px">${ico.pause}</div>
    <div class="a" style="left:680px;top:1690px">${ico.next}</div>
    <div class="a" style="left:905px;top:1700px;opacity:.8">${ico.loop.replace('M8 26', 'M8 26').replace('stroke="#fffc"', 'stroke="#fff8"')}</div>`,
  // Bayangan gelap atas & bawah supaya lirik selalu terbaca
  '02-gradasi-baca': `<div class="a" style="left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 38%,rgba(0,0,0,.35) 50%,rgba(0,0,0,0) 62%,rgba(0,0,0,.55) 100%)"></div>`,
  // Label kecil "sedang diputar" di atas
  '03-label-diputar': `<div class="a" style="left:0;width:1080px;top:190px;text-align:center;color:#fffd;font-weight:500;font-size:40px;letter-spacing:8px;text-shadow:0 2px 10px #0008">♪  SEDANG DIPUTAR  ♪</div>`,
  // Bingkai polaroid untuk varian estetik
  '04-bingkai-polaroid': `<div class="a" style="left:110px;top:300px;width:860px;height:1060px;border:44px solid #fbf7ef;border-bottom-width:170px;border-radius:10px;box-shadow:0 20px 50px #0007;box-sizing:border-box;transform:rotate(-2deg)"></div>`,
};
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [name, html] of Object.entries(pages)) {
  const tmp = path.join(os.tmpdir(), 'lirik-' + name + '.html');
  fs.writeFileSync(tmp, '<!doctype html><meta charset="utf-8">' + css + html);
  await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(here, 'overlay', name + '.png'), omitBackground: true });
  console.log('ok', name);
}
await b.close();
