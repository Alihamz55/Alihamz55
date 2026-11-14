// ---------------- "Hayati Minta Balikan" fx cards (600x1000 design canvas) ----------------
const PF = '"DejaVu Sans", Arial, sans-serif', SERIF = '"DejaVu Serif", Georgia, serif';
const ptxt = (g, t, x, y, size, fill, lw = 0, stroke = INK, align = "center", font = PF) => { g.font = `900 ${size}px ${font}`; g.textAlign = align; g.textBaseline = "middle"; g.lineJoin = "round";
  if (lw) { g.lineWidth = lw; g.strokeStyle = stroke; g.strokeText(t, x, y); } g.fillStyle = fill; g.fillText(t, x, y); };
const heartPts = (cx, cy, r, half = 0) => { const pts = []; for (let i = 0; i <= 60; i++) { const t = (i / 60) * Math.PI * 2;
  const x = 16 * Math.sin(t) ** 3, y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  if (half === -1 && x > 0.01) continue; if (half === 1 && x < -0.01) continue; pts.push([cx + x * r / 16, cy + y * r / 16]); } return pts; };
const wrap = (g, text, maxW) => { const words = text.split(" "), lines = []; let cur = "";
  for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; };

/** heart; split 0..1 cracks it apart */
export const fxLove = (p, split = 0) => {
  const g = p.g, dx = split * 70, rot = split * 0.25;
  if (split < 0.01) { p.poly(heartPts(300, 500, 230), "#e8455a", 12); p.stroke([[220, 400], [190, 450]], 16, "#ff8a9a"); return; }
  for (const s of [-1, 1]) { g.save(); g.translate(300 + s * dx, 520); g.rotate(s * rot); g.translate(-300, -520);
    const pts = heartPts(300, 500, 230, s);
    const zig = [[300, 440], [270, 500], [320, 560], [280, 620], [300, 700]];
    const poly = s < 0 ? [...pts.filter((q) => q[0] <= 300), ...zig.slice().reverse()] : [...pts.filter((q) => q[0] >= 300), ...zig];
    p.poly(poly, "#e8455a", 12); g.restore(); }
};

/** phone chat. msgs = [{me, text, k}] (k = pop 0..1); typing = dots on the other side */
export const fxChat = (p, msgs, typing = 0, name = "Mantan", cat = false) => {
  const g = p.g;
  p.poly(rrect(110, 120, 490, 900, 46), "#2b2f3a", 12);
  p.poly(rrect(132, 160, 468, 860, 26), "#efe7dc", 0);
  const hc = cat ? "#1877f2" : "#3a8f6a"; p.poly(rrect(132, 160, 468, 250, 26), hc, 0); p.poly([[132, 220], [468, 220], [468, 250], [132, 250]], hc, 0);
  if (cat) { for (const sx of [-1, 1]) p.poly([[180 + sx * 8, 184], [180 + sx * 24, 168], [180 + sx * 24, 194]], "#3a2a22", 2); p.ell(180, 205, 26, 26, "#f2c6a0", 4); p.ell(180, 192, 26, 14, "#3a2a22", 0); }
  else { p.ell(180, 205, 26, 26, "#f2c6a0", 4); p.poly(heartPts(180, 207, 14), "#e8455a", 0); }
  ptxt(g, name, 222, 196, 30, "#ffffff", 0, INK, "left"); ptxt(g, typing ? "mengetik..." : "online", 222, 228, 20, "#d8f2e4", 0, INK, "left");
  let y = 280;
  for (const m of msgs) {
    if (!(m.k > 0.01)) continue;
    g.font = `800 30px ${PF}`; const lines = wrap(g, m.text, 230), w = Math.max(...lines.map((l) => g.measureText(l).width)) + 40, h = lines.length * 40 + 26;
    const x0 = m.me ? 448 - w : 152;
    g.save(); g.translate(m.me ? 448 : 152, y + h / 2); g.scale(m.k, m.k); g.translate(-(m.me ? 448 : 152), -(y + h / 2));
    p.poly(rrect(x0, y, x0 + w, y + h, 20), m.me ? "#c9f2b0" : "#ffffff", 5);
    lines.forEach((l, i) => ptxt(g, l, x0 + 20, y + 33 + i * 40, 30, m.big ? "#c0302c" : INK, 0, INK, "left"));
    g.restore(); y += h + 18;
  }
  if (typing) { p.poly(rrect(152, y, 262, y + 56, 20), "#ffffff", 5); for (let i = 0; i < 3; i++) p.dot(184 + i * 24, y + 28 - (Math.floor(typing * 6 + i) % 3 === 0 ? 6 : 0), 8, "#8a90a0"); }
};

/** old-film subtitle: black bar, cream serif text, auto-fit up to 2 lines */
export const fxSubtitle = (p, text, prog = 1) => {
  const g = p.g; let fs = 46; g.font = `900 ${fs}px ${SERIF}`; let lines = wrap(g, text, 500);
  while (lines.length > 2 && fs > 30) { fs -= 2; g.font = `900 ${fs}px ${SERIF}`; lines = wrap(g, text, 500); }
  const h = lines.length * fs * 1.2 + 40;
  g.save(); g.globalAlpha = 0.82; p.poly(rrect(20, 500 - h / 2, 580, 500 + h / 2, 10), "#120c06", 0); g.restore();
  lines.forEach((l, i) => ptxt(g, l, 300, 500 - (lines.length - 1) * fs * 0.6 + i * fs * 1.2, fs, "#f6e7c4", 0, INK, "center", SERIF));
};

/** title stamp "MODE ZAINUDDIN: ON" */
export const fxMode = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.08);
  p.poly(rrect(-250, -90, 250, 90, 18), "#f6e7c4", 10); p.poly(rrect(-232, -72, 232, 72, 12), null, 5);
  ptxt(g, "MODE ZAINUDDIN", 0, -22, 44, "#7a3b1c", 0, INK, "center", SERIF); ptxt(g, "ON", 0, 38, 50, "#c0302c", 0, INK, "center", SERIF); g.restore();
};

