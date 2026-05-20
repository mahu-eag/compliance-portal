import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/eu-ai-act-check/',
  build: {
    outDir: '../dist/eu-ai-act-check',
    emptyOutDir: true,
  },
})
