import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import mkcert from 'vite-plugin-mkcert'
import { basePath } from './src/lib/Util/BasePath.ts'

// https://vitejs.dev/config/
export default defineConfig({
  

  base: basePath.base + "/",
    server: {
      proxy: {
        '/dnxp-api': {
            target: "http://localhost:5000/",
            changeOrigin: true,
             configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
          }
      },
  },

    plugins: [mkcert(), svelte(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,
    selfDestroying: true,
    pwaAssets: {

      disabled: false,
      config: true,
    },

    manifest: {
      name: 'DuuniExpo Passi',
      short_name: 'DNXP',
      description: 'Inspiroidu. Verkostoidu. Menesty.',
      theme_color: '#000000',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico,jpg,jpeg}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },

  })],
})
