// Film "Badai Rapor": set, properti, cuaca, shot, caption. Dirender per frame oleh render-film.cjs.
import * as THREE from 'three';
import { raka, mama, mamaTV, guru, pose, hold, rbox, plain, fabric, metalMat } from './avatar.js';

export const W = 1080, H = 1920, FPS = 30;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(35, W / H, 0.1, 400);

// ---------- util ----------
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const lerp = (a, b, u) => a + (b - a) * u;
const ease = (u) => u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u);
function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
function gradTex(stops) {
  return canvasTex(4, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); stops.forEach(([p, c]) => gr.addColorStop(p, c)); g.fillStyle = gr; g.fillRect(0, 0, 4, 512); });
}
function noiseTex(base, lines, n, amp = 18, rep = [1, 1]) {
  return canvasTex(256, 256, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    const d = g.getImageData(0, 0, 256, 256); for (let i = 0; i < d.data.length; i += 4) { const k = (Math.random() - .5) * amp; d.data[i] += k; d.data[i + 1] += k; d.data[i + 2] += k; } g.putImageData(d, 0, 0);
    if (lines) { g.strokeStyle = lines; g.lineWidth = 3; for (let i = 0; i <= 256; i += 256 / n) { g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); if (n < 8) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); } } }
  }, rep);
}
const mesh = (geo, m, x = 0, y = 0, z = 0, parent = scene) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; parent.add(o); return o; };
const box = (w, h, d, m, x, y, z, r = 0.06, parent = scene) => { const b = rbox(w, h, d, r, m); b.position.set(x, y, z); parent.add(b); return b; };
const glassMat = () => new THREE.MeshStandardMaterial({ color: '#9fd3f0', roughness: 0.15, metalness: 0.1, emissive: '#3a6f8f', emissiveIntensity: 0.15 });

// ---------- tekstur cerita ----------
function weatherMap(g, w, h) {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1f6fc4'); gr.addColorStop(1, '#3aa0e8'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = '#6cc36a'; [[300, 330, 220, 120, 0.3], [560, 380, 160, 90, -0.4], [760, 300, 120, 70, 0.2]].forEach(([x, y, rx, ry, r]) => { g.beginPath(); g.ellipse(x, y, rx, ry, r, 0, 7); g.fill(); });
  g.save(); g.translate(520, 250); g.fillStyle = '#ffcf33';
  for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.fillRect(-8, -150, 16, 50); }
  g.beginPath(); g.arc(0, 0, 85, 0, 7); g.fill(); g.restore();
  g.fillStyle = '#fff'; g.font = 'bold 72px DejaVu Sans'; g.textAlign = 'center'; g.fillText('CERAH SEHARIAN', w / 2, 90);
  g.font = 'bold 110px DejaVu Sans'; g.fillText('32°', 840, 520);
}
function raporTex(nilai, old) {
  return canvasTex(512, 640, (g, w, h) => {
    g.fillStyle = old ? '#efe0b8' : '#fbfaf5'; g.fillRect(0, 0, w, h);
    if (old) { g.fillStyle = 'rgba(150,110,50,0.18)'; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 20 + Math.random() * 50, 0, 7); g.fill(); } }
    g.fillStyle = '#2b3a67'; g.font = 'bold 52px DejaVu Sans'; g.textAlign = 'center'; g.fillText('RAPOR', w / 2, 80);
    g.strokeStyle = '#9aa3b5'; g.lineWidth = 3; g.font = 'bold 34px DejaVu Sans'; g.textAlign = 'left';
    [['IPA', '7'], ['Bahasa', '8'], ['Matematika', nilai], ['IPS', '7']].forEach(([m, v], i) => {
      const y = 170 + i * 100; g.beginPath(); g.moveTo(40, y + 30); g.lineTo(w - 40, y + 30); g.stroke();
      g.fillStyle = '#333'; g.fillText(m, 50, y);
      g.fillStyle = m === 'Matematika' ? '#d92b2b' : '#333'; g.font = m === 'Matematika' ? 'bold 90px DejaVu Sans' : 'bold 40px DejaVu Sans';
      g.fillText(v, w - 130, y + 10); g.font = 'bold 34px DejaVu Sans';
      if (m === 'Matematika') { g.strokeStyle = '#d92b2b'; g.lineWidth = 7; g.beginPath(); g.ellipse(w - 105, y - 18, 62, 66, 0, 0, 7); g.stroke(); g.strokeStyle = '#9aa3b5'; g.lineWidth = 3; }
    });
  });
}
function phoneTex(kind) {
  return canvasTex(360, 720, (g, w, h) => {
    g.fillStyle = '#eef1f4'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#3d8b6f'; g.fillRect(0, 0, w, 90); g.fillStyle = '#fff'; g.font = 'bold 30px DejaVu Sans'; g.fillText('Bu Guru Sari', 24, 58);
    if (kind === 'buzz') {
      g.fillStyle = '#fff'; g.beginPath(); g.roundRect(30, 250, 300, 170, 24); g.fill();
      g.fillStyle = '#333'; g.font = 'bold 28px DejaVu Sans'; g.fillText('1 pesan baru', 60, 300); g.font = '26px DejaVu Sans'; g.fillText('Foto: rapor Raka', 60, 350);
    } else {
      g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(70, 160, 260, 330, 22); g.fill();
      g.fillStyle = '#fbfaf5'; g.fillRect(90, 180, 220, 250); g.fillStyle = '#d92b2b'; g.font = 'bold 120px DejaVu Sans'; g.fillText('4', 165, 360);
      g.fillStyle = '#666'; g.font = '22px DejaVu Sans'; g.fillText('17.02', 210, 470);
      g.strokeStyle = '#2f8cff'; g.lineWidth = 6; [0, 16].forEach(dx => { g.beginPath(); g.moveTo(270 + dx, 462); g.lineTo(280 + dx, 472); g.lineTo(298 + dx, 450); g.stroke(); });
      g.fillStyle = '#2f8cff'; g.font = 'bold 24px DejaVu Sans'; g.fillText('Dibaca: Mama', 90, 540);
    }
  });
}
function alasanTex(wet) {
  return canvasTex(400, 300, (g, w, h) => {
    g.fillStyle = '#fffbe9'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#a9c4e8'; g.lineWidth = 2; for (let y = 60; y < h; y += 40) { g.beginPath(); g.moveTo(10, y); g.lineTo(w - 10, y); g.stroke(); }
    g.fillStyle = '#2346a8'; g.font = 'bold 44px DejaVu Sans'; g.fillText('ALASAN:', 24, 54);
    g.font = '30px DejaVu Sans'; ['1. soalnya susah', '2. lagi flu', '3. ...'].forEach((s, i) => g.fillText(s, 30, 100 + i * 40));
    if (wet) { g.fillStyle = 'rgba(35,70,168,0.45)'; for (let i = 0; i < 26; i++) { const x = 20 + Math.random() * 360, y = 30 + Math.random() * 120; g.fillRect(x, y, 6 + Math.random() * 8, 80 + Math.random() * 140); }
      g.fillStyle = 'rgba(150,180,220,0.35)'; for (let i = 0; i < 14; i++) { g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 8 + Math.random() * 16, 0, 7); g.fill(); } }
  });
}

// ---------- properti ----------
function makeRapor(nilai, old) {
  const g = new THREE.Group();
  const cover = rbox(1.15, 0.08, 1.5, 0.03, plain(old ? '#8a6a3a' : '#2b4aa0', 0.7)); g.add(cover);
  const page = new THREE.Mesh(new THREE.PlaneGeometry(1.06, 1.4), new THREE.MeshStandardMaterial({ map: raporTex(nilai, old), roughness: 0.9 }));
  page.rotation.x = -Math.PI / 2; page.position.y = 0.05; g.add(page);
  return g;
}
function makePhone(kind) {
  const g = new THREE.Group();
  box(0.5, 0.95, 0.07, plain('#1b1d22', 0.35), 0, 0, 0, 0.06, g);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.86), new THREE.MeshBasicMaterial({ map: phoneTex(kind), toneMapped: false })); s.position.z = 0.04; g.add(s);
  return g;
}
function makeUmbrella() {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.ConeGeometry(1.9, 0.75, 8, 1, true), new THREE.MeshStandardMaterial({ color: '#e5534b', roughness: 0.6, side: THREE.DoubleSide }));
  top.position.y = 2.4; top.castShadow = true; g.add(top);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.5, 8), metalMat('#bbb')); pole.position.y = 1.2; g.add(pole);
  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 8, 16, Math.PI), plain('#3a2a20')); hook.rotation.z = Math.PI; g.add(hook);
  return g;
}
function makeMug() {
  const g = new THREE.Group();
  mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.42, 20), plain('#f4f0e6', 0.4), 0, 0, 0, g);
  mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.02, 20), plain('#6b3d22', 0.3), 0, 0.19, 0, g);
  const h = mesh(new THREE.TorusGeometry(0.11, 0.035, 8, 16), plain('#f4f0e6', 0.4), 0.22, 0, 0, g);
  return g;
}
const alasanWet = { v: false };
const alasanMat = [new THREE.MeshStandardMaterial({ map: alasanTex(false), roughness: 0.9, side: THREE.DoubleSide }), new THREE.MeshStandardMaterial({ map: alasanTex(true), roughness: 0.9, side: THREE.DoubleSide })];
function makeNote() { const m = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.9), alasanMat[0]); m.castShadow = true; return m; }

