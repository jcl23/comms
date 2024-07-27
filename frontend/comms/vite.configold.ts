import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, '../../../../../shared/'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/instructions': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/throws': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true
      }
    }
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
