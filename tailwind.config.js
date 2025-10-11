/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        plate: ['"OCR A Std"', '"Courier New"', 'Courier', 'monospace'],
      },
      borderColor: {
        ep: "var(--el-border-color)", // Use the custom CSS variable for border color
      },
      backgroundColor: {
        primary: "var(--el-color-primary)", // Use the custom CSS variable
      },
      boxShadow: {
        primary: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px", // Add custom box-shadow
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwindcss-animatecss")],
};
