import { chromium } from 'playwright';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root='/home/user/shorts/kartini/web';
const srv=http.createServer((r,s)=>{const f=path.join(root,decodeURIComponent(r.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return;}s.writeHead(200,{'Content-Type':f.endsWith('.js')?'text/javascript':'text/html'});s.end(d);});}).listen(8765);
const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1800,height:3000}});
for (const [n,qs] of [['a','e=laugh&l=mic&r=wave'],['b','e=smile&l=mic&r=point'],['c','e=grin&l=mic&r=thumb']]){
  await pg.goto('http://localhost:8765/bchar.html?'+qs); await pg.waitForFunction('window.ready');
  await pg.locator('#c').screenshot({path:`/tmp/claude-0/-home-user-Alihamz55/6cd24ca1-fe67-515d-bafa-9041e34e4420/scratchpad/ch_${n}.png`,omitBackground:true});
}
await b.close(); srv.close();
