import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      ignored: [
        '!**/node_modules/farmos-map-geotrace/**',
      ],
    },
  },
  optimizeDeps: {
    exclude: [
      // '@farmos.org/farmos-map',
      'farmos-map-geotrace',
    ],
  },
});