// ---------- dunia: set di posisi x berbeda ----------
const SET = { street: 0, studio: -120, room: 120, school: 240, home: 360 };

function house(x, z, w, h, col, roof) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  box(w, h, 5, plain(col, 0.85), 0, h / 2, 0, 0.08, g);
  const tri = new THREE.Shape(); tri.moveTo(-w / 2 - 0.4, 0); tri.lineTo(0, 2.2); tri.lineTo(w / 2 + 0.4, 0); tri.closePath();
  mesh(new THREE.ExtrudeGeometry(tri, { depth: 5.6, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06 }), plain(roof, 0.75), 0, h, -2.8, g);
  [[-w / 4, h * 0.62], [w / 4, h * 0.62]].forEach(([wx, wy]) => {
    box(1.3, 1.3, 0.12, plain('#fff', 0.6), wx, wy, 2.52, 0.04, g); box(1.08, 1.08, 0.12, glassMat(), wx, wy, 2.56, 0.02, g);
    box(0.08, 1.08, 0.14, plain('#fff'), wx, wy, 2.57, 0.02, g); box(1.08, 0.08, 0.14, plain('#fff'), wx, wy, 2.57, 0.02, g);
  });
  box(1.1, 2.0, 0.12, plain('#7a4e33', 0.7), 0, 1.0, 2.53, 0.04, g);
  return g;
}
function shop(x, z, w, col) {
  const h = 3.6; box(w, h, 5, plain(col, 0.85), x, h / 2, z, 0.08);
  const t = canvasTex(256, 16, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#fff' : '#e5534b'; g.fillRect(i * 32, 0, 32, 16); } });
  const aw = box(w + 0.3, 0.12, 1.6, new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 }), x, h * 0.72, z + 3.1, 0.04); aw.rotation.x = 0.35;
  box(w * 0.75, 1.6, 0.12, glassMat(), x, 1.3, z + 2.53, 0.03);
}
function tree(x, z, s = 1, parent = scene) {
  mesh(new THREE.CylinderGeometry(0.28 * s, 0.36 * s, 2.6 * s, 10), plain('#8a5a3a', 0.9), x, 1.3 * s, z, parent);
  const a = plain('#4fa350', 0.85), b = plain('#62b85a', 0.85);
  box(2.8 * s, 1.8 * s, 2.8 * s, a, x, 3.3 * s, z, 0.5 * s, parent); box(2.1 * s, 1.5 * s, 2.1 * s, b, x + 0.15 * s, 4.6 * s, z + 0.1, 0.45 * s, parent);
  box(1.2 * s, 0.9 * s, 1.2 * s, a, x - 0.1, 5.6 * s, z, 0.3 * s, parent);
}
function lampPost(x, z, dir = 1) {
  const m = plain('#3d4450', 0.45);
  mesh(new THREE.CylinderGeometry(0.1, 0.14, 5.2, 10), m, x, 2.6, z);
  box(0.9, 0.12, 0.16, m, x + 0.4 * dir, 5.15, z, 0.04); box(0.6, 0.3, 0.45, plain('#fff4c9', 0.4), x + 0.8 * dir, 5.0, z, 0.06);
}
const grassMat = new THREE.MeshStandardMaterial({ map: noiseTex('#78b95a', null, 1, 26, [40, 40]), roughness: 0.95 });
function ground(x, w = 120, mat = grassMat) { const g = mesh(new THREE.PlaneGeometry(w, w), mat, x, 0, 0); g.rotation.x = -Math.PI / 2; g.castShadow = false; return g; }

function buildStreet() {
  const X = SET.street; ground(X, 110);
  const walk = new THREE.MeshStandardMaterial({ map: noiseTex('#d4d3cc', '#b5b3aa', 4, 10, [20, 1]), roughness: 0.9 });
  box(90, 0.12, 2.4, walk, X, 0.06, -4.2, 0.03); box(90, 0.12, 2.4, walk, X, 0.06, -12.4, 0.03);
  box(90, 0.04, 5.8, plain('#4b4f58', 0.9), X, 0.02, -8.3, 0.01);
  for (let i = -14; i < 14; i++) box(1.6, 0.05, 0.22, plain('#f3f3f3', 0.8), X + i * 3.2, 0.04, -8.3, 0.02);
  house(X - 6.2, -17, 5.4, 4.2, '#f4d6a0', '#c8553d'); house(X, -18.5, 5.8, 4.8, '#a9d6e5', '#3d5a80');
  shop(X + 6.4, -17, 5.2, '#f7f1e3'); house(X + 12.5, -18, 5.4, 4.2, '#d8c7f0', '#7a5195'); house(X - 12.4, -18.5, 5.4, 4.6, '#c7e9b0', '#b5651d');
  tree(X - 5.2, -2.2, 0.95); tree(X + 5.6, -2.6, 0.9); tree(X - 10, -14, 1.1); tree(X + 9.5, -13.5, 1.0); tree(X + 2.9, -14.5, 0.9); tree(X + 12, -1, 1.1); tree(X - 13, 0, 1.0);
  lampPost(X + 2.6, -5.6, -1); lampPost(X - 9, -5.6, 1);
  for (let i = -16; i <= 16; i++) box(0.16, 0.8, 0.16, plain('#fff', 0.7), X + i * 0.9, 0.4, -2.9, 0.04);
  box(30, 0.12, 0.1, plain('#fff', 0.7), X, 0.62, -2.9, 0.03);
  // taman bermain
  box(1.6, 2.4, 1.6, plain('#3a7bd5', 0.6), X - 8, 1.2, 2, 0.1); box(1.8, 0.2, 1.8, plain('#e0533f', 0.6), X - 8, 2.5, 2, 0.06);
  const sl = box(3.4, 0.14, 0.9, plain('#f2c230', 0.6), X - 6.6, 1.3, 2, 0.06); sl.rotation.z = -0.6;
}

function buildStudio() {
  const X = SET.studio;
  const fl = mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: '#1d2a4a', roughness: 0.35, metalness: 0.2 }), X, 0, 0); fl.rotation.x = -Math.PI / 2;
  mesh(new THREE.PlaneGeometry(40, 16), plain('#152038', 0.8), X, 8, -6);
  const map = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 5.4), new THREE.MeshBasicMaterial({ map: canvasTex(1024, 576, weatherMap), toneMapped: false }));
  map.position.set(X + 0.8, 4.4, -4.6); scene.add(map);
  box(10.0, 5.8, 0.3, plain('#c9d3e6', 0.4), X + 0.8, 4.4, -4.85, 0.1);
  box(5.2, 1.7, 1.7, plain('#2a3f73', 0.4), X + 5.2, 0.85, 1.2, 0.12);
  box(5.3, 0.1, 1.8, plain('#e8eefc', 0.3), X + 5.2, 1.74, 1.2, 0.04);
  box(5.0, 0.12, 0.05, new THREE.MeshBasicMaterial({ color: '#7fd0ff' }), X + 5.2, 0.9, 2.06, 0.02);
  [-1, 1].forEach(s => { mesh(new THREE.CylinderGeometry(0.06, 0.06, 6, 8), plain('#222'), X + s * 8, 3, -1);
    box(0.9, 0.6, 0.6, new THREE.MeshStandardMaterial({ color: '#333', emissive: '#fff6d8', emissiveIntensity: 0.6 }), X + s * 8, 6, -1, 0.08); });
  const ph = makePhone('buzz'); ph.rotation.x = -Math.PI / 2; ph.position.set(X + 5.6, 1.83, 1.25); scene.add(ph); STUDIO.phone = ph;
}
const STUDIO = {};

