import numpy as np, wave
SR=48000; DUR=1550/30; N=int(DUR*SR); rng=np.random.default_rng(29); F=lambda fr: fr/30
def W(name,x):
    x=x/(np.abs(x).max()+1e-9)*0.9
    with wave.open(name,'wb') as w: w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype(np.int16).tobytes())
def place(buf,s,t0,g=1.0):
    i=int(t0*SR); j=min(N,i+len(s))
    if 0<=i<N: buf[i:j]+=s[:j-i]*g
def env(n,a=.005,r=.3): t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/r)
midi=lambda m:440*2**((m-69)/12)
def synth(f,dur,r=.3,br=.5,a=.004):
    n=int(dur*SR);t=np.arange(n)/SR; return sum((br**k)*np.sin(2*np.pi*f*(k+1)*t)/(k+1) for k in range(6))*env(n,a,r)
music=np.zeros(N); sfx=np.zeros(N)
# beachy ukulele loop 110 bpm (reggae-ish offbeat), silent on the awkward pause
b=60/110; t=0; k=0; prog=[(48,[64,67,72]),(53,[65,69,72]),(55,[67,71,74]),(53,[65,69,72])]
while t<DUR:
    fr=t*30
    if not (1223<=fr<1248):
        root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*.8,.15,.3),t,.75)
        for m in ch: place(music,synth(midi(m),.14,.05,.65),t+b/2,.17)
    t+=b; k+=1
def waves(d):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=1/(1+(f/700)**2); y=np.fft.irfft(X,n); tt=np.arange(n)/SR
    return y/np.abs(y).max()*(0.4+0.6*(0.5+0.5*np.sin(2*np.pi*tt/6)))*.25
def ting(): return synth(midi(88),.4,.15,.3)*.6
def jreng():
    o=np.zeros(int(1.0*SR))
    for m in (48,55,60,64,67): s=synth(midi(m),1.0,.4,.7); o[:len(s)]+=s
    return o*.3
def cricket(d):
    n=int(d*SR);tt=np.arange(n)/SR; return np.sin(2*np.pi*4600*tt)*((np.sin(2*np.pi*14*tt)>0.3)*(np.sin(2*np.pi*1.4*tt)>-.2))*.15
def rimshot():
    n=int(.3*SR);tt=np.arange(n)/SR; return (rng.standard_normal(n)*np.exp(-tt*35)*.6+np.sin(2*np.pi*330*tt)*np.exp(-tt*25)*.5)
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for _ in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
place(sfx,waves(DUR),0); 
for fr in (115,358,580): place(sfx,ting(),F(fr),.6)
place(sfx,jreng(),F(895),.25); place(sfx,cricket(0.9),F(1224),.9); place(sfx,laugh(1.5),F(740),.4); place(sfx,laugh(1.5),F(1300),.5); place(sfx,rimshot(),F(1522),.18); place(sfx,laugh(),F(1525),.8)
W('music.wav',music); W('sfx.wav',sfx)
