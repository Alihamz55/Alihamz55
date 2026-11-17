"""Kunci timeline dari durasi suara & timestamp kata (transkripsi Speko). Keluaran: timeline.json"""
import json, pathlib, wave
import numpy as np
HERE = pathlib.Path(__file__).resolve().parent.parent
FPS = 24
# (id, siapa, mulai detik, kata [teks, start_ms, end_ms]) — teks kata ditulis ulang sesuai naskah (sholat, bukan salat)
W = {
 "L1": ("nana", 0.3, [("Kak,",100,700),("kenapa",800,1200),("sih",1200,1400),("kalau",1400,1700),("sholat|",1700,2000),("kita",2000,2300),("harus",2300,2500),("menghadap",2500,2900),("kiblat?",2900,3400)]),
 "L2": ("kakak", 5.0, [("Kiblat",200,500),("itu",500,800),("arah",800,1200),("ke",1200,1300),("Ka'bah,|",1300,1800),("di",2300,2400),("kota",2400,2600),("Makkah.|",2600,3100),("Allah",4100,4500),("memerintahkan",4500,5300),("kita|",5300,5800),("menghadap",5800,6300),("ke",6300,6400),("sana",6400,6800),("setiap",6800,7400),("kali",7400,7700),("sholat.",7700,8000)]),
 "L3": ("kakak", 13.8, [("Dari",200,500),("Indonesia,",500,1300),("Ka'bah",1600,2100),("jauh",2100,2500),("sekali.|",2500,3000),("Hampir",3900,4400),("8.000",4400,5200),("km,",5200,5900),("ke",6100,6300),("arah",6300,6600),("barat",6600,6900),("laut.",6900,7200)]),
 "L4": ("kakak", 22.3, [("Tahukah",100,500),("kamu?|",500,800),("Saat",1800,2100),("sholat,",2100,2600),("umat",2900,3200),("Islam|",3200,3600),("di",3600,3700),("seluruh",3700,4100),("dunia",4100,4600),("menghadap|",4600,5000),("ke",5000,5200),("satu",5200,5600),("titik",5600,5900),("yang",5900,6000),("sama:",6000,6400),("Ka'bah.",7000,7500)]),
 "L5": ("nana", 30.4, [("Wah,",100,600),("jadi",700,900),("kita",900,1100),("semua",1100,1400),("kompak,",1400,1800),("ya,",1800,2000),("Kak!",2000,2200)]),
 "L6": ("kakak", 33.3, [("Misi",200,400),("hari",400,700),("ini:|",700,1000),("cari",1500,1800),("tahu",1800,2300),("arah",2300,2600),("kiblat",2600,3000),("di",3000,3100),("rumahmu,",3100,3700),("ya!|",3800,4100),("Besok",4900,5100),("kita",5100,5300),("cari",5300,5600),("tahu,|",5600,6200),("kenapa",6300,6800),("baca",6800,7100),("bismillah",7100,7700),("sebelum",7700,8000),("makan?",8000,8500)]),
}
MAXC = 40
lines, cues, words = [], [], []
for lid, (who, t, ws) in W.items():
    with wave.open(str(HERE / "voice" / f"{lid}.wav")) as f:
        sr = f.getframerate(); n = f.getnframes(); a = np.frombuffer(f.readframes(n), np.int16).astype(np.float32) / 32768
        if f.getnchannels() == 2: a = a.reshape(-1, 2).mean(1)
    dur = n / sr
    hop = sr // FPS
    env = [float(np.sqrt(np.mean(a[i:i + hop] ** 2))) for i in range(0, len(a), hop)]
    m = max(env) or 1
    lines.append({"id": lid, "who": who, "t": t, "dur": round(dur, 3), "file": f"voice/{lid}.wav", "env": [round(e / m, 3) for e in env]})
    # potong jadi frasa: berhenti di tanda baca akhir atau bila > MAXC huruf
    cur = []
    def flush():
        if cur:
            cues.append({"who": who, "t0": round(t + cur[0][1] / 1000, 2), "t1": round(t + cur[-1][2] / 1000, 2), "text": " ".join(c[0] for c in cur)})
            cur.clear()
    for w in ws:
        words.append({"t": round(t + w[1] / 1000, 2), "text": w[0], "line": lid})
        brk = w[0].endswith("|"); w = (w[0].rstrip("|"),) + tuple(w[1:])
        words[-1]["text"] = w[0]
        if cur and len(" ".join(c[0] for c in cur + [w])) > MAXC: flush()
        cur.append(w)
        if brk: flush()
    flush()
# subtitle tampil min 1.8 s dan tidak tumpang tindih
for i, c in enumerate(cues):
    nxt = cues[i + 1]["t0"] if i + 1 < len(cues) else 99
    c["t1"] = round(min(max(c["t1"] + 0.35, c["t0"] + 1.8), nxt - 0.05), 2)
def wt(lid, text): return next(w["t"] for w in words if w["line"] == lid and w["text"].startswith(text))
EV = [
 {"t": 0.25, "type": "pin", "id": "jkt"},
 {"t": 4.5, "type": "whoosh"},
 {"t": wt("L2", "Ka'bah"), "type": "pin", "id": "kabah"},
 {"t": wt("L2", "Allah"), "type": "tick", "id": "sumber"},
 {"t": 13.3, "type": "ignite"},
 {"t": wt("L3", "8.000"), "type": "ruler"},
 {"t": wt("L3", "barat"), "type": "compass"},
 {"t": 21.6, "type": "whoosh"},
]
t_city = wt("L4", "seluruh")
for k, c in enumerate(["kualalumpur", "karachi", "kairo", "istanbul", "nairobi", "dakar"]):
    EV.append({"t": round(t_city + k * 0.45, 2), "type": "city", "id": c})
EV += [
 {"t": wt("L4", "Ka'bah."), "type": "converge"},
 {"t": wt("L6", "Misi"), "type": "card", "id": "misi"},
 {"t": wt("L6", "Besok"), "type": "card", "id": "besok"},
]
DUR = round(lines[-1]["t"] + lines[-1]["dur"] + 2.2, 2)
json.dump({"fps": FPS, "dur": DUR, "lines": lines, "cues": cues, "words": words, "ev": EV}, open(HERE / "timeline.json", "w"), indent=0)
print("DUR", DUR); [print(c) for c in cues]; [print(e) for e in EV]
