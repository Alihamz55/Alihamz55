import numpy as np, wave
SR=48000; DUR=1495/30; N=int(DUR*SR); rng=np.random.default_rng(113); F=lambda fr: fr/30
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
# gitar petik santai (tanpa tawa penonton); berhenti saat tebak-tebakan terakhir, drone pelan, lalu kembali lembut di akhir
b=60/84; prog=[(55,[67,71,74]),(52,[64,67,71]),(48,[64,67,72]),(50,[66,69,74])]
def pluck(f,d=.9): return synth(f,d,.45,.45,.002)
def guitar(t0,t1,g):
    t=t0; k=0
    while t<t1-.2:
        root,ch=prog[(k//4)%4]; place(music,pluck(midi(root-12),1.2),t,.5*g)
        for j_,m in enumerate(ch): place(music,pluck(midi(m)),t+(j_+1)*b/4,.22*g)
        t+=b; k+=1
guitar(0,F(850),1.0); guitar(F(1380),DUR-.3,0.8)
def drone(d):
    n=int(d*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*55*tt)+.5*np.sin(2*np.pi*82.4*tt+.3*np.sin(2*np.pi*.3*tt)))*np.minimum(1,tt/1.5)*np.minimum(1,(d-tt)/.5)*.25
place(music,drone(F(1301)-F(850)),F(850),1.0)
def crickets(d):
    n=int(d*SR); tt=np.arange(n)/SR; return np.sin(2*np.pi*4300*tt)*((np.sin(2*np.pi*14*tt)>0.3)*(np.sin(2*np.pi*.7*tt)>0))*.05
def chime(m=88): return synth(midi(m),1.2,.6,.2)
def eerie():
    o=np.zeros(int(2.4*SR))
    for i,m in enumerate([83,86,90,93]): s=synth(midi(m),1.6,.8,.15); j=int(i*.3*SR); o[j:j+len(s)]+=s[:len(o)-j]*.4
    return o
def scream_whoosh():
    n=int(.5*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.sin(np.pi*tt/.5)**2*.35
def steps(d,rate=7):
    n=int(d*SR); o=np.zeros(n)
    for i in range(int(d*rate)):
        m=int(.06*SR); tt=np.arange(m)/SR; s=(np.sin(2*np.pi*110*tt)+rng.standard_normal(m)*.4)*np.exp(-tt*50)*(1-i/(d*rate))
        j=int(i/rate*SR); o[j:j+m]+=s[:max(0,min(m,n-j))]
    return o*.5
def kentong():
    o=np.zeros(int(1.2*SR))
    for i in range(3): m=int(.25*SR); tt=np.arange(m)/SR; s=np.sin(2*np.pi*420*tt)*np.exp(-tt*22)+.4*np.sin(2*np.pi*1150*tt)*np.exp(-tt*30); j=int(i*.3*SR); o[j:j+m]+=s
    return o*.5
place(sfx,crickets(DUR),0,1.0); place(sfx,kentong(),F(2),.5)
for fr in (300,570,790): place(sfx,chime(),F(fr),.4)
place(sfx,chime(76),F(1060),.35); place(sfx,eerie(),F(1140),.55)
place(sfx,scream_whoosh(),F(1301),.5); place(sfx,steps(2.2),F(1305),.8); place(sfx,chime(72),F(1460),.3)
W('music.wav',music); W('sfx.wav',sfx)
