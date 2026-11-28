# Banner YouTube "Asep in My Life" (2560x1440).
# Area aman semua perangkat: 1546x423 di tengah (x 507-2053, y 508-931).
# Karakter: Asep sarung+peci, render transparan dari pipeline kartun (karakter-asep-sarung.png).
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 2560, 1440
INK = (36, 23, 38)
HERE = "/home/user/Alihamz55/branding/"
def LIL(s): return ImageFont.truetype(HERE + "fonts/lilita-one.woff2", s)
def FRE(s):
    f = ImageFont.truetype(HERE + "fonts/fredoka.woff2", s)
    try: f.set_variation_by_axes([700, 100])
    except Exception: pass
    return f

# ---- langit senja (oranye -> ungu) ----
im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
stops = [(0, (58, 30, 96)), (0.45, (196, 74, 112)), (0.75, (255, 150, 84)), (1, (255, 196, 110))]
for y in range(H):
    t = y / H
    for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
        if t0 <= t <= t1:
            k = (t - t0) / (t1 - t0); c = tuple(int(a + (b - a) * k) for a, b in zip(c0, c1)); break
    d.line((0, y, W, y), fill=c)
random.seed(11)
for _ in range(120):
    x, y, r = random.randint(0, W), random.randint(0, 420), random.choice((2, 2, 3, 4))
    a = random.randint(150, 255); d.ellipse((x - r, y - r, x + r, y + r), fill=(a, a, 230))

# matahari terbenam besar di belakang Asep
sun = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sun)
sd.ellipse((420, 560, 1180, 1320), fill=(255, 226, 120, 255))
mask = sun.split()[3].copy()
for i, yy in enumerate((900, 960, 1015)):  # garis-garis retro di matahari (hanya di dalam lingkaran)
    sd.rectangle((400, yy, 1200, yy + 14 + i * 6), fill=(236, 120, 96, 255))
sun.putalpha(mask)
g = sun.filter(ImageFilter.GaussianBlur(60)); im.paste(g, (0, 0), g); im.paste(sun, (0, 0), sun)
d = ImageDraw.Draw(im)

# awan
def cloud(x, y, s, col=(255, 214, 200)):
    for dx, dy, r in ((0, 0, 60), (70, -30, 80), (160, 0, 65), (90, 20, 70)):
        d.ellipse((x + dx * s - r * s, y + dy * s - r * s, x + dx * s + r * s, y + dy * s + r * s), fill=col)
cloud(1750, 260, 1.3); cloud(260, 300, 1.0); cloud(2250, 520, 0.8, (255, 190, 170))

# siluet kampung: bukit, rumah panggung, pohon kelapa
SIL = (52, 22, 58)
d.polygon([(0, 1150), (300, 1060), (700, 1120), (1100, 1040), (1600, 1110), (2100, 1030), (2560, 1100), (2560, 1440), (0, 1440)], fill=(92, 36, 82))
def rumah(x, y, w):
    d.polygon([(x - 20, y), (x + w / 2, y - w * 0.45), (x + w + 20, y)], fill=SIL)
    d.rectangle((x, y, x + w, y + w * 0.5), fill=SIL)
    for px in (x + 10, x + w - 25): d.rectangle((px, y + w * 0.5, px + 15, y + w * 0.75), fill=SIL)
    d.rectangle((x + w * 0.4, y + w * 0.15, x + w * 0.6, y + w * 0.38), fill=(255, 200, 100))
def kelapa(x, y, h):
    d.line((x, y, x + 30, y - h), fill=SIL, width=22)
    cx, cy = x + 30, y - h
    for ex, ey in ((-170, 30), (-120, -60), (0, -90), (120, -60), (170, 30), (90, 60), (-90, 60)):
        d.polygon([(cx, cy), (cx + ex, cy + ey), (cx + ex * 0.6, cy + ey * 0.6 + 25)], fill=SIL)
