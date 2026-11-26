import numpy as np, wave
SR=48000; DUR=1034/30; N=int(DUR*SR); rng=np.random.default_rng(127); F=lambda fr: fr/30
def W(name,x):
    x=x/(np.abs(x).max()+1e-9)*0.9
    with wave.open(name,'wb') as w: w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype(np.int16).tobytes())
def place(buf,s,t0,g=1.0):
    i=int(t0*SR); j=min(N,i+len(s))
    if 0<=i<N: buf[i:j]+=s[:j-i]*g
w=wave.open('src/nada.wav'); gt=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768; w.close()
music=np.zeros(N); sfx=np.zeros(N)
# gitar pengguna: f93 -> PETIR(650), duck saat dialog, potong saat petir
a0=int(F(93)*SR); a1=int(F(650)*SR); seg=gt[:a1-a0].copy()
tt=np.arange(len(seg))/SR; seg*=np.minimum(1,tt/.15)
music[a0:a1]+=seg
env=np.ones(N)
for s,e in [(415,493),(502,580)]:
    i=int(F(s-6)*SR); j=int(F(e+6)*SR); env[i:j]=0.32
k=int(.15*SR); env=np.convolve(env,np.ones(k)/k,'same'); music*=env
# akhir: gitar muncul lagi pelan (bagian akhir rekaman) untuk kartu penutup
e0=int(F(975)*SR); tail=gt[int(48.5*SR):int(48.5*SR)+(N-e0)].copy(); tt=np.arange(len(tail))/SR; tail*=np.minimum(1,tt/.6)*.7; music[e0:e0+len(tail)]+=tail
def rain(d):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=((f>400)&(f<9000))*(1/np.sqrt(np.maximum(f,1)/400)); y=np.fft.irfft(X,n); return y/np.abs(y).max()*.32
def rumble(d,g=1.0):
    n=int(d*SR); x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=(f<160); y=np.fft.irfft(X,n); y/=np.abs(y).max(); tt=np.arange(n)/SR; return y*np.exp(-tt*1.2)*np.minimum(1,tt/.08)*g
def crack():
    n=int(1.0*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-tt*9)*.9+rumble(1.0,.8)
def sizzle(d):
    n=int(d*SR); tt=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-tt*1.5)*.15
place(sfx,rain(DUR),0,1.0)
for fr in (5,200,330): place(sfx,rumble(2.5,.7),F(fr+8),.8)
place(sfx,crack(),F(650),1.0); place(sfx,rumble(3.0,1.0),F(655),.9); place(sfx,sizzle(2.0),F(660),.6)
sfx=np.tanh(sfx*2.5)/np.tanh(2.5)
W('music.wav',music); W('sfx.wav',sfx)
