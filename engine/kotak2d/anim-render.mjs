// node anim-render.mjs <mulai-detik> <akhir-detik> <audio.wav> <out.mp4>   (atau: test "f1,f2,..." untuk PNG)
import http from 'http'; import fs from 'fs'; import path from 'path'; import { spawn } from 'child_process'; import { chromium } from 'playwright';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
await new Promise(res => srv.listen(8767, res));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('[err]', e.message));
await p.goto('http://localhost:8767/kotak2d/anim.html'); await p.waitForFunction('window.__ready === true');
const grab = async f => Buffer.from((await p.evaluate(f => { drawFrame(f); return document.getElementById('c').toDataURL('image/jpeg', .93); }, f)).split(',')[1], 'base64');
if (process.argv[2] === 'test') {
  for (const f of process.argv[3].split(',').map(Number)) fs.writeFileSync(`frame-${f}.jpg`, await grab(f));
} else {
  const [t0, t1, audio, out] = [Number(process.argv[2]), Number(process.argv[3]), process.argv[4], process.argv[5]];
  const f0 = Math.round(t0 * 30), f1 = Math.round(t1 * 30);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-i', '-', '-ss', String(t0), '-t', String(t1 - t0), '-i', audio,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = f0; f < f1; f++) { const buf = await grab(f); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (f % 150 === 0) console.log('frame', f); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}
await b.close(); srv.close();