/** vintage car with "MOBIL" money sparkle */
export const fxCar = (p) => {
  const g = p.g;
  p.poly([[90, 600], [110, 520], [200, 510], [250, 430], [400, 430], [450, 510], [510, 530], [520, 600]], "#2e5f8a", 10);
  p.poly([[265, 445], [320, 445], [320, 510], [225, 510]], "#bfe6ff", 6); p.poly([[335, 445], [390, 445], [430, 510], [335, 510]], "#bfe6ff", 6);
  for (const x of [190, 420]) { p.ell(x, 610, 52, 52, "#2b2522", 9); p.ell(x, 610, 22, 22, "#c9cfd6", 5); }
  p.ell(505, 560, 14, 12, "#ffe08a", 4);
  ptxt(g, "KAYA", 300, 760, 70, "#ffd84a", 12);
  for (const [x, y] of [[120, 420], [480, 400], [420, 330]]) p.stroke([[x - 18, y], [x + 18, y]], 6, "#ffd84a"), p.stroke([[x, y - 18], [x, y + 18]], 6, "#ffd84a");
};

/** phone charger with cable */
export const fxCharger = (p) => {
  const g = p.g;
  p.stroke([[300, 600], [300, 700], [220, 760], [380, 820], [300, 880]], 14, "#f4f1ea"); p.stroke([[300, 600], [300, 700], [220, 760], [380, 820], [300, 880]], 0.01);
  p.poly(rrect(200, 330, 400, 600, 34), "#f4f1ea", 10);
  p.poly(rrect(250, 260, 275, 335, 6), "#c9cfd6", 6); p.poly(rrect(325, 260, 350, 335, 6), "#c9cfd6", 6);
  p.poly([[310, 400], [270, 480], [305, 480], [285, 550], [340, 455], [305, 455], [325, 400]], "#ffd84a", 5);
};

/** ship sinking: sink 0..1 */
export const fxShip = (p, sink = 0, t = 0) => {
  const g = p.g;
  g.save(); g.beginPath(); g.rect(40, 200, 520, 440); g.clip();
  g.save(); g.translate(300, 520 + sink * 230); g.rotate(-0.08 - sink * 0.45);
  p.poly([[-220, -40], [220, -40], [180, 50], [-170, 50]], "#3a3330", 9);
  p.poly([[-150, -40], [140, -40], [140, -110], [-150, -110]], "#f4efe2", 8);
  for (const x of [-60, 50]) { p.poly(rrect(x - 26, -230, x + 26, -110, 6), "#f4efe2", 8); p.poly(rrect(x - 26, -230, x + 26, -195, 6), "#2b2522", 0); }
  for (let i = 0; i < 5; i++) p.dot(-110 + i * 55, -75, 10, "#7fb0c8");
  g.restore(); g.restore();
  // waves over the hull
  const pts = [[40, 900]]; for (let x = 40; x <= 560; x += 20) pts.push([x, 600 + 16 * Math.sin(x * 0.05 + t * 6)]); pts.push([560, 900]);
  p.poly(pts, "#3f7896", 9);
  ptxt(g, "BLUP...", 300, 740, 64, "#ffffff", 10);
};

/** water rising over the screen; lvl 0..1, t phase */
export const fxWater = (p, lvl, t = 0) => {
  const g = p.g, top = 1040 - lvl * 1100;
  const pts = [[-40, 1100]]; for (let x = -40; x <= 640; x += 20) pts.push([x, top + 18 * Math.sin(x * 0.03 + t * 5)]); pts.push([640, 1100]);
  g.save(); g.globalAlpha = 0.72; p.poly(pts, "#3a8fc0", 0); g.restore();
  p.stroke(pts.slice(1, -1), 8, "#bfe6ff");
  for (let i = 0; i < 14; i++) { const x = 40 + ((i * 97) % 520), y = top + 60 + ((i * 131 + t * 600) % Math.max(60, 1040 - top));
    if (y > top + 20) { g.save(); g.globalAlpha = 0.85; p.ell(x, y, 10 + (i % 3) * 5, 10 + (i % 3) * 5, null, 4); g.restore(); } }
};

/** film overlay: grain, scratches, vignette (whole 600x1000 canvas) */
export const fxFilm = (p, f) => {
  const g = p.g, r = (k) => Math.abs(Math.sin(f * 12.9898 + k * 78.233) * 43758.5453) % 1;
  g.save();
  const vg = g.createRadialGradient(300, 500, 260, 300, 500, 640); vg.addColorStop(0, "rgba(40,24,8,0)"); vg.addColorStop(1, "rgba(40,24,8,0.75)"); g.fillStyle = vg; g.fillRect(-50, -50, 700, 1100);
  g.globalAlpha = 0.5; g.strokeStyle = "#f6e7c4"; g.lineWidth = 2;
  for (let k = 0; k < 2; k++) if (r(k) > 0.4) { const x = r(k + 5) * 600; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (r(k + 9) - 0.5) * 30, 1000); g.stroke(); }
  g.fillStyle = "#1a1008"; for (let k = 0; k < 40; k++) { const s = 1 + r(k + 20) * 3; g.fillRect(r(k + 40) * 600, r(k + 60) * 1000, s, s); }
  g.restore();
};

/** intro poster */
export const fxPoster = (p, t = 0) => {
  const g = p.g;
  p.poly(rrect(70, 160, 530, 840, 18), "#f1dfb8", 12); p.poly(rrect(96, 186, 504, 814, 10), null, 5);
  for (let i = 0; i < 10; i++) { const a = -Math.PI + i * Math.PI / 9 + t * 0.2; p.stroke([[300, 560], [300 + Math.cos(a) * 260, 560 + Math.sin(a) * 260]], 14, "#e8c890"); }
  p.ell(300, 560, 90, 90, "#e0a050", 0);
  p.poly([[160, 600], [440, 600], [410, 650], [185, 650]], "#3a3330", 7); p.poly([[210, 600], [380, 600], [380, 560], [210, 560]], "#f4efe2", 6);
  p.poly(rrect(255, 500, 285, 560, 4), "#2b2522", 5);
  const wv = [[96, 680]]; for (let x = 96; x <= 504; x += 17) wv.push([x, 660 + 8 * Math.sin(x * 0.08 + t * 3)]); wv.push([504, 680]); p.poly([...wv, [504, 814], [96, 814]], "#3f7896", 0);
  ptxt(g, "HAYATI", 300, 270, 92, "#7a3b1c", 0, INK, "center", SERIF);
  ptxt(g, "MINTA BALIKAN", 300, 370, 54, "#c0302c", 0, INK, "center", SERIF);
  ptxt(g, "~ sebuah tragedi chat ~", 300, 430, 26, "#5a4030", 0, INK, "center", SERIF);
  ptxt(g, "MALAM KOMEDI", 300, 760, 30, "#f6e7c4", 0, INK, "center", SERIF);
};

