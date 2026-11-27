#!/usr/bin/env bash
# Gabung frame + audio jadi MP4 siap upload, lalu QA.
# Pakai: bash finish.sh <folder-frames> <mix_raw.wav> <output.mp4>
set -e
FR=${1:-frames}; MIX=${2:-mix_raw.wav}; OUT=${3:-Badai-Rapor.mp4}
ffmpeg -loglevel error -y -framerate 30 -i "$FR/f%05d.jpg" -i "$MIX" \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -ac 2 -c:a aac -b:a 192k \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -movflags +faststart -shortest "$OUT"
echo "== durasi: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT") dtk"
echo "== loudness:"; ffmpeg -hide_banner -i "$OUT" -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"
echo "== layar hitam:"; ffmpeg -hide_banner -i "$OUT" -vf blackdetect=d=0.3:pix_th=0.08 -an -f null - 2>&1 | grep -c black_start || true
echo "== frame beku (>1 dtk):"; ffmpeg -hide_banner -i "$OUT" -vf freezedetect=n=0.002:d=1 -an -f null - 2>&1 | grep freeze_start || echo "tidak ada"
