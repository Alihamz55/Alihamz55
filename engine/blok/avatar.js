// Avatar blok 3D: kepala silinder, badan kotak. Produksi terpisah (Badai Rapor).
// Dipakai oleh index.html. Semua tokoh memakai geometri yang sama.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// ---------- tekstur ----------
function noiseCanvas(size, base, amp, lines) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, size, size);
  const img = g.getImageData(0, 0, size, size), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amp;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  if (lines) { // tenunan halus
    g.globalAlpha = 0.06; g.strokeStyle = '#000';
    for (let y = 0; y < size; y += 4) { g.beginPath(); g.moveTo(0, y); g.lineTo(size, y); g.stroke(); }
    for (let x = 0; x < size; x += 4) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, size); g.stroke(); }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const FABRIC = () => noiseCanvas(128, '#ffffff', 22, true);
let fabricTex;

export function fabric(color, rough = 0.9) {
  fabricTex ||= FABRIC();
  return new THREE.MeshStandardMaterial({ color, roughness: rough, map: fabricTex });
}
export const skinMat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.82 });
export const hairMat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 });
export const metalMat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.28, metalness: 0.85 });
export const plain = (c, r = 0.7) => new THREE.MeshStandardMaterial({ color: c, roughness: r });

export function rbox(w, h, d, r, m) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2, h / 2, d / 2) * 0.999), m);
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}
const at = (o, x, y, z) => (o.position.set(x, y, z), o);

// ---------- wajah (tekstur datar di kepala) ----------
const HEAD_R = 0.62, HEAD_H = 1.12, BEV = 0.13;
const BAND_H = HEAD_H - 2 * BEV;

