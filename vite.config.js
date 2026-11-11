import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sites } from '@openai/sites-vite-plugin'

export default defineConfig(({ mode }) => {
  if (mode === 'android') {
    return {
      plugins: [react()],
      build: { outDir: 'dist-android' },
    }
  }

  return { plugins: [react(), sites()] }
})
