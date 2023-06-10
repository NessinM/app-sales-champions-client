import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  server: {
    port: 8080,
    open: "/",
  },
  plugins: [
    eslintPlugin({
      cache: true,
      fix: true,
      lintOnStart: true,
      failOnWarning: true,
    }),
    vue(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: [`@import "@/plugins/vuetify/sass/_variables.scss";`],
      },
    },
  },
  optimizeDeps: {
    exclude: ["vuetify"],
    entries: ["./src/**/*.vue"],
  },
});
