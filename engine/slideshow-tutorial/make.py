"""Tutorial slideshow 'Cara Bikin Robot Kardus' -> frames/ + voice.wav + timing.json"""
import json, subprocess, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 30
SR = 48000
LEAD, GAP = 0.35, 0.22
TEXTS = [
    "Bikin robot dari kardus bekas? Bisa! Asep jamin, cuma sepuluh langkah!",
    "Langkah satu: ukur dan gambar polanya. Badan 12 x 10 senti, kepala 9 x 8.",
    "Dua: gunting semua potongannya. Lengan, kaki, sama telapak, masing-masing dua.",
    "Tiga: rakit badannya jadi kotak, kasih sekat di dalam biar kuat.",
    "Empat: bikin kepalanya, terus tempel panel wajah di depan.",
    "Lima: lengannya, tumpuk kardus biar tebal, pasang kiri kanan sama rata.",
    "Enam: pasang kaki sama telapaknya di bawah badan. Lemnya yang kenceng!",
    "Tujuh: bikin sendi dari lingkaran kardus 3 senti, biar tangannya bisa gerak.",
    "Delapan: tambahin mata, antena, sama panel tombol di dadanya.",
    "Sembilan: cat pakai kuas, tapi tekstur kardusnya biarin kelihatan.",
    "Sepuluh: jadi deh! Robot 24 senti. Namanya... Asep Junior! Kamu bikin juga, ya!",
]
TITLES = ["ROBOT DARI KARDUS BEKAS!", "UKUR & GAMBAR POLA", "GUNTING POTONGAN", "RAKIT BADAN",
          "BUAT KEPALA", "BUAT LENGAN", "PASANG KAKI", "SENDI BISA GERAK", "TAMBAH DETAIL",
          "CAT & FINISHING", "ROBOT JADI!"]
JUDGE = {1: "12x10 cm", 2: "x2", 3: "SEKAT!", 4: "WAJAH", 5: "TEBAL", 6: "LEM KENCENG!", 7: "Ø 3 cm",
         8: "ANTENA", 9: "KUAS", 10: "24 cm!"}
PANEL = [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

FR = ImageFont.truetype("fredoka.ttf", 50)
FR_S = ImageFont.truetype("fredoka.ttf", 34)
LI = lambda s: ImageFont.truetype("lilita.ttf", s)

# ---------- audio ----------
def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)

clips = [load(f"trim/l{i:02d}.wav") for i in range(len(TEXTS))]
t = LEAD; spans = []
for i, c in enumerate(clips):
    d = len(c) / SR; spans.append((t, t + d)); t += d + (GAP if i < len(clips) - 1 else 0.9)
TOTAL = t
N = int(TOTAL * FPS)
voice = np.zeros(int(TOTAL * SR) + SR, np.float32)
for (a, _), c in zip(spans, clips):
    i = int(a * SR); voice[i:i + len(c)] += c
voice = voice[:int(TOTAL * SR)]
import wave
with wave.open("voice.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(voice, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump({"total": TOTAL, "frames": N, "spans": spans}, open("timing.json", "w"))

# ---------- images ----------
panels = []
for i in range(10):
    p = Image.open(f"panels/p{i}.png").convert("RGB")
    big = p.resize((p.width * 4, p.height * 4), Image.LANCZOS).filter(ImageFilter.UnsharpMask(3, 80, 2))
    panels.append(big)

def bg_for(p):
    b = p.resize((int(H * p.width / p.height), H), Image.BILINEAR)
    x = (b.width - W) // 2; b = b.crop((x, 0, x + W, H)).filter(ImageFilter.GaussianBlur(40))
    dark = Image.new("RGB", (W, H), (30, 18, 8))
    return Image.blend(b, dark, 0.45)
BGS = [bg_for(p) for p in panels]

PW, PH = 1000, int(1000 * 224 / 367)  # panel window
PY = 640
mask = Image.new("L", (PW, PH), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, PW - 1, PH - 1), 36, fill=255)

def ease(x): x = max(0, min(1, x)); return 1 - (1 - x) ** 3
def back(x):
    x = max(0, min(1, x)); c = 1.70158; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

