# Foto profil channel "Asep in My Life" (800x800, aman untuk potongan lingkaran).
# Karakter: Asep tanpa peci, senyum (render transparan dari pipeline kartun: karakter-asep-senyum.png).
import math
from PIL import Image, ImageDraw, ImageFilter

N = 800
HERE = "/home/user/Alihamz55/branding/"
im = Image.new("RGB", (N, N)); d = ImageDraw.Draw(im)
for y in range(N):  # gradasi senja sama seperti banner
    t = y / N
    c = [int(a + (b - a) * t) for a, b in zip((88, 36, 120), (255, 150, 90))]
    d.line((0, y, N, y), fill=tuple(c))
ray = Image.new("RGBA", (N, N), (0, 0, 0, 0)); rd = ImageDraw.Draw(ray)
cx, cy = 400, 360
for i in range(20):
    a0 = i * 2 * math.pi / 20; a1 = a0 + math.pi / 20
    rd.polygon([(cx, cy), (cx + 900 * math.cos(a0), cy + 900 * math.sin(a0)), (cx + 900 * math.cos(a1), cy + 900 * math.sin(a1))], fill=(255, 230, 160, 45))
im.paste(ray, (0, 0), ray)
glow = Image.new("RGBA", (N, N), (0, 0, 0, 0))
ImageDraw.Draw(glow).ellipse((110, 70, 690, 650), fill=(255, 220, 140, 170))
glow = glow.filter(ImageFilter.GaussianBlur(70)); im.paste(glow, (0, 0), glow)

ch = Image.open(HERE + "karakter-asep-senyum.png").convert("RGBA")
bb = ch.getbbox()  # (x0, y0, x1, y1) seluruh badan
top = bb[1]
crop = ch.crop((bb[0] - 150, top - 40, bb[2] + 150, top + 1250))  # kepala + badan atas
k = 700 / crop.width * 0.88
crop = crop.resize((int(crop.width * k), int(crop.height * k)), Image.LANCZOS)
ox, oy = (N - crop.width) // 2, 125
sh = Image.new("RGBA", crop.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 110), mask=crop.split()[3]); sh = sh.filter(ImageFilter.GaussianBlur(12))
im.paste(sh, (ox + 8, oy + 12), sh); im.paste(crop, (ox, oy), crop)
im.save(HERE + "profil-asep.png")

p = im.copy(); m = Image.new("L", (N, N), 0); ImageDraw.Draw(m).ellipse((0, 0, N, N), fill=255)
bg = Image.new("RGB", (N, N), (255, 255, 255)); bg.paste(p, (0, 0), m)
bg.resize((400, 400)).save("/tmp/claude-0/-home-user-Alihamz55/098ccec3-2b03-5b1e-a227-a68601ae5ac6/scratchpad/prof.png")
print("ok", crop.size)
