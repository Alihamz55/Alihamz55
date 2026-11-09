"""Miko - kucing kecil bermain piano sambil bernyanyi di bawah gerimis.

Pemakaian: python3 render_miko.py <lagu.mp3> <output.mp4> [detik_maks]
"""
import math, subprocess, sys
import numpy as np, skia
from scipy.signal import stft, find_peaks
from scipy.ndimage import gaussian_filter1d

AUD, OUT = sys.argv[1], sys.argv[2]
LIMIT = float(sys.argv[3]) if len(sys.argv) > 3 else None
STILL = len(sys.argv) > 4  # simpan beberapa frame PNG untuk dicek
FPS, W, H = 30, 1080, 1920
rng = np.random.default_rng(11)


def C(h, a=255):
    h = h.lstrip('#')
    return skia.Color(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), int(a))


def P(color=None, stroke=None, cap=True, blur=None, shader=None, blend=None, alpha=None):
    p = skia.Paint(AntiAlias=True)
    if color is not None: p.setColor(color)
    if shader is not None: p.setShader(shader)
    if stroke:
        p.setStyle(skia.Paint.kStroke_Style); p.setStrokeWidth(stroke)
        if cap: p.setStrokeCap(skia.Paint.kRound_Cap); p.setStrokeJoin(skia.Paint.kRound_Join)
    if blur: p.setMaskFilter(skia.MaskFilter.MakeBlur(skia.kNormal_BlurStyle, blur))
    if blend is not None: p.setBlendMode(blend)
    if alpha is not None: p.setAlphaf(alpha)
    return p


def lin(x0, y0, x1, y1, cols, pos=None):
    return skia.GradientShader.MakeLinear([skia.Point(x0, y0), skia.Point(x1, y1)], cols, pos)


def rad(cx, cy, r, cols, pos=None):
    return skia.GradientShader.MakeRadial(skia.Point(cx, cy), r, cols, pos)


def oval(cx, cy, rx, ry):
    return skia.Rect.MakeLTRB(cx - rx, cy - ry, cx + rx, cy + ry)


# ======================= ANALISIS AUDIO =======================
SR = 22050
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', AUD, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     capture_output=True).stdout
a = np.frombuffer(raw, np.float32)
dur = len(a) / SR
if LIMIT: dur = min(dur, LIMIT)
N = int(dur * FPS)
hop = SR // FPS
f, _, Z = stft(a, SR, nperseg=4096, noverlap=4096 - hop)
M = np.abs(Z)


def band(lo, hi): return M[(f >= lo) & (f < hi)].sum(0)


tot = M.sum(0) + 1e-6
voc = gaussian_filter1d(band(250, 3500), 1.0)
lo_, hi_ = np.percentile(voc, 30), np.percentile(voc, 97)
voc = np.clip((voc - lo_) / (hi_ - lo_), 0, 1)
env = np.zeros_like(voc); v = 0
for i, x in enumerate(voc):
    v += (x - v) * (0.6 if x > v else 0.28); env[i] = v
ratio = gaussian_filter1d(band(1000, 4000) / tot, 4)
env = env * np.clip((ratio - 0.2) / 0.1, 0, 1)
env = np.where(env < 0.1, 0, env)
sel = (f >= 300) & (f < 3000)
cent = gaussian_filter1d((M[sel] * f[sel, None]).sum(0) / (M[sel].sum(0) + 1e-6), 2)
cent = np.clip((cent - np.percentile(cent, 10)) / (np.percentile(cent, 90) - np.percentile(cent, 10) + 1e-6), 0, 1)
loud = gaussian_filter1d(tot, 20); loud /= loud.max()
emo = gaussian_filter1d(tot, 90); emo = (emo - emo.min()) / (emo.max() - emo.min() + 1e-6)
L = np.log1p(M)
def onsets(lo, hi, dist):
    s = (f >= lo) & (f < hi)
    fl = np.maximum(L[s, 1:] - L[s, :-1], 0).sum(0)
    fl = gaussian_filter1d(np.concatenate([[0], fl]), 0.7)
    pk, _ = find_peaks(fl, height=np.percentile(fl, 72), distance=dist)
    return set(int(p) for p in pk)
