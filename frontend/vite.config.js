import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './');

  return {
    plugins: [react(), tailwindcss()],
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg'],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
        }
      }
    },
    preview: {
      allowedHosts: true
    }
  }
})