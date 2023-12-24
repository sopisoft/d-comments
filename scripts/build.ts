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
    manifest_version: undefined,
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
    options_ui: {
      page: "options.html",
    },
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
  };

  const manifest = {
    ...base,
    manifest_version: browser === "chrome" ? 3 : 2,
    background:
      browser === "chrome"
        ? {
            service_worker: "js/background.js",
            type: "module",
          }
        : {
            scripts: ["background.js"],
            type: "module",
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
    ...(browser === "chrome"
      ? {
          action: {
            default_popup: "popup.html",
            default_title: process.env.npm_package_name,
          },
          options_page: "options.html",
          host_permissions: [
            "*://*.nicovideo.jp/*",
            "*://animestore.docomo.ne.jp/*",
            "*://nvcomment.nicovideo.jp/*",
            "*://nvapi.nicovideo.jp/v1/users/*",
            "*://public.api.nicovideo.jp/v1/channel/channelapp/channels/*",
            "*://api.search.nicovideo.jp/*",
          ],
        }
      : {
          browser_action: {
            default_title: process.env.npm_package_name,
            default_popup: "popup.html",
          },
          web_accessible_resources: ["*"],
          permissions: [
            ...base.permissions,
            "https://*.nicovideo.jp/*",
            "https://animestore.docomo.ne.jp/*",
            "https://nvcomment.nicovideo.jp/*",
            "https://nvapi.nicovideo.jp/v1/users/*",
            "https://public.api.nicovideo.jp/v1/channel/channelapp/channels/*",
            "https://api.search.nicovideo.jp/*",
          ],
        }),
  };
  fs.writeFileSync(`dist/${browser}/manifest.json`, JSON.stringify(manifest));
}
