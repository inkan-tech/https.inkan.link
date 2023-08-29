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
      // opposite of Japanise Carmine 
        'secondary': {
        DEFAULT: '#299D93',
        50: "#E0FFFF",
        100: "#C2FFFE",
        200: "#85FFFB",
        300: "#42FFF6",
        400: "#18ECDE",
        500: "#299D93",
        600: "#0EA59B",
        700: "#009E96",
        800: "#008F8A",
        900: "#007A78",
        950: "#007070"
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
