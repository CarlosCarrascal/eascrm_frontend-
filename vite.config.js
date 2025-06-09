import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // aquí el nombre exacto de tu repositorio con el guión al final
  base: '/eascrm_frontend-/',

  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  build: {
    outDir: 'dist',
  },
})
