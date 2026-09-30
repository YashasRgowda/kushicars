/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ------------------------------------------------------------------
           The palette comes from the logo, not the other way round.

           The owner's mark supplies three colours — Kushi Emerald #15523A,
           Kushi Gold #C9A04A and Kushi Ivory #F1E8D3 — and the interface is
           built out of those rather than having a separate identity bolted
           beside it. The division of labour is the same one the logo uses:
           green carries the substance, gold is the shine, ivory is the page
           it is all printed on.

             accent (green) — actions and structure. Buttons, active states,
                              focus, selected filters, icons.
             gold           — ornament only. Rules, flourishes, the full stop,
                              the sheen on a hover. Never a large field.
             danger (red)   — errors, and nothing else. It used to share the
                              accent token, which was fine while the accent
                              was already red; now that the brand is green a
                              validation message in brand colour would read
                              as success.
           ------------------------------------------------------------------ */

        /* Paper — the logo's ivory, opened into a ramp. The page is warm but
           still clearly a white page; the ivory itself only arrives at 200,
           as a section band, where it can be felt rather than stared at. */
        paper: {
          DEFAULT: '#ffffff',
          50: '#fdfbf6',
          100: '#f8f5ec', // page
          200: '#f1ead8', // alternating band — essentially Kushi Ivory
          300: '#e6dcc4', // wells, inert tracks, image mattes
        },
        /* Borders, warmed to match. Three weights: a divider you should not
           notice, a card edge, and the edge under the cursor. */
        line: {
          soft: '#efe9dc',
          DEFAULT: '#e2d9c6',
          strong: '#cbbfa5',
        },
        /* Ink — near-black carrying the logo's darkest green (#062418) so
           type sits in the same family as the mark instead of going cold
           blue-black against a warm page. */
        ink: {
          1000: '#04150e',
          950: '#061a11',
          900: '#0a2016',
          850: '#0c2619',
          800: '#0f2d1e',
          750: '#133724',
          700: '#163d28',
          600: '#1d4d34',
          500: '#245e40',
        },
        accent: {
          DEFAULT: '#15523a', // Kushi Emerald
          deep: '#062418',
          soft: '#1f6b4b',
          glow: '#2e7a58',
          // Green TEXT on a light ground. The brand green is already dark
          // enough to read, but this is the value the gradient in the logo's
          // own lettering settles on, so quoted type matches the mark.
          ink: '#0f4630',
          wash: '#eef3f0',
          line: '#c4d8cc',
        },
        gold: {
          DEFAULT: '#c9a04a', // Kushi Gold
          deep: '#8a6424',
          soft: '#e8c774',
          bright: '#fff1bf',
          // Gold at full strength is 2.2:1 on paper — a fill, never a label.
          // Anything that has to be READ in gold uses this instead (5.9:1).
          ink: '#7a5a1e',
          wash: '#fbf5e6',
          line: '#e4d2a6',
        },
        danger: {
          DEFAULT: '#c0392b',
          ink: '#9d2b20',
          wash: '#fdf3f1',
          line: '#f0cdc7',
        },
        /* The muted tier for small print — the "/mo" on a price, an
           "Optional" flag, a plus code. Tailwind's stone-500 is the natural
           choice and it reads 4.8:1 on a white card, but this page is warm:
           on the ivory band it falls to 4.0 and in a well to 3.5, under AA
           at the 10-11px these labels are set at. Same hue, walked darker
           until the WORST ground on the site clears 4.6. */
        muted: '#655f5b',

        // The logo's ivory as a flat colour, for the few things that sit on ink.
        ivory: '#f1e8d3',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
        // Spec readouts. System stack — no extra font to download.
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Fluid display scale. The jump from body to display is the single
        // biggest lever on how expensive a page reads.
        'display-sm': ['clamp(2.25rem, 1.4rem + 3.6vw, 3.75rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display': ['clamp(2.75rem, 1.2rem + 6.2vw, 6rem)', { lineHeight: '0.96', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(3.25rem, 0.6rem + 9vw, 9rem)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
      },
      letterSpacing: {
        eyebrow: '0.32em',
      },
      boxShadow: {
        /* On black a shadow is an absence of light and can be almost opaque.
           On paper it is a tint of the ink colour, and past about 12% it
           stops reading as height and starts reading as grime. These carry
           the ink green rather than neutral black, so a raised card on a
           warm page does not cast a cold grey. */
        glow: '0 0 50px -14px rgba(21, 82, 58, 0.34)',
        'glow-lg': '0 0 80px -12px rgba(21, 82, 58, 0.38)',
        card: '0 1px 2px rgba(10, 32, 22, 0.05), 0 10px 28px -14px rgba(10, 32, 22, 0.14)',
        lift: '0 1px 2px rgba(10, 32, 22, 0.05), 0 8px 18px -10px rgba(10, 32, 22, 0.12), 0 28px 52px -28px rgba(10, 32, 22, 0.18)',
        'lift-accent':
          '0 1px 2px rgba(10, 32, 22, 0.06), 0 10px 22px -10px rgba(21, 82, 58, 0.32), 0 32px 60px -30px rgba(21, 82, 58, 0.38)',
        'lift-gold':
          '0 1px 2px rgba(10, 32, 22, 0.06), 0 10px 22px -10px rgba(201, 160, 74, 0.34), 0 32px 60px -30px rgba(201, 160, 74, 0.34)',
        // Inner top highlight. On paper the catch is white, not a grey rim.
        rim: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.85)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
        swift: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'page-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        /* The mobile menu. A pair rather than a transition, so the panel
           fades IN the moment it mounts without needing a second render to
           flip a class — and so its removal is driven by a timer we own
           rather than by an animation library reporting itself finished. */
        'sheet-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'sheet-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { opacity: '0.5', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.9)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'page-in': 'page-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'sheet-in': 'sheet-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
        'sheet-out': 'sheet-out 0.24s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 42s linear infinite',
        'marquee-reverse': 'marquee-reverse 52s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
    },
  },
  plugins: [],
}
