import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Сборка витрины для GitHub Pages: base под имя репозитория.
export default defineConfig({
  plugins: [vue()],
  base: '/ui-kit/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: { outDir: 'dist-demo' },
})
