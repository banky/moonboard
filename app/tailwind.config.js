/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "hsla(217, 91%, 60%, 1)",
        green: "hsla(142, 69%, 58%, 1)",
        background: "hsla(0, 0%, 96%, 1)",
      },
    },
  },
  plugins: [],
};
