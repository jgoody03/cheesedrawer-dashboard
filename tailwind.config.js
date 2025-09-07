/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cheese: { light: "#FFF7CC", gold: "#F5D565" },
        ink: "#111111",
        ash: { light: "#F3F4F6", mid: "#E5E7EB", dark: "#9CA3AF" }
      },
      boxShadow: {
        soft: "0 6px 20px rgba(17,17,17,0.06)"
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
