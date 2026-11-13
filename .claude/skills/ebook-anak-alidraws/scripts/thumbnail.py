"""Thumbnail produk Lynk 1080x1080 bergaya alidraws.

Contoh:
  python3 thumbnail.py --font-dir FONTS --cover cover.png --isi hal3.png \
      --judul "10 TTS SERU" --sub "Untuk Anak SD + Kunci Jawaban" \
      --badge "Rp19rb" --tombol "BELI SEKARANG" --warna "#F97316" --out produk.jpg

  python3 thumbnail.py --font-dir FONTS --cover cover.png --isi hal3.png \
      --judul "GRATIS!" --sub "Coba 1 TTS + Kunci Jawaban" \
      --badge "Rp0" --tombol "UNDUH SEKARANG" --warna "#EF4444" --out gratis.jpg

--isi (halaman dalam) boleh dikosongkan. Teks badge memakai Baloo 2 (ada huruf kecil),
judul & tombol memakai Luckiest Guy (huruf kapital semua).
"""
import argparse, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("--font-dir", required=True)
ap.add_argument("--cover", required=True)
ap.add_argument("--isi")
ap.add_argument("--judul", required=True)
ap.add_argument("--sub", default="")
ap.add_argument("--badge", default="")
ap.add_argument("--tombol", default="")
ap.add_argument("--warna", default="#EF4444", help="warna judul")
ap.add_argument("--latar", default="#FACC15")
ap.add_argument("--sinar", default="#FDE047")
ap.add_argument("--out", required=True)
a = ap.parse_args()

LG = f"{a.font_dir}/LuckiestGuy.ttf"; BA = f"{a.font_dir}/Baloo2-ExtraBold.ttf"
W = H = 1080
im = Image.new("RGB", (W, H), a.latar); d = ImageDraw.Draw(im)
cx, cy = W / 2, 600
for i in range(24):
    a0 = i * 2 * math.pi / 24; a1 = a0 + math.pi / 24
    d.polygon([(cx, cy), (cx + 1600 * math.cos(a0), cy + 1600 * math.sin(a0)),
               (cx + 1600 * math.cos(a1), cy + 1600 * math.sin(a1))], fill=a.sinar)
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(glow).ellipse((cx - 330, cy - 330, cx + 330, cy + 330), fill=(255, 255, 255, 120))
glow = glow.filter(ImageFilter.GaussianBlur(60)); im.paste(glow, (0, 0), glow)


def kartu(img, h, rot, pos):
    w = int(h * img.width / img.height)
    c = img.convert("RGBA").resize((w, h), Image.LANCZOS)
    b = Image.new("RGBA", (w + 16, h + 16), "white"); b.paste(c, (8, 8))
    b = b.rotate(rot, expand=True, resample=Image.BICUBIC)
    sh = Image.new("RGBA", b.size, (0, 0, 0, 0)); sh.paste((60, 30, 0, 110), (0, 0), b.split()[3])
    sh = sh.filter(ImageFilter.GaussianBlur(16))
    x, y = int(pos[0] - b.width / 2), int(pos[1] - b.height / 2)
    im.paste(sh, (x + 10, y + 16), sh); im.paste(b, (x, y), b)


if a.isi:
    kartu(Image.open(a.isi), 560, 9, (640, 640))
    kartu(Image.open(a.cover), 580, -7, (420, 610))
else:
    kartu(Image.open(a.cover), 600, -4, (W / 2, 610))
d = ImageDraw.Draw(im)


def bergaris(text, font, x, y, fill, stroke, sw, shadow=None, rot=0):
    tw = d.textlength(text, font=font); asc, desc = font.getmetrics()
    layer = Image.new("RGBA", (int(tw) + sw * 2 + 40, asc + desc + sw * 2 + 40), (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    if shadow:
        ld.text((sw + 20, sw + 30), text, font=font, fill=shadow, stroke_width=sw, stroke_fill=shadow)
    ld.text((sw + 20, sw + 20), text, font=font, fill=fill, stroke_width=sw, stroke_fill=stroke)
    layer = layer.rotate(rot, expand=True, resample=Image.BICUBIC)
    im.paste(layer, (int(x - layer.width / 2), int(y - layer.height / 2)), layer)


# judul: kecilkan otomatis bila terlalu panjang
size = 190
while size > 70 and d.textlength(a.judul, font=ImageFont.truetype(LG, size)) > 900:
    size -= 6
bergaris(a.judul, ImageFont.truetype(LG, size), W / 2, 150, a.warna, "#FFFFFF", 14, shadow="#3B0A0A", rot=3)
if a.sub:
    s2 = 52
    while s2 > 30 and d.textlength(a.sub, font=ImageFont.truetype(BA, s2)) > 960:
        s2 -= 2
    bergaris(a.sub, ImageFont.truetype(BA, s2), W / 2, 285, "#1E3A8A", "#FFFFFF", 7)
if a.badge:
    bx, by, r = 900, 470, 105
    pts = [(bx + (r if i % 2 == 0 else r * .82) * math.cos(i * math.pi / 12),
            by + (r if i % 2 == 0 else r * .82) * math.sin(i * math.pi / 12)) for i in range(24)]
    d.polygon([(x + 5, y + 8) for x, y in pts], fill="#14532D"); d.polygon(pts, fill="#22C55E")
    fs = 74
    while fs > 34 and d.textlength(a.badge, font=ImageFont.truetype(BA, fs)) > 170:
        fs -= 4
    f = ImageFont.truetype(BA, fs)
    d.text((bx - d.textlength(a.badge, font=f) / 2, by - fs * .78), a.badge, font=f, fill="white")
if a.tombol:
    bw, bh = 700, 120; x0 = (W - bw) / 2; y0 = 905
    d.rounded_rectangle((x0 + 6, y0 + 12, x0 + bw + 6, y0 + bh + 12), radius=60, fill="#7C2D12")
    d.rounded_rectangle((x0, y0, x0 + bw, y0 + bh), radius=60, fill="#F97316", outline="white", width=6)
    fs = 64
    while fs > 34 and d.textlength(a.tombol, font=ImageFont.truetype(LG, fs)) > bw - 60:
        fs -= 4
    f = ImageFont.truetype(LG, fs)
    d.text((W / 2 - d.textlength(a.tombol, font=f) / 2, y0 + (bh - fs) / 2 + 4), a.tombol, font=f, fill="white")
im.save(a.out, quality=93)
print("tersimpan:", a.out)
