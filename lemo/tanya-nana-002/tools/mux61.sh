#!/bin/sh
# Pengganti core/render/mux.sh untuk ffmpeg 6.x: loudnorm dua tahap pada AUDIO SAJA (−14 LUFS, TP −1 dB),
# lalu gabung dengan video tanpa encode ulang gambar. Pakai: sh tools/mux61.sh video.mp4 mix.wav out.mp4
set -e
V=$1; A=$2; O=$3; TMP=$(dirname "$O")/.loud.wav
J=$(ffmpeg -hide_banner -nostats -i "$A" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | sed -n "s/.*\"$1\" : \"\(.*\)\".*/\1/p"; }
ffmpeg -hide_banner -loglevel error -y -i "$A" -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s16le "$TMP"
ffmpeg -hide_banner -loglevel error -y -i "$V" -i "$TMP" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$O"
rm -f "$TMP"
ffmpeg -hide_banner -nostats -i "$O" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' '