export const fxShout = (p, text, fill = "#ffd84a", size = 120) => ptxt(p.g, text, 300, 500, size, fill, Math.round(size * 0.2));

/** DSLR camera */
export const fxCamera = (p) => {
  p.poly(rrect(110, 380, 490, 640, 30), "#2b2f3a", 10);
  p.poly(rrect(180, 330, 300, 390, 12), "#2b2f3a", 9);
  p.poly(rrect(400, 350, 460, 385, 8), "#e0352b", 6);
  p.ell(300, 515, 110, 110, "#3a3f4a", 10); p.ell(300, 515, 75, 75, "#1a1d24", 7); p.ell(300, 515, 40, 40, "#4a6a9a", 5);
  p.ell(282, 495, 14, 14, "#ffffff", 0);
  p.poly(rrect(130, 400, 200, 440, 8), "#8a90a0", 0);
};
/** camera viewfinder overlay (whole canvas); rec = blinking dot */
export const fxViewfinder = (p, rec = true) => {
  const g = p.g; g.save();
  g.strokeStyle = "#ffffff"; g.lineWidth = 10; g.lineCap = "round";
  for (const [x, y, dx, dy] of [[90, 190, 1, 1], [510, 190, -1, 1], [90, 810, 1, -1], [510, 810, -1, -1]]) { g.beginPath(); g.moveTo(x, y + dy * 70); g.lineTo(x, y); g.lineTo(x + dx * 70, y); g.stroke(); }
  g.lineWidth = 4; g.beginPath(); g.moveTo(280, 500); g.lineTo(320, 500); g.moveTo(300, 480); g.lineTo(300, 520); g.stroke();
  if (rec) { g.fillStyle = "#e0352b"; g.beginPath(); g.arc(130, 245, 14, 0, 7); g.fill(); }
  ptxt(g, "REC", 158, 246, 30, "#ffffff", 0, INK, "left");
  ptxt(g, "ISO 800  1/125  f2.8", 300, 770, 24, "#ffffff", 0, INK, "center");
  g.restore();
};
/** price tag "FREELANCE" */
export const fxTag = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.12);
  p.poly([[-230, -120], [170, -120], [250, 0], [170, 120], [-230, 120]], "#ffd84a", 10); p.ell(160, 0, 20, 20, "#ffffff", 6);
  ptxt(g, "FREELANCE", -40, -38, 58, "#241726"); ptxt(g, "Rp150rb/jam", -40, 48, 50, "#c0302c");
  g.restore();
};
/** first-frame hook text: two big lines */
export const fxHook = (p, a, b) => {
  const g = p.g;
  g.font = `900 80px ${PF}`; const s1 = Math.min(80, Math.floor(80 * 560 / g.measureText(a).width)); g.font = `900 80px ${PF}`; const s2 = Math.min(80, Math.floor(80 * 560 / g.measureText(b).width));
  ptxt(g, a, 300, 440, s1, "#ffffff", 16); ptxt(g, b, 300, 545, s2, "#ffd84a", 16);
};
/** "besok" teaser card */
export const fxNext = (p) => {
  const g = p.g;
  p.poly(rrect(70, 330, 530, 670, 30), "#241726", 10);
  ptxt(g, "BESOK:", 300, 400, 54, "#ffd84a");
  ptxt(g, "BALIKIN", 300, 480, 66, "#ffffff"); ptxt(g, "CHARGER", 300, 560, 66, "#ff8ac8");
  ptxt(g, "SERI MANTAN #4", 300, 630, 30, "#bfe6ff");
};


