/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/vue-tailwind-datepicker/**/*.js",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      borderColor: {
        ep: "var(--el-border-color)", // Use the custom CSS variable for border color
      },
      keyframes: {
        zoomInOut: {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.2)",
          },
        },
      },
      animation: {
        zoom: "zoomInOut 10s ease-in-out infinite alternate",
      },
      colors: {
        "vtd-primary": colors.blue, // Light mode Datepicker color
        "vtd-secondary": colors.gray, // Dark mode Datepicker color
        primary: {
          DEFAULT: "#2080f0",
          100: "#4098fc",
          200: "#1060c9",
          300: "#70c0e8",
          400: "#8acbec",
          500: "#66afd3",
        },
        dark: {
          DEFAULT: "#101014", // background color
          100: "#ffffffe6", // text
          200: "#ffffff17", // border
          300: "#18181c", // item
        },

        dt: {
          DEFAULT: "#969593", // text
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwindcss-animatecss")],
};
