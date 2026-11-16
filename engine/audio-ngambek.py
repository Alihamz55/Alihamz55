import numpy as np, wave
SR=48000; DUR=1518/30; N=int(DUR*SR); rng=np.random.default_rng(13); F=lambda fr: fr/30
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
# awkward-comedy loop (pizzicato, 100 bpm), drops out on pauses
bpm=100; b=60/bpm; mel=[69,72,71,69,67,69,64,0, 69,72,74,72,71,69,67,0]; t=0; k=0
while t<DUR:
    fr=t*30
    if not (176<=fr<204) and not (877<=fr<883):
        if k%2==0: place(music,synth(midi(45 if (k//8)%2==0 else 43),b*1.6,.15,.3),t,.8)
        m=mel[k%16]
        if m: place(music,synth(midi(m),.2,.06,.7),t,.35)
    t+=b/2; k+=1
def engine(d):
    n=int(d*SR);tt=np.arange(n)/SR; x=np.sign(np.sin(2*np.pi*34*tt))*.25+np.sin(2*np.pi*68*tt)*.2+rng.standard_normal(n)*.04; return x
def wind(d):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=1/(1+(f/500)**2); y=np.fft.irfft(X,n); return y/np.abs(y).max()*.3
def cricket(d):
    n=int(d*SR);tt=np.arange(n)/SR; return np.sin(2*np.pi*4600*tt)*((np.sin(2*np.pi*14*tt)>0.3)*(np.sin(2*np.pi*1.4*tt)>-.2))*.15
def buzz():
    n=int(.35*SR);tt=np.arange(n)/SR; return np.sign(np.sin(2*np.pi*140*tt))*.3*np.minimum(1,(.35-tt)/.03)
def sizzle(d):
    n=int(d*SR); return np.diff(rng.standard_normal(n),prepend=0)*(0.5+0.5*rng.random(n))*.15
def rimshot():
    n=int(.3*SR);tt=np.arange(n)/SR; return (rng.standard_normal(n)*np.exp(-tt*35)*.6+np.sin(2*np.pi*330*tt)*np.exp(-tt*25)*.5)
def laugh(d=2.2):
    n=int(d*SR); tt=np.arange(n)/SR; o=np.zeros(n)
    for _ in range(14):
        f0=180+rng.random()*160; s=0
        for h in range(4): s=s+np.sin(2*np.pi*f0*(h+1)*tt+rng.random())/(h+1)*(np.sin(2*np.pi*(4.5+rng.random()*1.5)*tt+rng.random()*6)>0.2)
        o+=s*np.exp(-tt*0.9)*(0.5+rng.random()*.5)
    return o/np.abs(o).max()*.5*np.minimum(1,tt/.15)
eng=engine(DUR); tt=np.arange(N)/SR; fr=tt*30
egain=np.where(fr<960,1,np.where(fr<1000,(1000-fr)/40,np.where(fr<1356,0.0,np.minimum(1,(fr-1356)/30))))
sfx+=eng[:N]*egain*.45; place(sfx,wind(DUR)*.5,0)
place(sfx,cricket(1.0),F(177),.9); place(sfx,buzz(),F(676),.5); place(sfx,buzz(),F(747),.5)
place(sfx,sizzle(3.5),F(1005),.6); place(sfx,laugh(1.5),F(935),.45); place(sfx,rimshot(),F(1489)); place(sfx,laugh(),F(1492),.8)
W('music.wav',music); W('sfx.wav',sfx)
