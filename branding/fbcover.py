# Banner channel "Malam Komedi" v3 — satu karakter + papan nama marquee (2560x1440).
# Area aman (HP): 1546x423 di tengah (x 507-2053, y 508-931).
# Karakter: render transparan dari pipeline kartun (branding/karakter-komika.png).
import math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1640, 924
INK = (36, 23, 38)
F = lambda s: ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf", s)
HERE = "/home/user/Alihamz55/branding/"

# ---- langit malam ----
im = Image.new("RGB", (W, H))
d = ImageDraw.Draw(im)
for y in range(H):
    t = y / H
    c = [int(a + (b - a) * t) for a, b in zip((22, 14, 58), (88, 30, 98))]
    d.line((0, y, W, y), fill=tuple(c))
random.seed(7)
for _ in range(140):
    x, y, r = random.randint(0, W), random.randint(0, H), random.choice((2, 2, 3, 4, 5))
    a = random.randint(120, 255)
    d.ellipse((x - r, y - r, x + r, y + r), fill=(a, a, min(255, a + 20)))

# bulan sabit (MALAM)
moon = Image.new("RGBA", (W, H), (0, 0, 0, 0))
md = ImageDraw.Draw(moon)
md.ellipse((600, 170, 760, 330), fill=(255, 226, 140, 255))
md.ellipse((645, 150, 805, 310), fill=(0, 0, 0, 0))
glow = moon.filter(ImageFilter.GaussianBlur(30))
im.paste(glow, (0, 0), glow); im.paste(moon, (0, 0), moon)

# sorot lampu ke karakter
beam = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(beam).polygon([(180, -50), (330, -50), (520, 924), (0, 924)], fill=(255, 230, 160, 70))
beam = beam.filter(ImageFilter.GaussianBlur(40))
im.paste(beam, (0, 0), beam)

# penonton siluet (hanya kelihatan di TV)
d = ImageDraw.Draw(im)
for i in range(0):
    x = 0
    y = 0
    d.ellipse((x, y - 70, x + 90, y + 20), fill=(16, 8, 30))
    d.rounded_rectangle((x - 20, y + 5, x + 110, y + 200), 50, fill=(16, 8, 30))

# ---- karakter ----
ch = Image.open(HERE + "karakter-komika.png").convert("RGBA")  # 1800x3000, 3px per unit
s = 1.05 / 3 * 1.0
ch = ch.resize((int(ch.width * s * 1.0), int(ch.height * s)), Image.LANCZOS)
# kepala atas (unit y 190) di y=540, tengah (unit x 300) di x=800
k = 1.05
ox, oy = int(270 - 300 * k), int(200 - 190 * k)
sh = Image.new("RGBA", ch.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 120), mask=ch.split()[3]); sh = sh.filter(ImageFilter.GaussianBlur(14))
im.paste(sh, (ox + 14, oy + 18), sh)
im.paste(ch, (ox, oy), ch)

# ---- papan nama marquee ----
sign = Image.new("RGBA", (1000, 400), (0, 0, 0, 0))
sd = ImageDraw.Draw(sign)
sd.rounded_rectangle((8, 8, 992, 392), 40, fill=(178, 32, 52), outline=INK, width=14)
sd.rounded_rectangle((40, 40, 960, 360), 26, fill=(42, 18, 50), outline=(255, 216, 74), width=6)
# bohlam di pinggir
def bulbs(x0, y0, x1, y1, n):
    for i in range(n):
        t = i / n
        per = 2 * ((x1 - x0) + (y1 - y0)); dd = t * per
        if dd < x1 - x0: x, y = x0 + dd, y0
        elif dd < (x1 - x0) + (y1 - y0): x, y = x1, y0 + dd - (x1 - x0)
        elif dd < 2 * (x1 - x0) + (y1 - y0): x, y = x1 - (dd - (x1 - x0) - (y1 - y0)), y1
        else: x, y = x0, y1 - (dd - 2 * (x1 - x0) - (y1 - y0))
        sd.ellipse((x - 11, y - 11, x + 11, y + 11), fill=(255, 244, 196) if i % 2 else (255, 200, 90), outline=INK, width=3)
bulbs(24, 24, 976, 376, 52)

def bouncy(word, cy, size, fills, extr, rot_amp, gap):
    widths = [F(size).getbbox(ch_)[2] - F(size).getbbox(ch_)[0] for ch_ in word]
    tot = sum(widths) + gap * (len(word) - 1)
    x = 500 - tot / 2
    for i, (c_, w_) in enumerate(zip(word, widths)):
        L = Image.new("RGBA", (size * 2, size * 2), (0, 0, 0, 0))
        ld = ImageDraw.Draw(L)
        mx, my = size, size
        for e in range(extr, 0, -2):  # ekstrusi 3D
            ld.text((mx + e * 0.6, my + e), c_, font=F(size), fill=(150, 30, 80), anchor="mm", stroke_width=12, stroke_fill=INK)
        ld.text((mx, my), c_, font=F(size), fill=fills[i % len(fills)], anchor="mm", stroke_width=10, stroke_fill=INK)
        L = L.rotate(rot_amp * (1 if i % 2 else -1), resample=Image.BICUBIC)
        dy = -10 if i % 2 else 8
        sign.paste(L, (int(x + w_ / 2 - size), int(cy + dy - size)), L)
        x += w_ + gap

bouncy("MALAM", 128, 112, [(255, 255, 255)], 10, 5, 14)
bouncy("KOMEDI", 262, 158, [(255, 216, 74), (255, 110, 180)], 16, 6, 10)

sign = sign.resize((660, 264), Image.LANCZOS)
sign = sign.rotate(-2, resample=Image.BICUBIC, expand=True)
ssh = Image.new("RGBA", sign.size, (0, 0, 0, 0)); ssh.paste((0, 0, 0, 140), mask=sign.split()[3]); ssh = ssh.filter(ImageFilter.GaussianBlur(16))
sx, sy = 1290 - sign.width // 2, 310 - sign.height // 2
im.paste(ssh, (sx + 16, sy + 22), ssh)
im.paste(sign, (sx, sy), sign)

# pita tagline
rib = Image.new("RGBA", (900, 120), (0, 0, 0, 0))
rd = ImageDraw.Draw(rib)
rd.polygon([(0, 30), (60, 30), (60, 100), (0, 100), (28, 65)], fill=(200, 60, 140), outline=INK)
rd.polygon([(900, 30), (840, 30), (840, 100), (900, 100), (872, 65)], fill=(200, 60, 140), outline=INK)
rd.rounded_rectangle((40, 14, 860, 106), 20, fill=(255, 255, 255), outline=INK, width=8)
rd.text((450, 60), "Kartun Stand-Up & Cerita Sehari-hari", font=F(40), fill=INK, anchor="mm")
rib = rib.rotate(1.5, resample=Image.BICUBIC, expand=True)
rsh = Image.new("RGBA", rib.size, (0, 0, 0, 0)); rsh.paste((0, 0, 0, 130), mask=rib.split()[3]); rsh = rsh.filter(ImageFilter.GaussianBlur(10))
rib = rib.resize((int(rib.width * 0.76), int(rib.height * 0.76)), Image.LANCZOS)
rx, ry = 1290 - rib.width // 2, 470 - rib.height // 2
im.paste(rsh, (rx + 10, ry + 14), rsh)
im.paste(rib, (rx, ry), rib)

im.save(HERE + "sampul-facebook-malam-komedi.jpg", quality=93)
print("ok")
