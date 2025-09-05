/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Main brand colors
        vitimo: {
          50: '#f8f4ff',
          100: '#f0e6ff',
          200: '#e6d9ff',
          300: '#d1b3ff',
          400: '#b380ff',
          500: '#9966ff',
          600: '#6A0DAD', // Main purple
          700: '#4B0082', // Dark purple
          800: '#3d0066',
          900: '#2d004d',
          950: '#1a0029',
        },
        gold: {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fff4d1',
          300: '#ffe8a3',
          400: '#ffd966',
          500: '#FFD700', // Main gold
          600: '#e6c200',
          700: '#cc9900',
          800: '#b38600',
          900: '#996600',
        },
        // Dark theme colors
        dark: {
          primary: '#0f0f23',
          secondary: '#1a1a2e',
          tertiary: '#2a2a3e',
          quaternary: '#3a3a4e',
        },
        // Text colors
        text: {
          primary: '#ffffff',
          secondary: '#e0e0e0',
          muted: '#a0a0b0',
          accent: '#6A0DAD',
        }
      },
      fontFamily: {
        'fa': ['Vazirmatn', 'sans-serif'],
        'en': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'Vazirmatn', 'sans-serif'],
      },
      backgroundColor: {
        'primary': '#0f0f23',
        'secondary': '#1a1a2e',
        'tertiary': '#2a2a3e',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-custom': 'pulse 2s infinite',
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'purple': '0 10px 25px rgba(106, 13, 173, 0.4)',
        'purple-lg': '0 20px 40px rgba(106, 13, 173, 0.3)',
        'gold': '0 10px 25px rgba(255, 215, 0, 0.4)',
        'gold-lg': '0 20px 40px rgba(255, 215, 0, 0.3)',
        'dark': '0 10px 25px rgba(0, 0, 0, 0.5)',
        'glow-purple': '0 0 30px rgba(106, 13, 173, 0.6)',
        'glow-gold': '0 0 30px rgba(255, 215, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #6A0DAD 0%, #4B0082 100%)',
        'gradient-purple-light': 'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
};