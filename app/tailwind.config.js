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
    fontFamily: {
      headers: ["Playa", "sans-serif"],
    },
    extend: {
      colors: {
        blue: "hsla(217, 91%, 60%, 1)",
        "blue-1": "hsla(226, 76%, 80%, 1)",
        "blue-2": "hsla(224, 76%, 48%, 1)",
        green: "hsla(142, 69%, 58%, 1)",
        background: "hsla(0, 0%, 96%, 1)",
        "dark-blue": "hsla(215, 25%, 27%, 1)",
        "text-standard": "hsla(227, 13%, 14%, 1)",
        "text-low-contrast": "hsla(0, 0%, 63%, 1)",
        "primary-brand": "hsla(153, 96%, 32%, 1)",
        "secondary-brand": "hsla(153, 68%, 65%, 1)",
        outlines: "hsla(126, 3%, 10%, 1)",
        accent: "hsla(18, 97%, 64%, 1)",
        "secondary-light": "hsla(150, 67%, 93%, 1)",
      },
    },
    animation: {
      blink: "blink-keyframe 1s ease-in-out infinite",
    },
    keyframes: {
      "blink-keyframe": {
        "0%": { visibility: "visible" },
        "50%": { visibility: "hidden" },
      },
    },
  },
  plugins: [],
};