def text_c(d, cx, y, s, font, fill, stroke=0, sfill=(0, 0, 0)):
    w = d.textlength(s, font=font); d.text((cx - w / 2, y), s, font=font, fill=fill, stroke_width=stroke, stroke_fill=sfill)

def scaled_layer(draw_fn, size, scale, center):
    """Draw onto a layer then scale around center (for pop-in)."""
    L = Image.new("RGBA", size, (0, 0, 0, 0)); draw_fn(ImageDraw.Draw(L))
    if abs(scale - 1) < 1e-3: return L, (0, 0)
    sw, sh = max(1, int(size[0] * scale)), max(1, int(size[1] * scale))
    return L.resize((sw, sh), Image.BILINEAR), (int(center[0] - sw / 2), int(center[1] - sh / 2))

def wrap(words, font, maxw, d):
    lines, cur = [], []
    for w_ in words:
        test = " ".join(cur + [w_])
        if cur and d.textlength(test, font=font) > maxw: lines.append(cur); cur = [w_]
        else: cur.append(w_)
    if cur: lines.append(cur)
    return lines

def star(d, cx, cy, r, fill):
    pts = []
    for k in range(16):
        a = np.pi * k / 8 - np.pi / 2; rr = r if k % 2 == 0 else r * 0.45
        pts.append((cx + rr * np.cos(a), cy + rr * np.sin(a)))
    d.polygon(pts, fill=fill)

def seg_at(t):
    for i, (a, b) in enumerate(spans):
        nb = spans[i + 1][0] if i + 1 < len(spans) else TOTAL + 1
        if t < nb: return i
    return len(spans) - 1

dummy = ImageDraw.Draw(Image.new("RGB", (10, 10)))

