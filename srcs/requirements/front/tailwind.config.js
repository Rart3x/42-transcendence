/** @type {import('tailwindcss').Config} */

const { default: daisyui } = require('daisyui');

module.exports = {
  content: ["./src/components/Daisy.vue"],
    daisyui: {
      themes: [{
          mytheme: {
            "primary": "#d6c046",
            "secondary": "#b7ddf7",
            "accent": "#f9e4a9",
            "neutral": "#19161d",
            "base-100": "#3a404a",
            "info": "#84a3e6",
            "success": "#29c2a1",
            "warning": "#b27b06",
            "error": "#f0285a",
          },
        },
      ],
    },
    plugins: [
      require('daisyui'),
    ],
}  