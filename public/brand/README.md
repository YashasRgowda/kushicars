# Brand assets

The owner's logo, with the supplied cream background and decorative frame
removed. `_source-original.webp` is the untouched file it all came from.

| file | use |
| --- | --- |
| `logo.png` | car + name + tagline. Anywhere with real room: the preloader, the admin sign-in. |
| `logo-light.png` | the same, for dark grounds. |
| `logo-mark.png` | car + name, **no tagline**. Navbar and footer — the tagline is unreadable below about 80px of lockup height. |
| `logo-mark-light.png` | the same, for dark grounds. |
| `icon-512.png` | square app icon. It and every favicon are generated from `logo.png` — see below. |

## Why there are two of each

The site's navbar crosses the hero video, which is dark, and the lockup's
"KUSHI CARS" is a deep forest green that disappears on it. The `-light`
files are a proper reverse.

Note what "reverse" has to mean here. The artwork is a DARK body with BRIGHT
gold trim on cream. Recolouring only the body — green to cream, gold left
alone — leaves the trim with nothing to sit against, and at navbar size the
car turns to mush. A reverse has to flip the VALUE relationship and keep the
hues: bright body, darker bronze trim. That is what these files do, and it
is the only alteration made to the mark.

## If these ever need regenerating

The supplied background is a cream *gradient*, not a flat fill, so it was
keyed on distance from rgb(243,235,216) with a soft ramp (18 → 55) and then
colour-decontaminated — for each partly transparent pixel, the true colour is
recovered with `F = (C - (1-a)B) / a`. That is what keeps the edges clean on
a dark background as well as a light one; a plain key leaves a cream halo
that only shows up once the logo is placed on ink.

## The icons

`icon-512.png`, `/favicon.ico` (16/32/48), `/favicon-16.png`, `/favicon.png`,
`/favicon-48.png` and `/apple-touch-icon.png` all come from one recipe, run
over `logo.png`: lift the car off the top of the lockup, stand it on the
green ground at 96% of the tile's width, round the corners at 20%, and
render at 8x before a single Lanczos step down. Sizes of 48 and below get a
light unsharp pass afterwards, which is the difference between a car and a
smudge in a browser tab.

Two things that are deliberate and easy to undo by accident:

- **The .ico holds three separately rendered PNGs**, not one bitmap the
  encoder resized. Saving it with Pillow's `sizes=` argument instead would
  throw away the per-size sharpening.
- **`apple-touch-icon.png` is an opaque square with no rounded corners.**
  iOS applies its own mask and composites anything transparent over black,
  so a pre-rounded icon with alpha corners gets dark notches on the home
  screen. The version before this one had exactly that.