// ---------- "Kenalan Cewek di Facebook" ----------
const girlFace = (p, cx, cy, r, ears) => {
  if (ears > 0.01) for (const sx of [-1, 1]) { const e = ears; p.poly([[cx + sx * r * 0.35, cy - r * 0.75], [cx + sx * r * 0.95 * e + sx * r * 0.3 * (1 - e), cy - r * (0.75 + 0.75 * e)], [cx + sx * r * 0.95, cy - r * 0.3]], "#3a2a22", 6);
    p.poly([[cx + sx * r * 0.5, cy - r * 0.78], [cx + sx * r * 0.85 * e + sx * r * 0.4 * (1 - e), cy - r * (0.78 + 0.5 * e)], [cx + sx * r * 0.82, cy - r * 0.45]], "#f6a6c6", 0); }
  p.ell(cx, cy + r * 0.15, r * 1.05, r * 1.15, "#3a2a22", 6);
  p.ell(cx, cy + r * 0.05, r * 0.8, r * 0.85, "#f5cfa8", 5);
  p.ell(cx, cy - r * 0.55, r * 0.85, r * 0.35, "#3a2a22", 0);
  for (const sx of [-1, 1]) { p.ell(cx + sx * r * 0.3, cy + r * 0.02, r * 0.09, r * 0.13, INK, 0); p.ell(cx + sx * r * 0.48, cy + r * 0.25, r * 0.13, r * 0.08, "#f6a6c6", 0); }
  p.stroke([[cx - r * 0.22, cy + r * 0.35], [cx, cy + r * 0.47], [cx + r * 0.22, cy + r * 0.35]], 5, INK);
  if (ears > 0.01) for (const sx of [-1, 1]) for (const k of [-1, 1]) p.stroke([[cx + sx * r * 0.55, cy + r * 0.3 + k * 6], [cx + sx * r * 0.95, cy + r * 0.25 + k * 14]], 3, INK);
};
/** Facebook profile in a phone; ears 0..1 = cat filter */
export const fxProfile = (p, ears = 1) => {
  const g = p.g;
  p.poly(rrect(110, 120, 490, 900, 46), "#2b2f3a", 12);
  p.poly(rrect(132, 160, 468, 860, 26), "#ffffff", 0);
  p.poly(rrect(132, 160, 468, 330, 26), "#f6c6dc", 0); p.poly([[132, 300], [468, 300], [468, 330], [132, 330]], "#f6c6dc", 0);
  for (let i = 0; i < 6; i++) p.poly(heartPts(170 + i * 60, 220 + (i % 2) * 40, 14), "#ffffff", 0);
  p.ell(300, 360, 92, 92, "#ffffff", 0); p.ell(300, 360, 84, 84, "#ffe8f2", 4);
  girlFace(p, 300, 365, 62, ears);
  ptxt(g, "Putri Manis", 300, 495, 40, INK);
  ptxt(g, "Tinggal di hatimu", 300, 540, 24, "#65676b");
  p.poly(rrect(160, 590, 440, 650, 14), "#1877f2", 0); ptxt(g, "+ Tambah Teman", 300, 621, 28, "#ffffff");
  p.poly(rrect(160, 665, 440, 725, 14), "#e4e6eb", 0); ptxt(g, "Kirim Pesan", 300, 696, 28, INK);
  ptxt(g, "1.248 teman", 300, 770, 24, "#65676b");
};
/** promo card */
export const fxPromo = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.06);
  p.poly(rrect(-230, -170, 230, 170, 30), "#ff5fa2", 10);
  ptxt(g, "PROMO!", 0, -110, 60, "#ffd84a", 10);
  ptxt(g, "BELI 2", 0, -25, 76, "#ffffff", 10); ptxt(g, "GRATIS 1", 0, 60, 70, "#ffffff", 10);
  ptxt(g, "skincare glowing", 0, 130, 30, "#241726");
  g.restore();
};
/** cardboard parcel */
export const fxParcel = (p) => {
  const g = p.g;
  p.poly([[120, 420], [480, 420], [480, 760], [120, 760]], "#c8925a", 10);
  p.poly([[120, 420], [200, 340], [560, 340], [480, 420]], "#d9a46a", 10); p.poly([[480, 420], [560, 340], [560, 680], [480, 760]], "#b07a48", 10);
  p.band([[300, 420], [300, 760]], "#e8d4a0", 40, 0);
  p.poly(rrect(160, 560, 440, 700, 12), "#ffffff", 6);
  ptxt(g, "SKINCARE", 300, 605, 40, "#ff5fa2"); ptxt(g, "COD - FRAGILE", 300, 660, 24, INK);
};
/** sparkles around a glowing face; t phase */
export const fxSparkle = (p, t) => {
  for (let i = 0; i < 9; i++) { const a = i * 0.7 + t * 2, r = 200 + 40 * Math.sin(i * 1.9 + t * 4), x = 300 + Math.cos(a) * r * 1.1, y = 500 + Math.sin(a) * r, s = 18 + 12 * Math.abs(Math.sin(t * 6 + i));
    p.poly([[x, y - s * 2], [x + s * 0.5, y - s * 0.5], [x + s * 2, y], [x + s * 0.5, y + s * 0.5], [x, y + s * 2], [x - s * 0.5, y + s * 0.5], [x - s * 2, y], [x - s * 0.5, y - s * 0.5]], i % 2 ? "#fff3b0" : "#ffffff", 4); }
};
/** teaser: besok kenalan lewat game */
export const fxNextGame = (p) => {
  const g = p.g;
  p.poly(rrect(70, 330, 530, 670, 30), "#241726", 10);
  ptxt(g, "BESOK:", 300, 400, 54, "#ffd84a");
  ptxt(g, "KENALAN", 300, 480, 66, "#ffffff"); ptxt(g, "LEWAT GAME", 300, 560, 60, "#ff8ac8");
  ptxt(g, "SERI KENALAN #2", 300, 630, 30, "#bfe6ff");
};


