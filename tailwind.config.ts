/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#FDF6F7",
          100: "#FBEAED",
          200: "#F7D5DC",
          300: "#F1B7C3",
          400: "#E78FA2",
        },
        brand: {
          50: "#FDF2F5",
          100: "#FBE4EB",
          200: "#F6C6D5",
          300: "#EFA3B9",
          400: "#E37497",
          500: "#D6336C",
          600: "#B02A5B",
          700: "#8E2349",
        },
        cocoa: {
          800: "#4A2436",
          900: "#3A1C2B",
        },
        cream: "#FFFBF7",
        nude: "#F5E6DA",
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(214, 51, 108, 0.18)",
        card: "0 6px 24px -8px rgba(74, 36, 54, 0.12)",
        float: "0 20px 60px -15px rgba(214, 51, 108, 0.28)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
    },
  },
  plugins: [],
};
