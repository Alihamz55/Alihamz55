import random
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white, black

pdfmetrics.registerFont(TTFont("Sans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("SansB", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))

THEMES = [
 ("Dunia Hewan", "#F59E0B", [
  ("GAJAH","Hewan besar yang punya belalai"),
  ("JERAPAH","Hewan berleher sangat panjang"),
  ("KUCING","Hewan peliharaan yang suka mengeong"),
  ("KELINCI","Hewan bertelinga panjang yang suka wortel"),
  ("HARIMAU","Kucing besar berbulu loreng"),
  ("BEBEK","Unggas yang bunyinya \"kwek-kwek\""),
  ("KUDA","Hewan yang bisa ditunggangi dan berlari kencang"),
  ("ULAR","Hewan melata yang tidak punya kaki"),
  ("PENYU","Hewan laut bercangkang yang bertelur di pantai"),
  ("MONYET","Hewan yang pandai memanjat dan suka pisang"),
  ("SAPI","Hewan penghasil susu yang bunyinya \"mooo\""),
  ("KOMODO","Kadal raksasa dari Nusa Tenggara Timur"),
 ]),
 ("Buah-Buahan", "#EF4444", [
  ("PISANG","Buah panjang berkulit kuning"),
  ("SEMANGKA","Buah besar berkulit hijau, isinya merah dan berair"),
  ("DURIAN","Raja buah yang kulitnya berduri"),
  ("APEL","Buah bulat merah atau hijau yang renyah"),
  ("JERUK","Buah oranye yang kaya vitamin C"),
  ("MANGGA","Buah berdaging kuning, salah satu jenisnya harum manis"),
  ("ANGGUR","Buah kecil bergerombol, warnanya ungu atau hijau"),
  ("NANAS","Buah bermahkota daun dan kulitnya bersisik"),
  ("SALAK","Buah yang kulitnya mirip sisik ular"),
  ("RAMBUTAN","Buah merah yang kulitnya berambut"),
  ("PEPAYA","Buah oranye lonjong yang baik untuk pencernaan"),
  ("KELAPA","Buah berair dari pohon tinggi di tepi pantai"),
 ]),
 ("Benda di Rumah", "#3B82F6", [
  ("KURSI","Tempat untuk duduk"),
  ("MEJA","Tempat menaruh buku saat belajar"),
  ("LEMARI","Tempat menyimpan pakaian"),
  ("KASUR","Alas tidur yang empuk"),
  ("BANTAL","Alas kepala saat tidur"),
  ("SAPU","Alat untuk membersihkan lantai dari debu"),
  ("PIRING","Tempat menaruh nasi saat makan"),
  ("SENDOK","Alat makan untuk menyuap nasi"),
  ("GELAS","Wadah untuk minum"),
  ("CERMIN","Benda untuk melihat bayangan diri sendiri"),
  ("KOMPOR","Alat untuk memasak di dapur"),
  ("LAMPU","Benda yang menerangi ruangan saat gelap"),
 ]),
 ("Anggota Tubuh", "#EC4899", [
  ("MATA","Bagian tubuh untuk melihat"),
  ("TELINGA","Bagian tubuh untuk mendengar"),
  ("HIDUNG","Bagian tubuh untuk mencium bau"),
  ("LIDAH","Bagian tubuh untuk merasakan rasa makanan"),
  ("TANGAN","Bagian tubuh untuk memegang benda"),
  ("KAKI","Bagian tubuh untuk berjalan"),
  ("GIGI","Dipakai untuk mengunyah, harus disikat setiap hari"),
  ("RAMBUT","Tumbuh di kepala dan bisa dipotong"),
  ("JARI","Satu tangan kita punya lima ..."),
  ("LUTUT","Sendi di tengah kaki yang bisa ditekuk"),
  ("JANTUNG","Organ yang memompa darah ke seluruh tubuh"),
  ("BAHU","Bagian tubuh di antara leher dan lengan"),
 ]),
 ("Cita-Citaku (Profesi)", "#8B5CF6", [
  ("DOKTER","Orang yang mengobati orang sakit"),
  ("GURU","Orang yang mengajar di sekolah"),
  ("PILOT","Orang yang menerbangkan pesawat"),
  ("PETANI","Orang yang menanam padi di sawah"),
  ("NELAYAN","Orang yang mencari ikan di laut"),
  ("POLISI","Orang yang menjaga keamanan dan mengatur lalu lintas"),
  ("KOKI","Orang yang pandai memasak di restoran"),
  ("PERAWAT","Orang yang membantu dokter merawat pasien"),
  ("TENTARA","Orang yang bertugas menjaga pertahanan negara"),
  ("PELUKIS","Orang yang membuat lukisan"),
  ("MASINIS","Orang yang mengemudikan kereta api"),
  ("PENJAHIT","Orang yang membuat baju dengan mesin jahit"),
 ]),
 ("Alam dan Cuaca", "#10B981", [
  ("HUJAN","Air yang turun dari langit"),
  ("PELANGI","Lengkungan warna-warni yang muncul setelah hujan"),
  ("MATAHARI","Menyinari bumi pada siang hari"),
  ("BULAN","Benda langit yang tampak bersinar di malam hari"),
  ("AWAN","Gumpalan putih yang melayang di langit"),
  ("PETIR","Kilatan cahaya saat hujan badai"),
  ("ANGIN","Udara yang bergerak"),
  ("GUNUNG","Daratan yang menjulang sangat tinggi"),
  ("SUNGAI","Aliran air dari gunung menuju laut"),
  ("PANTAI","Tempat bermain pasir di tepi laut"),
  ("BINTANG","Titik-titik bercahaya di langit malam"),
  ("SALJU","Butiran es putih yang turun di negara dingin"),
 ]),
 ("Kendaraan", "#F97316", [
  ("SEPEDA","Kendaraan roda dua yang dikayuh"),
  ("MOBIL","Kendaraan roda empat untuk keluarga"),
  ("PESAWAT","Kendaraan yang terbang di udara"),
  ("KAPAL","Kendaraan besar yang berlayar di laut"),
  ("KERETA","Kendaraan panjang yang berjalan di atas rel"),
  ("BECAK","Kendaraan roda tiga yang dikayuh untuk membawa penumpang"),
  ("PERAHU","Kendaraan kecil di air yang didayung"),
  ("HELIKOPTER","Kendaraan terbang dengan baling-baling di atasnya"),
  ("TRUK","Kendaraan besar pengangkut barang"),
  ("DELMAN","Kendaraan yang ditarik oleh kuda"),
  ("MOTOR","Kendaraan roda dua yang bermesin"),
  ("ROKET","Kendaraan yang meluncur ke luar angkasa"),
 ]),
 ("Ayo ke Sekolah", "#0EA5E9", [
  ("PENSIL","Alat tulis yang tulisannya bisa dihapus"),
  ("PENGHAPUS","Alat untuk menghapus tulisan pensil"),
  ("BUKU","Tempat menulis catatan pelajaran"),
  ("TAS","Tempat membawa buku ke sekolah"),
  ("SPIDOL","Alat tulis guru di papan tulis putih"),
  ("PENGGARIS","Alat untuk membuat garis lurus"),
  ("KELAS","Ruangan tempat murid belajar"),
  ("UPACARA","Kegiatan di lapangan setiap hari Senin pagi"),
  ("SERAGAM","Pakaian yang dipakai saat ke sekolah"),
  ("KANTIN","Tempat membeli jajan di sekolah"),
  ("PERPUSTAKAAN","Ruangan berisi banyak buku untuk dibaca dan dipinjam"),
  ("RAPOR","Buku berisi nilai hasil belajar"),
 ]),
 ("IPA Seru", "#22C55E", [
  ("AKAR","Bagian tumbuhan yang menyerap air dari tanah"),
  ("DAUN","Bagian tumbuhan berwarna hijau tempat membuat makanan"),
  ("BUNGA","Bagian tumbuhan yang indah dan harum"),
  ("BUMI","Planet tempat kita tinggal"),
  ("MARS","Planet yang dijuluki planet merah"),
  ("OKSIGEN","Gas yang kita hirup saat bernapas"),
  ("MAGNET","Benda yang bisa menarik paku besi"),
  ("HERBIVORA","Sebutan untuk hewan pemakan tumbuhan"),
  ("KARNIVORA","Sebutan untuk hewan pemakan daging"),
  ("KEPOMPONG","Tahap sebelum ulat berubah menjadi kupu-kupu"),
  ("FOTOSINTESIS","Proses tumbuhan membuat makanan dengan bantuan cahaya matahari"),
  ("SATURNUS","Planet yang terkenal dengan cincinnya"),
 ]),
 ("Indonesiaku", "#DC2626", [
  ("GARUDA","Burung yang menjadi lambang negara Indonesia"),
  ("PANCASILA","Dasar negara Indonesia"),
  ("BENDERA","Sang Merah Putih adalah ... negara Indonesia"),
  ("BATIK","Kain bermotif khas Indonesia yang diakui UNESCO"),
  ("BALI","Pulau yang dijuluki Pulau Dewata"),
  ("BOROBUDUR","Candi Buddha terbesar di dunia, ada di Magelang"),
  ("RENDANG","Masakan daging bersantan khas Minangkabau"),
  ("ANGKLUNG","Alat musik dari bambu asal Jawa Barat"),
  ("WAYANG","Pertunjukan boneka yang dimainkan oleh dalang"),
  ("SUMATRA","Pulau tempat Danau Toba berada"),
  ("MONAS","Monumen terkenal di tengah kota Jakarta"),
  ("RUPIAH","Mata uang Indonesia"),
 ]),
]

MAXN = 15

def can_place(grid, w, r, c, d):
    dr, dc = (0, 1) if d == "A" else (1, 0)
    n = len(w)
    er, ec = r + dr*(n-1), c + dc*(n-1)
    if r < 0 or c < 0 or er >= MAXN or ec >= MAXN: return False
    # cell before/after must be empty
    br, bc = r-dr, c-dc
    if 0 <= br < MAXN and 0 <= bc < MAXN and grid[br][bc]: return False
    ar, ac = er+dr, ec+dc
    if 0 <= ar < MAXN and 0 <= ac < MAXN and grid[ar][ac]: return False
    cross = 0
    for i, ch in enumerate(w):
        rr, cc = r+dr*i, c+dc*i
        g = grid[rr][cc]
        if g:
            if g != ch: return False
            cross += 1
        else:
            # perpendicular neighbours must be empty
            for s in (-1, 1):
                nr, nc = rr + dc*s, cc + dr*s
                if 0 <= nr < MAXN and 0 <= nc < MAXN and grid[nr][nc]: return False
    if cross == n: return False
    return cross

def build(words, seed):
    rnd = random.Random(seed)
    ws = words[:]
    rnd.shuffle(ws)
    ws.sort(key=lambda x: -len(x[0]) + rnd.random()*3)
    grid = [[None]*MAXN for _ in range(MAXN)]
    placed = []
    first = ws[0][0]
    r, c = MAXN//2, (MAXN-len(first))//2
    for i, ch in enumerate(first): grid[r][c+i] = ch
    placed.append((ws[0], r, c, "A"))
    rest = ws[1:]
    for _ in range(3):
        left = []
        for item in rest:
            w = item[0]
            opts = []
            for (pw, pr, pc, pd) in placed:
                for i, ch in enumerate(pw[0]):
                    for j, ch2 in enumerate(w):
                        if ch != ch2: continue
                        if pd == "A":
                            rr, cc, d = pr - j, pc + i, "D"
                        else:
                            rr, cc, d = pr + i, pc - j, "A"
                        x = can_place(grid, w, rr, cc, d)
                        if x: opts.append((x, rnd.random(), rr, cc, d))
            if opts:
                opts.sort(reverse=True)
                _, _, rr, cc, d = opts[0] if rnd.random() < .6 else rnd.choice(opts)
                dr, dc = (0, 1) if d == "A" else (1, 0)
                for i, ch in enumerate(w): grid[rr+dr*i][cc+dc*i] = ch
                placed.append((item, rr, cc, d))
            else:
                left.append(item)
        rest = left
    return grid, placed

def best_layout(words):
    best = None
    for s in range(2500):
        grid, placed = build(words, s)
        cells = [(r, c) for r in range(MAXN) for c in range(MAXN) if grid[r][c]]
        rs = [p[0] for p in cells]; cs = [p[1] for p in cells]
        h, w = max(rs)-min(rs)+1, max(cs)-min(cs)+1
        score = len(placed)*1000 - h*w - abs(h-w)*5
        if best is None or score > best[0]:
            best = (score, grid, placed, min(rs), min(cs), h, w)
    _, grid, placed, r0, c0, h, w = best
    sub = [[grid[r0+r][c0+c] for c in range(w)] for r in range(h)]
    placed = [(it, r-r0, c-c0, d) for (it, r, c, d) in placed]
    # numbering
    starts = {}
    for it, r, c, d in placed: starts.setdefault((r, c), []).append((it, d))
    nums = {}
    n = 0
    for r in range(h):
        for c in range(w):
            if (r, c) in starts:
                n += 1; nums[(r, c)] = n
    across = sorted([(nums[(r, c)], it) for it, r, c, d in placed if d == "A"])
    down = sorted([(nums[(r, c)], it) for it, r, c, d in placed if d == "D"])
    return sub, nums, across, down, len(placed), len(words)

W, H = A4
import math
from reportlab.lib.colors import Color

DARK = "#1F2937"

def mix(hexc, t):
    """t=0 -> color, t=1 -> white"""
    c = HexColor(hexc)
    return Color(c.red + (1-c.red)*t, c.green + (1-c.green)*t, c.blue + (1-c.blue)*t)

def darker(hexc, t=0.25):
    c = HexColor(hexc)
    return Color(c.red*(1-t), c.green*(1-t), c.blue*(1-t))

# ---------- drawing helpers ----------
def star(cv, x, y, r, fillc, rot=0):
    p = cv.beginPath()
    for i in range(10):
        a = math.pi/2 + rot + i*math.pi/5
        rr = r if i % 2 == 0 else r*0.45
        px, py = x + rr*math.cos(a), y + rr*math.sin(a)
        p.moveTo(px, py) if i == 0 else p.lineTo(px, py)
    p.close()
    cv.setFillColor(fillc); cv.drawPath(p, fill=1, stroke=0)

def burst(cv, x, y, r, fillc, n=16):
    p = cv.beginPath()
    for i in range(n*2):
        a = i*math.pi/n
        rr = r if i % 2 == 0 else r*0.82
        px, py = x + rr*math.cos(a), y + rr*math.sin(a)
        p.moveTo(px, py) if i == 0 else p.lineTo(px, py)
    p.close()
    cv.setFillColor(fillc); cv.drawPath(p, fill=1, stroke=0)

def cloud(cv, x, y, s, alpha=1):
    cv.setFillColor(white); cv.setFillAlpha(alpha)
    for dx, dy, r in ((0, 0, .5), (.45, .15, .6), (.95, 0, .48), (.45, -.15, .5)):
        cv.circle(x + dx*s, y + dy*s, r*s, fill=1, stroke=0)
    cv.setFillAlpha(1)

def sun(cv, x, y, r):
    cv.setStrokeColor(HexColor("#FBBF24")); cv.setLineWidth(r*0.14); cv.setLineCap(1)
    for i in range(12):
        a = i*math.pi/6
        cv.line(x + r*1.25*math.cos(a), y + r*1.25*math.sin(a), x + r*1.65*math.cos(a), y + r*1.65*math.sin(a))
    cv.setFillColor(HexColor("#FDE047")); cv.circle(x, y, r, fill=1, stroke=0)
    # smile face
    cv.setFillColor(HexColor("#92400E"))
    cv.circle(x - r*.32, y + r*.18, r*.1, fill=1, stroke=0)
    cv.circle(x + r*.32, y + r*.18, r*.1, fill=1, stroke=0)
    cv.setStrokeColor(HexColor("#92400E")); cv.setLineWidth(r*.08)
    cv.arc(x - r*.4, y - r*.5, x + r*.4, y + r*.1, 200, 140)
    cv.setFillColor(HexColor("#FCA5A5")); cv.setFillAlpha(.7)
    cv.circle(x - r*.55, y - r*.12, r*.13, fill=1, stroke=0)
    cv.circle(x + r*.55, y - r*.12, r*.13, fill=1, stroke=0); cv.setFillAlpha(1)

def rainbow(cv, x, y, r, w):
    cols = ["#EF4444", "#F97316", "#FACC15", "#22C55E", "#3B82F6", "#8B5CF6"]
    cv.setLineCap(0)
    for i, c in enumerate(cols):
        rr = r - i*w
        cv.setStrokeColor(HexColor(c)); cv.setLineWidth(w)
        cv.arc(x - rr, y - rr, x + rr, y + rr, 0, 180)

def hills(cv):
    cv.setFillColor(HexColor("#86EFAC")); cv.ellipse(-60, -120, W*0.65, 150, fill=1, stroke=0)
    cv.setFillColor(HexColor("#4ADE80")); cv.ellipse(W*0.35, -130, W+80, 135, fill=1, stroke=0)
    cv.setFillColor(HexColor("#22C55E")); cv.ellipse(-80, -150, W+80, 95, fill=1, stroke=0)

def flower(cv, x, y, s, c):
    cv.setFillColor(HexColor(c))
    for i in range(5):
        a = i*2*math.pi/5
        cv.circle(x + s*.55*math.cos(a), y + s*.55*math.sin(a), s*.42, fill=1, stroke=0)
    cv.setFillColor(HexColor("#FDE047")); cv.circle(x, y, s*.35, fill=1, stroke=0)

def tile(cv, x, y, s, ch, c, fs=None, rot=0):
    cv.saveState(); cv.translate(x + s/2, y + s/2); cv.rotate(rot)
    cv.setFillColor(darker(c, .35)); cv.roundRect(-s/2 + 3, -s/2 - 4, s, s, s*.18, fill=1, stroke=0)
    cv.setFillColor(HexColor(c)); cv.roundRect(-s/2, -s/2, s, s, s*.18, fill=1, stroke=0)
    cv.setFillColor(white); cv.setFillAlpha(.25)
    cv.roundRect(-s/2 + s*.1, s*.15, s*.8, s*.25, s*.1, fill=1, stroke=0); cv.setFillAlpha(1)
    cv.setFont("SansB", fs or s*.62); cv.setFillColor(white)
    cv.drawCentredString(0, -s*.22, ch)
    cv.restoreState()

def outlined(cv, text, x, y, font, size, fillc, strokec, sw):
    cv.saveState()
    t = cv.beginText(); t.setFont(font, size)
    w = pdfmetrics.stringWidth(text, font, size)
    t.setTextOrigin(x - w/2, y)
    cv.setStrokeColor(strokec); cv.setLineWidth(sw); cv.setLineJoin(1)
    t.setTextRenderMode(1); t.textLine(text); cv.drawText(t)
    cv.restoreState()
    cv.saveState()
    t2 = cv.beginText(); t2.setFont(font, size); t2.setTextOrigin(x - w/2, y)
    t2._code.append("0 Tr")
    cv.setFillColor(fillc); t2.textLine(text); cv.drawText(t2)
    cv.restoreState()

def pencil(cv, x, y, L, rot):
    cv.saveState(); cv.translate(x, y); cv.rotate(rot)
    h = L*0.16
    cv.setFillColor(HexColor("#FB923C")); cv.rect(0, -h/2, L*.72, h, fill=1, stroke=0)
    cv.setFillColor(HexColor("#FDBA74")); cv.rect(0, -h/6, L*.72, h/3, fill=1, stroke=0)
    cv.setFillColor(HexColor("#F9A8D4")); cv.roundRect(-L*.12, -h/2, L*.14, h, h*.25, fill=1, stroke=0)
    cv.setFillColor(HexColor("#9CA3AF")); cv.rect(-L*.02, -h/2, L*.05, h, fill=1, stroke=0)
    p = cv.beginPath(); p.moveTo(L*.72, -h/2); p.lineTo(L*.95, 0); p.lineTo(L*.72, h/2); p.close()
    cv.setFillColor(HexColor("#FDE68A")); cv.drawPath(p, fill=1, stroke=0)
    p = cv.beginPath(); p.moveTo(L*.88, -h*.14); p.lineTo(L*.95, 0); p.lineTo(L*.88, h*.14); p.close()
    cv.setFillColor(HexColor("#374151")); cv.drawPath(p, fill=1, stroke=0)
    cv.restoreState()

def sky(cv, top="#7DD3FC", bottom="#E0F2FE"):
    cv.saveState()
    p = cv.beginPath(); p.rect(0, 0, W, H); cv.clipPath(p, stroke=0)
    cv.linearGradient(0, H, 0, 0, (HexColor(top), HexColor(bottom)), extend=True)
    cv.restoreState()

def wrap(text, font, size, maxw):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        t = (cur + " " + wd).strip()
        if pdfmetrics.stringWidth(t, font, size) <= maxw: cur = t
        else: lines.append(cur); cur = wd
    if cur: lines.append(cur)
    return lines

def footer(cv, page, color="#6B7280"):
    cv.setFillColor(HexColor(color)); cv.setFont("SansB", 9)
    cv.drawCentredString(W/2, 9*mm, f"★  Teka-Teki Silang Ceria  •  hal. {page}  ★")

# ---------- covers ----------
TILECOLS = ["#EF4444", "#F97316", "#FACC15", "#22C55E", "#0EA5E9", "#8B5CF6", "#EC4899"]

def cover(cv):
    sky(cv)
    rainbow(cv, W*0.5, H*0.42, W*0.62, 16)
    sun(cv, W-62, H-70, 34)
    cloud(cv, W*0.55, H-110, 30, .9); cloud(cv, W*0.42, H-55, 28, .9); cloud(cv, W*0.06, H*0.47, 34)
    cloud(cv, W*0.78, H*0.50, 36)
    for (x, y, r, c) in ((70, H-160, 10, "#FDE047"), (W-140, H-170, 8, "#F9A8D4"), (W*0.3, H-120, 7, "#FFFFFF"),
                         (W*0.9, H*0.62, 9, "#FDE047"), (W*0.1, H*0.62, 8, "#FFFFFF")):
        star(cv, x, y, r, HexColor(c))
    # title tiles
    s = 52
    row1, row2 = "TEKA-TEKI", "SILANG"
    y1 = H*0.73
    x = W/2 - len(row1)*s/2
    k = 0
    for i, ch in enumerate(row1):
        if ch == "-":
            cv.setFillColor(HexColor("#1E3A8A")); cv.roundRect(x + i*s + s*.3, y1 + s*.42, s*.4, s*.14, 3, fill=1, stroke=0)
            continue
        tile(cv, x + i*s + 2, y1, s - 4, ch, TILECOLS[k % 7], rot=(-4 if k % 2 else 4)); k += 1
    x2 = W/2 - len(row2)*(s+6)/2
    for i, ch in enumerate(row2):
        tile(cv, x2 + i*(s+6) + 2, y1 - s - 14, s + 2, ch, TILECOLS[(k+i) % 7], rot=(3 if i % 2 else -3))
    outlined(cv, "CERIA", W/2, y1 - 2*s - 62, "SansB", 64, HexColor("#FDE047"), HexColor("#1E3A8A"), 9)
    # pill
    pw, ph, py = 250, 44, y1 - 2*s - 120
    cv.setFillColor(HexColor("#9A3412")); cv.roundRect(W/2 - pw/2 + 3, py - 4, pw, ph, ph/2, fill=1, stroke=0)
    cv.setFillColor(HexColor("#F97316")); cv.roundRect(W/2 - pw/2, py, pw, ph, ph/2, fill=1, stroke=0)
    cv.setFillColor(white); cv.setFont("SansB", 24); cv.drawCentredString(W/2, py + 13, "Untuk Anak SD")
    # badge
    bx, by = 80, H - 78
    burst(cv, bx + 2, by - 3, 54, darker("#EF4444", .35)); burst(cv, bx, by, 54, HexColor("#EF4444"))
    cv.saveState(); cv.translate(bx, by); cv.rotate(12)
    cv.setFillColor(white); cv.setFont("SansB", 30); cv.drawCentredString(0, 2, "10")
    cv.setFont("SansB", 12); cv.drawCentredString(0, -14, "TEMA SERU!")
    cv.restoreState()
    # pencils
    pencil(cv, 30, H*0.36, 120, 25); pencil(cv, W-40, H*0.33, 120, 150)
    hills(cv)
    for (fx, fc) in ((40, "#F472B6"), (90, "#FDE047"), (W-60, "#A78BFA"), (W-110, "#FB7185"), (W*0.5, "#FFFFFF")):
        flower(cv, fx, 130 if fx in (40, W-60) else 105, 9, fc)
    # bottom banner
    cv.setFillColor(white); cv.roundRect(50, 40, W-100, 52, 14, fill=1, stroke=0)
    cv.setFillColor(HexColor("#15803D")); cv.setFont("SansB", 15)
    cv.drawCentredString(W/2, 70, "Dilengkapi Kunci Jawaban  ✓")
    cv.setFillColor(HexColor("#374151")); cv.setFont("SansB", 12)
    cv.drawCentredString(W/2, 50, "Buku ini milik: ______________________________")
    cv.showPage()

def back_cover(cv, themes):
    sky(cv, "#FDE68A", "#FFF7ED")
    sun(cv, 55, H-60, 26); cloud(cv, W-150, H-60, 34); cloud(cv, W*0.35, H-45, 22, .9)
    outlined(cv, "Belajar Sambil", W/2, H-130, "SansB", 38, HexColor("#F97316"), HexColor("#7C2D12"), 7)
    outlined(cv, "Bermain!", W/2, H-175, "SansB", 44, HexColor("#22C55E"), HexColor("#14532D"), 7)
    # blurb card
    cx, cw = 45, W-90
    txt = ("Asah kosakata, pengetahuan, dan rasa cinta Indonesia lewat 10 teka-teki silang "
           "yang seru dan berwarna. Cocok untuk belajar di rumah maupun di kelas.")
    lines = wrap(txt, "Sans", 15, cw-40)
    ch = 26 + len(lines)*21
    ctop = H-200
    cv.setFillColor(HexColor("#FDBA74")); cv.roundRect(cx+4, ctop-ch-5, cw, ch, 16, fill=1, stroke=0)
    cv.setFillColor(white); cv.roundRect(cx, ctop-ch, cw, ch, 16, fill=1, stroke=0)
    cv.setFillColor(HexColor(DARK)); cv.setFont("Sans", 15)
    y = ctop - 30
    for ln in lines: cv.drawCentredString(W/2, y, ln); y -= 21
    # themes
    y = ctop - ch - 40
    cv.setFillColor(HexColor("#7C2D12")); cv.setFont("SansB", 18); cv.drawCentredString(W/2, y, "10 Tema Seru di Dalamnya")
    y -= 18
    colw = (W-90)/2
    for i, (t, c) in enumerate(themes):
        col, row = i % 2, i // 2
        px, py = 45 + col*colw + 5, y - (row+1)*36
        cv.setFillColor(HexColor(c)); cv.roundRect(px, py, colw-10, 28, 14, fill=1, stroke=0)
        cv.setFillColor(white); cv.circle(px+15, py+14, 10, fill=1, stroke=0)
        cv.setFillColor(HexColor(c)); cv.setFont("SansB", 11); cv.drawCentredString(px+15, py+10, str(i+1))
        cv.setFillColor(white); cv.setFont("SansB", 13); cv.drawString(px+32, py+9, t)
    y = y - 5*36 - 30
    # features
    feats = [("120", "kata baru"), ("10", "lembar kerja siap cetak"), ("✓", "kunci jawaban lengkap")]
    fw = (W-90)/3
    for i, (big, small) in enumerate(feats):
        fx = 45 + i*fw + fw/2
        c = ["#0EA5E9", "#EC4899", "#22C55E"][i]
        burst(cv, fx, y-30, 34, HexColor(c), n=12)
        cv.setFillColor(white); cv.setFont("SansB", 22); cv.drawCentredString(fx, y-38, big)
        cv.setFillColor(HexColor(DARK)); cv.setFont("SansB", 12)
        for j, ln in enumerate(wrap(small, "SansB", 12, fw-10)):
            cv.drawCentredString(fx, y-82-j*14, ln)
    hills(cv)
    for (fx, fc) in ((40, "#F472B6"), (W-60, "#A78BFA"), (W*0.25, "#FDE047"), (W*0.75, "#FB7185")):
        flower(cv, fx, 110, 9, fc)
    outlined(cv, "Selamat bermain dan belajar!", W/2, 45, "SansB", 24, white, HexColor("#14532D"), 6)
    cv.showPage()

# ---------- inner pages ----------
def page_frame(cv, color):
    cv.setFillColor(mix(color, .9)); cv.rect(0, 0, W, H, fill=1, stroke=0)
    cv.setFillColor(white); cv.roundRect(10*mm, 14*mm, W-20*mm, H-24*mm, 8*mm, fill=1, stroke=0)
    cv.setStrokeColor(mix(color, .35)); cv.setLineWidth(2.5); cv.setDash(6, 5)
    cv.roundRect(10*mm, 14*mm, W-20*mm, H-24*mm, 8*mm, fill=0, stroke=1); cv.setDash()
    rnd = random.Random(color)
    for _ in range(14):
        x = rnd.choice([rnd.uniform(2*mm, 9*mm), rnd.uniform(W-9*mm, W-2*mm)])
        star(cv, x, rnd.uniform(20*mm, H-20*mm), rnd.uniform(4, 7), mix(color, .4), rnd.uniform(0, 1))

def howto(cv, themes_info):
    color = "#F59E0B"
    page_frame(cv, color)
    cv.setFillColor(HexColor(color)); cv.roundRect(18*mm, H-40*mm, W-36*mm, 22*mm, 11*mm, fill=1, stroke=0)
    cv.setFillColor(white); cv.setFont("SansB", 26); cv.drawCentredString(W/2, H-32*mm, "Cara Bermain")
    steps = [
        "Baca pertanyaan MENDATAR dan MENURUN.",
        "Angka di soal = kotak tempat jawaban dimulai.",
        "MENDATAR → tulis dari kiri ke kanan.",
        "MENURUN ↓ tulis dari atas ke bawah.",
        "Tulis satu huruf kapital di setiap kotak.",
        "Kotak yang dipakai dua jawaban hurufnya harus sama!",
        "Selesai? Cocokkan dengan kunci jawaban di belakang.",
    ]
    y = H-55*mm
    cols = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#0EA5E9", "#8B5CF6", "#EC4899"]
    for i, s in enumerate(steps):
        cv.setFillColor(HexColor(cols[i])); cv.circle(27*mm, y+1.6*mm, 4.2*mm, fill=1, stroke=0)
        cv.setFillColor(white); cv.setFont("SansB", 13); cv.drawCentredString(27*mm, y-0.4*mm, str(i+1))
        cv.setFillColor(HexColor(DARK)); cv.setFont("Sans", 14); cv.drawString(35*mm, y, s)
        y -= 11*mm
    y -= 4*mm
    cv.setFillColor(HexColor("#B45309")); cv.setFont("SansB", 20); cv.drawString(22*mm, y, "Daftar Isi"); y -= 10*mm
    for i, (t, col, pg) in enumerate(themes_info):
        cv.setFillColor(mix(col, .82)); cv.roundRect(22*mm, y-3*mm, W-44*mm, 8.5*mm, 4*mm, fill=1, stroke=0)
        cv.setFillColor(HexColor(col)); cv.circle(27*mm, y+1.2*mm, 3.2*mm, fill=1, stroke=0)
        cv.setFillColor(white); cv.setFont("SansB", 10); cv.drawCentredString(27*mm, y-0.3*mm, str(i+1))
        cv.setFillColor(HexColor(DARK)); cv.setFont("SansB", 13); cv.drawString(33*mm, y-0.2*mm, t)
        cv.setFont("Sans", 12); cv.drawRightString(W-26*mm, y-0.2*mm, f"hal. {pg}")
        y -= 10*mm
    cv.setFillColor(mix("#6B7280", .82)); cv.roundRect(22*mm, y-3*mm, W-44*mm, 8.5*mm, 4*mm, fill=1, stroke=0)
    cv.setFillColor(HexColor(DARK)); cv.setFont("SansB", 13); cv.drawString(33*mm, y-0.2*mm, "Kunci Jawaban")
    cv.setFont("Sans", 12); cv.drawRightString(W-26*mm, y-0.2*mm, f"hal. {themes_info[-1][2]+1}")
    y -= 14*mm
    cv.setFillColor(HexColor("#FEF3C7")); cv.roundRect(22*mm, y-12*mm, W-44*mm, 17*mm, 4*mm, fill=1, stroke=0)
    cv.setFillColor(HexColor("#92400E")); cv.setFont("SansB", 12)
    cv.drawString(27*mm, y-1*mm, "Tips untuk Ayah, Bunda, dan Guru:")
    cv.setFont("Sans", 11)
    cv.drawString(27*mm, y-8*mm, "Kerjakan satu TTS per hari, beri bintang untuk setiap TTS yang selesai.")
    footer(cv, 2); cv.showPage()

def draw_grid(cv, sub, nums, x0, ytop, cell, color, fill=False):
    h, w = len(sub), len(sub[0])
    # shadow
    cv.setFillColor(mix(color, .55))
    for r in range(h):
        for c in range(w):
            if sub[r][c]:
                cv.rect(x0 + c*cell + 2.5, ytop - (r+1)*cell - 2.5, cell, cell, fill=1, stroke=0)
    for r in range(h):
        for c in range(w):
            ch = sub[r][c]
            if not ch: continue
            x = x0 + c*cell; y = ytop - (r+1)*cell
            cv.setFillColor(mix(color, .86) if (r, c) in nums else white)
            cv.setStrokeColor(HexColor(DARK)); cv.setLineWidth(1.3)
            cv.rect(x, y, cell, cell, fill=1, stroke=1)
            if (r, c) in nums:
                cv.setFillColor(darker(color, .3)); cv.setFont("SansB", max(6, cell*0.30))
                cv.drawString(x+1.8, y+cell-cell*0.32, str(nums[(r, c)]))
            if fill:
                cv.setFillColor(HexColor(DARK)); cv.setFont("SansB", cell*0.55)
                cv.drawCentredString(x+cell/2, y+cell*0.2, ch)

def clue_layout(lst, fs, colw):
    out, hgt = [], 0
    for n, (wd, clue) in lst:
        lines = wrap(f"{clue} ({len(wd)} huruf)", "Sans", fs, colw - 11*mm)
        out.append((n, lines)); hgt += len(lines)*fs*1.3 + fs*0.55
    return out, hgt

def puzzle_page(cv, no, title, color, data, page):
    sub, nums, across, down, _, _ = data
    page_frame(cv, color)
    # header band
    bx, by, bw, bh = 16*mm, H-42*mm, W-32*mm, 26*mm
    cv.setFillColor(darker(color, .3)); cv.roundRect(bx+2, by-3, bw, bh, 13*mm, fill=1, stroke=0)
    cv.setFillColor(HexColor(color)); cv.roundRect(bx, by, bw, bh, 13*mm, fill=1, stroke=0)
    cv.setFillColor(white); cv.circle(bx + 13*mm, by + bh/2, 9.5*mm, fill=1, stroke=0)
    cv.setFillColor(HexColor(color)); cv.setFont("SansB", 9); cv.drawCentredString(bx + 13*mm, by + bh/2 + 3.5*mm, "TTS")
    cv.setFont("SansB", 22); cv.drawCentredString(bx + 13*mm, by + bh/2 - 6*mm, str(no))
    cv.setFillColor(white); cv.setFont("SansB", 26 if len(title) < 18 else 22)
    cv.drawString(bx + 27*mm, by + bh/2 - 3.2*mm, title)
    star(cv, bx + bw - 14*mm, by + bh/2 + 3*mm, 9, HexColor("#FDE047"), .3)
    star(cv, bx + bw - 24*mm, by + bh/2 - 5*mm, 6, white, .1)
    # name row
    cv.setFillColor(HexColor(DARK)); cv.setFont("SansB", 12)
    cv.drawString(18*mm, H-52*mm, "Nama: ____________________   Kelas: ______   Nilai: ______")
    # clue sizing
    colw = (W-36*mm)/2 - 3*mm
    top, bottom = H-58*mm, 18*mm
    for fs in (13, 12.5, 12, 11.5, 11, 10.5, 10):
        la, ha = clue_layout(across, fs, colw); ld, hd = clue_layout(down, fs, colw)
        ch = max(ha, hd) + 14*mm
        gh = top - bottom - ch - 6*mm
        h, w = len(sub), len(sub[0])
        cell = min((W-40*mm)/w, gh/h, 13*mm)
        if cell >= 7*mm: break
    gx = (W - cell*w)/2
    draw_grid(cv, sub, nums, gx, top, cell, color)
    ctop = top - cell*h - 6*mm
    for k, (lab, lay) in enumerate((("MENDATAR  →", la), ("MENURUN  ↓", ld))):
        x = 18*mm + k*(colw + 6*mm)
        cv.setFillColor(mix(color, .9)); cv.roundRect(x, bottom, colw, ctop - bottom, 4*mm, fill=1, stroke=0)
        cv.setFillColor(HexColor(color)); cv.roundRect(x, ctop - 9*mm, colw, 9*mm, 4*mm, fill=1, stroke=0)
        cv.rect(x, ctop - 9*mm, colw, 4*mm, fill=1, stroke=0)
        cv.setFillColor(white); cv.setFont("SansB", 13); cv.drawString(x + 4*mm, ctop - 6.3*mm, lab)
        y = ctop - 9*mm - fs*1.35
        for n, lines in lay:
            cv.setFillColor(HexColor(color)); cv.circle(x + 6*mm, y + fs*0.35, fs*0.62, fill=1, stroke=0)
            cv.setFillColor(white); cv.setFont("SansB", fs*0.75); cv.drawCentredString(x + 6*mm, y + fs*0.08, str(n))
            cv.setFillColor(HexColor(DARK)); cv.setFont("Sans", fs)
            for ln in lines: cv.drawString(x + 10.5*mm, y, ln); y -= fs*1.3
            y -= fs*0.55
    footer(cv, page, darker(color, .2).hexval().replace("0x", "#"))
    cv.showPage()

def answers(cv, all_data, start_page):
    page = start_page
    for i in range(0, len(all_data), 2):
        page_frame(cv, "#22C55E")
        cv.setFillColor(HexColor("#22C55E")); cv.roundRect(16*mm, H-34*mm, W-32*mm, 18*mm, 9*mm, fill=1, stroke=0)
        cv.setFillColor(white); cv.setFont("SansB", 22); cv.drawCentredString(W/2, H-27.5*mm, "Kunci Jawaban  ✓")
        for j, (no, title, color, data) in enumerate(all_data[i:i+2]):
            sub, nums = data[0], data[1]
            top = H-42*mm - j*(H-60*mm)/2
            cv.setFillColor(HexColor(color)); cv.roundRect(18*mm, top-9*mm, 80*mm, 9*mm, 4.5*mm, fill=1, stroke=0)
            cv.setFillColor(white); cv.setFont("SansB", 13); cv.drawString(22*mm, top-6.3*mm, f"TTS {no}: {title}")
            h, w = len(sub), len(sub[0])
            cell = min((W-40*mm)/w, ((H-60*mm)/2 - 18*mm)/h, 9.5*mm)
            draw_grid(cv, sub, nums, (W-cell*w)/2, top-13*mm, cell, color, fill=True)
        footer(cv, page); cv.showPage(); page += 1

def main(out):
    all_data = []
    for i, (t, col, words) in enumerate(THEMES):
        d = best_layout(words)
        all_data.append((i+1, t, col, d))
    cv = canvas.Canvas(out, pagesize=A4)
    cv.setTitle("Teka-Teki Silang Ceria untuk Anak SD")
    cover(cv)
    howto(cv, [(t, c, i+3) for i, (_, t, c, _) in enumerate(all_data)])
    for no, t, c, d in all_data: puzzle_page(cv, no, t, c, d, no+2)
    answers(cv, all_data, len(all_data)+3)
    back_cover(cv, [(t, c) for _, t, c, _ in all_data])
    cv.save()

if __name__ == "__main__":
    import sys; main(sys.argv[1])
