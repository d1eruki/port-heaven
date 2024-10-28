/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,scss}'
  ],
  theme: {
    colors: {
      '[secondary-025]': 'hsla(0 0% 12% / .25)',
      '[black]': 'hsla(0 0% 0% / 1)',
    },
    extend: {
      gridTemplateColumns: {
        '[auto-2]': 'auto auto',
        '[auto-3]': 'auto auto auto',
      },
      height: {
        '[100vh-64]': 'calc(100vh - 64px)',
      },
    },
  },
  plugins: [],
}