// Membuat overlay PNG transparan 1080x1920 untuk template CapCut HP (gaya viral, umum).
// Jalankan: node template-capcut/buat-overlay.mjs   (dari root repo)
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
const fontCss = 'file://' + path.resolve(here, '../engine/pipeline-template/web/fonts/fonts.css');
const out = path.join(here, 'viral');

const INK = '#14101a';
const base = `<link rel="stylesheet" href="${fontCss}"><style>
html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden;font-family:'Fredoka',sans-serif;font-weight:700}
.abs{position:absolute}
.box{border:10px solid ${INK};border-radius:44px;box-shadow:0 16px 0 ${INK}}
.txt{color:#fff;-webkit-text-stroke:14px ${INK};paint-order:stroke fill;text-align:center;line-height:1}
</style>`;

const star = (cx, cy, r1, r2, n, fill, stroke = INK, sw = 10) => {
  let pts = [];
  for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1, a = Math.PI * i / n - Math.PI / 2; pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
  return `<polygon points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
};

const warnaSub = [['hijau', '#2f9e44'], ['biru', '#1c7ed6'], ['pink', '#e64980'], ['oranye', '#f76707']];
const stiker = (left, top, w, bg, teks, size, rot = -4, color = '#fff') => `<div class="abs box" style="left:${left}px;top:${top}px;width:${w}px;height:150px;background:${bg};transform:rotate(${rot}deg);display:flex;align-items:center;justify-content:center">
     <div class="txt" style="font-size:${size}px;white-space:nowrap;color:${color}">${teks}</div></div>`;

const pages = {
  // Papan hook kosong di atas: ketik teks hook di CapCut di atas papan ini
  '01-papan-hook': `<div class="abs box" style="left:70px;top:150px;width:920px;height:240px;background:#ffe14a"></div>
    <svg class="abs" style="left:0;top:0" width="1080" height="600">${star(110, 170, 70, 32, 8, '#ff6b2c')}${star(975, 370, 56, 26, 8, '#4dabf7')}</svg>`,
  // Papan subtitle (4 warna) dengan label kosong untuk nama pembicara
  ...Object.fromEntries(warnaSub.map(([id, warna], i) => [`0${2 + i}-subtitle-${id}`,
    `<div class="abs box" style="left:60px;top:1500px;width:960px;height:230px;background:rgba(20,16,26,0.82);border-color:${warna}"></div>
     <div class="abs box" style="left:100px;top:1440px;width:300px;height:76px;background:${warna};border-width:8px;border-radius:30px;box-shadow:0 8px 0 ${INK}"></div>`])),
  // Ledakan bintang untuk punchline (taruh di belakang kata kunci)
  '06-ledakan-bintang': `<svg class="abs" style="left:0;top:0" width="1080" height="1920">${star(540, 960, 460, 260, 14, '#ffe14a')}${star(540, 960, 300, 190, 14, '#ff6b2c', INK, 8)}</svg>`,
  '07-tunggu-ending': stiker(140, 470, 800, '#e8344a', 'TUNGGU ENDINGNYA!', 72),
  '08-plot-twist': stiker(190, 760, 700, '#7048e8', 'PLOT TWIST!', 96, 3),
  '09-tombol-follow': `<div class="abs box" style="left:300px;top:1180px;width:480px;height:150px;background:#e8344a;display:flex;align-items:center;justify-content:center;gap:22px">
     <svg width="80" height="80" viewBox="0 0 80 80"><path d="M40 12v56M12 40h56" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M40 12v56M12 40h56" stroke="#ffe14a" stroke-width="10" stroke-linecap="round"/></svg>
     <div class="txt" style="font-size:76px">FOLLOW</div></div>`,
  '10-bersambung-part2': `<div class="abs box" style="left:120px;top:780px;width:840px;height:330px;background:#4dabf7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">
     <div class="txt" style="font-size:70px">BERSAMBUNG...</div><div class="txt" style="font-size:120px;color:#ffe14a">PART 2</div></div>`,
  '11-label-part1': `<div class="abs box" style="left:60px;top:430px;padding:8px 30px;background:#ffe14a;border-width:8px;border-radius:28px;box-shadow:0 8px 0 ${INK}">
     <div class="txt" style="font-size:56px;color:${INK};-webkit-text-stroke:0">PART 1</div></div>`,
  // Panah penunjuk (geser/putar di CapCut)
  '12-panah': `<svg class="abs" style="left:0;top:0" width="1080" height="1920"><path d="M300 820 L640 820 L640 720 L860 940 L640 1160 L640 1060 L300 1060 Z" fill="#ffe14a" stroke="${INK}" stroke-width="14" stroke-linejoin="round"/></svg>`,
};

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [name, html] of Object.entries(pages)) {
  const tmp = path.join(os.tmpdir(), 'overlay-' + name + '.html');
  fs.writeFileSync(tmp, '<!doctype html><meta charset="utf-8">' + base + html);
  await p.goto('file://' + tmp, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(out, name + '.png'), omitBackground: true });
  console.log('ok', name);
}
await b.close();
