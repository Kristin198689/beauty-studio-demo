#!/usr/bin/env python3
"""Builds the social preview images (OG, 1200x630, de/uk/en) and all icons.

Run from the project root after the name, hero photo or texts change:
    python3 scripts/brand-assets.py

Reads the studio name from src/config/site.ts, the headline from messages/<locale>.json
and the photo from public/images/hero/bg-desktop.jpg. Needs Pillow. Fonts are in scripts/fonts
(Inter Tight and Cormorant Garamond Italic, both SIL Open Font License).
"""
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "scripts" / "fonts"
INK = (10, 10, 10)
PAPER = (250, 250, 247)

NAME = re.search(r'name:\s*"([^"]+)"', (ROOT / "src/config/site.ts").read_text()).group(1)


def inter(size, cyr=False, weight=800):
    f = ImageFont.truetype(str(FONTS / ("InterTight-cyrillic.ttf" if cyr else "InterTight-latin.ttf")), size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f


def serif(size, cyr=False):
    f = ImageFont.truetype(
        str(FONTS / ("CormorantGaramond-Italic-cyrillic.ttf" if cyr else "CormorantGaramond-Italic-latin.ttf")),
        size,
    )
    try:
        f.set_variation_by_axes([300])
    except Exception:
        pass
    return f


def is_cyr(ch):
    return "\u0400" <= ch <= "\u04ff"


def tracked(draw, xy, text, fonts, fill, tracking):
    """Draw text with tight letter spacing (tracking in px, negative = tighter). Returns the end x.
    `fonts` is (latin, cyrillic): each character uses the file that really contains it."""
    x, y = xy
    for ch in text:
        font = fonts[1] if is_cyr(ch) else fonts[0]
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def og(locale):
    msg = json.loads((ROOT / f"messages/{locale}.json").read_text())["hero"]
    cyr = locale == "uk"
    strip = lambda s: re.sub(r"</?em>", "", s)
    line1 = msg["line1"].upper()
    start = msg["line2Start"].upper()
    word = strip(msg["line2End"])

    photo = Image.open(ROOT / "public/images/hero/bg-desktop.jpg").convert("RGB")
    w, h = photo.size
    ch = int(w / (1200 / 630))
    top = max(0, (h - ch) // 2)
    img = photo.crop((0, top, w, top + ch)).resize((1200, 630), Image.LANCZOS)
    d = ImageDraw.Draw(img)

    pair = lambda size: (inter(size), inter(size, True))
    tracked(d, (64, 52), NAME.upper(), pair(30), PAPER, 0)
    f1 = pair(104)
    tracked(d, (60, 250), line1, f1, PAPER, -5)
    x = tracked(d, (60, 352), start + " ", f1, PAPER, -5)
    size = int(104 * 1.2)
    tracked(d, (x + 4, 340), word, (serif(size), serif(size, True)), PAPER, 0)

    out = ROOT / f"public/og/og-{locale}.jpg"
    img.save(out, "JPEG", quality=84, optimize=True, progressive=True)
    print(out.relative_to(ROOT), out.stat().st_size // 1024, "KB")


def icon(size, name, pad=0.0):
    img = Image.new("RGB", (size, size), INK)
    d = ImageDraw.Draw(img)
    letter = NAME.strip()[:1].upper() or "S"
    font = inter(int(size * (0.62 - pad)), letter > "Ѐ" and letter < "ӿ")
    box = d.textbbox((0, 0), letter, font=font)
    tx = (size - (box[2] - box[0])) / 2 - box[0]
    ty = (size - (box[3] - box[1])) / 2 - box[1]
    d.text((tx, ty), letter, font=font, fill=PAPER)
    path = ROOT / "public/icons" / name
    img.save(path, "PNG", optimize=True)
    print(path.relative_to(ROOT))
    return img


if __name__ == "__main__":
    for loc in ("de", "uk", "en"):
        og(loc)
    icon(16, "icon-16.png")
    icon(32, "icon-32.png")
    icon(48, "icon-48.png")
    icon(180, "apple-touch-icon.png")
    icon(192, "icon-192.png")
    icon(512, "icon-512.png")
    icon(512, "maskable-512.png", pad=0.14)  # extra margin: Android crops maskable icons to a circle
    big = icon(256, "_ico.png")
    # the Next.js build only accepts ICO frames that are RGBA
    big.convert("RGBA").save(ROOT / "src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    (ROOT / "public/icons/_ico.png").unlink()
    print("src/app/favicon.ico")
