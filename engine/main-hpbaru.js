import * as THREE from './lib/three.module.js';
import * as T from './toon.js';
import * as P from './paint.js';
import { SHOTS, TOTAL, shotAt, camAt, dofAt, LIGHTS, lightFor, actorsAt, worldAt, fxAt } from './story.js';

const W = 1080, H = 1920;
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.08, 1500);
const rx = (a) => a * Math.PI / 180;

// ---------- materials ----------
const grad = (() => { const d = new Uint8Array([90, 90, 90, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 2, 1); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const toon = (opts) => new THREE.MeshToonMaterial({ gradientMap: grad, ...opts });
const texM = (c, rx_ = 1, ry_ = 1, color = '#ffffff') => toon({ map: P.tex(c, rx_, ry_), color });
const M = {
  plank: texM(P.planks(1), 1, 6), beam: texM(P.beam(2), 1, 2), beamDark: texM(P.beam(3, [28, 36, 30]), 1, 2),
  rot: texM(P.rotten(4), 1, 1), rotB: texM(P.rotten(14), 1, 1),
  stone: texM(P.stone(4), 1, 1), stoneMoss: texM(P.mossy(P.stone(4), 5, 1.2), 1, 1),
  grass: texM(P.grass(6), 40, 40), dirt: texM(P.dirt(7), 6, 30), plaster: texM(P.plaster(8), 1, 1), plaster2: texM(P.plaster(18, 28), 1, 1),
  roof: texM(P.roof(9), 2, 2), marble: texM(P.marble(10), 1, 1), marbleTop: toon({ color: '#ece2cf' }),
  trunk: toon({ color: '#6a4a32' }), cypress: toon({ color: '#3f6b36' }), pine: toon({ color: '#5c8a3c' }), bush: toon({ color: '#6c9a42' }),
  hill: toon({ color: '#7aa64c' }), hillFar: toon({ color: '#86ad60' }), mount: toon({ color: '#8fa7b8' }), snow: toon({ color: '#f4f6fa' }),
  iron: toon({ color: '#5c5a57' }), bronze: toon({ color: '#b08a4a' }), wood: toon({ color: '#7a5434' }), door: toon({ color: '#5a3a24' }),
  window: toon({ color: '#2b2430' }), red: toon({ color: '#b8282b' }),
};
// ---------- ink / normal-depth contract ----------
const NOINK = 'noink'; // userData flag: never outlined (cards, fx, water handled specially)
const ndMat = new THREE.ShaderMaterial({
  vertexShader: `varying vec3 vN; varying float vD; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vD = -mv.z; gl_Position = projectionMatrix*mv; }`,
  fragmentShader: `varying vec3 vN; varying float vD; void main(){ vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n; gl_FragColor = vec4(n*.5+.5, vD); }`,
  side: THREE.DoubleSide,
});
const cardNd = (map) => new THREE.ShaderMaterial({
  uniforms: { map: { value: map } },
  vertexShader: `varying vec2 vUv; varying float vD; void main(){ vUv=uv; vec4 mv = modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `uniform sampler2D map; varying vec2 vUv; varying float vD; void main(){ if(texture2D(map,vUv).a<.5) discard; gl_FragColor=vec4(0.,0.,0.,vD); }`,
  side: THREE.DoubleSide,
});
const waterNd = new THREE.ShaderMaterial({
  vertexShader: `varying float vD; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vD=-mv.z; gl_Position=projectionMatrix*mv; }`,
  fragmentShader: `varying float vD; void main(){ gl_FragColor=vec4(.5,1.,.5,vD); }`,
});

// ---------- helpers ----------
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene, opts = {}) => {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = opts.cast ?? true; m.receiveShadow = true; parent.add(m); return m;
};
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const uvScale = (geo, su, sv) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv); return geo; };
/** box with world-scaled UVs per face (texel density 1 tile per `t` metres) */
const tbox = (w, h, d, t = 2) => {
  const g = box(w, h, d), uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / t, uv.getY(i) * dims[f][1] / t); }
  return g;
};

// ---------- sky ----------
const skyU = { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3() }, sunCol: { value: new THREE.Color() }, sunSize: { value: 0 } };
const sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), new THREE.ShaderMaterial({
  uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader: `uniform vec3 top, hor, sunDir, sunCol; uniform float sunSize; varying vec3 vP;
    void main(){ float h = clamp(vP.y,0.,1.); vec3 c = mix(hor, top, pow(h, .55)); if(vP.y<0.) c = hor;
      float s = dot(normalize(vP), normalize(sunDir)); c += sunCol * (smoothstep(1.-sunSize, 1.-sunSize*.6, s) + .35*pow(max(s,0.), 24.)*step(.001,sunSize));
      gl_FragColor = vec4(c,1.); }`,
}));
sky.userData.sky = true; scene.add(sky);

// ---------- lights ----------
const hemi = new THREE.HemisphereLight('#ffffff', '#ffffff', 1); scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffffff', 2); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03; sun.shadow.radius = 2;
scene.add(sun); scene.add(sun.target);
scene.fog = new THREE.Fog('#ffffff', 40, 600);

// ---------- world ----------
const DECK = 0; // floor height of every set
const world = new THREE.Group(); scene.add(world);
const MW = {
  club: texM(P.planks(21), 1, 1, '#8a6a5a'), stageWood: texM(P.planks(22), 1, 1, '#d9a070'),
  brick: texM(P.stone(23, 262, 26, 30, 96, 40), 1, 1), velvet: toon({ color: '#b02a35' }), velvetDark: toon({ color: '#7a1822' }),
  floorWood: texM(P.planks(24), 1, 1, '#f0c898'), wallBlue: texM(P.plaster(25, 200), 1, 1, '#cfe3f0'), wallWarm: texM(P.plaster(26, 30), 1, 1, '#f6dcb4'),
  wallDim: texM(P.plaster(27, 250), 1, 1, '#a99cc4'), checker: texM(P.checker(28), 1, 1), stripe: texM(P.stripesTex(), 1, 1),
  wood: toon({ color: '#9a6a42' }), woodDark: toon({ color: '#5e3c26' }), white: toon({ color: '#f4f1ea' }), sheet: toon({ color: '#e6eef6' }),
  blanketY: toon({ color: '#f2c14e' }), blanketB: toon({ color: '#5f7bb5' }), metal: toon({ color: '#3a3f4a' }), black: toon({ color: '#2b2f3a' }),
  green: toon({ color: '#5aa04a' }), pot: toon({ color: '#c8643c' }), rug: toon({ color: '#d8645a' }), rug2: toon({ color: '#6aa6a0' }),
  curtain: toon({ color: '#7a5aa6' }), curtainB: toon({ color: '#d98a3c' }),
  shirtR: toon({ color: '#d8453b' }), shirtG: toon({ color: '#4fa36b' }), shirtB: toon({ color: '#3a7bd5' }), shirtY: toon({ color: '#f2b632' }), shirtP: toon({ color: '#c25a9a' }),
};
const basic = (c, opts = {}) => new THREE.MeshBasicMaterial({ map: P.tex(c), ...opts });
const glow = (col, op = 1) => new THREE.MeshBasicMaterial({ color: col, transparent: op < 1, opacity: op, fog: false });
const plane = (w, h, mat, x, y, z, parent = world) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.receiveShadow = true; parent.add(m); return m; };
const cyl = (r0, r1, h, mat, x, y, z, parent = world, seg = 16) => add(new THREE.CylinderGeometry(r0, r1, h, seg), mat, x, y, z, parent);

// ===== STAGE (x=0) =====
add(tbox(30, 0.2, 30, 2), MW.club, 0, -0.1, 4, world, { cast: false });
add(tbox(9, 0.5, 4.5, 1.2), MW.stageWood, 0, 0.25, -0.75, world);
add(tbox(9.1, 0.08, 0.12, 1), MW.woodDark, 0, 0.5, 1.5, world);
add(tbox(18, 9, 0.4, 1.4), MW.brick, 0, 4.5, -3.2, world);
for (const s of [-1, 1]) for (let i = 0; i < 7; i++) cyl(0.26, 0.3, 7.2, i % 2 ? MW.velvetDark : MW.velvet, s * (3.3 + i * 0.36), 3.6, -2.55 + (i % 2) * 0.12, world, 10);
add(tbox(10, 1.0, 0.4, 2), MW.velvet, 0, 6.6, -2.5, world);
plane(3.2, 0.94, basic(P.sign('AUDISI STAND UP', { font: 100, fg: '#ffd84a', glow: '#fff1b0', border: '#ff5a5a' }), { fog: false }), 0, 3.75, -2.98);
const stool = new THREE.Group(); stool.position.set(1.35, 0.5, -0.9); world.add(stool);
cyl(0.32, 0.32, 0.09, MW.woodDark, 0, 0.95, 0, stool);
for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.6; const l = cyl(0.035, 0.035, 0.95, MW.metal, Math.cos(a) * 0.22, 0.47, Math.sin(a) * 0.22, stool, 6); l.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12); }
cyl(0.07, 0.06, 0.2, glow('#bfe6ff', 0.85), 0.05, 1.1, 0, stool, 10);
// spotlight beam + pool (no ink, no fog)
const beamMat = new THREE.MeshBasicMaterial({ color: '#e6d4ff', transparent: true, opacity: 0.11, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
const beamCone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 7.5, 32, 1, true), beamMat); beamCone.position.set(0, 4.25, 0.3); beamCone.userData.ndSkip = true; world.add(beamCone);
const pool = new THREE.Mesh(new THREE.CircleGeometry(1.55, 40), new THREE.MeshBasicMaterial({ map: P.tex(P.radial('226,206,255', 0.55)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.512, 0.2); pool.userData.ndSkip = true; world.add(pool);
for (let i = 0; i < 12; i++) { const b = add(new THREE.SphereGeometry(0.06, 8, 6), glow(i % 2 ? '#ff9ccb' : '#bfe6ff'), -4.2 + i * 0.76, 0.42, 1.56, world); b.userData.ndSkip = true; }
// ===== JURI TABLE (audisi) =====
{ const jt = new THREE.Group(); jt.position.set(2.6, 0, 2.6); world.add(jt);
  add(tbox(1.8, 0.08, 0.8, 1), MW.woodDark, 0, 0.72, 0, jt);
  add(tbox(1.8, 0.66, 0.06, 1), MW.velvet, 0, 0.36, 0.38, jt);
  plane(1.4, 0.36, basic(P.sign('JURI', { font: 120, fg: '#ffffff', glow: '#ffd84a', border: '#ffd84a' }), { fog: false }), 0, 0.38, 0.42, jt);
  cyl(0.16, 0.18, 0.08, MW.black, -0.5, 0.8, 0.05, jt, 20);
  const bt = cyl(0.13, 0.13, 0.07, toon({ color: '#ff2a2a' }), -0.5, 0.87, 0.05, jt, 20);
  cyl(0.07, 0.06, 0.14, MW.white, 0.55, 0.83, 0.0, jt, 12);
}
// front curtain (intro only): two halves of velvet folds that slide open
const frontCurtain = [-1, 1].map((sd) => { const g = new THREE.Group(); world.add(g); g.userData.sd = sd;
  for (let i = 0; i < 12; i++) cyl(0.24, 0.27, 6.6, i % 2 ? MW.velvetDark : MW.velvet, sd * (0.2 + i * 0.4), 3.8, 1.25 + (i % 2) * 0.1, g, 10);
  return g; });


// ===== KAMAR KOS (x=-40), floor top at 0.5 like the stage =====
const RX = -40;
const MR = { floor: texM(P.planks(61), 1, 1, '#c9a07a'), wall: texM(P.plaster(62, 140), 1, 1, '#a8d5b8'), frame: toon({ color: '#f4f1ea' }),
  bed: toon({ color: '#6e4a32' }), sheet: toon({ color: '#e6eef6' }), blanket: toon({ color: '#5f7bb5' }), pillow: toon({ color: '#f7f2e6' }),
  desk: toon({ color: '#9a6a42' }), shade: toon({ color: '#ffd59a' }), poster: toon({ color: '#f28cb8' }), rug: toon({ color: '#f2c14e' }) };
add(tbox(10, 1.0, 9, 1.0), MR.floor, RX, 0, 0.5, world, { cast: false });
add(tbox(10, 6, 0.3, 2), MR.wall, RX, 3, -2.6, world);
for (const sd of [-1, 1]) add(tbox(0.3, 6, 9, 2), MR.wall, RX + sd * 3.6, 3, 1.4, world);
// window behind the comic: night sky + scrolling rain + white frame
const nightC = document.createElement('canvas'); nightC.width = 256; nightC.height = 256;
{ const g = nightC.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#0a1430'); gr.addColorStop(1, '#22305a'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#fff2c0'; g.beginPath(); g.arc(190, 60, 26, 0, 7); g.fill(); g.fillStyle = '#0e1838'; g.beginPath(); g.arc(178, 52, 24, 0, 7); g.fill();
  for (let i = 0; i < 9; i++) { const h = 40 + ((i * 53) % 70); g.fillStyle = '#121a36'; g.fillRect(i * 30 - 4, 256 - h, 26, h); for (let k = 0; k < 4; k++) if ((i + k) % 3) { g.fillStyle = '#ffd98a'; g.fillRect(i * 30 + 3 + (k % 2) * 10, 256 - h + 10 + (k >> 1) * 16, 6, 7); } } }
plane(1.7, 1.4, new THREE.MeshBasicMaterial({ map: P.tex(nightC), fog: false }), RX + 0.75, 2.55, -2.44);
const rainC = document.createElement('canvas'); rainC.width = 128; rainC.height = 256;
{ const g = rainC.getContext('2d'); g.strokeStyle = 'rgba(200,225,255,0.85)'; g.lineCap = 'round'; for (let i = 0; i < 40; i++) { const x = (i * 37) % 128, y = (i * 71) % 256; g.lineWidth = 1.5 + (i % 3); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 5, y + 26); g.stroke(); } }
const rainTex = P.tex(rainC, 2, 1);
const rainWin = plane(1.7, 1.4, new THREE.MeshBasicMaterial({ map: rainTex, transparent: true, depthWrite: false, fog: false }), RX + 0.75, 2.55, -2.43); rainWin.userData.ndSkip = true; rainWin.visible = false;
for (const [w, h, x, y] of [[1.9, 0.12, 0.75, 3.3], [1.9, 0.12, 0.75, 1.8], [0.12, 1.6, -0.15, 2.55], [0.12, 1.6, 1.65, 2.55], [0.07, 1.4, 0.75, 2.55], [1.7, 0.07, 0.75, 2.55]]) add(tbox(w, h, 0.1, 1), MR.frame, RX + x, y, -2.4, world);
add(tbox(2.1, 0.1, 0.3, 1), MR.frame, RX + 0.75, 1.72, -2.3, world);
// bed (left), messy blanket + pillow
add(tbox(2.0, 0.35, 3.0, 1), MR.bed, RX - 2.3, 0.68, -0.8, world); add(tbox(1.9, 0.25, 2.9, 1), MR.sheet, RX - 2.3, 0.98, -0.8, world);
add(tbox(2.0, 1.1, 0.15, 1), MR.bed, RX - 2.3, 1.05, -2.3, world);
{ const p_ = add(tbox(1.2, 0.22, 0.6, 1), MR.pillow, RX - 2.3, 1.2, -1.9, world); p_.rotation.z = 0.08; }
{ const b_ = add(tbox(1.95, 0.18, 1.7, 1), MR.blanket, RX - 2.25, 1.17, -0.2, world); b_.rotation.set(0.05, 0.12, -0.04); }
// desk + warm lamp (right)
add(tbox(1.3, 0.08, 0.8, 1), MR.desk, RX + 2.6, 1.3, -1.6, world);
for (const [dx, dz] of [[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]]) add(tbox(0.08, 0.8, 0.08, 1), MR.desk, RX + 2.6 + dx, 0.9, -1.6 + dz, world);
cyl(0.03, 0.03, 0.5, MW.metal, RX + 2.9, 1.6, -1.8, world, 6); cyl(0.12, 0.25, 0.28, MR.shade, RX + 2.9, 1.9, -1.8, world, 14);
{ const lg = add(new THREE.SphereGeometry(0.9, 16, 12), new THREE.MeshBasicMaterial({ map: P.tex(P.radial('255,200,120', 0.35)), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }), RX + 2.9, 1.8, -1.6, world); lg.userData.ndSkip = true; }
// poster (heart) + rug
add(tbox(0.7, 0.9, 0.04, 1), MR.poster, RX - 1.0, 2.7, -2.43, world);
{ const r_ = add(new THREE.CylinderGeometry(1.3, 1.3, 0.02, 32), MR.rug, RX, 0.51, 0.3, world); r_.scale.z = 0.6; r_.receiveShadow = true; }


// ===== DEK KAPAL (x=80), film jadul: floor top at 0.5 =====
const SX = 80;
const MS = { deck: texM(P.planks(71), 1, 1, '#d9b48a'), white: toon({ color: '#f4efe2' }), red: toon({ color: '#c0392b' }), black: toon({ color: '#2b2522' }),
  hull: toon({ color: '#3a3330' }), rope: toon({ color: '#c8a46a' }) };
const seaC = document.createElement('canvas'); seaC.width = 256; seaC.height = 256;
{ const g = seaC.getContext('2d'); g.fillStyle = '#3f7896'; g.fillRect(0, 0, 256, 256); g.strokeStyle = '#8fc0d6'; g.lineWidth = 3; g.lineCap = 'round';
  for (let i = 0; i < 46; i++) { const x = (i * 83) % 256, y = (i * 47) % 256; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 9, y - 6, x + 18, y); g.stroke(); } }
const seaTex = P.tex(seaC, 40, 40);
{ const sea = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ map: seaTex })); sea.rotation.x = -Math.PI / 2; sea.position.set(SX, -0.6, -150); sea.userData.ndSkip = true; world.add(sea); }
add(tbox(9, 1.1, 6, 1.2), MS.deck, SX, -0.05, -0.2, world, { cast: false });
add(tbox(9.2, 1.4, 0.3, 1), MS.hull, SX, -0.3, 2.85, world, { cast: false });
// railing behind the hero
for (let i = 0; i < 13; i++) cyl(0.035, 0.035, 1.0, MS.white, SX - 4.2 + i * 0.7, 1.0, -2.7, world, 8);
add(tbox(8.8, 0.08, 0.08, 1), MS.white, SX, 1.5, -2.7, world); add(tbox(8.8, 0.05, 0.05, 1), MS.white, SX, 1.0, -2.7, world);
// lifebuoy on the rail
for (let k = 0; k < 8; k++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.1, 10, 24, Math.PI / 4), k % 2 ? MS.red : MS.white); t.position.set(SX - 1.5, 1.15, -2.62); t.rotation.z = k * Math.PI / 4; t.castShadow = true; world.add(t); }
// funnel + mast (left/back)
cyl(0.55, 0.6, 3.2, MS.white, SX - 2.9, 2.1, -1.9, world, 20); cyl(0.57, 0.57, 0.5, MS.black, SX - 2.9, 3.5, -1.9, world, 20);
cyl(0.06, 0.08, 6, MS.rope, SX + 2.6, 3.5, -2.2, world, 8); add(tbox(1.6, 0.06, 0.06, 1), MS.rope, SX + 2.6, 5.2, -2.2, world);
{ const r1 = cyl(0.015, 0.015, 4.3, MS.rope, SX + 3.5, 3.1, -2.4, world, 4); r1.rotation.z = 0.32; }


// ===== POS RONDA (x=120), malam kampung; floor top at 0.5 =====
const PX = 120;
const MP = { ground: texM(P.stone(81, 30, 8, 40, 64, 64), 1, 1, '#8a8478'), wall: texM(P.plaster(82, 35), 1, 1, '#e8c890'), wall2: texM(P.plaster(83, 190), 1, 1, '#9fc3c8'),
  wood: toon({ color: '#8a5a32' }), woodD: toon({ color: '#5e3c26' }), roof: toon({ color: '#9aa4ac' }), roofD: toon({ color: '#6e7880' }), door: toon({ color: '#6e4a32' }),
  kent: toon({ color: '#c8925a' }), pole: toon({ color: '#4a4f5a' }), sign: toon({ color: '#2b6a3a' }) };
add(tbox(60, 1.0, 40, 1.2), MP.ground, PX, 0, -5, world, { cast: false });
// house fronts behind
for (const [x, w, mat] of [[-4.2, 3.2, MP.wall], [-0.6, 3.6, MP.wall2], [3.2, 3.4, MP.wall]]) {
  add(tbox(w, 3.4, 0.3, 1.5), mat, PX + x, 2.2, -4.4, world);
  add(tbox(w + 0.3, 0.12, 0.9, 1), MP.roofD, PX + x, 3.95, -4.15, world);
  add(tbox(0.8, 1.7, 0.06, 1), MP.door, PX + x - w * 0.25, 1.35, -4.23, world);
  const win = plane(0.6, 0.45, glow('#ffd98a', 0.9), PX + x + w * 0.22, 2.1, -4.23); win.userData.ndSkip = true;
  add(tbox(0.7, 0.06, 0.08, 1), MP.woodD, PX + x + w * 0.22, 1.85, -4.2, world);
}
// pos ronda hut (left)
const HX_ = PX - 2.0, HZ = -1.2;
add(tbox(2.2, 0.12, 1.4, 1), MP.wood, HX_, 1.0, HZ, world);
for (const [dx, dz] of [[-1.0, -0.6], [1.0, -0.6], [-1.0, 0.6], [1.0, 0.6]]) add(tbox(0.1, 2.6, 0.1, 1), MP.woodD, HX_ + dx, 1.8, HZ + dz, world);
for (const [dx, dz] of [[-0.9, -0.5], [0.9, -0.5], [-0.9, 0.5], [0.9, 0.5]]) add(tbox(0.08, 0.5, 0.08, 1), MP.woodD, HX_ + dx, 0.75, HZ + dz, world);
{ const r_ = add(tbox(2.6, 0.08, 1.9, 1), MP.roof, HX_, 3.15, HZ, world); r_.rotation.x = 0.18; }
{ const k_ = cyl(0.09, 0.09, 0.6, MP.kent, HX_ + 0.95, 2.4, HZ + 0.62, world, 10); k_.rotation.z = 0.1; }
plane(1.4, 0.4, basic(P.sign('POS RONDA', { font: 120, bg: '#2b6a3a', fg: '#ffffff', glow: '#ffffff', border: '#ffd84a' }), { fog: false }), HX_, 2.85, HZ + 0.72);
// street lamp (right) with warm glow
cyl(0.05, 0.06, 4.2, MP.pole, PX + 2.4, 2.6, -1.6, world, 8);
add(tbox(0.7, 0.06, 0.06, 1), MP.pole, PX + 2.1, 4.7, -1.6, world);
{ const b_ = add(new THREE.SphereGeometry(0.14, 12, 8), glow('#fff2c0'), PX + 1.8, 4.6, -1.6, world); b_.userData.ndSkip = true; }
// plastic chairs + gorengan table (right front)
add(tbox(0.9, 0.06, 0.6, 1), MP.wood, PX + 1.9, 1.25, -0.6, world);
for (const [dx, dz] of [[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]]) add(tbox(0.05, 0.7, 0.05, 1), MP.woodD, PX + 1.9 + dx, 0.88, -0.6 + dz, world);
for (let i = 0; i < 6; i++) add(new THREE.SphereGeometry(0.06, 8, 6), toon({ color: i % 2 ? '#d9a04a' : '#c8803a' }), PX + 1.7 + (i % 3) * 0.12, 1.32, -0.68 + Math.floor(i / 3) * 0.12, world);


// ===== WARUNG TERAS SORE (x=160); floor top at 0.5 =====
const WX = 160;
const MWg = { ground: texM(P.stone(91, 28, 20, 62, 80, 80), 1, 1, '#d8c0a0'), wall: texM(P.plaster(92, 45), 1, 1, '#f2d8a8'), counter: toon({ color: '#3a8f6a' }),
  glass: toon({ color: '#cfe8f0', transparent: true, opacity: 0.55 }), wood: toon({ color: '#9a6a42' }), woodD: toon({ color: '#5e3c26' }),
  awnA: toon({ color: '#3a8f6a' }), awnB: toon({ color: '#f4f1ea' }), pot: toon({ color: '#c8643c' }), leaf: toon({ color: '#5aa04a' }),
  jar: toon({ color: '#f7f2e6', transparent: true, opacity: 0.8 }), snack: toon({ color: '#e8a040' }), snack2: toon({ color: '#d8453b' }) };
add(tbox(60, 1.0, 40, 1.2), MWg.ground, WX, 0, -5, world, { cast: false });
add(tbox(9, 4.2, 0.3, 1.5), MWg.wall, WX, 2.6, -3.4, world);
// counter + glass display + jars
add(tbox(3.6, 1.0, 0.8, 1), MWg.counter, WX + 0.2, 1.0, -2.6, world);
add(tbox(3.6, 0.5, 0.7, 1), MWg.glass, WX + 0.2, 1.75, -2.6, world);
for (let i = 0; i < 6; i++) { cyl(0.16, 0.16, 0.32, MWg.jar, WX - 1.2 + i * 0.55, 2.16, -2.6, world, 14); cyl(0.12, 0.12, 0.2, i % 2 ? MWg.snack : MWg.snack2, WX - 1.2 + i * 0.55, 2.1, -2.6, world, 12); }
// striped awning
for (let i = 0; i < 12; i++) { const a_ = add(tbox(0.75, 0.06, 1.6, 1), i % 2 ? MWg.awnB : MWg.awnA, WX - 4.1 + i * 0.75, 3.75, -2.6, world); a_.rotation.x = 0.28; }
for (const dx of [-3.9, 3.9]) add(tbox(0.1, 3.3, 0.1, 1), MWg.woodD, WX + dx, 2.15, -1.9, world);
plane(2.6, 0.55, basic(P.sign('WARUNG BU INAH', { font: 110, bg: '#fff3d0', fg: '#c0302c', glow: '#ffffff', border: '#3a8f6a' }), { fog: false }), WX + 0.2, 4.35, -3.2);
// bench (left) + potted plants
add(tbox(1.8, 0.1, 0.5, 1), MWg.wood, WX - 2.6, 1.0, -1.6, world);
for (const dx of [-0.8, 0.8]) add(tbox(0.08, 0.5, 0.4, 1), MWg.woodD, WX - 2.6 + dx, 0.75, -1.6, world);
for (const dx of [-3.6, 3.4]) { cyl(0.28, 0.22, 0.5, MWg.pot, WX + dx, 0.75, -2.2, world, 12); const b_ = add(new THREE.SphereGeometry(0.45, 12, 10), MWg.leaf, WX + dx, 1.35, -2.2, world); b_.scale.y = 1.3; }


// ===== PANTAI SORE (x=200); sand top at 0.5 =====
const BX = 200;
const MB = { sand: texM(P.plaster(95, 40), 1, 1, '#f2d8a0'), trunk: toon({ color: '#9a6a42' }), leaf: toon({ color: '#3a9a4a' }),
  umbA: toon({ color: '#e0352b' }), umbB: toon({ color: '#f4f1ea' }), pole: toon({ color: '#d8d0c0' }), board: toon({ color: '#3ab0c8' }), board2: toon({ color: '#ffd84a' }) };
add(tbox(60, 1.0, 14, 1.2), MB.sand, BX, 0, -1.0, world, { cast: false });
{ const sea2 = new THREE.Mesh(new THREE.PlaneGeometry(400, 200), new THREE.MeshBasicMaterial({ map: P.tex(seaC, 40, 20) })); sea2.rotation.x = -Math.PI / 2; sea2.position.set(BX, 0.42, -108); sea2.userData.ndSkip = true; world.add(sea2); }
// palm tree (left)
for (let i = 0; i < 8; i++) { const c_ = cyl(0.16 - i * 0.008, 0.18 - i * 0.008, 0.6, MB.trunk, BX - 2.0 + i * 0.06, 0.8 + i * 0.58, -3.2, world, 10); c_.rotation.z = -0.08; }
for (let k = 0; k < 7; k++) { const a = k * Math.PI * 2 / 7; const l_ = add(new THREE.ConeGeometry(0.25, 2.2, 6), MB.leaf, BX - 1.55 + Math.cos(a) * 0.8, 5.3 + 0.1 * Math.sin(k), -3.2 + Math.sin(a) * 0.8, world); l_.rotation.set(Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3); }
// beach umbrella (right) + surfboard
cyl(0.04, 0.04, 2.6, MB.pole, BX + 1.9, 1.8, -2.6, world, 8);
for (let k = 0; k < 8; k++) { const seg = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.6, 16, 1, true, k * Math.PI / 4, Math.PI / 4), k % 2 ? MB.umbA : MB.umbB); seg.position.set(BX + 1.9, 3.2, -2.6); seg.castShadow = true; world.add(seg); }
{ const b_ = add(tbox(0.55, 2.2, 0.08, 1), MB.board, BX + 2.5, 1.55, -3.0, world); b_.rotation.z = 0.12; const s_ = add(tbox(0.1, 2.0, 0.09, 1), MB.board2, BX + 2.5, 1.55, -2.98, world); s_.rotation.z = 0.12; }

// ===== DEPAN RUMAH + PAGAR (x=240); ground top at 0.5 =====
const HR = 240;
const MRm = { road: texM(P.stone(101, 12, 4, 30, 60, 60), 1, 1, '#6a6a70'), side: texM(P.stone(102, 30, 20, 50, 70, 70), 1, 1, '#cfc6b4'),
  yard: texM(P.grass(103), 10, 10), wall: toon({ color: '#f8e2a0' }), wallB: texM(P.plaster(105, 190), 1, 1, '#bfe0d8'),
  genteng: texM(P.roof(106), 3, 2, "#ffd8c0"), gentengD: toon({ color: '#a8492a' }), fence: toon({ color: '#2f8a5a' }), fenceD: toon({ color: '#1f5f3e' }),
  pillar: texM(P.plaster(107, 20), 1, 1, '#f4efe2'), cap: toon({ color: '#c8643c' }), door: toon({ color: '#8a5a32' }), frame: toon({ color: '#f4f1ea' }),
  glass: toon({ color: '#9fd4ee' }), trunk: toon({ color: '#7a5434' }), leaf: toon({ color: '#4f9a3c' }), leaf2: toon({ color: '#6cb04a' }),
  pole: toon({ color: '#8a8478' }), wire: toon({ color: '#2b2f3a' }), pot: toon({ color: '#c8643c' }), line: toon({ color: '#f4f1ea' }),
  hill: toon({ color: '#7aa64c' }), mango: toon({ color: '#f2b632' }) };
add(tbox(80, 1.0, 40.1, 1.2), MRm.yard, HR, 0, -19.95, world, { cast: false });           // yard/ground behind
add(tbox(80, 1.0, 3.2, 1.2), MRm.road, HR, -0.02, 3.6, world, { cast: false });      // asphalt road (front)
for (let i = 0; i < 14; i++) add(tbox(1.2, 0.02, 0.12, 1), MRm.line, HR - 26 + i * 4, 0.49, 3.6, world, { cast: false });
add(tbox(80, 1.06, 2.0, 1.2), MRm.side, HR, 0.03, 1.1, world, { cast: false });       // sidewalk in front of the fence
// house
add(tbox(9, 3.4, 0.3, 1.5), MRm.wall, HR, 2.2, -4.2, world).receiveShadow = false;
for (const sd of [-1, 1]) add(tbox(0.3, 3.4, 3, 1.5), MRm.wall, HR + sd * 4.35, 2.2, -2.85, world);
for (const sd of [-1, 1]) { const r_ = add(tbox(10.2, 0.14, 3.4, 1.2), MRm.genteng, HR, 4.55 + 0.0, -3.0 + sd * 1.45, world); r_.rotation.x = sd * 0.62; r_.position.y = 4.6; r_.position.z = -3.0 + sd * 1.32; }
add(tbox(10.3, 0.22, 0.22, 1), MRm.gentengD, HR, 5.55, -3.0, world);
add(tbox(10.2, 0.16, 0.3, 1), MRm.gentengD, HR, 3.92, -1.55, world);
{ const tri = new THREE.Shape([new THREE.Vector2(-1.6, 0), new THREE.Vector2(1.6, 0), new THREE.Vector2(0, 1.6)]);
  for (const sd of [-1, 1]) { const m_ = add(new THREE.ShapeGeometry(tri), MRm.wall, HR + sd * 4.5, 3.9, -3.0, world); m_.rotation.y = Math.PI / 2; m_.material = toon({ color: '#f6e0a0', side: THREE.DoubleSide }); } }
add(tbox(1.1, 2.2, 0.08, 1), MRm.door, HR + 0.2, 1.6, -4.03, world);
add(tbox(1.3, 0.12, 0.12, 1), MRm.frame, HR + 0.2, 2.75, -4.0, world);
add(new THREE.SphereGeometry(0.05, 8, 6), toon({ color: '#ffd84a' }), HR + 0.6, 1.6, -3.97, world);
for (const dx of [-2.6, 2.8]) { add(tbox(1.5, 1.2, 0.06, 1), MRm.glass, HR + dx, 2.2, -4.03, world);
  for (const [w, h, x, y] of [[1.7, 0.1, 0, 0.62], [1.7, 0.1, 0, -0.62], [0.1, 1.3, -0.78, 0], [0.1, 1.3, 0.78, 0], [0.07, 1.2, 0, 0]]) add(tbox(w, h, 0.1, 1), MRm.frame, HR + dx + x, 2.2 + y, -3.98, world); }
plane(1.2, 0.36, basic(P.sign('No. 17', { font: 120, bg: '#ffffff', fg: '#2b2f3a', glow: '#ffffff', border: '#2f8a5a' }), { fog: false }), HR - 1.0, 3.1, -4.02);
// teras pillars + pots
for (const dx of [-3.9, 3.9]) add(tbox(0.25, 3.0, 0.25, 1), MRm.pillar, HR + dx, 2.0, -1.6, world);
for (const dx of [-1.4, 1.8, -3.2]) { cyl(0.22, 0.17, 0.4, MRm.pot, HR + dx, 0.7, -2.2, world, 12); const b_ = add(new THREE.SphereGeometry(0.34, 12, 10), MRm.leaf2, HR + dx, 1.15, -2.2, world); b_.scale.y = 1.2; }
// FENCE (pagar besi hijau) along z=0.1 with brick pillars and a gate
const FZ = 0.1;
for (const dx of [-4.8, -1.2, 1.2, 4.8]) { add(tbox(0.42, 1.7, 0.42, 1), MRm.pillar, HR + dx, 1.35, FZ, world); add(tbox(0.52, 0.14, 0.52, 1), MRm.cap, HR + dx, 2.26, FZ, world); }
add(tbox(9.6, 0.32, 0.3, 1), MRm.pillar, HR, 0.66, FZ, world);
for (const [a, b_] of [[-4.6, -1.4], [-1.0, 1.0], [1.4, 4.6]]) {
  const gate = a === -1.0, top = gate ? 1.85 : 1.65;
  add(tbox(b_ - a, 0.07, 0.07, 1), MRm.fenceD, HR + (a + b_) / 2, top, FZ, world);
  add(tbox(b_ - a, 0.06, 0.06, 1), MRm.fenceD, HR + (a + b_) / 2, 1.0, FZ, world);
  for (let x = a + 0.12; x < b_ - 0.05; x += 0.2) { cyl(0.025, 0.025, top - 0.82, MRm.fence, HR + x, 0.82 + (top - 0.82) / 2, FZ, world, 6);
    const sp = add(new THREE.ConeGeometry(0.05, 0.14, 6), MRm.fenceD, HR + x, top + 0.09, FZ, world); }
}
// mango tree (left, in the yard) + electric pole with wires (right, sidewalk)
cyl(0.18, 0.24, 3.2, MRm.trunk, HR - 6.3, 2.1, -1.4, world, 10);
for (const [x, y, z, r] of [[-6.3, 4.1, -1.4, 1.5], [-5.4, 3.7, -1.0, 1.1], [-7.1, 3.6, -1.6, 1.1], [-6.0, 4.9, -1.7, 1.0]]) { const b_ = add(new THREE.SphereGeometry(r, 14, 10), MRm.leaf, HR + x, y, z, world); b_.scale.y = 0.85; }
for (const [x, y, z] of [[-5.3, 3.3, -0.2], [-6.6, 3.2, -0.3], [-5.9, 3.9, -0.3]]) add(new THREE.SphereGeometry(0.13, 8, 6), MRm.mango, HR + x, y, z, world);
cyl(0.1, 0.12, 7.5, MRm.pole, HR + 6.0, 4.25, 1.6, world, 8);
add(tbox(1.4, 0.1, 0.1, 1), MRm.pole, HR + 6.0, 7.6, 1.6, world);
for (const dy of [0, 0.25]) { const w_ = cyl(0.012, 0.012, 30, MRm.wire, HR + 0, 7.45 - dy, 1.6, world, 4); w_.rotation.z = Math.PI / 2 + 0.01; w_.castShadow = false; }
// far hills + neighbour houses
for (const [x, z, r, c] of [[-14, -22, 9, MRm.hill], [6, -26, 12, MRm.hill], [22, -22, 8, MRm.hill]]) { const h_ = add(new THREE.SphereGeometry(r, 20, 12), c, HR + x, -2, z, world, { cast: false }); h_.scale.y = 0.6; }
for (const [x, mat] of [[-11, MRm.wallB], [11, MRm.wallB]]) { add(tbox(5, 3.0, 4, 1.5), mat, HR + x, 2.0, -4.5, world); const r_ = add(tbox(5.6, 0.14, 4.6, 1.2), MRm.genteng, HR + x, 3.7, -4.5, world); r_.rotation.x = 0.1; }
// night sky stars (flashback on the roof)
const starsG = new THREE.Group(); world.add(starsG); starsG.visible = false;
for (let i = 0; i < 70; i++) { const a = i * 2.399, r = 30 + (i * 37) % 60; const st = add(new THREE.SphereGeometry(0.12 + (i % 4) * 0.05, 6, 4), glow(i % 5 ? '#fff6d0' : '#bfe6ff'), HR + Math.cos(a) * r * 0.9, 12 + (i * 53) % 34, -40 - Math.sin(a) * 10, starsG); st.userData.ndSkip = true; st.castShadow = false; }
{ const big = add(new THREE.OctahedronGeometry(0.9, 0), glow('#ffe066'), HR - 4, 20, -40, starsG); big.userData.ndSkip = true; big.userData.bigStar = true; starsG.userData.big = big; }

// ===== WEDDING HALL (x=40) =====
const HX = 40;
const MH = {
  floor: texM(P.checker(41, '#f6ead2', '#d8b878'), 1, 1), wall: texM(P.plaster(42, 40), 1, 1, '#f7ead6'),
  drape: texM(P.stripesTex('#fff6e6', '#f2dcae', 10), 1, 1), gold: toon({ color: '#e2b04a' }), goldDark: toon({ color: '#b8862e' }),
  cloth: toon({ color: '#fbf7ee' }), skirt: toon({ color: '#e9c46a' }), silver: toon({ color: '#c9cfd6' }), marble: toon({ color: '#f4efe6' }),
  pink: toon({ color: '#f28cb0' }), rose: toon({ color: '#e0577f' }), leaf: toon({ color: '#5aa04a' }), sofa: toon({ color: '#c0392b' }),
  bowl: toon({ color: '#ffd1dc', transparent: true, opacity: 0.85 }), rendang: toon({ color: '#6b3a1f' }),
};
add(tbox(18, 0.2, 12, 1.0), MH.floor, HX, -0.1, 0, world, { cast: false });
add(tbox(18, 6, 0.3, 2), MH.wall, HX, 3, -3.9, world);
add(tbox(0.3, 6, 10, 2), MH.wall, HX - 8, 3, 0.5, world);
add(tbox(0.3, 6, 10, 2), MH.wall, HX + 8.5, 3, 0.5, world);
// pelaminan: platform, draped backdrop with gold arch, sofa, flowers
add(tbox(5.6, 0.4, 2.4, 1), MH.goldDark, HX, 0.2, -2.6, world);
add(tbox(5.8, 0.06, 2.5, 1), MH.sofa, HX, 0.43, -2.6, world);
add(tbox(6.2, 4.2, 0.2, 1.4), MH.drape, HX, 2.5, -3.7, world);
for (let i = 0; i < 13; i++) { const a = Math.PI * i / 12; add(new THREE.SphereGeometry(0.16, 10, 8), MH.gold, HX + Math.cos(a) * 2.7, 2.2 + Math.sin(a) * 1.9, -3.55, world); }
for (const s of [-1, 1]) { add(tbox(0.3, 3.0, 0.3, 1), MH.gold, HX + s * 2.75, 1.9, -3.5, world);
  for (let k = 0; k < 7; k++) add(new THREE.SphereGeometry(0.22 + (k % 3) * 0.04, 10, 8), k % 2 ? MH.pink : MH.rose, HX + s * (2.4 + (k % 3) * 0.25), 0.55 + k * 0.42, -3.3 + (k % 2) * 0.2, world);
  cyl(0.28, 0.22, 0.6, MH.gold, HX + s * 3.4, 0.3, -1.5, world, 12); const b = add(new THREE.SphereGeometry(0.5, 12, 10), MH.leaf, HX + s * 3.4, 0.95, -1.5, world); b.scale.y = 1.2;
  for (let k = 0; k < 5; k++) add(new THREE.SphereGeometry(0.13, 8, 6), MH.pink, HX + s * 3.4 + Math.cos(k * 1.3) * 0.4, 1.05 + Math.sin(k * 2.1) * 0.35, -1.15, world); }
add(tbox(2.6, 0.5, 0.8, 1), MH.sofa, HX, 0.65, -3.05, world); add(tbox(2.6, 1.0, 0.25, 1), MH.sofa, HX, 1.2, -3.4, world);
for (const s of [-1, 1]) add(tbox(0.25, 0.8, 0.8, 1), MH.gold, HX + s * 1.4, 0.8, -3.05, world);
// buffet (prasmanan) on the left
const BUF = [HX - 3.8, -1.0];
add(tbox(3.0, 0.9, 1.0, 1), MH.skirt, BUF[0], 0.45, BUF[1], world); add(tbox(3.1, 0.06, 1.1, 1), MH.cloth, BUF[0], 0.93, BUF[1], world);
for (let i = 0; i < 3; i++) { const x = BUF[0] - 1.0 + i * 1.0; cyl(0.36, 0.3, 0.26, MH.silver, x, 1.09, BUF[1], world, 16);
  if (i === 1) for (let k = 0; k < 7; k++) add(new THREE.SphereGeometry(0.08, 8, 6), MH.rendang, x + Math.cos(k * 0.9) * 0.18, 1.24, BUF[1] + Math.sin(k * 0.9) * 0.16, world);
  else { const lid = add(new THREE.SphereGeometry(0.36, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), MH.silver, x, 1.22, BUF[1], world); lid.scale.y = 0.5; } }
for (let i = 0; i < 5; i++) cyl(0.14, 0.14, 0.03 + i * 0.012, MH.cloth, BUF[0] + 1.25, 0.98 + i * 0.012, BUF[1] + 0.25, world, 14);
// the pillar (tiang) to hide behind
const PIL = [HX - 1.6, 0.7];
cyl(0.36, 0.36, 4.6, MH.marble, PIL[0], 2.3, PIL[1], world, 20);
for (const y of [0.15, 4.45]) cyl(0.48, 0.48, 0.3, MH.gold, PIL[0], y, PIL[1], world, 20);
for (const y of [1.4, 2.6]) cyl(0.38, 0.38, 0.08, MH.gold, PIL[0], y, PIL[1], world, 20);
// es buah table on the right
const ESB = [HX + 4.6, -0.6];
cyl(0.7, 0.7, 0.07, MH.cloth, ESB[0], 1.0, ESB[1], world, 24); cyl(0.07, 0.07, 1.0, MH.goldDark, ESB[0], 0.5, ESB[1], world, 8); cyl(0.35, 0.35, 0.04, MH.goldDark, ESB[0], 0.02, ESB[1], world, 16);
const bowl = add(new THREE.SphereGeometry(0.42, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), MH.bowl, ESB[0], 1.45, ESB[1], world);
{ const cols = ['#ff5f5f', '#7dd38b', '#ffd84a', '#f2f2f2', '#ff9a3c']; for (let k = 0; k < 14; k++) add(tbox(0.09, 0.09, 0.09, 1), toon({ color: cols[k % 5] }), ESB[0] + Math.cos(k * 2.4) * 0.25, 1.33 + (k % 3) * 0.04, ESB[1] + Math.sin(k * 2.4) * 0.22, world); }
for (let i = 0; i < 4; i++) cyl(0.07, 0.06, 0.18, MH.bowl, ESB[0] - 0.45 + i * 0.3, 1.13, ESB[1] + 0.45, world, 10);
// string lights + hanging lanterns
for (let i = 0; i < 30; i++) { const x = HX - 7.5 + i * 0.52, y = 4.6 - 0.35 * Math.sin(Math.PI * ((i % 10) / 10)); const b = add(new THREE.SphereGeometry(0.07, 8, 6), glow(i % 3 ? '#fff2c0' : '#ffd27a'), x, y, -2.0, world); b.userData.ndSkip = true; }
for (const x of [HX - 4.5, HX + 4.5]) { cyl(0.01, 0.01, 1.2, MW.black, x, 5.1, 0.4, world, 4); const l = cyl(0.35, 0.35, 0.6, glow('#fff0c8'), x, 4.2, 0.4, world, 16); }
// background guests' tables
for (const [x, z] of [[HX - 6.2, -2.6], [HX + 6.4, -2.4]]) { cyl(0.6, 0.6, 0.07, MH.cloth, x, 0.9, z, world, 20); cyl(0.06, 0.06, 0.9, MH.goldDark, x, 0.45, z, world, 8); }

// ---------- cards ----------
const CW = 1200, CH = 2000, CM = 2.25; // canvas px, card height in metres (design 600x1000 -> 2.25 m)
const cardGeo = new THREE.PlaneGeometry(CM * 0.6, CM); cardGeo.translate(0, CM / 2 - CM * 0.025, 0);
const blobTex = P.tex(P.radial('20,14,30', 0.6));
class Card {
  constructor(scale = 1) {
    [this.c, this.g] = (() => { const c = document.createElement('canvas'); c.width = CW; c.height = CH; return [c, c.getContext('2d')]; })();
    this.t = new THREE.CanvasTexture(this.c); this.t.colorSpace = THREE.SRGBColorSpace; this.t.anisotropy = 4;
    this.mat = new THREE.MeshBasicMaterial({ map: this.t, transparent: true, alphaTest: 0.02, side: THREE.DoubleSide, fog: true });
    this.mesh = new THREE.Mesh(cardGeo, this.mat); this.mesh.userData.nd = cardNd(this.t); this.mesh.castShadow = true;
    this.mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.t, alphaTest: 0.5 });
    this.blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, fog: true }));
    this.blob.rotation.x = -Math.PI / 2; this.blob.userData.ndSkip = true; this.blob.renderOrder = 1;
    scene.add(this.mesh); scene.add(this.blob); this.key = ''; this.mesh.visible = this.blob.visible = false;
  }
  draw(key, fn) {
    if (key === this.key) return; this.key = key;
    const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, CW, CH); g.setTransform(CW / 600, 0, 0, CH / 1000, 0, 0);
    const p = new T.Pen(g); fn(p); this.t.needsUpdate = true;
  }
}
const cards = []; const getCard = (i) => cards[i] || (cards[i] = new Card());

// ---------- render targets & post ----------
const rtColor = new THREE.WebGLRenderTarget(W, H, { samples: 4, type: THREE.HalfFloatType });
const rtNd = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
const rtInk = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), fsGeo = new THREE.PlaneGeometry(2, 2);
const fs = (mat) => { const s = new THREE.Scene(); s.add(new THREE.Mesh(fsGeo, mat)); return s; };
const inkU = { col: { value: rtColor.texture }, nd: { value: rtNd.texture }, res: { value: new THREE.Vector2(W, H) }, px: { value: 1.6 }, fogCol: { value: new THREE.Color() },
  sat: { value: 1.08 }, lift: { value: new THREE.Color(0, 0, 0) }, gain: { value: new THREE.Color(1, 1, 1) }, vig: { value: 0.22 }, flash: { value: 0 } };
const inkScene = fs(new THREE.ShaderMaterial({ uniforms: inkU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D col, nd; uniform vec2 res; uniform float px, sat, vig, flash; uniform vec3 fogCol, lift, gain; varying vec2 vUv;
  float edgeAt(vec2 uv, float r){
    vec4 c = texture2D(nd, uv); if (dot(c.rgb,c.rgb) < .01) return 0.; float d = c.a; vec3 n = c.rgb*2.-1.;
    float e = 0.; float rr = r * clamp(7./d, .62, 1.25);
    for (int i=0;i<16;i++){ float a = float(i)*.785398 + (i>7 ? .39 : 0.); float k = i>7 ? .5 : 1.;
      vec2 o = vec2(cos(a), sin(a))*rr*k/res; vec4 s = texture2D(nd, uv+o);
      float ds = s.a; bool card = dot(s.rgb,s.rgb) < .01;
      if (card && ds > 0.) continue;            // character cards: never outlined by the world ink
      if (card) ds = 1e4;                        // sky
      vec3 ns = s.rgb*2.-1.;
      e = max(e, smoothstep(.006, .02, (ds - d)/d));                           // depth jump, near side only
      if (!card && abs(ds-d)/d < .06) e = max(e, smoothstep(.88, .72, dot(n, ns)) * .9); // crease
    }
    return e * (1. - smoothstep(140., 520., d)*.8);
  }
  void main(){
    vec3 c = texture2D(col, vUv).rgb;
    float e = edgeAt(vUv, px);
    c = mix(c, vec3(.012,.01,.014), e);
    if (flash < -0.5) c = vec3(e);
    float l = dot(c, vec3(.299,.587,.114)); c = mix(vec3(l), c, sat);
    c = c*gain + lift;
    vec2 q = vUv-.5; c *= 1. - vig*dot(q*vec2(1.,.75), q*vec2(1.,.75))*2.2;
    c = mix(c, vec3(1.), flash);
    gl_FragColor = vec4(c,1.); }` }));
const dofU = { src: { value: rtInk.texture }, nd: { value: rtNd.texture }, res: { value: new THREE.Vector2(W, H) }, focus: { value: 5 }, cinf: { value: 0 }, near: { value: 1 } };
const dofScene = fs(new THREE.ShaderMaterial({ uniforms: dofU, vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `uniform sampler2D src, nd; uniform vec2 res; uniform float focus, cinf, near; varying vec2 vUv;
  float coc(vec2 uv){ float d = texture2D(nd, uv).a; if (d <= 0.) d = 2000.; float k = 1. - focus/d; return k > 0. ? cinf*k : min(-k*cinf*near, cinf*1.4); }
  void main(){
    float c0 = coc(vUv);
    if (cinf < .5 || c0 < .6) { gl_FragColor = linearToOutputTexel(vec4(texture2D(src, vUv).rgb, 1.)); return; }
    vec3 acc = vec3(0.); float wsum = 0.;
    for (int i=0;i<48;i++){ float fi = float(i); float r = sqrt((fi+.5)/48.); float a = fi*2.39996;
      vec2 o = vec2(cos(a), sin(a))*r*c0/res; float cs = coc(vUv+o);
      float w = smoothstep(r*c0-1.5, r*c0+.5, cs + .5);
      acc += texture2D(src, vUv+o).rgb*w; wsum += w; }
    gl_FragColor = linearToOutputTexel(vec4(acc/max(wsum,1e-3), 1.)); }` }));
// final copy with sRGB handled by the renderer output (we render to screen with linear->sRGB in the shader chunk)
dofScene.children[0].material.toneMapped = false;

// ---------- per-frame state ----------
const tmpV = new THREE.Vector3();
function applyLight(L, f) {
  hemi.color.set(L.sky); hemi.groundColor.set(L.ground); hemi.intensity = L.hemi;
  sun.color.set(L.sun); sun.intensity = L.sunI;
  scene.fog.color.set(L.fog); scene.fog.near = L.fogNear; scene.fog.far = L.fogFar;
  skyU.top.value.set(L.skyTop); skyU.hor.value.set(L.skyHor); skyU.sunCol.value.set(L.sunDisc || '#000'); skyU.sunSize.value = L.sunSize || 0;
  inkU.sat.value = L.sat; inkU.gain.value.set(L.gain || '#ffffff'); inkU.lift.value.set(L.lift || '#000000');
}
function placeSun(L, focus) {
  // sun direction from azimuth/elevation in world space
  const az = rx(L.az), el = rx(L.el); tmpV.set(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az));
  skyU.sunDir.value.copy(tmpV);
  sun.position.copy(focus).addScaledVector(tmpV, 80); sun.target.position.copy(focus);
  const ext = L.shadowExt || 30, sc = sun.shadow.camera; sc.left = -ext; sc.right = ext; sc.top = ext; sc.bottom = -ext; sc.near = 1; sc.far = 200; sc.updateProjectionMatrix();
}

