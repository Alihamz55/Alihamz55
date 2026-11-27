// Kotak Kocak #1: Bobi Ngaku Pro. Butuh anim-lib.js.
const TEXT = {
  1: 'Kenalin. Aku Bobi. Pemain paling *pro* di Dunia Kotak.',
  2: 'Bob, itu *area tutorial.* Buat yang baru main.',
  3: 'Santai. Aku udah main *tiga tahun.*',
  4: 'Serius, Bob? *Tiga tahun?*',
  5: 'Tiga tahun... *nonton orang main.*',
  6: 'Tantangan hari ini: tangga. *Cuma tiga.*',
  7: 'Lompat... mendarat... *gaya!*',
  9: 'Tangga pertama. *Langsung tamat.*',
  10: 'Itu baru *tangga pertama,* Bob.',
  11: 'Ini teknik pro. Namanya, *tiarap strategis.*',
  12: 'Hei! *Dilarang tiduran* di sini!',
  13: 'Terus, datanglah *musuh terbesarku.*',
  14: 'Ayam. *Seekor ayam.*',
  15: 'Pasti dibantu *orang dalam!*',
  16: 'Mending kamu *nonton lagi* aja, Bob.',
  17: 'Oke. Sampai jumpa... *tiga tahun lagi!*',
};

