import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['template.xlsx'],
      manifest: {
        name: 'Overtime Claim Sheet',
        short_name: 'Overtime',
        description: 'Log overtime and download your Synnovis claim sheet',
        theme_color: '#123a67',
        background_color: '#f4f7fb',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,xlsx,svg,woff2}'],
      },
    }),
  ],
});
