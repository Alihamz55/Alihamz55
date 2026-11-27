# Avatar blok 3D (produksi terpisah: Badai Rapor)

Tokoh Raka dan Mama Rina, gaya avatar game blok (kepala silinder, badan kotak). Tidak memakai tokoh Malam Komedi.

- `avatar.js`: geometri tokoh, rambut, kostum, dan wajah (tekstur datar, ganti ekspresi lewat `head.userData.setExpr('kaget')`).
- `index.html`: adegan kompleks perumahan (`?mode=hero`) dan lembar ekspresi (`?mode=faces`).
- `render.cjs`: render ke PNG.

Cara render:
```
mkdir -p /home/user/shorts/blok && cd /home/user/shorts/blok
npm init -y && npm i three@0.187.0
for f in avatar.js index.html render.cjs; do ln -sf /home/user/Alihamz55/engine/blok/$f .; done
node render.cjs hero hero.png
node render.cjs faces faces.png
```
Ekspresi: neutral, happy, smug, surprised, worried, annoyed, sad, gentle, confused, laugh.
