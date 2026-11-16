import numpy as np, subprocess, wave, json
SR=48000; FPS=30
def load(p,ch=1):
    raw=subprocess.run(["ffmpeg","-v","error","-i",p,"-ac",str(ch),"-ar",str(SR),"-f","f32le","-"],capture_output=True,check=True).stdout
    x=np.frombuffer(raw,np.float32).copy(); return x.reshape(-1,ch) if ch>1 else x
song=load("song.mp3",2); DUR=len(song)/SR; N=len(song)
# ---- beat tracking ----
mono=song.mean(1); hop=512; e=np.array([np.sqrt((mono[i:i+1024]**2).mean()) for i in range(0,N-1024,hop)])
on=np.maximum(0,np.diff(np.log(e+1e-4))); on-=on.mean()
fr=SR/hop; best=None
for bpm in np.arange(60,180,0.25):
    lag=fr*60/bpm; li=int(round(lag)); s=(on[:-li]*on[li:]).sum() if li<len(on) else 0
    if best is None or s>best[0]: best=(s,bpm)
bpm=best[1]; per=fr*60/bpm
ph=max(range(int(per)),key=lambda p:sum(on[int(p+k*per)] for k in range(int((len(on)-p)/per))))
beat0=ph/fr
print("bpm",bpm,"beat0",round(beat0,3))
# ---- timeline (s) ----
T={'D1':12.7,'A1':17.15,'D2':20.95,'I1':26.0}
files={'D1':'fast/l01.wav','A1':'fast/l02.wav','D2':'fast/l03.wav','I1':'fast/l04.wav'}
voice=np.zeros(N,np.float32); lines=[]
for k,t0 in T.items():
    v=load(files[k]); i=int(t0*SR); voice[i:i+len(v)]+=v[:N-i]
    # trim silent edges for line spans
    a=np.where(np.abs(v)>0.02)[0]; lines.append((k[0],int((t0+a[0]/SR)*FPS),int((t0+a[-1]/SR)*FPS)))
# ---- duck envelope for song ----
g=np.ones(N,np.float32); t=np.arange(N)/SR
def seg(t0,t1,lvl,fade):
    m=(np.clip((t-t0)/fade,0,1)*np.clip((t1-t)/fade,0,1)); return 1-(1-lvl)*m
g*=seg(12.45,24.75,0.16,0.35); g*=seg(25.9,28.2,0.55,0.25)
songd=song*g[:,None]
# ---- sfx ----
rng=np.random.default_rng(3); sfx=np.zeros(N,np.float32)
def put(sig,t0,a=1):
    i=int(t0*SR); j=min(N,i+len(sig)); sfx[i:j]+=sig[:j-i]*a
def scratch():  # record scratch
    n=int(.45*SR); tt=np.arange(n)/SR; f=900*np.exp(-tt*5)+120; ph=2*np.pi*np.cumsum(f)/SR
    return (np.sign(np.sin(ph))*.3+rng.standard_normal(n)*.25)*np.exp(-tt*4)*np.minimum(1,tt/.01)
def tone(f0,f1,dur,dec,a):
    tt=np.arange(int(dur*SR))/SR; f=f1+(f0-f1)*np.exp(-tt*25); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt/dec)*a
def nz(dur,dec,a):
    tt=np.arange(int(dur*SR))/SR; return np.diff(rng.standard_normal(len(tt)),prepend=0)*np.exp(-tt/dec)*a
def mx(*s):
    o=np.zeros(max(map(len,s)));
    for x in s:o[:len(x)]+=x
    return o
dang=lambda:mx(tone(140,62,.5,.22,.9),nz(.02,.004,.15)); tung=lambda:mx(tone(240,170,.25,.09,.5),nz(.02,.003,.1))
tak=lambda:mx(tone(520,420,.12,.03,.35),nz(.08,.018,.35))
def door():
    n=int(.7*SR); tt=np.arange(n)/SR; f=420+120*np.sin(tt*9); return np.sin(2*np.pi*np.cumsum(f)/SR)*.25*np.exp(-tt*2.5)*np.minimum(1,tt/.05)
def laugh():
    n=int(2.2*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for k in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4):
            on_=(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2).astype(float)
            s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*on_
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
put(door(),11.1,.8); put(scratch(),12.4,.9)
bl=60/bpm/2
for j,h in enumerate([tak,tak,tung,tak,tung,dang]): put(h(),24.75-6*bl/1.0+j*bl,1.0)  # kendang roll into joget
put(laugh(),32.6,.7)
# ---- levels: voice ref ----
def grms(x):
    n=int(.05*SR); m=len(x)//n; b=x[:m*n].reshape(m,n); r=np.sqrt((b**2).mean(1)); k=r>r.max()*10**(-1.5); return np.sqrt((b[k]**2).mean())
rv=grms(voice)
sm=songd.mean(1); full=grms(song.mean(1))
gs=rv/full*0.9   # song at full ~ voice level (it IS the main audio)
sfx*=0.5*rv/grms(sfx); sfx=np.clip(sfx,-0.7*np.abs(voice).max(),0.7*np.abs(voice).max())
mixL=songd[:,0]*gs+voice+sfx; mixR=songd[:,1]*gs+voice+sfx
st=np.stack([mixL,mixR],1); pk=np.abs(st).max(); st*=0.95/pk if pk>.95 else 1
fade=int(.6*SR); st[-fade:]*=np.linspace(1,0,fade)[:,None]
with wave.open("mix_raw.wav","wb") as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(st,-1,1)*32767).astype(np.int16).tobytes())
with wave.open("voice_full.wav","wb") as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(voice,-1,1)*32767).astype(np.int16).tobytes())
# song vocal-ish track for Asep lips (mid channel band-passed)
X=np.fft.rfft(song.mean(1)); f=np.fft.rfftfreq(N,1/SR); X*=((f>250)&(f<3500)); vb=np.fft.irfft(X,N).astype(np.float32)
with wave.open("songvox.wav","wb") as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((vb/np.abs(vb).max()*32767*.9).astype(np.int16).tobytes())
json.dump({'bpm':bpm,'beat0':beat0,'total':int(DUR*FPS),'lines':lines},open('timing.json','w'))
print(json.dumps({'total':int(DUR*FPS),'lines':lines}))
