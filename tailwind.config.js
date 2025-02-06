/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,scss,vue}'
  ],
  theme: {
    extend: {
      colors: {
        'secondary-025': 'hsla(0, 0%, 12%, 0.25)',
        'black': 'hsla(0, 0%, 0%, 1)',
      },
      height: {
        '100vh-64': 'calc(100vh - 64px)',
      }
    },
  },
  plugins: [],
}
