/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2F4FE0',
          50: '#F0F4FF',
          100: '#E1E9FF',
          500: '#2F4FE0',
          600: '#1D3EC7',
          700: '#1933A1',
        },
        accent: {
          blue: '#63B3ED',
          green: '#3AB795',
          orange: '#F97316',
          red: '#F56565',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};