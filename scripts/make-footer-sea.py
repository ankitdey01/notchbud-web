"""Bake dusk-style pixel edges into the footer sea image.

Top: jagged pixel teeth (hard cut, varying depth per column).
Bottom: Bayer-ordered dissolve into white over the last ~12% of rows.
Output is opaque RGB on white, so no CSS mask is needed to blend.
"""
import math
from PIL import Image

SRC = "public/1000186583.png"
DST = "public/1000186583.webp"

BAYER8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
]

im = Image.open(SRC).convert("RGB")
W, H = im.size
px = im.load()

# Jagged top teeth: 12..32 px deep, slow wobble so teeth read as blocks.
for x in range(W):
    cut = 12 + int(12 * (0.5 + 0.5 * math.sin(x * 0.02 + 1.7))
                   + 8 * (0.5 + 0.5 * math.sin(x * 0.055)))
    for y in range(min(cut, H)):
        px[x, y] = (255, 255, 255)

# Bottom dissolve into white.
zone = max(120, int(H * 0.12))
start = H - zone
for y in range(start, H):
    t = 1.0 - (y - start + 1) / (zone + 1)  # 1 -> 0 downward
    row = BAYER8[y % 8]
    for x in range(W):
        if (row[x % 8] + 0.5) / 64.0 >= t:
            px[x, y] = (255, 255, 255)

im.save(DST)
print("wrote", DST, im.size)