// ---------- adegan (satu per kalimat) ----------
const SHOT = {
  1(t) { // Bobi masuk, pose "pemain pro"
    const walk = t < 1, x = walk ? lerp(-220, BOBI.x, eOut(t)) : BOBI.x, sw = Math.sin(t * 14);
    const arms = walk ? [.15 + .5 * sw, .15 - .5 * sw] : [.25, .15 - 2.75 * eBack((t - 1) / .35)];
    cam(1 + .02 * t, 540, 960, 0, () => { world();
      C('bobi', x, BOBI.y - (walk ? Math.abs(sw) * 24 : 0), BOBI.s, { arms, face: FACE.pede, rot: walk ? sw * .04 : 0 });
      C('kubi', KUBI.x, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); piko(480, 1500, .75, -1);
      if (t > 1.2) sparkle(x, 780, t);
    });
    narrTag(150); pop('PEMAIN PRO?!', 320, 120, '#ffd23f', t - 1.1, -.04);
  },
  2(t) { // Neng Kubi menegur
    cam(1.5 + .02 * t, 780, 1010, 0, () => { world(); C('bobi', BOBI.x, BOBI.y, BOBI.s, { face: FACE.pede });
      C('kubi', KUBI.x, KUBI.y, KUBI.s, { face: FACE.kubiSinis, arms: [.15, .15 - .6 * lipOf('kubi')] }); piko(480, 1500, .75, -1); });
  },
  3(t) { // Bobi membusungkan dada
    const puff = 1 + .05 * Math.sin(t * 5);
    cam(1.5 + .03 * t, 310, 1010, 0, () => { world();
      C('bobi', BOBI.x, BOBI.y, BOBI.s, { face: t > 1.3 ? { eye: 'star', brow: [10, 10], mouth: 'grin' } : FACE.pede, arms: [.55, .55], sq: puff });
      C('kubi', KUBI.x, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); });
    narrTag(150); pop('3 TAHUN!', 320, 140, '#ffd23f', t - 1.3, .05);
  },
  4(t) { // Kubi curiga, Bobi mulai panik
    cam(1.18, 560, 1060, 0, () => { world(); C('bobi', BOBI.x, BOBI.y, BOBI.s, { face: FACE.panik });
      C('kubi', KUBI.x, KUBI.y, KUBI.s, { face: FACE.kubiCuriga, arms: [.15, -.7] }); piko(480, 1500, .75, -1); });
  },
  5(t) { // close-up: "nonton orang main"
    const z = 1.25 - .25 * eOut(t / .2);
    sky('#ffb44a', '#ff7a2f'); g.save(); g.translate(540, 900); g.rotate(t * .25); g.translate(-540, -900);
    speed(540, 900, 'rgba(255,255,255,.28)', 'rgba(255,255,255,0)'); g.restore();
    cam(z, 540, 1500, t < .3 ? 14 : 0, () => { g.save(); g.translate(540, 1500); g.scale(1.75, 1.75); g.translate(-540, -1500);
      C('bobi', 540, 1820, 1, { face: FACE.kaget, arms: [.4, .4] }); g.restore(); });
    narrTag(150); pop('NONTON DOANG.', 330, 118, '#ffffff', t - .05); star(180, 430, 46, '#ffd23f'); star(910, 250, 38, '#ffd23f');
  },
  6(t) { // kamera geser ke tangga
    cam(1.2, lerp(420, 800, eInOut(t / 2.5)), 1010, 0, () => { world();
      C('bobi', 560, BOBI.y, BOBI.s, { face: { look: 16, brow: [-10, 10], mouth: 'grin' }, arms: [.25, .25] });
      C('kubi', 1040, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); piko(420, 1500, .75, 1); });
    narrTag(150); pop('CUMA 3 TANGGA', 320, 112, '#ffd23f', t - 1.6, -.03);
  },
  7(t) { // "Lompat... mendarat... gaya!" lalu lompat
    const jt = clamp((t - 2.5) / .6), x = lerp(560, 690, jt), y = BOBI.y - Math.sin(jt * Math.PI) * 260;
    const crouch = t < 2.5 ? 1 - .12 * Math.sin(clamp(t / 2.5) * Math.PI) : 1;
    cam(1.25, 660, 1000, 0, () => { world();
      C('bobi', x, y, BOBI.s, { face: t < 2.5 ? FACE.pede : { eye: 'star', brow: [10, 10], mouth: 'open' }, arms: jt > 0 ? [-2.6, -2.6] : [.5, .5], sq: crouch, rot: jt * .25 });
      C('kubi', 1040, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); });
  },
  bruk(t) { // jatuh tengkurap
    cam(1.25, 660, 1000, t < .4 ? 18 * (1 - t / .4) : 0, () => { world(); bobiLying(745, FACE.pingsan);
      C('kubi', 1040, KUBI.y, KUBI.s, { face: FACE.kaget }); dust(560, GY + 10, t); });
    pop('BRUK!', 320, 170, '#ffffff', t, .06);
  },
  9(t) { // "Langsung tamat."
    cam(1.35, 470, 1150, 0, () => { world(); bobiLying(745, FACE.pingsan); C('kubi', 1040, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); });
    narrTag(150); pop('TAMAT.', 320, 150, '#c9ced6', t - 1.1);
  },
  10(t) { // Kubi mendekat
    const kx = lerp(1040, 930, eOut(t / .8));
    cam(1.2, 640, 1060, 0, () => { world(); bobiLying(745, FACE.pingsan);
      C('kubi', kx, KUBI.y - (t < .8 ? Math.abs(Math.sin(t * 14)) * 16 : 0), KUBI.s, { face: { look: -20, brow: [-6, 6], mouth: 'smirk', blush: true } }); });
  },
  11(t) { // "tiarap strategis" (sambil tetap tiarap)
    cam(1.6, 300, 1240, 0, () => { world(); bobiLying(745, { look: 0, brow: [-10, 10], mouth: 'grin' }); C('kubi', 930, KUBI.y, KUBI.s, { face: FACE.kubiSinis }); });
    pop('TIARAP STRATEGIS', 320, 104, '#ffd23f', t - 1.9, -.03); if (t > 2) sparkle(540, 330, t, 6, 420);
  },
  priit(t) { // Om Blok datang
    const bx = lerp(1350, 880, eOut(t / .45));
    cam(1.05, 600, 1000, 6, () => { world(); bobiLying(745, FACE.kaget); C('kubi', lerp(930, 1060, eOut(t / .45)), KUBI.y, KUBI.s, { face: FACE.kaget });
      C('blok', bx, 1420, 1, { face: FACE.galak, arms: [.2, 1.9], prop: 'whistle' }); });
    pop('PRIIIT!', 320, 160, '#ffffff', t, .05);
  },
  12(t) { // Om Blok menegur
    cam(1.35, 830, 980, 0, () => { world(); bobiLying(745, FACE.kaget); C('kubi', 1060, KUBI.y, KUBI.s, { face: FACE.kubiSinis });
      C('blok', 880, 1420, 1, { face: FACE.galak, arms: [.2, -1.0 - .8 * lipOf('blok')], prop: 'whistle' }); });
  },
  13(t) { // "musuh terbesarku" (dramatis)
    const z = 1.1 + .12 * t / 3.7;
    cam(z, 700, 1000, 0, () => { world(); bobiLying(745, FACE.kaget);
      g.save(); g.globalAlpha = .95; g.filter = 'brightness(0)'; piko(STEP(1).x, STEP(1).y, 1.7, -1); g.restore(); });
    darken(.5); narrTag(150); pop('MUSUH TERBESARKU...', 320, 96, '#ff6b6b', t - .4);
  },
  14(t) { // Piko melompat 3 tangga dengan santai
    let px = 520, py = GY - 100;
    [0, 1, 2].forEach(i => { const ht = clamp((t - .3 - i * .55) / .45); if (ht <= 0) return;
      const from = i ? STEP(i - 1) : { x: 520, y: GY - 100 }, to = STEP(i);
      px = lerp(from.x, to.x, ht); py = lerp(from.y, to.y, ht) - Math.sin(ht * Math.PI) * 90; });
    cam(1.0, 540, 960, 0, () => { world(); bobiLying(745, FACE.kaget);
      piko(px, py, .9, -1); if (t > 2.1) sparkle(px, py - 120, t, 5, 110); });
    narrTag(150); if (t < 2) pop('AYAM.', 320, 150, '#ffffff', t - .05); else pop('PIKO NAIK LEVEL!', 320, 104, '#7dff6b', t - 2);
  },
  15(t) { // close-up Bobi berbisik
    cam(1.4, 540, 900, 0, () => { world(); }); darken(.25);
    g.save(); g.translate(540, 1500); g.scale(1.9, 1.9); g.translate(-540, -1500);
    C('bobi', 540, 1860, 1, { face: FACE.curiga, arms: [.3, -1.3 - .15 * Math.sin(t * 6)] }); g.restore();
    pop('ORANG DALAM!', 320, 120, '#ffd23f', t - .8, .04);
  },
  16(t) { // Om Blok menasihati
    cam(1.15, 660, 1020, 0, () => { world(); C('bobi', 470, BOBI.y, BOBI.s, { face: FACE.sedih });
      C('blok', 860, 1420, 1, { face: { look: -12, brow: [-6, -6], mouth: 'flat' }, arms: [.2, .2 - .6 * lipOf('blok')] }); piko(STEP(2).x, STEP(2).y, .9, -1); });
  },
  17(t) { // penutup: hormat
    cam(1.25, 520, 1000, 0, () => { world(); C('bobi', 470, BOBI.y, BOBI.s, { face: FACE.senang, arms: [.2, lerp(.2, -2.5, eBack(t / .4)) + (t > .4 ? .35 * Math.sin(t * 9) : 0)] });
      C('blok', 860, 1420, 1, { face: { eye: 'happy', brow: [0, 0], mouth: 'grin' } }); piko(STEP(2).x, STEP(2).y, .9, -1); });
    narrTag(150); pop('SAMPAI JUMPA!', 320, 124, '#ffd23f', t - .2);
    if (t > 2.2) { const k = eBack((t - 2.2) / .3); g.save(); g.translate(540, 560); g.scale(k, k); g.translate(-540, -560);
      rr(190, 470, 700, 180, 40); fs('#ff4d8d'); bigWord('KOTAK KOCAK', 560, 92, '#ffffff'); g.restore(); }
  },
};

