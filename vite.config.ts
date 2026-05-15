import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Same role as Next.js `basePath` for GitHub Pages project sites (`/<repo>/`). */
const GITHUB_PAGES_REPOSITORY = 'ticket-to-tail';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