const ROOM = {};
function buildRoom() {
  const X = SET.room;
  const wood = new THREE.MeshStandardMaterial({ map: noiseTex('#b07a4a', '#8c5c34', 16, 14, [6, 6]), roughness: 0.6 });
  const fl = mesh(new THREE.PlaneGeometry(24, 24), wood, X, 0, 0); fl.rotation.x = -Math.PI / 2;
  const wall = plain('#f1e2c6', 0.95), wall2 = plain('#e8d4b0', 0.95);
  box(24, 8, 0.3, wall, X, 4, -5.2, 0.02); box(0.3, 8, 24, wall2, X - 9, 4, 0, 0.02); box(0.3, 8, 24, wall2, X + 9, 4, 0, 0.02);
  box(24, 1.0, 0.36, plain('#d8c09a', 0.9), X, 0.5, -5.0, 0.02);
  // jendela + "luar"
  box(3.6, 2.8, 0.36, plain('#ffffff', 0.6), X + 4.2, 4.1, -5.1, 0.05);
  ROOM.outside = mesh(new THREE.PlaneGeometry(3.2, 2.4), new THREE.MeshBasicMaterial({ color: '#bfe3ff', toneMapped: false }), X + 4.2, 4.1, -4.9); ROOM.outside.castShadow = false;
  box(0.1, 2.4, 0.4, plain('#fff'), X + 4.2, 4.1, -4.88, 0.02); box(3.2, 0.1, 0.4, plain('#fff'), X + 4.2, 4.1, -4.88, 0.02);
  // sofa
  const sofa = plain('#5f8fb5', 0.9);
  box(5.2, 1.2, 2.2, sofa, X - 2.5, 0.75, -3.6, 0.25); box(5.2, 2.0, 0.7, sofa, X - 2.5, 1.9, -4.5, 0.3);
  box(0.7, 1.7, 2.2, sofa, X - 5.2, 1.0, -3.6, 0.3); box(0.7, 1.7, 2.2, sofa, X + 0.2, 1.0, -3.6, 0.3);
  box(1.2, 1.0, 0.4, plain('#f2c230', 0.9), X - 4.2, 1.8, -4.0, 0.2);
  // karpet, meja kopi
  box(6, 0.04, 4, plain('#c96b5a', 0.95), X - 2.5, 0.02, -0.6, 0.02);
  box(2.4, 0.18, 1.2, plain('#8c5c34', 0.6), X - 2.5, 1.0, -1.0, 0.05); [-1, 1].forEach(s => box(0.15, 1.0, 0.15, plain('#6d4527'), X - 2.5 + s, 0.5, -1.0, 0.03));
  // TV (menghadap sofa)
  box(3.2, 1.2, 1.0, plain('#6d4527', 0.6), X - 2.5, 0.6, 4.5, 0.05);
  box(3.6, 2.1, 0.18, plain('#151515', 0.3), X - 2.5, 2.4, 4.6, 0.06);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.3, 1.85), new THREE.MeshBasicMaterial({ map: canvasTex(1024, 576, weatherMap), toneMapped: false }));
  scr.position.set(X - 2.5, 2.4, 4.5); scr.rotation.y = Math.PI; scene.add(scr);
  // meja belajar
  box(3.4, 0.16, 2.0, plain('#c89a66', 0.6), X + 4.5, 1.9, 0.5, 0.05);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(0.14, 1.9, 0.14, plain('#9c7448'), X + 4.5 + a * 1.5, 0.95, 0.5 + b * 0.85, 0.03));
  [-1, 1].forEach(s => { box(1.3, 0.14, 1.3, plain('#9c7448'), X + 4.5 + s * 1.05, 0.7, 2.1, 0.04); box(1.3, 2.0, 0.14, plain('#9c7448'), X + 4.5 + s * 1.05, 1.7, 2.75, 0.04);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => box(0.1, 0.7, 0.1, plain('#7d5a36'), X + 4.5 + s * 1.05 + a * 0.55, 0.35, 2.1 + b * 0.55, 0.02)); });
  const book = makeRapor('8', false); book.position.set(X + 4.0, 2.02, 0.6); book.rotation.y = 0.2; scene.add(book);
  ROOM.oldRapor = makeRapor('3', true); ROOM.oldRapor.position.set(X + 5.2, 2.02, 0.4); ROOM.oldRapor.rotation.y = Math.PI - 0.15; scene.add(ROOM.oldRapor);
  // lampu, tanaman, jam, gambar
  mesh(new THREE.CylinderGeometry(0.06, 0.06, 4, 8), plain('#333'), X + 0.9, 2, -4.4);
  ROOM.lampShade = mesh(new THREE.CylinderGeometry(0.4, 0.6, 0.7, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#fff1d0', emissive: '#ffcf80', emissiveIntensity: 0.0, side: THREE.DoubleSide }), X + 0.9, 4.1, -4.4);
  ROOM.lamp = new THREE.PointLight('#ffc77a', 0, 18, 1.5); ROOM.lamp.position.set(X + 0.9, 3.9, -3.8); scene.add(ROOM.lamp);
  mesh(new THREE.CylinderGeometry(0.5, 0.4, 0.9, 12), plain('#c96b3a'), X - 7.6, 0.45, -4.0); box(1.3, 1.6, 1.3, plain('#4fa350', 0.8), X - 7.6, 1.8, -4.0, 0.4);
  const clock = mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 24), plain('#fff', 0.5), X - 6.0, 6.0, -5.0); clock.rotation.x = Math.PI / 2;
  box(1.6, 1.2, 0.08, new THREE.MeshStandardMaterial({ map: canvasTex(160, 120, (g) => { g.fillStyle = '#9fd3f0'; g.fillRect(0, 0, 160, 120); g.fillStyle = '#ffcf33'; g.beginPath(); g.arc(80, 55, 28, 0, 7); g.fill(); g.fillStyle = '#6cc36a'; g.fillRect(0, 95, 160, 25); }) }), X - 6.2, 4.0, -5.0, 0.03);
  const mug = makeMug(); mug.position.set(X - 2.0, 1.3, -1.0); scene.add(mug); ROOM.tableMug = mug;
  [0, 1].forEach(i => { const m = makeMug(); m.position.set(X + 4.6 + i * 0.9, 2.2, 1.0); scene.add(m); });
}

function buildSchool() {
  const X = SET.school; ground(X, 120);
  const pave = new THREE.MeshStandardMaterial({ map: noiseTex('#d9cfbf', '#bfb3a0', 6, 10, [10, 6]), roughness: 0.9 });
  box(40, 0.06, 14, pave, X, 0.03, -3, 0.02);
  box(34, 7.5, 6, plain('#f3ead6', 0.85), X, 3.75, -14, 0.1);
  box(34.6, 0.6, 6.6, plain('#c8553d', 0.7), X, 7.8, -14, 0.1); box(34.6, 0.5, 6.6, plain('#c8553d', 0.7), X, 3.9, -14, 0.06);
  for (let i = -7; i <= 7; i++) for (const y of [2.1, 5.8]) { if (i === 0 && y < 3) continue; box(1.5, 1.6, 0.12, plain('#fff'), X + i * 2.2, y, -10.95, 0.04); box(1.3, 1.4, 0.12, glassMat(), X + i * 2.2, y, -10.9, 0.02); }
  box(2.2, 2.8, 0.14, plain('#7a4e33', 0.7), X, 1.4, -10.95, 0.04);
  box(6, 0.9, 0.12, plain('#2b4aa0', 0.6), X, 6.7, -10.9, 0.05);
  // tiang bendera
  mesh(new THREE.CylinderGeometry(0.08, 0.1, 9, 10), metalMat('#dfe3e8'), X + 9, 4.5, -5);
  box(2.0, 0.6, 0.04, plain('#d22d2d', 0.8), X + 10.05, 8.3, -5, 0.01); box(2.0, 0.6, 0.04, plain('#ffffff', 0.8), X + 10.05, 7.7, -5, 0.01);
  tree(X - 9, -6, 1.1); tree(X - 14, -3, 1.0); tree(X + 14, -4, 1.0);
  box(3, 0.5, 0.9, plain('#8c5c34', 0.6), X - 6, 0.8, -2.5, 0.06);
  const rc = makeRapor('4'); rc.position.set(X - 6, 1.1, -2.5); rc.rotation.y = 0.12; scene.add(rc); [-1, 1].forEach(s => box(0.15, 0.8, 0.8, plain('#5e3d22'), X - 6 + s * 1.3, 0.4, -2.5, 0.03));
}

