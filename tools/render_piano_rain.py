import subprocess, sys, math
import numpy as np, cv2
from scipy.signal import stft, find_peaks
from scipy.ndimage import gaussian_filter1d

IMG = '/root/.claude/uploads/512906d6-09b9-54b4-9645-6c42165fd1df/51262639-image.png'
AUD = '/root/.claude/uploads/512906d6-09b9-54b4-9645-6c42165fd1df/4ece9dca-SnapTik.Net_7701720333996412212.mp3'
OUT = sys.argv[1]
LIMIT = float(sys.argv[2]) if len(sys.argv) > 2 else None
FPS, W, H = 30, 1080, 1920
rng = np.random.default_rng(7)

# ---------- audio analysis ----------
SR = 22050
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', AUD, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                     capture_output=True).stdout
a = np.frombuffer(raw, np.float32)
dur = len(a) / SR
if LIMIT: dur = min(dur, LIMIT)
N = int(dur * FPS)
hop = SR // FPS
f, t, Z = stft(a, SR, nperseg=2048, noverlap=2048 - hop)
M = np.abs(Z)
def band(lo, hi): return M[(f >= lo) & (f < hi)].sum(0)
# vocal-ish energy: formant band relative to full
voc = band(250, 3500)
voc = gaussian_filter1d(voc, 1.0)
lo_, hi_ = np.percentile(voc, 30), np.percentile(voc, 97)
voc = np.clip((voc - lo_) / (hi_ - lo_), 0, 1)
# attack/release smoothing
env = np.zeros_like(voc); v = 0
for i, x in enumerate(voc):
    v = v + (x - v) * (0.6 if x > v else 0.25); env[i] = v
ratio = gaussian_filter1d(band(1000, 4000) / (M.sum(0) + 1e-6), 4)
vgate = np.clip((ratio - 0.2) / 0.1, 0, 1)
env = env * vgate
env = np.where(env < 0.12, 0, env)
# piano onsets via spectral flux
L = np.log1p(M)
flux = np.maximum(L[:, 1:] - L[:, :-1], 0).sum(0); flux = np.concatenate([[0], flux])
flux = gaussian_filter1d(flux, 0.7)
peaks, _ = find_peaks(flux, height=np.percentile(flux, 70), distance=4)
loud = gaussian_filter1d(M.sum(0), 15); loud = loud / loud.max()
def at(arr, i): return arr[min(i, len(arr) - 1)]

# per-finger press pulses
finger_x = [733, 757, 781, 803]
finger_y = [672, 676, 676, 670]
press = np.zeros((4, N + 1))
for p in peaks:
    if p >= N: continue
    for k in rng.choice(4, size=rng.integers(1, 3), replace=False):
        for d in range(10):
            if p + d <= N: press[k, p + d] = max(press[k, p + d], math.exp(-d / 3.0))

# ---------- image prep ----------
src = cv2.imread(IMG).astype(np.float32)
ih, iw = src.shape[:2]
yy, xx = np.mgrid[0:ih, 0:iw].astype(np.float32)

# mouth geometry (line slants down-right)
mc = np.array([602.0, 409.5])
ang = math.atan2(14, 24)
ux, uy = math.cos(ang), math.sin(ang)       # along lip
nx, ny = -uy, ux                             # normal (down)
S = (xx - mc[0]) * ux + (yy - mc[1]) * uy
T = (xx - mc[0]) * nx + (yy - mc[1]) * ny
gS = np.exp(-(S / 15) ** 2)
fT = np.where(T < 0, np.exp(-(T / 4) ** 2), np.clip(1 - (T - 8) / 30, 0, 1))
mouth_w = gS * fT

# hand masks
arm = np.exp(-(((xx - 720) / 110) ** 2 + ((yy - 650) / 45) ** 2))
fingers = [np.exp(-(((xx - fx) / 10) ** 2 + ((yy - fy) / 22) ** 2)) for fx, fy in zip(finger_x, finger_y)]

