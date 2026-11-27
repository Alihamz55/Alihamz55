// Dunia Kotak: tokoh blok orisinal (Bobi, Neng Kubi, Piko). Bukan aset game mana pun.
import * as THREE from '../pipeline-template/web/lib/three.module.js';

const W = 1080, H = 1920;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(32, W / H, 0.1, 200);

// ---------- tekstur kanvas ----------
function tex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter; t.anisotropy = 4; return t;
}
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, ...o });

// wajah: stiker datar, ekspresi bisa diganti
function faceTex(o) {
  return tex(256, 256, (g, w) => {
    g.fillStyle = o.skin; g.fillRect(0, 0, w, w);
    const eye = (x) => {
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, 112, 30, 36, 0, 0, 7); g.fill();
      g.fillStyle = '#1b1b2a'; g.beginPath(); g.ellipse(x + o.look, 118, 17, 21, 0, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(x + o.look + 6, 110, 6, 0, 7); g.fill();
    };
    eye(84); eye(172);
    g.strokeStyle = '#3a2416'; g.lineWidth = 11; g.lineCap = 'round';
    o.brows(g);
    if (o.blush) { g.fillStyle = 'rgba(255,110,130,.45)';
      g.beginPath(); g.ellipse(52, 170, 20, 12, 0, 0, 7); g.fill();
      g.beginPath(); g.ellipse(204, 170, 20, 12, 0, 0, 7); g.fill(); }
    o.mouth(g);
  });
}

function box(w, h, d, m, x = 0, y = 0, z = 0, parent) {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  b.position.set(x, y, z); b.castShadow = b.receiveShadow = true;
  if (parent) parent.add(b); return b;
}

// ---------- tokoh ----------
function makeChar(o) {
  const root = new THREE.Group();
  const skin = mat(o.skin);
  // kaki
  const legL = new THREE.Group(), legR = new THREE.Group();
  [legL, legR].forEach((L, i) => {
    L.position.set(i ? 0.27 : -0.27, 1.0, 0); root.add(L);
    box(0.5, 0.62, 0.52, mat(o.pants), 0, -0.31, 0, L);
    box(0.5, 0.38, 0.52, skin, 0, -0.76, 0, L);
    box(0.54, 0.2, 0.62, mat(o.shoe), 0, -0.9, 0.04, L);
  });
  // badan (kaos bergaris lewat tekstur)
  const shirtT = tex(64, 64, o.shirt);
  const torso = box(1.08, 1.1, 0.6, new THREE.MeshStandardMaterial({ map: shirtT, roughness: .8 }), 0, 1.55, 0, root);
  if (o.extraTorso) o.extraTorso(torso);
  // lengan
  const arms = [];
  [-1, 1].forEach(s => {
    const A = new THREE.Group(); A.position.set(s * 0.8, 2.02, 0); root.add(A);
    box(0.46, 0.42, 0.5, new THREE.MeshStandardMaterial({ map: shirtT }), 0, -0.2, 0, A);
    box(0.42, 0.66, 0.44, skin, 0, -0.73, 0, A);
    arms.push(A);
  });
  // kepala
  const head = new THREE.Group(); head.position.set(0, 2.1, 0); root.add(head);
  const faceM = new THREE.MeshStandardMaterial({ map: faceTex(o), roughness: .7 });
  const hm = [skin, skin, skin, skin, faceM, skin];
  const hb = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 1.0), hm);
  hb.position.y = 0.55; hb.castShadow = true; head.add(hb);
  o.hat(head);
  root.userData = { head, arms, legL, legR };
  return root;
}

const bobi = makeChar({
  skin: '#c98b5a', pants: '#2f4a7a', shoe: '#f2f2f2', look: 6, blush: false,
  shirt: (g) => { g.fillStyle = '#ff8a1f'; g.fillRect(0, 0, 64, 64);
    g.fillStyle = '#fff3d6'; for (let y = 6; y < 64; y += 16) g.fillRect(0, y, 64, 6); },
  brows: (g) => { g.beginPath(); g.moveTo(54, 66); g.lineTo(108, 78); g.stroke();
    g.beginPath(); g.moveTo(148, 70); g.lineTo(202, 58); g.stroke(); },
  mouth: (g) => { g.fillStyle = '#5a1e1e'; g.beginPath(); g.moveTo(80, 176);
    g.quadraticCurveTo(140, 236, 196, 168); g.closePath(); g.fill();
    g.fillStyle = '#fff'; g.fillRect(96, 176, 80, 12); },
  hat: (h) => { const c = mat('#14a39a');
    box(1.06, 0.3, 1.06, c, 0, 1.12, 0, h);
    box(0.9, 0.08, 0.5, c, 0, 1.0, -0.72, h);          // topi terbalik: lidah di belakang
    box(0.18, 0.12, 0.18, mat('#ffd23f'), 0, 1.32, 0, h);
    box(1.04, 0.18, 1.04, mat('#3a2416'), 0, 0.98, 0.02, h).scale.z = 1; },
});

