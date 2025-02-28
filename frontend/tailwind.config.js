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
        theme: '#965f8f'
      }
    },
  },
  plugins: [
    flowbite.plugin()
  ],
}

