/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slide: {
        '0%': {transform: 'translateX(0)'},
        '100%': {transform: 'translateX(-50%)'},
        }
      },
      animation: {
        'slide-left': 'slide 1s forwards'
      }
    },
  },
  plugins: [],
};
