/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this path matches your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")], // Ensure this is correctly added
};
