/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        honey: {
          50: "#fff9ed",
          100: "#fdf0ce",
          200: "#f7d88c",
          300: "#efbf57",
          400: "#dd9b2d",
          500: "#bb771a",
          600: "#965814",
          700: "#6f3f11",
          800: "#4b2b0d",
          900: "#291806"
        },
        bark: "#22160d",
        cream: "#fffaf0",
        sage: "#7d8d6a"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 80px rgba(68, 39, 8, 0.18)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top, rgba(255,255,255,0.4), transparent 32%), linear-gradient(135deg, rgba(239,191,87,0.14), rgba(34,22,13,0.06))"
      }
    }
  },
  plugins: []
};