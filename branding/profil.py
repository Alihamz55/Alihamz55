# Foto profil channel "Malam Komedi" (800x800, tampil bulat) — gaya sama dengan banner v3.
import math, random
from PIL import Image, ImageDraw, ImageFilter

S = 800
INK = (36, 23, 38)
HERE = "/home/user/Alihamz55/branding/"

im = Image.new("RGB", (S, S))
d = ImageDraw.Draw(im)
for y in range(S):
    t = y / S
    d.line((0, y, S, y), fill=tuple(int(a + (b - a) * t) for a, b in zip((30, 16, 70), (96, 32, 104))))
random.seed(3)
for _ in range(60):
    x, y, r = random.randint(0, S), random.randint(0, S), random.choice((2, 3, 4))
    d.ellipse((x - r, y - r, x + r, y + r), fill=(235, 230, 255))

# sorot lampu
beam = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ImageDraw.Draw(beam).polygon([(300, -20), (500, -20), (700, 800), (100, 800)], fill=(255, 230, 160, 80))
beam = beam.filter(ImageFilter.GaussianBlur(30))
im.paste(beam, (0, 0), beam)

# karakter: kepala + badan atas (unit x 120-500, y 160-560; 3px per unit)
ch = Image.open(HERE + "karakter-komika.png").convert("RGBA")
k = 1.9  # px banner per unit
ch = ch.resize((int(ch.width * k / 3), int(ch.height * k / 3)), Image.LANCZOS)
ox, oy = int(400 - 315 * k), int(118 - 190 * k)
sh = Image.new("RGBA", ch.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 120), mask=ch.split()[3]); sh = sh.filter(ImageFilter.GaussianBlur(12))
im.paste(sh, (ox + 10, oy + 14), sh)
im.paste(ch, (ox, oy), ch)

# cincin lampu bohlam (tetap di dalam lingkaran tampilan)
d = ImageDraw.Draw(im)
R = 368
d.ellipse((400 - R, 400 - R, 400 + R, 400 + R), outline=(178, 32, 52), width=34)
d.ellipse((400 - R - 19, 400 - R - 19, 400 + R + 19, 400 + R + 19), outline=INK, width=6)
d.ellipse((400 - R + 19, 400 - R + 19, 400 + R - 19, 400 + R - 19), outline=INK, width=6)
for i in range(28):
    a = i * 2 * math.pi / 28
    x, y = 400 + R * math.cos(a), 400 + R * math.sin(a)
    d.ellipse((x - 11, y - 11, x + 11, y + 11), fill=(255, 244, 196) if i % 2 else (255, 200, 90), outline=INK, width=3)

# di luar lingkaran: isi warna gelap supaya rapi kalau tampil kotak
mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).ellipse((400 - R - 22, 400 - R - 22, 400 + R + 22, 400 + R + 22), fill=255)
bg = Image.new("RGB", (S, S), (30, 16, 70))
bg.paste(im, (0, 0), mask)
bg.save(HERE + "profil-malam-komedi.png")
print("ok")
