import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  // Externalize React and React DOM (peer dependencies)
  external: ['react', 'react-dom'],
  // Bundle the SDK into the React package (don't externalize it)
  noExternal: ['@mecaptcha/verify-sdk'],
  // Ensure proper tree-shaking
  treeshake: true,
  // Source maps for debugging
  sourcemap: false,
});

