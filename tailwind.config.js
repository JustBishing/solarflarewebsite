/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'sf-orange-1': 'rgb(var(--sf-orange1) / <alpha-value>)',
        'sf-orange-2': 'rgb(var(--sf-orange2) / <alpha-value>)',
        'sf-bg': 'rgb(var(--sf-bg) / <alpha-value>)',
        'sf-surface': 'rgb(var(--sf-surface) / <alpha-value>)',
        'sf-elevated': 'rgb(var(--sf-elevated) / <alpha-value>)',
        'sf-border': 'rgb(var(--sf-border) / <alpha-value>)',
        'sf-text': 'rgb(var(--sf-text) / <alpha-value>)',
        'sf-muted': 'rgb(var(--sf-muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"Exo 2"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
      },
    },
  },
  plugins: [],
};
