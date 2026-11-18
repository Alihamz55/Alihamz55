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
export const fxRain = (p, t) => { const g = p.g; g.save(); g.lineCap = "round";
  for (let i = 0; i < 70; i++) { const x = (i * 97 + t * 13) % 640 - 20, y = ((i * 211) % 1000 + t * 90) % 1060 - 60, l = 30 + (i % 4) * 12;
    g.strokeStyle = i % 3 ? "rgba(200,220,255,0.38)" : "rgba(235,245,255,0.45)"; g.lineWidth = 2 + (i % 2); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + l); g.stroke(); }
  g.restore(); };
/** big, high-contrast pop-up card: shadow + thick border + auto-fit title (1-2 lines) + optional ribbon */
export const fxPop = (p, title, sub = "", bg = "#ffd84a", fg = "#1a1220", rib = "#c0302c", rot = -0.03) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(rot);
  g.font = `900 92px ${PF}`; let lines = [title], sz = Math.min(92, Math.floor(92 * 500 / g.measureText(title).width));
  if (sz < 62 && title.includes(" ")) { const w = title.split(" "); let best = null; for (let i = 1; i < w.length; i++) { const a = w.slice(0, i).join(" "), b = w.slice(i).join(" "), m = Math.max(g.measureText(a).width, g.measureText(b).width); if (!best || m < best[2]) best = [a, b, m]; }
    lines = [best[0], best[1]]; sz = Math.min(84, Math.floor(92 * 500 / best[2])); }
  const hT = lines.length * sz * 1.08 + 56, hS = sub ? 78 : 0, top = -(hT + hS) / 2;
  p.poly(rrect(-276 + 14, top + 16, 276 + 14, top + hT + 16, 26), "#000000aa", 0);
  p.poly(rrect(-276, top, 276, top + hT, 26), bg, 12);
  lines.forEach((t, i) => ptxt(g, t, 0, top + 28 + sz * 0.54 + i * sz * 1.08, sz, fg, 0));
  if (sub) { g.font = `900 46px ${PF}`; const sw = Math.min(46, Math.floor(46 * 470 / g.measureText(sub).width));
    p.poly(rrect(-250, top + hT - 10, 250, top + hT + 64, 16), rib, 10); ptxt(g, sub, 0, top + hT + 27, sw, "#ffffff", 0); }
  g.restore(); };

// ---------- "Pacaran Sama AI": Vira hologram ----------
/** mouth 0..3, mood: 'love' | 'flat' | 'error'; t = frame for flicker */
export const fxVira = (p, mouth = 0, mood = "love", t = 0, blink = 0) => {
  const g = p.g, err = mood === "error", C = err ? "#ff4a5a" : "#5ff2ff", C2 = err ? "#ff9a4a" : "#ff7ad9";
  g.save(); g.globalAlpha = 0.28; g.fillStyle = C; g.beginPath(); g.moveTo(140, 800); g.lineTo(460, 800); g.lineTo(312, 990); g.lineTo(288, 990); g.closePath(); g.fill(); g.restore();
  p.poly(rrect(78, 168, 522, 812, 40), C2 + "88", 0);
  p.poly(rrect(92, 182, 508, 798, 34), "#141a3acc", 10);
  g.save(); g.globalAlpha = 0.12; g.fillStyle = C; for (let y = 190 + (t * 3) % 12; y < 795; y += 12) g.fillRect(100, y, 400, 4); g.restore();
  const cx = 300, cy = 470;
  // hair back + face + bangs
  p.ell(cx, cy - 10, 165, 175, "#8a5cf0", 8);
  p.ell(cx, cy + 20, 128, 135, err ? "#ffd0d0" : "#d9f8ff", 7);
  p.poly([[cx - 140, cy - 40], [cx - 120, cy - 130], [cx - 40, cy - 170], [cx + 60, cy - 165], [cx + 135, cy - 110], [cx + 145, cy - 40], [cx + 70, cy - 85], [cx + 10, cy - 60], [cx - 50, cy - 90]], "#8a5cf0", 6);
  // headset
  for (const sx of [-1, 1]) p.ell(cx + sx * 150, cy + 10, 26, 42, C, 6);
  p.stroke([[cx + 150, cy + 40], [cx + 110, cy + 120], [cx + 55, cy + 130]], 7, C);
  if (err) { for (const sx of [-1, 1]) { p.stroke([[cx + sx * 50 - 22, cy - 2], [cx + sx * 50 + 22, cy + 38]], 12, "#c0102c"); p.stroke([[cx + sx * 50 + 22, cy - 2], [cx + sx * 50 - 22, cy + 38]], 12, "#c0102c"); } }
  else for (const sx of [-1, 1]) {
    if (blink) p.stroke([[cx + sx * 50 - 26, cy + 20], [cx + sx * 50, cy + 28], [cx + sx * 50 + 26, cy + 20]], 9, "#1a1240");
    else { p.ell(cx + sx * 50, cy + 18, 30, 40, "#1a1240", 0); p.ell(cx + sx * 50, cy + 22, 20, 28, mood === "flat" ? "#3a8ad0" : "#c03aa0", 0); p.ell(cx + sx * 50 - 8, cy + 6, 9, 11, "#ffffff", 0); p.ell(cx + sx * 50 + 9, cy + 34, 5, 5, "#ffffff", 0); }
    p.ell(cx + sx * 85, cy + 70, 22, 12, "#ff9ac8", 0); }
  const my = cy + 95;
  if (err) p.stroke([[cx - 34, my + 6], [cx - 12, my - 6], [cx + 12, my + 6], [cx + 34, my - 6]], 8, "#1a1240");
  else if (mouth > 0) p.ell(cx, my, 16 + mouth * 4, 6 + mouth * 7, "#1a1240", 0);
  else if (mood === "flat") p.stroke([[cx - 26, my], [cx + 26, my]], 8, "#1a1240");
  else p.stroke([[cx - 30, my - 6], [cx, my + 10], [cx + 30, my - 6]], 8, "#1a1240");
  // name tag
  p.poly(rrect(170, 690, 430, 770, 22), err ? "#c0102c" : "#ff4fb4", 7);
  ptxt(g, err ? "OFFLINE" : "VIRA  AI", 300, 731, 44, "#ffffff", 0);
  if (!err) p.poly(heartPts(470, 230, 30), "#ff4fb4", 5);
};

