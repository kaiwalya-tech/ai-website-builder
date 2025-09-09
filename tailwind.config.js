/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // ✅ Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#C25E3E',
          50: '#f7e6e1',
          100: '#ecc6b8',
          500: '#C25E3E',
          600: '#a64d2f',
          900: '#7a3722'
        },
        'secondary': {
          DEFAULT: '#708A63',
          500: '#708A63'
        },
        'accent': {
          DEFAULT: '#F5B749',
          500: '#F5B749'
        },
        'background': 'var(--background-color)',
        'text': 'var(--text-color)',
        'surface': 'var(--surface-color)',
      }
    },
  },
  plugins: [],
}