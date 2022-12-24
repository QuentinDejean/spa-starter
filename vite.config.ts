/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'
import { defineConfig } from 'vite'
import path from 'path'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: { https: true },
  plugins: [react(), splitVendorChunkPlugin(), mkcert()],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@test': path.resolve(__dirname, './src/test'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
