import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import { resolve } from "path";

const manifest = defineManifest({
  manifest_version: 3,
  name: "__MSG_name__",
  description: "__MSG_description__",
  default_locale: "ja",
  version: process.env.npm_package_version,
  author: "牛蒡",
  icons: {
    "16": "src/assets/icons/16.png",
    "32": "src/assets/icons/32.png",
    "48": "src/assets/icons/48.png",
    "128": "src/assets/icons/128.png",
    "256": "src/assets/icons/256.png",
  },
  action: {
    default_popup: "src/popup/popup.html",
  },
  options_page: "src/options/index.html",
  content_scripts: [
    {
      js: ["src/content_scripts/index.ts"],
      matches: [
        "*://animestore.docomo.ne.jp/*",
        "*://*.nicovideo.jp/watch/*",
        "*://*.nico.ms/watch/*",
      ],
      run_at: "document_start",
      all_frames: true,
    },
  ],
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  permissions: ["cookies", "storage", "tabs"],
  web_accessible_resources: [
    {
      resources: ["src/assets/fonts/BIZ_UDPGothic.ttf"],
      matches: ["https://animestore.docomo.ne.jp/*"],
    },
    {
      resources: ["src/assets/fonts/BIZ_UDPGothic-Bold.ttf"],
      matches: ["https://animestore.docomo.ne.jp/*"],
    },
  ],
  host_permissions: [
    "*://animestore.docomo.ne.jp/*",
    "*://*.nicovideo.jp/*",
    "*://nvcomment.nicovideo.jp/*",
    "*://nvapi.nicovideo.jp/v1/users/*",
    "*://public.api.nicovideo.jp/v1/channel/channelapp/channels/*",
    "*://api.search.nicovideo.jp/*",
  ],
});

// https://ja.vitejs.dev/config/
export default defineConfig({
  // [Root](https://ja.vitejs.dev/config/shared-options.html#root) を src にすると何故か HMR が効かない
  publicDir: "src/raw",
  plugins: [solidPlugin(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        use: resolve(__dirname, "src", "use", "index.html"),
      },
      output: {
        entryFileNames: "js/[hash].js",
        chunkFileNames: "js/[hash].js",
        assetFileNames: "assets/[hash].[ext]",
      },
    },
  },
});
