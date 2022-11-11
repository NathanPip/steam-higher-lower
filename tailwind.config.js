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
      colors: {
        "steam" : "#171A21"
      },
      height: {
        "half": "50vh",
        "150": "40rem"
      },
      keyframes: {
        slide: {
        '0%': {transform: 'translateX(0)'},
        '100%': {transform: 'translateX(-50%)'},
        },
        fade: {
        '0%': {opacity: 0},
        '100%': {opacity: 1},
        }
      },
      backgroundImage: {
        'top-gradient': 'linear-gradient(to bottom, #091d3d, #171A21 25%)',
        'bottom-gradient': 'linear-gradient(to top, #3d0909, #171A21 25%)',
        'end-gradient': 'linear-gradient(-20deg, #3d0909, #171A21 30%)',
      },
      animation: {
        'slide-left': 'slide 1s forwards',
        'fade-in': 'fade 1s forwards',
        'fade-out': 'fade 2s reverse'
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"]
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
      }
    },
  },
  plugins: [],
};
