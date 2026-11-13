"""Generator ebook "Belajar Menulis Huruf A-Z" (TK, 3-6 tahun) untuk alidraws.

Pakai:  python3 buat_huruf.py <folder-font> Belajar-Menulis-Huruf-A-Z.pdf
Folder font berisi Baloo2-ExtraBold.ttf (lihat skill: scripts/siapkan_font.sh).
Garis huruf untuk ditebalkan diambil dari huruf_garis.json (font garis tunggal Hershey "futural").
"""
import sys, os, json, random
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ebook-tts"))
import buat_tts as T
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

W, H, A4 = T.W, T.H, T.A4
DARK = "#1F2937"
HERE = os.path.dirname(os.path.abspath(__file__))
GARIS = json.load(open(os.path.join(HERE, "huruf_garis.json")))

KATA = [("A", "Ayam"), ("B", "Bola"), ("C", "Cicak"), ("D", "Domba"), ("E", "Ember"), ("F", "Flamingo"),
        ("G", "Gajah"), ("H", "Harimau"), ("I", "Ikan"), ("J", "Jeruk"), ("K", "Kuda"), ("L", "Lampu"),
        ("M", "Mobil"), ("N", "Nanas"), ("O", "Ombak"), ("P", "Pisang"), ("Q", "Quran"), ("R", "Roti"),
        ("S", "Sapi"), ("T", "Topi"), ("U", "Ular"), ("V", "Vas"), ("W", "Wortel"), ("X", "Xilofon"),
        ("Y", "Yoyo"), ("Z", "Zebra")]
WARNA = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#0EA5E9", "#8B5CF6", "#EC4899"]
MIRIP = {"b": "dpq", "d": "bpq", "p": "bdq", "q": "bdp", "m": "nw", "n": "mu", "u": "nv", "v": "uwy",
         "w": "vm", "M": "NW", "N": "MH", "W": "VM", "E": "FB", "F": "EP", "O": "QC", "Q": "OG",
         "C": "GO", "G": "CO", "I": "LT", "L": "IJ", "i": "lj", "l": "it", "j": "ig", "g": "qy"}

# ---------- huruf garis tunggal ----------
def bbox(ch):
    pts = [p for seg in GARIS[ch] for p in seg]
    return min(p[0] for p in pts), max(p[0] for p in pts)

def polylines(ch):
    out = []
    for a, b in GARIS[ch]:
        if out and out[-1][-1] == a: out[-1].append(b)
        else: out.append([a, b])
    return out

def lebar(ch, s):
    x0, x1 = bbox(ch); return (x1 - x0) * s

def gambar_huruf(cv, ch, x, base, cap, gaya):
    """gaya: 'putus' (untuk ditebalkan) atau 'contoh' (garis penuh)."""
    s = cap / 21.0
    x0, _ = bbox(ch)
    cv.saveState(); cv.setLineCap(1); cv.setLineJoin(1)
    if gaya == "contoh":
        cv.setStrokeColor(HexColor(DARK)); cv.setLineWidth(max(2.2, cap*0.075))
    else:
        cv.setStrokeColor(HexColor("#9CA3AF")); cv.setLineWidth(max(1.6, cap*0.055))
        cv.setDash(max(1.5, cap*0.05), max(2.5, cap*0.09))
    lines = polylines(ch)
    for pl in lines:
        p = cv.beginPath()
        for i, (px, py) in enumerate(pl):
            X, Y = x + (px - x0)*s, base - (py - 9)*s
            p.moveTo(X, Y) if i == 0 else p.lineTo(X, Y)
        cv.drawPath(p, stroke=1, fill=0)
    cv.restoreState()
    if gaya == "putus":  # titik mulai hijau
        px, py = lines[0][0]
        cv.setFillColor(HexColor("#22C55E")); cv.circle(x + (px - x0)*s, base - (py - 9)*s, max(2.2, cap*0.07), fill=1, stroke=0)