const kubi = makeChar({
  skin: '#e7b38a', pants: '#3e6fb8', shoe: '#7a3fd1', look: -6, blush: true,
  shirt: (g) => { g.fillStyle = '#ff9ec7'; g.fillRect(0, 0, 64, 64);
    g.fillStyle = '#3e6fb8'; g.fillRect(14, 22, 36, 42); g.fillRect(14, 0, 7, 24); g.fillRect(43, 0, 7, 24);
    g.fillStyle = '#ffd23f'; g.fillRect(16, 20, 4, 4); g.fillRect(44, 20, 4, 4); },
  brows: (g) => { g.beginPath(); g.moveTo(56, 62); g.lineTo(108, 66); g.stroke();
    g.beginPath(); g.moveTo(148, 62); g.lineTo(200, 74); g.stroke(); },
  mouth: (g) => { g.strokeStyle = '#5a1e1e'; g.lineWidth = 10; g.beginPath();
    g.moveTo(104, 186); g.quadraticCurveTo(150, 200, 176, 172); g.stroke(); },
  hat: (h) => { const hair = mat('#7a3fd1');
    box(1.1, 0.26, 1.1, hair, 0, 1.12, 0, h);
    box(1.1, 0.9, 0.24, hair, 0, 0.62, -0.46, h);
    box(0.24, 0.8, 1.1, hair, -0.48, 0.66, 0, h); box(0.24, 0.8, 1.1, hair, 0.48, 0.66, 0, h);
    box(0.6, 0.16, 0.1, hair, -0.18, 0.98, 0.52, h);
    box(0.26, 0.26, 0.26, mat('#ffd23f'), 0.5, 1.2, 0.3, h); },  // jepit rambut
});

// palu kecil di tangan Neng Kubi
{ const A = kubi.userData.arms[1]; const p = new THREE.Group(); p.position.set(0, -1.05, 0.12); A.add(p);
  box(0.1, 0.8, 0.1, mat('#8a5a2b'), 0, 0.15, 0.2, p).rotation.x = 1.2;
  box(0.36, 0.22, 0.22, mat('#9aa3ad', { metalness: .6, roughness: .35 }), 0, 0.35, 0.55, p); }

// Piko: ayam kotak
function makePiko() {
  const g = new THREE.Group(), y = mat('#ffd23f');
  box(0.7, 0.6, 0.8, y, 0, 0.55, 0, g);
  box(0.5, 0.5, 0.5, y, 0, 1.05, 0.22, g);
  box(0.18, 0.2, 0.18, mat('#ff4d3a'), 0, 1.38, 0.24, g);
  box(0.2, 0.12, 0.2, mat('#ff9a1f'), 0, 1.0, 0.56, g);
  box(0.12, 0.16, 0.06, mat('#ff4d3a'), 0, 0.86, 0.5, g);
  [-0.13, 0.13].forEach(x => box(0.08, 0.1, 0.04, mat('#111'), x, 1.14, 0.48, g));
  [-0.18, 0.18].forEach(x => box(0.08, 0.26, 0.08, mat('#ff9a1f'), x, 0.13, 0.05, g));
  box(0.3, 0.3, 0.08, y, 0, 0.75, -0.44, g).rotation.x = -0.5;
  return g;
}

// ---------- dunia ----------
const grassTop = tex(16, 16, (g) => { for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) {
  g.fillStyle = ['#5cc94a', '#52bb42', '#66d354', '#4cae3e'][(i * 7 + j * 13 + i * j) % 4]; g.fillRect(i, j, 1, 1); } });
const grassSide = tex(16, 16, (g) => { for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) {
  g.fillStyle = j < 4 + ((i * 5) % 3) ? '#5cc94a' : ['#9a6a3e', '#8b5d34', '#a57446'][(i * 3 + j * 7) % 3]; g.fillRect(i, j, 1, 1); } });
const dirt = new THREE.MeshStandardMaterial({ map: grassSide, roughness: .9 });
const top = new THREE.MeshStandardMaterial({ map: grassTop, roughness: .9 });
const blockM = [dirt, dirt, top, dirt, dirt, dirt];
const geo = new THREE.BoxGeometry(1, 1, 1);
for (let x = -14; x <= 14; x++) for (let z = -22; z <= 16; z++) {
  const hgt = (z < -12 && Math.abs(x) > 5) ? 1 + ((x * 3 + z) & 1) : 0;
  for (let k = 0; k <= hgt; k++) { const b = new THREE.Mesh(geo, blockM); b.position.set(x, -0.5 + k, z);
    b.receiveShadow = true; b.castShadow = k > 0; scene.add(b); } }

