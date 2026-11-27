import numpy as np, wave
SR=48000; DUR=1349/30; N=int(DUR*SR); rng=np.random.default_rng(131); F=lambda fr: fr/30
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
b=60/124; t=0; k=0; prog=[(48,[64,67,72]),(53,[65,69,72]),(55,[67,71,74]),(48,[64,67,72])]
while t<DUR-1.0:
    fr=t*30
    if not (760<=fr<800) and fr<1318:
        root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*.9,.12,.3),t,.8)
        for j_,m in enumerate(ch): place(music,synth(midi(m+12),.12,.05,.6),t+j_*b/3,.2)
    t+=b; k+=1
def coin(): return synth(midi(96),.35,.15,.3)+synth(midi(100),.35,.12,.3)*.6
def rattle(d):
    n=int(d*SR); o=np.zeros(n)
    for i in range(int(d*18)):
        m=int(.03*SR); tt=np.arange(m)/SR; s=np.sin(2*np.pi*(3000+rng.random()*1500)*tt)*np.exp(-tt*90); j=int((i/18+rng.random()*.03)*SR); o[j:j+m]+=s[:max(0,min(m,n-j))]
    return o*.5
def beep(): return np.sin(2*np.pi*2400*np.arange(int(.08*SR))/SR)*.4
def srek():
    n=int(.35*SR); tt=np.arange(n)/SR; x=rng.standard_normal(n); return x*np.sin(np.pi*tt/.35)*.35
def smash():
    n=int(1.2*SR); tt=np.arange(n)/SR; o=rng.standard_normal(n)*np.exp(-tt*6)*.8
    for f0 in (1800,2600,3400,4100): o+=np.sin(2*np.pi*f0*tt)*np.exp(-tt*(8+f0/800))*.25
    return o
def flutter(d):
    n=int(d*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*(np.sin(2*np.pi*18*tt)>0.2)*np.exp(-tt*.8)*.18
def trombone():
    o=[]
    for m,d in [(55,.35),(54,.35),(53,.35),(52,1.0)]:
        n=int(d*SR); tt=np.arange(n)/SR; f=midi(m)*(1+.02*np.sin(2*np.pi*6*tt)*(d>.5)); ph=2*np.pi*np.cumsum(f)/SR; o.append(sum(np.sin(ph*(h+1))/(h+1) for h in range(6))*np.minimum(1,tt/.03)*np.minimum(1,(d-tt)/.05))
    return np.concatenate(o)*.35
def ding(): return synth(midi(84),.5,.25,.3)
place(sfx,rattle(3.0),F(5),.8)
for fr in list(range(245,300,9))+list(range(335,380,9))+list(range(1035,1080,9)): place(sfx,beep(),F(fr),.5)
place(sfx,coin(),F(512),.7)
for fr in (490,555,622,700,761): place(sfx,ding(),F(fr),.4)
for fr in (580,647,723): place(sfx,srek(),F(fr),.7)
place(sfx,smash(),F(762),.9); place(sfx,flutter(2.5),F(768),.8); place(sfx,trombone(),F(1300),.5)
sfx=np.tanh(sfx*2.2)/np.tanh(2.2)
W('music.wav',music); W('sfx.wav',sfx)
