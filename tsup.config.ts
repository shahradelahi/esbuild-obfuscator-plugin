import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    dts: true,
    external: ['esbuild', 'javascript-obfuscator'],
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    target: 'esnext',
    outDir: 'dist',
  },
]);
