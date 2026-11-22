import numpy as np, wave
SR=48000; DUR=177/30; N=int(DUR*SR); rng=np.random.default_rng(11); F=lambda fr: fr/30
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
# bouncy country-ish loop 120 bpm; short pause on the act-break card
bpm=120; b=60/bpm; prog=[(48,[60,64,67,72]),(53,[57,60,65,69]),(55,[59,62,67,71]),(48,[60,64,67,72])]; t=0; k=0
while t<DUR:
    fr=t*30
    if True:
        root,ch=prog[(k//4)%4]
        place(music,synth(midi(root-12),b*0.9,.14,.3),t,.8)
        for j in range(4): place(music,synth(midi(ch[(j+k)%4]+12),.18,.06,.7),t+j*b/4,.28)
        if k%2==1: place(music,np.diff(rng.standard_normal(int(.05*SR)),prepend=0)*np.exp(-np.arange(int(.05*SR))/SR*60),t,.3)
    t+=b; k+=1
def ding(): return synth(midi(88),.4,.15,.3)+synth(midi(93),.4,.12,.3)*.6
def click():
    n=int(.06*SR); return rng.standard_normal(n)*np.exp(-np.arange(n)/SR*120)*.8
def cricket(d):
    n=int(d*SR);tt=np.arange(n)/SR; return np.sin(2*np.pi*4600*tt)*((np.sin(2*np.pi*14*tt)>0.3)*(np.sin(2*np.pi*1.4*tt)>-.2))*.15
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
def whoosh():
    n=int(.5*SR);tt=np.arange(n)/SR; x=rng.standard_normal(n); y=np.convolve(x,np.ones(30)/30,'same'); return y*np.sin(np.pi*tt/.5)**2*.9
def slam():
    n=int(.35*SR);tt=np.arange(n)/SR; return (np.sin(2*np.pi*np.cumsum(60+80*np.exp(-tt*25))/SR)*np.exp(-tt*9)+rng.standard_normal(n)*np.exp(-tt*40)*.5)
def notif(): return np.concatenate([synth(midi(84),.12,.08,.2),synth(midi(91),.25,.12,.2)])
for fr in (52,66,86): place(sfx,click(),F(fr),.5); place(sfx,ding(),F(fr+1),.35)
place(sfx,whoosh(),F(0),.4); place(sfx,rimshot(),F(138),.8); place(sfx,laugh(1.5),F(140),.5)
W('music.wav',music); W('sfx.wav',sfx)
