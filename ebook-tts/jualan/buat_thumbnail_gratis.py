from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, sys
S="/tmp/claude-0/-home-user-Alihamz55/e84c926d-5804-55da-a023-c910f8b44c54/scratchpad"
R="/home/user/Alihamz55/ebook-tts"
LG=f"{S}/fonts/Luckiest.ttf"; BA=f"{S}/fonts/Baloo800.ttf"
W=H=1080
im=Image.new("RGB",(W,H),"#FACC15"); d=ImageDraw.Draw(im)
# sunburst
cx,cy=W/2,600
for i in range(24):
    a0=i*2*math.pi/24; a1=a0+math.pi/24
    d.polygon([(cx,cy),(cx+1600*math.cos(a0),cy+1600*math.sin(a0)),(cx+1600*math.cos(a1),cy+1600*math.sin(a1))],fill="#FDE047")
glow=Image.new("RGBA",(W,H),(0,0,0,0)); ImageDraw.Draw(glow).ellipse((cx-330,cy-330,cx+330,cy+330),fill=(255,255,255,120))
im.paste(glow.filter(ImageFilter.GaussianBlur(60)),(0,0),glow.filter(ImageFilter.GaussianBlur(60)))
d=ImageDraw.Draw(im)
def card(img,h,rot,pos):
    w=int(h*img.width/img.height); c=img.resize((w,h),Image.LANCZOS).convert("RGBA")
    b=Image.new("RGBA",(w+16,h+16),"white"); b.paste(c,(8,8))
    b=b.rotate(rot,expand=True,resample=Image.BICUBIC)
    sh=Image.new("RGBA",b.size,(0,0,0,0)); sh.paste((60,30,0,110),(0,0),b.split()[3]); sh=sh.filter(ImageFilter.GaussianBlur(16))
    x,y=int(pos[0]-b.width/2),int(pos[1]-b.height/2)
    im.paste(sh,(x+10,y+16),sh); im.paste(b,(x,y),b)
card(Image.open(f"{S}/hal3-03.png"),560,9,(640,640))
card(Image.open(f"{R}/cover/cover-depan.png"),580,-7,(420,610))
d=ImageDraw.Draw(im)
def outlined(text,font,cxp,y,fill,stroke,sw,shadow=None,rot=0):
    tw=d.textlength(text,font=font); asc,desc=font.getmetrics()
    layer=Image.new("RGBA",(int(tw)+sw*2+40,asc+desc+sw*2+40),(0,0,0,0)); ld=ImageDraw.Draw(layer)
    if shadow: ld.text((sw+20,sw+20+10),text,font=font,fill=shadow,stroke_width=sw,stroke_fill=shadow)
    ld.text((sw+20,sw+20),text,font=font,fill=fill,stroke_width=sw,stroke_fill=stroke)
    layer=layer.rotate(rot,expand=True,resample=Image.BICUBIC)
    im.paste(layer,(int(cxp-layer.width/2),int(y-layer.height/2)),layer)
# headline
outlined("GRATIS!",ImageFont.truetype(LG,190),W/2,150,"#EF4444","#FFFFFF",14,shadow="#7F1D1D",rot=3)
outlined("Coba 1 TTS + Kunci Jawaban",ImageFont.truetype(BA,52),W/2,285,"#1E3A8A","#FFFFFF",7)
# Rp0 badge
bx,by,r=900,470,105
pts=[(bx+(r if i%2==0 else r*.82)*math.cos(i*math.pi/12), by+(r if i%2==0 else r*.82)*math.sin(i*math.pi/12)) for i in range(24)]
d.polygon([(x+5,y+8) for x,y in pts],fill="#14532D"); d.polygon(pts,fill="#22C55E")
fl=ImageFont.truetype(BA,74); t="Rp0"; d.text((bx-d.textlength(t,font=fl)/2,by-58),t,font=fl,fill="white")
# CTA button
bw,bh=700,120; bx0=(W-bw)/2; by0=905
d.rounded_rectangle((bx0+6,by0+12,bx0+bw+6,by0+bh+12),radius=60,fill="#7C2D12")
d.rounded_rectangle((bx0,by0,bx0+bw,by0+bh),radius=60,fill="#F97316",outline="white",width=6)
fb=ImageFont.truetype(LG,64); t="UNDUH SEKARANG"
d.text((W/2-d.textlength(t,font=fb)/2,by0+30),t,font=fb,fill="white")
im.save(f"{R}/jualan/thumbnail-sampel-gratis.jpg",quality=93)
