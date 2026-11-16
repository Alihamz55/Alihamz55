import numpy as np, wave
SR=44100; BPM=90; BEAT=60/BPM; BAR=4*BEAT
rng=np.random.default_rng(7)
def ks(midi,dur,amp,bright=0.5):
    f=440*2**((midi-69)/12); N=int(SR/f); n=int(dur*SR)
    buf=rng.uniform(-1,1,N)
    # pick-position lowpass on excitation for warmth
    for _ in range(int(3-2*bright)): buf=0.5*(buf+np.roll(buf,1))
    out=np.zeros(n); d=0.996
    for i in range(n):
        v=buf[i%N]; out[i]=v
        buf[i%N]=d*0.5*(v+buf[(i+1)%N])
    env=np.minimum(1,np.arange(n)/40)
    return out*amp*env
CH={'Am':[45,52,57,60,64],'F':[48,53,57,60,65],'C':[48,52,55,60,64],'G':[43,47,50,55,59,67]}
cache={}
def note(m,amp,dur=3.2,br=0.5):
    k=(m,br)
    if k not in cache: cache[k]=ks(m,dur,1.0,br)
    return cache[k]*amp
total=int(SR*90); mix=np.zeros(total)
def add(sig,t):
    i=int(t*SR); j=min(total,i+len(sig)); mix[i:j]+=sig[:j-i]
def mute(t,dur=0.03):  # damp previous ring a bit at each new chord (simple)
    pass
def strum(ch,t,down=True,amp=0.5,top=None,gap=0.012):
    s=CH[ch][:]; 
    if top: s=s[-top:]
    if not down: s=s[::-1]
    for k,m in enumerate(s): add(note(m,amp*(0.85+0.3*rng.random()),br=0.6 if down else 0.8),t+k*gap+rng.uniform(0,0.004))
def bar(ch,t0,amp=0.5):
    # D . D U . U D U  (eighths)
    for pos,dn in [(0,1),(2,1),(3,0),(5,0),(6,1),(7,0)]:
        a=amp*(1.0 if pos in(0,4) else 0.75 if dn else 0.55)
        strum(ch,t0+pos*BEAT/2,bool(dn),a,top=None if dn else 4)
# count-in clicks (1 bar)
click=np.sin(2*np.pi*1500*np.arange(int(0.03*SR))/SR)*np.exp(-np.arange(int(0.03*SR))/200)
for b in range(4): add(click*(0.6 if b==0 else 0.4),b*BEAT)
t=BAR
song=['Am','F']*1 + ['Am','F','C','G']*2 + ['F','G','C','Am','F','G','C','G']
for i,ch in enumerate(song):
    bar(ch,t,0.32 if i<2 else 0.42); t+=BAR
# final ringing C chord, then silence for spoken punchline
strum('C',t,True,0.5,gap=0.03); end=t+4.5+4
mix=mix[:int(end*SR)]
# cheap room: few short echoes
rev=mix.copy()
for dly,g in [(0.023,0.25),(0.041,0.18),(0.067,0.12),(0.11,0.07)]:
    k=int(dly*SR); rev[k:]+=mix[:-k]*g
rev/=np.max(np.abs(rev))/0.9
fade=int(0.5*SR); rev[-fade:]*=np.linspace(1,0,fade)
with wave.open('iringan-gitar-tanggal-tua.wav','wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((rev*32767).astype(np.int16).tobytes())
print(len(song),'bars, dur',round(end,1),'s, vocals start at',round(BAR*3,2),'s')
