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

def draw_grid(cv, sub, nums, x0, ytop, cell, color, fill=False):
    h, w = len(sub), len(sub[0])
    for r in range(h):
        for c in range(w):
            ch = sub[r][c]
            if not ch: continue
            x = x0 + c*cell; y = ytop - (r+1)*cell
            cv.setFillColor(HexColor("#FFFFFF")); cv.setStrokeColor(HexColor("#1F2937"))
            cv.setLineWidth(1.1)
            cv.rect(x, y, cell, cell, fill=1, stroke=1)
            if (r, c) in nums:
                cv.setFillColor(HexColor(color)); cv.setFont("SansB", max(5, cell*0.28))
                cv.drawString(x+1.5, y+cell-cell*0.30, str(nums[(r, c)]))
            if fill:
                cv.setFillColor(HexColor("#111827")); cv.setFont("SansB", cell*0.55)
                cv.drawCentredString(x+cell/2, y+cell*0.22, ch)

def wrap(text, font, size, maxw):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        t = (cur + " " + wd).strip()
        if pdfmetrics.stringWidth(t, font, size) <= maxw: cur = t
        else: lines.append(cur); cur = wd
    if cur: lines.append(cur)
    return lines

def header(cv, title, color, no):
    cv.setFillColor(HexColor(color))
    cv.roundRect(15*mm, H-38*mm, W-30*mm, 24*mm, 6*mm, fill=1, stroke=0)
    cv.setFillColor(white); cv.setFont("SansB", 11)
    cv.drawString(22*mm, H-21*mm, f"TTS {no}")
    cv.setFont("SansB", 20); cv.drawString(22*mm, H-31*mm, title)
    cv.setFillColor(HexColor("#374151")); cv.setFont("Sans", 10)
    cv.drawString(15*mm, H-46*mm, "Nama: ______________________   Kelas: ______   Nilai: ______")

def footer(cv, page):
    cv.setFillColor(HexColor("#9CA3AF")); cv.setFont("Sans", 8)
    cv.drawCentredString(W/2, 10*mm, f"Teka-Teki Silang Ceria untuk Anak SD  •  {page}")

def cover(cv):
    cv.setFillColor(HexColor("#FEF3C7")); cv.rect(0, 0, W, H, fill=1, stroke=0)
    rnd = random.Random(7)
    cols = ["#F59E0B","#EF4444","#3B82F6","#10B981","#8B5CF6","#EC4899"]
    for _ in range(26):
        cv.setFillColor(HexColor(rnd.choice(cols)))
        x, y, s = rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(8, 22)*mm
        while H*0.30 < y < H*0.80 and W*0.12 < x < W*0.88:
            x, y = rnd.uniform(0, W), rnd.uniform(0, H)
        cv.setFillAlpha(0.18); cv.circle(x, y, s/2, fill=1, stroke=0)
    cv.setFillAlpha(1)
    # letter tiles "TTS"
    word = "TTS"; s = 34*mm; x0 = W/2 - len(word)*s/2; y0 = H*0.60
    for i, ch in enumerate(word):
        cv.setFillColor(HexColor(cols[i])); cv.roundRect(x0+i*s+2*mm, y0, s-4*mm, s-4*mm, 4*mm, fill=1, stroke=0)
        cv.setFillColor(white); cv.setFont("SansB", 60); cv.drawCentredString(x0+i*s+s/2, y0+9*mm, ch)
    cv.setFillColor(HexColor("#1F2937")); cv.setFont("SansB", 30)
    cv.drawCentredString(W/2, H*0.50, "Teka-Teki Silang Ceria")
    cv.setFont("SansB", 18); cv.setFillColor(HexColor("#B45309"))
    cv.drawCentredString(W/2, H*0.45, "Untuk Anak SD")
    cv.setFont("Sans", 13); cv.setFillColor(HexColor("#374151"))
    cv.drawCentredString(W/2, H*0.39, "10 Tema Seru  •  Dilengkapi Kunci Jawaban")
    cv.drawCentredString(W/2, H*0.36, "Asah kosakata, ilmu pengetahuan, dan cinta Indonesia")
    cv.setFont("SansB", 11); cv.setFillColor(HexColor("#6B7280"))
    cv.drawCentredString(W/2, 25*mm, "Buku ini milik: ______________________________")
    cv.showPage()

