/// <reference types="vitest" />
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
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
      inline: ['opentype.js'],
    },
    environment: 'jsdom',
    testTimeout: 20000,
  },
})
