import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',  // Ensure this matches your output directory
    rollupOptions: {
     input: 'index.html'
    },
  },
  base: '/',  // Ensure this matches your deployment setup
});
