import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages sert le site sous /lejeudesrefscommunes/
// (repo oignonmetro/lejeudesrefscommunes). En dev, base = '/'.
const base = process.env.NODE_ENV === 'production' ? '/lejeudesrefscommunes/' : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Le jeu des refs communes',
        short_name: 'Refs communes',
        description:
          'Fais deviner un mot à ton complice avec vos souvenirs communs. Jeu de soirée hors-ligne.',
        lang: 'fr',
        dir: 'ltr',
        theme_color: '#3b4b5e',
        background_color: '#3b4b5e',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
