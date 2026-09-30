# Brand assets

The owner's logo, with the supplied cream background and decorative frame
removed. `_source-original.webp` is the untouched file it all came from.

| file | use |
| --- | --- |
| `logo.png` | car + name + tagline. Anywhere with real room: the preloader, the admin sign-in. |
| `logo-light.png` | the same, for dark grounds. |
| `logo-mark.png` | car + name, **no tagline**. Navbar and footer — the tagline is unreadable below about 80px of lockup height. |
| `logo-mark-light.png` | the same, for dark grounds. |
| `icon-512.png` | square app icon; `/favicon.png` and `/apple-touch-icon.png` are cut from it. |

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
