import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sites } from '@openai/sites-vite-plugin'

export default defineConfig(({ mode }) => {
  if (mode === 'android') {
    const gradle = readFileSync(
      new URL('./android/app/build.gradle', import.meta.url),
      'utf8',
    )
    const version = gradle.match(
      /^\s*versionName\s+"(\d+\.\d+\.\d+)"\s*$/m,
    )?.[1]
    if (!version)
      throw new Error('Versão Android inválida em android/app/build.gradle.')
    return {
      plugins: [react()],
      build: { outDir: 'dist-android' },
      define: { __RANDDBD_ANDROID_VERSION__: JSON.stringify(version) },
    }
  }

  return {
    plugins: [react(), sites()],
    define: { __RANDDBD_ANDROID_VERSION__: 'null' },
  }
})
