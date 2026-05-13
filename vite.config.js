import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bio: resolve(__dirname, 'bio.html'),
        success: resolve(__dirname, 'success.html'),
      },
    },
  },
})
