import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#FAF9F6',
        },
        // Gold palette — use `gold` not `gold-DEFAULT`
        gold: {
          DEFAULT: '#C9A227',
          light: '#E8C84A',
          dark: '#A07A10',
        },
        // Rose palette
        rose: {
          soft: '#F7E7E7',
          medium: '#E8C4C4',
        },
        // Text palette
        text: {
          DEFAULT: '#1F2937',
          muted: '#6B7280',
          light: '#9CA3AF',
        },
        // Dark mode surfaces
        dark: {
          bg: '#0F0F0F',
          surface: '#1A1A1A',
          card: '#242424',
          border: '#2E2E2E',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.8s ease-out',
        'fade-up':   'fadeUp 0.8s ease-out',
        'float':     'float 6s ease-in-out infinite',
        'shimmer':   'shimmer 2s linear infinite',
        'pulse-gold':'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 162, 39, 0.4)' },
          '50%':       { boxShadow: '0 0 0 15px rgba(201, 162, 39, 0)' },
        },
      },
      boxShadow: {
        'gold':      '0 4px 24px rgba(201, 162, 39, 0.2)',
        'gold-lg':   '0 8px 40px rgba(201, 162, 39, 0.3)',
        'card':      '0 2px 20px rgba(0, 0, 0, 0.06)',
        'card-hover':'0 8px 40px rgba(0, 0, 0, 0.12)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A227 0%, #E8C84A 50%, #A07A10 100%)',
        'gradient-rose': 'linear-gradient(135deg, #F7E7E7 0%, #E8C4C4 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(247,231,231,0.2) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
