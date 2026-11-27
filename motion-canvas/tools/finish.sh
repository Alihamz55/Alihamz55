#!/usr/bin/env bash
# Selesaikan video Motion Canvas: mix audio -> -14 LUFS, gabung dengan video render, QA, tempel akhiran.
# Pakai (dari folder motion-canvas):
#   bash tools/finish.sh output/project.mp4 mix_raw.wav "Judul Video"
# Hasil: ../video/<Judul-Video>-YT.mp4
set -e
VID="$1"; MIX="$2"; T="${3:-short}"; NAME="${T// /-}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TMP="$(mktemp -d)"
LUFS=$(ffmpeg -nostats -i "$MIX" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
GAIN=$(python3 -c "print(round(-14-float('${LUFS:--23}'),2))")
ffmpeg -v error -y -i "$MIX" -af "volume=${GAIN}dB,alimiter=limit=0.89:attack=2:release=50:level=disabled" -ar 48000 -ac 2 "$TMP/mix.wav"
ffmpeg -v error -y -i "$VID" -i "$TMP/mix.wav" -map 0:v:0 -map 1:a:0 -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart "$TMP/main.mp4"
echo "--- QA (kosong = tidak ada layar hitam/beku)"
ffmpeg -i "$TMP/main.mp4" -vf "freezedetect=n=0.0005:d=0.6,blackdetect=d=0.05" -an -f null - 2>&1 | grep -E "freeze_start|black_start" || true
ffmpeg -i "$TMP/main.mp4" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | tail -1
OUT="$ROOT/video/${NAME}-YT.mp4"
ffmpeg -v error -y -i "$TMP/main.mp4" -i "$ROOT/video/Akhiran-YouTube-Asep.mp4" -filter_complex \
  "[0:v]fps=30,setsar=1[v0];[1:v]fps=30,scale=1080:1920,setsar=1[v1];[0:a]aresample=48000,aformat=channel_layouts=stereo[a0];[1:a]aresample=48000,aformat=channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
echo "$OUT"