export function drawFace(expr, opt = {}) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const g = c.getContext('2d'); const cx = 512;
  g.lineCap = 'round'; g.lineJoin = 'round';
  const K = '#141414';
  const E = [cx - 118, cx + 118], ey = 250;

  const eye = (x, rx = 25, ry = 37, y = ey) => {
    g.fillStyle = K; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(x + rx * 0.35, y - ry * 0.4, rx * 0.32, 0, 7); g.fill();
  };
  const lid = (x) => { // mata setengah tertutup (kesal)
    g.fillStyle = K; g.beginPath(); g.ellipse(x, ey + 6, 25, 26, 0, 0, Math.PI); g.fill();
    g.strokeStyle = K; g.lineWidth = 12; g.beginPath(); g.moveTo(x - 34, ey + 4); g.lineTo(x + 34, ey + 4); g.stroke();
  };
  const happyEye = (x) => { g.strokeStyle = K; g.lineWidth = 16; g.beginPath(); g.arc(x, ey + 18, 30, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); };
  // alis: inner = ujung dekat tengah wajah. dy negatif = naik
  const brow = (side, yIn, yOut, w = 17) => {
    const x = E[side], s = side ? 1 : -1;
    g.strokeStyle = K; g.lineWidth = w; g.beginPath();
    g.moveTo(x - s * 38, yIn); g.quadraticCurveTo(x, Math.min(yIn, yOut) - 10, x + s * 40, yOut); g.stroke();
  };
  const lashes = () => {
    if (!opt.lashes) return;
    g.strokeStyle = K; g.lineWidth = 8;
    E.forEach((x, i) => { const s = i ? 1 : -1;
      [[22, -30, 40, -44], [12, -36, 24, -56]].forEach(([a, b, cc, d]) => {
        g.beginPath(); g.moveTo(x + s * a, ey + b); g.lineTo(x + s * cc, ey + d); g.stroke(); });
    });
  };
  const blush = () => {
    if (!opt.blush) return;
    g.fillStyle = 'rgba(230,110,110,0.35)';
    E.forEach((x, i) => { g.beginPath(); g.ellipse(x + (i ? 40 : -40), ey + 85, 42, 20, 0, 0, 7); g.fill(); });
  };
  const openMouth = (w, depth, y = 345, tilt = 0) => {
    g.save(); g.beginPath();
    g.moveTo(cx - w, y - tilt); g.quadraticCurveTo(cx, y + depth * 1.9, cx + w, y + tilt); g.closePath();
    g.fillStyle = K; g.fill(); g.clip();
    g.fillStyle = '#fff'; g.fillRect(cx - w, y - 30, w * 2, 30 + depth * 0.32);
    g.fillStyle = '#e0656f'; g.beginPath(); g.ellipse(cx, y + depth * 1.05, w * 0.5, depth * 0.45, 0, 0, 7); g.fill();
    g.restore();
  };
  const line = (pts, w = 14) => { g.strokeStyle = K; g.lineWidth = w; g.beginPath(); g.moveTo(...pts[0]);
    if (pts.length === 3) g.quadraticCurveTo(...pts[1], ...pts[2]); else pts.slice(1).forEach(p => g.lineTo(...p)); g.stroke(); };

  switch (expr) {
    case 'happy': happyEye(E[0]); happyEye(E[1]); brow(0, 165, 155); brow(1, 165, 155); openMouth(95, 62); break;
    case 'smug': eye(E[0]); eye(E[1]); brow(0, 172, 168); brow(1, 138, 122);
      line([[cx - 70, 362], [cx + 10, 398], [cx + 78, 340]], 15); break;
    case 'surprised': eye(E[0], 30, 46); eye(E[1], 30, 46); brow(0, 130, 135); brow(1, 130, 135);
      g.fillStyle = K; g.beginPath(); g.ellipse(cx, 380, 36, 50, 0, 0, 7); g.fill(); break;
    case 'worried': eye(E[0], 23, 34); eye(E[1], 23, 34); brow(0, 140, 182); brow(1, 140, 182);
      line([[cx - 70, 385], [cx - 35, 365], [cx, 385], [cx + 35, 365], [cx + 70, 385]], 13); break;
    case 'annoyed': lid(E[0]); lid(E[1]); brow(0, 200, 165, 19); brow(1, 200, 165, 19);
      line([[cx - 62, 382], [cx, 368], [cx + 62, 382]]); break;
    case 'sad': eye(E[0], 24, 33, 258); eye(E[1], 24, 33, 258); brow(0, 150, 190); brow(1, 150, 190);
      line([[cx - 62, 395], [cx, 350], [cx + 62, 395]]); break;
    case 'gentle': eye(E[0]); eye(E[1]); brow(0, 165, 158); brow(1, 150, 140);
      line([[cx - 72, 352], [cx, 405], [cx + 72, 352]], 15); break;
    case 'confused': eye(E[0], 24, 36); eye(E[1], 20, 28); brow(0, 140, 130); brow(1, 185, 195);
      line([[cx - 60, 380], [cx - 20, 368], [cx + 20, 385], [cx + 60, 366]], 13); break;
    case 'laugh': happyEye(E[0]); happyEye(E[1]); brow(0, 150, 145); brow(1, 150, 145); openMouth(110, 80, 335); break;
    default: eye(E[0]); eye(E[1]); brow(0, 168, 165); brow(1, 168, 165); line([[cx - 50, 370], [cx, 385], [cx + 50, 370]], 13);
  }
  lashes(); blush();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// ---------- kepala ----------
function latheCyl(r, h, b, seg = 56) {
  const p = [new THREE.Vector2(0, -h / 2)];
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * Math.PI / 2;
    p.push(new THREE.Vector2(r - b + Math.cos(a) * b, -h / 2 + b + Math.sin(a) * b)); }
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI / 2;
    p.push(new THREE.Vector2(r - b + Math.cos(a) * b, h / 2 - b + Math.sin(a) * b)); }
  p.push(new THREE.Vector2(0, h / 2));
  return new THREE.LatheGeometry(p, seg);
}

export function makeHead(cfg) {
  const g = new THREE.Group();
  const head = new THREE.Mesh(latheCyl(HEAD_R, HEAD_H, BEV), skinMat(cfg.skin));
  head.castShadow = head.receiveShadow = true; g.add(head);
  const faceMat = new THREE.MeshStandardMaterial({ map: drawFace(cfg.expr, cfg.face), transparent: true,
    roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 });
  const face = new THREE.Mesh(new THREE.CylinderGeometry(HEAD_R + 0.003, HEAD_R + 0.003, BAND_H, 48, 1, true,
    -Math.PI * 0.45, Math.PI * 0.9), faceMat);
  g.add(face);
  g.userData.setExpr = (e) => { faceMat.map = drawFace(e, cfg.face); faceMat.needsUpdate = true; };
  if (cfg.hair) cfg.hair(g, hairMat(cfg.hairColor));
  return g;
}

