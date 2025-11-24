/** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#FFD700',
          secondary: '#FF0000',
          dark: {
            DEFAULT: '#2B2B2B',
            card: '#333333',
            border: '#444444',
          },
        },
      },
    },
    plugins: [],
  }