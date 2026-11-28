import numpy as np, wave
SR=48000; DUR=987/30; N=int(DUR*SR); rng=np.random.default_rng(151); F=lambda fr: fr/30
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
def pad(ms,dur):
    n=int(dur*SR); t=np.arange(n)/SR; x=sum(np.sin(2*np.pi*midi(m)*t+0.3*np.sin(2*np.pi*5*t))+0.3*np.sin(4*np.pi*midi(m)*t) for m in ms)
    return x*np.minimum(1,t/.4)*np.minimum(1,(dur-t)/.4)
music=np.zeros(N); sfx=np.zeros(N)
HUJAN=490
# musik romantis (waltz ringan) sampai doa Ucup; choir saat doa; piano sedih setelah hujan
b=60/96; t=0; k=0; prog=[(48,[64,67,72]),(45,[64,69,72]),(50,[65,69,74]),(43,[62,67,71])]
while t<F(290):
    root,ch=prog[(k//3)%4]; place(music,synth(midi(root-12),b*.9,.3,.3),t,.6) if k%3==0 else [place(music,synth(midi(m+12),.25,.15,.4),t,.14) for m in ch]
    t+=b; k+=1
def choir(d):
    n=int(d*SR); tt=np.arange(n)/SR; x=sum(np.sin(2*np.pi*midi(m)*tt+.4*np.sin(2*np.pi*5*tt))+.3*np.sin(4*np.pi*midi(m)*tt) for m in (72,76,79,84))
    return x*np.minimum(1,tt/.6)*np.minimum(1,(d-tt)/.4)*.18
place(music,choir(F(HUJAN)-F(292)),F(292),1.0)
b=60/70; t=F(560); k=0; sad=[[57,60,64],[53,57,60],[55,59,62],[52,55,59]]
while t<DUR-.6:
    ch=sad[(k//4)%4]; place(music,synth(midi(ch[k%3]+12),b*1.5,.6,.35),t,.3); t+=b; k+=1
def rain(d):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=((f>400)&(f<9000))*(1/np.sqrt(np.maximum(f,1)/400)); y=np.fft.irfft(X,n); return y/np.abs(y).max()*.32
def rumble(d,g=1.0):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=(f<160); y=np.fft.irfft(X,n); y/=np.abs(y).max(); tt=np.arange(n)/SR; return y*np.exp(-tt*1.2)*np.minimum(1,tt/.08)*g
def crack():
    n=int(1.0*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-tt*9)*.9+rumble(1.0,.8)
def crickets(d):
    n=int(d*SR); tt=np.arange(n)/SR; return np.sin(2*np.pi*4300*tt)*((np.sin(2*np.pi*14*tt)>0.3)*(np.sin(2*np.pi*.7*tt)>0))*.05
def ding(): return np.concatenate([synth(midi(88),.12,.08,.3),synth(midi(93),.4,.2,.3)])
place(sfx,crickets(F(HUJAN)),0,1.0); place(sfx,rain(DUR-F(HUJAN)),F(HUJAN),1.0)
place(sfx,rumble(1.2,.9)+np.pad(rng.standard_normal(int(.5*SR))*np.exp(-np.arange(int(.5*SR))/SR*9),(0,int(.7*SR))),F(HUJAN),1.0)
place(sfx,rumble(2.5,.6),F(668),.7); place(sfx,ding(),F(525),.6)
sfx=np.tanh(sfx*2.2)/np.tanh(2.2)
W('music.wav',music); W('sfx.wav',sfx)
