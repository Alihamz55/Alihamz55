from PIL import Image, ImageDraw, ImageFont
W,H=1080,1920; INK=(36,23,38)
F=lambda s: ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf", s)
im=Image.open("/home/user/shorts/seri3/test/f0005.jpg").convert("RGB")
def label(txt,y,fill,sz,rot=0,box=None):
    lay=Image.new("RGBA",(W,340),(0,0,0,0)); ld=ImageDraw.Draw(lay)
    if box:
        bb=ld.textbbox((W/2,170),txt,font=F(sz),anchor="mm")
        ld.rounded_rectangle((bb[0]-40,bb[1]-34,bb[2]+40,bb[3]+34),26,fill=box,outline=INK,width=12)
    ld.text((W/2,170),txt,font=F(sz),fill=fill,anchor="mm",stroke_width=14,stroke_fill=INK)
    lay=lay.rotate(rot,resample=Image.BICUBIC); im.paste(lay,(0,y-170),lay)
label("SERI MANTAN #3",150,(255,255,255),48,0,box=(200,60,140))
label("DIUNDANG KE",320,(255,255,255),104,1.5)
label("NIKAHAN MANTAN",450,(255,255,255),96,-1.5)
label("JADI FOTOGRAFERNYA",590,(255,216,74),76,1.5)
label("GUE YANG NANGIS",1730,(255,255,255),92,2,box=(216,50,47))
im.save("/home/user/Alihamz55/video/Seri-Mantan-3-thumbnail.jpg",quality=92); print("ok")