def frame(n):
    t = n / FPS
    i = seg_at(t); a, b = spans[i]
    st = a - (LEAD if i == 0 else GAP)  # scene start
    lt = t - st
    pi = PANEL[i]
    img = BGS[pi].copy()
    # ---- panel with ken burns + slide-in ----
    p = panels[pi]
    z = 1.04 + 0.10 * min(1, lt / max(0.1, b - st + GAP))
    if i in (6, 10) and t > (a + b) / 2: z += 0.06 * ease((t - (a + b) / 2) / 0.25)  # kick on punch
    cw, ch = p.width / z, p.width / z * PH / PW
    fx = 0.5 + 0.08 * np.sin(i * 1.7); fy = 0.5 + 0.08 * np.cos(i * 2.3)
    x0 = (p.width - cw) * fx; y0 = (p.height - ch) * fy
    win = p.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((PW, PH), Image.BILINEAR)
    k = ease(lt / 0.35)
    dx = int((1 - k) * (W if i % 2 else -W) * 0.9)
    sh = Image.new("RGBA", (PW + 60, PH + 60), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((30, 40, PW + 30, PH + 40), 40, fill=(0, 0, 0, 140))
    sh = sh.filter(ImageFilter.GaussianBlur(16))
    img.paste(sh, ((W - PW) // 2 - 30 + dx, PY - 30), sh)
    fr = Image.new("RGB", (PW + 16, PH + 16), (255, 246, 225))
    fm = Image.new("L", fr.size, 0); ImageDraw.Draw(fm).rounded_rectangle((0, 0, fr.width - 1, fr.height - 1), 44, fill=255)
    img.paste(fr, ((W - PW) // 2 - 8 + dx, PY - 8), fm)
    img.paste(win, ((W - PW) // 2 + dx, PY), mask)
    d = ImageDraw.Draw(img, "RGBA")

    # ---- top: series card ----
    d.rounded_rectangle((300, 120, 780, 182), 31, fill=(255, 210, 60))
    text_c(d, 540, 128, "TUTORIAL ALA ASEP", LI(44), (60, 30, 10))

    # ---- step badge + title (pop) ----
    s = back(lt / 0.4)
    def draw_title(dd):
        if i == 0:
            text_c(dd, 540, 40, "CARA BIKIN", LI(76), (255, 255, 255), 7, (40, 20, 5))
            text_c(dd, 540, 125, TITLES[0], LI(66), (255, 214, 60), 8, (40, 20, 5))
        else:
            lab = f"LANGKAH {i}"
            dd.rounded_rectangle((540 - 190, 30, 540 + 190, 120), 45, fill=(230, 60, 50), outline=(255, 255, 255), width=6)
            text_c(dd, 540, 40, lab, LI(66), (255, 255, 255))
            text_c(dd, 540, 140, TITLES[i], LI(82), (255, 255, 255), 8, (40, 20, 5))
    L, off = scaled_layer(draw_title, (W, 260), s, (540, 130))
    img.paste(L, (off[0], 250 + off[1]), L)

    # ---- judge keyword with star burst ----
    if i in JUDGE:
        jt = t - (a + (b - a) * 0.45)
        if jt > 0:
            js = back(jt / 0.3)
            def draw_j(dd):
                star(dd, 200, 200, 150, (255, 214, 60, 255))
                star(dd, 200, 200, 115, (255, 120, 40, 255))
                f = LI(54 if len(JUDGE[i]) < 7 else 40)
                w_ = dd.textlength(JUDGE[i], font=f)
                dd.text((200 - w_ / 2, 170), JUDGE[i], font=f, fill=(255, 255, 255), stroke_width=5, stroke_fill=(90, 20, 10))
            L, off = scaled_layer(draw_j, (400, 400), js, (200, 200))
            L = L.rotate(-12, resample=Image.BILINEAR)
            img.paste(L, (760 - 200 + off[0], PY + PH - 230 + off[1]), L)

    # ---- subtitle board (Asep) ----
    words = TEXTS[i].split()
    lines = wrap(words, FR, 940, dummy)
    lh = 66; bh = len(lines) * lh + 50; by = 1550 - bh // 2 + 40
    d.rounded_rectangle((60, by, 1020, by + bh), 34, fill=(25, 90, 160, 235), outline=(255, 255, 255, 255), width=5)
    d.rounded_rectangle((90, by - 34, 260, by + 20), 22, fill=(255, 214, 60), outline=(255, 255, 255), width=4)
    text_c(d, 175, by - 30, "ASEP", LI(44), (40, 20, 5))
    # active word by char-proportional timing
    tot = sum(len(w_) + 1 for w_ in words); prog = (t - a) / max(0.1, b - a) * tot
    acc = 0; wi = 0; active = -1
    for li_, ln in enumerate(lines):
        lw = dummy.textlength(" ".join(ln), font=FR); x = 540 - lw / 2; y = by + 22 + li_ * lh
        for w_ in ln:
            if acc <= prog < acc + len(w_) + 1 and a <= t <= b: active = wi
            col = (255, 220, 50) if wi == active else (255, 255, 255)
            d.text((x, y), w_, font=FR, fill=col, stroke_width=4, stroke_fill=(10, 30, 60))
            x += dummy.textlength(w_ + " ", font=FR); acc += len(w_) + 1; wi += 1

    # ---- progress dots ----
    for k_ in range(10):
        cx = 540 - 9 * 26 + k_ * 52; on = k_ < i
        d.ellipse((cx - 12, 1790 - 12, cx + 12, 1790 + 12), fill=(255, 214, 60) if on else (255, 255, 255, 90))
    text_c(d, 540, 1840, "Konten komedi. Semua tokoh fiktif.", FR_S, (255, 255, 255, 200))
    # fade in/out
    if t < 0.25 or t > TOTAL - 0.3:
        f = min(t / 0.25, (TOTAL - t) / 0.3); img = Image.blend(Image.new("RGB", (W, H)), img, max(0, min(1, f)))
    return img

if __name__ == "__main__":
    os.makedirs("frames", exist_ok=True)
    if sys.argv[1] == "test":
        for n in map(int, sys.argv[2].split(",")): frame(n).save(f"test_{n}.jpg", quality=90)
    else:
        k, m = map(int, sys.argv[1:3])
        for n in range(k, N, m): frame(n).save(f"frames/f{n:04d}.jpg", quality=92)
    print("TOTAL", TOTAL, "N", N)