on_lo, on_hi = onsets(55, 300, 7), onsets(300, 2000, 5)
WHITE = {0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6}
def key_for(i, lo, hi, base, span):
    s = (f >= lo) & (f < hi)
    fr = f[s][np.argmax(M[s, min(i, M.shape[1] - 1)])]
    midi = 69 + 12 * math.log2(max(fr, 20) / 440)
    w = WHITE[int(round(midi)) % 12] + 7 * (int(round(midi)) // 12 % 2)
    return base + int(w) % span
def at(arr, i): return float(arr[min(i, len(arr) - 1)])

# ======================= BACKGROUND STATIS =======================
HORIZON = 1250
bg_surf = skia.Surface(W, H); c = bg_surf.getCanvas()
c.drawRect(skia.Rect.MakeWH(W, H), P(shader=lin(0, 0, 0, HORIZON, [C('#070b22'), C('#18214d'), C('#2a2f63')], [0, 0.6, 1])))
# kabut cahaya kota
c.drawRect(skia.Rect.MakeLTRB(0, 700, W, HORIZON), P(shader=lin(0, 700, 0, HORIZON, [C('#3a3f8a', 0), C('#5b4a9a', 120)])))

def city(canvas, seed, base_col, hmin, hmax, wmin, wmax, win_p, y0):
    r = np.random.default_rng(seed); x = -40
    while x < W + 40:
        bw = r.uniform(wmin, wmax); bh = r.uniform(hmin, hmax); top = y0 - bh
        canvas.drawRect(skia.Rect.MakeLTRB(x, top, x + bw, y0 + 5), P(base_col))
        if r.random() < 0.25:
            canvas.drawRect(skia.Rect.MakeLTRB(x + bw / 2 - 2, top - 40, x + bw / 2 + 2, top), P(base_col))
            canvas.drawCircle(x + bw / 2, top - 42, 5, P(C('#ff4466'), blur=3))
        for wy in np.arange(top + 14, y0 - 10, 22):
            for wx in np.arange(x + 8, x + bw - 14, 18):
                if r.random() < win_p:
                    col = C('#ffcf7a', r.integers(120, 230)) if r.random() < 0.7 else C('#9fc0ff', r.integers(100, 200))
                    canvas.drawRect(skia.Rect.MakeXYWH(wx, wy, 9, 12), P(col))
        x += bw + r.uniform(2, 14)

far = skia.Surface(W, H); fc = far.getCanvas()
city(fc, 1, C('#1b2350'), 250, 520, 60, 130, 0.22, HORIZON)
c.drawImage(far.makeImageSnapshot(), 0, 0, skia.SamplingOptions(), skia.Paint(ImageFilter=skia.ImageFilters.Blur(3.5, 3.5)))
near = skia.Surface(W, H); nc = near.getCanvas()
city(nc, 2, C('#0f1436'), 120, 330, 90, 190, 0.18, HORIZON)
c.drawImage(near.makeImageSnapshot(), 0, 0, skia.SamplingOptions(), skia.Paint(ImageFilter=skia.ImageFilters.Blur(1.5, 1.5)))
# tanah basah + pantulan kota
c.drawRect(skia.Rect.MakeLTRB(0, HORIZON, W, H), P(shader=lin(0, HORIZON, 0, H, [C('#1a1f48'), C('#070a1c')])))
sky_img = bg_surf.makeImageSnapshot()
c.save(); c.translate(0, 2 * HORIZON); c.scale(1, -1)
c.clipRect(skia.Rect.MakeLTRB(0, HORIZON - 700, W, HORIZON))
c.drawImage(sky_img, 0, 0, skia.SamplingOptions(),
            skia.Paint(ImageFilter=skia.ImageFilters.Blur(2, 14), Alphaf=0.35))
c.restore()
c.drawRect(skia.Rect.MakeLTRB(0, HORIZON - 3, W, HORIZON + 3), P(C('#000000', 90), blur=3))
BG = bg_surf.makeImageSnapshot()

# ======================= GEOMETRI =======================
LAMP = (205, 470)
KX0, KX1, KY = 150, 930, 1135          # keyboard
NK = 21; KW = (KX1 - KX0 - 20) / NK
def key_x(k): return KX0 + 10 + KW * (k + 0.5)
HEAD = (540, 760); HR = 205
NECK = (540, 965)
SHL, SHR = (410, 1015), (670, 1015)

# ======================= PARTIKEL =======================
def mk(n, near_):
    return dict(x=rng.uniform(-150, W + 50, n), y=rng.uniform(-100, H, n),
                v=rng.uniform(40, 58, n) if near_ else rng.uniform(24, 34, n),
                l=rng.uniform(30, 55, n) if near_ else rng.uniform(14, 26, n),
                a=rng.uniform(0.22, 0.4, n) if near_ else rng.uniform(0.10, 0.22, n))
rain_far, rain_near = mk(420, False), mk(120, True)
WIND = 0.13
splashes, notes, tears = [], [], []

# status animasi
paw = {'L': dict(x=key_x(5), k=5, press=0.0, tx=key_x(5)), 'R': dict(x=key_x(14), k=14, press=0.0, tx=key_x(14))}
key_glow = np.zeros(NK)
blink_t = 0
font_note = skia.Font(skia.Typeface('DejaVu Sans'), 46)
font_neon = skia.Font(skia.Typeface('DejaVu Sans', skia.FontStyle.Bold()), 50)

def in_cone(x, y):
    if y < LAMP[1]: return 0.0
    t = (y - LAMP[1]) / (1600 - LAMP[1]); half = 40 + 300 * t
    d = abs(x - (LAMP[0] + 60 * t))
    return max(0.0, 1 - d / half)

# ======================= GAMBAR KARAKTER =======================
OUTL = C('#3a1d10')

def draw_ear(c, side, twitch):
    s = -1 if side == 'L' else 1
    bx, by = HEAD[0] + s * 120, HEAD[1] - 140
    c.save(); c.rotate(s * (8 + twitch), bx, by + 40)
    p = skia.Path(); p.moveTo(bx - 70, by + 40); p.quadTo(bx - 20 * s + s * 10, by - 120, bx + s * 20, by - 105)
    p.quadTo(bx + 60, by - 20, bx + 75, by + 45); p.close()
    c.drawPath(p, P(C('#f0a050'))); c.drawPath(p, P(OUTL, stroke=5))
    q = skia.Path(); q.moveTo(bx - 38, by + 30); q.quadTo(bx - 5 * s, by - 70, bx + s * 15, by - 70)
    q.quadTo(bx + 35, by - 10, bx + 45, by + 35); q.close()
    c.drawPath(q, P(C('#f7a7a7')))
    c.restore()

def draw_eye(c, cx, cy, s, openness, look):
    # alis sedih (ujung dalam lebih tinggi)
    br = skia.Path(); br.moveTo(cx - s * 38, cy - 48); br.quadTo(cx, cy - 66, cx + s * 30, cy - 78)
    c.drawPath(br, P(C('#5a2a12'), stroke=9))
    if openness < 0.15:
        p = skia.Path(); p.moveTo(cx - 34, cy - 4); p.quadTo(cx, cy + 22, cx + 34, cy - 4)
        c.drawPath(p, P(C('#2a1208'), stroke=8))
        for k in (-1, 0, 1):   # bulu mata
            x0 = cx + k * 16 + s * 6
            c.drawLine(x0, cy + 8 - abs(k) * 4, x0 + s * 4 + k * 3, cy + 20 - abs(k) * 4, P(C('#2a1208'), stroke=4))
    else:
        eh = 30 * openness
        c.drawOval(oval(cx, cy + 4, 30, max(eh, 4)), P(C('#1a0d08')))
        c.drawCircle(cx - 9 + look, cy - 4 + 4, 8 * openness, P(C('#ffffff')))
        c.drawCircle(cx + 9 + look, cy + 12, 4 * openness, P(C('#ffffff', 200)))
        yi, yo = cy + 4 - eh - 4, cy + 4 - eh + 9      # sisi dalam lebih tinggi -> sedih
        xi, xo = cx + s * 36, cx - s * 36
        lid = skia.Path(); lid.moveTo(xi, yi); lid.lineTo(xo, yo); lid.lineTo(xo, cy - 45); lid.lineTo(xi, cy - 45); lid.close()
        c.save(); c.clipRect(oval(cx, cy + 4, 34, 34)); c.drawPath(lid, P(C('#f0a050'))); c.restore()
        c.drawLine(xi - s * 3, yi + 1, xo + s * 3, yo + 1, P(C('#2a1208'), stroke=6))
        c.drawOval(oval(cx, cy + 4 + eh * 0.7, 26, 5), P(C('#bfe6ff', 150), blur=2))   # mata berkaca-kaca

def draw_mouth(c, mo, vowel):
    mx, my = HEAD[0], HEAD[1] + 98
    if mo < 0.08:
        p = skia.Path(); p.moveTo(mx - 30, my + 4); p.quadTo(mx - 15, my + 16, mx, my + 2)
        p.quadTo(mx + 15, my + 16, mx + 30, my + 4)
        c.drawPath(p, P(C('#4a1a10'), stroke=6))
        return
    w = 22 + 26 * (vowel * 0.8 + 0.2) * (0.6 + 0.4 * mo)
    h = 10 + 52 * mo * (1.1 - 0.35 * vowel)
    p = skia.Path(); p.moveTo(mx - w, my)
    p.cubicTo(mx - w * 0.6, my - 6, mx + w * 0.6, my - 6, mx + w, my)
    p.cubicTo(mx + w * 0.9, my + h * 1.1, mx - w * 0.9, my + h * 1.1, mx - w, my); p.close()
    c.drawPath(p, P(C('#5a1622')))
    c.save(); c.clipPath(p, doAntiAlias=True)
    c.drawOval(oval(mx, my + h * 0.95, w * 0.7, h * 0.45), P(C('#e86a7a')))
    c.drawRect(skia.Rect.MakeLTRB(mx - w, my - 8, mx + w, my + 5), P(C('#fff6ee')))  # gigi atas
    c.restore()
    c.drawPath(p, P(C('#4a1a10'), stroke=5))

def draw_head(c, i, mo, vowel, eye_open, look, twitch, tear_on):
    hx, hy = HEAD
    draw_ear(c, 'L', twitch); draw_ear(c, 'R', -twitch * 0.5)
    # pipi tembem: kepala sedikit lebih lebar di bawah
    head = skia.Path(); head.addOval(oval(hx, hy, HR, HR * 0.9))
    c.drawPath(head, P(shader=rad(hx - 60, hy - 80, HR * 1.4, [C('#ffbe6e'), C('#f0a050'), C('#c9773a')], [0, 0.6, 1])))
    c.drawPath(head, P(OUTL, stroke=6))
    # garis belang dahi
    for dx, ln in ((-34, 55), (0, 70), (34, 55)):
        c.drawLine(hx + dx, hy - HR * 0.9 + 8, hx + dx * 0.8, hy - HR * 0.9 + ln, P(C('#c46a2a'), stroke=12))
    # moncong
    c.drawOval(oval(hx, hy + 92, 105, 70), P(C('#fde6cc')))
    # pipi merah
    for s in (-1, 1):
        c.drawOval(oval(hx + s * 118, hy + 70, 36, 20), P(C('#ff7f8a', 120), blur=8))
    # mata
    draw_eye(c, hx - 82, hy + 8, 1, eye_open, look)
    draw_eye(c, hx + 82, hy + 8, -1, eye_open, look)
    # air mata
    if tear_on > 0:
        for s in (-1, 1):
            p = skia.Path(); p.moveTo(hx + s * 70, hy + 30); p.quadTo(hx + s * 82, hy + 70, hx + s * 78, hy + 105)
            c.drawPath(p, P(C('#bfe6ff', int(170 * tear_on)), stroke=6))
    for t in tears:
        c.drawPath(t['path'], P(C('#d8f0ff', 230)))
    # hidung
    n = skia.Path(); n.moveTo(hx - 16, hy + 62); n.lineTo(hx + 16, hy + 62); n.quadTo(hx, hy + 84, hx - 16, hy + 62); n.close()
    c.drawPath(n, P(C('#e2647a'))); c.drawCircle(hx - 5, hy + 66, 3.5, P(C('#ffffff', 180)))
    c.drawLine(hx, hy + 78, hx, hy + 96, P(C('#4a1a10'), stroke=5))
    draw_mouth(c, mo, vowel)
    # kumis
    for s in (-1, 1):
        for k, dy in enumerate((-8, 8, 24)):
            c.drawLine(hx + s * 100, hy + 92 + dy * 0.5, hx + s * 175, hy + 80 + dy, P(C('#ffffff', 170), stroke=3))

def draw_body(c, i, scarf_wave):
    # jas hujan kuning
    p = skia.Path(); p.moveTo(NECK[0] - 70, NECK[1] - 20)
    p.cubicTo(380, 1000, 355, 1080, 345, 1200); p.lineTo(735, 1200)
    p.cubicTo(725, 1080, 700, 1000, NECK[0] + 70, NECK[1] - 20); p.close()
    c.drawPath(p, P(shader=lin(350, 0, 740, 0, [C('#ffe066'), C('#f4c430'), C('#c99a10')], [0, 0.5, 1])))
    c.drawPath(p, P(C('#7a5a05'), stroke=5))
    c.drawLine(540, 990, 540, 1200, P(C('#b88a08'), stroke=4))
    for by in (1040, 1095, 1150):
        c.drawCircle(560, by, 9, P(C('#5a3a08')))
    # syal biru
    s = skia.Path(); s.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(420, 935, 660, 985), 25, 25))
    c.drawPath(s, P(shader=lin(0, 935, 0, 985, [C('#5b8cff'), C('#2f5bc8')])))
    c.drawPath(s, P(C('#1b2f6a'), stroke=4))
    t = skia.Path(); t.moveTo(600, 975)
    t.cubicTo(625 + scarf_wave * 6, 1030, 610 + scarf_wave * 12, 1080, 630 + scarf_wave * 18, 1120)
    t.lineTo(668 + scarf_wave * 18, 1112)
    t.cubicTo(650 + scarf_wave * 12, 1070, 660 + scarf_wave * 6, 1020, 640, 972); t.close()
    c.drawPath(t, P(C('#3d6be0'))); c.drawPath(t, P(C('#1b2f6a'), stroke=4))

