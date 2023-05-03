const defaultTheme = require('tailwindcss/defaultTheme')

// tailwind.config.js
module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.md'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {      
      transparent: 'transparent',
      current: 'currentColor',
 
      'primary': {
        DEFAULT: '#EC4899',
        50: '#FDEEF6',
        100: '#FBDCEB',
        200: '#F8B7D7',
        300: '#F492C2',
        400: '#F06DAE',
        500: '#EC4899',
        600: '#E4187D',
        700: '#B11261',
        800: '#7F0D45',
        900: '#4C0829'
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
      },     'secondary': {
        DEFAULT: '#6366F1',
        50: '#FFFFFF',
        100: '#F9F9FE',
        200: '#D3D4FB',
        300: '#AEAFF8',
        400: '#888BF4',
        500: '#6366F1',
        600: '#3034EC',
        700: '#1317D1',
        800: '#0E119E',
        900: '#0A0C6A'
      }
      // To change these, use https://www.tailwindshades.com/ with https://tailwindcss.com/docs/customizing-colors or create your own custom colors.

      }, 

      lineHeight: {
        'extra-loose': '2.5',
        '12': '3rem',
      },

    },
  },
  variants: {
    typography: ["dark"],
  },
  plugins: [require("@tailwindcss/typography")],
};