// kacamata bulat (mata di y≈0, x≈±0.2 pada kepala)
export function addGlasses(head) {
  const m = metalMat('#5a3b2a');
  [-1, 1].forEach(s => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 8, 28), m); r.position.set(s * 0.2, 0.0, HEAD_R + 0.05); head.add(r); });
  const br = rbox(0.14, 0.03, 0.03, 0.01, m); br.position.set(0, 0.03, HEAD_R + 0.06); head.add(br);
  [-1, 1].forEach(s => { const t = rbox(0.03, 0.03, 0.5, 0.01, m); t.position.set(s * 0.33, 0.03, HEAD_R - 0.18); head.add(t); });
}

// cangkang rambut: tutup atas + belakang
function hairCap(g, m, { top = 0.36, back = 0.75, r = HEAD_R + 0.05 } = {}) {
  const cap = new THREE.Mesh(latheCyl(r, top + BEV, BEV + 0.03), m);
  cap.position.y = HEAD_H / 2 - top / 2 + 0.05; cap.castShadow = true; g.add(cap);
  const backS = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.01, r - 0.01, back, 48, 1, false,
    Math.PI * 0.55, Math.PI * 0.9), m);
  backS.position.y = HEAD_H / 2 - back / 2 - 0.02; backS.castShadow = true; g.add(backS);
  return cap;
}

export const HAIR = {
  // jambul tebal, dipahat per bagian (Raka)
  quiff(g, m) {
    hairCap(g, m, { top: 0.34, back: 0.8 });
    // tiga bagian lebar, disisir ke samping, ada alur di antaranya
    const chunks = [[-0.36, 0.18, 0.12, 0.42], [0.04, 0.27, 0.05, 0.46], [0.4, 0.22, -0.18, 0.36]];
    chunks.forEach(([x, h, rz, w]) => {
      const c = rbox(w, h, 1.0, 0.1, m);
      c.position.set(x, HEAD_H / 2 + h / 2 + 0.04, 0.04 + (0.27 - h) * 0.4);
      c.rotation.set(-0.22, 0, rz); g.add(c);
    });
    // poni depan naik
    const f = rbox(1.05, 0.2, 0.32, 0.1, m); f.position.set(0.02, HEAD_H / 2 + 0.06, HEAD_R - 0.08); f.rotation.x = -0.5; g.add(f);
    // cambang
    [-1, 1].forEach(s => { const sb = rbox(0.16, 0.34, 0.3, 0.06, m); sb.position.set(s * (HEAD_R - 0.02), 0.22, 0.12); g.add(sb); });
  },
  // rambut bob sebahu (Bu Guru Sari)
  bob(g, m) {
    hairCap(g, m, { top: 0.38, back: 1.05, r: HEAD_R + 0.07 });
    const fr = rbox(1.1, 0.24, 0.3, 0.11, m); fr.position.set(0, HEAD_H / 2 + 0.0, HEAD_R - 0.06); fr.rotation.x = -0.3; g.add(fr);
    [-1, 1].forEach(s => { const sd = rbox(0.24, 0.95, 0.75, 0.1, m); sd.position.set(s * (HEAD_R - 0.0), 0.0, -0.02); g.add(sd);
      const tip = rbox(0.28, 0.18, 0.5, 0.08, m); tip.position.set(s * (HEAD_R + 0.02), -0.48, 0.12); tip.rotation.z = s * 0.25; g.add(tip); });
  },
  // cepol + poni samping (Mama Rina)
  bun(g, m) {
    hairCap(g, m, { top: 0.36, back: 0.95 });
    const fringe = rbox(0.78, 0.26, 0.34, 0.12, m);
    fringe.position.set(-0.18, HEAD_H / 2 + 0.02, HEAD_R - 0.1); fringe.rotation.set(-0.35, 0, 0.32); g.add(fringe);
    const fr2 = rbox(0.42, 0.2, 0.3, 0.1, m); fr2.position.set(0.32, HEAD_H / 2 + 0.06, HEAD_R - 0.12); fr2.rotation.set(-0.35, 0, -0.15); g.add(fr2);
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 20), m);
    bun.scale.set(1, 0.85, 1); bun.position.set(0, HEAD_H / 2 + 0.36, -0.22); bun.castShadow = true; g.add(bun);
    // alur cepol
    const groove = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 10, 40), hairMat('#2a1810'));
    groove.position.copy(bun.position); groove.rotation.x = Math.PI / 2 - 0.2; g.add(groove);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 12, 32), plain('#e9b949', 0.5));
    tie.position.set(0, HEAD_H / 2 + 0.12, -0.2); tie.rotation.x = Math.PI / 2 - 0.25; g.add(tie);
    // helai samping
    [-1, 1].forEach(s => { const lk = rbox(0.17, 0.5, 0.26, 0.08, m); lk.position.set(s * (HEAD_R - 0.01), 0.12, 0.14); lk.rotation.z = s * 0.05; g.add(lk); });
  },
};

