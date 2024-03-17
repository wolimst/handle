/// <reference types="vitest" />
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      includeAssets: ['resources/fonts/*.otf'],
      manifest: {
        name: '한들 - 모아쓰는 한글 워들',
        short_name: '한들',
        description:
          '모아쓰는 한글 워들. 한글 단어를 정해진 횟수 안에 맞춰보세요! 다양한 플레이 모드가 준비되어 있어요.',
        lang: 'ko',
        theme_color: '#292c34',
        background_color: '#292c34',
        icons: [
          {
            src: './resources/icons/icon-192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: './resources/icons/icon-512.png',
            type: 'image/png',
            sizes: '512x512',
          },
          {
            src: './resources/icons/icon-maskable-192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: './resources/icons/icon-maskable-512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
        start_url: './',
        scope: '.',
        display: 'standalone',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
  },
  test: {
    globals: true,
    deps: {
      optimizer: {
        web: {
          include: ['opentype.js'],
        },
      },
    },
    environment: 'jsdom',
    setupFiles: './vitest.setup.cjs',
    testTimeout: 20000,
  },
})
