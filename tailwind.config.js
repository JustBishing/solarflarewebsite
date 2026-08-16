/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'sf-orange-1': 'rgb(var(--sf-orange1) / <alpha-value>)',
        'sf-orange-2': 'rgb(var(--sf-orange2) / <alpha-value>)',
        'sf-ember': 'rgb(var(--sf-ember) / <alpha-value>)',
        'sf-bg': 'rgb(var(--sf-bg) / <alpha-value>)',
        'sf-band': 'rgb(var(--sf-band) / <alpha-value>)',
        'sf-surface': 'rgb(var(--sf-surface) / <alpha-value>)',
        'sf-elevated': 'rgb(var(--sf-elevated) / <alpha-value>)',
        'sf-border': 'rgb(var(--sf-border) / <alpha-value>)',
        'sf-text': 'rgb(var(--sf-text) / <alpha-value>)',
        'sf-muted': 'rgb(var(--sf-muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Rajdhani"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Archivo"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
      boxShadow: {
        'soft-lg': '0 20px 45px -25px rgba(0,0,0,0.35)',
        glow: '0 0 0 1px rgba(255,145,77,0.35), 0 28px 60px -24px rgba(255,145,77,0.45)',
        'glow-sm': '0 0 24px -4px rgba(255,178,122,0.35)',
      },
      keyframes: {
        'aura-drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -3%, 0) scale(1.08)' },
        },
        'aura-drift-slow': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(-3%, 2%, 0) scale(1.12)' },
        },
        'marquee-track': {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'badge-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'aura-drift': 'aura-drift 14s ease-in-out infinite',
        'aura-drift-slow': 'aura-drift-slow 22s ease-in-out infinite',
        'marquee-track': 'marquee-track 42s linear infinite',
        'badge-spin': 'badge-spin 18s linear infinite',
      },
    },
  },
  plugins: [],
};