def garis_bantu(cv, x, base, w, cap):
    s = cap / 21.0
    top, mid, desc = base + cap, base + 14*s, base - 7*s
    cv.saveState()
    cv.setStrokeColor(HexColor("#93C5FD")); cv.setLineWidth(1); cv.line(x, top, x + w, top)
    cv.setStrokeColor(HexColor("#F87171")); cv.setLineWidth(1.4); cv.line(x, base, x + w, base)
    cv.setStrokeColor(HexColor("#93C5FD")); cv.setDash(3, 3); cv.setLineWidth(.9); cv.line(x, mid, x + w, mid)
    cv.setStrokeColor(HexColor("#DBEAFE")); cv.setDash(); cv.line(x, desc, x + w, desc)
    cv.restoreState()

def baris_latihan(cv, ch, x, base, w, cap, jumlah=None, contoh=True):
    garis_bantu(cv, x, base, w, cap)
    s = cap / 21.0; gap = cap * 0.55
    cx, n = x + 8, 0
    while cx + lebar(ch, s) <= x + w - 6 and (jumlah is None or n < jumlah):
        gambar_huruf(cv, ch, cx, base, cap, "contoh" if (contoh and n == 0) else "putus")
        cx += lebar(ch, s) + gap; n += 1

def kata_putus(cv, kata, x, base, cap):
    s = cap / 21.0
    for i, ch in enumerate(kata):
        gambar_huruf(cv, ch, x, base, cap, "putus")
        x += lebar(ch, s) + cap*0.28
    return x

def lebar_kata(kata, cap):
    s = cap / 21.0
    return sum(lebar(c, s) for c in kata) + cap*0.28*(len(kata) - 1)

# ---------- elemen halaman ----------
def kepala(cv, judul, color, sub=None):
    cv.setFillColor(HexColor(color)); cv.roundRect(16*mm, H-36*mm, W-32*mm, 20*mm, 10*mm, fill=1, stroke=0)
    cv.setFillColor(white); cv.setFont("Baloo", 28); cv.drawCentredString(W/2, H-29*mm, judul)

def label(cv, no, teks, x, y, color):
    cv.setFillColor(HexColor(color)); cv.circle(x + 4*mm, y + 1.6*mm, 4*mm, fill=1, stroke=0)
    cv.setFillColor(white); cv.setFont("SansB", 13); cv.drawCentredString(x + 4*mm, y - .3*mm, str(no))
    cv.setFillColor(HexColor(DARK)); cv.setFont("Baloo", 17); cv.drawString(x + 10*mm, y - .5*mm, teks)

def huruf_berongga(cv, teks, cx, cy, maxw, maxh):
    """Huruf 'gelembung' dari garis tunggal: garis tebal hitam lalu garis putih di atasnya."""
    gap = 0.35
    def ukur(cap):
        s = cap/21.0; return sum(lebar(c, s) for c in teks) + cap*gap*(len(teks)-1)
    cap = maxh*21/28.0
    if ukur(cap) > maxw: cap *= maxw/ukur(cap)
    s = cap/21.0; tebal = cap*0.30
    x = cx - ukur(cap)/2; base = cy - cap*0.40
    posisi = []
    for c in teks: posisi.append((c, x)); x += lebar(c, s) + cap*gap
    for warna, lw in ((HexColor(DARK), tebal + 6), (white, tebal)):
        cv.saveState(); cv.setLineCap(1); cv.setLineJoin(1); cv.setStrokeColor(warna); cv.setLineWidth(lw)
        for c, px0 in posisi:
            x0, _ = bbox(c)
            for pl in polylines(c):
                p = cv.beginPath()
                for i, (px, py) in enumerate(pl):
                    X, Y = px0 + (px - x0)*s, base - (py - 9)*s
                    p.moveTo(X, Y) if i == 0 else p.lineTo(X, Y)
                cv.drawPath(p, stroke=1, fill=0)
        cv.restoreState()

def kotak(cv, x, y, w, h, color, dash=False):
    cv.setFillColor(T.mix(color, .55)); cv.roundRect(x + 2.5, y - 2.5, w, h, 5*mm, fill=1, stroke=0)
    cv.setFillColor(white); cv.setStrokeColor(T.mix(color, .3)); cv.setLineWidth(2)
    cv.roundRect(x, y, w, h, 5*mm, fill=1, stroke=1)

def footer(cv, page):
    cv.setFillColor(HexColor("#6B7280")); cv.setFont("SansB", 9)
    cv.drawCentredString(W/2, 9*mm, f"★  Belajar Menulis Huruf A–Z  •  alidraws  •  hal. {page}  ★")

