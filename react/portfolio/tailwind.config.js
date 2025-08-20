const {nextui} = require('@nextui-org/theme');
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
        // Light mode colors
        light: {
          background: '#ffffff',
          foreground: '#000000',
          primary: '#7C3AED',
          secondary: '#06B6D4',
          accent: '#F59E0B',
          muted: '#F3F4F6',
          border: '#E5E7EB',
          card: '#ffffff',
        },
        // Dark mode colors
        dark: {
          background: '#0a0a0a',
          foreground: '#ffffff',
          primary: '#8B5CF6',
          secondary: '#14B8A6',
          accent: '#F59E0B',
          muted: '#1F2937',
          border: '#374151',
          card: '#111111',
        }
      }
    },
  },
  plugins: [nextui()],
}