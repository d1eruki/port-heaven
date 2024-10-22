/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{html,js,scss}'
  ],
  theme: {
    colors: {
      '[secondary-025]': 'hsla(0, 0%, 12%, 0.25)',
    },
    extend: {
      gridTemplateColumns: {
        '[auto]': 'auto auto',
      }
    },
  },
  plugins: [],
}