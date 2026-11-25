import numpy as np, wave
SR=48000; DUR=1127/30; N=int(DUR*SR); rng=np.random.default_rng(97); F=lambda fr: fr/30
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
b=60/120; t=0; k=0; prog=[(50,[62,66,69]),(55,[62,67,71]),(57,[64,69,73]),(55,[62,67,71])]
while t<DUR-1.0:
    fr=t*30
    if not any(a<=fr<a+30 for a in (345,560,895)) and fr<1092:
        root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*.9,.12,.3),t,.8)
        for j_,m in enumerate(ch): place(music,synth(midi(m+12),.12,.05,.6),t+j_*b/3,.2)
    t+=b; k+=1
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
def rimshot():
    n=int(.3*SR);tt=np.arange(n)/SR; return (rng.standard_normal(n)*np.exp(-tt*35)*.6+np.sin(2*np.pi*330*tt)*np.exp(-tt*25)*.5)
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for _ in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
def notif():
    return np.concatenate([synth(midi(88),.12,.08,.3),synth(midi(93),.4,.2,.3)])
def stamp():
    n=int(.35*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*90*tt)*np.exp(-tt*18)+rng.standard_normal(n)*np.exp(-tt*40)*.6)
def whoosh():
    n=int(.4*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.sin(np.pi*tt/.4)**2*.3
place(sfx,notif(),F(30),.6); place(sfx,whoosh(),F(369),.5); place(sfx,stamp(),F(440),.7); place(sfx,notif(),F(655),.5)
for a,d,k in [(345,1.6,0.9),(456,1.0,0.6),(556,1.6,1.0),(762,1.0,0.6),(895,2.0,1.3),(1092,2.4,1.3)]:
    place(sfx,crowd_laugh(d,k),F(a),.7*min(1.25,k))
W('music.wav',music); W('sfx.wav',sfx)
