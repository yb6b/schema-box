import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'

const makePath = url => fileURLToPath(new URL(url, import.meta.url))

export default defineConfig({
  test: {
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    root: makePath('./src'),
    globals: true,
    alias: {
      '@': makePath('./src'),
      'app': makePath('.'),
    },
  },
})
