import numpy as np, wave
SR=48000; DUR=1474/30; N=int(DUR*SR); rng=np.random.default_rng(9); F=lambda fr: fr/30
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
# bouncy comedy loop 112 bpm, ukulele-ish plucks + bass + light kick/hat; stops during the stare
bpm=112; b=60/bpm; prog=[(48,[60,64,67]),(45,[57,60,64]),(50,[57,62,65]),(43,[55,59,62])]; t=0; k=0
while t<DUR:
    fr=t*30
    if not (942<=fr<972):
        root,ch=prog[(k//4)%4]
        place(music,synth(midi(root-12),b*0.9,.12,.3),t,.9)
        for j,m in enumerate(ch if k%2==0 else ch[::-1]): place(music,synth(midi(m+12),.25,.08,.6),t+j*b/3,.35)
        n=int(.25*SR);tt=np.arange(n)/SR
        if k%2==0: place(music,np.sin(2*np.pi*np.cumsum(50+90*np.exp(-tt*30))/SR)*np.exp(-tt*12),t,.8)
        place(music,np.diff(rng.standard_normal(int(.04*SR)),prepend=0)*np.exp(-np.arange(int(.04*SR))/SR*80),t+b/2,.25)
    t+=b; k+=1
def whistle(d=.55):
    n=int(d*SR);tt=np.arange(n)/SR; f=2900+180*np.sin(2*np.pi*38*tt); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,tt/.01)*np.minimum(1,(d-tt)/.05)*.5
def kaching():
    o=np.zeros(int(.7*SR)); s=synth(midi(96),.5,.15,.3); o[:len(s)]+=s; s2=synth(midi(100),.5,.2,.3); a=int(.08*SR); o[a:a+len(s2)]+=s2[:len(o)-a]
    nn=int(.06*SR); o[:nn]+=rng.standard_normal(nn)*np.exp(-np.arange(nn)/SR*60)*.4; return o*.6
def cricket(d):
    n=int(d*SR);tt=np.arange(n)/SR; return np.sin(2*np.pi*4600*tt)*((np.sin(2*np.pi*14*tt)>0.3)*(np.sin(2*np.pi*1.4*tt)>-.2))*.15
def engine(d):
    n=int(d*SR);tt=np.arange(n)/SR; x=np.sign(np.sin(2*np.pi*38*tt))*.3+rng.standard_normal(n)*.05; return x*np.minimum(1,(d-tt)/.4)*.5
def rimshot():
    n=int(.3*SR);tt=np.arange(n)/SR; return (rng.standard_normal(n)*np.exp(-tt*35)*.6+np.sin(2*np.pi*330*tt)*np.exp(-tt*25)*.5)
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for _ in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
def boing():
    n=int(.4*SR);tt=np.arange(n)/SR; return np.sin(2*np.pi*np.cumsum(200+300*np.exp(-tt*8)*np.sin(tt*40))/SR)*np.exp(-tt*5)*.4
place(sfx,engine(1.2),0,.6); place(sfx,whistle(),F(84)); place(sfx,whistle(.8),F(1393))
for fr in (128,420,470,612,1250,1412): place(sfx,kaching(),F(fr),.7)
place(sfx,cricket(1.0),F(942),.8); place(sfx,laugh(1.6),F(905),.4); place(sfx,rimshot(),F(1434)); place(sfx,laugh(),F(1438),.8); place(sfx,boing(),F(1170),.5)
W('music.wav',music); W('sfx.wav',sfx)