// ---------- "Heboh Soal Ijazah" ----------
/** TV breaking-news card (no faces) */
export const fxNews = (p, t = 0, label = "IJAZAH") => {
  const g = p.g;
  p.poly(rrect(70, 250, 530, 640, 26), "#2b2f3a", 12); p.poly(rrect(95, 275, 505, 590, 10), "#1d4f9a", 0);
  p.poly([[95, 470], [505, 470], [505, 540], [95, 540]], "#e0352b", 0);
  ptxt(g, "BREAKING NEWS", 300, 505, 40, "#ffffff");
  p.poly(rrect(160, 320, 440, 450, 12), "#f4efe2", 6);
  ptxt(g, label, 300, 365, 48, "#7a3b1c"); for (let i = 0; i < 3; i++) p.band([[200, 400 + i * 14], [400, 400 + i * 14]], "#c8b48a", 5, 0);
  const off = (t * 220) % 520; g.save(); g.beginPath(); g.rect(95, 545, 410, 40); g.clip();
  ptxt(g, "HEBOH SE-INDONESIA  •  HEBOH SE-INDONESIA  •", 505 - off, 566, 24, "#ffd84a", 0, INK, "left"); g.restore();
  p.poly([[250, 640], [350, 640], [380, 700], [220, 700]], "#2b2f3a", 8);
};
/** wardrobe with the diploma wedged under one leg */
export const fxLemari = (p) => {
  const g = p.g;
  p.poly(rrect(150, 230, 450, 760, 10), "#9a6a42", 10); p.stroke([[300, 240], [300, 750]], 6, "#5e3c26");
  p.dot(285, 490, 9, "#e2b04a"); p.dot(315, 490, 9, "#e2b04a");
  p.poly(rrect(165, 760, 205, 800, 4), "#5e3c26", 6); p.poly(rrect(395, 780, 435, 820, 4), "#5e3c26", 6);
  g.save(); g.translate(205, 806); g.rotate(-0.04); p.poly(rrect(-80, -20, 120, 20, 4), "#f4efe2", 6); ptxt(g, "IJAZAH", 20, 1, 30, "#7a3b1c"); g.restore();
  p.band([[120, 822], [480, 822]], "#c9a07a", 10, 0);
};
/** report card: MATEMATIKA 5 */
export const fxRapor = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.05);
  p.poly(rrect(-200, -230, 200, 230, 14), "#ffffff", 10);
  ptxt(g, "NILAI", 0, -180, 40, "#241726");
  const rows = [["B. INDO", "7"], ["IPA", "6"], ["MATEMATIKA", "5"], ["OLAHRAGA", "9"]];
  rows.forEach(([a, b], i) => { const y = -100 + i * 75, hot = a === "MATEMATIKA";
    if (hot) p.ell(140, y, 46, 36, null, 7);
    ptxt(g, a, -170, y, 30, hot ? "#c0302c" : "#241726", 0, INK, "left"); ptxt(g, b, 140, y, 42, hot ? "#c0302c" : "#241726"); });
  g.restore();
};
/** diploma with old photo; edited 0..1 smooths the face and adds a stamp */
export const fxIjazah = (p, edited = 0) => {
  const g = p.g;
  p.poly(rrect(70, 230, 530, 770, 14), "#f4efe2", 10); p.poly(rrect(90, 250, 510, 750, 8), null, 4);
  ptxt(g, "IJAZAH", 300, 300, 56, "#7a3b1c");
  for (let i = 0; i < 6; i++) p.band([[250, 400 + i * 40], [480, 400 + i * 40]], "#c8b48a", 6, 0);
  p.poly(rrect(110, 380, 230, 540, 4), "#d8453b", 4);
  const cx = 170, cy = 465;
  p.ell(cx, cy + 6, 44, 50, edited > 0.5 ? "#f2c8a4" : "#e8b48a", 4);
  p.poly([[cx - 46, cy - 6], [cx - 40, cy - 46], [cx, cy - 56], [cx + 40, cy - 46], [cx + 46, cy - 6], [cx + 4, cy - 40], [cx - 4, cy - 40]], "#2a1d18", 0);
  p.stroke([[cx, cy - 52], [cx, cy - 38]], 3, "#e8b48a");
  p.dot(cx - 14, cy + 2, 4, INK); p.dot(cx + 14, cy + 2, 4, INK); p.stroke([[cx - 10, cy + 26], [cx + 10, cy + 26]], 3, INK);
  if (edited < 0.5) for (const [dx, dy] of [[-22, 18], [24, 14], [6, -16]]) p.dot(cx + dx, cy + dy, 5, "#c0302c");
  ptxt(g, "Nama: GUE", 370, 610, 30, "#241726"); ptxt(g, "Lulus: pas-pasan", 370, 655, 26, "#241726");
  if (edited > 0.01) { g.save(); g.translate(330, 700); g.scale(edited, edited); g.rotate(-0.15);
    p.poly(rrect(-140, -40, 140, 40, 10), "#ffffff", 6); ptxt(g, "DI-EDIT ✓", 0, 3, 40, "#1f7a3a"); g.restore();
    for (const [x, y] of [[110, 370], [235, 400], [120, 550]]) { p.stroke([[x - 16, y], [x + 16, y]], 5, "#ffd84a"); p.stroke([[x, y - 16], [x, y + 16]], 5, "#ffd84a"); } }
};
/** job ad: satpam needs a diploma */
export const fxLowongan = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.04);
  p.poly(rrect(-230, -230, 230, 230, 18), "#fff8d8", 10);
  p.poly(rrect(-230, -230, 230, -130, 18), "#2b3a6a", 0); p.poly([[-230, -150], [230, -150], [230, -130], [-230, -130]], "#2b3a6a", 0);
  ptxt(g, "LOWONGAN", 0, -180, 50, "#ffd84a");
  ptxt(g, "SATPAM", 0, -75, 64, "#241726");
  ptxt(g, "Syarat:", -180, 10, 34, "#241726", 0, INK, "left");
  ptxt(g, "- IJAZAH ASLI", -180, 70, 36, "#c0302c", 0, INK, "left");
  ptxt(g, "- Legalisir 3x", -180, 125, 30, "#241726", 0, INK, "left");
  ptxt(g, "- Siap begadang", -180, 175, 30, "#241726", 0, INK, "left");
  g.restore();
};

