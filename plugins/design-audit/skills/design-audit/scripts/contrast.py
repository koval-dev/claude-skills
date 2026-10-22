#!/usr/bin/env python3
"""WCAG 2.x contrast ratio between two colours.

Usage:
    python3 contrast.py "#777777" "#ffffff"
    python3 contrast.py "rgb(119,119,119)" white

Accepts #rgb, #rrggbb, rgb()/rgba() (alpha ignored) and a few named colours.
No third-party dependencies.
"""
import re
import sys

NAMED = {
    "white": (255, 255, 255),
    "black": (0, 0, 0),
    "red": (255, 0, 0),
    "green": (0, 128, 0),
    "blue": (0, 0, 255),
    "gray": (128, 128, 128),
    "grey": (128, 128, 128),
}


def parse(color):
    c = color.strip().lower()
    if c in NAMED:
        return NAMED[c]
    if c.startswith("#"):
        h = c[1:]
        if len(h) in (3, 4):
            h = "".join(ch * 2 for ch in h[:3])
        if len(h) in (6, 8):
            return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    m = re.match(r"rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)", c)
    if m:
        return tuple(round(float(v)) for v in m.groups())
    raise ValueError(f"Unrecognised colour: {color}")


def luminance(rgb):
    def channel(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4

    r, g, b = (channel(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg, bg):
    l1, l2 = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    r = ratio(parse(sys.argv[1]), parse(sys.argv[2]))
    print(f"Contrast ratio: {r:.2f}:1")
    for label, need in (("Body text (AA)", 4.5), ("Large text / UI components (AA)", 3.0), ("Body text (AAA)", 7.0)):
        print(f"  {label:34} needs {need}:1  {'PASS' if r >= need else 'FAIL'}")


if __name__ == "__main__":
    main()
