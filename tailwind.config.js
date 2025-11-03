/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'sf-orange-1': '#EA5020',
        'sf-orange-2': '#F89221',
        'sf-bg': '#FBFBFA',
        'sf-black': '#000000',
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
