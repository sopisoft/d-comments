import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));

const base = {
  name: pkg.displayName,
  short_name: pkg.name,
  description: pkg.description,
  version: pkg.version,
  author: pkg.author,
  icons: {
    16: "icons/Icon_small16.png",
    32: "icons/Icon_small32.png",
    48: "icons/Icon_small48.png",
    64: "icons/Icon_small64.png",
    128: "icons/Icon128.png",
    256: "icons/Icon256.png",
  },
  options_ui: {
    page: "options/options.html",
  },
  content_scripts: [
    {
      js: ["d_comments.js"],
      matches: ["*://animestore.docomo.ne.jp/*"],
      run_at: "document_start",
    },
  ],
  permissions: ["storage", "tabs"],
};

export async function manifest(browser: "chrome" | "firefox") {
  switch (browser) {
    case "chrome": {
      return {
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
            resources: ["*.js", "*.css"],
          },
        ],
        host_permissions: [
          "*://*.nicovideo.jp/*",
          "*://animestore.docomo.ne.jp/*",
        ],
      };
    }
    case "firefox": {
      return {
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
        ],
        developer: {
          name: pkg.author,
          url: pkg.repository.url,
        },
      };
    }
  }
}
