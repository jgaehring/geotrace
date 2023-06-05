import { defineConfig } from "vite";

export default defineConfig({
  server: {
    watch: {
      ignored: [
        '!**/node_modules/farmos-map-geotrace/**'
      ],
    },
  },
  optimizeDeps: {
    exclude: [
      'farmos-map-geotrace',
    ],
  }
});
