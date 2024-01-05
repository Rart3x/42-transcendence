const { default: daisyui } = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/components/**/*.vue", "./node_modules/daisyui/dist/**/*.{js,css}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark", "night"],
  }
}

