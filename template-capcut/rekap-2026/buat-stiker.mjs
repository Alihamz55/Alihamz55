// Membuat stiker PNG transparan untuk template "Rekap 2026".
// Jalankan dari root repo: node template-capcut/rekap-2026/buat-stiker.mjs
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const fontCss = 'file://' + path.resolve(here, '../../engine/pipeline-template/web/fonts/fonts.css');
const out = path.join(here, 'stiker');

const INK = '#1a1206';
const css = `<link rel="stylesheet" href="${fontCss}"><style>
html,body{margin:0;background:transparent;font-family:'Fredoka',sans-serif}
#s{display:inline-block;padding:90px}
.gold{font-weight:700;background:linear-gradient(180deg,#fff7d1 0%,#ffd84a 45%,#f0a020 75%,#ffe9a0 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  -webkit-text-stroke:0;filter:drop-shadow(0 0 3px ${INK}) drop-shadow(0 0 3px ${INK}) drop-shadow(0 10px 0 ${INK}) drop-shadow(0 0 40px rgba(255,200,60,.55));line-height:1}
.putih{font-weight:700;color:#fff;-webkit-text-stroke:12px ${INK};paint-order:stroke fill;line-height:1.05;filter:drop-shadow(0 8px 0 ${INK})}
.lembut{font-weight:500;color:#fff;line-height:1.1;text-shadow:0 4px 18px rgba(0,0,0,.65),0 0 2px rgba(0,0,0,.8)}
</style>`;

const heart = (w, fill = '#ff5d8f') => `<svg width="${w}" height="${w * 0.9}" viewBox="0 0 100 90" style="vertical-align:middle;filter:drop-shadow(0 6px 0 ${INK})">
  <path d="M50 86 C20 64 4 48 4 28 C4 14 15 4 28 4 C38 4 46 10 50 18 C54 10 62 4 72 4 C85 4 96 14 96 28 C96 48 80 64 50 86Z" fill="${fill}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M24 20 C18 22 15 28 16 34" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/></svg>`;

const spark = (x, y, r, c = '#fff6c9') => `<path transform="translate(${x},${y})" d="M0 ${-r} C${r * .12} ${-r * .12} ${r * .12} ${-r * .12} ${r} 0 C${r * .12} ${r * .12} ${r * .12} ${r * .12} 0 ${r} C${-r * .12} ${r * .12} ${-r * .12} ${r * .12} ${-r} 0 C${-r * .12} ${-r * .12} ${-r * .12} ${-r * .12} 0 ${-r}Z" fill="${c}"/>`;

const stiker = {
  '01-2026': `<div class="gold" style="font-size:330px;letter-spacing:6px">2026</div>`,
  '02-tahun-ini-aku': `<div class="lembut" style="font-size:84px">tahun ini aku…</div>`,
  '03-bye-2026': `<div class="putih" style="font-size:150px;display:flex;align-items:center;gap:28px">bye 2026 ${heart(140, '#ffffff')}</div>`,
  '04-hello-2027': `<div class="gold" style="font-size:170px">hello 2027</div>`,
  '05-kilau': `<svg width="520" height="420" viewBox="0 0 520 420">${spark(110, 120, 90)}${spark(330, 70, 50, '#ffd84a')}${spark(420, 250, 110)}${spark(200, 320, 60, '#ffd84a')}${spark(40, 300, 30)}${spark(480, 40, 26)}</svg>`,
  '06-hati': heart(360),
  '07-terima-kasih-2026': `<div class="putih" style="font-size:110px;text-align:center">terima kasih,<br><span class="gold" style="font-size:150px;-webkit-text-stroke:0">2026</span></div>`,
};

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const render = async (name, html, full = false) => {
  const tmp = path.join(os.tmpdir(), 'stiker-' + name + '.html');
  fs.writeFileSync(tmp, '<!doctype html><meta charset="utf-8">' + css + (full ? html : `<div id="s">${html}</div>`));
  await p.goto('file://' + tmp, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  if (full) await p.screenshot({ path: path.join(out, name + '.png'), omitBackground: true });
  else await p.locator('#s').screenshot({ path: path.join(out, name + '.png'), omitBackground: true });
  console.log('ok', name);
};
for (const [n, h] of Object.entries(stiker)) await render(n, h);

// Bingkai film layar penuh (1080x1920) untuk bagian kenangan
await p.setViewportSize({ width: 1080, height: 1920 });
let holes = '';
for (let y = 30; y < 1920; y += 110) holes += `<rect x="22" y="${y}" width="44" height="64" rx="10" fill="#f3ead6" opacity=".9"/><rect x="1014" y="${y}" width="44" height="64" rx="10" fill="#f3ead6" opacity=".9"/>`;
await render('08-bingkai-film', `<svg width="1080" height="1920" style="position:absolute;left:0;top:0">
  <defs><radialGradient id="v" cx="50%" cy="50%" r="70%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>
  <rect width="1080" height="1920" fill="url(#v)"/>
  <rect x="0" y="0" width="88" height="1920" fill="#14100c"/><rect x="992" y="0" width="88" height="1920" fill="#14100c"/>${holes}
  <text x="110" y="1880" font-family="Fredoka" font-weight="500" font-size="40" fill="#ffb347" opacity=".85">2026 ▸ 24A</text></svg>`, true);
await b.close();