const HOME = {};
function buildHome() {
  const X = SET.home; ground(X, 140);
  box(30, 0.04, 30, plain('#7aa05a', 0.95), X, 0.01, 0, 0.01);
  box(12, 5.4, 7, plain('#f4d6a0', 0.85), X, 2.7, -4.5, 0.1);
  const tri = new THREE.Shape(); tri.moveTo(-6.6, 0); tri.lineTo(0, 3.0); tri.lineTo(6.6, 0); tri.closePath();
  mesh(new THREE.ExtrudeGeometry(tri, { depth: 7.8, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08 }), plain('#c8553d', 0.7), X, 5.4, -8.4);
  // teras
  box(6.4, 0.4, 3.0, plain('#cfc7b8', 0.8), X, 0.2, 0.4, 0.04); box(6.4, 0.2, 0.8, plain('#bfb6a6', 0.8), X, 0.1, 2.3, 0.03);
  [-1, 1].forEach(s => box(0.3, 5.4, 0.3, plain('#fff', 0.6), X + s * 3.0, 3.0, 1.7, 0.05));
  box(7.2, 0.25, 3.4, plain('#a8432f', 0.7), X, 5.75, 0.3, 0.06);
  // pintu (terbuka) + cahaya dalam
  box(1.6, 2.9, 0.1, new THREE.MeshStandardMaterial({ color: '#2a1a10', emissive: '#ffb35a', emissiveIntensity: 0.55 }), X, 1.85, -0.98, 0.02);
  const door = box(1.5, 2.8, 0.12, plain('#7a4e33', 0.7), X + 0.75, 1.8, -0.95, 0.04); door.geometry.translate(0.75, 0, 0); door.position.x = X - 0.75; door.rotation.y = -1.2;
  box(1.9, 0.16, 0.2, plain('#fff'), X, 3.34, -0.92, 0.03);
  HOME.porch = new THREE.PointLight('#ffc27a', 6, 9, 1.4); HOME.porch.position.set(X, 4.6, 0.8); scene.add(HOME.porch);
  HOME.porchBulb = box(0.3, 0.3, 0.3, new THREE.MeshStandardMaterial({ color: '#fff', emissive: '#ffd59a', emissiveIntensity: 1.5 }), X + 1.2, 3.6, -0.85, 0.08);
  HOME.inside = new THREE.PointLight('#ffb35a', 8, 6, 1.5); HOME.inside.position.set(X, 2.2, -2); scene.add(HOME.inside);
  [-1, 1].forEach(s => { box(1.8, 1.6, 0.12, plain('#fff'), X + s * 3.8, 2.8, -0.97, 0.04); box(1.6, 1.4, 0.12, new THREE.MeshStandardMaterial({ color: '#ffe2a8', emissive: '#ffb35a', emissiveIntensity: 0.5 }), X + s * 3.8, 2.8, -0.92, 0.02); });
  for (let i = -10; i <= 10; i++) if (Math.abs(i) > 1) box(0.16, 1.0, 0.16, plain('#fff', 0.7), X + i * 0.9, 0.5, 7, 0.04);
  box(8, 0.12, 0.1, plain('#fff', 0.7), X - 5.4, 0.8, 7, 0.03); box(8, 0.12, 0.1, plain('#fff', 0.7), X + 5.4, 0.8, 7, 0.03);
  tree(X - 9, -2, 1.15); tree(X + 9.5, -1, 1.0);
  box(0.5, 0.5, 0.7, plain('#3a7bd5', 0.5), X + 4.5, 1.6, 6.6, 0.06); mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8), plain('#555'), X + 4.5, 0.7, 6.6);
  // matahari senja + pelangi
  HOME.sun = new THREE.Mesh(new THREE.SphereGeometry(7, 32, 16), new THREE.MeshBasicMaterial({ color: '#ffb24d', toneMapped: false, fog: false }));
  HOME.sun.position.set(X + 75, 11, -45); scene.add(HOME.sun);
  HOME.rainbow = new THREE.Group(); ['#ff5a5a', '#ffa64d', '#ffe45a', '#6edb6e', '#5aa8ff', '#8c6bff'].forEach((c, i) => {
    const r = new THREE.Mesh(new THREE.TorusGeometry(60 - i * 1.6, 0.8, 8, 80, Math.PI), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.32, fog: false, depthWrite: false }));
    HOME.rainbow.add(r); });
  HOME.rainbow.position.set(X - 30, -6, -120); scene.add(HOME.rainbow);
}

// ---------- tokoh ----------
const C = { raka: raka('neutral'), mama: mama('gentle'), mamaTV: mamaTV('smug'), guru: guru('gentle') };
C.raka.scale.setScalar(0.86);
Object.values(C).forEach(c => scene.add(c));
const P = {
  raporGuru: makeRapor('4'), raporMama: makeRapor('4'), raporRaka: makeRapor('4'), phone: makePhone('read'),
  umbrella: makeUmbrella(), note: makeNote(), mugMama: makeMug(), towel: rbox(1.5, 0.35, 1.5, 0.15, fabric('#f7f7f2')),
};
hold(C.guru, -1, P.raporGuru, 0, -1.0, 0.5).rotation.set(1.2, 0, 0);
hold(C.mama, -1, P.raporMama, 0, -1.0, 0.55).rotation.set(1.3, 0, 0);
hold(C.raka, -1, P.phone, 0, -1.0, 0.45).rotation.set(-0.6, 0, Math.PI);
scene.add(P.umbrella); scene.add(P.note);
hold(C.mama, 1, P.mugMama, 0, -1.05, 0.45);
C.raka.userData.head.add(P.towel); P.towel.position.set(0, 0.62, -0.05);
const rakaRaporHeld = hold(C.raka, -1, P.raporRaka, 0, -1.0, 0.5); rakaRaporHeld.rotation.set(1.2, 0, 0);

