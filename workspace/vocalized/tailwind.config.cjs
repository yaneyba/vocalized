/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E40AF",
          dark: "#1E3A8A",
          light: "#3B82F6",
        },
        "surface-muted": "#F3F4F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 15px 45px -20px rgba(30, 64, 175, 0.35)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};
