"""Builds the GlobalHire Calc logo files. Text is converted to outlines so it renders identically everywhere."""
import re, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

OUT = sys.argv[1]
FONT_DIR = '/usr/share/fonts/opentype/inter/'
fonts = {w: TTFont(FONT_DIR + f'InterDisplay-{w}.otf') for w in ('ExtraBold', 'SemiBold')}

def text_path(text, weight, size, x, baseline, tracking=0.0):
    """Returns (svg path d, advance width) for text set in Inter Display."""
    font = fonts[weight]
    upm = font['head'].unitsPerEm
    cmap = font.getBestCmap()
    glyphs = font.getGlyphSet()
    hmtx = font['hmtx']
    scale = size / upm
    pen = SVGPathPen(glyphs)
    cursor = 0.0
    for ch in text:
        name = cmap.get(ord(ch))
        if name is None:
            continue
        tpen = TransformPen(pen, (scale, 0, 0, -scale, x + cursor, baseline))
        glyphs[name].draw(tpen)
        cursor += hmtx[name][0] * scale + tracking * size
    d = pen.getCommands()
    # Round coordinates to keep files small.
    d = re.sub(r'-?\d+\.\d+', lambda m: f'{float(m.group()):.2f}'.rstrip('0').rstrip('.'), d)
    return d, cursor - tracking * size

mark = open(sys.argv[2]).read()
mark_inner = mark.split('>', 1)[1].rsplit('</svg>', 1)[0]  # everything inside <svg>

def horizontal(theme):
    ink, accent, muted = {
        'light': ('#0b1220', '#2553eb', '#64748b'),
        'dark': ('#ffffff', '#8fb0ff', '#94a3b8'),
    }[theme]
    tx = 116
    d1, w1 = text_path('Global', 'ExtraBold', 46, tx, 60, -0.012)
    d2, w2 = text_path('Hire', 'ExtraBold', 46, tx + w1, 60, -0.012)
    d3, w3 = text_path(' Calc', 'ExtraBold', 46, tx + w1 + w2, 60, -0.012)
    d4, w4 = text_path('TRUE COST OF HIRING ABROAD', 'SemiBold', 12.5, tx + 2, 86, 0.16)
    width = int(tx + max(w1 + w2 + w3, w4) + 8)
    ids = mark_inner.replace('ghc-', f'ghc-{theme}-')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 96" width="{width * 2}" height="192" role="img" aria-label="GlobalHire Calc">
  <g>{ids}</g>
  <path fill="{ink}" d="{d1}"/>
  <path fill="{accent}" d="{d2}"/>
  <path fill="{ink}" d="{d3}"/>
  <path fill="{muted}" d="{d4}"/>
</svg>
'''

for theme in ('light', 'dark'):
    open(f'{OUT}/logo-horizontal-{theme}.svg', 'w').write(horizontal(theme))

# Social share image (1200 × 630)
title1, t1w = text_path('What does a remote developer', 'ExtraBold', 54, 80, 336, -0.015)
title2a, t2aw = text_path('really', 'ExtraBold', 54, 80, 402, -0.015)
title2b, _ = text_path(' cost?', 'ExtraBold', 54, 80 + t2aw, 402, -0.015)
sub, _ = text_path('Salary, employer taxes, benefits and compliance risk in 8 countries', 'SemiBold', 26, 82, 462, 0)
brand_a, bw = text_path('Global', 'ExtraBold', 34, 196, 148, -0.012)
brand_b, bw2 = text_path('Hire', 'ExtraBold', 34, 196 + bw, 148, -0.012)
brand_c, _ = text_path(' Calc', 'ExtraBold', 34, 196 + bw + bw2, 148, -0.012)
cta, cw = text_path('Free 2026 calculator', 'SemiBold', 24, 112, 551, 0)
og = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="og-bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#eef4ff"/><stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <radialGradient id="og-glow" cx="1040" cy="120" r="520" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2553eb" stop-opacity="0.22"/><stop offset="1" stop-color="#2553eb" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#og-bg)"/>
  <rect width="1200" height="630" fill="url(#og-glow)"/>
  <g transform="translate(80 88) scale(1)">{mark_inner.replace('ghc-', 'og-mark-')}</g>
  <path fill="#0b1220" d="{brand_a}"/><path fill="#2553eb" d="{brand_b}"/><path fill="#0b1220" d="{brand_c}"/>
  <path fill="#0b1220" d="{title1}"/>
  <path fill="#2553eb" d="{title2a}"/><path fill="#0b1220" d="{title2b}"/>
  <path fill="#475569" d="{sub}"/>
  <rect x="80" y="508" width="{cw + 64}" height="64" rx="18" fill="#2553eb"/>
  <path fill="#ffffff" d="{cta}"/>
  <g transform="translate(948 92) scale(1.9)">{mark_inner.replace('ghc-', 'og-big-')}</g>
</svg>
'''
open(f'{OUT}/og-image.svg', 'w').write(og)

# Square, full-bleed variant for app icons (iOS/Android round the corners themselves).
open(f'{OUT}/mark-square.svg', 'w').write(mark.replace('rx="24" fill="url(#ghc-bg)"', 'fill="url(#ghc-bg)"').replace('rx="24" fill="url(#ghc-shine)"', 'fill="url(#ghc-shine)"'))
print('built')
