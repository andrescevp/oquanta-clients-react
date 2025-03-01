/** @type {import('tailwindcss').Config} */
const tailwindContentPlaceholder = require('tailwind-content-placeholder');
module.exports = {
  // darkMode: 'media',
  darkMode: ["class", "class"],
  safelist: [
    "w-fit",
    "h-fit",
    "space-*",
    "p-*",
    "m-*",
    "cp-*",
    "flex",
    "flex-row",
    "flex-col",
    "md:flex-row",
    "md:flex-col",
    "grid",
    "grid-*",
    "bg-pumpink-orange-300",
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
    require("tailwindcss-animate"),
    tailwindContentPlaceholder({
      borderRadius: 0,
			width: 100,
      placeholders: {
        'report-filters': {
          height: 3, // the height of the container in em
          rows: [ // This class will have 4 rows:
            [20, 20, 60], // A 100% width row
          ]
        },
        'report-chart': {
          height: 10, // the height of the container in em
          rows: [ // This class will have 4 rows:
            [100], // A 100% width row
          ]
        },
        'paragraph': {
          height: 4, // the height of the container in em
          rows: [ // This class will have 4 rows:
            [100], // A 100% width row
            [100], // Another 100% width row
            [40], // A 40% width row
            [] // And an empty row, to create separation
          ]
        },
        'chart': {
          height: 10, // the height of the container in em
          rows: [ // This class will have 4 rows:
            [100], // A 100% width row
            [100], // Another 100% width row
            [40], // A 40% width row
            [] // And an empty row, to create separation
          ]
        },
				'line-1': {
					height: 1, // the height of the container in em
					rows: [ // This class will have 4 rows:
						[100], // A 100% width row
					]
				},
				'line-2': {
					height: 2, // the height of the container in em
					rows: [ // This class will have 4 rows:
						[100], // A 100% width row
					]
				},
				'line-3': {
					height: 3, // the height of the container in em
					rows: [ // This class will have 4 rows:
						[100], // A 100% width row
					]
				},
				'line-4': {
					height: 4, // the height of the container in em
					rows: [ // This class will have 4 rows:
						[100], // A 100% width row
					]
				},
				'line-5': {
					height: 5, // the height of the container in em
					rows: [ // This class will have 4 rows:
						[100], // A 100% width row
					]
				},
        'element-editor-header': {
          height: 3, // the height of the container in em
          rows: [ // This class will have 4 rows:
            [8,10,20,65], // A 100% width row
          ]
        },
      }
    }),
  ],
}

