import numpy as np, wave
SR=48000; DUR=1261/30; N=int(DUR*SR); rng=np.random.default_rng(31); F=lambda fr: fr/30
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
# bouncy "travel" loop 120 bpm; diam sebentar di punchline
b=60/120; t=0; k=0; prog=[(50,[62,66,69]),(55,[62,67,71]),(57,[64,69,73]),(55,[62,67,71])]
while t<DUR:
    fr=t*30
    if not (486<=fr<520) and not (800<=fr<840) and not (1148<=fr<1185) and fr<1196:
        root,ch=prog[(k//4)%4]; place(music,synth(midi(root-12),b*.9,.12,.3),t,.8)
        for j,m in enumerate(ch): place(music,synth(midi(m+12),.12,.05,.6),t+j*b/3,.2)
    t+=b; k+=1
def ding(): return synth(midi(88),.5,.2,.3)
def alarm():
    n=int(.7*SR);tt=np.arange(n)/SR; return np.sign(np.sin(2*np.pi*1200*tt))*((tt%0.22)<0.15)*.25
def fwip():
    n=int(.18*SR);tt=np.arange(n)/SR; x=rng.standard_normal(n); return x*np.sin(np.pi*tt/.18)*.3
def crowd(d):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=((f>200)&(f<1500)); y=np.fft.irfft(X,n); return y/np.abs(y).max()*.08
def rimshot():
    n=int(.3*SR);tt=np.arange(n)/SR; return (rng.standard_normal(n)*np.exp(-tt*35)*.6+np.sin(2*np.pi*330*tt)*np.exp(-tt*25)*.5)
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for _ in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
def hum(d):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=((f>60)&(f<400)); y=np.fft.irfft(X,n); return y/np.abs(y).max()*.12
def dingdong(): return np.concatenate([synth(midi(81),.45,.35,.2)[:int(.3*SR)], synth(midi(77),.8,.45,.2)])
def meow(d=.55,f0=520,f1=860,f2=480):
    n=int(d*SR); tt=np.arange(n)/SR; u=tt/d; fr=np.where(u<.4,f0+(f1-f0)*u/.4,f1+(f2-f1)*(u-.4)/.6); ph=2*np.pi*np.cumsum(fr)/SR
    x=sum(np.sin(ph*(h+1))/(h+1)**1.3 for h in range(6)); return x*np.sin(np.pi*u)**.6*.5
def patter(d):
    o=np.zeros(int(d*SR)); 
    for i in range(int(d/.09)):
        n=int(.04*SR); tt=np.arange(n)/SR; s=rng.standard_normal(n)*np.exp(-tt*120)*.25; j=int(i*.09*SR); o[j:j+n]+=s[:len(o)-j]
    return o
def clank():
    n=int(.6*SR); tt=np.arange(n)/SR; return sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*k) for f,k in [(523,9),(1210,14),(1870,18)])*.4
place(sfx,hum(DUR),0,1.0); place(sfx,dingdong(),F(2),.55); place(sfx,dingdong(),F(652),.55)
for fr in (115,150): place(sfx,meow(),F(fr),.6)
place(sfx,patter(2.2),F(112),.7); place(sfx,patter(1.6),F(195),.7); place(sfx,patter(1.6),F(560),.7)
place(sfx,meow(.4,600,950,700),F(470),.5); place(sfx,meow(.7,450,700,380),F(830),.7); place(sfx,meow(.5,560,900,520),F(1040),.6)
place(sfx,clank(),F(1191),.6); place(sfx,meow(.9,420,600,300),F(1240),.45)
place(sfx,rimshot(),F(488),.35); place(sfx,laugh(1.4),F(492),.5); place(sfx,rimshot(),F(805),.35); place(sfx,laugh(1.5),F(812),.6)
place(sfx,rimshot(),F(1150),.35); place(sfx,laugh(1.3),F(1155),.5); place(sfx,laugh(),F(1230),.8)
W('music.wav',music); W('sfx.wav',sfx)