// ---------- "Janji 19 Juta Lapangan Kerja" ----------
export const fxBillboard = (p) => {
  const g = p.g;
  p.poly(rrect(60, 300, 540, 620, 20), "#1d4f9a", 12); p.poly(rrect(80, 320, 520, 600, 12), "#ffffff", 0);
  ptxt(g, "DIBUKA!", 300, 365, 44, "#c0302c");
  ptxt(g, "19.000.000", 300, 450, 84, "#1d4f9a", 10, "#ffffff");
  ptxt(g, "LAPANGAN KERJA", 300, 540, 46, "#241726");
  for (const x of [170, 430]) p.poly(rrect(x - 12, 620, x + 12, 780, 4), "#5e3c26", 6);
};
export const fxMap = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.06);
  p.poly(rrect(-210, -260, 210, 260, 12), "#c8925a", 10); p.poly(rrect(-60, -280, 60, -250, 8), "#a8743e", 6);
  p.poly(rrect(-170, -190, 30, -60, 6), "#ffffff", 6); ptxt(g, "KTP", -70, -150, 34, "#1d4f9a"); for (let i = 0; i < 3; i++) p.band([[-150, -110 + i * 18], [10, -110 + i * 18]], "#9aa0b0", 5, 0);
  p.poly(rrect(60, -190, 170, -50, 4), "#d8453b", 6); p.ell(115, -135, 30, 34, "#e8b48a", 4); p.ell(115, -165, 32, 14, "#2a1d18", 0); p.ell(115, -70, 40, 22, "#ffffff", 0);
  p.poly(rrect(-170, 0, 170, 200, 6), "#fff8d8", 6); ptxt(g, "LAMARAN", 0, 50, 44, "#241726"); ptxt(g, "dari 2024", 0, 120, 36, "#c0302c");
  g.restore();
};
export const fxBursa = (p) => {
  const g = p.g;
  p.poly([[40, 330], [560, 330], [530, 430], [560, 530], [40, 530], [70, 430]], "#e0352b", 10);
  ptxt(g, "BURSA KERJA", 300, 400, 64, "#ffffff"); ptxt(g, "antrean: 19 juta orang", 300, 475, 30, "#ffd84a");
};
/** CV card; star = funny highlight */
export const fxCV = (p, who, exp, star = false) => {
  const g = p.g;
  p.poly(rrect(110, 230, 490, 770, 14), "#ffffff", 10);
  p.poly(rrect(110, 230, 490, 320, 14), star ? "#ffd84a" : "#9aa0b0", 0); p.poly([[110, 300], [490, 300], [490, 320], [110, 320]], star ? "#ffd84a" : "#9aa0b0", 0);
  ptxt(g, "CV", 300, 275, 56, "#241726");
  p.ell(300, 400, 55, 55, "#e8e8ee", 5); ptxt(g, "?", 300, 404, 60, "#9aa0b0");
  ptxt(g, who, 300, 500, 40, "#241726");
  ptxt(g, "Pengalaman:", 300, 565, 30, "#65676b");
  g.font = `900 40px ${PF}`; const lines = wrap(g, exp, 340); lines.forEach((l, i) => ptxt(g, l, 300, 625 + i * 48, 40, star ? "#c0302c" : "#1d4f9a"));
  if (star) for (const [x, y] of [[150, 560], [450, 520], [440, 720]]) { p.stroke([[x - 18, y], [x + 18, y]], 6, "#ffd84a"); p.stroke([[x, y - 18], [x, y + 18]], 6, "#ffd84a"); }
};
/** "nggak enak" meter: k = 1..3 */
export const fxMeter = (p, k) => {
  const g = p.g;
  p.poly(rrect(60, 340, 540, 660, 24), "#241726", 10);
  ptxt(g, "RASA NGANGGUR", 300, 395, 40, "#ffd84a");
  ["AWAL", "TENGAH", "AKHIR"].forEach((t, i) => { const x = 140 + i * 160, on = k > i;
    p.poly(rrect(x - 70, 440, x + 70, 560, 14), on ? ["#ff9a3c", "#e0352b", "#8a1020"][i] : "#3a3f52", 6);
    ptxt(g, t, x, 500, 30, "#ffffff"); });
  ptxt(g, "NGGAK ENAK", 300, 615, 40, "#ffffff");
};
export const fxRec = (p, blink = true) => {
  const g = p.g;
  p.poly(rrect(130, 200, 470, 800, 40), "#2b2f3a", 12); p.poly(rrect(152, 240, 448, 760, 20), "#3a8f6a", 0);
  if (blink) p.dot(200, 290, 18, "#e0352b"); ptxt(g, "REC", 230, 291, 34, "#ffffff", 0, INK, "left");
  ptxt(g, "KONTEN", 300, 470, 60, "#ffffff", 8); ptxt(g, "NGANGGUR", 300, 540, 52, "#ffd84a", 8); ptxt(g, "1 JT VIEWS", 300, 650, 40, "#ffffff");
};
/** job ad: komika; lulus 0..1 stamp */
export const fxKomika = (p, syarat = 0, lulus = 0) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.03);
  p.poly(rrect(-230, -240, 230, 240, 18), "#fff8d8", 10);
  p.poly(rrect(-230, -240, 230, -140, 18), "#7a3fa0", 0); p.poly([[-230, -160], [230, -160], [230, -140], [-230, -140]], "#7a3fa0", 0);
  ptxt(g, "LOWONGAN", 0, -190, 50, "#ffd84a");
  ptxt(g, "KOMIKA", 0, -85, 66, "#241726");
  ptxt(g, "Syarat:", -180, 0, 34, "#241726", 0, INK, "left");
  if (syarat > 0.01) { ptxt(g, "KUAT DIHUJAT", 0, 70, 50, "#c0302c"); ptxt(g, "NETIZEN", 0, 130, 50, "#c0302c"); }
  if (lulus > 0.01) { g.save(); g.translate(60, 190); g.scale(lulus, lulus); g.rotate(-0.2); p.poly(rrect(-140, -45, 140, 45, 12), null, 8);
    ptxt(g, "LULUS ✓", 0, 3, 54, "#1f7a3a"); g.restore(); }
  g.restore();
};

