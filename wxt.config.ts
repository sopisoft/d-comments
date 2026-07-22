import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'wxt';
import { markdownHtmlPlugin } from './scripts/markdownHtmlPlugin.ts';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// See https://wxt.dev/api/config.html
export default defineConfig({
  browser: 'firefox',
  webExt: {
    chromiumProfile: path.resolve('.wxt/chrome-profile'),
    keepProfileChanges: true,
  },
  manifest: ({ browser }) => ({
    name: pkg.displayName,
    short_name: pkg.name,
    author: pkg.author,
    icons: {
      16: '/icon/16.png',
      32: '/icon/32.png',
      48: '/icon/48.png',
      64: '/icon/64.png',
      128: '/icon/128.png',
      256: '/icon/256.png',
    },
    permissions: ['cookies', 'storage', 'tabs'],
    host_permissions: ['https://*.nicovideo.jp/*', 'https://animestore.docomo.ne.jp/*'],
    ...(browser === 'firefox'
      ? {
          browser_specific_settings: {
            gecko: {
              id: '{7817f7db-9b81-4857-8e67-d5c32aa6b52e}',
              data_collection_permissions: {
                required: ['websiteContent'],
              },
            },
          },
        }
      : {}),
  }),

  modules: ['@wxt-dev/module-react'],
  outDir: 'dist',
  publicDir: 'src/raw',
  srcDir: 'src',
  vite: () => ({
    plugins: [markdownHtmlPlugin()],
    optimizeDeps: {
      entries: ['src/entrypoints/**/*.html'],
    },
  }),
  hooks: {
    'vite:devServer:extendConfig': (config) => {
      config.server ??= {};
      config.server.watch = {
        ignored: ['**/.direnv/**', '**/dist/**', '**/.wxt/**'],
      };
    },
  },
});
