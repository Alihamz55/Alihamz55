"""Brand alidraws: logo, foto profil (1080x1080), banner Lynk (1500x500).
Pakai: python3 brand.py --font-dir FONTS --out FOLDER
"""
from PIL import Image, ImageDraw, ImageFont
import math
import argparse
_ap=argparse.ArgumentParser(description="Buat logo, foto profil, dan banner brand alidraws.")
_ap.add_argument("--font-dir",required=True); _ap.add_argument("--out",required=True)
_a=_ap.parse_args(); F=_a.font_dir; OUT=_a.out
import os; os.makedirs(OUT,exist_ok=True)
NAVY="#1E3A8A"; ORANGE="#F97316"; YELLOW="#FACC15"; CREAM="#FFF8EC"; TEAL="#14B8A6"; PINK="#EC4899"
P=lambda w,s: ImageFont.truetype(f"{F}/Poppins-{w}.ttf", int(s))
SS=3  # supersample

def star(d,cx,cy,r,fill,rot=0):
    pts=[(cx+(r if i%2==0 else r*.45)*math.cos(-math.pi/2+rot+i*math.pi/5), cy+(r if i%2==0 else r*.45)*math.sin(-math.pi/2+rot+i*math.pi/5)) for i in range(10)]
    d.polygon(pts,fill=fill)

def pencil(d,x,y,L,h):
    d.rounded_rectangle((x,y,x+L*.13,y+h),radius=h*.3,fill=PINK)
    d.rectangle((x+L*.1,y,x+L*.16,y+h),fill="#CBD5E1")
    d.rectangle((x+L*.16,y,x+L*.8,y+h),fill=ORANGE)
    d.rectangle((x+L*.16,y+h*.38,x+L*.8,y+h*.62),fill="#FDBA74")
    d.polygon([(x+L*.8,y),(x+L,y+h/2),(x+L*.8,y+h)],fill="#FDE68A")
    d.polygon([(x+L*.93,y+h*.34),(x+L,y+h/2),(x+L*.93,y+h*.66)],fill=NAVY)

def logo(size):
    s=size*SS; im=Image.new("RGBA",(s,s),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.ellipse((0,0,s,s),fill=NAVY)
    f=P("Black",s*.5); t="ad"; tw=d.textlength(t,font=f)
    d.text(((s-tw)/2,s*.13),t,font=f,fill="white")
    pencil(d,s*.22,s*.68,s*.56,s*.085)
    star(d,s*.25,s*.25,s*.07,YELLOW,rot=.2)
    return im.resize((size,size),Image.LANCZOS)

# ---------- Profile picture ----------
pp=Image.new("RGB",(1080,1080),CREAM); d=ImageDraw.Draw(pp)
d.ellipse((30,30,1050,1050),fill=YELLOW)
lg=logo(900); pp.paste(lg,(90,90),lg)
pp.save(f"{OUT}/foto-profil-lynk.png")
logo(1000).save(f"{OUT}/logo-alidraws.png")

# ---------- Banner ----------
W,H=1500,500; b=Image.new("RGB",(W*SS,H*SS),CREAM); d=ImageDraw.Draw(b)
def c(x,y,r,col): d.ellipse(((x-r)*SS,(y-r)*SS,(x+r)*SS,(y+r)*SS),fill=col)
c(60,80,130,YELLOW); c(1450,450,160,TEAL); c(1440,50,48,PINK); c(80,450,70,ORANGE)
for (x,y,col,rot) in [(215,140,TEAL,18),(1265,345,YELLOW,-14)]:
    sq=Image.new("RGBA",(40*SS,40*SS),(0,0,0,0)); ImageDraw.Draw(sq).rounded_rectangle((0,0,40*SS,40*SS),radius=9*SS,fill=col)
    sq=sq.rotate(rot,expand=True,resample=Image.BICUBIC); b.paste(sq,(x*SS,y*SS),sq)
star(d,300*SS,300*SS,24*SS,ORANGE,.3); star(d,1215*SS,175*SS,22*SS,PINK,-.2)
for x0,y0 in [(170,250),(1150,110)]:
    pts=[((x0+t)*SS,(y0+14*math.sin(t/60*2*math.pi))*SS) for t in range(0,181,3)]
    d.line(pts,fill="#C7D2FE",width=7*SS,joint="curve")
# center block
fw=P("ExtraBold",96*SS); ft=P("SemiBold",40*SS); fc=P("SemiBold",23*SS)
ls=150*SS; gap=24*SS
wa=d.textlength("ali",font=fw); wb=d.textlength("draws",font=fw)
rowW=ls+gap+wa+wb; x0=(W*SS-rowW)/2; y0=78*SS
lg=logo(150).resize((ls,ls),Image.LANCZOS); b.paste(lg,(int(x0),int(y0)),lg)
ty=y0+ls/2-fw.getbbox("alidraws")[3]/2-6*SS
d.text((x0+ls+gap,ty),"ali",font=fw,fill=NAVY); d.text((x0+ls+gap+wa,ty),"draws",font=fw,fill=ORANGE)
t="Ebook & Printable Edukasi Anak"; d.text(((W*SS-d.textlength(t,font=ft))/2,262*SS),t,font=ft,fill=NAVY)
chips=[("Siap cetak",ORANGE),("Belajar sambil bermain",TEAL),("Untuk orang tua & guru",PINK)]
pw=[d.textlength(t,font=fc)+44*SS for t,_ in chips]; g=12*SS; tot=sum(pw)+g*2; px=(W*SS-tot)/2; py=340*SS
for (t,col),w in zip(chips,pw):
    d.rounded_rectangle((px,py,px+w,py+52*SS),radius=26*SS,fill=col); d.text((px+22*SS,py+11*SS),t,font=fc,fill="white"); px+=w+g
print("center content width px:", int(max(rowW,tot)/SS))
b.resize((W,H),Image.LANCZOS).save(f"{OUT}/banner-lynk.png")