def draw_legs(c, i):
    for bx in (420, 650):
        c.drawRect(skia.Rect.MakeLTRB(bx, KY + 125, bx + 12, 1520), P(C('#24140a')))
    for s, ph in ((-1, 0), (1, 1.7)):
        sw = 10 * math.sin(i / 14 + ph)
        x = 540 + s * 70
        c.drawLine(x, 1250, x + sw * 0.4, 1390, P(C('#f0a050'), stroke=46))
        b = skia.Path(); b.addRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(x - 34 + sw * 0.5, 1370, x + 40 + sw * 0.5, 1440), 22, 22))
        c.drawPath(b, P(C('#f4c430'))); c.drawPath(b, P(C('#7a5a05'), stroke=4))
        c.drawRect(skia.Rect.MakeLTRB(x - 34 + sw * 0.5, 1428, x + 40 + sw * 0.5, 1440), P(C('#3a2a05')))

def draw_arm(c, sh, px, py, side):
    s = -1 if side == 'L' else 1
    ex = (sh[0] + px) / 2 + s * 28; ey = (sh[1] + py) / 2 + 28
    p = skia.Path(); p.moveTo(*sh); p.quadTo(ex, ey, px, py - 22)
    c.drawPath(p, P(C('#7a5a05'), stroke=52)); c.drawPath(p, P(shader=lin(sh[0], 0, px, 0, [C('#f4c430'), C('#ffd84a')]), stroke=45))
    c.drawOval(oval(px, py - 4, 36, 28), P(C('#ffbe6e'))); c.drawOval(oval(px, py - 4, 36, 28), P(OUTL, stroke=4))
    for k in (-1, 0, 1):
        c.drawLine(px + k * 12, py + 6, px + k * 12, py + 18, P(OUTL, stroke=3))

