/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{html,js,scss}'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '[auto]': 'auto auto',
      }
    },
  },
  plugins: [],
}