// ---------- "Tunggu Kena Karma" ----------
export const fxComments = (p, n = 4) => {
  const g = p.g, names = ["netizen1", "warga62", "akunbaru", "mak_ijah"];
  for (let i = 0; i < n; i++) { const y = 300 + i * 115, x = 90 + (i % 2) * 30;
    p.ell(x + 30, y + 40, 30, 30, ["#ff9a3c", "#3a7bd5", "#7a3fa0", "#2b6a3a"][i], 4);
    p.poly(rrect(x + 75, y, x + 470, y + 90, 22), "#ffffff", 5);
    ptxt(g, names[i], x + 95, y + 25, 22, "#65676b", 0, INK, "left"); ptxt(g, "TUNGGU KENA KARMA!", x + 95, y + 60, 32, "#c0302c", 0, INK, "left"); }
};
export const fxLoket = (p, k = 3) => {
  const g = p.g;
  p.poly(rrect(70, 250, 530, 760, 16), "#f4efe2", 10); p.poly(rrect(70, 250, 530, 360, 16), "#1d4f9a", 0); p.poly([[70, 330], [530, 330], [530, 360], [70, 360]], "#1d4f9a", 0);
  ptxt(g, "LOKET KARMA", 300, 305, 54, "#ffffff");
  ptxt(g, "Syarat:", 110, 410, 36, "#241726", 0, INK, "left");
  ["Surat pengantar RT", "Legalisir 3x", "Antre 3 bulan"].forEach((t, i) => { if (k > i) { p.poly(rrect(110, 450 + i * 95, 160, 500 + i * 95, 8), "#ffffff", 5); p.stroke([[118, 475 + i * 95], [132, 490 + i * 95], [152, 460 + i * 95]], 7, "#1f7a3a"); ptxt(g, t, 180, 476 + i * 95, 36, "#241726", 0, INK, "left"); } });
};
export const fxPensiun = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.05);
  p.poly(rrect(-220, -150, 220, 150, 20), "#1f7a3a", 10);
  ptxt(g, "PENSIUN ✓", 0, -70, 60, "#ffffff"); ptxt(g, "+ TUNJANGAN", 0, 10, 50, "#ffd84a");
  for (let i = 0; i < 5; i++) p.poly(rrect(-150 + i * 60, 60, -100 + i * 60, 120, 6), "#7fd0a0", 5);
  g.restore();
};
/** orange vest on a hanger; medal 0..1 */
export const fxRompi = (p, medal = 0) => {
  const g = p.g;
  p.stroke([[300, 230], [300, 270]], 8, "#4a4f5a"); p.arc(300, 225, 22, 22, 180, 360, 8);
  p.stroke([[150, 330], [300, 270], [450, 330]], 10, "#4a4f5a");
  p.poly([[160, 330], [250, 290], [300, 380], [350, 290], [440, 330], [470, 760], [130, 760]], "#ff7a1a", 10);
  p.stroke([[300, 380], [300, 760]], 6, INK);
  ptxt(g, "TAHANAN", 300, 560, 46, "#ffffff", 8);
  if (medal > 0.01) { g.save(); g.translate(390, 450); g.scale(medal, medal); g.rotate(0.15);
    p.poly([[-30, -120], [0, -40], [30, -120]], "#e0352b", 5); p.ell(0, 0, 60, 60, "#ffd84a", 7); ptxt(g, "JUARA 1", 0, -8, 24, INK); ptxt(g, "17-AN", 0, 20, 22, INK); g.restore(); }
};
export const fxKursiRoda = (p, empty = true) => {
  const g = p.g;
  p.ell(230, 650, 120, 120, null, 12); p.ell(230, 650, 20, 20, "#4a4f5a", 5);
  p.ell(420, 720, 45, 45, null, 9);
  p.poly(rrect(200, 520, 420, 570, 10), "#3a7bd5", 7); p.poly(rrect(380, 330, 420, 570, 10), "#3a7bd5", 7);
  p.stroke([[420, 340], [470, 330]], 10, INK); p.stroke([[220, 570], [420, 690]], 8, INK);
  if (empty) ptxt(g, "MENDADAK SAKIT", 300, 250, 48, "#ffffff", 9);
};
export const fxCaleg = (p) => {
  const g = p.g;
  p.poly(rrect(110, 220, 490, 780, 14), "#e0352b", 10); p.poly(rrect(130, 240, 470, 760, 8), "#ffffff", 0);
  p.ell(300, 400, 90, 100, "#3a3f4a", 0); p.poly([[170, 600], [200, 500], [400, 500], [430, 600]], "#3a3f4a", 0);
  ptxt(g, "PILIH SAYA", 300, 660, 50, "#c0302c"); ptxt(g, "LAGI!", 300, 720, 54, "#c0302c");
  ptxt(g, "(baru keluar)", 300, 265, 26, "#65676b");
};
export const fxDiskon = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.12);
  p.poly([[-230, -130], [170, -130], [250, 0], [170, 130], [-230, 130]], "#ffd84a", 10); p.ell(160, 0, 20, 20, "#ffffff", 6);
  ptxt(g, "KARMA", -40, -55, 60, "#241726"); ptxt(g, "DISKON 90%", -40, 45, 58, "#c0302c");
  g.restore();
};
export const fxJanji = (p) => {
  const g = p.g;
  p.poly(rrect(120, 260, 480, 740, 26), "#ffffff", 12); p.poly(rrect(120, 260, 480, 380, 26), "#d8453b", 0); p.poly([[120, 360], [480, 360], [480, 380], [120, 380]], "#d8453b", 0);
  ptxt(g, "JANJI", 300, 320, 56, "#ffffff");
  ptxt(g, "5", 300, 520, 170, "#241726"); ptxt(g, "TAHUN LAGI", 300, 660, 48, "#c0302c");
};
/** two queues: prioritas (short) vs reguler (long) */
export const fxJalur = (p) => {
  const g = p.g;
  p.poly(rrect(40, 260, 290, 740, 18), "#ffd84a", 8); p.poly(rrect(310, 260, 560, 740, 18), "#9aa0b0", 8);
  ptxt(g, "PRIORITAS", 165, 310, 36, "#241726"); ptxt(g, "(pejabat)", 165, 352, 26, "#241726");
  ptxt(g, "REGULER", 435, 310, 40, "#ffffff"); ptxt(g, "(rakyat)", 435, 352, 26, "#ffffff");
  p.ell(165, 450, 30, 30, "#3a3f4a", 4); ptxt(g, "→ 1 orang", 165, 520, 28, "#241726");
  for (let i = 0; i < 12; i++) p.ell(360 + (i % 4) * 50, 420 + Math.floor(i / 4) * 70, 20, 20, "#5a6070", 3);
  ptxt(g, "→ 270 juta", 435, 680, 30, "#ffffff");
};


// ---------- "Gombalin Cewek Genit" ----------
export const fxZap = (p, t = 0) => {
  const g = p.g;
  p.poly(heartPts(300, 500, 200), "#ff5f8a", 12);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4 + Math.sin(t * 9 + i) * 0.1, x = 300 + Math.cos(a) * 260, y = 500 + Math.sin(a) * 260;
    g.save(); g.translate(x, y); g.rotate(a); p.poly([[-20, -70], [20, -10], [0, -10], [25, 70], [-15, 5], [5, 5]], "#ffd84a", 6); g.restore(); }
};
export const fxUduk = (p) => {
  const g = p.g;
  p.ell(300, 560, 230, 80, "#ffffff", 10); p.ell(300, 545, 190, 55, "#f4efe2", 0);
  p.ell(260, 520, 110, 55, "#f7f2e6", 6); for (let i = 0; i < 6; i++) p.dot(220 + i * 18, 500 + (i % 2) * 14, 6, "#e8dcc4");
  p.poly([[350, 480], [450, 470], [440, 540], [360, 545]], "#c8803a", 6); p.ell(400, 560, 40, 20, "#e8a040", 5); p.ell(200, 470, 30, 18, "#d8453b", 5);
  ptxt(g, "NASI UDUK", 300, 700, 56, "#241726", 0);
};
export const fxHearts = (p, t = 0) => {
  for (let i = 0; i < 6; i++) { const ph = (t * 0.6 + i / 6) % 1, x = 300 + Math.sin(i * 2.1 + ph * 6) * 150, y = 820 - ph * 600, r = 30 + (i % 3) * 12;
    const g = p.g; g.save(); g.globalAlpha = 1 - ph * 0.8; p.poly(heartPts(x, y, r), i % 2 ? "#ff5f8a" : "#ff8ac8", 4); g.restore(); }
};
export const fxNikah = (p) => {
  const g = p.g;
  p.poly(rrect(110, 250, 490, 760, 26), "#ffffff", 12); p.poly(rrect(110, 250, 490, 370, 26), "#ff5f8a", 0); p.poly([[110, 350], [490, 350], [490, 370], [110, 370]], "#ff5f8a", 0);
  ptxt(g, "NIKAH", 300, 310, 60, "#ffffff");
  ptxt(g, "SEKARANG", 300, 520, 64, "#c0302c"); ptxt(g, "?!", 300, 640, 110, "#c0302c");
  p.poly(heartPts(430, 700, 30), "#ff5f8a", 4);
};
export const fxRecK = (p, blink = true) => {
  const g = p.g;
  p.poly(rrect(130, 200, 470, 800, 40), "#2b2f3a", 12); p.poly(rrect(152, 240, 448, 760, 20), "#3a3f52", 0);
  if (blink) p.dot(200, 290, 18, "#e0352b"); ptxt(g, "REC", 230, 291, 34, "#ffffff", 0, INK, "left");
  ptxt(g, "LATIHAN", 300, 470, 56, "#ffffff", 8); ptxt(g, "GOMBAL", 300, 540, 56, "#ffd84a", 8); ptxt(g, "#konten", 300, 650, 40, "#bfe6ff");
};
export const fxBakso = (p) => {
  const g = p.g;
  p.poly(rrect(120, 380, 480, 640, 14), "#3a7bd5", 10); p.poly(rrect(140, 300, 460, 380, 10), "#f4f1ea", 8);
  ptxt(g, "BAKSO", 300, 340, 56, "#c0302c");
  p.poly(rrect(160, 420, 300, 600, 10), "#cfe8f0", 6); for (let i = 0; i < 4; i++) p.ell(200 + (i % 2) * 50, 470 + Math.floor(i / 2) * 60, 22, 22, "#b08a6a", 4);
  p.ell(380, 500, 55, 45, "#c9cfd6", 6); p.stroke([[380, 450], [380, 400], [395, 380]], 6, "#e8e8ee");
  for (const x of [170, 430]) { p.ell(x, 670, 40, 40, null, 9); p.dot(x, 670, 8, INK); }
  p.stroke([[480, 500], [560, 470]], 10, "#5e3c26");
  ptxt(g, "Ting! Ting!", 300, 760, 40, "#ffffff", 8);
};


