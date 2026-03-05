import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure the build process handles the single-page application routing correctly
  base: './',
  build: {
    outDir: 'dist',
    // This helps debug build failures by providing more information if a file is missing
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  }
})