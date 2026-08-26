import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/TechLife/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssMinify: false,
  },
  server: {
    port: 5173,
    open: true,
  },
});
