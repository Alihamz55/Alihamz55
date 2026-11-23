import numpy as np, wave
SR=48000; DUR=1147/30; N=int(DUR*SR); rng=np.random.default_rng(47); F=lambda fr: fr/30
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
# sinetron: pad minor sedih + piano arpeggio, sampai listrik mati
prog=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]; b=60/72; t=0; k=0
while t<F(800)-.1:
    ch=prog[(k//4)%4]
    if k%4==0: place(music,pad(ch,min(4*b,F(800)-t)),t,.18)
    place(music,synth(midi(ch[k%3]+12),b*1.5,.5,.35),t,.35); t+=b; k+=1
# setelah gelap: piano pelan lagi mulai 951
t=F(951); k=0
while t<DUR-.5:
    ch=prog[(k//4)%4]; place(music,synth(midi(ch[k%3]+12),b*1.5,.6,.35),t,.22); t+=b; k+=1
def hit(root=40):
    n=int(1.2*SR); tt=np.arange(n)/SR; x=sum(np.sign(np.sin(2*np.pi*midi(root+m)*tt))*.3 for m in (0,7,12,15)); cym=rng.standard_normal(n)*np.exp(-tt*3)*.5
    return (x*np.exp(-tt*2.5)+cym)*np.minimum(1,tt/.005)
def click():
    n=int(.08*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-tt*90)
def powerdown():
    n=int(.6*SR); tt=np.arange(n)/SR; f=3000*np.exp(-tt*6)+80; return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*4)*.4
def crickets(d):
    n=int(d*SR); tt=np.arange(n)/SR; return np.sin(2*np.pi*4300*tt)*((np.sin(2*np.pi*14*tt)>0.3)*(np.sin(2*np.pi*.7*tt)>0))*.06
def sting():
    o=np.zeros(int(2.0*SR))
    for i,ch in enumerate([[60,63,67],[58,62,65],[55,58,62]]):
        for m in ch: s=synth(midi(m),1.2 if i==2 else .5,.5,.5); j=int(i*.42*SR); o[j:j+len(s)]+=s[:len(o)-j]*.35
    return o
def rimshot():
    n=int(.3*SR);tt=np.arange(n)/SR; return (rng.standard_normal(n)*np.exp(-tt*35)*.6+np.sin(2*np.pi*330*tt)*np.exp(-tt*25)*.5)
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for _ in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
for fr,r,g in ((162,40,.45),(177,43,.55),(191,46,.7)): place(sfx,hit(r),F(fr),g)
place(sfx,hit(45),F(598),.5); place(sfx,rimshot(),F(770),.35); place(sfx,laugh(1.4),F(775),.5)
place(sfx,click(),F(800),.6); place(sfx,powerdown(),F(800),.5); place(sfx,crickets(DUR-F(800)),F(800),1.0)
place(sfx,sting(),F(842),.6); place(sfx,laugh(1.6),F(848),.55); place(sfx,rimshot(),F(1114),.3); place(sfx,laugh(),F(1118),.8)
W('music.wav',music); W('sfx.wav',sfx)
