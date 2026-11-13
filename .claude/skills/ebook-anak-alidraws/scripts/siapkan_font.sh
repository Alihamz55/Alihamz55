#!/usr/bin/env bash
# Unduh font brand (Poppins, Luckiest Guy, Baloo 2) dari npm lalu ubah ke .ttf.
# Pakai: bash siapkan_font.sh <folder_tujuan>
set -euo pipefail
OUT="${1:?folder tujuan wajib diisi}"
mkdir -p "$OUT"; WORK="$(mktemp -d)"; cd "$WORK"
npm pack @fontsource/poppins@5.0.14 @fontsource/luckiest-guy@5.0.19 @fontsource/baloo-2@5.0.19 --silent >/dev/null
for f in *.tgz; do tar xzf "$f" --one-top-level="${f%.tgz}"; done
python3 -c "import fontTools" 2>/dev/null || pip install -q fonttools
python3 - "$OUT" <<'PY'
import sys
from fontTools.ttLib import TTFont
out=sys.argv[1]
peta={
 "fontsource-poppins-5.0.14/package/files/poppins-latin-900-normal.woff":"Poppins-Black.ttf",
 "fontsource-poppins-5.0.14/package/files/poppins-latin-800-normal.woff":"Poppins-ExtraBold.ttf",
 "fontsource-poppins-5.0.14/package/files/poppins-latin-600-normal.woff":"Poppins-SemiBold.ttf",
 "fontsource-poppins-5.0.14/package/files/poppins-latin-500-normal.woff":"Poppins-Medium.ttf",
 "fontsource-luckiest-guy-5.0.19/package/files/luckiest-guy-latin-400-normal.woff":"LuckiestGuy.ttf",
 "fontsource-baloo-2-5.0.19/package/files/baloo-2-latin-800-normal.woff":"Baloo2-ExtraBold.ttf",
 "fontsource-baloo-2-5.0.19/package/files/baloo-2-latin-600-normal.woff":"Baloo2-SemiBold.ttf",
}
for src,dst in peta.items():
    f=TTFont(src); f.flavor=None; f.save(f"{out}/{dst}"); print("ok", dst)
PY
rm -rf "$WORK"
