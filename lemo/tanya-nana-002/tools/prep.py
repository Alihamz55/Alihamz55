"""Siapkan data peta: tile ketinggian AWS Terrarium (z5), garis pantai Natural Earth 50m.
Keluaran: data/albedo.jpg (warna dasar + relief & bayangan dipanggang), data/height.bin (float32), data/meta.json,
data/cities.json. Semua unduhan dicatat di data/DOWNLOADS.log."""
import io, json, math, pathlib, time, urllib.request
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

HERE = pathlib.Path(__file__).resolve().parent.parent
D = HERE / "data"; C = D / "cache"; C.mkdir(parents=True, exist_ok=True)
LOG = open(D / "DOWNLOADS.log", "a")

def get(url, name):
    p = C / name
    if not p.exists():
        with urllib.request.urlopen(url, timeout=60) as r: p.write_bytes(r.read())
        LOG.write(f"{time.strftime('%Y-%m-%d')} {url}\n")
    return p

meta = {}
def build(NAME, Z, X0, X1, LATN, LATS, SMALL, STEPS):
    def lat2y(lat): return (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * 2**Z
    Y0, Y1 = int(lat2y(LATN)), int(lat2y(LATS))
    print("tiles", X0, X1, Y0, Y1)
    rows = []
    for y in range(Y0, Y1 + 1):
        row = []
        for x in range(X0, X1 + 1):
            p = get(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png", f"t{Z}_{x}_{y}.png")
            a = np.asarray(Image.open(p).convert("RGB")).astype(np.float64)
            row.append(a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768)
        rows.append(np.concatenate(row, 1))
    H = np.concatenate(rows, 0).astype(np.float32)          # meter, grid Mercator
    h, w = H.shape
    def tile2lon(x): return x / 2**Z * 360 - 180
    def tile2lat(y): return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / 2**Z))))
    lon0, lon1 = tile2lon(X0), tile2lon(X1 + 1)
    lat0, lat1 = tile2lat(Y0), tile2lat(Y1 + 1)              # utara, selatan
    print("grid", w, h, "lon", lon0, lon1, "lat", lat0, lat1)

    # Masker darat dari Natural Earth 50m (domain publik)
    land = json.loads(get("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson", "ne_50m_land.geojson").read_text())
    def px(lon, lat):
        X = (lon + 180) / 360 * 2**Z
        Y = lat2y(max(-85, min(85, lat)))
        return ((X - X0) * 256, (Y - Y0) * 256)
    mask_img = Image.new("L", (w, h), 0); dr = ImageDraw.Draw(mask_img)
    for f in land["features"]:
        g = f["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            for k, ring in enumerate(poly):
                dr.polygon([px(*pt) for pt in ring], fill=255 if k == 0 else 0)
    M = np.asarray(mask_img).astype(np.float32) / 255
    Mb = ndimage.gaussian_filter(M, 0.7)

    # Relief: hillshade dengan matahari rendah (20°) dari barat daya + bayangan jatuh
    EXAG = 10.0
    cell_km = 40075 / 2**Z / 256 * np.cos(np.radians(np.linspace(lat0, lat1, h)))[:, None]   # km per piksel (lokal)
    Hl = np.where(M > 0.5, np.maximum(H, 0), 0) * EXAG / 1000          # km dibesarkan
    gy, gx = np.gradient(ndimage.gaussian_filter(Hl, 0.8))
    gx /= cell_km; gy /= cell_km
    az, alt = math.radians(225), math.radians(20)
    L = np.array([math.sin(az) * math.cos(alt), -math.cos(az) * math.cos(alt), math.sin(alt)])  # x timur, y selatan (ke bawah)
    nz = 1 / np.sqrt(gx**2 + gy**2 + 1)
    shade = np.clip((-gx * L[0] - gy * L[1] + L[2]) * nz, 0, 1)
    # bayangan jatuh: langkah menuju matahari
    sh = np.ones_like(Hl)
    dx, dy = L[0], L[1]; tanalt = math.tan(alt)
    for s in range(1, STEPS, 2):
        ox, oy = -dx * s, -dy * s   # geser peta ke arah matahari
        shifted = ndimage.shift(Hl, (oy * -1, ox * -1), order=1, mode="nearest")
        rise = shifted - Hl - s * cell_km * tanalt
        sh = np.minimum(sh, np.clip(1 - rise * 0.8, 0.45, 1))
    sh = ndimage.gaussian_filter(sh, 1.2)
    light = 0.35 + 0.75 * shade * sh

    # Warna: darat netral hangat (satu warna, tanpa ramp), laut menurut kedalaman asli
    landc = np.array([214, 196, 160]) / 255
    deep, mid, shallow = np.array([14, 34, 48]) / 255, np.array([22, 62, 82]) / 255, np.array([42, 104, 108]) / 255
    dep = np.clip(-H, 0, 6000)
    t1 = np.clip(dep / 200, 0, 1)[..., None]; t2 = np.clip((dep - 200) / 3500, 0, 1)[..., None]
    sea = shallow * (1 - t1) + mid * t1
    sea = sea * (1 - t2) + deep * t2
    sea *= (0.92 + 0.08 * ndimage.gaussian_filter(np.clip(-H, 0, 6000) / 6000, 3))[..., None]
    landrgb = landc[None, None, :] * light[..., None]
    landrgb = landrgb * np.array([1.04, 1.0, 0.94])          # sedikit hangat
    rgb = sea * (1 - Mb[..., None]) + landrgb * Mb[..., None]
    # garis pantai tipis lebih terang
    coast = np.clip(ndimage.gaussian_gradient_magnitude(Mb, 0.8) * 3, 0, 1)[..., None]
    rgb = rgb * (1 - coast * 0.35) + np.array([0.95, 0.88, 0.72]) * coast * 0.35
    Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8)).save(D / f"albedo_{NAME}.jpg", quality=92)

    # Grid ketinggian untuk mesh (1/4 resolusi), dalam km dibesarkan; laut dibuat datar sedikit di bawah 0
    small = ndimage.zoom(np.where(M > 0.5, np.maximum(H, 0), 0) * EXAG / 1000, SMALL, order=1).astype(np.float32)
    small.tofile(D / f"height_{NAME}.bin")
    meta[NAME] = ({"lon0": lon0, "lon1": lon1, "lat0": lat0, "lat1": lat1, "w": w, "h": h, "gw": small.shape[1], "gh": small.shape[0],
               "exag": EXAG, "z": Z, "x0": X0, "y0": Y0})


build("wide", 5, 14, 29, 56, -45, 0.25, 60)
build("near", 7, 100, 103, -1, -9.5, 0.5, 120)
json.dump(meta, open(D / "meta.json", "w"), indent=1)

# Negara (hanya untuk MEMERIKSA bahwa Tiongkok tidak masuk frame; tidak digambar)
adm = json.loads(get("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson", "ne_50m_admin0.geojson").read_text())
cn = []
for f in adm["features"]:
    if f["properties"].get("ADM0_A3") in ("CHN", "TWN"):
        g = f["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for poly in polys:
            cn += [[round(a, 2), round(b, 2)] for a, b in poly[0][::3]]
json.dump(cn, open(D / "china_check.json", "w"))
print("ok", len(cn), "titik cek")