// ---------- lengan ----------
function makeArm(s, o) {
  const sh = new THREE.Group();
  const sleeve = rbox(0.98, o.sleeveLen, 1.02, 0.14, o.sleeve);
  sleeve.position.y = 0.2 - o.sleeveLen / 2; sh.add(sleeve);
  if (o.sleeveLen < 1.0) { const up = rbox(0.84, 0.75, 0.86, 0.1, o.skin); up.position.y = -0.48; sh.add(up); }
  const el = new THREE.Group(); el.position.y = -0.82; sh.add(el);
  const fore = rbox(0.84, 0.72, 0.86, 0.1, o.lowerSleeve || o.skin); fore.position.y = -0.33; el.add(fore);
  if (o.cuff) { const cf = rbox(0.92, 0.16, 0.94, 0.06, o.cuff); cf.position.y = -0.62; el.add(cf); }
  if (o.watch) { const w = rbox(0.9, 0.14, 0.92, 0.05, o.watch); w.position.y = -0.6; el.add(w);
    const face = rbox(0.24, 0.2, 0.06, 0.03, o.watch); face.position.set(0, -0.6, 0.47); el.add(face); }
  const hand = rbox(0.8, 0.56, 0.8, 0.24, o.skin); hand.position.y = -0.94; el.add(hand);
  const th = rbox(0.22, 0.32, 0.26, 0.1, o.skin); th.position.set(-s * 0.26, -0.86, 0.42); th.rotation.x = 0.3; el.add(th);
  sh.userData.elbow = el;
  return sh;
}

// ---------- badan ----------
export function makeCharacter(cfg) {
  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);
  const S = cfg.style;
  const skin = skinMat(cfg.skin);

  // kaki
  root.userData.hips = {}; root.userData.body = body;
  [-1, 1].forEach(s => {
    const hip = new THREE.Group(); hip.position.set(s * 0.51, 2.0, 0); body.add(hip); root.userData.hips[s] = hip;
    const leg = rbox(S.legW || 0.98, 1.58, S.legD || 1.0, 0.12, S.pants); leg.position.y = -0.83; hip.add(leg);
    if (S.flare) { const fl = rbox(1.1, 0.42, 1.14, 0.1, S.pants); fl.position.y = -1.4; hip.add(fl); }
    if (S.cuff) { const cf = rbox(1.02, 0.14, 1.04, 0.05, S.cuff); cf.position.y = -1.56; hip.add(cf); }
    const shoe = rbox(1.0, 0.36, 1.26, 0.14, S.shoe); shoe.position.set(0, -1.82, 0.12); hip.add(shoe);
    const sole = rbox(1.04, 0.1, 1.3, 0.04, S.sole); sole.position.set(0, -1.95, 0.12); hip.add(sole);
    if (S.laces) [0, 1, 2].forEach(i => { const l = rbox(0.5, 0.05, 0.08, 0.02, S.laces); l.position.set(0, -1.66, 0.38 + i * 0.13 - 0.1); hip.add(l); });
  });

  // badan
  const torso = rbox(2.0, 2.0, 1.06, 0.14, S.shirt); torso.position.y = 3.0; body.add(torso);
  S.torsoExtras?.(body, at);

  // kepala
  const head = makeHead(cfg); head.position.y = 4.0 + HEAD_H / 2 + 0.03; body.add(head);
  if (cfg.glasses) addGlasses(head);
  root.userData.head = head;

  // lengan
  root.userData.arms = {};
  [-1, 1].forEach(s => {
    const a = makeArm(s, { sleeve: S.sleeve || S.shirt, sleeveLen: S.sleeveLen ?? 0.72, skin,
      lowerSleeve: S.lowerSleeve, cuff: S.armCuff, watch: s === S.watchSide ? metalMat('#c9ccd2') : null });
    a.position.set(s * 1.5, 3.8, 0); body.add(a);
    root.userData.arms[s] = a;
  });
  return root;
}

