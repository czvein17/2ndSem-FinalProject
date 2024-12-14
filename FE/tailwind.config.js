/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        primary: "#1DA1F2",
        secondary: "#f6f5f8",
        accent: "",
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
