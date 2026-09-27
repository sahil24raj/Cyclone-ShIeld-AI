/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071A2B', // Main background
          900: '#0B2238', // Deep card/panel surface
          850: '#0E2C4A', // Secondary panel / header
          800: '#13395E', // Interactive card hover / container
          750: '#1A4975', // Borders & dividers
          700: '#225B91', // Subtle active state
          600: '#2E75B6', // Highlight accent
        },
        slate: {
          850: '#0F243A',
        },
        hazard: {
          critical: '#EF4444',
          high: '#F97316',
          moderate: '#EAB308',
          low: '#10B981',
          surge: '#8B5CF6',
          flood: '#06B6D4',
          wind: '#F43F5E',
          rain: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
