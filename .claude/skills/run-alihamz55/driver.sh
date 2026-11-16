#!/usr/bin/env bash
# Headless driver for this Remotion project (run from the repo root).
#   driver.sh list                              -> compositions (id, fps, size, frames)
#   driver.sh still  <Comp> <frame> [out.png]   -> one frame as PNG (default out/<Comp>-<frame>.png)
#   driver.sh sheet  <Comp> <f1,f2,...> [out]   -> contact sheet of several frames (default out/<Comp>-sheet.jpg)
#   driver.sh render <Comp> [out.mp4] [a-b]     -> MP4 (optional frame range, e.g. 0-59 for a quick check)
#   driver.sh studio [port]                     -> Remotion Studio in the background (default 3000); stop: pkill -f "remotion studio"
# Adds the three flags this container needs: pre-installed headless shell, swangle GL, ignore proxy TLS.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
BROWSER="${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell}"
[ -x "$BROWSER" ] || BROWSER="$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1)"
FLAGS=(--gl=swangle --browser-executable="$BROWSER" --ignore-certificate-errors)
[ -d node_modules/remotion ] || npm ci
mkdir -p out
quiet() { grep -v -E '^\s+at |Bundling|memory amounts|CGroup|meminfo|docker run|lower amount|^Rendered [0-9]+/|^Encoded [0-9]+/' || true; }
cmd="${1:-list}"; shift || true
case "$cmd" in
  list)   npx remotion compositions src/index.ts "${FLAGS[@]}" 2>&1 | quiet ;;
  still)  c="$1"; f="$2"; o="${3:-out/$c-$f.png}"
          npx remotion still src/index.ts "$c" "$o" --frame="$f" "${FLAGS[@]}" 2>&1 | quiet; test -s "$o" && echo "OK $o" ;;
  sheet)  c="$1"; fr="$2"; o="${3:-out/$c-sheet.jpg}"; files=()
          for f in ${fr//,/ }; do p="out/.sheet-$c-$f.png"; npx remotion still src/index.ts "$c" "$p" --frame="$f" "${FLAGS[@]}" 2>&1 | grep -E 'Error' || true; files+=("$p"); done
          python3 - "$o" "${files[@]}" <<'PY'
import sys
from PIL import Image
out, fs = sys.argv[1], sys.argv[2:]
ims = [Image.open(f).convert("RGB").resize((270, 480)) for f in fs]
sh = Image.new("RGB", (270 * len(ims), 480))
for i, im in enumerate(ims): sh.paste(im, (i * 270, 0))
sh.save(out, quality=88); print("OK", out, len(ims), "frames")
PY
          rm -f out/.sheet-"$c"-*.png ;;
  render) c="$1"; o="${2:-out/$c.mp4}"; extra=(); [ -n "${3:-}" ] && extra=(--frames="$3")
          npx remotion render src/index.ts "$c" "$o" "${FLAGS[@]}" "${extra[@]}" 2>&1 | quiet; test -s "$o" && echo "OK $o" ;;
  studio) port="${1:-3000}"; nohup npx remotion studio src/index.ts --port "$port" --no-open > out/studio.log 2>&1 &
          for _ in $(seq 1 60); do curl -sf -o /dev/null "http://localhost:$port/" && { echo "OK http://localhost:$port"; exit 0; }; sleep 1; done
          echo "studio did not start, see out/studio.log"; exit 1 ;;
  *) sed -n 2,8p "$0"; exit 1 ;;
esac
