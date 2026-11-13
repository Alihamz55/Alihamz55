# Pipeline template (cadangan)
Salinan pipeline video kartun (episode terakhir: Kena Prank Bule Bandung) supaya sesi baru bisa lanjut.
Pakai: salin folder ini ke /home/user/shorts/<proyek>, `ln -s` node_modules berisi playwright (sudah terpasang global),
lalu: render `node render.mjs frames "0-N"`, audio `python3 audio.py`, `python3 mix.py ...`, `bash finish.sh "Judul"`.
Lip-sync: `python3 tools/lips.py voice.wav TOTAL > web/lips.js`. Toon module: `cat toonbase.js roman.js zfx.js > toon.js`.