def draw_keyboard(c, glow, pressed):
    # badan kayu hitam mengilap
    top = skia.Path(); top.moveTo(KX0 + 20, KY - 30); top.lineTo(KX1 - 20, KY - 30); top.lineTo(KX1, KY + 50); top.lineTo(KX0, KY + 50); top.close()
    c.drawPath(top, P(C('#0b0b14')))
    for k in range(NK):
        x0 = KX0 + 10 + KW * k
        dn = 4 if k in pressed else 0
        col = C('#d7def5') if k in pressed else C('#f6f3ea')
        r = skia.Rect.MakeLTRB(x0 + 1.5, KY - 20 + dn, x0 + KW - 1.5, KY + 42 + dn)
        c.drawRRect(skia.RRect.MakeRectXY(r, 4, 4), P(col))
        if glow[k] > 0.02:
            c.drawRRect(skia.RRect.MakeRectXY(r, 4, 4), P(C('#ffd27a', int(160 * glow[k])), blur=6))
    for k in range(NK - 1):
        if k % 7 in (2, 6): continue
        x = KX0 + 10 + KW * (k + 1)
        c.drawRRect(skia.RRect.MakeRectXY(skia.Rect.MakeLTRB(x - 10, KY - 22, x + 10, KY + 14), 3, 3), P(C('#15151d')))
    front = skia.Rect.MakeLTRB(KX0 - 10, KY + 48, KX1 + 10, KY + 125)
    c.drawRRect(skia.RRect.MakeRectXY(front, 10, 10), P(shader=lin(0, KY + 48, 0, KY + 125, [C('#2a2a3a'), C('#08080e')])))
    c.drawLine(KX0 + 10, KY + 58, KX1 - 10, KY + 58, P(C('#8fa6ff', 90), stroke=3))
    c.drawLine(KX0 + 40, KY + 100, KX1 - 40, KY + 100, P(C('#c9a24a', 160), stroke=2))
    # kaki stand
    for x in (KX0 + 70, KX1 - 70):
        c.drawLine(x, KY + 125, x, 1560, P(C('#0c0c14'), stroke=26, cap=False))
        c.drawLine(x - 50, 1560, x + 50, 1560, P(C('#0c0c14'), stroke=16))
        c.drawLine(x - 6, KY + 130, x - 6, 1550, P(C('#6a74b0', 70), stroke=3))
    # bangku (terlihat di bawah)

