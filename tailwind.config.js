/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,scss}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Заменить 'CustomFont' на твой кастомный шрифт
        serif: ['Roboto','zaychek', 'serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