export function pose(ch, side, shoulderZ, elbowZ = 0, shoulderX = 0) {
  const a = ch.userData.arms[side];
  a.rotation.z = shoulderZ; a.rotation.x = shoulderX; a.userData.elbow.rotation.z = elbowZ;
}

// ---------- tokoh ----------
export function raka(expr = 'smug') {
  const white = fabric('#f4f4ef'), blue = fabric('#22397f'), yellow = fabric('#f2c230', 0.8), yDark = fabric('#c99a1c', 0.8);
  return makeCharacter({
    skin: '#c48a5c', expr, hairColor: '#231914', hair: HAIR.quiff,
    style: {
      shirt: white, pants: blue, cuff: fabric('#1b2f6b'),
      shoe: plain('#d8453b', 0.55), sole: plain('#f2f2f2', 0.6), laces: plain('#ffffff'),
      sleeveLen: 0.72, armCuff: null,
      torsoExtras(b, at) {
        // kerah
        [-1, 1].forEach(s => { const c = rbox(0.62, 0.16, 0.44, 0.06, white); at(c, s * 0.3, 3.98, 0.38); c.rotation.set(0.25, 0, -s * 0.35); b.add(c); });
        // dasi biru (SMP)
        const tie = rbox(0.22, 0.9, 0.08, 0.05, fabric('#2b4aa0')); at(tie, 0, 3.45, 0.55); b.add(tie);
        const knot = rbox(0.26, 0.18, 0.12, 0.05, fabric('#2b4aa0')); at(knot, 0, 3.9, 0.54); b.add(knot);
        // saku + badge polos
        const pk = rbox(0.5, 0.48, 0.06, 0.04, white); at(pk, 0.55, 3.35, 0.54); b.add(pk);
        const badge = rbox(0.26, 0.3, 0.05, 0.06, plain('#3a6ad1')); at(badge, -0.55, 3.45, 0.55); b.add(badge);
        const bIn = rbox(0.14, 0.16, 0.03, 0.04, plain('#f2c230')); at(bIn, -0.55, 3.45, 0.58); b.add(bIn);
        // kancing
        [3.1, 2.75, 2.42].forEach(y => { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12), plain('#ddd'));
          k.rotation.x = Math.PI / 2; at(k, 0, y, 0.545); b.add(k); });
        // ikat pinggang
        const belt = rbox(2.04, 0.17, 1.1, 0.05, plain('#1a1a1a', 0.5)); at(belt, 0, 2.08, 0); b.add(belt);
        const buckle = rbox(0.3, 0.2, 0.06, 0.03, metalMat('#d9dbe0')); at(buckle, 0, 2.08, 0.56); b.add(buckle);
        // ransel kuning
        const bag = rbox(1.7, 1.75, 0.62, 0.2, yellow); at(bag, 0, 3.05, -0.84); b.add(bag);
        const bagPk = rbox(1.2, 0.7, 0.2, 0.1, yDark); at(bagPk, 0, 2.6, -1.2); b.add(bagPk);
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 20, Math.PI), yDark); at(handle, 0, 3.92, -0.8); b.add(handle);
        [-1, 1].forEach(s => { const st = rbox(0.24, 1.55, 0.06, 0.04, yDark); at(st, s * 0.62, 3.25, 0.555); b.add(st);
          const top = rbox(0.24, 0.07, 1.3, 0.03, yDark); at(top, s * 0.62, 4.02, -0.12); b.add(top); });
      },
    },
  });
}

export function mama(expr = 'gentle') {
  const coral = fabric('#ee8a74'), sage = fabric('#8aa37b'), cloud = plain('#fffaf2', 0.8);
  return makeCharacter({
    skin: '#bd8357', expr, face: { lashes: true, blush: true }, hairColor: '#3a2318', hair: HAIR.bun,
    style: {
      shirt: coral, pants: sage, flare: true, legW: 1.0, legD: 1.02,
      shoe: plain('#e6d3b3', 0.7), sole: plain('#8b6b4a', 0.7),
      sleeveLen: 0.86, sleeve: coral, watchSide: -1,
      torsoExtras(b, at) {
        // kaus oversize: lapisan ujung bawah menjuntai
        const hem = rbox(2.16, 0.42, 1.2, 0.14, coral); at(hem, 0, 2.12, 0); b.add(hem);
        const neck = rbox(0.8, 0.1, 0.2, 0.05, fabric('#d8705b')); at(neck, 0, 3.97, 0.46); b.add(neck);
        // gambar awan di dada (bukan logo)
        [[-0.18, 0, 0.2], [0.08, 0.08, 0.26], [0.32, -0.02, 0.18], [0.06, -0.08, 0.2]].forEach(([x, y, r]) => {
          const s = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), cloud); s.scale.z = 0.25; at(s, x - 0.05, 3.25 + y, 0.54); b.add(s); });
        const sun = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 14), plain('#f6c445', 0.6)); sun.scale.z = 0.25; at(sun, 0.38, 3.48, 0.53); b.add(sun);
        // ikat pinggang kain kulot
        const band = rbox(2.04, 0.14, 1.1, 0.05, fabric('#77906a')); at(band, 0, 1.96, 0); b.add(band);
      },
    },
  });
}

