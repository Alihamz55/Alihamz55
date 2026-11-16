import wave,numpy as np,json
SR=24000
def rd(n):
    w=wave.open(f'fast/{n}.wav'); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
def compress(a,maxgap=0.45):
    hop=240; r=np.array([np.sqrt(np.mean(a[i:i+hop]**2)) for i in range(0,len(a),hop)])
    loud=r>0.012; out=[]; i=0; n=len(r)
    while i<n:
        if loud[i]: out.append(a[i*hop:(i+1)*hop]); i+=1
        else:
            j=i
            while j<n and not loud[j]: j+=1
            g=(j-i)*hop; keep=min(g,int(maxgap*SR)); seg=a[i*hop:j*hop]
            out.append(np.concatenate([seg[:keep//2],seg[len(seg)-(keep-keep//2):]]) if keep<g else seg); i=j
    return np.concatenate(out)
def trim(a):
    hop=240; r=np.array([np.sqrt(np.mean(a[i:i+hop]**2)) for i in range(0,len(a),hop)]); idx=np.where(r>0.01)[0]
    return a[max(0,idx[0]*hop-1200):min(len(a),(idx[-1]+1)*hop+2400)]
import os
def robot(a):
    t=np.arange(len(a))/SR
    rm=a*np.sin(2*np.pi*55*t)            # ring-mod for a digital edge
    d=int(0.012*SR); ch=np.concatenate([np.zeros(d,np.float32),a[:-d]])
    return (a*0.82+rm*0.22+ch*0.3).astype(np.float32)
gap_after={1:0.25,2:1.0,3:0.25,4:0.3,5:0.25,6:0.25,7:0.9,8:0.25,9:0.25,10:1.7,11:0.6}
spk="I A I A I A I A I A P I".split()
lead=0.4; t=lead; lines=[]; segs=[]
for i in range(1,13):
    a=compress(trim(rd(f'l{i:02d}')), 0.3)
    if spk[i-1]=='P':
        d=int(0.11*SR); e=np.concatenate([np.zeros(d,np.float32),a])[:len(a)]; d2=int(0.22*SR); e2=np.concatenate([np.zeros(d2,np.float32),a])[:len(a)]
        a=(a*0.85+e*0.32+e2*0.16).astype(np.float32)
    
    a0=t; segs.append((a0,a)); t+=len(a)/SR
    lines.append([spk[i-1], int(a0*30), int(t*30)])
    t+=gap_after.get(i,0.35)
t+=1.6
v=np.zeros(int((t+0.5)*SR),np.float32)
for a0,a in segs: n=int(a0*SR); v[n:n+len(a)]+=a
v=v/np.max(np.abs(v))*0.9
with wave.open('orig.wav','wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((v*32767).astype(np.int16).tobytes())
json.dump(lines,open('lines.json','w'))
print(round(t,2), int(t*30)); print(lines)
