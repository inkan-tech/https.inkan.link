const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
// tailwind.config.js
module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.md'],
  darkMode: 'class',
  theme: {
 
      colors: {      
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
 // Japanese Carmine 9d2933
      'primary': {
        DEFAULT: '#9d2933',
        50: "#FFE0E0",
        100: "#FFC2C3",
        200: "#FF8589",
        300: "#FF424C",
        400: "#EC1826",
        500: "#9D2933",
        600: "#A50E18",
        700: "#9E0008",
        800: "#8F0005",
        900: "#7A0002",
        950: "#700000"
      },
// Rosso corsa d90b0b not used See: https://www.tints.dev/
'primary-light': {
  DEFAULT: '#D90B0B',
  50: "#FFE3E0",
  100: "#FFCBC7",
  200: "#FF948F",
  300: "#FF5C57",
  400: "#FF221F",
  500: "#D90B0B",
  600: "#CC0300",
  700: "#B30600",
  800: "#990800",
  900: "#800800",
  950: "#700900"
},
      'neutral': {
        DEFAULT: '#6B7280',
        50: '#CDD0D5',
        100: '#C2C5CC',
        200: '#ACB0BA',
        300: '#969BA7',
        400: '#7F8694',
        500: '#6B7280',
        600: '#515761',
        700: '#383C43',
        800: '#1E2024',
        900: '#050506'
      },   
      // paint it black
        'secondary': {
          DEFAULT: '#000000',
          50: '#5C5C5C',
          100: '#525252',
          200: '#3D3D3D',
          300: '#292929',
          400: '#141414',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000'
        }
      // To change these, use https://www.tailwindshades.com/ with https://tailwindcss.com/docs/customizing-colors or create your own custom colors.

      }, 

      lineHeight: {
        'extra-loose': '2.5',
        '12': '3rem',
      },

    
  },
  variants: {
    typography: ["dark"],
  },
  plugins: [require("@tailwindcss/typography")],
};
