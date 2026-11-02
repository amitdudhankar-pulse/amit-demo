/** @type {import('tailwindcss').Config} */

const { colors } = require("./style_constants");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      rokkitt: ["Rokkitt", "sans-serif"],
      inter: ["Inter", "sans-serif"],
      quicksand: ["Quicksand", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          light: colors.primaryLight,
          "light-extra": "#82c6cd",
          DEFAULT: colors.primary,
          dark: colors.primaryDark,
        },
        secondary: {
          DEFAULT: "#fb924c",
          light: "#fed7aa",
        },
        tertiary: {
          DEFAULT: colors.tertiary,
        },
        boundary: {
          light: "#e4e4e7",
          DEFAULT: "#a1a1aa",
        },
        button: {
          focus: "#e2e8f0",
        },
        text: {
          primary: {
            DEFAULT: colors.textPrimary,
            light: "#737373",
          },
        },
        bg: {
          primary: {
            DEFAULT: colors.bgPrimary,
            LIGHT: "#e5e7eb",
          },
        },
        // blbl: "#00ff0099",
      },
      boxShadow: {
        card: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        focusCard: "10px 10px 20px -12px rgb(0 0 0 / 0.70)",
        button: "3px 3px 10px 2px #0005",
        "compare-panel": "0px -5px 34px -9px rgb(0 0 0 / 0.50)",
      },
      scale: {
        focusCard: "1.02",
      },
      fontSize: {
        "4.5xl": ["2.5rem", "2.75rem"],
        p: ["1.2rem", "1.55rem"],
        lg: ["1.125rem", "1.3rem"],
      },
      textColor: {
        primary: colors.textPrimary,
        "app-primary": colors.primary,
        "app-primary-dark": colors.primaryDark,
        "app-secondary": colors.secondary,
        star: colors.star,
      },
      spacing: {
        16: "4.5rem",
        "default-vertical-gap": "5rem",
        "default-horizontal-gap": "2rem",
        "content-width": "1380px",
        "2/10": "20%",
        "2.5/10": "25%",
        "2.9/10": "29%",
        "3/10": "33%",
        "5/10": "50%",
        "7/10": "70%",
        "7.5/10": "75%",
        "8/10": "80%",
        "9/10": "90%",
        "9.5/10": "95%",
      },
    },
    keyframes: {
      "slide-down": {
        "0%": { transform: "translateY(-100%)" },
        "100%": { transform: "translateY(0)" },
      },
      "slide-up": {
        "0%": { transform: "translateY(0)" },
        "100%": { transform: "translateY(-100%)" },
      },
      "card-heartbeat": {
        "0%": { filter: "grayscale(0)" },
        "50%": { filter: "grayscale(1)" },
        "100%": { filter: "grayscale(0)" },
      },
      "bg-translate": {
        "0%": { transform: "translateX(0)" },
        "50%": { transform: "translateX(100%)" },
        "100%": { transform: "translateX(0)" },
      },

      float: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-10px)" },
      },

      // TrustedBySlider: the track holds the logos twice, so -50% is one full loop
      marquee: {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-50%)" },
      },
    },
    animation: {
      "slide-down": "slide-down 0.15s ease-out forwards",
      "slide-up": "slide-up 0.15s ease-out forwards",
      "card-heartbeat": "card-heartbeat 3s ease-out forwards infinite",
      float: "float 3s ease-in-out infinite",
      "bg-translate": "bg-translate 10s ease-in-out infinite",
      marquee: "marquee 30s linear infinite",
    },
    variants: {
      extend: {
        animation: ["motion-safe"],
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    // require("tailwindcss-debug-screens"),
    // 👇 ADD THIS
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none" /* IE & Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none" /* Chrome, Safari */,
        },
      });
    },
  ],
};
