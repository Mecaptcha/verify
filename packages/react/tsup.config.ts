import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  // Externalize React and React DOM (peer dependencies)
  // Externalize Node.js built-in modules (they shouldn't be bundled for browser)
  external: [
    'react',
    'react-dom',
    'crypto',
    'http',
    'https',
    'http2',
    'url',
    'util',
    'zlib',
    'stream',
    'events',
    'buffer',
    'process',
    'fs',
    'path',
    'os',
    'net',
    'tls',
    'querystring',
    'punycode',
  ],
  // Bundle the SDK into the React package (don't externalize it)
  noExternal: ['@mecaptcha/verify-sdk'],
  // Ensure proper tree-shaking
  treeshake: true,
  // Source maps for debugging
  sourcemap: false,
  // Platform-specific builds for browser
  platform: 'browser',
  // Define Node.js globals for browser compatibility
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
});

