import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm neutrals — washi paper whites, concrete grays
        surface: {
          50: '#faf9f7',   // page background — warm off-white
          100: '#f5f3f0',  // card hover
          200: '#ebe8e4',  // borders
          300: '#dbd7d1',  // dividers
        },
        // Rich charcoals — not pure black
        ink: {
          900: '#1a1a1a',  // primary text
          700: '#3d3d3d',  // secondary text
          500: '#6b6b6b',  // tertiary
          400: '#8a8a8a',  // muted
          300: '#a8a8a8',  // placeholder
          200: '#c9c9c9',  // disabled
        },
        // Cool indigo accent — precise, architectural
        accent: {
          50: '#f0f1ff',
          100: '#e0e3ff',
          200: '#c7cbfe',
          300: '#a5a9fc',
          400: '#8185f7',
          500: '#6366f1',  // primary accent
          600: '#4f46e5',  // hover
          700: '#4338ca',  // active
          800: '#3730a3',
          900: '#312e81',
        },
        // Warm earth accent — terracotta for warmth
        warm: {
          50: '#fef7f0',
          100: '#fdecd8',
          200: '#fad5af',
          300: '#f5b77c',
          400: '#ef9148',
          500: '#ea7525',
          600: '#db5d1b',
          700: '#b64518',
        },
        // Status colors — muted, not screaming
        status: {
          green: '#3d9970',
          'green-light': '#ecfdf0',
          amber: '#c78d20',
          'amber-light': '#fef9ec',
          red: '#c0392b',
          'red-light': '#fef2f2',
        },
        // Legacy brand alias (for components still referencing it)
        brand: {
          50: '#f0f1ff',
          100: '#e0e3ff',
          200: '#c7cbfe',
          300: '#a5a9fc',
          400: '#8185f7',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        slate: {
          925: '#0c1222',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-lg': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '400' }],
        'display': ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '400' }],
        'heading': ['1.125rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'elevated': '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.5)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
export default config
