// Generator paket stiker "Si Oyen" — kucing oren khas Indonesia.
// Jalankan: node stiker/buat-stiker.js  → hasil di stiker/png, stiker/webp, stiker/svg
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = __dirname;
const C = { o: '#F7A440', od: '#E07B1F', line: '#3B2314', pink: '#FF8FA3', cream: '#FFE9C7' };

// ---------- bagian karakter ----------
const ears = `
  <path d="M150 190 L160 95 L225 150 Z" fill="${C.o}" stroke="${C.line}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M362 190 L352 95 L287 150 Z" fill="${C.o}" stroke="${C.line}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M165 165 L170 118 L205 148 Z" fill="${C.pink}"/>
  <path d="M347 165 L342 118 L307 148 Z" fill="${C.pink}"/>`;
const head = `
  <ellipse cx="256" cy="225" rx="125" ry="100" fill="${C.o}" stroke="${C.line}" stroke-width="8"/>
  <path d="M236 128 q20 22 40 0 M244 128 l0 28 M268 128 l0 28" stroke="${C.od}" stroke-width="9" stroke-linecap="round" fill="none"/>
  <path d="M133 215 l26 6 M131 240 l26 0 M379 215 l-26 6 M381 240 l-26 0" stroke="${C.od}" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="256" cy="262" rx="58" ry="38" fill="${C.cream}"/>`;
const body = (y = 0) => `
  <ellipse cx="256" cy="${375 + y}" rx="105" ry="80" fill="${C.o}" stroke="${C.line}" stroke-width="8"/>
  <ellipse cx="256" cy="${390 + y}" rx="60" ry="50" fill="${C.cream}"/>
  <path d="M352 ${395 + y} q70 -10 55 -80" stroke="${C.line}" stroke-width="30" stroke-linecap="round" fill="none"/>
  <path d="M352 ${395 + y} q70 -10 55 -80" stroke="${C.o}" stroke-width="16" stroke-linecap="round" fill="none"/>
  <ellipse cx="215" cy="${448 + y}" rx="30" ry="18" fill="${C.o}" stroke="${C.line}" stroke-width="8"/>
  <ellipse cx="297" cy="${448 + y}" rx="30" ry="18" fill="${C.o}" stroke="${C.line}" stroke-width="8"/>`;
const blush = `<ellipse cx="180" cy="258" rx="20" ry="12" fill="${C.pink}" opacity=".85"/><ellipse cx="332" cy="258" rx="20" ry="12" fill="${C.pink}" opacity=".85"/>`;
const paw = (x, y, r = 24) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.o}" stroke="${C.line}" stroke-width="8"/>`;

