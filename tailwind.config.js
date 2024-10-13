/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,scss}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['zaychek', 'sans-serif'], // Заменить 'CustomFont' на твой кастомный шрифт
        serif: ['Roboto', 'serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
