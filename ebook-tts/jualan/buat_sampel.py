import sys, io
sys.path.insert(0, "/home/user/Alihamz55/ebook-tts")
import buat_tts as T
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from pypdf import PdfReader, PdfWriter
W, H = T.W, T.H
title, color, words = T.THEMES[0]
data = T.best_layout(words)
sub, nums = data[0], data[1]
buf = io.BytesIO(); cv = canvas.Canvas(buf, pagesize=T.A4)
# --- answer key TTS 1 ---
T.page_frame(cv, "#22C55E")
cv.setFillColor(HexColor("#22C55E")); cv.roundRect(16*mm, H-36*mm, W-32*mm, 20*mm, 10*mm, fill=1, stroke=0)
cv.setFillColor(white); cv.setFont("SansB", 22); cv.drawCentredString(W/2, H-28.5*mm, "Kunci Jawaban TTS 1: Dunia Hewan")
h, w = len(sub), len(sub[0]); cell = min((W-50*mm)/w, 150*mm/h, 13*mm)
T.draw_grid(cv, sub, nums, (W-cell*w)/2, H-50*mm, cell, color, fill=True)
y = H-50*mm-cell*h-14*mm
cv.setFillColor(HexColor("#FEF3C7")); cv.roundRect(20*mm, y-22*mm, W-40*mm, 26*mm, 5*mm, fill=1, stroke=0)
cv.setFillColor(HexColor("#92400E")); cv.setFont("SansB", 15); cv.drawCentredString(W/2, y-6*mm, "Berapa jawaban yang benar? ★")
cv.setFont("Sans", 12); cv.drawCentredString(W/2, y-14*mm, "12 benar = Juara!   9–11 = Hebat!   kurang dari 9 = Ayo coba lagi!")
T.footer(cv, "sampel"); cv.showPage()
# --- promo page ---
T.sky(cv, "#FDE68A", "#FFF7ED")
T.sun(cv, 55, H-60, 26); T.cloud(cv, W-150, H-60, 34)
T.outlined(cv, "Anakmu Suka?", W/2, H-130, "SansB", 40, HexColor("#F97316"), HexColor("#7C2D12"), 7)
T.outlined(cv, "Masih Ada 9 TTS Lagi!", W/2, H-180, "SansB", 32, HexColor("#22C55E"), HexColor("#14532D"), 6)
rest = T.THEMES[1:]
colw = (W-90)/2; y0 = H-230
for i, (t, c, _) in enumerate(rest):
    col, row = i % 2, i // 2
    px, py = 45 + col*colw + 5, y0 - (row+1)*38
    if i == 8: px = W/2 - (colw-10)/2
    cv.setFillColor(HexColor(c)); cv.roundRect(px, py, colw-10, 30, 15, fill=1, stroke=0)
    cv.setFillColor(white); cv.circle(px+16, py+15, 11, fill=1, stroke=0)
    cv.setFillColor(HexColor(c)); cv.setFont("SansB", 12); cv.drawCentredString(px+16, py+10.5, str(i+2))
    cv.setFillColor(white); cv.setFont("SansB", 14); cv.drawString(px+34, py+10, t)
y = y0 - 5*38 - 40
cv.setFillColor(HexColor("#1F2937")); cv.setFont("SansB", 15)
for ln in ["✓ 120 kosakata baru   ✓ Huruf besar   ✓ Kunci jawaban lengkap", "✓ Siap cetak A4   ✓ Cocok untuk kelas 1–6"]:
    cv.drawCentredString(W/2, y, ln); y -= 22
# CTA
y -= 20
cv.setFillColor(HexColor("#9A3412")); cv.roundRect(W/2-170+3, y-58-4, 340, 70, 35, fill=1, stroke=0)
cv.setFillColor(HexColor("#F97316")); cv.roundRect(W/2-170, y-58, 340, 70, 35, fill=1, stroke=0)
cv.setFillColor(white); cv.setFont("SansB", 15); cv.drawCentredString(W/2, y-16, "Dapatkan versi lengkap di")
cv.setFont("SansB", 24); cv.drawCentredString(W/2, y-44, "lynk.id/alidraws")
cv.linkURL("https://lynk.id/alidraws", (W/2-170, y-58, W/2+170, y+12), relative=0)
T.hills(cv)
T.outlined(cv, "Selamat bermain dan belajar!", W/2, 45, "SansB", 22, white, HexColor("#14532D"), 6)
cv.showPage(); cv.save(); buf.seek(0)
extra = PdfReader(buf)
src = PdfReader("TTS-Ceria-Anak-SD.pdf")
out = PdfWriter()
for i in (0, 1, 2): out.add_page(src.pages[i])   # cover, how-to, TTS 1
out.add_page(extra.pages[0]); out.add_page(extra.pages[1])
out.add_metadata({"/Title": "SAMPEL GRATIS - TTS Ceria untuk Anak SD"})
out.write("jualan/SAMPEL-GRATIS-TTS-Ceria.pdf")
print("pages", len(out.pages))
