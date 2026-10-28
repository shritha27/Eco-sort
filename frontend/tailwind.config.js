/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f5',
          100: '#e1f0e8',
          200: '#c5e2d3',
          300: '#9bceb6',
          400: '#6bb393',
          500: '#40916c',
          600: '#2d6a4f',
          700: '#1b4332',
          800: '#143427',
          900: '#081c15',
        },
        sage: {
          50: '#f8faf9',
          100: '#eef3f0',
          200: '#dce5e0',
          300: '#c2d2c9',
          400: '#a3baad',
          500: '#849f8f',
        },
        ivory: '#fcfbf7',
        warmwhite: '#f9f9f6',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
