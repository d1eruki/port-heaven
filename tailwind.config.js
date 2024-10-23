/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{html,js,scss,css}'
  ],
  theme: {
    colors: {
      '[secondary-025]': 'hsla(0 0% 12% / .25)',
      '[black]': 'hsla(0 0% 0% / 1)',
    },
    extend: {
      gridTemplateColumns: {
        '[auto]': 'auto auto',
      },
      height: {
        '[100vh-64]': 'calc(100vh - 64px)',
      },
    },
  },
  plugins: [],
}