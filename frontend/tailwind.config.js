const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    flowbite.content()
  ],
  theme: {
    extend: {
      colors: {
        theme: '#b05288'
      }
    },
  },
  plugins: [
    flowbite.plugin()
  ],
}

