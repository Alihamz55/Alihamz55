import numpy as np, wave
SR=48000; DUR=1506/30; N=int(DUR*SR); rng=np.random.default_rng(83); F=lambda fr: fr/30
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
# musik jalan masuk (jazz ringan) 0-75, lalu sangat pelan saat bit, keluar 1440+
b=60/120; prog=[(50,[62,65,69,72]),(55,[62,65,67,71]),(48,[60,64,67,71]),(57,[61,64,67,69])]
def jazz(t0,t1,g):
    t=t0; k=0
    while t<t1:
        root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*.9,.15,.3),t,.7*g)
        if k%2==1: [place(music,synth(midi(m),.18,.08,.5),t,.16*g) for m in ch]
        place(music,(rng.standard_normal(int(.05*SR))*np.exp(-np.arange(int(.05*SR))/SR*80)),t+b/2,.12*g); t+=b; k+=1
jazz(0,F(75),1.0); jazz(F(1440),DUR-.3,1.0)
def crowd_laugh(d, k=1.0, people=26):
    n=int(d*SR); tt=np.arange(n)/SR; out=np.zeros(n); fr=np.fft.rfftfreq(n,1/SR)
    for p in range(int(people*min(1.4,k))):
        f0=(110 if p%2 else 190)+rng.random()*90; on=rng.random()*.35; rate=4.2+rng.random()*1.8; dur=d*(0.55+rng.random()*.45)
        ph=2*np.pi*np.cumsum(f0*(1+.04*np.sin(2*np.pi*3*tt+rng.random()*6)-.12*tt/d))/SR
        src=sum(np.sin(ph*h)/h**1.1 for h in range(1,18))+rng.standard_normal(n)*.35
        F1,F2,F3=700+rng.random()*200,1150+rng.random()*250,2500+rng.random()*300
        X=np.fft.rfft(src); X*=(np.exp(-((fr-F1)/120)**2)+.6*np.exp(-((fr-F2)/160)**2)+.25*np.exp(-((fr-F3)/250)**2)+.02); v=np.fft.irfft(X,n)
        pulse=np.clip(np.sin(2*np.pi*rate*(tt-on)),0,1)**1.5; envl=((tt>=on)&(tt<on+dur))*np.minimum(1,(tt-on)/.08)*np.exp(-np.maximum(0,tt-on)/(dur*0.9))
        out+=v/np.abs(v).max()*pulse*envl*(0.4+rng.random()*.6)
    out=out/np.abs(out).max(); out=np.tanh(out*3.0)/np.tanh(3.0)
    return out*np.minimum(1,tt/.05)*np.minimum(1,np.maximum(0,d-tt)/.4)
def murmur(d):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=((f>150)&(f<900)); y=np.fft.irfft(X,n); return y/np.abs(y).max()*.05
def rimshot():
    n=int(.3*SR);tt=np.arange(n)/SR; return (rng.standard_normal(n)*np.exp(-tt*35)*.6+np.sin(2*np.pi*330*tt)*np.exp(-tt*25)*.5)
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for _ in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
def applause(d):
    n=int(d*SR); o=np.zeros(n)
    for i in range(int(d*120)):
        m=int(.02*SR); j=int(rng.random()*(n-m)); tt=np.arange(m)/SR; o[j:j+m]+=rng.standard_normal(m)*np.exp(-tt*200)*(0.5+rng.random()*.5)
    tt=np.arange(n)/SR; return o*np.minimum(1,tt/.3)*np.minimum(1,(d-tt)/.8)*.5
place(sfx,murmur(DUR),0,1.0)
place(sfx,np.tanh(applause(3.0)*4)/2,F(30),.6)
for a,b_,k in [(455,520,1),(532,560,0.7),(835,905,1.3),(1088,1125,1),(1290,1320,1),(1440,1506,1.2)]:
    d=(b_-a)/30+1.0; place(sfx,crowd_laugh(d,k),F(a),.75*min(1.25,k))
place(sfx,np.tanh(applause(2.2)*4)/2,F(1452),.5)
W('music.wav',music); W('sfx.wav',sfx)