def deform(i, mouth_open, sway):
    dx = np.zeros_like(xx); dy = np.zeros_like(yy)
    D = mouth_open * 6.5
    dx += -nx * D * mouth_w * (T > 0)
    dy += -ny * D * mouth_w * (T > 0)
    dx += sway * arm
    dy += 1.2 * math.sin(i / 9.0) * arm
    for k in range(4):
        lift = 4.5 * (1 - press[k, i]) - 2.0    # pressed -> finger goes down
        dy += lift * fingers[k] * 0.9
    out = cv2.remap(src, xx - dx, yy - dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    if D > 0.6:   # dark mouth interior
        m = np.zeros((ih, iw), np.float32)
        c = (mc[0] + nx * (D * 0.5 + 0.5), mc[1] + ny * (D * 0.5 + 0.5))
        cv2.ellipse(m, (int(c[0] * 4), int(c[1] * 4)), (int(10 * 4 * (0.8 + 0.2 * mouth_open)), int(max(D * 0.5, 1) * 4)),
                    math.degrees(ang), 0, 360, 1.0, -1, cv2.LINE_AA, shift=2)
        m = cv2.GaussianBlur(m, (0, 0), 1.0)[..., None] * 0.9
        out = out * (1 - m) + np.array([45, 30, 70], np.float32) * m
    return out

# ---------- layout ----------
fg_w = W; fg_h = int(ih * W / iw); fg_y = (H - fg_h) // 2
bg = cv2.resize(src, (int(iw * H / ih), H)); bx = (bg.shape[1] - W) // 2
bg = cv2.GaussianBlur(bg[:, bx:bx + W], (0, 0), 25) * 0.45
fade_m = np.ones((fg_h, 1, 1), np.float32)
e = 70
fade_m[:e, 0, 0] = np.linspace(0, 1, e); fade_m[-e:, 0, 0] = np.linspace(1, 0, e)
sc = W / iw
lantern = (int(100 * sc), int(1015 * sc) + fg_y)
Y, X = np.mgrid[0:H, 0:W].astype(np.float32)
glow_shape = np.exp(-(((X - lantern[0]) ** 2 + (Y - lantern[1]) ** 2) / (2 * 170 ** 2)))[..., None]
vign = (1 - 0.55 * np.clip(((X - W / 2) / (W * 0.75)) ** 2 + ((Y - H / 2) / (H * 0.7)) ** 2, 0, 1))[..., None]
face_c = (602 * sc, 413 * sc + fg_y)

# rain particles
def mk(n, near):
    return dict(x=rng.uniform(-200, W, n), y=rng.uniform(0, H, n),
                v=rng.uniform(38, 55, n) if near else rng.uniform(22, 32, n),
                l=rng.uniform(28, 50, n) if near else rng.uniform(14, 26, n),
                a=rng.uniform(0.25, 0.45, n) if near else rng.uniform(0.12, 0.25, n))
far, near = mk(380, False), mk(110, True)
wind = 0.12
splashes = []
floor_top = int(900 * sc) + fg_y; floor_bot = fg_y + fg_h - 20

def rain_layer(p, thick, blur):
    lay = np.zeros((H, W), np.float32)
    p['y'] += p['v']; p['x'] += p['v'] * wind
    r = p['y'] > H + 60
    p['y'][r] = rng.uniform(-200, -10, r.sum()); p['x'][r] = rng.uniform(-200, W, r.sum())
    for x, y, l, al in zip(p['x'], p['y'], p['l'], p['a']):
        cv2.line(lay, (int(x), int(y)), (int(x - l * wind), int(y - l)), float(al), thick, cv2.LINE_AA)
    return cv2.GaussianBlur(lay, (0, 0), blur) if blur else lay

ff = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS),
                       '-i', '-', '-i', AUD,
                       '-filter_complex',
                       'anoisesrc=color=pink:amplitude=0.5:seed=3,highpass=f=500,lowpass=f=7000,volume=0.07[rn];'
                       f'[1:a]atrim=0:{dur},afade=t=out:st={max(dur-2.5,0)}:d=2.5[s];'
                       f'[rn]atrim=0:{dur},afade=t=in:d=2,afade=t=out:st={max(dur-2.5,0)}:d=2.5[r];'
                       '[s][r]amix=inputs=2:normalize=0[a]',
                       '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
                       '-c:a', 'aac', '-b:a', '192k', '-t', str(dur), '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)

for i in range(N):
    mo = float(at(env, i))
    sway = 3.0 * math.sin(i / 23.0) + 1.5 * math.sin(i / 7.3)
    img = deform(i, mo, sway)
    fg = cv2.resize(img, (fg_w, fg_h), interpolation=cv2.INTER_AREA)
    frame = bg.copy()
    sl = frame[fg_y:fg_y + fg_h]
    frame[fg_y:fg_y + fg_h] = sl * (1 - fade_m) + fg * fade_m
    # lantern flicker + emotional light pulse
    fl = 0.75 + 0.15 * math.sin(i * 0.9) * math.sin(i * 0.37) + 0.1 * rng.random()
    frame += glow_shape * np.array([40, 110, 230], np.float32) * 0.35 * fl
    frame *= 0.93 + 0.1 * float(at(loud, i))
    # slow push-in toward face
    z = 1.0 + 0.12 * (i / max(N - 1, 1)) ** 0.8
    Mz = cv2.getRotationMatrix2D(face_c, 0, z)
    Mz[0, 2] += (W / 2 - face_c[0]) * 0.25 * (z - 1) / 0.12
    frame = cv2.warpAffine(frame, Mz, (W, H), borderMode=cv2.BORDER_REFLECT)
    # drizzle
    rf = rain_layer(far, 1, 0); rn = rain_layer(near, 2, 1.2)
    rain = np.clip(rf + rn, 0, 1)[..., None]
    frame = frame * (1 - rain * 0.6) + np.array([255, 230, 215], np.float32) * rain * 0.6
    # floor splashes
    for _ in range(rng.poisson(1.6)):
        splashes.append([rng.uniform(0, W), rng.uniform(floor_top, floor_bot), 0])
    sp = np.zeros((H, W), np.float32)
    for s in splashes:
        s[2] += 1; r = 2 + s[2] * 2.2
        cv2.ellipse(sp, (int(s[0]), int(s[1])), (int(r), int(r * 0.3)), 0, 0, 360, 0.5 * (1 - s[2] / 10), 1, cv2.LINE_AA)
    splashes = [s for s in splashes if s[2] < 10]
    sp = cv2.GaussianBlur(sp, (0, 0), 0.8)[..., None]
    frame = frame + sp * np.array([255, 220, 200], np.float32) * 0.5
    # cool grade, vignette, grain, fades
    frame = frame * vign
    frame = frame * np.array([1.04, 1.0, 0.95], np.float32)
    frame += rng.normal(0, 3, (H, W, 1)).astype(np.float32)
    k = min(1, i / (1.5 * FPS), (N - 1 - i) / (2.5 * FPS))
    frame *= max(k, 0)
    ff.stdin.write(np.clip(frame, 0, 255).astype(np.uint8).tobytes())
    if i % 150 == 0: print(i, N, flush=True)
ff.stdin.close(); ff.wait()
print('done', OUT)
