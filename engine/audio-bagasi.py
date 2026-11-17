import numpy as np, wave
SR=48000; DUR=1418/30; N=int(DUR*SR); rng=np.random.default_rng(23); F=lambda fr: fr/30
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
# bouncy "travel" loop 120 bpm; stops at the 5-menit card and at the security beep
b=60/120; t=0; k=0; prog=[(50,[62,66,69]),(55,[62,67,71]),(57,[64,69,73]),(55,[62,67,71])]
while t<DUR:
    fr=t*30
    if not (206<=fr<253) and not (540<=fr<560):
        root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*.9,.12,.3),t,.8)
        for j,m in enumerate(ch): place(music,synth(midi(m+12),.12,.05,.6),t+j*b/3,.2)
    t+=b; k+=1
# "5 menit kemudian" sitcom sting
for i,m in enumerate([72,76,79,84]): place(music,synth(midi(m),.35,.15,.5),F(206)+i*0.1,.5)
def ding(): return synth(midi(88),.5,.2,.3)
def alarm():
    n=int(.7*SR);tt=np.arange(n)/SR; return np.sign(np.sin(2*np.pi*1200*tt))*((tt%0.22)<0.15)*.25
def fwip():
    n=int(.18*SR);tt=np.arange(n)/SR; x=rng.standard_normal(n); return x*np.sin(np.pi*tt/.18)*.3
def crowd(d):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=((f>200)&(f<1500)); y=np.fft.irfft(X,n); return y/np.abs(y).max()*.08
def rimshot():
    n=int(.3*SR);tt=np.arange(n)/SR; return (rng.standard_normal(n)*np.exp(-tt*35)*.6+np.sin(2*np.pi*330*tt)*np.exp(-tt*25)*.5)
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for _ in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
place(sfx,crowd(DUR),0,1.0); place(sfx,ding(),F(5),.5); place(sfx,ding(),F(327),.5); place(sfx,alarm(),F(540),.6)
for i in range(7): place(sfx,fwip(),F(676+i*9),.5)
for i in range(7): place(sfx,fwip(),F(1330+i*7),.4)
place(sfx,laugh(1.5),F(253),.4); place(sfx,laugh(1.5),F(1052),.5); place(sfx,rimshot(),F(1386),.3); place(sfx,laugh(),F(1389),.8)
W('music.wav',music); W('sfx.wav',sfx)