// ---------- cuaca ----------
const hemi = new THREE.HemisphereLight(0xdff0ff, 0x7d935f, 1.15); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.4); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03;
Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 70 });
scene.add(sun); scene.add(sun.target);
const SKY = {
  clear: { bg: [[0, '#5aa7ec'], [0.55, '#9fd0f6'], [1, '#e4f3fd']], fog: '#d7ecfb', near: 30, far: 90, hemi: [0xdff0ff, 0x7d935f, 1.15], sun: [0xfff0d8, 2.4], dir: [7, 14, 10], win: '#bfe3ff' },
  overcast: { bg: [[0, '#6e7c8c'], [0.6, '#9aa5b1'], [1, '#c3cad1']], fog: '#a9b2bb', near: 20, far: 70, hemi: [0xc9d3de, 0x5f6b55, 1.0], sun: [0xdfe6ee, 0.7], dir: [4, 14, 8], win: '#a9b2bb' },
  rain: { bg: [[0, '#2f3a4a'], [0.6, '#4b5768'], [1, '#66717f']], fog: '#4d5766', near: 10, far: 45, hemi: [0x9fb0c4, 0x3d4636, 0.7], sun: [0x9fb2c8, 0.35], dir: [4, 14, 8], win: '#4d5766' },
  golden: { bg: [[0, '#4a5fa8'], [0.45, '#e8915a'], [0.8, '#ffc781'], [1, '#ffe3b0']], fog: '#f2b07a', near: 40, far: 160, hemi: [0xffd9b0, 0x6b5a3a, 0.95], sun: [0xffa860, 2.3], dir: [10, 5, -8], win: '#ffc781' },
  studio: { bg: [[0, '#0b1630'], [1, '#1b2c55']], fog: '#0b1630', near: 40, far: 120, hemi: [0xbfd4ff, 0x223355, 1.0], sun: [0xffffff, 1.7], dir: [2, 9, 10], win: '#000' },
  morning: { bg: [[0, '#f1e2c6'], [1, '#f1e2c6']], fog: '#f1e2c6', near: 40, far: 120, hemi: [0xfff4e6, 0x8a6f55, 1.25], sun: [0xfff3dd, 1.6], dir: [6, 10, -6], win: '#cfeaff', lamp: 0 },
  nightRain: { bg: [[0, '#f1e2c6'], [1, '#f1e2c6']], fog: '#f1e2c6', near: 40, far: 120, hemi: [0xffe2bf, 0x5a4636, 0.75], sun: [0x8fa4bf, 0.35], dir: [6, 10, -6], win: '#3b4656', lamp: 22 },
  afternoon: { bg: [[0, '#f1e2c6'], [1, '#f1e2c6']], fog: '#f1e2c6', near: 40, far: 120, hemi: [0xffe9cc, 0x7a5f45, 1.05], sun: [0xffc890, 1.9], dir: [8, 7, -8], win: '#ffd9a0', lamp: 6 },
};
const bgCache = {};
let rainOn = 0;
function applySky(name, origin, focus = V(0, 0, 0)) {
  const s = SKY[name];
  scene.background = bgCache[name] ||= gradTex(s.bg);
  scene.fog = new THREE.Fog(s.fog, s.near, s.far);
  hemi.color.set(s.hemi[0]); hemi.groundColor.set(s.hemi[1]); hemi.intensity = s.hemi[2];
  sun.color.set(s.sun[0]); sun.intensity = s.sun[1];
  const tgt = V(origin, 0, 0).add(focus); sun.target.position.copy(tgt); sun.position.copy(tgt).add(V(...s.dir));
  ROOM.outside.material.color.set(s.win); ROOM.lamp.intensity = s.lamp || 0; ROOM.lampShade.material.emissiveIntensity = s.lamp ? 1.2 : 0;
  HOME.porch.intensity = name === 'rain' ? 6 : name === 'golden' ? 1.5 : 0; HOME.inside.intensity = name === 'rain' ? 5 : 2;
  HOME.sun.visible = HOME.rainbow.visible = name === 'golden';
}
// hujan
const RN = 2600, rainGeo = new THREE.BufferGeometry(), rainPos = new Float32Array(RN * 6), rainSeed = [];
for (let i = 0; i < RN; i++) rainSeed.push([Math.random(), Math.random(), Math.random()]);
rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: '#cfe0f5', transparent: true, opacity: 0.55, fog: false }));
rain.frustumCulled = false; scene.add(rain);
function updateRain(t, amount) {
  rain.visible = amount > 0; if (!amount) return;
  const c = cam.position, d = new THREE.Vector3(); cam.getWorldDirection(d);
  const cx = c.x + d.x * 8, cz = c.z + d.z * 8, n = Math.floor(RN * amount);
  for (let i = 0; i < RN; i++) {
    const [a, b, e] = rainSeed[i], o = i * 6;
    if (i >= n) { rainPos.fill(0, o, o + 6); continue; }
    const x = cx + (a - 0.5) * 22, z = cz + (b - 0.5) * 22, y = 14 - ((e * 14 + t * 16) % 14);
    rainPos[o] = x; rainPos[o + 1] = y; rainPos[o + 2] = z; rainPos[o + 3] = x - 0.06; rainPos[o + 4] = y - 0.55; rainPos[o + 5] = z;
  }
  rainGeo.attributes.position.needsUpdate = true;
}

// ---------- animasi ----------
function resetChar(c) {
  c.visible = false; c.position.set(0, 0, 0); c.rotation.set(0, 0, 0);
  const u = c.userData; u.body.position.set(0, 0, 0); u.body.rotation.set(0, 0, 0);
  [-1, 1].forEach(s => { u.hips[s].rotation.set(0, 0, 0); u.arms[s].rotation.set(0, 0, 0); u.arms[s].userData.elbow.rotation.set(0, 0, 0); });
  u.head.rotation.set(0, 0, 0);
}
function place(c, x, z, ry = 0, y = 0) { c.visible = true; c.position.set(x, y, z); c.rotation.y = ry; }
function expr(c, e) { if (c.userData.cur !== e) { c.userData.head.userData.setExpr(e); c.userData.cur = e; } }
function idle(c, t, k = 1) { c.userData.body.position.y = Math.sin(t * 2.4) * 0.03 * k; c.userData.head.rotation.z = Math.sin(t * 1.3) * 0.03 * k; }
function walk(c, t, sp = 1) {
  const p = Math.sin(t * 7 * sp), u = c.userData;
  u.hips[-1].rotation.x = p * 0.55; u.hips[1].rotation.x = -p * 0.55;
  u.arms[-1].rotation.x = -p * 0.5; u.arms[1].rotation.x = p * 0.5;
  u.body.position.y = Math.abs(Math.cos(t * 7 * sp)) * 0.12;
}
function sit(c, seatY) { const u = c.userData; u.hips[-1].rotation.x = u.hips[1].rotation.x = -Math.PI / 2; c.position.y = seatY + 0.55 - 2.0 * c.scale.y; }
function handPos(c, s) { c.updateMatrixWorld(true); const v = new THREE.Vector3(0, -0.95, 0); return c.userData.arms[s].userData.elbow.localToWorld(v); }
function props(on) { Object.entries(P).forEach(([k, o]) => o.visible = on.includes(k)); }

// ---------- shot ----------
// tiap shot: [t0, set, sky, setup(lt, u), camera(lt, u) -> {p, l, fov}, rain]
const X = SET;
const camLerp = (p0, p1, l0, l1, fov0 = 35, fov1 = fov0) => (lt, u) => ({ p: p0.clone().lerp(p1, ease(u)), l: l0.clone().lerp(l1, ease(u)), fov: lerp(fov0, fov1, ease(u)) });
// close-up: kepala tokoh c, jarak d, geser kamera dx, wajah sedikit di atas tengah layar
const headPos = (c) => { c.updateMatrixWorld(true); return c.userData.head.getWorldPosition(new THREE.Vector3()); };
const closeUp = (c, d0, d1, dx = 0, fov = 30, dy = 0.1, ang = 0) => (lt, u) => { const h = headPos(c), d = lerp(d0, d1, ease(u)), ry = c.rotation.y + ang;
  const p = h.clone().add(V(Math.sin(ry) * d + Math.cos(ry) * dx, 0.25 + dy, Math.cos(ry) * d - Math.sin(ry) * dx)); return { p, l: h.clone().add(V(0, -0.38, 0)), fov }; };