const eyes = {
  normal: `<ellipse cx="208" cy="220" rx="15" ry="20" fill="${C.line}"/><ellipse cx="304" cy="220" rx="15" ry="20" fill="${C.line}"/><circle cx="213" cy="212" r="6" fill="#fff"/><circle cx="309" cy="212" r="6" fill="#fff"/>`,
  happy: `<path d="M190 226 q18 -26 36 0 M286 226 q18 -26 36 0" stroke="${C.line}" stroke-width="9" stroke-linecap="round" fill="none"/>`,
  laugh: `<path d="M190 205 l32 15 l-32 15 M322 205 l-32 15 l32 15" stroke="${C.line}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  shock: `<circle cx="206" cy="218" r="24" fill="#fff" stroke="${C.line}" stroke-width="7"/><circle cx="306" cy="218" r="24" fill="#fff" stroke="${C.line}" stroke-width="7"/><circle cx="206" cy="220" r="8" fill="${C.line}"/><circle cx="306" cy="220" r="8" fill="${C.line}"/>`,
  sleepy: `<path d="M188 224 q20 10 40 0 M284 224 q20 10 40 0" stroke="${C.line}" stroke-width="9" stroke-linecap="round" fill="none"/>`,
  heart: [208, 304].map(x => `<path transform="translate(${x} 222) scale(1.5)" d="M0 10 C-18 -2 -12 -16 0 -8 C12 -16 18 -2 0 10Z" fill="#FF3B5C" stroke="${C.line}" stroke-width="3"/>`).join(''),
  wink: `<ellipse cx="208" cy="220" rx="15" ry="20" fill="${C.line}"/><circle cx="213" cy="212" r="6" fill="#fff"/><path d="M286 224 q18 -22 36 0" stroke="${C.line}" stroke-width="9" stroke-linecap="round" fill="none"/>`,
  stars: [208, 304].map(x => `<path transform="translate(${x} 220)" d="M0 -22 L6 -7 L22 -7 L9 3 L14 19 L0 9 L-14 19 L-9 3 L-22 -7 L-6 -7Z" fill="#FFD23F" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`).join(''),
};
const mouths = {
  w: `<path d="M232 262 q12 14 24 0 q12 14 24 0" stroke="${C.line}" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M248 250 l16 0 l-8 8 z" fill="${C.pink}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/>`,
  open: `<path d="M248 250 l16 0 l-8 8 z" fill="${C.pink}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round"/><path d="M226 264 q30 50 60 0 z" fill="#B3263B" stroke="${C.line}" stroke-width="7" stroke-linejoin="round"/><path d="M240 284 q16 -10 32 0 q-16 14 -32 0z" fill="${C.pink}"/>`,
  o: `<path d="M248 250 l16 0 l-8 8 z" fill="${C.pink}" stroke="${C.line}" stroke-width="4"/><ellipse cx="256" cy="282" rx="14" ry="18" fill="#B3263B" stroke="${C.line}" stroke-width="7"/>`,
  flat: `<path d="M248 250 l16 0 l-8 8 z" fill="${C.pink}" stroke="${C.line}" stroke-width="4"/><path d="M238 274 l36 0" stroke="${C.line}" stroke-width="7" stroke-linecap="round"/>`,
  tongue: `<path d="M248 250 l16 0 l-8 8 z" fill="${C.pink}" stroke="${C.line}" stroke-width="4"/><path d="M232 266 q24 12 48 0" stroke="${C.line}" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M262 270 q2 22 14 20 q10 -4 2 -24z" fill="#FF6B81" stroke="${C.line}" stroke-width="5"/>`,
};
const peci = `<g transform="translate(0 22)"><path d="M178 150 q78 -40 156 0 l-10 -58 q-68 -24 -136 0 z" fill="#1E1E24" stroke="${C.line}" stroke-width="8" stroke-linejoin="round"/><path d="M186 140 q70 -30 140 0" stroke="#3A3A46" stroke-width="5" fill="none"/></g>`;

const cat = (eye, mouth, extra = {}) => `
  ${extra.behind || ''}
  ${body(extra.by || 0)}
  ${ears}${head}
  ${extra.noBlush ? '' : blush}
  ${eyes[eye]}${mouths[mouth]}
  ${extra.hat || ''}
  ${extra.front || ''}`;

// ---------- properti ----------
const esTeh = `<g transform="translate(300 290) rotate(8)">
  <path d="M0 0 L80 0 L70 120 L10 120 Z" fill="#fff" fill-opacity=".55" stroke="${C.line}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M5 30 L75 30 L70 116 L10 116 Z" fill="#C46A1C"/>
  <rect x="16" y="40" width="22" height="20" rx="4" fill="#fff" opacity=".8"/><rect x="42" y="56" width="22" height="20" rx="4" fill="#fff" opacity=".8"/>
  <path d="M50 -50 L44 100" stroke="#2EC4B6" stroke-width="10" stroke-linecap="round"/></g>${paw(318, 380)}`;
const kopi = `<g transform="translate(290 320)">
  <path d="M0 0 h90 v70 q0 30 -30 30 h-30 q-30 0 -30 -30z" fill="#fff" stroke="${C.line}" stroke-width="7"/>
  <path d="M90 15 q35 0 30 30 q-5 25 -30 22" stroke="${C.line}" stroke-width="7" fill="none"/>
  <ellipse cx="45" cy="6" rx="40" ry="7" fill="#4A2A12"/>
  <path d="M25 -15 q-10 -20 5 -35 M50 -15 q-10 -20 5 -35 M75 -15 q-10 -20 5 -35" stroke="#B8A99A" stroke-width="6" stroke-linecap="round" fill="none"/></g>${paw(300, 395)}`;
const bendera = `<g><rect x="120" y="40" width="10" height="330" rx="5" fill="#8B5A2B" stroke="${C.line}" stroke-width="5"/>
  <path d="M130 50 q60 -20 120 0 t110 0 v50 q-55 -20 -110 0 t-120 0z" fill="#E8302F" stroke="${C.line}" stroke-width="6"/>
  <path d="M130 100 q60 -20 120 0 t110 0 v50 q-55 -20 -110 0 t-120 0z" fill="#fff" stroke="${C.line}" stroke-width="6"/></g>`;
