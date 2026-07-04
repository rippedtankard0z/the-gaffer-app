module.exports = {
  content: [
    './shared/app.js',
    './prod/index.html',
    './viewer/index.html',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#2563eb', 600: '#1d4ed8' },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          white: '#ffffff'
        },
        accent: {
          green: '#10b981',
          red: '#ef4444',
          blue: '#3b82f6'
        }
      },
      fontFamily: {
        sans: ['Sora', 'Space Grotesk', 'sans-serif'],
        display: ['Space Grotesk', 'Sora', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        float: '0 10px 40px -10px rgba(0,0,0,0.08)'
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out'
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  }
};
