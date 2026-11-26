import numpy as np, wave
SR=48000; DUR=1109/30; N=int(DUR*SR); rng=np.random.default_rng(101); F=lambda fr: fr/30
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
# kotak musik malam (pelan) sampai lampu nyala; lalu musik ceria kecil di akhir
b=60/90; t=0; k=0; mel=[76,79,83,79,76,74,72,74]
while t<F(686):
    place(music,synth(midi(mel[k%8]),.6,.35,.15),t,.25); t+=b; k+=1
t=F(969); k=0
while t<DUR-.4:
    place(music,synth(midi(mel[k%8]-5),.5,.3,.2),t,.22); t+=b*.75; k+=1
def stadium(d):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=((f>250)&(f<2500)); y=np.fft.irfft(X,n); y/=np.abs(y).max()
    tt=np.arange(n)/SR; return y*(0.6+0.4*np.sin(2*np.pi*.13*tt))*.12
def snore(d):
    n=int(d*SR); tt=np.arange(n)/SR; ph=(tt%2.4)/2.4; envl=np.where(ph<.45,np.sin(np.pi*ph/.45),0)
    x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=np.exp(-((f-120)/80)**2)+.3*np.exp(-((f-400)/150)**2); y=np.fft.irfft(X,n); y/=np.abs(y).max(); return y*envl*.6
def jingle():
    o=np.zeros(int(2.0*SR))
    for i,m in enumerate([72,76,79,84,79,84]): s=synth(midi(m),.3,.15,.4); j=int(i*.16*SR); o[j:j+len(s)]+=s[:len(o)-j]*.5
    return o
def click():
    n=int(.06*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-tt*120)
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
place(sfx,stadium(F(430)),0,1.0); place(sfx,stadium(F(686)-F(510)),F(510),1.0)
place(sfx,snore(F(510)-F(296)),F(296),.8); place(sfx,snore(DUR-F(1000)),F(1000),.6)
place(sfx,jingle(),F(442),.45); place(sfx,click(),F(LAMP:=689),.8)
for a,d,k in [(432,1.0,0.7),(568,0.8,0.6),(664,1.6,1.1),(895,0.8,0.6),(944,1.6,1.2),(1074,2.2,1.3)]:
    place(sfx,crowd_laugh(d,k),F(a),.7*min(1.25,k))
W('music.wav',music); W('sfx.wav',sfx)
