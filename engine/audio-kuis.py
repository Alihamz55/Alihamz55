import numpy as np, wave
SR=48000; DUR=1589/30; N=int(DUR*SR); rng=np.random.default_rng(5)
F=lambda fr: fr/30
def W(name,x):
    x=x/ (np.abs(x).max()+1e-9)*0.9
    with wave.open(name,'wb') as w: w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype(np.int16).tobytes())
def place(buf,s,t0,g=1.0):
    i=int(t0*SR); j=min(N,i+len(s))
    if 0<=i<N: buf[i:j]+=s[:j-i]*g
def env(n,a=.005,r=.3): t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/r)
midi=lambda m:440*2**((m-69)/12)
def synth(f,dur,r=.4,br=.5,a=.005):
    n=int(dur*SR);t=np.arange(n)/SR; s=sum((br**k)*np.sin(2*np.pi*f*(k+1)*t)/(k+1) for k in range(6)); return s*env(n,a,r)
music=np.zeros(N); sfx=np.zeros(N)
# --- tension bed (studio parts): pulse 120bpm, minor arps
beat=0.5; t=0; k=0
prog=[45,41,43,40]  # A F G E
def studio(tt): f=tt*30; return not (564<=f<787)
WINs=F(1119)
while t<DUR:
    if studio(t):
        root=prog[(k//8)%4]
        if t<WINs or t>F(1360):
            place(music,synth(midi(root-12),0.45,.18,.3),t,.9)              # pulse
            place(music,synth(midi(root+12+[0,3,7,12][k%4]),0.3,.12,.6),t+0.25,.35)  # arp
            if k%2==0: place(music,np.sin(2*np.pi*2200*np.arange(int(.03*SR))/SR)*env(int(.03*SR),.001,.008),t,.25) # tick
        else:  # win: major bright
            root=[48,53,55,48][(k//4)%4]
            for m in (0,4,7): place(music,synth(midi(root+12+m),0.5,.25,.6),t,.35)
            place(music,synth(midi(root-12),0.45,.2,.3),t,.8)
    t+=beat; k+=1
# phone scene: light comedic bed (house)
t=F(564)
while t<F(787):
    place(music,synth(midi([60,64,67,64][int((t-F(564))/0.25)%4]),0.2,.08,.5),t,.3); t+=0.25
# heartbeat under final suspense
for i,tt in enumerate(np.arange(F(1084),F(1119),0.6)):
    place(music,synth(55,0.25,.08,.2),tt,1.2); place(music,synth(55,0.25,.08,.2),tt+0.18,0.9)
# ---- SFX ----
def ring():
    n=int(1.6*SR);tt=np.arange(n)/SR; s=(np.sin(2*np.pi*1400*tt)+np.sin(2*np.pi*1750*tt))*(np.sin(2*np.pi*20*tt)>0)*((tt%0.8)<0.5)
    return s*.3
def tut():
    n=int(1.1*SR);tt=np.arange(n)/SR; return np.sin(2*np.pi*425*tt)*((tt%0.37)<0.2)*.35
def ting(): return synth(midi(88),0.6,.25,.4)+synth(midi(95),0.6,.2,.3)*.5
def lock():
    n=int(.5*SR);tt=np.arange(n)/SR; return (np.sin(2*np.pi*(300-150*tt)*tt)+rng.standard_normal(n)*.2)*env(n,.002,.12)
def drumroll(d):
    n=int(d*SR);tt=np.arange(n)/SR; x=rng.standard_normal(n)*(0.5+0.5*np.abs(np.sin(2*np.pi*14*tt))); return x*np.minimum(1,tt/d*1.3)*.4
def cymbal():
    n=int(1.6*SR);tt=np.arange(n)/SR; x=np.diff(rng.standard_normal(n),prepend=0); return x*np.exp(-tt*2.2)*.5
def fanfare():
    o=np.zeros(int(1.6*SR))
    for i,m in enumerate([72,76,79,84]):
        s=synth(midi(m),0.5 if i<3 else 1.0,.3,.8,.01); a=int(i*.14*SR); o[a:a+len(s)]+=s[:len(o)-a]
    return o*.6
def applause(d):
    n=int(d*SR);tt=np.arange(n)/SR; x=np.zeros(n)
    for _ in range(900):
        i=rng.integers(0,n-2000); x[i:i+600]+=rng.standard_normal(600)*np.exp(-np.arange(600)/90)
    return x*np.minimum(1,tt/.3)*np.minimum(1,(d-tt)/.8)*.25
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for k in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
def whoosh():
    n=int(.35*SR);tt=np.arange(n)/SR; return rng.standard_normal(n)*np.sin(np.pi*tt/.35)*.3
def sadtrombone():
    o=np.zeros(int(2.4*SR))
    for i,m in enumerate([55,54,53,52]):
        d=0.45 if i<3 else 1.0; n=int(d*SR); tt=np.arange(n)/SR; f=midi(m)*(1+0.02*np.sin(2*np.pi*5*tt)*(i==3))
        s=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*0.3+np.sin(2*np.pi*np.cumsum(f)/SR)*.5; s*=env(n,.02,d*.8); a=int(i*.5*SR); o[a:a+n]+=s[:len(o)-a]
    return o*.5
place(sfx,ring(),F(560)); place(sfx,tut(),F(770)); place(sfx,ting(),F(GONE:=925)); place(sfx,ting(),F(940))
for fr in (315,354,397,439): place(sfx,synth(midi(84),0.25,.1,.4),F(fr),.6)
place(sfx,lock(),F(1068)); place(sfx,drumroll(F(1119)-F(1084)),F(1084),.6); place(sfx,cymbal(),F(1119),.35); place(sfx,fanfare(),F(1119),.55); place(sfx,applause(4.2),F(1121))
place(sfx,laugh(),F(1470),.8); place(sfx,sadtrombone(),F(1555),.7)
for fr in (564,587,673,722,787): place(sfx,whoosh(),F(fr)-0.12,.6)
place(sfx,laugh(1.8),F(960),.5)
W('music.wav',music); W('sfx.wav',sfx)
