/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b3dff',
        secondary: '#00017a',
        accent: '#ff5c0b',
      },
      fontFamily: {
        heading: ['"Atkinson Hyperlegible Next"', 'sans-serif'],
        body: ['"Inclusive Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
