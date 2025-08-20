import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase the warning limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ['react', 'react-dom'],
          ui: ['@nextui-org/react', '@nextui-org/theme'],
          animations: ['framer-motion'],
          icons: ['react-icons', '@radix-ui/react-icons'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@nextui-org/react'],
  },
})