const SHOTS = [
  // L1: studio cuaca
  [0.0, 'studio', 'studio', (t) => { place(C.mamaTV, X.studio - 3.4, 0.6, 0.35); pose(C.mamaTV, 1, 2.3 + Math.sin(t * 3) * 0.08, -0.25, -0.3); pose(C.mamaTV, -1, -0.1, 0.4); expr(C.mamaTV, 'happy'); idle(C.mamaTV, t); props([]); },
    camLerp(V(X.studio - 0.8, 3.6, 17), V(X.studio - 1.0, 3.5, 15.5), V(X.studio - 1.2, 3.4, -1), V(X.studio - 1.4, 3.4, -1), 40, 38)],
  [1.75, 'studio', 'studio', (t) => { place(C.mamaTV, X.studio - 3.4, 0.6, 0.35); pose(C.mamaTV, 1, 2.3, -0.25, -0.3); pose(C.mamaTV, -1, -0.1, 0.4); expr(C.mamaTV, 'smug'); idle(C.mamaTV, t); props([]); },
    closeUp(C.mamaTV, 6.2, 5.4, 0.6, 30)],
  [3.6, 'room', 'morning', (t, u) => { place(C.raka, X.room - 2.6, -3.3, 0, 0); sit(C.raka, 1.35); pose(C.raka, -1, 0.05, 0, -0.5); pose(C.raka, 1, 0.05, 0, -0.5); expr(C.raka, t < 4.75 ? 'neutral' : 'annoyed'); props([]); },
    closeUp(C.raka, 5.8, 4.8, 0.3, 30)],
  // L2: sekolah
  [5.62, 'school', 'clear', (t) => { place(C.raka, X.school + 1.2, 3 + (t - 5.6) * 1.6, 0.0); walk(C.raka, t); expr(C.raka, 'happy'); props([]); },
    camLerp(V(X.school + 4, 2.2, 16), V(X.school + 2, 3.2, 17), V(X.school, 4.5, -6), V(X.school - 1, 4.2, -4), 42, 40)],
  [6.85, 'school', 'clear', (t, u) => { place(C.guru, X.school + 1.2, 0, -0.9); place(C.raka, X.school - 1.3, 0.2, 0.9);
      pose(C.guru, -1, -0.1, 0.15, -0.6 - u * 0.25); pose(C.guru, 1, 0.05, 0); expr(C.guru, 'gentle'); expr(C.raka, 'smug'); idle(C.raka, t); idle(C.guru, t); props(['raporGuru']); },
    camLerp(V(X.school - 0.2, 3.6, 11.5), V(X.school - 0.1, 3.5, 10.5), V(X.school, 3.0, 0), V(X.school, 3.0, 0), 36)],
  // L3: rapor 4 + wajah Raka
  [8.0, 'school', 'clear', (t, u) => { props([]); },
    camLerp(V(X.school - 6, 3.6, -1.6), V(X.school - 6, 3.1, -1.85), V(X.school - 5.95, 1.1, -2.45), V(X.school - 5.95, 1.1, -2.45), 38, 34)],
  [9.65, 'school', 'clear', (t) => { place(C.raka, X.school - 1.3, 0.2, 0); pose(C.raka, -1, -0.05, 0, -1.25); expr(C.raka, t < 10.75 ? 'surprised' : 'sad'); props(['raporRaka']); idle(C.raka, t, 0.5); },
    closeUp(C.raka, 5.4, 4.4, 0, 30)],
  // L4: langit mendung + HP Mama
  [12.2, 'street', 'overcast', (t) => { place(C.raka, X.street - 2.6 + (t - 12.2) * 1.2, -3.8, Math.PI / 2); walk(C.raka, t); expr(C.raka, 'worried'); props([]); },
    camLerp(V(X.street - 1, 1.6, 7.5), V(X.street - 0.5, 1.5, 7.5), V(X.street - 1.5, 5.5, -4), V(X.street - 0.5, 7.5, -6), 46, 46)],
  [14.2, 'studio', 'studio', (t, u) => { props([]); const k = Math.sin(t * 60) * 0.02 * (Math.sin(t * 9) > 0); STUDIO.phone.position.x = X.studio + 5.6 + k; },
    camLerp(V(X.studio + 5.6, 3.4, 2.3), V(X.studio + 5.6, 3.0, 2.0), V(X.studio + 5.6, 1.83, 1.25), V(X.studio + 5.6, 1.83, 1.25), 34, 30)],
  // L5: OTS Raka lihat HP
  [16.25, 'street', 'overcast', (t) => { place(C.raka, X.street + 0.5, -3.5, 0.2); pose(C.raka, -1, -0.2, 0.2, -1.35); expr(C.raka, t < 18.6 ? 'worried' : 'surprised'); props(['phone']); },
    (lt, u) => { const hp = new THREE.Vector3(); P.phone.getWorldPosition(hp); const k = ease(u); return { p: hp.clone().add(V(-0.7 + k * 0.4, 1.7 - k * 0.5, -2.2 + k * 1.0)), l: hp, fov: 38 - k * 6 }; }],
  // L6: payung, doa, latihan alasan, basah
  [19.4, 'street', 'overcast', (t) => { place(C.raka, X.street - 1.5, -1.0, 0.3); pose(C.raka, 1, 0.15, -0.3, -0.9); expr(C.raka, 'smug'); idle(C.raka, t); props(['umbrella']); P.umbrella.position.copy(handPos(C.raka, 1)); },
    camLerp(V(X.street - 0.6, 3.4, 10.5), V(X.street - 0.8, 3.6, 9.5), V(X.street - 1.5, 3.6, -1), V(X.street - 1.5, 3.8, -1), 38, 36), 0.15],
  [21.55, 'street', 'overcast', (t) => { place(C.raka, X.street - 1.5, -1.0, 0.0); pose(C.raka, -1, 0.3, -0.75, -1.3); pose(C.raka, 1, -0.3, 0.75, -1.3); expr(C.raka, 'worried'); idle(C.raka, t, 1.5); props([]); },
    closeUp(C.raka, 7.0, 6.2, 0, 32, -0.4), 0.2],
  [23.55, 'street', 'overcast', (t) => { place(C.raka, X.street + 2.4, -3.3, Math.PI * 0.82); pose(C.raka, -1, -0.3 - Math.abs(Math.sin(t * 6)) * 0.9, -0.6, -0.5); expr(C.raka, 'smug'); idle(C.raka, t); props([]); },
    camLerp(V(X.street + 4.4, 3.4, -9.6), V(X.street + 4.1, 3.4, -9.0), V(X.street + 2.4, 3.5, -3.3), V(X.street + 2.4, 3.5, -3.3), 38, 35), 0.25],
  [25.35, 'street', 'rain', (t, u) => { place(C.raka, X.street - 1.5, -1.0, 0.0); pose(C.raka, 1, -0.25, 0.4, -1.0); pose(C.raka, -1, 0.25, -0.4, -1.0); expr(C.raka, 'sad'); props(['note']); alasanSet(t > 25.9);
      P.note.position.set(X.street - 1.5, 3.35 - (t > 25.9 ? 0.08 : 0), 0.75); P.note.rotation.set(-0.2 + (t > 25.9 ? 0.35 : 0), 0, t > 25.9 ? 0.1 : 0); },
    (lt, u) => { const k = ease(u); return { p: V(X.street - 1.5, 3.8 - k * 0.15, 3.5 - k * 0.4), l: V(X.street - 1.5, 3.3, 0.75), fov: 34 }; }, 0.8],
  // L7: rumah, hujan deras; Mama di pintu
  [27.0, 'home', 'rain', (t) => { place(C.mama, X.home, -0.6, 0, 0.4); pose(C.mama, -1, 0.05, 0.2, -0.7); expr(C.mama, 'annoyed'); props(['raporMama']); },
    camLerp(V(X.home + 3, 3.2, 20), V(X.home + 2, 3.0, 17), V(X.home, 3.0, -2), V(X.home, 3.0, -2), 42, 40), 1],
  [29.0, 'home', 'rain', (t) => { place(C.mama, X.home, -0.6, 0, 0.4); pose(C.mama, -1, 0.05, 0.2, -0.7); expr(C.mama, 'annoyed'); props(['raporMama']); },
    camLerp(V(X.home + 0.6, 0.9, 6.0), V(X.home + 0.5, 0.8, 5.2), V(X.home, 4.4, -0.6), V(X.home, 4.5, -0.6), 38, 36), 1],
  // L8: Mama tegas; Raka basah
  [31.75, 'home', 'rain', (t) => { place(C.mama, X.home, -0.6, 0, 0.4); pose(C.mama, 1, 0.1 + Math.max(0, Math.sin(t * 5)) * 0.2, 0, -1.45); pose(C.mama, -1, 0.05, 0.2, -0.7); expr(C.mama, 'annoyed'); idle(C.mama, t); props(['raporMama']); },
    closeUp(C.mama, 6.4, 5.6, -0.5, 30), 1],
  [34.05, 'home', 'rain', (t) => { place(C.raka, X.home + 0.3, 3.4, Math.PI - 0.1, 0); expr(C.raka, 'worried'); idle(C.raka, t, 2); props([]); },
    closeUp(C.raka, 5.0, 4.4, 0.4, 32), 1],
  // L9: hangat di dalam
  [36.6, 'room', 'nightRain', (t, u) => { place(C.raka, X.room - 3.6, -3.3, 0.2); sit(C.raka, 1.35); expr(C.raka, 'worried'); props(['towel', 'mugMama']);
      place(C.mama, X.room - 1.2, -1.6, -2.2); pose(C.mama, 1, 0, 0, -1.25 * ease((t - 37.0) / 0.8)); expr(C.mama, t < 37.2 ? 'neutral' : 'gentle'); idle(C.mama, t); },
    camLerp(V(X.room - 6.4, 4.1, 2.2), V(X.room - 6.0, 4.0, 1.7), V(X.room - 2.4, 3.1, -2.4), V(X.room - 2.4, 3.1, -2.4), 42, 40)],
  [40.0, 'room', 'nightRain', (t) => { place(C.mama, X.room - 1.2, -1.6, -2.2); pose(C.mama, 1, 0, 0, -1.25); expr(C.mama, 'gentle'); idle(C.mama, t); props(['towel', 'mugMama']);
      place(C.raka, X.room - 3.6, -3.3, 0.2); sit(C.raka, 1.35); expr(C.raka, 'worried'); },
    closeUp(C.mama, 5.6, 4.8, 0, 30, 0.1, 0.75)],
  // L10: Raka jujur -> petir
  [43.6, 'room', 'nightRain', (t) => { place(C.raka, X.room - 3.6, -3.3, 0.2); sit(C.raka, 1.35); pose(C.raka, -1, 0, 0, -1.1); expr(C.raka, 'neutral'); props(['towel', 'mugMama']); idle(C.raka, t, 0.6);
      place(C.mama, X.room - 1.2, -1.6, -2.2); },
    closeUp(C.raka, 5.0, 4.2, 0, 30, 0.1, -0.7)],
  [47.07, 'room', 'nightRain', (t) => { place(C.mama, X.room - 1.2, -1.6, -2.2); pose(C.mama, 1, 0.3, 0, -0.6); pose(C.mama, -1, -0.5, 0.4, -0.4); expr(C.mama, 'surprised'); props(['towel']);
      place(C.raka, X.room - 3.6, -3.3, 0.2); sit(C.raka, 1.35); },
    (lt, u) => { const k = Math.min(1, lt / 0.12), c = closeUp(C.mama, 5.6, 5.6, 0, 30, 0.1, 0.75)(lt, u); c.fov = 32 - k * 7; return c; }],
  // L11: belajar bareng, rapor lama 3, tertawa
  [47.55, 'room', 'afternoon', (t) => { place(C.raka, X.room + 3.45, 2.1, Math.PI); sit(C.raka, 0.77); pose(C.raka, -1, 0, 0, -1.3 + Math.sin(t * 9) * 0.06); expr(C.raka, 'confused');
      place(C.mama, X.room + 5.55, 2.1, Math.PI); sit(C.mama, 0.77); pose(C.mama, 1, 0, 0.1, -1.4); expr(C.mama, 'gentle'); props(['towel']); P.towel.visible = false; },
    camLerp(V(X.room + 4.3, 4.8, -4.9), V(X.room + 4.5, 4.6, -4.6), V(X.room + 4.5, 2.9, 1.5), V(X.room + 4.5, 2.9, 1.5), 40, 38)],
  [50.3, 'room', 'afternoon', (t, u) => { props([]); place(C.mama, X.room + 5.55, 2.1, Math.PI); sit(C.mama, 0.77); },
    camLerp(V(X.room + 5.2, 3.6, -1.3), V(X.room + 5.2, 3.2, -1.0), V(X.room + 5.2, 2.0, 0.4), V(X.room + 5.2, 2.0, 0.4), 36, 32)],
  [51.75, 'room', 'afternoon', (t) => { props([]); place(C.raka, X.room + 3.45, 2.1, Math.PI); sit(C.raka, 0.77); expr(C.raka, 'laugh'); idle(C.raka, t * 3, 2);
      place(C.mama, X.room + 5.55, 2.1, Math.PI); sit(C.mama, 0.77); pose(C.mama, -1, -0.3, 1.6, -0.6); expr(C.mama, 'laugh'); idle(C.mama, t * 3, 2); },
    camLerp(V(X.room + 4.5, 4.5, -3.9), V(X.room + 4.5, 4.5, -3.5), V(X.room + 4.5, 3.4, 1.9), V(X.room + 4.5, 3.4, 1.9), 34, 32)],
  // L12: senja di teras
  [53.65, 'home', 'golden', (t) => { props([]); place(C.raka, X.home - 0.9, 1.7, 0); sit(C.raka, 0.55); place(C.mama, X.home + 0.9, 1.6, 0); sit(C.mama, 0.55);
      pose(C.mama, -1, -0.05, 0, -0.2); expr(C.raka, 'gentle'); expr(C.mama, 'gentle'); },
    camLerp(V(X.home + 1, 2.6, 22), V(X.home + 0.5, 3.0, 19), V(X.home, 3.5, 0), V(X.home, 4.2, -2), 44, 42)],
  // L13: pelukan, kamera naik ke matahari
  [56.1, 'home', 'golden', (t) => { props([]); place(C.raka, X.home - 0.75, 1.7, 0.1); sit(C.raka, 0.55); place(C.mama, X.home + 0.9, 1.6, -0.2); sit(C.mama, 0.55);
      pose(C.mama, -1, -2.2, 1.25, 0); C.mama.userData.body.rotation.z = 0.08; C.raka.userData.body.rotation.z = -0.06; expr(C.raka, t < 57.4 ? 'gentle' : 'happy'); expr(C.mama, 'gentle'); },
    (lt, u) => { const k = ease((u - 0.4) / 0.6); return { p: V(X.home + 0.1 + k * 1.5, 3.0 + k * 1.0, 8.5 + k * 1.5), l: V(X.home + lerp(0, 75, k), lerp(2.6, 11, k), lerp(1.6, -45, k)), fov: lerp(36, 42, k) }; }],
];
const END = 59.83;
function alasanSet(wet) { P.note.material = alasanMat[wet ? 1 : 0]; }

