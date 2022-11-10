/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Poppins", "sans-serif"]
    },
    extend: {
      keyframes: {
        slide: {
        '0%': {transform: 'translateX(0)'},
        '100%': {transform: 'translateX(-50%)'},
        }
      },
      backgroundImage: {
        'top-gradient': 'linear-gradient(to bottom, #091d3d, #000 25%)',
        'bottom-gradient': 'linear-gradient(to top, #3d0909, #000 25%)',
      },
      animation: {
        'slide-left': 'slide 1s forwards'
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"]
      }
    },
  },
  plugins: [],
};
