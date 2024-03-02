import path, { resolve } from "path";
import url from "url";
import react from "@vitejs/plugin-react-swc";
import { type PluginOption, defineConfig } from "vite";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function markdown(): PluginOption {
  return {
    name: "markdown-transformer",
    transform(code: string, id: string) {
      if (id.slice(-3) === ".md") {
        return `export default ${JSON.stringify(code)};`;
      }
    },
  };
}

// https://ja.vitejs.dev/config/
export default defineConfig({
  root: "./src",
  base: "/",
  publicDir: "./raw",
  plugins: [react() as PluginOption, markdown()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "esnext",
    minify: false,
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
        format: "module",
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[hash].js",
        assetFileNames: "assets/[ext]/[name].[ext]",
      },
    },
  },
  optimizeDeps: {
    force: true,
  },
});
