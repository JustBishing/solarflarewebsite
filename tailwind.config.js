/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'sf-orange-1': '#EA5020',
        'sf-orange-2': '#F89221',
        'sf-bg': '#0B101E',
        'sf-surface': '#141A2D',
        'sf-elevated': '#1C2339',
        'sf-border': '#2A3350',
        'sf-text': '#F5F7FF',
        'sf-muted': '#C4C8E0',
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
