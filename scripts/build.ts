import Bun from "bun";
import { build } from "vite";
import { manifest } from "./manifest";
import { minifyJs } from "./minify";
import { webExtBuild } from "./web-ext";

const browsers: browsers = ["chrome", "firefox"];

browsers.map((browser) =>
  build({
    mode: browser,
    build: {
      outDir: `../dist/${browser}`,
    },
  }).then(() => {
    Promise.all([
      manifest(browser).then((manifest) => {
        Bun.write(
          Bun.file(`dist/${browser}/manifest.json`),
          JSON.stringify(manifest)
        );
      }),

      minifyJs(browser).then(() => {
        webExtBuild(browser);
      }),
    ]);
  })
);
