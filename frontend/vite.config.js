import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // Ensure this matches your deployment setup
  build: {
    outDir: 'dist',
  },
});
