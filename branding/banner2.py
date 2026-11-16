# Banner channel "Malam Komedi" v2 — dinding episode (2560x1440).
# Area aman (HP): 1546x423 di tengah; area desktop: 2560x423 di tengah.
import math, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 2560, 1440
INK = (36, 23, 38)
FB = "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"
F = lambda s: ImageFont.truetype(FB, s)
SH = "/home/user/shorts/%s/frames/f%04d.jpg"

im = Image.new("RGB", (W, H), (18, 98, 110))
d = ImageDraw.Draw(im)
# sinar dari tengah, warna toska
cx, cy = W / 2, H / 2
for i in range(24):
    a0, a1 = i * math.pi / 12, i * math.pi / 12 + math.pi / 24
    pts = [(cx, cy)] + [(cx + 3000 * math.cos(a), cy + 3000 * math.sin(a)) for a in (a0, a1)]
    d.polygon(pts, fill=(24, 120, 132))
# titik halftone
for y in range(0, H, 36):
    for x in range(0, W, 36):
        r = 3 + 6 * (abs(x - cx) / cx)
        ox = 18 if (y // 36) % 2 else 0
        d.ellipse((x + ox - r, y - r, x + ox + r, y + r), fill=(32, 138, 150))


def card(fr, box, caption, col, rot):
    """polaroid adegan episode"""
    show, f = fr
    src = Image.open(SH % (show, f)).convert("RGB")
    x0, y0, x1, y1 = box
    ph = src.crop((x0, y0, x1, y1)).resize((300, 330), Image.LANCZOS)
    c = Image.new("RGBA", (340, 440), (0, 0, 0, 0))
    cd = ImageDraw.Draw(c)
    cd.rounded_rectangle((0, 0, 339, 439), 18, fill=(255, 255, 255), outline=INK, width=8)
    c.paste(ph, (20, 20))
    cd.rectangle((20, 20, 320, 350), outline=INK, width=5)
    cd.rounded_rectangle((26, 364, 314, 424), 14, fill=col, outline=INK, width=5)
    cd.text((170, 394), caption, font=F(38), fill=(255, 255, 255), anchor="mm", stroke_width=5, stroke_fill=INK)
    c = c.rotate(rot, resample=Image.BICUBIC, expand=True)
    sh = Image.new("RGBA", c.size, (0, 0, 0, 0))
    sh.paste((0, 0, 0, 110), mask=c.split()[3])
    sh = sh.filter(ImageFilter.GaussianBlur(10))
    return c, sh


def place(c, sh, x, y):
    im.paste(sh, (int(x - c.width / 2) + 12, int(y - c.height / 2) + 16), sh)
    im.paste(c, (int(x - c.width / 2), int(y - c.height / 2)), c)


# adegan per episode: (show, frame), crop (x0,y0,x1,y1) dari frame 1080x1920
cards = [
    (("otw", 646), (0, 380, 1080, 1568), "OTW", (90, 170, 90), -6, 140, 720),
    (("kondangan", 588), (0, 640, 1080, 1828), "KONDANGAN", (200, 60, 140), 5, 385, 720),
    (("pahlawan", 443), (60, 120, 1020, 1176), "PAHLAWAN", (210, 50, 47), -5, 2175, 720),
    (("kartini", 870), (60, 700, 1060, 1800), "KARTINI", (150, 90, 40), 6, 2420, 720),
]
for fr, box, cap, col, rot, x, y in cards:
    c, sh = card(fr, box, cap, col, rot)
    c = c.resize((int(c.width * 0.86), int(c.height * 0.86)), Image.LANCZOS)
    sh = sh.resize(c.size)
    place(c, sh, x, y)

# logo tengah: kotak gelap miring + komika
lay = Image.new("RGBA", (1540, 440), (0, 0, 0, 0))
ld = ImageDraw.Draw(lay)
logo = Image.open("/home/user/Alihamz55/branding/logo-malam-komedi.png").convert("RGB")
face = logo.crop((150, 130, 650, 500)).resize((470, 348), Image.LANCZOS)
m = Image.new("L", face.size, 0)
ImageDraw.Draw(m).ellipse((0, 0, 469, 347), fill=255)
ld.ellipse((26, 32, 510, 400), fill=INK)
lay.paste(face, (33, 40), m)
ld.ellipse((33, 40, 503, 388), outline=(255, 216, 74), width=12)
ld.rounded_rectangle((520, 60, 1530, 300), 34, fill=(255, 216, 74), outline=INK, width=12)
ld.text((1025, 135), "MALAM", font=F(110), fill=INK, anchor="mm")
ld.text((1025, 238), "KOMEDI", font=F(110), fill=(224, 53, 43), anchor="mm", stroke_width=6, stroke_fill=INK)
ld.rounded_rectangle((560, 318, 1490, 410), 46, fill=(255, 255, 255), outline=INK, width=8)
ld.text((1025, 364), "Kartun stand-up & cerita sehari-hari", font=F(46), fill=INK, anchor="mm")
lay = lay.rotate(1.5, resample=Image.BICUBIC, expand=True)
lay = lay.resize((int(lay.width * 0.93), int(lay.height * 0.93)), Image.LANCZOS)
im.paste(lay, (int(cx - lay.width / 2), int(cy - lay.height / 2)), lay)

# stiker HAHA
def sticker(t, x, y, rot, sz, col):
    s = Image.new("RGBA", (500, 200), (0, 0, 0, 0))
    ImageDraw.Draw(s).text((250, 100), t, font=F(sz), fill=col, anchor="mm", stroke_width=10, stroke_fill=INK)
    s = s.rotate(rot, resample=Image.BICUBIC)
    im.paste(s, (x - 250, y - 100), s)

sticker("HAHA!", 700, 560, 12, 70, (255, 216, 74))
sticker("WKWK", 1960, 560, -10, 64, (255, 120, 190))

out = sys.argv[1] if len(sys.argv) > 1 else "banner-malam-komedi.png"
im.save(out)
print(out)