// ---------- caption ----------
const cap = document.createElement('canvas'); cap.width = W; cap.height = H; const cg = cap.getContext('2d');
let WORDS = [];
export function setWords(w) { WORDS = w; }
function drawCaption(t, flash) {
  cg.clearRect(0, 0, W, H);
  cg.drawImage(renderer.domElement, 0, 0);
  if (flash > 0) { cg.fillStyle = `rgba(255,255,255,${flash})`; cg.fillRect(0, 0, W, H); }
  let cur = null;
  for (const w of WORDS) { if (t >= w.t0 - 0.02) cur = w; else break; }
  if (!cur || t > cur.t1 + 0.35) return;
  const age = t - cur.t0, s = age < 0.09 ? 1.28 - (age / 0.09) * 0.28 : 1;
  const len = cur.w.length, size = Math.min(150, Math.floor(980 / Math.max(5, len) * 1.6));
  cg.save(); cg.translate(W / 2, H * 0.6); cg.scale(s, s);
  cg.font = `bold ${size}px "DejaVu Sans", sans-serif`; cg.textAlign = 'center'; cg.textBaseline = 'middle';
  cg.lineJoin = 'round'; cg.lineWidth = size * 0.2; cg.strokeStyle = '#000'; cg.strokeText(cur.w, 0, 0);
  cg.fillStyle = cur.key ? '#ff2d2d' : '#ffffff'; cg.fillText(cur.w, 0, 0);
  cg.restore();
}

// ---------- render satu frame ----------
buildStreet(); buildStudio(); buildRoom(); buildSchool(); buildHome();
export function renderFrame(f) {
  const t = f / FPS;
  let i = SHOTS.length - 1; while (i > 0 && SHOTS[i][0] > t) i--;
  const [t0, set, sky, setup, camf, rainAmt = 0] = SHOTS[i];
  const t1 = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : END, lt = t - t0, u = Math.min(1, lt / (t1 - t0));
  Object.values(C).forEach(resetChar); STUDIO.phone.position.x = X.studio + 5.6;
  setup(t, u);
  scene.updateMatrixWorld(true);
  const c = camf(lt, u); cam.position.copy(c.p); cam.fov = c.fov; cam.updateProjectionMatrix(); cam.lookAt(c.l);
  // getaran kamera saat petir
  if (t >= 47.07 && t < 47.4) { cam.position.x += Math.sin(t * 90) * 0.06; cam.position.y += Math.cos(t * 70) * 0.05; }
  applySky(sky, X[set], set === 'home' || set === 'street' || set === 'school' ? V(c.l.x - X[set], 0, Math.max(-6, Math.min(4, c.l.z))) : V(0, 0, 0));
  // transisi langit cerah -> mendung pada shot L4 pertama
  if (i === 7) { const k = ease(u * 1.6); hemi.intensity = lerp(1.15, 1.0, k); sun.intensity = lerp(2.4, 0.7, k); scene.background = k < 0.5 ? bgCache.clear ||= gradTex(SKY.clear.bg) : bgCache.overcast; }
  // hujan: deras di rumah, reda saat L12
  let flash = 0;
  if (t >= 47.07 && t < 47.55) { const k = (t - 47.07); flash = k < 0.06 ? 0.85 : k < 0.12 ? 0.2 : k < 0.17 ? 0.6 : Math.max(0, 0.5 - k); ROOM.outside.material.color.set(flash > 0.3 ? '#ffffff' : '#3b4656'); }
  updateRain(t, rainAmt);
  renderer.render(scene, cam);
  drawCaption(t, flash);
  return cap.toDataURL('image/jpeg', 0.9);
}
export const TOTAL_FRAMES = Math.round(END * FPS);

