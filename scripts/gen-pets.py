"""Hand-crafted 64x64 pixel-art pets for notchbud. Chunky shapes, 2px dark outline."""
from PIL import Image, ImageDraw, ImageFilter

OUT = (35, 35, 42, 255)        # #23232a outline
FUR = (237, 237, 242, 255)     # #EDEDF2 white fur
SHADE = (185, 185, 199, 255)   # grey shading
DARKGREY = (140, 140, 155, 255)
EARIN = (255, 170, 170, 255)   # pink inner ear
NOSE = (255, 138, 138, 255)   # #FF8A8A
EYE = (20, 20, 28, 255)
HI = (255, 255, 255, 255)
MOUTH = (122, 46, 46, 255)     # #7A2E2E
TONGUE = (255, 110, 110, 255)
ZBLUE = (90, 169, 255, 255)
MONF = (30, 58, 138, 255)      # monitor frame navy
MONB = (59, 130, 246, 255)     # monitor blue
MONS = (191, 219, 254, 255)    # screen light blue
BOOK = (232, 184, 75, 255)     # tan/yellow book
BOOKD = (180, 130, 40, 255)
PAGES = (255, 247, 224, 255)
PAW = (255, 170, 170, 255)

S = 64

def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))

def outline_layer(sil):
    """2px dark outline: dilate alpha by 2, fill OUT, cut original out, paste sil on top."""
    a = sil.split()[3]
    dil = a.filter(ImageFilter.MaxFilter(5))  # radius 2
    out = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    out.putalpha(dil)
    # colorize: solid OUT where dilated
    solid = Image.new("RGBA", (S, S), OUT)
    solid.putalpha(dil)
    # paste silhouette over center
    return Image.alpha_composite(solid, sil)

def r(d, x0, y0, x1, y1, c):
    d.rectangle([x0, y0, x1 - 1, y1 - 1], fill=c)

def cat_head(d, hx=14, hy=14, hw=36, hgt=34, ear_h=12):
    """Big blocky head with ears. Returns face anchor info."""
    x0, y0 = hx, hy + ear_h
    x1, y1 = hx + hw, hy + ear_h + hgt
    # ears (blocky triangles via stacked rects)
    ew = 14
    for i in range(5):
        w = ew - i * 2
        # left ear
        r(d, x0 + 1 + i, y0 - ear_h + i * 2, x0 + 1 + i + w, y0 - ear_h + i * 2 + 2, FUR)
        # right ear
        r(d, x1 - 1 - i - w, y0 - ear_h + i * 2, x1 - 1 - i - w + w, y0 - ear_h + i * 2 + 2, FUR)
    # inner ears pink
    for i in range(3):
        w = 6 - i * 2
        r(d, x0 + 4 + i, y0 - ear_h + 3 + i * 2, x0 + 4 + i + w, y0 - ear_h + 3 + i * 2 + 2, EARIN)
        r(d, x1 - 4 - i - w, y0 - ear_h + 3 + i * 2, x1 - 4 - i - w + w, y0 - ear_h + 3 + i * 2 + 2, EARIN)
    # head block with rounded-ish corners (step in corners)
    r(d, x0 + 2, y0, x1 - 2, y1 - 2, FUR)
    r(d, x0, y0 + 4, x1, y1 - 6, FUR)
    r(d, x0 + 1, y0 + 2, x1 - 1, y1 - 4, FUR)
    # grey shading: right side + bottom + head top patch (tabby)
    r(d, x1 - 8, y0 + 4, x1 - 1, y1 - 4, SHADE)
    r(d, x0 + 1, y1 - 10, x1 - 1, y1 - 2, SHADE)
    r(d, x0 + 10, y0, x0 + 26, y0 + 5, DARKGREY)  # tabby cap
    # body stub below head
    r(d, x0 + 6, y1 - 2, x1 - 6, y1 + 6, FUR)
    r(d, x0 + 6, y1 + 2, x1 - 6, y1 + 6, SHADE)
    return (x0, y0, x1, y1)

def face(d, x0, y0, x1, y1, closed=False):
    cx = (x0 + x1) // 2
    ey = y0 + 12
    if closed:
        r(d, cx - 13, ey, cx - 5, ey + 2, EYE)
        r(d, cx + 5, ey, cx + 13, ey + 2, EYE)
    else:
        # big black eyes 7x9 with white highlight
        r(d, cx - 14, ey, cx - 7, ey + 9, EYE)
        r(d, cx + 7, ey, cx + 14, ey + 9, EYE)
        r(d, cx - 13, ey + 1, cx - 11, ey + 3, HI)
        r(d, cx + 8, ey + 1, cx + 10, ey + 3, HI)
    # nose 6x4
    ny = ey + 12
    r(d, cx - 3, ny, cx + 3, ny + 4, NOSE)
    # open happy mouth: dark maroon block + tongue
    my = ny + 5
    r(d, cx - 9, my, cx + 9, my + 10, MOUTH)
    r(d, cx - 8, my, cx + 8, my + 2, MOUTH)
    r(d, cx - 6, my + 5, cx + 6, my + 10, TONGUE)

def finish(sil):
    return outline_layer(sil)

# ---------- 1. HAPPY ----------
im = new(); d = ImageDraw.Draw(im)
x0, y0, x1, y1 = cat_head(d, hx=13, hy=8, hw=38, hgt=34, ear_h=12)
face(d, x0, y0, x1, y1)
im = finish(im)
im.save("public/pets/pet-happy.png")

