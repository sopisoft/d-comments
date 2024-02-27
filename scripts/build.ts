import fs from "fs";
import Bun from "bun";
import { build } from "vite";
import { manifest } from "./manifest";
import { minifyJs } from "./minify";
import { webExtBuild } from "./web-ext";

const browsers: browsers = ["chrome", "firefox"];

process.env.NODE_ENV = "production";

function make_proc(cmd: string[]) {
  return new Promise<void>((resolve) => {
    const proc = Bun.spawn(["bunx", "--bun", ...cmd], {
      stdout: "inherit",
      onExit: async () => {
        console.log(await new Response(proc.stdout).text());
        resolve();
      },
    });
  });
}

const tsc = make_proc(["tsc"]);
const fmt = make_proc(["bun", "run", "format"]);
const lint = make_proc(["bun", "run", "lint"]);

Promise.all([fs.rmdirSync("dist", { recursive: true }), tsc, fmt, lint]).then(
  () => {
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

          // minifyJs(browser).then(() => {
          webExtBuild(browser),
          // }),

          Bun.write(
            Bun.file(`dist/${browser}/meta.json`),
            JSON.stringify({
              updated: new Date().toISOString(),
            })
          ),
        ]);
      });
    });
  }
);