// Mama Rina versi presenter TV: blazer biru, blus putih, bros awan
export function mamaTV(expr = 'smug') {
  const navy = fabric('#2b4b8f'), white = fabric('#f7f5f0'), grey = fabric('#3b3f4a');
  return makeCharacter({
    skin: '#bd8357', expr, face: { lashes: true, blush: true }, hairColor: '#3a2318', hair: HAIR.bun,
    style: {
      shirt: navy, pants: grey, shoe: plain('#1d1d22', 0.4), sole: plain('#111', 0.5),
      sleeveLen: 1.02, sleeve: navy, lowerSleeve: navy, armCuff: white, watchSide: 0,
      torsoExtras(b, at) {
        const blouse = rbox(0.7, 1.0, 0.06, 0.04, white); at(blouse, 0, 3.5, 0.53); b.add(blouse);
        [-1, 1].forEach(s => { const l = rbox(0.34, 1.15, 0.08, 0.04, fabric('#22407c')); at(l, s * 0.42, 3.45, 0.55); l.rotation.z = s * 0.22; b.add(l); });
        [3.0, 2.6].forEach(y => { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 14), metalMat('#e2c35a')); k.rotation.x = Math.PI / 2; at(k, 0.12, y, 0.56); b.add(k); });
        [[0, 0, 0.11], [0.12, 0.04, 0.13], [0.24, 0, 0.1]].forEach(([x, y, r]) => { const c = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), plain('#ffffff', 0.5)); c.scale.z = 0.4; at(c, -0.62 + x, 3.6 + y, 0.6); b.add(c); });
        const pin = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 24), metalMat('#e2c35a')); at(pin, -0.5, 3.6, 0.58); b.add(pin);
      },
    },
  });
}

// Bu Guru Sari: batik ungu, rok panjang, kacamata, rambut bob
function batikTex() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#7b4fa0'; g.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 32) for (let x = 0; x < 128; x += 32) {
    g.fillStyle = '#e8c87a';
    [[0, -8], [8, 0], [0, 8], [-8, 0]].forEach(([dx, dy]) => { g.beginPath(); g.ellipse(x + 16 + dx, y + 16 + dy, dx ? 6 : 3.5, dy ? 6 : 3.5, 0, 0, 7); g.fill(); });
    g.fillStyle = '#4a2a66'; g.beginPath(); g.arc(x + 16, y + 16, 2.5, 0, 7); g.fill();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function guru(expr = 'gentle') {
  const batik = new THREE.MeshStandardMaterial({ map: batikTex(), roughness: 0.85 });
  const skirt = fabric('#4a3326');
  return makeCharacter({
    skin: '#c99366', expr, face: { lashes: true }, hairColor: '#1e1612', hair: HAIR.bob, glasses: true,
    style: {
      shirt: batik, sleeve: batik, lowerSleeve: batik, sleeveLen: 1.02, pants: skirt, flare: true, legW: 1.02, legD: 1.04,
      shoe: plain('#3a2a20', 0.5), sole: plain('#1a120c', 0.6),
      torsoExtras(b, at) { const sk = rbox(2.12, 1.2, 1.16, 0.12, skirt); at(sk, 0, 1.55, 0); b.add(sk); },
    },
  });
}

// pegang benda di tangan (side: -1 kanan tokoh / +1 kiri tokoh)
export function hold(ch, side, obj, x = 0, y = -1.0, z = 0.45) {
  const el = ch.userData.arms[side].userData.elbow; obj.position.set(x, y, z); el.add(obj); return obj;
}