// ---------- AKHIRAN (end card) Kota Kotak ----------
// Mama 0,35-2,74 dtk, Raka 2,95-5,5 dtk; total 6 dtk.
export const END_FRAMES = 180;
const EP = { title: 'EPISODE 1 · BADAI RAPOR', next: 'Episode 2 besok!' };
export function setEpisode(title, next) { EP.title = title; EP.next = next; }
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function drawTiles(g, t) {
  const word = 'KOTA KOTAK', cols = ['#e5534b', '#f2a93b', '#3a7bd5', '#4fae5a', '#8c6bff'];
  const S = 100, GAP = 9, SP = 30; let w = 0; for (const ch of word) w += ch === ' ' ? SP : S + GAP; w -= GAP;
  let x = (W - w) / 2, k = 0;
  for (const ch of word) {
    if (ch === ' ') { x += SP; continue; }
    const d = 0.07 * k, a = Math.min(1, Math.max(0, (t - d) / 0.25)), drop = (1 - ease(a)) * -260, bounce = a >= 1 ? Math.max(0, Math.sin((t - d - 0.25) * 18)) * 8 * Math.exp(-(t - d) * 4) : 0;
    if (a > 0) {
      g.save(); g.translate(x + S / 2, 250 + drop - bounce); g.rotate((k % 2 ? 1 : -1) * 0.05);
      g.fillStyle = '#1d1b2e'; rr(g, -S / 2, -S / 2 + 9, S, S, 18); g.fill();
      g.fillStyle = cols[k % 5]; rr(g, -S / 2, -S / 2, S, S, 18); g.fill(); g.lineWidth = 7; g.strokeStyle = '#1d1b2e'; g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.25)'; rr(g, -S / 2 + 8, -S / 2 + 6, S - 16, 12, 6); g.fill();
      g.font = '52px Boldonse'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
      g.lineWidth = 12; g.strokeStyle = '#1d1b2e'; g.strokeText(ch, 0, 8); g.fillStyle = '#fff'; g.fillText(ch, 0, 8);
      g.restore();
    }
    x += S + GAP; k++;
  }
}
function pill(g, text, cx, cy, size, bg, fg, s = 1) {
  g.save(); g.translate(cx, cy); g.scale(s, s); g.font = `700 ${size}px Outfit`; const w = g.measureText(text).width + size * 1.4, h = size * 1.6;
  g.fillStyle = '#1d1b2e'; rr(g, -w / 2, -h / 2 + 7, w, h, h / 2); g.fill();
  g.fillStyle = bg; rr(g, -w / 2, -h / 2, w, h, h / 2); g.fill(); g.lineWidth = 5; g.strokeStyle = '#1d1b2e'; g.stroke();
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 3); g.restore();
}
const popS = (t, t0) => { const a = (t - t0) / 0.22; return a <= 0 ? 0 : a >= 1 ? 1 : 1 + Math.sin(a * Math.PI) * 0.25 - (1 - a) * 0.0; };
function drawEndUI(t) {
  const g = cg;
  drawTiles(g, t);
  if (t > 0.8) pill(g, EP.title, W / 2, 400, 40, '#ffffff', '#1d1b2e', Math.min(1, popS(t, 0.8)));
  // tombol subscribe generik
  const clicked = t >= 4.25, sb = popS(t, 2.9);
  if (sb > 0) {
    const cx = W / 2 - 50, cy = 1480, press = t >= 4.15 && t < 4.3 ? 0.92 : 1;
    g.save(); g.translate(cx, cy); g.scale(sb * press, sb * press);
    const w = 560, h = 132;
    g.fillStyle = '#1d1b2e'; rr(g, -w / 2, -h / 2 + 10, w, h, 30); g.fill();
    g.fillStyle = clicked ? '#d9d9df' : '#e53935'; rr(g, -w / 2, -h / 2, w, h, 30); g.fill(); g.lineWidth = 7; g.strokeStyle = '#1d1b2e'; g.stroke();
    g.font = '700 62px Outfit'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = clicked ? '#3a3a46' : '#fff'; g.fillText(clicked ? 'SUBSCRIBED ✓' : 'SUBSCRIBE', 0, 4);
    g.restore();
    // lonceng
    const bs = popS(t, 4.45);
    if (bs > 0) { g.save(); g.translate(cx + 360, cy); g.scale(bs, bs); g.rotate(Math.sin(t * 30) * 0.3 * Math.exp(-(t - 4.45) * 3));
      g.fillStyle = '#1d1b2e'; g.beginPath(); g.arc(0, 8, 66, 0, 7); g.fill(); g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(0, 0, 66, 0, 7); g.fill(); g.lineWidth = 7; g.strokeStyle = '#1d1b2e'; g.stroke();
      g.fillStyle = '#1d1b2e'; g.beginPath(); g.moveTo(-30, 20); g.quadraticCurveTo(-30, -38, 0, -38); g.quadraticCurveTo(30, -38, 30, 20); g.lineTo(38, 28); g.lineTo(-38, 28); g.closePath(); g.fill();
      g.beginPath(); g.arc(0, 36, 9, 0, 7); g.fill(); g.restore(); }
    // kursor
    if (t > 3.3 && t < 5.2) {
      const a = ease((t - 3.3) / 0.8), x = lerp(cx + 420, cx + 60, a), y = lerp(cy + 330, cy + 40, a), s = t >= 4.15 && t < 4.3 ? 0.85 : 1;
      g.save(); g.translate(x, y); g.scale(s * 1.6, s * 1.6); g.fillStyle = '#fff'; g.strokeStyle = '#1d1b2e'; g.lineWidth = 4; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 52); g.lineTo(13, 40); g.lineTo(23, 62); g.lineTo(32, 58); g.lineTo(22, 37); g.lineTo(39, 37); g.closePath(); g.fill(); g.stroke(); g.restore();
      if (t >= 4.15 && t < 4.5) { const r = (t - 4.15) * 400; g.strokeStyle = `rgba(255,255,255,${1 - (t - 4.15) / 0.35})`; g.lineWidth = 8; g.beginPath(); g.arc(cx + 60, cy + 40, r, 0, 7); g.stroke(); }
    }
  }
  if (t > 4.7) pill(g, EP.next, W / 2, 1680, 50, '#ffd23f', '#1d1b2e', Math.min(1, popS(t, 4.7)));
  // fade keluar
  if (t > 5.7) { g.fillStyle = `rgba(0,0,0,${(t - 5.7) / 0.3})`; g.fillRect(0, 0, W, H); }
}
export function renderEnding(f) {
  const t = f / FPS, u = t / 6;
  Object.values(C).forEach(resetChar); props([]); STUDIO.phone.position.x = X.studio + 5.6;
  place(C.raka, X.street - 1.45, 0.6, 0.25); place(C.mama, X.street + 1.55, 0, -0.25);
  idle(C.raka, t); idle(C.mama, t);
  // Mama: menunjuk ke atas ala presenter saat bicara
  const mu = ease((t - 0.2) / 0.4) * (1 - ease((t - 2.9) / 0.4));
  pose(C.mama, 1, lerp(0.05, 2.75, mu) + Math.sin(t * 6) * 0.06 * mu, -0.2 * mu); expr(C.mama, t < 2.9 ? 'happy' : 'gentle');
  // Raka: melambai saat bicara, girang setelah klik
  const ru = ease((t - 2.8) / 0.35);
  pose(C.raka, -1, lerp(-0.05, -2.8, ru), 0.5 * ru + Math.sin(t * 11) * 0.35 * ru); expr(C.raka, t < 2.8 ? 'smug' : t < 4.25 ? 'happy' : 'laugh');
  if (t > 4.25 && t < 4.6) C.raka.userData.body.position.y += Math.sin((t - 4.25) / 0.35 * Math.PI) * 0.5;
  scene.updateMatrixWorld(true);
  cam.position.set(X.street + lerp(0.2, 0, u), lerp(3.0, 3.2, u), lerp(22, 20.5, ease(u))); cam.fov = 36; cam.updateProjectionMatrix(); cam.lookAt(X.street, 3.5, 0);
  applySky('clear', X.street, V(0, 0, 0)); updateRain(t, 0);
  renderer.render(scene, cam);
  cg.clearRect(0, 0, W, H); cg.drawImage(renderer.domElement, 0, 0);
  drawEndUI(t);
  return cap.toDataURL('image/jpeg', 0.9);
}
