/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Getdeveloper brand colours (logo package "rood").
      colors: {
        accent: {
          DEFAULT: '#DC2626',
          hover: '#B91C1C',
          active: '#991B1B',
          light: '#F87171',
          subtle: '#FDE8E8',
        },
        ink: {
          DEFAULT: '#0E1116',
          soft: '#161A21',
        },
        grey: {
          DEFAULT: '#4B5563',
          light: '#9CA3AF',
        },
        paper: {
          DEFAULT: '#F6F7F9',
          white: '#FFFFFF',
        },
      },

      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      // Hard offset shadows are the core of the brutalist look.
      boxShadow: {
        brutal: '6px 6px 0 0 #0E1116',
        'brutal-sm': '3px 3px 0 0 #0E1116',
        'brutal-lg': '10px 10px 0 0 #0E1116',
        'brutal-accent': '6px 6px 0 0 #DC2626',
      },

      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        skeletonPulse: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        marquee: 'marquee 30s linear infinite',
        'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
