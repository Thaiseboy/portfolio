/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        secondary: '#FF0000',
        gold: '#FFD700',
        red: '#FF0000',
        dark: {
          DEFAULT: '#2B2B2B',
          card: '#333333',
          border: '#444444',
        },
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
      },

      spacing: {
        'xs': '0.25rem',    // 4px
        'sm': '0.5rem',     // 8px
        'md': '1rem',       // 16px
        'lg': '1.5rem',     // 24px
        'xl': '2rem',       // 32px
        'xxl': '3rem',      // 48px
      },

      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },

      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 25px rgba(0, 0, 0, 0.2)',
      },

      fontSize: {
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '2rem',      // 32px
      },

      transitionDuration: {
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
      },

      screens: {
        'xs': '576px',
        'sm': '576px',
        'md': '768px',
        'lg': '992px',
        'xl': '1200px',
      },

      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': {
            transform: 'translateY(30px)',
            opacity: '0'
          },
          'to': {
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        bounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        skeletonPulse: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-slow': 'fadeIn 0.6s ease-in-out',
        'fade-in-slower': 'fadeIn 1.2s ease-in-out',
        'fade-in-slowest': 'fadeIn 1.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'shine': 'shine 2s infinite',
        'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}