// Cek kamera: posisi layar Jakarta & Ka'bah, titik Tiongkok di frame, dan sudut frame di tanah (untuk tepi peta).
// node tools/probe.mjs t1 t2 …   (jalankan dengan LIB=/root/lemo-opuscar)
import path from 'path';
const LIB = process.env.LIB; const { serve, pageURL } = await import(path.join(LIB, 'core/render/serve.mjs'));
const { chromium } = await import(path.join(LIB, 'node_modules/playwright-core/index.mjs'));
const { ARGS, EXE } = await import(path.join(LIB, 'core/render/browser.mjs'));
const film = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const { server, port } = await serve(LIB); const url = pageURL(LIB, port, film);
const b = await chromium.launch({ executablePath: EXE, args: ARGS }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(url); await p.waitForFunction(() => window.READY, null, { timeout: 180000 });
const ts = process.argv.slice(2).length ? process.argv.slice(2).map(Number) : Array.from({ length: 45 }, (_, i) => i);
for (const t of ts) console.log(t, JSON.stringify(await p.evaluate(t => window.probe(t), t)));
await b.close(); server.close();
