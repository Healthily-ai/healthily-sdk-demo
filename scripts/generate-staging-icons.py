#!/usr/bin/env python3
"""Generate staging variants of the app icons by overlaying a diagonal
"STAGING" sash across the right side of the base icons.

Run from the repo root:

    python3 scripts/generate-staging-icons.py

Outputs (committed to the repo):
    assets/images/icon-staging.png                     (iOS / general icon)
    assets/images/android-icon-foreground-staging.png  (Android adaptive foreground)

Re-run this whenever the base icons change so the staging variants stay in sync.
"""

import os
from PIL import Image, ImageDraw, ImageFont

ASSETS = os.path.join(os.path.dirname(__file__), "..", "assets", "images")

FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
LABEL = "STAGING"
SASH_COLOR = (211, 47, 47, 255)      # material red 700 — clear "non-production" signal
TEXT_COLOR = (255, 255, 255, 255)


def _fit_font(text, max_width, max_height):
    """Return the largest Arial-Bold font whose rendered text fits the box."""
    size = 8
    font = ImageFont.truetype(FONT_PATH, size)
    while True:
        trial = ImageFont.truetype(FONT_PATH, size + 4)
        l, t, r, b = trial.getbbox(text)
        if (r - l) > max_width or (b - t) > max_height:
            break
        size += 4
        font = trial
    return font


def make_sash(canvas_size, corner_box, thickness_frac, label=LABEL):
    """Build a transparent overlay containing a diagonal sash across the
    top-right corner of `corner_box` (l, t, r, b) inside a `canvas_size` square.

    Returns an RGBA overlay the size of the canvas.
    """
    W = H = canvas_size
    bl, bt, br, bb = corner_box
    box_w = br - bl

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Distances from the top-right corner of the box (along each edge) that
    # bound the outer and inner edges of the band.
    a = 0.30 * box_w   # outer edge distance from corner
    b = 0.62 * box_w   # inner edge distance from corner
    cx_corner, cy_corner = br, bt

    # Polygon of the band crossing the corner (slope +1 in screen coords).
    p_outer_top = (cx_corner - a, cy_corner)
    p_inner_top = (cx_corner - b, cy_corner)
    p_inner_right = (cx_corner, cy_corner + b)
    p_outer_right = (cx_corner, cy_corner + a)
    draw.polygon(
        [p_outer_top, p_inner_top, p_inner_right, p_outer_right],
        fill=SASH_COLOR,
    )

    # Band centre + perpendicular thickness (used to size the text box).
    thickness = (b - a) / (2 ** 0.5)
    band_len = ((p_outer_right[0] - p_outer_top[0]) ** 2 +
                (p_outer_right[1] - p_outer_top[1]) ** 2) ** 0.5
    center_x = (p_outer_top[0] + p_inner_top[0] + p_inner_right[0] + p_outer_right[0]) / 4
    center_y = (p_outer_top[1] + p_inner_top[1] + p_inner_right[1] + p_outer_right[1]) / 4

    # Render the label on its own layer, rotate onto the band diagonal.
    font = _fit_font(label, band_len * 0.9, thickness * 0.55)
    l, t, r, bch = font.getbbox(label)
    tw, th = r - l, bch - t
    text_layer = Image.new("RGBA", (int(tw) + 8, int(th) + 8), (0, 0, 0, 0))
    ImageDraw.Draw(text_layer).text((4 - l, 4 - t), label, font=font, fill=TEXT_COLOR)
    # Band runs down-right (slope +1) -> rotate text -45deg (clockwise).
    rotated = text_layer.rotate(-45, expand=True, resample=Image.BICUBIC)
    overlay.alpha_composite(
        rotated,
        (int(center_x - rotated.width / 2), int(center_y - rotated.height / 2)),
    )
    return overlay


def build(src_name, out_name, corner_box_frac):
    src = Image.open(os.path.join(ASSETS, src_name)).convert("RGBA")
    W, H = src.size
    box = tuple(int(f * W) for f in corner_box_frac)
    overlay = make_sash(W, box, thickness_frac=0.20)
    out = Image.alpha_composite(src, overlay)
    out_path = os.path.join(ASSETS, out_name)
    out.save(out_path)
    print(f"wrote {out_path} ({W}x{H})")


if __name__ == "__main__":
    # iOS / general icon: sash crosses the true top-right corner.
    build("icon.png", "icon-staging.png", corner_box_frac=(0.0, 0.0, 1.0, 1.0))

    # Android adaptive foreground: keep the sash inside the ~66% safe zone so
    # the launcher mask doesn't crop it. Box inset to the central region.
    build(
        "android-icon-foreground.png",
        "android-icon-foreground-staging.png",
        corner_box_frac=(0.17, 0.17, 0.83, 0.83),
    )
