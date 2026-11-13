"""Alat PDF untuk ebook alidraws.

Ganti halaman pertama & terakhir dengan gambar cover (mis. hasil Figma/Canva):
  python3 pdf_alat.py ganti-cover ebook.pdf --depan depan.png --belakang belakang.png --out ebook.pdf

Ambil beberapa halaman jadi sampel (nomor halaman mulai 1), boleh tambah PDF lain di belakang:
  python3 pdf_alat.py sampel ebook.pdf --halaman 1,2,3 --tambah promo.pdf --out SAMPEL-GRATIS.pdf

Render satu halaman ke PNG (untuk thumbnail):
  python3 pdf_alat.py render ebook.pdf --halaman 3 --dpi 110 --out hal3.png
"""
import argparse, io, subprocess, os, tempfile
from pypdf import PdfReader, PdfWriter
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4


def halaman_gambar(path):
    W, H = A4
    im = Image.open(path).convert("RGB")
    tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False).name
    im.save(tmp, quality=92)
    b = io.BytesIO(); c = canvas.Canvas(b, pagesize=A4); c.drawImage(tmp, 0, 0, W, H); c.showPage(); c.save()
    os.unlink(tmp); b.seek(0)
    return PdfReader(b).pages[0]


ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest="cmd", required=True)
g = sp.add_parser("ganti-cover"); g.add_argument("pdf"); g.add_argument("--depan"); g.add_argument("--belakang"); g.add_argument("--out", required=True)
s = sp.add_parser("sampel"); s.add_argument("pdf"); s.add_argument("--halaman", required=True); s.add_argument("--tambah", action="append", default=[]); s.add_argument("--out", required=True)
r = sp.add_parser("render"); r.add_argument("pdf"); r.add_argument("--halaman", type=int, required=True); r.add_argument("--dpi", type=int, default=110); r.add_argument("--out", required=True)
a = ap.parse_args()

if a.cmd == "ganti-cover":
    src = PdfReader(a.pdf); pages = list(src.pages); w = PdfWriter()
    if a.depan: pages[0] = halaman_gambar(a.depan)
    if a.belakang: pages[-1] = halaman_gambar(a.belakang)
    for p in pages: w.add_page(p)
    w.write(a.out); print("halaman:", len(pages))
elif a.cmd == "sampel":
    src = PdfReader(a.pdf); w = PdfWriter()
    for n in a.halaman.split(","): w.add_page(src.pages[int(n) - 1])
    for t in a.tambah:
        for p in PdfReader(t).pages: w.add_page(p)
    w.write(a.out); print("halaman sampel:", len(w.pages))
elif a.cmd == "render":
    base = a.out[:-4] if a.out.endswith(".png") else a.out
    subprocess.run(["pdftoppm", "-r", str(a.dpi), "-png", "-singlefile", "-f", str(a.halaman), "-l", str(a.halaman), a.pdf, base], check=True)
    print("tersimpan:", base + ".png")
