const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.{html,js,jsx,ts,tsx}',
    './content/**/*.{md,mdx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './assets/**/*.{css,js}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        
        // Aka - Japanese Red (Primary)
        primary: {
          DEFAULT: '#D05A6E',
          50: '#FCF7F8',
          100: '#F9EEF0',
          200: '#F2D0D6',
          300: '#EBB3BC',
          400: '#DD7889',
          500: '#D05A6E',
          600: '#BC4052',
          700: '#9B3543',
          800: '#7A2935',
          900: '#591E27',
          950: '#3D1419',
        },

        // Beni - Safflower Red (Primary Light - for dark mode)
        'primary-light': {
          DEFAULT: '#E83015',
          50: '#FDE9E5',
          100: '#FBD3CC',
          200: '#F7A799',
          300: '#F27B66',
          400: '#EE4F33',
          500: '#E83015',
          600: '#BC2410',
          700: '#8F1B0C',
          800: '#631308',
          900: '#360A04',
          950: '#1F0602',
        },

        // Enhanced Neutral with better contrast
        neutral: {
          DEFAULT: '#5C6272',
          50: '#FCFCFD',
          100: '#F0F1F4',
          200: '#E5E7ED',
          300: '#CED1DB',
          400: '#A6ABBF',
          500: '#7C839D',
          600: '#5C6272',
          700: '#474C5A',
          800: '#333742',
          900: '#21232A',
          950: '#15161B',
        },

        // Sumi - Japanese Black (Dark Theme)
        dark: {
          DEFAULT: '#1A1A1A',
          50: '#E6E6E6',
          100: '#CCCCCC',
          200: '#999999',
          300: '#666666',
          400: '#333333',
          500: '#1A1A1A',
          600: '#171717',
          700: '#141414',
          800: '#101010',
          900: '#0D0D0D',
          950: '#080808',
        },

        // Nando - Dark Navy (Secondary)
        secondary: {
          DEFAULT: '#192F60',
          50: '#E8ECF5',
          100: '#D1D9EB',
          200: '#A3B3D7',
          300: '#758EC3',
          400: '#4768AF',
          500: '#2F4780',
          600: '#192F60',
          700: '#142751',
          800: '#0F1F42',
          900: '#0A1732',
          950: '#051023',
        },
        
        // Additional Japanese colors
        shu: {
          DEFAULT: '#BC002D',
          light: '#E60033',
          dark: '#8C0023',
        },
        kurenai: {
          DEFAULT: '#CB1B45',
          light: '#DB3D61',
          dark: '#A7152D',
        },
        enji: {
          DEFAULT: '#B94047',
          light: '#CF5D63',
          dark: '#9A3239',
        },
        shironeri: {
          DEFAULT: '#FCFAF2',
        },
        kinari: {
          DEFAULT: '#F8F4E6',
        },
      },

      fontFamily: {
        sans: ['Noto Sans JP', 'Inter var', ...defaultTheme.fontFamily.sans],
        serif: ['Noto Serif JP', ...defaultTheme.fontFamily.serif],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },

      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.neutral.800'),
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.800'),
              },
            },
            h1: {
              color: theme('colors.primary.900'),
              fontFamily: theme('fontFamily.serif'),
            },
            h2: {
              color: theme('colors.primary.800'),
              fontFamily: theme('fontFamily.serif'),
            },
            h3: {
              color: theme('colors.primary.700'),
              fontFamily: theme('fontFamily.serif'),
            },
            h4: {
              color: theme('colors.primary.600'),
              fontFamily: theme('fontFamily.serif'),
            },
            strong: {
              color: theme('colors.primary.900'),
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.300'),
              color: theme('colors.neutral.700'),
              fontStyle: 'normal',
              fontFamily: theme('fontFamily.serif'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.neutral.100'),
            a: {
              color: theme('colors.primary-light.500'),
              '&:hover': {
                color: theme('colors.primary-light.300'),
              },
            },
            h1: {
              color: theme('colors.primary-light.300'),
              fontFamily: theme('fontFamily.serif'),
            },
            h2: {
              color: theme('colors.primary-light.300'),
              fontFamily: theme('fontFamily.serif'),
            },
            h3: {
              color: theme('colors.primary-light.400'),
              fontFamily: theme('fontFamily.serif'),
            },
            h4: {
              color: theme('colors.primary-light.400'),
              fontFamily: theme('fontFamily.serif'),
            },
            strong: {
              color: theme('colors.primary-light.200'),
            },
            blockquote: {
              borderLeftColor: theme('colors.primary-light.700'),
              color: theme('colors.neutral.200'),
              fontStyle: 'normal',
              fontFamily: theme('fontFamily.serif'),
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

      // Japanese-inspired design elements
      borderRadius: {
        'hanko': '50%',
        'wabi-sabi': '2px 4px 3px 5px',
      },
      
      boxShadow: {
        'hanko': '0 2px 4px rgba(0, 0, 0, 0.2)',
        'inkan': '2px 2px 0 rgba(0, 0, 0, 0.2)',
      },
      
      backgroundImage: {
        'washi': "url('/assets/images/patterns/washi-texture.webp')",
        'seigaiha': "url('/assets/images/patterns/seigaiha.svg')",
        'asanoha': "url('/assets/images/patterns/asanoha.svg')",
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
