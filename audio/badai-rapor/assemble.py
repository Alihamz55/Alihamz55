# Sambung 13 kalimat jadi voice.wav (48 kHz) + timing.json
import json, subprocess, wave, numpy as np
SPK = ['raka']*7 + ['mama','mama'] + ['raka']*4
GAP = {8: 0.5, 10: 0.45, 11: 0.35}   # jeda SETELAH kalimat ke-n (1-based)
LEAD, TAIL, DEF = 0.1, 0.3, 0.15
SR = 48000
out, t, timing = [np.zeros(int(LEAD*SR))], LEAD, []
for i in range(1, 14):
    raw = subprocess.run(['ffmpeg','-loglevel','error','-i',f'tight/l{i:02d}.wav','-ar',str(SR),'-ac','1','-f','s16le','-'],capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32)/32768
    timing.append({'n': i, 'spk': SPK[i-1], 'start': round(t,3), 'end': round(t+len(a)/SR,3)})
    out.append(a); t += len(a)/SR
    g = TAIL if i == 13 else GAP.get(i, DEF)
    out.append(np.zeros(int(g*SR))); t += g
y = np.concatenate(out); y = y/ max(1e-6, np.abs(y).max()) * 0.89
w = wave.open('voice.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((y*32767).astype(np.int16).tobytes()); w.close()
json.dump(timing, open('timing.json','w'), indent=1)
print('total', round(t,2))
for x in timing: print(x)
