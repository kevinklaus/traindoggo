/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1638C6',
        secondary: '#00017a',
        accent: '#FF313C',
        highlight: '#FFB32B',
      },
      fontFamily: {
        heading: ['"Atkinson Hyperlegible Next"', 'sans-serif'],
        body: ['"Inclusive Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
