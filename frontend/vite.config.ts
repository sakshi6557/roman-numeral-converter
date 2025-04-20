import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    server: {
      port: 8081,
      open: !isProduction,
    },
    base: '/',
    build: {
      minify: isProduction ? 'terser' : false,
      sourcemap: !isProduction,
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            'react-spectrum': ['@adobe/react-spectrum']
          }
        }
      }
    },
    logLevel: isProduction ? 'error' : 'info'
  }
})
