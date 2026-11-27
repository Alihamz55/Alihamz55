# Suara narasi: Badai Rapor (produksi terpisah)

- Suara: Raka = Leda, Mama Rina = Sulafat (Speko, gemini-3.8-flash-lite-tts, bahasa Indonesia).
- `kalimat/lNN.wav`: 13 kalimat, sudah atempo 1.12 × 1.1 dan jeda dalam kalimat dipadatkan (maks 0,2 dtk).
- `voice.wav`: narasi utuh 48 kHz mono, **59,83 detik**. Waktu mulai/akhir tiap kalimat ada di `timing.json`.
- `assemble.py`: menyambung ulang (jeda 0,15 dtk; lebih panjang setelah kalimat 8, 10, dan 11).
- `narasi-preview.mp3`: untuk didengarkan.
