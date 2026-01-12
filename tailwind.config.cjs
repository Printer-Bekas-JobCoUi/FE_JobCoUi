/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      colors: {
        // Modern vibrant color scheme
        primary: 'rgb(102 126 234)',      // Royal Blue
        secondary: 'rgb(118 75 162)',     // Purple
        accent: 'rgb(245 87 108)',        // Rose/Pink
        cyan: 'rgb(56 249 215)',          // Cyan
        success: 'rgb(67 233 123)',       // Green
        
        // Dark backgrounds
        'bg-primary': 'rgb(15 15 35)',
        'bg-secondary': 'rgb(26 26 46)',
        'bg-tertiary': 'rgb(31 31 51)',
        
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: 'rgb(102 126 234)',
          900: 'rgb(118 75 162)'
        }
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 2px 8px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.08)',
        'glow': '0 4px 14px -3px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 6px 20px -3px rgba(99, 102, 241, 0.5)',
        'glow-primary': '0 0 20px rgba(102, 126, 234, 0.4)',
        'glow-accent': '0 0 20px rgba(245, 87, 108, 0.4)',
        'glow-cyan': '0 0 20px rgba(56, 249, 215, 0.4)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient': 'gradientShift 15s ease infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.4s ease-out'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, rgb(99 102 241) 0%, rgb(139 92 246) 100%)',
        'gradient-accent': 'linear-gradient(135deg, rgb(139 92 246) 0%, rgb(236 72 153) 100%)'
      }
    }
  },
  plugins: []
}