// ---------- "Kena Prank Bule Bandung" ----------
export const fxNoteCard = (p, text, col = "#fff8d8") => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.04);
  p.poly(rrect(-250, -90, 250, 90, 18), col, 10); g.font = `900 64px ${PF}`; let sz = Math.min(64, Math.floor(64 * 440 / g.measureText(text).width));
  if (sz < 46 && text.includes(" ")) { const w = text.split(" "); let best = null; for (let i = 1; i < w.length; i++) { const a = w.slice(0, i).join(" "), b = w.slice(i).join(" "), m = Math.max(g.measureText(a).width, g.measureText(b).width); if (!best || m < best[2]) best = [a, b, m]; }
    const s2 = Math.min(56, Math.floor(64 * 440 / best[2])); ptxt(g, best[0], 0, -30, s2, "#241726"); ptxt(g, best[1], 0, 36, s2, "#241726"); }
  else ptxt(g, text, 0, 4, sz, "#241726"); g.restore(); };
export const fxStamp = (p, a, b) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.12);
  p.poly(rrect(-260, -110, 260, 110, 16), null, 12); p.poly(rrect(-240, -90, 240, 90, 10), null, 5);
  ptxt(g, a, 0, -30, 72, "#c0302c"); ptxt(g, b, 0, 50, 54, "#c0302c"); g.restore(); };
export const fxKamus = (p) => { const g = p.g;
  p.poly([[60, 300], [300, 340], [300, 740], [60, 700]], "#ffffff", 9); p.poly([[540, 300], [300, 340], [300, 740], [540, 700]], "#f4efe2", 9);
  p.poly(rrect(60, 230, 540, 300, 12), "#c0302c", 8); ptxt(g, "KAMUS INGGRIS-INDONESIA", 300, 266, 30, "#ffffff");
  ptxt(g, "mouth", 180, 470, 52, "#1d4f9a"); ptxt(g, "=", 300, 520, 60, "#241726"); ptxt(g, "mulut", 420, 570, 52, "#c0302c");
  for (let i = 0; i < 3; i++) { p.band([[100, 620 + i * 26], [270, 640 + i * 26]], "#c8c8d0", 5, 0); p.band([[330, 620 + i * 26], [500, 600 + i * 26]], "#c8c8d0", 5, 0); } };
export const fxKTP = (p) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.04);
  p.poly(rrect(-260, -170, 260, 170, 18), "#7fb8e0", 10);
  ptxt(g, "PROVINSI JAWA BARAT", 0, -130, 28, "#241726"); ptxt(g, "KOTA CIMAHI", 0, -90, 34, "#241726");
  p.poly(rrect(100, -60, 220, 100, 6), "#d8453b", 5); p.ell(160, 10, 40, 46, "#f6d8c4", 4); p.ell(160, -28, 44, 22, "#f2c94c", 0);
  ptxt(g, "Nama: NENG", -230, -30, 30, "#241726", 0, INK, "left"); ptxt(g, "Asal: Bandung", -230, 20, 30, "#241726", 0, INK, "left");
  ptxt(g, "Bahasa: Sunda", -230, 70, 30, "#241726", 0, INK, "left"); ptxt(g, "Muka: BULE", -230, 120, 30, "#c0302c", 0, INK, "left");
  g.restore(); };
export const fxStampC = (p, a, b, col = "#2f9a4a") => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.1);
  p.poly(rrect(-260, -110, 260, 110, 16), "#ffffffdd", 12); p.poly(rrect(-240, -90, 240, 90, 10), null, 5);
  ptxt(g, a, 0, -30, 70, col); ptxt(g, b, 0, 50, 54, col); g.restore(); };
export const fxPhoneMsg = (p, a, b, ring = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.05 * Math.sin(ring * 2.5));
  p.poly(rrect(-150, -270, 150, 270, 36), "#2b2f3a", 12); p.poly(rrect(-125, -230, 125, 220, 16), "#bfe6ff", 0);
  p.poly(rrect(-110, -110, 110, 60, 18), "#ffffff", 6); ptxt(g, a, 0, -62, 30, "#2f9a4a"); ptxt(g, b, 0, 0, 24, "#241726");
  p.dot(0, 245, 12, "#5d6470"); if (ring) for (const sd of [-1, 1]) for (let k = 1; k <= 2; k++) p.stroke([[sd * (175 + k * 26), -60 - k * 14], [sd * (190 + k * 30), 0], [sd * (175 + k * 26), 60 + k * 14]], 9, "#ffd84a");
  g.restore(); };