function worldState(S, f) {
  beamMat.opacity = 0.11 + 0.02 * Math.sin(f * 0.2);
  seaTex.offset.set((f * 0.0004) % 1, (f * 0.0011) % 1);
  rainTex.offset.y = (f * 0.045) % 1; rainTex.offset.x = (f * 0.004) % 1;
  const cu = S.curtain ?? 1;
  frontCurtain.forEach((g) => { g.visible = cu < 0.999; g.position.x = g.userData.sd * cu * 5.2; });
  starsG.visible = !!S.night; starsG.userData.big.rotation.y = f * 0.05; starsG.userData.big.scale.setScalar(1 + 0.15 * Math.sin(f * 0.3));
}

function drawActors(list, cam) {
  cards.forEach((c) => { c.mesh.visible = c.blob.visible = false; });
  list.forEach((a, i) => {
    const c = getCard(i);
    c.draw(a.key, a.draw);
    c.mesh.visible = true; c.mesh.position.set(a.x, a.y, a.z);
    const s = a.s || 1; c.mesh.scale.set(s * (a.flip ? -1 : 1), s, s);
    c.mesh.rotation.set(0, Math.atan2(cam.position.x - a.x, cam.position.z - a.z) + (a.yaw || 0), a.roll || 0);
    c.mat.color.set(a.tint || '#ffffff'); c.mat.opacity = a.alpha ?? 1;
    c.mesh.castShadow = a.shadow !== false;
    c.mesh.renderOrder = a.order || 2;
    if (a.blob !== false && a.y < (a.ground ?? DECK) + 0.5) { c.blob.visible = true; c.blob.position.set(a.x, (a.ground ?? DECK) + 0.02, a.z); c.blob.scale.set(0.95 * s, 0.6 * s, 1); }
  });
}

