#!/usr/bin/env python3
"""Mix voice + music + sfx stems -> mix_raw.wav, with music and SFX at 50 % of the voice level.

Usage: python3 mix.py voice.mp3 music.wav sfx.wav [--out mix_raw.wav] [--ratio 0.5]

- Voice is untouched (one fixed gain of 1.0, never ducked, compressed or re-timed).
- Level = gated RMS (samples within 30 dB of the loudest 50 ms window), so silences don't skew it.
- Music is scaled so its gated RMS = ratio x voice gated RMS (ratio 0.5 = -6.0 dB).
- SFX uses the same ratio, then is capped so its peak never exceeds 0.7 x the voice peak.
- Only a linear gain per stem plus a final peak limiter on the sum. No ducking.
"""
import subprocess, sys, wave
import numpy as np

SR = 48000

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()

def gated_rms(x, win=0.05, gate_db=30):
    n = int(win * SR); m = len(x) // n
    if m == 0: return float(np.sqrt(np.mean(x ** 2)) + 1e-12)
    blocks = x[: m * n].reshape(m, n); r = np.sqrt((blocks ** 2).mean(1))
    keep = r > r.max() * 10 ** (-gate_db / 20)
    return float(np.sqrt((blocks[keep] ** 2).mean()) + 1e-12)

def db(a, b): return 20 * np.log10(a / b)

def main():
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    opt = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
    out, ratio = opt("--out", "mix_raw.wav"), float(opt("--ratio", "0.5"))
    voice_p, music_p, sfx_p = a[:3]
    v, m, s = load(voice_p), load(music_p), load(sfx_p)
    n = len(v)                                    # the picture is timed to the voice: length = voice length
    fit = lambda x: np.pad(x, (0, max(0, n - len(x))))[:n]
    m, s = fit(m), fit(s)
    rv = gated_rms(v); vpk = float(np.abs(v).max())
    gm = ratio * rv / gated_rms(m)
    gs = ratio * rv / gated_rms(s)
    cap = 0.7 * vpk / (float(np.abs(s).max()) + 1e-12)
    capped = gs > cap; gs = min(gs, cap)
    mix = v + m * gm + s * gs
    pk = float(np.abs(mix).max())
    if pk > 0.95: mix *= 0.95 / pk                # linear whole-mix limiter; ratios stay intact
    fade = int(0.04 * SR); mix[-fade:] *= np.linspace(1, 0, fade)
    with wave.open(out, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    k = 0.95 / pk if pk > 0.95 else 1.0
    print(f"voice gated RMS  {db(rv * k, 1):7.2f} dBFS")
    print(f"music vs voice   {db(gated_rms(m * gm), rv):7.2f} dB   (target {db(ratio, 1):.1f})")
    print(f"sfx   vs voice   {db(gated_rms(s * gs), rv):7.2f} dB   (target {db(ratio, 1):.1f} or lower){'  [peak-capped]' if capped else ''}")
    print(f"sfx peak / voice peak {float(np.abs(s * gs).max()) / vpk:.2f}  (max 0.70)")
    print(f"wrote {out}  {n / SR:.2f} s")

if __name__ == "__main__": main()
