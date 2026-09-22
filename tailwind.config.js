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
          950: '#060B18',
          900: '#0B132B',
          850: '#0F1A36',
          800: '#142145',
          750: '#1A2C5B',
          700: '#1C3168',
          600: '#2A4387',
        },
        slate: {
          850: '#151E2E',
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
