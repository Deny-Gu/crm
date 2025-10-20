import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/', // Настроим базовый путь для всех статичных ресурсов
  build: {
    outDir: 'dist', // Папка, куда Vite соберет статические файлы
  },
  plugins: [
    react(),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://crm-api-ttopolllo4ek.amvera.io',
        changeOrigin: true,
        secure: true, // оставить true; если самоподписанный сертификат — можно временно false
        // pathRewrite не требуется, путь совпадает
      },
    },
  },
})