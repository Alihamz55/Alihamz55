import numpy as np, wave
SR=48000; DUR=1015/30; N=int(DUR*SR); rng=np.random.default_rng(149); F=lambda fr: fr/30
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
# 0-745: musik "duel" (bass minor + petikan tegang); 745+: musik hangat mayor
b=60/110; t=0; k=0
while t<F(740):
    root=[45,45,48,43][(k//4)%4]; place(music,synth(midi(root-12),b*.8,.15,.3),t,.8)
    if k%2==0: place(music,synth(midi(root+12+[0,3,7][k%3]),.2,.1,.6),t+b/2,.25)
    t+=b; k+=1
b=60/92; t=F(745); k=0; prog=[(48,[64,67,72]),(53,[65,69,72]),(55,[67,71,74]),(48,[64,67,72])]
while t<DUR-.8:
    root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*1.2,.4,.3),t,.6)
    for j_,m in enumerate(ch): place(music,synth(midi(m+12),.5,.35,.35),t+j_*b/3,.18)
    t+=b; k+=1
def sparkle():
    o=np.zeros(int(.8*SR))
    for i,m in enumerate([88,91,95]): s=synth(midi(m),.5,.25,.2); j=int(i*.07*SR); o[j:j+len(s)]+=s[:len(o)-j]*.5
    return o
def birds(d):
    n=int(d*SR); o=np.zeros(n)
    for i in range(int(d/2.2)):
        j=int((i*2.2+rng.random())*SR); m=int(.25*SR); tt=np.arange(m)/SR; f=3000+900*np.sin(2*np.pi*12*tt); s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/.25)*.08
        o[j:j+m]+=s[:max(0,min(m,n-j))]
    return o
def whoosh():
    n=int(.4*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.sin(np.pi*tt/.4)**2*.3
place(sfx,birds(DUR),0,1.0)
for fr in (300,500,700): place(sfx,sparkle(),F(fr),.55)
place(sfx,whoosh(),F(808),.5); place(sfx,sparkle(),F(950),.4)
sfx=np.tanh(sfx*2.0)/np.tanh(2.0)
W('music.wav',music); W('sfx.wav',sfx)