# ---------- halaman huruf ----------
def halaman_huruf(cv, idx, page):
    besar, kata = KATA[idx]; kecil = besar.lower(); color = WARNA[idx % len(WARNA)]
    T.page_frame(cv, color)
    kepala(cv, f"Huruf  {besar}  {kecil}", color)
    # bulatan huruf di kiri pita
    T.burst(cv, 30*mm, H-26*mm, 15*mm, HexColor("#FACC15"), n=14)
    cv.setFillColor(HexColor(DARK)); cv.setFont("Baloo", 34); cv.drawCentredString(30*mm, H-30*mm, besar)
    # nama & tanggal
    cv.setFillColor(HexColor(DARK)); cv.setFont("SansB", 12)
    cv.drawString(20*mm, H-45*mm, "Nama: ______________________")
    cv.drawRightString(W-20*mm, H-45*mm, "Tanggal: ______________")

    # 1. warnai
    top = H-52*mm
    label(cv, 1, "Warnai hurufnya!", 18*mm, top - 6*mm, color)
    kotak(cv, 18*mm, top - 78*mm, 84*mm, 68*mm, color)
    huruf_berongga(cv, besar + kecil, 60*mm, top - 44*mm, 70*mm, 46*mm)

    # kartu kata
    kx, kw = 108*mm, W - 18*mm - 108*mm
    label(cv, 2, f"{besar} untuk {kata}", kx, top - 6*mm, color)
    kotak(cv, kx, top - 78*mm, kw, 68*mm, color)
    cv.setFillColor(HexColor(DARK)); cv.setFont("Sans", 11); cv.drawString(kx + 5*mm, top - 19*mm, "Tebalkan katanya:")
    cap = 13*mm
    lk = lebar_kata(kata, cap)
    if lk > kw - 12*mm: cap *= (kw - 12*mm) / lk; lk = lebar_kata(kata, cap)
    base = top - 38*mm
    garis_bantu(cv, kx + 4*mm, base, kw - 8*mm, cap)
    kata_putus(cv, kata, kx + (kw - lk)/2, base, cap)
    # kotak gambar
    gx, gy, gw, gh = kx + 5*mm, top - 74*mm, kw - 10*mm, 27*mm
    cv.setStrokeColor(T.mix(color, .4)); cv.setLineWidth(1.5); cv.setDash(4, 3)
    cv.roundRect(gx, gy, gw, gh, 3*mm, fill=0, stroke=1); cv.setDash()
    cv.setFillColor(HexColor("#9CA3AF")); cv.setFont("Sans", 10)
    cv.drawCentredString(gx + gw/2, gy + 3*mm, f"Ayo gambar {'Al-Quran' if kata == 'Quran' else kata.lower()} di sini!")

    # 3. tebalkan kapital & kecil
    y = top - 90*mm
    label(cv, 3, f"Tebalkan huruf {besar} dan {kecil}. Mulai dari titik hijau", 18*mm, y, color)
    tw = pdfmetrics.stringWidth(f"Tebalkan huruf {besar} dan {kecil}. Mulai dari titik hijau", "Baloo", 17)
    cv.setFillColor(HexColor("#22C55E")); cv.circle(28*mm + tw + 3*mm, y + 1.6*mm, 2.2*mm, fill=1, stroke=0)
    cap = 15*mm; rx, rw = 20*mm, W - 40*mm
    rows = [(besar, True, None), (besar, False, 3), (kecil, True, None), (kecil, False, 3)]
    yb = y - 22*mm
    for ch, cth, jml in rows:
        baris_latihan(cv, ch, rx, yb, rw, cap, jumlah=jml, contoh=cth)
        yb -= 25*mm

    # 4. lingkari
    y = yb + 6*mm
    label(cv, 4, f"Lingkari semua huruf {besar} dan {kecil}!", 18*mm, y, color)
    rnd = random.Random(besar)
    pengecoh = list(MIRIP.get(kecil, "") + MIRIP.get(besar, ""))
    lain = [c for c in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" if c.lower() != kecil and c not in "Il"]
    isi = [besar]*3 + [kecil]*3
    while len(isi) < 14: isi.append(rnd.choice(pengecoh) if pengecoh and rnd.random() < .5 else rnd.choice(lain))
    rnd.shuffle(isi)
    n = len(isi); step = (W - 40*mm) / n; cy = y - 12*mm
    for i, ch in enumerate(isi):
        cx = 20*mm + step*(i + .5)
        cv.setFillColor(T.mix(WARNA[i % 7], .8)); cv.circle(cx, cy, step*.42, fill=1, stroke=0)
        cv.setFillColor(HexColor(DARK)); cv.setFont("Baloo", 20); cv.drawCentredString(cx, cy - 7, ch)
    footer(cv, page); cv.showPage()

# ---------- cover ----------
def cover(cv):
    T.sky(cv)
    T.rainbow(cv, W*0.5, H*0.40, W*0.62, 16)
    T.sun(cv, W-62, H-70, 34)
    T.cloud(cv, W*0.55, H-110, 30, .9); T.cloud(cv, W*0.40, H-50, 26, .9)
    T.cloud(cv, W*0.04, H*0.46, 34); T.cloud(cv, W*0.78, H*0.48, 36)
    for (x, y, r, c) in ((70, H-170, 10, "#FDE047"), (W-140, H-175, 8, "#F9A8D4"), (W*0.9, H*0.60, 9, "#FDE047"), (W*0.1, H*0.60, 8, "#FFFFFF")):
        T.star(cv, x, y, r, HexColor(c))
    s = 70; y1 = H*0.72
    for i, ch in enumerate("ABC"):
        T.tile(cv, W/2 - 1.5*s - 12 + i*(s + 12), y1 + 30, s, ch, WARNA[[0, 4, 3][i]], rot=[-6, 3, -3][i])
    T.outlined(cv, "BELAJAR MENULIS", W/2, y1 - 30, "Lucky", 46, white, HexColor("#1E3A8A"), 8)
    T.outlined(cv, "HURUF A-Z", W/2, y1 - 92, "Lucky", 62, HexColor("#FDE047"), HexColor("#1E3A8A"), 9)
    pw, ph, py = 300, 44, y1 - 150
    cv.setFillColor(HexColor("#9A3412")); cv.roundRect(W/2 - pw/2 + 3, py - 4, pw, ph, ph/2, fill=1, stroke=0)
    cv.setFillColor(HexColor("#F97316")); cv.roundRect(W/2 - pw/2, py, pw, ph, ph/2, fill=1, stroke=0)
    cv.setFillColor(white); cv.setFont("Baloo", 24); cv.drawCentredString(W/2, py + 12, "Untuk Anak TK • 3–6 Tahun")
    bx, by = 80, H - 80
    T.burst(cv, bx + 2, by - 3, 54, T.darker("#EF4444", .35)); T.burst(cv, bx, by, 54, HexColor("#EF4444"))
    cv.saveState(); cv.translate(bx, by); cv.rotate(12)
    cv.setFillColor(white); cv.setFont("SansB", 30); cv.drawCentredString(0, 2, "26")
    cv.setFont("SansB", 12); cv.drawCentredString(0, -14, "LEMBAR KERJA")
    cv.restoreState()
    T.pencil(cv, 30, H*0.33, 120, 25); T.pencil(cv, W-40, H*0.30, 120, 150)
    T.hills(cv)
    for (fx, fc) in ((40, "#F472B6"), (90, "#FDE047"), (W-60, "#A78BFA"), (W-110, "#FB7185"), (W*0.5, "#FFFFFF")):
        T.flower(cv, fx, 130 if fx in (40, W-60) else 105, 9, fc)
    cv.setFillColor(white); cv.roundRect(50, 40, W-100, 52, 14, fill=1, stroke=0)
    cv.setFillColor(HexColor("#15803D")); cv.setFont("SansB", 14)
    cv.drawCentredString(W/2, 70, "Menebalkan ✓  Mewarnai ✓  Mengenal Kata ✓")
    cv.setFillColor(HexColor("#374151")); cv.setFont("SansB", 12)
    cv.drawCentredString(W/2, 50, "Buku ini milik: ______________________________")
    cv.showPage()

def cara_pakai(cv):
    color = "#0EA5E9"
    T.page_frame(cv, color); kepala(cv, "Cara Memakai Buku Ini", color)
    steps = ["Cetak di kertas A4. Satu lembar untuk satu huruf.",
             "Warnai huruf besar dengan krayon atau pensil warna.",
             "Tebalkan kata, lalu gambar bendanya di kotak.",
             "Tebalkan huruf mulai dari titik hijau ●.",
             "Baris kedua: coba tulis sendiri di sisa garis.",
             "Lingkari semua huruf yang sama.",
             "Selesai? Warnai bintangnya di Tabel Bintangku!"]
    y = H-52*mm
    for i, st in enumerate(steps):
        cv.setFillColor(HexColor(WARNA[i])); cv.circle(27*mm, y+1.6*mm, 4.2*mm, fill=1, stroke=0)
        cv.setFillColor(white); cv.setFont("SansB", 13); cv.drawCentredString(27*mm, y-0.4*mm, str(i+1))
        cv.setFillColor(HexColor(DARK)); cv.setFont("Sans", 14); cv.drawString(35*mm, y, st)
        y -= 11*mm
    y -= 4*mm
    cv.setFillColor(HexColor("#0369A1")); cv.setFont("Baloo", 22); cv.drawCentredString(W/2, y, "Tabel Bintangku"); y -= 6*mm
    cols, cw, chh = 7, (W-44*mm)/7, 17*mm
    for i, (b, _) in enumerate(KATA):
        r, c = divmod(i, cols)
        if r == 3: c += 1  # baris terakhir (5 huruf) di tengah
        x, yy = 22*mm + c*cw, y - (r+1)*chh
        cv.setFillColor(T.mix(WARNA[i % 7], .82)); cv.roundRect(x+1.5*mm, yy, cw-3*mm, chh-2*mm, 3*mm, fill=1, stroke=0)
        cv.setFillColor(HexColor(DARK)); cv.setFont("Baloo", 16); cv.drawString(x+4*mm, yy+8*mm, b + b.lower())
        p = cv.beginPath(); import math
        sx, sy, sr = x + cw - 9*mm, yy + 6.5*mm, 4.5*mm
        for k in range(10):
            a = math.pi/2 + k*math.pi/5; rr = sr if k % 2 == 0 else sr*.45
            px, py = sx + rr*math.cos(a), sy + rr*math.sin(a)
            p.moveTo(px, py) if k == 0 else p.lineTo(px, py)
        p.close(); cv.setStrokeColor(HexColor("#CA8A04")); cv.setLineWidth(1.2); cv.setFillColor(white)
        cv.drawPath(p, fill=1, stroke=1)
    y -= 4*chh + 8*mm
    cv.setFillColor(HexColor("#FEF3C7")); cv.roundRect(22*mm, y-14*mm, W-44*mm, 19*mm, 4*mm, fill=1, stroke=0)
    cv.setFillColor(HexColor("#92400E")); cv.setFont("SansB", 12)
    cv.drawString(27*mm, y-1*mm, "Tips untuk Ayah, Bunda, dan Guru:")
    cv.setFont("Sans", 11)
    cv.drawString(27*mm, y-8*mm, "Cukup 1 huruf per hari, 10–15 menit. Pujilah usahanya, bukan kerapiannya.")
    footer(cv, 2); cv.showPage()

def sertifikat(cv, page):
    color = "#F59E0B"
    T.page_frame(cv, color)
    cv.setStrokeColor(HexColor("#F59E0B")); cv.setLineWidth(4)
    cv.roundRect(20*mm, 26*mm, W-40*mm, H-48*mm, 8*mm, fill=0, stroke=1)
    T.outlined(cv, "SERTIFIKAT", W/2, H-62*mm, "Lucky", 52, HexColor("#FDE047"), HexColor("#92400E"), 8)
    cv.setFillColor(HexColor(DARK)); cv.setFont("Baloo", 20); cv.drawCentredString(W/2, H-78*mm, "Selamat! Diberikan kepada")
    cv.setStrokeColor(HexColor(DARK)); cv.setLineWidth(1.2); cv.line(45*mm, H-100*mm, W-45*mm, H-100*mm)
    cv.setFont("Baloo", 18)
    cv.drawCentredString(W/2, H-115*mm, "karena sudah hebat belajar menulis")
    cv.drawCentredString(W/2, H-125*mm, "huruf A sampai Z!")
    for i, ch in enumerate("ABCDEFG"):
        T.tile(cv, W/2 - 3.5*16*mm + i*16*mm + 1*mm, H-160*mm, 14*mm, ch, WARNA[i], rot=(-4 if i % 2 else 4))
    T.burst(cv, W/2, H-200*mm, 22*mm, HexColor("#FACC15"), n=16)
    T.star(cv, W/2, H-199*mm, 13*mm, HexColor("#F97316"))
    cv.setFillColor(HexColor(DARK)); cv.setFont("Sans", 12)
    cv.drawString(35*mm, 50*mm, "Tanggal: ______________")
    cv.drawRightString(W-35*mm, 50*mm, "Tanda tangan: ______________")
    footer(cv, page); cv.showPage()

def back_cover(cv):
    T.sky(cv, "#FDE68A", "#FFF7ED")
    T.sun(cv, 55, H-60, 26); T.cloud(cv, W-150, H-60, 34); T.cloud(cv, W*0.35, H-45, 22, .9)
    T.outlined(cv, "BELAJAR SAMBIL", W/2, H-130, "Lucky", 40, HexColor("#F97316"), HexColor("#7C2D12"), 7)
    T.outlined(cv, "BERMAIN!", W/2, H-180, "Lucky", 48, HexColor("#22C55E"), HexColor("#14532D"), 7)
    cx, cw = 45, W-90
    txt = ("Bantu si kecil mengenal dan menulis huruf A sampai Z dengan cara yang seru: "
           "mewarnai, menebalkan, menggambar, dan mencari huruf. Cocok di rumah maupun di TK.")
    lines = T.wrap(txt, "Sans", 15, cw-40); ch = 26 + len(lines)*21; ctop = H-205
    cv.setFillColor(HexColor("#FDBA74")); cv.roundRect(cx+4, ctop-ch-5, cw, ch, 16, fill=1, stroke=0)
    cv.setFillColor(white); cv.roundRect(cx, ctop-ch, cw, ch, 16, fill=1, stroke=0)
    cv.setFillColor(HexColor(DARK)); cv.setFont("Sans", 15); y = ctop-30
    for ln in lines: cv.drawCentredString(W/2, y, ln); y -= 21
    y = ctop - ch - 45
    cv.setFillColor(HexColor("#7C2D12")); cv.setFont("Baloo", 22); cv.drawCentredString(W/2, y, "Di dalam buku ini")
    y -= 15
    feats = [("26", "lembar kerja huruf A–Z"), ("4", "aktivitas di setiap lembar"), ("★", "tabel bintang + sertifikat")]
    fw = (W-90)/3
    for i, (big, small) in enumerate(feats):
        fx = 45 + i*fw + fw/2; c = ["#0EA5E9", "#EC4899", "#22C55E"][i]
        T.burst(cv, fx, y-35, 34, HexColor(c), n=12)
        cv.setFillColor(white); cv.setFont("SansB", 22); cv.drawCentredString(fx, y-43, big)
        cv.setFillColor(HexColor(DARK)); cv.setFont("SansB", 12)
        for j, ln in enumerate(T.wrap(small, "SansB", 12, fw-10)): cv.drawCentredString(fx, y-87-j*14, ln)
    T.hills(cv)
    for (fx, fc) in ((40, "#F472B6"), (W-60, "#A78BFA"), (W*0.25, "#FDE047"), (W*0.75, "#FB7185")):
        T.flower(cv, fx, 110, 9, fc)
    cv.setFillColor(white); cv.setFont("Baloo", 20); cv.drawCentredString(W/2, 48, "lynk.id/alidraws")
    cv.showPage()

def main(fontdir, out):
    pdfmetrics.registerFont(TTFont("Baloo", os.path.join(fontdir, "Baloo2-ExtraBold.ttf")))
    pdfmetrics.registerFont(TTFont("Lucky", os.path.join(fontdir, "LuckiestGuy.ttf")))
    cv = canvas.Canvas(out, pagesize=A4); cv.setTitle("Belajar Menulis Huruf A-Z untuk Anak TK")
    cover(cv); cara_pakai(cv)
    for i in range(26): halaman_huruf(cv, i, i + 3)
    sertifikat(cv, 29); back_cover(cv); cv.save()

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
