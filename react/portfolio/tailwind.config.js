const { nextui } = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "media", // Use system preference
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|input|modal|popover).js"
  ],
  theme: {
    extend: {
      fontFamily: {
        TitilliumWebExtraLight: ["TitilliumWebExtraLight", "sans-serif"],
        TitilliumWebLight: ["TitilliumWebLight", "sans-serif"],
        TitilliumWebRegular: ["TitilliumWebRegular", "sans-serif"],
        TitilliumWebSemiBold: ["TitilliumWebSemiBold", "sans-serif"],
        TitilliumWebBold: ["TitilliumWebBold", "sans-serif"],
        TitilliumWebExtraBold: ["TitilliumWebExtraBold", "sans-serif"],
        TitilliumWebBlack: ["TitilliumWebBlack", "sans-serif"],
        TitilliumWebExtraBlack: ["TitilliumWebExtraBlack", "sans-serif"],
      },
      colors: {
        // Modern Palette
        light: {
          background: '#FAFAFA',
          surface: '#FFFFFF',
          foreground: '#18181B',
          primary: '#3B82F6', // Blue-500
          secondary: '#8B5CF6', // Violet-500
          accent: '#F472B6', // Pink-400
          muted: '#F4F4F5',
          border: '#E4E4E7',
        },
        dark: {
          background: '#09090B', // Zinc-950
          surface: '#18181B', // Zinc-900
          foreground: '#FAFAFA',
          primary: '#60A5FA', // Blue-400
          secondary: '#A78BFA', // Violet-400
          accent: '#F472B6', // Pink-400
          muted: '#27272A',
          border: '#27272A',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(24, 24, 27, 0.7)',
        }
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'blob': {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)'
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)'
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)'
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-20px)'
          }
        }
      }
    },
  },
  plugins: [nextui()],
}