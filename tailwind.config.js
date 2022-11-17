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
        'top-gradient': 'linear-gradient(to bottom right, #0ea5e9 -60%, #171A21 40%)',
        'bottom-gradient': 'linear-gradient(to top left, #f43f5e -60%, #171A21 40%)',
        'retry-gradient': 'linear-gradient(120deg, #0ea5e9 -50%, #171A21 50%)',
        'end-gradient': 'linear-gradient(-60deg, #f43f5e -50%, #171A21 50%)',
      },
      animation: {
        'slide-left': 'slide 1s forwards',
        'fade-in': 'fade .5s forwards',
        'fade-out': 'fade 2s reverse'
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"]
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
      },
      boxShadow:{
        retry: "0px 6px 5px -4px #2563eb",
        retryHover: "0px 8px 7px -1px #2563eb",
        end: "0px 6px 5px -4px #f43f5e",
        endHover: "0px 8px 7px -1px #f43f5e",
        higherHover: "0px 15px 15px 7px #2563eb",
        lowerHover: "0px -15px 15px 7px #f43f5e"
      }
    },
  },
  plugins: [],
};