# ---------- 2. SLEEP (curled loaf + Z's) ----------
im = new(); d = ImageDraw.Draw(im)
# loaf body: wide rounded block
r(d, 8, 34, 56, 56, FUR)
r(d, 10, 30, 54, 38, FUR)
r(d, 44, 34, 56, 56, SHADE)     # tail/shade on right
r(d, 8, 50, 56, 56, SHADE)
r(d, 20, 30, 40, 34, DARKGREY)  # tabby patch on back
# head resting on left, chin on body
r(d, 8, 22, 30, 46, FUR)
r(d, 8, 40, 30, 46, SHADE)
# ears
r(d, 10, 14, 18, 24, FUR); r(d, 12, 17, 16, 22, EARIN)
r(d, 22, 14, 30, 24, FUR); r(d, 24, 17, 28, 22, EARIN)
# closed eyes + tiny nose + small mouth line
r(d, 12, 30, 18, 32, EYE)
r(d, 22, 30, 28, 32, EYE)
r(d, 18, 34, 23, 37, NOSE)
r(d, 17, 39, 24, 41, MOUTH)
# chunky blue Z's (two, ascending right)
def z(d, ox, oy, s):
    # top bar, diagonal, bottom bar — blocky
    r(d, ox, oy, ox + 3 * s, oy + s, ZBLUE)
    for i in range(3):
        r(d, ox + (2 - i) * s, oy + s + i * s, ox + (3 - i) * s, oy + 2 * s + i * s, ZBLUE)
    r(d, ox, oy + 4 * s, ox + 3 * s, oy + 5 * s, ZBLUE)
z(d, 40, 8, 3)
z(d, 50, 2, 2)
im = finish(im)
im.save("public/pets/pet-sleep.png")

# ---------- 3. WAVE (paw raised high, separated) ----------
im = new(); d = ImageDraw.Draw(im)
x0, y0, x1, y1 = cat_head(d, hx=11, hy=14, hw=34, hgt=30, ear_h=11)
face(d, x0, y0, x1, y1)
# raised paw: clearly separated rounded rect to the upper right with 3px gap
px0, py0, px1, py1 = 47, 4, 61, 28
r(d, px0 + 2, py0, px1 - 2, py1, FUR)
r(d, px0, py0 + 3, px1, py1 - 3, FUR)
r(d, px0, py0 + 16, px1, py1 - 3, SHADE)
# big pink paw pad + toes
r(d, 50, 8, 58, 16, PAW)
r(d, 50, 18, 53, 21, PAW)
r(d, 55, 18, 58, 21, PAW)
im = finish(im)
# carve 2px transparency gap between paw and head so it reads separated:
px = im.load()
for yy in range(S):
    for xx in range(45, 48):
        px[xx, yy] = (0, 0, 0, 0)
im.save("public/pets/pet-wave.png")

# ---------- 4. COMPUTER (cat + chunky blue monitor) ----------
im = new(); d = ImageDraw.Draw(im)
# monitor: chunky blue rect right side
r(d, 30, 14, 60, 44, MONB)
r(d, 34, 18, 56, 36, MONS)      # lighter screen
r(d, 34, 18, 38, 36, (255, 255, 255, 255))  # glare strip
r(d, 40, 44, 50, 52, MONF)      # stand neck
r(d, 34, 50, 56, 54, MONF)      # stand base
# cat head peeking left-bottom
r(d, 4, 26, 30, 52, FUR)
r(d, 4, 46, 30, 52, SHADE)
r(d, 22, 26, 30, 52, SHADE)
r(d, 6, 16, 14, 28, FUR); r(d, 8, 19, 12, 25, EARIN)   # one ear visible
r(d, 20, 16, 28, 28, FUR); r(d, 22, 19, 26, 25, EARIN)
# face on cat part
r(d, 8, 33, 14, 41, EYE); r(d, 9, 34, 11, 36, HI)
r(d, 20, 33, 26, 41, EYE); r(d, 21, 34, 23, 36, HI)
r(d, 14, 43, 20, 46, NOSE)
r(d, 9, 48, 25, 55, MOUTH)
r(d, 12, 51, 22, 55, TONGUE)
im = finish(im)
im.save("public/pets/pet-computer.png")

# ---------- 5. NOTEBOOK (cat + tan book) ----------
im = new(); d = ImageDraw.Draw(im)
# cat head left
r(d, 4, 16, 34, 52, FUR)
r(d, 4, 44, 34, 52, SHADE)
r(d, 26, 16, 34, 52, SHADE)
r(d, 6, 6, 15, 18, FUR); r(d, 8, 9, 12, 15, EARIN)
r(d, 23, 6, 32, 18, FUR); r(d, 25, 9, 29, 15, EARIN)
r(d, 10, 8, 28, 12, DARKGREY)  # tabby cap
# face
r(d, 9, 26, 15, 34, EYE); r(d, 10, 27, 12, 29, HI)
r(d, 23, 26, 29, 34, EYE); r(d, 24, 27, 26, 29, HI)
r(d, 16, 36, 22, 39, NOSE)
r(d, 11, 41, 27, 50, MOUTH)
r(d, 14, 45, 24, 50, TONGUE)
# tan book right side, overlapping
r(d, 36, 24, 60, 56, BOOK)
r(d, 36, 24, 41, 56, BOOKD)     # spine
r(d, 43, 27, 57, 53, PAGES)     # pages
r(d, 46, 31, 54, 33, BOOKD)     # text lines
r(d, 46, 36, 54, 38, BOOKD)
r(d, 46, 41, 54, 43, BOOKD)
im = finish(im)
im.save("public/pets/pet-notebook.png")

print("done")