const sate = `<g transform="translate(372 270) rotate(-20)">
  <rect x="-4" y="-10" width="8" height="190" fill="#C9A06A" stroke="${C.line}" stroke-width="4"/>
  ${[0, 34, 68, 102].map(y => `<rect x="-20" y="${y}" width="40" height="30" rx="10" fill="#8C3B12" stroke="${C.line}" stroke-width="5"/>`).join('')}</g>${paw(372, 380)}`;
const nasi = `<g transform="translate(256 400)">
  <ellipse cx="0" cy="-12" rx="72" ry="44" fill="#F3B23B" stroke="${C.line}" stroke-width="7"/>
  <circle cx="-30" cy="-30" r="8" fill="#5FAF3B"/><circle cx="20" cy="-35" r="7" fill="#E8302F"/>
  <ellipse cx="18" cy="-48" rx="26" ry="16" fill="#fff" stroke="${C.line}" stroke-width="5"/><circle cx="18" cy="-48" r="9" fill="#FFC531"/>
  <path d="M-90 -8 h180 q-10 60 -90 60 q-80 0 -90 -60z" fill="#3E8FD8" stroke="${C.line}" stroke-width="7"/></g>
  ${paw(170, 390)}${paw(342, 390)}`;
const hearts = [[110, 120, 1.6], [400, 90, 2], [430, 200, 1.2]].map(([x, y, s]) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 10 C-18 -2 -12 -16 0 -8 C12 -16 18 -2 0 10Z" fill="#FF4F6D" stroke="${C.line}" stroke-width="3"/>`).join('');
const tears = `<path d="M182 236 q-10 30 -40 50 q30 10 46 -40z" fill="#5BC0EB" stroke="${C.line}" stroke-width="4"/><path d="M330 236 q10 30 40 50 q-30 10 -46 -40z" fill="#5BC0EB" stroke="${C.line}" stroke-width="4"/>`;
const sweat = `<path d="M380 140 q-22 34 0 44 q22 -10 0 -44z" fill="#5BC0EB" stroke="${C.line}" stroke-width="5"/>`;
const zzz = `<text x="370" y="120" font-size="58" font-weight="800" fill="#7B6CF6" stroke="${C.line}" stroke-width="5" paint-order="stroke">Z</text><text x="420" y="78" font-size="40" font-weight="800" fill="#7B6CF6" stroke="${C.line}" stroke-width="4" paint-order="stroke">z</text>`;
const speed = `<path d="M30 300 h70 M10 350 h90 M40 400 h60" stroke="${C.line}" stroke-width="10" stroke-linecap="round"/>
  <path d="M420 140 q30 -40 10 -90 q40 20 40 70 q20 -20 10 -50 q40 50 0 100z" fill="#FF6B2C" stroke="${C.line}" stroke-width="6" stroke-linejoin="round"/>`;
const sparkle = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -20 Q3 -3 20 0 Q3 3 0 20 Q-3 3 -20 0 Q-3 -3 0 -20Z" fill="#FFD23F" stroke="${C.line}" stroke-width="3"/>`;
const jempol = `<g transform="translate(372 285) rotate(-15)"><rect x="-26" y="-10" width="52" height="46" rx="18" fill="${C.o}" stroke="${C.line}" stroke-width="8"/>
  <rect x="-12" y="-52" width="22" height="50" rx="11" fill="${C.o}" stroke="${C.line}" stroke-width="8"/></g>`;
const hormat = `<path d="M330 200 q60 -60 30 -110" stroke="${C.line}" stroke-width="40" stroke-linecap="round" fill="none"/><path d="M330 200 q60 -60 30 -110" stroke="${C.o}" stroke-width="24" stroke-linecap="round" fill="none"/>`;
const lambai = `<path d="M350 330 q50 -40 50 -120" stroke="${C.line}" stroke-width="40" stroke-linecap="round" fill="none"/><path d="M350 330 q50 -40 50 -120" stroke="${C.o}" stroke-width="24" stroke-linecap="round" fill="none"/>
  <path d="M430 170 q15 15 10 35 M445 150 q25 20 18 50" stroke="${C.line}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
const sembah = `<ellipse cx="236" cy="335" rx="22" ry="36" fill="${C.o}" stroke="${C.line}" stroke-width="8"/><ellipse cx="276" cy="335" rx="22" ry="36" fill="${C.o}" stroke="${C.line}" stroke-width="8"/>`;
const tidur = `<g transform="translate(0 60)">
  <ellipse cx="256" cy="360" rx="190" ry="60" fill="${C.o}" stroke="${C.line}" stroke-width="8"/>
  <path d="M440 360 q40 0 40 -40" stroke="${C.line}" stroke-width="28" stroke-linecap="round" fill="none"/><path d="M440 360 q40 0 40 -40" stroke="${C.o}" stroke-width="14" stroke-linecap="round" fill="none"/>
  ${paw(110, 395, 22)}${paw(170, 405, 22)}</g>`;
const kaget = `${paw(150, 220, 26)}${paw(362, 220, 26)}`;

// ---------- daftar stiker ----------
const L = (t, c, s = 64) => ({ t, c, s });
const STICKERS = [
  ['01-mantap-jiwa', cat('wink', 'open', { front: jempol + sparkle(90, 110) + sparkle(430, 90, .8) }), L('MANTAP JIWA!', '#FFD23F')],
  ['02-gaskeun', cat('stars', 'open', { front: speed + paw(170, 370) + paw(342, 370) }), L('GASKEUN!', '#FF6B2C', 76)],
  ['03-santuy-dulu', cat('sleepy', 'w', { front: esTeh }), L('SANTUY DULU', '#2EC4B6')],
  ['04-wkwkwk', cat('laugh', 'open', { front: tears + paw(170, 360) + paw(342, 360) }), L('WKWKWK', '#FFD23F', 80)],
  ['05-otw-bos', cat('normal', 'w', { front: lambai + speed.split('\n')[0] }), L('OTW BOS!', '#5BC0EB', 76)],
  ['06-makasih-ya', cat('happy', 'w', { front: sembah + hearts }), L('MAKASIH YA', '#FF4F6D')],
  ['07-mager', `<g transform="translate(0 -40)">${tidur}<g transform="translate(0 150) scale(1)">${ears}${head}${blush}${eyes.sleepy}${mouths.flat}</g></g>${zzz}`, L('MAGER...', '#7B6CF6', 76)],
  ['08-lapar-nih', cat('heart', 'tongue', { front: nasi }), L('LAPAR NIH', '#F3B23B')],
  ['09-merdeka', `<g transform="translate(40 0)">${cat('happy', 'open', { behind: bendera, front: paw(150, 330) })}</g>`, L('MERDEKA!', '#E8302F', 76)],
  ['10-ngopi-dulu', cat('normal', 'w', { front: kopi, hat: peci }), L('NGOPI DULU', '#C46A1C')],
  ['11-siap-bos', cat('normal', 'flat', { hat: peci, front: hormat + paw(170, 370) }), L('SIAP, BOS!', '#3E8FD8', 72)],
  ['12-waduh', cat('shock', 'o', { front: sweat + kaget, noBlush: true }), L('WADUH!', '#FF6B2C', 80)],
  ['13-gemoy', cat('happy', 'w', { front: paw(200, 300) + paw(312, 300) + hearts.split('</path>')[0] + '</path>' + sparkle(420, 120) }), L('GEMOY', '#FF8FA3', 84)],
  ['14-sate-dulu', cat('stars', 'tongue', { front: sate }), L('SATE DULU!', '#8C3B12', 70)],
];

const svgFor = (art, lab) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" font-family="'Baloo 2', sans-serif">
  <defs><filter id="s" x="-10%" y="-10%" width="120%" height="120%">
    <feMorphology in="SourceAlpha" operator="dilate" radius="10" result="d"/>
    <feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/>
    <feGaussianBlur in="d" stdDeviation="5" result="b"/><feOffset in="b" dy="5" result="o"/>
    <feFlood flood-color="#000" flood-opacity=".28"/><feComposite in2="o" operator="in" result="sh"/>
    <feMerge><feMergeNode in="sh"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <g filter="url(#s)">
    <g transform="translate(46 8) scale(.82)">${art}</g>
    <text x="256" y="478" text-anchor="middle" font-size="${lab.s}" font-weight="800" fill="${lab.c}" stroke="${C.line}" stroke-width="12" stroke-linejoin="round" paint-order="stroke" transform="rotate(-4 256 460)">${lab.t}</text>
  </g></svg>`;

(async () => {
  for (const d of ['svg', 'png', 'webp']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
  for (const [name, art, lab] of STICKERS) {
    const svg = svgFor(art, lab);
    fs.writeFileSync(path.join(OUT, 'svg', name + '.svg'), svg);
    await page.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&display=block" rel="stylesheet">
      <style>html,body{margin:0;background:transparent}</style></head><body>${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(OUT, 'png', name + '.png'), omitBackground: true, clip: { x: 0, y: 0, width: 512, height: 512 } });
    console.log('✓', name);
  }
  await browser.close();
})();
