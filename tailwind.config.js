/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#76E4B8',
        secondary: '#FFF1A1',
        tertiary: '#FFB2C1',
        neutral: '#FFFDF5',
        dark: '#2D4A3E',
      },
      borderRadius: {
        pill: '80px',
      },
    },
  },
  plugins: [],
}

