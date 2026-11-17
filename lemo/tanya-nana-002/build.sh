#!/bin/sh
# Tanya Nana #002 — bangun ulang film dalam satu perintah (LIB = folder pustaka Lemo-Opuscar)
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/root/lemo-opuscar}; export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
# data peta & timeline (sekali saja; butuh numpy/scipy/pillow)
[ -f "$HERE/data/albedo_wide.jpg" ] || "$LIB/.venv/bin/python" "$HERE/tools/prep.py"
"$LIB/.venv/bin/python" "$HERE/tools/timeline.py"
cd "$LIB"
node core/render/events.mjs "$HERE" --size 1080x1920
LEMO_ANGLE=${LEMO_ANGLE:-swiftshader} node core/render/video.mjs "$HERE" --fps 24 --workers 4 --size 1080x1920 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py"
python3 - "$HERE" <<'PY'
import json, sys, pathlib
h = pathlib.Path(sys.argv[1]); tl = json.load(open(h / "timeline.json"))
json.dump([{"t0": c["t0"], "t1": c["t1"], "text": c["text"]} for c in tl["cues"]], open(h / "out" / "cues.json", "w"))
PY
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/out/cues.json" "$HERE/subtitles_id.srt"
sh "$HERE/tools/mux61.sh" "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/tanya-nana-002.mp4"
