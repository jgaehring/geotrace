import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: [
      'farmos-map-geotrace',
    ],
  }
});
