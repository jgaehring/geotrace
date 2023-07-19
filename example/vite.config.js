import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      ignored: [
        '!**/node_modules/farmos-map-geotrace/**',
      ],
    },
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        geolocate: resolve(__dirname, 'geolocate.html'),
        geosimulate: resolve(__dirname, 'geosimulate.html'),
      },
    },
  },
});
