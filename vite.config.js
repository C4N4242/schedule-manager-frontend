import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      // フロントエンドから /api へのリクエストをバックエンドの http://localhost:3000 にプロキシ
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
