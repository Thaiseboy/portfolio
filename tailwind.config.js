/** @type {import('tailwindcss').Config} */

// Theme colours are CSS variables (see tailwind.css) so they flip with data-theme.
const themed = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      // Getdeveloper brand colours (logo package "rood").
      colors: {
        accent: {
          DEFAULT: themed("accent"),
          hover: themed("accent-hover"),
          subtle: themed("accent-subtle"),
          light: "#F87171",
        },
        "on-accent": themed("on-accent"),
        ink: themed("ink"),
        paper: themed("paper"),
        surface: themed("surface"),
        grey: {
          DEFAULT: themed("grey"),
          light: themed("grey-light"),
        },
        // Always dark, in both themes (portrait card, footer, dark project cards).
        night: "#0E1116",
      },

      fontFamily: {
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },

      // Hard offset shadows are the core of the brutalist look.
      boxShadow: {
        brutal: "6px 6px 0 0 rgb(var(--c-ink))",
        "brutal-sm": "3px 3px 0 0 rgb(var(--c-ink))",
        "brutal-lg": "10px 10px 0 0 rgb(var(--c-ink))",
        "brutal-accent": "6px 6px 0 0 rgb(var(--c-accent))",
      },

      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        skeletonPulse: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        marquee: "marquee 30s linear infinite",
        "skeleton-pulse": "skeletonPulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
