# Slideshow tutorial (contoh: Cara Bikin Robot Kardus)

For turning a "10 step" infographic into a Short, with no 3D render (about 1 minute).
1. Cut the infographic panels into `panels/p0..p9.png`, then put the voice lines in `trim/lNN.wav` (Speko Achird, atempo 1.12, silence trimmed).
2. `python3 make.py test 60,300` checks a few frames. For the full render: `python3 make.py 0 1`.
   (Run make.py once BEFORE rendering in parallel, because every process rewrites voice.wav.)
3. `python3 audio.py && python3 mix.py voice.wav music.wav sfx.wav && bash finish.sh "Judul"` (mix.py and finish.sh come from pipeline-template).
4. Add the YouTube ending → `video/<Judul>-YT.mp4`.