/* ---- Jemuran (clothesline) + tumpukan baju for "Sep, Angkat Jemuran!" ---- */
const shade_ = (hex, k) => { const n = parseInt(hex.slice(1), 16); const c = (v) => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`; };
const cloth_ = (g, kind, x, y, col, wet, s = 1) => {
  const c = wet ? shade_(col, 0.68) : col; g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = "#2a1e1a"; g.lineJoin = "round"; g.fillStyle = c; g.beginPath();
  if (kind === "shirt") { g.moveTo(-50, 0); g.lineTo(50, 0); g.lineTo(78, 34); g.lineTo(56, 50); g.lineTo(46, 36); g.lineTo(46, 130); g.lineTo(-46, 130); g.lineTo(-46, 36); g.lineTo(-56, 50); g.lineTo(-78, 34); g.closePath(); }
  else if (kind === "pants") { g.moveTo(-42, 0); g.lineTo(42, 0); g.lineTo(46, 150); g.lineTo(10, 150); g.lineTo(0, 40); g.lineTo(-10, 150); g.lineTo(-46, 150); g.closePath(); }
  else if (kind === "towel") { g.rect(-40, 0, 80, 120); }
  else if (kind === "dress") { g.moveTo(-34, 0); g.lineTo(34, 0); g.lineTo(62, 175); g.lineTo(-62, 175); g.closePath(); }
  else { g.rect(-52, 0, 104, 150); }
  g.fill(); g.stroke();
  if (kind === "sarung") { g.save(); g.clip(); g.strokeStyle = wet ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.35)"; g.lineWidth = 7; for (let k = -60; k < 60; k += 22) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 150); g.stroke(); } for (let k = 10; k < 150; k += 22) { g.beginPath(); g.moveTo(-52, k); g.lineTo(52, k); g.stroke(); } g.restore(); }
  if (kind === "towel") { g.fillStyle = wet ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.45)"; g.fillRect(-40, 92, 80, 10); }
  g.fillStyle = "#e9e2d0"; g.fillRect(-6, -10, 12, 18);                       // jepitan
  if (wet) { g.strokeStyle = "rgba(190,215,255,0.9)"; g.lineWidth = 4; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(k * 26, kind === "dress" ? 182 : 158); g.lineTo(k * 26, (kind === "dress" ? 200 : 176)); g.stroke(); } }
  g.restore(); };
export const fxJemuran = (p, wet = 0, t = 0) => { const g = p.g; g.save();
  g.fillStyle = "#6e5a46"; g.strokeStyle = "#2a1e1a"; g.lineWidth = 6;
  for (const x of [40, 560]) { g.fillRect(x - 9, 330, 18, 670); g.strokeRect(x - 9, 330, 18, 670); }
  g.strokeStyle = "#f2efe6"; g.lineWidth = 5; g.beginPath(); g.moveTo(40, 344); g.quadraticCurveTo(300, 384, 560, 344); g.stroke();
  const sw = wet ? 0 : Math.sin(t * 0.5) * 2;
  const Y = (x) => 344 + 40 * (1 - ((x - 300) / 260) ** 2);
  for (const [k, x, col] of [["shirt", 108, "#d9483b"], ["sarung", 210, "#3c6fb8"], ["towel", 300, "#f2c14e"], ["pants", 384, "#3a3f55"], ["shirt", 480, "#f4f1ea"]]) {
    g.save(); g.translate(x, Y(x)); g.rotate((sw * Math.PI) / 180); cloth_(g, k, 0, 0, col, wet); g.restore(); }
  g.restore(); };
export const fxPile = (p) => { const g = p.g; g.save(); g.translate(300, 540); g.scale(0.9, 1.55); g.lineWidth = 5; g.strokeStyle = "#2a1e1a"; g.lineJoin = "round";
  const blob = (x, y, w, h, col, r = 0) => { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, w, h, 0, 0, 7); g.fill(); g.stroke(); g.restore(); };
  g.fillStyle = "#3c6fb8"; g.beginPath(); g.moveTo(-170, 40); g.lineTo(-120, 40); g.lineTo(-135, 130); g.lineTo(-185, 120); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#f4f1ea"; g.beginPath(); g.moveTo(150, 50); g.lineTo(190, 60); g.lineTo(175, 125); g.lineTo(140, 115); g.closePath(); g.fill(); g.stroke();
  blob(-80, 40, 120, 60, "#3c6fb8", 0.1); blob(90, 50, 110, 55, "#f4f1ea", -0.1); blob(0, 70, 160, 60, "#d9483b"); blob(-30, 0, 120, 55, "#2f8a5a", -0.15);
  // daster motif macan on top
  g.save(); g.translate(30, -30); g.rotate(0.12); g.fillStyle = "#f0a23a"; g.beginPath(); g.ellipse(0, 0, 140, 62, 0, 0, 7); g.fill(); g.stroke(); g.clip();
  g.fillStyle = "#2a1e1a"; for (let i = 0; i < 26; i++) { const x = ((i * 53) % 280) - 140, y = ((i * 37) % 120) - 60; g.beginPath(); g.ellipse(x, y, 11, 7, i, 0, 7); g.fill(); g.fillStyle = "#8a4a14"; g.beginPath(); g.ellipse(x, y, 5, 3, i, 0, 7); g.fill(); g.fillStyle = "#2a1e1a"; }
  g.restore();
  g.strokeStyle = "rgba(190,215,255,0.9)"; g.lineWidth = 4; for (const x of [-150, -60, 40, 140]) { g.beginPath(); g.moveTo(x, 110); g.lineTo(x, 132); g.stroke(); }
  g.restore(); };

/* ---- Pocong (cute-comedic), api unggun, subtitle per kata: "Asep & Ucup Naik Gunung" ---- */
export const fxPocong = (p, mouth = 0, blink = 0, mood = "calm") => { const g = p.g; g.save(); g.lineJoin = "round"; g.lineCap = "round";
  const W = "#f1ece0", S = "#d8d0bc", O = "#2a2420";
  // body shroud
  g.fillStyle = W; g.strokeStyle = O; g.lineWidth = 9; g.beginPath();
  g.moveTo(300, 150); g.bezierCurveTo(410, 150, 418, 260, 410, 360); g.bezierCurveTo(404, 600, 420, 820, 392, 960); g.quadraticCurveTo(300, 1000, 208, 960);
  g.bezierCurveTo(180, 820, 196, 600, 190, 360); g.bezierCurveTo(182, 260, 190, 150, 300, 150); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = S; g.lineWidth = 6; for (const [x0, y0, x1, y1] of [[240, 420, 255, 900], [355, 430, 345, 900], [300, 500, 300, 940]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  // top knot (ikatan kepala)
  g.fillStyle = W; g.strokeStyle = O; g.lineWidth = 8;
  g.beginPath(); g.moveTo(300, 160); g.quadraticCurveTo(250, 70, 268, 40); g.quadraticCurveTo(300, 90, 300, 160); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(300, 160); g.quadraticCurveTo(350, 70, 334, 44); g.quadraticCurveTo(300, 92, 300, 160); g.fill(); g.stroke();
  // rope ties: neck, knees, feet
  g.strokeStyle = "#b8a684"; g.lineWidth = 12; for (const y of [352, 760, 935]) { g.beginPath(); g.moveTo(198, y); g.quadraticCurveTo(300, y + 14, 404, y); g.stroke(); }
  g.fillStyle = "#b8a684"; g.beginPath(); g.ellipse(300, 366, 16, 12, 0, 0, 7); g.fill();
  // face opening
  g.fillStyle = "#c6d4c0"; g.strokeStyle = O; g.lineWidth = 7; g.beginPath(); g.ellipse(300, 258, 78, 86, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = "rgba(90,110,90,0.35)"; for (const x of [268, 332]) { g.beginPath(); g.ellipse(x, 246, 26, 22, 0, 0, 7); g.fill(); }
  if (blink) { g.strokeStyle = O; g.lineWidth = 7; for (const x of [268, 332]) { g.beginPath(); g.moveTo(x - 14, 246); g.lineTo(x + 14, 246); g.stroke(); } }
  else { const big = mood === "shock" ? 1.3 : 1; for (const x of [268, 332]) { g.fillStyle = "#fff"; g.beginPath(); g.ellipse(x, 244, 15 * big, 17 * big, 0, 0, 7); g.fill(); g.strokeStyle = O; g.lineWidth = 5; g.stroke();
    g.fillStyle = O; g.beginPath(); g.ellipse(x + 3, 247, 7, 8, 0, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.ellipse(x + 6, 243, 2.5, 2.5, 0, 0, 7); g.fill(); } }
  g.strokeStyle = O; g.lineWidth = 6; g.beginPath(); g.moveTo(250, 214); g.lineTo(282, 220); g.moveTo(350, 214); g.lineTo(318, 220); g.stroke();
  if (mouth > 0) { g.fillStyle = "#5a2a2a"; g.beginPath(); g.ellipse(300, 298, 16 + mouth * 2, 5 + mouth * 7, 0, 0, 7); g.fill(); g.strokeStyle = O; g.lineWidth = 5; g.stroke(); }
  else { g.strokeStyle = O; g.lineWidth = 6; g.beginPath(); if (mood === "smug") { g.moveTo(276, 296); g.quadraticCurveTo(300, 312, 326, 292); } else { g.moveTo(282, 300); g.quadraticCurveTo(300, 306, 318, 300); } g.stroke(); }
  g.restore(); };
export const fxFire = (p, t = 0) => { const g = p.g; g.save(); g.translate(300, 985);
  const fl = (w, h, col, ph) => { const k = 1 + 0.12 * Math.sin(t * 0.9 + ph), sw = 10 * Math.sin(t * 0.7 + ph * 2); g.fillStyle = col; g.beginPath(); g.moveTo(-w, 0);
    g.bezierCurveTo(-w * 1.05, -h * 0.45 * k, -w * 0.2 + sw, -h * 0.7 * k, sw * 1.5, -h * k); g.bezierCurveTo(w * 0.2 + sw, -h * 0.7 * k, w * 1.05, -h * 0.45 * k, w, 0); g.closePath(); g.fill(); };
  fl(130, 330, "#e8452c", 0); fl(100, 260, "#f2862e", 1.3); fl(70, 190, "#ffc23a", 2.1); fl(38, 120, "#fff2a8", 3.0);
  for (let i = 0; i < 5; i++) { const y = -((t * 14 + i * 70) % 420) - 120, x = 40 * Math.sin(i * 2.1 + t * 0.2); g.fillStyle = `rgba(255,${180 + i * 10},80,${0.9 - (-y) / 600})`; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); }
  g.restore(); };
export const fxCaption = (p, words, idx) => { const g = p.g; g.save(); const size = 74; g.font = `900 ${size}px ${PF}`; g.textBaseline = "middle"; g.lineJoin = "round";
  const sp = 18, ws = words.map((w) => g.measureText(w).width); let total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  const k = total > 560 ? 560 / total : 1; g.translate(300, 500); g.scale(k, k); let x = -total / 2;
  words.forEach((w, i) => { const on = i === idx; g.lineWidth = 16; g.strokeStyle = "#120c10"; g.strokeText(w, x, on ? -6 : 0);
    g.fillStyle = on ? "#ffd84a" : "#ffffff"; g.fillText(w, x, on ? -6 : 0); x += ws[i] + sp; });
  g.restore(); };
/** motion-graphic caption: rounded dark pill, pop-in, active word yellow + bump */
export const fxCaption2 = (p, words, idx, k = 1, bump = 0) => { const g = p.g; g.save(); const size = 70; g.font = `900 ${size}px ${PF}`; g.textBaseline = "middle"; g.lineJoin = "round";
  const sp = 22, ws = words.map((w) => g.measureText(w).width), total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  const fit = total > 500 ? 500 / total : 1; g.translate(300, 500); g.scale(k * fit, k * fit);
  const bw = total + 64, bh = 118, r = 30; g.fillStyle = "rgba(14,10,22,0.78)"; g.beginPath(); g.roundRect(-bw / 2, -bh / 2, bw, bh, r); g.fill();
  g.strokeStyle = "rgba(255,216,74,0.9)"; g.lineWidth = 5; g.stroke();
  let x = -total / 2;
  words.forEach((w, i) => { const on = i === idx, s = on ? 1 + 0.14 * bump : 1; g.save(); g.translate(x + ws[i] / 2, 2); g.scale(s, s); g.textAlign = "center";
    g.lineWidth = 9; g.strokeStyle = "#0c0810"; g.strokeText(w, 0, 0); g.fillStyle = on ? "#ffd84a" : "#ffffff"; g.fillText(w, 0, 0); g.restore(); x += ws[i] + sp; });
  g.restore(); };

/* ===== Telop kit (game-show style from the Lemo-Opuscar library): flat fills, one ink outline,
   hard offset shadows, Fredoka 700, ink stroke ~14% of size under the fill, back-ease pops ===== */
const GINK = "#14101a", GF = '"Fredoka", "DejaVu Sans", sans-serif';
const gText = (g, t, x, y, size, fill, sh = 0.07) => { g.font = `700 ${size}px ${GF}`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  const d = size * sh; g.lineWidth = size * 0.28; g.strokeStyle = GINK; g.strokeText(t, x + d, y + d * 1.2); g.fillStyle = GINK; g.fillText(t, x + d, y + d * 1.2);
  g.strokeText(t, x, y); g.fillStyle = fill; g.fillText(t, x, y); };
const gPlate = (g, x, y, w, h, r, fill, sh = 12, bw = 7) => { g.fillStyle = GINK; g.beginPath(); g.roundRect(x + sh, y + sh, w, h, r); g.fill();
  g.fillStyle = fill; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); g.lineWidth = bw; g.strokeStyle = GINK; g.stroke(); };
/** dialogue telop: speaker-coloured plate, whole line in up to 2 rows, active word yellow; name sticker on the corner */
export const fxTelop = (p, rows, active, hue, name, k = 1) => { const g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.rotate(-0.012);
  const size = 54, sp = 30; g.font = `700 ${size}px ${GF}`;
  const rw = rows.map((r) => r.reduce((a, w) => a + g.measureText(w).width, 0) + sp * (r.length - 1)), W = Math.max(...rw) + 70, H = rows.length * 68 + 40;
  const fit = W > 560 ? 560 / W : 1; g.scale(fit, fit);
  gPlate(g, -W / 2, -H / 2, W, H, 26, hue);
  let n = 0; rows.forEach((r, ri) => { let x = -rw[ri] / 2, y = -H / 2 + 20 + 34 + ri * 68;
    r.forEach((w) => { const ww = g.measureText(w).width, on = n === active; g.save(); g.translate(x + ww / 2, y); if (on) g.scale(1.06, 1.06); gText(g, w, 0, 0, size, on ? "#ffe14a" : "#ffffff", 0.05); g.restore(); x += ww + sp; n++; }); });
  if (name) { g.save(); g.translate(-W / 2 + 18, -H / 2 - 6); g.rotate(-0.07); g.font = `700 30px ${GF}`; const nw = g.measureText(name).width + 34;
    gPlate(g, 0, -26, nw, 46, 14, "#fff4d6", 6, 5); g.fillStyle = GINK; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(name, 17, -3); g.restore(); }
  g.restore(); };
/** burst: star + ring + speed lines (behind judgement words / cards) */
const gBurst = (g, r, t, col) => { g.save(); g.rotate(t * 0.04); g.lineCap = "round";
  g.strokeStyle = GINK; g.lineWidth = 10; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; g.beginPath(); g.moveTo(Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05); g.lineTo(Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45); g.stroke(); }
  const star = (rr, fill) => { g.beginPath(); for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, q_ = i % 2 ? rr * 0.72 : rr; g.lineTo(Math.cos(a) * q_, Math.sin(a) * q_); } g.closePath(); g.fillStyle = fill; g.fill(); };
  g.save(); g.translate(10, 12); star(r, GINK); g.restore(); star(r, col); g.lineWidth = 7; g.strokeStyle = GINK; g.stroke();
  g.beginPath(); g.arc(0, 0, r * 0.6, 0, 7); g.lineWidth = 6; g.strokeStyle = "rgba(255,255,255,0.85)"; g.stroke(); g.restore(); };
/** judgement word: big outlined word at an angle over a burst */
export const fxJudge = (p, text, fill = "#ff5d8f", burst = "#ffe14a", t = 0) => { const g = p.g; g.save(); g.translate(300, 500);
  gBurst(g, 210, t, burst); g.rotate(-0.12); g.font = `700 150px ${GF}`; const w = g.measureText(text).width, fit = w > 540 ? 540 / w : 1; g.scale(fit, fit);
  gText(g, text, 0, 0, 150, fill, 0.06); g.restore(); };
/** corner sticker banner */
export const fxBanner = (p, text, hue = "#ffb03a", fg = "#ffffff", dot = false, t = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.05);
  g.font = `700 64px ${GF}`; const tw = g.measureText(text).width, W = tw + 80 + (dot ? 60 : 0), H = 112, fit = W > 580 ? 580 / W : 1; g.scale(fit, fit);
  gPlate(g, -W / 2, -H / 2, W, H, 30, hue, 10, 7);
  let x = 0; if (dot) { const s = 0.8 + 0.2 * Math.sin(t * 0.5); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(-W / 2 + 56, 0, 20 * s, 0, 7); g.fill(); g.lineWidth = 5; g.strokeStyle = GINK; g.stroke(); x = 30; }
  gText(g, text, x, 4, 64, fg, 0.05); g.restore(); };
/** round card: title pops glyph by glyph, optional sub line, on a burst */
export const fxRoundCard = (p, title, sub, hue = "#ffd23a", t = 99) => { const g = p.g; g.save(); g.translate(300, 500);
  gBurst(g, 250, t, "#ffffff"); g.rotate(-0.04);
  const words = title.split(" "); const rows = []; let cur = ""; words.forEach((w) => { if ((cur + " " + w).trim().length > 11 && cur) { rows.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }); rows.push(cur);
  const size = 78; g.font = `700 ${size}px ${GF}`; const mw = Math.max(...rows.map((r) => g.measureText(r).width)); g.font = `700 36px ${GF}`; const sw0 = sub ? g.measureText(sub).width + 70 : 0;
  const W = Math.max(mw + 80, sw0 + 40), H = rows.length * 88 + (sub ? 70 : 0) + 50, fit = W > 570 ? 570 / W : 1; g.scale(fit, fit); gPlate(g, -W / 2, -H / 2, W, H, 34, hue, 14, 8);
  let ci = 0; rows.forEach((r, ri) => { g.font = `700 ${size}px ${GF}`; const rw = g.measureText(r).width; let x = -rw / 2; const y = -H / 2 + 25 + 44 + ri * 88;
    for (const ch of r) { const cw = g.measureText(ch).width, k = Math.max(0, Math.min(1, (t - ci * 0.8) / 4)), s = k < 1 ? k * 1.25 : 1; if (s > 0.01) { g.save(); g.translate(x + cw / 2, y); g.scale(s, s); gText(g, ch, 0, 0, size, "#ffffff", 0.05); g.restore(); } x += cw; ci++; } });
  if (sub) { g.font = `700 36px ${GF}`; const sw = g.measureText(sub).width + 40, y = H / 2 - 50; gPlate(g, -sw / 2, y - 22, sw, 50, 16, "#14101a", 0, 0); g.fillStyle = "#ffe14a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(sub, 0, y + 3); }
  g.restore(); };

/* ---- TV bola + Zzz: "Adik Nggak Mau Tidur" ---- */
export const fxTV = (p, t = 0, goal = 0, score = "0 - 0") => { const g = p.g; g.save(); g.lineJoin = "round";
  g.fillStyle = "#2a2a30"; g.fillRect(250, 900, 100, 70); g.fillRect(170, 960, 260, 30);                       // stand
  g.fillStyle = "#1a1a20"; g.beginPath(); g.roundRect(20, 520, 560, 390, 26); g.fill(); g.lineWidth = 8; g.strokeStyle = "#0c0c10"; g.stroke();
  g.save(); g.beginPath(); g.roundRect(44, 544, 512, 342, 10); g.clip();
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#3f9a4a" : "#46a852"; g.fillRect(44 + i * 64, 544, 64, 342); }
  g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 4; g.strokeRect(70, 580, 460, 280); g.beginPath(); g.moveTo(300, 580); g.lineTo(300, 860); g.stroke(); g.beginPath(); g.arc(300, 720, 46, 0, 7); g.stroke();
  g.strokeRect(470, 660, 60, 120);
  const pl = (x, y, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill(); g.lineWidth = 3; g.strokeStyle = "#111"; g.stroke(); };
  for (let i = 0; i < 5; i++) { pl(170 + i * 60 + 30 * Math.sin(t * 0.08 + i), 620 + i * 48 + 18 * Math.cos(t * 0.07 + i * 2), "#2f6ae8"); pl(230 + i * 55 + 26 * Math.cos(t * 0.09 + i), 640 + i * 45 + 16 * Math.sin(t * 0.06 + i), "#e83a3a"); }
  const bx = goal ? 505 : 300 + 150 * Math.sin(t * 0.05), by = goal ? 720 : 720 + 80 * Math.sin(t * 0.11); g.fillStyle = "#fff"; g.beginPath(); g.arc(bx, by, 8, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 2; g.stroke();
  g.fillStyle = "rgba(10,10,20,0.85)"; g.fillRect(56, 556, 250, 46); g.fillStyle = "#fff"; g.font = '700 30px "Fredoka", sans-serif'; g.textBaseline = "middle"; g.textAlign = "left";
  g.fillText("BIRU " + score + " MERAH", 68, 580);
  if (goal && (t % 10) < 7) { g.font = '700 120px "Fredoka", sans-serif'; g.textAlign = "center"; g.lineWidth = 16; g.strokeStyle = "#14101a"; g.strokeText("GOL!", 300, 740); g.fillStyle = "#ffe14a"; g.fillText("GOL!", 300, 740); }
  g.restore(); g.fillStyle = "rgba(255,255,255,0.08)"; g.beginPath(); g.moveTo(44, 544); g.lineTo(300, 544); g.lineTo(140, 886); g.lineTo(44, 886); g.fill();
  g.restore(); };
export const fxZzz = (p, t = 0) => { const g = p.g; g.save(); g.font = '700 90px "Fredoka", sans-serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  for (let i = 0; i < 3; i++) { const k = ((t * 0.02 + i / 3) % 1), x = 260 + i * 70 + 20 * Math.sin(t * 0.1 + i), y = 700 - k * 400, s = 0.5 + 0.7 * k;
    g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = Math.min(1, (1 - k) * 2); g.lineWidth = 14; g.strokeStyle = "#14101a"; g.strokeText("Z", 0, 0); g.fillStyle = "#bfe3ff"; g.fillText("Z", 0, 0); g.restore(); }
  g.restore(); };

/* ---- Pasar props: papan harga berkain, cabai berpita ---- */
export const fxPriceBoard = (p, reveal = 0) => { const g = p.g; g.save(); g.lineJoin = "round";
  g.fillStyle = "#6a4428"; g.fillRect(270, 760, 60, 240);
  g.fillStyle = "#2a3a30"; g.strokeStyle = "#8a5a32"; g.lineWidth = 22; g.beginPath(); g.roundRect(70, 430, 460, 340, 16); g.fill(); g.stroke();
  g.fillStyle = "#f4f1e0"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = '700 54px "Fredoka", sans-serif'; g.fillText("CABAI MERAH", 300, 520);
  g.font = '700 92px "Fredoka", sans-serif'; g.fillStyle = "#ffe14a"; g.fillText("80.000", 300, 630); g.font = '700 40px "Fredoka", sans-serif'; g.fillStyle = "#f4f1e0"; g.fillText("/ KG", 300, 712);
  if (reveal < 1) { const k = reveal, y = 400 - k * 520, rot = -k * 0.5; g.save(); g.translate(300 + k * 260, y + 200); g.rotate(rot);
    g.fillStyle = "#b8282b"; g.beginPath(); g.moveTo(-250, -200); g.lineTo(250, -200); g.quadraticCurveTo(270, 40, 240, 210); g.lineTo(-240, 210); g.quadraticCurveTo(-270, 40, -250, -200); g.fill();
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 6; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 70, -195); g.quadraticCurveTo(i * 70 + 12, 0, i * 70, 205); g.stroke(); } g.restore(); }
  g.restore(); };
export const fxCabaiPita = (p) => { const g = p.g; g.save(); g.translate(300, 560); g.lineJoin = "round"; g.lineCap = "round";
  g.fillStyle = "rgba(220,235,255,0.45)"; g.strokeStyle = "#14101a"; g.lineWidth = 6; g.beginPath(); g.moveTo(-90, -40); g.quadraticCurveTo(-110, 120, -60, 160); g.lineTo(60, 160); g.quadraticCurveTo(110, 120, 90, -40); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#d42a1e"; g.beginPath(); g.moveTo(-40, 40); g.quadraticCurveTo(10, 30, 60, 120); g.quadraticCurveTo(0, 90, -45, 70); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = "#3f8a2a"; g.lineWidth = 10; g.beginPath(); g.moveTo(-42, 55); g.lineTo(-62, 40); g.stroke();
  g.fillStyle = "#ff5d8f"; g.strokeStyle = "#14101a"; g.lineWidth = 5; g.fillRect(-70, -52, 140, 20); g.strokeRect(-70, -52, 140, 20);
  for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(0, -42); g.quadraticCurveTo(sd * 60, -110, sd * 70, -50); g.quadraticCurveTo(sd * 40, -40, 0, -42); g.fill(); g.stroke(); }
  g.beginPath(); g.arc(0, -42, 14, 0, 7); g.fill(); g.stroke(); g.restore(); };

/** woven shopping basket (keranjang belanja) */
export const fxKeranjang = (p) => { const g = p.g; g.save(); g.translate(300, 600); g.lineJoin = "round";
  g.strokeStyle = "#14101a"; g.lineWidth = 9; g.beginPath(); g.moveTo(-110, -40); g.quadraticCurveTo(0, -230, 110, -40); g.stroke(); g.strokeStyle = "#b8864a"; g.lineWidth = 5; g.stroke();
  g.fillStyle = "#c8945a"; g.beginPath(); g.moveTo(-150, -40); g.lineTo(150, -40); g.lineTo(115, 150); g.lineTo(-115, 150); g.closePath(); g.fill();
  g.save(); g.clip(); g.strokeStyle = "rgba(90,50,20,0.55)"; g.lineWidth = 6; for (let y = -30; y < 160; y += 22) { g.beginPath(); g.moveTo(-160, y); g.lineTo(160, y); g.stroke(); }
  for (let x = -150; x < 160; x += 26) { g.beginPath(); g.moveTo(x, -40); g.lineTo(x * 0.78, 150); g.stroke(); } g.restore();
  g.strokeStyle = "#14101a"; g.lineWidth = 9; g.beginPath(); g.moveTo(-150, -40); g.lineTo(150, -40); g.lineTo(115, 150); g.lineTo(-115, 150); g.closePath(); g.stroke();
  g.fillStyle = "#3f9a4a"; for (const [x, y, r] of [[-60, -55, 30], [-10, -70, 26], [50, -55, 30]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.lineWidth = 6; g.stroke(); }
  g.restore(); };

/* ---- Dapur props: telur, tepung, kenop oven, asap, loyang brownies, tetesan ---- */
export const fxEgg = (p, k = 1) => { const g = p.g; g.save(); g.translate(300, 820); g.lineJoin = "round";
  g.fillStyle = "#fbfaf4"; g.strokeStyle = "#14101a"; g.lineWidth = 7; g.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = (i % 2 ? 110 : 150) * k; g.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.45); } g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#ffc23a"; g.beginPath(); g.ellipse(10, -6, 50 * k, 32 * k, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = "#f4ecd8"; for (const [x, y, r] of [[-170, -40, 30], [180, -20, 26]]) { g.beginPath(); g.moveTo(x - r, y); g.lineTo(x, y - r * 1.4); g.lineTo(x + r, y); g.closePath(); g.fill(); g.stroke(); }
  g.restore(); };
export const fxFlour = (p, t = 0) => { const g = p.g; g.save(); const k = Math.min(1, t / 8), a = Math.max(0, 1 - Math.max(0, t - 14) / 14);
  g.globalAlpha = a; for (let i = 0; i < 16; i++) { const ang = i * 2.4, r = (60 + (i * 37) % 160) * k; g.fillStyle = i % 3 ? "#ffffff" : "#efe8dc"; g.beginPath(); g.arc(300 + Math.cos(ang) * r, 420 + Math.sin(ang) * r * 0.8, (70 + (i * 13) % 60) * (0.5 + k * 0.6), 0, 7); g.fill(); }
  g.restore(); };
export const fxKnob = (p, ang = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.lineJoin = "round";
  g.fillStyle = "#b8bcc4"; g.strokeStyle = "#14101a"; g.lineWidth = 10; g.beginPath(); g.roundRect(-250, -250, 500, 500, 40); g.fill(); g.stroke();
  g.font = '700 54px "Fredoka", sans-serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#14101a";
  for (const [t, a] of [["0", -2.4], ["100", -1.2], ["200", 0], ["MAX", 1.2]]) g.fillText(t, Math.cos(a - Math.PI / 2) * 190, Math.sin(a - Math.PI / 2) * 190);
  g.fillStyle = "#c8382c"; g.fillText("MAX", Math.cos(1.2 - Math.PI / 2) * 190, Math.sin(1.2 - Math.PI / 2) * 190);
  g.rotate(ang); g.fillStyle = "#2a2a30"; g.beginPath(); g.arc(0, 0, 120, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#f4f1ea"; g.fillRect(-14, -115, 28, 80); g.restore(); };
export const fxSmoke = (p, t = 0) => { const g = p.g; g.save();
  for (let i = 0; i < 12; i++) { const k = ((t * 0.025 + i / 12) % 1), x = 300 + Math.sin(i * 1.7 + t * 0.05) * 90 * k, y = 900 - k * 850, r = 50 + k * 160;
    g.globalAlpha = Math.min(0.85, (1 - k) * 1.2); g.fillStyle = i % 2 ? "#2a2826" : "#3e3a36"; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.restore(); };
export const fxTray = (p, bite = 0, hold = 1) => { const g = p.g; g.save(); g.translate(300, 520); g.lineJoin = "round";
  if (hold) { g.fillStyle = "#b8bcc4"; g.strokeStyle = "#14101a"; g.lineWidth = 8; g.beginPath(); g.roundRect(-230, -40, 460, 120, 16); g.fill(); g.stroke(); }
  g.fillStyle = "#1e1a18"; g.strokeStyle = "#14101a"; g.lineWidth = 8; g.beginPath(); g.roundRect(-200, -70, 400, 110, 10); g.fill(); g.stroke();
  if (bite) { g.fillStyle = hold ? "#b8bcc4" : "rgba(0,0,0,0)"; g.save(); g.globalCompositeOperation = "destination-out"; for (const dx of [-30, 0, 30]) { g.beginPath(); g.arc(170 + dx * 0.2, -70 + Math.abs(dx) * 0.3, 34, 0, 7); g.fill(); } g.restore(); }
  g.strokeStyle = "#5a4a3a"; g.lineWidth = 4; for (const [x0, y0, x1, y1] of [[-150, -50, -90, 10], [-40, -60, 10, 0], [60, -30, 130, 20], [-120, 0, -60, 30]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  g.restore(); };
export const fxLeak = (p, t = 0) => { const g = p.g; g.save(); g.fillStyle = "#9fd4ee"; g.strokeStyle = "#14101a"; g.lineWidth = 5;
  for (let i = 0; i < 2; i++) { const k = ((t * 0.04 + i * 0.5) % 1), y = 80 + k * 860; g.beginPath(); g.moveTo(300, y - 34); g.quadraticCurveTo(318, y, 300, y + 14); g.quadraticCurveTo(282, y, 300, y - 34); g.fill(); g.stroke(); }
  g.restore(); };

/* ---- Live jualan: tripod + ring light, layar live HP ---- */
export const fxTripod = (p, t = 0) => { const g = p.g; g.save(); g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = "#2a2a30"; g.lineWidth = 12; for (const dx of [-150, 0, 150]) { g.beginPath(); g.moveTo(300, 700); g.lineTo(300 + dx, 995); g.stroke(); }
  g.lineWidth = 16; g.beginPath(); g.moveTo(300, 700); g.lineTo(300, 330); g.stroke();
  const gl = 0.85 + 0.15 * Math.sin(t * 0.3); g.strokeStyle = `rgba(255,248,220,${gl})`; g.lineWidth = 34; g.beginPath(); g.arc(300, 230, 150, 0, 7); g.stroke();
  g.strokeStyle = "#14101a"; g.lineWidth = 6; g.beginPath(); g.arc(300, 230, 170, 0, 7); g.stroke(); g.beginPath(); g.arc(300, 230, 130, 0, 7); g.stroke();
  g.fillStyle = "#1a1a20"; g.beginPath(); g.roundRect(240, 130, 120, 210, 18); g.fill(); g.lineWidth = 6; g.stroke();
  g.fillStyle = "#3a4a6a"; g.beginPath(); g.arc(300, 160, 12, 0, 7); g.fill(); g.restore(); };
export const fxPhoneLive = (p, mode = "live", t = 0, n = 0, hi = 0) => { const g = p.g; g.save(); g.lineJoin = "round";
  g.fillStyle = "#14101a"; g.beginPath(); g.roundRect(40, 20, 520, 960, 56); g.fill();
  g.save(); g.beginPath(); g.roundRect(62, 44, 476, 912, 40); g.clip();
  if (mode === "ceiling") { g.fillStyle = "#e8dcc4"; g.fillRect(62, 44, 476, 912); g.strokeStyle = "rgba(120,100,70,0.25)"; g.lineWidth = 3; for (let y = 120; y < 950; y += 90) { g.beginPath(); g.moveTo(62, y); g.lineTo(538, y); g.stroke(); }
    g.fillStyle = "rgba(255,240,180,0.9)"; g.beginPath(); g.arc(300, 420, 70, 0, 7); g.fill(); g.fillStyle = "rgba(255,240,180,0.25)"; g.beginPath(); g.arc(300, 420, 160, 0, 7); g.fill();
    g.fillStyle = "#6a7a5a"; g.save(); g.translate(400, 600 + Math.sin(t * 0.2) * 10); g.rotate(0.5); g.beginPath(); g.ellipse(0, 0, 26, 9, 0, 0, 7); g.fill(); g.fillRect(-46, -3, 24, 6); g.restore(); }
  else { const gr = g.createLinearGradient(0, 44, 0, 956); gr.addColorStop(0, "#3a2a40"); gr.addColorStop(1, "#1a1424"); g.fillStyle = gr; g.fillRect(62, 44, 476, 912);
    g.fillStyle = "#3f9a4a"; for (const [x, y, r] of [[230, 420, 70], [310, 380, 80], [380, 430, 66], [270, 480, 60], [350, 490, 62]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.fillStyle = "#e8742c"; g.fillRect(250, 520, 26, 120); g.fillRect(320, 530, 26, 110);
    g.font = '700 46px "Fredoka", sans-serif'; g.textAlign = "center"; g.fillStyle = "#ffe14a"; g.fillText("SAYUR SEGAR!", 300, 700); }
  // top bar: LIVE + viewers
  g.fillStyle = "#e8344a"; g.beginPath(); g.roundRect(84, 70, 140, 56, 14); g.fill(); g.fillStyle = "#fff"; g.font = '700 36px "Fredoka", sans-serif'; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("LIVE", 120, 99);
  g.fillStyle = "#fff"; g.beginPath(); g.arc(106, 99, 7, 0, 7); g.fill();
  g.fillStyle = "rgba(0,0,0,0.45)"; g.beginPath(); g.roundRect(236, 70, 150, 56, 14); g.fill(); g.fillStyle = "#fff"; g.fillText("1 nonton", 252, 99);
  // comments
  const C = mode === "ceiling" ? [["cicak_rumah", "ckck ckck"]] : [["pocong_lowbat", "halo bu"], ["pocong_lowbat", "BORONG SEMUA, BU"]].slice(0, n);
  C.forEach(([u, m], i) => { const y = 780 + i * 82, on = hi && i === C.length - 1; g.fillStyle = on ? "rgba(255,225,74,0.95)" : "rgba(0,0,0,0.5)"; g.beginPath(); g.roundRect(84, y - 34, 430, 68, 22); g.fill();
    g.font = '700 28px "Fredoka", sans-serif'; g.fillStyle = on ? "#14101a" : "#bfe3ff"; g.fillText(u, 104, y - 10); g.font = '700 32px "Fredoka", sans-serif'; g.fillStyle = on ? "#14101a" : "#fff"; g.fillText(m, 104, y + 18); });
  g.restore(); g.strokeStyle = "#2a2a34"; g.lineWidth = 10; g.beginPath(); g.roundRect(40, 20, 520, 960, 56); g.stroke();
  g.restore(); };

/** scooter, side view (facing right). wheels sit on y~960 */
export const fxSkuter = (p, col = "#2f7ac8") => {
  for (const x of [150, 450]) { p.ell(x, 900, 62, 62, "#22201e", 10); p.ell(x, 900, 26, 26, "#c9cfd6", 6); }
  p.poly([[120, 860], [130, 760], [250, 730], [380, 760], [470, 700], [500, 760], [520, 860], [400, 870], [360, 820], [220, 820], [200, 870]], col, 9);
  p.poly([[150, 735], [330, 735], [340, 700], [160, 690]], "#2a2a32", 8);        // seat
  p.stroke([[470, 700], [430, 560]], 16, "#3a3a44"); p.stroke([[390, 560], [470, 560]], 14, "#2a2a32"); // stem + handlebar
  p.ell(500, 640, 26, 20, "#ffe08a", 6); p.poly([[60, 790], [130, 790], [130, 820], [60, 830]], "#d8322f", 6); // lamp + tail
  p.stroke([[240, 780], [360, 790]], 6, "#ffffff88");
};
/** tiang listrik + kabel */
export const fxTiang = (p) => {
  p.poly([[275, 990], [285, 20], [315, 20], [325, 990]], "#9aa2aa", 9);
  p.poly([[170, 120], [430, 120], [430, 150], [170, 150]], "#7a828a", 8);
  for (const x of [190, 300, 410]) p.ell(x, 112, 12, 16, "#f4f1ea", 5);
  p.stroke([[0, 160], [190, 118]], 4, "#2a2a32"); p.stroke([[410, 118], [600, 170]], 4, "#2a2a32");
  p.poly([[262, 560], [338, 560], [338, 640], [262, 640]], "#e8e2d0", 6); p.stroke([[270, 590], [330, 590]], 6, "#c0302c");
};
/** gerobak gorengan */
export const fxGerobak = (p, label = "GORENGAN") => {
  for (const x of [140, 460]) p.ell(x, 930, 48, 48, "#3a2a20", 9);
  p.poly([[60, 560], [540, 560], [540, 900], [60, 900]], "#c86a2a", 10);
  p.poly([[80, 380], [520, 380], [520, 560], [80, 560]], "#d8eef4", 8);
  const gx = [[130, 520], [200, 525], [270, 518], [340, 524], [410, 520], [470, 526], [170, 480], [250, 485], [330, 480], [410, 486]];
  for (const [x, y] of gx) p.ell(x, y, 36, 22, x % 3 ? "#e0a040" : "#c8862a", 4);
  p.poly([[40, 340], [560, 340], [560, 380], [40, 380]], "#3a8f6a", 8);
  ptxt(p.g, label, 300, 740, 64, "#ffe14a", 10);
};

/** lampu jalan */
export const fxLampuJalan = (p) => {
  p.poly([[285, 990], [292, 120], [308, 120], [315, 990]], "#5a626a", 8);
  p.stroke([[300, 130], [420, 100]], 14, "#5a626a"); p.poly([[380, 90], [470, 90], [455, 125], [395, 125]], "#3a3f48", 6);
  p.ell(425, 128, 30, 10, "#fff2b0", 0);
};

/** kardus paket polos dengan label (tanpa merek) */
export const fxKardus = (p, label = "", big = 0) => {
  const h = big ? 120 : 0;
  p.poly([[110, 420 - h], [490, 420 - h], [490, 900], [110, 900]], "#c8925a", 10);
  p.poly([[110, 420 - h], [190, 340 - h], [570, 340 - h], [490, 420 - h]], "#d9a46a", 10); p.poly([[490, 420 - h], [570, 340 - h], [570, 820], [490, 900]], "#b07a48", 10);
  p.band([[300, 420 - h], [300, 900]], "#e8d4a0", 44, 0);
  if (label) { p.poly(rrect(150, 600, 450, 720, 14), "#ffffff", 6); ptxt(p.g, label, 300, 662, label.length > 6 ? 46 : 60, "#c0302c"); }
};

/** koper beroda */
export const fxKoper = (p, col = "#c0302c") => {
  p.poly(rrect(150, 300, 450, 900, 30), col, 10); for (const x of [230, 300, 370]) p.stroke([[x, 330], [x, 870]], 6, "#00000033");
  p.poly(rrect(250, 220, 350, 300, 14), null, 10); p.stroke([[262, 300], [262, 232], [338, 232], [338, 300]], 12, "#2a2e36");
  for (const x of [200, 400]) p.ell(x, 925, 26, 26, "#22201e", 6);
};
/** nampan pemeriksaan berisi tumpukan jaket (n = 0..7) */
export const fxNampan = (p, n = 0) => {
  const C = ["#d8322f", "#f4f1ea", "#e8742c", "#8b5cf6", "#2f9a5a", "#f2c14e", "#3a7ad8"];
  for (let i = 0; i < n; i++) { const y = 820 - i * 46, w = 190 - (i % 2) * 18; p.poly([[300 - w, y + 30], [300 - w + 20, y - 18], [300 + w - 20, y - 22], [300 + w, y + 26]], C[i % 7], 7); p.stroke([[300 - w + 40, y], [300 + w - 50, y + 4]], 4, "#00000033"); }
  p.poly([[60, 830], [540, 830], [510, 900], [90, 900]], "#6a7480", 9);
};

/** meja kelapa muda */
export const fxKelapa = (p) => {
  p.poly([[60, 600], [540, 600], [540, 640], [60, 640]], "#9a6a42", 9);
  for (const x of [100, 500]) p.poly([[x - 12, 640], [x + 12, 640], [x + 12, 960], [x - 12, 960]], "#7a5434", 7);
  for (const [x, y, r] of [[150, 545, 62], [260, 540, 66], [370, 545, 62], [470, 548, 58], [210, 470, 58], [320, 468, 60], [420, 475, 56]]) { p.ell(x, y, r, r * 0.92, "#5aa04a", 7); p.ell(x - r * 0.3, y - r * 0.35, r * 0.25, r * 0.15, "#9ad070", 0); }
  p.poly(rrect(170, 300, 430, 390, 14), "#ffffff", 6); ptxt(p.g, "ES KELAPA", 300, 345, 46, "#2f9a5a");
};

// --- tombol YouTube generik + tangan + banner channel (dipulihkan untuk akhiran) ---
export const fxYtBtn = (p, kind, on = 0, t = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.02);
  const W = 520, H = 130, x = -W / 2, y = -H / 2;
  if (kind === "sub") { gPlate(g, x, y, W, H, 65, on ? "#3a3a44" : "#e8282e", 12, 8); iconBell(g, x + 78, 2, 1.0, on && t % 8 < 5);
    gText(g, on ? "DISUBSCRIBE" : "SUBSCRIBE", 52, 4, on ? 48 : 56, "#ffffff", 0.05); }
  else if (kind === "like") { gPlate(g, x, y, W, H, 65, on ? "#2f6ae8" : "#ffffff", 12, 8); iconThumb(g, x + 80, 0, 1.0, on ? "#ffe14a" : "#ffffff");
    gText(g, on ? "LIKE +1" : "LIKE", 40, 4, 62, on ? "#ffffff" : "#ffffff", 0.05); }
  else { gPlate(g, x, y, W, H, 65, on ? "#2f9a5a" : "#ffffff", 12, 8); iconChat(g, x + 80, 0, 1.0, "#ffffff", on ? 1 + (Math.floor(t / 4) % 3) : 0);
    gText(g, "KOMEN", 40, 4, 62, "#ffffff", 0.05); }
  g.restore(); };
export const fxHand = (p, press = 0) => { const g = p.g; g.save(); g.translate(300, 500); const s = 1 - 0.15 * press; g.scale(s, s); g.lineJoin = "round";
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 120); g.lineTo(30, 92); g.lineTo(52, 140); g.lineTo(72, 130); g.lineTo(50, 84); g.lineTo(90, 84); g.closePath();
  g.fillStyle = "#ffffff"; g.fill(); g.lineWidth = 9; g.strokeStyle = GINK; g.stroke();
  if (press) { g.strokeStyle = "#ffe14a"; g.lineWidth = 7; for (let i = 0; i < 6; i++) { const a = -2.4 + i * 0.5; g.beginPath(); g.moveTo(Math.cos(a) * 30, Math.sin(a) * 30); g.lineTo(Math.cos(a) * 58, Math.sin(a) * 58); g.stroke(); } }
  g.restore(); };
/** channel banner: big name plate + "YouTube: @handle" pill (no platform logo) */
export const fxChannel = (p, name, handle, t = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.025);
  g.font = `700 92px ${GF}`; const tw = g.measureText(name).width, W = Math.min(580, tw + 90), H = 210, fit = tw + 90 > 580 ? 580 / (tw + 90) : 1;
  gPlate(g, -W / 2, -H / 2, W, H, 40, "#e8282e", 14, 8);
  g.save(); g.beginPath(); g.roundRect(-W / 2, -H / 2, W, H, 40); g.clip(); g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 22;
  for (let x = -W; x < W; x += 60) { g.beginPath(); g.moveTo(x + (t * 1.5) % 60, -H / 2); g.lineTo(x + (t * 1.5) % 60 + 120, H / 2); g.stroke(); } g.restore();
  g.save(); g.scale(fit, fit); gText(g, name, 0, -26, 92, "#ffffff", 0.05); g.restore();
  g.font = `700 40px ${GF}`; const hw = g.measureText(handle).width + 60; gPlate(g, -hw / 2, 30, hw, 62, 31, "#14101a", 0, 0);
  g.fillStyle = "#ffe14a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(handle, 0, 63);
  g.restore(); };
const iconBell = (g, x, y, s, ring) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#ffe14a"; g.strokeStyle = GINK; g.lineWidth = 6; g.lineJoin = "round";
  g.beginPath(); g.moveTo(-26, 18); g.quadraticCurveTo(-24, -26, 0, -30); g.quadraticCurveTo(24, -26, 26, 18); g.lineTo(32, 26); g.lineTo(-32, 26); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.arc(0, 32, 8, 0, 7); g.fill(); g.stroke();
  if (ring) { g.lineWidth = 6; g.strokeStyle = "#ffffff"; for (const sd of [-1, 1]) { g.beginPath(); g.arc(0, -4, 44, sd > 0 ? -0.5 : Math.PI - 0.1, sd > 0 ? 0.1 : Math.PI + 0.5); g.stroke(); } }
  g.restore(); };
const iconChat = (g, x, y, s, fill, dots) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = fill; g.strokeStyle = GINK; g.lineWidth = 6; g.lineJoin = "round";
  g.beginPath(); g.roundRect(-34, -28, 68, 48, 14); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-14, 18); g.lineTo(-22, 34); g.lineTo(2, 20); g.fill(); g.stroke();
  if (dots) { g.fillStyle = GINK; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-16 + i * 16, -4 - (dots === i + 1 ? 6 : 0), 6, 0, 7); g.fill(); } }
  g.restore(); };
const iconThumb = (g, x, y, s, fill) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = fill; g.strokeStyle = GINK; g.lineWidth = 6; g.lineJoin = "round";
  g.beginPath(); g.roundRect(-34, -6, 16, 40, 4); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-14, -4); g.lineTo(0, -30); g.quadraticCurveTo(12, -34, 10, -16); g.lineTo(6, -6); g.lineTo(28, -6); g.quadraticCurveTo(38, -4, 34, 8); g.lineTo(28, 30); g.quadraticCurveTo(26, 36, 16, 36); g.lineTo(-14, 36); g.closePath(); g.fill(); g.stroke();
  g.restore(); };
// ---- HP gamer (layar penuh) & kulkas: Asep Maksain Game Berat ----
export const fxGameHP = (p, mode = "load", t = 0, k = 0) => { const g = p.g; g.save(); g.lineJoin = "round";
  g.fillStyle = "#14101a"; g.beginPath(); g.roundRect(40, 20, 520, 960, 56); g.fill();
  g.save(); g.beginPath(); g.roundRect(62, 44, 476, 912, 40); g.clip();
  const txt = (s, x, y, size, col, al = "center") => { g.font = `700 ${size}px "Fredoka", "DejaVu Sans", sans-serif`; g.textAlign = al; g.textBaseline = "middle"; g.lineWidth = size * 0.16; g.strokeStyle = "#14101a"; g.strokeText(s, x, y); g.fillStyle = col; g.fillText(s, x, y); };
  if (mode === "load" || mode === "dl" || mode === "lag") {
    const gr = g.createLinearGradient(0, 44, 0, 956); gr.addColorStop(0, "#ff8a3a"); gr.addColorStop(0.55, "#c0306a"); gr.addColorStop(1, "#2a1440"); g.fillStyle = gr; g.fillRect(62, 44, 476, 912);
    g.fillStyle = "#1a1030"; for (let i = 0; i < 8; i++) { const h = 180 + (i * 97) % 260; g.fillRect(62 + i * 62, 760 - h, 54, h + 200); }
    g.fillStyle = "#ffe14a"; for (let i = 0; i < 8; i++) for (let j = 0; j < 5; j++) if ((i * 7 + j * 3) % 4) g.fillRect(74 + i * 62 + (j % 2) * 22, 620 - j * 34 - (i * 97) % 100, 12, 14);
    g.fillStyle = "#2a2430"; g.fillRect(62, 790, 476, 170); g.fillStyle = "#f4f1ea"; for (let x = 70; x < 540; x += 90) g.fillRect(x, 868, 50, 10);
    if (mode === "lag") { const step = Math.floor(t / 28), cx = 120 + (step * 70) % 360; g.fillStyle = "#e8344a"; g.beginPath(); g.roundRect(cx - 60, 820, 120, 50, 12); g.fill(); g.fillStyle = "#14101a"; g.beginPath(); g.arc(cx - 32, 872, 14, 0, 7); g.arc(cx + 32, 872, 14, 0, 7); g.fill();
      txt("FPS: 1", 90, 90, 40, "#39ff6a", "left"); if (Math.floor(t / 14) % 2) txt("MEMUAT...", 300, 400, 54, "#ffffff"); }
    else { txt("GTB 6", 300, 230, 150, "#ffe14a"); txt("GAME TERGEDE BANGET", 300, 330, 34, "#ffffff");
      const prog = mode === "load" ? 0.01 : k; g.fillStyle = "#14101a"; g.beginPath(); g.roundRect(100, 700, 400, 54, 27); g.fill(); g.fillStyle = mode === "dl" ? "#ff5d3a" : "#39ff6a"; g.beginPath(); g.roundRect(106, 706, Math.max(40, 388 * prog), 42, 21); g.fill();
      txt(mode === "load" ? "LOADING 1%" : `DOWNLOAD ${Math.round(150 * prog)} / 150 GB`, 300, 650, 40, "#ffffff"); }
    if (mode === "dl" || mode === "lag") { g.fillStyle = `rgba(255,60,20,${0.12 + 0.12 * Math.sin(t * 0.3)})`; g.fillRect(62, 44, 476, 912); }
  } else if (mode === "full") {
    g.fillStyle = "#eef1f6"; g.fillRect(62, 44, 476, 912); txt("MEMORI PENUH!", 300, 140, 56, "#e8344a");
    const items = ["foto_mantan.jpg", "aplikasi diet", "foto_nikahan_bapak_ibu.jpg"];
    items.forEach((s, i) => { const y = 300 + i * 170, del = k > i; g.fillStyle = del ? "#ffd6dc" : "#ffffff"; g.strokeStyle = "#14101a"; g.lineWidth = 5; g.beginPath(); g.roundRect(90, y - 60, 420, 120, 20); g.fill(); g.stroke();
      g.font = `700 ${i === 2 ? 26 : 34}px "Fredoka", "DejaVu Sans", sans-serif`; g.textAlign = "left"; g.fillStyle = "#14101a"; g.fillText(s, 120, y + 10);
      if (del) { g.strokeStyle = "#e8344a"; g.lineWidth = 8; g.beginPath(); g.moveTo(110, y); g.lineTo(490, y); g.stroke(); txt("DIHAPUS", 420, y - 40, 26, "#e8344a"); } });
  } else if (mode === "snake") {
    g.fillStyle = "#9bbc0f"; g.fillRect(62, 44, 476, 912); g.fillStyle = "#306230"; const cell = 36, n = 6 + Math.floor(t / 12) % 5;
    for (let i = 0; i < n; i++) { const s = (Math.floor(t / 4) - i), x = 120 + ((s * cell) % 360 + 360) % 360, y = 420 + Math.floor(((s * cell) / 360)) % 3 * cell; g.fillRect(x, y, cell - 4, cell - 4); }
    g.fillRect(400, 300, cell - 4, cell - 4); g.font = '700 44px "DejaVu Sans Mono", monospace'; g.textAlign = "center"; g.fillText("SKOR: 0" + Math.floor(t / 30), 300, 140);
  }
  g.restore(); g.restore(); };
export const fxKulkas = (p, open = 0, smell = 0, t = 0) => { const g = p.g; g.save(); g.lineJoin = "round"; g.strokeStyle = "#14101a"; g.lineWidth = 9;
  g.fillStyle = "#e8eef2"; g.beginPath(); g.roundRect(160, 140, 280, 845, 30); g.fill(); g.stroke();
  if (open) { g.fillStyle = "#cfe8f6"; g.beginPath(); g.roundRect(176, 400, 248, 570, 14); g.fill(); g.stroke(); g.lineWidth = 6; for (const y of [560, 720, 870]) { g.beginPath(); g.moveTo(176, y); g.lineTo(424, y); g.stroke(); }
    g.fillStyle = "#c8a070"; for (const [x, y] of [[230, 540], [330, 540], [260, 700]]) { g.beginPath(); g.ellipse(x, y, 42, 14, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x + 40, y); g.lineTo(x + 62, y - 14); g.lineTo(x + 62, y + 14); g.closePath(); g.fill(); g.stroke(); }
    g.fillStyle = "#2b2f3a"; g.beginPath(); g.roundRect(330, 650, 40, 66, 8); g.fill(); g.stroke();
    g.fillStyle = "#dfe6ea"; g.lineWidth = 9; g.beginPath(); g.moveTo(160, 400); g.lineTo(70, 430); g.lineTo(70, 960); g.lineTo(160, 985); g.closePath(); g.fill(); g.stroke(); }
  else { g.beginPath(); g.moveTo(160, 400); g.lineTo(440, 400); g.stroke(); g.fillStyle = "#9aa4ae"; g.beginPath(); g.roundRect(392, 450, 18, 140, 8); g.fill(); g.stroke(); }
  g.fillStyle = "#9aa4ae"; g.beginPath(); g.roundRect(392, 220, 18, 120, 8); g.fill(); g.stroke();
  if (smell) { g.strokeStyle = "#7ac43a"; g.lineWidth = 8; g.lineCap = "round"; for (let i = 0; i < 3; i++) { g.beginPath(); for (let y = 0; y < 220; y += 10) { const x = 230 + i * 70 + Math.sin(y * 0.06 + t * 0.3 + i) * 16; y ? g.lineTo(x, 120 - y) : g.moveTo(x, 120 - y); } g.stroke(); } }
  g.restore(); };
