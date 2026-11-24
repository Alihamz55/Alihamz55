import numpy as np, wave
SR=48000; DUR=1386/30; N=int(DUR*SR); rng=np.random.default_rng(71); F=lambda fr: fr/30
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
def pad(ms,dur):
    n=int(dur*SR); t=np.arange(n)/SR; x=sum(np.sin(2*np.pi*midi(m)*t)+0.3*np.sin(4*np.pi*midi(m)*t) for m in ms)
    return x*np.minimum(1,t/.4)*np.minimum(1,np.maximum(0,dur-t)/.3)
prog=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; b=60/76
def piano(t0,t1,g=.35,padg=.15):
    t=t0; k=0
    while t<t1-.1:
        ch=prog[(k//4)%4]
        if k%4==0: place(music,pad(ch,min(4*b,t1-t)),t,padg)
        place(music,synth(midi(ch[k%3]+12),min(b*1.5,t1-t),.5,.35),t,g); t+=b; k+=1
piano(0,F(149)); piano(F(195),F(1386)-1.0,.3,.12)
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
def ting(m=88):
    return synth(midi(m),.8,.4,.25)
def scratch():
    n=int(.4*SR); tt=np.arange(n)/SR; f=900+700*np.sin(2*np.pi*3.5*tt); return (rng.standard_normal(n)*.4+np.sin(2*np.pi*np.cumsum(f)/SR)*.5)*np.exp(-tt*4)
def trombone():
    o=[]
    for m,d in [(55,.35),(54,.35),(53,.35),(52,1.0)]:
        n=int(d*SR); tt=np.arange(n)/SR; f=midi(m)*(1+.02*np.sin(2*np.pi*6*tt)*(d>.5)); ph=2*np.pi*np.cumsum(f)/SR; o.append(sum(np.sin(ph*(h+1))/(h+1) for h in range(6))*np.minimum(1,tt/.03)*np.minimum(1,(d-tt)/.05))
    return np.concatenate(o)*.35
def flutter(d):
    n=int(d*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*(np.sin(2*np.pi*22*tt)>0.3)*.15
def birds(d):
    n=int(d*SR); o=np.zeros(n)
    for i in range(int(d/2.5)):
        j=int((i*2.5+rng.random())*SR); m=int(.25*SR); tt=np.arange(m)/SR; f=3200+900*np.sin(2*np.pi*12*tt); s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/.25)*.08
        o[j:j+m]+=s[:max(0,min(m,n-j))]
    return o
place(sfx,birds(DUR),0,1.0); place(sfx,scratch(),F(149),.6); place(sfx,laugh(1.2),F(185),.4)
place(sfx,rimshot(),F(470),.35); place(sfx,laugh(1.5),F(475),.55)
for fr,m in ((650,84),(685,88),(712,91)): place(sfx,ting(m),F(fr),.5)
place(sfx,flutter(1.6),F(DOMP:=780),.9); place(sfx,trombone(),F(790),.6); place(sfx,laugh(1.3),F(860),.4)
place(sfx,ting(79),F(1130),.4); place(sfx,rimshot(),F(1150),.35); place(sfx,laugh(1.6),F(1155),.6)
place(sfx,rimshot(),F(1318),.3); place(sfx,laugh(1.4),F(1335),.5); place(sfx,laugh(),F(1358),.8)
W('music.wav',music); W('sfx.wav',sfx)