const swapForNd = (on) => {
  scene.traverse((o) => {
    if (!o.isMesh) return;
    if (on) {
      o.userData.mat0 = o.material;
      if (o.userData.ndSkip) { o.userData.vis0 = o.visible; o.visible = false; return; }
      if (o === sky || o.userData.sky) { o.userData.vis0 = o.visible; o.visible = false; return; }
      o.material = o.userData.nd || ndMat;
    } else {
      o.material = o.userData.mat0; if (o.userData.vis0 !== undefined) { o.visible = o.userData.vis0; delete o.userData.vis0; }
    }
  });
};

window.renderFrame = (f) => {
  const S = shotAt(f), L = lightFor(S, f), C = camAt(f);
  applyLight(L, f);
  camera.position.set(...C.pos); camera.up.set(0, 1, 0); camera.lookAt(...C.look); camera.rotateZ(rx(C.roll || 0));
  camera.fov = C.fov; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  const W_ = worldAt(f); worldState(W_, f);
  placeSun(L, new THREE.Vector3(...(C.shadowAt || C.look)));
  drawActors([...actorsAt(f, T), ...fxAt(f, T)], camera);
  sky.position.copy(camera.position);

  // pass A: colour
  renderer.setRenderTarget(rtColor); renderer.setClearColor(0x000000, 1); renderer.clear(); renderer.render(scene, camera);
  // pass B: normal + depth
  const fog = scene.fog; scene.fog = null; const sm = renderer.shadowMap.enabled; renderer.shadowMap.enabled = false; renderer.shadowMap.autoUpdate = false;
  swapForNd(true); renderer.setRenderTarget(rtNd); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, camera); swapForNd(false);
  scene.fog = fog; renderer.shadowMap.enabled = sm; renderer.shadowMap.autoUpdate = true;
  if (window.DEBUG_ND) { const dm = new THREE.MeshBasicMaterial({ map: rtNd.texture }); const ds = fs(dm); renderer.setRenderTarget(null); renderer.render(ds, fsCam); return true; }
  // ink + grade
  const D = dofAt(f);
  inkU.px.value = 2.5; inkU.flash.value = window.DEBUG_E ? -1 : (C.flash || 0); inkU.vig.value = L.vig ?? 0.22;
  renderer.setRenderTarget(rtInk); renderer.render(inkScene, fsCam);
  // lens
  dofU.focus.value = D.focus; dofU.cinf.value = D.cinf; dofU.near.value = D.near ?? 1;
  renderer.setRenderTarget(null); renderer.render(dofScene, fsCam);
  return true;
};
window.TOTAL = TOTAL;
window.ready = true;
