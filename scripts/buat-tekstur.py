# Procedural "realistic" textures (numpy): gravel ground, wood grain, cloth weave, wrinkled tarp, stained plaster.
import numpy as np, sys
from PIL import Image, ImageFilter
out = sys.argv[1]; N = 1024; rng = np.random.default_rng(3)
def fbm(n, oct=6, seed=0):
    r = np.random.default_rng(seed); acc = np.zeros((n, n)); amp = 1.0; tot = 0
    for o in range(oct):
        s = 2 ** (o + 2); g = r.random((s + 1, s + 1)); g[-1] = g[0]; g[:, -1] = g[:, 0]
        im = Image.fromarray((g * 255).astype(np.uint8)).resize((n, n), Image.BICUBIC); acc += np.asarray(im) / 255 * amp; tot += amp; amp *= 0.55
    return acc / tot
def save(a, name, q=90): Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(f"{out}/{name}.jpg", quality=q)
yy, xx = np.mgrid[0:N, 0:N]
# gravel / packed market ground
base = fbm(N, 7, 1); img = np.zeros((N, N, 3)); dirt = np.array([132, 118, 98]); img[:] = dirt * (0.75 + 0.5 * base[..., None])
pts = rng.random((2600, 2)) * N; rad = rng.uniform(4, 13, 2600); cols = rng.uniform(0.55, 1.15, 2600)
for (px, py), r, c in zip(pts, rad, cols):
    x0, x1, y0, y1 = int(max(0, px - r - 2)), int(min(N, px + r + 3)), int(max(0, py - r - 2)), int(min(N, py + r + 3))
    sx, sy = xx[y0:y1, x0:x1] - px, yy[y0:y1, x0:x1] - py; d = (sx / r) ** 2 + (sy / (r * 0.8)) ** 2; m = d < 1
    shade = (1 - 0.45 * (sx + sy) / (2 * r))[..., None]; stone = np.array([150, 144, 136]) * c
    img[y0:y1, x0:x1][m] = (stone * shade)[m]
    ring = (d >= 1) & (d < 1.35); img[y0:y1, x0:x1][ring] *= 0.72
save(img * (0.85 + 0.3 * fbm(N, 4, 9))[..., None], "gravel")
# wood planks with grain
g = fbm(N, 5, 2); u = xx / N; plank = (yy // 128) % 8; img = np.zeros((N, N, 3))
grain = np.sin((u * 40 + g * 6 + plank * 1.7) * np.pi) * 0.5 + 0.5; tone = 0.8 + 0.25 * np.sin(plank * 2.3)
col = np.array([154, 104, 64]); img[:] = col * (0.7 + 0.35 * grain[..., None]) * tone[..., None]
img[(yy % 128) < 4] *= 0.45; knots = rng.random((14, 2)) * N
for kx, ky in knots: d = np.hypot((xx - kx) / 14, (yy - ky) / 7); img[d < 1] *= 0.6
save(img * (0.9 + 0.2 * fbm(N, 6, 5))[..., None], "wood")
# green cloth with weave + folds
weave = (np.sin(xx * 0.9) * np.sin(yy * 0.9)) * 0.06; folds = np.sin(xx / N * 18 + fbm(N, 3, 7) * 4) * 0.12
img = np.array([58, 130, 86]) * (0.85 + weave + folds + 0.15 * fbm(N, 5, 8))[..., None]; save(img, "cloth")
# wrinkled light tarp (tinted per stall by material colour)
wr = np.abs(np.sin(xx / N * 30 + fbm(N, 4, 11) * 9)) ** 0.6; img = np.full((N, N, 3), 235.0) * (0.78 + 0.22 * wr + 0.1 * fbm(N, 6, 12))[..., None]; save(img, "tarp")
# stained plaster wall
st = fbm(N, 7, 13); img = np.array([226, 210, 180]) * (0.78 + 0.3 * st)[..., None]; img[..., :2] *= (0.92 + 0.08 * fbm(N, 3, 14))[..., None]
crack = np.abs(np.sin(xx / N * 7 + fbm(N, 5, 15) * 12)) < 0.012; img[crack] *= 0.6; save(img, "plaster")
print("ok")
