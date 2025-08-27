import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  outDir: 'build',
  format: ['esm'],
  sourcemap: true,
  clean: true,
  external: ['axios', 'url', 'winston'],
})
