// import webExt from "web-ext";
import fs from "fs";
import path, { resolve } from "path";
import Bun from "bun";

export async function webExtBuild(browser: browsers[number]) {
  const sourceDir = `dist/${browser}/`;
  // webExt.cmd.build({
  //   sourceDir: sourceDir,
  //   overwriteDest: true,
  //   filename: browser,
  // });

  Bun.spawn(
    ["bunx", "web-ext", "build", "--source-dir", sourceDir, "--overwrite-dest"],
    {
      onExit: () => {
        const folder = path.join(process.cwd(), "web-ext-artifacts");
        const files = fs.readdirSync(folder).map((file) => {
          return path.join(folder, file);
        });
        const zip = files.find((file) => {
          return file.endsWith(".zip");
        });
        const new_path = resolve(`${process.cwd()}/dist/`, `${browser}.zip`);
        zip && fs.renameSync(zip, new_path);
        fs.rmdirSync("web-ext-artifacts", { recursive: true });
      },
    }
  );
}
