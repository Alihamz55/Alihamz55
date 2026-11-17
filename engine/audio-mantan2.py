import numpy as np, wave
SR=48000; DUR=1140/30; N=int(DUR*SR); rng=np.random.default_rng(17); F=lambda fr: fr/30
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
# part 1 (teras): light comedy; part 2 (gedung): gentle "wedding/kondangan" waltz; silent on the awkward pauses
t=0; k=0; b=60/112
while t<F(341):
    root=[48,45,53,55][(k//4)%4]; place(music,synth(midi(root-12),b*.9,.12,.3),t,.8); place(music,synth(midi(root+12+[0,4,7][k%3]),.2,.07,.6),t+b/2,.3); t+=b; k+=1
t=F(341); k=0; b=60/96
while t<DUR:
    fr=t*30
    if not (580<=fr<610) and not (782<=fr<823):
        root=[53,50,46,48][(k//3)%4]
        if k%3==0: place(music,synth(midi(root-12),b*1.4,.2,.3),t,.7)
        else:
            for m in (0,4,7): place(music,synth(midi(root+12+m),.25,.08,.5),t,.16)
        if k%6==0: place(music,synth(midi(root+24+[4,7,9,7][(k//6)%4]),b*1.5,.3,.35),t,.3)
    t+=b; k+=1
def jreng():
    o=np.zeros(int(1.2*SR))
    for m in (48,55,60,64,67): s=synth(midi(m),1.2,.5,.7); o[:len(s)]+=s
    return o*.35
def cricket(d):
    n=int(d*SR);tt=np.arange(n)/SR; return np.sin(2*np.pi*4600*tt)*((np.sin(2*np.pi*14*tt)>0.3)*(np.sin(2*np.pi*1.4*tt)>-.2))*.15
def babycry(d):
    n=int(d*SR);tt=np.arange(n)/SR; f=420+120*np.sin(2*np.pi*1.6*tt)+40*np.sin(2*np.pi*7*tt); ph=2*np.pi*np.cumsum(f)/SR
    s=(np.sin(ph)+.5*np.sin(2*ph)+.3*np.sin(3*ph))*(0.5+0.5*(np.sin(2*np.pi*1.6*tt)>-0.6)); return s*np.minimum(1,tt/.1)*np.minimum(1,(d-tt)/.3)*.25
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
def steps():
    o=np.zeros(int(2.7*SR))
    for i in range(int(2.7/0.4)): n=int(.05*SR); a=int(i*0.4*SR); o[a:a+n]+=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*90)*.3
    return o
place(sfx,jreng(),F(126),.8); place(sfx,cricket(1.0),F(581),.9); place(sfx,buzz(),F(745),.4); place(sfx,cricket(1.3),F(782),.8)
place(sfx,steps(),F(341),.6); place(sfx,babycry(2.4),F(990),.9); place(sfx,laugh(1.4),F(275),.4); place(sfx,rimshot(),F(1106)); place(sfx,laugh(),F(1109),.8)
W('music.wav',music); W('sfx.wav',sfx)