def draw_lamp(c, flick):
    c.drawLine(95, 1620, 95, 420, P(C('#141826'), stroke=22, cap=False))
    arm = skia.Path(); arm.moveTo(95, 430); arm.quadTo(100, 380, 160, 400); arm.lineTo(LAMP[0], 430)
    c.drawPath(arm, P(C('#141826'), stroke=14))
    hd = skia.Path(); hd.moveTo(LAMP[0] - 45, LAMP[1] - 10); hd.lineTo(LAMP[0] + 45, LAMP[1] - 10); hd.lineTo(LAMP[0] + 25, LAMP[1] - 45); hd.lineTo(LAMP[0] - 25, LAMP[1] - 45); hd.close()
    c.drawPath(hd, P(C('#1c2236')))
    c.drawOval(oval(LAMP[0], LAMP[1], 30, 14), P(C('#fff1c0')))
    c.drawCircle(LAMP[0], LAMP[1], 70, P(C('#ffcf7a', int(200 * flick)), blur=40))

def draw_light(c, flick):
    cone = skia.Path(); cone.moveTo(LAMP[0] - 25, LAMP[1]); cone.lineTo(LAMP[0] + 25, LAMP[1])
    cone.lineTo(LAMP[0] + 400, 1600); cone.lineTo(LAMP[0] - 280, 1600); cone.close()
    c.drawPath(cone, P(shader=lin(0, LAMP[1], 0, 1600, [C('#ffd88a', int(110 * flick)), C('#ffd88a', int(25 * flick))]),
                       blur=30, blend=skia.BlendMode.kScreen))
    c.drawOval(oval(LAMP[0] + 60, 1610, 380, 70), P(C('#ffcf7a', int(70 * flick)), blur=25, blend=skia.BlendMode.kScreen))

