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
    const proc = Bun.spawn(cmd, {
      stdout: "inherit",
      onExit: async () => {
        console.log(await new Response(proc.stdout).text());
        resolve();
      },
    });
  });
}

const tsc = make_proc(["bunx", "--bun", "tsc"]);
const fmt = make_proc(["bun", "run", "format"]);
const lint = make_proc(["bun", "run", "lint"]);

Promise.all([fs.rmdirSync("dist", { recursive: true }), tsc, fmt, lint]).then(
  () => {
    build({
      mode: "chrome",
      build: {
        outDir: `../dist/${"chrome"}`,
      },
    })
      // .then(async () => {
      //   await minifyJs("chrome");
      // })
      .then(async () => {
        await make_proc(["cp", "-r", "dist/chrome", "dist/firefox"]);
      })
      .then(() => {
        browsers.map((browser) => {
          Promise.all([
            manifest(browser).then((manifest) => {
              Bun.write(
                Bun.file(`dist/${browser}/manifest.json`),
                JSON.stringify(manifest)
              );
            }),
            Bun.write(
              Bun.file(`dist/${browser}/meta.json`),
              JSON.stringify({
                updated: new Date().toISOString(),
              })
            ),
          ]).then(() => {
            webExtBuild(browser);
          });
        });
      });
  }
);
