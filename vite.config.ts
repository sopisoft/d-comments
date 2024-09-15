import path, { resolve } from "path";
import url from "url";
import react from "@vitejs/plugin-react-swc";
import {  defineConfig } from "vite";
import { 
  plugin as markdownPlugin,
  Mode } from 'vite-plugin-markdown'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 

// https://ja.vitejs.dev/config/
export default defineConfig({
  root: "./src",
  base: "/",
  publicDir: "./raw",
  plugins: [react(), markdownPlugin({ mode: [Mode.HTML, Mode.TOC] })],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "esnext", 
    emptyOutDir: true,
    modulePreload: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src", "content_scripts", "index.ts"),
        background: resolve(__dirname, "src", "background.ts"),
        popup: resolve(__dirname, "src", "popup", "popup.html"),
        options: resolve(__dirname, "src", "options", "options.html"),
        how_to_use: resolve(__dirname, "src", "how_to_use", "how_to_use.html"),
      },
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[hash].js",
        assetFileNames: "assets/[ext]/[name].[ext]",
      },
    },
  },
});
