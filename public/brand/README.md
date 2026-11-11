# GlobalHire Calc brand assets

| File | Use |
|---|---|
| `logo-mark.svg`, `logo-mark-512.png`, `logo-mark-192.png` | App icon / avatar (rounded square) |
| `icon-maskable-512.png` | Full-bleed icon for Android home screens |
| `logo-horizontal-light.svg` / `.png` | Full logo on light backgrounds |
| `logo-horizontal-dark.svg` / `.png` | Full logo on dark backgrounds |

The favicon (`app/icon.svg`), Apple touch icon (`app/apple-icon.png`) and social share image
(`app/opengraph-image.png`) use the same artwork.

**Colors:** blue `#2553eb`, deep blue `#3b5bff`, teal `#0891b2`, gold `#fbbf24`, ink `#0b1220`.
**Typeface:** Inter Display ExtraBold (name) and SemiBold (tagline), converted to outlines.

To regenerate the wordmark files after editing `logo-mark.svg`:

```bash
pip install fonttools
python scripts/brand/build_logo.py public/brand public/brand/logo-mark.svg
```
