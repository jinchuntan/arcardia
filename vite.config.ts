import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "node-fetch": "/src/shims/node-fetch.ts"
    }
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        welcome: resolve(__dirname, "welcome.html"),
        scan: resolve(__dirname, "scan.html")
      }
    }
  }
});
