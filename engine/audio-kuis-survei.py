import numpy as np, wave
SR=48000; DUR=920/30; N=int(DUR*SR); rng=np.random.default_rng(61); F=lambda fr: fr/30
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
def brass(ms,d):
    n=int(d*SR); tt=np.arange(n)/SR; return sum(np.sign(np.sin(2*np.pi*midi(m)*tt))*.15+np.sin(2*np.pi*midi(m)*tt)*.3 for m in ms)*env(n,.01,d*.5)
# tema kuis ceria 140 bpm; berhenti saat drumroll + akhir
b=60/140; t=0; k=0; prog=[(48,[64,67,72]),(53,[65,69,72]),(55,[67,71,74]),(48,[64,67,72])]
while t<DUR-1:
    fr=t*30
    if not (452<=fr<520) and not (885<=fr):
        root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*.8,.1,.3),t,.8)
        if k%2==0: place(music,brass(ch,b*.6),t,.35)
        for j,m in enumerate(ch): place(music,synth(midi(m+12),.1,.04,.6),t+j*b/3,.18)
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
def buzz():
    n=int(.8*SR); tt=np.arange(n)/SR; return (np.sign(np.sin(2*np.pi*140*tt))+.5*np.sign(np.sin(2*np.pi*147*tt)))*np.minimum(1,tt/.01)*np.minimum(1,(.8-tt)/.05)*.4
def ting():
    o=np.zeros(int(1.2*SR))
    for i,m in enumerate([84,88,91]): s=synth(midi(m),1.0,.5,.25); j=int(i*.06*SR); o[j:j+len(s)]+=s[:len(o)-j]*.5
    return o
def press():
    n=int(.12*SR); tt=np.arange(n)/SR; return np.sin(2*np.pi*900*tt)*np.exp(-tt*40)*.6
def roll(d):
    n=int(d*SR); o=np.zeros(n); step=int(.045*SR)
    for j in range(0,n-int(.05*SR),step): m=int(.05*SR); tt=np.arange(m)/SR; o[j:j+m]+=rng.standard_normal(m)*np.exp(-tt*60)*(0.4+0.6*j/n)
    return o*.6
place(sfx,ting(),F(2),.5); place(sfx,press(),F(191),.6); place(sfx,buzz(),F(252),.6); place(sfx,laugh(1.3),F(262),.45)
place(sfx,press(),F(275),.6); place(sfx,ting(),F(292),.6)
place(sfx,roll(2.1),F(452),.8); place(sfx,ting(),F(515),.8); place(sfx,applause(3.0),F(518),.8); place(sfx,laugh(1.6),F(530),.5)
place(sfx,laugh(1.4),F(690),.45); place(sfx,ting(),F(745),.7); place(sfx,laugh(1.5),F(750),.6); place(sfx,rimshot(),F(888),.3); place(sfx,laugh(),F(892),.8)
W('music.wav',music); W('sfx.wav',sfx)
