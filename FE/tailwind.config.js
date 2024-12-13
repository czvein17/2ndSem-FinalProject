/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1DA1F2", // Example custom color
        secondary: "#F2F9FF",
        accent: "#657786",
        background: "#F4F6FF",
        foreground: "#F5F8FA",
      },
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
        // montserrat: ["Montserrat", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
