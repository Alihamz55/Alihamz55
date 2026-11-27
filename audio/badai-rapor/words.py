# Perkiraan waktu per kata dari energi suara + tanda baca -> words.json
import json, re, wave, numpy as np
TEXT = [
 "Mamaku pembawa ramalan cuaca. Tadi pagi Mama bilang: cerah seharian. Mama salah.",
 "Di sekolah memang cerah. Bu Guru bagi rapor.",
 "Nilai matematikaku... empat. Bukan peringkat. Nilai.",
 "Siang, langit mulai mendung. Bukan di langit. Di HP Mama.",
 "Bu Guru kirim foto rapor. Centang dua. Biru.",
 "Aku siapin tiga hal. Payung, doa, sama alasan. Alasannya basah duluan.",
 "Sampai rumah, hujan deras. Mama berdiri di pintu. Pegang rapor.",
 "Raka. Ramalan sore ini: kamu basah kuyup. Mandi. Sekarang.",
 "Habis itu sini. Mama bikinin cokelat panas. Nilai empat nggak apa-apa, yang penting jujur.",
 "Ma... yang empat itu sebenarnya yang paling bagus.",
 "Besoknya Mama ngajarin aku sampai sore. Ternyata nilai Mama dulu... tiga.",
 "Dan begitulah badai berakhir.",
 "Ramalan Mama memang suka salah. Tapi pelukannya nggak pernah.",
]
KEY = {"CERAH","SALAH","EMPAT","MENDUNG","HP","BIRU","ALASAN","ALASANNYA","BASAH","HUJAN","RAPOR","KUYUP","SEKARANG",
       "JUJUR","PALING","BAGUS","TIGA","BADAI","BERAKHIR","PELUKANNYA"}
w = wave.open('voice.wav'); sr = w.getframerate()
a = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768
H = int(sr * 0.01); rms = np.array([np.sqrt(np.mean(a[i:i+H]**2)) for i in range(0, len(a)-H, H)])
db = 20*np.log10(rms + 1e-9); voiced = db > -34
timing = json.load(open('timing.json'))
syl = lambda s: max(1, len(re.findall(r'[aiueo]+', s.lower())))
out = []
for L, txt in zip(timing, TEXT):
    i0, i1 = int(L['start']*100), int(L['end']*100)
    v = voiced[i0:i1].copy()
    # segmen bersuara (gap >= 0.15 dtk memisahkan)
    segs, s, gap = [], None, 0
    for k, on in enumerate(v):
        if on:
            if s is None: s = k
            gap = 0; e = k
        elif s is not None:
            gap += 1
            if gap >= 15: segs.append([s, e]); s = None
    if s is not None: segs.append([s, e])
    phrases = [p.strip() for p in re.split(r'(?<=[.,:!?])\s+|\.\.\.\s*', txt) if p.strip()]
    while len(segs) > len(phrases):  # gabung celah terkecil
        j = min(range(len(segs)-1), key=lambda j: segs[j+1][0]-segs[j][1]); segs[j][1] = segs[j+1][1]; del segs[j+1]
    if len(segs) < len(phrases): segs = [[segs[0][0], segs[-1][1]]]; phrases = [txt]
    for (s0, s1), ph in zip(segs, phrases):
        words = re.findall(r"[\w\-']+", ph)
        wt = np.cumsum([0] + [syl(x) + 0.6 for x in words]); wt = wt / wt[-1]
        idx = np.flatnonzero(v[s0:s1+1]) + s0; n = len(idx)
        for k, word in enumerate(words):
            t0 = (i0 + idx[min(n-1, int(wt[k]*n))]) / 100
            t1 = (i0 + idx[min(n-1, max(0, int(wt[k+1]*n)-1))]) / 100 + 0.01
            out.append({'w': word.upper(), 't0': round(t0, 2), 't1': round(t1, 2), 'key': word.upper() in KEY, 'line': L['n']})
json.dump(out, open('words.json', 'w'))
print(len(out)); print(' '.join(f"{o['w']}@{o['t0']}" for o in out[:30]))
