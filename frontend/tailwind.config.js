/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f0f',
        surface: '#1a1a1a',
        elevated: '#242424',
        border: '#2e2e2e',
        accent: '#00c17c',
        'accent-hover': '#00a86b',
        'accent-muted': '#00c17c1a',
        text: {
          primary: '#f5f5f5',
          secondary: '#a0a0a0',
          muted: '#606060',
        },
        danger: '#ff4d4d',
        warning: '#f5a623',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        btn: '10px',
        pill: '999px',
      },
      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '15px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
        '3xl': '36px',
      },
      boxShadow: {
        card: '0 0 0 1px #2e2e2e',
        glow: '0 0 20px #00c17c33',
      },
    },
  },
  plugins: [],
}