function tree(x, z, s = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g);
  box(0.7, 2.6, 0.7, mat('#7a4f2a'), 0, 1.3, 0, g);
  const lf = mat('#2f9e44'), lf2 = mat('#40b356');
  box(2.6, 1.3, 2.6, lf, 0, 3.0, 0, g); box(1.8, 1.0, 1.8, lf2, 0, 4.1, 0, g); box(1, .6, 1, lf, 0, 4.8, 0, g);
}
tree(-5.5, -6, 1.1); tree(5.8, -9, 1.3); tree(-9, -15, 1.5); tree(10, -16, 1.4);

// rumah kotak kecil (rumah Neng Kubi)
{ const g = new THREE.Group(); g.position.set(-3.6, 0, -11); scene.add(g);
  const wall = mat('#f5e1b8'), roof = mat('#e2553f'), wood = mat('#8a5a2b');
  box(4, 3, 3.4, wall, 0, 1.5, 0, g);
  for (let i = 0; i < 4; i++) box(4.6 - i * 1.1, 0.5, 4, roof, 0, 3.25 + i * 0.5, 0, g);
  box(0.9, 1.6, 0.1, wood, 0.6, 0.8, 1.72, g);
  box(0.9, 0.8, 0.1, mat('#9ad7ff', { roughness: .2 }), -1.0, 1.8, 1.72, g); }

// awan kotak
[[-9, 16, -30], [7, 15, -34], [1, 18, -40]].forEach(([x, y, z]) => {
  const c = mat('#ffffff', { roughness: 1 });
  box(5, 1.2, 3, c, x, y, z, scene); box(3, 1, 2.4, c, x + 1, y + 1, z, scene); });

scene.background = tex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#4aa8ff'); gr.addColorStop(.6, '#a9dcff'); gr.addColorStop(1, '#fff1d0');
  g.fillStyle = gr; g.fillRect(0, 0, w, h); });
scene.background.magFilter = THREE.LinearFilter;
scene.fog = new THREE.Fog('#cfe9ff', 28, 70);

// cahaya hangat siang
scene.add(new THREE.HemisphereLight('#cfe8ff', '#6b8f4e', 0.9));
const sun = new THREE.DirectionalLight('#fff0d4', 2.4);
sun.position.set(8, 16, 10); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 50 });
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03; scene.add(sun);

// ---------- pose ----------
bobi.position.set(-1.15, 0, 0); bobi.rotation.y = 0.28; scene.add(bobi);
kubi.position.set(1.25, 0, -0.4); kubi.rotation.y = -0.32; scene.add(kubi);
const piko = makePiko(); piko.position.set(0.15, 0, 1.1); piko.rotation.y = -0.4; scene.add(piko);
// Bobi pose "aku pro!": tangan kanan ke atas, kepala miring
bobi.userData.arms[1].rotation.z = 2.6; bobi.userData.arms[0].rotation.x = -0.3;
bobi.userData.head.rotation.z = -0.1;
// Kubi: lengan berpalu di pundak, kepala sinis
kubi.userData.arms[1].rotation.x = -1.6; kubi.userData.arms[1].rotation.z = 0.3;
kubi.userData.arms[0].rotation.z = -0.25; kubi.userData.head.rotation.y = -0.25;

cam.position.set(0.3, 2.3, 15.5); cam.lookAt(0.1, 1.55, 0);

renderer.render(scene, cam);

// ---------- telop (2D) ----------
await document.fonts.load('600 120px Fredoka');
const out = document.createElement('canvas'); out.width = W; out.height = H;
const g = out.getContext('2d'); g.drawImage(renderer.domElement, 0, 0);
function pill(x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
g.textAlign = 'center'; g.textBaseline = 'middle';
// judul
g.font = '700 128px Fredoka'; g.lineJoin = 'round';
g.lineWidth = 26; g.strokeStyle = '#2b1a5c'; g.strokeText('KOTAK KOCAK', W / 2, 250);
g.fillStyle = '#ffd23f'; g.fillText('KOTAK KOCAK', W / 2, 250);
g.font = '600 46px Fredoka'; pill(W / 2 - 230, 330, 460, 74, 37); g.fillStyle = '#ff4d8d'; g.fill();
g.fillStyle = '#fff'; g.fillText('tes gaya tokoh', W / 2, 368);
// subtitle Bobi
pill(90, 1530, 900, 150, 34); g.fillStyle = 'rgba(255,138,31,.95)'; g.fill();
g.lineWidth = 8; g.strokeStyle = '#fff'; g.stroke();
pill(120, 1500, 190, 60, 20); g.fillStyle = '#2b1a5c'; g.fill();
g.font = '600 40px Fredoka'; g.fillStyle = '#fff'; g.fillText('BOBI', 215, 1531);
g.font = '700 66px Fredoka'; g.fillStyle = '#fff'; g.fillText('Tenang, aku udah ', W / 2 - 80, 1612);
g.fillStyle = '#ffe94a'; g.fillText('PRO!', W / 2 + 270, 1612);
document.body.replaceChildren(out);
window.__done = true;
