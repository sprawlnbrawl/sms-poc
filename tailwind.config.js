
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#3ca377',
          secondary: '#2c7a59',
          background: {
            light: '#f8f9fa',
            dark: '#121212',
          },
          text: {
            light: '#333333',
            dark: '#e0e0e0',
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
    plugins: [
    ],
  }