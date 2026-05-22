import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/nis-2/',
  build: {
    outDir: 'dist/nis-2',
    emptyOutDir: true,
  },
})
