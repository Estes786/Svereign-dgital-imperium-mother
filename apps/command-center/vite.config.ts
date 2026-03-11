import pages from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return { build: { outDir: './dist', emptyOutDir: false } }
  }
  return {
    plugins: [
      pages(),
      devServer({ entry: 'src/index.tsx' })
    ],
    build: { outDir: 'dist' }
  }
})
