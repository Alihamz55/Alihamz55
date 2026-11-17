import numpy as np, wave
SR=48000; DUR=1425/30; N=int(DUR*SR); rng=np.random.default_rng(21); F=lambda fr: fr/30
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
# upbeat "shopping jingle" loop 124 bpm
b=60/124; t=0; k=0; prog=[(48,[64,67,72]),(53,[65,69,72]),(55,[67,71,74]),(48,[64,67,72])]; mel=[72,74,76,79,76,74,72,0]
while t<DUR:
    fr=t*30
    if not (1056<=fr<1132):
        root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*.9,.12,.3),t,.8)
        if k%2==1:
            for m in ch: place(music,synth(midi(m),.15,.05,.6),t,.14)
        m=mel[k%8]
        if m and (k//8)%2==0: place(music,synth(midi(m),.18,.07,.6),t+b/2,.22)
    t+=b; k+=1
def ting(): return synth(midi(93),.3,.1,.3)*.6
def bell(): return (synth(midi(76),.6,.3,.3)+synth(midi(72),.6,.3,.3)*.0)[:int(.6*SR)]*.5
def dingdong():
    o=np.zeros(int(1.2*SR)); a=synth(midi(76),.6,.35,.3); b2=synth(midi(72),.8,.4,.3); o[:len(a)]+=a; i=int(.4*SR); o[i:i+len(b2)]+=b2[:len(o)-i]; return o*.5
def thud():
    n=int(.25*SR);tt=np.arange(n)/SR; return (np.sin(2*np.pi*np.cumsum(90*np.exp(-tt*10)+40)/SR)*np.exp(-tt*14)+rng.standard_normal(n)*np.exp(-tt*40)*.3)*.7
def buzz():
    n=int(.35*SR);tt=np.arange(n)/SR; return np.sign(np.sin(2*np.pi*140*tt))*.3*np.minimum(1,(.35-tt)/.03)
def rimshot():
    n=int(.3*SR);tt=np.arange(n)/SR; return (rng.standard_normal(n)*np.exp(-tt*35)*.6+np.sin(2*np.pi*330*tt)*np.exp(-tt*25)*.5)
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for _ in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
for fr in (2,22,44,100,140,190,230): place(sfx,ting(),F(fr),.7)
for fr in (258,350,452): place(sfx,dingdong(),F(fr),.6)
for fr in (272,362,463): place(sfx,thud(),F(fr),.35)
for i in range(14): place(sfx,thud(),F(721+i*3),.15)
place(sfx,buzz(),F(1048),.4); place(sfx,laugh(1.5),F(712),.4); place(sfx,laugh(1.5),F(1050),.5); place(sfx,rimshot(),F(1392),.3); place(sfx,laugh(),F(1395),.8)
W('music.wav',music); W('sfx.wav',sfx)
