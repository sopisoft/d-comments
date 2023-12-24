import fs from "fs";
import { build } from "vite";

const browsers = ["chrome", "firefox"] as const;

Promise.all(
  browsers.map((browser) =>
    build({
      mode: browser,
      build: {
        outDir: `dist/${browser}`,
      },
    }).then(() => {
      makeManifestJson(browser);
    }),
  ),
);

/**
 * manifest.json を chrome, firefox 用にそれぞれ生成する
 */
function makeManifestJson(browser: (typeof browsers)[number]) {
  const base = {
    manifest_version: 3,
    name: "__MSG_name__",
    description: "__MSG_description__",
    default_locale: "ja",
    version: process.env.npm_package_version,
    icons: {
      16: "icons/16.png",
      32: "icons/32.png",
      48: "icons/48.png",
      128: "icons/128.png",
      256: "icons/256.png",
    },
    action: {
      default_popup: "popup.html",
    },
    options_page: "options.html",
    background: {},
    content_scripts: [
      {
        js: ["d_comments.js"],
        matches: ["*://animestore.docomo.ne.jp/*"],
        run_at: "document_start",
        all_frames: true,
      },
    ],
    web_accessible_resources: [
      {
        matches: ["*://animestore.docomo.ne.jp/*"],
        resources: fs
          .readdirSync(`dist/${browser}/js`)
          .filter(
            (file: string) =>
              ![
                "popup.js",
                "options.js",
                "how_to_use.js",
                "background.js",
              ].includes(file),
          )
          .map((file: string) => `js/${file}`),
      },
    ],
    permissions: ["cookies", "storage", "tabs"],
    host_permissions: [
      "*://animestore.docomo.ne.jp/*",
      "*://*.nicovideo.jp/*",
      "*://nvcomment.nicovideo.jp/*",
      "*://nvapi.nicovideo.jp/v1/users/*",
      "*://public.api.nicovideo.jp/v1/channel/channelapp/channels/*",
      "*://api.search.nicovideo.jp/*",
    ],
  };
  const manifest = {
    ...base,
    background:
      browser === "chrome"
        ? {
            service_worker: "js/background.js",
            type: "module",
          }
        : {
            scripts: ["background.js"],
          },
    ...(browser === "firefox"
      ? {
          browser_specific_settings: {
            gecko: {
              id: "{7817f7db-9b81-4857-8e67-d5c32aa6b52e}",
            },
          },
        }
      : {}),
  };
  fs.writeFileSync(`dist/${browser}/manifest.json`, JSON.stringify(manifest));
}
