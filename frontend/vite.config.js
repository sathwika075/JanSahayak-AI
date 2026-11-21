// Vite configuration with React plugin and proxy to backend
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all API calls to the Node.js backend running on port 4000
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        // Keep the original path (e.g., /api/ai/chat)
        rewrite: (path) => path,
      },
    },
  },
});

