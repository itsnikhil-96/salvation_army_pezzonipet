import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',  // Ensure this matches your output directory
    rollupOptions: {
      input: 'src/main.jsx',  // Ensure this matches your entry point
    },
  },
  base: '/',  // Ensure this matches your deployment setup
});
