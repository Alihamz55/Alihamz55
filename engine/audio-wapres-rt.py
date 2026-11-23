import numpy as np, wave
SR=48000; DUR=986/30; N=int(DUR*SR); rng=np.random.default_rng(53); F=lambda fr: fr/30
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
# mars pelantikan (brass + snare) sampai reveal Ibu
b=60/112; t=0; k=0; prog=[[60,64,67],[65,69,72],[67,71,74],[60,64,67]]
def brass(ms,d):
    n=int(d*SR); tt=np.arange(n)/SR; return sum(np.sign(np.sin(2*np.pi*midi(m)*tt))*.15+np.sin(2*np.pi*midi(m)*tt)*.3 for m in ms)*env(n,.02,d*.6)
def snare():
    n=int(.15*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-tt*30)*.5
while t<F(362):
    ch=prog[(k//2)%4]; place(music,brass(ch,b*.9),t,.5); place(music,synth(midi(ch[0]-24),b*.9,.2,.3),t,.7)
    place(music,snare(),t+b/2,.35); place(music,snare(),t+b*.75,.2); t+=b; k+=1
# lagu bouncy setelah reveal sampai bangun
b=60/124; t=F(414); k=0; prog2=[(50,[62,66,69]),(55,[62,67,71]),(57,[64,69,73]),(55,[62,67,71])]
while t<F(718):
    fr=t*30
    if not (598<=fr<640):
        root,ch=prog2[(k//4)%4]; place(music,synth(midi(root-12),b*.9,.12,.3),t,.8)
        for j,m in enumerate(ch): place(music,synth(midi(m+12),.12,.05,.6),t+j*b/3,.2)
    t+=b; k+=1
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
def scratch():
    n=int(.45*SR); tt=np.arange(n)/SR; f=900+700*np.sin(2*np.pi*3.5*tt); return (rng.standard_normal(n)*.4+np.sin(2*np.pi*np.cumsum(f)/SR)*.5)*np.exp(-tt*4)
def popc():
    n=int(.12*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-tt*50)
def rooster():
    o=[]
    for f0,f1,d in [(500,700,.18),(700,900,.15),(900,1100,.5),(1000,600,.4)]:
        n=int(d*SR); tt=np.arange(n)/SR; fr=f0+(f1-f0)*tt/d; ph=2*np.pi*np.cumsum(fr)/SR; o.append(sum(np.sin(ph*(h+1))/(h+1) for h in range(5))*np.sin(np.pi*tt/d)**.5)
    return np.concatenate(o)*.35
place(sfx,popc(),F(178),.6); place(sfx,applause(4.5),F(185),.9)
place(sfx,scratch(),F(362),.7); place(sfx,rimshot(),F(600),.35); place(sfx,laugh(1.4),F(605),.55)
place(sfx,popc(),F(721),.4); place(sfx,rooster(),F(723),.45); place(sfx,laugh(1.4),F(830),.5); place(sfx,rimshot(),F(952),.3); place(sfx,laugh(),F(956),.8)
W('music.wav',music); W('sfx.wav',sfx)
