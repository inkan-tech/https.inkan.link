-const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.{html,js,jsx,ts,tsx}',
    './content/**/*.{md,mdx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        
        // Japanese Carmine (Primary)
        primary: {
          DEFAULT: '#9d2933',
          50: 'oklch(0.971 0.013 17.38)',
          100: 'oklch(0.936 0.032 17.717)',
          200: 'oklch(0.885 0.062 18.334)',
          300: 'oklch(0.808 0.114 19.571)',
          400: 'oklch(0.704 0.191 22.216)',
          500: 'oklch(0.637 0.237 25.331)',
          600: 'oklch(0.577 0.245 27.325)',
          700: 'oklch(0.505 0.213 27.518)',
          800: 'oklch(0.444 0.177 26.899)',
          900: 'oklch(0.396 0.141 25.723)',
          950: 'oklch(0.258 0.092 26.042)',
        },

        // Rosso Corsa (Primary Light)
        'primary-light': {
          DEFAULT: '#D90B0B',
          50: 'oklch(0.969 0.015 12.422)',
          100: 'oklch(0.941 0.03 12.58)',
          200: 'oklch(0.892 0.058 10.001)',
          300: 'oklch(0.81 0.117 11.638)',
          400: 'oklch(0.712 0.194 13.428)',
          500: 'oklch(0.645 0.246 16.439)',
          600: 'oklch(0.586 0.253 17.585)',
          700: 'oklch(0.514 0.222 16.935)',
          800: 'oklch(0.455 0.188 13.697)',
          900: 'oklch(0.41 0.159 10.272)',
          950: 'oklch(0.271 0.105 12.094)',
        },

        // Neutral
        neutral: {
          DEFAULT: '#6B7280',
          50: 'oklch(0.985 0.002 247.839)',
          100: 'oklch(0.967 0.003 264.542)',
          200: 'oklch(0.928 0.006 264.531)',
          300: 'oklch(0.872 0.01 258.338)',
          400: 'oklch(0.707 0.022 261.325)',
          500: 'oklch(0.551 0.027 264.364)',
          600: 'oklch(0.446 0.03 256.802)',
          700: 'oklch(0.373 0.034 259.733)',
          800: 'oklch(0.278 0.033 256.848)',
          900: 'oklch(0.21 0.034 264.665)',
          950: 'oklch(0.13 0.028 261.692)',
        },

        // Dark Theme Colors
        dark: {
          DEFAULT: '#212122',
          50: 'oklch(0.984 0.003 247.858)',
          100: 'oklch(0.968 0.007 247.896)',
          200: 'oklch(0.929 0.013 255.508)',
          300: 'oklch(0.869 0.022 252.894)',
          400: 'oklch(0.704 0.04 256.788)',
          500: 'oklch(0.554 0.046 257.417)',
          600: 'oklch(0.446 0.043 257.281)',
          700: 'oklch(0.372 0.044 257.287)',
          800: 'oklch(0.279 0.041 260.031)',
          900: 'oklch(0.208 0.042 265.755)',
          950: 'oklch(0.129 0.042 264.695)',
        },

        // Secondary (Black Theme)
        secondary: {
          DEFAULT: '#212122',
          50: 'oklch(0.984 0.003 247.858)',
          100: 'oklch(0.968 0.007 247.896)',
          200: 'oklch(0.929 0.013 255.508)',
          300: 'oklch(0.869 0.022 252.894)',
          400: 'oklch(0.704 0.04 256.788)',
          500: 'oklch(0.554 0.046 257.417)',
          600: 'oklch(0.446 0.043 257.281)',
          700: 'oklch(0.372 0.044 257.287)',
          800: 'oklch(0.279 0.041 260.031)',
          900: 'oklch(0.208 0.042 265.755)',
          950: 'oklch(0.129 0.042 264.695)',
        },
      },

      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },

      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.neutral.900'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.neutral.200'),
            a: {
              color: theme('colors.primary-light.500'),
              '&:hover': {
                color: theme('colors.primary-light.300'),
              },
            },
          },
        },
      }),

      lineHeight: {
        'extra-loose': '2.5',
        '12': '3rem',
      },

      spacing: {
        '9/16': '56.25%',
      },

      screens: {
        'xs': '475px',
        ...defaultTheme.screens,
      },
    },
  },

  variants: {
    typography: ['dark'],
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active'],
      textColor: ['active'],
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],

  future: {
    hoverOnlyWhenSupported: true,
  },
};