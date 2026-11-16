---
name: run-alihamz55
description: Run, render, preview, screenshot or test this Remotion + Three.js vertical-video project (compositions Video3D, Episode12, DoaPanggung, DoaPanggungLaki). Use when asked to render a still/thumbnail, render an MP4, check a frame after a change, start Remotion Studio, list compositions, or regenerate the lip-sync data.
---

# Run this Remotion project (headless)

Vertical 1080x1920 videos built with Remotion + `@remotion/three`. Everything is driven
headlessly through `.claude/skills/run-alihamz55/driver.sh`, which adds the three flags this
container needs. Paths below are relative to the repo root. Outputs go to `out/` (gitignored).

## Prerequisites
Node 22, ffmpeg, python3 + Pillow + numpy, and the pre-installed Playwright browsers under
`/opt/pw-browsers` (the driver uses `chromium_headless_shell-*`). Then:

```bash
npm ci
```

## Run (agent path): the driver

```bash
D=.claude/skills/run-alihamz55/driver.sh
$D list                                   # compositions with fps / size / frame count
$D still Video3D 60                       # -> out/Video3D-60.png  (then Read it to look)
$D sheet Episode12 30,300,700,1100        # -> out/Episode12-sheet.jpg, 4 frames side by side
$D render Video3D out/quick.mp4 0-29      # MP4 of a frame range (quick check, audio included)
$D render Episode12                       # full MP4 -> out/Episode12.mp4
$D studio 3000                            # Studio in background; stop with: pkill -f "remotion studio"
```

After a visual change: `$D sheet <Comp> <frames>` and look at the JPG. A still takes ~5 s
(bundling included); 60 frames of `Video3D` render in ~15 s; the full `Episode12`
(1140 frames) takes ~6 min on 4 CPUs, so render a frame range first and run full renders
with Bash `run_in_background`.

## Direct invocation (no browser)
Lip-sync data for DoaPanggung is generated from the song, not hand-written:

```bash
python3 scripts/buat-gerak-mulut.py public/doa/lagu.mp3 src/doa/mulut.json 30
```
(Regenerates exactly the committed `src/doa/mulut.json`, 2018 frames.)

## Test
```bash
npm run lint      # tsc --noEmit, passes clean
```

## Run (human path)
`npm run dev` opens Remotion Studio in a browser; `npm run render`, `npm run render:ep12`,
`npm run render:doa` render MP4s. **These npm scripts fail in this container as-is** (see
Gotchas); use the driver, or append the same flags it uses.

## Gotchas
- **Remotion downloads its own Chrome from `remotion.media`, which is blocked here**
  (`getaddrinfo ENOTFOUND remotion.media`). Pass `--browser-executable` pointing at the
  pre-installed `chrome-headless-shell` (the driver does).
- **Google fonts (Lilita One, Permanent Marker) go through the HTTPS proxy, whose CA Chromium
  doesn't trust**: `net::ERR_CERT_AUTHORITY_INVALID`, then a 30 s `delayRender` timeout
  ("Fetching Lilita One font"). Fix: `--ignore-certificate-errors`.
- **WebGL**: `remotion.config.ts` sets the `angle` renderer, which has no GPU here:
  `THREE.WebGLRenderer: Error creating WebGL context`. `--gl=swangle` works;
  `--gl=swiftshader` fails with the same error.
- The `THREE.Clock ... deprecated` console warnings during render are harmless.
- `video/` and `branding/` hold finished MP4/PNG deliverables made outside this Remotion project
  (a separate three.js pipeline); they are not rendered from `src/`.

## Troubleshooting
| Symptom | Fix |
|---|---|
| `ENOTFOUND remotion.media` | add `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell` |
| `Timeout (30000ms) ... Fetching Lilita One font` | add `--ignore-certificate-errors` |
| `Error creating WebGL context` | add `--gl=swangle` |
