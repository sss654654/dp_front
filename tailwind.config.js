/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003876',
        secondary: '#E8112D',
        background: '#F8F9FA',
      },
    },
  },
  plugins: [],
}
