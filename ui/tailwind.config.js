/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./App.jsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          pink: '#FF66C4',
          navy: '#05425C',
          periwinkle: '#94ACFF',
          purple: '#BD4AB5'
        }
      }
    },
  },
  plugins: [],
}
