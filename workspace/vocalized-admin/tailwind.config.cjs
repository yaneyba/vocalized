/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A",
          light: "#1D2A4A",
          accent: "#2563EB"
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 20px 45px -22px rgba(15, 23, 42, 0.4)"
      }
    }
  },
  plugins: []
};

