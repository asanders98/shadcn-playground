/// <reference types="vitest/config" />
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Library build config. In the monorepo, consuming apps import @nxtpeople/ui
// directly from source (see package.json "exports"), which gives instant hot
// reload. This build exists for the "graduate to a published package" path and
// to verify the public API + tree-shaking story.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      // Don't bundle React or Radix into the library output.
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^@radix-ui\//,
      ],
    },
    // Preserve module structure so consuming bundlers can tree-shake.
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
