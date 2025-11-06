import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // This tells Vite not to bundle these packages, as they are provided
      // by the importmap in index.html for the browser.
      external: [
        'react',
        'react-dom/client',
        'react/jsx-runtime'
      ]
    }
  }
});