def howto(cv, themes_info):
    cv.setFillColor(HexColor("#1F2937")); cv.setFont("SansB", 22)
    cv.drawString(20*mm, H-30*mm, "Cara Bermain")
    cv.setFont("Sans", 12); y = H-45*mm
    steps = [
        "1. Baca setiap pertanyaan di bagian MENDATAR dan MENURUN.",
        "2. Angka di depan pertanyaan menunjukkan kotak tempat jawaban dimulai.",
        "3. MENDATAR artinya ditulis dari kiri ke kanan.",
        "4. MENURUN artinya ditulis dari atas ke bawah.",
        "5. Tulis satu huruf kapital di setiap kotak.",
        "6. Ada kotak yang dipakai dua jawaban. Hurufnya harus sama!",
        "7. Sudah selesai? Cocokkan jawabanmu dengan kunci di belakang buku.",
    ]
    for s in steps: cv.drawString(22*mm, y, s); y -= 8*mm
    y -= 6*mm
    cv.setFont("SansB", 18); cv.drawString(20*mm, y, "Daftar Isi"); y -= 10*mm
    cv.setFont("Sans", 12)
    for i, (t, col, pg) in enumerate(themes_info):
        cv.setFillColor(HexColor(col)); cv.circle(24*mm, y+1.4*mm, 2.2*mm, fill=1, stroke=0)
        cv.setFillColor(HexColor("#1F2937"))
        cv.drawString(30*mm, y, f"TTS {i+1}: {t}")
        cv.drawRightString(W-25*mm, y, f"hal. {pg}"); y -= 8*mm
    cv.drawString(30*mm, y, "Kunci Jawaban"); cv.drawRightString(W-25*mm, y, f"hal. {themes_info[-1][2]+1}")
    y -= 14*mm
    cv.setFillColor(HexColor("#FEF3C7")); cv.roundRect(20*mm, y-14*mm, W-40*mm, 20*mm, 4*mm, fill=1, stroke=0)
    cv.setFillColor(HexColor("#92400E")); cv.setFont("SansB", 11)
    cv.drawString(25*mm, y-2*mm, "Tips untuk Ayah, Bunda, dan Guru:")
    cv.setFont("Sans", 10)
    cv.drawString(25*mm, y-9*mm, "Cetak satu halaman per hari, lalu beri bintang atau stiker untuk setiap TTS yang selesai.")
    footer(cv, 2); cv.showPage()

def puzzle_page(cv, no, title, color, data, page):
    sub, nums, across, down, _, _ = data
    header(cv, title, color, no)
    h, w = len(sub), len(sub[0])
    maxw, maxh = W-40*mm, 120*mm
    cell = min(maxw/w, maxh/h, 12*mm)
    gx = (W - cell*w)/2; gtop = H-52*mm
    draw_grid(cv, sub, nums, gx, gtop, cell, color)
    y0 = gtop - cell*h - 10*mm
    colw = (W-40*mm)/2 - 4*mm
    for k, (lab, lst) in enumerate((("MENDATAR", across), ("MENURUN", down))):
        x = 20*mm + k*((W-40*mm)/2 + 4*mm); y = y0
        cv.setFillColor(HexColor(color)); cv.setFont("SansB", 12); cv.drawString(x, y, lab); y -= 6*mm
        cv.setFillColor(HexColor("#1F2937"))
        fs = 9.5
        for n, (wd, clue) in lst:
            lines = wrap(f"{clue} ({len(wd)} huruf)", "Sans", fs, colw-8*mm)
            cv.setFont("SansB", fs); cv.drawString(x, y, f"{n}.")
            cv.setFont("Sans", fs)
            for ln in lines: cv.drawString(x+7*mm, y, ln); y -= 4.6*mm
            y -= 1.2*mm
    footer(cv, page); cv.showPage()

def answers(cv, all_data, start_page):
    page = start_page
    for i in range(0, len(all_data), 2):
        cv.setFillColor(HexColor("#1F2937")); cv.setFont("SansB", 20)
        cv.drawString(20*mm, H-25*mm, "Kunci Jawaban")
        for j, (no, title, color, data) in enumerate(all_data[i:i+2]):
            sub, nums = data[0], data[1]
            top = H-35*mm - j*(H-50*mm)/2
            cv.setFillColor(HexColor(color)); cv.setFont("SansB", 13)
            cv.drawString(20*mm, top-5*mm, f"TTS {no}: {title}")
            h, w = len(sub), len(sub[0])
            cell = min((W-40*mm)/w, ((H-50*mm)/2 - 20*mm)/h, 8*mm)
            draw_grid(cv, sub, nums, (W-cell*w)/2, top-10*mm, cell, color, fill=True)
        footer(cv, page); cv.showPage(); page += 1

def main(out):
    all_data = []
    for i, (t, col, words) in enumerate(THEMES):
        d = best_layout(words)
        print(t, d[4], "/", d[5], "words", len(d[0]), "x", len(d[0][0]))
        all_data.append((i+1, t, col, d))
    cv = canvas.Canvas(out, pagesize=A4)
    cv.setTitle("Teka-Teki Silang Ceria untuk Anak SD")
    cover(cv)
    howto(cv, [(t, c, i+3) for i, (_, t, c, _) in enumerate(all_data)])
    for no, t, c, d in all_data: puzzle_page(cv, no, t, c, d, no+2)
    answers(cv, all_data, len(all_data)+3)
    cv.save()

if __name__ == "__main__":
    import sys; main(sys.argv[1])
