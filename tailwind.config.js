/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3d6a8a',
          dark: '#2f5570',
          light: '#eaf1f6',
        },
      },
    },
  },
  plugins: [],
};
