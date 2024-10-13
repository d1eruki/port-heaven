/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['public/index.html', './src/**/*.{html,js,scss}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['zaychek', 'sans-serif'], // Заменить 'CustomFont' на твой кастомный шрифт
        serif: ['Roboto', 'serif'],
      },
    },
  },
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}