def draw_neon(c, on):
    x, y = 800, 1065
    for blur, al in ((22, 160), (8, 200)):
        c.drawString('RINDU', x, y, font_neon, P(C('#d05bff', int(al * on)), blur=blur))
    c.drawString('RINDU', x, y, font_neon, P(C('#f6d6ff', int(240 * on)), stroke=3))

# ======================= RENDER =======================
scene = skia.Surface(W, H); out = skia.Surface(W, H)
ff = None
if not STILL:
    ff = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{W}x{H}', '-r', str(FPS),
                           '-i', '-', '-i', AUD, '-filter_complex',
                           'anoisesrc=color=pink:amplitude=0.5:seed=3,highpass=f=500,lowpass=f=7000,volume=0.07[rn];'
                           f'[1:a]atrim=0:{dur},afade=t=out:st={max(dur - 3, 0)}:d=3[s];'
                           f'[rn]atrim=0:{dur},afade=t=in:d=2,afade=t=out:st={max(dur - 3, 0)}:d=3[r];'
                           '[s][r]amix=inputs=2:normalize=0[a]',
                           '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-b:v', '5500k',
                           '-maxrate', '7000k', '-bufsize', '11000k', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                           '-t', str(dur), '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
still_frames = [int(x * FPS) for x in (3, 15, 30, 45)] if STILL else []
next_blink = 90

