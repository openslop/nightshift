#!/usr/bin/env python3
"""Render a --dump frame to PNG so the console can be previewed outside a terminal.
   node bin/nightshift-tui --frame 170x46 --dump /tmp/f.json && scripts/render-png.py /tmp/f.json out.png"""
import json, sys, os
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src))
CW, CH, SZ = 9, 18, 15
home = os.path.expanduser("~")
def font(paths, size):
    for p in paths:
        if os.path.exists(p): return ImageFont.truetype(p, size)
    return ImageFont.load_default()
ascii_font = font([home + "/.local/share/fonts/nightshift/ShareTechMono-Regular.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"], SZ + 1)
sym_font = font(["/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"], SZ - 1)
braille_font = font(["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/truetype/noto/NotoSansSymbols2-Regular.ttf", "/usr/share/fonts/opentype/unifont/unifont.otf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"], SZ - 1)
W, H = d["w"] * CW + 24, d["h"] * CH + 24
bg = d["bg"] or "#140e11"
im = Image.new("RGB", (W, H), bg)
dr = ImageDraw.Draw(im)
for y, row in enumerate(d["cells"]):
    for x, (ch, fg, cbg) in enumerate(row):
        px, py = 12 + x * CW, 12 + y * CH
        if cbg: dr.rectangle([px, py, px + CW, py + CH], fill=cbg)
        if ch == " " or not fg: continue
        o = ord(ch)
        f = braille_font if 0x2800 <= o <= 0x28FF else ascii_font if o < 0x2190 else sym_font
        dr.text((px, py + (1 if f is sym_font else 0)), ch, font=f, fill=fg)
im.save(out)
print(out, im.size)
