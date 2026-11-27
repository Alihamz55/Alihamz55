import numpy as np, wave
SR=48000; DUR=736/30; N=int(DUR*SR); rng=np.random.default_rng(139); F=lambda fr: fr/30
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
HIHU=[66,163,274,477,594]
b=60/128; t=0; k=0; prog=[(50,[62,66,69]),(55,[62,67,71]),(57,[64,69,73]),(55,[62,67,71])]
while t<DUR-1.0:
    fr=t*30
    if not any(h-3<=fr<h+30 for h in HIHU) and fr<702:
        root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*.9,.12,.3),t,.8)
        for j_,m in enumerate(ch): place(music,synth(midi(m+12),.12,.05,.6),t+j_*b/3,.2)
    t+=b; k+=1
def stab(): return synth(midi(72),.25,.1,.5)+synth(midi(79),.25,.1,.5)*.7
def clink(): return synth(midi(100),.4,.2,.2)*.6
def trombone():
    o=[]
    for m,d in [(55,.35),(54,.35),(53,.35),(52,1.0)]:
        n=int(d*SR); tt=np.arange(n)/SR; f=midi(m)*(1+.02*np.sin(2*np.pi*6*tt)*(d>.5)); ph=2*np.pi*np.cumsum(f)/SR; o.append(sum(np.sin(ph*(h+1))/(h+1) for h in range(6))*np.minimum(1,tt/.03)*np.minimum(1,(d-tt)/.05))
    return np.concatenate(o)*.35
for h in HIHU[:3]: place(sfx,stab(),F(h+28),.4)
place(sfx,clink(),F(590),.6); place(sfx,trombone(),F(645),.5)
W('music.wav',music); W('sfx.wav',sfx)
