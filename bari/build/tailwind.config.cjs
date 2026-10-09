/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['../index.html', '../assets/js/app.js'],
  theme: {
    extend: {
      fontSize: {
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
