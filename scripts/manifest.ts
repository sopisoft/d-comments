import Bun from "bun";

const pkg = await Bun.file("package.json")
  .text()
  .then((text) => JSON.parse(text));

const base = {
  name: pkg.displayName,
  short_name: pkg.name,
  description: pkg.description,
  version: pkg.version,
  author: pkg.author,
  icons: {
    16: "icons/16.png",
    32: "icons/32.png",
    48: "icons/48.png",
    128: "icons/128.png",
    256: "icons/256.png",
  },
  options_ui: {
    page: "options/options.html",
  },
  background: {},
  content_scripts: [
    {
      js: ["d_comments.js"],
      matches: ["*://animestore.docomo.ne.jp/*"],
      run_at: "document_start",
    },
  ],
  web_accessible_resources: [],
  permissions: ["cookies", "storage", "tabs"],
};

/**
 * manifest.json を chrome, firefox 用にそれぞれ生成する
 */
export async function manifest(browser: browsers[number]) {
  let manifest = {};

  switch (browser) {
    case "chrome": {
      manifest = {
        ...base,
        manifest_version: 3,
        background: {
          service_worker: "js/background.js",
          type: "module",
        },
        action: {
          default_popup: "popup/popup.html",
          default_title: pkg.name,
        },
        options_page: "options/options.html",
        web_accessible_resources: [
          {
            matches: ["*://animestore.docomo.ne.jp/*"],
            resources: ["js/*.js", "assets/css/*.css"],
          },
        ],
        host_permissions: [
          "*://*.nicovideo.jp/*",
          "*://animestore.docomo.ne.jp/*",
          "*://nvcomment.nicovideo.jp/*",
          "*://nvapi.nicovideo.jp/v1/users/*",
          "*://public.api.nicovideo.jp/v1/channel/channelapp/channels/*",
          "*://api.search.nicovideo.jp/*",
        ],
      };
      break;
    }
    case "firefox": {
      manifest = {
        ...base,
        manifest_version: 2,
        background: {
          scripts: ["background.js"],
          type: "module",
        },
        browser_specific_settings: {
          gecko: {
            id: "{7817f7db-9b81-4857-8e67-d5c32aa6b52e}",
          },
        },
        browser_action: {
          default_popup: "popup/popup.html",
          default_title: pkg.name,
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
        developer: {
          name: pkg.author,
          url: pkg.repository.url,
        },
      };
      break;
    }
  }

  return manifest;
}
