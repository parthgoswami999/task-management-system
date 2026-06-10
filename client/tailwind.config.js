/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7f5',
          100: '#dce7df',
          200: '#bed2c4',
          300: '#95b4a0',
          400: '#678d72',
          500: '#4b7158',
          600: '#385744',
          700: '#2d4637',
          800: '#25382d',
          900: '#1e2e25'
        },
        accent: {
          500: '#f97316',
          600: '#ea580c'
        }
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.18)'
      }
    }
  },
  plugins: []
};