for i in range(N):
    mo = at(env, i); vowel = at(cent, i); lo = at(loud, i); em = at(emo, i)
    # --- tangan / piano ---
    for side, ons, rng_ in (('L', on_lo, (55, 300, 0, 8)), ('R', on_hi, (300, 1500, 12, 9))):
        pw = paw[side]
        if i in ons:
            k = key_for(i, *rng_)
            if k == pw['k']: k = min(max(k + rng.choice([-2, -1, 1, 2]), rng_[2]), rng_[2] + rng_[3] - 1)
            pw['k'] = k; pw['tx'] = key_x(k); pw['hit'] = 3
        pw['x'] += (pw['tx'] - pw['x']) * 0.45
        if pw.get('hit', 0) > 0:
            pw['hit'] -= 1
            if pw['hit'] == 0:
                pw['press'] = 1.0; key_glow[pw['k']] = 1.0
                if rng.random() < 0.45:
                    notes.append(dict(x=pw['x'], y=KY - 40, vx=rng.uniform(-1.2, 1.2), t=0, ch=rng.choice(['♪', '♫'])))
        else:
            pw['press'] *= 0.78
    key_glow *= 0.86
    pressed = {pw['k'] for pw in paw.values() if pw['press'] > 0.35}
    # --- mata / ekspresi ---
    if i >= next_blink:
        blink_t = 6; next_blink = i + int(rng.uniform(70, 160))
    quiet = mo < 0.05
    eye_open = 0.55 if (quiet and lo < 0.55) else 0.0
    if blink_t > 0: eye_open = 0.0; blink_t -= 1
    look = 3 * math.sin(i / 40)
    tear_on = float(np.clip((em - 0.55) / 0.3, 0, 1))
    if tear_on > 0.3 and rng.random() < 0.012:
        for s in (-1, 1):
            tears.append(dict(s=s, y=0.0))
    for t in tears:
        t['y'] += 2.2
        tx = HEAD[0] + t['s'] * 72 + t['s'] * t['y'] * 0.08; ty = HEAD[1] + 40 + t['y']
        p = skia.Path(); p.moveTo(tx, ty - 9); p.quadTo(tx + 7, ty + 4, tx, ty + 7); p.quadTo(tx - 7, ty + 4, tx, ty - 9)
        t['path'] = p
    tears[:] = [t for t in tears if t['y'] < 80]
    twitch = 10 * max(0, math.sin(i / 5)) if (i // 150) % 3 == 0 and (i % 150) < 16 else 0
    flick = 0.85 + 0.1 * math.sin(i * 0.7) * math.sin(i * 0.23) + 0.05 * rng.random() + 0.15 * lo

    # ------------- SCENE -------------
    c = scene.getCanvas()
    c.drawImage(BG, 0, 0)
    neon_on = 1.0 if not (i % 211 < 6 and (i % 3)) else 0.25
    draw_neon(c, neon_on)
    draw_lamp(c, flick)
    draw_legs(c, i)
    # badan + kepala bergoyang
    sway = 2.5 * math.sin(i / 37) + 1.5 * math.sin(i / 13) * (0.3 + lo)
    bob = 3 * math.sin(i / 11) * (0.3 + lo)
    c.save(); c.translate(0, bob)
    draw_body(c, i, math.sin(i / 17))
    c.save(); c.rotate(sway, NECK[0], NECK[1])
    hx, hy = HEAD
    draw_head(c, i, mo, vowel, eye_open, look, twitch, tear_on)
    c.restore(); c.restore()
    draw_keyboard(c, key_glow, pressed)
    for side, sh in (('L', SHL), ('R', SHR)):
        pw = paw[side]
        draw_arm(c, (sh[0], sh[1] + bob), pw['x'], KY - 2 + 10 * pw['press'] - 6 * (pw.get('hit', 0) > 0), side)
    # not musik melayang
    for nt in notes:
        nt['t'] += 1; nt['y'] -= 2.2; nt['x'] += nt['vx'] + 0.8 * math.sin(nt['t'] / 8)
        al = max(0, 1 - nt['t'] / 70)
        c.drawString(nt['ch'], nt['x'], nt['y'], font_note, P(C('#ffe7a8', int(230 * al)), blur=1.2))
    notes[:] = [n for n in notes if n['t'] < 70]
    draw_light(c, flick)
    # pantulan di lantai basah
    snap = scene.makeImageSnapshot()
    c.save(); c.clipRect(skia.Rect.MakeLTRB(0, 1565, W, H)); c.translate(0, 2 * 1562); c.scale(1, -1)
    c.drawImage(snap, 0, 0, skia.SamplingOptions(), skia.Paint(ImageFilter=skia.ImageFilters.Blur(3, 10), Alphaf=0.28))
    c.restore()
    # riak genangan
    for _ in range(rng.poisson(2.2)):
        splashes.append([rng.uniform(0, W), rng.uniform(1300, H - 20), 0])
    for _ in range(rng.poisson(0.5)):
        splashes.append([rng.uniform(KX0 + 30, KX1 - 30), KY - 32, 0])
    for s in splashes:
        s[2] += 1; r = 2 + s[2] * 2.4; al = int(150 * (1 - s[2] / 11))
        c.drawOval(oval(s[0], s[1], r, r * 0.28), P(C('#c8d6ff', al), stroke=1.6))
    splashes[:] = [s for s in splashes if s[2] < 11]

    # ------------- KAMERA (zoom pelan ke wajah) -------------
    oc = out.getCanvas()
    z = 1.0 + 0.16 * (i / max(N - 1, 1)) ** 0.9
    fx, fy = 540, 900 + 30 * math.sin(i / 200)
    oc.clear(C('#000000'))
    oc.save(); oc.translate(fx, fy); oc.scale(z, z); oc.translate(-fx, -fy + (z - 1) * 120)
    oc.drawImage(scene.makeImageSnapshot(), 0, 0, skia.SamplingOptions(skia.FilterMode.kLinear))
    oc.restore()
    # gerimis (lebih terang di bawah cahaya lampu)
    for layer, thick in ((rain_far, 1.3), (rain_near, 2.4)):
        layer['y'] += layer['v']; layer['x'] += layer['v'] * WIND
        r = layer['y'] > H + 60
        layer['y'][r] = rng.uniform(-200, -10, r.sum()); layer['x'][r] = rng.uniform(-150, W, r.sum())
        pt = P(C('#dfe8ff'), stroke=thick)
        for x, y, l, al in zip(layer['x'], layer['y'], layer['l'], layer['a']):
            boost = 1 + 2.2 * in_cone(x, y)
            pt.setAlphaf(min(1.0, al * boost))
            oc.drawLine(x, y, x - l * WIND, y - l, pt)
    # vinyet + fade
    oc.drawRect(skia.Rect.MakeWH(W, H), P(shader=rad(W / 2, H * 0.47, H * 0.68, [C('#000000', 0), C('#000000', 0), C('#000010', 190)], [0, 0.55, 1])))
    k = min(1, i / (2 * FPS), (N - 1 - i) / (3 * FPS))
    if k < 1: oc.drawRect(skia.Rect.MakeWH(W, H), P(C('#000000', int(255 * (1 - max(k, 0))))))
    if STILL:
        if i in still_frames: out.makeImageSnapshot().save(f'still_{i}.png')
        continue
    ff.stdin.write(out.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType).tobytes())
    if i % 300 == 0: print(i, N, flush=True)
if ff:
    ff.stdin.close(); ff.wait()
print('done')
