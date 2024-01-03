import fs from "fs";
import Bun from "bun";
import { build } from "vite";
import { manifest } from "./manifest";
import { minifyJs } from "./minify";
import { webExtBuild } from "./web-ext";

const browsers: browsers = ["chrome", "firefox"];

process.env.NODE_ENV = "production";

Promise.all([
  fs.rmdirSync("dist", { recursive: true }),
  Bun.spawn(["bunx", "--bun", "tsc"]),
]);

const builds = browsers.map((browser) =>
  build({
    mode: browser,
    build: {
      outDir: `../dist/${browser}`,
    },
  })
);

Promise.all(builds).then(() => {
  browsers.map((browser) => {
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
  });
});
