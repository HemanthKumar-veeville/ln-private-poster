/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryDark: "#16423C", // Dark green
        primary: "#6A9C89", // Medium green
        secondary: "#C4DAD2", // Light green
        lightest: "#E9EFEC", // Lightest shade
      },
    },
  },
  plugins: [],
};
