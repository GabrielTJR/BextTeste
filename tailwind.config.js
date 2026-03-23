/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#EFEFEF',
        dark: '#3C3F50',
        primary: '#0524DD',
        black: '#000000',
        'dark-light': '#4e5268',
        'primary-light': '#2d45f0',
        'primary-dark': '#0419a8',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