rumah(1500, 1150, 170); rumah(1800, 1120, 210); rumah(2250, 1160, 160); rumah(120, 1170, 180)
kelapa(1380, 1260, 330); kelapa(2120, 1250, 380); kelapa(380, 1270, 300)
d.rectangle((0, 1250, W, H), fill=(44, 18, 48))

# ---- Asep ----
ch = Image.open(HERE + "karakter-asep-sarung.png").convert("RGBA").crop((500, 480, 1500, 2960))
k = 0.36
ch = ch.resize((int(ch.width * k), int(ch.height * k)), Image.LANCZOS)
ox, oy = 790 - ch.width // 2, 515
sh = Image.new("RGBA", ch.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 120), mask=ch.split()[3]); sh = sh.filter(ImageFilter.GaussianBlur(14))
im.paste(sh, (ox + 16, oy + 18), sh); im.paste(ch, (ox, oy), ch)

# ---- judul ----
L = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ld = ImageDraw.Draw(L)
def judul(text, x, y, size, fills, extr, rot, gap, anchor_left=True):
    f = LIL(size)
    for i, c_ in enumerate(text):
        w_ = f.getlength(c_)
        if c_ == " ": x += w_; continue
        G = Image.new("RGBA", (size * 2, size * 2), (0, 0, 0, 0)); gd = ImageDraw.Draw(G)
        for e in range(extr, 0, -2):
            gd.text((size + e * 0.6, size + e), c_, font=f, fill=(150, 30, 80), anchor="mm", stroke_width=14, stroke_fill=INK)
        gd.text((size, size), c_, font=f, fill=fills[i % len(fills)], anchor="mm", stroke_width=12, stroke_fill=INK)
        G = G.rotate(rot * (1 if i % 2 else -1), resample=Image.BICUBIC)
        L.paste(G, (int(x + w_ / 2 - size), int(y + (-10 if i % 2 else 8) - size)), G)
        x += w_ + gap

judul("ASEP", 1190, 625, 220, [(255, 216, 74), (255, 255, 255)], 20, 6, 14)
judul("in My Life", 1210, 780, 112, [(255, 255, 255), (255, 140, 190)], 12, 4, 6)
sh = Image.new("RGBA", L.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 140), mask=L.split()[3]); sh = sh.filter(ImageFilter.GaussianBlur(16))
im.paste(sh, (14, 20), sh); im.paste(L, (0, 0), L)

# pita tagline
rib = Image.new("RGBA", (860, 110), (0, 0, 0, 0)); rd = ImageDraw.Draw(rib)
rd.polygon([(0, 28), (60, 28), (60, 96), (0, 96), (28, 62)], fill=(200, 60, 140), outline=INK)
rd.polygon([(860, 28), (800, 28), (800, 96), (860, 96), (832, 62)], fill=(200, 60, 140), outline=INK)
rd.rounded_rectangle((40, 12, 820, 100), 20, fill=(255, 255, 255), outline=INK, width=8)
rd.text((430, 56), "Kartun komedi sehari-hari · Malam Komedi", font=FRE(38), fill=INK, anchor="mm")
rib = rib.rotate(1.5, resample=Image.BICUBIC, expand=True)
rsh = Image.new("RGBA", rib.size, (0, 0, 0, 0)); rsh.paste((0, 0, 0, 130), mask=rib.split()[3]); rsh = rsh.filter(ImageFilter.GaussianBlur(10))
rx, ry = 1600 - rib.width // 2, 875 - rib.height // 2
im.paste(rsh, (rx + 10, ry + 14), rsh); im.paste(rib, (rx, ry), rib)

im.save(HERE + "banner-asep-in-my-life.png")
# pratinjau dengan area aman
p = im.copy(); ImageDraw.Draw(p).rectangle((507, 508, 2053, 931), outline=(0, 255, 0), width=6)
p.resize((1280, 720)).save("/tmp/claude-0/-home-user-Alihamz55/098ccec3-2b03-5b1e-a227-a68601ae5ac6/scratchpad/prev.png")
print("ok")
