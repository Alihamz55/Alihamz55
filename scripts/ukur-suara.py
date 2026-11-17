"""Ukur durasi file suara satu episode Tanya Nana.

Pakai:  python3 scripts/ukur-suara.py 001
Membaca public/tanyanana/001/<n>.mp3 lalu menulis src/tanyanana/episode/001-durasi.json
"""
import json
import pathlib
import subprocess
import sys

kode = sys.argv[1]
akar = pathlib.Path(__file__).resolve().parent.parent
folder = akar / "public" / "tanyanana" / kode
hasil = {}
for f in sorted(folder.glob("*.mp3"), key=lambda p: int(p.stem)):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
        capture_output=True, text=True, check=True,
    )
    hasil[f.stem] = round(float(out.stdout.strip()), 2)
tujuan = akar / "src" / "tanyanana" / "episode" / f"{kode}-durasi.json"
tujuan.write_text(json.dumps(hasil, indent=2) + "\n")
print(tujuan, hasil, "total", round(sum(hasil.values()), 1), "detik")
