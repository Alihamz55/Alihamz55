import numpy as np, json, wave
SR=48000; T=json.load(open('timing.json')); TOT=T['total']; N=int(TOT*SR); spans=T['spans']
rng=np.random.default_rng(3); t=np.arange(N)/SR
def save(p,x):
    with wave.open(p,'wb') as w: w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(x,-1,1)*32767).astype(np.int16).tobytes())
def place(buf,s,t0,g=1):
    i=int(t0*SR); j=min(N,i+len(s))
    if 0<=i<N: buf[i:j]+=s[:j-i]*g
midi=lambda m:440*2**((m-69)/12)
def pluck(f,d=0.35,g=1):
    tt=np.arange(int(d*SR))/SR; return g*np.exp(-tt*9)*(np.sin(2*np.pi*f*tt)+0.4*np.sin(4*np.pi*f*tt)+0.15*np.sin(6*np.pi*f*tt))
# music: bouncy 112 bpm, I-V-vi-IV in C
bpm=112; beat=60/bpm; m=np.zeros(N,np.float32)
chords=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]
nb=int(TOT/beat)+1
for k in range(nb):
    t0=k*beat; ch=chords[(k//4)%4]
    # kick on 1,3 ; snap on 2,4
    if k%2==0:
        tt=np.arange(int(0.18*SR))/SR; place(m,np.sin(2*np.pi*(110*np.exp(-tt*25)+45)*tt)*np.exp(-tt*18),t0,0.8)
    else:
        tt=np.arange(int(0.08*SR))/SR; place(m,rng.normal(0,1,len(tt))*np.exp(-tt*50),t0,0.25)
    place(m,pluck(midi(ch[0]-24),0.4),t0,0.5)
    for h in range(2):  # off-beat ukulele strums
        tq=t0+h*beat/2+beat/4
        for n_i,n in enumerate(ch): place(m,pluck(midi(n),0.3,0.22),tq+n_i*0.012)
    if k%2==1: place(m,pluck(midi(ch[(k//2)%3]+12),0.25,0.18),t0)
    tt=np.arange(int(0.03*SR))/SR; place(m,rng.normal(0,1,len(tt))*np.exp(-tt*120),t0+beat/2,0.06)
m*=np.minimum(1,np.minimum(t/0.5,(TOT-t)/1.2)).clip(0,1)
save('music.wav',m)
# sfx: whoosh at each scene change, pop at title, ding at judge
s=np.zeros(N,np.float32)
def whoosh(d=0.35):
    n=int(d*SR); x=rng.normal(0,1,n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/SR); X*=np.exp(-((f-1800)/1500)**2); x=np.fft.irfft(X,n)
    e=np.sin(np.pi*np.arange(n)/n)**2; return (x/np.abs(x).max()*e)
def pop():
    tt=np.arange(int(0.12*SR))/SR; return np.sin(2*np.pi*(300+900*tt*8)*tt)*np.exp(-tt*30)
def ding():
    tt=np.arange(int(0.6*SR))/SR; return (np.sin(2*np.pi*1568*tt)+0.5*np.sin(2*np.pi*2349*tt))*np.exp(-tt*7)
JUD=set(range(1,11))
for i,(a,b) in enumerate(spans):
    st=a-(0.35 if i==0 else 0.22)
    if i>0: place(s,whoosh(),st-0.05,0.8)
    place(s,pop(),st+0.12,0.7)
    if i in JUD: place(s,ding(),a+(b-a)*0.45,0.5)
save('sfx.wav',s)
