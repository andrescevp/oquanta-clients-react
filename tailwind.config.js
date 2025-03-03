/** @type {import('tailwindcss').Config} */
const tailwindContentPlaceholder = require('tailwind-content-placeholder');
const tailwindAnimate = require("tailwindcss-animate");


module.exports = {
  // darkMode: 'media',
  darkMode: "class",
  safelist: [
    "cp-*",
  ],
  content: [
    "./src/**/**/**/*.{js,ts,tsx,jsx}",
  ],
  theme: {
    extend: {
      animatedSettings: {
        animatedSpeed: '1000',
        animationDelaySpeed: '100'
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
        // ...any existing animations...
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', width: '0' },
          '100%': { opacity: '1', width: '100%' },
        },
        // ...any existing keyframes...
      },
      fontWeight: {
        hairline: '100',
        'extra-light': '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        'extra-bold': '800',
        black: '900'
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        dark: {
          '100': '#f5f5f5',
          '200': '#dddddd',
          '300': '#e0e0e0',
          '400': '#a9a9a9',
          '500': '#8d8d8d',
          '600': '#757575',
          '700': '#616161',
          '800': '#424242',
          '900': '#212121'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        black: {
          DEFAULT: '#1d1d1b',
          60: '#5b5a57',
          30: '#b8b6b2'
        },
        white: '#fbf8f3',
        'pure-white': '#ffffff',
        'iris-purple': {
          DEFAULT: '#5a33ee',
          60: '#876AEF',
          30: '#CBBDF1'
        },
        'pumpkin-orange': {
          DEFAULT: '#fd5304',
          60: '#fc8146',
          30: '#fbc6ab'
        },
        'lime-green': {
          DEFAULT: '#c0f03e',
          60: '#D0F270',
          30: '#E9F5BD'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      zIndex: {
        '100': '100',
        '1000': '1000',
        '2000': '2000'
      }
    }
  },
  plugins: [
    tailwindAnimate,
    tailwindContentPlaceholder({
      borderRadius: 0,
      width: 100,
      placeholders: {
        'paragraph': {
          height: 4, // the height of the container in em
          rows: [ // This class will have 4 rows:
            [100], // A 100% width row
            [100], // Another 100% width row
            [40], // A 40% width row
            [] // And an empty row, to create separation
          ]
        },
      }
    }),
  ],
}

