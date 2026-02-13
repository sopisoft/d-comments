import fs from 'node:fs';
import { defineConfig } from 'wxt';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// See https://wxt.dev/api/config.html
export default defineConfig({
  browser: 'firefox',
  manifest: () => ({
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
  }),
  modules: ['@wxt-dev/module-react'],
  outDir: 'dist',
  publicDir: 'src/raw',
  react: {
    vite: {
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    },
  },
  srcDir: 'src',
});
