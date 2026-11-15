import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
src, out, prev = sys.argv[1:4]
im = Image.open(src).convert("RGB")
print("src", im.size)
a = np.asarray(im).astype(np.float32)
H, W = a.shape[:2]
CW, CH = 2560, 1440
# posisi: papan (tengah kira-kira y=380 dari 793) tepat di tengah kanvas
sy = 380 * H / 793
x0 = (CW - W) // 2
y0 = int(CH / 2 - sy)
L, R = x0, CW - W - x0
T, B = y0, CH - H - y0
print("pad", L, R, T, B)
# --- kiri/kanan: cermin strip tepi yang hanya berisi bata/lantai
s = int(W * 0.115)
def side(strip, n):  # strip urut kiri->kanan, hasil utk sisi kiri
    parts, need, flip = [], n, False
    while need > 0:
        p = strip[:, ::-1] if flip else strip
        p = p[:, :need] if flip else p[:, :need]
        parts.append(p); need -= p.shape[1]; flip = not flip
    return np.concatenate(parts, axis=1)[:, ::-1]  # terdekat ke gambar di kanan
left = side(a[:, :s], L)
right = side(a[:, ::-1][:, :s], R)[:, ::-1]
fx = (np.linspace(0.12, 1, L) ** 0.8)[None, :, None]
left *= fx; right *= (np.linspace(1, 0.12, R) ** 0.8)[None, :, None]
row = np.concatenate([left, a, right], axis=1)
# --- atas: cermin baris bata di atas papan, buang kerucut lampu di tengah
h = int(H * 0.26)
top = row[:h]
reps = [top if i % 2 == 0 else top[::-1] for i in range(T // h + 2)]
top = np.concatenate(reps, axis=0)[:T][::-1].copy()
c0, c1 = x0 + int(W * 0.30), x0 + int(W * 0.70)
w = c1 - c0
m = w // 2
top[:, c0:c0 + m] = top[:, c0 - m:c0][:, ::-1]
top[:, c1 - m:c1] = top[:, c1:c1 + m][:, ::-1]
top *= (np.linspace(0.05, 1, T) ** 1.3)[:, None, None]
# --- bawah: lanjutkan lantai merah
bot = np.repeat(row[-1:], B, axis=0) * np.linspace(1, 0.6, B)[:, None, None]
full = np.concatenate([top, row, bot], axis=0).clip(0, 255).astype(np.uint8)
img = Image.fromarray(full)
# haluskan sambungan atas & lanjutkan kerucut lampu ke atas
ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
d = ImageDraw.Draw(ov)
xl, xr = x0 + W * 850 / 1983, x0 + W * 1160 / 1983
cx = (xl + xr) / 2
d.polygon([(xl - 6, y0 + 6), (xr + 6, y0 + 6), (cx + 70, y0 - 110), (cx - 70, y0 - 110)], fill=(175, 130, 255, 150))
ov = ov.filter(ImageFilter.GaussianBlur(7))
d = ImageDraw.Draw(ov)
d.polygon([(cx - 105, y0 - 100), (cx + 105, y0 - 100), (cx + 60, y0 - 170), (cx - 60, y0 - 170)], fill=(20, 12, 45, 255))
d.ellipse([cx - 105, y0 - 122, cx + 105, y0 - 80], fill=(240, 225, 255, 255))
d.rectangle([cx - 8, 0, cx + 8, y0 - 168], fill=(20, 12, 45, 255))
ov = ov.filter(ImageFilter.GaussianBlur(2))
img = Image.alpha_composite(img.convert("RGBA"), ov).convert("RGB")
img.save(out, optimize=True)
p = img.copy(); d = ImageDraw.Draw(p)
d.rectangle([507, 508, 2053, 931], outline="#00ff00", width=5)   # HP
d.rectangle([0, 508, 2559, 931], outline="#ffff00", width=3)     # desktop
p.resize((1280, 720)).save(prev)
