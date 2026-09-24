/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Near-black neutrals with a faint blue cast — reads as depth, not grey.
        ink: {
          1000: '#040507',
          950: '#08090c',
          900: '#0b0d12',
          850: '#0e1016',
          800: '#11141b',
          750: '#161a23',
          700: '#181c26',
          600: '#222735',
          500: '#2d3342',
        },
        accent: {
          deep: '#7f1220',
          DEFAULT: '#DC2626',
          soft: '#ef4444',
          glow: '#f87171',
        },
        // Warm off-white for headline chrome — pure #fff on black is harsh.
        platinum: '#F3F1EC',
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
        glow: '0 0 60px -12px rgba(220, 38, 38, 0.45)',
        'glow-lg': '0 0 90px -10px rgba(220, 38, 38, 0.5)',
        card: '0 24px 60px -20px rgba(0, 0, 0, 0.8)',
        // Layered like real light: contact shadow + mid + ambient.
        lift: '0 1px 1px rgba(0,0,0,0.5), 0 8px 16px -6px rgba(0,0,0,0.6), 0 30px 60px -20px rgba(0,0,0,0.85)',
        'lift-accent':
          '0 1px 1px rgba(0,0,0,0.5), 0 10px 24px -8px rgba(220,38,38,0.35), 0 40px 80px -24px rgba(220,38,38,0.4)',
        // Inner top highlight — the edge-of-glass catch that sells a surface.
        rim: 'inset 0 1px 0 0 rgba(255,255,255,0.09)',
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
        marquee: 'marquee 42s linear infinite',
        'marquee-reverse': 'marquee-reverse 52s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
    },
  },
  plugins: [],
}
