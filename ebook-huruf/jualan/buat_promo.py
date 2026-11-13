"""Halaman promo untuk sampel gratis. Pakai: python3 jualan/buat_promo.py <folder-font> jualan/promo.pdf"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import buat_huruf as B
T = B.T
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white

fd, out = sys.argv[1], sys.argv[2]
pdfmetrics.registerFont(TTFont("Baloo", os.path.join(fd, "Baloo2-ExtraBold.ttf")))
pdfmetrics.registerFont(TTFont("Lucky", os.path.join(fd, "LuckiestGuy.ttf")))
W, H = B.W, B.H
cv = canvas.Canvas(out, pagesize=B.A4)
T.sky(cv, "#FDE68A", "#FFF7ED"); T.sun(cv, 55, H-60, 26); T.cloud(cv, W-150, H-60, 34)
T.outlined(cv, "ANAKMU SUKA?", W/2, H-135, "Lucky", 46, HexColor("#F97316"), HexColor("#7C2D12"), 7)
T.outlined(cv, "MASIH ADA 25 HURUF LAGI!", W/2, H-185, "Lucky", 32, HexColor("#22C55E"), HexColor("#14532D"), 6)
s, y0 = 44, H-250
for r, row in enumerate(["BCDEFGHIJKLM", "NOPQRSTUVWXYZ"]):
    x = W/2 - len(row)*s/2
    for i, ch in enumerate(row):
        T.tile(cv, x + i*s + 2, y0 - r*(s+12), s-6, ch, B.WARNA[(i + r) % 7], rot=(-4 if i % 2 else 4))
y = y0 - 2*(s+12) - 30
cv.setFillColor(HexColor("#1F2937")); cv.setFont("SansB", 15)
for ln in ["✓ 26 lembar kerja huruf A–Z   ✓ Mewarnai & menebalkan",
           "✓ Tabel bintang + sertifikat   ✓ Siap cetak A4"]:
    cv.drawCentredString(W/2, y, ln); y -= 22
y -= 25
cv.setFillColor(HexColor("#9A3412")); cv.roundRect(W/2-170+3, y-58-4, 340, 70, 35, fill=1, stroke=0)
cv.setFillColor(HexColor("#F97316")); cv.roundRect(W/2-170, y-58, 340, 70, 35, fill=1, stroke=0)
cv.setFillColor(white); cv.setFont("Baloo", 16); cv.drawCentredString(W/2, y-18, "Dapatkan versi lengkap di")
cv.setFont("Baloo", 26); cv.drawCentredString(W/2, y-46, "lynk.id/alidraws")
cv.linkURL("https://lynk.id/alidraws", (W/2-170, y-58, W/2+170, y+12), relative=0)
T.hills(cv)
T.outlined(cv, "SELAMAT BELAJAR!", W/2, 45, "Lucky", 26, white, HexColor("#14532D"), 6)
cv.showPage(); cv.save()
