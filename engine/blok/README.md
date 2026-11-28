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

## Film "Badai Rapor"
- `film.js` + `film.html`: 5 set (studio TV, ruang tamu, sekolah, kompleks, rumah), 27 shot, cuaca (cerah, mendung, hujan, senja, pelangi), petir, caption satu kata (kata kunci merah).
- `render-film.cjs`: `node render-film.cjs test "60,300"` atau `node render-film.cjs frames "0-599"` (±0,55 dtk/frame; 3 proses paralel ±6 menit).
- Butuh `words.json` dari `audio/badai-rapor/` di folder kerja.
- `finish.sh frames mix_raw.wav out.mp4`: gabung + loudness -14 LUFS + QA.
- Hasil: `video/Badai-Rapor.mp4` (59,8 dtk).

## Akhiran (end card) Kota Kotak
- `renderEnding(f)` di `film.js` (180 frame = 6 dtk). Render: `END=1 node render-film.cjs frames "0-179"` -> `end-frames/`.
- Ganti teks episode lewat `setEpisode('EPISODE 2 · ...', 'Episode 3 besok!')`, atau ubah objek `EP` di `film.js`.
- Audio: `audio/badai-rapor/akhiran_audio.py` (butuh `mama_f.wav` dan `raka_f.wav` = `akhiran-mama.wav`, `akhiran-raka.wav`).
- Hasil: `video/Akhiran-KotaKotak-Ep1.mp4`, dan versi tersambung `video/Badai-Rapor-YT.mp4` (65,9 dtk).
