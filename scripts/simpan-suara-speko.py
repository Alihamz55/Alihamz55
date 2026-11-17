"""Simpan hasil Speko audio.synthesize (file hasil tool) menjadi MP3 yang sudah dinormalisasi.

Pakai:  python3 scripts/simpan-suara-speko.py <hasil-speko.txt> <tujuan.mp3>
"""
import json
import pathlib
import re
import subprocess
import sys

hasil, tujuan = sys.argv[1], pathlib.Path(sys.argv[2])
data = json.load(open(hasil))
wav = re.search(r"saved to (\S+\.wav)", data[0]["text"]).group(1)
meta = json.loads(data[1]["text"])
tujuan.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", "loudnorm=I=-16:TP=-1.5", "-b:a", "128k", str(tujuan)],
    check=True,
)
print(tujuan, meta.get("provider"), meta.get("duration_seconds"), "detik")
