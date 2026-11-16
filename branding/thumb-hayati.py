from PIL import Image, ImageDraw, ImageFont
W,H=1080,1920; INK=(36,23,38)
F=lambda s: ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf", s)
src=Image.open("/home/user/shorts/zainudin/frames/f0725.jpg").convert("RGB")
z=1.1; sw,sh=int(W/z),int(H/z); cx,cy=540,1010
im=src.crop((cx-sw//2,cy-sh//2,cx+sw//2,cy+sh//2)).resize((W,H),Image.LANCZOS)
def label(txt,y,fill,sz,rot=0,box=None):
    lay=Image.new("RGBA",(W,340),(0,0,0,0)); ld=ImageDraw.Draw(lay)
    if box:
        bb=ld.textbbox((W/2,170),txt,font=F(sz),anchor="mm")
        ld.rounded_rectangle((bb[0]-40,bb[1]-34,bb[2]+40,bb[3]+34),26,fill=box,outline=INK,width=12)
    ld.text((W/2,170),txt,font=F(sz),fill=fill,anchor="mm",stroke_width=14,stroke_fill=INK)
    lay=lay.rotate(rot,resample=Image.BICUBIC); im.paste(lay,(0,y-170),lay)
label("MANTAN MINTA BALIKAN",200,(255,255,255),74,1.5)
label("GUE JADI ZAINUDDIN",335,(255,216,74),84,-1.5)
label("HAYATI SIAPA?!",1690,(255,255,255),104,2,box=(216,50,47))
im.save("/home/user/Alihamz55/video/Hayati-Minta-Balikan-thumbnail.jpg",quality=92); print("ok")
