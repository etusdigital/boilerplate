const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,ts}"],
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.teste': {
          '@apply bg-black': {}
        },
      })
    })
  ],
};