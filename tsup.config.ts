import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts', 'src/cli.ts'],
  outDir: 'build',
  format: ['esm'],
  sourcemap: true,
  clean: true,
  banner: {
    js: `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);`,
  },
  noExternal: ['commander', 'fastest-levenshtein', 'ora'],
  external: ['axios', 'url', 'winston'],
  platform: 'node',
  target: 'es2022',
})
